import {S1} from './s1';
import {S2} from './s2';
import {S3} from './s3';
import {S4} from './s4';
import {S5} from './s5';
import {S6} from './s6';
import {LINES} from '../kit/core';

const all = [...S1, ...S2, ...S3, ...S4, ...S5, ...S6].map((s) => s.spec);
const KIND: Record<string, [string, number]> = {
	courtyard: ['crowd', 0.05], courtyardNoCouch: ['crowd', 0.05], courtyardNight: ['night', 0.06], courtyardFire: ['night', 0.06],
	kitchen: ['fridge', 0.04], kitchenNight: ['fridge', 0.04], bedroomNight: ['night', 0.05], bedroom: ['room', 0.04], hall: ['hall', 0.05], hall3: ['hall', 0.05], hallNight: ['night', 0.05], hallOpen: ['night', 0.05],
	roof: ['wind', 0.05], roofNight: ['wind', 0.05], roofSmoke: ['wind', 0.05], market: ['crowd', 0.06], vet: ['room', 0.04], zoo: ['wind', 0.04], alley: ['night', 0.06], basement: ['fridge', 0.07], basementAlarm: ['fridge', 0.07],
	park: ['wind', 0.04], city: ['street', 0.06], school: ['hall', 0.05], classroom: ['room', 0.04], elevator: ['room', 0.03], nightStreet: ['night', 0.06], shop: ['room', 0.04],
	info: ['night', 0.02], infoWarm: ['room', 0.02], infoGreen: ['night', 0.02], infoRed: ['night', 0.02], infoDay: ['wind', 0.02],
};
const amb: any[] = [];
all.forEach((s, i) => {
	const next = all[i + 1]?.at;
	const k = KIND[s.loc] ?? ['room', 0.04];
	amb.push({from: s.at, to: next ?? 'end', kind: k[0], gain: k[1]});
});
// merge neighbours of the same kind
const merged: any[] = [];
for (const a of amb) {
	const l = merged[merged.length - 1];
	if (l && l.kind === a.kind && l.gain === a.gain) l.to = a.to;
	else merged.push({...a});
}
const sfx: any[] = [];
const off = (t: any): [string, number] => {
	if (typeof t === 'number') return [all[0].at, t];
	const m = /^(\d{3})(e)?([+-]\d+)?$/.exec(t)!;
	let o = m[3] ? parseInt(m[3]) : 0;
	if (m[2]) {
		const l = LINES.find((x) => x.id.startsWith(m[1]))!;
		o += l.dur;
	}
	return [m[1], o];
};
const add = (t: any, type: string, extra: any = {}) => {
	const [at, o] = off(t);
	sfx.push({at, off: o, type, ...extra});
};
for (const s of all) {
	for (const p of s.cast ?? []) for (const m of p.mv ?? []) {
		const [a, o] = off(m[0]);
		const [, o2] = off(m[1]);
		const dur = Math.max(0.5, Math.min(4, ((LINES.find((x) => x.id.startsWith(a))!.from + o2) - (LINES.find((x) => x.id.startsWith(a))!.from + o)) / 30));
		add(m[0], 'steps', {dur, pan: 0});
	}
	for (const fx of s.fx ?? []) {
		switch (fx.k) {
			case 'impact': add(fx.t, 'impact', {a: 0.3}); break;
			case 'shake': add(fx.t, 'thud', {a: 0.4}); break;
			case 'shock': add(fx.t, 'thud', {a: 0.3}); break;
			case 'sparkle': add(fx.t, 'sparkle'); break;
			case 'exclaim': case 'question': add(fx.t, 'pop'); break;
			case 'bulb': add(fx.t, 'ding'); break;
			case 'speed': add(fx.t, 'whoosh'); break;
			case 'shockwave': add(fx.t, 'boom', {a: 0.35}); break;
			case 'confetti': add(fx.t, 'success'); break;
			case 'flash': add(fx.t, 'flashbang', {a: 0.12}); break;
			case 'accent': add(fx.t, 'swoosh', {a: 0.07}); break;
			case 'pulse': add(fx.t, 'heartbeat', {dur: 3, a: 0.1}); break;
			default: break;
		}
	}
	for (const p of s.props ?? []) if (p.t0 !== undefined && typeof p.t0 === 'string') add(p.t0, 'pop', {a: 0.06});
}
console.log(JSON.stringify({ambience: merged, music: [{from: '001', to: 'end', style: 'pad-warm', amp: 0.12}], sfx}, null, 0));
