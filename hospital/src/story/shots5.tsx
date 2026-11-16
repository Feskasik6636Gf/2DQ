import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Layer, Svg} from '../engine/camera';
import {Stickman} from '../engine/Stickman';
import {CAST} from './cast';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Pop} from '../kit/kit';
import {Room, Station, StationFront, Ward} from './places';
import {ActorSpec, Beat, shot} from './dsl';
import {clockMin} from './clock';
import {L} from '../kit/core';
import {CardBg, ChartSheet, VsPanel} from './cards';
import type {ShotDef} from '../kit/coverage';
import {hero} from './shots1';
import {everyone, staff} from './shots3';

const dennisAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'dennis', who: 'dennis', x, face: -1, beats, ...o});
const priyaAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'priya', who: 'priya', x, face: -1, beats, ...o});
const ghostAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'ghost', who: 'ghost', x, face: 1, still: true, beats, ...o});
const SB: React.FC<{f: number; gf: number; down?: boolean}> = ({f, gf, down}) => <Station f={f} minutes={clockMin(gf)} clockDown={down} />;
const SF: React.FC<{f: number}> = ({f}) => <StationFront f={f} cups={2} count={42} />;
const CardOnly = (c = '#0b1020') => () => (
	<Layer depth={1}>
		<Svg>
			<CardBg c={c} />
		</Svg>
	</Layer>
);
export const fmt = (m: number) => {
	const t = Math.floor(m) % 1440;
	const h = Math.floor(t / 60) % 12 || 12;
	const mm = String(t % 60).padStart(2, '0');
	return `${h}:${mm} ${t < 720 || t >= 1380 ? (t >= 1380 ? 'P.M.' : 'A.M.') : 'P.M.'}`;
};
export const ClockHud: React.FC<{gf: number; c?: string}> = ({gf, c = '#ffe08a'}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div style={{position: 'absolute', top: 52, right: 70, fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 64, color: c, WebkitTextStroke: '3px #0b0d1e', paintOrder: 'stroke', textShadow: '0 6px 20px rgba(0,0,0,.6)'}}>{fmt(clockMin(gf))}</div>
	</AbsoluteFill>
);

/* patient asleep in the bed of Room (head on the pillow) with a blanket drawn over the body */
export const PatientBed: React.FC<{f: number; bedX?: number; breathe?: number; dead?: boolean}> = ({f, bedX = 1180, breathe = 1, dead}) => {
	const lift = dead ? 0 : Math.sin(f / 14) * 3 * breathe;
	return (
		<g>
			<g transform={`translate(${bedX + 320},${648 - lift}) rotate(-84)`}>
				<Stickman id="pt" x={0} y={0} scale={0.85} pose={{lean: 0, head: 0, armB: [4, 10], armF: [6, 12], legB: [0, 0], legF: [3, 0]}} {...CAST.patient} expr={dead ? 'sleepy' : 'sleepy'} look={[0.3, 0.4]} faceTurn={0.2} />
			</g>
			<path d={`M${bedX + 130},${700 - lift} Q${bedX + 260},${610 - lift} ${bedX + 470},${660 - lift} L${bedX + 470},720 L${bedX + 130},720 Z`} fill="#bcd7ef" />
			<path d={`M${bedX + 150},${690 - lift} Q${bedX + 270},${640 - lift} ${bedX + 450},${676 - lift}`} stroke="#e4f0fb" strokeWidth={6} fill="none" strokeLinecap="round" />
		</g>
	);
};

export const SHOTS5: ShotDef[] = [
	// 104a — I ran down the corridor
	shot('104', {
		bg: '#04080e',
		cam: [
			[400, 590, 1.3],
			[1300, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.4} flicker={1} />,
		actors: [hero(-200, [{at: '104', off: 0, len: 100, run: [-200, 1800], speed: 0.65}], {face: 1, item: 'flash'})],
		shake: [{at: '104', off: 0, len: 100}],
	}),
	// 104b — Dennis already waiting, stone-faced
	shot(
		'104',
		{
			bg: '#0b1620',
			cam: [
				[700, 590, 1.3],
				[860, 585, 1.7],
			],
			back: ({f, gf}) => <SB f={f} gf={gf} />,
			front: ({f}) => <SF f={f} />,
			actors: [
				dennisAt(1100, [{at: '104', off: 110, len: 200, g: 'armsCrossed'}, {at: '104', off: 110, len: 200, mouth: 'flat', expr: 'angry'}], {s: 1}),
				hero(-200, [{at: '104', off: 108, len: 40, run: [-200, 520], speed: 0.6}, {at: '104', off: 150, len: 40, squash: 0.06}, {at: '104', off: 150, len: 80, expr: 'worried'}], {face: 1}),
			],
			hud: ({f, at}) => <Accent text="STONE-FACED STARE" t={f - at('104') - 140} dur={70} y={880} />,
		},
		{off: 108, whip: true},
	),
	// 105 — you asked her
	shot('105', {
		bg: '#0b1620',
		cam: [
			[900, 590, 1.9],
			[1000, 585, 2.2],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '105', off: 6, len: 50, g: 'point'}, {at: '105', off: 6, len: 50, expr: 'angry'}]), hero(520, [{at: '105', off: 0, len: 60, expr: 'worried'}, {at: '105', off: 10, len: 40, sway: 1.5}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('105') + 4} to={at('105') + 40} top={170} lines={['YOU ASKED HER.']} size={90} c="#ff8a6a" />,
	}),
	// 106 — I asked what she was charting
	shot('106', {
		bg: '#0b1620',
		cam: [
			[560, 590, 2.1],
			[520, 585, 2.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '106', off: 0, len: 50, g: 'shrug'}, {at: '106', off: 0, len: 50, expr: 'worried'}], {face: 1}), dennisAt(1100)],
	}),
	// 107 — he closed his eyes: that's almost as bad
	shot('107', {
		bg: '#0b1620',
		cam: [
			[1040, 590, 2.2],
			[1090, 585, 2.7],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '107', off: 0, len: 70, expr: 'sleepy'}, {at: '107', off: 20, len: 50, g: 'facepalm'}, {at: '107', off: 20, len: 50, over: true}], {s: 1.05})],
		hud: ({f, at}) => <Accent text="…ALMOST AS BAD" t={f - at('107') - 30} dur={50} y={880} c="#ff9a6a" />,
	}),
	// 108 — Priya crying silently
	shot('108', {
		bg: '#0b1620',
		cam: [
			[1280, 590, 2.4],
			[1290, 585, 3.0],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [priyaAt(1290, [{at: '108', off: 0, len: 100, expr: 'sad'}, {at: '108', off: 10, len: 80, g: 'touchFace'}, {at: '108', off: 10, len: 80, over: true}, {at: '108', off: 0, len: 100, sway: 0.8}], {s: 1.05})],
		world: ({f, pos}) => (
			<g>
				{[0, 1, 2].map((i) => {
					const u = ((f + i * 14) % 42) / 42;
					return <ellipse key={i} cx={pos.priya.x + 20 + i * 6} cy={pos.priya.headY + 30 + u * 150} rx={5} ry={8} fill="#9ad8ff" opacity={1 - u} />;
				})}
			</g>
		),
	}),
	// 109 — the other nurses gathered around the desk
	shot('109', {
		bg: '#0b1620',
		cam: [
			[900, 600, 1.1],
			[960, 590, 1.35],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: staff((a, i) => ({...a, hidden: true, beats: [{at: '109', off: i * 8, len: 1, hide: false}, {at: '109', off: i * 8, len: 70, walk: [i % 2 ? 2100 : -200, a.x], speed: 0.32}]})),
	}),
	// 110 — arms crossed, shoulders tense
	shot('110', {
		bg: '#0b1620',
		cam: [
			[640, 600, 1.8],
			[1400, 600, 1.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: staff(everyone([{at: '110', off: 6, len: 90, g: 'armsCrossed'}, {at: '110', off: 6, len: 90, sway: 0.6}, {at: '110', off: 6, len: 90, expr: 'angry', mouth: 'flat'}])),
		hud: ({f, at}) => <Accent text="SHOULDERS TENSE" t={f - at('110') - 8} dur={50} y={880} />,
	}),
	// 111 — someone had turned the clock face down
	shot('111', {
		bg: '#0b1620',
		cam: [
			[880, 330, 2.0],
			[860, 280, 2.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} down />,
		front: ({f}) => <SF f={f} />,
		actors: staff((a) => ({...a, still: true, beats: [{at: '111', off: 20, len: 90, look: [0, -0.8]}]})),
		world: ({f, at}) => <Callout f={f} t0={at('111') + 14} t1={at('111') + 80} from={[860, 250]} to={[620, 130]} text="FACE DOWN" c="#ff9a6a" />,
	}),
	// 112 — listen to me, Dennis said
	shot('112', {
		bg: '#0b1620',
		cam: [
			[1000, 590, 2.0],
			[1050, 585, 2.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '112', off: 0, len: 40, g: 'stop'}, {at: '112', off: 0, len: 50, expr: 'worried'}], {s: 1.05}), hero(520, [], {face: 1})],
		hud: ({f, at}) => <Accent text="LISTEN TO ME" t={f - at('112') - 6} dur={40} y={880} />,
	}),
	// 113 — she walks the rounds every night
	shot('113', {
		bg: '#04080e',
		cam: [
			[400, 590, 1.2],
			[1200, 590, 1.35],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={1} />,
		actors: [ghostAt(-100, [{at: '113', off: 0, len: 100, walk: [-100, 1700], speed: 0.2}], {item: 'clip', s: 0.9})],
		hud: ({f, at}) => <Accent text="THE NIGHT ROUNDS" t={f - at('113') - 6} dur={60} y={880} c="#bfe9ff" />,
	}, {whip: true}),
	// 114 — she never hurts the patients
	shot('114', {
		bg: '#03060c',
		cam: [
			[1100, 590, 1.5],
			[1300, 590, 1.8],
		],
		back: ({f}) => <Room f={f} lit={0.6} heart="beat" />,
		actors: [ghostAt(1100, [{at: '114', off: 0, len: 60, walk: [700, 1100], speed: 0.2}, {at: '114', off: 40, len: 60, reach: [1280, 680], side: 'F'}, {at: '114', off: 40, len: 60, mouth: 'smile'}], {s: 0.98})],
		world: ({f}) => <PatientBed f={f} />,
		hud: ({f, at}) => <Accent text="NEVER HURTS THE PATIENTS" t={f - at('114') - 30} dur={60} y={880} c="#bfe9ff" />,
	}),
	// 115 — she never touches us, she only charts
	shot('115', {
		bg: '#0b1620',
		cam: [
			[900, 600, 1.5],
			[1300, 600, 1.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [
			...staff((a) => ({...a, still: true, beats: [{at: '115', off: 10, len: 100, sway: 0.7}]})),
			ghostAt(-100, [{at: '115', off: 0, len: 120, walk: [-100, 1750], speed: 0.2}], {item: 'clip', floor: 940, s: 1.05, z: 5}),
		],
		hud: ({f, at}) => <Accent text="SHE ONLY CHARTS" t={f - at('115') - 40} dur={60} y={880} c="#bfe9ff" />,
	}),
	// 116 — charts what?
	shot('116', {
		bg: '#0b1620',
		cam: [
			[520, 585, 2.4],
			[500, 580, 2.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '116', off: 0, len: 30, expr: 'wide'}, {at: '116', off: 0, len: 30, g: 'point'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('116') + 1} to={at('116') + 26} top={190} lines={['CHARTS WHAT?']} size={86} />,
	}),
	// 117 — the ones who are about to die
	shot('117', {
		bg: '#0b1620',
		cam: [
			[1050, 590, 2.0],
			[1090, 585, 2.6],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '117', off: 0, len: 60, expr: 'sad'}, {at: '117', off: 12, len: 40, head: 8}], {s: 1.05})],
		hud: ({f, at}) => <Caption f={f} from={at('117') + 12} to={at('117') + 48} top={180} lines={['THE ONES WHO ARE', 'ABOUT TO DIE']} size={74} c="#ff5a5a" />,
		shake: [{at: '117', off: 14, len: 8}],
	}),
	// 118 — I looked at him
	shot('118', {
		bg: '#0b1620',
		cam: [
			[640, 585, 1.5],
			[800, 585, 1.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '118', off: 0, len: 40, expr: 'worried'}, {at: '118', off: 0, len: 40, look: [0.9, 0]}, {at: '118', off: 0, len: 30, turn: 0.6}], {face: 1}), dennisAt(1100)],
	}),
	// 119 — go check, he said quietly
	shot('119', {
		bg: '#0b1620',
		cam: [
			[1000, 590, 1.8],
			[1100, 585, 2.2],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '119', off: 8, len: 50, g: 'point'}, {at: '119', off: 8, len: 50, expr: 'sad'}], {s: 1.05}), hero(520, [{at: '119', off: 0, len: 50, expr: 'worried'}], {face: 1})],
		hud: ({f, at}) => <Accent text="GO CHECK" t={f - at('119') - 6} dur={46} y={880} />,
	}),
	// 120 — Room 312, the chart she wrote, I didn't want to
	shot('120', {
		bg: '#04080e',
		cam: [
			[500, 590, 1.5],
			[780, 585, 1.8],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={1} light312={1} />,
		actors: [hero(200, [{at: '120', off: 0, len: 100, walk: [200, 640], speed: 0.18}, {at: '120', off: 0, len: 110, expr: 'worried'}, {at: '120', off: 0, len: 110, sway: 1.2}], {face: 1, item: 'flash'})],
		world: ({f, at}) => <Callout f={f} t0={at('120') + 16} t1={at('120') + 70} from={[920, 560]} to={[1120, 400]} text="THE CHART SHE WROTE" c="#ffe08a" />,
		hud: ({f, at}) => <Accent text="I DIDN'T WANT TO" t={f - at('120') - 70} dur={60} y={880} c="#ff9a6a" />,
	}, {whip: true}),
	// 121 — but I'm an auditor, I trust documents
	shot('121', {
		bg: '#04080e',
		cam: [
			[640, 580, 2.0],
			[700, 570, 2.4],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={1} light312={1} />,
		actors: [hero(640, [{at: '121', off: 0, len: 60, g: 'fist'}, {at: '121', off: 0, len: 100, expr: 'angry'}, {at: '121', off: 30, len: 60, lean: 8}], {face: 1, item: 'clip'})],
		hud: ({f, at}) => <Accent text="I'M AN AUDITOR. I TRUST DOCUMENTS." t={f - at('121') - 20} dur={80} y={880} />,
	}),
	// 122 — I went back, shaking, and found the clipboard on the empty bed
	shot('122', {
		bg: '#03060c',
		cam: [
			[800, 600, 1.3],
			[1250, 620, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.6} empty />,
		actors: [hero(-200, [{at: '122', off: 0, len: 70, walk: [-200, 760], speed: 0.24}, {at: '122', off: 0, len: 130, sway: 2}, {at: '122', off: 70, len: 60, reach: [1250, 652], side: 'F'}], {face: 1, item: 'flash'})],
		world: ({f, at}) => (
			<g transform="translate(1320,640) rotate(-6)">
				<rect width={90} height={110} fill="#6b4f36" />
				<rect x={8} y={12} width={74} height={92} fill="#e6d8a8" />
				<rect x={25} y={-6} width={40} height={14} fill="#9aa4ac" />
			</g>
		),
	}),
	// 123–126 — the chart: yellowed, brittle, neat slanted handwriting, a list of names
	shot('123', {
		bg: '#0b1020',
		cam: [
			[960, 540, 1.0],
			[940, 500, 1.3],
		],
		back: CardOnly('#0d1224'),
		world: ({f, at}) => (
			<>
				<ChartSheet f={f} t0={at('123') + 4} rows={[]} />
				<Callout f={f} t0={at('123') + 8} t1={at('123') + 44} from={[720, 330]} to={[330, 190]} text="YELLOWED" c="#ffd34a" />
				<Callout f={f} t0={at('124') + 4} t1={at('124') + 30} from={[1440, 700]} to={[1480, 880]} text="BRITTLE AT THE EDGES" c="#ffd34a" align="center" />
				<Callout f={f} t0={at('125') + 4} t1={at('125') + 60} from={[760, 520]} to={[1380, 230]} text="NEAT, SLANTED HANDWRITING" c="#ffd34a" />
				<Callout f={f} t0={at('126') + 4} t1={at('126') + 75} from={[780, 640]} to={[1400, 820]} text="NAMES · DATES · TIMES" c="#ffd34a" />
			</>
		),
	}),
	// 127–130 — Mrs. Wynne 3:12, Mr. Alvarez 4:40
	shot('127', {
		bg: '#0b1020',
		cam: [
			[960, 520, 1.15],
			[900, 560, 1.45],
		],
		back: CardOnly('#0d1224'),
		world: ({f, at}) => (
			<ChartSheet
				f={f}
				t0={at('123') + 4}
				rows={[
					{n: 'Mrs. Eleanor Wynne', room: 'Room 308', time: '3:12 a.m.', t: at('127') + 4},
					{n: 'Mr. Alvarez', room: 'Room 314', time: '4:40 a.m.', t: at('129') + 4},
				]}
			/>
		),
	}),
	// 131 — the last line, fresh ink under the flashlight
	shot('131', {
		bg: '#03060c',
		cam: [
			[1000, 600, 1.7],
			[1100, 640, 2.3],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(900, [{at: '131', off: 0, len: 150, reach: [1090, 740], side: 'F'}, {at: '131', off: 0, len: 150, expr: 'wide'}, {at: '131', off: 60, len: 90, sway: 1.4}], {face: 1, item: 'flash'})],
		world: ({f, at}) => (
			<g>
				<g transform="translate(1100,700) rotate(-4)">
					<rect x={-70} y={-90} width={140} height={180} fill="#e6d8a8" />
					<text x={-56} y={-20} fontFamily="Caveat, cursive" fontWeight={700} fontSize={34} fill="#1a2a6a">
						Marcus Hale
					</text>
					<rect x={-60} y={-50} width={120} height={40} fill="#4a7bff" opacity={0.2 + 0.15 * Math.sin(f / 4)} />
				</g>
				<circle cx={1100} cy={690} r={200} fill="#fff6d0" opacity={0.08} />
				<Callout f={f} t0={at('131') + 76} t1={at('131') + 150} from={[1100, 690]} to={[820, 400]} text="FRESH INK — STILL WET" c="#7aa0ff" />
			</g>
		),
	}),
	// 132–134 — Marcus Hale. Stairwell B. 12 o'clock a.m.
	shot('132', {
		bg: '#0b1020',
		cam: [
			[960, 540, 1.2],
			[960, 560, 1.5],
		],
		back: CardOnly('#0d1224'),
		world: ({f, at}) => (
			<ChartSheet
				f={f}
				t0={at('123') + 4}
				flash={at('132')}
				rows={[
					{n: 'Mrs. Eleanor Wynne', room: 'Room 308', time: '3:12 a.m.', t: 0},
					{n: 'Mr. Alvarez', room: 'Room 314', time: '4:40 a.m.', t: 0},
					{n: 'Marcus Hale', room: 'Stairwell B', time: '12:00 a.m.', fresh: true, t: at('132')},
				]}
			/>
		),
		shake: [{at: '132', off: 4, len: 14}, {at: '134', off: 2, len: 14}],
		flashes: ['132'],
	}),
	// 135 — I read it three times. It was already past one.
	shot('135', {
		bg: '#03060c',
		cam: [
			[960, 580, 1.8],
			[920, 570, 2.3],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(900, [{at: '135', off: 0, len: 12, head: 12}, {at: '135', off: 22, len: 12, head: 12}, {at: '135', off: 44, len: 12, head: 12}, {at: '135', off: 0, len: 150, expr: 'wide'}, {at: '135', off: 60, len: 50, g: 'handsOnHead'}], {face: 1, item: 'clip'})],
		hud: ({gf}) => <ClockHud gf={gf} c="#ff6a6a" />,
	}),
	// 136a — I ran to room 308
	shot('136', {
		bg: '#04080e',
		cam: [
			[300, 590, 1.3],
			[1100, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.4} flicker={0.8} />,
		actors: [hero(-200, [{at: '136', off: 0, len: 70, run: [-200, 1500], speed: 0.65}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('136') + 2} to={at('136') + 36} top={190} lines={['ROOM 308']} size={96} c="#ffe08a" />,
		shake: [{at: '136', off: 0, len: 70}],
	}, {whip: true}),
	// 136b — Mrs. Wynne was asleep
	shot(
		'136',
		{
			bg: '#03060c',
			cam: [
				[900, 600, 1.3],
				[1300, 620, 1.6],
			],
			back: ({f}) => <Room f={f} lit={0.8} heart="beat" />,
			actors: [hero(-200, [{at: '136', off: 80, len: 60, run: [-200, 780], speed: 0.6}, {at: '136', off: 140, len: 50, expr: 'worried'}], {face: 1})],
			world: ({f}) => <PatientBed f={f} />,
			hud: ({f, at}) => <Accent text="MRS. WYNNE · ASLEEP" t={f - at('136') - 120} dur={80} y={880} />,
		},
		{off: 78},
	),
	// 137 — breathing shallow but steady
	shot('137', {
		bg: '#03060c',
		cam: [
			[1150, 640, 2.2],
			[1250, 640, 2.6],
		],
		back: ({f}) => <Room f={f} lit={0.8} heart="beat" />,
		actors: [hero(800, [{at: '137', off: 0, len: 60, look: [0.9, 0.4]}], {face: 1})],
		world: ({f, at}) => (
			<>
				<PatientBed f={f} breathe={1.5} />
				<Callout f={f} t0={at('137') + 10} t1={at('137') + 56} from={[1230, 640]} to={[1020, 400]} text="SHALLOW, BUT STEADY" c="#7dffb0" />
			</>
		),
	}),
	// 138 — I stood beside her for an hour watching the monitor
	shot('138', {
		bg: '#03060c',
		cam: [
			[1000, 600, 1.5],
			[1000, 600, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.8} heart="beat" />,
		actors: [hero(900, [{at: '138', off: 0, len: 60, look: [0.4, -0.5], head: -6}, {at: '138', off: 50, len: 20, mouth: 'open'}, {at: '138', off: 50, len: 40, g: 'touchFace'}, {at: '138', off: 90, len: 50, g: 'rubChin'}], {face: 1})],
		world: ({f}) => <PatientBed f={f} />,
		hud: ({gf}) => <ClockHud gf={gf} />,
	}),
	// 139 — at 3:12 her heart stopped
	shot('139', {
		bg: '#03060c',
		cam: [
			[1100, 600, 1.3],
			[1000, 560, 1.9],
		],
		back: ({f, at}) => <Room f={f} lit={0.8} heart={f < at('139') + 50 ? 'beat' : 'flat'} />,
		actors: [hero(900, [{at: '139', off: 50, len: 80, expr: 'wide'}, {at: '139', off: 50, len: 40, g: 'stop'}], {face: 1})],
		world: ({f}) => <PatientBed f={f} breathe={1} />,
		hud: ({f, at}) => (
			<>
				<ClockHud gf={L('139').from} c="#ff6a6a" />
				<Caption f={f} from={at('139') + 52} to={at('139') + 110} top={170} lines={['BEEEEEEP']} size={110} c="#ff4a4a" />
			</>
		),
		shake: [{at: '139', off: 50, len: 20}],
		flashes: [],
	}),
	// 140 — Dennis and Priya rushed in
	shot('140', {
		bg: '#03060c',
		cam: [
			[700, 600, 1.2],
			[1000, 600, 1.4],
		],
		back: ({f}) => <Room f={f} lit={0.9} heart="flat" />,
		actors: [
			dennisAt(-200, [{at: '140', off: 0, len: 36, run: [-200, 760], speed: 0.6}], {face: 1}),
			priyaAt(-380, [{at: '140', off: 6, len: 36, run: [-380, 640], speed: 0.6}], {face: 1}),
		],
		world: ({f}) => <PatientBed f={f} dead />,
		shake: [{at: '140', off: 0, len: 36}],
	}),
	// 141 — they worked on her for 20 minutes, but she was gone
	shot('141', {
		bg: '#03060c',
		cam: [
			[1000, 600, 1.7],
			[1200, 620, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.9} heart="flat" />,
		actors: [
			dennisAt(1190, [{at: '141', off: 0, len: 110, reach: [1330, 650], side: 'F', osc: [0, 26, 12]}, {at: '141', off: 0, len: 110, reach: [1330, 650], side: 'B', osc: [0, 26, 12]}, {at: '141', off: 0, len: 110, lean: 12}], {face: 1, s: 1}),
			priyaAt(1040, [{at: '141', off: 0, len: 110, expr: 'worried'}, {at: '141', off: 40, len: 60, g: 'handsOnHead'}], {face: 1, s: 1}),
		],
		world: ({f}) => <PatientBed f={f} dead />,
		hud: ({f, at}) => <Accent text="20 MINUTES" t={f - at('141') - 30} dur={70} y={880} c="#ff8a6a" />,
	}),
	// 142 — Dennis looked at me with something almost pity
	shot('142', {
		bg: '#03060c',
		cam: [
			[860, 590, 1.9],
			[800, 585, 2.4],
		],
		back: ({f}) => <Room f={f} lit={0.9} heart="flat" />,
		actors: [dennisAt(1000, [{at: '142', off: 20, len: 100, expr: 'sad'}, {at: '142', off: 20, len: 80, head: 8}, {at: '142', off: 60, len: 60, g: 'shrug'}], {s: 1.05}), hero(620, [{at: '142', off: 0, len: 110, expr: 'worried'}], {face: 1})],
	}),
	// 143 — she's never wrong
	shot('143', {
		bg: '#03060c',
		cam: [
			[1000, 585, 2.3],
			[1000, 580, 2.8],
		],
		back: ({f}) => <Room f={f} lit={0.9} heart="flat" />,
		actors: [dennisAt(1000, [{at: '143', off: 6, len: 40, g: 'stop'}, {at: '143', off: 0, len: 50, expr: 'sad'}], {s: 1.05})],
		hud: ({f, at}) => <Accent text="SHE'S NEVER WRONG" t={f - at('143') - 6} dur={40} y={880} c="#ff6a6a" />,
	}),
	// 144 — that's why we count every hour
	shot('144', {
		bg: '#0b1620',
		cam: [
			[900, 330, 1.7],
			[1000, 420, 1.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '144', off: 0, len: 60, g: 'point'}, {at: '144', off: 0, len: 60, look: [-0.5, -0.9]}], {s: 1.05})],
		hud: ({f, at}) => <Caption f={f} from={at('144') + 6} to={at('144') + 50} top={170} lines={['COUNT EVERY HOUR']} size={82} c="#ffc94a" />,
	}, {whip: true}),
	// 145 — if the number is 42, she's chosen someone
	shot('145', {
		bg: '#04090d',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.3],
		],
		back: CardOnly('#05080f'),
		world: ({f, at}) => (
			<g>
				<g transform={`translate(960,520) scale(${1 + 0.06 * Math.sin(f / 5)})`}>
					<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={520} fill="#ff4a4a" opacity={Math.min(1, (f - at('145') + 5) / 8)} stroke="#2a0808" strokeWidth={12} paintOrder="stroke">
						42
					</text>
				</g>
				<Callout f={f} t0={at('145') + 50} t1={at('145') + 100} from={[960, 640]} to={[960, 900]} text="SHE'S CHOSEN SOMEONE" c="#ff6a6a" align="center" />
			</g>
		),
		shake: [{at: '145', off: 0, len: 10}],
	}),
	// 146 — chosen how? she doesn't kill them
	shot('146', {
		bg: '#0b1620',
		camPos: ({sp}) => (sp === 'PRIYA' ? [1200, 590, 2.3] : [900, 590, 1.6]),
		cam: [1000, 590, 1.6],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [
			hero(520, [{at: '146', off: 0, len: 30, expr: 'wide'}, {at: '146', off: 0, len: 30, g: 'shrug'}], {face: 1}),
			priyaAt(1250, [{at: '146', off: 36, len: 90, g: 'stop'}, {at: '146', off: 36, len: 90, expr: 'sad'}], {s: 1.02}),
		],
		hud: ({f, at}) => <Accent text="SHE DOESN'T KILL THEM" t={f - at('146') - 40} dur={70} y={880} />,
	}),
	// 147 — she just writes their name, the hospital takes care of the rest
	shot('147', {
		bg: '#0b1620',
		cam: [
			[1200, 540, 1.5],
			[1150, 540, 1.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [priyaAt(1250, [{at: '147', off: 0, len: 60, g: 'presentF'}, {at: '147', off: 60, len: 60, g: 'shrug'}, {at: '147', off: 0, len: 120, expr: 'sad'}], {s: 1.02})],
		world: ({f, at}) => (
			<g>
				{['Mrs. Wynne', 'Mr. Alvarez', 'Marcus Hale'].map((n, i) => {
					const u = (f - (at('147') + 6 + i * 22)) / 70;
					return u > 0 && u < 1 ? (
						<text key={n} x={1100 + i * 40} y={500 - u * 220} fontFamily="Caveat, cursive" fontWeight={700} fontSize={64} fill="#ffe9a8" opacity={Math.sin(u * Math.PI)}>
							{n}
						</text>
					) : null;
				})}
				<Callout f={f} t0={at('147') + 90} t1={at('147') + 200} from={[1400, 420]} to={[1400, 250]} text="THE HOSPITAL DOES THE REST" c="#ff9a6a" align="center" />
			</g>
		),
	}),
	// 148 — I thought of the last line on the chart
	shot('148', {
		bg: '#0b1620',
		cam: [
			[560, 560, 2.0],
			[560, 540, 2.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '148', off: 0, len: 60, g: 'think'}, {at: '148', off: 0, len: 60, look: [0, -0.8]}], {face: 1})],
		world: ({f, at}) => (
			<g transform={`translate(760,300) rotate(4) scale(${Math.min(1, (f - at('148') + 4) / 8)})`}>
				<rect x={-120} y={-80} width={240} height={160} rx={30} fill="#fff" opacity={0.95} />
				<text textAnchor="middle" y={12} fontFamily="Caveat, cursive" fontWeight={700} fontSize={46} fill="#1a2a6a">
					Marcus Hale
				</text>
			</g>
		),
	}),
	// 149 — Marcus Hale. Stairwell B.
	shot('149', {
		bg: '#0b1620',
		cam: [
			[640, 580, 1.7],
			[600, 575, 2.1],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '149', off: 0, len: 50, expr: 'worried'}, {at: '149', off: 0, len: 50, sway: 1.5}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('149') + 2} to={at('149') + 40} top={170} lines={['MARCUS HALE', 'STAIRWELL B']} size={88} c="#ff6a6a" />,
	}),
	// 150 — it said midnight, I said
	shot('150', {
		bg: '#0b1620',
		cam: [
			[900, 590, 1.6],
			[800, 585, 2.0],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '150', off: 0, len: 50, g: 'point'}, {at: '150', off: 0, len: 50, expr: 'wide'}], {face: 1}), dennisAt(1100, [{at: '150', off: 10, len: 40, expr: 'worried'}])],
		hud: ({f, at}) => <Accent text="IT SAID MIDNIGHT" t={f - at('150') - 4} dur={40} y={880} />,
	}),
	// 151 — but it's three in the morning
	shot('151', {
		bg: '#0b1620',
		cam: [
			[880, 300, 2.2],
			[880, 330, 1.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: staff((a) => ({...a, still: true})),
		hud: ({gf}) => <ClockHud gf={gf} />,
	}),
	// 152 — I'm still alive
	shot('152', {
		bg: '#0b1620',
		cam: [
			[560, 585, 2.3],
			[540, 580, 2.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '152', off: 0, len: 50, g: 'touchFace'}, {at: '152', off: 10, len: 40, expr: 'wide'}, {at: '152', off: 14, len: 30, mouth: 'smile'}], {face: 1, badge: true})],
		hud: ({f, at}) => <Caption f={f} from={at('152') + 2} to={at('152') + 36} top={170} lines={['STILL ALIVE']} size={96} c="#7dffb0" />,
	}),
	// 153 — Dennis frowned, that's strange
	shot('153', {
		bg: '#0b1620',
		cam: [
			[1060, 590, 2.2],
			[1090, 585, 2.7],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [dennisAt(1100, [{at: '153', off: 0, len: 60, expr: 'worried'}, {at: '153', off: 10, len: 40, g: 'rubChin'}, {at: '153', off: 0, len: 60, mouth: 'frown'}], {s: 1.05})],
	}),
	// 154 — why? because she's never been late
	shot('154', {
		bg: '#0b1620',
		cam: [
			[800, 585, 1.7],
			[900, 580, 2.1],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <SF f={f} />,
		actors: [hero(520, [{at: '154', off: 0, len: 36, g: 'shrug'}, {at: '154', off: 0, len: 36, expr: 'wide'}], {face: 1}), dennisAt(1100, [{at: '154', off: 36, len: 60, g: 'stop'}, {at: '154', off: 36, len: 70, expr: 'worried'}])],
		hud: ({f, at}) => <Accent text="SHE'S NEVER BEEN LATE" t={f - at('154') - 40} dur={70} y={880} c="#ff6a6a" />,
	}),
];
