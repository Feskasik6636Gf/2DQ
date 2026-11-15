import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten, mix} from '../engine/color';
import {Bedroom, Corridor, Kitchen, SchoolYard, Shop} from '../kit/sets';
import {Skyline, Sky} from '../reference/PauseTime';

/* Locations of this video. Every place is a background that fills the 1920x1080 world,
   floor line y = 900. `f` = global frame (drives gentle life), `o` = mood options. */
export type PlaceOpts = {night?: boolean; dim?: number; tint?: string};
type P = React.FC<{f: number; o: PlaceOpts}>;

const G: React.FC<{id: string; a: string; b: string; v?: boolean}> = ({id, a, b, v = true}) => (
	<linearGradient id={id} x1="0" y1="0" x2={v ? 0 : 1} y2={v ? 1 : 0}>
		<stop offset="0" stopColor={a} />
		<stop offset="1" stopColor={b} />
	</linearGradient>
);

const Ground: React.FC<{y?: number; c: string; id: string}> = ({y = 900, c, id}) => (
	<>
		<defs>
			<G id={id} a={lighten(c, 0.08)} b={darken(c, 0.25)} />
		</defs>
		<rect x={-400} y={y} width={2800} height={400} fill={`url(#${id})`} />
	</>
);

const Cloud: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = '#fff', o = 0.85}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
		<ellipse cx={0} cy={0} rx={120} ry={34} fill={c} />
		<ellipse cx={-60} cy={-22} rx={64} ry={40} fill={c} />
		<ellipse cx={30} cy={-34} rx={76} ry={46} fill={c} />
	</g>
);

const House: React.FC<{x: number; w?: number; h?: number; c: string; roof: string; lit?: boolean; id: string}> = ({x, w = 420, h = 340, c, roof, lit, id}) => (
	<g>
		<rect x={x} y={900 - h} width={w} height={h} fill={c} />
		<polygon points={`${x - 30},${900 - h} ${x + w / 2},${900 - h - 130} ${x + w + 30},${900 - h}`} fill={roof} />
		<rect x={x + w / 2 - 40} y={900 - 170} width={80} height={170} rx={6} fill={darken(c, 0.35)} />
		{[x + 50, x + w - 130].map((wx, i) => (
			<g key={i}>
				<rect x={wx} y={900 - h + 70} width={80} height={90} fill={lit ? '#ffe3a0' : '#bfe3f5'} />
				<rect x={wx + 38} y={900 - h + 70} width={4} height={90} fill={darken(c, 0.3)} />
				<rect x={wx} y={900 - h + 112} width={80} height={4} fill={darken(c, 0.3)} />
			</g>
		))}
		<rect x={x + 8} y={900 - 8} width={w - 16} height={8} fill="#000" opacity={0.12} />
		{id ? null : null}
	</g>
);

const Tree: React.FC<{x: number; s?: number; c?: string; bare?: boolean}> = ({x, s = 1, c = '#4aa04a', bare}) => (
	<g transform={`translate(${x},900) scale(${s})`}>
		<rect x={-14} y={-260} width={28} height={260} fill="#6b4a2a" />
		{bare ? (
			<g stroke="#4a3a32" strokeWidth={10} strokeLinecap="round" fill="none">
				<path d="M0,-250 L-90,-360 M0,-250 L80,-350 M-40,-310 L-130,-320 M30,-300 L110,-290 M0,-250 L0,-400" />
			</g>
		) : (
			<>
				<circle cx={0} cy={-300} r={120} fill={c} />
				<circle cx={-70} cy={-250} r={80} fill={darken(c, 0.15)} />
				<circle cx={80} cy={-260} r={86} fill={lighten(c, 0.12)} />
			</>
		)}
	</g>
);

/* -------- 1. server room (the grandma message lives here) -------- */
const Server: P = ({f, o}) => {
	const dead = o.dim ?? 0;
	return (
		<Svg>
			<defs>
				<G id="sv-w" a="#070b18" b="#101a33" />
				<radialGradient id="sv-glow" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="#59c8ff" stopOpacity={0.35 * (1 - dead)} />
					<stop offset="1" stopColor="#59c8ff" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-400} y={-300} width={2800} height={1400} fill="url(#sv-w)" />
			{/* overhead cable trays */}
			<rect x={-400} y={90} width={2800} height={26} fill="#1b2442" />
			{Array.from({length: 9}).map((_, i) => (
				<path key={i} d={`M${-200 + i * 300},116 q40,90 ${20 + (i % 3) * 20},170`} stroke={['#59c8ff', '#ff5a7a', '#ffd34a'][i % 3]} strokeWidth={7} fill="none" opacity={0.7} />
			))}
			{Array.from({length: 7}).map((_, r) => (
				<g key={r}>
					<rect x={-120 + r * 330} y={230} width={290} height={670} rx={8} fill="#0e1630" stroke="#25335f" strokeWidth={4} />
					{Array.from({length: 14}).map((__, k) => {
						const on = random('sv' + r + k + Math.floor(f / (6 + (k % 5)))) > 0.35 + dead * 0.6;
						const c = random('svc' + r + k) > 0.8 ? '#ff5a5a' : random('svd' + r + k) > 0.5 ? '#59c8ff' : '#5aff9a';
						return (
							<g key={k}>
								<rect x={-100 + r * 330} y={250 + k * 44} width={250} height={34} rx={4} fill="#17224a" />
								<circle cx={-80 + r * 330} cy={267 + k * 44} r={6} fill={c} opacity={on ? 1 : 0.12} />
								<circle cx={-60 + r * 330} cy={267 + k * 44} r={6} fill="#5aff9a" opacity={on && k % 2 ? 0.9 : 0.1} />
								<rect x={20 + r * 330} y={260 + k * 44} width={110} height={14} fill="#0b1130" />
							</g>
						);
					})}
				</g>
			))}
			<ellipse cx={960} cy={560} rx={900} ry={400} fill="url(#sv-glow)" />
			<rect x={-400} y={900} width={2800} height={300} fill="#0b1226" />
			<rect x={-400} y={900} width={2800} height={6} fill="#59c8ff" opacity={0.3 * (1 - dead)} />
		</Svg>
	);
};

/* -------- 2. void: moody burgundy/navy backdrop for graphic beats -------- */
const Void: P = ({f, o}) => (
	<Svg>
		<defs>
			<radialGradient id="vd-g" cx="0.5" cy="0.45" r="0.8">
				<stop offset="0" stopColor={o.tint ?? '#7a0f22'} />
				<stop offset="0.6" stopColor={darken(o.tint ?? '#7a0f22', 0.6)} />
				<stop offset="1" stopColor="#060106" />
			</radialGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1500} fill="url(#vd-g)" />
		{Array.from({length: 26}).map((_, i) => (
			<circle key={i} cx={random('vx' + i) * 2400 - 240 + Math.sin(f / (40 + i)) * 20} cy={random('vy' + i) * 1200 - 60 - ((f * (0.15 + random('vs' + i) * 0.3)) % 1200) + 1200 * 0} r={2 + random('vr' + i) * 6} fill="#ff4d6a" opacity={0.12 + random('vo' + i) * 0.2} />
		))}
		<rect x={-400} y={900} width={2800} height={300} fill="#000" opacity={0.28} />
	</Svg>
);

/* -------- 3. neighbourhood block (day or evening) -------- */
const Block: P = ({f, o}) => {
	const ev = o.night;
	return (
		<Svg>
			<defs>
				<G id="bk-s" a={ev ? '#3a2a5a' : '#8fd0f4'} b={ev ? '#ff9a6a' : '#eaf7ff'} />
			</defs>
			<rect x={-400} y={-300} width={2800} height={1250} fill="url(#bk-s)" />
			<circle cx={1500} cy={ev ? 520 : 170} r={ev ? 90 : 70} fill={ev ? '#ffd9a0' : '#fff6c8'} opacity={0.95} />
			<Cloud x={(300 + f * 0.3) % 2400 - 200} y={150} s={1.2} />
			<Cloud x={(1300 + f * 0.2) % 2400 - 200} y={260} s={0.9} />
			<House x={-80} c={ev ? '#9a6a7a' : '#f0c9a0'} roof={ev ? '#5a3a5a' : '#c9503a'} lit={ev} id="a" />
			<House x={520} w={480} h={380} c={ev ? '#6a7a9a' : '#a9d0e8'} roof={ev ? '#3a3a5a' : '#4a6fb0'} lit={ev} id="b" />
			<House x={1120} c={ev ? '#9a8a6a' : '#e8d98a'} roof={ev ? '#5a4a3a' : '#8a5a3a'} lit={ev} id="c" />
			<House x={1660} w={380} h={320} c={ev ? '#7a6a9a' : '#c9b0e8'} roof={ev ? '#3a2a5a' : '#6a4aa0'} lit={ev} id="d" />
			<Tree x={470} s={1.0} />
			<Tree x={1080} s={0.85} c="#5ab85a" />
			<rect x={-400} y={900} width={2800} height={40} fill={ev ? '#6a6a7a' : '#d9d2c4'} />
			<rect x={-400} y={940} width={2800} height={300} fill={ev ? '#3a3a4a' : '#5a5f6a'} />
			{Array.from({length: 12}).map((_, i) => (
				<rect key={i} x={-300 + i * 260} y={1010} width={130} height={10} fill="#e8d98a" opacity={0.7} />
			))}
			<rect x={-400} y={900} width={2800} height={6} fill="#000" opacity={0.1} />
		</Svg>
	);
};

/* -------- 4. supermarket parking lot -------- */
const Parking: P = ({f, o}) => (
	<Svg>
		<defs>
			<G id="pk-s" a={o.night ? '#1b1f3a' : '#9fb6c9'} b={o.night ? '#4a4a6a' : '#e1e8ee'} />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#pk-s)" />
		<Cloud x={(500 + f * 0.25) % 2400 - 200} y={170} s={1.4} c="#d8dde6" />
		{/* store facade */}
		<rect x={200} y={420} width={1500} height={480} fill="#e9e4d6" />
		<rect x={200} y={420} width={1500} height={90} fill="#2f7a4a" />
		<text x={950} y={490} fontSize={64} fontFamily="'Rubik', sans-serif" fontWeight={900} textAnchor="middle" fill="#fff" letterSpacing={10}>
			MARKET
		</text>
		<rect x={300} y={560} width={560} height={340} fill="#a9d0e8" opacity={0.9} />
		<rect x={1040} y={560} width={560} height={340} fill="#a9d0e8" opacity={0.9} />
		<rect x={880} y={600} width={140} height={300} fill="#cfeaf7" />
		<rect x={200} y={900} width={1500} height={30} fill="#bdb7a8" />
		<rect x={-400} y={930} width={2800} height={300} fill={o.night ? '#2a2c3a' : '#5a5e68'} />
		{Array.from({length: 10}).map((_, i) => (
			<rect key={i} x={-260 + i * 270} y={990} width={12} height={90} fill="#fff" opacity={0.6} transform={`skewX(-20)`} />
		))}
		{/* far cars */}
		{[[-50, '#d94a3a'], [1700, '#3a6fd2']].map(([x, c], i) => (
			<g key={i} transform={`translate(${x as number},930)`}>
				<rect x={0} y={-90} width={300} height={70} rx={26} fill={c as string} />
				<rect x={50} y={-140} width={190} height={60} rx={20} fill={darken(c as string, 0.1)} />
				<circle cx={70} cy={-14} r={28} fill="#14161f" />
				<circle cx={230} cy={-14} r={28} fill="#14161f" />
			</g>
		))}
	</Svg>
);

/* -------- 5. ocean floor with the glowing cable -------- */
const Ocean: P = ({f, o}) => {
	const cut = o.dim ?? 0;
	return (
		<Svg>
			<defs>
				<G id="oc-w" a="#16a0c8" b="#06203f" />
			</defs>
			<rect x={-400} y={-300} width={2800} height={1500} fill="url(#oc-w)" />
			{Array.from({length: 6}).map((_, i) => (
				<polygon key={i} points={`${200 + i * 330},-100 ${260 + i * 330},-100 ${i * 330 + 60 + Math.sin(f / 60 + i) * 40},900 ${i * 330 - 160 + Math.sin(f / 60 + i) * 40},900`} fill="#bff3ff" opacity={0.08} />
			))}
			{Array.from({length: 26}).map((_, i) => (
				<circle key={i} cx={random('ob' + i) * 2200 - 100} cy={((random('oy' + i) * 1300 - f * (0.6 + random('os' + i))) % 1300 + 1300) % 1300 - 150} r={3 + random('or' + i) * 9} fill="none" stroke="#d8fbff" strokeWidth={2} opacity={0.5} />
			))}
			{/* fish */}
			{[0, 1, 2, 3].map((i) => {
				const x = ((f * (1.2 + i * 0.4) + i * 600) % 2600) - 300;
				return (
					<g key={i} transform={`translate(${x},${220 + i * 120 + Math.sin(f / 20 + i) * 16})`} opacity={0.85}>
						<ellipse cx={0} cy={0} rx={46} ry={20} fill={['#ffb347', '#ff6a8a', '#ffe35a', '#9ae6ff'][i]} />
						<polygon points="-44,0 -74,-18 -74,18" fill={['#ffb347', '#ff6a8a', '#ffe35a', '#9ae6ff'][i]} />
						<circle cx={22} cy={-4} r={4} fill="#000" />
					</g>
				);
			})}
			<path d="M-400,870 Q300,820 800,880 T1700,860 T2400,880 L2400,1200 L-400,1200 Z" fill="#c9b27a" />
			<path d="M-400,930 Q300,900 800,950 T1700,930 T2400,950 L2400,1200 L-400,1200 Z" fill="#a8935e" />
			{[200, 700, 1250, 1750].map((x, i) => (
				<g key={i} transform={`translate(${x},900)`}>
					<ellipse cx={0} cy={0} rx={70 + i * 10} ry={44} fill="#5a6a78" />
					<ellipse cx={-14} cy={-10} rx={40} ry={20} fill="#7c8d9c" />
				</g>
			))}
			{[420, 1480].map((x, i) => (
				<g key={i} transform={`translate(${x},900)`} stroke={['#ff5a8a', '#ffb347'][i]} strokeWidth={14} strokeLinecap="round" fill="none">
					<path d="M0,0 L0,-120 M0,-60 L-40,-110 M0,-80 L40,-130" />
				</g>
			))}
			{/* the cable */}
			<path d="M-400,905 Q300,880 800,915 T1700,895 T2400,915" stroke="#10283a" strokeWidth={34} fill="none" />
			<path d="M-400,905 Q300,880 800,915 T1700,895 T2400,915" stroke={cut ? '#5a6a7a' : '#59c8ff'} strokeWidth={10} fill="none" strokeDasharray="30 22" strokeDashoffset={-f * 3} opacity={cut ? 0.5 : 0.95} />
		</Svg>
	);
};

/* -------- 6. hospital ward -------- */
const Hospital: P = ({f, o}) => (
	<Svg>
		<defs>
			<G id="hp-w" a={o.night ? '#6f8aa0' : '#e4f1f2'} b={o.night ? '#4f6a80' : '#c9e3e6'} />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#hp-w)" />
		<rect x={-400} y={560} width={2800} height={20} fill="#4fb8a6" />
		{[0, 1, 2, 3].map((i) => (
			<g key={i}>
				<rect x={90 + i * 520} y={-40} width={330} height={44} rx={10} fill="#fff" opacity={random('hl' + i + Math.floor(f / 14)) > 0.96 ? 0.3 : 0.95} />
				<rect x={110 + i * 520} y={300} width={200} height={600} fill="#d9eaec" stroke="#b6d3d6" strokeWidth={5} />
				<rect x={380 + i * 520} y={180} width={90} height={90} fill="#fff" stroke="#b6d3d6" strokeWidth={4} />
				<rect x={394 + i * 520} y={192} width={62} height={62} fill="#4fb8a6" opacity={0.7} />
			</g>
		))}
		{/* beds + dead monitor */}
		{[300, 1180].map((x, i) => (
			<g key={i}>
				<rect x={x} y={760} width={360} height={30} fill="#fff" />
				<rect x={x + 10} y={730} width={340} height={32} rx={14} fill="#a9d6e8" />
				<rect x={x} y={790} width={14} height={110} fill="#8aa0a8" />
				<rect x={x + 346} y={790} width={14} height={110} fill="#8aa0a8" />
				<rect x={x + 280} y={600} width={130} height={90} rx={10} fill="#1b2430" />
				<text x={x + 345} y={655} fontSize={24} textAnchor="middle" fontFamily="'Rubik', sans-serif" fill="#ff6a6a" opacity={0.5 + 0.5 * Math.sin(f / 5)}>
					OFFLINE
				</text>
			</g>
		))}
		<rect x={-400} y={900} width={2800} height={300} fill="#b8cfd2" />
		<rect x={-400} y={900} width={2800} height={8} fill="#fff" opacity={0.6} />
	</Svg>
);

/* -------- 7. living room (couch, lamp, window, closet) -------- */
const Living: P = ({f, o}) => {
	const n = o.night;
	return (
		<Svg>
			<defs>
				<G id="lv-w" a={n ? '#2a2646' : '#f3d9b4'} b={n ? '#3d3560' : '#e8c698'} />
			</defs>
			<rect x={-400} y={-300} width={2800} height={1250} fill="url(#lv-w)" />
			{/* window */}
			<rect x={1180} y={180} width={400} height={330} fill={n ? '#0b1030' : '#9fd2f0'} stroke={n ? '#8a84a8' : '#fff'} strokeWidth={14} />
			<line x1={1380} y1={180} x2={1380} y2={510} stroke={n ? '#8a84a8' : '#fff'} strokeWidth={8} />
			<rect x={1130} y={170} width={70} height={380} fill="#b8506a" />
			<rect x={1560} y={170} width={70} height={380} fill="#b8506a" />
			{/* closet */}
			<rect x={60} y={260} width={300} height={640} fill="#9a6a44" stroke="#6b4a2a" strokeWidth={8} />
			<rect x={80} y={280} width={125} height={600} fill="#b07c52" />
			<rect x={215} y={280} width={125} height={600} fill="#b07c52" />
			<circle cx={190} cy={600} r={9} fill="#f2d28a" />
			<circle cx={230} cy={600} r={9} fill="#f2d28a" />
			{/* bookshelf + frames */}
			{[0, 1, 2].map((r) => (
				<g key={r}>
					<rect x={760} y={300 + r * 130} width={300} height={10} fill="#6b4a2a" />
					{Array.from({length: 8}).map((_, i) => (
						<rect key={i} x={768 + i * 36} y={310 + r * 130 - 60 - random('bs' + r + i) * 30} width={30} height={60 + random('bs' + r + i) * 30} fill={['#d94a3a', '#3a6fd2', '#f2b21c', '#3aa37a', '#8b5cf6'][(i + r) % 5]} />
					))}
				</g>
			))}
			{/* rug */}
			<ellipse cx={960} cy={930} rx={620} ry={70} fill="#b8506a" opacity={0.55} />
			{/* couch */}
			<g>
				<rect x={640} y={640} width={640} height={250} rx={36} fill="#5a7aa8" />
				<rect x={600} y={700} width={90} height={200} rx={30} fill="#4a6a98" />
				<rect x={1230} y={700} width={90} height={200} rx={30} fill="#4a6a98" />
				<rect x={690} y={760} width={540} height={120} rx={22} fill="#6a8ab8" />
			</g>
			<g transform="translate(1700,0)">
				<rect x={-6} y={420} width={12} height={480} fill="#3a3a4a" />
				<polygon points="-70,420 70,420 40,340 -40,340" fill={n ? '#ffd69a' : '#f2e3b8'} />
				{n ? <circle cx={0} cy={420} r={220} fill="#ffd69a" opacity={0.12 + 0.02 * Math.sin(f / 9)} /> : null}
			</g>
			<rect x={-400} y={900} width={2800} height={300} fill={n ? '#3a3050' : '#c79a6a'} />
		</Svg>
	);
};

/* -------- 8. rooftop at night -------- */
const Roof: P = ({f}) => (
	<>
		<Sky wt={f} />
		<Skyline wt={f} />
		<Svg>
			<rect x={-400} y={880} width={2800} height={400} fill="#14162e" />
			<rect x={-400} y={880} width={2800} height={10} fill="#3a3f7a" />
			{[300, 1500].map((x, i) => (
				<g key={i}>
					<rect x={x} y={640} width={120} height={240} fill="#1d2142" />
					<rect x={x - 10} y={630} width={140} height={20} fill="#2a2f5a" />
				</g>
			))}
			{Array.from({length: 4}).map((_, i) => (
				<g key={i} stroke="#2a2f5a" strokeWidth={6}>
					<line x1={1100 + i * 40} y1={880} x2={1100 + i * 40} y2={600 - i * 20} />
				</g>
			))}
		</Svg>
	</>
);

/* -------- 9. graveyard / funeral -------- */
const Grave: P = ({f}) => (
	<Svg>
		<defs>
			<G id="gv-s" a="#6a6f8a" b="#d9cfd4" />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#gv-s)" />
		<Cloud x={(400 + f * 0.2) % 2400 - 200} y={160} s={1.6} c="#c9c6d4" o={0.6} />
		<Tree x={300} bare s={1.2} />
		<Tree x={1650} bare s={1.4} />
		<rect x={-400} y={880} width={2800} height={400} fill="#5f7a5a" />
		<rect x={-400} y={880} width={2800} height={16} fill="#7f9a78" />
		{[560, 760, 1160, 1360].map((x, i) => (
			<g key={i} transform={`translate(${x},880)`}>
				<rect x={-44} y={-120 - (i % 2) * 20} width={88} height={120 + (i % 2) * 20} rx={40} fill="#aeb2bf" />
				<rect x={-6} y={-90} width={12} height={46} fill="#8a8e9c" />
				<rect x={-22} y={-74} width={44} height={10} fill="#8a8e9c" />
			</g>
		))}
		{Array.from({length: 18}).map((_, i) => (
			<ellipse key={i} cx={((f * (0.8 + random('lf' + i)) + i * 140) % 2400) - 200} cy={200 + ((f * 1.3 + i * 77) % 700)} rx={9} ry={5} fill="#c98a4a" opacity={0.7} transform={`rotate(${f * 4 + i * 20} ${i} ${i})`} />
		))}
	</Svg>
);

/* -------- 10. farm -------- */
const Farm: P = ({f}) => (
	<Svg>
		<defs>
			<G id="fm-s" a="#74c0ee" b="#f4fbff" />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#fm-s)" />
		<circle cx={400} cy={160} r={70} fill="#fff6c8" />
		<Cloud x={(900 + f * 0.3) % 2400 - 200} y={190} s={1.3} />
		<path d="M-400,720 Q300,560 900,700 T2400,660 L2400,1000 L-400,1000 Z" fill="#8cc860" />
		<path d="M-400,800 Q500,680 1200,790 T2400,760 L2400,1000 L-400,1000 Z" fill="#6fb04a" />
		{/* barn */}
		<g transform="translate(1250,0)">
			<rect x={0} y={560} width={360} height={340} fill="#c4412e" />
			<polygon points="-30,560 180,420 390,560" fill="#8a2a1c" />
			<rect x={110} y={680} width={140} height={220} fill="#7a2418" />
			<line x1={110} y1={680} x2={250} y2={900} stroke="#e8c9b0" strokeWidth={8} />
			<line x1={250} y1={680} x2={110} y2={900} stroke="#e8c9b0" strokeWidth={8} />
		</g>
		{/* windmill */}
		<g transform="translate(300,520)">
			<polygon points="-40,380 40,380 18,0 -18,0" fill="#eee" />
			<g transform={`rotate(${f * 1.5})`}>
				{[0, 90, 180, 270].map((a) => (
					<rect key={a} x={-8} y={-180} width={16} height={180} fill="#ddd" transform={`rotate(${a})`} />
				))}
			</g>
			<circle r={16} fill="#c4412e" />
		</g>
		{/* fence */}
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-100 + i * 160} y={820} width={14} height={90} fill="#f5ead0" />
		))}
		<rect x={-400} y={850} width={2800} height={12} fill="#f5ead0" />
		<rect x={-400} y={880} width={2800} height={12} fill="#f5ead0" />
		<rect x={-400} y={910} width={2800} height={300} fill="#8a6a3f" />
		<rect x={-400} y={900} width={2800} height={14} fill="#a8854f" />
	</Svg>
);

/* -------- 11. library in the school basement -------- */
const Library: P = ({f}) => (
	<Svg>
		<defs>
			<G id="lb-w" a="#6a4a34" b="#3d2a1e" />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#lb-w)" />
		{[0, 1, 2, 3, 4].map((c) => (
			<g key={c} transform={`translate(${-40 + c * 420},0)`}>
				<rect x={0} y={140} width={360} height={760} fill="#4a3322" stroke="#2c1e14" strokeWidth={6} />
				{[0, 1, 2, 3, 4].map((r) => (
					<g key={r}>
						<rect x={0} y={260 + r * 124} width={360} height={10} fill="#2c1e14" />
						{Array.from({length: 9}).map((_, i) => {
							const h = 60 + random('lb' + c + r + i) * 44;
							return <rect key={i} x={12 + i * 38} y={260 + r * 124 - h} width={32} height={h} fill={['#d94a3a', '#3a6fd2', '#f2b21c', '#3aa37a', '#8b5cf6', '#ff8fb8'][(c + r + i) % 6]} opacity={0.9} />;
						})}
					</g>
				))}
			</g>
		))}
		{[300, 960, 1620].map((x, i) => (
			<g key={i}>
				<line x1={x} y1={-100} x2={x} y2={90} stroke="#222" strokeWidth={6} />
				<polygon points={`${x - 60},120 ${x + 60},120 ${x + 30},80 ${x - 30},80`} fill="#ffe3a0" />
				<ellipse cx={x} cy={500} rx={420} ry={420} fill="#ffe3a0" opacity={0.045 + 0.01 * Math.sin(f / 10 + i)} />
			</g>
		))}
		<rect x={-400} y={900} width={2800} height={300} fill="#7a5a3a" />
	</Svg>
);

/* -------- 12. chalk classroom -------- */
const Chalk: P = ({f}) => (
	<Svg>
		<defs>
			<G id="ch-w" a="#d9c9a0" b="#b9a578" />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#ch-w)" />
		<rect x={320} y={200} width={1280} height={520} rx={12} fill="#2f4a3c" stroke="#8a5a34" strokeWidth={22} />
		<rect x={320} y={720} width={1280} height={26} fill="#8a5a34" />
		{[0, 1, 2].map((i) => (
			<rect key={i} x={1750 + i * 0} y={160 + i * 0} width={200} height={300} fill="#a9d0e8" opacity={i === 0 ? 1 : 0} stroke="#fff" strokeWidth={12} />
		))}
		<rect x={-400} y={900} width={2800} height={300} fill="#a57a4a" />
		{[200, 1500].map((x, i) => (
			<g key={i}>
				<rect x={x} y={780} width={220} height={20} fill="#c9a06a" />
				<rect x={x + 20} y={800} width={12} height={110} fill="#4a4a56" />
				<rect x={x + 188} y={800} width={12} height={110} fill="#4a4a56" />
			</g>
		))}
		<text x={f > -1 ? 960 : 0} y={330} textAnchor="middle" fontSize={0} fill="#fff" />
	</Svg>
);

/* -------- 13. warehouse / depot -------- */
const Depot: P = () => (
	<Svg>
		<defs>
			<G id="dp-w" a="#4a5260" b="#2f353f" />
		</defs>
		<rect x={-400} y={-300} width={2800} height={1250} fill="url(#dp-w)" />
		{[0, 1, 2, 3].map((i) => (
			<g key={i}>
				<rect x={60 + i * 480} y={260} width={420} height={640} fill="none" stroke="#e08a2a" strokeWidth={14} />
				{[0, 1, 2].map((r) => (
					<g key={r}>
						<rect x={60 + i * 480} y={400 + r * 160} width={420} height={12} fill="#e08a2a" />
						{[0, 1, 2].map((k) => (
							<rect key={k} x={84 + i * 480 + k * 130} y={400 + r * 160 - 100 + (k % 2) * 14} width={110} height={100 - (k % 2) * 14} fill="#c9a06a" stroke="#8a6a3f" strokeWidth={4} />
						))}
					</g>
				))}
			</g>
		))}
		<rect x={-400} y={900} width={2800} height={300} fill="#3a3f4a" />
		<rect x={-400} y={900} width={2800} height={8} fill="#e8c84a" opacity={0.6} />
	</Svg>
);

/* -------- 14. wide sky of numbers: a globe / map scene backdrop -------- */
const Night: P = ({f}) => (
	<>
		<Sky wt={f} />
		<Svg>
			<rect x={-400} y={880} width={2800} height={400} fill="#171a36" />
		</Svg>
	</>
);

export type PlaceKey = 'server' | 'void' | 'block' | 'parking' | 'ocean' | 'hospital' | 'living' | 'roof' | 'grave' | 'farm' | 'library' | 'chalk' | 'depot' | 'night' | 'bedroom' | 'kitchen' | 'shop' | 'hall' | 'yard';

export const PLACES: Record<PlaceKey, P> = {
	server: Server,
	void: Void,
	block: Block,
	parking: Parking,
	ocean: Ocean,
	hospital: Hospital,
	living: Living,
	roof: Roof,
	grave: Grave,
	farm: Farm,
	library: Library,
	chalk: Chalk,
	depot: Depot,
	night: Night,
	bedroom: ({f, o}) => <Bedroom f={f} night={o.night} />,
	kitchen: ({o}) => <Kitchen night={o.night} />,
	shop: ({f}) => <Shop f={f} />,
	hall: ({f}) => <Corridor f={f} />,
	yard: ({f}) => <SchoolYard f={f} />,
};

export const mixc = mix;
