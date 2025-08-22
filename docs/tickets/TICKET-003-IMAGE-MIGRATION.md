# TICKET-003: Migrate Images from Contentful to R2

## Objective
Export images from Contentful, upload to R2 bucket, and update Contentful entries with R2 URLs.

## Prerequisites
- TICKET-001 completed (R2 bucket and Worker ready)
- TICKET-002 completed (Contentful schema updated)
- Contentful Management API access
- R2 upload capabilities (Wrangler CLI or S3-compatible client)

## Tasks

### 1. Export Images from Contentful
- Use Contentful Management API to fetch all image assets
- Download images with metadata (filename, dimensions, etc.)
- Organize by content type for easier mapping
- Create mapping file: contentful_id → local_filename

### 2. Upload Images to R2
- Batch upload images to R2 bucket
- Maintain organized folder structure:
  - `/profile/` for site data
  - `/collections/` for photo collections
  - `/artboards/` for artboard images
  - `/writings/` for blog images
- Generate R2 URLs for each uploaded image

### 3. Extract Dominant Colors
- Use image analysis library (sharp + node-vibrant) to extract dominant colors
- Generate hex color codes for each uploaded image
- Create mapping: image → {r2_url, dominant_color}

### 4. Create R2Image Entries
- For each uploaded image:
  - Create new R2Image content entry with:
    - `url`: R2 CDN URL
    - `color`: extracted dominant color
    - `alt`: derive from original image metadata
    - `title`: descriptive name for content management
- Use Contentful Management API for batch creation

### 5. Update Original Content Entries
- For each content entry (Site Data, Photo Collections, Artboards):
  - Link to newly created R2Image entries via reference fields
  - Preserve original image fields for rollback
- Batch update via Management API

### 6. Verify Migration
- Spot-check R2 URLs work correctly
- Verify all content entries have new URLs populated
- Test image loading from R2 CDN
- Compare image quality/performance

### 7. Create Migration Scripts
- Script to export from Contentful
- Script to upload to R2  
- Script to update Contentful with new URLs
- Rollback script if needed

## Acceptance Criteria
- [ ] All images uploaded to R2 bucket
- [ ] R2Image content entries created for all images
- [ ] Original content entries linked to R2Image entries
- [ ] Images accessible via CDN
- [ ] Migration mapping documented
- [ ] Rollback capability tested
- [ ] Performance baseline established

## Estimated Time
2-4 hours

## Dependencies
- TICKET-001 (R2 infrastructure)
- TICKET-002 (Contentful schema)

## Risk/Concerns
- Large file transfers may take time
- Need to handle upload failures gracefully
- Contentful API rate limits may slow batch updates
- Image quality/compression differences need verification
