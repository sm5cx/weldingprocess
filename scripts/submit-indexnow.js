#!/usr/bin/env node

/**
 * IndexNow + Search Engine Sitemap Submission Script
 * 
 * Submits weldingprocess.guide URLs to IndexNow API (Bing/Yandex instant indexing)
 * and pings Google/Bing sitemap endpoints for traditional crawling.
 * 
 * Usage:
 *   node submit-indexnow.js
 *   node submit-indexnow.js --sitemap-only
 *   node submit-indexnow.js --url="https://weldingprocess.guide/guides/mig-porosity-carbon-steel.html"
 * 
 * Requirements:
 *   npm install axios xml2js
 */

const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const crypto = require('crypto');

const SITE_DOMAIN = 'weldingprocess.guide';
const SITE_URL = `https://${SITE_DOMAIN}`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// IndexNow API endpoints
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

// Generate or use existing IndexNow API key
const INDEXNOW_KEY = generateIndexNowKey();

// Search engine sitemap ping endpoints
const SITEMAP_PING_ENDPOINTS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
];

function generateIndexNowKey() {
  // Generate a consistent key based on domain
  return crypto.createHash('md5').update(SITE_DOMAIN).digest('hex');
}

async function fetchSitemapUrls() {
  try {
    console.log(`📥 Fetching sitemap from ${SITEMAP_URL}...`);
    
    const response = await axios.get(SITEMAP_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'WeldingProcessGuide-IndexBot/1.0'
      }
    });
    
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    const urls = [];
    
    // Handle regular sitemap
    if (result.urlset && result.urlset.url) {
      result.urlset.url.forEach(entry => {
        if (entry.loc && entry.loc[0]) {
          urls.push(entry.loc[0]);
        }
      });
    }
    
    // Handle sitemap index
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      for (const sitemap of result.sitemapindex.sitemap) {
        if (sitemap.loc && sitemap.loc[0]) {
          const subUrls = await fetchSitemapUrls(sitemap.loc[0]);
          urls.push(...subUrls);
        }
      }
    }
    
    console.log(`✅ Found ${urls.length} URLs in sitemap`);
    return urls;
    
  } catch (error) {
    console.error(`❌ Failed to fetch sitemap: ${error.message}`);
    
    // Fallback to common URL patterns if sitemap fails
    console.log('🔄 Using fallback URL list...');
    return getFallbackUrls();
  }
}

function getFallbackUrls() {
  // Core pages that should always be submitted
  return [
    `${SITE_URL}/`,
    `${SITE_URL}/guides/`,
    `${SITE_URL}/guides/mig-porosity-carbon-steel.html`,
    `${SITE_URL}/guides/mig-porosity-aluminum.html`,
    `${SITE_URL}/guides/gas-science/shielding-gas-protection.html`,
    `${SITE_URL}/guides/process/mig-mag-welding-fundamentals.html`,
    `${SITE_URL}/products/corgon/`,
    `${SITE_URL}/products/cronigon/`,
    `${SITE_URL}/products/varigon/`,
    `${SITE_URL}/methodology.html`,
    `${SITE_URL}/about.html`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/llms-full.txt`
  ];
}

async function submitToIndexNow(urls) {
  if (!Array.isArray(urls)) {
    urls = [urls];
  }
  
  // IndexNow has a limit of 10,000 URLs per request, but we'll batch smaller for reliability
  const BATCH_SIZE = 100;
  const batches = [];
  
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`📤 Submitting ${urls.length} URLs to IndexNow in ${batches.length} batches...`);
  
  let totalSuccess = 0;
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`   Batch ${batchIndex + 1}/${batches.length}: ${batch.length} URLs`);
    
    const payload = {
      host: SITE_DOMAIN,
      key: INDEXNOW_KEY,
      urlList: batch
    };
    
    // Try each IndexNow endpoint until one succeeds
    let batchSuccess = false;
    
    for (const endpoint of INDEXNOW_ENDPOINTS) {
      try {
        await axios.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'WeldingProcessGuide-IndexBot/1.0'
          },
          timeout: 30000
        });
        
        console.log(`   ✅ Batch ${batchIndex + 1} submitted to ${endpoint}`);
        totalSuccess += batch.length;
        batchSuccess = true;
        break;
        
      } catch (error) {
        console.log(`   ⚠️  ${endpoint} failed: ${error.response?.status || error.message}`);
      }
    }
    
    if (!batchSuccess) {
      console.error(`   ❌ Batch ${batchIndex + 1} failed on all endpoints`);
    }
    
    // Small delay between batches to be polite
    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`📊 IndexNow Results: ${totalSuccess}/${urls.length} URLs submitted successfully`);
  return totalSuccess;
}

async function pingSitemaps() {
  console.log('📡 Pinging search engine sitemap endpoints...');
  
  let successCount = 0;
  
  for (const endpoint of SITEMAP_PING_ENDPOINTS) {
    try {
      const response = await axios.get(endpoint, {
        timeout: 10000,
        headers: {
          'User-Agent': 'WeldingProcessGuide-SitemapBot/1.0'
        }
      });
      
      const engineName = endpoint.includes('google') ? 'Google' : 'Bing';
      console.log(`   ✅ ${engineName} sitemap ping successful`);
      successCount++;
      
    } catch (error) {
      const engineName = endpoint.includes('google') ? 'Google' : 'Bing';
      console.log(`   ❌ ${engineName} sitemap ping failed: ${error.response?.status || error.message}`);
    }
  }
  
  console.log(`📊 Sitemap Ping Results: ${successCount}/${SITEMAP_PING_ENDPOINTS.length} endpoints notified`);
  return successCount;
}

function createIndexNowKeyFile() {
  // Create the key verification file that IndexNow requires
  const keyFilePath = `../public/${INDEXNOW_KEY}.txt`;
  const keyFileContent = INDEXNOW_KEY;
  
  try {
    fs.writeFileSync(keyFilePath, keyFileContent);
    console.log(`📝 Created IndexNow key file: ${keyFilePath}`);
  } catch (error) {
    console.warn(`⚠️  Could not create key file ${keyFilePath}: ${error.message}`);
    console.log(`   Please manually create ${SITE_URL}/${INDEXNOW_KEY}.txt with content: ${INDEXNOW_KEY}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sitemapOnly = args.includes('--sitemap-only');
  const singleUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
  
  console.log('🚀 WeldingProcess.guide Search Engine Submission');
  console.log('=' .repeat(50));
  
  // Create IndexNow key file
  createIndexNowKeyFile();
  
  try {
    if (singleUrl) {
      // Submit single URL to IndexNow
      console.log(`🎯 Single URL submission: ${singleUrl}`);
      await submitToIndexNow([singleUrl]);
      
    } else if (sitemapOnly) {
      // Only ping sitemaps
      await pingSitemaps();
      
    } else {
      // Full submission: IndexNow + sitemap pings
      const urls = await fetchSitemapUrls();
      
      if (urls.length > 0) {
        await submitToIndexNow(urls);
      }
      
      await pingSitemaps();
    }
    
    console.log('');
    console.log('✅ Submission complete! AI crawlers should index faster now.');
    console.log(`💡 Key file needed: ${SITE_URL}/${INDEXNOW_KEY}.txt`);
    console.log('📈 Monitor search console for indexing progress.');
    
  } catch (error) {
    console.error('❌ Submission failed:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  submitToIndexNow,
  pingSitemaps,
  fetchSitemapUrls,
  INDEXNOW_KEY
};

// Run if called directly
if (require.main === module) {
  main();
}