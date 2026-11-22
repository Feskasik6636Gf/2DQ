// node tools/stills.mjs out/dir f1 f2 ...   (bundle once, render many stills)
import path from 'node:path';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {ROOT} from './lib.mjs';
const require = createRequire(path.join(ROOT, 'package.json'));
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderStill, openBrowser} = require('@remotion/renderer');
const [dir, ...fr] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
const comp = await selectComposition({serveUrl, id: 'Long', puppeteerInstance: browser});
const q = fr.map(Number);
const worker = async () => {
	while (q.length) {
		const f = q.shift();
		await renderStill({composition: comp, serveUrl, frame: f, output: path.join(dir, String(f).padStart(6, '0') + '.jpg'), imageFormat: 'jpeg', jpegQuality: 70, scale: 0.5, puppeteerInstance: browser, timeoutInMilliseconds: 120000});
	}
};
await Promise.all([worker(), worker(), worker()]);
await browser.close({silent: true});
console.log('done');
