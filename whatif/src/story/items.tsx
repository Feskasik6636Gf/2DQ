import React from 'react';
import {random} from 'remotion';
import {darken, lighten} from '../engine/color';

/* Small flat props. Origin = bottom centre of the object (stand it on the floor line). */
export type ItemKey =
	| 'phone' | 'router' | 'bag' | 'card' | 'atm' | 'bread' | 'milk' | 'rice' | 'sack' | 'map' | 'atlas' | 'letter' | 'pot' | 'mug'
	| 'harmonica' | 'ball' | 'grill' | 'jar' | 'plant' | 'radio' | 'megaphone' | 'bike' | 'truck' | 'box' | 'books' | 'tv' | 'notes'
	| 'heart' | 'mailbox' | 'cart' | 'table' | 'wifi' | 'globe' | 'stamp' | 'cookie' | 'guitar' | 'drum' | 'lamp' | 'door' | 'newspaper'
	| 'tomato' | 'pill' | 'clipboard' | 'flower' | 'candle' | 'fire' | 'cable' | 'star' | 'clock' | 'stove' | 'bowl' | 'coffin' | 'chart' | 'voice' | 'photo' | 'crack';

export type ItemProps = {k: ItemKey; c?: string; txt?: string; f: number};

const F = "'Rubik', sans-serif";
const H = "'Caveat', cursive";

export const Item: React.FC<ItemProps> = ({k, c, txt, f}) => {
	switch (k) {
		case 'phone':
			return (
				<g>
					<rect x={-46} y={-150} width={92} height={150} rx={14} fill="#161a24" stroke="#4a5268" strokeWidth={4} />
					<rect x={-38} y={-138} width={76} height={122} rx={8} fill={c ?? '#0b1020'} />
					<text x={0} y={-82} textAnchor="middle" fontSize={15} fontFamily={F} fontWeight={800} fill="#ff6a6a">
						{txt ?? 'NO SIGNAL'}
					</text>
					<path d="M-18,-60 a26,26 0 0 1 36,0 M-10,-48 a14,14 0 0 1 20,0" stroke="#ff6a6a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 4)} />
					<line x1={-22} y1={-72} x2={22} y2={-34} stroke="#ff6a6a" strokeWidth={4} />
				</g>
			);
		case 'router':
			return (
				<g>
					<rect x={-70} y={-34} width={140} height={34} rx={8} fill="#2a2f3e" />
					<rect x={-50} y={-120} width={8} height={90} rx={3} fill="#2a2f3e" />
					<rect x={42} y={-120} width={8} height={90} rx={3} fill="#2a2f3e" />
					{[0, 1, 2, 3].map((i) => (
						<circle key={i} cx={-42 + i * 22} cy={-17} r={5} fill={i === 0 ? (Math.floor(f / 8) % 2 ? '#ff4a4a' : '#5a1a1a') : '#3a4256'} />
					))}
				</g>
			);
		case 'bag':
			return (
				<g>
					<path d="M-52,0 L-44,-130 L44,-130 L52,0 Z" fill="#c9a06a" stroke="#8a6a3f" strokeWidth={4} />
					<path d="M-44,-130 q-4,-24 12,-30 M44,-130 q4,-24 -12,-30" stroke="#6a8a3a" strokeWidth={9} fill="none" />
					<circle cx={-14} cy={-150} r={20} fill="#d94a3a" />
					<rect x={10} y={-176} width={26} height={50} rx={6} fill="#f2b21c" />
				</g>
			);
		case 'card':
			return (
				<g>
					<rect x={-60} y={-80} width={120} height={78} rx={10} fill="#3a6fd2" />
					<rect x={-60} y={-62} width={120} height={16} fill="#101a3a" />
					<rect x={-46} y={-34} width={44} height={10} rx={3} fill="#f2d28a" />
					<text x={34} y={-12} fontSize={14} fontFamily={F} fill="#fff" textAnchor="middle" fontWeight={800}>
						VISA
					</text>
				</g>
			);
		case 'atm':
			return (
				<g>
					<rect x={-90} y={-330} width={180} height={330} rx={14} fill="#4a5268" />
					<rect x={-70} y={-300} width={140} height={90} rx={8} fill="#0b1020" />
					<text x={0} y={-262} fontSize={22} fontFamily={F} fontWeight={800} textAnchor="middle" fill="#ff6a6a" opacity={0.6 + 0.4 * Math.sin(f / 5)}>
						NO NETWORK
					</text>
					<rect x={-60} y={-190} width={120} height={60} rx={6} fill="#2a2f3e" />
					<rect x={-50} y={-100} width={100} height={14} rx={4} fill="#101520" />
				</g>
			);
		case 'bread':
			return (
				<g>
					<path d="M-70,0 q-14,-70 70,-76 q84,6 70,76 Z" fill="#d9a05a" />
					{[-34, 0, 34].map((x) => (
						<path key={x} d={`M${x - 8},-46 l16,-18`} stroke="#b9783a" strokeWidth={6} strokeLinecap="round" />
					))}
				</g>
			);
		case 'milk':
			return (
				<g>
					<rect x={-30} y={-110} width={60} height={110} fill="#f4f6fa" stroke="#c9d0dc" strokeWidth={3} />
					<polygon points="-30,-110 0,-140 30,-110" fill="#e1e6f0" />
					<rect x={-30} y={-80} width={60} height={34} fill="#4a8fd8" />
					<text x={0} y={-56} fontSize={16} textAnchor="middle" fontFamily={F} fontWeight={800} fill="#fff">
						MILK
					</text>
				</g>
			);
		case 'rice':
			return (
				<g>
					<rect x={-52} y={-112} width={104} height={112} rx={14} fill="#f4efe0" stroke="#c9bfa0" strokeWidth={4} />
					<rect x={-52} y={-86} width={104} height={44} fill="#d94a3a" />
					<text x={0} y={-55} fontSize={26} textAnchor="middle" fontFamily={F} fontWeight={900} fill="#fff">
						RICE
					</text>
				</g>
			);
		case 'sack':
			return (
				<g>
					<path d="M-54,0 q-20,-90 18,-120 l-8,-26 h52 l-8,26 q38,30 18,120 Z" fill="#b99a6a" stroke="#8a6a3f" strokeWidth={4} />
					{[[-20, -50], [14, -30], [8, -76], [-26, -88]].map(([x, y], i) => (
						<ellipse key={i} cx={x} cy={y} rx={13} ry={10} fill="#d9b070" />
					))}
				</g>
			);
		case 'map':
			return (
				<g transform="translate(0,-60)">
					<polygon points="-90,-50 -30,-60 30,-50 90,-60 90,50 30,60 -30,50 -90,60" fill="#f3e6c4" stroke="#a8935e" strokeWidth={4} />
					<line x1={-30} y1={-60} x2={-30} y2={50} stroke="#c9b27a" strokeWidth={3} />
					<line x1={30} y1={-50} x2={30} y2={60} stroke="#c9b27a" strokeWidth={3} />
					<path d="M-70,30 Q-30,-20 10,10 T70,-30" stroke="#d94a3a" strokeWidth={5} fill="none" strokeDasharray="10 8" />
					<path d="M60,-34 l10,-14 l10,14 z" fill="#d94a3a" />
				</g>
			);
		case 'atlas':
			return (
				<g transform="translate(0,-8)">
					<rect x={-70} y={-110} width={140} height={110} rx={6} fill="#2f6aa8" stroke="#1d4a7a" strokeWidth={5} />
					<text x={0} y={-60} fontSize={26} textAnchor="middle" fontFamily={F} fontWeight={900} fill="#ffe08a">
						ATLAS
					</text>
					<text x={0} y={-30} fontSize={22} textAnchor="middle" fontFamily={F} fontWeight={800} fill="#ffe08a">
						1994
					</text>
				</g>
			);
		case 'letter':
			return (
				<g transform="translate(0,-40)">
					<rect x={-80} y={-50} width={160} height={100} rx={6} fill="#fbf3dc" stroke="#c9b27a" strokeWidth={4} />
					<path d="M-80,-50 L0,10 L80,-50" stroke="#c9b27a" strokeWidth={4} fill="none" />
					<rect x={44} y={-44} width={30} height={36} fill="#d94a3a" />
					<rect x={49} y={-39} width={20} height={26} fill="#ffe08a" />
				</g>
			);
		case 'pot':
			return (
				<g>
					<rect x={-70} y={-90} width={140} height={90} rx={14} fill="#8a8e9c" />
					<rect x={-80} y={-100} width={160} height={16} rx={8} fill="#aeb2bf" />
					<rect x={70} y={-70} width={44} height={12} rx={6} fill="#5a5e6c" />
					{[0, 1, 2].map((i) => (
						<circle key={i} cx={-30 + i * 30} cy={-120 - ((f * 1.3 + i * 22) % 60)} r={10 + i * 2} fill="#fff" opacity={0.5 - ((f * 1.3 + i * 22) % 60) / 140} />
					))}
				</g>
			);
		case 'mug':
			return (
				<g>
					<rect x={-26} y={-52} width={52} height={52} rx={10} fill={c ?? '#f2b21c'} />
					<path d="M26,-40 q20,0 20,14 q0,14 -20,14" stroke={c ?? '#f2b21c'} strokeWidth={8} fill="none" />
					<path d="M-6,-62 q-8,-14 0,-26 M10,-62 q-8,-14 0,-26" stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} />
				</g>
			);
		case 'harmonica':
			return (
				<g transform="translate(0,-14)">
					<rect x={-46} y={-14} width={92} height={28} rx={6} fill="#b9bfd0" stroke="#7a8094" strokeWidth={3} />
					{Array.from({length: 8}).map((_, i) => (
						<rect key={i} x={-40 + i * 11} y={-6} width={7} height={12} fill="#3a3f52" />
					))}
				</g>
			);
		case 'ball':
			return (
				<g transform="translate(0,-30)">
					<circle r={30} fill="#fff" stroke="#222" strokeWidth={3} />
					<polygon points="0,-10 10,-3 6,9 -6,9 -10,-3" fill="#222" />
					<path d="M0,-10 L0,-30 M10,-3 L28,-10 M6,9 L16,26 M-6,9 L-16,26 M-10,-3 L-28,-10" stroke="#222" strokeWidth={3} />
				</g>
			);
		case 'grill':
			return (
				<g>
					<path d="M-80,-120 a80,80 0 0 0 160,0 Z" fill="#3a3f4a" />
					<rect x={-84} y={-124} width={168} height={10} rx={4} fill="#5a6070" />
					<line x1={-50} y1={-60} x2={-70} y2={0} stroke="#3a3f4a" strokeWidth={8} />
					<line x1={50} y1={-60} x2={70} y2={0} stroke="#3a3f4a" strokeWidth={8} />
					{[0, 1, 2, 3].map((i) => (
						<path key={i} d={`M${-40 + i * 26},-130 q-14,-26 0,-50 q14,-24 0,-50`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.3} transform={`translate(0,${-((f * 1.4 + i * 20) % 50)})`} />
					))}
					{[0, 1, 2].map((i) => (
						<ellipse key={i} cx={-36 + i * 36} cy={-134 + Math.sin(f / 3 + i) * 3} rx={12} ry={18} fill={['#ff7a2a', '#ffc94a', '#ff5a2a'][i]} opacity={0.9} />
					))}
				</g>
			);
		case 'jar':
			return (
				<g>
					<rect x={-26} y={-84} width={52} height={84} rx={12} fill="#cfeaf7" opacity={0.7} stroke="#fff" strokeWidth={3} />
					<rect x={-30} y={-94} width={60} height={14} rx={4} fill="#c9a06a" />
					{[[-8, -26], [8, -46], [-6, -62], [10, -22]].map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={11} fill="#d94a3a" />
					))}
				</g>
			);
		case 'plant':
			return (
				<g>
					<path d="M-34,0 L-26,-50 L26,-50 L34,0 Z" fill="#c4672e" />
					{[-40, -15, 10, 36].map((a, i) => (
						<path key={i} d={`M0,-50 q${a},-60 ${a * 1.4},-${90 + i * 14}`} stroke="#3aa04a" strokeWidth={14} strokeLinecap="round" fill="none" />
					))}
				</g>
			);
		case 'radio':
			return (
				<g>
					<rect x={-80} y={-100} width={160} height={100} rx={14} fill="#8a5a34" stroke="#5a3a1c" strokeWidth={5} />
					<circle cx={-34} cy={-50} r={30} fill="#3a2a1c" />
					<circle cx={-34} cy={-50} r={22} fill="#c9a06a" opacity={0.5} />
					<rect x={10} y={-80} width={56} height={22} rx={4} fill="#ffe08a" />
					<circle cx={38} cy={-28} r={9} fill="#f2d28a" />
					<line x1={50} y1={-100} x2={96} y2={-170} stroke="#aaa" strokeWidth={5} />
					{[0, 1, 2].map((i) => (
						<path key={i} d={`M${-130 - i * 30},-${60}`} />
					))}
				</g>
			);
		case 'megaphone':
			return (
				<g transform="translate(0,-40)">
					<polygon points="-50,-14 -50,14 -20,22 -20,-22" fill="#d94a3a" />
					<polygon points="-20,-22 60,-52 60,52 -20,22" fill="#f2b21c" />
					<rect x={-66} y={-10} width={18} height={20} rx={4} fill="#3a3f52" />
				</g>
			);
		case 'bike':
			return (
				<g>
					<circle cx={-70} cy={-48} r={48} fill="none" stroke="#222" strokeWidth={9} />
					<circle cx={70} cy={-48} r={48} fill="none" stroke="#222" strokeWidth={9} />
					<path d="M-70,-48 L-20,-110 L40,-110 L70,-48 M-20,-110 L10,-48 L-70,-48 M40,-110 L30,-140" stroke={c ?? '#d94a3a'} strokeWidth={9} fill="none" strokeLinejoin="round" />
					<line x1={20} y1={-140} x2={50} y2={-140} stroke="#222" strokeWidth={8} />
					<rect x={-40} y={-124} width={46} height={12} rx={5} fill="#222" />
				</g>
			);
		case 'truck':
			return (
				<g>
					<rect x={-190} y={-210} width={270} height={170} rx={10} fill="#e8e4d8" stroke="#b8b4a8" strokeWidth={4} />
					<text x={-55} y={-110} textAnchor="middle" fontSize={44} fontFamily={F} fontWeight={900} fill="#3a6fd2">
						DELIVERY
					</text>
					<path d="M80,-170 L170,-170 L210,-100 L210,-40 L80,-40 Z" fill="#3a6fd2" />
					<polygon points="100,-156 160,-156 190,-104 100,-104" fill="#bfe3f5" />
					<rect x={-190} y={-40} width={400} height={14} fill="#2a2f3e" />
					<circle cx={-110} cy={-24} r={34} fill="#14161f" />
					<circle cx={-110} cy={-24} r={14} fill="#8a8e9c" />
					<circle cx={140} cy={-24} r={34} fill="#14161f" />
					<circle cx={140} cy={-24} r={14} fill="#8a8e9c" />
				</g>
			);
		case 'box':
			return (
				<g>
					<rect x={-50} y={-90} width={100} height={90} fill="#c9a06a" stroke="#8a6a3f" strokeWidth={4} />
					<rect x={-10} y={-90} width={20} height={90} fill="#e8d098" opacity={0.7} />
				</g>
			);
		case 'books':
			return (
				<g>
					{['#d94a3a', '#3a6fd2', '#f2b21c', '#3aa37a'].map((cc, i) => (
						<rect key={i} x={-60 + (i % 2) * 8} y={-30 - i * 28} width={120 - (i % 3) * 14} height={26} rx={3} fill={cc} />
					))}
				</g>
			);
		case 'tv':
			return (
				<g>
					<rect x={-100} y={-150} width={200} height={140} rx={10} fill="#222733" />
					<rect x={-88} y={-138} width={176} height={116} rx={4} fill="#111" />
					{Array.from({length: 40}).map((_, i) => (
						<rect key={i} x={-88 + random('tv' + i + Math.floor(f / 2)) * 168} y={-138 + random('tw' + i + Math.floor(f / 2)) * 110} width={12} height={4} fill="#fff" opacity={0.6} />
					))}
					<rect x={-40} y={-10} width={80} height={10} fill="#3a3f52" />
				</g>
			);
		case 'notes':
			return (
				<g fill={c ?? '#ffe08a'} fontFamily={F} fontWeight={900}>
					{['♪', '♫', '♬', '♪'].map((n, i) => (
						<text key={i} x={-60 + i * 40} y={-30 - ((f * 1.2 + i * 26) % 120)} fontSize={44 + (i % 2) * 14} opacity={1 - ((f * 1.2 + i * 26) % 120) / 130}>
							{n}
						</text>
					))}
				</g>
			);
		case 'heart':
			return (
				<g transform={`scale(${1 + 0.08 * Math.sin(f / 5)})`}>
					<path d="M0,-10 C-70,-70 -40,-130 0,-96 C40,-130 70,-70 0,-10 Z" fill={c ?? '#ff5a7a'} />
				</g>
			);
		case 'mailbox':
			return (
				<g>
					<rect x={-8} y={-110} width={16} height={110} fill="#6a5a4a" />
					<rect x={-50} y={-170} width={100} height={64} rx={28} fill="#3a6fd2" />
					<rect x={30} y={-196} width={8} height={40} fill="#d94a3a" />
					<rect x={30} y={-200} width={30} height={16} fill="#d94a3a" />
				</g>
			);
		case 'cart':
			return (
				<g>
					<path d="M-70,-130 L70,-130 L50,-50 L-50,-50 Z" fill="none" stroke="#9aa0ae" strokeWidth={7} />
					<path d="M-70,-130 L-90,-150" stroke="#9aa0ae" strokeWidth={7} />
					<circle cx={-36} cy={-20} r={14} fill="#333" />
					<circle cx={36} cy={-20} r={14} fill="#333" />
					<line x1={-50} y1={-50} x2={-36} y2={-34} stroke="#9aa0ae" strokeWidth={6} />
					<line x1={50} y1={-50} x2={36} y2={-34} stroke="#9aa0ae" strokeWidth={6} />
				</g>
			);
		case 'table':
			return (
				<g>
					<rect x={-150} y={-110} width={300} height={22} rx={6} fill="#c98a5a" />
					<rect x={-130} y={-88} width={16} height={88} fill="#9a6a44" />
					<rect x={114} y={-88} width={16} height={88} fill="#9a6a44" />
					<rect x={-150} y={-122} width={300} height={14} fill="#d94a3a" opacity={0.85} />
				</g>
			);
		case 'wifi':
			return (
				<g transform="translate(0,-80)" strokeLinecap="round" fill="none" stroke={c ?? '#ff4a5a'} strokeWidth={14}>
					<path d="M-70,-20 a100,100 0 0 1 140,0 M-44,8 a62,62 0 0 1 88,0 M-18,36 a26,26 0 0 1 36,0" />
					<circle cx={0} cy={62} r={9} fill={c ?? '#ff4a5a'} />
					<line x1={-80} y1={-50} x2={80} y2={90} strokeWidth={16} stroke="#ffe08a" />
				</g>
			);
		case 'globe':
			return (
				<g transform="translate(0,-110)">
					<circle r={110} fill="#2f6aa8" />
					<path d="M-60,-40 q30,-40 70,-20 q20,30 -10,50 q-40,10 -60,-30 M20,30 q40,-10 50,30 q-30,30 -50,-10" fill="#5ab85a" />
					<circle r={110} fill="none" stroke="#bfe3ff" strokeWidth={6} />
					<ellipse rx={50} ry={110} fill="none" stroke="#bfe3ff" strokeWidth={3} opacity={0.6} />
					<line x1={-110} x2={110} y1={0} y2={0} stroke="#bfe3ff" strokeWidth={3} opacity={0.6} />
				</g>
			);
		case 'stamp':
			return (
				<g transform="translate(0,-40) rotate(-10)">
					<rect x={-70} y={-34} width={140} height={68} rx={8} fill="none" stroke={c ?? '#d94a3a'} strokeWidth={8} />
					<text x={0} y={12} textAnchor="middle" fontSize={34} fontFamily={F} fontWeight={900} fill={c ?? '#d94a3a'}>
						{txt ?? 'DENIED'}
					</text>
				</g>
			);
		case 'cookie':
			return (
				<g transform="translate(0,-26)">
					<circle r={26} fill="#d9a05a" />
					{[[-8, -6], [10, 6], [-4, 12], [12, -12]].map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={4} fill="#5a3a1c" />
					))}
				</g>
			);
		case 'guitar':
			return (
				<g transform="rotate(-18)">
					<ellipse cx={0} cy={-50} rx={44} ry={52} fill="#c9783a" />
					<ellipse cx={0} cy={-110} rx={32} ry={36} fill="#c9783a" />
					<circle cx={0} cy={-76} r={14} fill="#2a1a10" />
					<rect x={-7} y={-250} width={14} height={140} fill="#5a3a1c" />
					<rect x={-14} y={-270} width={28} height={30} fill="#3a2a1c" />
				</g>
			);
		case 'drum':
			return (
				<g>
					<rect x={-50} y={-70} width={100} height={70} fill="#3a6fd2" />
					<ellipse cx={0} cy={-70} rx={50} ry={14} fill="#e9eef6" />
					<ellipse cx={0} cy={0} rx={50} ry={14} fill="#2a4f9a" />
				</g>
			);
		case 'lamp':
			return (
				<g>
					<rect x={-5} y={-300} width={10} height={300} fill="#3a3a4a" />
					<ellipse cx={0} cy={-310} rx={30} ry={18} fill="#ffe3a0" opacity={0.6 + 0.4 * Math.max(0, Math.sin(f / 2.3) * Math.sin(f / 7))} />
					<circle cx={0} cy={-310} r={80} fill="#ffe3a0" opacity={0.1 + 0.1 * Math.max(0, Math.sin(f / 2.3) * Math.sin(f / 7))} />
				</g>
			);
		case 'door':
			return (
				<g>
					<rect x={-70} y={-260} width={140} height={260} fill="#8a5a34" stroke="#5a3a1c" strokeWidth={8} />
					<circle cx={44} cy={-130} r={9} fill="#f2d28a" />
				</g>
			);
		case 'newspaper':
			return (
				<g transform="translate(0,-60) rotate(-6)">
					<rect x={-70} y={-50} width={140} height={100} fill="#eee8d4" stroke="#b8b09a" strokeWidth={3} />
					<rect x={-58} y={-40} width={116} height={20} fill="#222" />
					{[0, 1, 2].map((i) => (
						<rect key={i} x={-58} y={-10 + i * 16} width={52} height={8} fill="#8a8a8a" />
					))}
					<rect x={6} y={-10} width={52} height={40} fill="#9a9a9a" />
				</g>
			);
		case 'tomato':
			return (
				<g transform="translate(0,-24)">
					<circle r={24} fill="#d94a3a" />
					<path d="M-10,-22 l10,8 l10,-8" stroke="#3aa04a" strokeWidth={6} fill="none" />
				</g>
			);
		case 'pill':
			return (
				<g transform="translate(0,-30) rotate(-30)">
					<rect x={-40} y={-16} width={80} height={32} rx={16} fill="#fff" />
					<path d="M0,-16 h24 a16,16 0 0 1 0,32 h-24 z" fill="#d94a3a" />
				</g>
			);
		case 'clipboard':
			return (
				<g transform="translate(0,-90)">
					<rect x={-60} y={-80} width={120} height={160} rx={10} fill="#a07a4a" />
					<rect x={-48} y={-64} width={96} height={134} fill="#fbf8ef" />
					<rect x={-24} y={-90} width={48} height={22} rx={6} fill="#6a6a76" />
					{[0, 1, 2, 3, 4].map((i) => (
						<rect key={i} x={-38} y={-40 + i * 24} width={i % 2 ? 60 : 76} height={6} fill="#3a3f52" />
					))}
				</g>
			);
		case 'flower':
			return (
				<g>
					<line x1={0} y1={0} x2={0} y2={-80} stroke="#3aa04a" strokeWidth={8} />
					{[0, 72, 144, 216, 288].map((a) => (
						<ellipse key={a} cx={0} cy={-100} rx={14} ry={24} fill={c ?? '#ff8fb8'} transform={`rotate(${a} 0 -80)`} />
					))}
					<circle cx={0} cy={-90} r={12} fill="#ffd34a" />
				</g>
			);
		case 'candle':
			return (
				<g>
					<rect x={-12} y={-70} width={24} height={70} fill="#f5ead0" />
					<ellipse cx={0} cy={-90 + Math.sin(f / 3) * 2} rx={8} ry={16} fill="#ffb347" />
					<ellipse cx={0} cy={-88} rx={4} ry={9} fill="#fff6c8" />
					<circle cx={0} cy={-90} r={70} fill="#ffb347" opacity={0.1} />
				</g>
			);
		case 'fire':
			return (
				<g>
					{[0, 1, 2, 3].map((i) => (
						<ellipse key={i} cx={-30 + i * 20 + Math.sin(f / 3 + i) * 4} cy={-40 - i * 6 - Math.abs(Math.sin(f / 4 + i * 2)) * 18} rx={18 - i * 2} ry={40 - i * 4} fill={['#ff5a2a', '#ff8a2a', '#ffc94a', '#fff2a0'][i]} />
					))}
					<line x1={-60} y1={-6} x2={60} y2={-20} stroke="#5a3a1c" strokeWidth={14} strokeLinecap="round" />
					<line x1={-60} y1={-20} x2={60} y2={-6} stroke="#6a4a2c" strokeWidth={14} strokeLinecap="round" />
				</g>
			);
		case 'cable':
			return (
				<g transform="translate(0,-14)">
					<path d="M-140,0 Q-60,-30 0,0 T140,0" stroke="#10283a" strokeWidth={22} fill="none" />
					<path d="M-140,0 Q-60,-30 0,0 T140,0" stroke="#59c8ff" strokeWidth={7} fill="none" strokeDasharray="20 14" strokeDashoffset={-f * 2} />
				</g>
			);
		case 'star':
			return (
				<g>
					<polygon points="0,-60 14,-20 56,-20 22,6 34,48 0,22 -34,48 -22,6 -56,-20 -14,-20" fill={c ?? '#ffd34a'} transform="translate(0,-20)" />
				</g>
			);
		case 'clock':
			return (
				<g transform="translate(0,-90)">
					<circle r={80} fill="#fbf8ef" stroke="#222" strokeWidth={8} />
					<line x1={0} y1={0} x2={0} y2={-52} stroke="#222" strokeWidth={7} transform={`rotate(${f * 3})`} />
					<line x1={0} y1={0} x2={0} y2={-34} stroke="#d94a3a" strokeWidth={7} transform={`rotate(${f * 0.25})`} />
				</g>
			);
		case 'stove':
			return (
				<g>
					<rect x={-110} y={-190} width={220} height={190} rx={12} fill="#d9dce6" stroke="#aab0c0" strokeWidth={5} />
					<rect x={-90} y={-140} width={180} height={110} rx={8} fill="#2a2f3e" />
					{[-60, -20, 20, 60].map((x) => (
						<circle key={x} cx={x} cy={-172} r={8} fill="#3a3f52" />
					))}
				</g>
			);
		case 'bowl':
			return (
				<g>
					<path d="M-44,-44 h88 a44,44 0 0 1 -88,0 Z" fill="#f2b21c" />
					<ellipse cx={0} cy={-44} rx={44} ry={10} fill="#ffd34a" />
					{[0, 1].map((i) => (
						<path key={i} d={`M${-12 + i * 24},-60 q-8,-14 0,-28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} />
					))}
				</g>
			);
		case 'coffin':
			return (
				<g>
					<polygon points="-110,-54 110,-54 140,-30 110,0 -110,0 -140,-30" fill="#6a4a34" stroke="#3a2a1c" strokeWidth={5} />
					<ellipse cx={-10} cy={-70} rx={70} ry={16} fill="#e8d0e0" />
				</g>
			);
		case 'chart':
			return (
				<g transform="translate(0,-110)">
					<rect x={-150} y={-100} width={300} height={200} rx={12} fill="#10132a" stroke="#59c8ff" strokeWidth={4} />
					<polyline points="-120,60 -70,20 -20,40 40,-30 90,-50 130,-70" stroke="#5aff9a" strokeWidth={8} fill="none" />
					<text x={-120} y={-64} fontSize={26} fontFamily={F} fontWeight={800} fill="#59c8ff">
						{txt ?? 'STOCKS'}
					</text>
				</g>
			);
		case 'voice':
			return (
				<g transform="translate(0,-130)">
					<rect x={-190} y={-80} width={380} height={160} rx={30} fill="#1b1230" stroke="#ff4d6a" strokeWidth={6} />
					<circle cx={-130} cy={0} r={34} fill="#ff4d6a" />
					<polygon points="-140,-16 -140,16 -114,0" fill="#fff" />
					{Array.from({length: 22}).map((_, i) => {
						const h = 14 + Math.abs(Math.sin(f / 5 + i * 0.7)) * 40 * (0.4 + 0.6 * random('vw' + i));
						return <rect key={i} x={-84 + i * 10} y={-h / 2} width={6} height={h} rx={3} fill={i < 9 ? '#ff7a92' : '#8a6a8e'} />;
					})}
					<text x={150} y={-40} fontSize={24} textAnchor="end" fontFamily={F} fontWeight={800} fill="#fff">
						{txt ?? '0:41'}
					</text>
					<text x={-90} y={-52} fontSize={22} fontFamily={F} fontWeight={700} fill="#ffc9d0">
						Grandma
					</text>
				</g>
			);
		case 'photo':
			return (
				<g transform="translate(0,-60) rotate(-4)">
					<rect x={-70} y={-60} width={140} height={120} fill="#fff" stroke="#ddd" strokeWidth={2} />
					<rect x={-60} y={-50} width={120} height={84} fill={c ?? '#9fd2f0'} />
					<polygon points="-60,34 -20,-14 10,16 30,-4 60,34" fill="#4aa04a" />
					<circle cx={30} cy={-28} r={10} fill="#ffe08a" />
				</g>
			);
		case 'crack':
			return (
				<g transform="translate(0,-60)">
					<path d="M-40,-60 L-6,-10 L-30,10 L6,60 M-6,-10 L40,-30" stroke="#fff" strokeWidth={4} fill="none" />
				</g>
			);
	}
	return null;
};

export const darkn = darken;
export const lightn = lighten;
export const HANDF = H;
