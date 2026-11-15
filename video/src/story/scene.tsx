import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig} from 'remotion';
import {Pose} from '../engine/Stickman';
import {toLocal} from '../engine/Stickman';
import {blend, env, gesture, Gesture, idle, reach, run, SIT, walkTo} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {HeroBadge, Layer, Stage, Svg, camOn, clamp, flash, mixCam} from '../kit/kit';
import {Callout, Caption} from '../kit/graphics';
import {FONT, HAND} from '../kit/ui';
import {Crew, Helicopter, PLACES, PlaceName} from './places';
import {Onoma} from '../reference/PauseTime';

/* ---------------------------------------------------------------------------
   A tiny shot language. Time values: a number = frames from the shot start,
   '012' = the start of voice line 012, '012+20' = 20 frames after it, '012e' = the end of line 012,
   '012e-8' = 8 frames before it ends.
   --------------------------------------------------------------------------- */
export type T = number | string;
export type Move = [number, number, T?, T?]; // x from, x to, start, end (default: whole shot)
export type Gs = [Gesture, T, T];
export type ActorSpec = {
	who: string;
	x: number | Move;
	s?: number;
	floor?: number;
	seat?: number; // sitting: y of the hips
	face?: 1 | -1 | [1 | -1, 1 | -1, T];
	mv?: 'walk' | 'run' | 'creep';
	g?: Gs[];
	expr?: 'normal' | 'angry' | 'sad' | 'sleepy' | 'wide' | 'worried';
	mouth?: 'line' | 'frown' | 'open' | 'smile' | 'flat' | 'smirk' | 'none';
	look?: [number, number];
	turn?: number;
	badge?: boolean;
	hide?: [T, T?]; // invisible from..to
	lean?: [number, T, T]; // extra lean degrees during a window (shock / recoil)
	shiver?: boolean;
	hood?: boolean;
	armOver?: [T, T];
	chest?: string;
	sit?: [T, T]; // sits down during this window
	squash?: [number, T];
	acc?: ('headphones' | 'mustache' | 'glasses')[];
	fl?: [number, number, T, T]; // floor animates (descending on a rope)
	hang?: [T, T]; // arms up, hanging on a rope
	rise?: T; // seated until this moment, then stands
	rt?: [number, number, T, T]; // front hand reaches a world point
	sitX?: number; // seat y for `rise`
};
export type Fx =
	| {k: 'clock'; text: string; t: T; d?: number}
	| {k: 'word'; text: string; t: T; d?: number; y?: number; c?: string; size?: number}
	| {k: 'big'; text: string; t: T; d?: number; c?: string; x?: number; y?: number}
	| {k: 'call'; text: string; t: T; d?: number; from: [number, number]; to: [number, number]}
	| {k: 'flash'; t: T}
	| {k: 'shake'; t: T; d?: number; amp?: number}
	| {k: 'dark'; t: T; d?: number}
	| {k: 'onoma'; text: string; t: T; x: number; y: number; c?: string; rot?: number; size?: number}
	| {k: 'red'; t: T; d?: number; o?: number}
	| {k: 'paper'; t: T; d?: number; title?: string; lines: {text: string; t: T; c?: string; hand?: boolean; strike?: boolean}[]; x?: number; y?: number; w?: number; rot?: number; size?: number; stamp?: {text: string; t: T}}
	| {k: 'photo'; t: T; d?: number; x?: number; y?: number; label?: string; rot?: number}
	| {k: 'badge'; x: number; y: number; s?: number}
	| {k: 'drip'; x: number; y: number; t: T; d?: number}
	| {k: 'puddle'; x: number; y: number; t: T; w?: number}
	| {k: 'heli'; x: [number, number]; y: [number, number]; s?: number; tilt?: number; rope?: number; depth?: number};
export type Cam3 = [number, number, number];
export type SceneSpec = {
	at: string;
	off?: number;
	loc: PlaceName;
	k?: number; // 0 dusk … 1 night
	p?: Record<string, number | [number, number, T?, T?]>;
	cam: Cam3 | [Cam3, Cam3];
	follow?: number; // index of the actor the camera trails (x only)
	roll?: [number, number];
	actors?: ActorSpec[];
	crew?: {n: number; x0: number; x1: number; s?: number; seat?: number; stand?: number | [number, number, T, T]; look?: [number, number]; facing?: 1 | -1 | [1 | -1, 1 | -1, T]; floor?: number; skip?: number[]; dx?: number | [number, number, T, T]; walking?: boolean; sag?: number | [number, number, T, T]};
	fx?: Fx[];
	whip?: boolean;
	tint?: string;
	frontMask?: boolean;
};

/* time parser needs the shot's `at`/`end` helpers */
const mkT = (at: (n: string) => number, end: (n: string) => number, dur: number) => (t: T | undefined, d = 0): number => {
	if (t === undefined) return d;
	if (typeof t === 'number') return t;
	const m = /^(\d{3})(e)?([+-]\d+)?$/.exec(t);
	if (!m) return d;
	const base = m[2] ? end(m[1]) : at(m[1]);
	return base + (m[3] ? Number(m[3]) : 0);
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeIO = Easing.inOut(Easing.cubic);

/* ------------------------------ overlays ------------------------------ */
const ClockPill: React.FC<{text: string; t: number; d: number}> = ({text, t, d}) => {
	const {fps} = useVideoConfig();
	if (t < 0 || t > d) return null;
	const k = spring({frame: t, fps, config: {damping: 12, stiffness: 170}});
	const o = interpolate(t, [d - 8, d], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 70, top: 60, opacity: o, transform: `translateX(${(1 - k) * -260}px) scale(${0.9 + 0.1 * k})`, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(10,14,30,0.9)', border: '4px solid #7fe3ff', borderRadius: 40, padding: '10px 30px 10px 14px', boxShadow: '0 0 30px rgba(127,227,255,.35)'}}>
				<svg width={56} height={56} viewBox="-30 -30 60 60">
					<circle r={26} fill="#f4f0e4" stroke="#7fe3ff" strokeWidth={4} />
					<line x1={0} y1={0} x2={0} y2={-16} stroke="#111" strokeWidth={4} strokeLinecap="round" transform={`rotate(${t * 6})`} />
					<line x1={0} y1={0} x2={11} y2={0} stroke="#111" strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 0.5})`} />
				</svg>
				<span style={{fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#fff', letterSpacing: 2}}>{text}</span>
			</div>
		</AbsoluteFill>
	);
};

const BigWord: React.FC<{text: string; t: number; d: number; c?: string; x?: number; y?: number; size?: number}> = ({text, t, d, c = '#ffc94a', x = 960, y = 540, size = 260}) => {
	const {fps} = useVideoConfig();
	if (t < 0 || t > d) return null;
	const k = spring({frame: t, fps, config: {damping: 9, stiffness: 190}});
	const o = interpolate(t, [d - 7, d], [1, 0], clamp);
	const shake = t < 8 ? (random('bw' + t) - 0.5) * 16 : 0;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: x - 900, width: 1800, top: y - size * 0.62, textAlign: 'center', opacity: o, transform: `translate(${shake}px,${shake * 0.5}px) scale(${0.35 + 0.65 * k}) rotate(${(1 - k) * -6}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: c, WebkitTextStroke: `${size * 0.04}px #0b0d1e`, paintOrder: 'stroke', textShadow: '0 12px 40px rgba(0,0,0,.65)', lineHeight: 1}}>
				{text}
			</div>
		</AbsoluteFill>
	);
};

const Paper: React.FC<{e: Extract<Fx, {k: 'paper'}>; t: number; tt: (t: T | undefined, d?: number) => number; f: number}> = ({e, t, tt, f}) => {
	const {fps} = useVideoConfig();
	const d = e.d ?? 120;
	if (t < 0 || t > d) return null;
	const k = spring({frame: t, fps, config: {damping: 13, stiffness: 150}});
	const o = interpolate(t, [d - 8, d], [1, 0], clamp);
	const w = e.w ?? 640;
	const size = e.size ?? 44;
	const rot = (e.rot ?? -3) + Math.sin(f / 40) * 0.6;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: (e.x ?? 1250) - w / 2, top: e.y ?? 120, width: w, opacity: o, transform: `translateX(${(1 - k) * 700}px) rotate(${rot + (1 - k) * 12}deg) scale(${0.92 + 0.08 * k})`, background: '#f3ecd6', borderRadius: 10, padding: '30px 38px 34px', boxShadow: '0 24px 60px rgba(0,0,0,.55)', border: '2px solid #cdbf98'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: '#cdbf98', borderRadius: '10px 10px 0 0'}} />
				{e.title ? <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size * 0.8, letterSpacing: 3, color: '#2c2a22', borderBottom: '3px solid #2c2a22', paddingBottom: 8, marginBottom: 10}}>{e.title}</div> : null}
				{e.lines.map((l, i) => {
					const lt = t - (tt(l.t) - tt(e.t));
					if (lt < 0) return null;
					const a = interpolate(lt, [0, 7], [0, 1], clamp);
					return (
						<div key={i} style={{fontFamily: l.hand ? HAND : FONT, fontWeight: l.hand ? 700 : 600, fontSize: l.hand ? size * 1.25 : size, color: l.c ?? '#23211a', opacity: a, transform: `translateX(${(1 - a) * 30}px)`, textDecoration: l.strike && lt > 14 ? 'line-through' : 'none', textDecorationThickness: 5, textDecorationColor: '#b6322a', lineHeight: 1.22, whiteSpace: 'nowrap'}}>
							{l.text}
						</div>
					);
				})}
				{e.stamp && t >= tt(e.stamp.t) - tt(e.t) ? (
					<div style={{position: 'absolute', right: 30, bottom: 26, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#c0392b', border: '6px solid #c0392b', padding: '2px 16px', borderRadius: 8, transform: `rotate(-12deg) scale(${interpolate(t - (tt(e.stamp.t) - tt(e.t)), [0, 4, 8], [2.4, 0.9, 1], clamp)})`, opacity: 0.88}}>
						{e.stamp.text}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const Photo: React.FC<{t: number; d: number; x?: number; y?: number; label?: string; rot?: number}> = ({t, d, x = 1300, y = 170, label, rot = 4}) => {
	const {fps} = useVideoConfig();
	if (t < 0 || t > d) return null;
	const k = spring({frame: t, fps, config: {damping: 10, stiffness: 170}});
	const o = interpolate(t, [d - 8, d], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: x - 190, top: y, width: 380, opacity: o, transform: `scale(${0.4 + 0.6 * k}) rotate(${rot + (1 - k) * 20}deg)`, background: '#f4f1e6', padding: 20, borderRadius: 8, boxShadow: '0 24px 60px rgba(0,0,0,.6)'}}>
				<svg viewBox="-170 -190 340 380" width={340} height={380}>
					<rect x={-170} y={-190} width={340} height={380} fill="#6d8fb4" />
					<path d="M-130,190 q0,-120 130,-120 q130,0 130,120 z" fill="#f2f2f2" />
					<path d="M-62,70 l-26,60 M62,70 l26,60" stroke="#c9a23a" strokeWidth={14} strokeLinecap="round" />
					<rect x={-26} y={46} width={52} height={40} fill="#0a0a0a" />
					<circle cx={0} cy={-30} r={92} fill="#0a0a0a" />
					<path d="M-96,-52 q96,-120 192,0 l8,-22 q-104,-120 -208,0 z" fill="#1f2c52" />
					<path d="M-110,-44 q110,-30 220,0 l0,18 q-110,-26 -220,0 z" fill="#14213d" />
					<ellipse cx={-30} cy={-24} rx={15} ry={19} fill="#fff" />
					<ellipse cx={34} cy={-24} rx={15} ry={19} fill="#fff" />
					<circle cx={-26} cy={-22} r={8} fill="#000" />
					<circle cx={38} cy={-22} r={8} fill="#000" />
					<path d="M-26,20 q26,12 52,0" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />
				</svg>
				{label ? <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 52, color: '#222', textAlign: 'center', marginTop: 4}}>{label}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

/* ------------------------------ the scene ------------------------------ */
export const makeScene = (S: SceneSpec): React.FC => () => {
	const {f, gf, at, end, dur} = useShot();
	const tt = mkT(at, end, dur);
	const P = PLACES[S.loc];
	const k = S.k ?? 0;

	// location props (numbers or animated [from, to, t0, t1])
	const p: Record<string, number> = {};
	for (const [key, v] of Object.entries(S.p ?? {})) {
		if (Array.isArray(v)) {
			const t0 = tt(v[2], 0);
			const t1 = tt(v[3], dur);
			p[key] = interpolate(f, [t0, Math.max(t0 + 1, t1)], [v[0], v[1]], {...clamp});
		} else p[key] = v;
	}

	// actors
	const rendered = (S.actors ?? []).map((a, i) => {
		const sc = a.s ?? 1;
		const FL = a.fl ? interpolate(f, [tt(a.fl[2], 0), tt(a.fl[3], dur)], [a.fl[0], a.fl[1]], {...clamp, easing: easeIO}) : a.floor ?? 900;
		let x: number;
		let pose: Pose;
		let vx = 0;
		let bob = 0;
		let moving = false;
		let faceDir: 1 | -1 = 1;
		if (Array.isArray(a.x)) {
			const t0 = tt(a.x[2], 0);
			const t1 = tt(a.x[3], dur);
			const sp = a.mv === 'run' ? 0.6 : a.mv === 'creep' ? 0.18 : 0.3;
			const w = walkTo(f, t0, t1, a.x[0], a.x[1], i + 3, sp);
			x = w.x;
			pose = w.pose;
			vx = w.vx * (a.mv === 'run' ? 1.4 : 1);
			bob = w.bob;
			moving = w.moving;
			faceDir = w.facing;
			if (a.mv === 'run' && w.moving) pose = blend(idle(f, i), run(f * 0.55), Math.min(1, Math.min((f - t0) / 4, (t1 - f) / 4)));
			if (a.mv === 'creep' && w.moving) pose = {...pose, lean: pose.lean - 6, head: pose.head + 5};
		} else {
			x = a.x;
			pose = idle(gf, i * 2.1);
		}
		if (a.face !== undefined) faceDir = Array.isArray(a.face) ? (f >= tt(a.face[2]) ? a.face[1] : a.face[0]) : a.face;
		const ph = Array.isArray(a.x) ? 1 : 0;
		void ph;
		// sitting down
		let seat = a.seat;
		if (a.sit) {
			const k2 = env(f, tt(a.sit[0]), tt(a.sit[1]), 10, 999);
			pose = blend(pose, SIT, k2);
			if (k2 > 0.01) seat = FL - 157 * sc + 100 * k2 * sc * 0.85;
		}
		if (a.seat !== undefined) pose = SIT;
		if (a.rise !== undefined) {
			if (f < tt(a.rise)) {
				pose = SIT;
				seat = a.sitX ?? 790;
			} else {
				const u = interpolate(f, [tt(a.rise), tt(a.rise) + 12], [0, 1], clamp);
				pose = blend(SIT, pose, u);
				seat = u < 1 ? lerp(a.sitX ?? 790, FL - 157 * sc, u) : undefined;
			}
		}
		if (a.hang) {
			const hk = env(f, tt(a.hang[0]), tt(a.hang[1]), 6, 6);
			pose = {...pose, armF: [lerp(pose.armF[0], 168, hk), lerp(pose.armF[1], 4, hk)], armB: [lerp(pose.armB[0], 160, hk), lerp(pose.armB[1], 4, hk)], legF: [lerp(pose.legF[0], 6, hk), lerp(pose.legF[1], 24, hk)], legB: [lerp(pose.legB[0], -6, hk), lerp(pose.legB[1], 30, hk)]};
		}
		if (a.rt) {
			const kk = env(f, tt(a.rt[2]), tt(a.rt[3]), 9, 9);
			if (kk > 0) {
				const hip = seat ?? FL - 157 * sc;
				const loc = toLocal(a.rt[0], a.rt[1], x, hip, sc, faceDir);
				pose = reach(pose, 'F', loc, kk);
			}
		}
		let handF: 'point' | 'fist' | 'snap' | undefined;
		let over = 0;
		for (const g of a.g ?? []) {
			const kk = env(f, tt(g[1]), tt(g[2]), 7, 9);
			if (kk > 0) {
				pose = gesture(g[0], pose, kk, f);
				if (g[0] === 'point' && kk > 0.5) handF = 'point';
				if (g[0] === 'fist' && kk > 0.5) handF = 'fist';
				if (['touchFace', 'rubChin', 'facepalm', 'think', 'scratch'].includes(g[0])) over = Math.max(over, kk);
			}
		}
		if (a.lean) pose = {...pose, lean: pose.lean + a.lean[0] * env(f, tt(a.lean[1]), tt(a.lean[2]), 5, 9)};
		if (a.shiver) pose = {...pose, lean: pose.lean + Math.sin(f * 2.3) * 1.5, head: pose.head + Math.sin(f * 2.9) * 2};
		let hidden = false;
		if (a.hide) hidden = f >= tt(a.hide[0]) && f < tt(a.hide[1], 99999);
		const ao = a.armOver ? env(f, tt(a.armOver[0]), tt(a.armOver[1]), 6, 6) > 0.4 : over > 0.45;
		const sq = a.squash ? 1 + (-0.14) * Math.exp(-Math.max(0, f - tt(a.squash[1])) / 4) * (f >= tt(a.squash[1]) ? 1 : 0) : undefined;
		return {a, i, sc, FL, x, pose, vx, bob, moving, faceDir, seat, handF, ao, hidden, sq};
	});

	const an = (v: number | [number, number, T, T] | undefined, d: number) => (v === undefined ? d : Array.isArray(v) ? interpolate(f, [tt(v[2]), Math.max(tt(v[2]) + 1, tt(v[3]))], [v[0], v[1]], {...clamp}) : v);
	// camera
	const cams: [Cam3, Cam3] = (Array.isArray(S.cam[0]) ? S.cam : [S.cam, S.cam]) as [Cam3, Cam3];
	const prog = interpolate(f, [0, dur], [0, 1], {...clamp, easing: easeIO});
	let c0 = camOn(cams[0][0], cams[0][1], cams[0][2]);
	let c1 = camOn(cams[1][0], cams[1][1], cams[1][2]);
	let cam = mixCam(c0, c1, prog);
	if (S.follow !== undefined && rendered[S.follow]) {
		const tx = rendered[S.follow].x;
		const z = lerp(cams[0][2], cams[1][2], prog);
		const y = lerp(cams[0][1], cams[1][1], prog);
		cam = camOn(tx + (cams[0][0] - 960), y, z);
	}
	// shake from fx
	let sx = 0;
	let sy = 0;
	for (const e of S.fx ?? []) {
		if (e.k === 'shake') {
			const t0 = tt(e.t);
			const d = e.d ?? 14;
			if (f >= t0 && f < t0 + d) {
				const amp = (e.amp ?? 14) * (1 - (f - t0) / d);
				sx += Math.sin(f * 7.3) * amp;
				sy += Math.cos(f * 9.1) * amp * 0.7;
			}
		}
	}
	const roll = S.roll ? lerp(S.roll[0], S.roll[1], prog) : 0;

	return (
		<AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) rotate(${roll}deg) scale(${roll ? 1.1 : 1})`}}>
			<Stage cam={cam} bg={P.bg} light={{...P.light, night: P.light.night ?? k > 0.6}} vig={0.5} dust={S.loc === 'deck' ? undefined : '#e8f0c8'}>
				<Layer depth={1.7}>
					<P.Back f={gf} k={k} p={p} />
				</Layer>
				{(S.fx ?? []).filter((e) => e.k === 'heli').map((e, i) => {
					const h = e as Extract<Fx, {k: 'heli'}>;
					const u = interpolate(f, [0, dur], [0, 1], clamp);
					return (
						<Layer key={i} depth={h.depth ?? 1.45}>
							<Svg>
								<Helicopter x={lerp(h.x[0], h.x[1], u)} y={lerp(h.y[0], h.y[1], u) + Math.sin(f / 9) * 6} s={h.s ?? 1} f={gf} tilt={h.tilt ?? 4} rope={h.rope ?? 0} />
							</Svg>
						</Layer>
					);
				})}
				<Layer depth={1}>
					<P.Front f={gf} k={k} p={p} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						{S.crew ? (
							<Crew
								n={S.crew.n}
								x0={S.crew.x0}
								x1={S.crew.x1}
								floor={S.crew.floor ?? 900}
								s={S.crew.s ?? 1}
								f={gf}
								seat={S.crew.seat}
								stand={an(S.crew.stand, 1)}
								look={S.crew.look}
								facing={Array.isArray(S.crew.facing) ? (f >= tt(S.crew.facing[2]) ? S.crew.facing[1] : S.crew.facing[0]) : S.crew.facing}
								skip={S.crew.skip}
								dx={an(S.crew.dx, 0)}
								walking={S.crew.walking}
								sag={an(S.crew.sag, 0)}
							/>
						) : null}
						{rendered
							.filter((r) => !r.hidden)
							.map((r) => (
								<Actor
									key={r.i}
									who={r.a.who}
									x={r.x}
									floor={r.FL}
									s={r.sc}
									seat={r.seat}
									facing={r.faceDir}
									faceTurn={r.a.turn ?? (r.moving ? 0.5 : 0.3)}
									look={r.a.look ?? [r.faceDir * 0.5, 0]}
									expr={r.a.expr}
									mouth={r.a.mouth}
									pose={r.pose}
									vx={r.vx}
									bob={r.bob}
									armOver={r.ao}
									handF={r.handF}
									hood={r.a.hood}
									acc={r.a.acc}
									chestText={r.a.chest}
									squash={r.sq}
									uid={`a${r.i}`}
								/>
							))}
						{rendered
							.filter((r) => r.a.badge && !r.hidden)
							.map((r) => (
								<HeroBadge key={'b' + r.i} x={r.x} y={r.FL - 157 * r.sc - 164 * r.sc - 120 * r.sc} s={0.78 * Math.max(0.9, r.sc)} />
							))}
						{(S.fx ?? []).filter((e) => e.k === 'call').map((e, i) => {
							const c = e as Extract<Fx, {k: 'call'}>;
							return <Callout key={i} f={f} t0={tt(c.t)} t1={tt(c.t) + (c.d ?? 70)} from={c.from} to={c.to} text={c.text} />;
						})}
						{(S.fx ?? []).filter((e) => e.k === 'badge').map((e, i) => {
							const b = e as Extract<Fx, {k: 'badge'}>;
							return <HeroBadge key={'bd' + i} x={b.x} y={b.y} s={b.s ?? 1} />;
						})}
						{(S.fx ?? []).filter((e) => e.k === 'puddle').map((e, i) => {
							const q = e as Extract<Fx, {k: 'puddle'}>;
							const u = interpolate(f - tt(q.t), [0, 90], [0, 1], clamp);
							return (
								<g key={'pd' + i} opacity={0.75}>
									<ellipse cx={q.x} cy={q.y} rx={(q.w ?? 160) * u} ry={(q.w ?? 160) * u * 0.18} fill="#1a3a5c" />
									{[0, 1, 2].map((j) => {
										const t = ((f / 28 + j / 3) % 1) * u;
										return <ellipse key={j} cx={q.x} cy={q.y} rx={(q.w ?? 160) * t * 0.9} ry={(q.w ?? 160) * t * 0.16} fill="none" stroke="#9cc9f0" strokeWidth={2} opacity={1 - t} />;
									})}
								</g>
							);
						})}
						{(S.fx ?? []).filter((e) => e.k === 'drip').map((e, i) => {
							const q = e as Extract<Fx, {k: 'drip'}>;
							const t0 = tt(q.t);
							if (f < t0 || f > t0 + (q.d ?? 120)) return null;
							return (
								<g key={'dr' + i}>
									{[0, 1, 2, 3].map((j) => {
										const t = (((f - t0) / 22 + j * 0.27) % 1);
										return <path key={j} d="M0,-14 q9,14 0,22 q-9,-8 0,-22z" transform={`translate(${q.x + (j - 1.5) * 16},${q.y + t * 150})`} fill="#7cc4ff" opacity={1 - t * 0.7} />;
									})}
								</g>
							);
						})}
						{(S.fx ?? []).filter((e) => e.k === 'onoma').map((e, i) => {
							const o = e as Extract<Fx, {k: 'onoma'}>;
							return <Onoma key={i} x={o.x} y={o.y} text={o.text} t={f - tt(o.t)} c={o.c ?? '#ffc94a'} rot={o.rot} size={o.size} />;
						})}
					</Svg>
				</Layer>
				<Layer depth={0.9}>
					<P.Over f={gf} k={k} p={p} />
				</Layer>
			</Stage>
			{S.tint ? <AbsoluteFill style={{background: S.tint, mixBlendMode: 'multiply', pointerEvents: 'none'}} /> : null}
			{(S.fx ?? []).map((e, i) => {
				if (e.k === 'clock') return <ClockPill key={i} text={e.text} t={f - tt(e.t)} d={e.d ?? 80} />;
				if (e.k === 'word') return <Caption key={i} f={f} from={tt(e.t)} to={tt(e.t) + (e.d ?? 70)} top={e.y ?? 780} lines={[e.text]} c={e.c ?? '#ffc94a'} size={e.size ?? 78} />;
				if (e.k === 'big') return <BigWord key={i} text={e.text} t={f - tt(e.t)} d={e.d ?? 60} c={e.c} x={e.x} y={e.y} />;
				if (e.k === 'paper') return <Paper key={i} e={e} t={f - tt(e.t)} tt={tt} f={f} />;
				if (e.k === 'photo') return <Photo key={i} t={f - tt(e.t)} d={e.d ?? 120} x={e.x} y={e.y} label={e.label} rot={e.rot} />;
				if (e.k === 'flash')
					return <AbsoluteFill key={i} style={{background: '#fff', opacity: flash(f, tt(e.t), 7), pointerEvents: 'none'}} />;
				if (e.k === 'dark') {
					const t0 = tt(e.t);
					const d = e.d ?? 12;
					const o = f >= t0 && f < t0 + d ? (Math.sin(f * 3.1) > -0.2 ? 0.92 : 0.2) : 0;
					return <AbsoluteFill key={i} style={{background: '#000', opacity: o, pointerEvents: 'none'}} />;
				}
				if (e.k === 'red') {
					const t0 = tt(e.t);
					const d = e.d ?? 40;
					const o = f >= t0 && f < t0 + d ? (e.o ?? 0.35) * (0.6 + 0.4 * Math.sin((f - t0) / 3)) * Math.min(1, (f - t0) / 6) * Math.min(1, (t0 + d - f) / 8) : 0;
					return <AbsoluteFill key={i} style={{background: '#ff1a1a', mixBlendMode: 'multiply', opacity: o, pointerEvents: 'none'}} />;
				}
				return null;
			})}
		</AbsoluteFill>
	);
};

export const buildShots = (list: SceneSpec[]): ShotDef[] => list.map((s) => ({at: s.at, off: s.off, whip: s.whip, C: makeScene(s)}));
void toLocal;
void HAND;
