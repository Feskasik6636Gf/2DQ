import React from 'react';
import {Pose, frontHand, toLocal} from '../engine/Stickman';
import {Actor, SIZE, SizeName, lifePose, addPose, useShot, useSpeaking} from '../kit/core';
import {blend, env, gesture, idle, reach, run, walk, walkTo, crowdLook, Gesture, SIT} from '../kit/actions';
import {Layer, Svg, Stage, camOn, mixCam, HeroBadge, Pop} from '../kit/kit';
import {Extra, CrowdRow} from '../kit/kit';
import {Stickman} from '../engine/Stickman';
import {Callout} from '../kit/graphics';
import {Accent, RuleCard} from '../kit/ui';
import {Shockwave, ImpactText, Sparkles, Smoke, Confetti, Exclaim, Question, Bulb, SpeedLines, punch, Glitch, Pulse, LightningFlash} from '../kit/fx';
import type {ShotDef} from '../kit/coverage';
import {PLACES} from './places';
import {PROPS} from './props';
import {AbsoluteFill} from 'remotion';

/* =========== tiny scene language ===========
   A scene = place + actors + a list of timed events. Time = line id (+/- frames): '005' or '005+20'.
   Actor events:  [t, who, 'walk', x, dur?]  [t, who, 'run', x, dur?]  [t, who, 'g', gesture, len?]
                  [t, who, 'expr', e]  [t, who, 'mouth', m]  [t, who, 'face', 1|-1]  [t, who, 'look', lx, ly]
                  [t, who, 'sit', y]  [t, who, 'stand']  [t, who, 'hop']  [t, who, 'fall', len?]  [t, who, 'p', Pose, len?]
                  [t, who, 'reach', x, y, len?]    hand to a world point
   Scene events:  [t, '*', 'cam', x|'@who', y, z, len?]
                  [t, '*', 'fx', name, x, y, text?]
                  [t, '*', 'call', text, fromX, fromY, toX, toY, len?]
                  [t, '*', 'acc', text, sub?, len?]       accent plate (screen)
                  [t, '*', 'flash'] [t, '*', 'shake']
   Props: {k, t, end?, x, y, s?, rot?, to?: [x,y,len?], hand?: [who, ox, oy], z?: 'back'|'front', a?: any}
*/
export type Ev = [string, string, string, ...any[]];
export type PropSpec = {k: string; t: string; end?: string; x?: number; y?: number; s?: number; rot?: number; to?: [number, number, number?]; hand?: [string, number, number]; z?: 'back' | 'front'; a?: any; pop?: boolean};
export type ActorSpec = {cast: string; x: number; s?: number; size?: SizeName; face?: 1 | -1; seat?: number; expr?: any; mouth?: string; frozen?: boolean; pose?: Pose; hood?: boolean; lift?: number; look?: [number, number]; life?: number; off?: string; end?: string; over?: any; badge?: boolean; age?: number};
export type CrowdSpec = {n: number; x0: number; x1: number; floor?: number; s: number; mode: 'dance' | 'stand' | 'run' | 'walk' | 'panic'; seed: string; dir?: 1 | -1; t0?: string};
export type Spec = {
	at: string;
	off?: number;
	whip?: boolean;
	place: string;
	night?: boolean;
	pa?: any; // place params
	cam: [number | string, number, number];
	camEnd?: [number | string, number, number]; // slow push over the shot
	actors?: Record<string, ActorSpec>;
	crowd?: CrowdSpec[];
	props?: PropSpec[];
	ev?: Ev[];
	frozen?: boolean; // grey world
	tint?: string; // overlay colour (rgba)
	bg?: string;
	light?: any;
	under?: (c: Ctx) => React.ReactNode; // drawn BEFORE actors (kids, desks)
	custom?: (c: Ctx) => React.ReactNode; // escape hatch drawn above actors
	screen?: (c: Ctx) => React.ReactNode; // escape hatch: screen overlay (outside the camera)
	badge?: boolean | 'age';
	dust?: string;
	rain?: boolean;
	hook?: boolean;
};
export type Ctx = {f: number; gf: number; at: (n: string) => number; T: (t: string) => number; dur: number; ax: (who: string) => number};

const FLOOR = 900;

const parseT = (at: (n: string) => number, t: string) => {
	const m = /^(\d+)([+-]\d+)?$/.exec(t);
	if (!m) return 0;
	return at(m[1]) + (m[2] ? parseInt(m[2], 10) : 0);
};

type Mv = {t0: number; t1: number; x: number; run: boolean};

const stateOf = (key: string, a: ActorSpec, evs: Ev[], f: number, gf: number, T: (t: string) => number, seed: number) => {
	const mine = evs.filter((e) => e[1] === key).map((e) => ({e, t: T(e[0])})).sort((p, q) => p.t - q.t);
	let face: 1 | -1 = a.face ?? 1;
	let expr: any = a.expr;
	let mouth: any = a.mouth;
	let look: [number, number] | undefined = a.look;
	let seat: number | undefined = a.seat;
	let cur = a.x;
	let pose: Pose = a.pose ?? idle(gf, seed);
	let vx = 0;
	let bob = 0;
	let moving = false;
	let squash = 0;
	let rot = 0;
	let dy = 0;
	let doneWalk = false;
	const gs: {g: Gesture; t: number; len: number}[] = [];
	const customs: {p: Pose; t: number; len: number}[] = [];
	const reaches: {x: number; y: number; t: number; len: number}[] = [];
	for (const {e, t} of mine) {
		const v = e[2];
		if (t > f && v !== 'walk' && v !== 'run') continue;
		if (v === 'walk' || v === 'run') {
			const tx = e[3] as number;
			const speed = v === 'run' ? 11 : 5;
			const dur = (e[4] as number) ?? Math.max(10, Math.ceil(Math.abs(tx - cur) / speed));
			const dir: 1 | -1 = tx >= cur ? 1 : -1;
			if (f < t) {
				// future move: position stays at cur
				continue;
			}
			if (f >= t + dur) {
				cur = tx;
				face = dir;
				continue;
			}
			face = dir;
			const w = walkTo(f, t, t + dur, cur, tx, seed, v === 'run' ? 0.55 : 0.32);
			cur = w.x;
			vx = w.vx;
			bob = w.bob;
			moving = true;
			pose = v === 'run' ? blend(idle(gf, seed), {...run(gf * 0.45), lean: 14}, Math.min(1, Math.min(f - t, t + dur - f) / 6)) : w.pose;
			doneWalk = true;
			break;
		}
		if (v === 'g') gs.push({g: e[3], t, len: (e[4] as number) ?? 50});
		else if (v === 'expr') expr = e[3];
		else if (v === 'mouth') mouth = e[3];
		else if (v === 'say') {
			if (f < t + ((e[3] as number) ?? 60)) mouth = Math.floor(f / 4) % 3 === 2 ? 'smile' : 'open';
		}
		else if (v === 'face') face = e[3];
		else if (v === 'look') look = [e[3], e[4]];
		else if (v === 'sit') seat = e[3];
		else if (v === 'stand') seat = undefined;
		else if (v === 'hop') dy = Math.max(dy, 70 * Math.sin(Math.max(0, Math.min(1, (f - t) / 18)) * Math.PI));
		else if (v === 'fall') rot = Math.max(rot, Math.min(1, (f - t) / ((e[3] as number) ?? 16)));
		else if (v === 'p') customs.push({p: e[3], t, len: (e[4] as number) ?? 40});
		else if (v === 'reach') reaches.push({x: e[3], y: e[4], t, len: (e[5] as number) ?? 40});
	}
	// remaining (not yet reached) walks must still apply their final x when f is past them: handled above.
	if (!doneWalk) {
		// find the position after all completed moves (loop above already updated cur)
	}
	if (!moving && seat === undefined && !a.pose) pose = idle(gf, seed);
	if (!moving && seat !== undefined && !a.pose) pose = {...SIT, lean: SIT.lean + Math.sin(gf / 33 + seed) * 1.2, head: Math.sin(gf / 27 + seed) * 2.5};
	for (const c of customs) pose = blend(pose, c.p, env(f, c.t, c.t + c.len, 8, 10));
	for (const g of gs) pose = gesture(g.g, pose, env(f, g.t, g.t + g.len, 8, 10), f);
	for (const r of reaches) {
		const sc = (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
		const hipY = (seat !== undefined ? seat : FLOOR - 157 * sc);
		const k = env(f, r.t, r.t + r.len, 8, 10);
		if (k > 0) pose = reach(pose, 'F', toLocal(r.x, r.y, cur, hipY, sc, face), k);
	}
	return {x: cur, face, expr, mouth, look, seat, pose, vx, bob, moving, squash, rot, dy};
};

const dispatchFx = (name: string, f: number, t0: number, x: number, y: number, text?: string) => {
	switch (name) {
		case 'shock':
			return <Shockwave f={f} t0={t0} x={x} y={y} />;
		case 'impact':
			return (
				<>
					<Shockwave f={f} t0={t0} x={x} y={y} />
					<ImpactText f={f} t0={t0} x={x} y={y - 140} text={text ?? 'BAM!'} />
				</>
			);
		case 'text':
			return <ImpactText f={f} t0={t0} x={x} y={y} text={text ?? ''} />;
		case 'spark':
			return <Sparkles f={f} t0={t0} x={x} y={y} />;
		case 'smoke':
			return <Smoke f={f} t0={t0} x={x} y={y} />;
		case 'excl':
			return <Exclaim f={f} t0={t0} x={x} y={y} />;
		case 'ques':
			return <Question f={f} t0={t0} x={x} y={y} />;
		case 'bulb':
			return <Bulb f={f} t0={t0} x={x} y={y} />;
		case 'confetti':
			return <Sparkles f={f} t0={t0} x={x} y={y} n={36} c="#ff8ab0" />;
		case 'heart':
			return <g transform={`translate(${x},${y - Math.max(0, f - t0) * 1.2})`} opacity={Math.max(0, 1 - (f - t0) / 50)}><PROPS.heart f={f - t0} gf={0} /></g>;
		case 'speed':
			return <SpeedLines f={f} t0={t0} t1={t0 + 24} x={x} y={y} />;
	}
	return null;
};

const camOf = (spec: Spec, evs: Ev[], f: number, T: (t: string) => number, ax: (w: string) => number, dur: number) => {
	const resolve = (x: number | string) => (typeof x === 'string' ? ax(x.slice(1)) : x);
	type K = {t: number; x: number | string; y: number; z: number; len: number};
	const keys: K[] = [{t: -9999, x: spec.cam[0], y: spec.cam[1], z: spec.cam[2], len: 1}];
	if (spec.camEnd) keys.push({t: 0, x: spec.camEnd[0], y: spec.camEnd[1], z: spec.camEnd[2], len: Math.max(30, dur)});
	for (const e of evs) if (e[1] === '*' && e[2] === 'cam') keys.push({t: T(e[0]), x: e[3], y: e[4], z: e[5], len: e[6] ?? 36});
	keys.sort((a, b) => a.t - b.t);
	let from = keys[0];
	let cx = resolve(from.x);
	let cy = from.y;
	let cz = from.z;
	for (let i = 1; i < keys.length; i++) {
		const k = keys[i];
		if (f < k.t) break;
		const u = Math.max(0, Math.min(1, (f - k.t) / k.len));
		const e = u * u * (3 - 2 * u);
		const nx = resolve(k.x);
		const px = cx;
		const py = cy;
		const pz = cz;
		cx = px + (nx - px) * e;
		cy = py + (k.y - py) * e;
		cz = pz + (k.z - pz) * e;
		if (u >= 1) {
			cx = nx;
			cy = k.y;
			cz = k.z;
		}
		from = k;
	}
	// when a '@who' follow is the current target keep following live
	const last = [...keys].reverse().find((k) => f >= k.t);
	if (last && typeof last.x === 'string' && f >= last.t + last.len) cx = resolve(last.x);
	return camOn(cx, cy, cz, {farBlur: cz > 1.6 ? 7 : 3.5});
};

export const mk = (spec: Spec): React.FC => {
	const C: React.FC = () => {
		const {f, gf, at, dur} = useShot();
		const T = (t: string) => parseT(at, t);
		const evs = spec.ev ?? [];
		const actors = spec.actors ?? {};
		const st: Record<string, ReturnType<typeof stateOf>> = {};
		Object.keys(actors).forEach((k, i) => {
			st[k] = stateOf(k, actors[k], evs, f, gf, T, i * 3 + 1);
		});
		const ax = (w: string) => st[w]?.x ?? 960;
		const ctx: Ctx = {f, gf, at, T, dur, ax};
		let cam = camOf(spec, evs, f, T, ax, dur);
		// punch / shake on fx events
		for (const e of evs) if (e[1] === '*' && e[2] === 'fx' && (e[3] === 'impact' || e[3] === 'shock')) cam = {...cam, zoom: cam.zoom * (1 + punch(f, T(e[0]), 0.07, 12))};
		for (const e of evs) {
			if (e[1] === '*' && e[2] === 'shake') {
				const t = T(e[0]);
				if (f >= t && f < t + 14) cam = {...cam, x: cam.x + Math.sin(f * 2.7) * 14 * (1 - (f - t) / 14), y: cam.y + Math.cos(f * 3.1) * 10 * (1 - (f - t) / 14)};
			}
		}
		const Place = PLACES[spec.place];
		const drawProp = (p: PropSpec, i: number) => {
			const t0 = T(p.t);
			const t1 = p.end ? T(p.end) : 99999;
			if (f < t0 || f >= t1) return null;
			const Pr = PROPS[p.k];
			if (!Pr || p.k === 'num') return null;
			let x = p.x ?? 0;
			let y = p.y ?? 0;
			let rot = p.rot ?? 0;
			if (p.to) {
				const len = p.to[2] ?? 30;
				const u = Math.max(0, Math.min(1, (f - t0) / len));
				const e = u * u * (3 - 2 * u);
				x = x + (p.to[0] - x) * e;
				y = y + (p.to[1] - y) * e;
			}
			if (p.hand) {
				const a = actors[p.hand[0]];
				const s = st[p.hand[0]];
				const sc = (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
				const hipY = s.seat !== undefined ? s.seat : FLOOR - 157 * sc;
				x = s.x + p.hand[1] * sc * s.face;
				y = hipY + p.hand[2] * sc;
			}
			const popK = p.pop === false ? 1 : Math.min(1, (f - t0) / 8);
			const sc = (p.s ?? 1) * (0.6 + 0.4 * (1 - Math.pow(1 - popK, 3)));
			return (
				<g key={'pr' + i} transform={`translate(${x},${y}) rotate(${rot}) scale(${sc})`} opacity={Math.min(1, (f - t0 + 1) / 3)}>
					<Pr f={f - t0} gf={gf} a={p.a} />
				</g>
			);
		};
		const props = spec.props ?? [];
		const heldBy = (who: string) => {
			// returns the world point the front hand should reach for a hand-held prop
			for (const p of props) {
				if (!p.hand || p.hand[0] !== who) continue;
				const t0 = T(p.t);
				const t1 = p.end ? T(p.end) : 99999;
				if (f >= t0 - 6 && f < t1) {
					const a = actors[who];
					const s = st[who];
					const sc = (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
					const hipY = s.seat !== undefined ? s.seat : FLOOR - 157 * sc;
					return {k: Math.min(1, (f - t0 + 6) / 8), x: s.x + p.hand[1] * sc * s.face, y: hipY + p.hand[2] * sc};
				}
			}
			return null;
		};
		const bgKey = spec.bg ?? '#1a1d33';
		const sp = useSpeaking(gf);
		const showBadge = spec.badge;
		return (
			<>
				<Stage cam={cam} bg={bgKey} light={spec.light ?? (spec.night ? {night: true, o: 0.3} : {x: 22, y: 8, o: 0.34})} dust={spec.dust}>
					<Layer depth={1.6}>
						<div style={{position: 'absolute', inset: 0}}>
							<Place f={gf} night={spec.night} a={spec.pa} />
							{spec.frozen ? <div style={{position: 'absolute', inset: 0, background: 'rgba(130,142,166,0.52)'}} /> : null}
						</div>
					</Layer>
					<Layer depth={1.25}>
						<Svg>
							<g>{props.filter((p) => p.z === 'back').map(drawProp)}</g>
						</Svg>
					</Layer>
					<Layer depth={1}>
						<Svg>
							{spec.under ? (
								<g>
									{spec.under(ctx)}
									{spec.frozen ? <rect x={-700} y={-300} width={3400} height={1800} fill="rgba(130,142,166,0.5)" /> : null}
								</g>
							) : null}
							{(spec.crowd ?? []).map((c, i) => {
								const t = c.t0 ? Math.max(0, f - T(c.t0)) : f;
								return (
									<g key={'cr' + i}>
										<CrowdRow n={c.n} x0={c.x0} x1={c.x1} floor={c.floor ?? FLOOR} s={c.s} mode={c.mode} seed={c.seed} dir={c.dir} t={t} />
									</g>
								);
							})}
							{Object.keys(actors).map((k) => {
								const a = actors[k];
								const s = st[k];
								const t0 = a.off ? T(a.off) : -99999;
								const t1 = a.end ? T(a.end) : 99999;
								if (f < t0 || f >= t1) return null;
								let pose = s.pose;
								const h = heldBy(k);
								if (h) {
									const sc = (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
									const hipY = s.seat !== undefined ? s.seat : FLOOR - 157 * sc;
									pose = reach(pose, 'F', toLocal(h.x, h.y, s.x, hipY, sc, s.face), h.k);
								}
								const frozen = a.frozen;
								const rotDeg = s.rot * 86;
								const el = (
									<Actor
										key={k}
										who={a.cast}
										x={s.x}
										s={a.s}
										size={a.size}
										floor={FLOOR}
										seat={s.seat}
										facing={s.face}
										faceTurn={0.55}
										expr={s.expr}
										mouth={s.mouth}
										look={s.look}
										pose={pose}
										vx={s.vx}
										bob={s.bob}
										life={a.life ?? (frozen ? 0 : 1)}
										hood={a.hood}
										age={a.age}
										uid={`${spec.at}-${k}`}
										seed={Object.keys(actors).indexOf(k) * 3 + 1}
										{...(a.over ?? {})}
									/>
								);
								const sc = (a.s ?? 1) * (a.size ? SIZE[a.size] : 1);
								return (
									<g key={'a' + k} transform={`translate(0,${-(s.dy + (a.lift ?? 0))}) ${rotDeg ? `rotate(${(s.face * rotDeg).toFixed(1)} ${s.x} ${FLOOR})` : ''}`} opacity={frozen && spec.frozen ? 0.62 : 1}>
										{el}
									</g>
								);
							})}
							{props.filter((p) => p.z !== 'back' && p.z !== 'front').map(drawProp)}
							{spec.custom ? spec.custom(ctx) : null}
							{evs.map((e, i) => {
								if (e[1] !== '*') return null;
								const t = T(e[0]);
								if (e[2] === 'fx') return <g key={'fx' + i}>{f >= t ? dispatchFx(e[3], f, t, e[4], e[5], e[6]) : null}</g>;
								if (e[2] === 'call') return <Callout key={'c' + i} f={f} t0={t} t1={t + (e[8] ?? 90)} from={[e[4], e[5]]} to={[e[6], e[7]]} text={e[3]} />;
								return null;
							})}
							{showBadge && actors.hero && !actors.hero.frozen ? (
								showBadge === 'age' ? (
									<HeroBadge x={st.hero.x} y={FLOOR - 157 * (actors.hero.s ?? 1) * (actors.hero.size ? SIZE[actors.hero.size] : 1) - 164 * (actors.hero.s ?? 1) * (actors.hero.size ? SIZE[actors.hero.size] : 1) - 105} s={0.8} />
								) : null
							) : null}
							{props.filter((p) => p.z === 'front').map(drawProp)}
						</Svg>
					</Layer>
				</Stage>
				{spec.tint ? <AbsoluteFill style={{background: spec.tint, pointerEvents: 'none'}} /> : null}
				{evs.map((e, i) => {
					if (e[1] !== '*') return null;
					const t = T(e[0]);
					if (e[2] === 'flash') return <AbsoluteFill key={'fl' + i} style={{background: '#fff', opacity: f >= t ? Math.max(0, 0.85 - (f - t) * 0.12) : 0, pointerEvents: 'none'}} />;
					if (e[2] === 'acc' && f >= t - 2) return <Accent key={'ac' + i} text={e[3]} sub={e[4]} t={f - t} dur={e[5] ?? 80} y={e[6] ?? 880} />;
					if (e[2] === 'glitch') return <Glitch key={'gl' + i} f={f} t0={t} len={e[3] ?? 14} />;
					if (e[2] === 'pulse' && f >= t && f < t + (e[3] ?? 90)) return <Pulse key={'pu' + i} f={f} />;
					return null;
				})}
				<AbsoluteFill style={{pointerEvents: 'none'}}>
					<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
						{props
							.filter((p) => p.k === 'num')
							.map((p, i) => {
								const t0 = T(p.t);
								const t1 = p.end ? T(p.end) : 99999;
								if (f < t0 || f >= t1) return null;
								const text: string = p.a?.text ?? '';
								const fs0 = p.a?.fs ?? 120;
								const fs = Math.min(fs0, 1700 / Math.max(1, text.length * 0.66));
								const px = Math.max(fs * text.length * 0.33 + 30, Math.min(1920 - fs * text.length * 0.33 - 30, p.x ?? 960));
								const py = Math.max(fs * 0.9 + 30, Math.min(1000, p.y ?? 200));
								const k = Math.min(1, (f - t0) / 8);
								const bounce = 1 + 0.12 * Math.max(0, 1 - (f - t0) / 10);
								return (
									<g key={i} transform={`translate(${px},${py}) scale(${(0.7 + 0.3 * k) * bounce})`} opacity={Math.min(1, (f - t0) / 4)}>
										<text textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={900} fontSize={fs} fill={p.a?.c ?? '#ffd23a'} stroke="#1d1626" strokeWidth={Math.max(5, fs / 12)} paintOrder="stroke" strokeLinejoin="round" style={{filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.45))'}}>
											{text}
										</text>
									</g>
								);
							})}
					</svg>
				</AbsoluteFill>
				{spec.screen ? spec.screen(ctx) : null}
			</>
		);
	};
	return C;
};

export const shot = (spec: Spec): ShotDef => ({at: spec.at, off: spec.off, C: mk(spec), whip: spec.whip});

/* a big stylised clock whose hands stop at a given frame */
export const BigClock: React.FC<{f: number; stopAt?: number; x: number; y: number; r?: number; c?: string}> = ({f, stopAt = 99999, x, y, r = 200, c = '#8fd0ff'}) => {
	const t = Math.min(f, stopAt);
	return (
		<g transform={`translate(${x},${y})`}>
			<circle r={r} fill="#0d1230" stroke={c} strokeWidth={10} />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={Math.sin((i * Math.PI) / 6) * (r - 12)} y1={-Math.cos((i * Math.PI) / 6) * (r - 12)} x2={Math.sin((i * Math.PI) / 6) * (r - 30)} y2={-Math.cos((i * Math.PI) / 6) * (r - 30)} stroke={c} strokeWidth={6} />
			))}
			<line x1={0} y1={0} x2={0} y2={-r * 0.9} stroke="#ff5a5a" strokeWidth={4} strokeLinecap="round" transform={`rotate(${t * 12})`} />
			<line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke={c} strokeWidth={9} strokeLinecap="round" transform={`rotate(${t * 2})`} />
			<line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke={c} strokeWidth={13} strokeLinecap="round" transform={`rotate(${t * 0.2})`} />
			<circle r={12} fill={c} />
		</g>
	);
};
