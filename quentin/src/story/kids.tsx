import React from 'react';
import {Stickman, Pose} from '../engine/Stickman';
import {SIT, crowdLook, gesture, env, blend} from '../kit/actions';
import {Desk} from '../engine/props';
import type {Ctx} from './dsl';
import {PROPS} from './props';

/* 28 frozen classmates in 4 rows (side view, facing the board on the left). */
export type KidOpts = {
	starAt?: (i: number) => number | null; // frame when a star lands on kid i (null = none)
	touchAt?: number | null; // frame when all kids touch their foreheads
	sneezeIdx?: number;
	hide?: number[];
	fx?: number; // x offset
	only?: number[]; // draw only these kids
	alive?: boolean; // moving idle (not frozen)
	rows?: number;
	skipDesk?: boolean;
	deskOnly?: number[];
	lookX?: number;
	face?: 1 | -1;
	laugh?: boolean;
};
const ROWS = [
	{floor: 905, s: 0.94},
	{floor: 858, s: 0.84},
	{floor: 815, s: 0.75},
	{floor: 776, s: 0.67},
];
export const kidPos = (i: number, opt: KidOpts = {}) => {
	const r = Math.floor(i / 7);
	const c = i % 7;
	const R = ROWS[r];
	return {x: 330 + c * 235 + r * 70 + (opt.fx ?? 0), floor: R.floor, s: R.s, r};
};
export const ClassKids: React.FC<{c: Ctx; o?: KidOpts}> = ({c, o = {}}) => {
	const {f, gf} = c;
	const rows = [3, 2, 1, 0];
	return (
		<g>
			{rows.map((r) =>
				Array.from({length: 7}).map((_, k) => {
					const i = r * 7 + k;
					if (o.hide?.includes(i)) return null;
					if (o.only && !o.only.includes(i)) return null;
					if (o.deskOnly?.includes(i)) {
						const q = kidPos(i, o);
						return <Desk key={i} x={q.x - 190 * q.s} y={q.floor - 210 * q.s} w={170 * q.s} h={150 * q.s} />;
					}
					const p = kidPos(i, o);
					const look = crowdLook(i, 'kid');
					const touch = o.touchAt != null ? env(f, o.touchAt + (i % 3), o.touchAt + 60, 6, 12) : 0;
					let pose: Pose = o.alive ? {...SIT, lean: SIT.lean + Math.sin(gf / 30 + i) * 1.5, head: Math.sin(gf / 22 + i) * 3} : SIT;
					pose = gesture('touchFace', pose, touch, gf);
					const sneeze = o.sneezeIdx === i;
					const laugh = !sneeze && o.laugh !== false && (i % 4 === 1 || i % 5 === 2);
					const hip = p.floor - 110 * p.s;
					const starT = o.starAt ? o.starAt(i) : null;
					return (
						<g key={i}>
							{!o.skipDesk ? <Desk x={p.x - 190 * p.s} y={p.floor - 210 * p.s} w={170 * p.s} h={150 * p.s} /> : null}
							<Stickman id={`kid${i}`} x={p.x} y={hip} scale={p.s} facing={o.face ?? -1} pose={pose} blink={o.alive ? (gf + i * 13) % 90 < 4 ? 1 : 0 : 0} look={[o.lookX ?? -0.6, 0]} expr={sneeze ? 'sleepy' : laugh && !o.alive ? 'wide' : touch > 0.3 ? 'wide' : 'normal'} mouth={sneeze ? 'open' : laugh ? 'laugh' : undefined} faceTurn={0.45} {...look} />
							{starT != null && f >= starT ? (
								<g transform={`translate(${p.x + (o.face ?? -1) * 14 * p.s},${hip - 164 * p.s - 20 * p.s}) scale(${p.s * (1 + 0.5 * Math.max(0, 1 - (f - starT) / 6))})`}>
									<PROPS.star f={f - starT} gf={gf} />
								</g>
							) : null}
						</g>
					);
				}),
			)}
		</g>
	);
};
