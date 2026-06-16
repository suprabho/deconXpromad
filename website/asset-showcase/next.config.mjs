/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` emits a fully static site in ./out
  // that can be published on any static host (Vercel, Netlify, GitHub Pages, S3).
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
