/**
 * Cloudflare Worker for Portfolio CDN
 *
 * This worker handles image requests, serving them from the R2 bucket and applying
 * on-the-fly transformations using Cloudflare's image optimization.
 *
 * Features:
 * - Rate limiting to prevent abuse
 * - CORS support for web usage
 * - Parameter validation
 * - Error handling
 */

const CONFIG = {
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_SECONDS: 60,
  },
  CACHE: {
    MAX_AGE: 31536000, // 1 year in seconds
  },
  IMAGE: {
    DEFAULT_QUALITY: 85,
    MIN_QUALITY: 1,
    MAX_QUALITY: 100,
    SUPPORTED_FORMATS: ['webp', 'avif', 'jpeg', 'png', 'auto'],
    DEFAULT_FORMAT: 'auto',
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

      const clientIP = request.headers.get('cf-connecting-ip')
      const rateLimitResult = await checkRateLimit(env, clientIP)
      if (rateLimitResult) {
        return rateLimitResult
      }

      const imagePath = pathname.slice(1)
      const imageParams = parseImageParams(url)

      const object = await env.R2_BUCKET.get(imagePath)
      if (!object) {
        return createErrorResponse('Image not found', 404)
      }

      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata.contentType || 'image/jpeg',
          'Cache-Control': `public, max-age=${CONFIG.CACHE.MAX_AGE}`,
          ...CORS_HEADERS,
          Vary: 'Accept',
          'X-Content-Source': 'cloudflare-r2',
        },
        cf: {
          image: {
            fit: 'scale-down',
            ...imageParams,
          },
        },
      })
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

async function checkRateLimit(env, clientIP) {
  const rateLimitKey = `ratelimit:${clientIP}`
  const currentRequests = parseInt((await env.KV.get(rateLimitKey)) || '0')

  if (currentRequests > CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    return createErrorResponse('Rate limit exceeded', 429)
  }

  await env.KV.put(rateLimitKey, (currentRequests + 1).toString(), {
    expirationTtl: CONFIG.RATE_LIMIT.WINDOW_SECONDS,
  })

  return null
}

function parseImageParams(url) {
  const width = url.searchParams.get('w')
  const height = url.searchParams.get('h')
  const quality =
    parseInt(url.searchParams.get('q')) || CONFIG.IMAGE.DEFAULT_QUALITY
  const format = url.searchParams.get('f') || CONFIG.IMAGE.DEFAULT_FORMAT

  return {
    width: width ? parseInt(width) : undefined,
    height: height ? parseInt(height) : undefined,
    quality: Math.min(
      Math.max(quality, CONFIG.IMAGE.MIN_QUALITY),
      CONFIG.IMAGE.MAX_QUALITY
    ),
    format: CONFIG.IMAGE.SUPPORTED_FORMATS.includes(format)
      ? format
      : CONFIG.IMAGE.DEFAULT_FORMAT,
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
