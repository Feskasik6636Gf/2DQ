import React from 'react';
import {random} from 'remotion';
import {Pose} from '../engine/Stickman';
import {idle} from '../kit/actions';
import {Actor} from '../kit/core';
import {Extra} from '../kit/kit';
import {Hero, P} from './lib';
import {SchoolDesk} from './places';

/* Reusable groups and props for the scenes. */

/* back row of seated classmates behind desks (drawn before the hero) */
export const Classmates: React.FC<{f: number; laugh?: number; wide?: boolean; xs?: number[]; kai?: boolean}> = ({f, laugh = 0, wide, xs = [180, 420, 1240, 1500, 1740], kai}) => (
	<g>
		{xs.map((x, i) => {
			const base = P.sitDesk(f + i * 13);
			const pose: Pose = laugh ? P.laugh(f + i * 7) : base;
			return (
				<g key={i}>
					{kai && i === 2 ? (
						<Actor who="kai" x={x} seat={800} s={0.92} pose={pose} mouth={laugh ? 'open' : 'line'} />
					) : (
						<Extra i={i} x={x} floor={900} s={0.92} pose={pose} seed="cls" facing={i < 2 ? 1 : -1} expr={wide ? 'wide' : undefined} />
					)}
					<SchoolDesk x={x + (i < 2 ? 60 : -60)} c="#c98a5a" />
				</g>
			);
		})}
	</g>
);

/* the hero at night in his room, gaming in a chair, bouncing */
export const Gaming: React.FC<{f: number; x: number}> = ({f, x}) => {
	const bounce = Math.abs(Math.sin(f / 4)) * 6;
	const pose: Pose = {lean: 10 + Math.sin(f / 5) * 4, head: -6, armF: [70 + Math.sin(f / 2) * 8, 70], armB: [60, 80], legB: [88, 85], legF: [92, 90]};
	return (
		<g>
			<rect x={x - 70} y={790} width={140} height={20} rx={8} fill="#2b2f3a" />
			<rect x={x - 80} y={640} width={26} height={170} rx={10} fill="#ff2a3c" />
			<rect x={x - 6} y={810} width={12} height={90} fill="#2b2f3a" />
			<Hero x={x} seat={795 - bounce} pose={pose} faceTurn={0.5} look={[1, 0]} mouth="smile" lidBase={0.2} badge={false} />
			<g transform={`translate(${x + 120},${700 - bounce})`}>
				<rect x={-34} y={-14} width={68} height={28} rx={14} fill="#141826" />
				<circle cx={-14} cy={0} r={5} fill={Math.floor(f / 4) % 2 ? '#ff2a3c' : '#3aff9a'} />
			</g>
		</g>
	);
};

/* gaming monitor with flashing game light */
export const Monitor: React.FC<{x: number; f: number}> = ({x, f}) => (
	<g>
		<rect x={x - 10} y={620} width={20} height={110} fill="#2b2f3a" />
		<rect x={x - 70} y={720} width={140} height={14} rx={6} fill="#2b2f3a" />
		<rect x={x - 200} y={420} width={400} height={220} rx={12} fill="#0b0d18" />
		<rect x={x - 186} y={434} width={372} height={192} fill={['#3a6fd2', '#ff2a3c', '#3aa37a', '#9b6cf0'][Math.floor(f / 9) % 4]} />
		{Array.from({length: 6}).map((_, i) => (
			<rect key={i} x={x - 170 + ((f * 6 + i * 70) % 340)} y={450 + random('mn' + i) * 150} width={20} height={20} fill="#fff" opacity={0.8} />
		))}
		<text x={x} y={540} textAnchor="middle" fontSize={40} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#fff">
			LEVEL {12 + Math.floor(f / 20)}
		</text>
		<rect x={x - 400} y={330} width={800} height={600} fill={['#3a6fd2', '#ff2a3c', '#3aa37a', '#9b6cf0'][Math.floor(f / 9) % 4]} opacity={0.08} />
	</g>
);

const RB = "'Rubik', sans-serif";

/* cookie jar; fill 0..1 (cookies inside), lid lift 0..1 */
export const Jar: React.FC<{x: number; y: number; fill?: number; lid?: number; s?: number}> = ({x, y, fill = 0, lid = 0, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-70} y={-150} width={140} height={150} rx={30} fill="#d9f0ff" opacity={0.55} stroke="#9ac4e0" strokeWidth={5} />
		{Array.from({length: Math.round(fill * 9)}).map((_, i) => (
			<Cookie key={i} x={-38 + (i % 3) * 38} y={-28 - Math.floor(i / 3) * 36} s={0.8} />
		))}
		<g transform={`translate(${lid * 60},${-150 - lid * 90}) rotate(${lid * 30})`}>
			<rect x={-78} y={-24} width={156} height={28} rx={10} fill="#d23b3b" />
			<circle cx={0} cy={-30} r={14} fill="#d23b3b" />
		</g>
		<rect x={-50} y={-110} width={100} height={36} rx={6} fill="#fbf8ef" />
		<text y={-84} textAnchor="middle" fontSize={22} fontFamily={RB} fontWeight={900} fill="#d23b3b">
			COOKIES
		</text>
	</g>
);
export const Cookie: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
		<circle r={22} fill="#d9a066" stroke="#9a6a3a" strokeWidth={3} />
		<circle cx={-8} cy={-6} r={4} fill="#4a2a1a" />
		<circle cx={7} cy={4} r={4} fill="#4a2a1a" />
		<circle cx={-2} cy={10} r={3} fill="#4a2a1a" />
	</g>
);
/* phone held up, with a short message */
export const PhoneUp: React.FC<{x: number; y: number; text?: string; s?: number; c?: string}> = ({x, y, text, s = 1, c = '#3a6fd2'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-30} y={-52} width={60} height={104} rx={10} fill="#0b0d18" />
		<rect x={-25} y={-44} width={50} height={86} rx={6} fill={c} />
		{text ? (
			<text y={8} textAnchor="middle" fontSize={14} fontFamily={RB} fontWeight={800} fill="#fff">
				{text}
			</text>
		) : null}
	</g>
);
/* test sheet with an optional grade */
export const TestPaper: React.FC<{x: number; y: number; s?: number; grade?: string; t?: number; rot?: number; fill?: number}> = ({x, y, s = 1, grade, t = 0, rot = -3, fill = 1}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-160} y={-210} width={320} height={420} fill="#fbf8ef" stroke="#c9c4b0" strokeWidth={4} />
		<text x={-130} y={-160} fontSize={30} fontFamily={RB} fontWeight={900} fill="#3a6fd2">
			HISTORY TEST
		</text>
		{Array.from({length: 7}).map((_, i) => (
			<g key={i}>
				<text x={-130} y={-100 + i * 44} fontSize={22} fontFamily={RB} fill="#555">
					{i + 1}.
				</text>
				<rect x={-100} y={-114 + i * 44} width={180 * Math.min(1, Math.max(0, fill * 7 - i))} height={6} fill="#2a2030" />
				{fill * 7 - i >= 1 ? <path d={`M110,${-112 + i * 44} l8,8 l16,-16`} stroke="#3aa37a" strokeWidth={5} fill="none" /> : null}
			</g>
		))}
		{grade && t > 0 ? (
			<g transform={`translate(70,120) rotate(-14) scale(${1 + Math.max(0, 1 - t / 6) * 1.4})`} opacity={Math.min(1, t / 3)}>
				<circle r={78} fill="none" stroke="#d23b3b" strokeWidth={9} />
				<text y={30} textAnchor="middle" fontSize={84} fontFamily={RB} fontWeight={900} fill="#d23b3b">
					{grade}
				</text>
			</g>
		) : null}
	</g>
);
/* scale from FEW to MANY with a pin */
export const Meter: React.FC<{x: number; y: number; v: number; w?: number}> = ({x, y, v, w = 1100}) => (
	<g transform={`translate(${x},${y})`}>
		<defs>
			<linearGradient id="mtr" x1="0" x2="1">
				<stop offset="0" stopColor="#3aa37a" />
				<stop offset="0.5" stopColor="#ffd34a" />
				<stop offset="1" stopColor="#ff2a3c" />
			</linearGradient>
		</defs>
		<rect x={-w / 2} y={-18} width={w} height={36} rx={18} fill="url(#mtr)" stroke="#fff" strokeWidth={5} />
		<text x={-w / 2} y={74} fontSize={40} fontFamily={RB} fontWeight={900} fill="#fff">
			FEW LIES
		</text>
		<text x={w / 2} y={74} textAnchor="end" fontSize={40} fontFamily={RB} fontWeight={900} fill="#fff">
			A LOT
		</text>
		<g transform={`translate(${-w / 2 + v * w},-30)`}>
			<path d="M-26,-60 h52 v40 l-26,26 l-26,-26 z" fill="#fff" stroke="#2a2030" strokeWidth={5} />
			<text y={-30} textAnchor="middle" fontSize={26} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
				YOU
			</text>
		</g>
	</g>
);
/* tally marks on a notepad, n marks */
export const Notepad: React.FC<{x: number; y: number; n: number; s?: number}> = ({x, y, n, s = 1}) => (
	<g transform={`translate(${x},${y}) rotate(4) scale(${s})`}>
		<rect x={-170} y={-220} width={340} height={440} rx={10} fill="#fff6b8" stroke="#c9b060" strokeWidth={4} />
		{Array.from({length: 10}).map((_, i) => (
			<line key={i} x1={-150} y1={-160 + i * 40} x2={150} y2={-160 + i * 40} stroke="#9ac4e0" strokeWidth={2} />
		))}
		{Array.from({length: n}).map((_, i) => {
			const g = Math.floor(i / 5);
			const k = i % 5;
			const gx = -140 + (g % 4) * 76;
			const gy = -150 + Math.floor(g / 4) * 70;
			return k < 4 ? <line key={i} x1={gx + k * 14} y1={gy} x2={gx + k * 14} y2={gy + 50} stroke="#2a2030" strokeWidth={5} strokeLinecap="round" /> : <line key={i} x1={gx - 8} y1={gy + 40} x2={gx + 54} y2={gy + 8} stroke="#d23b3b" strokeWidth={5} strokeLinecap="round" />;
		})}
	</g>
);
/* glowing light bulb idea */
export const Bulb: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
	if (t < 0) return null;
	const k = Math.min(1, t / 6);
	return (
		<g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * k})`}>
			<circle r={90} fill="#ffe08a" opacity={0.25 + 0.1 * Math.sin(t / 3)} />
			<circle r={44} fill="#ffe08a" stroke="#c9a010" strokeWidth={5} />
			<rect x={-20} y={40} width={40} height={30} rx={6} fill="#9aa3b5" />
			{Array.from({length: 8}).map((_, i) => {
				const a = (i / 8) * Math.PI * 2;
				return <line key={i} x1={Math.cos(a) * 60} y1={Math.sin(a) * 60} x2={Math.cos(a) * 80} y2={Math.sin(a) * 80} stroke="#ffe08a" strokeWidth={6} strokeLinecap="round" />;
			})}
		</g>
	);
};
/* polaroid memory */
export const Polaroid: React.FC<{x: number; y: number; rot?: number; s?: number; kind: 'lake' | 'fire' | 'stars' | 'bday' | 'kai'; gap?: boolean}> = ({x, y, rot = 0, s = 1, kind, gap}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-110} y={-120} width={220} height={250} fill="#fbf8ef" stroke="#ddd" strokeWidth={2} />
		<rect x={-96} y={-106} width={192} height={180} fill={kind === 'stars' ? '#141a46' : kind === 'fire' ? '#2a1a3a' : kind === 'lake' ? '#9fd2f0' : '#ffe0f0'} />
		{kind === 'lake' ? <rect x={-96} y={10} width={192} height={64} fill="#3a7ac8" /> : null}
		{kind === 'lake' ? <circle cx={0} cy={0} r={18} fill="#000" /> : null}
		{kind === 'lake' ? <path d="M-30,10 q30,-30 60,0" stroke="#fff" strokeWidth={4} fill="none" /> : null}
		{kind === 'fire' ? <path d="M-20,60 q20,-90 40,0 z" fill="#ffb030" /> : null}
		{kind === 'fire' ? <path d="M-10,60 q10,-50 20,0 z" fill="#ffe08a" /> : null}
		{kind === 'stars' ? Array.from({length: 14}).map((_, i) => <circle key={i} cx={-86 + random('ps' + i) * 172} cy={-96 + random('pt' + i) * 150} r={2.5} fill="#fff" />) : null}
		{kind === 'bday' || kind === 'kai' ? (
			<g>
				<circle cx={-40} cy={-20} r={22} fill="#000" />
				<rect x={-58} y={0} width={36} height={70} rx={10} fill="#ff2a3c" />
				{gap ? <rect x={10} y={-50} width={70} height={124} fill="none" stroke="#9aa3b5" strokeWidth={3} strokeDasharray="8 8" /> : (
					<>
						<circle cx={44} cy={-20} r={22} fill="#000" />
						<rect x={26} y={0} width={36} height={70} rx={10} fill="#2f8fe0" />
						<path d="M22,-40 q22,-16 44,0 v-6 q-22,-14 -44,0 z" fill="#f2b21c" />
					</>
				)}
			</g>
		) : null}
		<text y={110} textAnchor="middle" fontSize={26} fontFamily="'Caveat', cursive" fontWeight={700} fill="#2a2030">
			{kind === 'lake' ? 'the lake!' : kind === 'fire' ? 'campfire songs' : kind === 'stars' ? 'stars ♥' : kind === 'bday' ? 'b-day!' : 'best friends'}
		</text>
	</g>
);
/* popcorn bucket */
export const Popcorn: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{Array.from({length: 7}).map((_, i) => <circle key={i} cx={-30 + i * 10} cy={-60 - (i % 2) * 10} r={14} fill="#fff6d0" />)}
		<path d="M-40,-60 L40,-60 L30,20 L-30,20 Z" fill="#fbf8ef" />
		{[-24, -4, 16].map((d) => <path key={d} d={`M${d},-60 l4,80 h8 l-2,-80 z`} fill="#d23b3b" />)}
	</g>
);
/* golden key */
export const Key: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<circle cx={-60} r={34} fill="none" stroke="#ffd34a" strokeWidth={16} />
		<rect x={-30} y={-8} width={120} height={16} fill="#ffd34a" />
		<rect x={60} y={0} width={14} height={30} fill="#ffd34a" />
		<rect x={80} y={0} width={14} height={22} fill="#ffd34a" />
	</g>
);
/* campfire */
export const Campfire: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<circle cy={-40} r={200} fill="#ffb030" opacity={0.14 + 0.04 * Math.sin(f / 3)} />
		<rect x={-60} y={-14} width={120} height={20} rx={10} fill="#6b4a2a" transform="rotate(12)" />
		<rect x={-60} y={-14} width={120} height={20} rx={10} fill="#5a3a1a" transform="rotate(-12)" />
		<path d={`M-40,-10 Q${-30 + Math.sin(f / 3) * 8},-110 0,${-150 + Math.sin(f / 2) * 10} Q${30 + Math.cos(f / 3) * 8},-100 40,-10 Z`} fill="#ff6a2a" />
		<path d={`M-20,-10 Q${-10 + Math.sin(f / 2) * 6},-70 0,${-95 + Math.cos(f / 2) * 8} Q${12},-60 20,-10 Z`} fill="#ffe08a" />
	</g>
);
export const Book: React.FC<{x: number; y: number; c?: string; title?: string; s?: number; rot?: number}> = ({x, y, c = '#3a6fd2', title = 'HISTORY', s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-60} y={-80} width={120} height={160} rx={6} fill={c} stroke={darkenHex(c)} strokeWidth={4} />
		<rect x={-50} y={-70} width={10} height={140} fill="#fff" opacity={0.3} />
		<text y={6} textAnchor="middle" fontSize={20} fontFamily={RB} fontWeight={900} fill="#fff">
			{title}
		</text>
	</g>
);
const darkenHex = (c: string) => c;

/* brain side view; glow 0..1 lights the emotion centre (amygdala) */
export const Brain: React.FC<{x: number; y: number; s?: number; glow?: number}> = ({x, y, s = 1, glow = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-220,20 C-260,-120 -120,-210 0,-190 C120,-220 250,-120 220,0 C250,90 150,150 60,130 C30,180 -60,170 -80,120 C-180,140 -250,90 -220,20 Z" fill="#ffb3c4" stroke="#c96a86" strokeWidth={8} />
		{['M-160,-80 q40,-40 80,0 t80,0', 'M-120,0 q40,-40 80,0 t80,0 t80,0', 'M-180,60 q40,-30 80,0', 'M20,60 q40,-30 80,0', 'M-40,-140 q30,40 0,80'].map((d, i) => (
			<path key={i} d={d} stroke="#c96a86" strokeWidth={7} fill="none" strokeLinecap="round" />
		))}
		<circle cx={-20} cy={60} r={40 + 70 * glow} fill="#ff2a3c" opacity={0.25 * glow} />
		<circle cx={-20} cy={60} r={28} fill={glow > 0.05 ? '#ff2a3c' : '#c96a86'} opacity={0.4 + 0.6 * glow} />
	</g>
);
/* coin */
export const Coin: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<ellipse rx={22} ry={22} fill="#ffd34a" stroke="#c9a010" strokeWidth={4} />
		<text y={9} textAnchor="middle" fontSize={24} fontFamily={RB} fontWeight={900} fill="#c9a010">
			¢
		</text>
	</g>
);
/* banknote */
export const Bill: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-50} y={-26} width={100} height={52} rx={6} fill="#5ac85a" stroke="#2a7a2a" strokeWidth={4} />
		<circle r={14} fill="#2a7a2a" opacity={0.5} />
		<text y={9} textAnchor="middle" fontSize={24} fontFamily={RB} fontWeight={900} fill="#fff">
			$
		</text>
	</g>
);
/* microphone (reporter) */
export const Mic: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = -30}) => (
	<g transform={`translate(${x},${y}) rotate(${rot})`}>
		<rect x={-8} y={0} width={16} height={70} rx={6} fill="#2b2f3a" />
		<circle cx={0} cy={-6} r={20} fill="#9aa3b5" />
		<rect x={-18} y={20} width={36} height={22} fill="#3a6fd2" />
	</g>
);
/* calendar page */
export const CalPage: React.FC<{x: number; y: number; top: string; big: string; s?: number; rot?: number; c?: string}> = ({x, y, top, big, s = 1, rot = 0, c = '#d23b3b'}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-130} y={-130} width={260} height={260} rx={18} fill="#fbf8ef" stroke="#2a2030" strokeWidth={4} />
		<rect x={-130} y={-130} width={260} height={70} rx={18} fill={c} />
		<text y={-82} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={900} fill="#fff">
			{top}
		</text>
		<text y={70} textAnchor="middle" fontSize={big.length > 3 ? 64 : 120} fontFamily={RB} fontWeight={900} fill="#2a2030">
			{big}
		</text>
	</g>
);
/* thermometer */
export const Thermo: React.FC<{x: number; y: number; v: number; s?: number}> = ({x, y, v, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-22} y={-200} width={44} height={220} rx={22} fill="#fbf8ef" stroke="#2a2030" strokeWidth={5} />
		<circle cy={30} r={38} fill="#ff2a3c" stroke="#2a2030" strokeWidth={5} />
		<rect x={-10} y={10 - 190 * v} width={20} height={190 * v} fill="#ff2a3c" />
		<text x={50} y={-140} fontSize={44} fontFamily={RB} fontWeight={900} fill="#fff" stroke="#2a2030" strokeWidth={8} paintOrder="stroke">
			{(97 + 7 * v).toFixed(0)}°F
		</text>
	</g>
);
