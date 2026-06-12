/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` emits a fully static site in ./out
  // that can be published on any static host (Vercel, Netlify, GitHub Pages, S3).
  output: 'export',
  trailingSlash: true,
  // The concept prototypes live in public/prototypes/<slug>/index.html and are
  // linked as /prototypes/<slug>/. Vercel (and most static hosts) resolve the
  // directory URL to index.html, but `next dev` only serves public files at
  // their exact path — this dev-only rewrite closes that gap. It must not be
  // defined for production builds: rewrites are incompatible with `output: export`.
  ...(process.env.NODE_ENV === 'development'
    ? {
        async rewrites() {
          return [
            {
              source: '/prototypes/:slug',
              destination: '/prototypes/:slug/index.html',
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
