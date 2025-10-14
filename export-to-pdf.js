const puppeteer = require('puppeteer');
const path = require('path');

async function exportToPDF() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Export main page
    console.log('Exporting main page...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await page.pdf({
      path: path.join(__dirname, 'improv-formats-main.pdf'),
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true
    });
    console.log('Main page exported: improv-formats-main.pdf');

    // Export Harold page
    console.log('Exporting Harold page...');
    await page.goto('http://localhost:3001/formats/1', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Expand all collapsibles
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const parent = button.closest('[class*="rounded-lg"]');
        if (parent && !button.getAttribute('aria-expanded')) {
          button.click();
        }
      });
    });

    // Wait for animations
    await page.waitForTimeout(500);

    await page.pdf({
      path: path.join(__dirname, 'harold-format.pdf'),
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true
    });
    console.log('Harold page exported: harold-format.pdf');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    console.log('Done!');
  }
}

exportToPDF();
