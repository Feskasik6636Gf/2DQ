import React from 'react';
import {shot, Spec, BigClock} from './dsl';
import {hero, P, FZ} from './common';
import {RuleCard} from '../kit/ui';
import type {ShotDef} from '../kit/coverage';
import {ClassKids} from './kids';

/* ===== B: the power (017–030), C: four rules (031–038), D: physics (039–045) ===== */
const card = (at: string, n: string, title: string, text: string, off = 0): ShotDef => ({
	at,
	off,
	C: () => <RuleCard n={n} title={title} text={text} t={0} />,
});

export const B: any[] = [
	// 017 overnight you got a new power
	shot({
		at: '017',
		place: 'bedroom',
		cam: [960, 560, 1.1],
		camEnd: [900, 540, 1.5],
		actors: {hero: hero(930, {face: 1, expr: 'wide', mouth: 'open'})},
		props: [{k: 'zzz', t: '017-6', end: '017+30', x: 800, y: 460, z: 'back'}],
		ev: [
			['017+0', 'hero', 'p', {lean: -4, head: -8, armF: [150, 10], armB: [-20, 30], legF: [4, 2], legB: [-3, 2]}, 70],
			['017+20', '*', 'fx', 'spark', 930, 500],
			['017+30', '*', 'fx', 'bulb', 930, 340],
			['017+50', 'hero', 'look', 0.8, -0.3],
		],
	}),
	// 018 you can stop time (snap)
	shot({
		at: '018',
		place: 'void',
		pa: {},
		cam: [960, 560, 1.0],
		camEnd: [960, 540, 1.25],
		actors: {hero: hero(960, {expr: 'normal'})},
		custom: (c: any) => <BigClock f={c.f} stopAt={c.T('018+34')} x={960} y={400} r={230} />,
		ev: [
			['018+14', 'hero', 'g', 'point', 50],
			['018+34', '*', 'fx', 'impact', 960, 400, 'STOP!'],
			['018+34', '*', 'flash'],
		],
	}),
	// 019 everything freezes except you
	shot({
		at: '019',
		place: 'yard',
		frozen: true,
		cam: [400, 560, 1.2],
		camEnd: [1500, 560, 1.2],
		actors: {
			c1: P('c1', 520, {frozen: true, pose: FZ.run, lift: 0}),
			c2: P('c2', 760, {frozen: true, pose: FZ.jump, lift: 130, s: 0.9}),
			c3: P('c3', 1050, {frozen: true, pose: FZ.laugh}),
			c4: P('c4', 1290, {frozen: true, pose: FZ.run, face: -1}),
			c5: P('c5', 1560, {frozen: true, pose: FZ.cheer, s: 0.9}),
			hero: hero(200),
		},
		ev: [
			['019+0', 'hero', 'walk', 1760, 150],
			['019+0', '*', 'cam', '@hero', 580, 1.35, 30],
			['019+60', 'hero', 'g', 'wave', 40],
		],
	}),
	// 020-021 as long as you want / by staying awake
	shot({
		at: '020',
		place: 'void',
		cam: [960, 560, 1.1],
		camEnd: [960, 520, 1.4],
		actors: {hero: hero(960, {seat: 810, face: 1})},
		props: [
			{k: 'hourglass', t: '020+4', x: 1260, y: 820, s: 1.8},
			{k: 'num', t: '020+30', x: 960, y: 300, a: {text: '∞', fs: 220, c: '#8fd0ff'}},
			{k: 'zzz', t: '021+20', end: '021+80', x: 1010, y: 640},
		],
		ev: [
			['020+0', 'hero', 'p', {lean: -10, head: -10, armF: [60, 60], armB: [-10, 40], legF: [88, 85], legB: [92, 90]}, 80],
			['021+0', 'hero', 'expr', 'sleepy'],
			['021+40', 'hero', 'expr', 'wide'],
			['021+40', 'hero', 'g', 'fist', 40],
			['021+44', '*', 'fx', 'excl', 960, 420],
		],
	}),
	// 022 homework before the bell
	shot({
		at: '022',
		place: 'classroom',
		pa: {stop: true},
		frozen: true,
		cam: [1170, 600, 1.3],
		camEnd: [1230, 590, 1.7],
		actors: {hero: hero(1270, {seat: 801, s: 0.94, face: -1}), c1: P('c1', 1035, {seat: 801, s: 0.94, frozen: true, face: -1, pose: FZ.sit})},
		under: (c: any) => <ClassKids c={c} o={{hide: [3, 4], deskOnly: [3, 4]}} />,
		props: [
			{k: 'pen', t: '022', hand: ['hero', 50, -150], s: 1},
			{k: 'books', t: '022+10', x: 1160, y: 700, a: {n: 5}, s: 0.7, z: 'back'},
			{k: 'num', t: '022+40', x: 1270, y: 380, a: {text: 'DONE', fs: 90, c: '#7fe08a'}},
		],
		ev: [
			['022+0', 'hero', 'p', {lean: 18, head: 14, armF: [30, 40], armB: [10, 70], legF: [88, 85], legB: [92, 90]}, 200],
			['022+50', '*', 'fx', 'spark', 1270, 700],
		],
	}),
	// 023 instrument in a weekend
	shot({
		at: '023',
		place: 'bedroom',
		cam: [900, 560, 1.2],
		camEnd: [980, 560, 1.6],
		actors: {hero: hero(930, {seat: 810, face: 1})},
		props: [
			{k: 'guitar', t: '023', x: 980, y: 800, s: 1.1, rot: -10},
			{k: 'cal', t: '023+20', x: 1380, y: 640, a: {label: 'WEEKEND', rate: 5}, s: 1.1, z: 'back'},
		],
		ev: [
			['023+0', 'hero', 'p', {lean: 10, head: 8, armF: [70, 70], armB: [60, 80], legF: [88, 85], legB: [92, 90]}, 400],
			['023+30', '*', 'fx', 'spark', 980, 650],
		],
	}),
	// 024-025 live a year, friends live a month
	shot({
		at: '024',
		place: 'void',
		cam: [960, 560, 1.0],
		camEnd: [960, 540, 1.1],
		actors: {hero: hero(560, {face: 1}), nikhil: P('nikhil', 1380, {face: -1, frozen: false, s: 0.95})},
		props: [
			{k: 'cal', t: '024+10', x: 560, y: 380, a: {label: 'YOU: DAY', rate: 2}, s: 1.3},
			{k: 'cal', t: '025+0', x: 1380, y: 380, a: {label: 'FRIEND: DAY', rate: 36}, s: 1.3},
		],
		ev: [
			['024+0', 'hero', 'g', 'presentF', 60],
			['025+0', 'nikhil', 'g', 'shrug', 50],
			['025+20', '*', 'fx', 'ques', 1380, 250],
		],
	}),
	// 026-027 hold the world longer than a body can stay awake
	shot({
		at: '026',
		place: 'void',
		pa: {c: ['#2a0c14', '#6a1a2a']},
		cam: [960, 600, 1.2],
		camEnd: [960, 560, 1.7],
		actors: {hero: hero(960, {expr: 'sleepy', face: 1})},
		custom: (c: any) => <BigClock f={c.f} stopAt={c.T('026+40')} x={960} y={330} r={160} c="#ff8a8a" />,
		props: [{k: 'zzz', t: '027+0', x: 1020, y: 560}],
		ev: [
			['026+10', 'hero', 'g', 'facepalm', 60],
			['026+50', '*', 'pulse', 160],
			['027+10', 'hero', 'p', {lean: 12, head: 22, armF: [10, 20], armB: [-10, 20], legF: [4, 2], legB: [-3, 2]}, 80],
		],
	}),
	// 028-029 stickers + suspicious teacher
	shot({
		at: '028',
		place: 'classroom',
		cam: [800, 580, 1.2],
		camEnd: [620, 560, 1.6],
		actors: {hero: hero(900, {face: -1, expr: 'normal'}), teacher: P('teacher', 330, {face: 1, s: 1.04, expr: 'angry', life: 1})},
		props: [{k: 'stickers', t: '028', hand: ['hero', 40, -96], s: 0.9}, {k: 'num', t: '028+10', x: 900, y: 330, a: {text: '28 ★', fs: 100}}],
		ev: [
			['028+4', 'hero', 'g', 'presentF', 60],
			['029+0', 'teacher', 'g', 'armsCrossed', 100],
			['029+10', 'teacher', 'look', 0.9, 0],
			['029+20', '*', 'fx', 'ques', 330, 300],
			['029+30', 'hero', 'g', 'scratch', 50],
		],
	}),
];

export const C: any[] = [
	card('030', '', 'THE FOUR RULES', 'there are four rules'),
	// 031 R1
	shot({
		at: '031',
		place: 'void',
		cam: [960, 560, 1.0],
		camEnd: [900, 540, 1.3],
		actors: {hero: hero(1180, {face: -1}), nikhil: P('nikhil', 700, {frozen: true, pose: FZ.jump, lift: 120, s: 0.95, face: 1})},
		props: [{k: 'num', t: '031+4', x: 960, y: 200, a: {text: 'RULE 1', fs: 100, c: '#ffd23a'}}],
		ev: [['031+10', 'hero', 'g', 'wave', 60], ['031+20', '*', 'fx', 'spark', 700, 520]],
	}),
	// 032 R2 touch -> wakes
	shot({
		at: '032',
		place: 'kitchen',
		cam: [960, 560, 1.1],
		camEnd: [1000, 560, 1.5],
		actors: {hero: hero(700, {face: 1})},
		props: [
			{k: 'num', t: '032+4', x: 960, y: 200, a: {text: 'RULE 2', fs: 100, c: '#ffd23a'}},
			{k: 'sandwich', t: '033+30', hand: ['hero', 52, -118], s: 1.5},
			{k: 'pen', t: '033+80', hand: ['hero', 52, -118], s: 1.2},
		],
		ev: [
			['032+20', 'hero', 'walk', 900, 40],
			['032+60', 'hero', 'g', 'presentF', 60],
			['033+10', '*', 'fx', 'spark', 960, 600],
			['033+60', 'hero', 'g', 'touchFace', 30],
		],
	}),
	// 033 open doors, eat sandwich, write with a pen
	shot({
		at: '033',
		place: 'void',
		cam: [900, 560, 1.1],
		camEnd: [1100, 560, 1.4],
		actors: {hero: hero(560, {face: 1})},
		props: [
			{k: 'door', t: '033+0', end: '033+44', x: 1200, y: 900, s: 1.1, z: 'back'},
			{k: 'sandwich', t: '033+44', end: '033+90', hand: ['hero', 52, -118], s: 1.4},
			{k: 'note', t: '033+90', x: 1200, y: 640, a: {text: 'I can write!', fs: 40}, s: 1.1},
		],
		ev: [
			['033+0', 'hero', 'walk', 1000, 40],
			['033+30', '*', 'fx', 'smoke', 1200, 800],
			['033+44', 'hero', 'g', 'touchFace', 30],
			['033+60', '*', 'fx', 'spark', 700, 560],
		],
	}),
	// 034-035 touched people wake and age with you
	shot({
		at: '034',
		place: 'void',
		cam: [960, 560, 1.0],
		camEnd: [960, 540, 1.3],
		actors: {hero: hero(740, {face: 1}), nikhil: P('nikhil', 1180, {face: -1, frozen: true, pose: FZ.cheer, s: 0.95})},
		props: [{k: 'num', t: '035+0', x: 1180, y: 330, a: {text: '+AGE', fs: 80, c: '#8fd0ff'}}],
		ev: [
			['034+10', 'hero', 'walk', 1030, 40],
			['034+50', 'hero', 'reach', 1130, 600, 60],
			['034+54', '*', 'fx', 'spark', 1180, 620],
			['035+20', 'nikhil', 'g', 'scratch', 50],
		],
	}),
	// 036-037 world restarts when you sleep, body keeps going
	shot({
		at: '036',
		place: 'bedroom',
		frozen: true,
		cam: [960, 560, 1.1],
		camEnd: [980, 540, 1.5],
		actors: {hero: hero(900, {seat: 810, expr: 'sleepy'})},
		props: [{k: 'zzz', t: '036+20', x: 940, y: 620}],
		ev: [
			['036+30', 'hero', 'p', {lean: 14, head: 26, armF: [20, 20], armB: [-10, 20], legF: [88, 85], legB: [92, 90]}, 80],
			['036+54', '*', 'flash'],
			['037+4', '*', 'fx', 'impact', 960, 360, 'RESTART'],
		],
	}),
	// 038 one hour = one hour of life
	shot({
		at: '038',
		place: 'void',
		pa: {clock: true},
		cam: [960, 560, 1.0],
		camEnd: [960, 520, 1.25],
		actors: {hero: hero(960, {face: 1})},
		props: [{k: 'hourglass', t: '038+10', x: 1500, y: 760, s: 1.7}, {k: 'num', t: '038+30', x: 960, y: 220, a: {text: '1 HOUR = 1 HOUR', fs: 84, c: '#ffd23a'}}],
		ev: [['038+10', 'hero', 'g', 'think', 80], ['038+60', '*', 'fx', 'bulb', 960, 340]],
	}),
];

export const D: any[] = [
	// 039 physicists
	shot({
		at: '039',
		place: 'classroom',
		pa: {board: 'E = m c²', board2: 'light stops?'},
		cam: [500, 560, 1.3],
		camEnd: [600, 540, 1.7],
		actors: {prof: P('prof', 560, {face: -1, s: 1.04, expr: 'normal', life: 1}), hero: hero(1000, {face: -1})},
		ev: [
			['039+0', 'prof', 'say', 90],
			['039+12', 'prof', 'g', 'think', 60],
			['039+60', 'prof', 'g', 'point', 60],
			['039+40', 'hero', 'g', 'shrug', 60],
		],
	}),
	// 040 light would stop too, you'd see nothing
	shot({
		at: '040',
		place: 'black',
		cam: [960, 560, 1.0],
		camEnd: [960, 560, 1.2],
		actors: {hero: hero(960, {expr: 'worried', over: {rimW: 0}})},
		props: [{k: 'num', t: '040+20', x: 960, y: 300, a: {text: 'NOTHING', fs: 100, c: '#ffffff'}}],
		ev: [['040+30', 'hero', 'g', 'handsOnHead', 80], ['040+60', '*', 'fx', 'ques', 960, 380]],
	}),
	// 041 your power doesn't care
	shot({
		at: '041',
		place: 'void',
		pa: {c: ['#1a2f6a', '#3a60c0']},
		cam: [960, 580, 1.2],
		camEnd: [960, 560, 1.6],
		actors: {hero: hero(960, {face: 1, expr: 'normal'})},
		ev: [['041+6', 'hero', 'g', 'fist', 40], ['041+14', '*', 'fx', 'impact', 960, 360, 'NOPE'], ['041+14', '*', 'flash']],
	}),
	// 042-043 everyone says they need more time / you get it
	shot({
		at: '042',
		place: 'cafeteria',
		cam: [960, 560, 1.1],
		camEnd: [1100, 560, 1.45],
		actors: {
			c3: P('c3', 600, {face: 1, expr: 'worried'}),
			c5: P('c5', 1400, {face: -1, expr: 'sad'}),
			hero: hero(1000, {face: -1}),
		},
		props: [
			{k: 'bubble', t: '042+10', x: 600, y: 430, a: {text: 'No time!', w: 110, h: 44, fs: 36}, s: 0.9},
			{k: 'bubble', t: '042+30', x: 1400, y: 430, a: {text: 'More time!', w: 120, h: 44, fs: 34}, s: 0.9},
			{k: 'hourglass', t: '043+0', x: 1000, y: 560, s: 1.2},
		],
		ev: [
			['042+10', 'c3', 'g', 'handsOnHead', 60],
			['042+30', 'c5', 'g', 'facepalm', 60],
			['043+0', 'hero', 'g', 'presentF', 60],
			['043+20', '*', 'fx', 'spark', 1000, 560],
		],
	}),
	// 044 pay with your body
	shot({
		at: '044',
		place: 'void',
		pa: {c: ['#2a0c14', '#5a1a2a']},
		cam: [960, 560, 1.1],
		camEnd: [960, 540, 1.5],
		actors: {hero: hero(960, {face: 1, expr: 'worried'})},
		props: [{k: 'coin', t: '044+0', x: 960, y: 300}] as any,
		ev: [['044+10', 'hero', 'g', 'rubChin', 60], ['044+40', '*', 'fx', 'text', 960, 300, 'PAY UP'], ['044+40', '*', 'pulse', 90]],
	}),
];
