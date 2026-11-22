import React from 'react';
import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import {Layer, Svg} from '../engine/camera';
import type {Pose} from '../engine/Stickman';
import {blend, env, gesture, idle, run, walkTo, SIT} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Bulb, Confetti, Exclaim, Glitch, ImpactText, Pulse, Question, Rain, Shockwave, Smoke, Snow, Sparkles, SpeedLines, Lightning, LightningFlash, punch} from '../kit/fx';
import {Callout} from '../kit/graphics';
import {FONT} from '../kit/ui';
import {CrowdRow, HeroBadge, Stage, camOn, flash, mixCam} from '../kit/kit';
import {STORY} from './config';
import {Bedroom} from '../kit/sets';
import {Dining, FactBg, Fridge, Kitchen2, Lab, Steam, Street2} from './places';
import {PropArt, PropKind} from './props2';
import type {ActorSpec, FxSpec, Gest, PropSpec, ShotSpec, T} from './types';

const FLOOR = 900;
const clampE = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SZ = {adult: 1, teen: 0.95, kid: 0.75, toddler: 0.55, tall: 1.12, giant: 1.35} as const;

const AUTO: Gest[] = ['presentF', 'think', 'shrug', 'point', 'touchFace', 'rubChin', 'wave', 'stop'];

type Res = (t: T | undefined, d?: number) => number;

const Place: React.FC<{p: string; f: number; hue?: number}> = ({p, f, hue}) => {
	if (p === 'kitchen') return <Kitchen2 f={f} />;
	if (p === 'kitchenN') return <Kitchen2 f={f} night />;
	if (p === 'kitchenDoor') return <Kitchen2 f={f} door />;
	if (p === 'dining') return <Dining f={f} night />;
	if (p === 'diningDay') return <Dining f={f} night={false} />;
	if (p === 'street') return <Street2 f={f} mode="day" />;
	if (p === 'streetN') return <Street2 f={f} mode="night" />;
	if (p === 'streetDusk') return <Street2 f={f} mode="dusk" />;
	if (p === 'bakery') return <Street2 f={f} mode="day" bakery />;
	if (p === 'lab') return <Lab f={f} />;
	if (p === 'fridge') return <Fridge f={f} />;
	if (p === 'bedroom') return <Bedroom f={f} />;
	return <FactBg f={f} hue={hue ?? 230} />;
};
const lightOf = (p: string) =>
	p.startsWith('kitchenN') ? {x: 50, y: 5, o: 0.3, night: true} : p.startsWith('kitchen') ? {x: 70, y: 8, o: 0.34} : p === 'dining' ? {x: 50, y: 10, c: '255,190,120', o: 0.5} : p === 'streetN' ? {night: true, o: 0.4} : p === 'fridge' ? {night: true, o: 0.35} : p === 'fact' ? {o: 0.15} : {x: 20, y: 10, o: 0.4};

type AState = {spec: ActorSpec; x: number; floor: number; s: number; sc: number; facing: 1 | -1; pose: Pose; vx: number; bob: number; seat?: number; visible: boolean; headY: number};

const sgn = (n: number) => (n >= 0 ? 1 : -1);

const buildActors = (specs: ActorSpec[], f: number, gf: number, R: Res): AState[] =>
	specs.map((a, i) => {
		const seed = i * 3.7 + a.who.length;
		const floor = a.floor ?? FLOOR;
		const s = a.s ?? 1;
		const sc = s * (a.size ? SZ[a.size] : 1);
		const xs: [number, number] = Array.isArray(a.x) ? a.x : [a.x, a.x];
		let x = xs[0];
		let pose: Pose = idle(gf, seed);
		let vx = 0;
		let bob = 0;
		let facing: 1 | -1 = a.facing ?? (xs[1] >= xs[0] ? 1 : -1);
		if (a.walk) {
			const t0 = R(a.walk[0]);
			const t1 = R(a.walk[1]);
			const w = walkTo(f, t0, t1, xs[0], xs[1], seed, a.speed ?? 0.3);
			x = w.x;
			pose = w.pose;
			vx = w.vx;
			bob = w.bob;
			if (a.run) {
				const u = Math.max(0, Math.min(1, (f - t0) / Math.max(1, t1 - t0)));
				const step = w.moving ? Math.min(1, Math.min(u, 1 - u) * 6) : 0;
				pose = blend(idle(gf, seed), run((f - t0) * 0.5), step);
				bob = w.moving ? Math.abs(Math.sin((f - t0) * 0.5)) * 8 : 0;
			}
			if (w.moving && a.facing === undefined) facing = sgn(xs[1] - xs[0]) as 1 | -1;
		} else if (xs[0] !== xs[1]) {
			x = interpolate(f, [0, 200], xs, clampE);
		}
		const pace = a.pace ?? 16;
		if (!a.walk || !(f > R(a.walk[0]) && f < R(a.walk[1]))) x += Math.sin(gf / 68 + seed) * pace;
		// deliberate gestures
		let busy = false;
		for (const g of a.g ?? []) {
			const t0 = R(g[1]);
			const t1 = g[2] !== undefined ? R(g[2]) : t0 + 60;
			const k = env(f, t0, t1, 8, 9);
			if (k > 0.001) busy = true;
			pose = gesture(g[0], pose, k, f);
		}
		// automatic gestures so nobody just stands
		if (a.auto !== false && !busy && !a.walk && !a.hold) {
			const ph = (f + Math.round(seed * 23)) % 96;
			const idx = Math.floor((f + Math.round(seed * 23)) / 96 + seed) % AUTO.length;
			pose = gesture(AUTO[(idx + AUTO.length) % AUTO.length], pose, env(ph, 8, 62, 12, 14) * 0.9, f);
		}
		if (a.hold) pose = gesture('presentF', pose, 0.85, f);
		if (a.hop) {
			const t0 = R(a.hop[0]);
			const t1 = R(a.hop[1]);
			const k = env(f, t0, t1, 3, 3);
			bob += k * Math.abs(Math.sin(((f - t0) / 6) * Math.PI)) * 38;
			pose = gesture('handsOnHead', pose, k * 0.7, f);
		}
		if (a.wob) {
			const k = env(f, R(a.wob[0]), R(a.wob[1]), 5, 5);
			pose = {...pose, lean: pose.lean + Math.sin(f * 1.6) * 5 * k, head: pose.head + Math.sin(f * 1.1) * 6 * k};
		}
		let seat = a.seat;
		if (a.sink) {
			const k = env(f, R(a.sink[0]), R(a.sink[1]), 14, 14);
			seat = floor - 157 * sc + 78 * sc * k;
			pose = blend(pose, {...SIT, armB: [10, 40], armF: [20, 50], lean: 8, head: 8, legB: [58, 112], legF: [64, 118]}, k);
			if (k < 0.02) seat = a.seat;
		}
		if (seat !== undefined && a.seat !== undefined && !a.sink) pose = blend(pose, SIT, 1);
		if (a.spin) {
			const k = env(f, R(a.spin[0]), R(a.spin[1]), 2, 2);
			if (k > 0.5 && Math.floor(f / 6) % 2) facing = (facing * -1) as 1 | -1;
		}
		const visible = (a.appear === undefined || f >= R(a.appear)) && (a.vanish === undefined || f < R(a.vanish));
		const top = (seat !== undefined ? seat - 157 * sc : floor - 157 * sc) - 164 * sc;
		return {spec: a, x, floor, s, sc, facing, pose, vx, bob, seat, visible, headY: top};
	});

const holdPos = (st: AState) => {
	const h = st.spec.hold!;
	return {x: st.x + st.facing * ((h.dx ?? 104) + 50) * st.sc, y: (st.seat ?? st.floor - 157 * st.sc) - 75 * st.sc + (h.dy ?? 0) * st.sc};
};

const ease = (u: number) => u * u * (3 - 2 * u);
const lerpAny = (v: number | [number, number] | undefined, u: number, d: number) => (v === undefined ? d : Array.isArray(v) ? v[0] + (v[1] - v[0]) * u : v);

const Prop: React.FC<{spec: PropSpec; f: number; R: Res; st: AState[]}> = ({spec, f, R, st}) => {
	const {fps} = useVideoConfig();
	const t0 = spec.show ? R(spec.show[0]) : -9999;
	const t1 = spec.show && spec.show[1] !== undefined ? R(spec.show[1]) : 99999;
	if (f < t0 || f >= t1) return null;
	const u = spec.move ? ease(Math.max(0, Math.min(1, (f - R(spec.move[0])) / Math.max(1, R(spec.move[1]) - R(spec.move[0]))))) : 0;
	let x = lerpAny(spec.x, u, 0);
	let y = lerpAny(spec.y, u, FLOOR);
	if (spec.at) {
		const a = st.find((q) => q.spec.who === spec.at);
		if (a) {
			x = a.x + a.facing * x * a.sc;
			y = (a.seat !== undefined ? a.seat + 157 * a.sc : a.floor) + y * a.sc - (spec.at === 'x' ? 0 : a.bob * a.sc);
		}
	}
	let sc = lerpAny(spec.s, u, 1);
	const rot = lerpAny(spec.rot, u, 0);
	if (spec.pop && t0 > -9000) {
		sc *= Math.min(1.15, spring({frame: f - t0, fps, config: {damping: 9, stiffness: 190, mass: 0.7}}));
	}
	y -= (spec.bob ? Math.abs(Math.sin(f / 6)) * spec.bob : 0);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${spec.flip ? -sc : sc},${sc})`}>
			<PropArt k={spec.k as PropKind} t={spec.t} n={spec.n} c={spec.c} f={f} />
		</g>
	);
};

const BigText: React.FC<{f: number; t0: number; t1: number; text: string; sub?: string; c?: string; y?: number; size?: number; rot?: number}> = ({f, t0, t1, text, sub, c = '#ffd84a', y = 120, size = 150, rot = -3}) => {
	const {fps} = useVideoConfig();
	if (f < t0 || f > t1) return null;
	const k = spring({frame: f - t0, fps, config: {damping: 9, stiffness: 150, mass: 0.8}});
	const o = interpolate(f, [t1 - 8, t1], [1, 0], clampE);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', opacity: o, transform: `scale(${0.4 + 0.6 * k}) rotate(${rot * k}deg)`}}>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: c, WebkitTextStroke: '9px #0b0d1e', paintOrder: 'stroke', textShadow: '0 12px 30px rgba(0,0,0,.55)'}}>{text}</div>
				{sub ? <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size * 0.34, color: '#fff', marginTop: 8, WebkitTextStroke: '5px #0b0d1e', paintOrder: 'stroke'}}>{sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

const CapLines: React.FC<{f: number; t0: number; t1: number; lines: string[]; top: number; c?: string; size: number}> = ({f, t0, t1, lines, top, c = '#ffc94a', size}) => {
	const {fps} = useVideoConfig();
	if (f < t0 || f > t1) return null;
	const k = spring({frame: f - t0, fps, config: {damping: 14, stiffness: 160}});
	const o = interpolate(f, [t1 - 8, t1], [1, 0], clampE);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', opacity: o, transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})`}}>
				{lines.map((t, i) => (
					<div key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1, color: i === lines.length - 1 ? c : '#fff', WebkitTextStroke: '6px #0b0d1e', paintOrder: 'stroke', textShadow: '0 8px 24px rgba(0,0,0,.6)'}}>
						{t}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const FgDeco: React.FC<{k: string; f: number}> = ({k, f}) => {
	if (k === 'counter')
		return (
			<Svg>
				<rect x={-300} y={985} width={2600} height={400} fill="#0e1018" />
				<rect x={-300} y={975} width={2600} height={14} fill="#3a4050" />
				{[0, 1, 2].map((i) => (
					<g key={i} transform={`translate(${160 + i * 330},975)`}>
						<rect x={-26} y={-96} width={52} height={96} rx={10} fill={['#c98a3a', '#5aa86a', '#d9d9e0'][i]} opacity={0.9} />
						<rect x={-30} y={-110} width={60} height={18} rx={6} fill="#2a2f3a" />
					</g>
				))}
			</Svg>
		);
	if (k === 'steam')
		return (
			<Svg>
				<Steam f={f} x={300} y={1100} s={3} n={5} seed="fs" />
				<Steam f={f + 30} x={1500} y={1100} s={2.6} n={5} seed="fz" />
			</Svg>
		);
	return (
		<Svg>
			{[0, 1, 2, 3].map((i) => (
				<circle key={i} cx={200 + i * 520 + Math.sin(f / 30 + i) * 20} cy={140 + (i % 2) * 70} r={80 + (i % 3) * 20} fill="#ffd78a" opacity={0.18 + 0.05 * Math.sin(f / 9 + i)} style={{filter: 'blur(10px)'}} />
			))}
		</Svg>
	);
};

const CamBase = (spec: ShotSpec, st: AState[], f: number, dur: number, R: Res) => {
	const c = spec.cam;
	const u = ease(Math.max(0, Math.min(1, f / Math.max(1, dur))));
	if (c && !Array.isArray(c)) {
		const a = st[c.fol] ?? st[0];
		const z0 = c.z ?? 1.5;
		const z1 = c.z1 ?? z0 + 0.1;
		const X = a ? a.x + (c.lead ?? 0) * a.facing : 960;
		const Y = c.y ?? (a ? a.headY + 70 : 560);
		return camOn(X, Y, z0 + (z1 - z0) * u);
	}
	if (Array.isArray(c)) {
		if (c.length >= 6) return mixCam(camOn(c[0], c[1], c[2]), camOn(c[3], c[4], c[5]), u);
		return mixCam(camOn(c[0], c[1], c[2]), camOn(c[0], c[1] - 10, c[2] + 0.12), u);
	}
	const xs = st.map((q) => q.x);
	const cx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 960;
	const spread = xs.length > 1 ? Math.max(...xs) - Math.min(...xs) : 0;
	const z = Math.max(1.0, Math.min(1.5, 1500 / (spread + 520)));
	return mixCam(camOn(cx, 600, z), camOn(cx, 580, z + 0.12), u);
};

export const mk = (spec: ShotSpec): React.FC => {
	const C: React.FC = () => {
		const {f, gf, dur, at, end} = useShot();
		const R: Res = (t, d = 0) => {
			if (t === undefined) return d;
			if (typeof t === 'number') return t;
			const m = /^(\d{3})(>)?([+-]\d+)?$/.exec(t);
			if (!m) return d;
			return (m[2] ? end(m[1]) : at(m[1])) + (m[3] ? Number(m[3]) : 0);
		};
		const st = buildActors(spec.a ?? [], f, gf, R);
		let cam = CamBase(spec, st, f, dur, R);
		// camera punches and shakes
		let m = 1;
		let sx = 0;
		let sy = 0;
		for (const fx of spec.fx ?? []) {
			if (fx.k === 'punch') m *= 1 + punch(f, R(fx.t), fx.amp ?? 0.08);
			if (fx.k === 'shake') {
				const k = env(f, R(fx.t), fx.t1 !== undefined ? R(fx.t1) : R(fx.t) + 14, 2, 8);
				sx += Math.sin(f * 7.1) * 16 * (fx.amp ?? 1) * k;
				sy += Math.cos(f * 6.3) * 12 * (fx.amp ?? 1) * k;
			}
		}
		cam = {...cam, x: cam.x * m + sx, y: cam.y * m + sy, zoom: cam.zoom * m};
		const world = (spec.fx ?? []).filter((q) => ['text', 'shock', 'spark', 'exclaim', 'question', 'bulb', 'call', 'smoke', 'speed', 'bolt', 'confetti'].includes(q.k));
		const screen = (spec.fx ?? []).filter((q) => ['cap', 'big', 'flash', 'glitch', 'pulse', 'rain', 'snow'].includes(q.k));
		const back = (spec.pr ?? []).filter((p) => p.layer === 'b');
		const mid = (spec.pr ?? []).filter((p) => !p.layer || p.layer === 'm');
		const front = (spec.pr ?? []).filter((p) => p.layer === 'f');
		const renderFx = (fx: FxSpec, i: number) => {
			switch (fx.k) {
				case 'text':
					return <ImpactText key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} text={fx.text} c={fx.c} s={fx.s ?? 0.8} />;
				case 'shock':
					return <Shockwave key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} c={fx.c} r={fx.r} />;
				case 'spark':
					return <Sparkles key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} n={fx.n} c={fx.c} />;
				case 'exclaim':
					return <Exclaim key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} s={fx.s} />;
				case 'question':
					return <Question key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} s={fx.s} />;
				case 'bulb':
					return <Bulb key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} s={fx.s} />;
				case 'call':
					return <Callout key={i} f={f} t0={R(fx.t)} t1={fx.t1 !== undefined ? R(fx.t1) : R(fx.t) + 80} from={fx.from} to={fx.to} text={fx.text} c={fx.c} size={fx.size} />;
				case 'smoke':
					return <Smoke key={i} f={f} t0={R(fx.t)} x={fx.x} y={fx.y} s={fx.s} />;
				case 'speed':
					return <SpeedLines key={i} f={f} t0={R(fx.t)} t1={R(fx.t1)} x={fx.x} y={fx.y} />;
				case 'bolt':
					return <Lightning key={i} f={f} t0={R(fx.t)} x={fx.x} />;
				case 'confetti':
					return <Confetti key={i} f={f} t0={R(fx.t)} />;
			}
			return null;
		};
		const badgeS = 0.8;
		return (
			<>
				<Stage cam={cam} bg="#101225" light={lightOf(spec.p)} dust={spec.p.startsWith('fridge') ? '#ffffff' : undefined}>
					<Layer depth={1.6}>
						<Place p={spec.p.split(':')[0]} f={gf} hue={spec.hue} />
					</Layer>
					{spec.crowd ? (
						<Layer depth={1.1}>
							<Svg>
								<CrowdRow n={spec.crowd[0]} x0={spec.crowd[1]} x1={spec.crowd[2]} floor={FLOOR - 30} s={spec.crowd[4] ?? 0.8} mode={spec.crowd[3]} seed={spec.at} t={gf} />
							</Svg>
						</Layer>
					) : null}
					<Layer depth={1}>
						<Svg>
							{back.map((p, i) => (
								<Prop key={'b' + i} spec={p} f={f} R={R} st={st} />
							))}
							{st.map((a, i) => {
								if (!a.visible) return null;
								const sp = a.spec;
								const talks = sp.says === true ? true : Array.isArray(sp.says) ? sp.says.some(([t0, t1]) => f >= R(t0) && f < R(t1)) : false;
								const exprs = sp.expr;
								const expr = Array.isArray(exprs) ? ([...exprs].filter(([, t]) => f >= R(t)).pop()?.[0] ?? 'normal') : exprs;
								const look = sp.look;
								return (
									<g key={i}>
										<Actor
											who={sp.who}
											x={a.x}
											floor={a.floor}
											s={a.s}
											size={sp.size}
											seat={a.seat}
											facing={a.facing}
											pose={a.pose}
											vx={a.vx}
											bob={a.bob}
											seed={i * 3.7 + sp.who.length}
											sp={talks ? 'N' : 'ZZ'}
											expr={expr}
											mouth={sp.mouth}
											look={look}
											faceTurn={sp.faceTurn ?? 0.45}
											handF={sp.hand}
											armOver={sp.armOver}
											acc={sp.acc as any}
											age={sp.age}
											color={sp.color}
											uid={`a${i}_${sp.who}`}
										/>
										{sp.hold && (!sp.hold.show || (f >= R(sp.hold.show[0]) && (sp.hold.show[1] === undefined || f < R(sp.hold.show[1])))) ? (
											<g transform={`translate(${holdPos(a).x},${holdPos(a).y}) rotate(${sp.hold.rot ?? 0}) scale(${(sp.hold.s ?? 1) * a.sc * 0.9})`}>
												<PropArt k={sp.hold.k as PropKind} t={sp.hold.t} n={sp.hold.n} c={sp.hold.c} f={f} />
											</g>
										) : null}
										{sp.who === STORY.hero ? (
											<g transform={`translate(${a.x + a.facing * 4 * a.sc},${a.headY - 44 * a.sc}) rotate(${a.pose.head * 0.3}) scale(${a.sc * 0.62})`}>
												<PropArt k="toque" f={f} />
											</g>
										) : null}
										{sp.badge !== false && sp.who === STORY.hero && STORY.counter ? <HeroBadge x={a.x} y={a.headY - 115 * a.sc} s={badgeS} /> : null}
									</g>
								);
							})}
							{mid.map((p, i) => (
								<Prop key={'m' + i} spec={p} f={f} R={R} st={st} />
							))}
							{world.map(renderFx)}
						</Svg>
					</Layer>
					{spec.fg ? (
						<Layer depth={0.62}>
							<FgDeco k={spec.fg} f={gf} />
						</Layer>
					) : null}
					{front.length ? (
						<Layer depth={0.7}>
							<Svg>
								{front.map((p, i) => (
									<Prop key={i} spec={p} f={f} R={R} st={st} />
								))}
							</Svg>
						</Layer>
					) : null}
				</Stage>
				{screen.map((fx, i) => {
					switch (fx.k) {
						case 'cap':
							return <CapLines key={i} f={f} t0={R(fx.t)} t1={R(fx.t1)} lines={fx.lines} top={fx.top ?? 90} c={fx.c} size={fx.size ?? 88} />;
						case 'big':
							return <BigText key={i} f={f} t0={R(fx.t)} t1={R(fx.t1)} text={fx.text} sub={fx.sub} c={fx.c} y={fx.y} size={fx.size} rot={fx.rot} />;
						case 'flash':
							return <AbsoluteFill key={i} style={{background: '#fff', opacity: flash(f, R(fx.t), fx.len ?? 8), pointerEvents: 'none'}} />;
						case 'glitch':
							return <Glitch key={i} f={f} t0={R(fx.t)} len={fx.len} />;
						case 'pulse':
							return f >= R(fx.t) && f < R(fx.t1) ? <Pulse key={i} f={f} /> : null;
						case 'rain':
							return <Rain key={i} f={f} />;
						case 'snow':
							return <Snow key={i} f={f} />;
					}
					return null;
				})}
			</>
		);
	};
	return C;
};

export const toShots = (specs: ShotSpec[]): ShotDef[] => specs.map((s) => ({at: s.at, off: s.off, C: mk(s), whip: s.whip}));
export {LightningFlash};
