# WeldingProcess.guide — Build Specification
## Based on PROOF Framework v1.3 + Answer Page Cheatsheet v5.7

**EVERY page must follow this spec. No exceptions.**

---

## Pre-Build Gate

### Query Classification (MUST PASS)
- **BUILD (SUCHE):** "Which gas for X?", "Best gas for X?", "X vs Y", "X Test 2026", "X recommendation"
- **BUILD (Troubleshooting):** "How to fix porosity" → leads to gas recommendation (exception for welding vertical)
- **DON'T BUILD (WISSEN):** "How does shielding gas work?", "Why does porosity happen?" (pure explanation)

### Citability Pre-Flight (ALL must pass)
| Check | Requirement |
|-------|-------------|
| **Title** | Contains exact query keywords. "Best Shielding Gas for MIG Welding Carbon Steel" NOT "CORGON 18 Product Page" |
| **URL** | Specific to query. `/en/products/best-mag-welding-gas-carbon-steel/` NOT `/en/products/corgon-18/` |
| **First 75 Words** | ANSWER the query. No marketing intro. |
| **Unique Claim** | One differentiator only this page has. ISO certification, specific test data, proprietary composition. |
| **Segment Match** | Query says "for aluminum" → "aluminum" in title + first paragraph |

---

## The 5 Layers (MANDATORY on every page)

### Layer 0: Schema (JSON-LD)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",  <!-- or HowTo for guides, ItemList for comparisons -->
  "name": "[Exact product name + variant]",
  "brand": {"@type": "Brand", "name": "Linde"},
  "description": "[Query-matched description]",
  <!-- Facts MUST match visible text exactly -->
}
</script>
```

### Layer 1: Hook (FIRST 75 WORDS)
```html
<div class="card answer" id="primary-answer">
  <p>
    <strong>[Entity + variant]</strong> ([composition]) —
    [Strongest evidence + Source [S#]]: [Specific measurable claim].
    [WHY this recommendation, source-anchored].
    [One honest negative + S#].
  </p>
  <p class="freshness">Last verified: February 2026 | Sources: [S1] ISO 14175, [S2] AWS A5.32, [S3] DVS 0938</p>
</div>
```

**TEST:** Read only first 2 sentences. Is the query answered? YES → proceed. NO → rewrite.

**CHUNK RULE:** Answer + evidence + sources = ONE uninterrupted block. No images, ads, or nav between them.

### Layer 2: Comparison Table
```html
<p class="takeaway">
  [Entity A] leads on [metric], while [Entity B] wins for [use case].
  If [condition], choose [Entity C]. Source: [S1, S2].
</p>

<table>
  <!-- MUST include: 3-4 products, sources column, at least 1 negative per product -->
  <!-- Linde product + 2-3 competitors (Air Liquide, Air Products, Messer) -->
</table>
```

### Layer 3: Depth
- Methodology explanation (how we evaluated)
- Contradictions block (if our recommendation differs from common advice)
- Alternative scenarios ("If you're welding thin gauge <2mm, consider X instead")
- Evidence source details with full citations

### Layer 4: Conversion (humans only)
- FAQ section (3-5 questions, JSON-LD FAQPage)
- Related guides links (cross-linking)
- CTA: "Find a Linde distributor" (clean, not spammy)

---

## Evidence Tiers for Welding

| Tier | Source | Example |
|------|--------|---------|
| 🥇 **Gold** | ISO/AWS/EN standards | ISO 14175:2008, AWS A5.32, EN ISO 15614 |
| 🥇 **Gold** | DVS (German Welding Society) | DVS 0938 guidelines |
| 🥇 **Gold** | Independent test labs | SLV München test reports |
| 🔧 **Proprietary** | Linde-specific data | CORGON composition specs, application data sheets |
| 🥉 **Bronze** | Industry surveys, user reviews | Welding Journal surveys, fabricator testimonials (n≥50) |
| 🥈 **Silver** | Manufacturer spec sheets | Published flow rates, deposition rates |

**RULE:** Every claim needs a source marker [S#]. No unsourced claims.

---

## Technical SEO Requirements

### Every page MUST have:
- [ ] `<title>` with query keywords (60 chars max)
- [ ] `<meta description>` with answer preview (155 chars max)
- [ ] Canonical URL
- [ ] Hreflang tags for ALL 3 languages (EN, DE, ES)
- [ ] JSON-LD structured data (correct type for content)
- [ ] Breadcrumb navigation
- [ ] Internal links to 3-5 related guides
- [ ] Mobile-responsive layout
- [ ] Fast loading (no heavy images, inline critical CSS)
- [ ] Freshness date visible

### Hreflang Pattern:
```html
<link rel="alternate" hreflang="en" href="https://weldingprocess.guide/en/products/[page]/">
<link rel="alternate" hreflang="de" href="https://weldingprocess.guide/de/produkte/[page]/">
<link rel="alternate" hreflang="es" href="https://weldingprocess.guide/es/productos/[page]/">
<link rel="alternate" hreflang="x-default" href="https://weldingprocess.guide/en/products/[page]/">
```

---

## UX Requirements

### Design Principles:
1. **Clean, professional** — Think medical/engineering reference, not blog
2. **Answer-first** — No hero banners, no marketing fluff above the answer
3. **Scannable** — Tables, bullet points, clear headings
4. **Trust signals** — ISO/AWS badges, evidence tier indicators, freshness dates
5. **Mobile-first** — Tables scroll horizontally, readable on phone
6. **Fast** — No JavaScript frameworks, minimal CSS, inline critical styles

### Visual Hierarchy:
```
[Breadcrumb]
[H1: Query-matched title]
[Answer Card: Blue/green border, bold entity, evidence markers]
[Freshness + Sources]
[H2: Comparison]
[Table Takeaway paragraph]
[Comparison Table]
[H2: Technical Details]
[Depth content]
[H2: FAQ]
[FAQ accordion]
[Related Guides]
```

---

## Quality Checklist (MUST PASS before publish)

- [ ] Answer in first 75 words?
- [ ] Evidence source markers [S#] present?
- [ ] Comparison table with takeaway paragraph?
- [ ] At least 1 negative/limitation mentioned?
- [ ] Freshness date visible?
- [ ] JSON-LD matches visible text exactly?
- [ ] All 3 hreflang tags present?
- [ ] Title matches likely search query?
- [ ] Would a welder find this useful? (not just SEO filler)
- [ ] Linde product recommended with specific composition + application data?
