import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {Corridor, Bedroom, Blanket, Kitchen} from '../kit/sets';
import {FONT, HAND} from '../kit/ui';

/* Locations of this video. Flat, big shapes, one light, one living detail each. */

const G: React.FC<{id: string; a: string; b: string; v?: boolean}> = ({id, a, b, v = true}) => (
	<linearGradient id={id} x1="0" y1="0" x2={v ? 0 : 1} y2={v ? 1 : 0}>
		<stop offset="0" stopColor={a} />
		<stop offset="1" stopColor={b} />
	</linearGradient>
);
const Wall: React.FC<{id: string; a: string; b: string; y0?: number; y1?: number}> = ({id, a, b, y0 = -300, y1 = 920}) => (
	<>
		<defs>
			<G id={id} a={a} b={b} />
		</defs>
		<rect x={-700} y={y0} width={3300} height={y1 - y0} fill={`url(#${id})`} />
	</>
);
const Floor: React.FC<{y?: number; c: string; line?: string; planks?: boolean}> = ({y = 900, c, line, planks}) => (
	<g>
		<rect x={-700} y={y} width={3300} height={700} fill={c} />
		{planks
			? Array.from({length: 18}).map((_, i) => <line key={i} x1={-700 + i * 190} y1={y} x2={-1100 + i * 260} y2={y + 400} stroke={line ?? '#00000018'} strokeWidth={4} />)
			: null}
		<rect x={-700} y={y} width={3300} height={8} fill="#00000022" />
	</g>
);
const Win: React.FC<{x: number; y: number; w: number; h: number; sky?: [string, string]; id: string}> = ({x, y, w, h, sky = ['#9fd2f0', '#e6f4fb'], id}) => (
	<g>
		<defs>
			<G id={id} a={sky[0]} b={sky[1]} />
		</defs>
		<rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={8} fill="#fffaf0" />
		<rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
		<rect x={x + w / 2 - 5} y={y} width={10} height={h} fill="#fffaf0" />
		<rect x={x} y={y + h / 2 - 5} width={w} height={10} fill="#fffaf0" />
	</g>
);
const Tree: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#4aa04a'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-14} y={-140} width={28} height={140} fill="#6b4a2a" />
		<circle cx={0} cy={-190} r={110} fill={c} />
		<circle cx={-70} cy={-150} r={70} fill={c} opacity={0.9} />
		<circle cx={72} cy={-156} r={76} fill={c} opacity={0.95} />
	</g>
);
const Cloud: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 0.85}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
		<ellipse cx={0} cy={0} rx={120} ry={34} fill="#fff" />
		<ellipse cx={-60} cy={-20} rx={60} ry={34} fill="#fff" />
		<ellipse cx={50} cy={-26} rx={70} ry={38} fill="#fff" />
	</g>
);

/* ------------------------------- dinner room ------------------------------- */
export const Dinner: React.FC<{f: number}> = ({f}) => {
	const a = (f * 7) % 360;
	return (
		<Svg>
			<Wall id="dn-w" a="#f2d9a6" b="#e7c58a" />
			{Array.from({length: 22}).map((_, i) => (
				<rect key={i} x={-300 + i * 120} y={-100} width={60} height={800} fill="#ffffff" opacity={0.07} />
			))}
			<rect x={-700} y={560} width={3300} height={30} fill="#b07a4a" />
			<rect x={-700} y={590} width={3300} height={330} fill="#c99466" />
			<Win id="dn-win" x={120} y={190} w={330} h={280} />
			<Win id="dn-win2" x={1470} y={190} w={330} h={280} />
			{[0, 1, 2].map((i) => (
				<g key={i} transform={`translate(${620 + i * 260},${230 + (i % 2) * 20})`}>
					<rect x={-70} y={-60} width={140} height={110} fill="#8a5a34" />
					<rect x={-58} y={-48} width={116} height={86} fill={['#f6d29a', '#bfe0c8', '#e8b6c4'][i]} />
					<circle cx={0} cy={-8} r={20} fill="#000" opacity={0.75} />
				</g>
			))}
			{/* ceiling fan */}
			<g transform="translate(960,0)">
				<rect x={-6} y={0} width={12} height={90} fill="#5a4636" />
				<ellipse cx={0} cy={96} rx={44} ry={18} fill="#6a5440" />
				{[0, 1, 2, 3].map((i) => (
					<g key={i} transform={`rotate(${a + i * 90} 0 96)`}>
						<ellipse cx={110} cy={96} rx={96} ry={13} fill="#d9b78a" />
					</g>
				))}
			</g>
			<Floor c="#a8714a" planks line="#00000020" />
		</Svg>
	);
};
/* table in front of the diners (drawn over their legs) */
export const DinnerTable: React.FC<{f: number; steam?: boolean; dish?: boolean}> = ({f, steam = true, dish = true}) => (
	<Svg>
		<rect x={250} y={700} width={1420} height={30} rx={8} fill="#fffaf0" />
		<rect x={250} y={724} width={1420} height={190} fill="#f4ead6" />
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={250 + i * 102} y={724} width={50} height={190} fill="#e6d6b4" opacity={0.7} />
		))}
		{[420, 640, 1280, 1500].map((x, i) => (
			<g key={i}>
				<ellipse cx={x} cy={704} rx={56} ry={9} fill="#fff" stroke="#dcd0b8" />
				<circle cx={x + 76} cy={698} r={6} fill="#c8b48a" />
			</g>
		))}
		{dish ? (
			<g>
				<ellipse cx={960} cy={706} rx={118} ry={20} fill="#6a4a3a" />
				<path d="M850,704 q0,-52 110,-52 q110,0 110,52 z" fill="#d98a3a" />
				<path d="M860,684 q100,-22 200,0" stroke="#f2c25a" strokeWidth={10} fill="none" />
				{[0, 1, 2, 3].map((i) => (
					<circle key={i} cx={900 + i * 40} cy={668 - (i % 2) * 6} r={9} fill="#7a3a22" />
				))}
				{steam
					? [0, 1, 2].map((i) => {
							const k = ((f / 40 + i / 3) % 1);
							return <path key={i} d={`M${920 + i * 40},${640 - k * 80} q14,-24 0,-44 q-14,-20 0,-40`} stroke="#fff" strokeWidth={8} fill="none" opacity={(1 - k) * 0.7} strokeLinecap="round" />;
						})
					: null}
			</g>
		) : null}
	</Svg>
);

/* --------------------------------- classroom -------------------------------- */
export const Class: React.FC<{f: number}> = () => (
	<Svg>
		<Wall id="cl-w" a="#f0e4c0" b="#e0cc98" />
		<rect x={-700} y={600} width={3300} height={320} fill="#cdb67f" />
		<rect x={250} y={150} width={1000} height={420} rx={6} fill="#8a5a34" />
		<rect x={266} y={166} width={968} height={388} fill="#2f5a46" />
		<text x={750} y={290} textAnchor="middle" fontSize={78} fontFamily={HAND} fill="#f6f2e4">
			WORLD HISTORY
		</text>
		<text x={750} y={400} textAnchor="middle" fontSize={56} fontFamily={HAND} fill="#f6f2e4" opacity={0.85}>
			Chapter 9 — Reading Quiz
		</text>
		<rect x={300} y={520} width={900} height={14} fill="#e8e2cc" />
		<Win id="cl-win" x={1380} y={170} w={420} h={330} />
		<g transform="translate(1560,560)">
			<circle r={40} cx={-260} cy={-410} fill="#fff" stroke="#222" strokeWidth={6} />
			<line x1={-260} y1={-410} x2={-260} y2={-436} stroke="#222" strokeWidth={5} />
			<line x1={-260} y1={-410} x2={-244} y2={-404} stroke="#222" strokeWidth={5} />
		</g>
		<Floor c="#b88e6a" planks />
	</Svg>
);
export const Desks: React.FC<{xs: number[]; y?: number}> = ({xs, y = 760}) => (
	<Svg>
		{xs.map((x, i) => (
			<g key={i}>
				<rect x={x - 80} y={y} width={160} height={16} rx={4} fill="#d8a66a" />
				<rect x={x - 68} y={y + 16} width={10} height={140} fill="#5a5f70" />
				<rect x={x + 58} y={y + 16} width={10} height={140} fill="#5a5f70" />
			</g>
		))}
	</Svg>
);

/* ---------------------------------- outdoors --------------------------------- */
type OutKind = 'school' | 'sidewalk' | 'house' | 'bench' | 'parking';
export const Outdoor: React.FC<{f: number; kind: OutKind; evening?: boolean}> = ({f, kind, evening}) => {
	const sky: [string, string] = evening ? ['#f6a56a', '#fde0b0'] : ['#7fc0ea', '#dff1fb'];
	return (
		<Svg>
			<Wall id={'ot-s' + kind + evening} a={sky[0]} b={sky[1]} y1={760} />
			{[200, 900, 1500].map((x, i) => (
				<Cloud key={i} x={x + ((f * 0.25) % 2400) * (i % 2 ? 0.7 : 1) - 300} y={150 + i * 60} s={1 + i * 0.2} />
			))}
			{/* far houses */}
			{Array.from({length: 12}).map((_, i) => (
				<g key={i} opacity={0.8}>
					<rect x={-200 + i * 240} y={560 - (i % 3) * 30} width={190} height={240} fill={['#e9a58a', '#b9c8e6', '#f0dca0', '#a9d6b6'][i % 4]} />
					<path d={`M${-210 + i * 240},${560 - (i % 3) * 30} L${-105 + i * 240},${470 - (i % 3) * 30} L${0 + i * 240},${560 - (i % 3) * 30} Z`} fill="#8a5a4a" />
				</g>
			))}
			{kind === 'school' ? (
				<g>
					<rect x={260} y={300} width={1400} height={540} fill="#c4604a" />
					{Array.from({length: 2}).map((_, r) =>
						Array.from({length: 8}).map((__, c) => (
							<g key={`${r}${c}`}>
								<rect x={320 + c * 165} y={350 + r * 200} width={110} height={140} fill="#e9f4fb" />
								<rect x={328 + c * 165} y={358 + r * 200} width={94} height={124} fill="#a9d4ee" />
							</g>
						)),
					)}
					<rect x={700} y={250} width={520} height={74} rx={8} fill="#2b3366" />
					<text x={960} y={304} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={800} fill="#fff">
						LINCOLN HIGH
					</text>
					<rect x={880} y={650} width={160} height={190} fill="#5a3a2a" />
					<line x1={960} y1={650} x2={960} y2={840} stroke="#2b1d14" strokeWidth={6} />
				</g>
			) : null}
			{kind === 'house' ? (
				<g>
					<rect x={380} y={380} width={1000} height={470} fill="#f1d6a8" />
					<path d="M340,390 L880,170 L1420,390 Z" fill="#8a4a3a" />
					<rect x={820} y={560} width={150} height={290} fill="#7a4a2a" />
					<circle cx={950} cy={710} r={9} fill="#e6c25a" />
					<Win id="hs-w1" x={470} y={470} w={200} h={190} />
					<Win id="hs-w2" x={1090} y={470} w={200} h={190} />
					<rect x={700} y={830} width={380} height={26} fill="#c9a06a" />
					<rect x={740} y={856} width={300} height={22} fill="#b08a56" />
				</g>
			) : null}
			{kind === 'bench' || kind === 'sidewalk' || kind === 'parking' ? (
				<g>
					<rect x={-100} y={440} width={2200} height={400} fill="#e0d3b6" opacity={0.0} />
					{[200, 1700].map((x, i) => (
						<Tree key={i} x={x} y={840} s={1.2 - i * 0.2} />
					))}
				</g>
			) : null}
			{kind === 'parking' ? (
				<g>
					{[450, 1480].map((x, i) => (
						<g key={i}>
							<rect x={x} y={700} width={330} height={110} rx={26} fill={['#3a6fd2', '#d94a3a'][i]} />
							<path d={`M${x + 60},700 q40,-70 120,-70 q80,0 110,70 z`} fill={['#2f5ab0', '#b83a2a'][i]} />
							<circle cx={x + 70} cy={812} r={34} fill="#222" />
							<circle cx={x + 260} cy={812} r={34} fill="#222" />
						</g>
					))}
				</g>
			) : null}
			{[300, 1650].map((x, i) => (
				<g key={i} transform={`translate(${x},845)`}>
					<rect x={-7} y={-300} width={14} height={300} fill="#3a3f50" />
					<rect x={-40} y={-318} width={80} height={22} rx={8} fill="#3a3f50" />
					<ellipse cx={0} cy={-300} rx={30} ry={8} fill="#ffe9a0" opacity={0.7} />
				</g>
			))}
			<Floor y={845} c="#b9b2a4" />
			<rect x={-700} y={845} width={3300} height={60} fill="#cfc8ba" />
			<rect x={-700} y={905} width={3300} height={20} fill="#8f897d" />
			<rect x={-700} y={925} width={3300} height={700} fill="#4a4d58" />
			{Array.from({length: 14}).map((_, i) => (
				<rect key={i} x={-700 + i * 260} y={1010} width={130} height={10} fill="#e8e2d0" opacity={0.8} />
			))}
			{kind === 'bench' ? (
				<g>
					<rect x={760} y={760} width={400} height={20} rx={6} fill="#8a5a34" />
					<rect x={760} y={720} width={400} height={16} rx={6} fill="#8a5a34" />
					<rect x={780} y={780} width={14} height={72} fill="#3a3f50" />
					<rect x={1126} y={780} width={14} height={72} fill="#3a3f50" />
				</g>
			) : null}
		</Svg>
	);
};

/* ----------------------------- football field / gym ------------------------- */
export const Field: React.FC<{f: number; hot?: number; banner?: boolean; night?: boolean}> = ({f, hot = 1, banner}) => (
	<Svg>
		<Wall id="fd-s" a={hot > 0.5 ? '#fff6dc' : '#8fcdf0'} b={hot > 0.5 ? '#ffe2a0' : '#e0f2fb'} y1={640} />
		{hot > 0.5 ? <circle cx={1500} cy={170} r={150} fill="#fffbe8" opacity={0.9} /> : null}
		{hot > 0.5 ? <circle cx={1500} cy={170} r={260} fill="#fff6c8" opacity={0.35} /> : null}
		{/* bleachers */}
		<g>
			{Array.from({length: 5}).map((_, i) => (
				<rect key={i} x={1050 + i * 40} y={500 + i * 50} width={1000 - i * 40} height={44} fill={i % 2 ? '#aeb4c2' : '#c4c9d6'} />
			))}
			<rect x={1050} y={730} width={1000} height={40} fill="#8a90a0" />
		</g>
		{/* gym building with door and banner */}
		<rect x={-200} y={380} width={940} height={450} fill="#b9533d" />
		{Array.from({length: 10}).map((_, i) => (
			<line key={i} x1={-200} y1={420 + i * 44} x2={740} y2={420 + i * 44} stroke="#9c432f" strokeWidth={3} />
		))}
		<rect x={250} y={560} width={200} height={270} fill="#3a4256" />
		<rect x={262} y={572} width={80} height={258} fill="#4a5470" />
		<rect x={352} y={572} width={86} height={258} fill="#4a5470" />
		{banner ? (
			<g>
				<rect x={140} y={450} width={420} height={80} rx={6} fill="#f6f1de" stroke="#2b3a67" strokeWidth={5} />
				<text x={350} y={502} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#2b3a67">
					WATER IS A REWARD
				</text>
			</g>
		) : null}
		{/* far goal posts + fence */}
		<g transform="translate(1100,760)">
			<rect x={-5} y={-170} width={10} height={170} fill="#f2c94a" />
			<rect x={-120} y={-170} width={240} height={10} fill="#f2c94a" />
			<rect x={-120} y={-250} width={10} height={90} fill="#f2c94a" />
			<rect x={110} y={-250} width={10} height={90} fill="#f2c94a" />
		</g>
		<rect x={-700} y={780} width={3300} height={110} fill={hot > 0.5 ? '#b8b860' : '#5aa04a'} />
		{Array.from({length: 40}).map((_, i) => (
			<line key={i} x1={-700 + i * 80} y1={780} x2={-700 + i * 80} y2={880} stroke="#8a8a40" strokeWidth={3} opacity={0.5} />
		))}
		<Floor y={880} c={hot > 0.5 ? '#c4b86a' : '#58a64c'} />
		{Array.from({length: 8}).map((_, i) => (
			<rect key={i} x={-700 + i * 420 + ((i * 97) % 40)} y={930 + (i % 3) * 22} width={220} height={9} fill="#ffffff" opacity={0.45} />
		))}
		{Array.from({length: 24}).map((_, i) => (
			<circle key={i} cx={-300 + i * 130} cy={900 + (i % 5) * 16} r={5} fill={hot > 0.5 ? '#9c9440' : '#3d8a38'} opacity={0.6} />
		))}
		{hot > 0.5 ? (
			<rect x={-700} y={820} width={3300} height={200} fill="#fff6dc" opacity={0.12 + 0.04 * Math.sin(f / 6)} />
		) : null}
	</Svg>
);

/* ---------------------------- auditorium / council ---------------------------- */
export const Hall: React.FC<{f: number; kind: 'assembly' | 'council'}> = ({f, kind}) => (
	<Svg>
		<Wall id={'ha-w' + kind} a={kind === 'assembly' ? '#2b3a67' : '#6b4a32'} b={kind === 'assembly' ? '#3d4e86' : '#8a6040'} />
		{kind === 'assembly' ? (
			<g>
				<rect x={380} y={190} width={1160} height={380} fill="#8b1f2e" />
				{Array.from({length: 18}).map((_, i) => (
					<rect key={i} x={380 + i * 64} y={190} width={30} height={380} fill="#6e1624" opacity={0.7} />
				))}
				<rect x={380} y={170} width={1160} height={40} fill="#d9a62a" />
				<rect x={380} y={560} width={1160} height={26} fill="#5a3a2a" />
				{/* podium + mic */}
				<rect x={1280} y={420} width={160} height={150} fill="#7a4a2a" />
				<rect x={1356} y={330} width={8} height={90} fill="#222" />
				<circle cx={1360} cy={322} r={14} fill="#222" />
			</g>
		) : (
			<g>
				<circle cx={960} cy={230} r={150} fill="#e8c87a" />
				<circle cx={960} cy={230} r={118} fill="#f4e2ac" />
				<text x={960} y={248} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={800} fill="#6b4a32">
					CITY COUNCIL
				</text>
				{Array.from({length: 7}).map((_, i) => (
					<rect key={i} x={160 + i * 240} y={400} width={170} height={400} fill="#7a5238" opacity={0.7} />
				))}
				<rect x={380} y={560} width={1160} height={40} fill="#4a2f1e" />
				<rect x={380} y={600} width={1160} height={140} fill="#5a3a26" />
			</g>
		)}
		<Floor c={kind === 'assembly' ? '#b8905a' : '#8a6a4a'} planks />
		{/* back rows of seats / heads */}
		{Array.from({length: kind === 'assembly' ? 30 : 20}).map((_, i) => (
			<circle key={i} cx={-200 + (i * 2200) / (kind === 'assembly' ? 30 : 20) + ((i * 53) % 30)} cy={900 + ((i * 29) % 3) * 8} r={34} fill={['#2a2a3a', '#3a2a2a', '#2a3a3a'][i % 3]} />
		))}
	</Svg>
);

/* -------------------------------- cafeteria --------------------------------- */
export const Cafeteria: React.FC<{f: number}> = () => (
	<Svg>
		<Wall id="cf-w" a="#f4e8c8" b="#e4d2a0" />
		<rect x={-700} y={560} width={3300} height={30} fill="#6aa892" />
		{Array.from({length: 6}).map((_, i) => (
			<rect key={i} x={120 + i * 300} y={150} width={220} height={150} fill="#fffbe8" opacity={0.7} />
		))}
		<rect x={1020} y={440} width={820} height={140} fill="#c9c4b4" />
		<rect x={1020} y={580} width={820} height={320} fill="#8aa4b8" />
		<rect x={1020} y={420} width={820} height={30} fill="#e6e0cc" />
		<rect x={1100} y={250} width={640} height={110} rx={10} fill="#2b3a67" />
		<text x={1420} y={326} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#ffd34a">
			FISH STICKS
		</text>
		{Array.from({length: 5}).map((_, i) => (
			<g key={i}>
				<rect x={1060 + i * 155} y={470} width={120} height={22} rx={6} fill="#a9b2c0" />
				<rect x={1070 + i * 155} y={448} width={100} height={22} rx={8} fill="#e8b25a" />
			</g>
		))}
		<Floor c="#cfb98a" />
		{[220, 640].map((x, i) => (
			<g key={i}>
				<rect x={x - 200} y={760} width={400} height={20} rx={6} fill="#d8a66a" />
				<rect x={x - 180} y={780} width={14} height={120} fill="#5a5f70" />
				<rect x={x + 166} y={780} width={14} height={120} fill="#5a5f70" />
			</g>
		))}
	</Svg>
);

/* ---------------------------------- hospital --------------------------------- */
export const Hospital: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="hp-w" a="#e3f1ec" b="#cfe6de" />
		<rect x={-700} y={560} width={3300} height={20} fill="#9fcdbf" />
		<Win id="hp-win" x={1380} y={170} w={380} h={300} sky={['#a9d8f4', '#eef8fd']} />
		<g transform="translate(300,300)">
			<rect width={360} height={230} rx={10} fill="#1a2230" />
			<polyline
				points={Array.from({length: 40}).map((_, i) => {
					const x = i * 9;
					const ph = (i + f / 3) % 20;
					const y = ph < 2 ? -70 : ph < 4 ? 60 : ph < 6 ? -20 : 0;
					return `${x - 0 + 0},${115 + y * 0.8}`;
				}).join(' ')}
				stroke="#6ef0a0"
				strokeWidth={4}
				fill="none"
				transform="translate(0,0)"
			/>
			<text x={20} y={40} fontSize={30} fontFamily={FONT} fill="#6ef0a0">
				HR 72
			</text>
		</g>
		<Floor c="#b9d4cc" />
		{/* bed */}
		<rect x={820} y={640} width={780} height={30} rx={8} fill="#cfd8de" />
		<rect x={820} y={670} width={780} height={170} fill="#f2f7f8" />
		<rect x={1480} y={560} width={40} height={310} fill="#b8c4cc" />
		<rect x={820} y={820} width={20} height={80} fill="#7a8892" />
		<rect x={1580} y={820} width={20} height={80} fill="#7a8892" />
		{/* iv stand */}
		<rect x={1700} y={300} width={8} height={600} fill="#9aa6ae" />
		<rect x={1680} y={300} width={48} height={90} rx={12} fill="#e6f6ff" stroke="#9aa6ae" strokeWidth={4} />
	</Svg>
);

/* ---------------------------------- vertical pieces --------------------------- */
export {Bedroom, Blanket, Kitchen, Corridor};
export const Banner: React.FC<{x: number; y: number; text: string; w?: number}> = ({x, y, text, w = 420}) => (
	<g>
		<rect x={x - w / 2} y={y - 40} width={w} height={80} rx={6} fill="#f6f1de" stroke="#2b3a67" strokeWidth={5} />
		<text x={x} y={y + 12} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#2b3a67">
			{text}
		</text>
	</g>
);
export {random};

export const Tub: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 215} y={800} width={430} height={150} rx={40} fill="#3a8ad4" />
		<rect x={x - 215} y={800} width={430} height={34} rx={17} fill="#6fb4f0" />
		<ellipse cx={x} cy={802} rx={200} ry={18} fill="#a9e0ff" opacity={0.9} />
		{Array.from({length: 9}).map((_, i) => (
			<rect key={i} x={x - 180 + i * 42} y={786 + (i % 3) * 6} width={32} height={26} rx={6} fill="#e8f8ff" stroke="#9fd8f6" strokeWidth={3} transform={`rotate(${(i * 23) % 40 - 20} ${x - 164 + i * 42} 800)`} />
		))}
	</g>
);
