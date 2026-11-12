import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot_home.png' });

  // Click on Documents folder
  const docsButton = await page.$('button ::-p-text(Documents)');
  if (docsButton) {
    await docsButton.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'screenshot_documents.png' });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
