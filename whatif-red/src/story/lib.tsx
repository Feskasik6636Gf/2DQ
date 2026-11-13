import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring} from 'remotion';
import type {Cam} from '../engine/camera';
import {Pose} from '../engine/Stickman';
import {env, idle, run, walk} from '../kit/actions';
import {Actor, L, counterAt, useShot} from '../kit/core';
import {HeroBadge, camOn, clamp} from '../kit/kit';
import {FONT, HAND} from '../kit/ui';

/* ------------------------------------------------------------------------
   Helpers for the scenes of «What if every lie came true?»
   ------------------------------------------------------------------------ */

const sm = (x: number) => {
	const c = Math.max(0, Math.min(1, x));
	return c * c * (3 - 2 * c);
};

/* shot context + word lookup: w('004', 'dog') = local frame where that word starts */
export const useB = () => {
	const s = useShot();
	const w = (line: string, word: string, nth = 0) => {
		const l = L(line);
		const ws = (l.words ?? []).filter((x) => x[0] === word.toLowerCase());
		const hit = ws[Math.min(nth, ws.length - 1)];
		return l.from - s.start + (hit ? hit[1] : 0);
	};
	return {...s, w};
};

/* keyed camera: [frame, X, Y, zoom]; eases between keys (cubic), holds outside */
export type K = [number, number, number, number];
export const camK = (f: number, keys: K[], extra: Partial<Cam> = {}): Cam => {
	let a = keys[0];
	let b = keys[0];
	for (let i = 0; i < keys.length; i++) {
		if (f >= keys[i][0]) {
			a = keys[i];
			b = keys[Math.min(i + 1, keys.length - 1)];
		}
	}
	if (f < keys[0][0]) b = a;
	const span = Math.max(1, b[0] - a[0]);
	const t = a === b ? 0 : Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, (f - a[0]) / span)));
	const X = a[1] + (b[1] - a[1]) * t;
	const Y = a[2] + (b[2] - a[2]) * t;
	const z = a[3] + (b[3] - a[3]) * t;
	return camOn(X, Y, z, extra);
};
/* snap camera: cuts (no easing) between framings, each framing drifts a little */
export const camCut = (f: number, keys: K[], drift = 0.06): Cam => {
	let i = 0;
	while (i + 1 < keys.length && f >= keys[i + 1][0]) i++;
	const k = keys[i];
	const len = (keys[i + 1]?.[0] ?? k[0] + 90) - k[0];
	const p = Math.max(0, Math.min(1, (f - k[0]) / Math.max(1, len)));
	return camOn(k[1] + (i % 2 ? -1 : 1) * 30 * (p - 0.5), k[2], k[3] * (1 + drift * p));
};
/* impact shake added to a camera */
export const shake = (c: Cam, f: number, t0: number, amp = 16, len = 14): Cam => {
	const d = f - t0;
	if (d < 0 || d > len) return c;
	const k = (1 - d / len) * amp;
	return {...c, x: c.x + Math.sin(d * 2.7) * k, y: c.y + Math.cos(d * 3.3) * k * 0.7};
};

/* ---------------------------- characters ------------------------------ */
type ActorProps = React.ComponentProps<typeof Actor>;
export const headY = (s: number, floor = 900) => floor - 157 * s - 164 * s;

/* the hero with the LIES badge over the head */
export const Hero: React.FC<Partial<ActorProps> & {x: number; badge?: boolean}> = ({badge = true, s = 1, floor = 900, x, ...p}) => (
	<>
		<Actor who="hero" x={x} s={s} floor={floor} uid={'hero' + (p.uid ?? '')} {...p} />
		{badge ? <HeroBadge x={x} y={(p.seat !== undefined ? p.seat - 164 * s : headY(s, floor)) - 110 * s} s={0.8 * s} /> : null}
	</>
);

/* a walker: walk/run between x0 and x1 in [t0,t1]; returns props for Actor */
export const mover = (f: number, t0: number, t1: number, x0: number, x1: number, opts: {run?: boolean; seed?: number} = {}) => {
	const u = Math.max(0, Math.min(1, (f - t0) / Math.max(1, t1 - t0)));
	const e = opts.run ? u : sm(u);
	const x = x0 + (x1 - x0) * e;
	const moving = f > t0 && f < t1;
	const ph = (f - t0) * (opts.run ? 0.55 : 0.36);
	const step = moving ? Math.min(1, Math.min(u, 1 - u) * (opts.run ? 20 : 6)) : 0;
	const g = opts.run ? run(ph) : walk(ph);
	const base = idle(f, opts.seed ?? 0);
	const pose: Pose = {
		lean: base.lean + (g.lean - base.lean) * step,
		head: base.head + (g.head - base.head) * step,
		armB: [base.armB[0] + (g.armB[0] - base.armB[0]) * step, base.armB[1] + (g.armB[1] - base.armB[1]) * step],
		armF: [base.armF[0] + (g.armF[0] - base.armF[0]) * step, base.armF[1] + (g.armF[1] - base.armF[1]) * step],
		legB: [base.legB[0] + (g.legB[0] - base.legB[0]) * step, base.legB[1] + (g.legB[1] - base.legB[1]) * step],
		legF: [base.legF[0] + (g.legF[0] - base.legF[0]) * step, base.legF[1] + (g.legF[1] - base.legF[1]) * step],
	};
	const vx = moving ? (x1 - x0) / Math.max(1, t1 - t0) * (opts.run ? 1 : 1.5 * 4 * u * (1 - u)) : 0;
	return {x, pose, facing: (x1 >= x0 ? 1 : -1) as 1 | -1, vx, bob: moving ? Math.abs(Math.sin(ph)) * (opts.run ? 9 : 4) : 0, moving};
};

/* jump arc: returns vertical lift (px) and squash */
export const jump = (f: number, t0: number, h = 120, len = 22) => {
	const d = f - t0;
	if (d < -4 || d > len + 6) return {lift: 0, squash: 0};
	if (d < 0) return {lift: 0, squash: 0.08 * (1 + d / 4)};
	if (d > len) return {lift: 0, squash: 0.1 * (1 - (d - len) / 6)};
	const u = d / len;
	return {lift: 4 * h * u * (1 - u), squash: -0.06 * Math.sin(u * Math.PI)};
};

/* poses */
export const P = {
	cheer: (f: number): Pose => ({lean: -4, head: -10, armF: [160 + Math.sin(f / 3) * 10, 10], armB: [-160 - Math.sin(f / 3) * 10, -10], legB: [-6, 2], legF: [6, 2]}),
	scared: (f: number): Pose => ({lean: -10, head: 6 + Math.sin(f) * 2, armF: [120, 70], armB: [-120, 60], legB: [-10, 6], legF: [12, 6]}),
	slump: (f: number): Pose => ({lean: 14, head: 22, armF: [4, 6], armB: [-2, 6], legB: [-3, 2], legF: [4, 2]}),
	shout: (f: number): Pose => ({lean: 16, head: -14, armF: [70, 30], armB: [-50, 40], legB: [-14, 4], legF: [18, 4]}),
	present: (f: number): Pose => ({lean: 0, head: -4, armF: [80, 30], armB: [-80, -30], legB: [-4, 2], legF: [6, 2]}),
	dance: (f: number): Pose => ({lean: Math.sin(f / 5) * 10, head: Math.sin(f / 2.5) * 8, armF: [130 + Math.sin(f / 5) * 40, 30], armB: [-120 + Math.cos(f / 5) * 40, 30], legF: [12 + Math.sin(f / 5) * 15, 14], legB: [-12, 10]}),
	laugh: (f: number): Pose => ({lean: -12 + Math.sin(f / 2) * 4, head: -16 + Math.sin(f / 2) * 5, armF: [30, 90], armB: [-20, 80], legB: [-5, 2], legF: [6, 2]}),
	sitDesk: (f: number): Pose => ({lean: 4, head: Math.sin(f / 30) * 2, armB: [40, 70], armF: [55, 60], legB: [88, 85], legF: [92, 90]}),
	hug: (f: number): Pose => ({lean: 8, head: 10, armF: [95, 70], armB: [80, 70], legB: [-4, 2], legF: [6, 2]}),
	phoneEar: (f: number): Pose => ({lean: 2, head: 6, armF: [150, 150], armB: [-6, 14], legB: [-4, 2], legF: [6, 2]}),
	carry: (f: number): Pose => ({lean: 2, head: 0, armF: [70, 60], armB: [60, 70], legB: [-4, 2], legF: [6, 2]}),
};

/* --------------------------------- dog -------------------------------- */
/* Biscuit: big brown slobbery dog. mode: stand | walk | run | sit | lie | chew */
export const Dog: React.FC<{x: number; floor?: number; s?: number; facing?: 1 | -1; mode?: 'stand' | 'walk' | 'run' | 'sit' | 'lie'; f: number; tongue?: boolean; chew?: boolean; look?: number; ghost?: number; uid?: string; age?: number}> = ({
	x,
	floor = 900,
	s: s0 = 1,
	facing = 1,
	mode = 'stand',
	f,
	tongue = true,
	chew,
	look = 0,
	ghost = 1,
	uid = 'd',
	age = 0,
}) => {
	const s = s0 * 1.25;
	const body = age > 0.5 ? '#8a5a35' : '#9a5b2e';
	const dark = '#6b3a1a';
	const light = '#c98a55';
	const ph = f * (mode === 'run' ? 0.6 : 0.33);
	const mv = mode === 'walk' || mode === 'run';
	const amp = mode === 'run' ? 34 : mode === 'walk' ? 22 : 0;
	const bob = mv ? Math.abs(Math.sin(ph)) * (mode === 'run' ? 10 : 4) : Math.sin(f / 14) * 1.5;
	const wag = Math.sin(f / 2.2) * 28;
	const sit = mode === 'sit';
	const lie = mode === 'lie';
	const bodyRot = sit ? -28 : 0;
	const legLen = 70;
	const leg = (lx: number, a: number, k: string, back: boolean) => {
		if (lie) return <rect key={k} x={lx - 12} y={-22} width={60} height={20} rx={10} fill={back ? dark : body} />;
		const ang = a;
		return <rect key={k} x={lx - 11} y={-12} width={22} height={legLen} rx={11} fill={back ? dark : body} transform={`rotate(${ang} ${lx} -10)`} />;
	};
	const y = floor - (lie ? 28 : legLen + 6) * s - bob * s;
	return (
		<g transform={`translate(${x},${y}) scale(${facing * s},${s})`} opacity={ghost}>
			<ellipse cx={0} cy={(lie ? 28 : legLen + 6) + bob} rx={110} ry={13} fill="#000" opacity={0.22} style={{filter: 'blur(5px)'}} />
			<g transform={`rotate(${bodyRot} 60 0)`}>
				{/* tail */}
				<path d={`M-88,-14 Q-130,${-50 - wag * 0.4} ${-120 + wag * 0.6},${-90}`} stroke={body} strokeWidth={16} fill="none" strokeLinecap="round" />
				{/* back legs */}
				{sit ? null : leg(-62, mv ? -amp * Math.sin(ph) : 0, 'lb1', true)}
				{leg(58, mv ? amp * Math.sin(ph + 1.4) : 0, 'lf1', true)}
				{/* body */}
				<ellipse cx={0} cy={-6} rx={100} ry={48} fill={body} stroke="#2a160a" strokeWidth={4} />
				<ellipse cx={10} cy={14} rx={70} ry={22} fill={light} opacity={0.55} />
				{sit ? <ellipse cx={-70} cy={30} rx={46} ry={34} fill={body} stroke="#2a160a" strokeWidth={4} /> : leg(-46, mv ? amp * Math.sin(ph) : 0, 'lb2', false)}
				{leg(74, mv ? -amp * Math.sin(ph + 1.4) : 0, 'lf2', false)}
				<rect x={66} y={-30} width={26} height={16} rx={5} fill="#d23b3b" />
				<circle cx={80} cy={-10} r={8} fill="#ffd34a" stroke="#a07a10" strokeWidth={2} />
			</g>
			{/* head */}
			<g transform={`translate(${sit ? 100 : 108},${sit ? -86 : -46}) rotate(${look * 12 + Math.sin(f / 20) * 3})`}>
				<ellipse cx={-22} cy={-6} rx={22} ry={44} fill={dark} transform={`rotate(${24 + Math.sin(ph) * (mv ? 10 : 2)} -22 -30)`} />
				<circle cx={0} cy={-18} r={50} fill={body} stroke="#2a160a" strokeWidth={4} />
				<ellipse cx={44} cy={2} rx={36} ry={26} fill={light} stroke="#2a160a" strokeWidth={4} />
				<ellipse cx={74} cy={-8} rx={13} ry={10} fill="#1a0e08" />
				<ellipse cx={70} cy={-12} rx={4} ry={3} fill="#fff" opacity={0.6} />
				<ellipse cx={14} cy={-34} rx={11} ry={13} fill="#fff" />
				<circle cx={17 + look * 3} cy={-33} r={6} fill="#000" />
				<circle cx={19} cy={-36} r={2} fill="#fff" />
				{chew ? (
					<path d={`M40,${22 + Math.abs(Math.sin(f / 2.5)) * 6} q20,6 40,0`} stroke="#2a160a" strokeWidth={4} fill="none" />
				) : tongue ? (
					<path d={`M40,22 q8,${30 + Math.sin(f / 5) * 5} 22,0 z`} fill="#ff7a90" stroke="#2a160a" strokeWidth={3} />
				) : null}
				{tongue && !chew && mv ? <circle cx={52} cy={60 + ((f * 3) % 40)} r={4} fill="#cfe9ff" opacity={0.8} /> : null}
				<ellipse cx={-30} cy={-12} rx={20} ry={42} fill={dark} transform={`rotate(${14 + Math.sin(ph) * (mv ? 14 : 3)} -30 -40)`} />
			</g>
		</g>
	);
};

/* ------------------------------- FX ----------------------------------- */

/* comic word that punches in (world space) */
export const Pow: React.FC<{x: number; y: number; text: string; t: number; c?: string; rot?: number; size?: number; hold?: number}> = ({x, y, text, t, c = '#ffd34a', rot = -8, size = 70, hold = 30}) => {
	if (t < 0 || t > hold + 10) return null;
	const s = interpolate(t, [0, 4, 8], [0.2, 1.25, 1], clamp);
	const o = interpolate(t, [hold, hold + 10], [1, 0], clamp);
	return (
		<g transform={`translate(${x},${y - t * 0.8}) rotate(${rot + Math.sin(t / 4) * 2}) scale(${s})`} opacity={o}>
			<text textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill="#10132a" stroke="#10132a" strokeWidth={14} strokeLinejoin="round">
				{text}
			</text>
			<text textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c}>
				{text}
			</text>
		</g>
	);
};

/* burst of sparkles around a point */
export const Sparks: React.FC<{x: number; y: number; t: number; n?: number; c?: string; r?: number; seed?: string}> = ({x, y, t, n = 14, c = '#ffe08a', r = 180, seed = 's'}) => {
	if (t < 0 || t > 30) return null;
	const k = t / 30;
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const a = (i / n) * Math.PI * 2 + random(seed + i) * 0.5;
				const d = r * (0.3 + 0.7 * Math.sqrt(k)) * (0.6 + random(seed + 'd' + i) * 0.6);
				const sz = (9 - 7 * k) * (0.6 + random(seed + 'z' + i));
				const px = x + Math.cos(a) * d;
				const py = y + Math.sin(a) * d * 0.8 + k * k * 50;
				return <path key={i} d={`M${px},${py - sz * 2} L${px + sz * 0.5},${py} L${px},${py + sz * 2} L${px - sz * 0.5},${py} Z M${px - sz * 2},${py} L${px},${py + sz * 0.5} L${px + sz * 2},${py} L${px},${py - sz * 0.5} Z`} fill={c} opacity={1 - k} />;
			})}
			<circle cx={x} cy={y} r={20 + 160 * k} fill="none" stroke={c} strokeWidth={8 * (1 - k)} opacity={1 - k} />
		</g>
	);
};

/* "lie comes true" magic: swirl of red particles converging into a point, then a pop */
export const Magic: React.FC<{x: number; y: number; t: number; w?: number; h?: number; seed?: string}> = ({x, y, t, w = 300, h = 220, seed = 'm'}) => {
	if (t < 0 || t > 40) return null;
	const k = Math.min(1, t / 22);
	return (
		<g>
			{Array.from({length: 26}).map((_, i) => {
				const a = random(seed + i) * Math.PI * 2 + t * 0.15;
				const d = (1 - k) * (0.5 + random(seed + 'r' + i)) * Math.max(w, h);
				return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * (h / w)} r={3 + 5 * random(seed + 'q' + i)} fill={i % 3 ? '#ff3b4e' : '#ffe08a'} opacity={t < 22 ? 0.9 : 1 - (t - 22) / 18} />;
			})}
			{t >= 20 ? <Sparks x={x} y={y} t={t - 20} c="#ff6a7a" r={w * 0.8} seed={seed + 'x'} /> : null}
		</g>
	);
};

/* speed lines behind a fast move (screen space) */
export const SpeedLines: React.FC<{k: number; seed?: string; c?: string}> = ({k, seed = 'sl', c = '#ffffff'}) =>
	k <= 0.01 ? null : (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				{Array.from({length: 40}).map((_, i) => {
					const a = random(seed + i) * Math.PI * 2;
					const r0 = 420 + random(seed + 'a' + i) * 300;
					const r1 = r0 + 300 + random(seed + 'b' + i) * 400;
					return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * r1} y2={540 + Math.sin(a) * r1} stroke={c} strokeWidth={3 + random(seed + 'w' + i) * 5} opacity={0.5 * k} />;
				})}
			</svg>
		</AbsoluteFill>
	);

/* full-frame white/red flash */
export const Flash: React.FC<{t: number; c?: string; len?: number; o?: number}> = ({t, c = '#fff', len = 8, o = 0.8}) => {
	const v = interpolate(t, [0, 1, len], [0, o, 0], clamp);
	return v > 0 ? <AbsoluteFill style={{background: c, opacity: v, pointerEvents: 'none'}} /> : null;
};

/* big kinetic title in screen space: words drop in one by one */
export const Title: React.FC<{t: number; dur?: number; lines: string[]; y?: number; size?: number; c?: string; hi?: number}> = ({t, dur = 999, lines, y = 120, size = 92, c = '#ffd34a', hi = -1}) => {
	if (t < 0 || t > dur) return null;
	const out = interpolate(t, [dur - 8, dur], [1, 0], clamp);
	let wi = 0;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
			<div style={{position: 'absolute', top: y, left: 40, right: 40, textAlign: 'center'}}>
				{lines.map((ln, li) => (
					<div key={li} style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1}}>
						{ln.split(' ').map((wd, i) => {
							const k = spring({frame: t - 2 - wi++ * 3, fps: 30, config: {damping: 11, stiffness: 190}});
							return (
								<span key={i} style={{display: 'inline-block', margin: '0 0.18em', color: li === hi || (hi < 0 && li === lines.length - 1) ? c : '#fff', WebkitTextStroke: '4px #120812', paintOrder: 'stroke', textShadow: '0 10px 30px rgba(0,0,0,.55)', opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * -60}px) scale(${0.5 + 0.5 * k}) rotate(${(1 - k) * (i % 2 ? 8 : -8)}deg)`}}>
									{wd}
								</span>
							);
						})}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

/* hand-written sticky label in world space (pinned on an object) */
export const Tag: React.FC<{x: number; y: number; t: number; text: string; rot?: number; c?: string; size?: number}> = ({x, y, t, text, rot = -5, c = '#fff6b8', size = 40}) => {
	if (t < 0) return null;
	const k = spring({frame: t, fps: 30, config: {damping: 9, stiffness: 180}});
	const w = text.length * size * 0.5 + 40;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot + Math.sin(t / 15) * 1.5}) scale(${k})`}>
			<rect x={-w / 2 + 6} y={-size * 0.8 + 8} width={w} height={size * 1.6} rx={6} fill="#000" opacity={0.2} />
			<rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.6} rx={6} fill={c} />
			<text y={size * 0.32} textAnchor="middle" fontSize={size} fontFamily={HAND} fontWeight={700} fill="#2a2030">
				{text}
			</text>
		</g>
	);
};

/* little red "LIE" stamp that pops above someone who lies (world space) */
export const LieStamp: React.FC<{x: number; y: number; t: number; text?: string}> = ({x, y, t, text = 'LIE!'}) => {
	if (t < 0 || t > 50) return null;
	const k = spring({frame: t, fps: 30, config: {damping: 8, stiffness: 240}});
	const o = interpolate(t, [40, 50], [1, 0], clamp);
	return (
		<g transform={`translate(${x},${y}) rotate(-12) scale(${0.4 + 0.6 * k})`} opacity={o}>
			<rect x={-90} y={-40} width={180} height={80} rx={12} fill="#ff2a3c" stroke="#fff" strokeWidth={6} />
			<text y={20} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#fff">
				{text}
			</text>
		</g>
	);
};

/* lerp helpers for scenes */
export const lin = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], clamp);
export const ez = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], {...clamp, easing: Easing.inOut(Easing.cubic)});
export const pop = (t: number) => (t < 0 ? 0 : spring({frame: t, fps: 30, config: {damping: 10, stiffness: 180}}));
export {env, counterAt};

/* one-call scene: backdrop on a far layer, everything else on the subject layer */
import {Layer as _Layer, Stage as _Stage, Svg as _Svg} from '../kit/kit';
import type {Light} from '../kit/kit';
export const Scene: React.FC<{cam: Cam; bg?: string; light?: Light | false; set: React.ReactNode; depth?: number; children?: React.ReactNode; front?: React.ReactNode; over?: React.ReactNode}> = ({cam, bg, light, set, depth = 1.5, children, front, over}) => (
	<_Stage cam={cam} bg={bg} light={light}>
		<_Layer depth={depth}>{set}</_Layer>
		<_Layer depth={1}>
			<_Svg>{children}</_Svg>
		</_Layer>
		{front ? (
			<_Layer depth={0.7}>
				<_Svg>{front}</_Svg>
			</_Layer>
		) : null}
		{over}
	</_Stage>
);
/* frame offset of a word from its line start (for ShotDef.off) */
export const wordOff = (line: string, word: string, nth = 0) => {
	const l = L(line);
	const ws = (l.words ?? []).filter((x) => x[0] === word.toLowerCase());
	return (ws[Math.min(nth, ws.length - 1)]?.[1] ?? 0) - 4;
};
