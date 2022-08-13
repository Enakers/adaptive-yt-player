const nextSafe = require("next-safe");

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: () => [
    {
      source: "/:path*",
      headers: [
        ...nextSafe({
          isDev,
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
            "style-src": isDev
              ? []
              : [
                  "'self'",
                  "'sha256-+ggG/X5/BziMV+92NuWVuGj96UXUoD0vzVERtSh8Nv4='",
                  "sha256-KkLBTP2id6c7TuTX4KBzGRSZ1GQyIsiVeQF9yWOfUR0="
                ],
            "form-action": ["'self'", "https://yt.enak-nalla.dev/api/auth/signin/google"]
          },
          permissionsPolicy: {
            fullscreen: ["'self'"]
          }
        }),
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload"
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin"
        }
      ]
    }
  ]
};

module.exports = nextConfig;
