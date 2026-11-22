import React from 'react';

const INK = '#1d1626';
const S = {stroke: INK, strokeWidth: 3.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

export type PropKind =
	| 'steak' | 'napkin' | 'cushion' | 'plate' | 'phone' | 'vase' | 'magazine' | 'jar' | 'cage' | 'flyer' | 'note' | 'bowl' | 'alarm' | 'meter' | 'hive' | 'bone' | 'leash'
	| 'ball' | 'envelope' | 'coat' | 'twigs' | 'bed' | 'pillow' | 'mic' | 'camera' | 'lock' | 'flower' | 'sign' | 'bike' | 'frame' | 'mug' | 'scale' | 'bandage' | 'thorn' | 'heart' | 'lamp';

/* origin = bottom centre of the object, drawn at scale 1 (size ~ real-world proportion vs a 420 px person) */
export const Prop: React.FC<{k: PropKind; x: number; y: number; s?: number; rot?: number; t?: number; c?: string; text?: string}> = ({k, x, y, s = 1, rot = 0, t = 0, c, text}) => {
	let g: React.ReactNode = null;
	switch (k) {
		case 'steak':
			g = (
				<g>
					<path d="M-44,-30 Q-50,-58 -14,-62 Q30,-70 46,-40 Q56,-12 18,-6 Q-20,0 -44,-30 Z" fill="#b3452e" {...S} />
					<path d="M-30,-30 Q-26,-48 -4,-50 Q24,-54 32,-36 Q40,-18 12,-16 Q-18,-14 -30,-30 Z" fill="#d46a4a" />
					<ellipse cx={18} cy={-38} rx={9} ry={7} fill="#f6e0c8" {...S} strokeWidth={2.4} />
					<path d="M-34,-26 q14,6 28,-2 M-26,-44 q16,-6 30,-2" stroke="#7a2a1a" strokeWidth={4} fill="none" />
				</g>
			);
			break;
		case 'napkin':
			g = (
				<g>
					<path d="M-52,-24 Q-60,-66 -10,-70 Q46,-74 56,-34 Q60,-4 -4,-2 Q-44,0 -52,-24 Z" fill="#f4efe4" {...S} />
					<path d="M-44,-30 Q-30,-52 -4,-54 M0,-10 q18,-6 36,-4" stroke="#c5bba6" strokeWidth={3} fill="none" />
					<path d="M20,-62 q14,-30 30,-18 q-6,16 -22,26" fill="#f4efe4" {...S} strokeWidth={2.6} />
					<path d="M-12,-40 q8,-8 16,0" stroke="#b3452e" strokeWidth={6} opacity={0.55} fill="none" />
				</g>
			);
			break;
		case 'cushion':
			g = (
				<g>
					<path d="M-92,-14 Q-100,-60 -88,-84 Q0,-100 88,-84 Q100,-56 92,-14 Q0,6 -92,-14 Z" fill={c ?? '#3a7bf0'} {...S} />
					<path d="M-70,-60 Q0,-76 70,-62" stroke="#fff" strokeWidth={5} opacity={0.35} fill="none" />
					<circle cx={0} cy={-46} r={7} fill="#1f56c0" {...S} strokeWidth={2.4} />
					<path d="M-92,-14 L-100,-6 M92,-14 L100,-6 M-88,-84 L-96,-92 M88,-84 L96,-92" stroke={'#ffd84a'} strokeWidth={5} />
				</g>
			);
			break;
		case 'plate':
			g = (
				<g>
					<ellipse cx={0} cy={-8} rx={48} ry={12} fill="#fff" {...S} />
					<ellipse cx={0} cy={-10} rx={32} ry={7} fill="#e8e4d8" />
					<ellipse cx={-8} cy={-16} rx={16} ry={7} fill="#c9573a" {...S} strokeWidth={2.4} />
				</g>
			);
			break;
		case 'phone':
			g = (
				<g>
					<rect x={-26} y={-92} width={52} height={92} rx={10} fill="#1d2030" {...S} />
					<rect x={-20} y={-84} width={40} height={72} rx={4} fill={c ?? '#4aa8ff'} />
					<circle cx={0} cy={-6} r={3} fill="#555" />
				</g>
			);
			break;
		case 'vase':
			g = (
				<g>
					<path d="M-24,0 Q-40,-36 -18,-62 L-14,-90 H14 L18,-62 Q40,-36 24,0 Z" fill={c ?? '#3a9ad8'} {...S} />
					<path d="M-26,-30 Q0,-20 26,-30" stroke="#fff" strokeWidth={4} opacity={0.4} fill="none" />
					<path d="M0,-90 q-16,-26 -30,-40 M0,-90 q6,-34 14,-52 M0,-90 q26,-20 34,-42" stroke="#3a9a5a" strokeWidth={5} fill="none" />
					<circle cx={-30} cy={-140} r={10} fill="#ff6a8a" {...S} strokeWidth={2.4} />
				</g>
			);
			break;
		case 'magazine':
			g = (
				<g>
					<rect x={-48} y={-66} width={96} height={66} rx={4} fill="#ff7a9a" {...S} transform="rotate(-6)" />
					<rect x={-38} y={-58} width={76} height={20} fill="#fff" opacity={0.8} transform="rotate(-6)" />
					<circle cx={0} cy={-18} r={12} fill="#ffe0b0" transform="rotate(-6)" />
				</g>
			);
			break;
		case 'jar':
			g = (
				<g>
					<rect x={-26} y={-76} width={52} height={74} rx={14} fill="#ffb92e" {...S} />
					<rect x={-30} y={-94} width={60} height={20} rx={6} fill="#a8651c" {...S} />
					<rect x={-18} y={-58} width={36} height={32} rx={4} fill="#fff6d8" />
					<path d="M-14,-46 h28" stroke="#c9573a" strokeWidth={4} />
					<path d="M-18,-70 q6,-8 12,0" stroke="#fff" strokeWidth={3} opacity={0.6} fill="none" />
				</g>
			);
			break;
		case 'cage':
			g = (
				<g>
					<path d="M-34,0 H34 L40,-86 Q0,-124 -40,-86 Z" fill="none" stroke="#8a6a3a" strokeWidth={4} />
					{[-24, -12, 0, 12, 24].map((q) => <path key={q} d={`M${q},-2 L${q * 1.18},-98`} stroke="#8a6a3a" strokeWidth={3} />)}
					<rect x={-38} y={-8} width={76} height={12} rx={4} fill="#8a6a3a" {...S} strokeWidth={2.6} />
					<path d="M0,-124 v-22 q0,-14 14,-10" stroke="#8a6a3a" strokeWidth={5} fill="none" />
					<path d="M-30,-40 H30" stroke="#6a4a24" strokeWidth={5} />
				</g>
			);
			break;
		case 'flyer':
			g = (
				<g transform="rotate(-3)">
					<rect x={-50} y={-130} width={100} height={130} rx={4} fill="#fff8e0" {...S} />
					<rect x={-38} y={-118} width={76} height={50} fill="#4a8ad8" />
					<circle cx={0} cy={-94} r={16} fill="#ffe0b0" />
					<path d="M-38,-56 h76 M-38,-44 h60 M-38,-32 h70" stroke="#8a8a96" strokeWidth={5} />
					<text x={0} y={-12} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={16} fill="#c63a2a">{text ?? 'PET TALKER'}</text>
				</g>
			);
			break;
		case 'note':
			g = (
				<g transform="rotate(-4)">
					<rect x={-70} y={-96} width={140} height={96} rx={4} fill="#fff59a" {...S} />
					<text x={0} y={-48} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={34} fill="#3a2a1a">{text ?? "Don't ask the kid!"}</text>
					<circle cx={0} cy={-96} r={7} fill="#e03a3a" {...S} strokeWidth={2.4} />
				</g>
			);
			break;
		case 'bowl':
			g = (
				<g>
					<path d="M-46,-34 H46 Q40,0 0,0 Q-40,0 -46,-34 Z" fill={c ?? '#d84a4a'} {...S} />
					<ellipse cx={0} cy={-34} rx={46} ry={10} fill="#8a3030" {...S} strokeWidth={2.6} />
					{[-20, 0, 20].map((q) => <circle key={q} cx={q} cy={-38} r={6} fill="#a8652a" />)}
				</g>
			);
			break;
		case 'alarm':
			g = (
				<g>
					<rect x={-34} y={-110} width={68} height={110} rx={8} fill="#d63030" {...S} />
					<rect x={-24} y={-98} width={48} height={50} rx={4} fill="#f2f2f2" {...S} strokeWidth={2.6} />
					<text x={0} y={-66} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={16} fill="#d63030">PULL</text>
					<rect x={-10} y={-40} width={20} height={26} rx={4} fill="#fff" {...S} strokeWidth={2.6} />
				</g>
			);
			break;
		case 'meter':
			g = (
				<g>
					<rect x={-40} y={-70} width={80} height={70} rx={10} fill="#2b2f3a" {...S} />
					<rect x={-30} y={-60} width={60} height={26} rx={4} fill="#1d3a2a" />
					<text x={0} y={-40} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={18} fill="#6aff8a">{text ?? '640'}</text>
					<circle cx={-16} cy={-14} r={7} fill="#ff4a4a" /><circle cx={12} cy={-14} r={7} fill="#6aff8a" />
					<path d="M0,-70 q-20,-30 -40,-30" stroke={INK} strokeWidth={5} fill="none" />
				</g>
			);
			break;
		case 'hive':
			g = (
				<g>
					<rect x={-70} y={-130} width={140} height={34} rx={6} fill="#f2c24a" {...S} />
					<rect x={-70} y={-98} width={140} height={34} rx={6} fill="#e8b238" {...S} />
					<rect x={-70} y={-66} width={140} height={34} rx={6} fill="#f2c24a" {...S} />
					<rect x={-76} y={-146} width={152} height={18} rx={6} fill="#8a5a30" {...S} />
					<rect x={-30} y={-34} width={60} height={14} rx={4} fill="#5a3a1c" />
					<rect x={-60} y={-32} width={10} height={32} fill="#6a4a30" /><rect x={50} y={-32} width={10} height={32} fill="#6a4a30" />
				</g>
			);
			break;
		case 'bone':
			g = (
				<g transform="rotate(-20)">
					<rect x={-30} y={-12} width={60} height={14} rx={6} fill="#fff" {...S} />
					{[-30, 30].map((q) => (
						<g key={q}><circle cx={q} cy={-14} r={10} fill="#fff" {...S} /><circle cx={q} cy={4} r={10} fill="#fff" {...S} /></g>
					))}
				</g>
			);
			break;
		case 'leash':
			g = (
				<g>
					<path d="M-60,-60 Q-20,10 30,-30 Q60,-60 90,-10" stroke="#e0b030" strokeWidth={8} fill="none" strokeLinecap="round" />
					<path d="M-60,-60 Q-20,10 30,-30 Q60,-60 90,-10" stroke={INK} strokeWidth={2} fill="none" opacity={0.4} />
					<circle cx={-62} cy={-62} r={11} fill="none" stroke="#e0b030" strokeWidth={6} />
					<path d="M82,-24 l24,-10" stroke="#e03a3a" strokeWidth={10} strokeLinecap="round" />
				</g>
			);
			break;
		case 'ball':
			g = (
				<g>
					<circle cx={0} cy={-22} r={22} fill="#e0402a" {...S} />
					<path d="M-18,-30 q18,16 36,0" stroke="#fff" strokeWidth={5} fill="none" opacity={0.8} />
					<circle cx={-8} cy={-32} r={5} fill="#fff" opacity={0.5} />
				</g>
			);
			break;
		case 'envelope':
			g = (
				<g>
					<rect x={-46} y={-62} width={92} height={62} rx={4} fill="#fff" {...S} />
					<path d="M-46,-62 L0,-26 L46,-62" fill="none" {...S} />
					<circle cx={28} cy={-18} r={9} fill="#d63030" opacity={0.9} />
				</g>
			);
			break;
		case 'twigs':
			g = (
				<g>
					<ellipse cx={0} cy={-18} rx={64} ry={22} fill="#8a6a3a" {...S} />
					{[-40, -20, 0, 22, 42].map((q, i) => <path key={i} d={`M${q},-20 l${(i % 2 ? 1 : -1) * 28},${-26 - (i % 3) * 8}`} stroke="#6a4a2a" strokeWidth={6} strokeLinecap="round" />)}
					<ellipse cx={0} cy={-30} rx={32} ry={10} fill="#a8865a" />
				</g>
			);
			break;
		case 'pillow':
			g = (
				<g>
					<rect x={-70} y={-60} width={140} height={60} rx={26} fill="#f4f4fa" {...S} />
					<path d="M-50,-30 h100" stroke="#c9cbe0" strokeWidth={4} />
				</g>
			);
			break;
		case 'mic':
			g = (
				<g>
					<rect x={-4} y={-70} width={8} height={70} fill="#2b2a36" />
					<circle cx={0} cy={-90} r={20} fill="#c63a2a" {...S} /><path d="M-14,-96 h28 M-16,-88 h32 M-14,-80 h28" stroke="#fff" strokeWidth={2} opacity={0.6} />
					<rect x={-24} y={-62} width={48} height={20} rx={4} fill="#fff" {...S} strokeWidth={2.4} />
				</g>
			);
			break;
		case 'camera':
			g = (
				<g>
					<rect x={-50} y={-120} width={100} height={64} rx={10} fill="#2b2f3a" {...S} />
					<circle cx={30} cy={-88} r={26} fill="#4a5468" {...S} /><circle cx={30} cy={-88} r={12} fill="#7ac0ff" />
					<rect x={-40} y={-132} width={30} height={14} rx={4} fill="#c63a2a" {...S} strokeWidth={2.4} />
					<path d="M-20,-56 L-34,0 M20,-56 L34,0 M0,-56 V0" stroke={INK} strokeWidth={6} />
				</g>
			);
			break;
		case 'lock':
			g = (
				<g>
					<path d="M-18,-66 V-84 Q0,-112 18,-84 V-66" fill="none" stroke="#9aa0b0" strokeWidth={9} />
					<rect x={-28} y={-68} width={56} height={52} rx={8} fill="#e0b030" {...S} />
					<circle cx={0} cy={-46} r={6} fill={INK} />
				</g>
			);
			break;
		case 'flower':
			g = (
				<g>
					<path d="M0,0 V-60" stroke="#3a9a5a" strokeWidth={5} />
					{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-84} rx={11} ry={18} fill={c ?? '#ff6aa0'} {...S} strokeWidth={2.2} transform={`rotate(${i * 72} 0 -70)`} />)}
					<circle cx={0} cy={-70} r={9} fill="#ffd84a" {...S} strokeWidth={2.2} />
				</g>
			);
			break;
		case 'sign':
			g = (
				<g>
					<rect x={-5} y={-170} width={10} height={170} fill="#6a4a30" />
					<rect x={-90} y={-230} width={180} height={80} rx={10} fill={c ?? '#fff6d0'} {...S} />
					<text x={0} y={-176} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={30} fill={INK}>{text ?? 'HELP'}</text>
				</g>
			);
			break;
		case 'frame':
			g = (
				<g>
					<rect x={-62} y={-110} width={124} height={110} rx={6} fill="#fff" {...S} />
					<rect x={-52} y={-100} width={104} height={90} fill={c ?? '#8ac8e8'} />
					<circle cx={0} cy={-70} r={18} fill="#ffe0b0" /><path d="M-30,-10 Q0,-50 30,-10 Z" fill="#6a5acd" />
				</g>
			);
			break;
		case 'mug':
			g = (
				<g>
					<rect x={-22} y={-44} width={44} height={44} rx={8} fill={c ?? '#fff'} {...S} />
					<path d="M22,-34 q22,0 22,16 q0,14 -22,12" fill="none" {...S} />
					<path d="M-8,-52 q-6,-12 0,-22 M6,-52 q-6,-12 0,-22" stroke="#fff" strokeWidth={4} opacity={0.6} fill="none" />
				</g>
			);
			break;
		case 'scale':
			g = (
				<g>
					<rect x={-4} y={-120} width={8} height={120} fill="#2b2a36" />
					<path d="M-90,-110 H90" stroke={INK} strokeWidth={6} />
					<path d="M-90,-110 l-24,60 h48 Z M90,-110 l-24,60 h48 Z" fill="#e0b030" {...S} strokeWidth={2.6} />
				</g>
			);
			break;
		case 'thorn':
			g = (
				<g>
					<path d="M-4,0 L0,-50 L6,0 Z" fill="#6a8a3a" {...S} strokeWidth={2.4} />
				</g>
			);
			break;
		case 'heart':
			g = (
				<g>
					<path d="M0,-12 C-40,-50 -52,-84 -26,-92 C-12,-96 0,-86 0,-76 C0,-86 12,-96 26,-92 C52,-84 40,-50 0,-12 Z" fill={c ?? '#ff4a6a'} {...S} />
					<path d="M-26,-80 q8,-8 16,-2" stroke="#fff" strokeWidth={4} opacity={0.6} fill="none" />
				</g>
			);
			break;
		case 'lamp':
			g = (
				<g>
					<rect x={-4} y={-150} width={8} height={150} fill="#2b2a36" />
					<path d="M-40,-150 L-24,-196 H24 L40,-150 Z" fill="#ffe08a" {...S} />
				</g>
			);
			break;
		case 'bed':
			g = (
				<g>
					<rect x={-120} y={-60} width={240} height={50} rx={14} fill="#b0804a" {...S} />
					<rect x={-110} y={-84} width={220} height={44} rx={16} fill="#e8d6c0" {...S} />
					<rect x={-120} y={-10} width={14} height={36} fill="#5a3a20" /><rect x={106} y={-10} width={14} height={36} fill="#5a3a20" />
				</g>
			);
			break;
		case 'bandage':
		case 'coat':
		case 'bike':
		case 'camera':
		default:
			g = <circle r={20} fill="#999" {...S} />;
	}
	return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>{g}</g>;
};
