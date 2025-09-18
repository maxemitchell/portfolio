import React, { useState } from 'react'

const CDN_BASE_URL = process.env.GATSBY_CDN_BASE_URL

const buildCDNUrl = (assetPath, options = {}) => {
  const url = new URL(`${CDN_BASE_URL}${assetPath}`)

  if (options.width) url.searchParams.set('w', options.width)
  if (options.quality) url.searchParams.set('q', options.quality)
  if (options.format) url.searchParams.set('f', options.format)

  return url.toString()
}

const generateSrcSet = (assetPath, widths, options = {}) => {
  return widths
    .map((w) => {
      const url = buildCDNUrl(assetPath, { ...options, width: w })
      return `${url} ${w}w`
    })
    .join(', ')
}

const createCDNImageData = (src, options = {}) => {
  const { width, height, quality = 80, layout = 'constrained', aspectRatio } = options

  // If no width specified for constrained layout, create a flexible structure
  // that doesn't force container dimensions
  if (!width && layout === 'constrained') {
    const baseUrl = buildCDNUrl(src, { quality, format: 'webp' })
    
    return {
      images: {
        fallback: {
          src: baseUrl,
          srcSet: generateSrcSet(src, [400, 800, 1200], { quality, format: 'webp' }),
          sizes: '100vw',
        },
        sources: [
          {
            srcSet: generateSrcSet(src, [400, 800, 1200], { quality, format: 'webp' }),
            sizes: '100vw',
            type: 'image/webp',
          },
        ],
      },
      layout,
      placeholder: {
        fallback: baseUrl,
      },
    }
  }

  // For cases with specific dimensions
  const imageWidth = width || 800
  
  // Calculate height based on aspect ratio or use provided height
  let imageHeight = height
  if (!imageHeight && aspectRatio) {
    imageHeight = Math.round(imageWidth / aspectRatio)
  }

  const widths = [400, 800, 1200, 1600, 1920].filter((w) => w <= imageWidth * 2)
  const srcSet = generateSrcSet(src, widths, { quality, format: 'webp' })
  const baseUrl = buildCDNUrl(src, { width: imageWidth, quality, format: 'webp' })

  const gatsbyImageData = {
    images: {
      fallback: {
        src: baseUrl,
        srcSet,
        sizes:
          layout === 'fixed' ? `${imageWidth}px` : '(max-width: 800px) 100vw, 800px',
      },
      sources: [
        {
          srcSet: generateSrcSet(src, widths, { quality, format: 'webp' }),
          sizes:
            layout === 'fixed'
              ? `${imageWidth}px`
              : '(max-width: 800px) 100vw, 800px',
          type: 'image/webp',
        },
        {
          srcSet: generateSrcSet(src, widths, { quality, format: 'jpeg' }),
          sizes:
            layout === 'fixed'
              ? `${imageWidth}px`
              : '(max-width: 800px) 100vw, 800px',
          type: 'image/jpeg',
        },
      ],
    },
    layout,
    width: imageWidth,
    placeholder: {
      fallback: baseUrl,
    },
  }

  // Add height if we have it
  if (imageHeight) {
    gatsbyImageData.height = imageHeight
  }

  return gatsbyImageData
}

/**
 * Load image metadata from build-time generated files
 */
const loadImageMetadata = (src) => {
  try {
    // Extract collection slug and image number from path like "/photo_collections/devils-lake-2024/12.jpg"
    const match = src.match(/\/photo_collections\/([^\/]+)\/(\d+)\.jpg/)
    if (!match) return null

    const [, slug, imageNumber] = match
    
    // Import the metadata file (this will be available after build step)
    const metadata = require(`../../content/photo-collections/${slug}/images.json`)
    return metadata.find(img => img.number === parseInt(imageNumber))
  } catch (error) {
    return null
  }
}

const CDNImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  layout = 'constrained',
  loading = 'lazy',
  objectFit,
  objectPosition,
  aspectRatio,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Try to load pre-generated image metadata
  const imageMetadata = loadImageMetadata(src)
  
  // Use metadata if available, otherwise fall back to defaults
  const imageWidth = width || imageMetadata?.width || 1200
  const imageHeight = height || imageMetadata?.height
  const imageAspectRatio = aspectRatio || imageMetadata?.aspectRatio
  const dominantColor = imageMetadata?.dominantColor || '#f0f0f0'
  
  const breakpoints = imageWidth > 1200 ? [400, 800, 1200, 1600, 1920] : [400, 800, 1200, 1600]
  const webpSrcSet = generateSrcSet(src, breakpoints, { quality, format: 'webp' })
  const jpegSrcSet = generateSrcSet(src, breakpoints, { quality, format: 'jpeg' })
  const fallbackSrc = buildCDNUrl(src, { width: imageWidth, quality, format: 'jpeg' })

  // Generate blur placeholder using existing CDN with tiny dimensions and low quality
  const blurPlaceholder = buildCDNUrl(src, { 
    width: 20, 
    quality: 20, 
    format: 'webp' 
  })

  // Adjust sizes based on intended width
  const sizes = imageWidth > 1200 
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"  // Larger for artboards
    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // Smaller for photo collections

  // Common container styles for layout shift prevention
  const containerStyle = {
    backgroundColor: dominantColor,
    position: 'relative',
    overflow: 'hidden',
    ...props.style
  }

  // Apply aspect ratio if available to prevent layout shift
  if (imageAspectRatio) {
    containerStyle.aspectRatio = imageAspectRatio.toString()
  } else if (imageHeight && imageWidth) {
    containerStyle.aspectRatio = (imageWidth / imageHeight).toString()
  } else {
    // Fallback: ensure container has some height for images without metadata
    containerStyle.minHeight = '200px'
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div {...props} style={containerStyle}>
      {/* Blur placeholder layer - shows until main image loads */}
      {!imageLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${blurPlaceholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px)',
            transform: 'scale(1.05)', // Slight scale to hide blur edges
            zIndex: 1
          }}
        />
      )}
      
      {/* Main image */}
      <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
        <source srcSet={jpegSrcSet} sizes={sizes} type="image/jpeg" />
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          loading={loading}
          onLoad={handleImageLoad}
          onError={(e) => console.error('Image failed to load:', fallbackSrc, e)}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: objectFit || 'cover',
            objectPosition: objectPosition || 'center',
            display: 'block',
            transition: 'opacity 0.3s ease-in-out',
            opacity: imageLoaded ? 1 : 0,
            zIndex: 2
          }}
          decoding="async"
        />
      </picture>
    </div>
  )
}

export default CDNImage
