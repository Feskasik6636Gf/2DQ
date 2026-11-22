import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag} from './helpers';

/* 001–019: the barbecue and the steak */
export const S1 = [
	scene({
		at: '001', loc: 'courtyard',
		cast: [hero(1180, {face: -1, ex: [['wide', '002', '003']]})],
		animals: [{an: 'bulldog', x: 640, pose: 'sit', talk: [['001+50', '003']], face: 1, say: [['002+4', '002+52', 'Blue cushion!']]}],
		fx: [{k: 'exclaim', t: '002+4', at: 'hero'}],
		subj: [['001', 'bulldog'], ['002+30', 'hero']],
	}),
	scene({
		at: '003', loc: 'courtyard',
		cast: [hero(1000, {acts: [['presentF', '003', '003+40']]}), ppl('peterson', 400, {mv: [['003', '003+50', 560]]}), ppl('mrsp', 1500, {mv: [['003', '003+60', 1380]]})],
		animals: [{an: 'bulldog', x: 800, pose: 'sit', face: 1}],
		crowd: [{n: 8, x0: -100, x1: 1900, s: 0.8, mode: 'stand', seed: 'bbq'}],
		props: [{k: 'plate', x: 520, y: 770, t0: '003+10', s: 1.2}, {k: 'plate', x: 1480, y: 790, t0: '003+20', s: 1.2}],
		fx: [{k: 'accent', t: '003+8', t1: '003e', text: '14 NEIGHBORS', sub: 'paper plates in every hand', y: 850}],
		subj: [['003', 'hero'], ['003+50', 'peterson']],
	}),
	scene({
		at: '004', loc: 'courtyard', whip: true,
		cast: [hero(760, {face: 1}), ppl('marisol', 2100, {mv: [['004', '004+36', 1130]], acts: [['point', '004+40', '005+10']]})],
		props: [{k: 'leash', x: 1150, y: 700, t0: '004+34', s: 1.6, spin: 0}],
		fx: [{k: 'accent', t: '004+30', t1: '005+30', text: 'BET: 1 WEEK OF DOG WALKING'}],
		subj: [['004', 'marisol'], ['005', 'hero']],
	}),
	scene({
		at: '005', loc: 'courtyard',
		cast: [hero(820, {acts: [['shrug', '005+14', '005+40'], ['scratch', '006', '006+30']]}), ppl('marisol', 1160, {acts: [['armsCrossed', '005', '005e']]})],
		fx: [{k: 'question', t: '005+10', at: 'hero'}],
		props: [{k: 'plate', x: 1000, y: 800, s: 1.3}],
		subj: [['005', 'marisol'], ['005+30', 'hero']],
	}),
	scene({
		at: '006', loc: 'courtyardNoCouch',
		cast: [ppl('peterson', 620, {face: 1, acts: [['shrug', '006', '006+40']]}), ppl('mrsp', 1000, {face: -1, acts: [['point', '006+10', '006+50']]}), hero(1450, {face: -1})],
		props: [{k: 'plate', x: 800, y: 790, s: 1.6}, {k: 'steak', x: 800, y: 780, s: 1.4, t0: 0, t1: '006+20'}],
		fx: [{k: 'question', t: '006+25', at: 'mrsp'}],
		front: ({f, tf}) => <Wind f={f} t0={tf('007')} t1={tf('007e')} />,
		subj: [['006', 'peterson'], ['007', 'mrsp']],
	}),
	scene({
		at: '008', loc: 'courtyard',
		cast: [hero(1000, {face: -1})],
		animals: [{an: 'bulldog', x: 560, pose: 'sit', talk: [['008+20', '009e']], say: [['008+36', '009+8', 'Left side!'], ['009+10', '009e', 'Under, under, under!']], hop: [['009+10', '009+40']], face: 1}],
		subj: [['008', 'bulldog'], ['009+10', 'hero']],
	}),
	scene({
		at: '010', loc: 'courtyard',
		cast: [hero(300, {mv: [['010', '011+6', 1370, 'run']], hold: []})],
		animals: [{an: 'bulldog', x: 120, mv: [['010', '011+6', 1230, 'run']], wag: 2}],
		props: [{k: 'cushion', x: 1520, y: 780, s: 1.0, mv: [['011+20', '011+52', 1540, 600]], rot: 0}],
		crowd: [{n: 7, x0: 100, x1: 1800, s: 0.8, mode: 'stand', seed: 'bbq'}],
		fx: [{k: 'speed', t: '010', t1: '010+30', at: 'hero'}],
		subj: [['010', 'hero'], ['011', 'hero']],
		cam: [['010', 700, 1.1, 640], ['010+40', 1000, 1.25, 640], ['011', 1350, 1.8, 620], ['011e', 1420, 2.1, 640]],
	}),
	scene({
		at: '012', loc: 'courtyard',
		cast: [hero(1330, {acts: [['cheer', '012+4', '012+40']], face: 1})],
		animals: [{an: 'bulldog', x: 1180, pose: 'sit', hop: [['012', '012+30']]}],
		props: [{k: 'cushion', x: 1620, y: 640, rot: -40, s: 1}, {k: 'napkin', x: 1520, y: 790, t0: '012', s: 1.4}],
		fx: [{k: 'sparkle', t: '012+4', at: [1520, 700]}, {k: 'impact', t: '012+8', at: [1520, 520], text: 'FOUND!', s: 0.6}],
		subj: [['012', 'hero']],
	}),
	scene({
		at: '013', loc: 'courtyard',
		cast: [ppl('peterson', 560), ppl('mrsp', 940), hero(1500, {face: -1})],
		crowd: [{n: 9, x0: -200, x1: 1900, s: 0.85, mode: 'stand', seed: 'bbq2'}],
		fx: [{k: 'accent', t: '013', t1: '013e', text: '14 NEIGHBORS STOP CHEWING'}, {k: 'shock', t: '013+6'}],
		props: [{k: 'plate', x: 700, y: 800, s: 1.2}],
		subj: [['013', 'peterson'], ['014', 'mrsp']],
	}),
	scene({
		at: '014', loc: 'courtyard',
		cast: [ppl('peterson', 760, {skin: ['#f3efd2', '015'], ex: [['worried', '015', '017']], acts: [['handsOnHead', '015+16', '016+30']]}), ppl('mrsp', 1150, {face: -1, acts: [['armsCrossed', '017', '017e']]}), hero(1560, {face: -1})],
		animals: [{an: 'bulldog', x: 520, pose: 'sit', face: 1, sad: ['015', '017']}],
		props: [{k: 'jar', x: 930, y: 640, c: '#f6f1d8', t0: '015+10', t1: '016+10', s: 1.0, text: 'mayo'}],
		fx: [{k: 'impact', t: '015+10', at: [760, 400], text: 'GULP', s: 0.5}],
		subj: [['014', 'peterson'], ['016', 'peterson'], ['017', 'mrsp']],
	}),
	scene({
		at: '018', loc: 'courtyard',
		cast: [hero(1100, {face: -1, acts: [['wave', '019', '019+30']], ex: [['wide', '018', '019+30']]})],
		animals: [{an: 'bulldog', x: 640, pose: 'sit', face: 1, talk: [['018+60', '019']], tilt: [['018+30', '019+20', -10]]}],
		fx: [{k: 'sparkle', t: '019+4', at: [700, 560]}, {k: 'impact', t: '019+4', at: [700, 400], text: 'WINK!', s: 0.5}],
		subj: [['018', 'bulldog'], ['019', 'hero']],
	}),
];
