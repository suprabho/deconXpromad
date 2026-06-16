import { sizeFor, type CompositionConfig } from './types';

export type ImageFormat = 'png' | 'webp';

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

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: scale,
    });
    await page.goto(renderUrl, { waitUntil: 'networkidle', timeout: 30_000 });
    // Fonts must be ready or text metrics drift from the editor preview.
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    // Let the aura canvas warm up and settle into a representative frame.
    await page.waitForTimeout(settleMs);

    const el = await page.$('#stage');
    const png = (el
      ? await el.screenshot({ type: 'png' })
      : await page.screenshot({ type: 'png' })) as Buffer;

    if (format === 'webp') {
      const sharp = (await import('sharp')).default;
      return await sharp(png).webp({ quality }).toBuffer();
    }
    return png;
  } finally {
    await browser.close();
  }
}
