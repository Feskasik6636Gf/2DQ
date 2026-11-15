import React from 'react';
import {Easing, interpolate, spring, useVideoConfig} from 'remotion';
import {Pose, frontHand} from '../engine/Stickman';
import type {Expr, Mouth} from '../engine/Stickman';
import {Gesture, blend, env, gesture, idle, run, walk} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {CrowdRow, Layer, Rays, Stage, Svg, camOn, clamp, flash, mixCam, usePush} from '../kit/kit';
import {Callout} from '../kit/graphics';
import {Accent, Bubble, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {Item, ItemKey} from './items';
import {PLACES, PlaceKey} from './places';

/* ---------------------------------------------------------------------------------
   Scene DSL. One ScSpec = one shot. Times are either a fraction of the shot (0..1)
   or a line anchor like '012' / '012+20' (frames after the line 012 starts).
   --------------------------------------------------------------------------------- */
export type T = number | string;
export type Span = [T, T];

export type ActorSpec = {
	w: string; // cast id
	x: number | number[]; // x (or [x0, x1, x2…] path, walked in equal time slices of `t`)
	t?: Span; // time window of the walk (default 0.02..0.3)
	s?: number;
	fl?: 1 | -1; // facing when standing
	g?: [Gesture, T, T][];
	e?: Expr | [Expr, T, T][];
	m?: Mouth;
	run?: boolean;
	seat?: number; // sit with the hips at this y (adds nothing else)
	hop?: [T, T, number?]; // jump up and down in this window (amplitude)
	look?: [number, number];
	y?: number; // floor
	hold?: {k: ItemKey; s?: number; c?: string; txt?: string; t?: Span; dx?: number; dy?: number};
	hood?: boolean;
	lean?: [number, T, T]; // body tilt in degrees on a window (fall, bow)
	acc?: ('headphones' | 'mustache' | 'glasses')[];
	z?: 'b' | 'f'; // draw order relative to items
	blur?: boolean;
	vis?: Span; // visible window
	armOver?: [T, T];
	pt?: [T, T]; // pointing finger window
};

export type ItemSpec = {
	k: ItemKey;
	x: number | [number, number];
	y?: number;
	s?: number;
	rot?: number;
	t?: Span; // visible window
	z?: 'b' | 'f';
	c?: string;
	txt?: string;
	fy?: number; // float amplitude
	slide?: [T, T]; // x moves from x[0] to x[1] in this window
	pop?: boolean; // spring-in
	spin?: number; // deg per frame
	fall?: [T, T, number?]; // drops from above onto y
};

export type Gfx =
	| {g: 'big'; txt: string; t: Span; c?: string; size?: number; y?: number; rot?: number; sub?: string}
	| {g: 'acc'; txt: string; t: Span; sub?: string; y?: number; c?: string}
	| {g: 'bub'; txt: string; x: number; y: number; t: Span; w?: number; thought?: boolean; tail?: [number, number]; c?: string}
	| {g: 'call'; txt: string; from: [number, number]; to: [number, number]; t: Span; c?: string}
	| {g: 'flash'; t: T; c?: string}
	| {g: 'ono'; txt: string; x: number; y: number; t: T; c?: string; size?: number; rot?: number}
	| {g: 'crowd'; n: number; x0: number; x1: number; mode: 'dance' | 'stand' | 'run' | 'walk' | 'panic'; s?: number; seed?: string; dir?: 1 | -1; y?: number}
	| {g: 'rays'; x: number; y: number; w: number; angle?: number; o?: number; c?: string}
	| {g: 'dark'; t: Span; o?: number}
	| {g: 'count'; from: number; to: number; t: Span; x: number; y: number; label?: string; c?: string; fmt?: 'k' | 'plain'; size?: number};

export type ScSpec = {
	at: string;
	p: PlaceKey;
	night?: boolean;
	dim?: number | [number, number]; // place mood 0..1 (server dead, etc.) optionally animated over the shot
	tint?: string;
	a?: ActorSpec[];
	i?: ItemSpec[];
	gx?: Gfx[];
	cam?: number[]; // [x,y,z] or [x0,y0,z0,x1,y1,z1]
	whip?: boolean;
	light?: {x?: number; y?: number; o?: number; c?: string; night?: boolean};
	dust?: string;
	bg?: string;
};

const parse = (v: T, at: (n: string) => number, dur: number): number => {
	if (typeof v === 'number') return v * dur;
	const m = /^(\d+)([+-]\d+)?$/.exec(v);
	if (!m) return 0;
	return at(m[1]) + (m[2] ? Number(m[2]) : 0);
};

const easeIO = (u: number) => u * u * (3 - 2 * u);

/* position + pose of an actor along its path */
const move = (a: ActorSpec, f: number, dur: number, at: (n: string) => number, seed: number) => {
	const xs = Array.isArray(a.x) ? a.x : [a.x, a.x];
	const [t0f, t1f] = a.t ?? [0.02, 0.3];
	const t0 = parse(t0f, at, dur);
	const t1 = parse(t1f, at, dur);
	const legs = xs.length - 1;
	const lenT = (t1 - t0) / legs;
	let x = xs[0];
	let moving = false;
	let dir: 1 | -1 | 0 = 0;
	let u = 0;
	let vx = 0;
	for (let i = 0; i < legs; i++) {
		const s0 = t0 + i * lenT;
		const s1 = s0 + lenT;
		if (f >= s1) {
			x = xs[i + 1];
			if (xs[i + 1] !== xs[i]) dir = xs[i + 1] > xs[i] ? 1 : -1;
		} else if (f > s0) {
			if (xs[i + 1] !== xs[i]) {
				u = (f - s0) / (s1 - s0);
				x = xs[i] + (xs[i + 1] - xs[i]) * easeIO(u);
				moving = true;
				dir = xs[i + 1] > xs[i] ? 1 : -1;
				vx = ((xs[i + 1] - xs[i]) * 6 * u * (1 - u)) / (s1 - s0);
			}
			break;
		} else break;
	}
	const speed = a.run ? 0.55 : 0.3;
	const ph = (f - t0) * speed * 1.15;
	const step = moving ? Math.min(1, Math.min(u, 1 - u) * 6) : 0;
	let pose: Pose = idle(f, seed);
	if (moving) pose = blend(pose, a.run ? run(ph) : walk(ph), a.run ? Math.min(1, step * 1.2) : step);
	const facing: 1 | -1 = moving ? (dir as 1 | -1) : a.fl ?? (dir !== 0 ? (dir as 1 | -1) : x < 960 ? 1 : -1);
	return {x, pose, facing, moving, vx, bob: moving ? Math.abs(Math.sin(ph)) * (a.run ? 8 : 4) : 0};
};

const Staged: React.FC<{sp: ScSpec}> = ({sp}) => {
	const {f, gf, dur, at} = useShot();
	const {fps} = useVideoConfig();
	const R = (v: T) => parse(v, at, dur);
	const A = sp.a ?? [];
	const lastX = A.length ? A.map((a) => (Array.isArray(a.x) ? a.x[a.x.length - 1] : a.x)).reduce((s, v) => s + v, 0) / A.length : 960;
	const defCam = sp.cam ?? [Math.max(700, Math.min(1240, lastX)), 560, 1.1, Math.max(700, Math.min(1240, lastX)), 540, 1.28];
	const ZM = 1.3;
	const c0 = camOn(defCam[0], defCam[1], defCam[2] * ZM, {farBlur: 5});
	const c1 = defCam.length >= 6 ? camOn(defCam[3], defCam[4], defCam[5] * ZM, {farBlur: 5}) : camOn(defCam[0], defCam[1] - 8, defCam[2] * ZM * 1.07, {farBlur: 5});
	const cam = usePush(c0, c1);
	const Place = PLACES[sp.p];
	const dimV = Array.isArray(sp.dim) ? interpolate(f, [0, dur], sp.dim, clamp) : sp.dim ?? 0;
	const opts = {night: sp.night, dim: dimV, tint: sp.tint};

	/* actors */
	const drawn = A.map((a, idx) => {
		const seed = idx * 3 + 1;
		const m = move(a, f, dur, at, seed);
		let pose = m.pose;
		const s = a.s ?? 1;
		const floor = a.y ?? 900;
		let hopY = 0;
		if (a.hop) {
			const h0 = R(a.hop[0]);
			const h1 = R(a.hop[1]);
			if (f > h0 && f < h1) hopY = Math.abs(Math.sin(((f - h0) / 11) * Math.PI)) * (a.hop[2] ?? 34);
		}
		for (const [g, t0, t1] of a.g ?? []) pose = gesture(g, pose, env(f, R(t0), R(t1), 8, 8), f);
		if (a.lean) pose = {...pose, lean: pose.lean + a.lean[0] * env(f, R(a.lean[1]), R(a.lean[2]), 10, 10)};
		if (a.seat !== undefined) pose = {...pose, legB: [88, 85], legF: [92, 90]};
		let expr: Expr | undefined;
		if (Array.isArray(a.e)) {
			for (const [e, t0, t1] of a.e) if (f >= R(t0) && f <= R(t1)) expr = e;
		} else expr = a.e;
		const ptK = a.pt ? env(f, R(a.pt[0]), R(a.pt[1]), 6, 8) : 0;
		const armOverK = a.armOver ? env(f, R(a.armOver[0]), R(a.armOver[1]), 6, 6) : 0;
		const visible = a.vis ? f >= R(a.vis[0]) && f <= R(a.vis[1]) : true;
		const y = (a.seat !== undefined ? a.seat : floor - 157 * s) - hopY * s * 0.0;
		return {a, m, pose, s, floor, hopY, expr, ptK, armOverK, visible, y, idx};
	});

	const itemEl = (it: ItemSpec, k: number) => {
		const vis = it.t ? f >= R(it.t[0]) && f <= R(it.t[1]) : true;
		if (!vis) return null;
		const t0 = it.t ? R(it.t[0]) : 0;
		let x = Array.isArray(it.x) ? it.x[0] : it.x;
		if (Array.isArray(it.x) && it.slide) x = interpolate(f, [R(it.slide[0]), R(it.slide[1])], [it.x[0], it.x[1]], {...clamp, easing: Easing.inOut(Easing.cubic)});
		let y = it.y ?? 900;
		if (it.fy) y += Math.sin(f / 14 + k) * it.fy;
		if (it.fall) {
			const f0 = R(it.fall[0]);
			const f1 = R(it.fall[1]);
			y -= (1 - interpolate(f, [f0, f1], [0, 1], {...clamp, easing: Easing.in(Easing.quad)})) * (it.fall[2] ?? 700);
		}
		const pop = it.pop ? spring({frame: f - t0, fps, config: {damping: 9, stiffness: 160}}) : 1;
		const rot = (it.rot ?? 0) + (it.spin ?? 0) * f;
		return (
			<g key={'i' + k} transform={`translate(${x},${y}) rotate(${rot}) scale(${(it.s ?? 1) * Math.max(0.001, pop)})`}>
				<Item k={it.k} c={it.c} txt={it.txt} f={gf} />
			</g>
		);
	};

	const actorEl = (d: (typeof drawn)[number]) => {
		const {a, m, pose, s, floor, expr, ptK, armOverK, visible, idx} = d;
		if (!visible) return null;
		const lifted = d.hopY;
		const holdOn = a.hold && (a.hold.t ? f >= R(a.hold.t[0]) && f <= R(a.hold.t[1]) : true);
		const hp = holdOn ? frontHand(pose, m.x, floor - 157 * s - lifted * s, s, m.facing) : null;
		return (
			<g key={'a' + idx}>
				<Actor
					who={a.w}
					x={m.x}
					floor={floor}
					s={s}
					seat={a.seat}
					facing={m.facing}
					faceTurn={m.moving ? 0.6 : 0.4}
					look={a.look ?? [m.facing * 0.6, 0]}
					expr={expr}
					mouth={a.m}
					pose={pose}
					vx={m.vx}
					bob={m.bob + lifted}
					hood={a.hood}
					acc={a.acc}
					armOver={armOverK > 0.5}
					handF={ptK > 0.5 ? 'point' : undefined}
					uid={`sc${a.w}${idx}`}
					seed={idx * 3 + 1}
				/>
				{hp && a.hold ? (
					<g transform={`translate(${hp[0] + (a.hold.dx ?? 0)},${hp[1] + (a.hold.dy ?? 0)}) scale(${a.hold.s ?? 0.5})`}>
						<Item k={a.hold.k} c={a.hold.c} txt={a.hold.txt} f={gf} />
					</g>
				) : null}
			</g>
		);
	};

	const I = sp.i ?? [];
	const back = I.filter((it) => (it.z ?? 'b') === 'b');
	const front = I.filter((it) => it.z === 'f');
	const aBack = drawn.filter((d) => d.a.z === 'b');
	const aMain = drawn.filter((d) => d.a.z !== 'b');
	const G = sp.gx ?? [];

	return (
		<Stage cam={cam} bg={sp.bg ?? '#0b0710'} light={sp.light ?? {x: 20, y: 10, o: 0.4, night: sp.night}} dust={sp.dust}>
			<Layer depth={1.6}>
				<Place f={gf} o={opts} />
			</Layer>
			{G.filter((g) => g.g === 'rays').map((g, k) => {
				const r = g as Extract<Gfx, {g: 'rays'}>;
				return (
					<Layer key={'r' + k} depth={1.25}>
						<Rays x={r.x} y={r.y} w={r.w} angle={r.angle ?? 24} o={r.o ?? 0.16} c={r.c} />
					</Layer>
				);
			})}
			<Layer depth={1}>
				<Svg>
					{G.filter((g) => g.g === 'crowd').map((g, k) => {
						const c = g as Extract<Gfx, {g: 'crowd'}>;
						return <CrowdRow key={'c' + k} n={c.n} x0={c.x0} x1={c.x1} floor={c.y ?? 900} s={c.s ?? 0.9} mode={c.mode} seed={c.seed ?? 'cw' + k} dir={c.dir} />;
					})}
					{back.map((it, k) => itemEl(it, k))}
					{aBack.map(actorEl)}
					{aMain.map(actorEl)}
					{front.map((it, k) => itemEl(it, 100 + k))}
					{G.map((g, k) => {
						if (g.g === 'bub') {
							const t = f - R(g.t[0]);
							if (t < 0 || f > R(g.t[1])) return null;
							const w = g.w ?? Math.max(260, g.txt.length * 21 + 70);
							return (
								<Bubble key={'b' + k} x={g.x} y={Math.max(g.y, 420)} w={w} h={g.txt.length > 24 ? 150 : 96} t={t} tail={g.tail ?? [0, g.txt.length > 24 ? 120 : 90]} thought={g.thought} fill={g.c}>
									<foreignObject x={-w / 2 + 8} y={g.txt.length > 24 ? -72 : -44} width={w - 16} height={g.txt.length > 24 ? 144 : 88}>
										<div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 38, lineHeight: 1.08, color: '#1b1e2a'}}>{g.txt}</div>
									</foreignObject>
								</Bubble>
							);
						}
						if (g.g === 'call') {
							return <Callout key={'cl' + k} f={f} t0={R(g.t[0])} t1={R(g.t[1])} from={g.from} to={g.to} text={g.txt} c={g.c} />;
						}
						if (g.g === 'ono') {
							return <Onoma key={'o' + k} x={g.x} y={g.y} text={g.txt} t={f - R(g.t)} c={g.c ?? '#ffd34a'} rot={g.rot} size={g.size} />;
						}
						return null;
					})}
				</Svg>
			</Layer>
			{/* screen-space graphics */}
			{G.map((g, k) => {
				if (g.g === 'acc') {
					const t = f - R(g.t[0]);
					const d = R(g.t[1]) - R(g.t[0]);
					if (t < 0 || t > d) return null;
					const inK = interpolate(t, [0, 9], [0, 1], clamp);
					const o = Math.min(inK, interpolate(t, [d - 8, d], [1, 0], clamp));
					const words = g.txt.split(' ');
					return (
						<div key={'ac' + k} style={{position: 'absolute', left: 0, right: 0, top: g.y ?? 130, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o, transform: `translateY(${(1 - inK) * 24}px)`, pointerEvents: 'none'}}>
							<div style={{maxWidth: 1500, textAlign: 'center', background: 'rgba(18,8,26,0.9)', border: `4px solid ${g.c ?? '#ff4d6a'}`, borderRadius: 22, padding: '12px 34px', color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.1, letterSpacing: 0.5}}>
								{words.map((w, i) => {
									const wk = interpolate(t, [2 + i * 2.5, 9 + i * 2.5], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
									return (
										<span key={i} style={{display: 'inline-block', marginRight: 14, opacity: Math.min(1, wk * 1.4), transform: `translateY(${(1 - wk) * 26}px) scale(${0.6 + 0.4 * wk})`}}>
											{w}
										</span>
									);
								})}
							</div>
							{g.sub ? <div style={{marginTop: 8, color: '#ffe08a', fontFamily: HAND, fontSize: 52, textShadow: '0 2px 10px #000'}}>{g.sub}</div> : null}
						</div>
					);
				}
				if (g.g === 'big') {
					const t0 = R(g.t[0]);
					const t1 = R(g.t[1]);
					if (f < t0 || f > t1) return null;
					const k1 = spring({frame: f - t0, fps, config: {damping: 8, stiffness: 170}});
					const o = Math.min(1, (t1 - f) / 8);
					return (
						<div key={'bg' + k} style={{position: 'absolute', left: 0, right: 0, top: g.y ?? 380, textAlign: 'center', transform: `scale(${k1}) rotate(${g.rot ?? -3}deg)`, opacity: o, pointerEvents: 'none'}}>
							<div style={{fontFamily: FONT, fontWeight: 900, fontSize: g.size ?? 150, color: g.c ?? '#ffffff', letterSpacing: 4, WebkitTextStroke: '14px #12081a', paintOrder: 'stroke fill', textShadow: '0 10px 30px rgba(0,0,0,.5)', lineHeight: 1}}>{g.txt}</div>
							{g.sub ? <div style={{marginTop: 10, fontFamily: HAND, fontSize: 64, color: '#ffe08a', textShadow: '0 4px 14px #000'}}>{g.sub}</div> : null}
						</div>
					);
				}
				if (g.g === 'count') {
					const t0 = R(g.t[0]);
					const t1 = R(g.t[1]);
					const v = interpolate(f, [t0, t1], [g.from, g.to], {...clamp, easing: Easing.out(Easing.cubic)});
					if (f < t0 - 4) return null;
					const k1 = spring({frame: f - t0 + 4, fps, config: {damping: 10, stiffness: 150}});
					const txt = g.fmt === 'k' ? Math.round(v).toLocaleString('en-US') : String(Math.round(v));
					return (
						<div key={'ct' + k} style={{position: 'absolute', left: g.x - 400, width: 800, top: g.y, textAlign: 'center', transform: `scale(${k1})`, pointerEvents: 'none'}}>
							<div style={{fontFamily: FONT, fontWeight: 900, fontSize: g.size ?? 130, color: g.c ?? '#ffe08a', WebkitTextStroke: '12px #12081a', paintOrder: 'stroke fill', lineHeight: 1}}>{txt}</div>
							{g.label ? <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 4, textShadow: '0 3px 10px #000'}}>{g.label}</div> : null}
						</div>
					);
				}
				if (g.g === 'flash') {
					const o = flash(f, R(g.t), 8);
					return o > 0.01 ? <div key={'fl' + k} style={{position: 'absolute', inset: 0, background: g.c ?? '#fff', opacity: o, pointerEvents: 'none'}} /> : null;
				}
				if (g.g === 'dark') {
					const t0 = R(g.t[0]);
					const t1 = R(g.t[1]);
					const o = (g.o ?? 0.6) * Math.min(1, Math.max(0, (f - t0) / 12), Math.max(0, (t1 - f) / 12));
					return o > 0.01 ? <div key={'dk' + k} style={{position: 'absolute', inset: 0, background: '#000', opacity: o, pointerEvents: 'none'}} /> : null;
				}
				return null;
			})}
		</Stage>
	);
};

export const build = (specs: ScSpec[]): ShotDef[] =>
	specs.map((sp) => ({
		at: sp.at,
		whip: sp.whip,
		C: () => <Staged sp={sp} />,
	}));

export const mixCamX = mixCam;
