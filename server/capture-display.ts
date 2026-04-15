import puppeteer from "puppeteer-core"
import path from "path"
import { exec } from "child_process";

const SCREENSHOT_PATH = path.join(__dirname, '../data/display.png');
const DISPLAY_LONG = 800
const DISPLAY_SHORT = 480

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function captureDisplay(isLandscape: boolean) {
  console.log('Capturing display...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  let width = isLandscape ? DISPLAY_LONG : DISPLAY_SHORT
  let height = isLandscape ? DISPLAY_SHORT : DISPLAY_LONG

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/display', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: SCREENSHOT_PATH });
  await browser.close();
  console.log('Display captured.');

  exec(
    `source ~/.virtualenvs/pimoroni/bin/activate && python server/update-display.py ${SCREENSHOT_PATH}`,
    { shell: '/bin/bash' },
    (error, stdout, stderr) => {
      if (error) {
        console.error('Display update failed:', stderr);
      } else {
        console.log('Display updated.');
      }
    }
  )
}

export const debouncedCapture = (isLandscape: boolean = false) => {
    debounce(captureDisplay(isLandscape), 500)
}