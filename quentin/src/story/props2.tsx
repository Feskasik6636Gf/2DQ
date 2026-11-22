import React from 'react';
import {FONT, HAND} from '../kit/ui';
import {Steam} from './places';

/* Props drawn around the origin (0,0 = bottom centre unless noted). Scale with `s`.
   Sizes are meant for a hero of s = 1 (420 px tall): a bowl ~ 70 px, a pot ~ 150 px. */
const INK = '#1d1626';
const Star: React.FC<{x: number; r?: number; on?: boolean}> = ({x, r = 22, on = true}) => {
	const p = Array.from({length: 10}).map((_, i) => {
		const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
		const rr = i % 2 ? r * 0.45 : r;
		return `${x + Math.cos(a) * rr},${Math.sin(a) * rr}`;
	});
	return <polygon points={p.join(' ')} fill={on ? '#ffc83a' : '#4a4f66'} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />;
};

export type PropKind =
	| 'pot' | 'bowl' | 'spoon' | 'salt' | 'saltcup' | 'pan' | 'blackpan' | 'plate' | 'lemon' | 'stars' | 'phone' | 'cane' | 'whitecane' | 'pencil' | 'paper'
	| 'wine' | 'envelope' | 'roses' | 'bucket' | 'toast' | 'bread' | 'box' | 'lease' | 'review' | 'tray' | 'glass' | 'apron' | 'card' | 'screen' | 'flask' | 'spoonfork'
	| 'sign' | 'blindfold' | 'fakebeard' | 'shades' | 'mask' | 'chair' | 'table' | 'stool' | 'fridgebox' | 'clock' | 'bill' | 'toque' | 'bottle' | 'lampbulb' | 'frame' | 'curb' | 'bell' | 'receipt' | 'knife' | 'divider' | 'tear' | 'bubble';

export type PropOpts = {t?: string; n?: number; c?: string; f: number; on?: boolean};

export const PropArt: React.FC<{k: PropKind} & PropOpts> = ({k, t = '', n = 5, c, f, on = true}) => {
	switch (k) {
		case 'pot':
			return (
				<g>
					<rect x={-70} y={-140} width={140} height={140} rx={10} fill="#aeb7c2" stroke={INK} strokeWidth={4} />
					<rect x={-70} y={-140} width={140} height={22} rx={8} fill="#cfd6dd" />
					<rect x={-100} y={-110} width={30} height={14} rx={6} fill="#7c8794" />
					<rect x={70} y={-110} width={30} height={14} rx={6} fill="#7c8794" />
					<ellipse cx={0} cy={-136} rx={62} ry={12} fill={c ?? '#d9a14a'} />
					<Steam f={f} x={0} y={-150} s={0.8} n={3} seed="pp" />
				</g>
			);
		case 'bowl':
			return (
				<g>
					<path d="M-44,-46 Q-44,0 0,0 Q44,0 44,-46 Z" fill="#f5f1e8" stroke={INK} strokeWidth={3.5} />
					<ellipse cx={0} cy={-46} rx={44} ry={9} fill={c ?? '#e0a64e'} stroke={INK} strokeWidth={3} />
					<ellipse cx={0} cy={2} rx={22} ry={4} fill="#d8d2c4" />
					{on ? <Steam f={f} x={0} y={-52} s={0.45} n={3} seed="bw" /> : null}
				</g>
			);
		case 'spoon':
			return (
				<g transform="rotate(-20)">
					<rect x={-4} y={-110} width={8} height={100} rx={4} fill="#c9cfd8" stroke={INK} strokeWidth={2.5} />
					<ellipse cx={0} cy={-120} rx={14} ry={19} fill="#dfe4ea" stroke={INK} strokeWidth={2.5} />
					<ellipse cx={0} cy={-118} rx={9} ry={12} fill={c ?? '#e0a64e'} />
				</g>
			);
		case 'salt':
			return (
				<g>
					<rect x={-22} y={-82} width={44} height={82} rx={10} fill="#f5f7fa" stroke={INK} strokeWidth={3.5} />
					<rect x={-24} y={-98} width={48} height={22} rx={8} fill="#aeb7c2" stroke={INK} strokeWidth={3} />
					{[-10, 0, 10].map((x) => (
						<circle key={x} cx={x} cy={-88} r={2.4} fill={INK} />
					))}
					<text y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#3a6fd6">
						SALT
					</text>
				</g>
			);
		case 'saltcup':
			return (
				<g>
					<path d="M-44,-80 L-34,0 H34 L44,-80 Z" fill="#e8f1f8" stroke={INK} strokeWidth={3.5} opacity={0.95} />
					<path d="M-41,-62 L-33,-4 H33 L41,-62 Z" fill="#fff" />
					<text y={-26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#3a6fd6">
						1 CUP
					</text>
				</g>
			);
		case 'pan':
		case 'blackpan':
			return (
				<g>
					<ellipse cx={0} cy={-18} rx={84} ry={20} fill="#1c1c24" stroke={INK} strokeWidth={4} />
					<ellipse cx={0} cy={-22} rx={72} ry={14} fill={k === 'blackpan' ? '#0a0a0e' : c ?? '#d9b25a'} />
					<rect x={80} y={-26} width={110} height={14} rx={7} fill="#2b2f3a" stroke={INK} strokeWidth={3} />
					{k === 'blackpan' ? <Steam f={f} x={0} y={-30} s={0.9} n={4} c="#5a5a66" seed="bp" /> : null}
				</g>
			);
		case 'plate':
			return (
				<g>
					<ellipse cx={0} cy={-6} rx={62} ry={12} fill="#fff" stroke={INK} strokeWidth={3} />
					<ellipse cx={0} cy={-10} rx={40} ry={7} fill="#e9eef3" />
					<ellipse cx={-6} cy={-18} rx={24} ry={11} fill={c ?? '#d98a4a'} stroke={INK} strokeWidth={2.5} />
					<circle cx={14} cy={-22} r={6} fill="#5aa86a" />
				</g>
			);
		case 'lemon':
			return (
				<g>
					<ellipse cx={0} cy={-32} rx={46} ry={32} fill="#ffe14a" stroke={INK} strokeWidth={4} />
					<path d="M-46,-32 q-10,-4 -14,-12" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
					<path d="M46,-32 q10,-4 14,-12" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
					<ellipse cx={-12} cy={-44} rx={14} ry={7} fill="#fff7a0" opacity={0.8} />
				</g>
			);
		case 'stars':
			return (
				<g>
					{Array.from({length: 5}).map((_, i) => (
						<Star key={i} x={(i - 2) * 52} on={i < n} />
					))}
				</g>
			);
		case 'phone':
			return (
				<g>
					<rect x={-50} y={-180} width={100} height={180} rx={16} fill="#11142c" stroke="#ccd" strokeWidth={4} />
					<rect x={-42} y={-168} width={84} height={146} rx={8} fill={c ?? '#fff'} />
					<text y={-100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={t.length > 6 ? 18 : 34} fill="#222">
						{t}
					</text>
					<circle cx={0} cy={-10} r={5} fill="#556" />
				</g>
			);
		case 'cane':
		case 'whitecane':
			return (
				<g>
					<rect x={-5} y={-300} width={10} height={300} rx={5} fill={k === 'cane' ? '#3a2a20' : '#fff'} stroke={INK} strokeWidth={2.5} />
					{k === 'cane' ? <path d="M-5,-298 q0,-26 -26,-26 q-20,0 -22,16" stroke="#3a2a20" strokeWidth={10} fill="none" strokeLinecap="round" /> : <rect x={-5} y={-130} width={10} height={26} fill="#ff4a4a" />}
				</g>
			);
		case 'pencil':
			return (
				<g transform="rotate(-30)">
					<rect x={-5} y={-86} width={10} height={80} fill="#d9382a" stroke={INK} strokeWidth={2.5} />
					<polygon points="-5,-6 5,-6 0,10" fill="#f2d9a8" stroke={INK} strokeWidth={2} />
					<rect x={-5} y={-96} width={10} height={10} fill="#e8a0a0" stroke={INK} strokeWidth={2} />
				</g>
			);
		case 'paper':
			return (
				<g>
					<rect x={-60} y={-160} width={120} height={160} fill="#fffdf3" stroke={INK} strokeWidth={3} />
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={-44} y={-138 + i * 18} width={88 - (i % 3) * 14} height={5} fill="#778" />
					))}
					<text x={20} y={-10} fontFamily={HAND} fontSize={50} fontWeight={700} fill="#d9382a" textAnchor="middle">
						{t}
					</text>
				</g>
			);
		case 'wine':
			return (
				<g>
					<path d="M-34,-130 Q-34,-60 0,-56 Q34,-60 34,-130 Z" fill="#f7fbff" stroke={INK} strokeWidth={3.5} opacity={0.95} />
					<path d="M-31,-100 Q-30,-62 0,-60 Q30,-62 31,-100 Z" fill={c ?? '#a01a3a'} />
					<rect x={-4} y={-58} width={8} height={50} fill="#dfe8f0" stroke={INK} strokeWidth={2.5} />
					<ellipse cx={0} cy={-6} rx={30} ry={7} fill="#dfe8f0" stroke={INK} strokeWidth={3} />
				</g>
			);
		case 'envelope':
			return (
				<g>
					<rect x={-56} y={-80} width={112} height={80} rx={6} fill="#fffaf0" stroke={INK} strokeWidth={3.5} />
					<path d="M-56,-80 L0,-36 L56,-80" stroke={INK} strokeWidth={3.5} fill="none" />
					<circle cx={0} cy={-36} r={9} fill="#d9382a" />
				</g>
			);
		case 'roses':
			return (
				<g>
					{Array.from({length: n}).map((_, i) => {
						const a = (i - (n - 1) / 2) * 0.28;
						return (
							<g key={i} transform={`rotate(${a * 57})`}>
								<rect x={-3} y={-150} width={6} height={150} fill="#3a8a4a" />
								<circle cy={-158} r={22} fill="#fff" stroke={INK} strokeWidth={3} />
								<path d="M-10,-160 q10,-14 20,0 q-10,10 -20,0" fill="#eee" stroke="#ccc" />
							</g>
						);
					})}
					<path d="M-34,-60 L34,-60 L18,0 H-18 Z" fill="#d9a06a" stroke={INK} strokeWidth={3} />
				</g>
			);
		case 'bucket':
			return (
				<g>
					<path d="M-56,-90 L-44,0 H44 L56,-90 Z" fill="#c9cfd8" stroke={INK} strokeWidth={4} />
					<ellipse cx={0} cy={-90} rx={56} ry={10} fill="#8a92a0" stroke={INK} strokeWidth={3} />
					<path d="M-52,-86 Q0,-190 52,-86" fill="none" stroke="#8a92a0" strokeWidth={5} />
				</g>
			);
		case 'toast':
			return (
				<g>
					<path d="M-38,-12 v-26 q0,-22 38,-22 q38,0 38,22 v26 Z" fill="#e0b274" stroke={INK} strokeWidth={3.5} />
					<path d="M-26,-14 v-20 q0,-14 26,-14 q26,0 26,14 v20 Z" fill="#f3d9a6" />
				</g>
			);
		case 'bread':
			return (
				<g>
					<ellipse cx={0} cy={-26} rx={70} ry={26} fill="#c98a3a" stroke={INK} strokeWidth={3.5} />
					{[-30, -6, 18].map((x) => (
						<path key={x} d={`M${x},-42 l10,26`} stroke="#f3d9a6" strokeWidth={5} strokeLinecap="round" />
					))}
				</g>
			);
		case 'box':
			return (
				<g>
					<rect x={-60} y={-60} width={120} height={60} rx={4} fill="#fff" stroke={INK} strokeWidth={3.5} />
					<rect x={-60} y={-74} width={120} height={18} rx={4} fill="#ffb3c8" stroke={INK} strokeWidth={3.5} />
					<line x1={-60} y1={-30} x2={60} y2={-30} stroke="#ffb3c8" strokeWidth={5} />
				</g>
			);
		case 'lease':
			return (
				<g>
					<rect x={-70} y={-190} width={140} height={190} fill="#fffdf3" stroke={INK} strokeWidth={3.5} />
					<text y={-155} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#222">
						LEASE
					</text>
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={-52} y={-132 + i * 16} width={104 - (i % 3) * 18} height={5} fill="#888" />
					))}
					<path d="M-50,-24 q20,-24 36,0 t36,0" stroke="#3a6fd6" strokeWidth={4} fill="none" />
				</g>
			);
		case 'review':
			return (
				<g>
					<rect x={-150} y={-120} width={300} height={120} rx={14} fill="#fff" stroke={INK} strokeWidth={4} />
					<g transform="translate(-80,-86) scale(0.7)">
						{Array.from({length: 5}).map((_, i) => (
							<Star key={i} x={i * 52} on={i < n} />
						))}
					</g>
					<text y={-36} x={0} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={36} fill="#222">
						{t}
					</text>
				</g>
			);
		case 'tray':
			return (
				<g>
					<rect x={-100} y={-12} width={200} height={12} rx={6} fill="#aeb7c2" stroke={INK} strokeWidth={3} />
					{[-60, 0, 60].map((x, i) => (
						<g key={i} transform={`translate(${x},-12) scale(0.8)`}>
							<PropArt k="bowl" f={f} on={false} />
						</g>
					))}
				</g>
			);
		case 'glass':
			return (
				<g>
					<path d="M-26,-90 L-20,0 H20 L26,-90 Z" fill="#dff1ff" stroke={INK} strokeWidth={3.5} opacity={0.9} />
					<path d="M-23,-60 L-19,-3 H19 L23,-60 Z" fill={c ?? '#d9902a'} />
				</g>
			);
		case 'apron':
			return (
				<g>
					<path d="M-34,-120 h68 l10,120 h-88 Z" fill="#fff" stroke={INK} strokeWidth={3.5} />
					<line x1={-24} y1={-120} x2={-14} y2={-160} stroke={INK} strokeWidth={4} />
					<line x1={24} y1={-120} x2={14} y2={-160} stroke={INK} strokeWidth={4} />
					<path d="M0,-170 q-30,-20 0,-30 q30,10 0,30" fill="none" stroke={INK} strokeWidth={4} />
				</g>
			);
		case 'card':
			return (
				<g>
					<rect x={-60} y={-80} width={120} height={80} rx={8} fill="#fff" stroke={INK} strokeWidth={3.5} />
					<text y={-28} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={54} fill="#222">
						{t}
					</text>
				</g>
			);
		case 'screen':
			return (
				<g>
					<rect x={-110} y={-150} width={220} height={150} rx={10} fill="#11142c" stroke="#ccd" strokeWidth={5} />
					<rect x={-98} y={-138} width={196} height={126} fill={c ?? '#1d4a8a'} />
					<text y={-62} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={t.length > 8 ? 26 : 44} fill="#fff">
						{t}
					</text>
				</g>
			);
		case 'flask':
			return (
				<g>
					<path d="M-14,-120 h28 v40 l40,80 h-108 l40,-80 Z" fill="#dff1ff" stroke={INK} strokeWidth={3.5} opacity={0.95} />
					<path d="M-30,-30 l-22,30 h104 l-22,-30 Z" fill={c ?? '#7ae0a0'} />
					<circle cx={0} cy={-14 - ((f * 1.3) % 30)} r={4} fill="#fff" />
				</g>
			);
		case 'sign':
			return (
				<g>
					<rect x={-4} y={-120} width={8} height={120} fill="#6b4a2a" />
					<rect x={-120} y={-220} width={240} height={110} rx={10} fill="#fff6d8" stroke={INK} strokeWidth={4} />
					<text y={-150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={t.length > 8 ? 30 : 48} fill="#1d1626">
						{t}
					</text>
				</g>
			);
		case 'blindfold':
			return (
				<g>
					<rect x={-40} y={-12} width={80} height={24} rx={8} fill={c ?? '#e8664a'} stroke={INK} strokeWidth={3} />
					<path d="M40,0 l24,18 M40,0 l26,-6" stroke={c ?? '#e8664a'} strokeWidth={8} strokeLinecap="round" />
				</g>
			);
		case 'fakebeard':
			return (
				<g>
					<path d="M-40,-20 Q-44,50 0,60 Q44,50 40,-20 Q20,10 0,6 Q-20,10 -40,-20 Z" fill="#4a2c22" stroke={INK} strokeWidth={3} />
				</g>
			);
		case 'shades':
			return (
				<g>
					<rect x={-52} y={-16} width={44} height={28} rx={9} fill="#0a0a12" stroke="#555" strokeWidth={3} />
					<rect x={8} y={-16} width={44} height={28} rx={9} fill="#0a0a12" stroke="#555" strokeWidth={3} />
					<line x1={-8} y1={-6} x2={8} y2={-6} stroke="#555" strokeWidth={4} />
				</g>
			);
		case 'mask':
			return (
				<g>
					<path d="M-44,-6 Q0,-20 44,-6 L38,38 Q0,56 -38,38 Z" fill="#b8e0f0" stroke={INK} strokeWidth={3} />
					<line x1={-44} y1={6} x2={-64} y2={-6} stroke="#7aa" strokeWidth={4} />
				</g>
			);
		case 'toque':
			return (
				<g>
					<rect x={-40} y={-30} width={80} height={32} rx={6} fill="#fff" stroke={INK} strokeWidth={3} />
					<path d="M-44,-28 q-16,-50 24,-50 q10,-26 40,-6 q40,0 24,56 Z" fill="#fff" stroke={INK} strokeWidth={3.5} />
				</g>
			);
		case 'chair':
			return (
				<g>
					<rect x={-40} y={-90} width={80} height={14} rx={6} fill="#a8703c" />
					<rect x={-40} y={-190} width={12} height={110} fill="#8a5a2c" />
					<rect x={-34} y={-190} width={70} height={16} fill="#8a5a2c" />
					<rect x={-36} y={-76} width={10} height={76} fill="#6b4420" />
					<rect x={26} y={-76} width={10} height={76} fill="#6b4420" />
				</g>
			);
		case 'stool':
			return (
				<g>
					<rect x={-40} y={-90} width={80} height={14} rx={6} fill="#c9cfd8" stroke={INK} strokeWidth={3} />
					<rect x={-32} y={-76} width={8} height={76} fill="#8a92a0" />
					<rect x={24} y={-76} width={8} height={76} fill="#8a92a0" />
				</g>
			);
		case 'table':
			return (
				<g>
					<ellipse cx={0} cy={-150} rx={120} ry={24} fill="#fff" stroke={INK} strokeWidth={3.5} />
					<rect x={-8} y={-150} width={16} height={150} fill="#7a5a3a" />
					<ellipse cx={0} cy={0} rx={50} ry={10} fill="#5a3a22" />
					<circle cx={-20} cy={-168} r={6} fill="#ffcf6a" opacity={0.7 + 0.3 * Math.sin(f / 4)} />
				</g>
			);
		case 'fridgebox':
			return (
				<g>
					<rect x={-50} y={-70} width={100} height={70} fill="#e0b274" stroke={INK} strokeWidth={3} />
					<rect x={-50} y={-70} width={100} height={14} fill="#c89a5a" />
				</g>
			);
		case 'clock':
			return (
				<g>
					<circle cy={-50} r={50} fill="#fff" stroke={INK} strokeWidth={5} />
					<line x1={0} y1={-50} x2={0} y2={-88} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${f * 3} 0 -50)`} />
					<line x1={0} y1={-50} x2={22} y2={-50} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${f * 0.25} 0 -50)`} />
				</g>
			);
		case 'bill':
		case 'receipt':
			return (
				<g>
					<rect x={-40} y={-150} width={80} height={150} fill="#fffdf3" stroke={INK} strokeWidth={3} />
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={-28} y={-132 + i * 18} width={56 - (i % 2) * 14} height={5} fill="#778" />
					))}
					<text y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#c33">
						{t}
					</text>
				</g>
			);
		case 'bottle':
			return (
				<g>
					<rect x={-16} y={-110} width={32} height={110} rx={10} fill={c ?? '#2f8f6a'} stroke={INK} strokeWidth={3} />
					<rect x={-7} y={-136} width={14} height={30} fill={c ?? '#2f8f6a'} stroke={INK} strokeWidth={3} />
				</g>
			);
		case 'lampbulb':
			return (
				<g>
					<circle cy={-40} r={30} fill="#fff3a0" stroke={INK} strokeWidth={4} />
				</g>
			);
		case 'frame':
			return (
				<g>
					<rect x={-80} y={-110} width={160} height={110} fill="#fff" stroke="#8a5a2c" strokeWidth={10} />
					<text y={-40} textAnchor="middle" fontFamily={HAND} fontSize={t.length > 7 ? 30 : 52} fontWeight={700} fill="#222">
						{t}
					</text>
				</g>
			);
		case 'curb':
			return <rect x={-200} y={-30} width={400} height={30} fill="#9a9ca8" stroke={INK} strokeWidth={3} />;
		case 'bell':
			return (
				<g>
					<path d="M-30,-40 q0,-40 30,-40 q30,0 30,40 Z" fill="#e8c14a" stroke={INK} strokeWidth={3.5} />
					<circle cy={-2} r={7} fill="#c9a030" />
				</g>
			);
		case 'knife':
			return (
				<g transform="rotate(20)">
					<rect x={-6} y={-40} width={12} height={40} rx={4} fill="#3a2a20" />
					<path d="M-6,-40 h12 l4,-90 q-14,20 -16,90 Z" fill="#dfe4ea" stroke={INK} strokeWidth={2.5} />
				</g>
			);
		case 'divider':
			return (
				<g>
					<rect x={-90} y={-430} width={180} height={430} fill="#6a5a7a" stroke={INK} strokeWidth={5} />
					<rect x={-70} y={-410} width={140} height={390} fill="#7e6e90" />
					<text y={-200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" opacity={0.8}>SCREEN</text>
				</g>
			);
		case 'tear':
			return <path d="M0,-30 q-14,24 0,30 q14,-6 0,-30 Z" fill="#8fd0ff" stroke={INK} strokeWidth={2.5} />;
		case 'spoonfork':
			return null;
	}
	return null;
};
