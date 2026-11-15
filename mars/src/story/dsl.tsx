import React from 'react';
import {Pose} from '../engine/Stickman';
import {Layer, Svg} from '../engine/camera';
import {CAST} from './cast';
import {SIT, blend, env, gesture, idle, run, walk, Gesture} from '../kit/actions';
import {Actor, Shot, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Stage, camOn, mixCam, usePush, Light, HeroBadge} from '../kit/kit';
import {AbsoluteFill, interpolate} from 'remotion';

/* ---------- time: '012' = start of line 012, '012+20' frames after, '012e-10' = 10 frames before its end ---------- */
export type T = string | number;
const RX = /^(\d{3})(e?)([+-]\d+)?$/;
export const tf = (t: T, c: Shot): number => {
	if (typeof t === 'number') return t;
	const m = RX.exec(t);
	if (!m) throw new Error('bad time ' + t);
	return (m[2] ? c.end(m[1]) : c.at(m[1])) + (m[3] ? Number(m[3]) : 0);
};

type Expr = 'normal' | 'angry' | 'sad' | 'sleepy' | 'wide' | 'worried';
type Mouth = 'line' | 'frown' | 'open' | 'smile' | 'flat' | 'smirk' | 'none';
export type Walk = [number, number, T, T, ('walk' | 'run')?]; // x0, x1, from, to
export type A = {
	who: string;
	x: number;
	s?: number;
	fl?: number; // floor y
	fc?: 1 | -1;
	sp?: string; // speaker code (default CAST sp / WHO upper)
	w?: Walk[];
	turn?: [T, 1 | -1][];
	g?: [Gesture, T, T][];
	ex?: [Expr, T, T][];
	mo?: [Mouth, T, T][];
	hop?: [T, T, number][]; // jump with height px
	crouch?: [T, T][];
	sit?: [T, T][];
	hand?: ['point' | 'snap' | 'fist', T, T][];
	look?: [number, number, T?, T?] | [number, number, T?, T?][];
	pose?: (p: Pose, c: Shot, x: number) => Pose; // custom override
	bobf?: (c: Shot) => number; // extra vertical lift (px)
	item?: React.ReactNode;
	fx?: number; // face turn
	hide?: [T, T]; // visible only in this window? -> [from, to]
	seed?: number;
	hood?: boolean;
	z?: number;
};

export const evalA = (a: A, c: Shot) => {
	const {f, gf} = c;
	const s = a.s ?? 1;
	const seed = a.seed ?? Math.round(a.x / 97);
	let x = a.x;
	let pose: Pose = idle(gf, seed);
	let vx = 0;
	let bob = 0;
	let moving = false;
	const dirs: [number, 1 | -1][] = [[-1e9, a.fc ?? 1]];
	const ws = a.w ?? [];
	let placed = false;
	for (const [x0, x1, ta, tb, mode] of ws) {
		const t0 = tf(ta, c);
		const t1 = tf(tb, c);
		const sgn = (x1 >= x0 ? 1 : -1) as 1 | -1;
		if (f < t0) {
			if (!placed) {
				x = x0;
				placed = true;
			}
			break;
		}
		dirs.push([t0, sgn]);
		if (f <= t1) {
			const u = Math.max(0, Math.min(1, (f - t0) / Math.max(1, t1 - t0)));
			const e = mode === 'run' ? u : u * u * (3 - 2 * u);
			x = x0 + (x1 - x0) * e;
			const st = Math.min(1, Math.min(u, 1 - u) * (mode === 'run' ? 4 : 6));
			const sp = mode === 'run' ? 0.5 : 0.34;
			const ph = (f - t0) * sp * 1.15;
			pose = blend(idle(gf, seed), mode === 'run' ? run(ph) : walk(ph), st);
			vx = ((x1 - x0) / Math.max(1, t1 - t0)) * (mode === 'run' ? 1 : 6 * u * (1 - u));
			bob = Math.abs(Math.sin(ph)) * (mode === 'run' ? 8 : 4);
			moving = true;
			placed = true;
			break;
		}
		x = x1;
		placed = true;
	}
	for (const [t, d] of a.turn ?? []) dirs.push([tf(t, c), d]);
	dirs.sort((p, q) => p[0] - q[0]);
	let facing: 1 | -1 = 1;
	for (const [t, d] of dirs) if (f >= t) facing = d;
	// poses
	const sitK = (a.sit ?? []).reduce((m, [p, q]) => Math.max(m, env(f, tf(p, c), tf(q, c), 8, 8)), 0);
	if (sitK > 0) {
		pose = blend(pose, SIT, sitK);
		bob -= 47 * sitK;
	}
	const crK = (a.crouch ?? []).reduce((m, [p, q]) => Math.max(m, env(f, tf(p, c), tf(q, c), 10, 10)), 0);
	if (crK > 0) {
		pose = blend(pose, {lean: 14, head: -8, armB: [30, 40], armF: [40, 50], legB: [60, 110], legF: [66, 105]}, crK);
		bob -= 64 * crK;
	}
	let armOver = false;
	let handF: 'point' | 'snap' | 'fist' | undefined;
	for (const [g, p, q] of a.g ?? []) {
		const k = env(f, tf(p, c), tf(q, c), 9, 9);
		if (k > 0) {
			pose = gesture(g, pose, k, f);
			if (k > 0.4 && ['touchFace', 'rubChin', 'facepalm', 'think', 'scratch', 'handsOnHead'].includes(g)) armOver = true;
			if (k > 0.4 && g === 'point') handF = 'point';
			if (k > 0.4 && g === 'fist') handF = 'fist';
		}
	}
	for (const [h, p, q] of a.hand ?? []) if (f >= tf(p, c) && f <= tf(q, c)) handF = h;
	let hopY = 0;
	for (const [p, q, h] of a.hop ?? []) {
		const t0 = tf(p, c);
		const t1 = tf(q, c);
		if (f >= t0 && f <= t1) {
			const u = (f - t0) / Math.max(1, t1 - t0);
			hopY = Math.max(hopY, h * 4 * u * (1 - u));
			pose = blend(pose, {lean: -4, head: 0, armB: [60, 20], armF: [70, 20], legB: [-10, 30], legF: [14, 30]}, Math.min(1, 4 * u * (1 - u) * 1.5));
		}
	}
	if (a.pose) pose = a.pose(pose, c, x);
	if (a.bobf) bob += a.bobf(c);
	let expr: Expr | undefined;
	for (const [e, p, q] of a.ex ?? []) if (f >= tf(p, c) && f <= tf(q, c)) expr = e;
	let mouth: Mouth | undefined;
	for (const [m, p, q] of a.mo ?? []) if (f >= tf(p, c) && f <= tf(q, c)) mouth = m;
	let look: [number, number] | undefined;
	const lk = (a.look ? (Array.isArray(a.look[0]) ? a.look : [a.look]) : []) as [number, number, T?, T?][];
	for (const [lx, ly, p, q] of lk) if ((p === undefined || f >= tf(p, c)) && (q === undefined || f <= tf(q, c))) look = [lx, ly];
	const visible = a.hide ? f >= tf(a.hide[0], c) && f <= tf(a.hide[1], c) : true;
	return {x, pose, vx, bob: bob / s + hopY / s, moving, facing, armOver, handF, expr, mouth, look, visible, s};
};

export type Ctx = Shot & {ev: ReturnType<typeof evalA>[]; speaker: string | null};
export type Sc = {
	at: string;
	bg?: React.ReactNode | ((c: Ctx) => React.ReactNode); // far layer
	badge?: number; // index of the actor that carries the SOL badge
	bgDepth?: number;
	mid?: (c: Ctx) => React.ReactNode; // between bg and actors (world space, depth 1.2)
	actors?: A[];
	fx?: (c: Ctx) => React.ReactNode; // world space above actors, depth 1
	front?: (c: Ctx) => React.ReactNode; // foreground, depth 0.7 (blurred)
	ov?: (c: Ctx) => React.ReactNode; // screen space overlay
	cam?: [number, number, number] | [[number, number, number], [number, number, number]];
	follow?: number; // close-up zoom on whoever speaks
	whip?: boolean;
	light?: Light | false;
	bgc?: string;
	dust?: string;
	shake?: [T, T, number?];
	flash?: T;
	still?: boolean;
};

const Sc_: React.FC<{s: Sc}> = ({s}) => {
	const c0 = useShot();
	const sp = useSpeaking(c0.gf);
	const ev = (s.actors ?? []).map((a) => evalA(a, c0));
	const c: Ctx = {...c0, ev, speaker: sp};
	const cam0 = s.cam ?? [960, 560, 1];
	const A0 = (Array.isArray(cam0[0]) ? cam0[0] : cam0) as [number, number, number];
	const A1 = (Array.isArray(cam0[0]) ? cam0[1] : [A0[0], A0[1] - 10, A0[2] * 1.12]) as [number, number, number];
	let cam = usePush(camOn(...A0), camOn(...A1));
	if (s.follow && sp) {
		const i = (s.actors ?? []).findIndex((a) => (a.sp ?? CAST[a.who]?.sp ?? a.who.toUpperCase()) === sp);
		if (i >= 0) {
			const e = ev[i];
			cam = mixCam(camOn(e.x + 20 * e.facing, 900 - 157 * e.s - 120 * e.s, s.follow), camOn(e.x + 20 * e.facing, 900 - 157 * e.s - 110 * e.s, s.follow * 1.08), 0.5);
		}
	}
	let sh = 0;
	if (s.shake) {
		const a = tf(s.shake[0], c0);
		const b = tf(s.shake[1], c0);
		sh = c0.f >= a && c0.f <= b ? (s.shake[2] ?? 8) : 0;
	}
	const fl = s.flash !== undefined ? Math.max(0, 1 - Math.abs(c0.f - tf(s.flash, c0)) / 6) : 0;
	return (
		<>
			<Stage cam={sh ? {...cam, x: cam.x + Math.sin(c0.f * 5) * sh, y: cam.y + Math.cos(c0.f * 7) * sh} : cam} bg={s.bgc ?? '#150c14'} light={s.light ?? {x: 25, y: 10, o: 0.3}} dust={s.dust} still={s.still}>
				{s.bg ? <Layer depth={s.bgDepth ?? 1.35}>{typeof s.bg === 'function' ? s.bg(c) : s.bg}</Layer> : null}
				{s.mid ? (
					<Layer depth={1.15}>
						<Svg>{s.mid(c)}</Svg>
					</Layer>
				) : null}
				<Layer depth={1}>
					<Svg>
						{(s.actors ?? []).map((a, i) => {
							const e = ev[i];
							if (!e.visible) return null;
							return (
								<Actor
									key={i}
									who={a.who}
									sp={a.sp}
									x={e.x}
									floor={a.fl ?? 900}
									s={a.s ?? 1}
									facing={e.facing}
									faceTurn={a.fx ?? (e.moving ? 0.6 : 0.35)}
									pose={e.pose}
									vx={e.vx}
									bob={e.bob}
									armOver={e.armOver}
									handF={e.handF}
									expr={e.expr}
									mouth={e.mouth}
									look={e.look}
									handItem={a.item}
									hood={a.hood}
									seed={a.seed ?? i + 1}
									uid={'a' + i + a.who}
								/>
							);
						})}
						{s.badge !== undefined && ev[s.badge] ? <HeroBadge x={ev[s.badge].x} y={900 - 157 * ev[s.badge].s - 164 * ev[s.badge].s - 115} s={0.75} /> : null}
						{s.fx ? s.fx(c) : null}
					</Svg>
				</Layer>
				{s.front ? (
					<Layer depth={0.7}>
						<Svg>{s.front(c)}</Svg>
					</Layer>
				) : null}
			</Stage>
			{s.ov ? <AbsoluteFill style={{pointerEvents: 'none'}}>{s.ov(c)}</AbsoluteFill> : null}
			{fl > 0 ? <AbsoluteFill style={{background: '#fff', opacity: fl * 0.8}} /> : null}
		</>
	);
};

export const sc = (s: Sc): ShotDef => ({at: s.at, whip: s.whip, C: () => <Sc_ s={s} />});
export const eo = (c: Ctx, i: number) => c.ev[i];
