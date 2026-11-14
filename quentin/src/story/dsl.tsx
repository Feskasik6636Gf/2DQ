import React from 'react';
import {AbsoluteFill, interpolate, spring, useVideoConfig, random} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Gesture, SIT, blend, env, gesture, idle, reach, run, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot} from '../kit/core';
import type {Shot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Callout} from '../kit/graphics';
import {HeroBadge, Layer, Stage, Svg, camOn, mixCam, clamp, ease} from '../kit/kit';
import {FONT} from '../kit/ui';
import {PLACES} from './places';

/* A tiny scene language: a scene is DATA (place + actors + camera + graphics), timed against
   the voice lines. Time refs: a number = frames from scene start, '012' = start of line 012,
   '012+30' = 30 frames after it, 'e012' = end of line 012, 'e012-10' = 10 frames before it ends. */
export type T = string | number;
export const R = (sh: Shot, t: T): number => {
	if (typeof t === 'number') return t;
	const m = /^(e)?(\d+)([+-]\d+)?$/.exec(t);
	if (!m) return 0;
	const base = m[1] ? sh.end(m[2]) : sh.at(m[2]);
	return base + (m[3] ? parseInt(m[3], 10) : 0);
};

type Go = [T, T, number] | [T, T, number, 'run'];
export type ActorSpec = {
	who: string;
	x: number;
	s?: number;
	floor?: number;
	face?: 1 | -1;
	go?: Go[];
	g?: [Gesture, T, T][]; // gestures
	ex?: [string, string, T, T][]; // [expr, mouth, from, to]
	reachTo?: [T, T, number, number, ('F' | 'B')?][]; // hand to a world point
	sit?: boolean;
	lean?: [number, T, T] | [number, T, T][]; // extra body tilt (deg) in a window
	squash?: [number, T, T] | [number, T, T][];
	hood?: boolean;
	look?: [number, number];
	badge?: boolean;
	hide?: [T, T]; // visible only between
	drop?: [T, T, number]; // falls from above: [from, to, startHeight]
	turn?: number;
};

export type Gfx =
	| {k: 'tag'; t: [T, T]; x: number; y: number; text: string; c?: string; size?: number; rot?: number}
	| {k: 'call'; t: [T, T]; from: [number, number]; to: [number, number]; text: string; c?: string}
	| {k: 'big'; t: [T, T]; text: string; sub?: string; c?: string; y?: number; size?: number}
	| {k: 'flash'; t: [T]}
	| {k: 'shake'; t: [T, T]; amp?: number}
	| {k: 'dim'; t: [T, T]; o?: number};

export type Spec = {
	at: string;
	whip?: boolean;
	place: string;
	pv?: any | ((c: Ctx) => any);
	bg?: string;
	cam: number[]; // [X,Y,z] or [X,Y,z, X2,Y2,z2]
	follow?: string; // actor id; cam X = actor x + cam X offset
	actors?: ActorSpec[];
	gfx?: Gfx[];
	fx?: (c: Ctx) => React.ReactNode; // world overlay, in front of the actors
	back?: (c: Ctx) => React.ReactNode; // world overlay, behind the actors
	night?: boolean;
	dust?: string;
	light?: any;
	fg?: boolean; // blurred dark foreground silhouette
};
export type Ctx = {f: number; gf: number; sh: Shot; xs: Record<string, number>; R: (t: T) => number};

const motion = (a: ActorSpec, i: number, sh: Shot) => {
	const {f, gf} = sh;
	let x = a.x;
	let pose: Pose = idle(gf, i * 3);
	let facing: 1 | -1 = a.face ?? 1;
	let vx = 0;
	let bob = 0;
	let moving = false;
	let px = a.x;
	for (const seg of a.go ?? []) {
		const t0 = R(sh, seg[0]);
		const t1 = R(sh, seg[1]);
		const tx = seg[2];
		const isRun = seg[3] === 'run';
		if (f < t0) break;
		const w = walkTo(f, t0, t1, px, tx, i + 5, isRun ? 0.55 : 0.3);
		x = w.x;
		facing = tx >= px ? 1 : -1;
		vx = w.vx;
		moving = w.moving;
		if (w.moving) {
			if (isRun) {
				const u = Math.max(0, Math.min(1, (f - t0) / Math.max(1, t1 - t0)));
				const ph = (f - t0) * 0.55;
				pose = blend(idle(gf, i), run(ph), Math.min(1, Math.min(u, 1 - u) * 6));
				bob = Math.abs(Math.sin(ph)) * 7;
			} else {
				pose = w.pose;
				bob = w.bob;
			}
		} else pose = w.pose;
		px = tx;
	}
	return {x, pose, facing, vx, bob, moving};
};

const norm = (v: any): [number, T, T][] => (!v ? [] : Array.isArray(v[0]) ? v : [v]);
const ARM_OVER: Gesture[] = ['touchFace', 'facepalm', 'think', 'rubChin', 'scratch', 'handsOnHead'];

const ActorR: React.FC<{a: ActorSpec; i: number; sh: Shot}> = ({a, i, sh}) => {
	const {f, gf} = sh;
	const s = a.s ?? 1;
	const floor = a.floor ?? 900;
	const m = motion(a, i, sh);
	if (a.hide && (f < R(sh, a.hide[0]) || f > R(sh, a.hide[1]))) return null;
	let pose = m.pose;
	let handF: any;
	let armOver = false;
	for (const [g, t0, t1] of a.g ?? []) {
		const k = env(f, R(sh, t0), R(sh, t1), 8, 8);
		if (k > 0) {
			pose = gesture(g, pose, k, f);
			if (k > 0.5 && ARM_OVER.includes(g)) armOver = true;
			if (k > 0.5 && g === 'point') handF = 'point';
			if (k > 0.5 && g === 'fist') handF = 'fist';
		}
	}
	let hipY = floor - 157 * s;
	for (const [t0, t1, tx, ty, side] of a.reachTo ?? []) {
		const k = env(f, R(sh, t0), R(sh, t1), 8, 8);
		if (k > 0) pose = reach(pose, side ?? 'F', toLocal(tx, ty, m.x, hipY, s, m.facing), k);
	}
	for (const [deg, t0, t1] of norm(a.lean)) {
		const k = env(f, R(sh, t0), R(sh, t1), 10, 10);
		pose = {...pose, lean: pose.lean + deg * k};
	}
	let squash = 0;
	for (const [v, t0, t1] of norm(a.squash)) squash += v * env(f, R(sh, t0), R(sh, t1), 3, 8);
	let expr: any;
	let mouth: any;
	for (const [e, mo, t0, t1] of a.ex ?? []) {
		if (f >= R(sh, t0) && f <= R(sh, t1)) {
			expr = e === '-' ? undefined : e;
			mouth = mo === '-' ? undefined : mo;
		}
	}
	let seat: number | undefined;
	if (a.sit) {
		pose = blend(pose, SIT, 1);
		seat = floor - 48 * s;
	}
	let dy = 0;
	if (a.drop) {
		const [t0, t1, h] = a.drop;
		const u = interpolate(f, [R(sh, t0), R(sh, t1)], [0, 1], clamp);
		dy = -h * (1 - u * u);
		if (u < 1) pose = {...pose, armF: [150, 20], armB: [-150, 20], legF: [30, 10], legB: [-30, 10]};
	}
	const headTop = floor - 157 * s - 164 * s - 115 * s + dy + (a.sit ? 109 * s : 0);
	return (
		<g transform={dy ? `translate(0,${dy})` : undefined}>
			<Actor
				who={a.who}
				x={m.x}
				floor={floor}
				s={s}
				seat={seat}
				facing={m.facing}
				faceTurn={a.turn ?? (m.moving ? 0.5 : 0.35)}
				look={a.look ?? [m.facing * 0.5, 0]}
				pose={pose}
				expr={expr}
				mouth={mouth}
				armOver={armOver}
				handF={handF}
				hood={a.hood}
				squash={squash || undefined}
				vx={m.vx}
				bob={m.bob}
				uid={a.who + i}
				seed={i}
			/>
			{(a.badge ?? a.who === "hero") && counterAt(gf) > 0 ? <HeroBadge x={m.x} y={headTop - dy} s={0.8} /> : null}
		</g>
	);
};

const isDark = (c: string) => { const n = parseInt(c.replace('#', ''), 16); return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) < 110; };
const Tag: React.FC<{f: number; t0: number; t1: number; x: number; y: number; text: string; c: string; size: number; rot: number}> = ({f, t0, t1, x, y, text, c, size, rot}) => {
	const {fps} = useVideoConfig();
	const k = env(f, t0, t1, 6, 8);
	if (k <= 0) return null;
	const sc = spring({frame: Math.max(0, f - t0), fps, config: {damping: 9, stiffness: 160}});
	const w = text.length * size * 0.62 + 56;
	return (
		<g transform={`translate(${x},${y + Math.sin(f / 9) * 4}) rotate(${rot}) scale(${sc * (0.4 + 0.6 * k)})`} opacity={k}>
			<rect x={-w / 2 - 6} y={-size * 0.95} width={w + 12} height={size * 1.7} rx={size * 0.45} fill="#000" opacity={0.35} />
			<rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.5} rx={size * 0.4} fill={isDark(c) ? "#fffdf4" : "#14112a"} stroke={c} strokeWidth={5} />
			<text x={0} y={size * 0.28} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={c} letterSpacing={1}>
				{text}
			</text>
		</g>
	);
};

const Big: React.FC<{f: number; t0: number; t1: number; text: string; sub?: string; c: string; y: number; size: number}> = ({f, t0, t1, text, sub, c, y, size}) => {
	const {fps} = useVideoConfig();
	const k = env(f, t0, t1, 5, 7);
	if (k <= 0) return null;
	const sc = spring({frame: Math.max(0, f - t0), fps, config: {damping: 8, stiffness: 190}});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', alignItems: 'center', justifyContent: 'flex-start'}}>
			<div style={{marginTop: y, transform: `scale(${0.5 + 0.5 * sc}) rotate(${Math.sin(f / 11) * 1.2}deg)`, opacity: k, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, color: c, letterSpacing: 2, textShadow: '0 6px 0 rgba(0,0,0,.55), 0 0 40px rgba(0,0,0,.5)', WebkitTextStroke: isDark(c) ? '3px #fffdf4' : '3px #14112a'}}>
				{text}
				{sub ? <div style={{fontSize: size * 0.4, color: '#fff', marginTop: 6, WebkitTextStroke: '2px #14112a'}}>{sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

export const makeShot = (spec: Spec): ShotDef => {
	const C: React.FC = () => {
		const sh = useShot();
		const {f, gf, dur} = sh;
		const acts = spec.actors ?? [];
		const ms = acts.map((a, i) => motion(a, i, sh));
		const xs: Record<string, number> = {};
		acts.forEach((a, i) => (xs[a.who] = ms[i].x));
		const ctx: Ctx = {f, gf, sh, xs, R: (t) => R(sh, t)};
		// camera
		const c = spec.cam;
		const fx0 = spec.follow ? xs[spec.follow] ?? 0 : 0;
		const A = camOn(c[0] + fx0, c[1], c[2]);
		const B = c.length >= 6 ? camOn(c[3] + fx0, c[4], c[5]) : camOn(c[0] + fx0 + 40, c[1] - 12, c[2] * 1.12);
		const cam = mixCam(A, B, interpolate(f, [0, dur], [0, 1], {...clamp, easing: ease}));
		// shake
		let sx = 0;
		let sy = 0;
		let flash = 0;
		let dim = 0;
		for (const g of spec.gfx ?? []) {
			if (g.k === 'shake') {
				const k = env(f, R(sh, g.t[0]), R(sh, g.t[1]), 2, 6);
				sx += (random('sx' + f) - 0.5) * (g.amp ?? 26) * k;
				sy += (random('sy' + f) - 0.5) * (g.amp ?? 26) * k;
			}
			if (g.k === 'flash') {
				const t = R(sh, g.t[0]);
				flash = Math.max(flash, interpolate(f, [t, t + 1, t + 8], [0, 0.9, 0], clamp));
			}
			if (g.k === 'dim') dim = Math.max(dim, (g.o ?? 0.6) * env(f, R(sh, g.t[0]), R(sh, g.t[1]), 8, 10));
		}
		const Place = PLACES[spec.place];
		const pv = typeof spec.pv === 'function' ? spec.pv(ctx) : spec.pv ?? {};
		return (
			<AbsoluteFill style={{transform: sx || sy ? `translate(${sx}px,${sy}px) scale(1.03)` : undefined}}>
				<Stage cam={cam} bg={spec.bg ?? '#201c0a'} light={spec.light ?? {x: 50, y: 5, o: 0.3, night: spec.night}} dust={spec.dust}>
					<Layer depth={1.4}>
						<Place {...pv} f={gf} />
					</Layer>
					<Layer depth={1}>
						<Svg>
							{spec.back ? spec.back(ctx) : null}
							{acts.map((a, i) => (
								<ActorR key={i} a={a} i={i} sh={sh} />
							))}
							{(spec.gfx ?? []).map((g, i) => {
								if (g.k === 'tag') return <Tag key={i} f={f} t0={R(sh, g.t[0])} t1={R(sh, g.t[1])} x={g.x} y={g.y} text={g.text} c={g.c ?? '#ffd34a'} size={g.size ?? 44} rot={g.rot ?? 0} />;
								if (g.k === 'call') return <Callout key={i} f={f} t0={R(sh, g.t[0])} t1={R(sh, g.t[1])} from={g.from} to={g.to} text={g.text} c={g.c} />;
								return null;
							})}
							{spec.fx ? spec.fx(ctx) : null}
						</Svg>
					</Layer>
					{spec.fg ? (
						<Layer depth={0.55}>
							<Svg>
								<rect x={-300 + Math.sin(f / 70) * 40} y={-200} width={170} height={1500} fill="#000" opacity={0.85} />
								<rect x={2000 - Math.sin(f / 80) * 40} y={-200} width={200} height={1500} fill="#000" opacity={0.85} />
							</Svg>
						</Layer>
					) : null}
				</Stage>
				{dim > 0 ? <AbsoluteFill style={{background: '#000', opacity: dim}} /> : null}
				{(spec.gfx ?? []).map((g, i) => (g.k === 'big' ? <Big key={i} f={f} t0={R(sh, g.t[0])} t1={R(sh, g.t[1])} text={g.text} sub={g.sub} c={g.c ?? '#ffe45a'} y={g.y ?? 120} size={g.size ?? 140} /> : null))}
				{flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
			</AbsoluteFill>
		);
	};
	return {at: spec.at, C, whip: spec.whip};
};
