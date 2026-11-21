// Builds src/story/sound.json from the scene script: ambience per location, an effect for
// every notable action (entrances, bills, pop-ups, cards, shakes).
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT, say} from './lib.mjs';
const require = createRequire(path.join(ROOT, 'package.json'));
const esbuild = require('esbuild');
const out = path.join(ROOT, 'out', '.scenes.cjs');
await esbuild.build({entryPoints: [path.join(ROOT, 'src/story/shots.tsx')], bundle: true, platform: 'node', format: 'cjs', outfile: out, jsx: 'automatic', loader: {'.json': 'json'}, logLevel: 'error'});
const {SCENES} = require(out);
const amb = {dinner: ['room', 0.05], class: ['hall', 0.05], hall: ['hall', 0.06], school: ['street', 0.05], sidewalk: ['street', 0.06], house: ['street', 0.05], housee: ['street', 0.05], bench: ['street', 0.05], parking: ['street', 0.05], field: ['wind', 0.05], fieldcool: ['wind', 0.04], assembly: ['crowd', 0.06], council: ['hall', 0.06], cafe: ['crowd', 0.05], hospital: ['room', 0.04], bedroom: ['room', 0.04], kitchen: ['room', 0.045]};
const ambience = [];
const sfx = [];
SCENES.forEach((s, i) => {
	const next = SCENES[i + 1];
	const [kind, gain] = amb[s.set] ?? ['room', 0.04];
	ambience.push({from: s.at, to: next ? next.at : 'end', kind, gain});
	if (s.set === 'field' || s.set === 'fieldcool') ambience.push({from: s.at, to: next ? next.at : 'end', kind: 'crowd', gain: 0.02});
	if (s.set === 'dinner') ambience.push({from: s.at, to: next ? next.at : 'end', kind: 'crowd', gain: 0.03});
	for (const b of s.beats) {
		const at = b.n;
		for (const [id, v] of Object.entries(b.mv ?? {})) {
			const [from, to] = Array.isArray(v) ? v : [s.cast[id]?.x ?? 0, v];
			const run = (b.run ?? []).includes(id);
			const len = Math.max(14, Math.min(120, Math.abs(to - from) / (run ? 14 : 8)));
			if (Math.abs(to - from) > 60) sfx.push({at, off: Math.round((b.go ?? 0) * 30), type: 'steps', dur: Math.round((len / 30) * 10) / 10 + 0.2, pan: Math.max(-0.7, Math.min(0.7, ((from + to) / 2 - 960) / 1200))});
		}
		if (b.sh) sfx.push({at, off: 4, type: 'thud', amp: 0.25 * b.sh + 0.1});
		for (const f of b.fx ?? []) {
			const off = f.o ?? 0;
			const t = (type, extra = {}) => sfx.push({at, off, type, ...extra});
			switch (f.k) {
				case 'bill': t('swoosh', {amp: 0.1}); sfx.push({at, off: off + (f.m === 'slow' ? 60 : 36), type: 'pop', amp: 0.1}); break;
				case 'rain': t('whoosh', {amp: 0.12}); break;
				case 'stat': case 'title': t('pop', {amp: 0.1}); break;
				case 'fact': case 'ask': t('swoosh', {amp: 0.1}); break;
				case 'rule': t('click', {amp: 0.25}); break;
				case 'tag': t('pop', {amp: 0.07}); break;
				case 'say': t('pop', {amp: 0.06}); break;
				case 'mark': t(f.text === '✓' ? 'ding' : f.text === '✗' ? 'sent' : 'pop', {amp: 0.1}); break;
				case 'ono': t('thud', {amp: 0.2}); break;
				case 'flash': t('whooshUp', {dur: 0.5, amp: 0.15}); break;
				case 'ambulance': t('siren', {dur: 3.2, amp: 0.025}); break;
				case 'ice': t('splash', {amp: 0.18}); break;
				case 'whistle': t('ding', {amp: 0.06}); break;
				case 'followers': t('chat', {amp: 0.1}); break;
				case 'news': t('whoosh', {amp: 0.1}); break;
				case 'plane': t('whoosh', {amp: 0.1}); break;
				case 'thermo': t('buzz', {dur: 2, amp: 0.01}); break;
				case 'tears': case 'hearts': break;
			}
		}
	}
});
fs.writeFileSync(path.join(ROOT, 'src/story/sound.json'), JSON.stringify({ambience, music: [], sfx}, null, 1));
say(`sound.json: ${ambience.length} ambience beds, ${sfx.length} effects`);
