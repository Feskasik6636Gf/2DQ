import type {ShotDef} from '../kit/coverage';
const LEAD = 6;
import {L} from '../kit/core';
import {buildShot} from './direct';
import {SC_A} from './s_a';
import {SC_B} from './s_b';
import {SC_C} from './s_c';
import {SC_D} from './s_d';

export const SCENES = [...SC_A, ...SC_B, ...SC_C, ...SC_D];
const DONE = new Set(SCENES.flatMap((s) => s.beats.map((b) => b.n)));
export const MISSING = Array.from({length: 342}, (_, i) => String(i + 1).padStart(3, '0')).filter((n) => !DONE.has(n));
export const SHOTS: ShotDef[] = SCENES.map((s) => ({
	at: s.at,
	C: buildShot(s),
	own: true,
	whip: s.whip,
	ownCuts: s.beats.map((bt) => L(bt.n).from - 4 - (L(s.at).from - LEAD)).filter((v) => v > 0),
}));
