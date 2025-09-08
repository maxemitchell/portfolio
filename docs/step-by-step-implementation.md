# Step-by-Step Implementation Guide

## Phase 1: Setup New Markdown System (Parallel to Contentful)

### Step 1.1: Install Required Dependencies
```bash
# These are already installed, just verifying
yarn list gatsby-source-filesystem
yarn list gatsby-transformer-remark
yarn list gatsby-plugin-image
yarn list gatsby-transformer-sharp
```

**What we're doing**: Confirming the required plugins are available for markdown processing.

### Step 1.2: Create Content Folder Structure
```
content/
├── writings/
├── artboards/ 
├── photo-collections/
├── site-data/
└── images/ (shared assets)
```

**What we're doing**: Setting up the local content directory structure to mirror Contentful content types.

### Step 1.3: Configure gatsby-source-filesystem for Content
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

**What we're doing**: Teaching Gatsby to read our local content folder.

### Step 1.4: Test Basic Markdown Processing
Create a test markdown file and verify GraphQL queries work.

---

## Phase 2: Create Migration Tools and Scripts

### Step 2.1: Create Contentful Export Script
**File**: `scripts/export-contentful.js`

Export all content with proper structure for transformation.

**What we're doing**: Creating a script to pull all data from Contentful API for offline processing.

### Step 2.2: Create Content Transformation Utilities
**Files**: 
- `scripts/transform-writings.js`
- `scripts/transform-artboards.js` 
- `scripts/transform-photo-collections.js`

**What we're doing**: Converting Contentful rich text and data structures to markdown format.

### Step 2.3: Create Image Download Script
**File**: `scripts/download-images.js`

**What we're doing**: Downloading all Contentful assets to local storage with proper organization.

---

## Phase 3: Migrate Content Types (Incremental)

### Step 3.1: Start with Artboards (Simplest)
- Export artboard data from Contentful
- Transform to markdown with frontmatter
- Download associated images
- Test new queries work

**Why first**: Artboards have the simplest structure (title, image, description, date).

### Step 3.2: Migrate Photo Collections
- Export photo collection data
- Handle multiple images per collection
- Create markdown files with proper frontmatter

**Why second**: More complex than artboards but simpler than writings.

### Step 3.3: Migrate Writings (Most Complex)
- Export writing data with rich text
- Convert Contentful rich text to markdown
- Handle embedded assets and cross-references
- Preserve all formatting

**Why last**: Most complex due to rich text and cross-references.

### Step 3.4: Migrate Site Data
- Export global site configuration
- Convert to markdown or JSON frontmatter
- Update queries accordingly

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

## Success Criteria

- [ ] All content renders identically to current site
- [ ] Image optimization maintains quality and performance  
- [ ] All internal links and cross-references work
- [ ] Build times are comparable or better
- [ ] No broken pages or missing content
- [ ] SEO/metadata preserved correctly

---

## Next Steps

Please confirm the assumptions in the main migration document, then we can proceed with:
1. Step 1.2 (Create folder structure)
2. Step 1.3 (Update gatsby-config.js) 
3. Step 1.4 (Test basic markdown)

Would you like to start with any particular step or discuss any of these approaches?
