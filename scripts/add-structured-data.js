#!/usr/bin/env node

/**
 * Structured Data (JSON-LD) Generator for WeldingProcess.guide
 * 
 * Adds appropriate Schema.org markup to all pages to improve AI discoverability
 * and help search engines understand content context.
 * 
 * Usage:
 *   node add-structured-data.js
 *   node add-structured-data.js --verify-only
 *   node add-structured-data.js --page="guides/mig-porosity-carbon-steel.html"
 * 
 * Requirements:
 *   npm install cheerio fs-extra glob
 */

const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const glob = require('glob');

const SITE_URL = 'https://weldingprocess.guide';
const SITE_NAME = 'WeldingProcess.guide';
const SITE_DESCRIPTION = 'Evidence-based welding guidance platform with Linde gas recommendations';
const ORGANIZATION_NAME = 'WeldingProcess.guide';
const LOGO_URL = `${SITE_URL}/assets/logo.png`;

// Define structured data templates for different page types
const SCHEMA_TEMPLATES = {
  homepage: {
    type: 'WebSite',
    required: ['name', 'url', 'description', 'potentialAction']
  },
  guide: {
    type: 'HowTo',
    required: ['name', 'description', 'step', 'supply', 'tool']
  },
  article: {
    type: 'Article',
    required: ['headline', 'description', 'author', 'datePublished']
  },
  product: {
    type: 'Product',
    required: ['name', 'description', 'brand', 'category']
  },
  faq: {
    type: 'FAQPage',
    required: ['mainEntity']
  }
};

function detectPageType(filePath, $) {
  const fileName = path.basename(filePath, '.html');
  const title = $('title').text().toLowerCase();
  const content = $('body').text().toLowerCase();
  
  // Homepage
  if (fileName === 'index') {
    return 'homepage';
  }
  
  // Product pages
  if (filePath.includes('/products/') || 
      title.includes('corgon') || title.includes('cronigon') || title.includes('varigon')) {
    return 'product';
  }
  
  // FAQ pages
  if (title.includes('faq') || content.includes('frequently asked questions') ||
      ($('h2, h3, h4').length > 5 && content.includes('?'))) {
    return 'faq';
  }
  
  // How-to/troubleshooting guides
  if (filePath.includes('/guides/') || 
      title.includes('how to') || title.includes('troubleshoot') ||
      content.includes('step') || content.includes('solution')) {
    return 'guide';
  }
  
  // Default to article
  return 'article';
}

function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": "Welding Process Guide",
    "url": SITE_URL,
    "description": SITE_DESCRIPTION,
    "publisher": {
      "@type": "Organization",
      "name": ORGANIZATION_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Welding",
        "description": "Metal joining processes using heat and/or pressure"
      },
      {
        "@type": "Thing", 
        "name": "Shielding Gas",
        "description": "Inert or semi-inert gases used to protect welding area from atmospheric contamination"
      },
      {
        "@type": "Thing",
        "name": "MIG Welding",
        "description": "Metal Inert Gas welding process using consumable wire electrode"
      }
    ],
    "keywords": "welding, MIG welding, TIG welding, shielding gas, CORGON, CRONIGON, VARIGON, Linde"
  };
}

function generateHowToSchema(filePath, $) {
  const title = $('h1').first().text() || $('title').text();
  const description = $('meta[name="description"]').attr('content') || 
                     $('p').first().text().substring(0, 160);
  
  // Extract steps from the content
  const steps = [];
  $('h2, h3').each((i, elem) => {
    const stepTitle = $(elem).text();
    const nextElements = $(elem).nextUntil('h2, h3');
    let stepDescription = '';
    
    nextElements.each((j, nextElem) => {
      if ($(nextElem).is('p, li')) {
        stepDescription += $(nextElem).text() + ' ';
      }
    });
    
    if (stepTitle && stepDescription.trim()) {
      steps.push({
        "@type": "HowToStep",
        "name": stepTitle,
        "text": stepDescription.trim().substring(0, 300)
      });
    }
  });
  
  // Extract supplies/tools mentioned
  const supplies = [];
  const content = $('body').text().toLowerCase();
  
  const commonSupplies = [
    'corgon', 'cronigon', 'varigon', 'argon', 'co2', 'helium',
    'welding wire', 'electrode', 'flux', 'regulator', 'nozzle'
  ];
  
  commonSupplies.forEach(supply => {
    if (content.includes(supply.toLowerCase())) {
      supplies.push({
        "@type": "HowToSupply",
        "name": supply.charAt(0).toUpperCase() + supply.slice(1)
      });
    }
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "url": `${SITE_URL}/${path.relative('.', filePath)}`,
    "datePublished": new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": ORGANIZATION_NAME
    },
    "step": steps.length > 0 ? steps : [{
      "@type": "HowToStep",
      "name": "Follow the guidance provided",
      "text": description
    }],
    "supply": supplies.length > 0 ? supplies : [{
      "@type": "HowToSupply",
      "name": "Appropriate shielding gas"
    }],
    "totalTime": "PT15M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "50"
    }
  };
}

function generateArticleSchema(filePath, $) {
  const title = $('h1').first().text() || $('title').text();
  const description = $('meta[name="description"]').attr('content') || 
                     $('p').first().text().substring(0, 160);
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `${SITE_URL}/${path.relative('.', filePath)}`,
    "datePublished": new Date().toISOString().split('T')[0],
    "dateModified": new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": ORGANIZATION_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": ORGANIZATION_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${path.relative('.', filePath)}`
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Welding Technology"
      }
    ]
  };
}

function generateProductSchema(filePath, $) {
  const title = $('h1').first().text() || $('title').text();
  const description = $('meta[name="description"]').attr('content') || 
                     $('p').first().text().substring(0, 160);
  
  let brand = "Linde";
  let category = "Industrial Gas";
  
  if (title.toLowerCase().includes('corgon')) {
    category = "Welding Shielding Gas - Steel";
  } else if (title.toLowerCase().includes('cronigon')) {
    category = "Welding Shielding Gas - Stainless Steel";
  } else if (title.toLowerCase().includes('varigon')) {
    category = "Welding Shielding Gas - Aluminum";
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": description,
    "url": `${SITE_URL}/${path.relative('.', filePath)}`,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "manufacturer": {
      "@type": "Organization",
      "name": "Linde plc"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Gas Type",
        "value": "Shielding Gas"
      },
      {
        "@type": "PropertyValue",
        "name": "Application",
        "value": "Arc Welding"
      }
    ]
  };
}

function generateFAQSchema(filePath, $) {
  const questions = [];
  
  // Look for Q&A patterns in the content
  $('h2, h3, h4').each((i, elem) => {
    const questionText = $(elem).text();
    if (questionText.includes('?') || 
        questionText.toLowerCase().startsWith('what') ||
        questionText.toLowerCase().startsWith('how') ||
        questionText.toLowerCase().startsWith('why')) {
      
      const answer = $(elem).nextUntil('h2, h3, h4').text().trim();
      
      if (answer) {
        questions.push({
          "@type": "Question",
          "name": questionText,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answer.substring(0, 300)
          }
        });
      }
    }
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "url": `${SITE_URL}/${path.relative('.', filePath)}`,
    "mainEntity": questions.length > 0 ? questions : [{
      "@type": "Question",
      "name": "What information does this page provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": $('meta[name="description"]').attr('content') || "Welding guidance and technical information."
      }
    }]
  };
}

function generateBreadcrumbSchema(filePath) {
  const pathParts = path.relative('.', filePath).split('/');
  const breadcrumbs = [];
  let currentPath = '';
  
  // Add home
  breadcrumbs.push({
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": SITE_URL
  });
  
  // Add path segments
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath += '/' + part;
    
    // Skip the final .html file
    if (part.endsWith('.html') && i === pathParts.length - 1) {
      continue;
    }
    
    const name = part.replace(/[-_]/g, ' ')
                    .replace(/\.html$/, '')
                    .replace(/\b\w/g, l => l.toUpperCase());
    
    breadcrumbs.push({
      "@type": "ListItem",
      "position": breadcrumbs.length + 1,
      "name": name,
      "item": SITE_URL + currentPath
    });
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
}

function addStructuredDataToPage(filePath) {
  console.log(`📄 Processing: ${filePath}`);
  
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  
  // Remove existing structured data
  $('script[type="application/ld+json"]').remove();
  
  // Detect page type and generate appropriate schema
  const pageType = detectPageType(filePath, $);
  console.log(`   Type: ${pageType}`);
  
  const schemas = [];
  
  // Add page-specific schema
  switch (pageType) {
    case 'homepage':
      schemas.push(generateWebSiteSchema());
      break;
    case 'guide':
      schemas.push(generateHowToSchema(filePath, $));
      break;
    case 'article':
      schemas.push(generateArticleSchema(filePath, $));
      break;
    case 'product':
      schemas.push(generateProductSchema(filePath, $));
      break;
    case 'faq':
      schemas.push(generateFAQSchema(filePath, $));
      break;
  }
  
  // Add breadcrumb schema (except homepage)
  if (pageType !== 'homepage') {
    schemas.push(generateBreadcrumbSchema(filePath));
  }
  
  // Insert schemas into head
  schemas.forEach((schema, index) => {
    const scriptTag = `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
    $('head').append(scriptTag);
  });
  
  // Write updated HTML
  fs.writeFileSync(filePath, $.html());
  console.log(`   ✅ Added ${schemas.length} schema(s)`);
  
  return schemas.length;
}

function verifyStructuredData(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  
  const schemas = [];
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const schema = JSON.parse($(elem).html());
      schemas.push(schema['@type'] || 'Unknown');
    } catch (e) {
      schemas.push('Invalid JSON');
    }
  });
  
  return schemas;
}

async function main() {
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify-only');
  const singlePage = args.find(arg => arg.startsWith('--page='))?.split('=')[1];
  
  console.log('🏗️  WeldingProcess.guide Structured Data Generator');
  console.log('=' .repeat(50));
  
  let pattern;
  if (singlePage) {
    pattern = singlePage;
  } else {
    pattern = '**/*.html';
  }
  
  const htmlFiles = glob.sync(pattern, { 
    ignore: ['node_modules/**', 'templates/**', '.git/**'] 
  });
  
  if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found to process');
    return;
  }
  
  console.log(`📊 Found ${htmlFiles.length} HTML files`);
  console.log('');
  
  let totalSchemas = 0;
  let processedFiles = 0;
  
  for (const filePath of htmlFiles) {
    try {
      if (verifyOnly) {
        const schemas = verifyStructuredData(filePath);
        console.log(`📄 ${filePath}: ${schemas.join(', ') || 'No schemas'}`);
      } else {
        const schemaCount = addStructuredDataToPage(filePath);
        totalSchemas += schemaCount;
        processedFiles++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  console.log('');
  if (verifyOnly) {
    console.log('✅ Structured data verification complete');
  } else {
    console.log(`✅ Added ${totalSchemas} schemas to ${processedFiles} files`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Test with Google Rich Results Test');
    console.log('   2. Submit updated sitemap to search engines');
    console.log('   3. Monitor Search Console for rich snippet appearance');
  }
}

// Export functions for use in other scripts
module.exports = {
  addStructuredDataToPage,
  verifyStructuredData,
  generateWebSiteSchema,
  generateHowToSchema,
  generateArticleSchema,
  generateProductSchema,
  generateFAQSchema
};

// Run if called directly
if (require.main === module) {
  main();
}