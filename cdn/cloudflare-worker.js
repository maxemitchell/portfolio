/**
 * Cloudflare Worker for Portfolio CDN
 *
 * This worker handles image requests, serving them from the R2 bucket and applying
 * on-the-fly transformations using Cloudflare's image optimization.
 *
 * Features:
 * - CORS support for web usage
 * - Parameter validation
 * - Error handling
 */

const CONFIG = {
  IMAGE: {
    DEFAULT_QUALITY: 85,
    MIN_QUALITY: 1,
    MAX_QUALITY: 100,
    SUPPORTED_FORMATS: ['webp', 'avif'],
    DEFAULT_FORMAT: 'webp',
  },
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
}

const CORS_PREFLIGHT_HEADERS = {
  ...CORS_HEADERS,
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      const pathname = url.pathname

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_PREFLIGHT_HEADERS })
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return createErrorResponse('Method not allowed', 405)
      }

      const imagePath = pathname.slice(1)
      const options = parseOptions(url, request)

      const imageRequest = new Request(
        `https://${env.ASSETS_PUBLIC_URL}/${imagePath}`,
        {
          headers: request.headers,
        }
      )

      return fetch(imageRequest, options)
    } catch (error) {
      console.error('Error serving image:', {
        error: error.message,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      })

      return createErrorResponse('Internal Server Error', 500, {
        'Content-Type': 'text/plain',
      })
    }
  },
}

function parseOptions(url, request) {
  const width = url.searchParams.get('width') || url.searchParams.get('w')
  const height = url.searchParams.get('height') || url.searchParams.get('h')
  const quality =
    parseInt(url.searchParams.get('quality') || url.searchParams.get('q')) ||
    CONFIG.IMAGE.DEFAULT_QUALITY
  let format = url.searchParams.get('format') || url.searchParams.get('f')

  if (!format || format === 'auto') {
    const accept = request.headers.get('Accept') || ''

    if (/image\/avif/.test(accept)) {
      format = 'avif'
    } else if (/image\/webp/.test(accept)) {
      format = 'webp'
    } else {
      format = undefined
    }
  } else if (!CONFIG.IMAGE.SUPPORTED_FORMATS.includes(format)) {
    format = CONFIG.IMAGE.DEFAULT_FORMAT
  }

  return {
    cf: {
      image: {
        fit: 'scale-down',
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        quality: Math.min(
          Math.max(quality, CONFIG.IMAGE.MIN_QUALITY),
          CONFIG.IMAGE.MAX_QUALITY
        ),
        format,
      },
    },
  }
}

function createErrorResponse(message, status, additionalHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...additionalHeaders,
    },
  })
}
