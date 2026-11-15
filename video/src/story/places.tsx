import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten, mix} from '../engine/color';
import {Stickman} from '../engine/Stickman';
import {HAND, FONT} from '../kit/ui';
import {idle, walk} from '../kit/actions';
import {Chair} from '../engine/props';

/* Locations of «The Halcyon Star». Each place = {Back (far layer, depth ~1.6), Front (floor + furniture behind actors, depth 1),
   Over (things that pass in front of the actors, depth ~0.9)}. `k` is 0 = dusk … 1 = deep night (outside light only). */

const G: React.FC<{id: string; stops: [number, string][]; x2?: number; y2?: number}> = ({id, stops, x2 = 0, y2 = 1}) => (
	<linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
		{stops.map(([o, c], i) => (
			<stop key={i} offset={o} stopColor={c} />
		))}
	</linearGradient>
);

export type PlaceProps = {f: number; k?: number; p?: Record<string, number>};

/* ------------------------------ sea and sky ------------------------------ */
export const SeaSky: React.FC<{f: number; k: number; horizon?: number}> = ({f, k, horizon = 600}) => {
	const top = mix('#2c3a72', '#040716', k);
	const mid = mix('#d8607a', '#0b1840', k);
	const low = mix('#ffb15e', '#1b3262', k);
	const sea1 = mix('#2a4a6a', '#08102a', k);
	const sea2 = mix('#0f2036', '#02050f', k);
	return (
		<Svg>
			<defs>
				<G id="ss-sky" stops={[[0, top], [0.55, mid], [1, low]]} />
				<G id="ss-sea" stops={[[0, sea1], [1, sea2]]} />
				<radialGradient id="ss-sun">
					<stop offset="0" stopColor={mix('#fff2c0', '#e8f0ff', k)} stopOpacity={0.95} />
					<stop offset="1" stopColor={mix('#ffb15e', '#8fb0ff', k)} stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-700} y={-500} width={3400} height={horizon + 500} fill="url(#ss-sky)" />
			{k > 0.4
				? Array.from({length: 60}).map((_, i) => <circle key={i} cx={-500 + random('st' + i) * 2900} cy={random('sy' + i) * (horizon - 30)} r={1 + random('sr' + i) * 2} fill="#fff" opacity={(0.3 + 0.7 * random('so' + i)) * (0.7 + 0.3 * Math.sin(f / 20 + i)) * (k - 0.3)} />)
				: null}
			<circle cx={1380} cy={horizon - 40 - k * 220} r={260} fill="url(#ss-sun)" />
			<circle cx={1380} cy={horizon - 40 - k * 220} r={k > 0.5 ? 46 : 74} fill={mix('#fff5d0', '#f4f7ff', k)} opacity={0.95} />
			<rect x={-700} y={horizon} width={3400} height={900} fill="url(#ss-sea)" />
			{Array.from({length: 22}).map((_, i) => {
				const y = horizon + 10 + i * i * 1.15 + i * 6;
				const amp = 4 + i * 1.2;
				const d = Array.from({length: 17}).map((__, j) => `${j === 0 ? 'M' : 'L'}${-700 + j * 220},${y + Math.sin(f / (30 - i * 0.5) + j * 1.3 + i) * amp}`).join(' ');
				return <path key={i} d={d} stroke={mix('#8fb7e8', '#3a5a9a', k)} strokeWidth={1 + i * 0.18} fill="none" opacity={0.16 + i * 0.006} />;
			})}
			{Array.from({length: 14}).map((_, i) => {
				const y = horizon + 14 + random('g' + i) * 90;
				const w = 40 + random('gw' + i) * 160;
				return <rect key={i} x={1380 - w / 2 + (random('gx' + i) - 0.5) * 120} y={y} width={w} height={3} fill="#fff6d8" opacity={(0.3 + 0.4 * Math.sin(f / 9 + i * 2) ** 2) * (1 - k * 0.4)} />;
			})}
		</Svg>
	);
};


/* ------------------------------- the tanker (side view) ------------------------------- */
export const Tanker: React.FC<{f: number; k: number; x?: number; y?: number; s?: number; lights?: number}> = ({f, k, x = 960, y = 640, s = 1, lights = 1}) => {
	const hull = mix('#2a2f3a', '#0a0d16', k * 0.7);
	const red = mix('#8a2a24', '#2a0e10', k * 0.7);
	const deck = mix('#7a8490', '#20283a', k * 0.7);
	const lit = '#ffd27a';
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<ellipse cx={0} cy={10} rx={780} ry={20} fill="#000" opacity={0.35} />
			<path d="M-720,-40 L700,-40 L780,-110 L-720,-110 Z" fill={hull} />
			<path d="M-720,-40 L700,-40 L690,0 L-700,0 Z" fill={red} />
			<rect x={-720} y={-112} width={1500} height={10} fill={deck} />
			<text x={-380} y={-68} fontFamily={FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill="#e9eef5" opacity={0.9}>HALCYON STAR</text>
			{/* pipes and manifolds */}
			{Array.from({length: 22}).map((_, i) => (
				<rect key={i} x={-640 + i * 46} y={-130} width={12} height={22} fill={deck} />
			))}
			<rect x={-660} y={-134} width={1000} height={10} fill={deck} />
			<rect x={-300} y={-190} width={14} height={80} fill={deck} />
			<rect x={-300} y={-196} width={260} height={10} fill={deck} />
			{/* stern tower */}
			<rect x={420} y={-260} width={260} height={150} fill={mix('#d7dde4', '#46506a', k)} />
			<rect x={400} y={-286} width={300} height={30} fill={mix('#c3cad2', '#3a4560', k)} />
			<rect x={520} y={-340} width={46} height={80} fill={mix('#d8553a', '#4a2030', k)} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<rect key={i} x={440 + i * 38} y={-244} width={26} height={22} fill={lit} opacity={lights * (0.7 + 0.3 * Math.sin(f / 15 + i))} />
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<rect key={i} x={440 + i * 38} y={-206} width={26} height={22} fill={lit} opacity={lights * 0.6} />
			))}
			<circle cx={600} cy={-300} r={6} fill="#ff4a3a" opacity={0.6 + 0.4 * Math.sin(f / 8)} />
			{/* wake */}
			<path d={`M-720,6 q-80,${6 + Math.sin(f / 10) * 3} -240,0`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.25} />
		</g>
	);
};
export const SeaFront: React.FC<PlaceProps> = ({f, k = 0, p = {}}) => (
	<Svg>
		<Tanker f={f} k={k} x={p.tx ?? 960} y={p.ty ?? 640} s={p.ts ?? 1} lights={p.tl ?? 1} />
	</Svg>
);

/* ----------------------------------- deck ----------------------------------- */
export const DeckBack: React.FC<PlaceProps> = ({f, k = 0}) => <SeaSky f={f} k={k} horizon={600} />;

export const DeckFront: React.FC<PlaceProps> = ({f, k = 0, p = {}}) => {
	const wall = mix('#d7dde4', '#46506a', k);
	const glass = mix('#aab8c0', '#2a3a48', k);
	const fog = p.fog ?? 1;
	return (
		<Svg>
			<defs>
				<G id="dk-floor" stops={[[0, mix('#5a6a78', '#1c2434', k)], [1, mix('#3c4856', '#0d121c', k)]]} />
			</defs>
			{/* far rail and crane */}
			<rect x={-700} y={640} width={3400} height={8} fill={mix('#c9d0d8', '#3a4560', k)} />
			{Array.from({length: 34}).map((_, i) => (
				<rect key={i} x={-640 + i * 110} y={640} width={7} height={160} fill={mix('#b8c0c9', '#323c58', k)} />
			))}
			<rect x={-700} y={716} width={3400} height={6} fill={mix('#c9d0d8', '#3a4560', k)} />
			<g opacity={0.95}>
				<rect x={-120} y={260} width={26} height={400} fill={mix('#6a7480', '#1a2234', k)} />
				<rect x={-120} y={254} width={520} height={20} fill={mix('#6a7480', '#1a2234', k)} />
				<line x1={-106} y1={262} x2={360} y2={600} stroke={mix('#6a7480', '#1a2234', k)} strokeWidth={6} />
			</g>
			{/* superstructure */}
			<rect x={1240} y={90} width={760} height={720} fill={wall} />
			<rect x={1240} y={90} width={760} height={14} fill={lighten(wall, 0.3)} />
			<rect x={1500} y={-120} width={150} height={230} fill={mix('#d8553a', '#4a2030', k)} />
			<rect x={1500} y={-120} width={150} height={44} fill={mix('#1b1f2b', '#06080e', k)} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<g key={i}>
					<rect x={1280 + i * 118} y={250} width={100} height={110} rx={8} fill={glass} />
					<rect x={1280 + i * 118} y={250} width={100} height={110} rx={8} fill="#e6eef2" opacity={0.55 * fog} />
					<path d={`M${1292 + i * 118},${270} q10,40 4,76 M${1330 + i * 118},${262} q-8,34 -2,70 M${1362 + i * 118},${280} q6,26 0,56`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.5 * fog} strokeLinecap="round" />
				</g>
			))}
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i}>
					<circle cx={1330 + i * 150} cy={470} r={36} fill={mix('#27333f', '#0a0f18', k)} stroke={mix('#9aa5b0', '#2c364a', k)} strokeWidth={8} />
					<circle cx={1330 + i * 150} cy={470} r={22} fill={i === 2 ? '#ffd27a' : mix('#7fa0b8', '#16243a', k)} opacity={i === 2 ? 0.55 + 0.4 * Math.sin(f / 14) : 1} />
				</g>
			))}
			<rect x={1360} y={590} width={150} height={214} fill={mix('#8a93a0', '#242c3c', k)} />
			<rect x={1372} y={604} width={126} height={200} fill={mix('#2c3640', '#0a0f18', k)} />
			<rect x={1500} y={700} width={10} height={36} rx={4} fill="#cfd6dd" />
			<rect x={1240} y={790} width={760} height={14} fill={darken(wall, 0.25)} />
			{/* deck plates */}
			<rect x={-700} y={800} width={3400} height={500} fill="url(#dk-floor)" />
			<rect x={-700} y={800} width={3400} height={8} fill={mix('#8996a4', '#2a3550', k)} />
			{Array.from({length: 28}).map((_, i) => (
				<line key={i} x1={-700 + i * 150} y1={808} x2={-1000 + i * 190} y2={1200} stroke={mix('#2f3946', '#090d16', k)} strokeWidth={2} opacity={0.7} />
			))}
			{[860, 990, 1120].map((y, i) => (
				<line key={i} x1={-700} y1={y} x2={2700} y2={y} stroke={mix('#2f3946', '#090d16', k)} strokeWidth={2} opacity={0.6} />
			))}
			<rect x={-700} y={922} width={3400} height={10} fill="#e8b92c" opacity={0.85 - k * 0.45} />
			{/* neat coiled ropes, bollards, hatch */}
			{[360, 1010].map((x, j) => (
				<g key={x}>
					{[0, 1, 2, 3].map((i) => (
						<ellipse key={i} cx={x} cy={896 - i * 11} rx={70 - i * 4} ry={20 - i} fill={mix('#c9a870', '#5a4a30', k)} stroke={mix('#8f7240', '#33281a', k)} strokeWidth={3} />
					))}
					<ellipse cx={x} cy={852} rx={22} ry={7} fill={mix('#6e5430', '#241c10', k)} />
					<ellipse cx={x} cy={912} rx={96} ry={14} fill="#000" opacity={0.22} />
					{j === 1 ? <rect x={x + 130} y={812} width={34} height={90} rx={8} fill={mix('#d8553a', '#4a2030', k)} /> : null}
				</g>
			))}
			<rect x={560} y={820} width={220} height={66} rx={6} fill={mix('#4a5866', '#161e2c', k)} stroke={mix('#8a97a6', '#2c3650', k)} strokeWidth={4} />
			<rect x={580} y={836} width={180} height={34} rx={4} fill="none" stroke={mix('#8a97a6', '#2c3650', k)} strokeWidth={3} />
			{(p.gas ?? 0) > 0
				? Array.from({length: 9}).map((_, i) => {
						const t = ((f / 60 + i / 9) % 1);
						return <circle key={i} cx={670 + Math.sin(i * 2 + f / 20) * 50 + t * 80} cy={810 - t * 330} r={30 + t * 90} fill="#9be36a" opacity={(1 - t) * 0.4 * (p.gas ?? 0)} />;
					})
				: null}
			{/* fresh clean sheen: spotless deck */}
			<rect x={-700} y={808} width={3400} height={20} fill="#fff" opacity={0.05} />
		</Svg>
	);
};

export const DeckOver: React.FC<PlaceProps> = ({f, k = 0}) => (
	<Svg>
		<rect x={-700} y={1000} width={3400} height={12} fill={mix('#c9d0d8', '#2c3550', k)} opacity={0.5} />
		<g opacity={0.7 - k * 0.3}>
			{[240, 980, 1720].map((x, i) => (
				<g key={i}>
					<rect x={x} y={760} width={14} height={340} fill={mix('#d8dde3', '#2c3550', k)} />
				</g>
			))}
		</g>
	</Svg>
);

/* ---------------------------- generic interior bits ---------------------------- */
const Tube: React.FC<{x: number; y: number; w?: number; on?: number; c?: string}> = ({x, y, w = 260, on = 1, c = '#f4ffd8'}) => (
	<g>
		<rect x={x - w / 2 - 10} y={y - 6} width={w + 20} height={22} rx={6} fill="#3a4338" />
		<rect x={x - w / 2} y={y} width={w} height={12} rx={6} fill={c} opacity={0.3 + 0.7 * on} />
		<path d={`M${x - w / 2 - 40},${y + 16} L${x + w / 2 + 40},${y + 16} L${x + w / 2 + 140},${y + 700} L${x - w / 2 - 140},${y + 700} Z`} fill={c} opacity={0.05 * on} />
	</g>
);
const flick = (f: number, seed = 0, rate = 1) => {
	const t = Math.sin(f * 0.7 * rate + seed) + Math.sin(f * 1.9 * rate + seed * 3);
	return t > 1.75 ? 0.35 : 1;
};

/* ----------------------------------- hall ----------------------------------- */
export const HallBack: React.FC<PlaceProps> = ({f}) => (
	<Svg>
		<defs>
			<G id="hl-w" stops={[[0, '#a9b79c'], [1, '#8fa088']]} />
		</defs>
		<rect x={-700} y={-300} width={3400} height={1300} fill="url(#hl-w)" />
		<rect x={-700} y={560} width={3400} height={340} fill="#5f7a6c" />
		<rect x={-700} y={556} width={3400} height={10} fill="#2f3f36" />
		{/* ceiling pipes */}
		<rect x={-700} y={40} width={3400} height={26} fill="#6a7872" />
		<rect x={-700} y={86} width={3400} height={14} fill="#c9893a" />
		{Array.from({length: 7}).map((_, i) => (
			<g key={i}>
				<rect x={-380 + i * 440} y={150} width={240} height={400} fill="#1b2420" />
				<rect x={-380 + i * 440} y={150} width={240} height={400} fill="none" stroke="#2c3a32" strokeWidth={14} />
				<rect x={-360 + i * 440} y={190} width={200} height={360} fill="#344036" />
				<rect x={-340 + i * 440} y={400} width={160} height={150} fill="#e7dfc6" opacity={0.85} />
				<rect x={-300 + i * 440} y={110} width={80} height={26} rx={4} fill="#e9e3cf" />
				<text x={-260 + i * 440} y={131} fontSize={20} fontFamily={FONT} fontWeight={800} textAnchor="middle" fill="#2c3a32">
					{101 + i}
				</text>
				<rect x={-140 + i * 440} y={330} width={14} height={30} rx={4} fill="#c9d0c8" />
			</g>
		))}
		{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
			<Tube key={i} x={-300 + i * 330} y={30} w={170} on={flick(f, i * 2.3)} />
		))}
	</Svg>
);
export const HallFront: React.FC<PlaceProps> = () => (
	<Svg>
		<defs>
			<G id="hl-f" stops={[[0, '#47584f'], [1, '#27322d']]} />
		</defs>
		<rect x={-700} y={880} width={3400} height={500} fill="url(#hl-f)" />
		<rect x={-700} y={880} width={3400} height={10} fill="#1b2420" />
		<rect x={-700} y={930} width={3400} height={20} fill="#9b3a30" opacity={0.7} />
		{Array.from({length: 26}).map((_, i) => (
			<line key={i} x1={-600 + i * 140} y1={890} x2={-900 + i * 190} y2={1300} stroke="#1f2a25" strokeWidth={2} />
		))}
	</Svg>
);

/* ----------------------------------- cabin ----------------------------------- */
export const CabinBack: React.FC<PlaceProps> = ({f, k = 1}) => (
	<Svg>
		<defs>
			<G id="cb-w" stops={[[0, '#8f9c88'], [1, '#76867a']]} />
		</defs>
		<rect x={-700} y={-300} width={3400} height={1300} fill="url(#cb-w)" />
		<circle cx={1380} cy={380} r={150} fill="#2b352f" />
		<circle cx={1380} cy={380} r={118} fill={mix('#6a88b8', '#0a1432', k)} />
		<ellipse cx={1380} cy={430} rx={114} ry={34} fill={mix('#1a3050', '#04081a', k)} opacity={0.9} />
		<path d={`M1262,${400 + Math.sin(f / 14) * 4} q40,-14 80,0 t80,0 t74,0`} stroke="#8fb0e8" strokeWidth={3} fill="none" opacity={0.5} />
		<Tube x={620} y={20} w={240} on={flick(f, 5, 0.6)} />
	</Svg>
);
export const CabinFront: React.FC<PlaceProps> = () => (
	<Svg>
		<rect x={-700} y={880} width={3400} height={500} fill="#4a5a50" />
		<rect x={-700} y={880} width={3400} height={10} fill="#222c26" />
		{/* neat bunk: perfectly made, corners tucked */}
		<rect x={140} y={300} width={540} height={14} fill="#2a2f35" />
		<rect x={140} y={300} width={14} height={600} fill="#2a2f35" />
		<rect x={666} y={300} width={14} height={600} fill="#2a2f35" />
		<rect x={154} y={640} width={512} height={30} fill="#3d5f9a" />
		<rect x={154} y={620} width={512} height={22} fill="#f1f3f5" />
		<rect x={154} y={330} width={512} height={30} fill="#3d5f9a" />
		<rect x={154} y={310} width={512} height={22} fill="#f1f3f5" />
		<rect x={170} y={598} width={110} height={26} rx={12} fill="#fff" />
		<rect x={140} y={880} width={540} height={12} fill="#2a2f35" />
		<rect x={820} y={520} width={220} height={380} fill="#6b7a70" stroke="#2a342e" strokeWidth={6} />
		<line x1={930} y1={520} x2={930} y2={900} stroke="#2a342e" strokeWidth={5} />
	</Svg>
);

/* ------------------------------------ mess ------------------------------------ */
const Clock: React.FC<{x: number; y: number; r?: number; h: number; m: number}> = ({x, y, r = 54, h, m}) => (
	<g>
		<circle cx={x} cy={y} r={r + 8} fill="#222" />
		<circle cx={x} cy={y} r={r} fill="#f4f0e4" />
		{Array.from({length: 12}).map((_, i) => (
			<line key={i} x1={x + Math.sin((i / 12) * 6.283) * (r - 5)} y1={y - Math.cos((i / 12) * 6.283) * (r - 5)} x2={x + Math.sin((i / 12) * 6.283) * (r - 12)} y2={y - Math.cos((i / 12) * 6.283) * (r - 12)} stroke="#222" strokeWidth={3} />
		))}
		<line x1={x} y1={y} x2={x + Math.sin(((h % 12) / 12 + m / 720) * 6.283) * r * 0.5} y2={y - Math.cos(((h % 12) / 12 + m / 720) * 6.283) * r * 0.5} stroke="#222" strokeWidth={6} strokeLinecap="round" />
		<line x1={x} y1={y} x2={x + Math.sin((m / 60) * 6.283) * r * 0.78} y2={y - Math.cos((m / 60) * 6.283) * r * 0.78} stroke="#222" strokeWidth={4} strokeLinecap="round" />
	</g>
);
export const MessBack: React.FC<PlaceProps> = ({f, p = {}}) => (
	<Svg>
		<defs>
			<G id="ms-w" stops={[[0, '#b6c0a2'], [1, '#98a58a']]} />
		</defs>
		<rect x={-700} y={-300} width={3400} height={1300} fill="url(#ms-w)" />
		<rect x={-700} y={560} width={3400} height={320} fill="#6a8472" />
		<rect x={-700} y={554} width={3400} height={10} fill="#2f3f36" />
		{/* serving hatch */}
		<rect x={140} y={300} width={460} height={230} fill="#1f2924" />
		<rect x={140} y={300} width={460} height={20} fill="#9aa7a0" />
		<rect x={100} y={510} width={540} height={30} fill="#aab6b0" />
		{[0, 1, 2].map((i) => (
			<ellipse key={i} cx={200 + i * 150} cy={500} rx={56} ry={9} fill="#e8ece6" />
		))}
		<Clock x={1560} y={240} h={p.h ?? 7} m={p.m ?? 0} />
		{/* portholes */}
		{[880, 1120].map((x) => (
			<g key={x}>
				<circle cx={x} cy={330} r={70} fill="#2b352f" />
				<circle cx={x} cy={330} r={54} fill="#0b1636" />
				<circle cx={x - 12} cy={316} r={3} fill="#fff" opacity={0.6} />
				{x === 880 && (p.hl ?? 0) > 0 ? (
					<g opacity={p.hl}>
						<circle cx={x + Math.cos(f / 22) * 28} cy={330 + Math.sin(f / 22) * 12} r={5} fill="#fff" opacity={0.6 + 0.4 * Math.sin(f / 5)} />
						<circle cx={x + Math.cos(f / 22) * 28 + 12} cy={330 + Math.sin(f / 22) * 12 + 3} r={4} fill="#ff4a3a" opacity={0.5 + 0.5 * Math.sin(f / 7)} />
					</g>
				) : null}
			</g>
		))}
		{[0, 1, 2, 3, 4].map((i) => (
			<Tube key={i} x={100 + i * 440} y={26} w={220} on={flick(f, i * 1.7)} />
		))}
	</Svg>
);
export const MessFront: React.FC<PlaceProps> = ({f, p = {}}) => {
	const plates = p.plates ?? 1;
	const steam = p.steam ?? 1;
	return (
		<Svg>
			<defs>
				<G id="ms-f" stops={[[0, '#55665c'], [1, '#2c3832']]} />
			</defs>
			<rect x={-700} y={880} width={3400} height={500} fill="url(#ms-f)" />
			<rect x={-700} y={880} width={3400} height={10} fill="#1f2924" />
			{Array.from({length: 24}).map((_, i) => (
				<line key={i} x1={-600 + i * 170} y1={890} x2={-900 + i * 210} y2={1300} stroke="#26332d" strokeWidth={2} />
			))}
			{(p.chair ?? 0) > 0 ? <Chair x={1700} y={800} facing={-1} /> : null}
			{/* far table row (hot food) */}
			<rect x={-700} y={720} width={3400} height={18} fill="#c9b690" />
			<rect x={-700} y={736} width={3400} height={150} fill="#7f6a46" />
			{Array.from({length: 22}).map((_, i) => {
				const x = -520 + i * 160;
				return (
					<g key={i} opacity={plates}>
						<ellipse cx={x} cy={716} rx={44} ry={9} fill="#f1efe6" />
						<ellipse cx={x} cy={714} rx={30} ry={6} fill="#c9783a" />
						{steam > 0
							? [0, 1].map((j) => {
									const t = ((f / 40 + i * 0.37 + j * 0.5) % 1);
									return <path key={j} d={`M${x - 8 + j * 14},${708 - t * 90} q10,-14 0,-28 q-10,-14 0,-28`} stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={(1 - t) * 0.5 * steam} />;
								})
							: null}
					</g>
				);
			})}
		</Svg>
	);
};
export const MessOver: React.FC<PlaceProps> = ({f, p = {}}) => {
	const plates = p.plates ?? 1;
	const card = p.card ?? 0;
	return (
		<Svg>
			{/* near table: crew sit behind it */}
			<rect x={-700} y={756} width={3400} height={20} fill="#d3bf94" />
			<rect x={-700} y={756} width={3400} height={8} fill="#ead9b0" />
			<rect x={-700} y={776} width={3400} height={160} fill="#7f6a46" />
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
				<ellipse key={i} cx={-560 + i * 230} cy={752} rx={46} ry={9} fill="#f1efe6" opacity={plates} />
			))}
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
				<ellipse key={'f' + i} cx={-560 + i * 230} cy={750} rx={30} ry={6} fill="#c9783a" opacity={(p.food ?? 1) * plates} />
			))}
			{card > 0 ? (
				<g transform="translate(1700,756)">
					<path d={card < 1.5 ? 'M-34,0 h68 v-4 h-68 z' : 'M-30,0 h60 l-4,-50 h-52 z'} fill={card < 1.5 ? '#8a8f95' : '#fbfaf3'} stroke="#3a3f45" strokeWidth={3} />
				</g>
			) : null}
		</Svg>
	);
};

/* ----------------------------------- galley ----------------------------------- */
export const GalleyBack: React.FC<PlaceProps> = ({f}) => (
	<Svg>
		<defs>
			<G id="gl-w" stops={[[0, '#cfd8d2'], [1, '#b2beb6']]} />
		</defs>
		<rect x={-700} y={-300} width={3400} height={1300} fill="url(#gl-w)" />
		{Array.from({length: 40}).map((_, i) => (
			<line key={i} x1={-700 + i * 90} y1={-300} x2={-700 + i * 90} y2={1000} stroke="#98a59d" strokeWidth={2} opacity={0.5} />
		))}
		{Array.from({length: 12}).map((_, i) => (
			<line key={i} x1={-700} y1={-120 + i * 100} x2={2700} y2={-120 + i * 100} stroke="#98a59d" strokeWidth={2} opacity={0.5} />
		))}
		{/* hanging pots */}
		<rect x={200} y={180} width={500} height={10} fill="#555" />
		{[0, 1, 2, 3].map((i) => (
			<g key={i} transform={`translate(${250 + i * 120},190) rotate(${Math.sin(f / 30 + i) * 2})`}>
				<line x1={0} y1={0} x2={0} y2={30} stroke="#555" strokeWidth={4} />
				<path d="M-34,30 h68 v50 a14,14 0 0 1 -14,14 h-40 a14,14 0 0 1 -14,-14 z" fill={i % 2 ? '#8a95a0' : '#b0b9c2'} />
			</g>
		))}
		<Tube x={760} y={20} w={260} on={flick(f, 2)} />
		<Tube x={1500} y={20} w={260} on={flick(f, 7)} />
	</Svg>
);
export const GalleyFront: React.FC<PlaceProps> = ({f, p = {}}) => {
	const kettle = p.kettle ?? 1; // 1 whistling, 0 off
	const board = p.board ?? 0; // 0..1 how much of the rules is written
	const tear = p.tear ?? 0;
	const warm = p.warm ?? 0;
	const l1 = 'Count the crew every hour.';
	const l2 = 'If the number changes,';
	const l3 = 'do not say it out loud.';
	const show = (s: string, a: number, b: number) => s.slice(0, Math.round(s.length * Math.max(0, Math.min(1, (board - a) / (b - a)))));
	return (
		<Svg>
			<rect x={-700} y={880} width={3400} height={500} fill="#6c7a74" />
			<rect x={-700} y={880} width={3400} height={10} fill="#2c3834" />
			{/* steel counter + stove */}
			<rect x={80} y={620} width={820} height={270} fill="#8e9aa4" />
			<rect x={80} y={600} width={820} height={30} fill="#c9d3da" />
			<rect x={80} y={600} width={820} height={8} fill="#e6edf1" />
			{[0, 1, 2].map((i) => (
				<rect key={i} x={110 + i * 260} y={660} width={230} height={190} rx={6} fill="#6f7b85" stroke="#56626c" strokeWidth={4} />
			))}
			<rect x={500} y={560} width={240} height={46} fill="#2b2f36" />
			<ellipse cx={560} cy={556} rx={44} ry={8} fill="#1b1e24" />
			{/* kettle */}
			<g transform={`translate(560,556)`}>
				<path d="M-40,0 h80 l-8,-60 q-32,-30 -64,0 z" fill="#c9d3da" stroke="#8e9aa4" strokeWidth={4} />
				<path d="M-34,-56 q34,-52 68,0" stroke="#555" strokeWidth={9} fill="none" />
				<path d="M36,-34 l34,-24 l8,10 l-30,24" fill="#c9d3da" />
				{kettle > 0
					? [0, 1, 2, 3].map((i) => {
							const t = ((f / 22 + i / 4) % 1);
							return <circle key={i} cx={80 + t * 70} cy={-70 - t * 120 + Math.sin(f / 5 + i) * 8} r={10 + t * 30} fill="#fff" opacity={(1 - t) * 0.65 * kettle} />;
						})
					: null}
			</g>
			{warm > 0 ? <ellipse cx={560} cy={556} rx={80} ry={14} fill="#ff9a3a" opacity={0.4 * warm} /> : null}
			{/* teapot */}
			<g transform="translate(300,598)">
				<ellipse cx={0} cy={-34} rx={46} ry={38} fill="#e9e4d6" stroke="#b9b29c" strokeWidth={4} />
				<rect x={-18} y={-80} width={36} height={14} rx={6} fill="#c9c2ac" />
				<path d="M44,-40 q36,-6 40,-30" stroke="#b9b29c" strokeWidth={10} fill="none" strokeLinecap="round" />
				<path d="M-44,-44 q-40,0 -30,34" stroke="#b9b29c" strokeWidth={9} fill="none" strokeLinecap="round" />
				{warm > 0
					? [0, 1].map((i) => {
							const t = ((f / 36 + i / 2) % 1);
							return <path key={i} d={`M${-8 + i * 16},${-84 - t * 70} q10,-12 0,-24`} stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={(1 - t) * 0.5 * warm} />;
						})
					: null}
			</g>
			{/* door frame, right side */}
			<rect x={1000} y={180} width={190} height={710} fill="#1d2723" />
			<rect x={1000} y={180} width={190} height={710} fill="none" stroke="#3c4a44" strokeWidth={14} />
			<rect x={1190} y={180} width={20} height={710} fill="#2c3834" />
			{/* whiteboard */}
			<g transform="translate(1280,190)">
				<rect x={-12} y={-12} width={664} height={444} rx={10} fill="#8a96a0" />
				<rect x={0} y={0} width={640} height={420} rx={6} fill="#f6f7f4" />
				<text x={26} y={74} fontFamily={HAND} fontSize={44} fontWeight={700} fill="#111" letterSpacing={1}>
					{show(l1, 0, 0.34).toUpperCase()}
				</text>
				<text x={26} y={134} fontFamily={HAND} fontSize={44} fontWeight={700} fill="#111" letterSpacing={1}>
					{show(l2, 0.34, 0.6).toUpperCase()}
				</text>
				<text x={26} y={194} fontFamily={HAND} fontSize={44} fontWeight={700} fill="#c0392b" letterSpacing={1}>
					{show(l3, 0.6, 0.86).toUpperCase()}
				</text>
				{/* tally: 22 lines + a 23rd scratched out */}
				{board > 0.9
					? Array.from({length: 22}).map((_, i) => {
							const g = Math.floor(i / 5);
							const j = i % 5;
							const x = 40 + (i % 11) * 44 + 0;
							const row = Math.floor(i / 11);
							return <line key={i} x1={x} y1={266 + row * 70} x2={x + 4} y2={316 + row * 70} stroke="#111" strokeWidth={6} strokeLinecap="round" opacity={board > 0.9 + (i / 22) * 0.1 ? 1 : 0} />;
						})
					: null}
				{tear > 0 ? (
					<g opacity={tear}>
						<line x1={430} y1={266 + 70} x2={436} y2={316 + 70} stroke="#111" strokeWidth={6} strokeLinecap="round" />
						<path d="M410,330 l50,48 M462,326 l-56,54 M404,350 l66,2 M416,320 l44,66" stroke="#b6322a" strokeWidth={7} strokeLinecap="round" />
						<path d="M400,370 l30,-14 l12,22 l26,-10 l14,24" stroke="#cfd2cc" strokeWidth={10} fill="none" />
					</g>
				) : null}
			</g>
		</Svg>
	);
};

/* ----------------------------------- bridge ----------------------------------- */
export const BridgeBack: React.FC<PlaceProps> = ({f, k = 1, p = {}}) => {
	const fog = p.fog ?? 1;
	return (
		<Svg>
			<defs>
				<G id="br-w" stops={[[0, '#2a3a44'], [1, '#1b262e']]} />
			</defs>
			<rect x={-700} y={-300} width={3400} height={1300} fill="url(#br-w)" />
			{/* big windows with night sea */}
			{[0, 1, 2, 3].map((i) => (
				<g key={i}>
					<rect x={80 + i * 440} y={120} width={400} height={400} fill={mix('#6a88b8', '#060c24', k)} />
					<rect x={80 + i * 440} y={330} width={400} height={190} fill={mix('#1a3050', '#03060f', k)} />
					<path d={`M${80 + i * 440},${400 + Math.sin(f / 15 + i) * 5} q50,-12 100,0 t100,0 t100,0 t100,0`} stroke="#8fb0e8" strokeWidth={3} fill="none" opacity={0.35} />
					<rect x={80 + i * 440} y={120} width={400} height={400} fill="#dfe8e6" opacity={0.55 * fog} />
					<path d={`M${110 + i * 440},150 q8,90 0,170 M${240 + i * 440},140 q-8,110 4,200 M${380 + i * 440},160 q10,100 2,180`} stroke="#fff" strokeWidth={9} fill="none" opacity={0.45 * fog} strokeLinecap="round" />
					<rect x={80 + i * 440} y={120} width={400} height={400} fill="none" stroke="#10181e" strokeWidth={16} />
				</g>
			))}
			<Tube x={900} y={20} w={300} on={flick(f, 3, 0.7)} c="#d8f0d0" />
		</Svg>
	);
};
export const BridgeFront: React.FC<PlaceProps> = ({f, p = {}}) => (
	<Svg>
		<rect x={-700} y={880} width={3400} height={500} fill="#33424a" />
		<rect x={-700} y={880} width={3400} height={10} fill="#10181e" />
		{/* console */}
		<rect x={-100} y={640} width={1300} height={250} fill="#27343c" />
		<rect x={-100} y={620} width={1300} height={30} fill="#3c4d57" />
		{Array.from({length: 26}).map((_, i) => (
			<circle key={i} cx={-40 + i * 48} cy={680 + (i % 3) * 34} r={7} fill={['#4be37a', '#ffd34a', '#ff5a4a'][i % 3]} opacity={0.5 + 0.5 * Math.sin(f / (8 + (i % 5)) + i) ** 2} />
		))}
		<rect x={760} y={560} width={300} height={80} fill="#0b1a14" />
		<text x={780} y={612} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#4be37a" opacity={0.85}>
			CREW 23
		</text>
		{/* radar */}
		<circle cx={120} cy={500} r={120} fill="#08140e" stroke="#2c4034" strokeWidth={10} />
		{[40, 80, 120].map((r) => (
			<circle key={r} cx={120} cy={500} r={r - 4} fill="none" stroke="#2f7a4c" strokeWidth={2} opacity={0.7} />
		))}
		<path d={`M120,500 L${120 + Math.cos(f / 12) * 116},${500 + Math.sin(f / 12) * 116}`} stroke="#6dff9c" strokeWidth={4} />
		<path d={`M120,500 L${120 + Math.cos(f / 12 - 0.35) * 116},${500 + Math.sin(f / 12 - 0.35) * 116}`} stroke="#6dff9c" strokeWidth={3} opacity={0.4} />
		{/* ship wheel */}
		<g transform={`translate(1500,700) rotate(${p.wheel ?? 0})`}>
			<circle r={110} fill="none" stroke="#8a5a30" strokeWidth={16} />
			{Array.from({length: 8}).map((_, i) => (
				<line key={i} x1={0} y1={0} x2={Math.cos((i / 8) * 6.283) * 140} y2={Math.sin((i / 8) * 6.283) * 140} stroke="#8a5a30" strokeWidth={12} strokeLinecap="round" />
			))}
			<circle r={22} fill="#c9a060" />
		</g>
		<rect x={1480} y={780} width={40} height={110} fill="#2c3840" />
		{/* captain-less chart desk with the ship's log */}
		<rect x={1280} y={760} width={520} height={14} fill="#a98a5a" />
		<rect x={1300} y={774} width={20} height={116} fill="#6e5736" />
		<rect x={1760} y={774} width={20} height={116} fill="#6e5736" />
	</Svg>
);

/* ----------------------------------- office ----------------------------------- */
export const OfficeBack: React.FC<PlaceProps> = ({f, p = {}}) => {
	const pins = Math.round(p.pins ?? 22);
	return (
		<Svg>
			<defs>
				<G id="of-w" stops={[[0, '#9a8a6a'], [1, '#7c6c52']]} />
			</defs>
			<rect x={-700} y={-300} width={3400} height={1300} fill="url(#of-w)" />
			<rect x={-700} y={560} width={3400} height={330} fill="#5a4a38" />
			<rect x={-700} y={556} width={3400} height={10} fill="#2c2218" />
			{/* wall of passport photos: 2 rows x 11 */}
			<rect x={50} y={110} width={1520} height={400} rx={8} fill="#c7a76a" stroke="#6b5230" strokeWidth={10} />
			{Array.from({length: 22}).map((_, i) => {
				const col = i % 11;
				const row = Math.floor(i / 11);
				const x = 84 + col * 136;
				const y = 144 + row * 180;
				const shirt = ['#d8553a', '#2f6fd8', '#3aa37a', '#e86aa0', '#f08a3c', '#8b5cf6', '#3fc1c9', '#9aa3b5'][i % 8];
				return (
					<g key={i} opacity={i < pins ? 1 : 0} transform={`rotate(${((i * 7) % 5) - 2} ${x + 52} ${y + 70})`}>
						<rect x={x} y={y} width={104} height={140} fill="#f4f1e6" />
						<rect x={x + 8} y={y + 8} width={88} height={102} fill="#7a96b5" />
						<circle cx={x + 52} cy={y + 52} r={26} fill="#0a0a0a" />
						<path d={`M${x + 12},${y + 110} q40,-52 80,0 z`} fill={shirt} />
						<circle cx={x + 52} cy={y - 2} r={4} fill="#d23b3b" />
					</g>
				);
			})}
			<rect x={1650} y={150} width={260} height={360} fill="#2c3a44" stroke="#10181e" strokeWidth={10} />
			<rect x={1680} y={180} width={200} height={300} fill="#a8b4bc" opacity={0.28} />
			<Tube x={760} y={20} w={260} on={flick(f, 9, 0.5)} />
		</Svg>
	);
};
export const OfficeFront: React.FC<PlaceProps> = ({f, p = {}}) => {
	const open = p.safe ?? 0;
	return (
		<Svg>
			<rect x={-700} y={880} width={3400} height={500} fill="#3e3228" />
			<rect x={-700} y={880} width={3400} height={10} fill="#1a140e" />
			{/* desk */}
			<rect x={140} y={700} width={820} height={22} rx={4} fill="#a07a4a" />
			<rect x={160} y={722} width={780} height={168} fill="#5a4326" />
			<rect x={650} y={640} width={90} height={60} rx={6} fill="#2a3a30" />
			<path d="M690,640 l-50,-90 h160 l-50,90z" fill="#f0c864" opacity={0.0} />
			<rect x={190} y={672} width={150} height={28} fill="#f4f1e6" transform="rotate(-3 265 686)" />
			{/* safe */}
			<rect x={1180} y={560} width={340} height={330} rx={10} fill="#4a525c" stroke="#1d242c" strokeWidth={10} />
			<rect x={1204} y={584} width={292} height={282} rx={6} fill="#5e6874" />
			{open < 0.5 ? (
				<>
					<circle cx={1350} cy={725} r={64} fill="#3b434d" stroke="#aab4be" strokeWidth={8} />
					<circle cx={1350} cy={725} r={10} fill="#e0e6ea" />
					<line x1={1350} y1={725} x2={1350 + Math.sin(f / 12) * 44} y2={725 - Math.cos(f / 12) * 44} stroke="#e0e6ea" strokeWidth={6} strokeLinecap="round" />
				</>
			) : (
				<>
					<rect x={1220} y={604} width={260} height={242} fill="#14181d" />
					<rect x={1240} y={700} width={150} height={100} fill="#f4f1e6" transform="rotate(-6 1315 750)" />
					<polygon points="1204,584 1130,540 1130,890 1204,866" fill="#7c8794" />
				</>
			)}
		</Svg>
	);
};

/* ----------------------------- helicopter over the sea ----------------------------- */
export const Helicopter: React.FC<{x: number; y: number; s?: number; f: number; tilt?: number; rope?: number; light?: number}> = ({x, y, s = 1, f, tilt = 0, rope = 0, light = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
		<ellipse cx={0} cy={0} rx={150} ry={80} fill="#1d2430" />
		<path d="M90,-10 L420,-30 L420,10 L90,40 Z" fill="#1d2430" />
		<path d="M-120,-40 q-30,-30 20,-52 h60 q60,20 40,70 z" fill="#8fb4d8" opacity={0.85} />
		<rect x={-40} y={-92} width={20} height={36} fill="#10141c" />
		<g transform={`translate(-30,-96)`}>
			<ellipse cx={0} cy={0} rx={380} ry={11} fill="#8f98a6" opacity={0.28 + 0.2 * Math.sin(f * 1.7)} />
			<ellipse cx={Math.sin(f * 0.9) * 140} cy={0} rx={170} ry={4} fill="#10141c" opacity={0.75} />
		</g>
		<g transform="translate(410,-10)">
			<ellipse cx={0} cy={0} rx={10} ry={52} fill="#8f98a6" opacity={0.4 + 0.2 * Math.sin(f * 2)} />
		</g>
		<rect x={-130} y={78} width={250} height={9} rx={4} fill="#10141c" />
		<line x1={-70} y1={70} x2={-80} y2={82} stroke="#10141c" strokeWidth={6} />
		<line x1={60} y1={70} x2={70} y2={82} stroke="#10141c" strokeWidth={6} />
		<circle cx={150} cy={50} r={9 + 3 * Math.sin(f / 4)} fill="#ff4a3a" opacity={light} />
		<path d={`M-110,60 L-420,${420 * light}`} stroke="#fff3c0" strokeWidth={0} />
		{rope > 0 ? <line x1={-30} y1={80} x2={-30} y2={80 + rope * 500} stroke="#d9c9a0" strokeWidth={5} /> : null}
	</g>
);

/* the crew: a row of N identical-looking sailors in work gear */
const WORK = ['#e8742a', '#2f4a7a', '#8a95a0', '#3a8a6a', '#c9a23a', '#a84a3a'];
export const Crew: React.FC<{n: number; x0: number; x1: number; floor: number; s?: number; f: number; seat?: number; facing?: 1 | -1; look?: [number, number]; stand?: number; skip?: number[]; dx?: number; walking?: boolean; sag?: number}> = ({n, x0, x1, floor, s = 1, f, seat, facing = 1, look = [0, 0], stand = 1, skip = [], dx = 0, walking = false, sag = 0}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			if (skip.includes(i)) return null;
			const x = x0 + ((x1 - x0) * (i + 0.5)) / n + dx;
			const r = random('crew' + i);
			const sit = seat !== undefined && stand < 0.5;
			const base: any = sit
				? {lean: -2 - sag * 7, head: 0, armB: [20, 70], armF: [24, 68], legB: [88, 85], legF: [92, 90]}
				: walking
					? walk(f * 0.32 + i * 1.9)
					: idle(f, i * 1.7);
			const pose = {...base, lean: base.lean - sag * 6};
			return (
				<Stickman
					key={i}
					id={'cw' + i + Math.round(x0)}
					x={x}
					y={(sit ? seat : floor - 157 * s) as number}
					scale={s}
					facing={facing}
					pose={pose as any}
					color={WORK[Math.floor(random('cc' + i) * WORK.length)]}
					outfit={i % 4 === 2 ? 'tee' : 'hoodie'}
					hair={(['short', 'cap', 'none', 'bun', 'bob', 'spiky'] as const)[Math.floor(r * 6)]}
					hairColor="#2b2b34"
					rim="#dfe6ff"
					rimW={2}
					expr="normal"
					mouth="line"
					look={look}
					blink={0}
					faceTurn={0.1}
				/>
			);
		})}
	</g>
);

export type PlaceName = 'deck' | 'hall' | 'cabin' | 'mess' | 'galley' | 'bridge' | 'office' | 'sea';
const NONE: React.FC<PlaceProps> = () => null;
export const PLACES: Record<PlaceName, {Back: React.FC<PlaceProps>; Front: React.FC<PlaceProps>; Over: React.FC<PlaceProps>; bg: string; light: {x: number; y: number; o: number; c?: string; night?: boolean}}> = {
	deck: {Back: DeckBack, Front: DeckFront, Over: DeckOver, bg: '#0c1226', light: {x: 70, y: 12, o: 0.42}},
	sea: {Back: DeckBack, Front: SeaFront, Over: NONE, bg: '#0c1226', light: {x: 70, y: 12, o: 0.4}},
	hall: {Back: HallBack, Front: HallFront, Over: NONE, bg: '#1b2420', light: {x: 50, y: 4, o: 0.35, c: '230,255,200'}},
	cabin: {Back: CabinBack, Front: CabinFront, Over: NONE, bg: '#1b2420', light: {x: 50, y: 4, o: 0.3, c: '230,255,200'}},
	mess: {Back: MessBack, Front: MessFront, Over: MessOver, bg: '#1b2420', light: {x: 40, y: 4, o: 0.36, c: '240,255,210'}},
	galley: {Back: GalleyBack, Front: GalleyFront, Over: NONE, bg: '#1b2420', light: {x: 45, y: 4, o: 0.36, c: '240,255,220'}},
	bridge: {Back: BridgeBack, Front: BridgeFront, Over: NONE, bg: '#0b1218', light: {x: 50, y: 4, o: 0.25, c: '170,230,190', night: true}},
	office: {Back: OfficeBack, Front: OfficeFront, Over: NONE, bg: '#2c2218', light: {x: 45, y: 4, o: 0.34, c: '255,225,170'}},
};
