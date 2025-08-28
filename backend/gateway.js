// const express = require("express");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();
// app.use(express.json());

// app.use("/order", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/completed_order", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/product", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/discontinued_product", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/customizes", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/ingredients", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/options", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
// app.use("/cart", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));

// app.use("/orders", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));

// app.listen(3000, () => {
//     console.log("API Gateway running on port 3000");
// });
