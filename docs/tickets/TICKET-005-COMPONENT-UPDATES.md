# TICKET-005: Update Image Components for R2

## Objective
Replace GatsbyImage components with custom responsive image components that work with R2 CDN URLs.

## Prerequisites
- TICKET-001 completed (R2 CDN functional)
- TICKET-004 completed (queries returning URLs)

## Tasks

### 1. Create R2 Image Component
Build new `src/components/R2Image.js`:
- Accept R2Image object (`{url, color, alt}`) and transformation props (width, height, quality)
- Implement dominant color placeholder loading using `color` field
- Generate R2 URL with query parameters from base `url`
- Handle responsive images with srcset
- Maintain lazy loading capabilities
- Support alt text from R2Image object and CSS classes
- Smooth opacity transition from color to image
- Error handling for failed loads

### 2. Update Core Pages
Replace GatsbyImage usage in:
- `src/pages/index.js`:
  - Profile image: `<R2Image image={data.contentfulSiteData.featuredImageR2} />`
  - Artboard previews: pass `artboardR2` objects to components
  - Photo collection previews: pass `featuredImageR2` objects
- `src/pages/photos.js` - photo collection grid with `featuredImageR2`
- `src/pages/writings.js` - any embedded images

### 3. Update Templates
Replace GatsbyImage in templates:
- `src/templates/photo_collection.js`:
  - Individual photo display: loop through `photosR2` array
  - Modal image viewing: use R2Image objects for modal
  - Update GraphQL query for `photosR2` data
- `src/templates/artboard.js` - use `artboardR2` object for full display
- `src/templates/writing.js` - embedded content images with R2 references

### 4. Update Preview Components
Replace GatsbyImage in:
- `src/components/PhotoCollectionPreview.js`
- `src/components/ArtboardPreview.js`
- Any other image preview components

### 5. Implement Responsive Behavior
- Generate multiple image sizes for responsive design
- Create srcset with different widths (320, 640, 1024, 1200)
- Handle different formats (WebP, AVIF fallbacks)
- Maintain current CSS classes and hover effects

### 6. Performance Optimization
- Implement lazy loading for images below fold
- Add loading states/placeholders
- Optimize image parameters for each use case
- Test loading performance vs original

## Acceptance Criteria
- [ ] R2Image component created and tested
- [ ] All GatsbyImage components replaced
- [ ] Responsive images working correctly
- [ ] Lazy loading implemented
- [ ] Image quality/performance acceptable
- [ ] CSS styling preserved
- [ ] Error handling for missing images
- [ ] Cross-browser compatibility verified

## Estimated Time
4-6 hours

## Dependencies
- TICKET-001 (R2 CDN)
- TICKET-004 (URL queries)

## Risk/Concerns
- Performance regression without gatsby-plugin-image optimizations
- Responsive behavior may need fine-tuning
- CSS styling may need adjustments for new component
- Loading states may appear different
