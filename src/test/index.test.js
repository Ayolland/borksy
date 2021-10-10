const path = require('path');
const puppeteer = require('puppeteer');

describe('Borksy', () => {
	/** @type puppeteer.Browser */
	let browser;
	/** @type puppeteer.Page */
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: false,
			devtools: true,
			args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'],
		});
		page = await browser.newPage();

		await page.goto(`file:///${path.resolve(__dirname, '../../docs/index.html').replace(/\\/g, '/')}`, {
			waitUntil: 'networkidle2',
		});

		// hide mascot to avoid noise in snapshots
		await page.evaluate(() => {
			document.querySelector('#mascot').style.visibility = 'hidden';
		});
	});

	afterAll(async () => {
		await browser.close();
	});

	it('should load', async () => {
		expect(await page.screenshot()).toMatchImageSnapshot();
	});
});
