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
  const { width = 800, quality = 80, layout = 'constrained' } = options

  const widths = [400, 800, 1200, 1600, 1920].filter((w) => w <= width * 2)
  const srcSet = generateSrcSet(src, widths, { quality, format: 'webp' })
  const baseUrl = buildCDNUrl(src, { width, quality, format: 'webp' })

  return {
    images: {
      fallback: {
        src: baseUrl,
        srcSet,
        sizes:
          layout === 'fixed' ? `${width}px` : '(max-width: 800px) 100vw, 800px',
      },
      sources: [
        {
          srcSet: generateSrcSet(src, widths, { quality, format: 'webp' }),
          sizes:
            layout === 'fixed'
              ? `${width}px`
              : '(max-width: 800px) 100vw, 800px',
          type: 'image/webp',
        },
        {
          srcSet: generateSrcSet(src, widths, { quality, format: 'jpeg' }),
          sizes:
            layout === 'fixed'
              ? `${width}px`
              : '(max-width: 800px) 100vw, 800px',
          type: 'image/jpeg',
        },
      ],
    },
    layout,
    width,
    placeholder: {
      fallback: baseUrl,
    },
  }
}

const CDNImage = ({
  src,
  alt,
  className = '',
  width,
  quality = 80,
  layout = 'constrained',
  loading = 'lazy',
  ...props
}) => {
  const gatsbyImageData = createCDNImageData(src, {
    width,
    quality,
    layout,
  })

  return (
    <GatsbyImage
      image={gatsbyImageData}
      alt={alt}
      className={className}
      loading={loading}
      {...props}
    />
  )
}

export default CDNImage
