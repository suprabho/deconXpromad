import { sizeFor, type CompositionConfig } from './types';
import type { Browser } from 'playwright-core';

export type ImageFormat = 'png' | 'webp';

/** True when running on Vercel/AWS Lambda, where there is no bundled Playwright
 *  browser and we must launch a Lambda-built chromium instead. */
const IS_SERVERLESS = !!process.env.VERCEL_ENV || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Get a headless chromium.
 *
 * - Serverless (Vercel/Lambda): the full `playwright` package's browser binary
 *   is never present in the function bundle, so we launch @sparticuz/chromium —
 *   a Lambda-compatible chromium build — through `playwright-core`. Graphics mode
 *   is turned OFF: the /render export surface paints the aura as a cached <img>
 *   still, never the live WebGL iframe (BackgroundLayer only mounts the iframe in
 *   the editor), so GPU/WebGL is dead weight here. Disabling it gives a lighter,
 *   more stable headless shell and removes the swiftshader GL crash surface — the
 *   usual cause of "Target page/browser has been closed" mid-load when the
 *   function is memory-constrained.
 * - Local dev / any long-running host: use full `playwright` with its bundled
 *   chromium (downloaded by the postinstall step).
 */
async function launchBrowser(): Promise<Browser> {
  if (IS_SERVERLESS) {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    const { chromium } = await import('playwright-core');
    sparticuz.setGraphicsMode = false;
    return chromium.launch({
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }
  const { chromium } = await import('playwright');
  return chromium.launch({ headless: true });
}

/**
 * Render a composition to an image by driving a real headless browser to the
 * chrome-less /render route and screenshotting the #stage element. A real
 * browser is required because the aura background is a cross-origin iframe that
 * cannot be captured client-side (canvas taint) — the browser composites it into
 * the pixels for us. Mirrors header-studio's screenshot engine.
 */
export async function renderComposition(
  renderUrl: string,
  config: CompositionConfig,
  opts: { scale?: number; settleMs?: number; format?: ImageFormat; quality?: number } = {},
): Promise<Buffer> {
  const { scale = 2, settleMs = 2600, format = 'png', quality = 90 } = opts;
  const size = sizeFor(config.sizeId);

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: scale,
    });
    // 'load' (not 'networkidle'): the export surface is static — its only async
    // resource is the cached aura <img>, which 'load' waits for — so we don't need
    // to wait out network quiescence, which Playwright discourages and which keeps
    // the heavy page alive longer (a wider window for an OOM kill mid-navigation).
    await page.goto(renderUrl, { waitUntil: 'load', timeout: 30_000 });
    // Fonts must be ready or text metrics drift from the editor preview.
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    // Let the aura canvas warm up and settle into a representative frame.
    await page.waitForTimeout(settleMs);

    // Capture #stage via a raw CDP screenshot with captureBeyondViewport:true.
    // Why not page/element .screenshot(): Playwright's clip path reads chromium's
    // ON-SCREEN compositor surface (captureBeyondViewport:false). On
    // @sparticuz/chromium's single-process headless shell that surface either
    // isn't available ("Unable to capture screenshot") or, with the
    // perpetually-animating WebGL aura, never produces a stable frame and the
    // call hangs to the 30s timeout. Rendering the clip region OFF-SCREEN
    // (captureBeyondViewport:true) is surface-independent and also sidesteps
    // Playwright's per-element stability/scroll actionability. NOTE: in
    // captureBeyondViewport mode chromium ignores the emulated deviceScaleFactor
    // for output sizing (px = css * clip.scale), so the retina multiplier must be
    // carried by clip.scale — the page still lays out at deviceScaleFactor, so the
    // raster stays crisp.
    const el = await page.$('#stage');
    const box = (el && (await el.boundingBox())) || { x: 0, y: 0, width: size.width, height: size.height };
    const client = await page.context().newCDPSession(page);
    const png = await Promise.race([
      client
        .send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale },
          captureBeyondViewport: true,
        })
        .then((r: { data: string }) => Buffer.from(r.data, 'base64')),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('captureScreenshot timed out after 45s')), 45_000),
      ),
    ]);
    await client.detach().catch(() => {});

    if (format === 'webp') {
      const sharp = (await import('sharp')).default;
      return await sharp(png).webp({ quality }).toBuffer();
    }
    return png;
  } finally {
    await browser.close();
  }
}
