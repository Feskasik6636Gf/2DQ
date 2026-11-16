import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import type {Expr, HandShape, Mouth} from '../engine/Stickman';
import {Layer, Svg} from '../engine/camera';
import {Actor, Shot, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Gesture, SIT, blend, env, gesture, idle, reach, run, walkTo} from '../kit/actions';
import {HeroBadge, Light, Stage, camOn, clamp, ease, flash, mixCam} from '../kit/kit';
import type {Cam} from '../engine/camera';

/* A tiny scene language so every sentence of the voice-over gets its own action.
   A shot = a set (back layers), actors with a list of timed beats, optional furniture in
   front, world overlays (callouts, cards) and screen overlays. Beats are anchored to a
   line id ('057') + frames: {at: '057', off: 10, len: 40, g: 'point'}. */

export type T = {at: string | number; off?: number; len?: number};
export type Beat = T & {
	walk?: [number, number];
	run?: [number, number];
	speed?: number;
	g?: Gesture;
	reach?: [number, number]; // world point
	osc?: [number, number, number]; // reach point wobble: dx, dy, period (frames)
	side?: 'F' | 'B';
	expr?: Expr;
	mouth?: Mouth;
	look?: [number, number];
	over?: boolean;
	hand?: HandShape;
	lean?: number;
	head?: number;
	squash?: number;
	hood?: boolean;
	turn?: number;
	face?: 1 | -1;
	hide?: boolean;
	pose?: Pose; // full pose override (eased in/out)
	sway?: number; // trembling amplitude (deg) — fear
	hop?: number; // jump height px
	rot?: number; // whole-body rotation in degrees (falls)
};
export type ItemKind = 'clip' | 'flash' | 'cup' | 'marker' | 'paper' | 'badge';
export type ActorSpec = {
	id: string;
	who: string;
	x: number;
	s?: number;
	floor?: number;
	face?: 1 | -1;
	sit?: number; // hip y of a seated figure (then pose = SIT)
	beats?: Beat[];
	props?: Record<string, any>;
	item?: ItemKind;
	badge?: boolean; // the staff counter over the head
	hidden?: boolean; // invisible until its first non-hide beat
	z?: number; // draw order
	still?: boolean; // no idle sway (statues, sleepers)
};
export type Pos = {x: number; headY: number; hipY: number; s: number; facing: 1 | -1; hidden: boolean};
export type Ctx = Shot & {sp: string | null; pos: Record<string, Pos>};

const tr = (b: T, at: (n: string) => number): [number, number] => {
	const t0 = (typeof b.at === 'string' ? at(b.at) : b.at) + (b.off ?? 0);
	return [t0, t0 + (b.len ?? 30)];
};

const Item: React.FC<{k: ItemKind}> = ({k}) => {
	if (k === 'clip')
		return (
			<g transform="rotate(-70) translate(6,-18)">
				<rect x={0} y={0} width={34} height={46} rx={4} fill="#6b4f36" />
				<rect x={4} y={6} width={26} height={36} fill="#f6f2e2" />
				<rect x={10} y={2} width={14} height={7} fill="#9aa4ac" />
			</g>
		);
	if (k === 'flash')
		return (
			<g>
				<rect x={0} y={-6} width={44} height={13} rx={4} fill="#2a2f3a" />
				<rect x={38} y={-9} width={12} height={19} rx={3} fill="#c9d4e6" />
				<circle cx={50} cy={0} r={5} fill="#fff6d0" />
			</g>
		);
	if (k === 'cup')
		return (
			<g transform="translate(0,-14)">
				<path d="M0,0 L26,0 L21,30 L5,30 Z" fill="#f4f0e6" />
				<rect x={0} y={0} width={26} height={5} fill="#c9c2ae" />
			</g>
		);
	if (k === 'marker')
		return (
			<g>
				<rect x={0} y={-5} width={42} height={10} rx={4} fill="#14141c" />
				<rect x={42} y={-4} width={9} height={8} fill="#e8e0b0" />
			</g>
		);
	if (k === 'badge')
		return (
			<g transform="translate(6,6)">
				<rect width={30} height={42} rx={4} fill="#e6edf2" stroke="#7a8794" strokeWidth={3} />
				<rect x={5} y={6} width={20} height={16} fill="#9fb4c6" />
			</g>
		);
	return (
		<g transform="rotate(-40) translate(2,-26)">
			<rect width={40} height={50} fill="#f6f2e2" />
			<line x1={6} y1={14} x2={34} y2={14} stroke="#999" strokeWidth={3} />
			<line x1={6} y1={26} x2={30} y2={26} stroke="#999" strokeWidth={3} />
		</g>
	);
};

const solve = (a: ActorSpec, sh: Shot) => {
	const {f, at} = sh;
	const s = a.s ?? 1;
	const floor = a.floor ?? 900;
	const seed = a.x / 97 + (a.id.length % 5);
	let x = a.x;
	let facing: 1 | -1 = a.face ?? 1;
	let pose: Pose = a.sit !== undefined ? {...SIT} : idle(f, seed);
	if (a.still) pose = a.sit !== undefined ? {...SIT} : {...pose, lean: 0, head: 0};
	let vx = 0;
	let bob = 0;
	let hidden = !!a.hidden;
	let rot = 0;
	const st: Record<string, any> = {};
	const bs = (a.beats ?? []).map((b) => ({b, t: tr(b, at)})).sort((p, q) => p.t[0] - q.t[0]);
	// movement first (position decides everything else)
	for (const {b, t} of bs) {
		const mv = b.walk ?? b.run;
		if (!mv) continue;
		const isRun = !!b.run;
		const r = walkTo(f, t[0], t[1], mv[0], mv[1], seed, b.speed ?? (isRun ? 0.55 : 0.3));
		if (f >= t[0]) {
			x = r.x;
			facing = r.facing;
		}
		if (f > t[0] && f < t[1]) {
			pose = isRun ? blend(idle(f, seed), run((f - t[0]) * (b.speed ?? 0.55) * 1.15), Math.min(1, Math.min((f - t[0]) / 6, (t[1] - f) / 6) * 1)) : r.pose;
			vx = isRun ? r.vx * 1.4 : r.vx;
			bob = isRun ? Math.abs(Math.sin((f - t[0]) * 0.6)) * 6 : r.bob;
		}
	}
	const hipY = a.sit !== undefined ? a.sit : floor - 157 * s;
	for (const {b, t} of bs) {
		if (b.face !== undefined && f >= t[0]) facing = b.face;
		if (b.hide === true && !a.hidden && f >= t[0] && f <= t[1]) hidden = true;
		const k = env(f, t[0], t[1], 6, 8);
		if (b.g) pose = gesture(b.g, pose, k, f - t[0]);
		if (b.pose && k > 0) pose = blend(pose, b.pose, k);
		if (b.lean && k > 0) pose = {...pose, lean: pose.lean + b.lean * k};
		if (b.head && k > 0) pose = {...pose, head: pose.head + b.head * k};
		if (b.sway && k > 0) pose = {...pose, lean: pose.lean + Math.sin(f * 1.7) * b.sway * k, head: pose.head + Math.sin(f * 2.3 + 1) * b.sway * 0.6 * k};
		if (b.reach && k > 0) {
			const o = b.osc ? Math.sin(((f - t[0]) / b.osc[2]) * Math.PI * 2) : 0;
			pose = reach(pose, b.side ?? 'F', toLocal(b.reach[0] + (b.osc ? b.osc[0] * o : 0), b.reach[1] + (b.osc ? b.osc[1] * o : 0), x, hipY, s, facing), k);
		}
		if (b.rot && f >= t[0]) rot += b.rot * (b.len === undefined ? 1 : env(f, t[0], t[1] + 9999, 10, 1));
		if (b.hop && k > 0) bob += Math.abs(Math.sin(((f - t[0]) / (t[1] - t[0])) * Math.PI)) * b.hop * (-1);
		if (f >= t[0] && f <= t[1]) {
			if (b.expr) st.expr = b.expr;
			if (b.mouth) st.mouth = b.mouth;
			if (b.look) st.look = b.look;
			if (b.over) st.over = true;
			if (b.hand) st.hand = b.hand;
			if (b.turn !== undefined) st.turn = b.turn;
			if (b.hood !== undefined) st.hood = b.hood;
			if (b.squash !== undefined) st.squash = b.squash * k;
		}
	}
	// hidden until the first beat that mentions it with hide:false
	if (a.hidden) {
		const first = bs.find((q) => q.b.hide === false);
		hidden = !(first && f >= first.t[0]);
		const hideAgain = bs.find((q) => q.b.hide === true);
		if (hideAgain && f >= hideAgain.t[0]) hidden = true;
	}
	return {x, facing, pose, vx, bob, hidden, st, hipY, s, floor, seed, rot};
};

export type CamK = [number, number, number] | [number, number, number, number]; // X, Y, zoom, [farBlur]
export type SceneSpec = {
	bg?: string;
	light?: Light | false;
	dust?: string;
	vig?: number;
	cam: CamK | [CamK, CamK] | ((c: Ctx) => Cam);
	follow?: string; // cam X is an offset from this actor
	camPos?: (c: Ctx) => CamK; // fully dynamic (overrides cam, goes through ease)
	back: (c: Ctx) => React.ReactNode;
	front?: (c: Ctx) => React.ReactNode;
	world?: (c: Ctx) => React.ReactNode; // overlays in world space (depth 1)
	hud?: (c: Ctx) => React.ReactNode;
	actors?: ActorSpec[];
	shake?: T[]; // camera shake bursts
	flashes?: (string | number)[]; // white flashes on these line ids/frames
	grain?: number;
};

const toCam = (k: CamK, dx = 0): Cam => camOn(k[0] + dx, k[1], k[2], k[3] !== undefined ? {farBlur: k[3]} : {});

const SceneC: React.FC<{spec: SceneSpec}> = ({spec}) => {
	const sh = useShot();
	const {f, gf, at, dur} = sh;
	const sp = useSpeaking(gf);
	const acts = spec.actors ?? [];
	const solved = acts.map((a) => ({a, r: solve(a, sh)}));
	const pos: Record<string, Pos> = {};
	for (const {a, r} of solved) pos[a.id] = {x: r.x, headY: r.floor - 157 * r.s - 164 * r.s - (a.sit !== undefined ? 0 : 0), hipY: r.hipY, s: r.s, facing: r.facing, hidden: r.hidden};
	for (const {a, r} of solved) if (a.sit !== undefined) pos[a.id].headY = r.hipY - 164 * r.s - 10;
	const ctx: Ctx = {...sh, sp, pos};
	const k = interpolate(f, [0, dur], [0, 1], {...clamp, easing: ease});
	let cam: Cam;
	const dx = spec.follow && pos[spec.follow] ? pos[spec.follow].x : 0;
	if (spec.camPos) cam = toCam(spec.camPos(ctx));
	else if (typeof spec.cam === 'function') cam = spec.cam(ctx);
	else if (Array.isArray(spec.cam[0])) cam = mixCam(toCam(spec.cam[0] as CamK, dx), toCam(spec.cam[1] as CamK, dx), k);
	else cam = toCam(spec.cam as CamK, dx);
	// shake bursts
	let sx = 0;
	let sy = 0;
	for (const b of spec.shake ?? []) {
		const [t0, t1] = tr({...b, len: b.len ?? 12}, at);
		const e = env(f, t0, t1, 1, 8);
		if (e > 0) {
			sx += (random('shx' + f) - 0.5) * 36 * e;
			sy += (random('shy' + f) - 0.5) * 30 * e;
		}
	}
	if (sx || sy) cam = {...cam, x: cam.x + sx, y: cam.y + sy};
	let fl = 0;
	for (const q of spec.flashes ?? []) fl = Math.max(fl, flash(f, typeof q === 'string' ? at(q) : q, 8));
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg={spec.bg ?? '#0a0e22'} light={spec.light ?? {night: true, o: 0.3}} dust={spec.dust} vig={spec.vig} grain={spec.grain ?? 0}>
				{spec.back(ctx)}
				<Layer depth={1}>
					<Svg>
						{solved
							.slice()
							.sort((p, q) => (p.a.z ?? 0) - (q.a.z ?? 0))
							.map(({a, r}) =>
								r.hidden ? null : (
									<g key={a.id} transform={r.rot ? `rotate(${r.rot} ${r.x} ${r.floor})` : undefined}>
										<Actor
											who={a.who}
											x={r.x}
											s={r.s}
											floor={r.floor}
											seat={a.sit}
											facing={r.facing}
											faceTurn={r.st.turn ?? 0.45}
											look={r.st.look ?? [0.5 * r.facing, 0]}
											expr={r.st.expr}
											mouth={r.st.mouth}
											armOver={r.st.over}
											handF={r.st.hand}
											hood={r.st.hood}
											squash={r.st.squash}
											pose={r.pose}
											vx={r.vx}
											bob={r.bob}
											uid={a.id + '-' + (a.who ?? '')}
											handItem={a.item ? <Item k={a.item} /> : undefined}
											{...(a.props ?? {})}
										/>
										{a.badge ? <HeroBadge x={r.x} y={pos[a.id].headY - 115 * r.s} s={0.8} /> : null}
									</g>
								),
							)}
					</Svg>
				</Layer>
				{spec.front?.(ctx)}
				{spec.world ? (
					<Layer depth={1}>
						<Svg>{spec.world(ctx)}</Svg>
					</Layer>
				) : null}
			</Stage>
			{spec.hud?.(ctx)}
			{fl > 0.01 ? <AbsoluteFill style={{background: '#fff', opacity: fl}} /> : null}
		</AbsoluteFill>
	);
};

/* shot(at, spec, extra) -> ShotDef */
export const shot = (at: string, spec: SceneSpec, extra: Partial<ShotDef> = {}): ShotDef => ({at, C: () => <SceneC spec={spec} />, ...extra});

/* a row of blue-scrub nurses with varied looks */
export const nurses = (n: number, x0: number, x1: number, o: {s?: number; floor?: number; face?: 1 | -1; prefix?: string; seed?: number; beats?: Beat[]} = {}): ActorSpec[] =>
	Array.from({length: n}).map((_, i) => {
		const sd = (o.seed ?? 0) + i;
		const hair = (['short', 'bun', 'ponytail', 'bob', 'cap', 'short', 'spiky'] as const)[Math.floor(random('nh' + sd) * 7)];
		const hc = ['#2a2a3a', '#5a3a22', '#c9a35a', '#7a7a86', '#1c1c24'][Math.floor(random('nc' + sd) * 5)];
		const shade = ['#3b7fd1', '#3a73c4', '#4a8ad8', '#2f6fc0'][Math.floor(random('ns' + sd) * 4)];
		return {
			id: `${o.prefix ?? 'n'}${i}`,
			who: 'nurse',
			x: x0 + ((x1 - x0) * i) / Math.max(1, n - 1) + (random('nx' + sd) - 0.5) * 20,
			s: (o.s ?? 0.9) * (0.95 + random('ns2' + sd) * 0.1),
			floor: (o.floor ?? 900) + (i % 2) * 6,
			face: o.face ?? 1,
			beats: o.beats,
			props: {hair, hairColor: hc, color: shade},
			z: i % 2,
		};
	});
