import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten} from '../engine/color';
import {Floor, Grad, Lamp, Poster, Wall, Win} from '../kit/sets';
import {FONT, HAND} from '../kit/ui';

/* Locations of «What if every lie came true?». World 1920×1080, floor y = 900.
   Every set reaches past the frame edges so the moving camera never sees a border. */

const Clock: React.FC<{x: number; y: number; f: number; r?: number}> = ({x, y, f, r = 46}) => (
	<g>
		<circle cx={x} cy={y} r={r + 6} fill="#2b2f3a" />
		<circle cx={x} cy={y} r={r} fill="#fbf8ef" />
		<line x1={x} y1={y} x2={x + Math.sin(f / 40) * r * 0.75} y2={y - Math.cos(f / 40) * r * 0.75} stroke="#d23b3b" strokeWidth={3} />
		<line x1={x} y1={y} x2={x + r * 0.45} y2={y - r * 0.2} stroke="#2b2f3a" strokeWidth={6} strokeLinecap="round" />
		<line x1={x} y1={y} x2={x} y2={y - r * 0.7} stroke="#2b2f3a" strokeWidth={4} strokeLinecap="round" />
	</g>
);

const Tree: React.FC<{x: number; y: number; s?: number; f: number; c?: string}> = ({x, y, s = 1, f, c = '#4aa04a'}) => {
	const sw = Math.sin(f / 30 + x) * 4;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-14} y={-260} width={28} height={260} fill="#6b4a2a" />
			<g transform={`rotate(${sw * 0.3} 0 -260)`}>
				<circle cx={sw} cy={-330} r={120} fill={c} />
				<circle cx={-70 + sw} cy={-280} r={80} fill={darken(c, 0.12)} />
				<circle cx={80 + sw} cy={-290} r={86} fill={lighten(c, 0.1)} />
			</g>
		</g>
	);
};

/* ------------------------------- classroom ------------------------------- */
export const ClassRoom: React.FC<{f: number; board?: string; night?: boolean}> = ({f, board = 'HOMEWORK DUE TODAY!', night}) => (
	<Svg>
		<Wall id="cr-w" top={night ? '#3a3554' : '#f0e2b8'} bot={night ? '#4a4264' : '#e8d4a0'} trim="#8a7458" trimY={620} />
		<rect x={-400} y={632} width={2800} height={280} fill={night ? '#3a4a5a' : '#7fb0a0'} />
		{/* chalkboard */}
		<rect x={380} y={150} width={1160} height={400} rx={8} fill="#7b4c2c" />
		<rect x={396} y={166} width={1128} height={368} fill="#2c4a3a" />
		<text x={960} y={300} textAnchor="middle" fontSize={78} fontFamily={HAND} fontWeight={700} fill="#f4e7a1">
			{board}
		</text>
		<text x={960} y={400} textAnchor="middle" fontSize={50} fontFamily={HAND} fill="#f6f2e4" opacity={0.85}>
			Math p. 42, ex. 1–10
		</text>
		<path d="M520,450 q60,-30 120,0 t120,0" stroke="#f6f2e4" strokeWidth={4} fill="none" opacity={0.5} />
		<rect x={400} y={540} width={1120} height={12} fill="#5e3a22" />
		<Clock x={1720} y={220} f={f} />
		<Win id="cr-win1" x={-260} y={160} w={480} h={380} sky={night ? ['#0b1030', '#2a2f63'] : ['#8fc8ee', '#d9eef9']} night={night} />
		<Win id="cr-win2" x={1840} y={160} w={480} h={380} sky={night ? ['#0b1030', '#2a2f63'] : ['#8fc8ee', '#d9eef9']} night={night} />
		<Poster x={1620} y={330} w={170} h={230} c="#3a6fd2" tilt={3}>
			<text x={1705} y={420} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#fff">
				READ
			</text>
			<text x={1705} y={470} textAnchor="middle" fontSize={22} fontFamily={FONT} fill="#ffe08a">
				every day
			</text>
		</Poster>
		<Floor y={900} c={night ? '#5a4a40' : '#c99a6a'} plank />
	</Svg>
);

/* desk with a chair, seen from the side; homework sheet optional */
export const SchoolDesk: React.FC<{x: number; y?: number; paper?: boolean; c?: string}> = ({x, y = 900, paper, c = '#d9a066'}) => (
	<g>
		<rect x={x - 120} y={y - 200} width={240} height={20} rx={5} fill={c} />
		<rect x={x - 112} y={y - 182} width={224} height={40} fill={darken(c, 0.2)} />
		<rect x={x - 100} y={y - 142} width={10} height={142} fill="#3a3f4a" />
		<rect x={x + 90} y={y - 142} width={10} height={142} fill="#3a3f4a" />
		{paper ? <rect x={x - 40} y={y - 206} width={80} height={8} fill="#fbf8ef" transform={`rotate(-2 ${x} ${y - 200})`} /> : null}
	</g>
);

/* ------------------------------ living room ------------------------------ */
export const LivingRoom: React.FC<{f: number; night?: boolean; dog?: boolean; empty?: boolean}> = ({f, night, dog = true, empty}) => (
	<Svg>
		<Wall id={night ? 'lr-wn' : 'lr-wd'} top={night ? '#2a2f55' : '#f6d9b0'} bot={night ? '#363b66' : '#efc99a'} trim={night ? '#1d2245' : '#c98a5a'} trimY={760} />
		{/* wallpaper stripes */}
		{Array.from({length: 30}).map((_, i) => (
			<rect key={i} x={-400 + i * 100} y={-300} width={40} height={1060} fill={night ? '#30366a' : '#f3cf9e'} opacity={0.5} />
		))}
		<Win id={night ? 'lr-sn' : 'lr-sd'} x={700} y={170} w={380} h={300} sky={night ? ['#0b1030', '#2a2f63'] : ['#9fd2f0', '#e6f4fb']} night={night} curtains={night ? '#5a3a6a' : '#d94a3a'} />
		{/* family photos on the wall */}
		{[0, 1, 2].map((i) => (
			<g key={i} transform={`translate(${200 + i * 170},${250 + (i % 2) * 40}) rotate(${(i - 1) * 4})`}>
				<rect x={-62} y={-50} width={124} height={100} fill="#6b4a2a" />
				<rect x={-54} y={-42} width={108} height={84} fill={['#bfe3ff', '#ffe08a', '#c9f0c9'][i]} />
				<circle cx={-18} cy={-8} r={12} fill="#000" />
				<rect x={-28} y={4} width={20} height={30} rx={6} fill="#ff2a3c" />
				{dog && !empty ? <ellipse cx={20} cy={22} rx={22} ry={14} fill="#9a5b2e" /> : null}
				{dog && !empty ? <circle cx={36} cy={8} r={12} fill="#9a5b2e" /> : null}
			</g>
		))}
		{/* door + leash */}
		<rect x={1500} y={330} width={240} height={570} rx={6} fill={night ? '#4a3a5a' : '#9a6a44'} />
		<rect x={1520} y={350} width={200} height={240} rx={4} fill={night ? '#5a4a6a' : '#b07c50'} />
		<rect x={1520} y={620} width={200} height={260} rx={4} fill={night ? '#5a4a6a' : '#b07c50'} />
		<circle cx={1712} cy={620} r={11} fill="#ffd34a" />
		{dog ? (
			<g>
				<circle cx={1800} cy={420} r={8} fill="#555" />
				<path d={`M1800,420 q${-10 + Math.sin(f / 20) * 4},120 20,180 q14,30 -4,50`} stroke="#d23b3b" strokeWidth={9} fill="none" strokeLinecap="round" />
				<rect x={1798} y={640} width={26} height={30} rx={6} fill="#a0a8b8" />
			</g>
		) : null}
		<Lamp x={1180} y={240} c="#ffe3a0" on={night ? 1 : 0.2} />
		<Floor y={900} c={night ? '#3a3050' : '#c98a5a'} plank />
		{/* rug */}
		<ellipse cx={760} cy={960} rx={520} ry={44} fill={night ? '#5a3a6a' : '#d94a3a'} opacity={0.75} />
	</Svg>
);

/* couch (foreground prop) with an optional dog-shaped dent */
export const Couch: React.FC<{x: number; y?: number; dent?: boolean; c?: string}> = ({x, y = 900, dent, c = '#3d6fd6'}) => (
	<g>
		<rect x={x - 300} y={y - 260} width={600} height={170} rx={40} fill={darken(c, 0.12)} />
		<rect x={x - 330} y={y - 140} width={660} height={110} rx={30} fill={c} />
		<rect x={x - 360} y={y - 200} width={80} height={180} rx={36} fill={darken(c, 0.2)} />
		<rect x={x + 280} y={y - 200} width={80} height={180} rx={36} fill={darken(c, 0.2)} />
		{dent ? <path d={`M${x - 60},${y - 138} q50,40 120,10 q40,-14 70,-10 q-20,20 -60,24 q-80,14 -130,-24 z`} fill={darken(c, 0.35)} /> : null}
		<rect x={x - 300} y={y - 30} width={20} height={30} fill="#2b2f3a" />
		<rect x={x + 280} y={y - 30} width={20} height={30} fill="#2b2f3a" />
	</g>
);

/* fridge with photos and magnets */
export const Fridge: React.FC<{x: number; y?: number; dogPhotos?: number}> = ({x, y = 900, dogPhotos = 0}) => (
	<g>
		<rect x={x - 140} y={y - 500} width={280} height={500} rx={18} fill="#f4f6fa" stroke="#c9ccd8" strokeWidth={4} />
		<line x1={x - 140} y1={y - 340} x2={x + 140} y2={y - 340} stroke="#b9bcc8" strokeWidth={4} />
		<rect x={x - 118} y={y - 460} width={10} height={70} rx={4} fill="#9aa0ae" />
		{Array.from({length: dogPhotos}).map((_, i) => (
			<g key={i} transform={`translate(${x - 60 + (i % 2) * 110},${y - 280 + Math.floor(i / 2) * 120}) rotate(${(i % 3) * 5 - 5})`}>
				<rect x={-46} y={-46} width={92} height={92} fill="#fff" />
				<rect x={-38} y={-38} width={76} height={60} fill={['#bfe3ff', '#c9f0c9', '#ffe08a', '#ffc9c9'][i % 4]} />
				<ellipse cx={-4} cy={6} rx={22} ry={13} fill="#9a5b2e" />
				<circle cx={18} cy={-8} r={13} fill="#9a5b2e" />
				<circle cx={22} cy={-11} r={3} fill="#000" />
				<circle cx={0} cy={-46} r={6} fill={['#d94a3a', '#3a6fd2', '#f2b21c', '#3aa37a'][i % 4]} />
			</g>
		))}
	</g>
);

/* ------------------------------ house front ------------------------------ */
export const HouseFront: React.FC<{f: number; night?: boolean; doorOpen?: number}> = ({f, night, doorOpen = 0}) => (
	<Svg>
		<Wall id={night ? 'hf-sn' : 'hf-sd'} top={night ? '#0b1030' : '#7fc0ea'} bot={night ? '#2a2f63' : '#d6eefa'} />
		{night ? <circle cx={1600} cy={140} r={44} fill="#eef1ff" /> : <circle cx={1650} cy={140} r={70} fill="#fff4b0" opacity={0.9} />}
		{!night ? [200, 1100].map((x, i) => <ellipse key={i} cx={x + f * 0.3} cy={130 + i * 40} rx={140} ry={34} fill="#fff" opacity={0.85} />) : null}
		<Tree x={-120} y={900} f={f} />
		<Tree x={2060} y={900} f={f} s={1.1} />
		{/* house */}
		<polygon points="300,380 960,90 1620,380" fill={night ? '#5a2a3a' : '#b4473a'} />
		<rect x={360} y={370} width={1200} height={530} fill={night ? '#6a6a8a' : '#f2e6c8'} />
		{Array.from({length: 12}).map((_, i) => (
			<line key={i} x1={360} y1={400 + i * 42} x2={1560} y2={400 + i * 42} stroke={night ? '#5a5a7a' : '#e2d2ac'} strokeWidth={3} />
		))}
		<Win id="hf-w1" x={450} y={460} w={260} h={220} sky={night ? ['#ffcf80', '#ffb050'] : ['#9fd2f0', '#e6f4fb']} />
		<Win id="hf-w2" x={1210} y={460} w={260} h={220} sky={night ? ['#ffcf80', '#ffb050'] : ['#9fd2f0', '#e6f4fb']} />
		{/* door */}
		<rect x={870} y={560} width={180} height={340} fill="#2a1a10" />
		<g transform={`translate(870,560) scale(${1 - doorOpen * 0.85},1)`}>
			<rect x={0} y={0} width={180} height={340} fill="#3a6fd2" />
			<rect x={20} y={20} width={140} height={130} rx={4} fill="#2f5ab0" />
			<rect x={20} y={170} width={140} height={150} rx={4} fill="#2f5ab0" />
			<circle cx={156} cy={180} r={9} fill="#ffd34a" />
		</g>
		<rect x={840} y={890} width={240} height={20} fill="#9aa3b5" />
		<Floor y={900} c={night ? '#2a4a3a' : '#6abf5a'} />
		<rect x={820} y={900} width={280} height={300} fill={night ? '#5a5a6a' : '#c9c2b0'} />
	</Svg>
);

/* a car (side view), flat style; shiny = brand new */
export const Car: React.FC<{x: number; y?: number; c?: string; shiny?: boolean; f: number; s?: number; bow?: boolean}> = ({x, y = 900, c = '#d63a3a', shiny, f, s = 1, bow}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<ellipse cx={0} cy={2} rx={330} ry={16} fill="#000" opacity={0.25} />
		<path d="M-320,-60 Q-320,-120 -240,-130 L-140,-140 Q-80,-230 40,-230 Q160,-230 220,-140 L300,-130 Q340,-120 340,-60 L340,-30 L-320,-30 Z" fill={c} />
		<path d="M-110,-145 Q-60,-210 30,-210 L30,-145 Z" fill="#bfe3ff" />
		<path d="M50,-210 Q150,-208 190,-145 L50,-145 Z" fill="#bfe3ff" />
		<rect x={-330} y={-70} width={40} height={18} rx={6} fill="#ffe08a" />
		<rect x={310} y={-70} width={34} height={18} rx={6} fill="#ff6a5a" />
		{[-190, 200].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={-30} r={56} fill="#141826" />
				<circle cx={wx} cy={-30} r={26} fill="#c9cfdd" />
			</g>
		))}
		{shiny ? (
			<g>
				<path d={`M${-260 + ((f * 8) % 700)},-130 l40,0 l-60,90 l-40,0 z`} fill="#fff" opacity={0.35} />
				{[0, 1, 2].map((i) => {
					const k = ((f / 20 + i / 3) % 1);
					return <path key={i} d={`M${-200 + i * 200},${-250 - k * 30} l6,16 l16,6 l-16,6 l-6,16 l-6,-16 l-16,-6 l16,-6 z`} fill="#fff" opacity={1 - k} />;
				})}
			</g>
		) : null}
		{bow ? (
			<g transform="translate(40,-232)">
				<path d="M0,0 l-70,-40 l0,60 z M0,0 l70,-40 l0,60 z" fill="#ffd34a" stroke="#c9a010" strokeWidth={4} />
				<circle r={16} fill="#ffd34a" stroke="#c9a010" strokeWidth={4} />
			</g>
		) : null}
	</g>
);

/* --------------------------------- park --------------------------------- */
export const Park: React.FC<{f: number; evening?: boolean}> = ({f, evening}) => (
	<Svg>
		<Wall id={evening ? 'pk-se' : 'pk-sd'} top={evening ? '#ff9a6a' : '#7fc0ea'} bot={evening ? '#ffd9a0' : '#e0f2fb'} />
		{[100, 800, 1500].map((x, i) => (
			<ellipse key={i} cx={x + f * 0.25} cy={110 + i * 35} rx={150} ry={36} fill="#fff" opacity={0.7} />
		))}
		<path d="M-400,640 Q300,520 960,600 T2400,580 L2400,1000 L-400,1000 Z" fill={evening ? '#7aa060' : '#8fcf6a'} />
		<path d="M-400,720 Q500,660 1200,720 T2400,700 L2400,1000 L-400,1000 Z" fill={evening ? '#6a9050' : '#7cc05a'} />
		{[-200, 250, 1450, 1900, 2250].map((x, i) => (
			<Tree key={i} x={x} y={760 + (i % 2) * 20} f={f} s={0.8 + (i % 3) * 0.12} c={i % 2 ? '#3d8f3d' : '#4aa04a'} />
		))}
		<Floor y={900} c={evening ? '#8a9a60' : '#9ad06a'} />
		<path d="M-400,930 Q960,880 2400,940 L2400,1000 L-400,1000 Z" fill="#e2d2ac" />
		{/* lamp post */}
		<rect x={1320} y={480} width={14} height={420} fill="#2b2f3a" />
		<rect x={1300} y={460} width={54} height={30} rx={6} fill="#2b2f3a" />
		<circle cx={1327} cy={496} r={evening ? 60 : 0} fill="#ffe3a0" opacity={0.4} />
	</Svg>
);

export const Bench: React.FC<{x: number; y?: number}> = ({x, y = 900}) => (
	<g>
		<rect x={x - 200} y={y - 170} width={400} height={18} rx={6} fill="#9a6a44" />
		<rect x={x - 200} y={y - 140} width={400} height={18} rx={6} fill="#9a6a44" />
		<rect x={x - 210} y={y - 100} width={420} height={22} rx={6} fill="#b07c50" />
		<rect x={x - 180} y={y - 80} width={14} height={80} fill="#2b2f3a" />
		<rect x={x + 166} y={y - 80} width={14} height={80} fill="#2b2f3a" />
	</g>
);

/* ------------------------------- cafeteria ------------------------------- */
export const Cafeteria: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="cf-w" top="#e6f0f4" bot="#cfe0e6" trim="#7a9aa8" trimY={560} />
		<rect x={-400} y={572} width={2800} height={330} fill="#f2b21c" opacity={0.85} />
		{/* menu board */}
		<rect x={600} y={140} width={720} height={260} rx={10} fill="#2b2f3a" />
		<text x={960} y={210} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#ffd34a">
			TODAY'S LUNCH
		</text>
		{['PIZZA ......... $2', 'TACOS ......... $2', 'MYSTERY MEAT .. $1'].map((t, i) => (
			<text key={i} x={700} y={270 + i * 46} fontSize={34} fontFamily={HAND} fill="#fbf8ef">
				{t}
			</text>
		))}
		{/* serving counter */}
		<rect x={-400} y={640} width={2800} height={20} fill="#c9cfdd" />
		<rect x={-400} y={660} width={2800} height={60} fill="#9aa3b5" />
		{Array.from({length: 10}).map((_, i) => (
			<g key={i}>
				<rect x={-300 + i * 260} y={600} width={200} height={44} rx={8} fill="#dfe6ee" />
				<ellipse cx={-200 + i * 260} cy={604} rx={80} ry={12} fill={['#e8643a', '#f2b21c', '#7a5a3a', '#3aa37a'][i % 4]} />
				<path d={`M${-220 + i * 260},${590 - ((f + i * 20) % 60)} q10,-14 0,-28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.4} />
			</g>
		))}
		<Floor y={900} c="#bfd0d8" tiles />
	</Svg>
);

/* ------------------------------ meeting room ----------------------------- */
export const Meeting: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="mt-w" top="#dfe6f2" bot="#c9d4e6" trim="#5a6a8a" trimY={700} />
		<rect x={540} y={130} width={840} height={440} rx={10} fill="#fbfbfd" stroke="#9aa3b5" strokeWidth={8} />
		<text x={960} y={200} textAnchor="middle" fontSize={46} fontFamily={FONT} fontWeight={900} fill="#d23b3b">
			CAFETERIA KETCHUP BUDGET
		</text>
		{[160, 260, 120, 340].map((h, i) => (
			<rect key={i} x={640 + i * 170} y={540 - h * Math.min(1, f / 40)} width={110} height={h * Math.min(1, f / 40)} fill={i === 3 ? '#d23b3b' : '#3a6fd2'} />
		))}
		<g transform="translate(1260,300)">
			<rect x={-30} y={-60} width={60} height={130} rx={14} fill="#d23b3b" />
			<rect x={-14} y={-90} width={28} height={34} rx={6} fill="#fff" />
		</g>
		<Clock x={240} y={240} f={f * 4} />
		<Floor y={900} c="#8a94a8" />
	</Svg>
);
export const MeetingTable: React.FC = () => (
	<g>
		<rect x={300} y={730} width={1320} height={36} rx={14} fill="#6b4a2a" />
		<rect x={340} y={766} width={1240} height={20} fill="#4a3220" />
		<rect x={420} y={786} width={22} height={114} fill="#2b2f3a" />
		<rect x={1480} y={786} width={22} height={114} fill="#2b2f3a" />
		{[520, 960, 1400].map((x) => (
			<rect key={x} x={x - 40} y={720} width={80} height={10} fill="#fbf8ef" />
		))}
	</g>
);

/* --------------------------------- mall ---------------------------------- */
export const Cinema: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="cn-w" top="#1d1440" bot="#3a1f5a" />
		{Array.from({length: 30}).map((_, i) => (
			<circle key={i} cx={-300 + i * 100} cy={110} r={10} fill={(Math.floor(f / 6) + i) % 3 ? '#ffd34a' : '#ff6a8a'} />
		))}
		<rect x={-400} y={130} width={2800} height={12} fill="#ffd34a" />
		{/* posters */}
		{[
			['ZOMBIE PROM', '#3aa37a', 'R'],
			['SPACE COWS', '#3a6fd2', 'PG'],
			['NIGHT TEETH', '#d23b3b', 'R'],
			['BIG BEAR', '#f08a3c', 'PG'],
		].map(([t, c, r], i) => (
			<g key={i} transform={`translate(${-100 + i * 600},200)`}>
				<rect x={0} y={0} width={300} height={430} rx={6} fill="#f2e6c8" />
				<rect x={12} y={12} width={276} height={406} fill={c as string} />
				<text x={150} y={360} textAnchor="middle" fontSize={36} fontFamily={FONT} fontWeight={900} fill="#fff">
					{t}
				</text>
				<path d="M150,90 l22,48 l52,6 l-38,36 l10,52 l-46,-26 l-46,26 l10,-52 l-38,-36 l52,-6 z" fill="#fff" opacity={0.85} />
				<rect x={226} y={22} width={50} height={50} rx={8} fill={r === 'R' ? '#d23b3b' : '#2b2f3a'} stroke="#fff" strokeWidth={3} />
				<text x={251} y={58} textAnchor="middle" fontSize={28} fontFamily={FONT} fontWeight={900} fill="#fff">
					{r}
				</text>
			</g>
		))}
		<Floor y={900} c="#5a2a4a" />
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-400 + i * 220} y={920} width={110} height={300} fill="#6a3a5a" opacity={0.5} />
		))}
	</Svg>
);
export const TicketBooth: React.FC<{x: number; f: number}> = ({x, f}) => (
	<g>
		<rect x={x - 230} y={560} width={460} height={340} fill="#d23b3b" />
		<rect x={x - 250} y={520} width={500} height={60} rx={10} fill="#ffd34a" />
		<text x={x} y={564} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#d23b3b">
			TICKETS
		</text>
		<rect x={x - 230} y={720} width={460} height={20} fill="#9a2a2a" />
		{[0, 1].map((i) => (
			<circle key={i} cx={x - 200 + i * 400} cy={600} r={8} fill={(Math.floor(f / 5) + i) % 2 ? '#fff' : '#ffd34a'} />
		))}
	</g>
);

/* --------------------------------- office -------------------------------- */
export const Office: React.FC<{f: number; night?: boolean}> = ({f, night}) => (
	<Svg>
		<Wall id={night ? 'of-sn' : 'of-sd'} top={night ? '#050820' : '#8fc8ee'} bot={night ? '#1d2550' : '#e0f2fb'} />
		{/* skyline through the glass */}
		{Array.from({length: 16}).map((_, i) => {
			const h = 260 + random('sk' + i) * 420;
			return (
				<g key={i}>
					<rect x={-300 + i * 170} y={900 - h} width={150} height={h} fill={night ? '#141a3a' : '#9ab0c9'} />
					{Array.from({length: Math.floor(h / 50)}).map((_, j) => (
						<rect key={j} x={-280 + i * 170 + (j % 3) * 40} y={920 - h + j * 46} width={22} height={24} fill={night ? (random('w' + i + j) > 0.5 ? '#ffd27a' : '#232a5a') : '#c9dcee'} opacity={0.8} />
					))}
				</g>
			);
		})}
		{/* glass frame */}
		{Array.from({length: 7}).map((_, i) => (
			<rect key={i} x={-300 + i * 420} y={-300} width={16} height={1200} fill="#2b2f3a" />
		))}
		<rect x={-400} y={120} width={2800} height={12} fill="#2b2f3a" />
		<Floor y={900} c={night ? '#2a2440' : '#5a4a40'} />
	</Svg>
);
export const BossDesk: React.FC<{x: number; f: number; ring?: boolean}> = ({x, f, ring}) => {
	const sh = ring ? Math.sin(f * 2.2) * 4 : 0;
	return (
		<g>
			<rect x={x - 260} y={700} width={520} height={30} rx={8} fill="#3a2a1a" />
			<rect x={x - 240} y={730} width={480} height={170} fill="#2a1d12" />
			<rect x={x - 160} y={640} width={140} height={64} rx={6} fill="#141826" />
			<rect x={x - 150} y={648} width={120} height={46} fill="#3a6fd2" opacity={0.8} />
			<g transform={`translate(${x + 120 + sh},690) rotate(${sh * 2})`}>
				<rect x={-34} y={-14} width={68} height={24} rx={8} fill="#141826" />
				<rect x={-26} y={-36} width={52} height={20} rx={8} fill="#2b2f3a" />
			</g>
			{ring
				? [0, 1, 2].map((i) => {
						const k = ((f / 10 + i / 3) % 1);
						return <path key={i} d={`M${x + 160 + k * 40},${640 - k * 30} q20,20 0,40`} stroke="#ffd34a" strokeWidth={5} fill="none" opacity={1 - k} />;
					})
				: null}
		</g>
	);
};

/* -------------------------------- backyard ------------------------------- */
export const Backyard: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="by-s" top="#7fc0ea" bot="#e0f2fb" />
		{[300, 1300].map((x, i) => <ellipse key={i} cx={x + f * 0.3} cy={120 + i * 40} rx={160} ry={36} fill="#fff" opacity={0.85} />)}
		<Tree x={-60} y={880} f={f} s={1.2} />
		<Tree x={1950} y={880} f={f} s={1.1} c="#3d8f3d" />
		{/* fence */}
		{Array.from({length: 36}).map((_, i) => (
			<path key={i} d={`M${-400 + i * 80},900 v-300 l30,-30 l30,30 v300 z`} fill="#f2ead6" stroke="#d9cfb6" strokeWidth={3} />
		))}
		<rect x={-400} y={660} width={2800} height={16} fill="#d9cfb6" />
		<rect x={-400} y={820} width={2800} height={16} fill="#d9cfb6" />
		{/* garland */}
		<path d="M-200,300 Q480,420 960,300 T2200,300" stroke="#2b2f3a" strokeWidth={3} fill="none" />
		{Array.from({length: 18}).map((_, i) => {
			const x = -150 + i * 130;
			const t = (x + 200) / 2400;
			const y = 300 + Math.sin(t * Math.PI * 2) * -50 + 60 * Math.sin(t * Math.PI * 4) * 0 + 40;
			return <path key={i} d={`M${x - 24},${y - 10} L${x + 24},${y - 10} L${x},${y + 40} Z`} fill={['#ff2a3c', '#ffd34a', '#3a6fd2', '#3aa37a'][i % 4]} />;
		})}
		{/* balloons */}
		{[[180, 380, '#ff2a3c'], [260, 330, '#ffd34a'], [1700, 360, '#3a6fd2'], [1780, 400, '#9b6cf0']].map(([x, y, c], i) => (
			<g key={i} transform={`translate(${x as number},${(y as number) + Math.sin(f / 20 + i) * 10})`}>
				<line x1={0} y1={40} x2={6} y2={300} stroke="#555" strokeWidth={2} />
				<ellipse rx={36} ry={44} fill={c as string} />
				<ellipse cx={-12} cy={-14} rx={8} ry={12} fill="#fff" opacity={0.4} />
			</g>
		))}
		<Floor y={900} c="#7cc05a" />
	</Svg>
);
export const CakeTable: React.FC<{x: number; f: number; slices?: number}> = ({x, f, slices = 0}) => (
	<g>
		<rect x={x - 220} y={720} width={440} height={20} rx={6} fill="#fbf8ef" />
		<path d={`M${x - 220},740 h440 l-20,40 h-400 z`} fill="#ff8fc0" />
		<rect x={x - 200} y={740} width={14} height={160} fill="#9aa3b5" />
		<rect x={x + 186} y={740} width={14} height={160} fill="#9aa3b5" />
		<rect x={x - 110} y={620} width={220} height={100} rx={14} fill="#ffe0f0" />
		<rect x={x - 110} y={620} width={220} height={30} rx={14} fill="#ff6a9a" />
		{slices ? <path d={`M${x + 40},620 l70,0 l0,100 l-70,0 z`} fill="#fbf8ef" /> : null}
		{[-60, -20, 20, 60].map((d) => (
			<g key={d}>
				<rect x={x + d - 4} y={580} width={8} height={40} fill="#3a6fd2" />
				<ellipse cx={x + d} cy={572 + Math.sin(f / 3 + d) * 2} rx={6} ry={10} fill="#ffb030" />
			</g>
		))}
	</g>
);

/* ------------------------------ school front ----------------------------- */
export const TVVan: React.FC<{x: number; f: number}> = ({x, f}) => (
	<g transform={`translate(${x},905)`}>
		<rect x={-300} y={-300} width={560} height={260} rx={20} fill="#f2f2f2" />
		<rect x={150} y={-260} width={140} height={220} rx={16} fill="#e6e6ea" />
		<rect x={170} y={-240} width={100} height={70} rx={8} fill="#9fd2f0" />
		<rect x={-280} y={-200} width={400} height={56} fill="#3a6fd2" />
		<text x={-80} y={-160} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
			NEWS 7
		</text>
		<rect x={-160} y={-340} width={16} height={44} fill="#9aa3b5" />
		<ellipse cx={-152} cy={-350} rx={70} ry={22} fill="#c9cfdd" transform={`rotate(-20 -152 -350)`} />
		{[-180, 160].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={-40} r={46} fill="#141826" />
				<circle cx={wx} cy={-40} r={20} fill="#c9cfdd" />
			</g>
		))}
		<circle cx={-260} cy={-280} r={10} fill={Math.floor(f / 10) % 2 ? '#ff2a3c' : '#5a1a1a'} />
	</g>
);

/* -------------------------------- pizzeria ------------------------------- */
export const Pizzeria: React.FC<{f: number; busy?: boolean}> = ({f, busy}) => (
	<Svg>
		<Wall id="pz-s" top="#7fc0ea" bot="#e0f2fb" />
		{/* neighbours */}
		<rect x={-400} y={180} width={560} height={720} fill="#c4604a" />
		<rect x={1760} y={220} width={700} height={680} fill="#6a8aa8" />
		{/* shop */}
		<rect x={160} y={200} width={1600} height={700} fill="#f2e6c8" />
		<path d={Array.from({length: 17}).map((_, i) => `M${160 + i * 100},330 q50,40 100,0`).join(' ')} fill="#d23b3b" />
		<rect x={160} y={260} width={1600} height={74} fill="#d23b3b" />
		{Array.from({length: 16}).map((_, i) => (
			<rect key={i} x={160 + i * 100} y={260} width={50} height={74} fill="#fbf8ef" />
		))}
		<rect x={560} y={150} width={800} height={110} rx={14} fill="#2b2f3a" />
		<text x={960} y={228} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill={busy ? '#ffd34a' : '#c9cfdd'}>
			{busy ? "★ TONY'S PIZZA ★" : "TONY'S PIZZA"}
		</text>
		<rect x={260} y={420} width={560} height={340} fill="#3a2a1a" />
		<rect x={276} y={436} width={528} height={308} fill={busy ? '#ffcf80' : '#8a7a6a'} />
		<rect x={1100} y={420} width={260} height={480} fill="#6b4a2a" />
		<rect x={1120} y={440} width={220} height={200} fill={busy ? '#ffcf80' : '#8a7a6a'} />
		{busy ? <text x={540} y={620} textAnchor="middle" fontSize={56} fontFamily={HAND} fontWeight={700} fill="#d23b3b">BEST IN AMERICA!</text> : <text x={540} y={620} textAnchor="middle" fontSize={44} fontFamily={HAND} fill="#5a4a3a">open... sometimes</text>}
		<Floor y={900} c="#9aa3b5" />
	</Svg>
);

/* ------------------------------ grandma room ----------------------------- */
export const GrandmaRoom: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="gm-w" top="#f2d8e0" bot="#e8c4d0" trim="#b07c90" trimY={700} />
		{Array.from({length: 26}).map((_, i) =>
			Array.from({length: 9}).map((__, j) => <circle key={i + '-' + j} cx={-380 + i * 110 + (j % 2) * 55} cy={-200 + j * 100} r={10} fill="#e8a0b8" opacity={0.6} />),
		)}
		<Win id="gm-win" x={1200} y={180} w={360} h={300} sky={['#ffd9a0', '#fff0d0']} curtains="#c94a6a" />
		{[0, 1].map((i) => (
			<g key={i} transform={`translate(${300 + i * 260},300)`}>
				<ellipse rx={90} ry={110} fill="#c9a06a" />
				<ellipse rx={74} ry={94} fill={i ? '#bfe3ff' : '#c9f0c9'} />
				<path d="M-30,40 q30,-70 60,0 z" fill={i ? '#e86aa0' : '#f08a3c'} />
				<circle cx={0} cy={-22} r={16} fill={i ? '#ff6a9a' : '#ffd34a'} />
			</g>
		))}
		<Floor y={900} c="#a87a5a" plank />
		<ellipse cx={960} cy={970} rx={600} ry={50} fill="#c94a6a" opacity={0.6} />
	</Svg>
);
export const Armchair: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 150} y={520} width={300} height={300} rx={60} fill="#7a5cc4" />
		<rect x={x - 180} y={700} width={360} height={140} rx={30} fill="#8b6cd6" />
		<rect x={x - 200} y={640} width={70} height={220} rx={30} fill="#6a4cb4" />
		<rect x={x + 130} y={640} width={70} height={220} rx={30} fill="#6a4cb4" />
		<rect x={x - 150} y={850} width={20} height={50} fill="#3a2a1a" />
		<rect x={x + 130} y={850} width={20} height={50} fill="#3a2a1a" />
	</g>
);
export const Yarn: React.FC<{x: number; y: number; c?: string; f: number}> = ({x, y, c = '#f08a3c', f}) => (
	<g transform={`translate(${x},${y}) rotate(${f * 3})`}>
		<circle r={34} fill={c} />
		{[-20, -6, 8, 22].map((d) => (
			<path key={d} d={`M${d},-30 q14,30 0,60`} stroke={darken(c, 0.2)} strokeWidth={4} fill="none" />
		))}
	</g>
);

/* the screaming-reindeer sweater as a big flat icon */
export const Sweater: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-160,-150 L-60,-180 Q0,-140 60,-180 L160,-150 L230,40 L160,70 L130,-40 L130,180 L-130,180 L-130,-40 L-160,70 L-230,40 Z" fill="#f08a3c" stroke="#7a3a10" strokeWidth={6} />
		{Array.from({length: 8}).map((_, i) => (
			<path key={i} d={`M${-120 + i * 34},120 l17,-20 l17,20`} stroke="#3aa37a" strokeWidth={8} fill="none" />
		))}
		<rect x={-130} y={140} width={260} height={40} fill="#3aa37a" />
		{/* screaming reindeer */}
		<g transform="translate(0,-20)">
			<path d="M-40,-80 l-30,-40 M-50,-95 l-30,0 M40,-80 l30,-40 M50,-95 l30,0" stroke="#7a4a20" strokeWidth={8} strokeLinecap="round" />
			<ellipse rx={56} ry={62} fill="#a0703a" />
			<circle cx={-20} cy={-14} r={12} fill="#fff" />
			<circle cx={20} cy={-14} r={12} fill="#fff" />
			<circle cx={-20} cy={-14} r={4} fill="#000" />
			<circle cx={20} cy={-14} r={4} fill="#000" />
			<ellipse cx={0} cy={28 + Math.sin(f / 3) * 2} rx={18} ry={24 + Math.sin(f / 3) * 3} fill="#3a1a10" />
			<circle cx={0} cy={2} r={12} fill="#ff2a3c" />
		</g>
	</g>
);

/* --------------------------------- runway -------------------------------- */
export const Runway: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="rw-w" top="#0a0a18" bot="#22183a" />
		{/* Eiffel tower silhouette */}
		<g transform="translate(1500,820)" opacity={0.6}>
			<path d="M-160,0 L-40,-420 L-20,-640 L0,-760 L20,-640 L40,-420 L160,0 L100,0 L20,-300 L-20,-300 L-100,0 Z" fill="#3a2a5a" />
			<rect x={-70} y={-200} width={140} height={14} fill="#3a2a5a" />
			<rect x={-40} y={-430} width={80} height={12} fill="#3a2a5a" />
		</g>
		<text x={420} y={260} textAnchor="middle" fontSize={90} fontFamily={HAND} fontWeight={700} fill="#ffd34a" opacity={0.9}>
			Paris
		</text>
		{Array.from({length: 22}).map((_, i) => {
			const on = random('fl' + i + Math.floor(f / 4)) > 0.82;
			return <circle key={i} cx={-300 + i * 120} cy={720 + (i % 3) * 30} r={on ? 26 : 6} fill="#fff" opacity={on ? 0.9 : 0.25} />;
		})}
		{/* audience heads */}
		{Array.from({length: 30}).map((_, i) => (
			<circle key={i} cx={-300 + i * 95} cy={830 + (i % 2) * 20} r={34} fill="#05050c" />
		))}
		<polygon points="560,900 1360,900 2200,1100 -280,1100" fill="#f2f2f2" />
		<rect x={-400} y={880} width={2800} height={20} fill="#ff2a3c" />
	</Svg>
);

/* ---------------------------------- lab ---------------------------------- */
export const Lab: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="lb-w" top="#dff2f2" bot="#c4e6e6" trim="#5a9a9a" trimY={680} />
		<rect x={-300} y={150} width={420} height={300} rx={10} fill="#141826" />
		<path d={Array.from({length: 40}).map((_, i) => `${i ? 'L' : 'M'}${-280 + i * 10},${300 + Math.sin(i / 2 + f / 4) * 40 * random('lb' + (i % 7))}`).join(' ')} stroke="#3aff9a" strokeWidth={4} fill="none" />
		<text x={1700} y={200} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#3a7a7a">
			UNIVERSITY · LONDON
		</text>
		<Floor y={900} c="#a8c4c4" tiles />
	</Svg>
);
export const Scanner: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 330} y={300} width={660} height={600} rx={300} fill="#f4f6fa" stroke="#c9ccd8" strokeWidth={6} />
		<circle cx={x} cy={600} r={170} fill="#2b3040" />
		<circle cx={x} cy={600} r={140} fill="#141826" />
		<rect x={x - 40} y={760} width={680} height={50} rx={14} fill="#dfe6ee" />
		<rect x={x - 20} y={810} width={40} height={90} fill="#9aa3b5" />
	</g>
);

/* --------------------------------- store --------------------------------- */
export const Register: React.FC<{x: number; f: number; cash?: number}> = ({x, f, cash = 0}) => (
	<g>
		<rect x={x - 260} y={660} width={520} height={240} fill="#3a6fd2" />
		<rect x={x - 280} y={640} width={560} height={30} rx={8} fill="#2b2f3a" />
		<rect x={x - 90} y={540} width={180} height={100} rx={10} fill="#2b2f3a" />
		<rect x={x - 70} y={556} width={140} height={44} fill="#3aff9a" opacity={0.85} />
		<text x={x} y={590} textAnchor="middle" fontSize={30} fontFamily={FONT} fontWeight={800} fill="#0b2a1a">
			{cash > 0 ? '$' + Math.round(1000 * cash).toLocaleString('en-US') : '$0.00'}
		</text>
		<rect x={x - 110} y={610 + cash * 30} width={220} height={30} rx={4} fill="#9aa3b5" />
		{cash > 0
			? Array.from({length: 18}).map((_, i) => {
					const t = ((f * 0.04 + random('bill' + i)) % 1) * cash;
					return <rect key={i} x={x - 120 + random('bx' + i) * 240} y={630 - t * 400} width={60} height={30} rx={4} fill="#5ac85a" stroke="#2a7a2a" strokeWidth={3} transform={`rotate(${random('br' + i) * 60 - 30} ${x} ${630 - t * 400})`} opacity={1 - t * 0.5} />;
				})
			: null}
	</g>
);

/* ------------------------------ pet shelter ------------------------------ */
export const ShelterFront: React.FC<{f: number; evening?: boolean}> = ({f, evening}) => (
	<Svg>
		<Wall id={evening ? 'sf-se' : 'sf-sd'} top={evening ? '#ff9a6a' : '#7fc0ea'} bot={evening ? '#ffd9a0' : '#e0f2fb'} />
		<rect x={-400} y={160} width={2800} height={740} fill="#c4604a" />
		{Array.from({length: 16}).map((_, r) => (
			<line key={r} x1={-400} y1={180 + r * 46} x2={2400} y2={180 + r * 46} stroke="#a94f3c" strokeWidth={3} />
		))}
		<rect x={360} y={180} width={1200} height={110} rx={14} fill="#3aa37a" />
		<text x={960} y={258} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
			HAPPY PAWS SHELTER
		</text>
		{/* shop window */}
		<rect x={300} y={360} width={900} height={440} rx={10} fill="#6b4a2a" />
		<rect x={320} y={380} width={860} height={400} fill="#ffe8c0" />
		<rect x={320} y={740} width={860} height={40} fill="#d9b48c" />
		{/* door */}
		<rect x={1340} y={420} width={240} height={480} fill="#2b2f3a" />
		<rect x={1360} y={440} width={200} height={260} fill="#bfe3ff" opacity={0.8} />
		<circle cx={1550} cy={680} r={10} fill="#ffd34a" />
		<Floor y={900} c="#9aa3b5" />
	</Svg>
);
/* puppy (small round dog) */
export const Puppy: React.FC<{x: number; y: number; c: string; f: number; seed: number}> = ({x, y, c, f, seed}) => {
	const hop = Math.abs(Math.sin(f / 6 + seed)) * 12;
	return (
		<g transform={`translate(${x},${y - hop})`}>
			<ellipse cx={0} cy={0} rx={44} ry={30} fill={c} stroke="#2a160a" strokeWidth={3} />
			<circle cx={36} cy={-30} r={28} fill={c} stroke="#2a160a" strokeWidth={3} />
			<ellipse cx={24} cy={-40} rx={10} ry={20} fill={darken(c, 0.25)} />
			<circle cx={44} cy={-36} r={6} fill="#fff" />
			<circle cx={45} cy={-36} r={3} fill="#000" />
			<circle cx={62} cy={-26} r={6} fill="#1a0e08" />
			<path d={`M-44,-6 q-20,${-20 + Math.sin(f / 2 + seed) * 10} -30,-30`} stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
		</g>
	);
};
export const Cage: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} fill="none" stroke="#9aa3b5" strokeWidth={6} />
		{Array.from({length: Math.floor(w / 30)}).map((_, i) => (
			<line key={i} x1={x + 15 + i * 30} y1={y} x2={x + 15 + i * 30} y2={y + h} stroke="#9aa3b5" strokeWidth={4} />
		))}
	</g>
);
export const ShelterInside: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="si-w" top="#fff0d0" bot="#f2dcb0" trim="#3aa37a" trimY={640} />
		<rect x={-400} y={652} width={2800} height={250} fill="#9ad0b0" />
		{[0, 1, 2, 3, 4, 5].map((i) => (
			<g key={i} transform={`translate(${-200 + i * 380},180)`}>
				<path d="M0,0 c-30,-30 -60,10 0,50 c60,-40 30,-80 0,-50" fill="#ff8fc0" opacity={0.6} />
			</g>
		))}
		<Floor y={900} c="#d9c4a0" tiles />
	</Svg>
);
export const FrontDesk: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 280} y={640} width={560} height={260} fill="#3aa37a" />
		<rect x={x - 300} y={620} width={600} height={30} rx={8} fill="#2b7a5a" />
		<text x={x} y={780} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
			ADOPT ♥
		</text>
	</g>
);

/* ------------------------------- red void -------------------------------- */
/* the user's portrait backdrop: dark red radial glow; for "rule" beats */
const LIES = ["I'M FINE", 'MY DOG ATE IT', "I'M ALMOST THERE", 'I LOVE IT', 'NO, I DIDN\'T', 'ALL WEEKEND', "I'M 18", 'JUST KIDDING'];
export const RedVoid: React.FC<{f: number; c?: string; words?: boolean}> = ({f, c = '#8a1020', words = true}) => (
	<Svg>
		<defs>
			<radialGradient id={'rv-' + c.slice(1)} cx="0.45" cy="0.42" r="0.75">
				<stop offset="0" stopColor={c} />
				<stop offset="0.6" stopColor={darken(c, 0.55)} />
				<stop offset="1" stopColor="#120206" />
			</radialGradient>
		</defs>
		<rect x={-600} y={-400} width={3100} height={1900} fill={`url(#rv-${c.slice(1)})`} />
		{Array.from({length: 24}).map((_, i) => (
			<text key={i} x={-300 + random('qx' + i) * 2500} y={(random('qy' + i) * 1400 - f * (0.4 + random('qs' + i)) + 4000) % 1400 - 200} fontSize={40 + random('qz' + i) * 80} fontFamily={FONT} fontWeight={900} fill="#ff2a3c" opacity={0.08 + random('qo' + i) * 0.1} transform={`rotate(${random('qr' + i) * 40 - 20})`}>
				?
			</text>
		))}
		{words
			? LIES.map((t, i) => {
					const x = ((random('lw' + i) * 2600 + f * (0.6 + random('lv' + i)) * (i % 2 ? 1 : -1)) % 2600 + 2600) % 2600 - 350;
					const y = 120 + random('ly' + i) * 600 + Math.sin(f / 30 + i) * 20;
					return (
						<g key={i} transform={`translate(${x},${y}) rotate(${random('lr' + i) * 16 - 8})`} opacity={0.22}>
							<rect x={-t.length * 13 - 20} y={-34} width={t.length * 26 + 40} height={60} rx={30} fill="#fff" />
							<text y={8} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#5a0a14">
								{t}
							</text>
						</g>
					);
				})
			: null}
		<rect x={-600} y={900} width={3100} height={600} fill="#000" opacity={0.25} />
	</Svg>
);

/* a giant question mark like on the user's portrait */
export const QMark: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
	if (t < 0) return null;
	const k = Math.min(1, t / 8);
	return (
		<g transform={`translate(${x},${y + Math.sin(t / 12) * 8}) rotate(${12 + Math.sin(t / 20) * 4}) scale(${s * (0.4 + 0.6 * k + (t < 12 ? Math.sin((t / 12) * Math.PI) * 0.15 : 0))})`}>
			<text textAnchor="middle" fontSize={300} fontFamily={FONT} fontWeight={900} fill="#ff2a3c">
				?
			</text>
		</g>
	);
};

/* bedroom wall for the late scenes (hero's room at night) */
export const HeroRoom: React.FC<{f: number; night?: boolean}> = ({f, night = true}) => (
	<Svg>
		<Wall id={night ? 'hr-n' : 'hr-d'} top={night ? '#1d2550' : '#cfe4ef'} bot={night ? '#2a3366' : '#e6f0f4'} trim={night ? '#141a3d' : '#8ab0c0'} trimY={720} />
		<Win id={night ? 'hr-wn' : 'hr-wd'} x={1100} y={170} w={380} h={300} sky={night ? ['#0b1030', '#2a2f63'] : ['#9fd2f0', '#e6f4fb']} night={night} curtains={night ? '#3a4380' : '#ff2a3c'} />
		{night ? <circle cx={1400} cy={230} r={26} fill="#eef1ff" /> : null}
		<Poster x={300} y={200} w={200} h={260} c={night ? '#5a1a2a' : '#ff2a3c'} tilt={-3}>
			<text x={400} y={340} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
				GG
			</text>
		</Poster>
		<Poster x={620} y={240} w={240} h={160} c={night ? '#2a3a6a' : '#3a6fd2'} tilt={3}>
			<text x={740} y={335} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#fff">
				LVL 99
			</text>
		</Poster>
		<Floor y={900} c={night ? '#2a2440' : '#c99a6a'} plank />
	</Svg>
);
export const Bed: React.FC<{x: number; night?: boolean}> = ({x, night = true}) => (
	<g>
		<rect x={x - 330} y={600} width={40} height={300} rx={10} fill={night ? '#3a3050' : '#8a5a3a'} />
		<rect x={x - 320} y={740} width={660} height={90} rx={20} fill={night ? '#4a5590' : '#f2f2f2'} />
		<rect x={x - 320} y={780} width={660} height={60} rx={10} fill={night ? '#5a3a6a' : '#ff2a3c'} />
		<rect x={x - 300} y={700} width={150} height={60} rx={26} fill="#e8e8f2" />
		<rect x={x - 320} y={830} width={20} height={70} fill="#2b2f3a" />
		<rect x={x + 300} y={830} width={20} height={70} fill="#2b2f3a" />
	</g>
);

/* phone screen card used for messages / photos */
export const PhoneFrame: React.FC<{x: number; y: number; s?: number; children: React.ReactNode; tilt?: number}> = ({x, y, s = 1, children, tilt = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
		<rect x={-200} y={-380} width={400} height={760} rx={50} fill="#0b0d18" />
		<rect x={-182} y={-350} width={364} height={700} rx={30} fill="#f4f6fa" />
		<rect x={-50} y={-368} width={100} height={14} rx={7} fill="#2b2f3a" />
		<clipPath id={'ph' + Math.round(x)}>
			<rect x={-182} y={-350} width={364} height={700} rx={30} />
		</clipPath>
		<g clipPath={`url(#ph${Math.round(x)})`}>{children}</g>
	</g>
);

/* night outside a corner store (the fight with Kai) */
export const StoreNight: React.FC<{f: number; rain?: boolean}> = ({f, rain = true}) => (
	<Svg>
		<Wall id="sn-sky" top="#070b1f" bot="#1d2350" />
		{Array.from({length: 40}).map((_, i) => (
			<circle key={i} cx={random('sn' + i) * 2400 - 200} cy={random('sny' + i) * 200} r={1.4} fill="#fff" opacity={0.5} />
		))}
		<rect x={-400} y={180} width={700} height={720} fill="#2a2440" />
		<rect x={1700} y={140} width={800} height={760} fill="#2a2440" />
		<rect x={300} y={230} width={1400} height={670} fill="#3a3456" />
		<rect x={360} y={250} width={1280} height={110} rx={10} fill="#141826" />
		<text x={1000} y={330} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill={Math.floor(f / 40) % 7 === 0 ? '#5a2030' : '#ff3b4e'} style={{filter: 'drop-shadow(0 0 12px #ff3b4e)'}}>
			24/7 MART
		</text>
		<rect x={400} y={420} width={760} height={360} fill="#ffe8a0" opacity={0.9} />
		{Array.from({length: 4}).map((_, r) => (
			<rect key={r} x={420} y={460 + r * 80} width={720} height={10} fill="#c9a060" />
		))}
		<rect x={1240} y={420} width={300} height={480} fill="#bfe3ff" opacity={0.7} />
		<polygon points="400,780 1160,780 1300,1000 260,1000" fill="#ffe8a0" opacity={0.15} />
		<rect x={1780} y={420} width={14} height={480} fill="#141826" />
		<circle cx={1787} cy={410} r={20} fill="#ffe3a0" />
		<circle cx={1787} cy={410} r={120} fill="#ffe3a0" opacity={0.12} />
		<Floor y={900} c="#1d2245" />
		{rain
			? Array.from({length: 70}).map((_, i) => {
					const x = random('rn' + i) * 2600 - 300;
					const y = ((random('ry' + i) * 1200 + f * 26) % 1200) - 100;
					return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke="#a9c2f2" strokeWidth={2} opacity={0.5} />;
				})
			: null}
	</Svg>
);
