# Contentful to Markdown Migration Plan

## Overview
This document outlines the step-by-step migration from Contentful CMS to a local markdown-based content system for the portfolio website.

## Assumptions to Confirm

Before proceeding, please confirm these assumptions:

### 1. Content Structure
- **Assumption**: Keep the same 3 content types (writings, artboards, photo collections) but as local markdown files
- **Question**: Should we maintain the same folder structure? Proposed:
  ```
  content/
  ├── writings/
  │   ├── post-1.md
  │   └── post-2.md
  ├── artboards/
  │   ├── artwork-1.md
  │   └── artwork-1/
  │       └── image.jpg
  ├── photo-collections/
  │   ├── collection-1.md
  │   └── collection-1/
  │       ├── image1.jpg
  │       └── image2.jpg
  └── site-data.md
  ```

### 2. Rich Text Content ✅ CONFIRMED
- **Approach**: Convert Contentful rich text to standard markdown
- **Support**: Handle links, inline images, callouts, italics, bold, and normal markdown styling
- **Simplification**: Convert complex rich text to standard markdown equivalents
- **Cross-references**: Convert to standard markdown links

### 3. Image Handling ✅ CONFIRMED  
- **Local (interim)**: Download all Contentful assets and store locally
- **Blog post images**: In same folder as content
- **Photo collections**: Future R2 structure `{collection_name}/{image_number}.jpg`
- **Final destination**: Cloudflare R2 (local is intermediate step)

### 4. URLs and Routing
- **Assumption**: Keep the same URL structure (`/writings/slug/`, `/artboards/slug/`, etc.)
- **Question**: Any changes needed to current routing?

### 5. Site Data
- **Assumption**: Convert `contentfulSiteData` to a markdown file with frontmatter
- **Question**: Should this be `content/site-data.md` or handled differently?

### 6. Migration Strategy
- **Assumption**: Implement incrementally, allowing both systems to coexist temporarily
- **Question**: Should we:
  - Migrate one content type at a time?
  - Set up the new system first, then migrate content?
  - Have a content export/import tool?

### 7. Content Metadata
- **Assumption**: Use frontmatter for all current Contentful fields
- **Question**: Any additional metadata fields needed?

---

## Proposed Implementation Steps

*Note: These steps will be detailed further once assumptions are confirmed.*

### Phase 1: Setup New System (Parallel to Contentful)
1. Install and configure required Gatsby plugins
2. Set up content folder structure
3. Create new GraphQL schema for markdown content
4. Update gatsby-config.js with filesystem sources

### Phase 2: Create Migration Tools
5. Build Contentful export script
6. Create content transformation utilities
7. Set up image download and processing

### Phase 3: Migrate Content Types (One by One)
8. Migrate writings (most complex due to rich text)
9. Migrate artboards (simpler structure)
10. Migrate photo collections
11. Migrate site data

### Phase 4: Update Application Code
12. Update page queries to use new data sources
13. Modify templates to work with markdown
14. Update routing and page creation logic

### Phase 5: Cleanup and Testing
15. Remove Contentful dependencies
16. Test all functionality
17. Performance optimization
18. Documentation updates

---

## Questions for You

1. **Content Export**: Do you have access to export all content from Contentful, or should I help create an export script?

2. **Rich Text Priority**: How important is preserving the exact rich text formatting vs. simplifying to standard markdown?

3. **Timeline**: Do you want to implement this all at once, or migrate content types incrementally?

4. **Backup Strategy**: Should we keep Contentful as a backup during migration?

5. **Image Quality**: Any specific requirements for image processing/optimization during migration?

Please review these assumptions and let me know your preferences before I create the detailed implementation steps.
