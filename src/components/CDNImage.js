import React from 'react'

const CDN_BASE_URL = process.env.GATSBY_CDN_BASE_URL

const buildCDNUrl = (assetPath, options = {}) => {
  const url = new URL(`${CDN_BASE_URL}/${assetPath}`)
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

const CDNImage = ({
  src,
  alt,
  className = '',
  width = 1200,
  quality = 80,
  aspectRatio,
  dominantColor,
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
}) => {
  const breakpoints = [400, 800, 1200, 1600, 1920]
  const webpSrcSet = generateSrcSet(src, breakpoints, {
    quality,
    format: 'webp',
  })
  const jpegSrcSet = generateSrcSet(src, breakpoints, {
    quality,
    format: 'jpeg',
  })
  const fallbackSrc = buildCDNUrl(src, { width, quality, format: 'jpeg' })

  const sizes =
    width > 1200
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  return (
    <div
      {...props}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: aspectRatio.toString(),
        backgroundColor: dominantColor || 'transparent',
        width: '100%',
        maxWidth: '100%',
        ...props.style,
      }}
    >
      <picture
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
        <source srcSet={jpegSrcSet} sizes={sizes} type="image/jpeg" />
        <img
          src={fallbackSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
            display: 'block',
          }}
          decoding="async"
        />
      </picture>
    </div>
  )
}

export default CDNImage
