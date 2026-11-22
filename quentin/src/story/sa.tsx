import React from 'react';
import {shot, Spec} from './dsl';
import {ClassKids} from './kids';
import {kidPos} from './kids';

/* ===== A: the frozen classroom (001–016) ===== */
const HX = 1270; // hero seat x (front row, index 4)
const HS = {cast: 'hero', x: HX, s: 0.94, seat: 801, face: -1 as const};
const teacherArm: any = ['001-6', 'teacher', 'reach', 112, 424, 9999];
const heroFrozen = (extra: Partial<Spec> = {}): Spec => ({at: '001', place: 'classroom', pa: {stop: true}, frozen: true, cam: [960, 540, 1], ...extra});
const kidsFrozen = (o: any = {}) => (c: any) => <ClassKids c={c} o={{hide: [4, 3], deskOnly: [4, 3], ...(typeof o === 'function' ? o(c) : o)}} />;
const nikhil = {cast: 'nikhil', x: 1035, s: 0.94, seat: 801, face: -1 as const, frozen: true};
const teacher = {cast: 'teacher', x: 205, s: 1.04, face: -1 as const, frozen: true, life: 0.3};

export const A: any[] = [
	shot(
		heroFrozen({
			at: '001',
			cam: [170, 420, 2.4],
			badge: 'age',
			actors: {teacher, nikhil, hero: {...HS}},
			under: kidsFrozen(),
			props: [{k: 'marker', t: '001-6', x: 116, y: 426, to: [112, 410, 200], rot: -20, z: 'back'}, {k: 'plane', t: '001', x: 1035, y: 515, z: 'back', s: 1.2}],
			ev: [
				['001-6', 'teacher', 'reach', 112, 424, 9999],
				['001+10', '*', 'cam', 960, 560, 1.0, 60],
				['002+40', '*', 'cam', 1060, 600, 1.55, 60],
				['003+0', '*', 'cam', 1035, 520, 2.1, 40],
				['001+20', '*', 'fx', 'excl', 170, 300],
				['003+30', 'hero', 'look', -0.9, -0.3],
				['003+40', '*', 'fx', 'ques', 1035, 420],
			],
		}),
	),
	shot(
		heroFrozen({
			at: '004',
			cam: [1300, 560, 1.2],
			camEnd: [1240, 590, 2.2],
			badge: 'age',
			actors: {hero: {...HS}, nikhil},
			under: kidsFrozen({sneezeIdx: 24}),
			props: [{k: 'sneeze', t: '004', x: 1195, y: 592, s: 1.3, rot: 180, z: 'back'}],
			ev: [
				['004+10', 'hero', 'expr', 'wide'],
				['004+10', 'hero', 'look', -0.9, -0.5],
				['004+30', '*', 'fx', 'excl', 1245, 480],
				['005+0', 'hero', 'g', 'touchFace', 70],
			],
		}),
	),
	shot(
		heroFrozen({
			at: '006',
			whip: false,
			cam: [1100, 620, 1.2],
			badge: 'age',
			actors: {hero: {...HS}, teacher, nikhil},
			under: kidsFrozen(),
			props: [{k: 'stickers', t: '006+20', hand: ['hero', 40, -96], s: 0.9}],
			ev: [
				['006+0', 'hero', 'stand'],
				['006+0', 'hero', 'walk', 330, 60],
				['006+0', '*', 'cam', '@hero', 600, 1.5, 40],
				['006+60', 'hero', 'face', 1],
				['006+60', 'hero', 'g', 'presentF', 40],
				['006+70', '*', 'cam', 330, 560, 1.7, 40],
			],
		}),
	),
	shot(
		heroFrozen({
			at: '007',
			cam: [400, 620, 1.35],
			badge: 'age',
			actors: {hero: {cast: 'hero', x: 330, s: 0.94, face: 1, frozen: false}, teacher},
			under: kidsFrozen((c: any) => ({starAt: (i: number) => (i === 4 || i === 3 ? null : c.T('007') + 12 + i * 4)})),
			props: [],
			ev: [
				['007+0', 'hero', 'run', 1750, 150],
				['007+0', '*', 'cam', '@hero', 640, 1.35, 20],
				['007+80', '*', 'cam', 960, 580, 1.0, 40],
				['007+120', '*', 'fx', 'spark', 1750, 620],
			],
		}),
	),
	// 008: flashback, the bet
	shot({
		at: '008',
		place: 'classroom',
		cam: [1150, 600, 1.7],
		camEnd: [1110, 590, 2.0],
		badge: 'age',
		tint: 'rgba(255,225,170,0.10)',
		actors: {nikhil: {...nikhil, frozen: false, face: -1, expr: 'angry', mouth: 'smirk'}, hero: {...HS}},
		under: kidsFrozen({alive: true}),
		props: [{k: 'bill', t: '008+8', x: 1035, y: 540, s: 1.2, to: [1035, 560, 40]}, {k: 'bubble', t: '008+16', x: 1040, y: 470, a: {text: 'BET: $5', w: 110, h: 46, fs: 38}, s: 0.9}],
		ev: [
			['008+0', 'nikhil', 'g', 'point', 70],
			['008+20', 'hero', 'g', 'shrug', 50],
			['008+30', '*', 'fx', 'spark', 1035, 540],
		],
	}),
	// 009-010: grab the plane, put it back
	shot(
		heroFrozen({
			at: '009',
			cam: [1120, 600, 1.3],
			camEnd: [1060, 560, 2.0],
			badge: 'age',
			actors: {hero: {...HS}, nikhil, teacher},
			under: kidsFrozen(),
			props: [
				{k: 'plane', t: '009-30', end: '009+34', x: 1035, y: 515, z: 'back', s: 1.2},
				{k: 'plane', t: '009+34', end: '010+30', hand: ['hero', 52, -130], s: 1.1},
				{k: 'plane', t: '010+30', x: 1035, y: 515, z: 'back', s: 1.2},
			],
			ev: [
				['009+0', 'hero', 'stand'],
				['009+0', 'hero', 'walk', 1180, 26],
				['009+30', 'hero', 'g', 'presentF', 60],
				['009+34', '*', 'fx', 'spark', 1035, 515],
				['010+0', 'hero', 'walk', 1070, 24],
				['010+30', 'hero', 'walk', 1270, 30],
				['010+30', '*', 'cam', 1100, 580, 1.5, 40],
			],
		}),
	),
	// 011: 12:04, time restarts
	shot({
		at: '011',
		place: 'classroom',
		cam: [960, 570, 1.15],
		camEnd: [1100, 600, 1.45],
		badge: 'age',
		pa: {h: 12, m: 4},
		actors: {hero: {...HS}, nikhil: {...nikhil, frozen: false}, teacher: {...teacher, frozen: false}},
		under: kidsFrozen({alive: true}),
		props: [{k: 'num', t: '011+4', x: 960, y: 300, a: {text: '12:04', fs: 150}}],
		ev: [
			['011-6', '*', 'flash'],
			['011+0', 'hero', 'sit', 801],
			['011+4', '*', 'fx', 'impact', 960, 400, 'TICK!'],
			['011+30', '*', 'fx', 'spark', 1270, 600],
		],
	}),
	// 012-013: kids touch foreheads, marker clatters
	shot({
		at: '012',
		place: 'classroom',
		cam: [900, 580, 1.0],
		camEnd: [760, 600, 1.35],
		badge: 'age',
		actors: {hero: {...HS, expr: 'worried'}, nikhil: {...nikhil, frozen: false, expr: 'wide'}, teacher: {...teacher, frozen: false}},
		under: (c: any) => <ClassKids c={c} o={{hide: [4, 3], deskOnly: [4, 3], alive: true, touchAt: c.T('012') + 12, starAt: (i: number) => (i === 4 || i === 3 ? null : 0)}} />,
		props: [{k: 'marker', t: '013-4', x: 112, y: 410, to: [112, 880, 16], rot: 60}, {k: 'marker', t: '013+16', x: 112, y: 880, rot: 80}],
		ev: [
			['012+10', '*', 'fx', 'excl', 900, 520],
			['013+0', '*', 'cam', 190, 620, 1.9, 24],
			['013+16', '*', 'fx', 'impact', 112, 880, 'CLINK!'],
		],
	}),
	// 014: who did this
	shot({
		at: '014',
		place: 'classroom',
		cam: [330, 520, 1.6],
		camEnd: [300, 480, 2.0],
		actors: {teacher: {...teacher, frozen: false, face: 1, expr: 'angry', life: 1}, hero: {...HS}},
		under: kidsFrozen({alive: true}),
		ev: [
			['014-4', 'teacher', 'say', 60],
			['014+10', 'teacher', 'g', 'point', 60],
			['014+10', '*', 'fx', 'excl', 330, 330],
		],
	}),
	// 015-016: everyone looks at you
	shot({
		at: '015',
		place: 'classroom',
		cam: [900, 600, 1.1],
		camEnd: [1230, 620, 1.9],
		badge: 'age',
		actors: {hero: {...HS, expr: 'worried'}, nikhil: {...nikhil, frozen: false, expr: 'wide'}},
		under: kidsFrozen({alive: true, lookX: 1, laugh: false}),
		props: [{k: 'think', t: '016+10', x: 1330, y: 520, a: {text: '...', fs: 60}, s: 0.8}],
		ev: [
			['015+30', '*', 'fx', 'ques', 1100, 480],
			['016+0', '*', 'cam', 1270, 600, 2.1, 50],
			['016+20', 'hero', 'look', 0.8, 0],
			['016+30', 'hero', 'g', 'scratch', 50],
		],
	}),
];
