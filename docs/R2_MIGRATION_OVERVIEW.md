# Cloudflare R2 Image CDN Migration Overview

## Current State
- **Image hosting**: Contentful CMS with built-in asset delivery
- **Optimization**: gatsby-plugin-image with GraphQL `gatsbyImageData`
- **Components**: GatsbyImage components throughout the site
- **Content types**: Profile images, photo collections, artboards

## Proposed Migration
Migrate from Contentful image hosting to Cloudflare R2 + Workers for image CDN.

### Benefits
- **Cost savings**: Zero egress fees vs Contentful bandwidth costs
- **Performance**: Global CDN with on-the-fly image optimization
- **Control**: Custom transformations (resize, format, quality)
- **Free tier**: 10GB storage + 100k requests/day

### Migration Approaches

#### Option 1: Hybrid (Recommended)
- Keep Contentful for content metadata (titles, descriptions, dates)
- Store images in R2, reference URLs in Contentful
- Minimal schema disruption

#### Option 2: Full Migration
- Move to headless CMS + R2
- Complete content management rebuild required

## Effort Estimate
- **Hybrid approach**: 13-20 hours
- **Full migration**: 30-40+ hours

## Key Technical Changes
1. Replace `gatsbyImageData` GraphQL fields with URL fields
2. Switch from `GatsbyImage` to custom image components
3. Implement R2 + Cloudflare Worker image optimization
4. Update all image queries and components

## Prerequisites
- Cloudflare account
- Domain added to Cloudflare
- R2 access enabled
- Wrangler CLI (optional but recommended)
