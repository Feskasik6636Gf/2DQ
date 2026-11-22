import React from 'react';
import {Svg} from '../engine/camera';
import {Bedroom, Kitchen, KitchenTable, SchoolYard, Win, Lamp} from '../kit/sets';
import {Moon} from '../kit/world';

/* Locations of this video. All 3D-ish (several depth bands, outline #1d1626, soft light), each with 3+ living details.
   Ground line is y = 900. Drawn across x = -600…2500. */
const INK = '#1d1626';
const o = {stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round' as const};
const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 3.7) * 43758.5453;
	return x - Math.floor(x);
};
export type PP = {f: number; night?: boolean; a?: any};

const Grad: React.FC<{id: string; c: [string, string]; v?: boolean}> = ({id, c, v = true}) => (
	<linearGradient id={id} x1="0" y1="0" x2={v ? 0 : 1} y2={v ? 1 : 0}>
		<stop offset="0" stopColor={c[0]} />
		<stop offset="1" stopColor={c[1]} />
	</linearGradient>
);
const Floor: React.FC<{y?: number; c: string; c2?: string; lines?: number; id: string}> = ({y = 900, c, c2 = '#000', lines = 0, id}) => (
	<g>
		<defs>
			<Grad id={id} c={[c, c]} />
			<linearGradient id={id + 'f'} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={c2} stopOpacity={0.0} />
				<stop offset="1" stopColor={c2} stopOpacity={0.28} />
			</linearGradient>
		</defs>
		<rect x={-700} y={y} width={3400} height={500} fill={c} />
		<rect x={-700} y={y} width={3400} height={500} fill={`url(#${id}f)`} />
		<rect x={-700} y={y} width={3400} height={8} fill="#fff" opacity={0.28} />
		{Array.from({length: lines}).map((_, i) => (
			<line key={i} x1={-700 + i * (3400 / lines)} y1={y} x2={-1100 + i * (3400 / lines) * 1.25} y2={y + 400} stroke={INK} strokeOpacity={0.12} strokeWidth={2} />
		))}
	</g>
);
const Wall: React.FC<{id: string; c: [string, string]; h?: number}> = ({id, c, h = 900}) => (
	<g>
		<defs>
			<Grad id={id} c={c} />
		</defs>
		<rect x={-700} y={-300} width={3400} height={h + 300} fill={`url(#${id})`} />
	</g>
);
const Clock: React.FC<{x: number; y: number; r?: number; f: number; stop?: boolean; h?: number; m?: number}> = ({x, y, r = 54, f, stop, h = 0, m = 4}) => {
	const s = stop ? 0 : (f / 30) * 6;
	return (
		<g>
			<circle cx={x} cy={y} r={r} fill="#fbf6e6" {...o} />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={x + Math.sin((i * Math.PI) / 6) * (r - 6)} y1={y - Math.cos((i * Math.PI) / 6) * (r - 6)} x2={x + Math.sin((i * Math.PI) / 6) * (r - 12)} y2={y - Math.cos((i * Math.PI) / 6) * (r - 12)} stroke={INK} strokeWidth={3} />
			))}
			<line x1={x} y1={y} x2={x + Math.sin(((h * 30 + m * 0.5) * Math.PI) / 180) * r * 0.5} y2={y - Math.cos(((h * 30 + m * 0.5) * Math.PI) / 180) * r * 0.5} stroke={INK} strokeWidth={5} strokeLinecap="round" />
			<line x1={x} y1={y} x2={x + Math.sin((m * 6 * Math.PI) / 180) * r * 0.75} y2={y - Math.cos((m * 6 * Math.PI) / 180) * r * 0.75} stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
			<line x1={x} y1={y} x2={x + Math.sin((s * Math.PI) / 180) * r * 0.82} y2={y - Math.cos((s * Math.PI) / 180) * r * 0.82} stroke="#e0463c" strokeWidth={2} strokeLinecap="round" />
			<circle cx={x} cy={y} r={4} fill={INK} />
		</g>
	);
};
const Cloud: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#fff'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={0.92}>
		<ellipse cx={0} cy={0} rx={90} ry={34} fill={c} />
		<ellipse cx={-50} cy={-18} rx={50} ry={34} fill={c} />
		<ellipse cx={30} cy={-28} rx={58} ry={40} fill={c} />
	</g>
);
const Light: React.FC<{x: number; y: number; w: number; len?: number; f: number; c?: string; o?: number}> = ({x, y, w, len = 600, f, c = '#fff3c0', o: op = 0.2}) => (
	<polygon points={`${x - w / 2},${y} ${x + w / 2},${y} ${x + w * 1.6},${y + len} ${x - w * 1.6},${y + len}`} fill={c} opacity={op * (0.85 + 0.15 * Math.sin(f / 17 + x))} />
);
const Motes: React.FC<{f: number; x0: number; x1: number; y0: number; y1: number; n?: number; c?: string}> = ({f, x0, x1, y0, y1, n = 24, c = '#fff'}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const px = x0 + rnd(i) * (x1 - x0) + Math.sin(f / 40 + i) * 14;
			const py = y0 + ((rnd(i + 50) * (y1 - y0) + f * (0.25 + rnd(i + 9) * 0.35)) % (y1 - y0));
			return <circle key={i} cx={px} cy={py} r={1.6 + rnd(i + 3) * 2.2} fill={c} opacity={0.25 + rnd(i + 7) * 0.4} />;
		})}
	</g>
);

/* ============================== CLASSROOM ============================== */
const Classroom: React.FC<PP> = ({f, a}) => {
	const stop = a?.stop;
	return (
		<Svg>
			<Wall id="cl-w" c={['#f0e2b6', '#e3cf96']} />
			<rect x={-700} y={618} width={3400} height={282} fill="#d7c08a" />
			<rect x={-700} y={608} width={3400} height={14} fill="#8a6f4e" />
			{/* board */}
			<rect x={120} y={120} width={1040} height={430} rx={8} fill="#7b4c2c" {...o} />
			<rect x={140} y={140} width={1000} height={390} rx={4} fill="#2f5240" />
			<text x={640} y={280} textAnchor="middle" fontSize={92} fontFamily="'Caveat', cursive" fill="#f4f0e0" opacity={0.92}>
				{a?.board ?? 'ENERGY = ?'}
			</text>
			<text x={640} y={400} textAnchor="middle" fontSize={64} fontFamily="'Caveat', cursive" fill="#ffd96a" opacity={0.85}>
				{a?.board2 ?? 'quiz on Friday'}
			</text>
			<rect x={160} y={500} width={960} height={14} fill="#c8b89a" />
			<rect x={300} y={486} width={34} height={14} rx={3} fill="#f6f2e4" />
			{/* window */}
			<rect x={1340} y={110} width={520} height={400} fill="#8fd0f2" {...o} />
			<g clipPath="url(#cl-wc)">
				<clipPath id="cl-wc">
					<rect x={1340} y={110} width={520} height={400} />
				</clipPath>
				<rect x={1340} y={110} width={520} height={400} fill="#8fd0f2" />
				<Cloud x={1480 + ((f * 0.12) % 500)} y={210} s={0.8} />
				<circle cx={1700} cy={180} r={42} fill="#ffe27a" opacity={0.9} />
				<g transform={`translate(${Math.sin(f / 60) * 6},0)`}>
					<ellipse cx={1500} cy={440} rx={120} ry={90} fill="#4c9a58" />
					<ellipse cx={1620} cy={460} rx={140} ry={100} fill="#3f8a4a" />
				</g>
			</g>
			<line x1={1600} y1={110} x2={1600} y2={510} stroke="#fff" strokeWidth={10} />
			<line x1={1340} y1={310} x2={1860} y2={310} stroke="#fff" strokeWidth={10} />
			<rect x={1340} y={110} width={520} height={400} fill="none" stroke="#fff" strokeWidth={14} />
			<Light x={1560} y={150} w={160} len={760} f={f} o={0.2} />
			<Clock x={1220} y={170} f={f} stop={stop} h={a?.h ?? 12} m={a?.m ?? 3} />
			{/* posters */}
			<rect x={1210} y={300} width={90} height={120} fill="#ffb7c5" {...o} />
			<circle cx={1255} cy={345} r={22} fill="#fff" opacity={0.8} />
			<rect x={1900} y={190} width={110} height={150} fill="#bfe3ff" {...o} />
			<Lamp x={760} y={30} c="#fff1c8" />
			<Lamp x={1500} y={30} c="#fff1c8" />
			<Floor c="#b88e66" lines={26} id="cl-f" />
			<Motes f={stop ? 0 : f} x0={1200} x1={1900} y0={140} y1={800} n={20} />
		</Svg>
	);
};

/* ============================== CAFETERIA ============================== */
const Cafeteria: React.FC<PP> = ({f}) => (
	<Svg>
		<Wall id="cf-w" c={['#f6e8c4', '#ecd8a4']} />
		<rect x={-700} y={560} width={3400} height={340} fill="#b8d9cf" />
		<rect x={-700} y={552} width={3400} height={12} fill="#7fa89c" />
		{/* menu board */}
		<rect x={760} y={90} width={520} height={250} rx={8} fill="#2f3a36" {...o} />
		<text x={1020} y={170} textAnchor="middle" fontSize={64} fontFamily="'Caveat', cursive" fill="#f3efe0">
			TODAY: PIZZA
		</text>
		<text x={1020} y={250} textAnchor="middle" fontSize={50} fontFamily="'Caveat', cursive" fill="#ffd96a">
			$3.50
		</text>
		{/* serving counter */}
		<rect x={-100} y={520} width={1500} height={90} rx={10} fill="#c9d3d6" {...o} />
		<rect x={-100} y={610} width={1500} height={290} fill="#7c8d94" {...o} />
		<rect x={-100} y={610} width={1500} height={16} fill="#fff" opacity={0.25} />
		{[0, 1, 2, 3].map((i) => (
			<g key={i}>
				<rect x={50 + i * 340} y={448} width={260} height={80} rx={14} fill="#d9dfe0" {...o} />
				<ellipse cx={180 + i * 340} cy={456} rx={110} ry={16} fill={['#e9a14a', '#d65a4a', '#8bc34a', '#f1d36a'][i]} />
				{Array.from({length: 3}).map((_, k) => (
					<ellipse key={k} cx={130 + i * 340 + k * 50} cy={400 - ((f * 0.6 + k * 30 + i * 11) % 70)} rx={14} ry={22} fill="#fff" opacity={0.28 - ((f * 0.6 + k * 30 + i * 11) % 70) / 300} />
				))}
			</g>
		))}
		<rect x={-100} y={420} width={1500} height={10} fill="#9aa8ad" />
		{/* hanging lamps */}
		{[400, 1100, 1800].map((x, i) => (
			<g key={i} transform={`rotate(${Math.sin(f / 40 + i) * 2.2} ${x} -20)`}>
				<line x1={x} y1={-20} x2={x} y2={100} stroke={INK} strokeWidth={3} />
				<path d={`M${x - 70},150 L${x - 24},96 L${x + 24},96 L${x + 70},150 Z`} fill="#fff6c8" {...o} />
			</g>
		))}
		{/* tables far right */}
		{[1500, 1900].map((x, i) => (
			<g key={i}>
				<rect x={x - 160} y={720} width={320} height={22} rx={6} fill="#c28a5a" {...o} />
				<rect x={x - 130} y={742} width={14} height={158} fill="#5a4a46" />
				<rect x={x + 116} y={742} width={14} height={158} fill="#5a4a46" />
				<rect x={x - 60} y={696} width={44} height={24} rx={4} fill="#e8553f" {...o} />
			</g>
		))}
		<Floor c="#c9b58f" lines={20} id="cf-f" />
	</Svg>
);

/* ============================== ROOF (view over town) ============================== */
const Roof: React.FC<PP> = ({f, a}) => (
	<Svg>
		<Wall id="rf-w" c={a?.sky ?? ['#7fc4ee', '#d7efff']} h={900} />
		<circle cx={1650} cy={180} r={70} fill="#ffe68a" />
		{[200, 700, 1300].map((x, i) => (
			<Cloud key={i} x={((x + f * (0.25 + i * 0.1)) % 3000) - 500} y={170 + i * 70} s={1.1 - i * 0.12} />
		))}
		{/* far skyline */}
		<g opacity={0.8} style={{filter: 'blur(3px)'}}>
			{Array.from({length: 20}).map((_, i) => {
				const w = 120 + rnd(i) * 80;
				const h = 220 + rnd(i + 4) * 280;
				return <rect key={i} x={-600 + i * 170} y={780 - h} width={w} height={h + 200} fill={i % 2 ? '#a5b9d9' : '#9ab0d2'} />;
			})}
		</g>
		{/* school yard far below, tiny people */}
		<rect x={-600} y={760} width={3400} height={140} fill="#7bb36a" />
		<rect x={300} y={800} width={900} height={100} rx={20} fill="#c9a577" />
		{Array.from({length: 22}).map((_, i) => (
			<g key={i}>
				<rect x={380 + i * 38} y={822 + (i % 3) * 14} width={9} height={22} fill={['#e0524a', '#2f6fd8', '#f2b21c', '#3aa37a', '#8b5cf6'][i % 5]} />
				<circle cx={384 + i * 38} cy={816 + (i % 3) * 14} r={6} fill="#f3cba8" />
			</g>
		))}
		{/* roof floor + ledge */}
		<rect x={-700} y={900} width={3400} height={500} fill="#8a8f97" />
		<rect x={-700} y={900} width={3400} height={10} fill="#fff" opacity={0.3} />
		<rect x={-700} y={846} width={3400} height={54} fill="#a9aeb6" {...o} />
		<rect x={-700} y={846} width={3400} height={12} fill="#fff" opacity={0.3} />
		{/* AC unit + vents */}
		<g>
			<rect x={1500} y={650} width={330} height={200} rx={10} fill="#d5dadf" {...o} />
			<circle cx={1610} cy={750} r={62} fill="#9aa3ad" {...o} />
			{[0, 1, 2, 3].map((k) => (
				<line key={k} x1={1610} y1={750} x2={1610 + Math.cos(f * 0.5 + k * 1.57) * 58} y2={750 + Math.sin(f * 0.5 + k * 1.57) * 58} stroke={INK} strokeWidth={5} />
			))}
			<rect x={1722} y={690} width={80} height={110} fill="#b8c0c8" {...o} />
		</g>
		<g>
			<rect x={50} y={720} width={120} height={130} rx={8} fill="#c9ced6" {...o} />
			<path d="M30,720 h160 l-20 -40 h-120 z" fill="#aab1ba" {...o} />
		</g>
		{Array.from({length: 4}).map((_, i) => (
			<path key={i} d={`M${((i * 700 + f * 3) % 3600) - 600},${240 + i * 40} q16,-16 32,0 q16,-16 32,0`} fill="none" stroke={INK} strokeWidth={3} />
		))}
	</Svg>
);

/* ============================== LIBRARY ============================== */
const Library: React.FC<PP> = ({f}) => (
	<Svg>
		<Wall id="lb-w" c={['#e9d1a3', '#d8b985']} />
		{/* shelves */}
		{[-200, 560, 1320, 2080].map((x, k) => (
			<g key={k}>
				<rect x={x} y={90} width={700} height={810} rx={8} fill="#8a5a38" {...o} />
				{[0, 1, 2, 3, 4].map((r) => (
					<g key={r}>
						<rect x={x + 16} y={118 + r * 156} width={668} height={10} fill="#6a4228" />
						{Array.from({length: 17}).map((_, i) => {
							const h = 100 + rnd(i + r * 9 + k * 3) * 40;
							return <rect key={i} x={x + 24 + i * 39} y={118 + r * 156 - h + 8} width={30 + rnd(i * 3 + r) * 6} height={h} fill={['#d9534f', '#4a7fd6', '#f0b54a', '#4a9d6e', '#8e5bc4', '#e68a4a', '#3fbbc0'][(i + r * 2 + k) % 7]} stroke={INK} strokeWidth={2.4} />;
						})}
					</g>
				))}
			</g>
		))}
		<rect x={900} y={460} width={380} height={340} fill="#8fd0f2" {...o} opacity={0} />
		<Light x={1100} y={60} w={140} len={840} f={f} o={0.16} />
		{/* desk lamp light */}
		<Lamp x={1000} y={40} c="#fff1c8" />
		<Floor c="#a47a58" lines={24} id="lb-f" />
		<rect x={-700} y={900} width={3400} height={40} fill="#7a5a44" opacity={0.0} />
		<Motes f={f} x0={800} x1={1400} y0={100} y1={850} n={28} c="#fff6d8" />
	</Svg>
);

/* ============================== LIVING ROOM (party) ============================== */
const Living: React.FC<PP> = ({f, a}) => (
	<Svg>
		<Wall id="lr-w" c={a?.wall ?? ['#cfe6ea', '#b8d6dc']} />
		<rect x={-700} y={720} width={3400} height={180} fill="#a6c8cf" />
		<rect x={-700} y={712} width={3400} height={12} fill="#7fa3ab" />
		{/* door (frame at right) */}
		<rect x={1450} y={330} width={300} height={570} fill="#6a4a38" {...o} />
		<rect x={1470} y={350} width={260} height={550} fill={a?.doorOpen ? '#ffe9b8' : '#8c6347'} />
		{a?.doorOpen ? <polygon points="1470,350 1730,350 1840,900 1470,900" fill="#fff6d8" opacity={0.5} /> : null}
		<circle cx={1700} cy={640} r={10} fill="#e3c06a" {...o} />
		{/* window */}
		<Win id="lr-win" x={360} y={190} w={420} h={330} sky={a?.night ? ['#1b2350', '#3a3f7a'] : ['#8fd0f2', '#dff3ff']} night={a?.night} frame="#f2ece0" />
		{/* sofa */}
		<g>
			<rect x={880} y={620} width={460} height={190} rx={34} fill="#d96b5a" {...o} />
			<rect x={850} y={690} width={70} height={170} rx={26} fill="#c9584a" {...o} />
			<rect x={1310} y={690} width={70} height={170} rx={26} fill="#c9584a" {...o} />
			<rect x={920} y={720} width={400} height={96} rx={18} fill="#e8806f" {...o} />
		</g>
		{/* frames + shelf */}
		<rect x={1010} y={230} width={150} height={110} fill="#ffe7a8" {...o} />
		<circle cx={1085} cy={285} r={30} fill="#f08a3c" />
		<rect x={-80} y={420} width={300} height={16} fill="#8a5a38" {...o} />
		<rect x={-40} y={340} width={50} height={80} fill="#4a7fd6" {...o} />
		<rect x={30} y={360} width={40} height={60} fill="#f0b54a" {...o} />
		<Lamp x={900} y={40} c="#fff1c8" />
		<Floor c="#b9916c" lines={22} id="lr-f" />
		{/* rug */}
		<ellipse cx={1000} cy={930} rx={520} ry={60} fill="#e8b84a" opacity={0.55} />
		<Motes f={f} x0={300} x1={1400} y0={150} y1={850} n={14} />
	</Svg>
);

/* ============================== SITE (construction + fence) ============================== */
const Site: React.FC<PP> = ({f, a}) => {
	const night = a?.dusk;
	return (
		<Svg>
			<Wall id="st-w" c={night ? ['#ff9a5a', '#ffd9a0'] : ['#8fcff2', '#e4f4ff']} h={900} />
			{[300, 1000, 1700].map((x, i) => (
				<Cloud key={i} x={((x + f * (0.2 + i * 0.08)) % 3000) - 500} y={150 + i * 60} s={1.1} />
			))}
			{/* crane */}
			<g style={{filter: 'blur(1.5px)'}}>
				<g transform="translate(1650,0)">
					<rect x={-24} y={-50} width={48} height={760} fill="#f2b21c" {...o} />
					{Array.from({length: 14}).map((_, i) => (
						<line key={i} x1={-24} y1={i * 54} x2={24} y2={i * 54 + 54} stroke={INK} strokeWidth={3} />
					))}
					<g transform={`rotate(${Math.sin(f / 90) * 2.2} 0 40)`}>
						<rect x={-760} y={20} width={1100} height={30} fill="#f2b21c" {...o} />
						<rect x={-24} y={-20} width={48} height={70} fill="#e6a010" {...o} />
						<line x1={-24} y1={-20} x2={-620} y2={20} stroke={INK} strokeWidth={3} />
						<g transform={`translate(${-420 + Math.sin(f / 70) * 160},50)`}>
							<line x1={0} y1={0} x2={0} y2={250 + Math.sin(f / 50) * 40} stroke={INK} strokeWidth={3} />
							<rect x={-30} y={250 + Math.sin(f / 50) * 40} width={60} height={30} rx={6} fill="#555" {...o} />
						</g>
					</g>
				</g>
			</g>
			{/* garage under construction (concrete) */}
			<g>
				{[0, 1, 2, 3].map((fl) => (
					<g key={fl}>
						<rect x={-200} y={720 - fl * 210} width={1500} height={34} fill="#aab0b8" {...o} />
						<rect x={-200} y={720 - fl * 210} width={1500} height={10} fill="#fff" opacity={0.25} />
						{[0, 1, 2, 3, 4].map((c) => (
							<rect key={c} x={-120 + c * 330} y={754 - fl * 210} width={36} height={176} fill="#c4c9d0" {...o} />
						))}
						{fl === 3
							? [0, 1, 2, 3, 4].map((c) => (
									<g key={c} stroke={INK} strokeWidth={2.4}>
										<line x1={-102 + c * 330} y1={720 - fl * 210} x2={-102 + c * 330} y2={640 - fl * 210} />
										<line x1={-108 + c * 330} y1={720 - fl * 210} x2={-96 + c * 330} y2={650 - fl * 210} />
									</g>
								))
							: null}
					</g>
				))}
				<rect x={-200} y={754} width={1500} height={146} fill="#7f858d" opacity={0.25} />
				<rect x={1040} y={724} width={220} height={176} fill="#8a6a44" {...o} />
				<text x={1150} y={832} textAnchor="middle" fontSize={26} fontFamily="'Rubik',sans-serif" fontWeight={800} fill="#fff6d8">
					PARKING
				</text>
			</g>
			{/* dirt ground */}
			<rect x={-700} y={900} width={3400} height={500} fill="#b79870" />
			<rect x={-700} y={900} width={3400} height={10} fill="#fff" opacity={0.25} />
			{/* cones & pile */}
			{[300, 1480, 2100].map((x, i) => (
				<g key={i}>
					<polygon points={`${x - 26},905 ${x + 26},905 ${x + 12},830 ${x - 12},830`} fill="#f08a3c" {...o} />
					<rect x={x - 17} y={858} width={34} height={12} fill="#fff" />
				</g>
			))}
			<ellipse cx={600} cy={905} rx={150} ry={34} fill="#9d7f58" {...o} />
			{/* fence in front */}
			<g>
				<rect x={-700} y={780} width={3400} height={12} fill="#6b7077" />
				<rect x={-700} y={900} width={3400} height={12} fill="#6b7077" />
				{Array.from({length: 40}).map((_, i) => (
					<rect key={i} x={-700 + i * 92} y={780} width={8} height={132} fill="#6b7077" />
				))}
				{Array.from({length: 30}).map((_, i) => (
					<line key={i} x1={-700 + i * 120} y1={792} x2={-580 + i * 120} y2={900} stroke="#8a8f96" strokeWidth={2} opacity={0.55} />
				))}
			</g>
			<Motes f={f} x0={-200} x1={1500} y0={300} y1={900} n={14} c="#d7c5a0" />
		</Svg>
	);
};

/* ============================== CLINIC ============================== */
const Clinic: React.FC<PP> = ({f}) => (
	<Svg>
		<Wall id="cn-w" c={['#e6f4f2', '#cfe8e6']} />
		<rect x={-700} y={600} width={3400} height={300} fill="#a9d6d0" />
		<rect x={-700} y={592} width={3400} height={12} fill="#7fb5ae" />
		{/* lightbox */}
		<rect x={480} y={160} width={520} height={340} rx={12} fill="#2c3340" {...o} />
		<rect x={500} y={180} width={480} height={300} rx={6} fill="#d6f2ff" />
		<rect x={500} y={180} width={480} height={300} rx={6} fill="#fff" opacity={0.3 + 0.12 * Math.sin(f / 9)} />
		{/* hand x-ray ghost */}
		{[0, 1, 2, 3, 4].map((i) => (
			<g key={i} opacity={0.75}>
				<rect x={600 + i * 66} y={250 + Math.abs(i - 2) * 12} width={22} height={170 - Math.abs(i - 2) * 12} rx={10} fill="#8fb4c8" />
				<circle cx={611 + i * 66} cy={310 + Math.abs(i - 2) * 12} r={13} fill="#6f97ae" />
			</g>
		))}
		{/* poster */}
		<rect x={1180} y={150} width={200} height={270} fill="#fff" {...o} />
		<circle cx={1280} cy={230} r={34} fill="#e8c8c0" {...o} />
		<rect x={1250} y={262} width={60} height={110} rx={20} fill="#e8c8c0" {...o} />
		{/* cabinet + bed */}
		<rect x={1500} y={420} width={320} height={480} rx={10} fill="#f2f6f6" {...o} />
		<line x1={1660} y1={430} x2={1660} y2={890} stroke={INK} strokeWidth={3} />
		<rect x={1530} y={470} width={110} height={10} fill="#8fb4c8" />
		<rect x={1680} y={470} width={110} height={10} fill="#8fb4c8" />
		<rect x={80} y={700} width={360} height={30} rx={8} fill="#7fb5ae" {...o} />
		<rect x={110} y={730} width={12} height={170} fill="#8a9a9c" />
		<rect x={400} y={730} width={12} height={170} fill="#8a9a9c" />
		<Clock x={1100} y={540} r={40} f={f} h={3} m={20} />
		<Lamp x={800} y={40} c="#f4ffff" />
		<Floor c="#e2e0d4" lines={22} id="cn-f" />
		<rect x={1800} y={580} width={90} height={60} rx={6} fill="#1d2630" {...o} />
		<polyline points={`1808,${620} 1824,${620} 1832,${600 - ((f / 3) % 20)} 1842,${626} 1852,${620} 1880,${620}`} fill="none" stroke="#4be0a0" strokeWidth={3} />
	</Svg>
);

/* ============================== LOT (school parking, garage, 5 phases) ============================== */
const Lot: React.FC<PP> = ({f, a}) => {
	const phase: 'day' | 'dusk' | 'dust' | 'ruin' | 'night' | 'party' = a?.phase ?? 'dusk';
	const sky: [string, string] = phase === 'day' ? ['#8fcff2', '#e4f4ff'] : phase === 'dusk' ? ['#f08a5a', '#ffd9a0'] : phase === 'dust' ? ['#a8957a', '#d9c7a4'] : phase === 'ruin' ? ['#c3a888', '#e8d6b4'] : ['#1a1f4a', '#4a4f8a'];
	const ruined = phase === 'dust' || phase === 'ruin';
	const wob = phase === 'dust' ? Math.sin(f * 1.3) * 3 : 0;
	return (
		<Svg>
			<Wall id="lo-w" c={sky} h={900} />
			{phase === 'night' || phase === 'party'
				? Array.from({length: 40}).map((_, i) => <circle key={i} cx={-300 + rnd(i) * 2800} cy={30 + rnd(i + 4) * 360} r={1.2 + rnd(i + 8) * 1.8} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />)
				: [300, 1100, 1800].map((x, i) => <Cloud key={i} x={((x + f * (0.2 + i * 0.07)) % 3000) - 500} y={140 + i * 50} s={1.1} c={phase === 'dusk' ? '#ffe9d0' : '#fff'} />)}
			{/* school building left */}
			<g>
				<rect x={-700} y={240} width={1180} height={660} fill="#c97b5e" {...o} />
				<rect x={-700} y={220} width={1180} height={34} fill="#a85f48" {...o} />
				{Array.from({length: 3}).map((_, r) =>
					Array.from({length: 6}).map((_, c) => (
						<g key={r + '-' + c}>
							<rect x={-640 + c * 180} y={310 + r * 180} width={110} height={120} fill={phase === 'night' || phase === 'party' || phase === 'dusk' ? '#ffe9a0' : '#8fd0f2'} {...o} />
							<line x1={-585 + c * 180} y1={310 + r * 180} x2={-585 + c * 180} y2={430 + r * 180} stroke={INK} strokeWidth={3} />
						</g>
					)),
				)}
			</g>
			{/* garage */}
			<g transform={`translate(${wob},0)`}>
				{!ruined
					? [0, 1, 2, 3].map((fl) => (
							<g key={fl}>
								<rect x={620} y={720 - fl * 190} width={1180} height={32} fill="#aab0b8" {...o} />
								{[0, 1, 2, 3, 4].map((c) => (
									<rect key={c} x={650 + c * 270} y={752 - fl * 190} width={34} height={148 - 0} fill="#c4c9d0" {...o} />
								))}
							</g>
						))
					: [0, 1, 2, 3].map((fl) => (
							<g key={fl}>
								<polygon points={`620,${850 - fl * 34} 1800,${838 - fl * 34} 1800,${868 - fl * 34} 620,${880 - fl * 34}`} fill="#aab0b8" {...o} />
							</g>
						))}
				{ruined ? (
					<g>
						<polygon points="620,880 1800,880 1760,770 1500,730 1200,770 900,740 660,790" fill="#9aa0a8" {...o} opacity={0.9} />
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<line key={i} x1={700 + i * 180} y1={760} x2={730 + i * 180 + (i % 2) * 40} y2={690 - (i % 3) * 20} stroke={INK} strokeWidth={3} />
						))}
					</g>
				) : null}
			</g>
			{/* crane */}
			<g style={{filter: 'blur(2px)'}} opacity={ruined ? 0.55 : 1}>
				<g transform="translate(2050,0)">
					<rect x={-20} y={-50} width={40} height={780} fill="#f2b21c" {...o} />
					<g transform={`rotate(${Math.sin(f / 90) * 2} 0 40)`}>
						<rect x={-640} y={20} width={960} height={26} fill="#f2b21c" {...o} />
					</g>
				</g>
			</g>
			{/* asphalt + lines */}
			<rect x={-700} y={900} width={3400} height={500} fill={phase === 'night' || phase === 'party' ? '#2b2e3d' : '#6f7480'} />
			<rect x={-700} y={900} width={3400} height={10} fill="#fff" opacity={0.2} />
			{Array.from({length: 14}).map((_, i) => (
				<polygon key={i} points={`${-500 + i * 240},960 ${-470 + i * 240},960 ${-540 + i * 240},1080 ${-570 + i * 240},1080`} fill="#fff" opacity={0.5} />
			))}
			{/* dust wave */}
			{phase === 'dust' || phase === 'ruin' ? (
				<g style={{filter: 'blur(10px)'}} opacity={phase === 'dust' ? 0.85 : 0.5}>
					{Array.from({length: 14}).map((_, i) => (
						<ellipse key={i} cx={500 + i * 130 + Math.sin(f / 20 + i) * 30} cy={760 - Math.abs(Math.sin(i)) * 120 - ((f * 0.4) % 40)} rx={170} ry={120} fill="#c8b69a" />
					))}
				</g>
			) : null}
			{/* string lights for the party */}
			{phase === 'party' ? (
				<g>
					<path d="M-200,300 Q500,480 1200,300 T2600,300" fill="none" stroke={INK} strokeWidth={3} />
					{Array.from({length: 22}).map((_, i) => {
						const x = -200 + i * 130;
						const y = 300 + Math.sin(((x + 200) / 1400) * Math.PI) * 150 * (i % 2 ? 0 : 0);
						return <circle key={i} cx={x} cy={y + 80 + (Math.abs(((x + 200) % 1400) - 700) < 0 ? 0 : 0) + Math.sin(((x + 200) / 700) * Math.PI) * 0} r={10} fill={['#ffd24a', '#ff7a8a', '#6fd0ff', '#9ee08a'][i % 4]} opacity={0.7 + 0.3 * Math.sin(f / 7 + i)} />;
					})}
				</g>
			) : null}
		</Svg>
	);
};

/* ============================== WARD ============================== */
const Ward: React.FC<PP> = ({f}) => (
	<Svg>
		<Wall id="wd-w" c={['#e9f3f6', '#d3e5ec']} />
		<rect x={-700} y={640} width={3400} height={260} fill="#b8d6de" />
		<rect x={-700} y={632} width={3400} height={12} fill="#8fb4be" />
		<Win id="wd-win" x={1280} y={170} w={440} h={340} sky={['#8fd0f2', '#e4f4ff']} frame="#f4f6f8" />
		<Light x={1500} y={190} w={120} len={700} f={f} o={0.16} />
		{/* monitor */}
		<g>
			<rect x={150} y={330} width={220} height={160} rx={12} fill="#1d2630" {...o} />
			<polyline points={`170,430 205,430 218,${400 - Math.abs(Math.sin(f / 8)) * 18} 232,452 246,430 350,430`} fill="none" stroke="#4be0a0" strokeWidth={4} />
			<rect x={240} y={490} width={14} height={410} fill="#8a9aa0" />
		</g>
		<Lamp x={900} y={40} c="#f4ffff" />
		<Floor c="#dedbd0" lines={24} id="wd-f" />
	</Svg>
);

/* ============================== VOID (rules, facts) ============================== */
const Void: React.FC<PP> = ({f, a}) => {
	const c: [string, string] = a?.c ?? ['#12163a', '#2a2f6a'];
	return (
		<Svg>
			<Wall id="vd-w" c={c} h={1200} />
			{Array.from({length: 60}).map((_, i) => (
				<circle key={i} cx={-300 + rnd(i) * 2700} cy={-100 + ((rnd(i + 3) * 1300 + f * (0.1 + rnd(i + 9) * 0.3)) % 1300)} r={1.5 + rnd(i + 7) * 3.5} fill="#fff" opacity={0.15 + rnd(i + 1) * 0.5} />
			))}
			<rect x={-700} y={900} width={3400} height={400} fill="#0c0f2a" opacity={0.55} />
			{a?.clock ? (
				<g transform="translate(960,500)">
					<circle r={300} fill="none" stroke="#8fd0ff" strokeWidth={10} opacity={0.5} />
					<line x1={0} y1={0} x2={0} y2={-210} stroke="#8fd0ff" strokeWidth={10} strokeLinecap="round" transform={`rotate(${a.stop ? 40 : f * 3})`} />
					<line x1={0} y1={0} x2={0} y2={-140} stroke="#8fd0ff" strokeWidth={14} strokeLinecap="round" transform={`rotate(${a.stop ? 150 : f * 0.5})`} />
					<circle r={16} fill="#8fd0ff" />
				</g>
			) : null}
		</Svg>
	);
};

const Plain: React.FC<{c: [string, string]; id: string}> = ({c, id}) => (
	<Svg>
		<Wall id={id} c={c} h={1200} />
	</Svg>
);

/* thin wrappers for ready-made sets */
const W = (C: React.FC<any>, fn?: (p: PP) => any): React.FC<PP> => (p) => <C {...(fn ? fn(p) : {})} />;
const BedroomP: React.FC<PP> = ({f, night, a}) => (
	<>
		<Bedroom f={f} night={night} ring={a?.ring} />
	</>
);
const KitchenP: React.FC<PP> = ({night, a}) => (
	<>
		<Kitchen night={night} />
		{a?.table ? <KitchenTable night={night} mugs={a?.mugs ?? 2} /> : null}
	</>
);
const YardP: React.FC<PP> = ({f}) => <SchoolYard f={f} />;
const MoonP: React.FC<PP> = ({f}) => <Moon f={f} />;

export const PLACES: Record<string, React.FC<PP>> = {
	classroom: Classroom,
	cafeteria: Cafeteria,
	roof: Roof,
	library: Library,
	living: Living,
	site: Site,
	clinic: Clinic,
	lot: Lot,
	ward: Ward,
	void: Void,
	bedroom: BedroomP,
	kitchen: KitchenP,
	yard: YardP,
	moon: MoonP,
	black: ({a}) => <Plain id="bk-w" c={a?.c ?? ['#020204', '#0a0a12']} />,
	white: () => <Plain id="wh-w" c={['#f8f8f2', '#e8e8dc']} />,
};
