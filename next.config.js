const nextSafe = require("next-safe");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: () => [
    {
      source: "/:path*",
      headers: [
        ...nextSafe({
          isDev: process.env.NODE_ENV !== "production",
          contentSecurityPolicy: {
            "img-src": [
              "'self'",
              "data:",
              "https://lh3.googleusercontent.com",
              "https://i.ytimg.com",
              "https://yt3.ggpht.com"
            ],
            "connect-src": ["'self'", "https://www.googleapis.com"],
            "script-src": ["'self'", "https://www.youtube.com"],
            "frame-src": ["'self'", "https://www.youtube-nocookie.com"],
            "style-src": ["'self'", "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU="]
          },
          permissionsPolicy: {
            fullscreen: ["'self'"]
          }
        }),
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
};

module.exports = nextConfig;
