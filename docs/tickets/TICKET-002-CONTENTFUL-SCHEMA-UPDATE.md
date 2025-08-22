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

### 2. Add R2 URL Fields
For each content type, add new fields:
- `featuredImageUrl` (Short text)
- `photosUrls` (Array of Short text) for photo collections
- `artboardUrl` (Short text) for artboards
- Keep existing image fields for rollback safety

### 3. Update Content Type Validations
- Add URL validation patterns
- Set field as "required" once migration complete
- Add help text for content editors

### 4. Content Editor Documentation
- Create guide for editors on new URL fields
- Document R2 URL format and parameters
- Explain transition period workflow

## Acceptance Criteria
- [ ] All content types have new URL fields
- [ ] Existing image fields preserved
- [ ] Field validations configured
- [ ] Help text added for editors
- [ ] Documentation created

## Estimated Time
2-3 hours

## Dependencies
- TICKET-001 (need R2 domain structure)

## Risk/Concerns
- Content model changes affect all environments
- Need clear rollback plan if issues arise
- Editor training required for new workflow
