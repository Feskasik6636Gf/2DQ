// Writes src/story/sound.json from the scene specs: ambience per location, steps for walk-ins,
// stamps, pops, thuds. node --experimental-strip-types tools/gen-sound.mjs
import fs from 'node:fs';
const TL = JSON.parse(fs.readFileSync('src/story/timeline.json', 'utf8'));
const idx = new Map(TL.lines.map((l, i) => [l.id.slice(0, 3), i]));
const lineOf = (id) => TL.lines[idx.get(id)];
const mods = await Promise.all([1, 2, 3, 4].map((n) => import(`../src/story/specs${n}.ts`)));
const specs = mods.flatMap((m, i) => m[`SPECS${i + 1}`]);
const amb = {server: 'room', void: 'night', block: 'street', parking: 'street', ocean: 'sea', hospital: 'hall', living: 'room', roof: 'wind', grave: 'wind', farm: 'wind', library: 'room', chalk: 'hall', depot: 'hall', night: 'night', bedroom: 'room', kitchen: 'fridge', shop: 'crowd', hall: 'hall', yard: 'street'};
const ambience = [];
specs.forEach((s, i) => {
	const kind = s.p === 'block' && s.night ? 'night' : amb[s.p];
	const next = specs[i + 1]?.at ?? 'end';
	const last = ambience[ambience.length - 1];
	if (last && last.kind === kind) last.to = next;
	else ambience.push({from: s.at, to: next, kind, gain: kind === 'sea' || kind === 'wind' ? 0.07 : 0.05});
});
const sfx = [];
specs.forEach((s, i) => {
	const l0 = lineOf(s.at);
	const nextId = specs[i + 1]?.at;
	const end = nextId ? lineOf(nextId).from : TL.total;
	const dur = Math.max(30, end - l0.from + 6);
	const fr = (v) => (typeof v === 'number' ? Math.round(v * dur) - 6 : (() => { const m = /^(\d+)([+-]\d+)?$/.exec(v); const L = lineOf(m[1]); return L.from - l0.from + (m[2] ? Number(m[2]) : 0); })());
	for (const a of s.a ?? []) {
		if (Array.isArray(a.x) && a.x.some((v, k) => k > 0 && v !== a.x[k - 1])) {
			const [t0, t1] = a.t ?? [0.02, 0.3];
			const off = fr(t0);
			sfx.push({at: s.at, off, type: 'steps', dur: Math.max(0.8, Math.min(3, (fr(t1) - off) / 30)), pan: a.x[0] < 960 ? -0.4 : 0.4});
		}
		if (a.hop) sfx.push({at: s.at, off: fr(a.hop[0]), type: 'pop'});
	}
	for (const it of s.i ?? []) {
		if (it.k === 'stamp') sfx.push({at: s.at, off: it.t ? fr(it.t[0]) : 10, type: 'stamp'});
		else if (it.pop && it.t) sfx.push({at: s.at, off: fr(it.t[0]), type: 'pop'});
		if (it.k === 'ball' && it.slide) sfx.push({at: s.at, off: fr(it.slide[0]) + 20, type: 'thud'});
		if (it.k === 'fire' || it.k === 'grill') sfx.push({at: s.at, off: 4, type: 'crackle'});
	}
	for (const g of s.gx ?? []) {
		if (g.g === 'ono') sfx.push({at: s.at, off: fr(g.t), type: /SHOVE|crack|KNOCK/i.test(g.txt) ? 'thud' : 'pop'});
		if (g.g === 'flash') sfx.push({at: s.at, off: fr(g.t), type: 'whoosh'});
		if (g.g === 'big' && !/^\d/.test(g.txt)) sfx.push({at: s.at, off: fr(g.t[0]), type: 'click'});
		if (g.g === 'count') sfx.push({at: s.at, off: fr(g.t[0]), type: 'ding'});
	}
});
fs.writeFileSync('src/story/sound.json', JSON.stringify({ambience, music: [], sfx}, null, 0));
console.log('ambience', ambience.length, 'sfx', sfx.length);
