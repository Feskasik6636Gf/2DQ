// Builds src/story/sound.json from the scene script (src/story/all.ts): ambience per place,
// footsteps for walks, and a sound for every effect / pop-in prop. Then run make-sound.mjs.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from './lib.mjs';
const require = createRequire(path.join(ROOT, 'package.json'));
const esbuild = require('esbuild');
const out = path.join(ROOT, 'out', '.all.cjs');
esbuild.buildSync({entryPoints: [path.join(ROOT, 'src/story/all.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: out, logLevel: 'error'});
const {ALL} = require(out);
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/story/timeline.json'), 'utf8'));
const lines = TL.lines;
const byPre = (p) => lines.find((l) => l.id.startsWith(p));
const prefixOf = (l) => l.id.slice(0, 3);
const LEAD = 6;
const globalOf = (spec, t) => {
	const start = byPre(spec.at).from - LEAD + (spec.off ?? 0);
	if (typeof t === 'number') return start + t;
	const m = /^(\d{3})(>)?([+-]\d+)?$/.exec(t);
	if (!m) return start;
	const l = byPre(m[1]);
	return (m[2] ? l.from + l.dur : l.from) + (m[3] ? Number(m[3]) : 0);
};
const toCue = (g) => {
	let best = lines[0];
	for (const l of lines) if (l.from <= g) best = l; else break;
	return {at: prefixOf(best), off: Math.round(g - best.from)};
};
const sfx = [];
const add = (spec, t, type, o = {}) => sfx.push({...toCue(globalOf(spec, t)), type, ...o});
const AMB = (p) => (p.startsWith('kitchenN') ? ['fridge', 0.05] : p.startsWith('kitchen') ? ['room', 0.05] : p.startsWith('dining') ? ['crowd', 0.05] : p === 'streetN' ? ['night', 0.06] : p.startsWith('street') || p === 'bakery' ? ['street', 0.06] : p === 'lab' ? ['room', 0.04] : p === 'fridge' ? ['fridge', 0.07] : p === 'bedroom' ? ['room', 0.04] : ['wind', 0.025]);
for (const s of ALL) {
	for (const a of s.a ?? []) {
		if (a.walk) {
			const t0 = globalOf(s, a.walk[0]);
			const t1 = globalOf(s, a.walk[1]);
			const x = Array.isArray(a.x) ? a.x : [a.x, a.x];
			add(s, a.walk[0], a.run ? 'steps' : 'steps', {dur: Math.max(0.5, (t1 - t0) / 30), pan: Math.max(-0.8, Math.min(0.8, ((x[0] + x[1]) / 2 - 960) / 1200)), amp: a.run ? 0.35 : 0.25});
		}
	}
	for (const p of s.pr ?? []) if (p.pop && p.show) add(s, p.show[0], 'pop', {amp: 0.12});
	for (const f of s.fx ?? []) {
		if (f.k === 'sfx' && ['fridge','crowd','night','street','room','hall','rain','wind','sea'].includes(f.type)) continue;
		if (f.k === 'sfx') add(s, f.t, f.type, {...(f.amp ? {amp: f.amp} : {}), ...(f.dur ? {dur: f.dur} : {})});
		else if (f.k === 'spark') add(s, f.t, 'sparkle', {amp: 0.15});
		else if (f.k === 'confetti') add(s, f.t, 'success', {amp: 0.25});
		else if (f.k === 'bulb') add(s, f.t, 'ding', {amp: 0.2});
		else if (f.k === 'speed') add(s, f.t, 'whoosh', {amp: 0.2});
		else if (f.k === 'flash') add(s, f.t, 'shutter', {amp: 0.2});
	}
}
// ambience: merge consecutive shots with the same bed
const amb = [];
ALL.forEach((s, i) => {
	const [kind, gain] = AMB(s.p);
	const from = byPre(s.at);
	const prev = amb[amb.length - 1];
	if (prev && prev.kind === kind) return;
	if (prev) prev.to = prefixOf(from);
	amb.push({from: i === 0 ? '001' : prefixOf(from), to: 'end', kind, gain});
});
const spec = {ambience: amb, music: [], sfx: sfx.sort((a, b) => a.at.localeCompare(b.at) || a.off - b.off)};
fs.writeFileSync(path.join(ROOT, 'src/story/sound.json'), JSON.stringify(spec, null, 1));
console.log(`sound.json: ${amb.length} ambience beds, ${sfx.length} sfx`);
