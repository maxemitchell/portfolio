import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

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
  // Create responsive picture element with WebP support and proper lazy loading
  // Use larger breakpoints if a large width is specified (like for artboards)
  const maxWidth = width || 1200
  const breakpoints = maxWidth > 1200 ? [400, 800, 1200, 1600, 1920] : [400, 800, 1200, 1600]
  
  const webpSrcSet = generateSrcSet(src, breakpoints, { quality, format: 'webp' })
  const jpegSrcSet = generateSrcSet(src, breakpoints, { quality, format: 'jpeg' })
  const fallbackSrc = buildCDNUrl(src, { width: maxWidth, quality, format: 'jpeg' })

  // Adjust sizes based on intended width - larger widths suggest full-width usage
  const sizes = maxWidth > 1200 
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"  // Larger for artboards
    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // Smaller for photo collections

  return (
    <picture {...props}>
      <source
        srcSet={webpSrcSet}
        sizes={sizes}
        type="image/webp"
      />
      <source
        srcSet={jpegSrcSet}
        sizes={sizes}
        type="image/jpeg"
      />
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block'
        }}
        decoding="async"
      />
    </picture>
  )
}

export default CDNImage
