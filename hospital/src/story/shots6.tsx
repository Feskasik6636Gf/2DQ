import React from 'react';
import {Layer, Svg} from '../engine/camera';
import {Callout, Caption} from '../kit/graphics';
import {Accent} from '../kit/ui';
import {Pop} from '../kit/kit';
import {Archive, ArchiveFront, HospitalExt, Lobby, LobbyFront, Room, Stairs, Station, StationFront, Ward} from './places';
import {ActorSpec, Beat, nurses, shot} from './dsl';
import {clockMin} from './clock';
import {CardBg, FileCard, Paper, ScannerScreen} from './cards';
import type {ShotDef} from '../kit/coverage';
import {hero} from './shots1';
import {staff} from './shots3';
import {ClockHud, PatientBed} from './shots5';

const scrubs = {color: '#3b88d4', outfit: 'scrubs' as const, legColor: '#2f6fb0', shoe: '#e9eef2', age: 0.6};
const OLD = {color: '#7b8089', outfit: 'auditor' as const, legColor: '#2b2d36', shoe: '#1c1a1a'};
const heroS = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => hero(x, beats, {...o, props: {...scrubs, ...(o.props ?? {})}});
const dennisAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'dennis', who: 'dennis', x, face: -1, beats, ...o});
const priyaAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'priya', who: 'priya', x, face: -1, beats, ...o});
const ghostAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'ghost', who: 'ghost', x, face: -1, still: true, beats, ...o});
const adminAt = (x: number, beats: Beat[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id: 'admin', who: 'admin', x, face: -1, beats, ...o});
const AR = ({f}: {f: number}) => <Archive f={f} />;
const ARF = (open = 0) => ({f}: {f: number}) => <ArchiveFront f={f} open={open} />;
const CardOnly = (c = '#0b1020') => () => (
	<Layer depth={1}>
		<Svg>
			<CardBg c={c} />
		</Svg>
	</Layer>
);

/* memory bubble with a tiny icon */
const Mem: React.FC<{kind: string; x: number; y: number; t: number; fade?: number}> = ({kind, x, y, t, fade = 0}) => {
	if (t < 0) return null;
	const o = 1 - fade;
	return (
		<Pop t={t} x={x} y={y} s={1}>
			<g opacity={o}>
				<circle r={86} fill="#fff" stroke="#1a2250" strokeWidth={6} />
				{kind === 'home' && (
					<g>
						<path d="M-46,10 L0,-36 L46,10 L46,48 L-46,48 Z" fill="#e8a24a" />
						<rect x={-10} y={14} width={22} height={34} fill="#7a4a22" />
					</g>
				)}
				{kind === 'car' && (
					<g>
						<path d="M-56,14 L-40,-14 L26,-14 L44,14 L58,18 L58,36 L-58,36 Z" fill="#d94a3a" />
						<circle cx={-30} cy={38} r={12} fill="#222" />
						<circle cx={32} cy={38} r={12} fill="#222" />
					</g>
				)}
				{kind === 'office' && (
					<g>
						<rect x={-50} y={-40} width={100} height={64} fill="#cfd8e6" />
						<rect x={-50} y={-40} width={100} height={10} fill="#fff8c8" />
						<rect x={-60} y={24} width={120} height={14} fill="#6b5236" />
					</g>
				)}
				{kind === 'papers' && (
					<g>
						<rect x={-34} y={-44} width={64} height={84} fill="#f4f0e0" stroke="#999" strokeWidth={2} />
						<rect x={-44} y={-34} width={64} height={84} fill="#fff" stroke="#999" strokeWidth={2} />
						<line x1={-34} y1={-12} x2={10} y2={-12} stroke="#999" strokeWidth={4} />
						<line x1={-34} y1={6} x2={10} y2={6} stroke="#999" strokeWidth={4} />
					</g>
				)}
				{kind === 'invoice' && (
					<g>
						<rect x={-40} y={-46} width={80} height={92} fill="#fff" stroke="#6a8" strokeWidth={4} />
						<text textAnchor="middle" y={-6} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={34} fill="#2a7a4a">
							$
						</text>
						<line x1={-26} y1={16} x2={26} y2={16} stroke="#999" strokeWidth={4} />
					</g>
				)}
				{kind === 'coffee' && (
					<g>
						<rect x={-34} y={-20} width={60} height={60} rx={8} fill="#d96a4a" />
						<path d="M26,-6 q26,6 0,30" stroke="#d96a4a" strokeWidth={8} fill="none" />
					</g>
				)}
				{kind === 'mother' && (
					<g>
						<circle r={44} fill="#222" />
						<text textAnchor="middle" y={22} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={70} fill="#ff6a6a">
							?
						</text>
					</g>
				)}
				{kind === 'cake' && (
					<g>
						<rect x={-44} y={0} width={88} height={44} rx={8} fill="#f2a0c0" />
						<rect x={-6} y={-30} width={12} height={30} fill="#fff" />
						<circle cy={-40} r={9} fill="#ffb02a" />
						<text textAnchor="middle" y={34} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={34} fill="#fff">
							?
						</text>
					</g>
				)}
			</g>
		</Pop>
	);
};

export const SHOTS6: ShotDef[] = [
	// 155 — I decided to check the roster again against the badge records
	shot('155', {
		bg: '#04080e',
		cam: [
			[300, 590, 1.3],
			[1300, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.3} flicker={0.6} />,
		actors: [hero(-200, [{at: '155', off: 0, len: 110, walk: [-200, 1900], speed: 0.4}], {face: 1, item: 'clip'})],
		hud: ({f, at}) => <Accent text="ROSTER vs BADGE RECORDS" t={f - at('155') - 10} dur={100} y={880} />,
	}, {whip: true}),
	// 156a — the administrator's office, the filing cabinet
	shot('156', {
		bg: '#14100c',
		cam: [
			[500, 590, 1.2],
			[700, 590, 1.5],
		],
		back: AR,
		front: ARF(0),
		actors: [hero(-200, [{at: '156', off: 0, len: 60, walk: [-200, 560], speed: 0.3}, {at: '156', off: 60, len: 60, reach: [620, 640], side: 'F'}], {face: 1, item: 'clip'})],
		hud: ({f, at}) => <Accent text="THE ADMINISTRATOR'S OFFICE" t={f - at('156') - 8} dur={70} y={190} />,
	}, {whip: true}),
	// 156b — the drawer opens, personnel folders
	shot(
		'156',
		{
			bg: '#14100c',
			cam: [
				[800, 640, 2.0],
				[700, 680, 2.4],
			],
			back: AR,
			front: ({f, at}) => <ArchiveFront f={f} open={Math.min(1, Math.max(0, (f - at('156') - 90) / 20))} />,
			actors: [hero(560, [{at: '156', off: 80, len: 100, reach: [680, 660], side: 'F'}, {at: '156', off: 100, len: 80, expr: 'wide'}], {face: 1, item: 'clip'})],
			hud: ({f, at}) => <Accent text="PERSONNEL FOLDERS" t={f - at('156') - 120} dur={70} y={880} />,
		},
		{off: 76},
	),
	// 157 — every nurse had one
	shot('157', {
		bg: '#14100c',
		cam: [
			[640, 680, 2.6],
			[720, 700, 3.0],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '157', off: 0, len: 60, reach: [690, 700], side: 'F', osc: [0, 14, 20]}, {at: '157', off: 0, len: 70, look: [0.9, 0.5]}], {face: 1, item: 'clip'})],
	}),
	// 158 — 41 folders in alphabetical order
	shot('158', {
		bg: '#14100c',
		cam: [
			[640, 700, 2.4],
			[820, 700, 2.6],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '158', off: 0, len: 80, reach: [640, 700], side: 'F', osc: [90, 0, 70]}], {face: 1, item: 'clip'})],
		world: ({f, at}) => <Callout f={f} t0={at('158') + 6} t1={at('158') + 70} from={[640, 640]} to={[900, 360]} text="41 FOLDERS · A → Z" c="#ffd34a" />,
	}),
	// 159 — at the end, a 42nd folder, thin and gray, no label
	shot('159', {
		bg: '#14100c',
		cam: [
			[640, 700, 2.4],
			[880, 700, 3.0],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '159', off: 0, len: 90, reach: [820, 700], side: 'F'}, {at: '159', off: 30, len: 80, expr: 'wide'}], {face: 1, item: 'clip'})],
		world: ({f, at}) => <Callout f={f} t0={at('159') + 60} t1={at('159') + 120} from={[820, 680]} to={[1020, 420]} text="#42 · NO LABEL" c="#ff8a6a" />,
	}),
	// 160 — inside, a single sheet, an employee file, a photograph stapled to the corner
	shot('160', {
		bg: '#0d0f16',
		cam: [
			[960, 540, 1.0],
			[960, 500, 1.3],
		],
		back: CardOnly('#10131c'),
		world: ({f, at}) => (
			<FileCard
				f={f}
				t0={at('160') + 8}
				lines={[
					['NAME', 'Marcus Hale, R.N.', at('162') + 4],
					['DEPARTMENT', 'Night Shift · 3rd Floor', at('162') + 40],
					['DATE OF HIRE', '11 years ago', at('163') + 14],
					['TERMINATED', '3 years ago', at('164') + 10],
					['NOTE (other handwriting)', 'deceased on duty — cardiac arrest', at('165') + 12],
					['LOCATION · TIME', 'Stairwell B · 12:00 a.m.', at('166') + 8],
				]}
				stamp={at('165') + 90}
			/>
		),
		hud: ({f, at}) => <Accent text="THE PHOTO STAPLED TO THE CORNER" t={f - at('160') - 120} dur={80} y={890} />,
	}),
	// 161 — it was my face
	shot('161', {
		bg: '#0d0f16',
		cam: [
			[960, 560, 1.4],
			[960, 560, 1.9],
		],
		back: CardOnly('#10131c'),
		world: ({f, at}) => <FileCard f={f} t0={at('160') + 8} lines={[]} />,
		hud: ({f, at}) => <Caption f={f} from={at('161') + 4} to={at('161') + 40} top={170} lines={['IT WAS MY FACE']} size={96} c="#ff6a6a" />,
		shake: [{at: '161', off: 4, len: 14}],
		flashes: ['161'],
	}),
	// 162–166 — the file fills in
	shot('162', {
		bg: '#0d0f16',
		cam: [
			[900, 520, 1.15],
			[1020, 580, 1.5],
		],
		back: CardOnly('#10131c'),
		world: ({f, at}) => (
			<FileCard
				f={f}
				t0={at('160') + 8}
				lines={[
					['NAME', 'Marcus Hale, R.N.', at('162') + 4],
					['DEPARTMENT', 'Night Shift · 3rd Floor', at('162') + 40],
					['DATE OF HIRE', '11 years ago', at('163') + 14],
					['TERMINATED', '3 years ago', at('164') + 10],
					['NOTE (other handwriting)', 'deceased on duty — cardiac arrest', at('165') + 12],
					['LOCATION · TIME', 'Stairwell B · 12:00 a.m.', at('166') + 8],
				]}
				stamp={at('165') + 90}
			/>
		),
		shake: [{at: '165', off: 90, len: 14}],
	}),
	// 167 — my hands went numb
	shot('167', {
		bg: '#14100c',
		cam: [
			[600, 640, 2.4],
			[640, 650, 3.0],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '167', off: 0, len: 60, g: 'presentF'}, {at: '167', off: 0, len: 70, sway: 2.6}, {at: '167', off: 0, len: 70, expr: 'wide'}], {face: 1, item: 'paper'})],
		hud: ({f, at}) => <Accent text="MY HANDS WENT NUMB" t={f - at('167') - 6} dur={50} y={880} />,
	}),
	// 168 — the paper slipped and landed on the floor
	shot('168', {
		bg: '#14100c',
		cam: [
			[620, 700, 2.0],
			[600, 800, 2.4],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '168', off: 0, len: 80, expr: 'wide'}, {at: '168', off: 0, len: 80, sway: 1.8}], {face: 1})],
		world: ({f, at}) => {
			const u = Math.min(1, Math.max(0, (f - at('168') - 20) / 50));
			return (
				<g transform={`translate(${640 + Math.sin(u * 9) * 40},${640 + u * 250}) rotate(${u * 140})`}>
					<rect x={-40} y={-50} width={80} height={100} fill="#f1ecdc" stroke="#8d939a" strokeWidth={3} />
					<circle cx={20} cy={-20} r={14} fill="#111" />
				</g>
			);
		},
		shake: [{at: '168', off: 70, len: 6}],
	}),
	// 169 — I didn't remember being a nurse
	shot('169', {
		bg: '#14100c',
		cam: [
			[560, 560, 2.0],
			[560, 540, 2.5],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(520, [{at: '169', off: 0, len: 70, g: 'think'}, {at: '169', off: 0, len: 70, expr: 'worried'}], {face: 1, props: OLD})],
		world: ({f, at}) => (
			<g transform={`translate(760,330) scale(${Math.min(1, (f - at('169') + 4) / 8)})`}>
				<circle r={100} fill="#fff" stroke="#1a2250" strokeWidth={6} />
				<path d="M-44,10 h88 v30 h-88z" fill="#3b7fd1" />
				<path d="M-22,10 v-34 h44 v34z" fill="#fff" stroke="#3b7fd1" strokeWidth={5} />
				<text textAnchor="middle" y={-4} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={60} fill="#ff4a4a">
					?
				</text>
			</g>
		),
	}),
	// 170 — an apartment, a car, an office with fluorescent lights
	shot('170', {
		bg: '#14100c',
		cam: [
			[640, 520, 1.5],
			[760, 520, 1.5],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '170', off: 0, len: 110, g: 'think'}, {at: '170', off: 0, len: 110, look: [0, -0.8]}], {face: 1})],
		world: ({f, at}) => (
			<>
				<Mem kind="home" x={760} y={300} t={f - (at('170') + 6)} />
				<Mem kind="car" x={960} y={240} t={f - (at('170') + 40)} />
				<Mem kind="office" x={1160} y={300} t={f - (at('170') + 74)} />
			</>
		),
	}),
	// 171 — audits and invoices and coffee
	shot('171', {
		bg: '#14100c',
		cam: [
			[700, 520, 1.5],
			[800, 520, 1.5],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '171', off: 0, len: 90, g: 'think'}, {at: '171', off: 0, len: 90, look: [0, -0.8]}, {at: '171', off: 0, len: 90, mouth: 'smile'}], {face: 1})],
		world: ({f, at}) => (
			<>
				<Mem kind="papers" x={760} y={300} t={f - (at('171') + 4)} />
				<Mem kind="invoice" x={960} y={240} t={f - (at('171') + 30)} />
				<Mem kind="coffee" x={1160} y={300} t={f - (at('171') + 56)} />
			</>
		),
	}),
	// 172 — but I couldn't remember my mother's face or my last birthday
	shot('172', {
		bg: '#14100c',
		cam: [
			[700, 520, 1.5],
			[800, 520, 1.5],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '172', off: 0, len: 110, g: 'scratch'}, {at: '172', off: 0, len: 110, expr: 'worried'}], {face: 1})],
		world: ({f, at}) => (
			<>
				<Mem kind="mother" x={820} y={300} t={f - (at('172') + 6)} />
				<Mem kind="cake" x={1100} y={300} t={f - (at('172') + 50)} />
			</>
		),
		hud: ({f, at}) => <Accent text="…EMPTY" t={f - at('172') - 70} dur={40} y={880} c="#ff9a6a" />,
	}),
	// 173a — any day before 11 p.m.: a blank timeline
	shot('173', {
		bg: '#14100c',
		cam: [
			[900, 560, 1.2],
			[900, 560, 1.4],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '173', off: 0, len: 130, look: [0, 0.4], head: 10}, {at: '173', off: 0, len: 130, expr: 'sad'}], {face: 1})],
		world: ({f, at}) => {
			const t = f - at('173');
			const k = Math.min(1, t / 40);
			return (
				<g opacity={k}>
					<line x1={700} y1={260} x2={1500} y2={260} stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeDasharray="14 14" opacity={0.6} />
					<line x1={1500} y1={260} x2={1780} y2={260} stroke="#ffc94a" strokeWidth={10} strokeLinecap="round" />
					<circle cx={1500} cy={260} r={18} fill="#ffc94a" />
					<text x={1500} y={216} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={34} fill="#ffc94a">
						11 P.M.
					</text>
					<text x={1100} y={322} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={40} fill="#cfd6f0" opacity={0.8}>
						? ? ? ? ?
					</text>
				</g>
			);
		},
	}),
	// 173b — behind me, a floorboard creaked
	shot(
		'173',
		{
			bg: '#0d0a08',
			cam: [
				[700, 590, 1.7],
				[640, 585, 2.2],
			],
			back: AR,
			front: ARF(1),
			actors: [hero(520, [{at: '173', off: 150, len: 60, g: 'stop'}, {at: '173', off: 150, len: 70, expr: 'wide'}, {at: '173', off: 150, len: 70, sway: 1.6}], {face: 1})],
			hud: ({f, at}) => <Caption f={f} from={at('173') + 150} to={at('173') + 210} top={170} lines={['*CREAK*']} size={120} c="#ffd34a" />,
			shake: [{at: '173', off: 150, len: 10}],
		},
		{off: 146},
	),
	// 174 — I turned around
	shot('174', {
		bg: '#0d0a08',
		cam: [
			[620, 585, 2.2],
			[700, 585, 2.0],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '174', off: 0, len: 12, face: 1}, {at: '174', off: 12, len: 30, face: -1}, {at: '174', off: 10, len: 30, turn: 0.1}, {at: '174', off: 0, len: 40, expr: 'wide'}], {face: 1})],
	}),
	// 175 — the old-fashioned nurse in the doorway
	shot('175', {
		bg: '#0d0a08',
		cam: [
			[900, 590, 1.3],
			[1300, 590, 1.6],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(520, [{at: '175', off: 0, len: 60, expr: 'wide'}], {face: -1}), ghostAt(1640, [], {s: 1.05})],
		world: () => (
			<g>
				<defs>
					<radialGradient id="gl175">
						<stop offset={0} stopColor="#bfe9ff" stopOpacity={0.4} />
						<stop offset={1} stopColor="#bfe9ff" stopOpacity={0} />
					</radialGradient>
				</defs>
				<ellipse cx={1640} cy={640} rx={260} ry={400} fill="url(#gl175)" />
			</g>
		),
	}),
	// 176 — the white cap tilted
	shot('176', {
		bg: '#0d0a08',
		cam: [
			[1620, 560, 2.6],
			[1600, 550, 3.2],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1640, [{at: '176', off: 6, len: 40, head: 18}], {s: 1.05})],
	}),
	// 177 — her face finally lifted into the light
	shot('177', {
		bg: '#0d0a08',
		cam: [
			[1600, 570, 2.8],
			[1560, 560, 3.4],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1640, [{at: '177', off: 10, len: 60, head: -14}, {at: '177', off: 10, len: 60, expr: 'sad'}, {at: '177', off: 10, len: 60, turn: 0.55}], {s: 1.05})],
		hud: ({f, at}) => <Accent text="INTO THE LIGHT" t={f - at('177') - 8} dur={50} y={880} c="#bfe9ff" />,
	}),
	// 178 — she looked exactly like Priya, 30 years older
	shot('178', {
		bg: '#0d0a08',
		cam: [
			[1100, 580, 1.8],
			[1080, 575, 2.2],
		],
		back: AR,
		front: ARF(1),
		actors: [priyaAt(940, [{at: '178', off: 0, len: 150, expr: 'normal'}, {at: '178', off: 0, len: 150, face: -1}], {s: 1.02}), ghostAt(1250, [{at: '178', off: 0, len: 150, turn: 0.5}], {s: 1.02, props: {age: 1}})],
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('178') + 6} t1={at('178') + 60} from={[940, 460]} to={[760, 260]} text="PRIYA" c="#7dd0ff" />
				<Callout f={f} t0={at('178') + 30} t1={at('178') + 100} from={[1250, 460]} to={[1420, 260]} text="30 YEARS OLDER" c="#bfe9ff" />
			</>
		),
	}),
	// 179 — you always come back, she said kindly
	shot('179', {
		bg: '#0d0a08',
		cam: [
			[1140, 580, 2.1],
			[1160, 575, 2.5],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '179', off: 0, len: 60, expr: 'wide'}, {at: '179', off: 0, len: 60, sway: 1.1}], {face: 1, props: OLD}), ghostAt(1250, [{at: '179', off: 0, len: 60, mouth: 'smile'}, {at: '179', off: 0, len: 60, turn: 0.45}], {s: 1.02})],
		hud: ({f, at}) => <Accent text="“YOU ALWAYS COME BACK”" t={f - at('179') - 4} dur={50} y={880} c="#bfe9ff" />,
	}),
	// 180 — every night you arrive as someone new
	shot('180', {
		bg: '#0d0a08',
		cam: [
			[1160, 580, 2.2],
			[1200, 575, 2.6],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1250, [{at: '180', off: 0, len: 60, mouth: 'smile'}, {at: '180', off: 0, len: 50, g: 'presentF'}], {s: 1.02}), heroS(800, [], {face: 1, props: OLD})],
		hud: ({f, at}) => <Caption f={f} from={at('180') + 6} to={at('180') + 50} top={170} lines={['EVERY NIGHT —', 'SOMEONE NEW']} size={74} c="#bfe9ff" />,
	}),
	// 181 — an auditor, a visitor
	shot('181', {
		bg: '#0d0a08',
		cam: [
			[960, 590, 1.5],
			[960, 580, 1.7],
		],
		back: AR,
		front: ARF(1),
		actors: [
			{id: 'v1', who: 'hero', x: 760, face: 1, hidden: true, props: OLD, beats: [{at: '181', off: 4, len: 1, hide: false}, {at: '181', off: 4, len: 40, hop: 18}, {at: '181', off: 4, len: 60, mouth: 'smile'}]},
			{id: 'v2', who: 'hero', x: 1130, face: 1, hidden: true, item: 'badge', props: {color: '#9a8cd6', outfit: 'tee', hair: 'cap'}, beats: [{at: '181', off: 36, len: 1, hide: false}, {at: '181', off: 36, len: 40, hop: 18}, {at: '181', off: 36, len: 60, mouth: 'smile'}]},
		],
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('181') + 10} t1={at('181') + 60} from={[760, 400]} to={[600, 230]} text="AN AUDITOR" c="#ffd34a" />
				<Callout f={f} t0={at('181') + 42} t1={at('181') + 70} from={[1130, 400]} to={[1330, 230]} text="A VISITOR" c="#9a8cd6" />
			</>
		),
	}),
	// 182 — a repairman, and every night you try to count us
	shot('182', {
		bg: '#0d0a08',
		cam: [
			[960, 590, 1.35],
			[960, 570, 1.55],
		],
		back: AR,
		front: ARF(1),
		actors: [
			{id: 'v1', who: 'hero', x: 640, face: 1, props: OLD, beats: []},
			{id: 'v2', who: 'hero', x: 920, face: 1, item: 'badge', props: {color: '#9a8cd6', outfit: 'tee', hair: 'cap'}, beats: []},
			{id: 'v3', who: 'hero', x: 1200, face: 1, hidden: true, item: 'marker', props: {color: '#d98a2b', outfit: 'apron', hair: 'cap', hairColor: '#4a3a22'}, beats: [{at: '182', off: 4, len: 1, hide: false}, {at: '182', off: 4, len: 40, hop: 18}]},
		],
		world: ({f, at}) => (
			<>
				<Callout f={f} t0={at('182') + 8} t1={at('182') + 58} from={[1200, 400]} to={[1400, 230]} text="A REPAIRMAN" c="#d98a2b" />
				{Array.from({length: 4}).map((_, i) => (
					<Pop key={i} t={f - (at('182') + 70 + i * 10)} x={620 + i * 220} y={250} s={0.9}>
						<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={70} fill="#ffc94a" stroke="#0d0a08" strokeWidth={6} paintOrder="stroke">
							{i + 1}
						</text>
					</Pop>
				))}
			</>
		),
	}),
	// 183 — why? my voice cracked
	shot('183', {
		bg: '#0d0a08',
		cam: [
			[760, 580, 2.3],
			[740, 575, 2.8],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '183', off: 0, len: 80, expr: 'worried'}, {at: '183', off: 0, len: 80, sway: 2.2}], {face: 1, props: OLD}), ghostAt(1250, [], {s: 1.02})],
		hud: ({f, at}) => <Caption f={f} from={at('183') + 2} to={at('183') + 44} top={170} lines={['WHY?']} size={120} />,
	}),
	// 184 — because you never finished your rounds
	shot('184', {
		bg: '#0d0a08',
		cam: [
			[1100, 580, 1.8],
			[1180, 575, 2.2],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '184', off: 0, len: 90, expr: 'worried'}], {face: 1, props: OLD}), ghostAt(1250, [{at: '184', off: 40, len: 80, g: 'point'}, {at: '184', off: 40, len: 80, turn: 0.4}], {s: 1.02, item: 'clip'})],
		hud: ({f, at}) => <Accent text="YOU NEVER FINISHED YOUR ROUNDS" t={f - at('184') - 50} dur={80} y={880} c="#bfe9ff" />,
	}),
	// 185 — I looked at my badge; the visitor tag was gone
	shot('185', {
		bg: '#0d0a08',
		cam: [
			[760, 640, 2.4],
			[760, 660, 3.0],
		],
		back: AR,
		front: ARF(1),
		actors: [hero(760, [{at: '185', off: 0, len: 60, look: [0, 1], head: 14}, {at: '185', off: 0, len: 60, expr: 'wide'}], {face: 1, props: OLD})],
		world: ({f, at}) => {
			const u = Math.min(1, Math.max(0, (f - at('185') - 30) / 40));
			return (
				<g transform="translate(800,720)" opacity={1 - u}>
					<rect x={-24} y={-34} width={48} height={68} rx={4} fill="#e6edf2" stroke="#7a8794" strokeWidth={3} />
					<text textAnchor="middle" y={4} fontSize={12} fontFamily="Rubik, sans-serif" fontWeight={800} fill="#333">
						VISITOR
					</text>
					{u > 0 ? Array.from({length: 8}).map((_, i) => <circle key={i} cx={Math.sin(i * 2.4) * 60 * u} cy={-Math.cos(i * 1.7) * 60 * u} r={4} fill="#e6edf2" />) : null}
				</g>
			);
		},
		hud: ({f, at}) => <Accent text="THE VISITOR'S TAG WAS GONE" t={f - at('185') - 20} dur={80} y={880} />,
	}),
	// 186 — in its place: a plastic card, a photo, Marcus Hale, R.N.
	shot('186', {
		bg: '#0d0a08',
		cam: [
			[780, 650, 2.4],
			[780, 600, 2.1],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '186', off: 0, len: 150, look: [0, 1], head: 12}, {at: '186', off: 0, len: 150, expr: 'wide'}], {face: 1})],
		world: ({f, at}) => {
			const k = Math.min(1, Math.max(0, (f - at('186') - 10) / 12));
			const u = Math.min(1, Math.max(0, (f - at('186') + 4) / 40));
			return (
				<g>
				{u < 1 ? Array.from({length: 26}).map((_, i) => <circle key={i} cx={720 + Math.sin(i * 7.3) * 90 + Math.sin(i + u * 6) * 20 * u} cy={700 - Math.cos(i * 3.1) * 130 - u * (80 + (i % 5) * 40)} r={7 + (i % 4) * 3} fill="#7b8089" opacity={0.9 * (1 - u)} />) : null}
				<g transform={`translate(1060,560) rotate(-4) scale(${k})`}>
					<rect x={-190} y={-110} width={380} height={220} rx={16} fill="#f4f8fb" stroke="#3b7fd1" strokeWidth={8} />
					<rect x={-170} y={-90} width={110} height={130} fill="#cfd8e0" />
					<circle cx={-115} cy={-30} r={34} fill="#0a0a0a" />
					<ellipse cx={-127} cy={-32} rx={7} ry={9} fill="#fff" />
					<ellipse cx={-103} cy={-32} rx={7} ry={9} fill="#fff" />
					<text x={-40} y={-30} fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={36} fill="#1a2a4a">
						MARCUS
					</text>
					<text x={-40} y={12} fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={36} fill="#1a2a4a">
						HALE, R.N.
					</text>
					<rect x={-170} y={60} width={340} height={14} fill="#3b7fd1" />
				</g>
				</g>
			);
		},
		flashes: ['186'],
	}),
	// 187 — the extra nurse on the scanner wasn't her
	shot('187', {
		bg: '#04090d',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.2],
		],
		back: CardOnly('#05080f'),
		world: ({f, at}) => <ScannerScreen f={f} s={1.4} head="ENTRY LOG · 00:00" rows={[{t: at('187') + 4, a: '00:00  ENTRY #42', b: 'UNKNOWN', warn: true}]} count={{t: at('187') + 10, v: 42}} sil={at('187') + 30} />,
		hud: ({f, at}) => <Accent text="NOT HER." t={f - at('187') - 40} dur={50} y={900} c="#ff6a6a" />,
	}),
	// 188 — it was me
	shot('188', {
		bg: '#0d0a08',
		cam: [
			[760, 570, 2.2],
			[760, 560, 3.0],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '188', off: 0, len: 30, expr: 'wide'}, {at: '188', off: 0, len: 30, g: 'handsOnHead'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('188') + 2} to={at('188') + 34} top={160} lines={['IT WAS ME']} size={130} c="#ff4a4a" />,
		shake: [{at: '188', off: 2, len: 14}],
		flashes: ['188'],
	}),
	// 189a — the ghost who walked the corridors at midnight, 42 on the count
	shot('189', {
		bg: '#04080e',
		cam: [
			[400, 590, 1.3],
			[1300, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.55} flicker={1} />,
		actors: [heroS(-100, [{at: '189', off: 0, len: 150, walk: [-100, 1800], speed: 0.2}], {face: 1, badge: true, props: {...scrubs}})],
		hud: ({f, at}) => <Caption f={f} from={at('189') + 70} to={at('189') + 140} top={170} lines={['42 ON THE COUNT']} size={84} c="#ff6a6a" />,
	}),
	// 189b — the nurse who died in stairwell B three years ago and never left
	shot(
		'189',
		{
			bg: '#0c0f14',
			cam: [
				[900, 600, 1.3],
				[1000, 640, 1.7],
			],
			back: ({f}) => <Stairs f={f} open={0.2} />,
			actors: [heroS(700, [{at: '189', off: 170, len: 40, g: 'handsOnHead'}, {at: '189', off: 200, len: 80, lean: 30}, {at: '189', off: 230, len: 1, rot: 84}, {at: '189', off: 170, len: 60, expr: 'worried'}], {face: 1})],
			hud: ({f, at}) => <Caption f={f} from={at('189') + 160} to={at('189') + 240} top={170} lines={['3 YEARS AGO']} size={96} c="#ffd34a" />,
			shake: [{at: '189', off: 228, len: 10}],
		},
		{off: 164},
	),
	// 190 — then who are you?
	shot('190', {
		bg: '#0d0a08',
		cam: [
			[880, 580, 1.9],
			[960, 575, 2.3],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '190', off: 0, len: 40, mouth: 'open'}, {at: '190', off: 0, len: 40, expr: 'worried'}], {face: 1}), ghostAt(1250, [], {s: 1.02})],
	}),
	// 191a — she smiled, exhaustion in her eyes
	shot('191', {
		bg: '#0d0a08',
		cam: [
			[1180, 575, 2.6],
			[1200, 570, 3.2],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1250, [{at: '191', off: 20, len: 130, mouth: 'smile'}, {at: '191', off: 60, len: 90, expr: 'sleepy'}], {s: 1.04})],
		hud: ({f, at}) => <Accent text="EXHAUSTION IN HER EYES" t={f - at('191') - 70} dur={80} y={880} c="#bfe9ff" />,
	}),
	// 191b — the same exhaustion as the administrator's
	shot(
		'191',
		{
			bg: '#0d0a08',
			cam: [
				[1000, 580, 1.7],
				[1040, 575, 2.0],
			],
			back: AR,
			front: ARF(1),
			actors: [adminAt(820, [{at: '191', off: 160, len: 90, expr: 'sleepy'}, {at: '191', off: 160, len: 90, mouth: 'frown'}], {s: 1.02, face: 1}), ghostAt(1200, [{at: '191', off: 160, len: 90, expr: 'sleepy'}], {s: 1.02})],
			world: ({f, at}) => <Callout f={f} t0={at('191') + 170} t1={at('191') + 240} from={[1010, 400]} to={[1010, 240]} text="THE SAME EXHAUSTION" c="#ffd34a" align="center" />,
		},
		{off: 156},
	),
	// 192 — I'm the one who stayed to help you remember
	shot('192', {
		bg: '#0d0a08',
		cam: [
			[1000, 580, 1.8],
			[1030, 575, 2.2],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(900, [{at: '192', off: 0, len: 80, expr: 'worried'}], {face: 1}), ghostAt(1180, [{at: '192', off: 20, len: 90, reach: [1000, 710], side: 'F'}, {at: '192', off: 20, len: 90, mouth: 'smile'}], {s: 1.02})],
		hud: ({f, at}) => <Accent text="“I STAYED TO HELP YOU REMEMBER”" t={f - at('192') - 10} dur={90} y={880} c="#bfe9ff" />,
	}),
	// 193 — every night I write your name
	shot('193', {
		bg: '#0d0a08',
		cam: [
			[1200, 650, 2.4],
			[1180, 660, 2.9],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1250, [{at: '193', off: 0, len: 70, reach: [1330, 770], side: 'F', osc: [10, 4, 8]}, {at: '193', off: 0, len: 70, mouth: 'smile'}], {s: 1.02, item: 'clip'})],
		world: ({f, at}) => (
			<g transform={`translate(1020,430) scale(${Math.min(1, (f - at('193') - 10) / 10)})`}>
				<text textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={90} fill="#ffe9a8">
					Marcus Hale
				</text>
			</g>
		),
	}),
	// 194 — every night you survive another round
	shot('194', {
		bg: '#04080e',
		cam: [
			[400, 590, 1.3],
			[1300, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.2} flicker={0.4} />,
		actors: [heroS(-100, [{at: '194', off: 0, len: 110, walk: [-100, 1800], speed: 0.28}, {at: '194', off: 0, len: 110, mouth: 'smile'}], {face: 1, item: 'clip'})],
		world: ({f, at}) => (
			<g>
				{[1, 2, 3, 4, 5].map((n, i) => (
					<Pop key={n} t={f - (at('194') + 8 + i * 18)} x={300 + i * 330} y={260} s={0.9}>
						<text textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={60} fill="#7dffb0" stroke="#04080e" strokeWidth={6} paintOrder="stroke">
							ROUND {n} ✓
						</text>
					</Pop>
				))}
			</g>
		),
	}),
	// 195 — and every night you forget again
	shot('195', {
		bg: '#0d0a08',
		cam: [
			[780, 560, 2.2],
			[780, 540, 2.7],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '195', off: 0, len: 80, expr: 'sleepy'}, {at: '195', off: 10, len: 70, head: 10}, {at: '195', off: 20, len: 60, g: 'scratch'}], {face: 1})],
		world: ({f, at}) => (
			<>
				<Mem kind="home" x={940} y={280} t={f - (at('195') + 4)} fade={Math.min(1, Math.max(0, (f - at('195') - 20) / 30))} />
				<Mem kind="coffee" x={1120} y={330} t={f - (at('195') + 10)} fade={Math.min(1, Math.max(0, (f - at('195') - 40) / 30))} />
			</>
		),
		hud: ({f, at}) => <Accent text="FORGET AGAIN" t={f - at('195') - 40} dur={50} y={880} c="#ff9a6a" />,
	}),
	// 196 — and if I stop forgetting?
	shot('196', {
		bg: '#0d0a08',
		cam: [
			[780, 570, 2.3],
			[760, 560, 2.7],
		],
		back: AR,
		front: ARF(1),
		actors: [heroS(760, [{at: '196', off: 0, len: 40, g: 'rubChin'}, {at: '196', off: 0, len: 40, expr: 'worried'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('196') + 2} to={at('196') + 30} top={170} lines={['…IF I STOP FORGETTING?']} size={64} />,
	}),
	// 197 — then someone has to take your place
	shot('197', {
		bg: '#0d0a08',
		cam: [
			[1180, 580, 2.0],
			[1160, 575, 2.4],
		],
		back: AR,
		front: ARF(1),
		actors: [ghostAt(1250, [{at: '197', off: 8, len: 50, g: 'point'}, {at: '197', off: 8, len: 60, expr: 'sad'}], {s: 1.02}), heroS(800, [{at: '197', off: 30, len: 60, expr: 'wide'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('197') + 12} to={at('197') + 56} top={170} lines={['SOMEONE TAKES', 'YOUR PLACE']} size={78} c="#ff6a6a" />,
		shake: [{at: '197', off: 24, len: 8}],
	}),
	// 198a — the clock in the hall struck four
	shot('198', {
		bg: '#0b1620',
		cam: [
			[860, 290, 2.6],
			[860, 270, 3.1],
		],
		back: ({f, gf}) => <Station f={f} minutes={24 * 60 + 240} />,
		front: ({f}) => <StationFront f={f} cups={2} count={42} />,
		actors: staff((a) => ({...a, still: true})),
		hud: ({f, at}) => <Caption f={f} from={at('198') + 2} to={at('198') + 70} top={160} lines={['4 A.M.']} size={120} c="#ffd34a" />,
		shake: [{at: '198', off: 4, len: 12}, {at: '198', off: 40, len: 10}],
	}, {whip: true}),
	// 198b — Priya and Dennis stood behind her, quiet, waiting
	shot(
		'198',
		{
			bg: '#0b1620',
			cam: [
				[1000, 590, 1.4],
				[1100, 585, 1.8],
			],
			back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
			actors: [
				heroS(520, [{at: '198', off: 100, len: 120, expr: 'worried'}], {face: 1}),
				ghostAt(900, [], {s: 1.03}),
				dennisAt(1090, [{at: '198', off: 110, len: 60, walk: [1500, 1090], speed: 0.25}, {at: '198', off: 110, len: 120, expr: 'sad'}], {s: 1.0}),
				priyaAt(1230, [{at: '198', off: 110, len: 60, walk: [1600, 1230], speed: 0.25}, {at: '198', off: 110, len: 120, expr: 'sad'}], {s: 1.0}),
			],
			hud: ({f, at}) => <Accent text="QUIET · WAITING" t={f - at('198') - 130} dur={70} y={880} />,
		},
		{off: 100},
	),
	// 199 — 41 nurses lined along the corridor, eyes full of tired kindness
	shot('199', {
		bg: '#0b1620',
		cam: [
			[500, 590, 1.4],
			[1500, 590, 1.4],
		],
		back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
		actors: [
			heroS(180, [{at: '199', off: 0, len: 150, expr: 'worried'}], {face: 1}),
			...nurses(12, 380, 1800, {s: 0.95, face: -1, prefix: 'ln', seed: 11, beats: [{at: '199', off: 20, len: 140, expr: 'sleepy', mouth: 'smile'}]}),
		],
		hud: ({f, at}) => <Accent text="41 NURSES · TIRED KINDNESS" t={f - at('199') - 20} dur={110} y={880} />,
	}),
	// 200 — we never told you, Dennis said
	shot('200', {
		bg: '#0b1620',
		cam: [
			[1000, 585, 2.2],
			[1030, 580, 2.7],
		],
		back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
		actors: [dennisAt(1090, [{at: '200', off: 0, len: 60, expr: 'sad'}, {at: '200', off: 10, len: 40, head: 8}], {s: 1.05}), heroS(600, [], {face: 1})],
		hud: ({f, at}) => <Accent text="“WE NEVER TOLD YOU”" t={f - at('200') - 6} dur={50} y={880} />,
	}),
	// 201 — the last time we did, you ran into the stairwell and didn't come back for a year
	shot('201', {
		bg: '#0c0f14',
		cam: [
			[900, 590, 1.3],
			[1200, 590, 1.5],
		],
		back: ({f}) => <Stairs f={f} open={0.9} />,
		actors: [heroS(300, [{at: '201', off: 10, len: 40, run: [300, 1300], speed: 0.6}], {face: 1})],
		world: ({f, at}) => {
			const k = Math.min(1, Math.max(0, (f - at('201') - 60) / 14));
			return (
				<g transform={`translate(700,380) scale(${k})`}>
					<rect x={-170} y={-130} width={340} height={260} rx={16} fill="#fff" stroke="#1a2250" strokeWidth={6} />
					<rect x={-170} y={-130} width={340} height={56} rx={16} fill="#d94a3a" />
					<text textAnchor="middle" y={-86} fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={34} fill="#fff">
						DAY {Math.min(365, Math.round(((f - at('201') - 74) / 60) * 365))}
					</text>
					<text textAnchor="middle" y={60} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={100} fill="#1a2250">
						1 YEAR
					</text>
				</g>
			);
		},
		hud: ({f, at}) => <Accent text="DIDN'T COME BACK FOR A YEAR" t={f - at('201') - 90} dur={90} y={880} c="#ff9a6a" />,
		shake: [{at: '201', off: 10, len: 40}],
	}, {whip: true}),
	// 202 — a door marked Stairwell B stood slightly open
	shot('202', {
		bg: '#0c0f14',
		cam: [
			[400, 590, 1.2],
			[1250, 590, 1.6],
		],
		back: ({f}) => <Stairs f={f} open={0.15} />,
		actors: [heroS(380, [{at: '202', off: 0, len: 150, look: [0.9, 0]}, {at: '202', off: 20, len: 80, expr: 'worried'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('202') + 60} to={at('202') + 140} top={170} lines={['STAIRWELL B']} size={96} c="#ffffff" />,
	}),
	// 203 — a faint white light spilling out; what happens if I go in?
	shot('203', {
		bg: '#0c0f14',
		cam: [
			[900, 590, 1.6],
			[1100, 590, 2.0],
		],
		back: ({f}) => <Stairs f={f} open={0.25} />,
		actors: [heroS(600, [{at: '203', off: 30, len: 60, walk: [600, 760], speed: 0.2}, {at: '203', off: 30, len: 100, expr: 'wide'}, {at: '203', off: 100, len: 60, g: 'rubChin'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('203') + 80} to={at('203') + 160} top={170} lines={['WHAT IF I GO IN?']} size={84} />,
	}),
	// 204 — you finally rest, Priya said
	shot('204', {
		bg: '#0b1620',
		cam: [
			[1040, 585, 2.2],
			[1060, 580, 2.7],
		],
		back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
		actors: [priyaAt(1090, [{at: '204', off: 0, len: 50, expr: 'sad'}, {at: '204', off: 0, len: 50, mouth: 'smile'}, {at: '204', off: 10, len: 30, g: 'presentF'}], {s: 1.04}), heroS(700, [], {face: 1})],
		hud: ({f, at}) => <Accent text="“YOU FINALLY REST”" t={f - at('204') - 6} dur={46} y={880} c="#9ad8ff" />,
	}),
	// 205 — then the count drops to 41 and the scanner stops recording
	shot('205', {
		bg: '#04090d',
		cam: [
			[960, 540, 1.0],
			[960, 520, 1.25],
		],
		back: CardOnly('#05080f'),
		world: ({f, at}) => (
			<ScannerScreen
				f={f}
				s={1.4}
				head="ENTRY LOG · 00:00"
				rows={[
					{t: 0, a: '00:00  ENTRY #42', b: f < at('205') + 80 ? 'UNKNOWN' : 'DELETED', warn: true},
				]}
				count={{t: 0, v: f < at('205') + 80 ? 42 : 41, c: f < at('205') + 80 ? '#ff5a5a' : '#6dffb0'}}
			/>
		),
		shake: [{at: '205', off: 80, len: 10}],
		flashes: [],
	}),
	// 206 — the hospital stops needing night nurses
	shot('206', {
		bg: '#070b22',
		cam: [
			[960, 560, 1.0],
			[960, 560, 1.4],
		],
		back: ({f}) => <HospitalExt f={f} />,
		world: ({f, at}) => <rect x={-600} y={-300} width={3200} height={1700} fill="#02030a" opacity={Math.min(0.78, Math.max(0, (f - at('206') - 10) / 80))} />,
		hud: ({f, at}) => <Accent text="NO MORE NIGHT NURSES" t={f - at('206') - 20} dur={70} y={880} c="#ff9a6a" />,
	}),
	// 207 — and the patients?
	shot('207', {
		bg: '#0b1620',
		cam: [
			[700, 585, 1.9],
			[660, 580, 2.3],
		],
		back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
		actors: [heroS(620, [{at: '207', off: 0, len: 36, g: 'stop'}, {at: '207', off: 0, len: 36, expr: 'wide'}], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('207') + 1} to={at('207') + 28} top={170} lines={['AND THE PATIENTS?']} size={84} />,
	}),
	// 208 — they'd have no one to chart them
	shot('208', {
		bg: '#03060c',
		cam: [
			[1100, 600, 1.4],
			[1200, 620, 1.7],
		],
		back: ({f}) => <Room f={f} lit={0.6} heart="beat" />,
		actors: [ghostAt(780, [{at: '208', off: 10, len: 70, expr: 'sad'}, {at: '208', off: 10, len: 70, mouth: 'smile'}], {s: 1.0, face: 1, item: 'clip'})],
		world: ({f}) => <PatientBed f={f} />,
		hud: ({f, at}) => <Accent text="NO ONE TO CHART THEM" t={f - at('208') - 20} dur={70} y={880} c="#bfe9ff" />,
	}, {whip: true}),
	// 209 — no one to warn them, no one to sit beside them when the monitors fail
	shot('209', {
		bg: '#03060c',
		cam: [
			[1100, 620, 1.4],
			[1260, 620, 1.9],
		],
		back: ({f, at}) => <Room f={f} lit={0.5} heart={f < at('209') + 110 ? 'beat' : 'flat'} />,
		world: ({f, at}) => (
			<>
				<PatientBed f={f} dead={f > at('209') + 110} />
				<rect x={760} y={760} width={150} height={26} fill="#a07a56" />
				<rect x={780} y={786} width={14} height={114} fill="#8c6a4a" />
				<rect x={880} y={786} width={14} height={114} fill="#8c6a4a" />
				<Callout f={f} t0={at('209') + 8} t1={at('209') + 70} from={[830, 760]} to={[640, 520]} text="AN EMPTY CHAIR" c="#bfe9ff" />
				<Callout f={f} t0={at('209') + 92} t1={at('209') + 160} from={[1030, 440]} to={[1240, 300]} text="MONITORS FAIL" c="#ff6a6a" />
			</>
		),
		shake: [{at: '209', off: 110, len: 12}],
	}),
	// 210 — I understood then
	shot('210', {
		bg: '#0b1620',
		cam: [
			[620, 570, 2.3],
			[620, 560, 2.8],
		],
		back: ({f}) => <Ward f={f} dark={0.1} flicker={0.3} />,
		actors: [heroS(620, [{at: '210', off: 0, len: 40, expr: 'wide'}, {at: '210', off: 12, len: 24, mouth: 'smile'}], {face: 1})],
		world: ({f, at}) => (
			<g transform={`translate(820,330) scale(${Math.min(1, (f - at('210') - 6) / 8)})`}>
				<circle r={42} fill="#ffe14a" />
				<rect x={-16} y={36} width={32} height={22} rx={5} fill="#aaa" />
				{[0, 60, 120, 180, 240, 300].map((a) => (
					<line key={a} x1={0} y1={-62} x2={0} y2={-92} stroke="#ffe14a" strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} />
				))}
			</g>
		),
	}),
	// 211 — the extra nurse was not a curse
	shot('211', {
		bg: '#0b1620',
		cam: [
			[1000, 570, 1.8],
			[1000, 560, 2.2],
		],
		back: ({f}) => <Ward f={f} dark={0} flicker={0.1} />,
		actors: [ghostAt(1000, [{at: '211', off: 0, len: 60, mouth: 'smile'}, {at: '211', off: 0, len: 60, expr: 'normal'}], {s: 1.05})],
		world: ({f}) => (
			<g>
				<defs>
					<radialGradient id="halo211">
						<stop offset={0} stopColor="#ffe9a8" stopOpacity={0.6} />
						<stop offset={1} stopColor="#ffe9a8" stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={1000} cy={560} r={260 + 10 * Math.sin(f / 8)} fill="url(#halo211)" />
			</g>
		),
		hud: ({f, at}) => <Caption f={f} from={at('211') + 8} to={at('211') + 46} top={170} lines={['NOT A CURSE']} size={100} c="#ffe9a8" />,
	}),
	// 212a — she was a watchman, kept the rounds so nobody else had to die alone
	shot('212', {
		bg: '#0b1620',
		cam: [
			[500, 590, 1.3],
			[1300, 590, 1.3],
		],
		back: ({f}) => <Ward f={f} dark={0.2} flicker={0.3} />,
		actors: [ghostAt(-100, [{at: '212', off: 0, len: 140, walk: [-100, 1900], speed: 0.2}], {s: 1.0, item: 'clip'})],
		hud: ({f, at}) => <Accent text="A WATCHMAN" t={f - at('212') - 6} dur={60} y={880} c="#ffe9a8" />,
	}),
	// 212b — and I was the one who couldn't let go
	shot(
		'212',
		{
			bg: '#0b1620',
			cam: [
				[640, 575, 2.1],
				[620, 565, 2.6],
			],
			back: ({f}) => <Ward f={f} dark={0.2} flicker={0.3} />,
			actors: [heroS(620, [{at: '212', off: 130, len: 80, g: 'fist'}, {at: '212', off: 130, len: 90, expr: 'sad'}, {at: '212', off: 130, len: 90, head: 8}], {face: 1})],
			hud: ({f, at}) => <Accent text="…COULDN'T LET GO" t={f - at('212') - 140} dur={90} y={880} c="#ff9a6a" />,
		},
		{off: 124},
	),
	// 213a — 5 a.m., the front doors opened and the day shift arrived
	shot('213', {
		bg: '#e8f2f7',
		cam: [
			[800, 600, 1.1],
			[1000, 590, 1.35],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: nurses(7, 1500, 1800, {s: 0.98, face: -1, prefix: 'ds', seed: 21, beats: []}).map((a, i) => ({...a, hidden: true, props: {...a.props, color: ['#f2a0c0', '#7ad0a0', '#f2d06a', '#a0c0f2'][i % 4]}, beats: [{at: '213', off: 20 + i * 14, len: 1, hide: false}, {at: '213', off: 20 + i * 14, len: 80, walk: [2200, 300 + i * 120], speed: 0.32}]})),
		hud: ({f, at}) => <Caption f={f} from={at('213') + 4} to={at('213') + 60} top={170} lines={['5 A.M.']} size={120} c="#ffd34a" />,
	}, {whip: true}),
	// 213b — the administrator walked in carrying her coffee
	shot(
		'213',
		{
			bg: '#e8f2f7',
			cam: [
				[1300, 600, 1.4],
				[1050, 590, 1.7],
			],
			back: ({f}) => <Lobby f={f} night={false} day={1} />,
			front: ({f}) => <LobbyFront f={f} />,
			actors: [adminAt(2200, [{at: '213', off: 130, len: 80, walk: [2200, 1250], speed: 0.28}, {at: '213', off: 130, len: 100, expr: 'normal'}, {at: '213', off: 130, len: 100, mouth: 'smile'}], {item: 'cup', face: -1, props: {age: 0}})],
			hud: ({f, at}) => <Accent text="THE ADMINISTRATOR · WITH COFFEE" t={f - at('213') - 150} dur={70} y={880} />,
		},
		{off: 124},
	),
	// 214 — young and rested, her coat over a clean uniform
	shot('214', {
		bg: '#e8f2f7',
		cam: [
			[1250, 585, 2.0],
			[1250, 580, 2.4],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [adminAt(1250, [{at: '214', off: 0, len: 90, mouth: 'smile'}, {at: '214', off: 0, len: 90, g: 'presentF'}], {item: 'cup', props: {color: '#e86a9a', rimW: 2.6}})],
		world: ({f, at}) => <Callout f={f} t0={at('214') + 6} t1={at('214') + 90} from={[1250, 520]} to={[1020, 330]} text="YOUNG & RESTED" c="#ff7aa8" />,
	}),
	// 215 — Mr. Hale, she said brightly
	shot('215', {
		bg: '#e8f2f7',
		cam: [
			[1100, 585, 1.8],
			[1000, 580, 2.2],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [adminAt(1250, [{at: '215', off: 0, len: 40, g: 'wave'}, {at: '215', off: 0, len: 50, mouth: 'smile'}], {props: {color: '#e86a9a'}}), heroS(780, [{at: '215', off: 0, len: 50, expr: 'worried'}], {face: 1})],
		hud: ({f, at}) => <Accent text="“MR. HALE!”" t={f - at('215') - 4} dur={40} y={880} c="#ff7aa8" />,
	}),
	// 216 — did you find the extra nurse?
	shot('216', {
		bg: '#e8f2f7',
		cam: [
			[1200, 585, 2.1],
			[1220, 580, 2.5],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [adminAt(1250, [{at: '216', off: 0, len: 40, g: 'point'}, {at: '216', off: 0, len: 50, mouth: 'smile'}], {props: {color: '#e86a9a'}}), heroS(780, [], {face: 1})],
		hud: ({f, at}) => <Caption f={f} from={at('216') + 2} to={at('216') + 36} top={170} lines={['DID YOU FIND', 'THE EXTRA NURSE?']} size={68} c="#ff7aa8" />,
	}),
	// 217 — I looked at the clipboard in my hand
	shot('217', {
		bg: '#e8f2f7',
		cam: [
			[780, 620, 2.2],
			[780, 640, 2.7],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [heroS(780, [{at: '217', off: 0, len: 50, reach: [850, 700], side: 'B'}, {at: '217', off: 0, len: 50, look: [0, 1], head: 12}, {at: '217', off: 0, len: 50, expr: 'wide'}], {face: 1, item: 'clip'})],
	}),
	// 218 — the form was blank, the badge gone; my reflection in the glass door: a man in blue scrubs
	shot('218', {
		bg: '#e8f2f7',
		cam: [
			[1100, 585, 1.5],
			[1400, 585, 1.7],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [
			hero(1000, [{at: '218', off: 0, len: 100, look: [0.9, 0]}, {at: '218', off: 0, len: 100, expr: 'worried'}], {face: 1, item: 'clip', props: OLD}),
			heroS(1530, [{at: '218', off: 20, len: 110, expr: 'worried'}], {face: -1, z: 3}),
		],
		world: ({f, at}) => (
			<g>
				<rect x={1300} y={230} width={520} height={650} fill="#cfe6f5" opacity={0.18} />
				<Callout f={f} t0={at('218') + 30} t1={at('218') + 140} from={[1540, 480]} to={[1330, 300]} text="MY REFLECTION: BLUE SCRUBS" c="#3b7fd1" />
			</g>
		),
	}),
	// 219 — pale, exhausted, name tag R.N.
	shot('219', {
		bg: '#e8f2f7',
		cam: [
			[1540, 580, 2.5],
			[1540, 570, 3.0],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [heroS(1530, [{at: '219', off: 0, len: 90, expr: 'sleepy'}], {face: -1, props: {}})],
		world: ({f, at}) => <Callout f={f} t0={at('219') + 20} t1={at('219') + 100} from={[1520, 700]} to={[1300, 860]} text="NAME TAG: R.N." c="#3b7fd1" />,
	}),
	// 220 — yes, I said quietly
	shot('220', {
		bg: '#e8f2f7',
		cam: [
			[900, 585, 2.1],
			[880, 580, 2.5],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [heroS(780, [{at: '220', off: 0, len: 40, head: 10}, {at: '220', off: 0, len: 40, expr: 'sleepy'}], {face: 1}), adminAt(1250, [{at: '220', off: 0, len: 40, mouth: 'smile'}], {props: {color: '#e86a9a'}})],
	}),
	// 221a — I found her. She smiled, relieved: Good. We can close the case.
	shot('221', {
		bg: '#e8f2f7',
		cam: [
			[1000, 585, 1.6],
			[1100, 580, 1.9],
		],
		back: ({f}) => <Lobby f={f} night={false} day={1} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [heroS(780, [{at: '221', off: 0, len: 60, mouth: 'smile'}, {at: '221', off: 0, len: 60, expr: 'sleepy'}], {face: 1}), adminAt(1250, [{at: '221', off: 30, len: 100, mouth: 'smile'}, {at: '221', off: 60, len: 40, g: 'presentF'}, {at: '221', off: 150, len: 80, walk: [1250, 2100], speed: 0.3}], {props: {color: '#e86a9a'}})],
		hud: ({f, at}) => <Accent text="“THEN WE CAN CLOSE THE CASE”" t={f - at('221') - 60} dur={90} y={880} c="#ff7aa8" />,
	}),
	// 221b — behind me the elevator chimed
	shot(
		'221',
		{
			bg: '#0a1218',
			cam: [
				[900, 560, 1.0],
				[1620, 560, 1.7],
			],
			back: ({f, at}) => <Ward f={f} elev={Math.min(1, Math.max(0, (f - at('221') - 214) / 30))} />,
			actors: [heroS(420, [{at: '221', off: 210, len: 80, look: [0.9, 0], expr: 'normal'}], {face: 1})],
			hud: ({f, at}) => <Accent text="DING" t={f - at('221') - 214} dur={46} y={190} />,
		},
		{off: 206, whip: true},
	),
	// 222 — at 11 that night, a new auditor stepped through the front door
	shot('222', {
		bg: '#0a1522',
		cam: [
			[800, 600, 1.15],
			[1000, 590, 1.45],
		],
		back: ({f}) => <Lobby f={f} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [{id: 'newb', who: 'newb', x: 2150, face: -1, item: 'clip', beats: [{at: '222', off: 40, len: 90, walk: [2150, 1150], speed: 0.3}]}],
		hud: ({f, at}) => <Caption f={f} from={at('222') + 2} to={at('222') + 60} top={170} lines={['11 P.M. · A NEW AUDITOR']} size={72} c="#ffd34a" />,
	}, {whip: true}),
	// 223 — young, nervous, a visitor badge too large for his coat
	shot('223', {
		bg: '#0a1522',
		cam: [
			[1120, 585, 2.1],
			[1100, 580, 2.6],
		],
		back: ({f}) => <Lobby f={f} />,
		front: ({f}) => <LobbyFront f={f} />,
		actors: [{id: 'newb', who: 'newb', x: 1150, face: -1, item: 'badge', beats: [{at: '223', off: 0, len: 100, sway: 1.8}, {at: '223', off: 0, len: 100, expr: 'worried'}, {at: '223', off: 30, len: 50, g: 'touchFace'}], s: 1.0}],
		world: ({f, at}) => <Callout f={f} t0={at('223') + 40} t1={at('223') + 110} from={[1100, 700]} to={[860, 860]} text="BADGE TOO LARGE" c="#a08cf0" />,
	}),
	// 224 — I walked to the nurses station and picked up a black marker
	shot('224', {
		bg: '#0b1620',
		cam: [
			[700, 600, 1.4],
			[1000, 600, 1.7],
		],
		back: ({f, gf}) => <Station f={f} minutes={clockMin(gf)} note={false} />,
		front: ({f}) => <StationFront f={f} cups={2} count={41} />,
		actors: [heroS(-100, [{at: '224', off: 0, len: 60, walk: [-100, 360], speed: 0.28}, {at: '224', off: 60, len: 50, reach: [470, 690], side: 'F'}, {at: '224', off: 100, len: 40, g: 'presentF'}], {face: 1, item: 'marker'})],
		world: ({f, at}) => <Callout f={f} t0={at('224') + 70} t1={at('224') + 130} from={[470, 690]} to={[640, 470]} text="A BLACK MARKER" c="#ffd34a" />,
	}, {whip: true}),
	// 225 — I tore a sheet of yellow paper from the pad and wrote the rule
	shot('225', {
		bg: '#0b1020',
		cam: [
			[960, 540, 1.0],
			[960, 500, 1.2],
		],
		back: CardOnly('#101626'),
		world: ({f, at}) => <Paper f={f} t0={at('226')} appear={at('225') + 10} per={26} lines={['Never ask her name', 'after midnight.', 'Never ask what she', 'is charting.', 'Count us every hour.']} size={74} w={900} h={760} />,
		hud: ({f, at}) => <Accent text="IN SHAKY HANDWRITING…" t={f - at('225') - 60} dur={90} y={900} />,
	}),
	// 226–227 — the rule
	shot('226', {
		bg: '#0b1020',
		cam: [
			[960, 540, 1.05],
			[960, 520, 1.35],
		],
		back: CardOnly('#101626'),
		world: ({f, at}) => <Paper f={f} t0={at('226')} appear={at('225') - 400} per={26} lines={['Never ask her name', 'after midnight.', 'Never ask what she', 'is charting.', 'Count us every hour.']} size={74} w={900} h={760} />,
	}),
	// 228a — I taped it to the wall beside the telephone and waited
	shot('228', {
		bg: '#0b1620',
		cam: [
			[900, 520, 1.5],
			[1300, 480, 1.7],
		],
		back: ({f, gf}) => <Station f={f} minutes={clockMin(gf)} note />,
		front: ({f}) => <StationFront f={f} cups={2} count={41} />,
		actors: [heroS(1100, [{at: '228', off: 0, len: 70, reach: [1500, 440], side: 'F'}, {at: '228', off: 80, len: 80, g: 'armsCrossed'}, {at: '228', off: 0, len: 150, face: 1}], {face: 1})],
		hud: ({f, at}) => <Accent text="…AND WAITED" t={f - at('228') - 80} dur={60} y={880} />,
	}),
	// 228b — at 11:59 the new auditor looked at the clock above the desk
	shot(
		'228',
		{
			bg: '#0b1620',
			cam: [
				[1000, 400, 1.8],
				[880, 330, 2.0],
			],
			back: ({f}) => <Station f={f} minutes={24 * 60 - 1} note />,
			front: ({f}) => <StationFront f={f} cups={2} count={41} />,
			actors: [{id: 'newb', who: 'newb', x: 760, face: 1, beats: [{at: '228', off: 140, len: 90, look: [0.4, -1], head: -10}, {at: '228', off: 140, len: 90, expr: 'worried'}]}, heroS(1100, [{at: '228', off: 140, len: 90, g: 'armsCrossed'}, {at: '228', off: 140, len: 90, mouth: 'smile'}], {face: -1})],
			hud: ({f, at}) => <Caption f={f} from={at('228') + 150} to={at('228') + 220} top={160} lines={['11:59 P.M.']} size={96} c="#ff6a6a" />,
		},
		{off: 134},
	),
	// 229 — is something supposed to happen?
	shot('229', {
		bg: '#0b1620',
		cam: [
			[780, 585, 2.2],
			[760, 580, 2.7],
		],
		back: ({f}) => <Station f={f} minutes={24 * 60 - 1} note />,
		front: ({f}) => <StationFront f={f} cups={2} count={41} />,
		actors: [{id: 'newb', who: 'newb', x: 760, face: 1, beats: [{at: '229', off: 0, len: 40, expr: 'worried'}, {at: '229', off: 0, len: 40, sway: 1.4}, {at: '229', off: 10, len: 30, g: 'scratch'}]}],
		hud: ({f, at}) => <Caption f={f} from={at('229') + 2} to={at('229') + 40} top={170} lines={['IS SOMETHING', 'SUPPOSED TO HAPPEN?']} size={64} c="#a08cf0" />,
	}),
	// 230 — I smiled, for the first time I felt no fear. Don't ask her name. She'll tell you when she's ready.
	shot('230', {
		bg: '#0b1620',
		cam: [
			[900, 585, 1.5],
			[1000, 570, 1.25],
		],
		back: ({f}) => <Station f={f} minutes={24 * 60} note />,
		front: ({f}) => <StationFront f={f} cups={2} count={41} />,
		actors: [
			heroS(1100, [{at: '230', off: 0, len: 200, mouth: 'smile'}, {at: '230', off: 0, len: 60, expr: 'sleepy'}, {at: '230', off: 80, len: 80, g: 'presentF'}], {face: -1}),
			{id: 'newb', who: 'newb', x: 760, face: 1, beats: [{at: '230', off: 0, len: 200, expr: 'worried'}, {at: '230', off: 100, len: 100, expr: 'wide'}]},
			ghostAt(1720, [], {s: 1.0, hidden: true, face: -1, beats: [{at: '230', off: 130, len: 1, hide: false}]}),
		],
		hud: ({f, at}) => <Accent text="“SHE'LL TELL YOU WHEN SHE'S READY.”" t={f - at('230') - 120} dur={90} y={880} c="#bfe9ff" />,
	}),
];
