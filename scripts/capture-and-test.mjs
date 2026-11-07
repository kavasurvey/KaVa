import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\Zayd Tahir\\.gemini\\antigravity\\brain\\8f11da39-ba27-458b-af6e-84e43f7003ef\\screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const targets = [
    { name: 'landing', url: 'http://localhost:3000/' },
    { name: 'login', url: 'http://localhost:3000/login' },
    { name: 'forgot-password', url: 'http://localhost:3000/forgot-password' }
  ];

  const viewports = [
    { label: '1920', width: 1920, height: 1080 },
    { label: '390', width: 390, height: 844, isMobile: true }
  ];

  for (const target of targets) {
    for (const vp of viewports) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile || false,
        hasTouch: vp.isMobile || false
      });

      // 1. Light Mode
      await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        localStorage.setItem('kava-theme', 'light');
      });
      await new Promise(r => setTimeout(r, 600));

      const lightFile = path.join(SCREENSHOT_DIR, `${target.name}-light-${vp.label}.png`);
      await page.screenshot({ path: lightFile, fullPage: target.name === 'landing' || vp.label === '390' });
      console.log(`Captured: ${lightFile}`);

      // 2. Dark Mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('kava-theme', 'dark');
      });
      await new Promise(r => setTimeout(r, 600));

      const darkFile = path.join(SCREENSHOT_DIR, `${target.name}-dark-${vp.label}.png`);
      await page.screenshot({ path: darkFile, fullPage: target.name === 'landing' || vp.label === '390' });
      console.log(`Captured: ${darkFile}`);
    }
  }

  // --- Behavioral Verifications ---
  console.log('\n--- Running Automated Verification Checks ---');

  // Check 1: Unauthenticated access to /dashboard redirects to /login
  await page.deleteCookie({ name: 'kava_session', domain: 'localhost' });
  await page.deleteCookie({ name: 'kava_user', domain: 'localhost' });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  const redirectedUrl = page.url();
  console.log('Check 1 (Unauthenticated /dashboard redirect):', redirectedUrl.includes('/login') ? 'PASS (Redirected to ' + redirectedUrl + ')' : 'FAIL');

  // Check 2: /signup route is blocked and redirects to /login
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle2' });
  const signupUrl = page.url();
  console.log('Check 2 (/signup blocked & redirected):', signupUrl.includes('/login') ? 'PASS (Redirected to ' + signupUrl + ')' : 'FAIL');

  // Check 3: Login form validation
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  const emailInput = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');
  const submitButton = await page.$('button[type="submit"]');

  if (emailInput && passwordInput && submitButton) {
    console.log('Check 3 (Login Form Elements Present): PASS');
  } else {
    console.log('Check 3 (Login Form Elements Present): FAIL');
  }

  // Check 4: Testing login attempt with demo credentials
  await emailInput.type('coordinator@dmaf-kassep.org');
  await passwordInput.type('Kassep@2026!');
  await submitButton.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  console.log('Check 4 (Active user sign-in & redirect): Current URL =', page.url());

  await browser.close();
  console.log('All screenshot captures and tests completed!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});

