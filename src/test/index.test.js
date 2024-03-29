const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { setTimeout } = require('node:timers/promises');

// tests are sequential, which makes subsequent failures after the first confusing;
// this causes individual checks to skip after the first failure
// based on https://stackoverflow.com/a/69104498
let hasTestFailed = false;
function sit(name, action) {
	it(name, async () => {
		if (hasTestFailed) {
			console.warn(`[skipped]: ${name}`);
		} else {
			try {
				await action();
			} catch (error) {
				hasTestFailed = true;
				throw error;
			}
		}
	});
}

describe('Borksy', () => {
	/** @type puppeteer.Browser */
	let browser;
	/** @type puppeteer.Page */
	let page;

	const download = path.resolve(__dirname, 'myBORKSYgameCustomFilename.html');

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: 'new',
		});
		page = await browser.newPage();
		await page.evaluateOnNewDocument(() => {
			localStorage.clear();
		});
		await page.emulateMediaFeatures([
			{
				name: 'prefers-color-scheme',
				value: 'light',
			},
			{
				name: 'prefers-reduced-motion',
				value: 'no-preference',
			},
		]);

		// eslint-disable-next-line no-underscore-dangle
		await page._client().send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.resolve(__dirname) });
		await page.goto('http://localhost:5000', {
			waitUntil: 'networkidle2',
		});

		await page.evaluate(() => {
			// hide mascot to avoid noise in snapshots
			document.querySelector('#mascot').style.visibility = 'hidden';
			// replace "last update" with fixed string to avoid noise in snapshots
			document.querySelector('#last-update').textContent = 'running automated tests';
			// disable spellcheck to avoid noise in snapshots (spellcheck is async)
			Array.from(document.querySelectorAll('textarea, input')).forEach(i => {
				// eslint-disable-next-line no-param-reassign
				i.spellcheck = false;
			});
		});
	});

	afterAll(async () => {
		await browser.close();
	});

	sit('should load', async () => {
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should collapse sections when clicked', async () => {
		await page.click('#about .collapsible_header');
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should allow game to be customized', async () => {
		// fill out game data
		await page.click('form > .collapsible:first-of-type > .collapsible_header'); // open title
		await page.type('#title', 'Custom Title');
		await page.type('#filename', 'Custom Filename');
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });

		// remove collision on walls
		await page.click('form > .collapsible:nth-of-type(3) > .collapsible_header'); // open gamedata
		await page.focus('#gamedata');
		await page.keyboard.down('Control');
		await page.keyboard.press('Home');
		await page.keyboard.up('Control');
		for (let i = 0; i < 46; ++i) {
			// eslint-disable-next-line no-await-in-loop
			await page.keyboard.press('ArrowDown');
		}
		await page.keyboard.down('Shift');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.up('Shift');
		await page.keyboard.press('Backspace');
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });

		// enable transparent sprites hack
		await page.click('#hacks-section > .collapsible_header'); // open hacks
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] > .collapsible_header'); // open transparent sprites
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] input[type="checkbox"]'); // click checkbox
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] .collapsible:first-of-type > .collapsible_header'); // open hack options
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });

		// customize `isTransparent` check in `gameOptions`
		await page.focus('.collapsible[data-associated-hack="transparent-sprites"] [data-default-type="hackOptions"]');
		await page.keyboard.down('Control');
		await page.keyboard.press('Home');
		await page.keyboard.up('Control');
		await page.keyboard.press('End');
		await page.keyboard.type('\n\treturn drawing === player();');
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should include hack READMEs', async () => {
		await page.click('.collapsible[data-associated-hack="transparent-sprites"] .collapsible:last-of-type > .collapsible_header');
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should allow custom javascript to be added', async () => {
		await page.click('form > .collapsible:last-of-type > .collapsible_header'); // open additional js
		await page.focus('#additionalJS');
		await page.keyboard.type(`
requestAnimationFrame(() => {
	var el = document.createElement('div');
	el.textContent = 'test';
	el.style.position = 'fixed';
	el.style.top = '0';
	el.style.left = '0';
	el.style.color='white';
	document.body.appendChild(el);
	window.animationTime = 3000;
});
`);
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should allow game to be downloaded', async () => {
		// remove download if we already have one
		if (fs.existsSync(download)) {
			await fs.promises.unlink(download);
		}

		await page.click('#download-button'); // start download
		await setTimeout(2000); // wait for download to finish
		expect(fs.existsSync(download)).toBe(true);
	});

	sit('should produce a playable game', async () => {
		await page.goto(`file:///${download.replace(/\\/g, '/')}`, {
			waitUntil: 'networkidle2',
		});
		await page.keyboard.down('ArrowRight'); // complete title dialog
		await setTimeout(100);
		await page.keyboard.up('ArrowRight'); // complete title dialog
		await setTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
		await page.keyboard.down('ArrowRight'); // end title dialog
		await setTimeout(100);
		await page.keyboard.up('ArrowRight'); // end title dialog
		await setTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should produce a game with hacks applied', async () => {
		// walk on top of wall to demonstrate transparent sprites
		await page.keyboard.down('ArrowLeft');
		await setTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await setTimeout(100);
		await page.keyboard.down('ArrowLeft');
		await setTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await setTimeout(100);
		await page.keyboard.down('ArrowLeft');
		await setTimeout(100);
		await page.keyboard.up('ArrowLeft');
		await setTimeout(100);
		await setTimeout(2000); // wait long enough for second animation frame
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});

	sit('should include customized hackOptions', async () => {
		// move dog onto wall to demonstrate `isTransparent` check
		await page.evaluate(() => {
			window.sprite.a.x = 1;
			window.drawRoom(window.room[window.state.room], { redrawAll: true });
		});
		await setTimeout(100);
		expect(await page.screenshot()).toMatchImageSnapshot({ dumpDiffToConsole: process.env.CI });
	});
});
