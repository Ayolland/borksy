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

		await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.resolve(__dirname) });
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
	it('should allow game to be downloaded', async () => {
		await page.click('form .collapsible:first-of-type .collapsible_header'); // open title
		await page.type('#title', 'Custom Title');
		await page.type('#filename', 'Custom Filename');
		await page.click('#download-button');
		await page.waitForTimeout(2000); // TODO: replace with actually checking for file
	});

	it('should produce a playable game', async () => {
		await page.goto(`file:///${path.resolve(__dirname, 'myBORKSYgameCustomFilename.html').replace(/\\/g, '/')}`, {
			waitUntil: 'networkidle2',
		});
		await page.keyboard.down('ArrowRight'); // complete title dialog
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowRight'); // complete title dialog
		await page.waitForTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot();
		await page.keyboard.down('ArrowRight'); // end title dialog
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowRight'); // complete title dialog
		await page.waitForTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot();
	})
});
