# Phase 3: Artboards Migration

## Overview
Phase 3 focuses on migrating artboards from Contentful to a local markdown-based structure. Artboards are visual artwork pieces with single images and simple text descriptions, making them simpler to migrate than blog posts but more complex than site data.

## Current Artboards Usage

### What Artboards Contain
Currently, `contentfulArtboard` contains:
- **Title**: Artwork title
- **Slug**: URL-friendly identifier  
- **Artboard Date**: Creation/display date
- **Metadata**: Additional metadata
- **Artboard**: Single high-resolution image (960px width)
- **Description**: Markdown text converted to HTML AST for rendering

### Where Artboards Are Used
- **Individual Pages** (`src/templates/artboard.js`): Full artboard display at `/artboards/{slug}/`
- **Homepage** (`src/pages/index.js`): Recent 2 artboards preview
- **Photos Page** (`src/pages/photos.js`): All artboards grid display
- **Page Generation** (`gatsby-node.js`): Dynamic page creation
- **Preview Component** (`ArtboardPreview.js`): Reusable preview component

## Migration Approach

### ✅ Requirements Analysis
- **Content**: Single image + simple markdown description
- **Complexity**: Medium - single image per artboard, simple text processing
- **Usage**: Multiple pages, preview component, individual templates
- **Priority**: Good candidate after site data - simpler than blog posts

## Implementation Steps for Artboards

### Step 1: Export Artboards from Contentful
1. Create export script to fetch all artboards
2. Download artboard images to local folders
3. Convert descriptions to standard markdown
4. Generate frontmatter from Contentful fields

### Step 2: Create Artboards Content Structure
1. Set up `content/artboards/` folder structure
2. Create individual artboard folders: `content/artboards/{slug}/`
3. Place `index.md` and `artboard.{ext}` in each folder

### Step 3: Update GraphQL Queries
1. Update artboard template query to use `markdownRemark`
2. Update homepage and photos page queries
3. Test parallel queries (Contentful + Markdown)

### Step 4: Update Templates and Components
1. Modify `src/templates/artboard.js` for markdown data
2. Update `ArtboardPreview` component if needed
3. Test rendering with new data structure

### Step 5: Switch Over and Cleanup
1. Update `gatsby-node.js` page creation
2. Remove Contentful artboard queries
3. Test all artboard functionality

## File Structure Result

After migration, artboards will look like:

```
content/
├── writings/ (✅ Phase 1 completed)
├── artboards/
│   ├── the-olympic-peninsula-artboard/
│   │   ├── index.md
│   │   └── artboard.jpg
│   ├── the-rooftop-artboard/
│   │   ├── index.md
│   │   └── artboard.jpg
│   └── ...
└── site-data/ (✅ Phase 2 completed - now simplified)
```

**Example `content/artboards/the-olympic-peninsula-artboard/index.md`:**
```markdown
---
title: "The Olympic Peninsula Artboard"
slug: "the-olympic-peninsula-artboard"
artboardDate: "2023-10-27"
metadata: "Artwork metadata"
type: "artboard"
artboard: "./artboard.jpg"
---

# The Olympic Peninsula

This artwork captures the rugged beauty of Washington's Olympic Peninsula, 
with its misty mountains and pristine coastlines.
```

## GraphQL Query Transformation

### Before (Contentful):
```graphql
query ArtboardBySlug($slug: String!) {
  contentfulArtboard(slug: { eq: $slug }) {
    title
    artboard {
      gatsbyImageData(layout: CONSTRAINED, width: 960)
    }
    description {
      childMarkdownRemark {
        htmlAst
      }
    }
    artboardDate
    metadata
  }
}
```

### After (Markdown):
```graphql
query ArtboardBySlug($slug: String!) {
  markdownRemark(frontmatter: { slug: { eq: $slug }, type: { eq: "artboard" } }) {
    frontmatter {
      title
      artboardDate
      metadata
      artboard {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: 960)
        }
      }
    }
    htmlAst
  }
}
```

## Code Changes Required

### Files to Update:
1. **`src/templates/artboard.js`**:
   - Update GraphQL query
   - Change data access: `data.contentfulArtboard` → `data.markdownRemark`
   - Update image path: `artboard.artboard.gatsbyImageData` → `frontmatter.artboard.childImageSharp.gatsbyImageData`
   - Update description rendering: `description.childMarkdownRemark.htmlAst` → `htmlAst`

2. **`src/pages/index.js`**:
   - Update GraphQL query for recent artboards
   - Change data access for preview component

3. **`src/pages/photos.js`**:
   - Update GraphQL query for all artboards
   - Change data access for preview component

4. **`gatsby-node.js`**:
   - Update page creation query to use markdown instead of Contentful

### Migration Complexity: **MEDIUM**
- ✅ Single image per artboard (simpler than blog posts)
- ✅ Simple text descriptions (no complex rich text)
- ⚠️ Multiple files to update (4 files)
- ⚠️ Template logic changes needed
- ✅ No cross-references to handle

## Testing Plan

### Pre-Migration Testing:
1. Verify all artboards display correctly on individual pages
2. Check artboards appear on homepage and photos page
3. Confirm image quality and loading performance
4. Test artboard navigation and links

### Post-Migration Testing:
1. All artboard pages render identically
2. Preview components work on homepage and photos page
3. Images display at same quality/size
4. Description text renders correctly
5. Build process completes without errors
6. No broken links or console errors

## Success Criteria

- [x] All artboards display identically on individual pages
- [x] Homepage shows recent artboards correctly
- [x] Photos page displays all artboards in grid
- [x] Image optimization maintains same quality and performance
- [x] Description text renders correctly from markdown
- [x] Build times remain comparable
- [x] No broken references or console errors
- [x] All artboard navigation continues to work

## Risk Assessment: **MEDIUM**

### Risks:
- **Template complexity**: Multiple files need updating
- **Image path issues**: Need to ensure local images work correctly
- **Description rendering**: HTML AST vs markdown rendering differences
- **Build failures**: More complex than previous phases

### Rollback Plan:
- Keep parallel queries during testing
- Maintain Contentful configuration until verified
- Test individual artboards first before switching all

## Future Benefits

After migration:
- Faster builds (no Contentful API calls for artboards)
- Better version control for artwork descriptions
- Easier content editing without CMS
- Reduced external dependencies

## Next Steps

Ready to begin Phase 3 implementation:

1. **Step 1**: Create artboards export script
2. **Step 2**: Export all artboards and images
3. **Step 3**: Set up content structure
4. **Step 4**: Update templates and queries
5. **Step 5**: Test and switch over

Phase 3 should be manageable with the patterns established from blog posts migration.
