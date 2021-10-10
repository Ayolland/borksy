const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

describe('Borksy', () => {
	/** @type puppeteer.Browser */
	let browser;
	/** @type puppeteer.Page */
	let page;

	const download = path.resolve(__dirname, 'myBORKSYgameCustomFilename.html');

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: false,
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

	it('should collapse sections when clicked', async () => {
		await page.click('#about .collapsible_header');
		expect(await page.screenshot()).toMatchImageSnapshot();
	});

	it('should allow game to be customized', async () => {
		// fill out game data
		await page.click('form .collapsible:first-of-type .collapsible_header'); // open title
		await page.type('#title', 'Custom Title');
		await page.type('#filename', 'Custom Filename');
		expect(await page.screenshot()).toMatchImageSnapshot();

		// remove collision on walls
		await page.click('form .collapsible:nth-of-type(3) .collapsible_header'); // open gamedata
		await page.focus('#gamedata');
		await page.keyboard.down('Control');
		await page.keyboard.press('Home');
		await page.keyboard.up('Control');
			for (let i = 0; i < 39; ++i) {
			await page.keyboard.press('ArrowDown');
		}
		await page.keyboard.down('Shift');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.up('Shift');
		await page.keyboard.press('Backspace');
		expect(await page.screenshot()).toMatchImageSnapshot();

		// enable transparent sprites hack
		await page.click('#hacks-section > .collapsible_header'); // open hacks
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] > .collapsible_header'); // open transparent sprites
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] input[type="checkbox"]'); // click checkbox
		expect(await page.screenshot()).toMatchImageSnapshot();
	});

	it('should allow game to be downloaded', async () => {
		// remove download if we already have one
		if (fs.existsSync(download)) {
			await fs.promises.unlink(download);
		}

		await page.click('#download-button'); // start download
		await page.waitForTimeout(2000); // wait for download to finish
		expect(fs.existsSync(download)).toBe(true);
	});

	it('should produce a playable game', async () => {
		await page.goto(`file:///${download.replace(/\\/g, '/')}`, {
			waitUntil: 'networkidle2',
		});
		await page.keyboard.down('ArrowRight'); // complete title dialog
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowRight'); // complete title dialog
		await page.waitForTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot();
		await page.keyboard.down('ArrowRight'); // end title dialog
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowRight'); // end title dialog
		await page.waitForTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot();
	});

	it('should produce a game with hacks applied', async () => {
		// walk on top of wall to demonstrate transparent sprites
		await page.keyboard.down('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.down('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.down('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await page.waitForTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot();
	});
});