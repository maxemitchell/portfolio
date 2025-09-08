export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Handle /original/ prefix for serving raw images from R2
    if (pathname.startsWith('/original/')) {
      const key = pathname.substring('/original/'.length);
      return await serveFromR2(key, env);
    }
    
    // Remove leading slash to get the key
    const key = pathname.substring(1);
    
    if (!key) {
      return new Response('Image path required', { status: 400 });
    }

    // Parse image transformation parameters
    const width = url.searchParams.get('w');
    const height = url.searchParams.get('h');
    const quality = url.searchParams.get('q');
    const format = url.searchParams.get('f') || 'auto';
    const blur = url.searchParams.get('blur');

    // If no transformations requested, serve directly from R2
    if (!width && !height && !blur && !quality && format === 'auto') {
      return await serveFromR2(key, env);
    }

    try {
      // Check if image exists in R2 first
      const exists = await env.PORTFOLIO_IMAGES.head(key);
      
      if (!exists) {
        return new Response('Image not found', { 
          status: 404,
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
      }

      // Build transformation options
      const imageOptions = {};
      
      if (width) imageOptions.width = parseInt(width);
      if (height) imageOptions.height = parseInt(height);
      if (quality) imageOptions.quality = parseInt(quality);
      if (blur) imageOptions.blur = parseInt(blur);
      
      // Handle format negotiation
      if (format === 'auto') {
        const accept = request.headers.get('accept') || '';
        if (accept.includes('image/avif')) {
          imageOptions.format = 'avif';
        } else if (accept.includes('image/webp')) {
          imageOptions.format = 'webp';
        }
        // Otherwise let Cloudflare decide
      } else {
        imageOptions.format = format;
      }
      
      // Create the original image URL that we'll transform
      const originalUrl = `https://${url.hostname}/original/${key}`;
      
      // Apply transformations using Cloudflare's image processing
      const imageRequest = new Request(originalUrl, {
        headers: request.headers
      });
      
      const transformedResponse = await fetch(imageRequest, {
        cf: {
          image: imageOptions
        }
      });

      if (transformedResponse.ok) {
        return new Response(transformedResponse.body, {
          headers: {
            'Content-Type': transformedResponse.headers.get('Content-Type'),
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept'
          }
        });
      }

      // Fallback to original if transformation fails
      return await serveFromR2(key, env);

    } catch (error) {
      console.error('CDN Error:', error);
      return new Response(`Error: ${error.message}`, { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};

// Helper function to serve images directly from R2
async function serveFromR2(key, env) {
  try {
    const object = await env.PORTFOLIO_IMAGES.get(key);
    
    if (!object) {
      return new Response('Image not found', { 
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'ETag': object.etag
      }
    });
  } catch (error) {
    return new Response(`Error serving image: ${error.message}`, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
