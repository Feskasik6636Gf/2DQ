import React from 'react';
import {Layer, Svg} from '../engine/camera';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Pop} from '../kit/kit';
import {Room, Station, StationFront, Ward, Beam} from './places';
import {ActorSpec, Beat, shot} from './dsl';
import {clockMin} from './clock';
import {CardBg, ScannerScreen, VsPanel} from './cards';
import type {ShotDef} from '../kit/coverage';
import {hero} from './shots1';
import {staff, everyone} from './shots3';

/* ------- shared bits ------- */
const SB: React.FC<{f: number; gf: number}> = ({f, gf}) => <Station f={f} minutes={clockMin(gf)} />;
const dennisAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'dennis', who: 'dennis', x, face: -1, beats, ...o});
const priyaAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'priya', who: 'priya', x, face: -1, beats, ...o});
const ghost = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'ghost', who: 'ghost', x, face: 1, still: true, beats, item: 'clip', ...o});
const WardBack = (dark = 0.45, light = 0, elev = 0) => ({f}: {f: number}) => <Ward f={f} dark={dark} light312={light} elev={elev} flicker={0.8} />;

export const Notes: React.FC<{f: number; x: number; y: number; t0: number; t1: number; wobble?: number}> = ({f, x, y, t0, t1, wobble = 1}) => {
	if (f < t0 || f > t1) return null;
	return (
		<g>
			{[0, 1, 2, 3].map((i) => {
				const u = ((f - t0) / 40 + i / 4) % 1;
				return (
					<text key={i} x={x + Math.sin(u * 6 + i * 2) * 40 * wobble + (i - 1.5) * 26} y={y - u * 190} fontSize={52} fill="#ffe9a8" opacity={Math.sin(u * Math.PI)} fontFamily="Rubik, sans-serif" fontWeight={800}>
						{['♪', '♫', '♪', '♫'][i]}
					</text>
				);
			})}
		</g>
	);
};
const Fog: React.FC<{f: number; o?: number}> = ({f, o = 0.35}) => (
	<g>
		{Array.from({length: 9}).map((_, i) => (
			<ellipse key={i} cx={((i * 260 + f * (1 + (i % 3) * 0.6)) % 2400) - 200} cy={880 + (i % 3) * 18} rx={260} ry={46} fill="#e8f4ff" opacity={o * (0.5 + 0.5 * Math.sin(f / 20 + i))} style={{filter: 'blur(14px)'}} />
		))}
	</g>
);
const Frost: React.FC<{f: number; t0: number}> = ({f, t0}) => {
	const k = Math.min(1, Math.max(0, (f - t0) / 30));
	return (
		<g>
			<rect x={-600} y={-300} width={3200} height={1700} fill="#a9d8ff" opacity={0.2 * k} />
			{Array.from({length: 30}).map((_, i) => (
				<circle key={i} cx={(i * 197) % 1920} cy={((i * 331 + f * (1 + (i % 4) * 0.5)) % 1100) - 40} r={2 + (i % 3)} fill="#fff" opacity={0.7 * k} />
			))}
		</g>
	);
};

export const SHOTS4: ShotDef[] = [
	// 055 — "There," Dennis whispered
	shot('055', {
		bg: '#0b1620',
		cam: [
			[1700, 590, 1.9],
			[1760, 580, 2.4],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [dennisAt(1740, [{at: '055', off: 4, len: 60, g: 'point'}, {at: '055', off: 4, len: 60, expr: 'worried'}], {s: 1})],
		hud: ({f, at}) => <Accent text="“THERE.”" t={f - at('055') - 6} dur={46} y={880} />,
	}),
	// 056a — you see? I see 41, the scanner sees 42
	shot('056', {
		bg: '#070b1c',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.2],
		],
		back: () => (
			<Layer depth={1}>
				<Svg>
					<CardBg c="#070b1c" />
				</Svg>
			</Layer>
		),
		world: ({f, at}) => <VsPanel f={f} t0={at('056') + 32} t1={at('056') + 96} a={['I SEE', '41']} b={['THE SCANNER SEES', '42']} />,
		shake: [{at: '056', off: 100, len: 8}],
	}),
	// 056b–061 — the entry: stamp, no badge, no photo, gray silhouette
	shot(
		'056',
		{
			bg: '#04090d',
			cam: [
				[900, 540, 1.0],
				[1000, 540, 1.25],
			],
			back: () => (
				<Layer depth={1}>
					<Svg>
						<CardBg c="#05080f" />
					</Svg>
				</Layer>
			),
			world: ({f, at}) => (
				<ScannerScreen
					f={f}
					s={1.3}
					head="ENTRY LOG · 00:00"
					rows={[
						{t: at('057') + 4, a: 'ENTRY  #42', b: 'STAMPED'},
						{t: at('058') + 4, a: 'TIME  12:00:00', b: '', warn: false},
						{t: at('059') + 2, a: 'BADGE NO.  —', b: 'MISSING', warn: true},
						{t: at('060') + 2, a: 'PHOTO  —', b: 'MISSING', warn: true},
					]}
					stamp={{t: at('057') + 24, text: 'UNKNOWN'}}
					sil={at('061') + 30}
					count={{t: at('056') + 150, v: 42}}
				/>
			),
			shake: [{at: '057', off: 24, len: 8}],
		},
		{off: 148},
	),
	// 062 — who is she? I asked
	shot('062', {
		bg: '#0b1620',
		cam: [
			[520, 590, 1.5],
			[640, 580, 1.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [
			hero(300, [{at: '062', off: 0, len: 60, g: 'point'}, {at: '062', off: 0, len: 70, expr: 'wide'}], {item: 'clip', face: 1}),
			dennisAt(760, [{at: '062', off: 30, len: 50, expr: 'worried'}, {at: '062', off: 40, len: 40, g: 'shrug'}]),
		],
		hud: ({f, at}) => <Caption f={f} from={at('062') + 6} to={at('062') + 60} top={190} lines={['WHO IS SHE?']} size={96} />,
	}),
	// 063 — Priya made a tiny sound
	shot('063', {
		bg: '#0b1620',
		cam: [
			[1160, 590, 2.4],
			[1180, 585, 2.9],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [priyaAt(1180, [{at: '063', off: 20, len: 70, g: 'touchFace'}, {at: '063', off: 20, len: 70, over: true}, {at: '063', off: 20, len: 70, expr: 'sad'}, {at: '063', off: 20, len: 70, sway: 1.4}], {s: 1.05})],
		hud: ({f, at}) => <Accent text="*whimper*" t={f - at('063') - 24} dur={50} y={880} />,
	}),
	// 064 — Dennis put a finger to his lips
	shot('064', {
		bg: '#0b1620',
		cam: [
			[900, 590, 2.3],
			[860, 585, 2.8],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [dennisAt(900, [{at: '064', off: 8, len: 50, g: 'touchFace'}, {at: '064', off: 8, len: 50, over: true}, {at: '064', off: 8, len: 50, hand: 'point'}, {at: '064', off: 8, len: 50, expr: 'worried'}], {s: 1.05})],
		hud: ({f, at}) => <Caption f={f} from={at('064') + 14} to={at('064') + 44} top={190} lines={['SHHH']} size={110} c="#9ad0ff" />,
	}),
	// 065 — you can't ask that, not out loud
	shot('065', {
		bg: '#0b1620',
		cam: [
			[560, 590, 1.9],
			[520, 585, 1.5],
		],
		back: ({f, gf}) => <SB f={f} gf={gf} />,
		front: ({f}) => <StationFront f={f} cups={0} count={42} />,
		actors: [
			dennisAt(760, [{at: '065', off: 4, len: 60, g: 'stop'}, {at: '065', off: 4, len: 70, mouth: 'frown'}, {at: '065', off: 50, len: 40, g: 'point'}], {s: 1.02}),
			hero(300, [{at: '065', off: 0, len: 90, expr: 'worried'}, {at: '065', off: 30, len: 50, g: 'scratch'}], {item: 'clip', face: 1}),
		],
		hud: ({f, at}) => <Accent text="NOT OUT LOUD" t={f - at('065') - 40} dur={50} y={880} c="#ff9a6a" />,
	}),
	// 066 — a light turned on in room 312
	shot('066', {
		bg: '#04080e',
		cam: [
			[480, 580, 1.3],
			[900, 560, 1.7],
		],
		back: ({f, at}) => <Ward f={f} dark={0.5} flicker={0.9} light312={Math.min(1, Math.max(0, (f - at('066') - 90) / 14))} />,
		actors: [dennisAt(420, [{at: '066', off: 0, len: 150, look: [1, 0]}, {at: '066', off: 0, len: 150, face: 1}], {s: 1.1, z: 1})],
		world: ({f, at}) => <Callout f={f} t0={at('066') + 96} t1={at('066') + 150} from={[920, 560]} to={[1120, 400]} text="ROOM 312" c="#ffe08a" />,
		flashes: [],
	}, {whip: true}),
	// 067 — Room 312, flashlight
	shot('067', {
		bg: '#04080e',
		cam: [
			[500, 600, 1.7],
			[860, 580, 1.5],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={0.9} light312={1} />,
		actors: [hero(160, [{at: '067', off: 30, len: 120, walk: [160, 700], speed: 0.28}], {item: 'flash', face: 1})],
		world: ({f, pos}) => <Beam x={pos.hero.x + 70} y={pos.hero.headY + 190} angle={4} len={760} w={240} o={0.55} id="bm67" />,
		hud: ({f, at}) => <Caption f={f} from={at('067') + 2} to={at('067') + 40} top={190} lines={['ROOM 312']} size={96} c="#ffe08a" />,
	}),
	// 068 — nobody followed me
	shot('068', {
		bg: '#04080e',
		cam: [
			[420, 590, 1.4],
			[900, 590, 1.2],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={0.9} light312={1} />,
		actors: [
			hero(520, [{at: '068', off: 0, len: 40, walk: [520, 760], speed: 0.3}, {at: '068', off: 20, len: 25, look: [-0.9, 0]}], {item: 'flash', face: 1}),
			...[0, 1, 2, 3].map((i): ActorSpec => ({id: 'bk' + i, who: 'nurse', x: 60 + i * 64, s: 0.82, still: true, face: 1, props: {hair: (['bun', 'short', 'ponytail', 'bob'] as const)[i]}})),
		],
		world: ({f, pos}) => <Beam x={pos.hero.x + 70} y={pos.hero.headY + 190} angle={4} len={640} w={200} o={0.5} id="bm68" />,
		hud: ({f, at}) => <Accent text="NOBODY FOLLOWED ME" t={f - at('068') - 4} dur={46} y={880} />,
	}),
	// 069 — disinfectant and something sweeter, old flowers
	shot('069', {
		bg: '#04080e',
		cam: [
			[640, 580, 1.9],
			[700, 570, 2.3],
		],
		back: WardBack(0.5, 1),
		actors: [hero(640, [{at: '069', off: 0, len: 150, expr: 'wide'}, {at: '069', off: 10, len: 60, head: -12}, {at: '069', off: 80, len: 60, mouth: 'smile'}], {item: 'flash', face: 1})],
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('069') + 6} t1={at('069') + 80} from={[560, 700]} to={[320, 560]} text="DISINFECTANT" />
				<Callout f={f} t0={at('069') + 70} t1={at('069') + 140} from={[800, 520]} to={[1000, 330]} text="...OLD FLOWERS" c="#ff9ac0" />
				{Array.from({length: 10}).map((_, i) => (
					<ellipse key={i} cx={900 + ((i * 97 + f * 0.8) % 500)} cy={300 + ((i * 53 + f * 1.4) % 420)} rx={9} ry={5} fill="#ff9ac0" opacity={0.7} transform={`rotate(${f * 3 + i * 40} ${900 + i * 40} ${400 + i * 20})`} />
				))}
			</>
		),
	}),
	// 070 — tiles squeaked under my shoes
	shot('070', {
		bg: '#04080e',
		cam: [
			[640, 820, 3.0],
			[900, 820, 3.0],
		],
		back: WardBack(0.5, 1),
		actors: [hero(520, [{at: '070', off: 0, len: 120, walk: [520, 980], speed: 0.4}], {item: 'flash', face: 1})],
		world: ({f, at}) =>
			[0, 1, 2].map((i) => (
				<Pop key={i} t={f - (at('070') + 14 + i * 26)} x={620 + i * 150} y={760} s={0.8}>
					<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={54} fill="#ffe9a8" stroke="#04080e" strokeWidth={6} paintOrder="stroke">
						SQUEAK
					</text>
				</Pop>
			)),
	}),
	// 071 — halfway there I heard a voice
	shot('071', {
		bg: '#04080e',
		cam: [
			[700, 590, 1.6],
			[740, 585, 2.1],
		],
		back: WardBack(0.5, 1),
		actors: [hero(720, [{at: '071', off: 0, len: 30, walk: [620, 720], speed: 0.3}, {at: '071', off: 30, len: 60, g: 'stop'}, {at: '071', off: 30, len: 60, expr: 'wide'}, {at: '071', off: 30, len: 60, head: -10}], {item: 'flash', face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('071') + 36} to={at('071') + 90} top={190} lines={['?!']} size={140} c="#ffe08a" />,
	}),
	// 072 — a woman humming softly
	shot('072', {
		bg: '#04080e',
		cam: [
			[880, 520, 1.8],
			[940, 500, 2.2],
		],
		back: WardBack(0.5, 1),
		actors: [hero(560, [{at: '072', off: 0, len: 80, look: [0.9, 0]}, {at: '072', off: 0, len: 80, head: -8}], {item: 'flash', face: 1})],
		world: ({f, at}) => <Notes f={f} x={930} y={520} t0={at('072')} t1={at('072') + 70} />,
	}),
	// 073 — a lullaby, slow and out of tune
	shot('073', {
		bg: '#04080e',
		cam: [
			[780, 560, 1.7],
			[900, 520, 2.1],
		],
		back: WardBack(0.5, 1),
		actors: [hero(600, [{at: '073', off: 0, len: 90, look: [0.9, 0]}, {at: '073', off: 0, len: 90, sway: 0.9}, {at: '073', off: 20, len: 60, expr: 'worried'}], {item: 'flash', face: 1})],
		world: ({f, at}) => (
			<>
				<Notes f={f} x={930} y={520} t0={at('073')} t1={at('073') + 80} wobble={2.2} />
				<Notes f={f + 17} x={880} y={560} t0={at('073')} t1={at('073') + 80} wobble={1.6} />
			</>
		),
		hud: ({f, at}) => <Accent text="OUT OF TUNE" t={f - at('073') - 30} dur={50} y={880} />,
	}),
	// 074 — I stopped outside the door
	shot('074', {
		bg: '#04080e',
		cam: [
			[780, 600, 1.8],
			[860, 590, 2.3],
		],
		back: WardBack(0.5, 1),
		actors: [hero(740, [{at: '074', off: 0, len: 40, walk: [640, 740], speed: 0.3}, {at: '074', off: 40, len: 30, g: 'stop'}], {item: 'flash', face: 1})],
		shake: [{at: '074', off: 40, len: 5}],
	}),
	// 075 — open about a hand's width
	shot('075', {
		bg: '#04080e',
		cam: [
			[900, 600, 2.4],
			[930, 610, 3.2],
		],
		back: WardBack(0.45, 1),
		actors: [hero(740, [{at: '075', off: 0, len: 90, expr: 'worried'}, {at: '075', off: 20, len: 60, reach: [930, 640], side: 'B'}], {item: 'flash', face: 1})],
		world: ({f, at}) => <Callout f={f} t0={at('075') + 10} t1={at('075') + 75} from={[930, 620]} to={[1130, 420]} text="A HAND'S WIDTH" c="#ffe08a" />,
	}),
	// 076 — I pushed it with two fingers
	shot('076', {
		bg: '#04080e',
		cam: [
			[880, 620, 2.6],
			[960, 600, 2.1],
		],
		back: ({f, at}) => <Ward f={f} dark={0.45} flicker={0.8} light312={1} />,
		actors: [hero(740, [{at: '076', off: 6, len: 60, reach: [930, 640], side: 'F'}, {at: '076', off: 6, len: 60, hand: 'point'}, {at: '076', off: 40, len: 50, expr: 'wide'}], {face: 1})],
		hud: ({f, at}) => <Accent text="TWO FINGERS" t={f - at('076') - 6} dur={46} y={880} />,
		flashes: [],
	}),
	// 077 — a nurse at the foot of a bed with a clipboard, her back to me
	shot('077', {
		bg: '#03060c',
		cam: [
			[700, 600, 1.2],
			[1100, 590, 1.6],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [
			hero(-200, [{at: '077', off: 20, len: 70, walk: [-200, 420], speed: 0.28}, {at: '077', off: 90, len: 60, expr: 'wide'}], {item: 'flash', face: 1}),
			ghost(1060, [{at: '077', off: 40, len: 120, reach: [1140, 760], side: 'F'}]),
		],
		world: ({f}) => (
			<g>
				<defs>
					<radialGradient id="gl77">
						<stop offset={0} stopColor="#bfe9ff" stopOpacity={0.35} />
						<stop offset={1} stopColor="#bfe9ff" stopOpacity={0} />
					</radialGradient>
				</defs>
				<ellipse cx={1060} cy={640} rx={260} ry={340} fill="url(#gl77)" />
			</g>
		),
		hud: ({f, at}) => <Accent text="HER BACK TO ME" t={f - at('077') - 60} dur={60} y={880} />,
	}, {whip: true}),
	// 078 — white uniform, old-fashioned, small cap
	shot('078', {
		bg: '#03060c',
		cam: [
			[1060, 580, 2.2],
			[1060, 560, 2.8],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '078', off: 0, len: 150, reach: [1140, 760], side: 'F'}])],
		world: ({f, at, pos}) => (
			<>
				<Callout f={f} t0={at('078') + 36} t1={at('078') + 120} from={[1050, pos.ghost.headY - 70]} to={[820, pos.ghost.headY - 210]} text="SMALL CAP" c="#bfe9ff" />
				<Callout f={f} t0={at('078') + 8} t1={at('078') + 90} from={[1040, pos.ghost.headY + 200]} to={[790, pos.ghost.headY + 340]} text="OLD-FASHIONED WHITE UNIFORM" c="#bfe9ff" />
			</>
		),
	}),
	// 079 — the kind I had only seen in photographs
	shot('079', {
		bg: '#03060c',
		cam: [
			[900, 560, 1.3],
			[1000, 560, 1.6],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(520, [{at: '079', off: 0, len: 70, g: 'rubChin'}, {at: '079', off: 0, len: 70, expr: 'wide'}], {item: 'flash', face: 1}), ghost(1060, [{at: '079', off: 0, len: 70, reach: [1140, 760], side: 'F'}])],
		world: ({f, at}) => (
			<g transform="translate(1500,330) rotate(5)" opacity={Math.min(1, (f - at('079') - 6) / 10)}>
				<rect x={-130} y={-160} width={260} height={320} fill="#efe4c8" stroke="#8a7a58" strokeWidth={6} />
				<rect x={-110} y={-140} width={220} height={240} fill="#b9a982" />
				<circle cx={0} cy={-50} r={40} fill="#4a3f2e" />
				<path d="M-70,100 Q-70,10 0,10 Q70,10 70,100Z" fill="#e8e0cc" />
				<text y={140} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={40} fill="#3a3020">
					1954
				</text>
			</g>
		),
		hud: ({f, at}) => <Accent text="ONLY SEEN IN OLD PHOTOS" t={f - at('079') - 6} dur={60} y={880} />,
	}),
	// 080 — empty bed, writing on the chart anyway, nodding
	shot('080', {
		bg: '#03060c',
		cam: [
			[1180, 600, 1.5],
			[1000, 600, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [
			ghost(1060, [
				{at: '080', off: 0, len: 170, reach: [1130, 765], side: 'F'},
				{at: '080', off: 30, len: 14, head: 10},
				{at: '080', off: 70, len: 14, head: 10},
				{at: '080', off: 110, len: 14, head: 10},
				{at: '080', off: 150, len: 14, head: 10},
			]),
		],
		world: ({f, at}) => <Callout f={f} t0={at('080') + 10} t1={at('080') + 70} from={[1400, 660]} to={[1500, 440]} text="EMPTY BED" />,
		hud: ({f, at}) => <Accent text="WRITING ANYWAY" t={f - at('080') - 100} dur={60} y={880} />,
	}),
	// 081 — excuse me
	shot('081', {
		bg: '#03060c',
		cam: [
			[700, 590, 1.5],
			[880, 585, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(520, [{at: '081', off: 0, len: 50, walk: [440, 560], speed: 0.25}, {at: '081', off: 20, len: 40, g: 'wave'}, {at: '081', off: 20, len: 50, mouth: 'open'}], {face: 1}), ghost(1060, [{at: '081', off: 0, len: 90, reach: [1130, 765], side: 'F'}])],
	}),
	// 082 — the humming stopped
	shot('082', {
		bg: '#03060c',
		cam: [
			[1060, 570, 2.0],
			[1060, 565, 2.6],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '082', off: 6, len: 60, reach: [1130, 765], side: 'F'}])],
		world: ({f, at}) => <Notes f={f} x={1180} y={520} t0={at('082') - 10} t1={at('082') + 8} />,
		hud: ({f, at}) => <Accent text="(silence)" t={f - at('082') - 6} dur={46} y={880} />,
	}),
	// 083 — she didn't turn around
	shot('083', {
		bg: '#03060c',
		cam: [
			[900, 570, 1.5],
			[1020, 570, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '083', off: 0, len: 60, expr: 'worried'}, {at: '083', off: 10, len: 40, sway: 1.1}], {face: 1}), ghost(1060, [{at: '083', off: 0, len: 60, reach: [1130, 765], side: 'F'}])],
		shake: [{at: '083', off: 6, len: 5}],
	}),
	// 084 — she tilted her head, as if listening to something far away
	shot('084', {
		bg: '#03060c',
		cam: [
			[1040, 570, 2.5],
			[1000, 560, 3.0],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '084', off: 6, len: 100, head: 20}, {at: '084', off: 6, len: 100, look: [0.3, -0.8]}, {at: '084', off: 0, len: 110, reach: [1130, 765], side: 'F'}])],
		hud: ({f, at}) => <Accent text="LISTENING TO SOMETHING FAR AWAY" t={f - at('084') - 10} dur={90} y={880} c="#bfe9ff" />,
	}),
	// 085 — you're early tonight, Marcus
	shot('085', {
		bg: '#03060c',
		camPos: ({sp}) => (sp === 'GHOST' ? [1040, 570, 2.6] : [900, 580, 1.8]),
		cam: [1000, 580, 2.0],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [
			ghost(1060, [{at: '085', off: 54, len: 80, turn: 0.2}, {at: '085', off: 54, len: 80, face: -1}]),
			hero(560, [{at: '085', off: 70, len: 90, expr: 'wide'}, {at: '085', off: 70, len: 20, lean: -14}], {face: 1}),
		],
		hud: ({f, at}) => <Caption f={f} from={at('085') + 66} to={at('085') + 120} top={190} lines={["“YOU'RE EARLY TONIGHT, MARCUS”"]} size={60} c="#bfe9ff" />,
		shake: [{at: '085', off: 72, len: 10}],
	}),
	// 086 — I had not given her my name
	shot('086', {
		bg: '#03060c',
		cam: [
			[600, 575, 2.4],
			[560, 570, 3.0],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '086', off: 0, len: 80, expr: 'wide'}, {at: '086', off: 0, len: 80, sway: 1.8}, {at: '086', off: 20, len: 60, g: 'handsOnHead'}], {face: 1}), ghost(1060, [], {face: -1})],
		world: ({f, at}) => <Callout f={f} t0={at('086') + 24} t1={at('086') + 80} from={[580, 540]} to={[860, 360]} text="I NEVER TOLD HER" c="#ff6a6a" />,
	}),
	// 087 — I stepped back so fast I hit the doorframe
	shot('087', {
		bg: '#03060c',
		cam: [
			[800, 590, 1.2],
			[450, 590, 1.7],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(700, [{at: '087', off: 4, len: 26, run: [700, 330], speed: 0.6}, {at: '087', off: 30, len: 20, squash: 0.1}, {at: '087', off: 30, len: 40, expr: 'wide'}], {face: -1}), ghost(1060, [], {face: -1})],
		world: ({f, at}) => (
			<>
				<rect x={240} y={200} width={26} height={700} fill="#8a6a4a" />
				<Pop t={f - (at('087') + 28)} x={330} y={420} s={0.9}>
					<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={80} fill="#ffc94a" stroke="#03060c" strokeWidth={7} paintOrder="stroke">
						BAM!
					</text>
				</Pop>
			</>
		),
		shake: [{at: '087', off: 28, len: 12}],
	}),
	// 088 — the nurse didn't move
	shot('088', {
		bg: '#03060c',
		cam: [
			[1060, 580, 1.7],
			[1060, 575, 2.2],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '088', off: 0, len: 60, reach: [1130, 765], side: 'F'}], {face: -1}), hero(420, [{at: '088', off: 0, len: 60, expr: 'worried'}, {at: '088', off: 0, len: 60, sway: 1}], {face: 1})],
	}),
	// 089 — she just kept writing
	shot('089', {
		bg: '#03060c',
		cam: [
			[1100, 650, 2.6],
			[1080, 660, 3.2],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '089', off: 0, len: 80, reach: [1140, 765], side: 'F'}, {at: '089', off: 0, len: 80, reach: [1100 + Math.sin(0) * 10, 790], side: 'B'}], {face: -1})],
		hud: ({f, at}) => <Accent text="…KEPT WRITING" t={f - at('089') - 4} dur={46} y={880} c="#bfe9ff" />,
	}),
	// 090 — the pen scratching against paper
	shot('090', {
		bg: '#03060c',
		cam: [
			[1140, 740, 3.4],
			[1150, 750, 4.0],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [ghost(1060, [{at: '090', off: 0, len: 60, reach: [1140, 765], side: 'F'}], {face: -1})],
		world: ({f, at}) => (
			<>
				{[0, 1, 2].map((i) => (
					<Pop key={i} t={f - (at('090') + 4 + i * 14)} x={1020 + i * 50} y={700 - (i % 2) * 40} s={0.6}>
						<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={44} fill="#ffe9a8" stroke="#03060c" strokeWidth={5} paintOrder="stroke">
							SCRATCH
						</text>
					</Pop>
				))}
			</>
		),
		shake: [{at: '090', off: 0, len: 50}],
	}),
	// 091 — the sound too loud in the silence
	shot('091', {
		bg: '#03060c',
		cam: [
			[560, 580, 2.3],
			[560, 575, 2.7],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '091', off: 0, len: 90, g: 'handsOnHead'}, {at: '091', off: 0, len: 90, expr: 'worried'}], {face: 1}), ghost(1060, [], {face: -1})],
		world: ({f, at}) => (
			<g>
				{[0, 1, 2].map((i) => {
					const u = ((f - at('091')) / 28 + i / 3) % 1;
					return <circle key={i} cx={560} cy={560} r={90 + u * 340} fill="none" stroke="#bfe9ff" strokeWidth={5} opacity={(1 - u) * 0.5} />;
				})}
			</g>
		),
		shake: [{at: '091', off: 0, len: 40}],
	}),
	// 092 — I remembered the rule
	shot('092', {
		bg: '#03060c',
		cam: [
			[560, 560, 2.2],
			[600, 540, 2.6],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '092', off: 0, len: 60, g: 'think'}, {at: '092', off: 0, len: 60, look: [0, -0.8]}], {face: 1})],
		world: ({f, at}) => (
			<g transform="translate(760,330) rotate(4)" opacity={Math.min(1, (f - at('092') - 6) / 10)}>
				<rect x={-90} y={-100} width={180} height={200} fill="#ffe14a" />
				{[0, 1, 2, 3].map((i) => (
					<path key={i} d={`M-60,${-50 + i * 34} q20,-9 40,0 t40,0 t30,-2`} stroke="#222" strokeWidth={4} fill="none" />
				))}
			</g>
		),
	}),
	// 093 — never ask her name
	shot('093', {
		bg: '#03060c',
		cam: [
			[1000, 570, 1.5],
			[1000, 570, 1.9],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '093', off: 0, len: 50, g: 'stop'}, {at: '093', off: 0, len: 50, expr: 'worried'}], {face: 1}), ghost(1060, [], {face: -1})],
		hud: ({f, at}) => <Caption f={f} from={at('093') + 4} to={at('093') + 50} top={170} lines={['NEVER ASK', 'HER NAME']} size={100} c="#ff5a5a" />,
		shake: [{at: '093', off: 4, len: 8}],
	}),
	// 094 — so I asked something else
	shot('094', {
		bg: '#03060c',
		cam: [
			[640, 580, 1.8],
			[760, 575, 1.5],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(560, [{at: '094', off: 0, len: 40, g: 'rubChin'}, {at: '094', off: 30, len: 30, walk: [560, 640], speed: 0.26}, {at: '094', off: 40, len: 30, g: 'point'}], {face: 1}), ghost(1060, [], {face: -1})],
		hud: ({f, at}) => <Caption f={f} from={at('094') + 28} to={at('094') + 66} top={190} lines={['…SOMETHING ELSE']} size={72} />,
	}),
	// 095 — what are you charting?
	shot('095', {
		bg: '#03060c',
		cam: [
			[780, 580, 1.6],
			[900, 575, 2.0],
		],
		back: ({f}) => <Room f={f} lit={0.55} empty />,
		actors: [hero(640, [{at: '095', off: 0, len: 50, g: 'point'}, {at: '095', off: 0, len: 50, expr: 'wide'}], {face: 1}), ghost(1060, [], {face: -1})],
		hud: ({f, at}) => <Caption f={f} from={at('095') + 2} to={at('095') + 40} top={170} lines={['WHAT ARE YOU', 'CHARTING?']} size={84} c="#ffc94a" />,
	}),
	// 096 — the pen stopped
	shot('096', {
		bg: '#03060c',
		cam: [
			[1130, 740, 3.0],
			[1130, 740, 3.6],
		],
		back: ({f}) => <Room f={f} lit={0.5} empty />,
		actors: [ghost(1060, [{at: '096', off: 0, len: 40, reach: [1140, 765], side: 'F'}], {face: -1})],
		hud: ({f, at}) => <Accent text="THE PEN STOPPED" t={f - at('096') - 4} dur={40} y={880} />,
		shake: [{at: '096', off: 4, len: 6}],
	}),
	// 097 — the room grew cold instantly
	shot('097', {
		bg: '#03060c',
		cam: [
			[800, 590, 1.3],
			[860, 580, 1.55],
		],
		back: ({f}) => <Room f={f} lit={0.5} empty />,
		front: ({f, at}) => (
			<Layer depth={0.9} sharp>
				<Svg>
					<Frost f={f} t0={at('097')} />
				</Svg>
			</Layer>
		),
		actors: [hero(560, [{at: '097', off: 0, len: 90, sway: 2.2}, {at: '097', off: 0, len: 90, g: 'armsCrossed'}, {at: '097', off: 20, len: 70, expr: 'worried'}], {face: 1}), ghost(1060, [], {face: -1})],
		hud: ({f, at}) => <Accent text="❄ COLD" t={f - at('097') - 10} dur={60} y={880} c="#9ad8ff" />,
	}),
	// 098 — like a freezer
	shot('098', {
		bg: '#03060c',
		cam: [
			[700, 760, 1.6],
			[900, 700, 1.4],
		],
		back: ({f}) => <Room f={f} lit={0.5} empty />,
		front: ({f, at}) => (
			<Layer depth={0.95} sharp>
				<Svg>
					<Fog f={f} />
					<Frost f={f} t0={0} />
				</Svg>
			</Layer>
		),
		actors: [hero(560, [{at: '098', off: 0, len: 120, sway: 2.2}, {at: '098', off: 0, len: 120, g: 'armsCrossed'}], {face: 1}), ghost(1060, [], {face: -1})],
		world: ({f, at}) => <Callout f={f} t0={at('098') + 10} t1={at('098') + 110} from={[700, 840]} to={[960, 360]} text="LIKE OPENING A FREEZER" c="#9ad8ff" />,
	}),
	// 099 — she slowly lowered the clipboard
	shot('099', {
		bg: '#03060c',
		cam: [
			[1060, 640, 2.2],
			[1030, 620, 2.6],
		],
		back: ({f}) => <Room f={f} lit={0.5} empty />,
		front: ({f}) => (
			<Layer depth={0.95} sharp>
				<Svg>
					<Frost f={f} t0={0} />
				</Svg>
			</Layer>
		),
		actors: [ghost(1060, [{at: '099', off: 0, len: 70, reach: [1140, 765], side: 'F'}, {at: '099', off: 0, len: 70, g: 'presentF'}, {at: '099', off: 20, len: 60, face: -1}], {face: -1})],
	}),
	// 100 — "Oh," she whispered
	shot('100', {
		bg: '#03060c',
		cam: [
			[1020, 570, 2.4],
			[1000, 565, 2.9],
		],
		back: ({f}) => <Room f={f} lit={0.5} empty />,
		actors: [ghost(1060, [{at: '100', off: 0, len: 60, turn: 0.6}, {at: '100', off: 0, len: 60, face: -1}, {at: '100', off: 4, len: 50, expr: 'sad'}]), hero(560, [{at: '100', off: 0, len: 60, expr: 'wide'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('100') + 4} to={at('100') + 44} top={190} lines={['“OH…”']} size={110} c="#bfe9ff" />,
	}),
	// 101 — you shouldn't have asked that
	shot('101', {
		bg: '#03060c',
		cam: [
			[900, 575, 1.7],
			[900, 570, 2.3],
		],
		back: ({f}) => <Room f={f} lit={0.45} empty />,
		actors: [ghost(1060, [{at: '101', off: 0, len: 60, turn: 0.6}, {at: '101', off: 0, len: 60, expr: 'angry'}], {face: -1}), hero(560, [{at: '101', off: 0, len: 60, expr: 'wide'}, {at: '101', off: 0, len: 60, sway: 2.4}, {at: '101', off: 10, len: 40, g: 'handsOnHead'}], {face: 1})],
		hud: ({f, at}) => <Accent text="YOU SHOULDN'T HAVE ASKED" t={f - at('101') - 4} dur={46} y={880} c="#ff5a5a" />,
		shake: [{at: '101', off: 6, len: 14}],
	}),
	// 102 — then the light in the room went out
	shot('102', {
		bg: '#000',
		cam: [
			[900, 580, 1.4],
			[900, 575, 1.7],
		],
		back: ({f, at}) => <Room f={f} lit={Math.max(0, 0.45 - (f - at('102') - 18) / 10)} empty />,
		actors: [ghost(1060, [], {face: -1}), hero(560, [{at: '102', off: 0, len: 50, g: 'handsOnHead'}, {at: '102', off: 0, len: 50, expr: 'wide'}], {face: 1})],
		hud: ({f, at}) => <div style={{position: 'absolute', inset: 0, background: '#000', opacity: Math.min(0.96, Math.max(0, (f - at('102') - 30) / 6))}} />,
		flashes: [],
	}),
	// 103 — I ran
	shot('103', {
		bg: '#04080e',
		cam: [
			[500, 590, 1.2],
			[300, 590, 1.35],
		],
		back: ({f}) => <Ward f={f} dark={0.5} flicker={1} light312={0} />,
		actors: [hero(1100, [{at: '103', off: 0, len: 40, run: [1100, -300], speed: 0.65}], {face: -1, item: 'flash'})],
		hud: ({f, at}) => <Caption f={f} from={at('103') + 2} to={at('103') + 30} top={190} lines={['I RAN']} size={130} c="#ff5a5a" />,
		shake: [{at: '103', off: 0, len: 40}],
	}, {whip: true}),
];
