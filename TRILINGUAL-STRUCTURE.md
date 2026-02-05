# WeldingProcess Guide - Trilingual Structure

## Languages Supported
- **English (EN)** - Primary language
- **German (DE)** - Deutscher Markt
- **Spanish (ES)** - Mercado Español

## URL Structure

### English (Default)
- Homepage: `/`
- Guides: `/guides/`
- Products: `/products/`
- Gas Science: `/gas-science/`
- Methodology: `/methodology/`
- About: `/about/`

### German
- Homepage: `/de/`
- Guides: `/de/ratgeber/`
- Products: `/de/produkte/`
- Gas Science: `/de/gaswissenschaft/`
- Methodology: `/de/methodik/`
- About: `/de/ueber-uns/`

### Spanish
- Homepage: `/es/`
- Guides: `/es/guias/`
- Products: `/es/productos/`
- Gas Science: `/es/ciencia-del-gas/`
- Methodology: `/es/metodologia/`
- About: `/es/acerca-de/`

## Navigation Labels

| Section | English | German | Spanish |
|---------|---------|--------|---------|
| Guides | Guides | Ratgeber | Guías |
| Products | Products | Produkte | Productos |
| Gas Science | Gas Science | Gaswissenschaft | Ciencia del Gas |
| Methodology | Methodology | Methodik | Metodología |
| About | About | Über uns | Acerca de |

## Hreflang Implementation

All pages include:
```html
<link rel="alternate" hreflang="en" href="{{EN_URL}}" />
<link rel="alternate" hreflang="de" href="{{DE_URL}}" />
<link rel="alternate" hreflang="es" href="{{ES_URL}}" />
<link rel="alternate" hreflang="x-default" href="{{EN_URL}}" />
```

## Language Switcher

All templates include trilingual switcher:
```html
<div class="lang-switch">
  <a href="{{EN_URL}}" class="{{EN_ACTIVE}}" title="English version">EN</a>
  <span>|</span>
  <a href="{{DE_URL}}" class="{{DE_ACTIVE}}" title="Deutsche Version">DE</a>
  <span>|</span>
  <a href="{{ES_URL}}" class="{{ES_ACTIVE}}" title="Versión en Español">ES</a>
</div>
```

## Template Variables for Trilingual Support

### Required Variables
- `LANG_CODE`: "en", "de", or "es"
- `EN_URL`: English version URL
- `DE_URL`: German version URL
- `ES_URL`: Spanish version URL
- `EN_ACTIVE`: "active" if current language is English
- `DE_ACTIVE`: "active" if current language is German
- `ES_ACTIVE`: "active" if current language is Spanish

### Navigation URLs
- `GUIDES_URL`: "/guides/", "/de/ratgeber/", or "/es/guias/"
- `PRODUCTS_URL`: "/products/", "/de/produkte/", or "/es/productos/"
- `GAS_SCIENCE_URL`: "/gas-science/", "/de/gaswissenschaft/", or "/es/ciencia-del-gas/"
- `METHODOLOGY_URL`: "/methodology/", "/de/methodik/", or "/es/metodologia/"
- `ABOUT_URL`: "/about/", "/de/ueber-uns/", or "/es/acerca-de/"

### Navigation Text
- `NAV_GUIDES`: "Guides", "Ratgeber", or "Guías"
- `NAV_PRODUCTS`: "Products", "Produkte", or "Productos"
- `NAV_GAS_SCIENCE`: "Gas Science", "Gaswissenschaft", or "Ciencia del Gas"
- `NAV_METHODOLOGY`: "Methodology", "Methodik", or "Metodología"
- `NAV_ABOUT`: "About", "Über uns", or "Acerca de"

## Open Graph Locales
- English: `og:locale="en_US"`
- German: `og:locale="de_DE"`
- Spanish: `og:locale="es_ES"`

## Example Page URLs

### Porosity Troubleshooting Guide
- EN: `/guides/defects/porosity-mig/`
- DE: `/de/ratgeber/defekte/porosität-mig/`
- ES: `/es/guias/defectos/porosidad-mig/`

### CORGON 18 Product Page
- EN: `/products/corgon-18/`
- DE: `/de/produkte/corgon-18/`
- ES: `/es/productos/corgon-18/`

### Gas Science Hub
- EN: `/gas-science/`
- DE: `/de/gaswissenschaft/`
- ES: `/es/ciencia-del-gas/`

## Content Translation Notes

### Product Names
- Keep Linde product names consistent: CORGON®, CRONIGON®, VARIGON®, etc.
- Gas compositions use chemical symbols: Ar, CO₂, He (universal)

### Technical Terms
- Welding processes: MIG/MAG (universal), TIG (universal), FCAW
- Material types: Use localized terms for steel grades, alloys
- Safety warnings: Translate fully for compliance

### SEO Considerations
- Each language targets different markets
- German: Focus on EU regulations, DIN standards
- Spanish: Include Latin American markets
- English: Global audience, AWS standards

## Implementation Status
- ✅ Base template updated with trilingual support
- ✅ All templates support trilingual variables
- ✅ CSS includes proper language styling
- ✅ Documentation updated for 3 languages
- 🔄 Content generation for DE/ES pending
- 🔄 URL routing implementation pending