/**
 * Media Utility to rewrite asset and streaming URLs to route through a CDN proxy.
 * Reduces source server bandwidth load and speeds up media buffering.
 */

// If you link a custom CDN proxy domain (e.g. Cloudflare proxy), set it here.
const CDN_PROXY_HOST: string | null = null; // e.g., 'cdn.akaalseva.org'

export const MediaService = {
  /**
   * Convert a raw source URL to stream from the CDN cache edge.
   */
  getCDNUrl: (rawUrl: string): string => {
    if (!rawUrl || !CDN_PROXY_HOST) {
      return rawUrl;
    }

    try {
      const parsed = new URL(rawUrl);
      
      // Do not proxy localhost or relative streams
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return rawUrl;
      }

      // Rewrite hostname to CDN host, passing the original query or path
      // E.g., https://hs.sgpc.net/kathaaudio/x.mp3 -> https://cdn.akaalseva.org/proxy/kathaaudio/x.mp3
      return `https://${CDN_PROXY_HOST}/proxy?url=${encodeURIComponent(rawUrl)}`;
    } catch (e) {
      // Return raw URL if parsing fails
      return rawUrl;
    }
  },
};
