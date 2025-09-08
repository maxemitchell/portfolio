# Local Content Migration Plan

## Overview
Migrating from Contentful to local file-based content management with Cloudflare R2 for images.

## Current Contentful Content Types
1. **ContentfulWriting** - Blog posts with rich text, dates, metadata
2. **ContentfulArtboard** - Single images with descriptions 
3. **ContentfulPhotoCollection** - Image galleries
4. **ContentfulSiteData** - Profile and site configuration

## Proposed Local Structure

```
content/
├── writings/
│   ├── 2024-01-15-first-post.md
│   ├── 2024-02-20-another-post.md
│   └── index.js                    # Auto-generated index
├── artboards/
│   ├── artboard-1.json
│   ├── artboard-2.json
│   └── index.js
├── photo-collections/
│   ├── collection-1.json
│   ├── collection-2.json
│   └── index.js
├── site/
│   ├── profile.json
│   └── config.json
└── images/
    ├── r2-urls.json               # R2 URL mappings
    └── migration-log.json
```

## Data Format Standards

### Writing Posts (Markdown with frontmatter)
```markdown
---
title: "Post Title"
date: "2024-01-15"
slug: "post-title"
preview: "Short preview text..."
metadata: 
  tags: ["tag1", "tag2"]
  category: "blog"
images:
  featured: "r2://path/to/featured.jpg"
---

# Post content in markdown
Content here supports all rich text features...

![Alt text](r2://path/to/image.jpg)
```

### Artboards (JSON)
```json
{
  "id": "artboard-1",
  "title": "Artboard Title",
  "description": "Description text",
  "date": "2024-01-15",
  "slug": "artboard-title",
  "images": {
    "main": "r2://path/to/main-image.jpg",
    "thumbnail": "r2://path/to/thumb.jpg"
  },
  "metadata": {
    "dimensions": "1920x1080",
    "tools": ["Photoshop", "Figma"]
  }
}
```

### Photo Collections (JSON)
```json
{
  "id": "collection-1", 
  "title": "Collection Title",
  "description": "Collection description",
  "date": "2024-01-15",
  "slug": "collection-title",
  "coverImage": "r2://path/to/cover.jpg",
  "images": [
    {
      "url": "r2://path/to/image1.jpg",
      "alt": "Image description",
      "caption": "Optional caption"
    }
  ],
  "metadata": {
    "location": "Location name",
    "equipment": "Camera used"
  }
}
```

## Migration Steps

### Phase 1: Content Export & Structure Setup
1. ✅ Create content/ directory structure
2. ⬜ Export all Contentful data to JSON
3. ⬜ Convert writings to markdown format
4. ⬜ Convert artboards/collections to JSON format
5. ⬜ Create R2 URL mapping system

### Phase 2: Gatsby Integration
1. ⬜ Replace gatsby-source-contentful with gatsby-source-filesystem
2. ⬜ Add gatsby-transformer-remark for markdown processing  
3. ⬜ Update GraphQL queries for local data
4. ⬜ Create custom image component for R2 URLs
5. ⬜ Update all template files

### Phase 3: R2 Image Migration  
1. ⬜ Upload existing images to R2
2. ⬜ Create Cloudflare Worker for image optimization
3. ⬜ Update image references in content files
4. ⬜ Test image loading and optimization

### Phase 4: Testing & Cleanup
1. ⬜ Verify all pages render correctly
2. ⬜ Test build process 
3. ⬜ Update environment variables
4. ⬜ Remove Contentful dependencies

## Benefits of This Approach
- **Version Control**: All content in git
- **Performance**: GatsbyImage optimizations (blur placeholders, responsive images, WebP)
- **Cost**: Free content management, cheap R2 storage
- **SEO**: Better image loading with proper lazy loading and sizing
- **Developer Experience**: Markdown for writing, JSON for structured data
- **Image Quality**: Gatsby processes R2 images at build time for optimal delivery
