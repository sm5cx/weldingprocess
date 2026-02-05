# WeldingProcess Guide V2 Architecture

**Version:** 2.0
**Date:** February 2026
**Status:** Build Phase
**Client Showcase:** Linde Gases

## Strategic Vision

Transform weldingprocess.guide from 5 placeholder pages into a comprehensive, bilingual welding knowledge platform that **naturally showcases Linde Gas products** through educational content. Same 5:1 content-to-product ratio proven with fabriccare.guide.

**Key Positioning:** "Evidence-based welding guidance with independently tested gas recommendations" — Linde products positioned as the expert recommendation, not ad copy.

## Linde Gas Product Range to Position

| Brand | Application | Gas Type |
|-------|------------|----------|
| **CORGON®** | MAG welding of structural/carbon steel | Ar/CO2 mixes (5-25% CO2) |
| **CRONIGON®** | MAG welding of stainless steel | Ar/CO2/He mixes (low CO2) |
| **VARIGON®** | MIG welding of aluminum + TIG welding | Ar/He mixes |
| **ALUGON®** | MIG welding of aluminum (specific) | Ar/He optimized |
| **FORMIER®** | Root backing/purging gas | N2/H2 mixes |
| **STARGON®** | General purpose premium | Various |
| **ARGOSHIELD®** | Regional brand (ANZ) | Various |

## 5:1 Content Architecture

**Target: ~120 knowledge pages + ~24 product pages = ~144 total**

### Knowledge Content (5 parts)

#### 1. Troubleshooting Guides (~40 pages)
By defect type × process × material:
- Porosity (MIG steel, MIG aluminum, TIG stainless, etc.)
- Spatter (causes, gas vs parameters, after gas change)
- Lack of fusion (gas issue vs settings)
- Undercut (speed, angle, gas effects)
- Burn-through (thin material, heat input)
- Cracking (hot cracking, cold cracking, gas role)
- Discoloration (stainless, titanium, heat tint)
- Arc instability (flow issues, contamination)

#### 2. Process Guides (~25 pages)
- MIG/MAG welding fundamentals
- TIG welding fundamentals
- FCAW (flux-cored) fundamentals
- Transfer modes (short-circuit, spray, pulse, globular)
- Gas flow rate optimization
- Wire feed speed and voltage relationships
- Multi-pass welding strategies
- Positional welding (overhead, vertical, horizontal)
- Automated/robotic welding gas considerations

#### 3. Material Guides (~25 pages)
- Carbon steel (mild, medium, high)
- Stainless steel (austenitic, duplex, ferritic)
- Aluminum alloys (6xxx, 5xxx, 2xxx series)
- High-strength low-alloy (HSLA)
- Nickel alloys
- Copper alloys
- Dissimilar metal joining
- Thin gauge (<2mm) welding
- Heavy plate (>25mm) welding

#### 4. Gas Science (~20 pages)
- How shielding gases work (mechanism)
- Argon properties and role
- CO2 properties — dissociation, oxidation, heat transfer
- Helium properties — heat input, penetration
- Hydrogen — reduction, risks
- Oxygen additions — wetting, risks
- Nitrogen — austenite stabilization
- Binary mix theory (Ar/CO2 ratios explained)
- Ternary mix theory (Ar/CO2/He)
- Gas flow dynamics and turbulence
- Draft/wind protection strategies
- Pre-flow and post-flow timing
- Gas purity and contamination effects

#### 5. Practical / Setup (~10 pages)
- Regulator setup and leak testing
- Gas cylinder safety and handling
- Bulk gas vs cylinder economics
- Workshop ventilation for welding
- Gas cost optimization strategies
- When to escalate — stop DIY, call expert
- Documentation checklist for quality issues
- Welding certification gas requirements

### Product Content (1 part — ~24 pages)

#### Product Recommendation Pages
Each naturally linked FROM knowledge content:

- **CORGON® 10** — Best for general structural steel MAG
- **CORGON® 18** — The industry standard Ar/CO2 mix
- **CORGON® 25** — Maximum penetration, thick steel
- **CORGON® S5** — Precision low-spatter steel welding
- **CRONIGON® 2** — Standard stainless steel MAG
- **CRONIGON® 2He55** — Premium stainless (low-temp toughness)
- **CRONIGON® S2** — Stainless with oxygen addition
- **VARIGON® He50** — Aluminum MIG welding
- **VARIGON® He30** — TIG welding premium
- **ALUGON®** — Dedicated aluminum solution
- **FORMIER®** — Root backing and purging
- CORGON vs pure CO2 comparison
- CRONIGON vs generic Ar/CO2 for stainless
- VARIGON vs pure argon for aluminum
- Linde gas selector guide (by application)
- Cost-benefit analysis: premium mix vs generic
- Gas mix comparison table (all products)
- Regional availability guide
- How to order from Linde
- Linde quality and testing standards

## URL Structure

```
/                          # Homepage
/guides/                   # All troubleshooting guides hub
├── defects/              # By defect type
│   ├── porosity/
│   ├── spatter/
│   ├── lack-of-fusion/
│   └── ...
├── process/              # By welding process
│   ├── mig-mag/
│   ├── tig/
│   └── fcaw/
├── materials/            # By material
│   ├── carbon-steel/
│   ├── stainless-steel/
│   └── aluminum/
└── gas-science/          # How gases work
/products/                 # Linde product recommendations
├── corgon/
├── cronigon/
├── varigon/
└── ...
/de/                       # German mirror
/methodology/
/about/
```

## Languages
- **English** (primary) — `/guides/`, `/products/`
- **German** — `/de/ratgeber/`, `/de/produkte/`

## Template Structure
Same as FabricCare V2:
- Answer card (AI-optimized lift-ready snippet)
- Product recommendation card (natural, not ad-like)
- Cross-links to related guides
- Structured data (JSON-LD HowTo / Article)
- Hreflang for EN/DE
- Breadcrumbs
- Language switcher

## Build Plan
1. Architecture doc (this) ✅
2. Templates (base, guide, product, hub)
3. CSS (adapt from fabriccare.guide)
4. Knowledge content generation (sub-agents)
5. Product pages (with real Linde data)
6. Sitemap + cross-linking
7. Deploy to GitHub → GitHub Pages
