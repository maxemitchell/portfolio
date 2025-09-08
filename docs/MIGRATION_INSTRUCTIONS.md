# Local Content Migration Instructions

## Overview
This migration moves your portfolio from Contentful to local file-based content with R2 image hosting.

## Step-by-Step Migration Process

### Phase 1: Export Contentful Data

1. **Install dependencies:**
   ```bash
   npm install contentful --save-dev
   ```

2. **Export Contentful content:**
   ```bash
   node scripts/export-contentful.js
   ```
   This creates:
   - `content/writings/*.md` - Blog posts as markdown
   - `content/artboards/*.json` - Artboard data
   - `content/photo-collections/*.json` - Photo galleries
   - `content/site/*.json` - Site configuration
   - `content/images/r2-urls.json` - Image URL mappings

### Phase 2: Set up R2 Image CDN

1. **Create Cloudflare R2 bucket:**
   - Log into Cloudflare dashboard
   - Go to R2 Object Storage
   - Create bucket named `portfolio-images`

2. **Upload images to R2:**
   ```bash
   # Install Wrangler CLI
   npm install -g wrangler
   
   # Authenticate
   wrangler login
   
   # Upload images (script to be created)
   node scripts/upload-images-to-r2.js
   ```

3. **Set up Cloudflare Worker for image optimization:**
   ```bash
   # Deploy worker (script to be created)
   wrangler deploy scripts/image-worker.js
   ```

4. **Add environment variable:**
   ```bash
   # Add to .env
   GATSBY_R2_CDN_URL=https://images.maxemitchell.com
   ```

### Phase 3: Switch Gatsby Configuration

1. **Backup current config:**
   ```bash
   cp gatsby-config.js gatsby-config.contentful.js
   cp gatsby-node.js gatsby-node.contentful.js
   ```

2. **Switch to local config:**
   ```bash
   cp gatsby-config.local.js gatsby-config.js
   cp gatsby-node.local.js gatsby-node.js
   ```

3. **Update templates:**
   ```bash
   # Backup original templates
   mkdir src/templates/contentful-backup
   cp src/templates/*.js src/templates/contentful-backup/
   
   # Replace with local versions
   cp src/templates/writing.local.js src/templates/writing.js
   cp src/templates/artboard.local.js src/templates/artboard.js
   cp src/templates/photo_collection.local.js src/templates/photo_collection.js
   ```

4. **Update package.json dependencies:**
   ```bash
   # Remove Contentful dependencies
   npm uninstall gatsby-source-contentful @contentful/rich-text-types
   
   # Add local content dependencies (gatsby-plugin-image already installed)
   npm install gatsby-transformer-json gatsby-transformer-remark
   ```

### Phase 4: Update Pages and Components

1. **Update page queries** in:
   - `src/pages/index.js`
   - `src/pages/writings.js` 
   - Other pages that use Contentful data

2. **Update image handling:**
   - Images now use GatsbyImage with remote R2 images
   - Gatsby downloads and processes R2 images at build time
   - Full GatsbyImage optimizations (WebP, blur placeholders, responsive sizes)

### Phase 5: Testing & Validation

1. **Test build:**
   ```bash
   npm run clean
   npm run build
   ```

2. **Test development:**
   ```bash
   npm run develop
   ```

3. **Verify content:**
   - Check all writings load correctly
   - Verify artboards display images
   - Test photo collections
   - Confirm image optimization works

### Phase 6: Deployment

1. **Update environment variables** on hosting platform
2. **Deploy and test** production build
3. **Monitor** for any issues

## Rollback Plan

If issues occur:

1. **Restore Contentful config:**
   ```bash
   cp gatsby-config.contentful.js gatsby-config.js
   cp gatsby-node.contentful.js gatsby-node.js
   cp src/templates/contentful-backup/*.js src/templates/
   ```

2. **Reinstall dependencies:**
   ```bash
   npm install gatsby-source-contentful @contentful/rich-text-types
   ```

3. **Redeploy**

## Benefits After Migration

- ✅ **Version Control**: All content in git
- ✅ **Cost Savings**: No Contentful fees, cheap R2 storage  
- ✅ **Performance**: Faster builds, no API calls
- ✅ **Control**: Full ownership of content and images
- ✅ **Backup**: Easy to backup and restore

## Files Created/Modified

### New Files:
- `content/` - All local content
- `src/components/R2Image.js` - R2 image component
- `gatsby-config.local.js` - Local Gatsby config
- `gatsby-node.local.js` - Local page creation
- `src/templates/*.local.js` - Updated templates
- `scripts/export-contentful.js` - Export script

### Modified Files:
- `gatsby-config.js` (replaced)
- `gatsby-node.js` (replaced)  
- `src/templates/` (replaced)
- `package.json` (dependencies updated)

## Next Steps

1. Run the export script to get your content locally
2. Set up R2 bucket and image optimization
3. Test the migration in development
4. Deploy when ready!
