import React from 'react';
import {Layer, Svg} from '../engine/camera';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Lobby, LobbyFront, Office, OfficeChair, OfficeFront} from './places';
import {Beat, shot} from './dsl';
import {CardBg, VsPanel} from './cards';
import type {ShotDef} from '../kit/coverage';
import {hero} from './shots1';

const gray = {color: '#6b7a99', hair: 'bob' as const};
const OfficeBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Office f={f} />
		<OfficeChair />
	</>
);

export const SHOTS2: ShotDef[] = [
	// 006 — My name is Marcus Hale, I audit hospitals
	shot('006', {
		bg: '#0a0e22',
		cam: [
			[820, 590, 1.5],
			[940, 560, 1.2],
		],
		back: ({f}) => <OfficeBack f={f} />,
		front: ({f}) => <OfficeFront f={f} />,
		actors: [
			hero(560, [
				{at: '006', off: 0, len: 190, reach: [880, 672], side: 'F'},
				{at: '006', off: 50, len: 30, head: 6},
				{at: '006', off: 100, len: 40, head: -8},
				{at: '006', off: 0, len: 200, look: [0.9, 0]},
			], {sit: 790, face: 1}),
		],
		world: ({f, at}) => {
			const t = at('006');
			return (
				<>
					<Callout f={f} t0={t + 100} t1={t + 175} from={[900, 560]} to={[1000, 340]} text="BILLING ERRORS" />
					<Callout f={f} t0={t + 132} t1={t + 190} from={[1150, 560]} to={[1230, 230]} text="STAFFING RECORDS" />
					<Callout f={f} t0={t + 166} t1={t + 200} from={[1300, 640]} to={[1330, 430]} text="MISSING MEDICATION" />
				</>
			);
		},
	}),
	// 007 — quiet work, spreadsheets and bad coffee
	shot('007', {
		bg: '#0a0e22',
		cam: [
			[640, 600, 2.0],
			[760, 590, 1.55],
		],
		back: ({f}) => <OfficeBack f={f} />,
		front: ({f}) => <OfficeFront f={f} />,
		actors: [
			hero(560, [
				{at: '007', off: 0, len: 50, reach: [880, 672], side: 'B'},
				{at: '007', off: 55, len: 45, reach: [660, 650], side: 'F'},
				{at: '007', off: 55, len: 45, expr: 'sleepy'},
				{at: '007', off: 100, len: 40, mouth: 'frown', expr: 'worried'},
				{at: '007', off: 55, len: 40, head: -8},
			], {sit: 790, face: 1, item: 'cup'}),
		],
		world: ({f, at}) => <Callout f={f} t0={at('007') + 62} t1={at('007') + 90} from={[700, 700]} to={[560, 380]} text="BAD COFFEE" />,
	}),
	// 008 — St. Brendan's had flagged something strange
	shot('008', {
		bg: '#0a0e22',
		cam: [
			[900, 590, 1.4],
			[1050, 560, 1.75],
		],
		back: ({f}) => <OfficeBack f={f} />,
		front: ({f}) => <OfficeFront f={f} />,
		actors: [
			hero(560, [
				{at: '008', off: 0, len: 90, reach: [880, 672], side: 'F'},
				{at: '008', off: 28, len: 70, lean: 14},
				{at: '008', off: 28, len: 70, expr: 'wide'},
				{at: '008', off: 40, len: 50, look: [0.9, -0.3]},
			], {sit: 790, face: 1}),
		],
		world: ({f, at}) => <Callout f={f} t0={at('008') + 24} t1={at('008') + 85} from={[1030, 560]} to={[1130, 330]} text="FLAGGED: ST. BRENDAN'S" c="#ff6a6a" />,
		shake: [{at: '008', off: 26, len: 6}],
	}),
	// 009–010 — payroll 41 vs scanner 42
	shot('009', {
		bg: '#070b1c',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.25],
		],
		back: () => (
			<Layer depth={1}>
				<Svg>
					<CardBg c="#070b1c" />
				</Svg>
			</Layer>
		),
		world: ({f, at}) => <VsPanel f={f} t0={at('009') + 8} t1={at('010') + 36} a={['PAYROLL SAYS', '41']} b={['SECURITY SAYS', '42']} />,
		shake: [{at: '010', off: 36, len: 8}],
	}),
	// 011 — nobody could explain it, nobody wanted to
	shot('011', {
		bg: '#0a0e22',
		cam: [
			[960, 590, 1.2],
			[1180, 580, 1.45],
		],
		back: ({f}) => <Office f={f} />,
		actors: [
			hero(760, [
				{at: '011', off: 0, len: 40, g: 'shrug'},
				{at: '011', off: 0, len: 70, expr: 'worried'},
				{at: '011', off: 50, len: 40, g: 'scratch'},
			], {face: 1}),
			{id: 'c1', who: 'nurse', x: 1150, face: 1, props: gray, beats: [{at: '011', off: 40, len: 80, walk: [1150, 2150], speed: 0.3}]},
			{id: 'c2', who: 'nurse', x: 1400, face: 1, props: {...gray, color: '#7a6b99', hair: 'short'}, beats: [{at: '011', off: 62, len: 80, walk: [1400, 2200], speed: 0.3}]},
		],
		hud: ({f, at}) => <Accent text="NOBODY WANTED TO" t={f - at('011') - 52} dur={50} y={880} />,
	}, {whip: false}),
	// 012a — front desk, 11 p.m.
	shot('012', {
		bg: '#0a1522',
		cam: [
			[860, 600, 1.15],
			[1000, 590, 1.45],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(-220, [
				{at: '012', off: 40, len: 90, walk: [-220, 700]},
				{at: '012', off: 150, len: 60, g: 'wave'},
			], {item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1130, face: -1, beats: [{at: '012', off: 20, len: 120, g: 'armsCrossed'}, {at: '012', off: 20, len: 200, mouth: 'frown', expr: 'sleepy', look: [-0.8, 0.2]}]},
		],
		hud: ({f, at}) => <Accent text="11 P.M." t={f - at('012') - 84} dur={46} y={190} />,
	}, {whip: true}),
	// 012b — a tired woman, coat already on
	shot(
		'012',
		{
			bg: '#0a1522',
			cam: [
				[1100, 585, 2.1],
				[1180, 575, 2.4],
			],
			back: ({f}) => <Lobby f={f} />,
			actors: [
				hero(560, [{at: '012', off: 130, len: 150, expr: 'worried'}], {item: 'clip'}),
				{id: 'admin', who: 'admin', x: 1130, face: -1, beats: [{at: '012', off: 120, len: 40, g: 'scratch'}, {at: '012', off: 175, len: 90, look: [0.9, 0], expr: 'sleepy'}, {at: '012', off: 205, len: 60, mouth: 'frown'}]},
			],
			world: ({f, at}) => <Callout f={f} t0={at('012') + 165} t1={at('012') + 270} from={[1060, 700]} to={[820, 400]} text="COAT ALREADY ON" />,
		},
		{off: 118},
	),
	// 013 — badge and keys
	shot('013', {
		bg: '#0a1522',
		cam: [
			[960, 640, 1.8],
			[900, 700, 2.1],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(760, [{at: '013', off: 36, len: 80, reach: [950, 780], side: 'F'}, {at: '013', off: 36, len: 90, mouth: 'smile'}], {face: 1, item: undefined}),
			{id: 'admin', who: 'admin', x: 1140, face: -1, item: 'badge', beats: [{at: '013', off: 6, len: 90, reach: [950, 780], side: 'F'}]},
		],
		world: ({f, at}) => <Callout f={f} t0={at('013') + 40} t1={at('013') + 80} from={[960, 770]} to={[1130, 480]} text="VISITOR BADGE + KEYS" />,
	}),
	// 014 — walk the floors
	shot('014', {
		bg: '#0a1522',
		cam: [
			[1000, 590, 1.6],
			[1080, 580, 1.9],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(780, [{at: '014', off: 10, len: 60, g: 'touchFace'}], {face: 1, item: 'badge'}),
			{id: 'admin', who: 'admin', x: 1160, face: -1, beats: [{at: '014', off: 14, len: 50, g: 'point'}, {at: '014', off: 14, len: 60, look: [-1, -0.1]}, {at: '014', off: 14, len: 60, expr: 'sleepy'}]},
		],
		hud: ({f, at}) => <Accent text="WALK THE FLOORS" t={f - at('014') - 12} dur={50} y={880} />,
	}),
	// 015 — count the staff, check every badge
	shot('015', {
		bg: '#0a1522',
		cam: [
			[960, 600, 1.3],
			[900, 590, 1.7],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(760, [{at: '015', off: 0, len: 150, reach: [840, 700], side: 'B'}, {at: '015', off: 60, len: 90, head: -6}], {face: 1, item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1160, face: -1, beats: [{at: '015', off: 0, len: 36, g: 'presentF'}, {at: '015', off: 40, len: 60, g: 'point'}]},
		],
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('015') + 4} t1={at('015') + 50} from={[1030, 560]} to={[1230, 360]} text="COUNT THE STAFF" />
				<Callout f={f} t0={at('015') + 38} t1={at('015') + 110} from={[850, 640]} to={[640, 330]} text="CHECK EVERY BADGE" />
			</>
		),
	}),
	// 016 — where are you going? Home.
	shot('016', {
		bg: '#0a1522',
		cam: [
			[1000, 590, 1.3],
			[1300, 585, 1.5],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(760, [{at: '016', off: 0, len: 50, g: 'shrug'}, {at: '016', off: 0, len: 50, expr: 'worried'}], {face: 1, item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1150, face: 1, beats: [{at: '016', off: 55, len: 70, walk: [1150, 1330], speed: 0.28}]},
		],
		hud: ({f, at}) => <Accent text="HOME" t={f - at('016') - 52} dur={36} y={880} />,
	}),
	// 017 — I don't work nights here anymore
	shot('017', {
		bg: '#0a1522',
		cam: [
			[1260, 590, 1.7],
			[1420, 585, 1.95],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(760, [{at: '017', off: 0, len: 50, look: [0.9, 0]}], {face: 1, item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1330, face: 1, beats: [{at: '017', off: 0, len: 60, walk: [1330, 1500], speed: 0.28}, {at: '017', off: 30, len: 60, g: 'shrug'}]},
		],
		hud: ({f, at}) => <Accent text="NOT ANYMORE" t={f - at('017') - 6} dur={50} y={880} c="#ff9a6a" />,
	}),
	// 018 — she paused at the door and added one more thing
	shot('018', {
		bg: '#0a1522',
		cam: [
			[1380, 590, 1.55],
			[1520, 580, 2.0],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(760, [{at: '018', off: 0, len: 150, look: [0.9, 0]}, {at: '018', off: 60, len: 60, g: 'rubChin'}], {face: 1, item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1500, face: 1, still: true, beats: [{at: '018', off: 30, len: 140, expr: 'worried'}, {at: '018', off: 90, len: 70, g: 'stop'}]},
		],
		shake: [{at: '018', off: 26, len: 5}],
	}),
	// 019 — don't ask her name
	shot('019', {
		bg: '#0a1522',
		cam: [
			[1500, 570, 2.3],
			[1540, 560, 2.8],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			{id: 'admin', who: 'admin', x: 1500, face: 1, still: true, beats: [{at: '019', off: 0, len: 100, expr: 'worried', look: [0.2, -0.1]}, {at: '019', off: 65, len: 40, turn: 0.1}]},
			hero(760, [{at: '019', off: 0, len: 100, look: [0.9, 0]}], {face: 1, item: 'clip'}),
		],
		hud: ({f, at}) => <Accent text="DON'T ASK HER NAME" t={f - at('019') - 62} dur={70} y={900} c="#ff6a6a" />,
		shake: [{at: '019', off: 84, len: 10}],
	}),
	// 020 — I laughed. She didn't.
	shot('020', {
		bg: '#0a1522',
		cam: [
			[900, 590, 1.5],
			[1250, 580, 1.25],
		],
		back: ({f}) => <Lobby f={f} />,
		actors: [
			hero(900, [
				{at: '020', off: 0, len: 36, mouth: 'open'},
				{at: '020', off: 0, len: 36, lean: -10},
				{at: '020', off: 0, len: 36, hop: 12},
				{at: '020', off: 36, len: 40, mouth: 'flat'},
				{at: '020', off: 40, len: 40, expr: 'worried'},
			], {face: 1, item: 'clip'}),
			{id: 'admin', who: 'admin', x: 1500, face: 1, beats: [{at: '020', off: 28, len: 80, walk: [1500, 1980], speed: 0.3}]},
		],
	}),
];
