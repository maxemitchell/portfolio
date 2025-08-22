# TICKET-002: Update Contentful Schema for R2 URLs

## Objective
Modify Contentful content types to support R2 image URLs while maintaining existing image assets during transition.

## Prerequisites
- Contentful space access
- Understanding of current content model
- TICKET-001 completed (to have R2 endpoints ready)

## Tasks

### 1. Audit Current Image Fields
- Document all content types using images:
  - Site Data (featuredImage)
  - Photo Collections (featuredImage, photos array)
  - Artboards (artboard image)
  - Writings (embedded images)
- Note field names and configurations

### 2. Create R2Image Content Type
Create new content type `R2Image` with fields:
- `url` (Short text, required) - R2 CDN URL
- `color` (Short text, required) - hex color for placeholder
- `alt` (Short text, optional) - alt text for accessibility
- `title` (Short text, optional) - internal reference name

### 3. Update Existing Content Types
For each existing content type, add reference fields:
- Site Data: `featuredImageR2` (Reference to R2Image)
- Photo Collections: `featuredImageR2` (Reference to R2Image), `photosR2` (References, many)
- Artboards: `artboardR2` (Reference to R2Image)
- Keep existing image fields for rollback safety

### 4. Update Content Type Validations
- Add URL validation patterns
- Set field as "required" once migration complete
- Add help text for content editors

### 5. Content Editor Documentation
- Create guide for editors on new URL fields
- Document R2 URL format and parameters
- Explain transition period workflow

## Acceptance Criteria
- [ ] R2Image content type created with all fields
- [ ] All existing content types updated with R2 reference fields
- [ ] Existing image fields preserved for rollback
- [ ] Field validations configured (URL patterns, hex color format)
- [ ] Help text added for content editors
- [ ] Documentation created for new workflow

## Estimated Time
2-3 hours

## Dependencies
- TICKET-001 (need R2 domain structure)

## Risk/Concerns
- Content model changes affect all environments
- Need clear rollback plan if issues arise
- Editor training required for new workflow
