import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose, frontHand} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, run, walk, SIT, Gesture} from '../kit/actions';
import {Actor, L, LINES, SIZE, SizeName, useShot} from '../kit/core';
import {HeroBadge, Layer, Stage, Svg, clamp, ease} from '../kit/kit';
import {Bulb, Confetti, Exclaim, Glitch, ImpactText, Question, Shockwave, Sparkles} from '../kit/fx';
import {FONT} from '../kit/ui';
import {STORY} from './config';
import {BG} from './places';
import type {ShotDef} from '../kit/coverage';

/* ------------------------------------------------------------------------------------------
   A tiny scene language so ~70 scenes can be written as data.
   Time spec: '045' = start of line 045, '045:0.5' = halfway through it, '045:1' = its end,
   optional frame offset '045:0.5+12'. Events are [time, kind, ...args].
   ------------------------------------------------------------------------------------------ */
export const tf = (s: string): number => {
	const m = /^(\d{3})(?::([\d.]+))?([+-]\d+)?$/.exec(s);
	if (!m) throw new Error('bad time spec ' + s);
	const l = L(m[1]);
	return Math.round(l.from + l.dur * parseFloat(m[2] ?? '0') + parseInt(m[3] ?? '0', 10));
};

export type Ev = [string, string, ...any[]];
export type ActorSpec = {
	id: string;
	who: string;
	x: number;
	s?: number;
	size?: SizeName;
	face?: 1 | -1;
	sp?: string;
	ev?: Ev[];
	hidden?: boolean; // invisible until a 'show' event
	badge?: boolean;
	floor?: number;
	expr?: string;
	still?: boolean; // no automatic gesture beats
};
export type CamKey = [string, string | number, number, number?]; // [time, actor id | world x, zoom, y offset]
export type Ctx = {f: number; gf: number; start: number; dur: number; t: (s: string) => number; px: (id: string) => number; py: (id: string) => number; sc: (id: string) => number};
export type SceneSpec = {
	bg: string;
	cast: ActorSpec[];
	fx?: Ev[];
	cam?: CamKey[];
	world?: (c: Ctx) => React.ReactNode; // behind the actors (world space)
	props?: (c: Ctx) => React.ReactNode; // in front of the actors (world space)
	over?: (c: Ctx) => React.ReactNode; // screen space
	mood?: 'calm' | 'excited' | 'sad' | 'tense';
	zoom?: number; // base zoom for the auto camera
	night?: boolean;
	light?: {x?: number; y?: number; o?: number; c?: string; night?: boolean};
	badge?: boolean;
	noBuzz?: boolean;
};

const hash = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/* --------------------------------- items held in a hand --------------------------------- */
export const Item: React.FC<{kind: string; x: number; y: number; s?: number; rot?: number; glow?: string}> = ({kind, x, y, s = 1, rot = 0, glow}) => {
	const INK = '#1d1626';
	let g: React.ReactNode = null;
	if (kind === 'phone')
		g = (
			<g>
				<rect x={-16} y={-30} width={32} height={60} rx={6} fill="#20223a" stroke={INK} strokeWidth={3} />
				<rect x={-12} y={-25} width={24} height={46} rx={3} fill={glow ?? '#8affb0'} />
				<circle cx={0} cy={25} r={2.5} fill="#667" />
			</g>
		);
	if (kind === 'flyer')
		g = (
			<g>
				<rect x={-26} y={-36} width={52} height={72} rx={3} fill="#fff6c9" stroke={INK} strokeWidth={3} />
				<circle cx={0} cy={-12} r={12} fill="#ff7a3a" stroke={INK} strokeWidth={2} />
				<rect x={-18} y={10} width={36} height={5} fill="#c9a84a" />
				<rect x={-18} y={20} width={26} height={5} fill="#c9a84a" />
			</g>
		);
	if (kind === 'pizza')
		g = (
			<g>
				<path d="M-34,-22 Q0,-40 34,-22 L0,36 Z" fill="#f6c453" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
				<path d="M-34,-22 Q0,-40 34,-22" fill="none" stroke="#d98a3a" strokeWidth={9} strokeLinecap="round" />
				<circle cx={-8} cy={-6} r={6} fill="#d6403a" />
				<circle cx={10} cy={4} r={6} fill="#d6403a" />
				<circle cx={0} cy={18} r={5} fill="#d6403a" />
			</g>
		);
	if (kind === 'tablet')
		g = (
			<g>
				<rect x={-60} y={-42} width={120} height={84} rx={8} fill="#20223a" stroke={INK} strokeWidth={4} />
				<rect x={-52} y={-34} width={104} height={68} rx={4} fill={glow ?? '#3a4a7a'} />
				<text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">$1B</text>
			</g>
		);
	if (kind === 'book')
		g = (
			<g>
				<rect x={-30} y={-38} width={60} height={76} rx={4} fill="#4a8fe0" stroke={INK} strokeWidth={4} />
				<rect x={-30} y={-38} width={9} height={76} fill="#2f64ad" />
				<path d="M-6,-12 q12,-18 22,0 q-6,16 -22,0 z" fill="#b06ad9" />
			</g>
		);
	if (kind === 'waffle')
		g = (
			<g>
				<circle r={32} fill="#e8b25a" stroke={INK} strokeWidth={4} />
				{[-16, 0, 16].map((v) => (
					<g key={v}>
						<line x1={v} y1={-26} x2={v} y2={26} stroke="#b9792f" strokeWidth={3} />
						<line x1={-26} y1={v} x2={26} y2={v} stroke="#b9792f" strokeWidth={3} />
					</g>
				))}
			</g>
		);
	if (kind === 'cookie')
		g = (
			<g>
				<circle r={26} fill="#c98a4a" stroke={INK} strokeWidth={4} />
				{[[-8, -8], [10, -2], [-2, 12], [12, 14]].map(([a, b], i) => (
					<circle key={i} cx={a} cy={b} r={4} fill="#4a2a1c" />
				))}
			</g>
		);
	if (kind === 'salt')
		g = (
			<g>
				<rect x={-12} y={-24} width={24} height={44} rx={6} fill="#e8f0ff" stroke={INK} strokeWidth={3} />
				<rect x={-12} y={-30} width={24} height={12} rx={4} fill="#9aa6c0" stroke={INK} strokeWidth={3} />
			</g>
		);
	if (kind === 'eraser')
		g = (
			<g>
				<rect x={-30} y={-14} width={60} height={28} rx={4} fill="#c9a06a" stroke={INK} strokeWidth={4} />
				<rect x={-30} y={-14} width={60} height={11} fill="#3a3f55" />
			</g>
		);
	if (kind === 'jacket')
		g = (
			<g>
				<path d="M-30,-30 L-10,-36 L10,-36 L30,-30 L36,20 L20,24 L16,-4 L16,34 L-16,34 L-16,-4 L-20,24 L-36,20 Z" fill="#2c3a5a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
			</g>
		);
	if (kind === 'letter')
		g = (
			<g>
				<rect x={-36} y={-24} width={72} height={48} rx={4} fill="#fff6e0" stroke={INK} strokeWidth={3} />
				<path d="M-36,-24 L0,6 L36,-24" fill="none" stroke={INK} strokeWidth={3} />
			</g>
		);
	if (kind === 'cash')
		g = (
			<g>
				{[0, 1, 2].map((i) => (
					<g key={i} transform={`translate(${i * 6},${-i * 8})`}>
						<rect x={-34} y={-16} width={68} height={32} rx={4} fill="#7bd88a" stroke={INK} strokeWidth={3} />
						<circle r={9} fill="#3aa05a" />
					</g>
				))}
			</g>
		);
	if (kind === 'screwdriver')
		g = (
			<g transform="rotate(-30)">
				<rect x={-8} y={-10} width={16} height={46} rx={6} fill="#e0503a" stroke={INK} strokeWidth={3} />
				<rect x={-3} y={-60} width={6} height={52} fill="#9aa6b8" stroke={INK} strokeWidth={2} />
			</g>
		);
	if (kind === 'clip')
		g = (
			<g>
				<rect x={-26} y={-36} width={52} height={72} rx={4} fill="#c9a06a" stroke={INK} strokeWidth={3} />
				<rect x={-20} y={-28} width={40} height={58} fill="#fff" />
				<rect x={-10} y={-40} width={20} height={10} rx={3} fill="#7c8696" />
			</g>
		);
	if (kind === 'mug')
		g = (
			<g>
				<rect x={-18} y={-20} width={36} height={40} rx={6} fill="#f2f2f2" stroke={INK} strokeWidth={3} />
				<path d="M18,-8 q20,2 0,22" fill="none" stroke={INK} strokeWidth={4} />
			</g>
		);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			{glow && kind === 'phone' ? <circle r={46} fill={glow} opacity={0.28} style={{filter: 'blur(10px)'}} /> : null}
			{g}
		</g>
	);
};

/* ------------------------------------ screen graphics ------------------------------------ */
export const Stat: React.FC<{f: number; t0: number; t1: number; text: string; sub?: string; c?: string; y?: number; size?: number}> = ({f, t0, t1, text, sub, c = '#ffd84a', y = 150, size = 120}) => {
	const k = env(f, t0, t1, 8, 10);
	if (k <= 0) return null;
	const pop = 1 + 0.18 * Math.exp(-(f - t0) / 5);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: k, transform: `scale(${pop}) rotate(${Math.sin(f / 18) * 0.8}deg)`, fontFamily: FONT}}>
			<div style={{display: 'inline-block', padding: '10px 44px 14px', borderRadius: 40, background: 'rgba(17,20,44,0.88)', border: `6px solid ${c}`, boxShadow: `0 0 50px ${c}66`}}>
				<div style={{fontWeight: 900, fontSize: size, color: '#fff', lineHeight: 1.05, letterSpacing: 1}}>{text}</div>
				{sub ? <div style={{fontWeight: 700, fontSize: size * 0.32, color: c, marginTop: 2}}>{sub}</div> : null}
			</div>
		</div>
	);
};

/* ------------------------------------- the scene engine ------------------------------------- */
type Move = {t0: number; t1: number; x0: number; x1: number; run: boolean};
type Resolved = {x: number; facing: 1 | -1; pose: Pose; vx: number; bob: number; moving: boolean; seat?: number; hold?: {kind: string; glow?: string}; expr?: string; mouth?: string; look?: [number, number]; visible: boolean; ak: number; armOver: boolean; handF?: string; squash?: number};

const REACH: Record<string, [number, number]> = {phone: [26, -96], flyer: [34, -86], pizza: [30, -100], tablet: [34, -84], book: [28, -70], waffle: [30, -84], cookie: [30, -86], salt: [30, -86], eraser: [34, -90], jacket: [20, -80], mug: [26, -86]};

const POOLS: Record<string, Gesture[]> = {
	calm: ['presentF', 'think', 'shrug', 'rubChin', 'point', 'presentF'],
	excited: ['fist', 'point', 'wave', 'presentF', 'handsOnHead', 'point'],
	sad: ['touchFace', 'think', 'shrug', 'rubChin', 'touchFace'],
	tense: ['stop', 'think', 'point', 'rubChin', 'shrug'],
};

export const resolveActor = (a: ActorSpec, idx: number, gf: number, mood: string): Resolved => {
	const evs = (a.ev ?? []).map((e) => ({t: tf(e[0]), k: e[1], a: e.slice(2)})).sort((p, q) => p.t - q.t);
	let x = a.x;
	let facing: 1 | -1 = a.face ?? (a.x < 960 ? 1 : -1);
	let seat: number | undefined;
	let visible = !a.hidden;
	let cur: Move | null = null;
	let lastEnd = -1e9;
	const seed = idx * 3 + 1;
	let hold: Resolved['hold'];
	let holdK = 0;
	let expr: string | undefined = a.expr;
	let mouth: string | undefined;
	let look: [number, number] | undefined;
	let squashK = 0;
	let bobExtra = 0;
	const gestures: {g: Gesture; k: number}[] = [];
	let speedFactor = 1;
	for (const e of evs) {
		if (e.t > gf + 400) break;
		if (e.k === 'walk' || e.k === 'run') {
			const x1 = e.a[0] as number;
			const sp = (e.a[1] as number) ?? (e.k === 'run' ? 13 : 6.2);
			const d = Math.max(16, Math.round(Math.abs(x1 - x) / sp));
			const m: Move = {t0: e.t, t1: e.t + d, x0: x, x1, run: e.k === 'run'};
			if (gf >= m.t0 && gf < m.t1) cur = m;
			if (gf >= m.t1) {
				x = x1;
				facing = x1 >= m.x0 ? 1 : -1;
				lastEnd = m.t1;
			} else if (gf >= m.t0) {
				facing = x1 >= m.x0 ? 1 : -1;
				x = m.x0;
			}
			if (gf < m.t1) break; // later moves start from the destination of this one: resolved on a later frame
		} else if (e.t <= gf) {
			if (e.k === 'face') facing = e.a[0];
			if (e.k === 'tp') x = e.a[0];
			if (e.k === 'show') visible = true;
			if (e.k === 'hide') visible = false;
			if (e.k === 'sit') seat = e.a[0] ?? 790;
			if (e.k === 'stand') seat = undefined;
		}
	}
	// events that are windows in time (gesture, expression, hold, hop…)
	let hop = 0;
	for (const e of evs) {
		if (e.k === 'walk' || e.k === 'run') continue;
		const dur = e.a[e.k === 'g' || e.k === 'e' || e.k === 'm' || e.k === 'hold' ? 1 : 0] ?? 40;
		if (e.k === 'g') {
			const k = env(gf, e.t, e.t + (e.a[1] ?? 50), 7, 9);
			if (k > 0) gestures.push({g: e.a[0], k});
		} else if (e.k === 'e') {
			if (gf >= e.t && gf < e.t + dur) expr = e.a[0];
		} else if (e.k === 'm') {
			if (gf >= e.t && gf < e.t + dur) mouth = e.a[0];
		} else if (e.k === 'hold') {
			const kk = env(gf, e.t, e.t + (e.a[1] ?? 60), 8, 8);
			if (kk > holdK) {
				holdK = kk;
				hold = {kind: e.a[0], glow: e.a[2]};
			}
		} else if (e.k === 'hop') {
			const d = e.a[0] ?? 16;
			if (gf >= e.t && gf < e.t + d) hop = Math.max(hop, Math.sin(((gf - e.t) / d) * Math.PI) * (e.a[1] ?? 42));
		} else if (e.k === 'look') {
			if (gf >= e.t && gf < e.t + (e.a[1] ?? 40)) look = e.a[0];
		} else if (e.k === 'squash') {
			if (gf >= e.t && gf < e.t + 10) squashK = Math.sin(((gf - e.t) / 10) * Math.PI);
		}
	}
	let pose: Pose = idle(gf, seed);
	let vx = 0;
	let bob = 0;
	let moving = false;
	if (seat !== undefined) pose = SIT;
	if (cur) {
		const m = cur;
		const u = Math.max(0, Math.min(1, (gf - m.t0) / Math.max(1, m.t1 - m.t0)));
		const e = u * u * (3 - 2 * u);
		x = m.x0 + (m.x1 - m.x0) * e;
		moving = true;
		const ph = (gf - m.t0) * (m.run ? 0.5 : 0.36) * 1.15;
		const step = Math.min(1, Math.min(u, 1 - u) * 6);
		pose = blend(idle(gf, seed), m.run ? run(ph) : walk(ph), step);
		vx = ((m.x1 - m.x0) * 6 * u * (1 - u)) / Math.max(1, m.t1 - m.t0);
		bob = Math.abs(Math.sin(ph)) * (m.run ? 7 : 4);
	}
	if (hop > 0) bob += hop;
	// held object: front arm reaches forward
	if (hold && holdK > 0) pose = reach(pose, 'F', REACH[hold.kind] ?? [30, -86], holdK);
	// explicit gestures, else an automatic beat so nobody stands like a post
	let armOver = false;
	let handF: string | undefined;
	if (gestures.length) {
		for (const g of gestures) {
			pose = gesture(g.g, pose, g.k, gf);
			if (['touchFace', 'rubChin', 'facepalm', 'think', 'scratch', 'handsOnHead'].includes(g.g) && g.k > 0.5) armOver = true;
			if (g.g === 'point' && g.k > 0.5) handF = 'point';
			if (g.g === 'fist' && g.k > 0.5) handF = 'fist';
		}
	} else if (!moving && seat === undefined && !a.still && !(hold && holdK > 0.3)) {
		const per = 78 + Math.floor(hash(seed) * 26);
		const ph = gf + Math.floor(hash(seed + 5) * per);
		const n = Math.floor(ph / per);
		const pool = POOLS[mood] ?? POOLS.calm;
		if (hash(n * 3.1 + seed) > 0.3) {
			const g = pool[Math.floor(hash(n * 7.7 + seed) * pool.length) % pool.length];
			const k = env(ph % per, 6, 46, 8, 10);
			pose = gesture(g, pose, k, gf);
			if (['touchFace', 'rubChin', 'think'].includes(g) && k > 0.5) armOver = true;
			if (g === 'point' && k > 0.5) handF = 'point';
		}
	}
	return {x, facing, pose, vx, bob, moving, seat, hold: holdK > 0.15 ? hold : undefined, expr, mouth, look, visible, ak: 0, armOver, handF, squash: squashK};
};

type Key = {t: number; tx: string | number; z: number; yo?: number};

const buildAutoKeys = (start: number, dur: number, ids: string[], base: number): Key[] => {
	const keys: Key[] = [];
	const zs = [1.3, 1.75, 1.5, 2.05, 1.6, 1.9, 1.4, 2.15];
	let t = 0;
	let i = 0;
	while (t < dur) {
		const who = ids.length ? (i % 3 === 2 && ids.length > 1 ? ids[(Math.floor(i / 3) + 1) % ids.length] : i % 2 === 0 ? ids[0] : ids[(i >> 1) % ids.length]) : 960;
		const z = zs[(i + Math.floor(base * 10)) % zs.length] * Math.min(1.1, base || 1);
		keys.push({t: start + t, tx: who, z});
		t += 62 + Math.floor(hash(i * 3.3 + start) * 40);
		i++;
	}
	return keys;
};

const MONEY = /buzz|plus 1,000|plus one|bzzt/gi;
export const buzzEvents = (): {t: number; neg: boolean; line: string}[] => {
	const out: {t: number; neg: boolean; line: string}[] = [];
	for (const l of LINES) {
		const text = l.text;
		let m: RegExpExecArray | null;
		const re = new RegExp(MONEY.source, 'gi');
		while ((m = re.exec(text))) {
			const tail = text.slice(m.index, m.index + 22).toLowerCase();
			const neg = /withdraw|gone/.test(tail);
			out.push({t: Math.round(l.from + l.dur * ((m.index + 2) / Math.max(1, text.length)) * 0.97), neg, line: l.id});
		}
	}
	return out;
};

export const scene = (spec: SceneSpec): React.FC => {
	const Scene: React.FC = () => {
		const {f, gf, start, dur} = useShot();
		const mood = spec.mood ?? 'calm';
		const R = spec.cast.map((a, i) => ({a, r: resolveActor(a, i, gf, mood)}));
		const byId: Record<string, {a: ActorSpec; r: Resolved}> = {};
		R.forEach((o) => (byId[o.a.id] = o));
		const scaleOf = (a: ActorSpec) => (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
		const px = (id: string) => byId[id]?.r.x ?? 960;
		const sc = (id: string) => (byId[id] ? scaleOf(byId[id].a) : 1);
		const py = (id: string) => 900 - 157 * sc(id) - 164 * sc(id);
		const ctx: Ctx = {f, gf, start, dur, t: (s) => tf(s) - start, px, py, sc};

		// ---- camera: keyframes swing between targets, following the actors
		const visibleIds = spec.cast.filter((a) => byId[a.id].r.visible).map((a) => a.id);
		const keys: Key[] = spec.cam
			? spec.cam.map((c) => ({t: tf(c[0]), tx: c[1], z: c[2], yo: c[3]}))
			: buildAutoKeys(start, dur, visibleIds.length ? visibleIds : spec.cast.map((a) => a.id), spec.zoom ?? 1);
		const targetX = (tx: string | number) => (typeof tx === 'number' ? tx : px(tx));
		const targetY = (tx: string | number, z: number, yo = 0) => {
			if (typeof tx === 'number') return 600 + yo;
			const s = sc(tx);
			const head = 900 - 300 * s;
			return (z > 1.3 ? head + 30 : head + 120 - (z - 1) * 80) + yo;
		};
		let ki = 0;
		while (ki + 1 < keys.length && gf >= keys[ki + 1].t) ki++;
		const cur = keys[ki] ?? {t: start, tx: 960, z: 1};
		const prev = keys[Math.max(0, ki - 1)] ?? cur;
		const TR = 24;
		const kk = ki === 0 ? 1 : ease(Math.max(0, Math.min(1, (gf - cur.t) / TR)));
		let z = prev.z + (cur.z - prev.z) * kk;
		let X = targetX(prev.tx) + (targetX(cur.tx) - targetX(prev.tx)) * kk;
		let Y = targetY(prev.tx, prev.z, prev.yo) + (targetY(cur.tx, cur.z, cur.yo) - targetY(prev.tx, prev.z, prev.yo)) * kk;
		// slow breathing zoom so even a hold is moving
		z *= 1 + 0.025 * Math.sin(gf / 41);
		X = Math.max(960 / z - 20, Math.min(1920 - 960 / z + 20, X));
		Y = Math.max(540 / z, Math.min(1080 - 540 / z + 40, Y));
		const shk = (spec.fx ?? []).reduce((m, e) => (e[1] === 'shake' ? Math.max(m, env(gf, tf(e[0]), tf(e[0]) + 16, 1, 15)) : m), 0);
		const cam = {x: (X - 960) * z + shk * Math.sin(gf * 2.3) * 14, y: (Y - 540) * z + shk * Math.cos(gf * 1.9) * 10, zoom: z, focus: 1, farBlur: z > 1.6 ? 7 : 3, nearBlur: 10};

		// ---- money pops (auto from the script: every "buzz")
		const hero = byId['hero'];
		const buzz = spec.noBuzz ? [] : buzzEvents().filter((b) => b.t >= start - 4 && b.t < start + dur);
		const heroY = hero ? 900 - 157 * sc('hero') - 164 * sc('hero') : 500;
		const badge = (spec.badge ?? true) && hero && hero.r.visible;

		const bg = BG[spec.bg] ?? BG.street;

		const fxEls: React.ReactNode[] = [];
		const overEls: React.ReactNode[] = [];
		(spec.fx ?? []).forEach((e, i) => {
			const t0 = tf(e[0]) - start;
			const k = e[1];
			const id = (e[2] as string) ?? 'hero';
			const ax = px(id);
			const ay = py(id) - 60;
			if (k === 'bang') fxEls.push(<ImpactText key={i} f={f} t0={t0} x={e[3] ?? ax} y={e[4] ?? ay - 130} text={e[2]} c={e[5] ?? '#ffd84a'} s={e[6] ?? 0.8} />);
			if (k === '!') fxEls.push(<Exclaim key={i} f={f} t0={t0} x={ax} y={ay - 100} s={0.8} />);
			if (k === '?') fxEls.push(<Question key={i} f={f} t0={t0} x={ax} y={ay - 100} s={0.8} />);
			if (k === 'bulb') fxEls.push(<Bulb key={i} f={f} t0={t0} x={ax} y={ay - 110} s={0.8} />);
			if (k === 'sparkle') fxEls.push(<Sparkles key={i} f={f} t0={t0} x={ax} y={ay} n={16} />);
			if (k === 'wave') fxEls.push(<Shockwave key={i} f={f} t0={t0} x={ax} y={ay + 80} r={380} />);
			if (k === 'tag' || k === 'say') {
				const dur = (k === 'tag' ? e[4] : e[4]) ?? (k === 'tag' ? 130 : 70);
				const kk = env(f, t0, t0 + dur, 6, 8);
				if (kk > 0) {
					const text = String(e[3]);
					const w = text.length * (k === 'tag' ? 17 : 19) + 44;
					const s2 = sc(id);
					const ty = 900 - 330 * s2 - (k === 'tag' ? 46 : 90);
					fxEls.push(
						<g key={i} transform={`translate(${ax},${ty}) scale(${0.85 + 0.15 * kk})`} opacity={kk}>
							{k === 'say' ? <path d={`M-14,22 L-4,52 L18,22 Z`} fill="#fff" stroke="#1d1626" strokeWidth={4} strokeLinejoin="round" /> : null}
							<rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill={k === 'tag' ? '#11142c' : '#ffffff'} stroke={k === 'tag' ? '#ffc94a' : '#1d1626'} strokeWidth={4} />
							<text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={k === 'tag' ? 28 : 32} fill={k === 'tag' ? '#fff' : '#1d1626'}>{text}</text>
						</g>,
					);
				}
			}
			if (k === 'confetti') overEls.push(<Confetti key={i} f={f} t0={t0} />);
			if (k === 'glitch') overEls.push(<Glitch key={i} f={f} t0={t0} />);
			if (k === 'stat') overEls.push(<Stat key={i} f={f} t0={t0} t1={t0 + (e[4] ?? 90)} text={e[2]} sub={e[3]} c={e[5]} y={e[6]} size={e[7]} />);
			if (k === 'flash') overEls.push(<AbsoluteFill key={i} style={{background: e[2] ?? '#fff', opacity: interpolate(f, [t0, t0 + 1, t0 + 8], [0, 0.8, 0], clamp)}} />);
		});

		return (
			<Stage cam={cam} bg="#101225" light={spec.light ?? {x: 24, y: 10, o: 0.3, night: spec.night}} still={false}>
				<Layer depth={1.6}>{bg(gf)}</Layer>
				<Layer depth={1.25}>
					<Svg>{spec.world?.(ctx)}</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						{R.filter((o) => o.r.visible).map(({a, r}, i) => {
							const s = scaleOf(a);
							const talkSp = a.sp;
							const handPos = r.hold ? frontHand(r.pose, r.x, (r.seat ?? (a.floor ?? 900) - 157 * s) - r.bob * s, s, r.facing) : null;
							return (
								<g key={a.id}>
									<Actor
										who={a.who}
										x={r.x}
										floor={a.floor ?? 900}
										s={a.s ?? 1}
										size={a.size}
										facing={r.facing}
										faceTurn={r.moving ? 0.5 : 0.35}
										pose={r.pose}
										vx={r.vx}
										bob={r.bob}
										seat={r.seat}
										sp={talkSp}
										expr={(r.expr ?? undefined) as any}
										mouth={(r.mouth ?? undefined) as any}
										look={r.look}
										armOver={r.armOver || undefined}
										handF={r.handF as any}
										squash={r.squash || undefined}
										uid={'a-' + a.id}
										seed={i + 1}
									/>
									{handPos && r.hold ? <Item kind={r.hold.kind} x={handPos[0] + r.facing * 4} y={handPos[1] - 8} s={s * 0.95} glow={r.hold.glow} rot={r.facing * -8} /> : null}
								</g>
							);
						})}
						{badge && hero ? <HeroBadge x={hero.r.x} y={heroY - 115 - hero.r.bob * sc('hero') - hero.r.bob} s={0.8} /> : null}
						{spec.props?.(ctx)}
						{fxEls}
						{buzz.map((b, i) => {
							const t0 = b.t - start;
							const u = f - t0;
							if (u < 0 || u > 46) return null;
							const bx = hero && hero.r.visible ? hero.r.x : 960;
							const by = (hero && hero.r.visible ? heroY - 240 : 360) - u * 2.4;
							const c = b.neg ? '#ff6a5a' : '#7dff9a';
							return (
								<g key={'b' + i} opacity={interpolate(u, [0, 4, 32, 46], [0, 1, 1, 0], clamp)} transform={`translate(${bx + (hash(i + b.t) - 0.5) * 120},${by}) scale(${1 + 0.35 * Math.exp(-u / 4)})`}>
									<text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={74} fill={c} stroke="#1d1626" strokeWidth={9} paintOrder="stroke">
										{b.neg ? '−$1,000' : '+$1,000'}
									</text>
								</g>
							);
						})}
					</Svg>
				</Layer>
			</Stage>
		);
	};
	// the ShotDef wrapper adds screen-space overlays after the stage, so it needs its own component
	const Wrapped: React.FC = () => {
		const {f, gf, start, dur} = useShot();
		const mood = spec.mood ?? 'calm';
		const R = spec.cast.map((a, i) => ({a, r: resolveActor(a, i, gf, mood)}));
		const byId: Record<string, Resolved> = {};
		R.forEach((o) => (byId[o.a.id] = o.r));
		const sc = (id: string) => {
			const a = spec.cast.find((q) => q.id === id);
			return a ? (a.s ?? 1) * (a.size ? SIZE[a.size] : 1) : 1;
		};
		const ctx: Ctx = {f, gf, start, dur, t: (s) => tf(s) - start, px: (id) => byId[id]?.x ?? 960, py: (id) => 900 - 321 * sc(id), sc};
		const overs: React.ReactNode[] = [];
		(spec.fx ?? []).forEach((e, i) => {
			const t0 = tf(e[0]) - start;
			const k = e[1];
			if (k === 'confetti') overs.push(<Confetti key={i} f={f} t0={t0} />);
			if (k === 'glitch') overs.push(<Glitch key={i} f={f} t0={t0} />);
			if (k === 'stat') overs.push(<Stat key={i} f={f} t0={t0} t1={t0 + (e[4] ?? 90)} text={e[2]} sub={e[3]} c={e[5]} y={e[6]} size={e[7]} />);
			if (k === 'flash') overs.push(<AbsoluteFill key={i} style={{background: e[2] ?? '#fff', opacity: interpolate(f, [t0, t0 + 1, t0 + 8], [0, 0.8, 0], clamp)}} />);
		});
		return (
			<AbsoluteFill>
				<Scene />
				{overs}
				{spec.over?.(ctx)}
			</AbsoluteFill>
		);
	};
	return Wrapped;
};

export const S = (at: string, spec: SceneSpec, whip = false, off = 0): ShotDef => ({at, off, C: scene(spec), whip, spec} as ShotDef);
