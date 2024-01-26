const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy for "/api/pwa/list" path
  app.use(
    "/api/pwa/list",
    createProxyMiddleware({
      target: "http://sfamsserver.in",
      changeOrigin: true,
    })
  );

  // Proxy for "/api/pwa/save" path
  app.use(
    "/api/pwa/save",
    createProxyMiddleware({
      target: "http://sfamsserver.in",
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error("Proxy Error:", err);
        res.status(500).send("Proxy Error");
      },
    })
  );

  // General proxy for "/api" path (if needed)
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://sfamsserver.in",
      changeOrigin: true,
    })
  );
};
