import React from 'react';

/* Props: drawn around (0,0) = bottom centre of the object (y up = negative), ink outline like the characters.
   Each gets f = frames since it appeared, gf = global frame, a = free parameter. */
const INK = '#1d1626';
const o = {stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const shade = <T extends React.SVGProps<SVGElement>>(p: T) => p;
export type PR = React.FC<{f: number; gf: number; a?: any}>;

const Marker: PR = () => (
	<g>
		<rect x={-34} y={-9} width={68} height={18} rx={7} fill="#f4f1e8" {...o} />
		<rect x={-34} y={-9} width={26} height={18} rx={7} fill="#e0463c" {...o} />
		<rect x={30} y={-6} width={12} height={12} rx={3} fill="#2c2f38" {...o} />
	</g>
);
const Plane: PR = ({f}) => (
	<g transform={`rotate(${Math.sin(f / 18) * 3})`}>
		<polygon points="-46,6 54,-16 -6,22" fill="#fff" {...o} />
		<polygon points="-46,6 -6,22 -2,6" fill="#c9d6ea" {...o} />
		<polygon points="-46,6 54,-16 -10,0" fill="#f2f6ff" {...o} />
	</g>
);
const Star: PR = ({f}) => (
	<g transform={`scale(${1 + 0.08 * Math.sin(f / 6)})`}>
		<polygon points="0,-13 4,-4 14,-4 6,2 9,12 0,6 -9,12 -6,2 -14,-4 -4,-4" fill="#ffd23a" {...o} strokeWidth={2.2} />
	</g>
);
const Stickers: PR = () => (
	<g>
		<rect x={-30} y={-44} width={60} height={44} rx={6} fill="#e8553f" {...o} />
		<polygon points="0,-36 4,-26 14,-26 6,-20 9,-10 0,-16 -9,-10 -6,-20 -14,-26 -4,-26" fill="#ffd23a" {...o} strokeWidth={2} />
	</g>
);
const Sneeze: PR = ({f}) => (
	<g>
		{Array.from({length: 9}).map((_, i) => (
			<ellipse key={i} cx={20 + i * 11 + Math.sin(f / 10 + i) * 2} cy={-6 + Math.sin(i * 2.3) * 14} rx={4 + (i % 3)} ry={3 + (i % 2)} fill="#cfeaff" stroke={INK} strokeWidth={1.6} />
		))}
	</g>
);
const Tray: PR = ({a}) => (
	<g>
		<rect x={-70} y={-8} width={140} height={14} rx={6} fill="#8fa2ac" {...o} />
		<ellipse cx={-20} cy={-14} rx={40} ry={9} fill="#e9a14a" {...o} />
		<ellipse cx={-20} cy={-18} rx={34} ry={7} fill="#e8553f" />
		<circle cx={-28} cy={-20} r={5} fill="#fff3c0" />
		<circle cx={-6} cy={-18} r={5} fill="#fff3c0" />
		<rect x={30} y={-34} width={28} height={28} rx={4} fill="#fff" {...o} />
		<rect x={30} y={-34} width={28} height={9} fill="#6fd0ff" />
	</g>
);
const Pizza: PR = () => (
	<g>
		<path d="M-38,0 L38,0 L0,-100 Z" transform="scale(.5)" fill="#f1c14a" {...o} strokeWidth={5} />
		<circle cx={-6} cy={-26} r={7} fill="#d94a3a" />
		<circle cx={8} cy={-14} r={6} fill="#d94a3a" />
	</g>
);
const Book: PR = ({a}) => (
	<g>
		<rect x={-32} y={-14} width={64} height={14} rx={3} fill={a?.c ?? '#4a7fd6'} {...o} />
		<rect x={-28} y={-12} width={52} height={5} fill="#fff" opacity={0.55} />
	</g>
);
const Books: PR = ({a}) => (
	<g>
		{Array.from({length: a?.n ?? 6}).map((_, i) => (
			<g key={i} transform={`translate(${(i % 2) * 5 - 2},${-i * 15}) rotate(${(i % 3) - 1})`}>
				<rect x={-38} y={-15} width={76} height={15} rx={3} fill={['#d9534f', '#4a7fd6', '#f0b54a', '#4a9d6e', '#8e5bc4', '#e68a4a'][i % 6]} {...o} />
				<rect x={-34} y={-12} width={60} height={4} fill="#fff" opacity={0.5} />
			</g>
		))}
	</g>
);
const Stamp: PR = () => (
	<g>
		<rect x={-14} y={-60} width={28} height={36} rx={6} fill="#8a5a38" {...o} />
		<rect x={-26} y={-24} width={52} height={16} rx={4} fill="#c0392b" {...o} />
	</g>
);
const Balloons: PR = ({f, a}) => (
	<g>
		{Array.from({length: a?.n ?? 7}).map((_, i) => {
			const x = (i - 3) * 38 + Math.sin(f / 26 + i * 1.7) * 6;
			const y = -150 - (i % 3) * 52 - 12 * Math.sin(f / 22 + i);
			const c = ['#ff5a7a', '#ffd23a', '#4aa8ff', '#6fd05a', '#c77dff', '#ff9a3c', '#3fd0c9'][i % 7];
			return (
				<g key={i}>
					<path d={`M${x},${y + 36} Q${x + 6 * Math.sin(f / 20 + i)},${y + 80} 0,0`} fill="none" stroke={INK} strokeWidth={2} />
					<ellipse cx={x} cy={y} rx={32} ry={40} fill={c} {...o} />
					<ellipse cx={x - 10} cy={y - 14} rx={8} ry={12} fill="#fff" opacity={0.5} />
					<polygon points={`${x - 5},${y + 40} ${x + 5},${y + 40} ${x},${y + 32}`} fill={c} {...o} strokeWidth={2} />
				</g>
			);
		})}
	</g>
);
const Cake: PR = ({f}) => (
	<g>
		<rect x={-70} y={-58} width={140} height={58} rx={10} fill="#f6d9a8" {...o} />
		<g transform="rotate(-5 0 -58)">
			<rect x={-54} y={-110} width={108} height={52} rx={10} fill="#ff9ab0" {...o} />
			<g transform="rotate(-6 0 -110)">
				<rect x={-38} y={-156} width={76} height={46} rx={9} fill="#fff1f4" {...o} />
				<rect x={-3} y={-186} width={6} height={30} fill="#6fd0ff" {...o} strokeWidth={2.4} />
				<ellipse cx={0} cy={-196 - Math.sin(f / 3) * 1.5} rx={5} ry={10} fill="#ffb02e" />
			</g>
		</g>
		<path d="M-70,-40 q35,16 70,0 q35,16 70,0" fill="none" stroke="#fff" strokeWidth={6} opacity={0.85} />
	</g>
);
const Crown: PR = () => (
	<g>
		<polygon points="-26,0 -26,-30 -13,-14 0,-36 13,-14 26,-30 26,0" fill="#ffd23a" {...o} />
		<circle cx={0} cy={-36} r={4} fill="#e8553f" />
	</g>
);
const Dog: PR = ({f, a}) => (
	<g>
		<ellipse cx={0} cy={-6} rx={72} ry={9} fill="#000" opacity={0.18} />
		<path d={`M-52,-30 q-26,${-24 + Math.sin(f / 4) * 10} -12,-52`} fill="none" stroke="#c98a52" strokeWidth={14} strokeLinecap="round" />
		<rect x={-58} y={-92} width={104} height={70} rx={34} fill="#d99a60" {...o} />
		<rect x={-26} y={-30} width={22} height={32} rx={8} fill="#c98a52" {...o} />
		<rect x={18} y={-30} width={22} height={32} rx={8} fill="#c98a52" {...o} />
		<circle cx={44} cy={-112} r={34} fill="#d99a60" {...o} />
		<ellipse cx={62} cy={-100} rx={22} ry={16} fill="#f1d3a8" {...o} />
		<ellipse cx={72} cy={-106} rx={6} ry={5} fill={INK} />
		<ellipse cx={30} cy={-146} rx={12} ry={26} fill="#a96a3a" {...o} transform="rotate(-18 30 -146)" />
		<circle cx={46} cy={-122} r={5} fill={INK} />
		<path d="M56,-90 q6,12 14,2" fill="none" stroke={INK} strokeWidth={3} />
		{a?.crown ? (
			<g transform="translate(44,-146) rotate(8) scale(0.9)">
				<Crown f={f} gf={0} />
			</g>
		) : null}
	</g>
);
const Keys: PR = () => (
	<g>
		<circle cx={0} cy={0} r={14} fill="none" stroke="#c9ccd2" strokeWidth={6} />
		<rect x={-8} y={10} width={16} height={34} rx={4} fill="#e3c06a" {...o} strokeWidth={2.6} />
		<rect x={8} y={14} width={12} height={28} rx={4} fill="#c9ccd2" {...o} strokeWidth={2.6} />
	</g>
);
const Cup: PR = ({f, a}) => (
	<g>
		<path d="M-18,-44 L18,-44 L13,0 L-13,0 Z" fill={a?.c ?? '#f4f1e8'} {...o} />
		<rect x={-18} y={-30} width={36} height={14} fill="#c0794a" />
		{Array.from({length: 3}).map((_, i) => (
			<path key={i} d={`M${-8 + i * 8},${-50 - ((f * 0.7 + i * 14) % 36)} q6,-8 0,-14`} fill="none" stroke="#fff" strokeWidth={3} opacity={0.6 - ((f * 0.7 + i * 14) % 36) / 70} />
		))}
	</g>
);
const Guitar: PR = ({f}) => (
	<g>
		<g transform="rotate(-62)">
			<rect x={-8} y={-210} width={16} height={130} rx={4} fill="#6a4228" {...o} />
			<rect x={-14} y={-232} width={28} height={30} rx={6} fill="#4a2c1a" {...o} />
			<path d="M-46,-84 q-18,36 -6,60 q-28,14 -22,56 q10,34 74,34 q64,0 74,-34 q6,-42 -22,-56 q12,-24 -6,-60 q-40,-20 -92,0 Z" transform="translate(0,-4) scale(.9)" fill="#d9884a" {...o} />
			<circle cx={0} cy={-20} r={22} fill="#2a1c14" {...o} />
			{[-3, -1, 1, 3].map((k) => (
				<line key={k} x1={k * 2} y1={-206} x2={k * 2} y2={-30} stroke="#f4f1e8" strokeWidth={1.6} opacity={0.9} />
			))}
		</g>
	</g>
);
const Metronome: PR = ({f}) => (
	<g>
		<path d="M-36,0 L-20,-110 L20,-110 L36,0 Z" fill="#8a5a38" {...o} />
		<g transform={`rotate(${Math.sin(f / 4.5) * 24} 0 -14)`}>
			<line x1={0} y1={-14} x2={0} y2={-104} stroke="#f4f1e8" strokeWidth={5} strokeLinecap="round" />
			<rect x={-9} y={-82} width={18} height={14} rx={3} fill="#ffd23a" {...o} strokeWidth={2.4} />
		</g>
	</g>
);
const Phone: PR = ({f, a}) => (
	<g>
		<rect x={-44} y={-160} width={88} height={160} rx={14} fill="#1d2630" {...o} />
		<rect x={-38} y={-150} width={76} height={134} rx={6} fill={a?.c ?? '#2f3f66'} />
		<polygon points="-8,-104 -8,-76 18,-90" fill="#fff" />
		<text x={0} y={-46} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={a?.fs ?? 16} fill="#ffd23a">
			{a?.text ?? '14M'}
		</text>
		<path d={`M0,-30 q-9,-12 -2,-18 q4,-4 2,2 q-2,-6 4,-2 q7,6 -4,18 Z`} fill="#ff5a7a" transform={`translate(0,${-Math.min(30, f * 0.5)}) scale(${1 + 0.1 * Math.sin(f / 4)})`} opacity={0} />
	</g>
);
const Envelope: PR = ({f}) => (
	<g>
		<rect x={-50} y={-70} width={100} height={70} rx={6} fill="#fff6d8" {...o} />
		<polyline points="-50,-70 0,-30 50,-70" fill="none" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
		<circle cx={0} cy={-30} r={9} fill="#e8553f" {...o} strokeWidth={2.4} />
	</g>
);
const Xray: PR = ({f}) => (
	<g>
		<rect x={-130} y={-190} width={260} height={190} rx={8} fill="#0f2a3a" {...o} />
		{[0, 1, 2, 3, 4].map((i) => (
			<g key={i}>
				<rect x={-76 + i * 32} y={-150 + Math.abs(i - 2) * 12} width={14} height={90 - Math.abs(i - 2) * 12} rx={6} fill="#bfe8ff" />
				<ellipse cx={-69 + i * 32} cy={-108 + Math.abs(i - 2) * 12} rx={9} ry={4} fill="#ffe27a" opacity={0.85 + 0.15 * Math.sin(f / 6 + i)} />
			</g>
		))}
		<rect x={-60} y={-62} width={120} height={46} rx={14} fill="#bfe8ff" opacity={0.7} />
	</g>
);
const Slab: PR = ({a}) => (
	<g transform={`rotate(${a?.tilt ?? -4})`}>
		<polygon points="-330,-46 330,-60 350,0 -350,0" fill="#a5abb3" {...o} />
		<polygon points="-330,-46 330,-60 332,-50 -330,-36" fill="#fff" opacity={0.25} />
		{[-260, -120, 40, 190, 300].map((x, i) => (
			<line key={i} x1={x} y1={-4} x2={x + 16} y2={22 + (i % 2) * 14} stroke={INK} strokeWidth={4} />
		))}
		<path d="M-120,-30 l14,-20 l10,16 M180,-24 l12,-18" stroke={INK} strokeWidth={2.4} fill="none" />
	</g>
);
const Crib: PR = ({a, f}) => {
	const n = Math.max(0, Math.min(a?.n ?? 6, Math.floor(f / (a?.rate ?? 5)) + 1));
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const lay = Math.floor(i / 2);
				const horiz = lay % 2 === 0;
				const k = i % 2;
				return horiz ? <rect key={i} x={-70} y={-(lay + 1) * 22 + 0} width={140} height={20} rx={3} fill={['#d9a066', '#c58a52'][(i + lay) % 2]} {...o} strokeWidth={2.6} transform={`translate(${k * 0},${0})`} /> : <rect key={i} x={-70 + k * 116} y={-(lay + 1) * 22} width={24} height={20} rx={3} fill="#b57a42" {...o} strokeWidth={2.6} />;
			})}
		</g>
	);
};
const Plank: PR = () => (
	<g>
		<rect x={-90} y={-12} width={180} height={22} rx={3} fill="#d9a066" {...o} />
		<line x1={-70} y1={-4} x2={-30} y2={-4} stroke="#a46f3c" strokeWidth={2} />
		<line x1={10} y1={4} x2={64} y2={4} stroke="#a46f3c" strokeWidth={2} />
	</g>
);
const Dust: PR = ({f, a}) => (
	<g style={{filter: 'blur(9px)'}} opacity={Math.max(0.0, 0.8 - f / 220)}>
		{Array.from({length: 10}).map((_, i) => (
			<ellipse key={i} cx={(i - 4.5) * 90 + Math.sin(f / 18 + i) * 20} cy={-60 - Math.abs(Math.sin(i)) * 80 - f * 0.5 * (0.4 + (i % 3) * 0.3)} rx={110} ry={80} fill={a?.c ?? '#c8b69a'} />
		))}
	</g>
);
const Bill: PR = () => (
	<g>
		<rect x={-46} y={-30} width={92} height={50} rx={5} fill="#8fcf8a" {...o} />
		<circle cx={0} cy={-5} r={16} fill="#e6f7d8" {...o} strokeWidth={2.4} />
		<text x={0} y={2} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={20} fill={INK}>
			5
		</text>
	</g>
);
const Watch: PR = () => (
	<g>
		<rect x={-14} y={-52} width={28} height={30} fill="#6a4a38" {...o} />
		<rect x={-14} y={0} width={28} height={30} fill="#6a4a38" {...o} />
		<circle cx={0} cy={-11} r={26} fill="#f6f1de" {...o} transform="translate(0,-10)" />
		<circle cx={0} cy={-21} r={3} fill={INK} />
	</g>
);
const Card: PR = ({a}) => (
	<g>
		<rect x={-80} y={-100} width={160} height={100} rx={8} fill="#fff6d8" {...o} />
		<text x={0} y={-62} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={22} fill={INK}>
			FIVE
		</text>
		<text x={0} y={-38} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={22} fill={INK}>
			MORE
		</text>
		<text x={0} y={-14} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={22} fill="#e8553f">
			MINUTES
		</text>
	</g>
);
const Zzz: PR = ({f}) => (
	<g>
		{[0, 1, 2].map((i) => (
			<text key={i} x={i * 22} y={-i * 30 - ((f * 0.5 + i * 12) % 24)} fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={26 + i * 8} fill="#bfd8ff" stroke={INK} strokeWidth={1.2} opacity={0.9}>
				Z
			</text>
		))}
	</g>
);
const Think: PR = ({a}) => (
	<g>
		<circle cx={-24} cy={0} r={6} fill="#fff" {...o} strokeWidth={2.4} />
		<circle cx={-8} cy={-22} r={10} fill="#fff" {...o} strokeWidth={2.4} />
		<ellipse cx={30} cy={-90} rx={96} ry={62} fill="#fff" {...o} />
		<text x={30} y={-78} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={a?.fs ?? 54} fill={INK}>
			{a?.text ?? '?'}
		</text>
	</g>
);
const Chair: PR = () => (
	<g>
		<rect x={-34} y={-50} width={68} height={10} rx={4} fill="#6b7077" {...o} />
		<rect x={-34} y={-100} width={10} height={54} fill="#6b7077" {...o} />
		<line x1={-30} y1={-40} x2={-40} y2={0} stroke={INK} strokeWidth={5} />
		<line x1={30} y1={-40} x2={40} y2={0} stroke={INK} strokeWidth={5} />
	</g>
);
const Sandwich: PR = () => (
	<g>
		<path d="M-28,0 L28,0 L28,-10 L-28,-10 Z" fill="#e8c27a" {...o} />
		<rect x={-28} y={-18} width={56} height={8} fill="#6fbf5a" {...o} strokeWidth={2.4} />
		<rect x={-28} y={-26} width={56} height={8} fill="#e86a5a" {...o} strokeWidth={2.4} />
		<path d="M-28,-26 q28,-24 56,0 Z" fill="#e8c27a" {...o} />
	</g>
);
const Pen: PR = () => (
	<g>
		<rect x={-30} y={-5} width={60} height={10} rx={4} fill="#4a7fd6" {...o} strokeWidth={2.6} />
		<polygon points="30,-5 44,0 30,5" fill="#f4f1e8" {...o} strokeWidth={2.4} />
	</g>
);
const Beanbag: PR = () => (
	<g>
		<path d="M-110,0 Q-120,-80 -50,-100 Q0,-120 60,-96 Q124,-70 112,0 Z" fill="#e8884a" {...o} />
		<path d="M-60,-60 q50,-20 120,0" fill="none" stroke="#fff" strokeWidth={5} opacity={0.4} />
	</g>
);
const Sign: PR = ({a}) => (
	<g>
		<rect x={-6} y={-70} width={12} height={70} fill="#6b7077" {...o} />
		<rect x={-100} y={-170} width={200} height={100} rx={10} fill={a?.c ?? '#ffd23a'} {...o} />
		<text x={0} y={-108} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={a?.fs ?? 34} fill={INK}>
			{a?.text ?? ''}
		</text>
	</g>
);
const Num: PR = ({f, a}) => {
	const k = Math.min(1, f / 8);
	return (
		<g transform={`scale(${0.7 + 0.3 * k})`} opacity={Math.min(1, f / 4)}>
			<text x={0} y={0} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={900} fontSize={a?.fs ?? 120} fill={a?.c ?? '#ffd23a'} stroke={INK} strokeWidth={a?.sw ?? 8} paintOrder="stroke" strokeLinejoin="round">
				{a?.text}
			</text>
		</g>
	);
};
const Rod: PR = () => (
	<g>
		<rect x={-4} y={-120} width={8} height={120} fill="#7a4a3a" {...o} strokeWidth={2.4} />
	</g>
);
const Mirror: PR = ({a}) => (
	<g>
		<rect x={-80} y={-250} width={160} height={250} rx={18} fill="#c9e3ee" {...o} />
		<rect x={-64} y={-234} width={128} height={218} rx={10} fill="#e8f6fb" opacity={0.8} />
		<path d="M-50,-200 l60,60" stroke="#fff" strokeWidth={8} opacity={0.6} />
	</g>
);
const Bed: PR = ({a}) => (
	<g>
		<rect x={-200} y={-90} width={400} height={44} rx={10} fill="#6f7bd6" {...o} />
		<rect x={-200} y={-52} width={400} height={42} rx={8} fill="#f4f1e8" {...o} />
		<rect x={-210} y={-130} width={22} height={130} rx={6} fill="#6a4228" {...o} />
		<rect x={188} y={-100} width={22} height={100} rx={6} fill="#6a4228" {...o} />
		<rect x={-186} y={-112} width={90} height={26} rx={12} fill="#fff" {...o} />
	</g>
);
const Heart: PR = ({f}) => (
	<g transform={`scale(${1 + 0.1 * Math.sin(f / 4)})`}>
		<path d="M0,0 C-30,-24 -40,-50 -20,-58 C-8,-62 0,-52 0,-46 C0,-52 8,-62 20,-58 C40,-50 30,-24 0,0 Z" fill="#ff5a7a" {...o} />
	</g>
);
const Cal: PR = ({f, a}) => {
	const day = a?.day ?? Math.floor(f / (a?.rate ?? 3)) + 1;
	return (
		<g>
			<rect x={-70} y={-130} width={140} height={130} rx={10} fill="#fffaf0" {...o} />
			<rect x={-70} y={-130} width={140} height={34} rx={10} fill="#e8553f" {...o} />
			<text x={0} y={-24} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={900} fontSize={68} fill={INK}>
				{day}
			</text>
			<text x={0} y={-104} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={20} fill="#fff">
				{a?.label ?? 'DAY'}
			</text>
		</g>
	);
};
const Hourglass: PR = ({f}) => (
	<g>
		<rect x={-40} y={-120} width={80} height={10} rx={4} fill="#8a5a38" {...o} />
		<rect x={-40} y={-10} width={80} height={10} rx={4} fill="#8a5a38" {...o} />
		<path d="M-34,-110 L34,-110 L4,-60 L34,-10 L-34,-10 L-4,-60 Z" fill="#bfe8ff" {...o} opacity={0.9} />
		<path d="M-24,-30 L24,-30 L8,-14 L-8,-14 Z" fill="#ffd23a" />
	</g>
);
const Laugh: PR = ({f}) => (
	<g>
		{[0, 1, 2].map((i) => (
			<text key={i} x={i * 30 - 30} y={-((f * 0.8 + i * 14) % 40)} fontFamily="'Rubik',sans-serif" fontWeight={900} fontSize={34} fill="#ffd23a" stroke={INK} strokeWidth={2.4} paintOrder="stroke" opacity={1 - ((f * 0.8 + i * 14) % 40) / 50}>
				HA
			</text>
		))}
	</g>
);
const Waves: PR = ({f, a}) => (
	<g>
		{[0, 1, 2].map((i) => (
			<path key={i} d={`M${-60 - i * 18},${-40 + i * 6} q${20 + i * 8},${-34 - i * 6} 0,${-68 + i * 4}`} fill="none" stroke={a?.c ?? '#fff'} strokeWidth={5} strokeLinecap="round" opacity={0.85 - i * 0.2 + 0.15 * Math.sin(f / 5 + i)} />
		))}
	</g>
);
const Sign2: PR = ({a}) => (
	<g>
		<rect x={-130} y={-60} width={260} height={60} rx={10} fill={a?.c ?? '#fff6d8'} {...o} />
		<text x={0} y={-20} textAnchor="middle" fontFamily="'Caveat',cursive" fontWeight={700} fontSize={a?.fs ?? 44} fill={INK}>
			{a?.text}
		</text>
	</g>
);
const Door: PR = ({a}) => (
	<g>
		<rect x={-110} y={-470} width={220} height={470} rx={6} fill="#8c6347" {...o} />
		<rect x={-84} y={-440} width={168} height={180} rx={4} fill="#6a4a38" opacity={0.5} />
		<circle cx={78} cy={-230} r={10} fill="#e3c06a" {...o} />
	</g>
);
const Soda: PR = () => (
	<g>
		<rect x={-14} y={-48} width={28} height={48} rx={8} fill="#ff7a3c" {...o} />
		<rect x={-8} y={-58} width={16} height={12} fill="#c9ccd2" {...o} strokeWidth={2.4} />
	</g>
);
const Warn: PR = ({f}) => (
	<g transform={`scale(${1 + 0.06 * Math.sin(f / 4)})`}>
		<polygon points="0,-90 80,0 -80,0" fill="#ffd23a" {...o} />
		<rect x={-5} y={-62} width={10} height={36} rx={4} fill={INK} />
		<circle cx={0} cy={-14} r={6} fill={INK} />
	</g>
);
const Helmet: PR = () => (
	<g>
		<path d="M-34,0 q0,-48 34,-48 q34,0 34,48 Z" fill="#ffd23a" {...o} />
		<rect x={-42} y={-6} width={84} height={10} rx={4} fill="#e6b010" {...o} strokeWidth={2.6} />
	</g>
);
const Cone: PR = () => (
	<g>
		<polygon points="-26,0 26,0 12,-80 -12,-80" fill="#f08a3c" {...o} />
		<rect x={-17} y={-48} width={34} height={12} fill="#fff" />
	</g>
);
const Beam: PR = ({a}) => (
	<g>
		<rect x={-170} y={-24} width={340} height={26} fill="#8a8f97" {...o} />
		<rect x={-170} y={-24} width={340} height={8} fill="#fff" opacity={0.3} />
	</g>
);
const Trash: PR = () => (
	<g>
		<path d="M-26,0 L-20,-60 L20,-60 L26,0 Z" fill="#7c8d94" {...o} />
	</g>
);
const Bubble: PR = ({f, a}) => (
	<g transform={`scale(${Math.min(1, f / 8)})`}>
		<ellipse cx={0} cy={-60} rx={a?.w ?? 120} ry={a?.h ?? 58} fill="#fff" {...o} />
		<polygon points="-18,-8 14,-8 -2,14" fill="#fff" {...o} />
		<text x={0} y={-48 + (a?.dy ?? 0)} textAnchor="middle" fontFamily="'Rubik',sans-serif" fontWeight={800} fontSize={a?.fs ?? 40} fill={INK}>
			{a?.text}
		</text>
	</g>
);
const Truck: PR = () => (
	<g>
		<rect x={-260} y={-150} width={330} height={96} rx={10} fill="#4a7fd6" {...o} />
		<rect x={-260} y={-62} width={330} height={20} fill="#2c4a8a" {...o} />
		<rect x={70} y={-120} width={16} height={70} fill="#2c4a8a" {...o} />
		<circle cx={-140} cy={-34} r={50} fill="#1d1d28" {...o} />
		<circle cx={-140} cy={-34} r={22} fill="#c9ccd2" {...o} />
		<rect x={-300} y={-60} width={60} height={14} fill="#c9ccd2" {...o} />
	</g>
);
const Bike: PR = () => <g />;

export const PROPS: Record<string, PR> = {
	marker: Marker,
	plane: Plane,
	star: Star,
	stickers: Stickers,
	sneeze: Sneeze,
	tray: Tray,
	pizza: Pizza,
	book: Book,
	books: Books,
	stamp: Stamp,
	balloons: Balloons,
	cake: Cake,
	crown: Crown,
	dog: Dog,
	keys: Keys,
	cup: Cup,
	guitar: Guitar,
	metronome: Metronome,
	phone: Phone,
	envelope: Envelope,
	xray: Xray,
	slab: Slab,
	crib: Crib,
	plank: Plank,
	dust: Dust,
	bill: Bill,
	watch: Watch,
	card: Card,
	zzz: Zzz,
	think: Think,
	chair: Chair,
	sandwich: Sandwich,
	pen: Pen,
	beanbag: Beanbag,
	sign: Sign,
	num: Num,
	rod: Rod,
	mirror: Mirror,
	bed: Bed,
	heart: Heart,
	cal: Cal,
	hourglass: Hourglass,
	laugh: Laugh,
	waves: Waves,
	note: Sign2,
	door: Door,
	soda: Soda,
	warn: Warn,
	helmet: Helmet,
	cone: Cone,
	beam: Beam,
	trash: Trash,
	bubble: Bubble,
	bike: Bike,
	truck: Truck,
};
