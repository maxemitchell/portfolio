# TICKET-001: R2 Bucket and Cloudflare Worker Setup

## Objective
Set up Cloudflare R2 bucket and Worker for image CDN with on-the-fly optimization.

## Prerequisites
- Cloudflare account
- Domain added to Cloudflare
- R2 access enabled in account

## Tasks

### 1. Create R2 Bucket
- Navigate to Cloudflare dashboard → R2
- Create new bucket (suggested name: `portfolio-images`)
- Configure bucket settings (public access, CORS if needed)
- Note bucket name and connection details

### 2. Create Cloudflare Worker
- Create new Worker script
- Implement image optimization logic:
  - Handle GET requests for images
  - Parse URL parameters (width, height, quality, format)
  - Fetch images from R2 bucket
  - Apply transformations using `cf.image`
  - Set cache headers
  - Error handling for missing images

### 3. Configure Worker Bindings
- Bind R2 bucket to Worker (name: `PORTFOLIO_IMAGES`)
- Optional: Bind KV namespace for rate limiting
- Set environment variables as needed

### 4. Set Up Custom Domain
- Create Worker Route for subdomain (e.g., `cdn.maxemitchell.com`)
- Add CNAME DNS record pointing to Worker
- Test domain accessibility

### 5. Test Image Delivery
- Upload test image to R2 bucket
- Verify image loads via Worker URL
- Test transformation parameters (?w=800&f=webp)
- Verify caching behavior

## Acceptance Criteria
- [ ] R2 bucket created and accessible
- [ ] Worker deployed and functioning
- [ ] Custom domain working (cdn.maxemitchell.com)
- [ ] Image transformations working
- [ ] Cache headers properly set
- [ ] Error handling for missing images

## Estimated Time
4-6 hours

## Dependencies
None

## Risk/Concerns
- Domain setup may require DNS propagation time
- Image transformation limits need testing with portfolio images
