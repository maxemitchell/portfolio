# Portfolio CDN

Cloudflare Worker-based image CDN for the portfolio website.

## Features

- **On-the-fly image optimization** using Cloudflare's image transformation
- **Format conversion** (WebP, AVIF, auto-detection)
- **Responsive sizing** with width/height parameters
- **Quality control** and blur effects
- **Global CDN** caching with Cloudflare's edge network

## Usage

### Image URLs
```
https://cdn.maxemitchell.com/path/to/image.jpg
```

### Transformations
```
https://cdn.maxemitchell.com/photo.jpg?w=800&q=85&f=webp
https://cdn.maxemitchell.com/photo.jpg?w=20&blur=10  # Placeholder
```

### Parameters
- `w` - Width in pixels
- `h` - Height in pixels  
- `q` - Quality (1-100, default: 85)
- `f` - Format (`webp`, `avif`, `auto`, default: `auto`)
- `blur` - Blur radius for placeholders

## Development

```bash
cd cdn
npm install
wrangler dev          # Local development
wrangler deploy       # Deploy to production
```

## Configuration

- **R2 Bucket**: `portfolio`
- **Binding**: `PORTFOLIO_IMAGES`
- **Domain**: `cdn.maxemitchell.com`
