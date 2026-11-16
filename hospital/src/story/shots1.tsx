import React from 'react';
import {Layer, Svg} from '../engine/camera';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Lobby, LobbyFront, Office, OfficeChair, OfficeFront, HospitalExt, Ward, Beam} from './places';
import {ActorSpec, Beat, nurses, shot} from './dsl';
import {CardBg, ScannerScreen, VsPanel} from './cards';
import type {ShotDef} from '../kit/coverage';

export const FL = 900;
export const hero = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'hero', who: 'hero', x, beats, ...o});
export const bg = (...n: React.ReactNode[]) => <>{n}</>;

/* ---------- 001–005: cold open ---------- */
const arrive = (i: number): Beat => ({at: '001', off: 4 + i * 16, len: 100, walk: [-260 - i * 40, 700 + i * 70], speed: 0.32});

export const SHOTS1: ShotDef[] = [
	// 001 — hospital at night, nurses stream in, 41
	shot('001', {
		bg: '#070b22',
		cam: [
			[960, 600, 1.0],
			[960, 560, 1.28],
		],
		back: ({f}) => <HospitalExt f={f} />,
		actors: [0, 1, 2, 3, 4, 5].map((i) => ({id: 'a' + i, who: 'nurse', x: -260 - i * 40, s: 0.62, floor: 905 + (i % 2) * 8, beats: [arrive(i), {at: '001', off: 2 + i * 16, len: 90, hide: false}], props: {hair: (['short', 'bun', 'ponytail', 'bob', 'cap', 'spiky'] as const)[i]}})),
		hud: ({f, at}) => <Accent text="41 NIGHT NURSES ON PAYROLL" t={f - at('001') - 40} dur={110} y={900} />,
	}),
	// 002a — the scanner says 42
	shot('002', {
		bg: '#04090d',
		cam: [
			[960, 540, 1.0],
			[900, 520, 1.12],
		],
		back: () => (
			<Layer depth={1}>
				<Svg>
					<CardBg c="#05080f" />
				</Svg>
			</Layer>
		),
		world: ({f, at}) => {
			const t = at('002');
			return (
				<ScannerScreen
					f={f}
					s={1.4}
					rows={[
						{t: t + 20, a: '23:55  BADGE #0412', b: 'OK'},
						{t: t + 50, a: '23:57  BADGE #0377', b: 'OK'},
						{t: t + 80, a: '23:58  BADGE #0291', b: 'OK'},
						{t: t + 120, a: '00:00  — — — — —', b: 'EXTRA', warn: true},
					]}
					count={{t: t + 138, v: 42}}
				/>
			);
		},
		flashes: [],
		shake: [{at: '002', off: 140, len: 10}],
	}),
	// 002b — I was the auditor sent to find the extra one
	shot(
		'002',
		{
			bg: '#070b22',
			cam: [
				[820, 600, 1.35],
				[1000, 590, 1.1],
			],
			back: ({f}) => <HospitalExt f={f} />,
			actors: [
				hero(-200, [
					{at: '002', off: 150, len: 110, walk: [-200, 760]},
					{at: '002', off: 200, len: 60, g: 'presentF'},
				], {item: 'clip', badge: true}),
			],
			world: ({f, at, pos}) => <Callout f={f} t0={at('002') + 200} t1={at('002') + 250} from={[pos.hero.x, pos.hero.headY - 30]} to={[pos.hero.x + 330, pos.hero.headY - 200]} text="THE AUDITOR" />,
		},
		{off: 148},
	),
	// 003 — by 3 a.m. I had found her
	shot(
		'003',
		{
			bg: '#02040e',
			cam: [
				[760, 590, 1.25],
				[1060, 560, 1.7],
			],
			back: ({f}) => <Ward f={f} dark={0.55} flicker={1} />,
			actors: [
				hero(160, [
					{at: '003', off: 0, len: 70, walk: [160, 740], speed: 0.3},
					{at: '003', off: 70, len: 40, g: 'stop'},
					{at: '003', off: 70, len: 60, expr: 'wide'},
				], {item: 'flash'}),
				{id: 'ghost', who: 'ghost', x: 1560, face: -1, hidden: true, still: true, beats: [{at: '003', off: 62, len: 999, hide: false}], props: {rimW: 3.4}},
			],
			world: ({f, at, pos}) => <Beam x={pos.hero.x + 60} y={pos.hero.headY + 150} angle={-2} len={900} w={260} o={0.55} />,
			shake: [{at: '003', off: 62, len: 8}],
		},
		{whip: true},
	),
	// 004 — and she knew my name
	shot('004', {
		bg: '#02040e',
		cam: [
			[900, 570, 2.1],
			[960, 560, 2.5],
		],
		back: ({f}) => <Ward f={f} dark={0.6} flicker={1} />,
		actors: [
			hero(900, [{at: '004', len: 100, expr: 'wide'}, {at: '004', off: 20, len: 90, sway: 2.4}, {at: '004', off: 40, len: 50, g: 'handsOnHead'}], {face: 1, props: {color: '#e6a81a'}}),
			{id: 'ghost', who: 'ghost', x: 1560, face: -1, still: true},
		],
		hud: ({f, at}) => <Accent text="SHE KNEW MY NAME" t={f - at('004') - 8} dur={70} y={880} c="#ff6a6a" />,
		shake: [{at: '004', off: 30, len: 12}],
	}),
	// 005 — but I should start at the beginning
	shot('005', {
		bg: '#0a0e22',
		cam: [
			[960, 600, 1.3],
			[960, 570, 1.65],
		],
		back: ({f}) => (
			<>
				<Office f={f} />
				<OfficeChair />
			</>
		),
		front: ({f}) => <OfficeFront f={f} />,
		actors: [hero(520, [{at: '005', off: 0, len: 60, g: 'presentF'}, {at: '005', off: 70, len: 40, g: 'shrug'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('005') + 4} to={at('005') + 80} top={190} lines={['A FEW HOURS EARLIER']} size={64} />,
	}, {whip: true}),
];
