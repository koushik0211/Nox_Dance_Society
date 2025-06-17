// backend/index.js - NEW FILE
import app from './server.js'; // Use ES Module 'import' to bring in your Express app

export default {
  fetch: app.fetch, // For newer frameworks or adapters
  // Fallback for classic Express apps.
  // This exposes your Express app to the Cloudflare Workers runtime.
  async fetch(request, env, ctx) {
    return app(request, env, ctx);
  },
};