# TICKET-004: Update Gatsby GraphQL Queries

## Objective
Replace `gatsbyImageData` GraphQL queries with URL field queries to fetch R2 image URLs instead of Contentful images.

## Prerequisites
- TICKET-002 completed (Contentful schema updated)
- TICKET-003 completed (images migrated to R2)

## Tasks

### 1. Audit Current Queries
Document all GraphQL queries using image data:
- `src/pages/index.js` - profile, artboards, photo collections
- `src/pages/photos.js` - photo collections listing
- `src/templates/photo_collection.js` - individual photos
- `src/templates/artboard.js` - artboard images
- `src/templates/writing.js` - embedded images

### 2. Update Index Page Query
Replace in `src/pages/index.js`:
```graphql
# FROM:
featuredImage {
  gatsbyImageData(layout: CONSTRAINED, width: 620)
}

# TO:
featuredImageUrl
featuredImageColor
```

### 3. Update Photo Collection Queries
Replace in photo-related queries:
```graphql
# FROM:
featuredImage {
  gatsbyImageData(layout: CONSTRAINED, width: 520)
}
photos {
  gatsbyImageData(layout: CONSTRAINED, width: 600)
  id
}

# TO:
featuredImageUrl
featuredImageColor
photosUrls
photosColors
```

### 4. Update Artboard Queries
Replace in artboard queries:
```graphql
# FROM:
artboard {
  gatsbyImageData(layout: CONSTRAINED, width: 550)
}

# TO:
artboardUrl
artboardColor
```

### 5. Update Component Props
Update component prop passing to use URLs instead of image objects:
- Pass URL strings instead of gatsbyImageData objects
- Update prop types in component definitions
- Maintain component interfaces where possible

### 6. Test Query Changes
- Verify all queries return expected data
- Check that URLs are properly populated
- Test in development environment
- Validate no GraphQL errors

## Acceptance Criteria
- [ ] All GraphQL queries updated to use URL fields
- [ ] No gatsby-plugin-image dependencies in queries
- [ ] All pages/templates updated
- [ ] Component prop interfaces updated
- [ ] Development site builds successfully
- [ ] No GraphQL errors in browser console

## Estimated Time
3-4 hours

## Dependencies
- TICKET-002 (schema changes)
- TICKET-003 (populated URLs)

## Risk/Concerns
- Breaking changes to component interfaces
- Need thorough testing across all pages
- GraphQL caching may require clearing
