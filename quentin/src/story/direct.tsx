import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig} from 'remotion';
import type {Pose} from '../engine/Stickman';
import {Layer, Svg} from '../engine/camera';
import {blend, env, gesture, idle, run, SIT, walk, walkTo} from '../kit/actions';
import type {Gesture} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import {Callout} from '../kit/graphics';
import {HeroBadge, Stage, camOn, mixCam} from '../kit/kit';
import {Bubble, FONT, HAND} from '../kit/ui';
import {Tub, Dinner, DinnerTable, Class, Desks, Outdoor, Field, Hall, Cafeteria, Hospital, Bedroom, Blanket, Kitchen, Corridor, Banner} from './places';
import {Extra} from '../kit/kit';
import {CAST} from './cast';
import {FxLayerScreen, FxLayerWorld, FxCall} from './fx';

/* ============================== scene description ============================== */
export type SetId =
	| 'dinner' | 'class' | 'hall' | 'school' | 'sidewalk' | 'house' | 'bench' | 'parking' | 'field' | 'fieldcool'
	| 'assembly' | 'council' | 'cafe' | 'hospital' | 'bedroom' | 'kitchen' | 'housee';

export type ActorSetup = {x: number; s?: number; face?: 1 | -1; sit?: boolean; floor?: number; hide?: boolean; badge?: boolean};
export type CrowdSetup = {id: string; n: number; x0: number; x1: number; floor?: number; s?: number; seed?: string; sit?: boolean; mode?: CrowdMode; rows?: number};
export type CrowdMode = 'walk' | 'stand' | 'hands' | 'gasp' | 'cheer' | 'look' | 'sway' | 'run' | 'clap' | 'sit';
export type Size = 'w' | 'm' | 'c' | 'x' | 'u';
export type Beat = {
	n: string; // line prefix
	f?: string | [number, number]; // camera focus: actor id, 'all' or [x, y]
	z?: Size | number;
	dx?: number;
	dy?: number;
	mv?: Record<string, number | [number, number]>; // walk (to | [from,to]) during this line
	g?: Record<string, string>; // gesture on this line ('point', 'facepalm', 'cheer'…)
	e?: Record<string, string>; // expression (persists): 'wide', 'sad+frown', '~' resets
	fc?: Record<string, string | number>; // face toward actor id or direction 1/-1
	fx?: FxCall[];
	sh?: number; // camera shake strength
	crowd?: Record<string, CrowdMode>;
	cut?: boolean; // force hard cut
	run?: string[]; // actors that run while moving
	go?: number; // seconds after line start where the walk begins (default 0)
};
export type SceneSpec = {
	at: string;
	set: SetId;
	whip?: boolean;
	cast: Record<string, ActorSetup>;
	crowds?: CrowdSetup[];
	beats: Beat[];
	badge?: boolean; // show money badge over the hero (default true)
	night?: boolean;
	hot?: number;
	extra?: 'table' | 'desks' | 'banner' | 'blanket' | 'tub';
	deskXs?: number[];
};

const SIZE: Record<Size, number> = {w: 1.14, m: 1.38, c: 1.9, x: 2.6, u: 0.82};
const ASSUMED_FLOOR = 900;

/* ================================ set renderer ================================== */
const SetBg: React.FC<{sp: SceneSpec; f: number}> = ({sp, f}) => {
	switch (sp.set) {
		case 'dinner':
			return <Dinner f={f} />;
		case 'class':
			return <Class f={f} />;
		case 'hall':
			return <Corridor f={f} />;
		case 'school':
			return <Outdoor f={f} kind="school" />;
		case 'sidewalk':
			return <Outdoor f={f} kind="sidewalk" />;
		case 'house':
			return <Outdoor f={f} kind="house" />;
		case 'housee':
			return <Outdoor f={f} kind="house" evening />;
		case 'bench':
			return <Outdoor f={f} kind="bench" />;
		case 'parking':
			return <Outdoor f={f} kind="parking" />;
		case 'field':
			return <Field f={f} hot={1} banner />;
		case 'fieldcool':
			return <Field f={f} hot={0} banner />;
		case 'assembly':
			return <Hall f={f} kind="assembly" />;
		case 'council':
			return <Hall f={f} kind="council" />;
		case 'cafe':
			return <Cafeteria f={f} />;
		case 'hospital':
			return <Hospital f={f} />;
		case 'bedroom':
			return <Bedroom f={f} />;
		case 'kitchen':
			return <Kitchen />;
	}
};

/* ============================== timeline resolving ============================== */
type Seg = {t0: number; t1: number; a: number; b: number};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (v: number) => {
	const c = clamp01(v);
	return c * c * (3 - 2 * c);
};

const GESTURES: Record<string, Gesture> = {
	point: 'point', facepalm: 'facepalm', shrug: 'shrug', scratch: 'scratch', touch: 'touchFace', chin: 'rubChin', hands: 'handsOnHead', wave: 'wave', cross: 'armsCrossed', think: 'think', fist: 'fist', present: 'presentF', stop: 'stop',
};
const extraPose = (g: string, base: Pose, k: number, f: number): Pose => {
	if (k <= 0) return base;
	switch (g) {
		case 'cheer':
			return {...base, lean: -3 * k, head: -6 * k, armF: [170 + Math.sin(f / 3) * 10, 20], armB: [-165 + Math.cos(f / 3) * 10, 20]};
		case 'laugh':
			return gesture('touchFace', {...base, lean: base.lean - 14 * k + Math.sin(f / 2.2) * 4 * k, head: base.head - 14 * k}, k * 0.6, f);
		case 'cry':
			return gesture('touchFace', {...base, lean: base.lean + 10 * k, head: base.head + 18 * k + Math.sin(f / 2) * 2}, k, f);
		case 'slump':
			return {...base, lean: base.lean + 14 * k, head: base.head + 18 * k, armF: [base.armF[0] - 8 * k, base.armF[1]], armB: [base.armB[0] + 8 * k, base.armB[1]]};
		case 'sway':
			return {...base, lean: base.lean + Math.sin(f / 7) * 9 * k, head: base.head + Math.sin(f / 5 + 1) * 10 * k};
		case 'recoil':
			return {...base, lean: base.lean - 12 * k, head: base.head - 8 * k, armF: [70 * k + base.armF[0] * (1 - k), 30], armB: [-60 * k + base.armB[0] * (1 - k), 30]};
		case 'nod':
			return {...base, head: base.head + Math.sin(f / 3.5) * 9 * k};
		case 'shake':
			return {...base, head: base.head + Math.sin(f / 2.2) * 8 * k};
		case 'bow':
			return {...base, lean: base.lean + 24 * k, head: base.head + 10 * k};
		case 'reachdown':
			return {...base, lean: base.lean + 40 * k, head: base.head + 10 * k, armF: [base.armF[0] + 90 * k, 20 * k], armB: [base.armB[0] + 80 * k, 20 * k]};
		case 'drag':
			return {...base, lean: base.lean + 30 * k, armF: [95 * k, 6], armB: [88 * k, 6]};
		case 'clap':
			return {...base, armF: [70 + Math.sin(f / 1.6) * 12, 90], armB: [60 + Math.sin(f / 1.6) * 12, 90]};
		case 'type':
			return {...base, lean: base.lean + 4 * k, armF: [60, 80], armB: [54, 78]};
		default: {
			const gg = GESTURES[g];
			return gg ? gesture(gg, base, k, f) : base;
		}
	}
};

/* all per-actor timeline data of one scene, resolved to scene-local frames */
type Resolved = {
	x: Record<string, Seg[]>;
	g: Record<string, {t0: number; t1: number; g: string}[]>;
	e: Record<string, {t: number; v: string}[]>;
	fc: Record<string, {t: number; v: string | number}[]>;
	runs: Record<string, Set<number>>;
	beats: {b: Beat; t0: number; t1: number; i: number}[];
};
const resolve = (sp: SceneSpec, at: (n: string) => number, end: (n: string) => number, dur: number): Resolved => {
	const R: Resolved = {x: {}, g: {}, e: {}, fc: {}, runs: {}, beats: []};
	const cur: Record<string, number> = {};
	for (const id of Object.keys(sp.cast)) {
		cur[id] = sp.cast[id].x;
		R.x[id] = [];
		R.g[id] = [];
		R.e[id] = [];
		R.fc[id] = [];
		R.runs[id] = new Set();
	}
	sp.beats.forEach((b, i) => {
		const t0 = at(b.n) - 4;
		const nextT = i + 1 < sp.beats.length ? at(sp.beats[i + 1].n) - 4 : dur;
		const t1 = Math.max(t0 + 20, Math.min(dur, nextT));
		R.beats.push({b, t0: i === 0 ? 0 : t0, t1: i + 1 < sp.beats.length ? t1 : dur, i});
		for (const [id, v] of Object.entries(b.mv ?? {})) {
			if (!R.x[id]) continue;
			const [from, to] = Array.isArray(v) ? v : [cur[id], v];
			const run = (b.run ?? []).includes(id);
			const len = Math.max(14, Math.min(120, Math.abs(to - from) / (run ? 14 : 8)));
			const s = t0 + (b.go ?? 0) * 30;
			R.x[id].push({t0: s, t1: s + len, a: from, b: to});
			if (run) for (let k = s; k < s + len + 4; k++) R.runs[id].add(k);
			cur[id] = to;
		}
		for (const [id, g] of Object.entries(b.g ?? {})) R.g[id]?.push({t0: t0 + 2, t1: Math.max(t0 + 24, t1 - 6), g});
		for (const [id, v] of Object.entries(b.e ?? {})) R.e[id]?.push({t: t0, v});
		for (const [id, v] of Object.entries(b.fc ?? {})) R.fc[id]?.push({t: t0, v});
	});
	return R;
};
const xAt = (R: Resolved, id: string, x0: number, f: number) => {
	let x = x0;
	let moving = false;
	let vx = 0;
	let facing: 0 | 1 | -1 = 0;
	for (const s of R.x[id]) {
		if (f < s.t0) break;
		const u = clamp01((f - s.t0) / (s.t1 - s.t0));
		x = s.a + (s.b - s.a) * sm(u);
		if (f < s.t1) {
			moving = true;
			vx = ((s.b - s.a) * 6 * u * (1 - u)) / (s.t1 - s.t0);
			facing = s.b >= s.a ? 1 : -1;
		} else if (s.b !== s.a) facing = s.b >= s.a ? 1 : -1;
	}
	return {x, moving, vx, facing};
};

/* ================================== the scene =================================== */
const sizeOf = (z: Size | number | undefined, dflt: number) => (z === undefined ? dflt : typeof z === 'number' ? z : SIZE[z]);

export const buildShot = (sp: SceneSpec): React.FC => {
	const Scene: React.FC = () => {
		const {f, gf, at, end, dur} = useShot();
		const R = React.useMemo(() => resolve(sp, at, end, dur), [dur]);
		// ---- actors
		const ids = Object.keys(sp.cast);
		const state: Record<string, {x: number; y: number; floor: number; s: number; facing: 1 | -1; pose: Pose; vx: number; bob: number; expr?: string; mouth?: string; armOver: boolean; handF?: any; sit: boolean; seat?: number; head: number}> = {};
		for (const id of ids) {
			const c = sp.cast[id];
			const m = xAt(R, id, c.x, f);
			const s = c.s ?? 1;
			const floor = c.floor ?? ASSUMED_FLOOR;
			// facing: last explicit command, else movement, else cast default
			let facing: 1 | -1 = c.face ?? (c.x < 960 ? 1 : -1);
			for (const e of R.fc[id]) {
				if (e.t > f) break;
				if (typeof e.v === 'number') facing = e.v as 1 | -1;
				else {
					const tx = xAt(R, e.v, sp.cast[e.v]?.x ?? 960, f).x;
					facing = tx >= m.x ? 1 : -1;
				}
			}
			if (m.moving && m.facing) facing = m.facing;
			else if (m.facing && !R.fc[id].some((e) => e.t <= f)) facing = m.facing;
			const isRun = R.runs[id].has(f);
			let pose: Pose;
			let bob = 0;
			if (c.sit) pose = {...SIT, ...idle(gf, c.x / 90), armB: SIT.armB, armF: SIT.armF, legB: SIT.legB, legF: SIT.legF, lean: SIT.lean + Math.sin(gf / 30 + c.x) * 1.5};
			else if (m.moving) {
				const ph = f * (isRun ? 0.55 : 0.36);
				pose = isRun ? run(ph) : walk(ph);
				bob = Math.abs(Math.sin(ph)) * (isRun ? 7 : 4);
			} else pose = idle(gf, c.x / 90 + id.length);
			let armOver = false;
			let handF: any;
			let gname: string | undefined;
			for (const g of R.g[id]) {
				const k = env(f, g.t0, g.t1, 8, 8);
				if (k > 0.02) {
					pose = extraPose(g.g, pose, k, f);
					gname = g.g;
					if (['touch', 'facepalm', 'cry', 'laugh', 'chin', 'think'].includes(g.g) && k > 0.5) armOver = true;
					if (g.g === 'point' && k > 0.4) handF = 'point';
					if (g.g === 'fist' && k > 0.4) handF = 'fist';
				}
			}
			let e: string | undefined;
			for (const ev of R.e[id]) if (ev.t <= f) e = ev.v;
			const [ex, mo] = e && e !== '~' ? e.split('+') : [undefined, undefined];
			const seat = c.sit ? floor - 110 * s : undefined;
			state[id] = {x: m.x, y: 0, floor, s, facing, pose, vx: m.vx, bob, expr: ex && ex !== 'normal' ? ex : undefined, mouth: mo, armOver, handF, sit: !!c.sit, seat, head: floor - (c.sit ? 110 : 157) * s - 164 * s};
		}
		const hero = state['hero'];
		const heroVisible = hero && !sp.cast['hero']?.hide && sp.badge !== false;

		// ---- camera: one framing per line, a hard cut between them, a glide when the subject stays
		let bi = 0;
		for (let i = 0; i < R.beats.length; i++) if (f >= R.beats[i].t0) bi = i;
		const camFor = (i: number, u: number) => {
			const beat = R.beats[i].b;
			const prevF = i > 0 ? R.beats[i - 1].b.f : undefined;
			const fo = beat.f ?? prevF ?? 'hero';
			const z0 = sizeOf(beat.z, 1.38);
			const push = 1 + 0.07 * sm(u);
			const dir = i % 2 ? 1 : -1;
			let X = 960;
			let Y = 600;
			if (fo === 'all') {
				X = 960 + (beat.dx ?? 0);
				Y = 640 + (beat.dy ?? 0) - (z0 > 1.3 ? 40 : 0);
			} else if (Array.isArray(fo)) {
				X = fo[0] + (beat.dx ?? 0);
				Y = fo[1] + (beat.dy ?? 0);
			} else {
				const st = state[fo];
				if (st) {
					const xf = st.x + st.facing * 40 * (z0 > 1.6 ? 0.4 : 1);
					X = xf + (beat.dx ?? 0) + dir * 30 * u;
					Y = st.head + 24 + (z0 >= 2.2 ? 0 : 40 * (2.2 - z0)) + (beat.dy ?? 0);
				}
			}
			const z = z0 * push;
			X = Math.max(960 / z + -300, Math.min(2220 - 960 / z, X)); // keep inside the set
			return camOn(X, Y, z, {farBlur: z > 1.6 ? 7 : 3.2});
		};
		const b0 = R.beats[bi];
		const u = clamp01((f - b0.t0) / Math.max(1, b0.t1 - b0.t0));
		let cam = camFor(bi, u);
		if (bi > 0 && !b0.b.cut) {
			const pb = R.beats[bi - 1].b;
			const sameFocus = (b0.b.f ?? pb.f) === pb.f || b0.b.f === undefined;
			if (sameFocus) {
				const prev = camFor(bi - 1, 1);
				cam = mixCam(prev, cam, sm((f - b0.t0) / 14));
			}
		}
		// shake
		const sh = R.beats.reduce((a, r) => (r.b.sh && f >= r.t0 ? {k: r.b.sh, t: f - r.t0} : a), {k: 0, t: 99});
		if (sh.k && sh.t < 18) {
			const a = sh.k * Math.exp(-sh.t / 6);
			cam = {...cam, x: cam.x + Math.sin(sh.t * 2.9) * a * 14, y: cam.y + Math.cos(sh.t * 3.7) * a * 11};
		}

		// ---- crowds
		const crowdModeAt = (id: string, dflt: CrowdMode): CrowdMode => {
			let m = dflt;
			for (const r of R.beats) if (r.b.crowd?.[id] && f >= r.t0) m = r.b.crowd[id];
			return m;
		};
		const Crowds = (
			<>
				{(sp.crowds ?? []).map((c) => {
					const mode = crowdModeAt(c.id, c.mode ?? 'stand');
					const rows = c.rows ?? 1;
					const out: React.ReactNode[] = [];
					for (let r = 0; r < rows; r++) {
						for (let i = 0; i < c.n; i++) {
							const rn = random((c.seed ?? c.id) + r + '_' + i);
							const x = c.x0 + ((c.x1 - c.x0) * (i + 0.5)) / c.n + (rn - 0.5) * 36 + r * 21;
							const s = (c.s ?? 0.8) * (1 - r * 0.07);
							const fl = (c.floor ?? 900) - r * 38;
							const ph = f / 5 + rn * 7;
							let pose: Pose = idle(gf, i + r * 7);
							let expr: any;
							if (c.sit || mode === 'sit') pose = {...SIT};
							if (mode === 'hands') pose = {...pose, armF: [165 + Math.sin(ph) * 6, 20], armB: [-20, 10]};
							if (mode === 'gasp') {
								pose = {...pose, lean: -6, head: -6, armF: [75, 100], armB: [70, 100]};
								expr = 'wide';
							}
							if (mode === 'cheer') pose = {...pose, lean: Math.sin(ph) * 5, armF: [165 + Math.sin(ph) * 12, 20], armB: [-165 + Math.cos(ph) * 12, 20]};
							if (mode === 'clap') pose = {...pose, armF: [70 + Math.sin(ph * 2.4) * 12, 90], armB: [60 + Math.sin(ph * 2.4) * 12, 90]};
							if (mode === 'sway') pose = {...pose, lean: Math.sin(ph) * 7};
							if (mode === 'look') pose = {...pose, head: Math.sin(ph / 3) * 6};
							let xx = x;
							if (mode === 'run') pose = run(f * 0.5 + rn * 6);
							if (mode === 'walk') {
								pose = walk(f * 0.3 + rn * 6);
								const span = c.x1 - c.x0 + 600;
								xx = c.x0 - 300 + ((x - c.x0 + 300 + f * (2.2 + rn * 1.4) * (rn > 0.5 ? 1 : -1) + span * 10) % span);
							}
							const base = c.sit ? 110 : 157;
							out.push(<Extra key={r + '_' + i} i={i + r * 50} x={xx} floor={fl + (c.sit ? 157 * s - 110 * s : 0)} s={s} pose={pose} seed={(c.seed ?? c.id) + r} facing={mode === 'walk' ? (rn > 0.5 ? 1 : -1) : rn > 0.88 ? -1 : 1} expr={expr} />);
							void base;
						}
					}
					return <g key={c.id}>{out}</g>;
				})}
			</>
		);

		// ---- actors drawing order: by floor then x
		const order = [...ids].sort((a, b) => state[a].floor - state[b].floor);
		const Actors = (
			<>
				{order.map((id) => {
					const st = state[id];
					if (sp.cast[id].hide) return null;
					const ca = CAST[id];
					return (
						<Actor key={id} who={id} x={st.x} floor={st.floor} s={st.s} facing={st.facing} faceTurn={0.5} look={[st.facing * 0.7, 0]} expr={st.expr as any} mouth={st.mouth as any} pose={st.pose} vx={st.vx} bob={st.bob} armOver={st.armOver} handF={st.handF} seat={st.seat} uid={id + sp.at} />
					);
				})}
			</>
		);

		const fxAll = R.beats.flatMap((r) => (r.b.fx ?? []).map((fx) => ({fx, t0: r.t0 + (fx.o ?? 0), t1: r.t1})));
		const stFx = (id: string) => state[id] ?? {x: 960, head: 560, floor: 900, s: 1, facing: 1};

		const bgCam = cam;
		void bgCam;
		return (
			<Stage cam={cam} bg="#101225" light={{x: 22, y: 8, o: sp.set === 'field' ? 0.12 : 0.36, night: sp.night}} still grain={0}>
				<Layer depth={1.5}>
					<SetBg sp={sp} f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						{Crowds}
						{Actors}
						{sp.extra === 'desks' ? <Desks xs={sp.deskXs ?? [400, 760, 1120]} /> : null}
						{sp.set === 'dinner' ? <DinnerTable f={gf} /> : null}
						{sp.extra === 'tub' && state['colm'] ? <Tub x={state['colm'].x} /> : null}
						{sp.extra === 'banner' ? <Banner x={960} y={300} text="WATER IS A REWARD" /> : null}
						{heroVisible && state['hero'] ? <HeroBadge x={hero.x} y={hero.head - (hero.sit ? 0 : 0) - 62 * hero.s - 28} s={0.75} /> : null}
						<FxLayerWorld fx={fxAll} f={f} pos={(id) => stFx(id)} />
					</Svg>
				</Layer>
				<FxLayerScreen fx={fxAll} f={f} pos={(id) => stFx(id)} />
			</Stage>
		);
	};
	return Scene;
};

export {Callout, Bubble, FONT, HAND, Blanket, Hospital, Cafeteria, blend, walkTo, spring, Easing, interpolate, AbsoluteFill, useVideoConfig};
