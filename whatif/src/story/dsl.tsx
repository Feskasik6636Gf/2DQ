import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {Pose, frontHand} from '../engine/Stickman';
import {Layer, Svg} from '../engine/camera';
import {blend, env, gesture, idle, run, walk, SIT, Gesture} from '../kit/actions';
import {Actor, LINES, L, SizeName, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Cam} from '../engine/camera';
import {camOn, Stage, CrowdRow, mixCam, Light} from '../kit/kit';
import {Bulb, Confetti, Exclaim, Glitch, ImpactText, Question, Shockwave, Smoke as FxSmoke, Sparkles, SpeedLines, punch, Rain, Snow, Pulse, LightningFlash} from '../kit/fx';
import {Accent, FONT} from '../kit/ui';
import {Animal, AnimalKind, AnimalPose, ANIMAL_H} from './animals';
import {Prop, PropKind} from './props';
import {Alley, AptHall, Basement, Courtyard, InfoBg, Market, Roof, VetRoom, Zoo} from './places';
import {Bedroom, ClassroomEve, Elevator, Kitchen, NightStreet, SchoolYard, Shop} from '../kit/sets';
import {CityDay, Forest} from '../kit/world';

export type T = string | number;
export type Ctx = {f: number; gf: number; tf: (t: T) => number; pos: (id: string) => {x: number; y: number}; dur: number};

type Mv = [T, T, number, ('run' | 'walk')?];
type Act = [Gesture | 'cheer' | 'jump' | 'crouch' | 'scare' | 'laugh' | 'sit' | 'lie' | 'bow' | 'cry' | 'hug' | 'carry', T, T];

export type PersonSpec = {
	who: string;
	id?: string;
	x: number;
	s?: number;
	size?: SizeName;
	face?: 1 | -1 | string;
	mv?: Mv[];
	acts?: Act[];
	ex?: [string, T, T][];
	mouth?: [string, T, T][];
	hold?: [PropKind, T, T, {c?: string; text?: string; s?: number; rot?: number}?][];
	auto?: boolean;
	hood?: boolean;
	look?: [number, number];
	front?: boolean;
	seat?: number;
	hide?: [T, T];
	skin?: [string, T, T?];
	color?: string;
};
export type AnimalSpec = {
	an: AnimalKind;
	id?: string;
	x: number;
	y?: number;
	s?: number;
	face?: 1 | -1 | string;
	pose?: AnimalPose;
	poses?: [AnimalPose, T, T][];
	mv?: Mv[];
	ym?: Mv[];
	talk?: [T, T][];
	wag?: number;
	flap?: [T, T][];
	say?: [T, T, string][];
	sad?: [T, T];
	tilt?: [T, T, number][];
	hop?: [T, T][];
	front?: boolean;
	rot?: [T, T, number, number][];
	hide?: [T, T];
};
export type PropSpec = {k: PropKind; x: number; y?: number; s?: number; rot?: number; t0?: T; t1?: T; c?: string; text?: string; mv?: [T, T, number, number][]; spin?: number; front?: boolean; bounce?: boolean};
export type FxSpec = {k: 'impact' | 'sparkle' | 'exclaim' | 'question' | 'bulb' | 'smoke' | 'shock' | 'flash' | 'speed' | 'shockwave' | 'confetti' | 'glitch' | 'rain' | 'snow' | 'accent' | 'pulse' | 'lightning' | 'shake'; t: T; t1?: T; at?: string | [number, number]; text?: string; sub?: string; c?: string; s?: number; y?: number};
export type SceneSpec = {
	at: string;
	loc: string;
	whip?: boolean;
	cast?: PersonSpec[];
	animals?: AnimalSpec[];
	props?: PropSpec[];
	fx?: FxSpec[];
	crowd?: {n: number; x0: number; x1: number; s?: number; mode?: 'stand' | 'walk' | 'run' | 'panic' | 'dance'; seed?: string; dir?: 1 | -1; t?: T}[];
	subj?: [T, string][];
	cam?: [T, number | string, number, number?, number?][]; // [time, x or actor id, zoom, y?, drift?]
	extra?: (c: Ctx) => React.ReactNode; // world space, depth 1 (behind actors)
	front?: (c: Ctx) => React.ReactNode; // world space, depth 1 (over actors)
	over?: (c: Ctx) => React.ReactNode; // screen space
	light?: Light | false;
	bg?: (c: Ctx) => React.ReactNode; // overrides loc
	vig?: number;
	grade?: string; // css filter
	d?: number; // time offset knob for director
	noauto?: boolean;
	zoomK?: number;
};

const parseT = (t: T, at: (n: string) => number, end: (n: string) => number): number => {
	if (typeof t === 'number') return t;
	const m = /^(\d{3})(e)?([+-]\d+)?$/.exec(t);
	if (!m) throw new Error('bad time ' + t);
	return (m[2] ? end(m[1]) : at(m[1])) + (m[3] ? parseInt(m[3]) : 0);
};

/* ----------------------------- locations ----------------------------- */
const LOC: Record<string, (f: number) => React.ReactNode> = {
	courtyard: (f) => <Courtyard f={f} />,
	courtyardNoCouch: (f) => <Courtyard f={f} couch={false} />,
	courtyardNight: (f) => <Courtyard f={f} night />,
	courtyardFire: (f) => <Courtyard f={f} night fire />,
	kitchen: () => <Kitchen />,
	kitchenNight: () => <Kitchen night />,
	bedroomNight: (f) => <Bedroom f={f} night />,
	bedroom: (f) => <Bedroom f={f} />,
	hall: (f) => <AptHall f={f} />,
	hallNight: (f) => <AptHall f={f} night />,
	hall3: (f) => <AptHall f={f} door="3C" />,
	hallOpen: (f) => <AptHall f={f} night open={Math.min(1, Math.max(0, (f - 10) / 20))} />,
	roof: (f) => <Roof f={f} />,
	roofNight: (f) => <Roof f={f} night />,
	roofSmoke: (f) => <Roof f={f} night smoke={1} />,
	market: (f) => <Market f={f} />,
	vet: (f) => <VetRoom f={f} />,
	zoo: (f) => <Zoo f={f} />,
	alley: (f) => <Alley f={f} />,
	basement: (f) => <Basement f={f} />,
	basementAlarm: (f) => <Basement f={f} alarm />,
	park: (f) => <Forest f={f} />,
	city: (f) => <CityDay f={f} />,
	school: (f) => <SchoolYard f={f} />,
	classroom: () => <ClassroomEve />,
	elevator: (f) => <Elevator f={f} />,
	nightStreet: (f) => <NightStreet f={f} />,
	shop: (f) => <Shop f={f} />,
	info: (f) => <InfoBg f={f} />,
	infoWarm: (f) => <InfoBg f={f} a="#3a1f3a" b="#8a3a4a" />,
	infoGreen: (f) => <InfoBg f={f} a="#0f2f2a" b="#1f6a58" />,
	infoRed: (f) => <InfoBg f={f} a="#2a0f18" b="#7a1f30" />,
	infoDay: (f) => <InfoBg f={f} a="#7ec4f2" b="#fbe2b0" dots={false} />,
};
const LOC_LIGHT: Record<string, Light | false> = {
	courtyard: {x: 70, y: 8, o: 0.42},
	courtyardNoCouch: {x: 70, y: 8, o: 0.42},
	courtyardNight: {night: true, x: 50, y: 6, o: 0.3},
	courtyardFire: {night: true, x: 50, y: 6, o: 0.3},
	kitchenNight: {night: true, o: 0.25},
	bedroomNight: {night: true, o: 0.25},
	hallNight: {night: true, o: 0.25},
	hallOpen: {night: true, o: 0.25},
	roofNight: {night: true, o: 0.25},
	roofSmoke: {night: true, o: 0.25},
	alley: {night: true, o: 0.3},
	basement: {night: true, o: 0.2},
	basementAlarm: {night: true, o: 0.2},
	nightStreet: {night: true, o: 0.3},
	info: {night: true, o: 0.2},
	infoWarm: {o: 0.2},
	infoGreen: {night: true, o: 0.2},
	infoRed: {o: 0.2},
	infoDay: {o: 0.3},
};

/* ----------------------------- motion helpers ----------------------------- */
const smooth = (u: number) => u * u * (3 - 2 * u);
type Trk = {x: number; moving: boolean; dir: 1 | -1; u: number; mode: 'run' | 'walk'; vx: number};
const track = (x0: number, mvs: Mv[] | undefined, f: number, tf: (t: T) => number): Trk => {
	let x = x0;
	let dir: 1 | -1 = 1;
	let first = true;
	if (mvs)
		for (const [a, b, xe, mode] of mvs) {
			const t0 = tf(a);
			const t1 = tf(b);
			if (xe !== x) dir = xe > x ? 1 : -1;
			first = false;
			if (f < t0) break;
			if (f >= t1) {
				x = xe;
				continue;
			}
			const u = (f - t0) / Math.max(1, t1 - t0);
			const nx = x + (xe - x) * smooth(u);
			const vx = ((xe - x) * 6 * u * (1 - u)) / Math.max(1, t1 - t0);
			return {x: nx, moving: true, dir, u, mode: mode ?? 'walk', vx};
		}
	void first;
	return {x, moving: false, dir, u: 0, mode: 'walk', vx: 0};
};
const movePose = (trk: Trk, f: number, seed: number, base: Pose): Pose => {
	if (!trk.moving) return base;
	const step = Math.min(1, Math.min(trk.u, 1 - trk.u) * 8);
	const ph = f * (trk.mode === 'run' ? 0.5 : 0.34) + seed;
	return blend(base, trk.mode === 'run' ? run(ph) : walk(ph), step);
};
const hash = (s: string) => {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
};
const AUTO_G: Gesture[] = ['presentF', 'point', 'shrug', 'think', 'touchFace', 'rubChin', 'scratch', 'presentF', 'stop'];

const inWin = (f: number, wins: [T, T][] | undefined, tf: (t: T) => number) => (wins ?? []).some(([a, b]) => f >= tf(a) && f < tf(b));

/* simple speech bubble with word-wrapped text (world space) */
export const Say: React.FC<{x: number; y: number; t: number; text: string; dur: number; c?: string; side?: 1 | -1}> = ({x, y, t, text, dur, c = '#fbf8ef', side = 1}) => {
	if (t < 0 || t > dur) return null;
	const words = text.split(' ');
	const lines: string[] = [];
	let cur = '';
	for (const w of words) {
		if ((cur + ' ' + w).trim().length > 20) {
			lines.push(cur.trim());
			cur = w;
		} else cur += ' ' + w;
	}
	lines.push(cur.trim());
	const w = Math.max(...lines.map((l) => l.length)) * 19 + 44;
	const h = lines.length * 40 + 28;
	const k = Easing.out(Easing.back(2.4))(Math.min(1, t / 8));
	const out = interpolate(t, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bob = Math.sin(t / 9) * 4;
	return (
		<g transform={`translate(${x},${y + bob}) scale(${k})`} opacity={out}>
			<rect x={-w / 2 + 5} y={-h + 10} width={w} height={h} rx={26} fill="#000" opacity={0.2} />
			<path d={`M${-18 * side},${-6} L${-34 * side},${34} L${12 * side},${-6} Z`} fill={c} stroke={'#1d1626'} strokeWidth={4} strokeLinejoin="round" />
			<rect x={-w / 2} y={-h} width={w} height={h} rx={26} fill={c} stroke="#1d1626" strokeWidth={4.5} />
			<path d={`M${-17 * side},${-8} L${11 * side},${-8}`} stroke={c} strokeWidth={8} />
			{lines.map((l, i) => (
				<text key={i} x={0} y={-h + 44 + i * 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#1d1626">
					{l}
				</text>
			))}
		</g>
	);
};

/* ------------------------------ the scene builder ------------------------------ */
type Seg = {a: number; b: number; k: number};

/* auto-director: cut points inside a shot, aligned to line starts */
const cutsOf = (start: number, end: number): number[] => {
	const lines = LINES.filter((l) => l.from - 6 >= start && l.from - 6 < end);
	const cuts = [start];
	let last = start;
	for (const l of lines) {
		const t = l.from - 6;
		if (t - last >= 62 && end - t >= 40) {
			cuts.push(t);
			last = t;
		}
	}
	// split any piece longer than 4 s on a pause
	const out: number[] = [];
	for (let i = 0; i < cuts.length; i++) {
		out.push(cuts[i]);
		const nxt = cuts[i + 1] ?? end;
		let a = cuts[i];
		while (nxt - a > 135) {
			a += 90;
			out.push(a);
		}
	}
	return out;
};

export const scene = (spec: SceneSpec): {C: React.FC; spec: SceneSpec} => {
	const C: React.FC = () => {
		const {f, gf, at, end, dur, start} = useShot();
		const tf = (t: T) => parseT(t, at, end);
		const sp = useSpeaking(gf);
		void sp;
		const cast = spec.cast ?? [];
		const animals = spec.animals ?? [];
		const idOf = (p: PersonSpec) => p.id ?? p.who;
		const aid = (a: AnimalSpec) => a.id ?? a.an;

		/* ---- positions (pure function of frame, so the camera can look ahead) ---- */
		const personPos = (p: PersonSpec, ff: number) => {
			const tr = track(p.x, p.mv, ff, tf);
			return {x: tr.x, y: 900 - 300 * (p.s ?? 1) * (p.size === 'kid' ? 0.75 : p.size === 'tall' ? 1.12 : p.size === 'giant' ? 1.35 : 1) , tr};
		};
		const animalPos = (a: AnimalSpec, ff: number) => {
			const tr = track(a.x, a.mv, ff, tf);
			const g = a.ym ? track(a.y ?? 900, a.ym, ff, tf).x : a.y ?? 900;
			return {x: tr.x, y: g - ANIMAL_H[a.an] * (a.s ?? 1) * 0.75, tr, g};
		};
		const pos = (id: string) => {
			const p = cast.find((c) => idOf(c) === id);
			if (p) {
				const q = personPos(p, f);
				return {x: q.x, y: q.y};
			}
			const a = animals.find((c) => aid(c) === id);
			if (a) {
				const q = animalPos(a, f);
				return {x: q.x, y: q.y};
			}
			return {x: 960, y: 560};
		};
		const ctx: Ctx = {f, gf, tf, pos, dur};

		/* ---- who is the subject at frame ff ---- */
		const subjAt = (ff: number): string => {
			let cur = spec.subj?.[0]?.[1] ?? (cast[0] ? idOf(cast[0]) : animals[0] ? aid(animals[0]) : '');
			for (const [t, id] of spec.subj ?? []) if (tf(t) <= ff) cur = id;
			return cur;
		};
		const posAt = (id: string, ff: number) => {
			const p = cast.find((c) => idOf(c) === id);
			if (p) {
				const q = personPos(p, ff);
				return {x: q.x, y: q.y};
			}
			const a = animals.find((c) => aid(c) === id);
			if (a) {
				const q = animalPos(a, ff);
				return {x: q.x, y: q.y};
			}
			return {x: 960, y: 560};
		};

		/* ---- camera ---- */
		const camAt = (ff: number): Cam => {
			if (spec.cam) {
				// explicit keyframes: [time, x|id, zoom, y?]; linear ease between them, hard cut if time repeats
				const K = spec.cam.map((c) => ({t: tf(c[0]), c}));
				let i = 0;
				while (i + 1 < K.length && ff >= K[i + 1].t) i++;
				const a = K[i];
				const b = K[i + 1] ?? a;
				const get = (c: (typeof K)[0]['c'], f2: number): Cam => {
					let x: number;
					let y: number;
					if (typeof c[1] === 'string') {
						const q = posAt(c[1], f2);
						x = q.x;
						y = c[3] ?? q.y + 60;
					} else {
						x = c[1];
						y = c[3] ?? 560;
					}
					return camOn(x, y, c[2]);
				};
				const u = b === a ? 0 : Math.max(0, Math.min(1, (ff - a.t) / Math.max(1, b.t - a.t)));
				const pushed = get(a.c, ff);
				const e = get(b.c, ff);
				return mixCam(pushed, e, b === a ? 0 : smooth(u));
			}
			const cuts = cutsOf(start, start + dur);
			let k = 0;
			while (k + 1 < cuts.length && start + ff >= cuts[k + 1]) k++;
			const a0 = cuts[k] - start;
			const a1 = (cuts[k + 1] ?? start + dur) - start;
			const u = Math.max(0, Math.min(1, (ff - a0) / Math.max(1, a1 - a0)));
			const subj = subjAt(Math.round((a0 + a1) / 2));
			const ids = [...cast.map(idOf), ...animals.map(aid)];
			const other = ids.find((i) => i !== subj) ?? subj;
			const plan = [
				{z: 1.08, mix: 0.5, other: 1}, // wide
				{z: 1.55, mix: 0.12}, // medium on subject
				{z: 2.1, mix: 0}, // close
				{z: 1.3, mix: 0.35, alt: 1}, // two-shot
				{z: 1.85, mix: 0.1, alt: 1}, // medium on the other
				{z: 1.15, mix: 0.45},
			];
			const P = plan[(k + hash(spec.at)) % plan.length];
			const zk = spec.zoomK ?? 1;
			const sub = posAt(P.alt ? other : subj, ff);
			const oth = posAt(P.alt ? subj : other, ff);
			const cx = sub.x + (oth.x - sub.x) * P.mix;
			const cy = sub.y + (oth.y - sub.y) * P.mix + 70;
			const z0 = P.z * zk;
			const drift = (hash(spec.at + k) % 2 ? 1 : -1) * 34;
			const A = camOn(Math.max(300, Math.min(1620, cx - drift)), Math.min(760, cy), z0);
			const B = camOn(Math.max(300, Math.min(1620, cx + drift)), Math.min(760, cy - 8), z0 * 1.09);
			return mixCam(A, B, smooth(u));
		};
		let cam = camAt(f);
		// camera kicks: shake and zoom punch from fx
		let sx = 0;
		let sy = 0;
		let zp = 0;
		for (const fx of spec.fx ?? []) {
			if (!['shock', 'impact', 'shake', 'shockwave'].includes(fx.k)) continue;
			const t0 = tf(fx.t);
			if (f >= t0 && f < t0 + 16) {
				const a = (fx.k === 'shake' ? 14 : 9) * Math.exp(-(f - t0) / 5);
				sx += Math.sin((f - t0) * 4.1) * a;
				sy += Math.cos((f - t0) * 5.3) * a * 0.7;
			}
			zp += punch(f, t0, fx.k === 'shake' ? 0.03 : 0.07, 10);
		}
		const hh = Math.sin(gf / 23) * 5 + Math.sin(gf / 9.7) * 2;
		cam = {...cam, x: cam.x + sx + hh, y: cam.y + sy + Math.cos(gf / 29) * 4, zoom: cam.zoom * (1 + zp)};

		/* ---- people ---- */
		const people = cast.map((p, pi) => {
			const id = idOf(p);
			if (p.hide && f >= tf(p.hide[0]) && f < tf(p.hide[1])) return null;
			const seed = pi * 3 + hash(id) % 7;
			const q = personPos(p, f);
			const tr = q.tr;
			const sc = p.s ?? 1;
			const sz = p.size;
			const sMul = sz === 'kid' ? 0.75 : sz === 'tall' ? 1.12 : sz === 'giant' ? 1.35 : sz === 'teen' ? 0.95 : 1;
			let x = tr.x;
			// idle sway so nobody is nailed to the floor
			let drift = 0;
			if (!tr.moving) drift = Math.sin(f / 58 + seed) * 10;
			x += drift;
			let pose: Pose = idle(gf, seed);
			pose = movePose(tr, f, seed, pose);
			if (p.seat !== undefined) pose = {...SIT, head: Math.sin(f / 40 + seed) * 2};
			let expr: string | undefined;
			let mouth: string | undefined;
			let armOver = false;
			let handF: 'point' | 'fist' | undefined;
			let squashY = 0;
			let bob = tr.moving ? Math.abs(Math.sin(f * (tr.mode === 'run' ? 0.5 : 0.34) + seed)) * (tr.mode === 'run' ? 7 : 4) : 0;
			let seat: number | undefined = p.seat;
			let faceTurnK = 0.45;
			// partner direction
			let facing: 1 | -1 = tr.moving ? tr.dir : 1;
			if (!tr.moving) {
				if (typeof p.face === 'number') facing = p.face;
				else {
					const target = typeof p.face === 'string' ? p.face : cast.find((c) => idOf(c) !== id) ? idOf(cast.find((c) => idOf(c) !== id)!) : animals[0] ? aid(animals[0]) : '';
					const tp = target ? pos(target) : {x: x + 100, y: 0};
					facing = tp.x >= x ? 1 : -1;
					if (Math.abs(tp.x - x) < 8) facing = tr.dir;
				}
			}
			const acts: Act[] = [...(p.acts ?? [])];
			// automatic gesture on every line so nobody just stands (only where nothing is scripted)
			if (p.auto !== false && !spec.noauto && !p.seat && !tr.moving) {
				const lines = LINES.filter((l) => l.from - 6 >= start && l.from < start + dur);
				lines.forEach((l, li) => {
					const t0 = l.from - start + 4;
					const t1 = l.from - start + l.dur - 6;
					if (acts.some(([, a, b]) => tf(a) < t1 && tf(b) > t0)) return;
					if ((li + pi + hash(spec.at)) % (pi === 0 ? 2 : 3) !== 0) return;
					const g = AUTO_G[(hash(l.id + id) + li) % AUTO_G.length];
					acts.push([g, t0, t1]);
				});
			}
			let ex2: string | undefined;
			for (const [g, a, b] of acts) {
				const k = env(f, tf(a), tf(b), 7, 8);
				if (k <= 0) continue;
				switch (g) {
					case 'cheer':
						pose = {...pose, lean: -4 * k, head: -6 * k, armF: [150 * k + pose.armF[0] * (1 - k), 12], armB: [-150 * k + pose.armB[0] * (1 - k), 12]};
						bob += Math.abs(Math.sin(f / 4)) * 14 * k;
						ex2 = 'happy';
						mouth ??= 'laugh';
						break;
					case 'jump':
						bob += Math.sin(Math.PI * Math.min(1, Math.max(0, (f - tf(a)) / Math.max(1, tf(b) - tf(a))))) * 90;
						pose = {...pose, armF: [120, 10], armB: [-120, 10]};
						break;
					case 'crouch': {
						const kk = Math.min(1, k * 1.2);
						seat = 900 - 157 * sc * sMul + 62 * sc * sMul * kk;
						pose = {...pose, lean: 14 * kk, head: -6 * kk, legF: [70 * kk, 53 * kk], legB: [66 * kk, 50 * kk], armF: [40 * kk, 40 * kk], armB: [30 * kk, 40 * kk]};
						break;
					}
					case 'scare':
						pose = {...pose, lean: -10 * k, head: -8 * k, armF: [110 * k, 60 * k], armB: [-60 * k, 40 * k]};
						ex2 = 'wide';
						mouth ??= 'open';
						break;
					case 'laugh':
						pose = {...pose, lean: -10 * k + Math.sin(f / 2.4) * 3 * k, head: -12 * k, armF: [30 * k, 70 * k], armB: [-30 * k, 70 * k]};
						ex2 = 'happy';
						mouth ??= 'laugh';
						bob += Math.abs(Math.sin(f / 3)) * 5 * k;
						break;
					case 'bow':
						pose = {...pose, lean: 24 * k, head: 8 * k};
						break;
					case 'cry':
						pose = gesture('facepalm', pose, k, f);
						armOver = armOver || k > 0.4;
						ex2 = 'sad';
						mouth ??= 'frown';
						break;
					case 'hug':
					case 'carry':
						pose = {...pose, lean: -3 * k, armF: [70 * k, 85 * k], armB: [60 * k, 80 * k]};
						break;
					case 'sit':
					case 'lie':
						break;
					default:
						pose = gesture(g as Gesture, pose, k, f);
						if (['touchFace', 'facepalm', 'think', 'rubChin', 'scratch', 'handsOnHead'].includes(g) && k > 0.4) armOver = true;
						if (g === 'point' && k > 0.4) handF = 'point';
						if (g === 'fist' && k > 0.4) handF = 'fist';
				}
			}
			for (const [e, a, b] of p.ex ?? []) if (f >= tf(a) && f < tf(b)) expr = e;
			for (const [m, a, b] of p.mouth ?? []) if (f >= tf(a) && f < tf(b)) mouth = m;
			expr ??= ex2;
			// an item in the front hand
			const held = (p.hold ?? []).filter(([, a, b]) => f >= tf(a) && f < tf(b));
			const act = (
				<Actor
					key={id}
					who={p.who}
					x={x}
					floor={900}
					s={sc}
					size={sz}
					facing={facing}
					faceTurn={faceTurnK}
					look={p.look}
					expr={expr as any}
					mouth={mouth as any}
					pose={pose}
					vx={tr.vx}
					bob={bob}
					seat={seat}
					armOver={armOver}
					handF={handF}
					hood={p.hood}
					{...(p.skin && f >= tf(p.skin[1]) && (p.skin[2] === undefined || f < tf(p.skin[2])) ? {skin: p.skin[0]} : {})}
					uid={`${spec.at}-${id}`}
					seed={seed}
				/>
			);
			return (
				<g key={id}>
					{act}
					{held.map(([k, , , o], hi) => {
						const sh = sc * sMul;
						const baseY = seat !== undefined ? seat : 900 - 157 * sh - bob * sh;
						const [hx, hy] = frontHand(pose, x, baseY, sh, facing);
						return <Prop key={hi} k={k} x={hx + facing * 10} y={hy + 26} s={(o?.s ?? 0.75) * sh} rot={(o?.rot ?? 0) * facing} c={o?.c} text={o?.text} />;
					})}
				</g>
			);
		});

		/* ---- animals ---- */
		const beasts = animals.map((a, ai) => {
			const id = aid(a);
			if (a.hide && f >= tf(a.hide[0]) && f < tf(a.hide[1])) return null;
			const q = animalPos(a, f);
			const tr = q.tr;
			let pose: AnimalPose = a.pose ?? 'stand';
			for (const [pz, t0, t1] of a.poses ?? []) if (f >= tf(t0) && f < tf(t1)) pose = pz;
			if (tr.moving) pose = tr.mode === 'run' ? 'run' : 'walk';
			let face: 1 | -1 = tr.moving ? tr.dir : 1;
			if (!tr.moving) {
				if (typeof a.face === 'number') face = a.face;
				else {
					const target = typeof a.face === 'string' ? a.face : cast[0] ? idOf(cast[0]) : '';
					const tp = target ? pos(target) : {x: q.x + 100};
					face = tp.x >= q.x ? 1 : -1;
				}
			}
			const talk = (a.talk ?? []).some(([t0, t1]) => f >= tf(t0) && f < tf(t1)) ? LINES.reduce((m, l) => (gf >= l.from && gf < l.from + l.dur ? Math.min(1, (l.env[gf - l.from] ?? 0) * 1.1 + 0.15) : m), 0) : 0;
			const flap = (a.flap ?? []).some(([t0, t1]) => f >= tf(t0) && f < tf(t1)) ? 1 : 0;
			let tilt = Math.sin(f / 40 + ai) * 2;
			for (const [t0, t1, d] of a.tilt ?? []) tilt += d * env(f, tf(t0), tf(t1), 8, 8);
			let rot = 0;
			for (const [t0, t1, d0, d1] of a.rot ?? []) if (f >= tf(t0) && f < tf(t1)) rot = d0 + (d1 - d0) * ((f - tf(t0)) / Math.max(1, tf(t1) - tf(t0)));
			const hop = (a.hop ?? []).some(([t0, t1]) => f >= tf(t0) && f < tf(t1)) ? Math.abs(Math.sin(f / 3)) * 36 : 0;
			const sad = a.sad && f >= tf(a.sad[0]) && f < tf(a.sad[1]) ? 1 : 0;
			const sayEl = (a.say ?? []).map(([t0, t1, text], si) => <Say key={si} x={q.x + face * 30} y={q.g - ANIMAL_H[a.an] * (a.s ?? 1) * 1.15 - 30 - hop} t={f - tf(t0)} dur={tf(t1) - tf(t0)} text={text} side={face} />);
			return (
				<g key={id}>
					<Animal kind={a.an} x={q.x} y={q.g - hop} s={a.s ?? 1} face={face} pose={pose} talk={talk} t={gf + ai * 13} wag={a.wag ?? 1} flap={flap} tilt={tilt} rot={rot} sad={sad} />
					{sayEl}
				</g>
			);
		});

		/* ---- props ---- */
		const propEls = (spec.props ?? []).map((p, i) => {
			const t0 = p.t0 !== undefined ? tf(p.t0) : -99999;
			const t1 = p.t1 !== undefined ? tf(p.t1) : 99999;
			if (f < t0 || f >= t1) return null;
			let x = p.x;
			let y = p.y ?? 900;
			for (const [a, b, xe, ye] of p.mv ?? []) {
				const ta = tf(a);
				const tb = tf(b);
				if (f >= ta) {
					const u = smooth(Math.max(0, Math.min(1, (f - ta) / Math.max(1, tb - ta))));
					x = x + (xe - x) * u;
					y = y + (ye - y) * u;
				}
			}
			const age = f - Math.max(t0, 0);
			const pop = p.t0 !== undefined ? Easing.out(Easing.back(2.2))(Math.min(1, Math.max(0, age) / 9)) : 1;
			const exit = p.t1 !== undefined ? interpolate(f, [t1 - 6, t1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
			const sc = (p.s ?? 1) * pop * (0.2 + 0.8 * exit);
			const bounce = p.bounce ? Math.abs(Math.sin(f / 5)) * 10 : 0;
			return <Prop key={i} k={p.k} x={x} y={y - bounce} s={sc} rot={(p.rot ?? 0) + (p.spin ? f * p.spin : 0)} c={p.c} text={p.text} t={f} />;
		});

		/* ---- fx ---- */
		const fxEls = (spec.fx ?? []).map((fx, i) => {
			const t0 = tf(fx.t);
			const t1 = fx.t1 !== undefined ? tf(fx.t1) : t0 + 40;
			let x = 960;
			let y = 480;
			if (typeof fx.at === 'string') {
				const q = pos(fx.at);
				x = q.x;
				y = q.y - 70 + (fx.y ?? 0);
			} else if (fx.at) {
				x = fx.at[0];
				y = fx.at[1];
			}
			switch (fx.k) {
				case 'impact':
					return <ImpactText key={i} f={f} t0={t0} x={x} y={y} text={fx.text ?? 'BAM!'} c={fx.c} s={fx.s ?? 0.7} />;
				case 'sparkle':
					return <Sparkles key={i} f={f} t0={t0} x={x} y={y} c={fx.c} />;
				case 'exclaim':
					return <Exclaim key={i} f={f} t0={t0} x={x} y={y - 60} s={fx.s} />;
				case 'question':
					return <Question key={i} f={f} t0={t0} x={x} y={y - 60} s={fx.s} />;
				case 'bulb':
					return <Bulb key={i} f={f} t0={t0} x={x} y={y - 60} s={fx.s} />;
				case 'smoke':
					return <FxSmoke key={i} f={f} t0={t0} x={x} y={y + 80} s={fx.s} c={fx.c} />;
				case 'shockwave':
					return <Shockwave key={i} f={f} t0={t0} x={x} y={y} c={fx.c} r={fx.s ? fx.s * 420 : 420} />;
				case 'speed':
					return <SpeedLines key={i} f={f} t0={t0} t1={t1} x={x} y={y} />;
				case 'confetti':
					return null;
				default:
					return null;
			}
		});
		const overEls = (spec.fx ?? []).map((fx, i) => {
			const t0 = tf(fx.t);
			const t1 = fx.t1 !== undefined ? tf(fx.t1) : t0 + 60;
			switch (fx.k) {
				case 'accent':
					return <Accent key={i} text={fx.text ?? ''} sub={fx.sub} t={f - t0} dur={t1 - t0} y={fx.y ?? 880} c={fx.c} />;
				case 'confetti':
					return (
						<Svg key={i}>
							<Confetti f={f} t0={t0} />
						</Svg>
					);
				case 'glitch':
					return (
						<Svg key={i}>
							<Glitch f={f} t0={t0} />
						</Svg>
					);
				case 'flash': {
					const o = interpolate(f, [t0, t0 + 1, t0 + 10], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return <AbsoluteFill key={i} style={{background: fx.c ?? '#fff', opacity: o, pointerEvents: 'none'}} />;
				}
				case 'rain':
					return f >= t0 && f < t1 ? <Rain key={i} f={f} /> : null;
				case 'snow':
					return f >= t0 && f < t1 ? <Snow key={i} f={f} /> : null;
				case 'pulse':
					return f >= t0 && f < t1 ? <Pulse key={i} f={f} c={fx.c} /> : null;
				case 'lightning':
					return <LightningFlash key={i} f={f} t0={t0} />;
				default:
					return null;
			}
		});

		const locKey = spec.loc;
		const bgEl = spec.bg ? spec.bg(ctx) : (LOC[locKey] ?? LOC.info)(f);
		const light = spec.light !== undefined ? spec.light : LOC_LIGHT[locKey] ?? {x: 30, y: 10, o: 0.38};
		const frontPeople = cast.map((c, i) => (c.front ? people[i] : null));
		const backPeople = cast.map((c, i) => (c.front ? null : people[i]));
		const frontAn = animals.map((a, i) => (a.front ? beasts[i] : null));
		const backAn = animals.map((a, i) => (a.front ? null : beasts[i]));
		return (
			<Stage cam={cam} bg="#101225" light={light} still vig={spec.vig}>
				<Layer depth={1.6}>{bgEl}</Layer>
				{spec.crowd ? (
					<Layer depth={1.15}>
						<Svg>
							{spec.crowd.map((c, i) => (
								<CrowdRow key={i} n={c.n} x0={c.x0} x1={c.x1} floor={880} s={c.s ?? 0.82} mode={c.mode ?? 'stand'} seed={c.seed ?? 'cw' + i} dir={c.dir} t={c.t !== undefined ? Math.max(0, f - tf(c.t)) : f} />
							))}
						</Svg>
					</Layer>
				) : null}
				<Layer depth={1}>
					<Svg>
						{spec.extra ? spec.extra(ctx) : null}
						{propEls}
						{backAn}
						{backPeople}
						{frontAn}
						{frontPeople}
						{spec.front ? spec.front(ctx) : null}
						{fxEls}
					</Svg>
				</Layer>
				{spec.over ? <AbsoluteFill style={{pointerEvents: 'none'}}>{spec.over(ctx)}</AbsoluteFill> : null}
				{overEls}
			</Stage>
		);
	};
	return {C, spec};
};

/* turn specs into ShotDefs; `ownCuts` comes from the same auto-director so the plan checker sees every cut */
export const toShots = (specs: {C: React.FC; spec: SceneSpec}[]): ShotDef[] =>
	specs.map(({C, spec}, i) => {
		const next = specs[i + 1]?.spec.at;
		const sf = L(spec.at).from - 6;
		const ef = next ? L(next).from - 6 : sf + 600;
		return {at: spec.at, C, own: true, whip: spec.whip, ownCuts: spec.cam ? spec.cam.map((c) => parseT(c[0], (n) => L(n).from - sf, (n) => L(n).from + L(n).dur - sf)).filter((v, k, a) => k === 0 || v !== a[k - 1]).map((v) => Math.max(0, v)) : cutsOf(sf, ef).map((c) => c - sf)};
	});
