import React from 'react';
import {Layer, Svg} from '../engine/camera';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Pop} from '../kit/kit';
import {Station, StationFront, Ward} from './places';
import {ActorSpec, Beat, nurses, shot} from './dsl';
import {clockMin} from './clock';
import {CardBg, Paper, ScannerScreen} from './cards';
import type {ShotDef} from '../kit/coverage';
import {hero} from './shots1';

/* the night crowd at the nurses station: 8 nurses + Dennis + Priya behind the counter */
const XS = [700, 790, 880, 1060, 1150, 1240, 1330, 1420, 1510];
export const staff = (fn?: (spec: ActorSpec, i: number) => ActorSpec, o: {noPriya?: boolean} = {}): ActorSpec[] => {
	const base = nurses(8, 700, 1560, {s: 0.92, floor: 890, face: -1, seed: 3});
	const list: ActorSpec[] = [
		...base.slice(0, 3),
		{id: 'dennis', who: 'dennis', x: 975, s: 0.95, floor: 890, face: -1},
		...base.slice(3, 5),
		o.noPriya ? base[5] : {id: 'priya', who: 'priya', x: 1290, s: 0.92, floor: 890, face: -1},
		...base.slice(6, 8),
	];
	list.forEach((a, i) => (a.x = [700, 790, 880, 975, 1070, 1160, 1290, 1390, 1490][i]));
	return fn ? list.map(fn) : list;
};
export const everyone = (beats: Beat[]) => (a: ActorSpec): ActorSpec => ({...a, beats: [...(a.beats ?? []), ...beats]});
const SB: React.FC<{f: number; gf: number; note?: boolean; clockDown?: boolean}> = ({f, gf, note = true, clockDown}) => <Station f={f} minutes={clockMin(gf)} note={note} clockDown={clockDown} />;

export const SHOTS3: ShotDef[] = [
	// 021 — the night staff gathered at the nurses station
	shot('021', {
		bg: '#0b1620',
		cam: [
			[900, 600, 1.0],
			[1000, 590, 1.25],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff((a, i) => ({...a, x: a.x, hidden: true, beats: [{at: '021', off: i * 7, len: 1, hide: false}, {at: '021', off: i * 7, len: 70, walk: [i % 2 ? 2100 : -200, a.x], speed: 0.32}]})),
		hud: ({f, at}) => <Accent text="3RD FLOOR · NIGHT SHIFT" t={f - at('021') - 10} dur={110} y={190} />,
	}, {whip: true}),
	// 022 — 41 people in blue scrubs holding paper cups
	shot('022', {
		bg: '#0b1620',
		cam: [
			[1100, 610, 1.4],
			[820, 600, 1.55],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff((a) => ({...a, item: 'cup', beats: [{at: '022', off: 30 + (a.x % 7) * 6, len: 30, reach: [a.x + 36, 700], side: 'F'}]})),
		world: ({f, at}) => <Callout f={f} t0={at('022') + 8} t1={at('022') + 90} from={[1100, 520]} to={[1330, 310]} text="41 NURSES" />,
	}),
	// 023 — substitute teacher on the first day
	shot('023', {
		bg: '#0b1620',
		cam: [
			[560, 600, 1.35],
			[900, 590, 1.2],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			...staff(everyone([{at: '023', off: 0, len: 160, mouth: 'flat'}])),
			hero(-200, [
				{at: '023', off: 0, len: 60, walk: [-200, 300]},
				{at: '023', off: 70, len: 40, g: 'wave'},
				{at: '023', off: 70, len: 100, expr: 'worried'},
				{at: '023', off: 112, len: 50, g: 'scratch'},
			], {item: 'clip'}),
		],
		hud: ({f, at}) => <Accent text="THE NEW SUBSTITUTE TEACHER" t={f - at('023') - 90} dur={80} y={880} />,
	}),
	// 024 — Dennis
	shot('024', {
		bg: '#0b1620',
		cam: [
			[760, 590, 1.6],
			[620, 585, 1.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			...staff((a) => (a.id === 'dennis' ? {...a, face: -1, beats: [{at: '024', off: 12, len: 50, walk: [975, 560], speed: 0.3}, {at: '024', off: 70, len: 70, g: 'presentF'}, {at: '024', off: 70, len: 70, face: -1}]} : a)),
			hero(300, [{at: '024', off: 0, len: 200, look: [0.9, 0]}], {item: 'clip', face: 1}),
		],
		world: ({f, at, pos}) => <Callout f={f} t0={at('024') + 66} t1={at('024') + 140} from={[pos.dennis.x, pos.dennis.headY - 20]} to={[pos.dennis.x + 70, pos.dennis.headY - 220]} text="DENNIS · HEAD NURSE" />,
	}),
	// 025 — nobody smiled, nobody asked
	shot('025', {
		bg: '#0b1620',
		cam: [
			[640, 590, 1.9],
			[1500, 590, 1.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(everyone([{at: '025', off: 0, len: 150, mouth: 'flat', look: [-0.9, 0]}])),
		hud: ({f, at}) => <Accent text="NOBODY SMILED" t={f - at('025') - 6} dur={50} y={880} />,
	}),
	// 026 — looking at the clock
	shot('026', {
		bg: '#0b1620',
		cam: [
			[900, 500, 1.3],
			[860, 300, 2.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(everyone([{at: '026', off: 14, len: 120, look: [0, -1], head: -8}])),
		world: ({f, at}) => <Callout f={f} t0={at('026') + 40} t1={at('026') + 130} from={[860, 250]} to={[600, 150]} text="11:47 P.M." />,
	}),
	// 027 — 11:48 p.m., I started with the roster
	shot('027', {
		bg: '#0b1620',
		cam: [
			[420, 590, 1.9],
			[640, 560, 1.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			...staff(),
			hero(300, [
				{at: '027', off: 0, len: 150, reach: [380, 700], side: 'B'},
				{at: '027', off: 60, len: 80, head: -8},
			], {item: 'clip'}),
		],
		world: ({f, at}) => <Callout f={f} t0={at('027') + 74} t1={at('027') + 140} from={[470, 300]} to={[640, 480]} text="ROSTER: 41 NAMES" />,
		hud: ({f, at}) => <Accent text="11:48 P.M." t={f - at('027') - 4} dur={46} y={190} />,
	}),
	// 028 — I read them aloud and each nurse raised a hand
	shot('028', {
		bg: '#0b1620',
		cam: [
			[640, 600, 1.5],
			[1400, 590, 1.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			...staff((a, i) => ({...a, beats: [{at: '028', off: 6 + i * 12, len: 28, g: 'stop'}, {at: '028', off: 6 + i * 12, len: 28, mouth: 'smile'}]})),
			hero(300, [{at: '028', off: 0, len: 70, g: 'point'}, {at: '028', off: 0, len: 70, mouth: 'open'}], {item: 'clip'}),
		],
	}),
	// 029 — it took ten minutes, everything matched
	shot('029', {
		bg: '#0b1620',
		cam: [
			[880, 420, 2.2],
			[600, 580, 1.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [...staff(), hero(300, [{at: '029', off: 40, len: 40, g: 'presentF'}, {at: '029', off: 40, len: 80, mouth: 'smile'}], {item: 'clip', badge: true})],
		hud: ({f, at}) => <Accent text="EVERYTHING MATCHED ✓" t={f - at('029') - 44} dur={60} y={880} c="#7dffb0" />,
	}),
	// 030 — every face had a name, every name had a badge
	shot('030', {
		bg: '#0b1620',
		cam: [
			[780, 610, 2.4],
			[1180, 610, 2.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(everyone([{at: '030', off: 0, len: 100, face: -1}]), {}).map((a) => ({...a, props: {...a.props, chestText: 'RN'}})),
		world: ({f, at, pos}) => (
			<>
				<Callout f={f} t0={at('030') + 4} t1={at('030') + 60} from={[pos.n1?.x ?? 790, (pos.n1?.headY ?? 600)]} to={[560, 420]} text="FACE → NAME" />
				<Callout f={f} t0={at('030') + 52} t1={at('030') + 100} from={[1070, 700]} to={[1000, 430]} text="NAME → BADGE" />
			</>
		),
	}),
	// 031 — the note taped to the wall beside the telephone
	shot('031', {
		bg: '#0b1620',
		cam: [
			[700, 520, 1.3],
			[1440, 440, 2.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [...staff(), hero(300, [{at: '031', off: 0, len: 150, look: [0.9, -0.4]}, {at: '031', off: 60, len: 80, g: 'point'}], {item: 'clip'})],
		world: ({f, at}) => <Callout f={f} t0={at('031') + 60} t1={at('031') + 150} from={[1500, 450]} to={[1300, 640]} text="A NOTE" />,
	}),
	// 032–033 — yellow paper, black marker, shaky handwriting (close-up on the wall)
	shot('032', {
		bg: '#0b1620',
		cam: [
			[1515, 450, 3.4],
			[1500, 440, 4.2],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('032') + 6} t1={at('032') + 50} from={[1515, 410]} to={[1330, 330]} text="YELLOW PAPER" />
				<Callout f={f} t0={at('033') + 4} t1={at('033') + 90} from={[1480, 500]} to={[1280, 620]} text="SHAKY HANDWRITING" />
			</>
		),
		shake: [{at: '033', off: 6, len: 40}],
	}),
	// 034 — the note itself
	shot('034', {
		bg: '#0b1020',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.15],
		],
		back: () => (
			<Layer depth={1}>
				<Svg>
					<CardBg c="#101626" />
				</Svg>
			</Layer>
		),
		world: ({f, at}) => <Paper f={f} t0={at('034') + 4} per={26} lines={['Never ask her name', 'after midnight.', 'Never ask what she', 'is charting.', 'Count us every hour.']} size={74} w={900} h={760} />,
	}),
	// 035 — I turn to Dennis
	shot('035', {
		bg: '#0b1620',
		cam: [
			[640, 590, 1.6],
			[560, 585, 1.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			...staff((a) => (a.id === 'dennis' ? {...a, x: 700, face: -1, beats: []} : a)).filter((a) => a.x > 760 || a.id === 'dennis'),
			hero(300, [{at: '035', off: 40, len: 80, turn: 0.6}, {at: '035', off: 40, len: 80, g: 'point'}], {item: 'clip'}),
		],
	}, {off: 40}),
	// 036 — what is this? he took off his glasses and wiped them slowly
	shot('036', {
		bg: '#0b1620',
		cam: [
			[560, 580, 2.1],
			[640, 575, 2.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			{id: 'dennis', who: 'dennis', x: 700, face: -1, s: 1, beats: [{at: '036', off: 34, len: 90, g: 'touchFace'}, {at: '036', off: 34, len: 90, over: true}, {at: '036', off: 34, len: 90, head: 8}]},
			hero(300, [{at: '036', off: 0, len: 60, g: 'shrug'}, {at: '036', off: 0, len: 40, expr: 'worried'}], {item: 'clip'}),
		],
	}),
	// 037–039 — house rules / whose rules / the ones that keep us employed
	shot('037', {
		bg: '#0b1620',
		camPos: ({sp, at, f}) => (sp === 'DENNIS' ? [620, 580, 2.3] : sp === 'HERO' ? [380, 585, 2.2] : [520, 585, 1.5]),
		cam: [620, 580, 2.0],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: [
			{id: 'dennis', who: 'dennis', x: 700, face: -1, s: 1, beats: [{at: '037', off: 8, len: 40, g: 'shrug'}, {at: '039', off: 6, len: 50, g: 'point'}, {at: '039', off: 6, len: 70, expr: 'sad'}]},
			hero(300, [{at: '038', off: 0, len: 30, g: 'shrug'}, {at: '038', off: 0, len: 30, expr: 'wide'}, {at: '039', off: 20, len: 70, g: 'rubChin'}], {item: 'clip'}),
		],
		hud: ({f, at}) => <Accent text="THE ONES THAT KEEP US EMPLOYED" t={f - at('039') - 4} dur={80} y={880} c="#ff9a6a" />,
	}),
	// 040 — the clock clicked
	shot('040', {
		bg: '#0b1620',
		cam: [
			[860, 300, 2.3],
			[860, 280, 3.0],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(everyone([{at: '040', off: 20, len: 60, look: [0, -1]}])),
		hud: ({f, at}) => <Accent text="*CLICK*" t={f - at('040') - 20} dur={40} y={900} />,
		shake: [{at: '040', off: 20, len: 8}],
	}),
	// 041 — 11:59, the nurses stopped talking
	shot('041', {
		bg: '#0b1620',
		cam: [
			[900, 420, 2.2],
			[900, 590, 1.3],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(everyone([{at: '041', off: 40, len: 120, mouth: 'flat', expr: 'worried'}, {at: '041', off: 40, len: 120, sway: 0.7}])),
		hud: ({f, at}) => <Caption f={f} from={at('041') + 2} to={at('041') + 70} top={160} lines={['11:59 P.M.']} size={96} c="#ff6a6a" />,
	}),
	// 042 — Priya set down her coffee
	shot('042', {
		bg: '#0b1620',
		cam: [
			[1200, 590, 2.3],
			[1290, 580, 2.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff((a) => (a.id === 'priya' ? {...a, item: 'cup', beats: [{at: '042', off: 60, len: 60, reach: [1300, 690], side: 'F'}, {at: '042', off: 60, len: 80, expr: 'worried'}]} : a)),
		world: ({f, at, pos}) => <Callout f={f} t0={at('042') + 20} t1={at('042') + 90} from={[pos.priya.x, pos.priya.headY]} to={[pos.priya.x + 90, pos.priya.headY - 190]} text="PRIYA" />,
	}),
	// 043 — Dennis at attention like a soldier
	shot('043', {
		bg: '#0b1620',
		cam: [
			[1000, 590, 1.4],
			[1650, 580, 1.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff((a) => (a.id === 'dennis' ? {...a, face: 1, beats: [{at: '043', off: 6, len: 80, walk: [975, 1740], speed: 0.4}, {at: '043', off: 95, len: 90, expr: 'wide', look: [0.6, 0]}, {at: '043', off: 95, len: 90, g: 'stop'}]} : a)),
		hud: ({f, at}) => <Accent text="LIKE A SOLDIER" t={f - at('043') - 80} dur={70} y={880} />,
	}),
	// 044 — 12 o'clock
	shot('044', {
		bg: '#0b1620',
		cam: [
			[860, 270, 2.6],
			[860, 262, 3.2],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} />,
		actors: staff(),
		hud: ({f, at}) => <Caption f={f} from={at('044') + 2} to={at('044') + 40} top={300} lines={['12:00']} size={150} c="#ff4a4a" />,
		shake: [{at: '044', off: 2, len: 14}],
		flashes: ['044'],
	}),
	// 045 — the elevator opens with a soft chime
	shot('045', {
		bg: '#0a1218',
		cam: [
			[900, 560, 1.0],
			[1620, 560, 1.9],
		],
		back: ({f, at}) => <Ward f={f} elev={Math.min(1, Math.max(0, (f - at('045') - 46) / 40))} />,
		actors: [hero(420, [{at: '045', off: 40, len: 100, expr: 'wide'}, {at: '045', off: 40, len: 60, look: [0.9, 0]}], {face: 1, item: 'clip', badge: false})],
		hud: ({f, at}) => <Accent text="DING" t={f - at('045') - 46} dur={46} y={190} />,
	}, {whip: true}),
	// 046 — nobody stepped out
	shot('046', {
		bg: '#0a1218',
		cam: [
			[1660, 560, 2.0],
			[1640, 560, 2.4],
		],
		back: ({f}) => <Ward f={f} elev={1} />,
		hud: ({f, at}) => <Accent text="NOBODY STEPPED OUT" t={f - at('046') - 4} dur={50} y={880} />,
	}),
	// 047 — the doors stayed open for five seconds
	shot('047', {
		bg: '#0a1218',
		cam: [
			[1480, 560, 1.7],
			[1640, 560, 1.4],
		],
		back: ({f}) => <Ward f={f} elev={1} />,
		actors: [hero(900, [{at: '047', off: 0, len: 100, look: [0.9, 0]}, {at: '047', off: 40, len: 60, g: 'stop'}], {face: 1, item: 'clip'})],
		world: ({f, at}) => {
			const n = Math.max(1, 5 - Math.floor((f - at('047') - 4) / 8));
			return (
				<g transform="translate(1700,520)">
					<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={160} fill="#fff" stroke="#0a1218" strokeWidth={8} paintOrder="stroke" opacity={0.9}>
						{n}
					</text>
				</g>
			);
		},
	}),
	// 048 — then they closed
	shot('048', {
		bg: '#0a1218',
		cam: [
			[1640, 560, 1.8],
			[1500, 560, 1.4],
		],
		back: ({f, at}) => <Ward f={f} elev={Math.max(0, 1 - (f - at('048') - 4) / 30)} />,
		shake: [{at: '048', off: 34, len: 8}],
	}),
	// 049 — behind me, on the monitor, a new line appeared
	shot('049', {
		bg: '#04090d',
		cam: [
			[960, 540, 1.0],
			[1000, 530, 1.15],
		],
		back: () => (
			<Layer depth={1}>
				<Svg>
					<CardBg c="#05080f" />
				</Svg>
			</Layer>
		),
		world: ({f, at}) => {
			const t = at('049');
			return (
				<ScannerScreen
					f={f}
					s={1.4}
					rows={[
						{t: t + 4, a: '23:58  BADGE #0412', b: 'OK'},
						{t: t + 14, a: '23:59  BADGE #0291', b: 'OK'},
						{t: t + 90, a: '00:00  NEW ENTRY', b: 'PENDING', warn: true},
					]}
					count={{t: at('050') + 4, v: 42}}
				/>
			);
		},
		shake: [{at: '050', off: 4, len: 10}],
	}),
	// 051 — the nurses were standing exactly as before
	shot('051', {
		bg: '#0b1620',
		cam: [
			[1000, 590, 1.1],
			[900, 580, 1.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [...staff(everyone([{at: '051', off: 0, len: 120, mouth: 'flat'}])), hero(300, [{at: '051', off: 0, len: 60, turn: 0.6}, {at: '051', off: 0, len: 90, expr: 'worried'}], {item: 'clip'})],
	}),
	// 052 — 41 of them, motionless
	shot('052', {
		bg: '#0b1620',
		cam: [
			[700, 600, 2.0],
			[1450, 600, 2.0],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: staff((a) => ({...a, still: true})),
		hud: ({f, at}) => <Accent text="41 OF THEM · MOTIONLESS" t={f - at('052') - 4} dur={50} y={880} />,
	}),
	// 053 — eyes fixed on the floor
	shot('053', {
		bg: '#0b1620',
		cam: [
			[1000, 640, 2.6],
			[860, 640, 2.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: staff((a) => ({...a, still: true, beats: [{at: '053', off: 0, len: 120, look: [0, 1], head: 14}]})),
	}),
	// 054 — I counted them aloud
	shot('054', {
		bg: '#0b1620',
		cam: [
			[640, 600, 1.6],
			[1400, 600, 1.6],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [
			...staff((a) => ({...a, still: true, beats: [{at: '054', off: 0, len: 90, look: [0, 1], head: 12}]})),
			hero(300, [{at: '054', off: 0, len: 70, walk: [300, 560], speed: 0.22}, {at: '054', off: 10, len: 80, g: 'point'}, {at: '054', off: 10, len: 90, mouth: 'open'}], {item: undefined}),
		],
		world: ({f, at, pos}) => (
			<>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => {
					const t = f - (at('054') + 6 + i * 6);
					const id = ['n0', 'n1', 'n2', 'dennis', 'n3', 'n4', 'priya', 'n6', 'n7'][i];
					const p = pos[id];
					if (!p) return null;
					return t >= 0 && t < 40 ? (
						<Pop key={n} t={t} x={p.x} y={p.headY - 60} s={0.9}>
							<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={80} fill="#ffc94a" stroke="#0b1020" strokeWidth={6} paintOrder="stroke">
								{n}
							</text>
						</Pop>
					) : null;
				})}
			</>
		),
	}),
];
