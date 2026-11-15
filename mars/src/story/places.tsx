import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {useShot} from '../kit/core';

/* Локации ролика про Марс. Все рисуются плоско, с градиентами и дальним слоем силуэтов. */

const Grad: React.FC<{id: string; stops: [number, string][]; x2?: number; y2?: number}> = ({id, stops, x2 = 0, y2 = 1}) => (
	<linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
		{stops.map(([o, c], i) => (
			<stop key={i} offset={o} stopColor={c} />
		))}
	</linearGradient>
);

export const Stars: React.FC<{n?: number; seed?: string; x0?: number; x1?: number; y0?: number; y1?: number; o?: number; f?: number}> = ({n = 120, seed = 's', x0 = -300, x1 = 2220, y0 = -200, y1 = 700, o = 1, f = 0}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const r = random(seed + 'r' + i);
			const tw = 0.6 + 0.4 * Math.sin(f / (14 + r * 20) + i);
			return <circle key={i} cx={x0 + random(seed + 'x' + i) * (x1 - x0)} cy={y0 + random(seed + 'y' + i) * (y1 - y0)} r={0.8 + r * 2.1} fill="#fff" opacity={o * tw * (0.4 + r * 0.6)} />;
		})}
	</g>
);

/* маленькая Земля: сине-белая точка с ореолом */
export const EarthDot: React.FC<{x: number; y: number; r?: number; o?: number; moon?: boolean}> = ({x, y, r = 9, o = 1, moon = true}) => {
	const {gf} = useShot();
	return (
		<g opacity={o}>
			<circle cx={x} cy={y} r={r * 6} fill="#9fd0ff" opacity={0.12 + 0.03 * Math.sin(gf / 20)} />
			<circle cx={x} cy={y} r={r * 2.6} fill="#bfe0ff" opacity={0.3} />
			<circle cx={x} cy={y} r={r} fill="#e8f4ff" />
			<circle cx={x - r * 0.25} cy={y - r * 0.2} r={r * 0.55} fill="#6fb0ff" opacity={0.7} />
			{moon ? <circle cx={x + r * 2.4} cy={y - r * 1.2} r={r * 0.28} fill="#ddd" /> : null}
		</g>
	);
};

const Ridge: React.FC<{y: number; seed: string; h: number; c: string; x0?: number; x1?: number; step?: number}> = ({y, seed, h, c, x0 = -400, x1 = 2320, step = 90}) => {
	const pts: string[] = [];
	for (let x = x0; x <= x1; x += step) pts.push(`${x},${y - random(seed + x) * h}`);
	return <path d={`M${x0},${y + 400} L${pts.join(' L')} L${x1},${y + 400} Z`} fill={c} />;
};

/* ----------------------------------- поверхность ----------------------------------- */
export type SurfMode = 'day' | 'dusk' | 'storm' | 'night' | 'dawn' | 'blue';
const SKY: Record<SurfMode, [string, string, string]> = {
	day: ['#b8704a', '#e0a070', '#f2cfa0'],
	dusk: ['#3a2a4a', '#8a4a58', '#e8946a'],
	storm: ['#6a3e2a', '#9a6440', '#b98458'],
	night: ['#04050d', '#0d0f22', '#241626'],
	dawn: ['#4a3358', '#c8665a', '#ffc27a'],
	blue: ['#1d1630', '#3a3a7a', '#78b8ff'],
};
export const Habitat: React.FC<{x: number; y: number; s?: number; lit?: boolean}> = ({x, y, s = 1, lit = true}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-240,0 A240,200 0 0 1 240,0 Z" fill="#cfd5e0" />
		<path d="M-240,0 A240,200 0 0 1 0,-200 L0,0 Z" fill="#aab2c4" opacity={0.6} />
		{[-150, -60, 40, 130].map((px, i) => (
			<rect key={i} x={px} y={-70} width={50} height={36} rx={8} fill={lit ? '#ffd98a' : '#37405a'} />
		))}
		<rect x={-70} y={-130} width={140} height={20} rx={10} fill="#8d97ad" />
		<rect x={-300} y={-40} width={90} height={40} rx={10} fill="#bfc6d6" />
		<rect x={210} y={-40} width={90} height={40} rx={10} fill="#bfc6d6" />
		<rect x={-4} y={-260} width={8} height={70} fill="#8d97ad" />
		<circle cx={0} cy={-262} r={7} fill="#ff4d4d" />
	</g>
);
export const SolarField: React.FC<{x: number; y: number; n?: number; s?: number}> = ({x, y, n = 5, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{Array.from({length: n}).map((_, i) => (
			<g key={i} transform={`translate(${i * 140},0)`}>
				<path d="M0,0 L110,-6 L130,-86 L20,-92 Z" fill="#1d2b5a" stroke="#6f86d8" strokeWidth={3} />
				<path d="M40,-90 L48,-4 M80,-92 L88,-5" stroke="#6f86d8" strokeWidth={2} />
				<rect x={60} y={-4} width={6} height={30} fill="#778" />
			</g>
		))}
	</g>
);
export const Dish: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-6} y={-90} width={12} height={90} fill="#8d97ad" />
		<g transform={`translate(0,-100) rotate(${-28 + rot})`}>
			<path d="M-90,0 Q0,70 90,0 Q0,24 -90,0 Z" fill="#e6eaf3" />
			<path d="M-90,0 Q0,70 90,0" fill="none" stroke="#9aa4ba" strokeWidth={4} />
			<line x1={0} y1={22} x2={0} y2={-52} stroke="#9aa4ba" strokeWidth={4} />
			<circle cx={0} cy={-54} r={7} fill="#ffd34a" />
		</g>
	</g>
);
export const Surface: React.FC<{mode?: SurfMode; base?: boolean; hill?: boolean; phobos?: number; earth?: number; sunX?: number; sunY?: number}> = ({mode = 'day', base = true, hill = false, phobos, earth = 0, sunX = 1350, sunY = 690}) => {
	const {gf} = useShot();
	const [a, b, c] = SKY[mode];
	const night = mode === 'night';
	const ground = mode === 'night' ? ['#2a1218', '#0f070b'] : mode === 'blue' ? ['#7a3a3a', '#2a1418'] : mode === 'storm' ? ['#8c5a38', '#4a2c1c'] : mode === 'dusk' ? ['#8e4a40', '#3d1c22'] : ['#a8502c', '#5e2a1c'];
	const ridgeC = mode === 'storm' ? ['#9a6a48', '#8a5a3c'] : night ? ['#1a0f18', '#140b12'] : mode === 'blue' ? ['#5a3050', '#4a2848'] : ['#c27a54', '#a8603c'];
	const ph = phobos ?? 0;
	return (
		<Svg>
			<defs>
				<Grad id="sf-sky" stops={[[0, a], [0.55, b], [1, c]]} />
				<Grad id="sf-gr" stops={[[0, ground[0]], [1, ground[1]]]} />
				<radialGradient id="sf-sun" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor={mode === 'blue' ? '#e8f4ff' : '#fff2cf'} />
					<stop offset="0.25" stopColor={mode === 'blue' ? '#7fc4ff' : '#ffd08a'} stopOpacity={0.9} />
					<stop offset="1" stopColor={mode === 'blue' ? '#3a6aff' : '#ff8a4a'} stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-600} y={-500} width={3200} height={1500} fill="url(#sf-sky)" />
			{night ? <Stars n={220} seed="mn" y1={560} f={gf} /> : null}
			{earth > 0 ? <EarthDot x={900} y={600} r={11} o={earth} /> : null}
			{(mode === 'dusk' || mode === 'blue' || mode === 'dawn') ? (
				<g>
					<circle cx={sunX} cy={sunY} r={mode === 'blue' ? 520 : 420} fill="url(#sf-sun)" />
					<circle cx={sunX} cy={sunY + 10} r={mode === 'blue' ? 26 : 30} fill={mode === 'blue' ? '#f4fbff' : '#fff6dc'} />
				</g>
			) : null}
			{mode === 'day' ? <circle cx={sunX} cy={250} r={26} fill="#f6f0e0" opacity={0.9} /> : null}
			{phobos !== undefined ? (
				<g transform={`translate(${-200 + ph * 2400},${180 + 70 * Math.sin(ph * 3)}) rotate(${gf * 0.5})`}>
					<circle r={64} fill="#d8c8b8" opacity={0.18} />
					<path d="M-34,-4 Q-30,-28 4,-30 Q36,-24 38,0 Q30,28 -4,26 Q-32,22 -34,-4 Z" fill="#b8a898" />
					<circle cx={8} cy={-6} r={8} fill="#8a7a6c" />
					<circle cx={-14} cy={8} r={5} fill="#8a7a6c" />
				</g>
			) : null}
			<Ridge y={760} seed="r1" h={90} c={ridgeC[0]} step={110} />
			{hill || mode === 'blue' ? null : <path d="M-200,760 Q700,420 1300,760 Z" fill={ridgeC[0]} opacity={0.0} />}
			<path d="M200,760 Q760,540 1320,760 Z" fill={ridgeC[1]} opacity={0.9} />
			<path d="M1250,764 L1450,640 L1600,640 L1780,764 Z" fill={ridgeC[1]} />
			<rect x={-600} y={750} width={3200} height={700} fill="url(#sf-gr)" />
			{base ? (
				<g opacity={mode === 'storm' ? 0.55 : 1}>
					<Habitat x={420} y={770} s={0.55} lit={mode !== 'day'} />
					<Habitat x={780} y={776} s={0.38} lit={mode !== 'day'} />
					<SolarField x={1180} y={800} n={5} s={0.8} />
					<Dish x={1700} y={790} s={0.7} />
				</g>
			) : null}
			{[...Array(12)].map((_, i) => (
				<ellipse key={i} cx={-300 + i * 220 + random('rk' + i) * 90} cy={930 + random('rky' + i) * 160} rx={26 + random('rkr' + i) * 46} ry={12 + random('rkk' + i) * 20} fill={ground[1]} opacity={0.85} />
			))}
			{mode === 'storm' ? (
				<g>
					<rect x={-600} y={-500} width={3200} height={1700} fill="#a9703f" opacity={0.42} />
					{Array.from({length: 26}).map((_, i) => {
						const sp = 14 + random('sw' + i) * 26;
						const x = ((gf * sp + random('sx' + i) * 3600) % 3600) - 800;
						return <rect key={i} x={x} y={random('sy' + i) * 1100 - 100} width={160 + random('sl' + i) * 240} height={2 + random('sh' + i) * 5} fill="#f0c890" opacity={0.28 + random('so' + i) * 0.3} />;
					})}
				</g>
			) : null}
		</Svg>
	);
};

/* --------------------------------------- комнаты --------------------------------------- */
export type RoomKind = 'obs' | 'quarters' | 'dining' | 'greenhouse' | 'tunnel' | 'med' | 'comms' | 'hall' | 'roof' | 'lab';
const WALL: Record<RoomKind, [string, string, string]> = {
	obs: ['#0e1630', '#1a2442', '#141b30'],
	quarters: ['#2b3350', '#3a4466', '#232a40'],
	dining: ['#2c3a55', '#42557a', '#252f48'],
	greenhouse: ['#10263a', '#1d4a52', '#16303a'],
	tunnel: ['#2c3345', '#3d465c', '#222838'],
	med: ['#bfd8dc', '#e6f2f3', '#9fbcc2'],
	comms: ['#10182c', '#1c2848', '#0d1424'],
	hall: ['#2c3448', '#40506c', '#242a3c'],
	roof: ['#04060f', '#0b1024', '#18141f'],
	lab: ['#27324a', '#3a4c6e', '#1e2538'],
};
export const Room: React.FC<{kind: RoomKind; earth?: number; state?: 'green' | 'seed' | 'frost' | 'dead'; dim?: number; hoop?: boolean; screen?: 'static' | 'orbit' | 'dish' | 'dark'; ph?: number; crib?: boolean; sky?: SurfMode; grow?: number}> = ({
	kind,
	earth = 0,
	state = 'green',
	dim = 0,
	hoop = false,
	screen = 'static',
	ph = 0.5,
	crib = false,
	sky = 'night',
	grow = 1,
}) => {
	const {gf} = useShot();
	const [w0, w1, fl] = WALL[kind];
	const med = kind === 'med';
	const dark = kind === 'obs' || kind === 'comms' || kind === 'roof';
	return (
		<Svg>
			<defs>
				<Grad id={'rw-' + kind} stops={[[0, w0], [1, w1]]} />
				<Grad id={'rf-' + kind} stops={[[0, fl], [1, '#0a0d18']]} />
			</defs>
			<rect x={-600} y={-500} width={3200} height={1450} fill={'url(#rw-' + kind + ')'} />
			{/* пол */}
			<rect x={-600} y={900} width={3200} height={500} fill={'url(#rf-' + kind + ')'} />
			<rect x={-600} y={896} width={3200} height={8} fill={med ? '#7fa0a8' : '#0b0f1c'} opacity={0.7} />
			{Array.from({length: 14}).map((_, i) => (
				<line key={i} x1={-400 + i * 230} y1={904} x2={-400 + i * 230 - 120 + (i - 7) * 44} y2={1200} stroke="#000" strokeOpacity={0.22} strokeWidth={3} />
			))}

			{kind === 'obs' ? (
				<g>
					<path d="M180,730 L180,230 Q180,130 280,130 L1640,130 Q1740,130 1740,230 L1740,730 Z" fill="#03050c" stroke="#3b4a78" strokeWidth={14} />
					<clipPath id="obs-clip">
						<path d="M194,720 L194,232 Q194,144 282,144 L1638,144 Q1726,144 1726,232 L1726,720 Z" />
					</clipPath>
					<g clipPath="url(#obs-clip)">
						<rect x={160} y={120} width={1600} height={640} fill="#05081a" />
						<Stars n={170} seed="ob" x0={180} x1={1740} y0={140} y1={700} f={gf} />
						<Stars n={40} seed="ob2" x0={180} x1={1740} y0={140} y1={700} o={0.6} f={gf + 20} />
						<path d="M180,690 L420,650 L700,676 L960,640 L1260,672 L1500,646 L1740,680 L1740,740 L180,740 Z" fill="#3a1a1c" />
						{earth > 0 ? <EarthDot x={1180} y={608} r={10} o={earth} /> : null}
					</g>
					{[560, 960, 1360].map((x) => (
						<rect key={x} x={x - 8} y={130} width={16} height={610} fill="#27325a" />
					))}
					<rect x={160} y={742} width={1600} height={30} fill="#27325a" />
					<rect x={260} y={790} width={380} height={110} rx={10} fill="#1a2240" />
					<rect x={280} y={800} width={160} height={70} rx={6} fill="#6ad4ff" opacity={0.35} />
					<rect x={1300} y={790} width={380} height={110} rx={10} fill="#1a2240" />
					<rect x={1330} y={800} width={110} height={70} rx={6} fill="#ffd34a" opacity={0.3} />
				</g>
			) : null}

			{kind === 'quarters' ? (
				<g>
					<circle cx={1300} cy={430} r={236} fill="#58607a" />
					<clipPath id="q-clip">
						<circle cx={1300} cy={430} r={212} />
					</clipPath>
					<g clipPath="url(#q-clip)">
						<rect x={1060} y={190} width={500} height={500} fill="#070a1c" />
						<Stars n={90} seed="q" x0={1060} x1={1560} y0={200} y1={640} f={gf} />
						<path d="M1060,560 L1180,540 L1300,556 L1440,534 L1560,556 L1560,700 L1060,700 Z" fill="#3a1a1c" />
						{earth > 0 ? <EarthDot x={1230} y={514} r={9} o={earth} /> : null}
					</g>
					<circle cx={1300} cy={430} r={236} fill="none" stroke="#8a93b0" strokeWidth={10} />
					<rect x={1294} y={196} width={12} height={468} fill="#58607a" opacity={0.6} />
					{/* койка */}
					<rect x={90} y={380} width={460} height={20} fill="#4a5578" />
					<rect x={90} y={380} width={14} height={520} fill="#4a5578" />
					<rect x={536} y={380} width={14} height={520} fill="#4a5578" />
					<rect x={104} y={330} width={430} height={50} rx={16} fill="#7a90d8" />
					<rect x={104} y={650} width={430} height={20} fill="#4a5578" />
					<rect x={110} y={600} width={420} height={50} rx={16} fill="#d8708a" />
					<rect x={440} y={570} width={80} height={34} rx={16} fill="#fff" opacity={0.8} />
					<rect x={720} y={680} width={360} height={30} fill="#5a4a3a" />
					<rect x={740} y={710} width={14} height={190} fill="#5a4a3a" />
					<rect x={1050} y={710} width={14} height={190} fill="#5a4a3a" />
					<rect x={760} y={610} width={120} height={70} rx={6} fill="#2a2f44" />
					<rect x={770} y={620} width={100} height={50} rx={4} fill="#6ad4ff" opacity={0.4} />
					<path d="M960,680 L980,560 L1010,560 L1030,680 Z" fill="#ffd98a" />
					<circle cx={995} cy={560} r={70} fill="#ffd98a" opacity={0.12} />
					{[0, 1, 2].map((i) => (
						<rect key={i} x={640 + i * 120} y={230 + (i % 2) * 20} width={90} height={110} fill={['#ffd0a0', '#a0c8ff', '#ffa0b0'][i]} opacity={0.85} transform={`rotate(${i * 3 - 3} ${685 + i * 120} 290)`} />
					))}
				</g>
			) : null}

			{kind === 'dining' ? (
				<g>
					{[300, 760, 1220, 1680].map((x, i) => (
						<g key={i}>
							<rect x={x - 4} y={-100} width={8} height={300} fill="#8d97ad" />
							<path d={`M${x - 80},210 L${x + 80},210 L${x + 46},260 L${x - 46},260 Z`} fill="#e8d9a8" />
							<ellipse cx={x} cy={262} rx={110} ry={18} fill="#ffe9a8" opacity={0.18 * (1 - dim)} />
						</g>
					))}
					{[250, 780].map((x, i) => (
						<g key={i}>
							<circle cx={x + 500} cy={420} r={90} fill="#3a4a70" />
							<circle cx={x + 500} cy={420} r={74} fill="#0a0e22" />
							<Stars n={22} seed={'dn' + i} x0={x + 440} x1={x + 560} y0={360} y1={480} />
						</g>
					))}
					<rect x={80} y={540} width={420} height={200} rx={10} fill="#58627e" />
					<rect x={80} y={700} width={420} height={200} fill="#3a4360" />
					{[0, 1, 2].map((i) => (
						<ellipse key={i} cx={180 + i * 120} cy={540} rx={44} ry={12} fill="#c7cfe0" />
					))}
					<rect x={560} y={720} width={1100} height={26} rx={6} fill="#c9a27a" />
					<rect x={590} y={746} width={16} height={154} fill="#5a4a3a" />
					<rect x={1620} y={746} width={16} height={154} fill="#5a4a3a" />
					<rect x={560} y={780} width={1100} height={14} fill="#a8805a" />
					{[640, 780, 920, 1060, 1200, 1340, 1480].map((x, i) => (
						<g key={i}>
							<rect x={x} y={702} width={40} height={18} rx={4} fill="#fff" opacity={0.9} />
							<rect x={x + 10} y={682} width={20} height={22} rx={5} fill={['#e0572b', '#3aa3a0', '#ffd23f'][i % 3]} />
						</g>
					))}
				</g>
			) : null}

			{kind === 'greenhouse' ? (
				<g>
					{Array.from({length: 9}).map((_, i) => (
						<path key={i} d={`M${-300 + i * 330},900 L${-300 + i * 330},300 Q${-135 + i * 330},120 ${30 + i * 330},300 L${30 + i * 330},900`} fill="#9fe0f0" fillOpacity={state === 'frost' ? 0.12 : 0.07} stroke="#6aa0b0" strokeWidth={6} />
					))}
					<rect x={-600} y={160} width={3200} height={20} fill="#b66bff" opacity={state === 'frost' || state === 'dead' ? 0.15 : 0.9} />
					<rect x={-600} y={160} width={3200} height={380} fill="#b66bff" opacity={state === 'frost' || state === 'dead' ? 0 : 0.1} />
					{[200, 760, 1320, 1880].map((x, i) => (
						<g key={i}>
							<rect x={x - 180} y={800} width={440} height={100} rx={8} fill="#5a3a2a" />
							<rect x={x - 170} y={790} width={420} height={22} fill={state === 'frost' ? '#9a8a86' : '#3a2018'} />
							{Array.from({length: 6}).map((_, j) => {
								const px = x - 140 + j * 72;
								const h = (state === 'seed' ? 0 : state === 'dead' ? 22 : 60 + random('pl' + i + j) * 40) * (state === 'green' ? grow : 1);
								return state === 'seed' || h < 4 ? <circle key={j} cx={px} cy={796} r={6} fill="#d8b878" /> : (
									<g key={j} transform={`translate(${px},792)`}>
										<path d={`M0,0 Q${6 + random('q' + j) * 6},${-h / 2} 0,${-h}`} stroke={state === 'green' ? '#3fbf5a' : '#2a2a2a'} strokeWidth={6} fill="none" />
										<path d={`M0,${-h * 0.45} q-34,-14 -38,-40 q30,4 38,40 Z`} fill={state === 'green' ? '#58d46a' : '#201a1a'} />
										<path d={`M0,${-h * 0.7} q34,-14 38,-40 q-30,4 -38,40 Z`} fill={state === 'green' ? '#3fbf5a' : '#201a1a'} />
									</g>
								);
							})}
						</g>
					))}
				</g>
			) : null}

			{kind === 'tunnel' ? (
				<g>
					{Array.from({length: 16}).map((_, i) => (
						<g key={i}>
							<rect x={-420 + i * 190} y={-100} width={26} height={1000} fill="#1a1f2e" opacity={0.9} />
							<rect x={-420 + i * 190 + 26} y={-100} width={7} height={1000} fill="#5a6484" opacity={0.7} />
						</g>
					))}
					<rect x={-600} y={110} width={3200} height={34} fill="#ffe9a8" opacity={0.7} />
					<rect x={-600} y={144} width={3200} height={260} fill="#ffe9a8" opacity={0.05} />
					<rect x={-600} y={640} width={3200} height={16} fill="#ff8a3c" opacity={0.7} />
					{hoop ? (
						<g>
							<rect x={1380} y={250} width={240} height={160} rx={8} fill="#e8eaf2" stroke="#ff6a3c" strokeWidth={8} />
							<rect x={1450} y={320} width={100} height={70} fill="none" stroke="#ff6a3c" strokeWidth={6} />
							<rect x={1494} y={410} width={12} height={70} fill="#6a738c" />
							<ellipse cx={1500} cy={484} rx={70} ry={12} fill="none" stroke="#ff5a2a" strokeWidth={9} />
							<path d="M1432,486 L1460,570 M1470,492 L1480,572 M1530,492 L1520,572 M1568,486 L1540,570 M1432,486 Q1500,520 1568,486" stroke="#fff" strokeWidth={3} fill="none" opacity={0.85} />
						</g>
					) : null}
				</g>
			) : null}

			{kind === 'med' ? (
				<g>
					<rect x={80} y={160} width={820} height={640} rx={12} fill="#7fb0be" stroke="#e8f4f6" strokeWidth={14} />
					<rect x={96} y={176} width={788} height={608} fill="#274a5a" opacity={0.5} />
					{Array.from({length: 9}).map((_, i) => (
						<g key={i} opacity={0.7}>
							<circle cx={160 + i * 84} cy={560 + (i % 2) * 20} r={38} fill="#0d1a24" />
							<rect x={126 + i * 84} y={596 + (i % 2) * 20} width={68} height={200} rx={30} fill={['#e0572b', '#3aa3a0', '#8b6bd6', '#ffd23f'][i % 4]} />
						</g>
					))}
					<rect x={1100} y={700} width={420} height={40} rx={10} fill="#fff" />
					<rect x={1120} y={740} width={14} height={160} fill="#9fb4bb" />
					<rect x={1490} y={740} width={14} height={160} fill="#9fb4bb" />
					{crib ? <rect x={1150} y={680} width={150} height={40} rx={18} fill="#ffd1dc" /> : null}
					<rect x={1620} y={420} width={200} height={140} rx={10} fill="#10202a" />
					<polyline points={`1636,500 1670,500 1684,450 1700,540 1716,480 1740,500 1804,500`} fill="none" stroke="#5cff9a" strokeWidth={5} opacity={0.9} />
				</g>
			) : null}

			{kind === 'comms' ? (
				<g>
					<rect x={260} y={120} width={1400} height={560} rx={16} fill="#050914" stroke="#3b4a78" strokeWidth={12} />
					{screen === 'static' ? (
						<g clipPath="url(#cm-clip)">
							<clipPath id="cm-clip"><rect x={272} y={132} width={1376} height={536} /></clipPath>
							{Array.from({length: 40}).map((_, i) => (
								<rect key={i} x={272 + random('st' + (gf % 6) + i) * 1200} y={132 + i * 13.4} width={80 + random('stw' + (gf % 5) + i) * 220} height={5} fill="#9fc8ff" opacity={0.25 + random('sto' + gf + i) * 0.3} />
							))}
						</g>
					) : null}
					{screen === 'orbit' ? (
						<g>
							<circle cx={960} cy={400} r={150} fill="none" stroke="#3b6aa0" strokeWidth={3} strokeDasharray="8 10" />
							<circle cx={960} cy={400} r={250} fill="none" stroke="#6a3b50" strokeWidth={3} strokeDasharray="8 10" />
							<circle cx={960} cy={400} r={34} fill="#ffd34a" />
							<circle cx={960 + 150 * Math.cos(gf / 40)} cy={400 + 150 * Math.sin(gf / 40)} r={14} fill="#6fb0ff" />
							<circle cx={960 + 250 * Math.cos(gf / 70 + 1)} cy={400 + 250 * Math.sin(gf / 70 + 1)} r={12} fill="#ff6a4a" />
						</g>
					) : null}
					{screen === 'dish' ? (
						<g>
							{Array.from({length: 5}).map((_, i) => (
								<circle key={i} cx={620} cy={560} r={((gf * 5 + i * 70) % 350) + 20} fill="none" stroke="#5cff9a" strokeWidth={4} opacity={Math.max(0, 1 - (((gf * 5 + i * 70) % 350) + 20) / 370)} />
							))}
							<text x={1280} y={260} fontFamily="Rubik" fontWeight={700} fontSize={64} fill="#5cff9a" textAnchor="middle">NO SIGNAL</text>
						</g>
					) : null}
					<rect x={160} y={780} width={1600} height={120} rx={14} fill="#16203c" />
					{Array.from({length: 14}).map((_, i) => (
						<rect key={i} x={200 + i * 112} y={800} width={80} height={14} rx={7} fill={['#5cff9a', '#ffd34a', '#ff6a5a', '#6ad4ff'][(i + Math.floor(gf / 20)) % 4]} opacity={0.8} />
					))}
				</g>
			) : null}

			{kind === 'hall' ? (
				<g>
					{Array.from({length: 7}).map((_, i) => (
						<g key={i}>
							<rect x={-100 + i * 330} y={330} width={190} height={570} rx={6} fill="#1d2438" stroke="#5a6a90" strokeWidth={6} />
							<rect x={-60 + i * 330} y={380} width={110} height={90} rx={6} fill="#0a0f1c" />
							<circle cx={30 + i * 330 + 70} cy={760} r={9} fill="#ffd34a" />
							<rect x={-100 + i * 330 + 210} y={160} width={80} height={14} rx={7} fill="#ffe9a8" opacity={0.8} />
						</g>
					))}
					<rect x={-600} y={240} width={3200} height={22} fill="#5a6a90" />
					<rect x={-600} y={268} width={3200} height={12} fill="#3a4666" />
					<rect x={-600} y={600} width={3200} height={12} fill="#ff8a3c" opacity={0.6} />
				</g>
			) : null}

			{kind === 'roof' ? (
				<g>
					<Stars n={260} seed="rf" y0={-200} y1={760} f={gf} />
					<g transform={`translate(${-200 + ph * 2400},${160 + 80 * Math.sin(ph * 3)}) rotate(${gf * 0.6})`}>
						<circle r={70} fill="#d8c8b8" opacity={0.14} />
						<path d="M-38,-4 Q-32,-30 4,-32 Q40,-26 42,0 Q32,30 -4,28 Q-34,24 -38,-4 Z" fill="#b8a898" />
						<circle cx={10} cy={-8} r={9} fill="#8a7a6c" />
						<circle cx={-16} cy={8} r={6} fill="#8a7a6c" />
					</g>
					<path d="M-200,820 Q960,-260 2120,820" fill="none" stroke="#5a6a90" strokeWidth={10} />
					{[-0.6, -0.3, 0, 0.3, 0.6].map((k, i) => (
						<path key={i} d={`M${960 + k * 1100},-120 Q${960 + k * 1700},400 ${960 + k * 2200},840`} fill="none" stroke="#5a6a90" strokeWidth={6} opacity={0.75} />
					))}
					<rect x={-600} y={800} width={3200} height={130} fill="#1a1c2c" />
					<rect x={-600} y={796} width={3200} height={10} fill="#5a6a90" />
				</g>
			) : null}

			{kind === 'lab' ? (
				<g>
					{Array.from({length: 4}).map((_, i) => (
						<g key={i}>
							<rect x={100 + i * 430} y={690} width={340} height={26} rx={6} fill="#9aa4ba" />
							<rect x={120 + i * 430} y={716} width={14} height={184} fill="#6a738c" />
							<rect x={406 + i * 430} y={716} width={14} height={184} fill="#6a738c" />
							<rect x={150 + i * 430} y={560} width={150} height={130} rx={8} fill="#10202a" />
							<rect x={160 + i * 430} y={570} width={130} height={110} rx={4} fill={['#5cff9a', '#6ad4ff', '#ffd34a', '#ff8ab0'][i]} opacity={0.25} />
						</g>
					))}
				</g>
			) : null}

			{dim > 0 ? <rect x={-600} y={-500} width={3200} height={1700} fill="#05070f" opacity={dim} /> : null}
			{dark ? null : null}
		</Svg>
	);
};
