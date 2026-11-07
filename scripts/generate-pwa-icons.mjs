import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ICONS_DIR = path.resolve('public/icons');

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from KaVa logo mark...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Standard 192x192 icon
  await page.setViewport({ width: 192, height: 192, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 192px;
            height: 192px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          }
          .icon-box {
            width: 172px;
            height: 172px;
            border-radius: 40px;
            background: #0ab1ba;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            box-shadow: 0 8px 24px rgba(10, 177, 186, 0.35);
          }
          .icon-text {
            font-size: 84px;
            font-weight: 900;
            letter-spacing: -4px;
            line-height: 1;
            margin-right: -4px;
          }
        </style>
      </head>
      <body>
        <div class="icon-box">
          <span class="icon-text">KV</span>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: path.join(ICONS_DIR, 'icon-192x192.png'), omitBackground: true });
  console.log('Created: icon-192x192.png');

  // 2. Standard 512x512 icon
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 512px;
            height: 512px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          }
          .icon-box {
            width: 460px;
            height: 460px;
            border-radius: 110px;
            background: #0ab1ba;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            box-shadow: 0 20px 60px rgba(10, 177, 186, 0.4);
          }
          .icon-text {
            font-size: 224px;
            font-weight: 900;
            letter-spacing: -10px;
            line-height: 1;
            margin-right: -10px;
          }
        </style>
      </head>
      <body>
        <div class="icon-box">
          <span class="icon-text">KV</span>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: path.join(ICONS_DIR, 'icon-512x512.png'), omitBackground: true });
  console.log('Created: icon-512x512.png');

  // 3. Maskable 512x512 icon (full bleed background, inner content within 80% safe circle)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 512px;
            height: 512px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0ab1ba;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          }
          .safe-zone {
            width: 384px;
            height: 384px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
          }
          .icon-text {
            font-size: 196px;
            font-weight: 900;
            letter-spacing: -8px;
            line-height: 1;
            margin-right: -8px;
          }
        </style>
      </head>
      <body>
        <div class="safe-zone">
          <span class="icon-text">KV</span>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: path.join(ICONS_DIR, 'maskable-512x512.png'), omitBackground: false });
  console.log('Created: maskable-512x512.png');

  await browser.close();
  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

