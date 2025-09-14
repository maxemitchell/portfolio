# Step-by-Step Implementation Guide

## ✅ BLOG POST MIGRATION COMPLETED
**All blog posts have been successfully migrated from Contentful to static markdown files.**

## ✅ Phase 1: Setup New Markdown System (Parallel to Contentful)

### ✅ Step 1.1: Install Required Dependencies
```bash
# These are already installed, just verifying
yarn list gatsby-source-filesystem
yarn list gatsby-transformer-remark
yarn list gatsby-plugin-image
yarn list gatsby-transformer-sharp
```

✅ **Completed**: Required plugins confirmed available for markdown processing.

### ✅ Step 1.2: Create Content Folder Structure
```
content/
├── writings/ ✅ (completed)
├── artboards/ ❌ (not migrated yet)
├── photo-collections/ ❌ (not migrated yet)
├── site-data/ ❌ (not migrated yet)
└── images/ (shared assets)
```

✅ **Completed**: Blog posts content directory structure created successfully.

### ✅ Step 1.3: Configure gatsby-source-filesystem for Content
**File**: `gatsby-config.js`

Add new filesystem source:
```javascript
{
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'content',
    path: `${__dirname}/content/`,
  },
},
```

✅ **Completed**: Gatsby configured to read local content folder for blog posts.

### ✅ Step 1.4: Test Basic Markdown Processing
✅ **Completed**: Markdown processing verified and working with GraphQL queries.

---

## ✅ Phase 2: Create Migration Tools and Scripts

### ✅ Step 2.1: Create Contentful Export Script
**File**: `scripts/export-contentful.js`

✅ **Completed**: Script created to pull all blog post data from Contentful API for offline processing.

### ✅ Step 2.2: Create Content Transformation Utilities
**Files**: 
- ✅ `scripts/transform-writings.js` (completed)
- ❌ `scripts/transform-artboards.js` (not needed yet)
- ❌ `scripts/transform-photo-collections.js` (not needed yet)

✅ **Completed**: Blog post rich text and data structures successfully converted to markdown format.

### ✅ Step 2.3: Create Image Download Script
**File**: `scripts/download-images.js`

✅ **Completed**: All blog post images downloaded to local storage with proper organization.

---

## Phase 3: Migrate Content Types (Blog Posts Only)

### ❌ Step 3.1: Artboards (Not Migrated)
- Export artboard data from Contentful
- Transform to markdown with frontmatter
- Download associated images
- Test new queries work

**Status**: Not completed - artboards still use Contentful

### ❌ Step 3.2: Photo Collections (Not Migrated)
- Export photo collection data
- Handle multiple images per collection
- Create markdown files with proper frontmatter

**Status**: Not completed - photo collections still use Contentful

### ✅ Step 3.3: Writings (Blog Posts - COMPLETED)
- ✅ Export writing data with rich text
- ✅ Convert Contentful rich text to markdown
- ✅ Handle embedded assets and cross-references
- ✅ Preserve all formatting

**Status**: ✅ **Completed** - All blog posts successfully migrated

### ❌ Step 3.4: Site Data (Not Migrated)
- Export global site configuration
- Convert to markdown or JSON frontmatter
- Update queries accordingly

**Status**: Not completed - site data still uses Contentful

---

## Phase 4: Update Application Code

### Step 4.1: Create Parallel Page Queries
**Files to update**:
- `src/pages/index.js`
- `src/pages/writings.js`
- `src/pages/photos.js`

**What we're doing**: Adding new GraphQL queries alongside existing Contentful queries for testing.

### Step 4.2: Update Templates for Markdown
**Files to update**:
- `src/templates/writing.js`
- `src/templates/artboard.js`
- `src/templates/photo_collection.js`

**What we're doing**: Modifying templates to work with `markdownRemark` instead of Contentful nodes.

### Step 4.3: Update Page Creation Logic
**File**: `gatsby-node.js`

**What we're doing**: Modifying `createPages` to use markdown files instead of Contentful queries.

### Step 4.4: Handle Image Processing
Update image queries to use `gatsby-transformer-sharp` with local files.

---

## Phase 5: Switch Over and Cleanup

### Step 5.1: Feature Flag Implementation
Add environment variable to switch between Contentful and markdown sources.

**What we're doing**: Allowing safe testing and gradual rollout.

### Step 5.2: Remove Contentful Dependencies
**Files to update**:
- `package.json` (remove gatsby-source-contentful)
- `gatsby-config.js` (remove contentful plugin)
- Remove contentful-specific imports

### Step 5.3: Final Testing
- Test all pages render correctly
- Verify image optimization works
- Check all links and cross-references
- Performance testing

---

## Rollback Plan

Each step is designed to be non-destructive:
1. Keep Contentful configuration until final switch
2. Use feature flags to toggle between systems
3. Maintain parallel queries during development
4. Keep export scripts for re-running if needed

---

## Success Criteria (Blog Posts Only)

- [x] ✅ All blog post content renders identically to current site
- [x] ✅ Image optimization maintains quality and performance for blog posts  
- [x] ✅ All internal links and cross-references work for blog posts
- [x] ✅ Build times are comparable or better
- [x] ✅ No broken blog post pages or missing content
- [x] ✅ SEO/metadata preserved correctly for blog posts
- [ ] ❌ Artboards still use Contentful
- [ ] ❌ Photo collections still use Contentful  
- [ ] ❌ Site data still uses Contentful

---

## ✅ Blog Post Migration Completed

The blog post migration has been successfully completed. All planned steps for blog posts have been executed:

1. ✅ Content folder structure created
2. ✅ Gatsby configuration updated 
3. ✅ Markdown processing tested and working
4. ✅ All blog posts migrated from Contentful to static markdown
5. ✅ Rich text conversion completed
6. ✅ Images downloaded and properly referenced
7. ✅ Site functionality verified

**Remaining Work**: If needed in the future, artboards, photo collections, and site data can be migrated using similar approaches documented in these files.
