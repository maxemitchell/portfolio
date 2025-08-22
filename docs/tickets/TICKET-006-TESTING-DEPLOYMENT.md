# TICKET-006: Testing and Production Deployment

## Objective
Thoroughly test the R2 migration, deploy to production, and implement monitoring.

## Prerequisites
- TICKET-001 through TICKET-005 completed
- All images migrated and components updated
- Development testing successful

## Tasks

### 1. Local Testing
- Build site locally with `gatsby build`
- Test all pages load correctly
- Verify image loading across all breakpoints
- Check image transformations (resize, format conversion)
- Test lazy loading behavior
- Validate SEO image metadata

### 2. Performance Testing
- Compare load times: before vs after migration
- Test image optimization (WebP/AVIF conversion)
- Measure Lighthouse scores
- Test on various devices/network speeds
- Document performance metrics

### 3. Cross-Browser Testing
- Test on major browsers (Chrome, Firefox, Safari, Edge)
- Verify responsive behavior
- Check image fallback formats work
- Test lazy loading implementation

### 4. Error Handling Testing
- Test behavior with missing images
- Verify error states display properly
- Test Worker rate limiting (if implemented)
- Check graceful degradation

### 5. Production Deployment
- Deploy updated code to production
- Monitor for any broken images
- Check CDN cache behavior
- Verify SSL/HTTPS working correctly

### 6. Post-Deployment Monitoring
- Set up monitoring for R2 usage
- Monitor Worker performance/errors  
- Check image load success rates
- Track CDN bandwidth usage

### 7. Content Editor Testing
- Test content editing workflow with new URL fields
- Verify image uploads to R2 process
- Update content editor documentation
- Train editors on new workflow if needed

### 8. Rollback Plan
- Document rollback procedure
- Test switching back to Contentful images
- Ensure old GraphQL queries can be restored
- Keep Contentful images until stable

## Acceptance Criteria
- [ ] All pages load correctly in production
- [ ] Image loading performance acceptable or improved
- [ ] Cross-browser compatibility confirmed
- [ ] Error handling working properly
- [ ] Monitoring systems in place
- [ ] Content editing workflow functional
- [ ] Rollback plan tested and documented
- [ ] Performance metrics documented

## Estimated Time
3-4 hours

## Dependencies
- All previous tickets completed
- Production deployment access
- Monitoring tools setup

## Risk/Concerns
- Production issues may require immediate rollback
- CDN cache invalidation may be needed
- Performance monitoring should continue post-launch
- User experience disruption if images fail to load
