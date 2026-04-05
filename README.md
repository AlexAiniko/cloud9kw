# Cloud 9 Key West -- Website

Premium single-page luxury showcase for the Cloud 9 vacation rental property in Old Town Key West.

## Stack

Pure HTML + CSS + vanilla JavaScript. No frameworks, no build step. Netlify-ready static site.

## Quick Start

Open `index.html` in any browser. For local development with live reload:

```bash
npx serve .
```

## Deploy to Netlify

### Option A: Drag & Drop
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire `WEBSITE/` folder into the deploy drop zone
3. Done. No build command needed.

### Option B: Git Deploy
1. Push this folder to a GitHub repo
2. Connect the repo in Netlify
3. Set publish directory to the root (or `WEBSITE/` if nested)
4. No build command required

### Option C: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

## Custom Domain

After deploying to Netlify:
1. Go to Site settings > Domain management
2. Add custom domain (e.g., `cloudninekw.com`)
3. Netlify provisions SSL automatically

## Files

```
WEBSITE/
  index.html    -- Complete page structure
  styles.css    -- All styles (responsive, animations)
  script.js     -- Scroll reveal, nav state, hero parallax
  README.md     -- This file
  images/       -- Property photography
```

## Image Inventory

The `images/` folder contains two sets:
- **Named images** (e.g., `hero-pool-exterior.jpg`) -- original lower-res versions
- **Scurto images** (`scurto-421.jpg` through `scurto-457.jpg`) -- higher-resolution professional photos

The site uses the scurto (high-res) versions. Key mappings:

| Image | Content |
|-------|---------|
| `scurto-421.jpg` | Pool & house exterior (HERO) |
| `scurto-422.jpg` | Living room wide, white sofas |
| `scurto-423.jpg` | Master bedroom, pool view through doors |
| `scurto-425.jpg` | Pool loungers & umbrellas (STAY CTA bg) |
| `scurto-431.jpg` | Dining/living open concept |
| `scurto-432.jpg` | Upper balcony, palm views |
| `scurto-434.jpg` | Kitchen, stainless & skylight |
| `scurto-437.jpg` | Dining table detail, hardwood |
| `scurto-439.jpg` | Upper bedroom, balcony door open |
| `scurto-443.jpg` | Master suite wide, garden doors open |
| `scurto-449.jpg` | Second suite, king bed |
| `scurto-451.jpg` | Porch swing |
| `scurto-453.jpg` | Gecko gate close-up |
| `scurto-455.jpg` | Entry doors open to courtyard |
| `scurto-456.jpg` | Pool through carved doors |
| `scurto-457.jpg` | Pool water feature, tropical plants |

## Image Optimization (Pre-Launch)

For best performance, optimize images before going live:

```bash
# Using sharp-cli or similar
npx sharp-cli -i images/scurto-421.jpg -o images/scurto-421.webp --webp
```

Target sizes:
- Hero / full-bleed: max 2400px wide, WebP, ~200-300KB
- Room photos: max 1800px wide, WebP, ~150KB
- Detail squares: max 800px wide, WebP, ~80KB

All non-hero images already have `loading="lazy"` for deferred loading.

## Colors

| Purpose | Value |
|---------|-------|
| Background | `#fdfcfa` (warm white) |
| Text | `#3a3a3a` (soft charcoal) |
| Headings | `#2a2a2a` (near-black) |
| Accent labels | `#8a9a8a` (sage) |
| Muted text | `#6a6a6a` |
| Section bg | `#f5f3ef` (warm gray) |

## Fonts

- **Headings:** Cormorant Garamond (Google Fonts) -- elegant serif
- **Body:** Inter (Google Fonts) -- clean sans-serif

## Links to Update Before Launch

- [ ] Verify Historic KW Vacation Rentals booking URL is correct
- [ ] Verify Airbnb listing URL is correct
- [ ] Update designer section when designer name is confirmed
- [ ] Add favicon (`favicon.ico`)
- [ ] Add social sharing image (og:image) -- use absolute URL after deploy
- [ ] Consider adding Google Analytics or Plausible
