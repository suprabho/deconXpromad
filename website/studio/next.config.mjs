import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: deliberately NOT `output: 'export'` — this app needs Node API routes
  // (the /api/export screenshot pipeline). Static export would silently drop them.
  images: { unoptimized: true },
  // Sibling apps under website/ carry their own lockfiles; pin tracing to this
  // app so `next build` traces the right root for the export route.
  outputFileTracingRoot: __dirname,
  // Keep native / browser-driving packages out of the server bundle; they are
  // lazy-imported at runtime inside the export route.
  serverExternalPackages: ['playwright', 'playwright-core', 'sharp', '@sparticuz/chromium'],
  // @sparticuz/chromium ships its chromium as brotli files loaded dynamically at
  // runtime; Next's tracer can't see that require, so force the package into the
  // export function's bundle or the launch fails with "Executable doesn't exist".
  outputFileTracingIncludes: {
    '/api/export': ['./node_modules/@sparticuz/chromium/**'],
  },
};

export default nextConfig;
