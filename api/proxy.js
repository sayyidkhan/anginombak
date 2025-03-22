// Vercel Serverless Function for API Proxying
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  // CORS headers for preflight requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let target = '';
  let pathRewrite = {};
  
  // Route based on the path
  if (req.url.includes('/nominatim')) {
    target = 'https://nominatim.openstreetmap.org';
    pathRewrite = { '^/nominatim': '' };
  }
  
  // If no target is set, return 404
  if (!target) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  // Create and use proxy
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyRes: (proxyRes) => {
      // Add CORS headers to the proxy response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept';
    }
  });

  return proxy(req, res);
};
