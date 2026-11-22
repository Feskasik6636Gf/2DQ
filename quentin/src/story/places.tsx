import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';

/* Locations of this video: a pro kitchen, a dining room, a street, a lab, a walk-in fridge,
   a "fact" backdrop. Flat, big shapes, one light source and living details (steam, flames,
   candles, neon, bubbles). All are drawn in the 1920x1080 world; floor line y = 900. */

const G: React.FC<{id: string; stops: [number, string][]; x2?: number; y2?: number}> = ({id, stops, x2 = 0, y2 = 1}) => (
	<linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
		{stops.map(([o, c], i) => (
			<stop key={i} offset={o} stopColor={c} />
		))}
	</linearGradient>
);

const Steam: React.FC<{f: number; x: number; y: number; n?: number; s?: number; c?: string; seed?: string}> = ({f, x, y, n = 4, s = 1, c = '#ffffff', seed = 'st'}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const p = ((f * 0.9 + i * (90 / n) + random(seed + i) * 40) % 90) / 90;
			return <circle key={i} cx={x + Math.sin(p * 6 + i * 2) * 22 * s + (i - n / 2) * 12 * s} cy={y - p * 170 * s} r={(16 + p * 34) * s} fill={c} opacity={(1 - p) * 0.32} style={{filter: 'blur(5px)'}} />;
		})}
	</g>
);
export {Steam};

const Flame: React.FC<{x: number; y: number; f: number; k?: number; s?: number}> = ({x, y, f, k = 0, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{[-22, -8, 8, 22].map((dx, i) => {
			const h = 22 + 10 * Math.sin(f * 0.7 + i * 1.7 + k) + 6 * Math.sin(f * 1.9 + i);
			return <path key={i} d={`M${dx - 7},0 Q${dx},${-h} ${dx + 7},0 Z`} fill={i % 2 ? '#ffd24a' : '#ff8a2a'} opacity={0.95} />;
		})}
	</g>
);

/* --------------------------------- KITCHEN --------------------------------- */
export const Kitchen2: React.FC<{f: number; night?: boolean; door?: boolean}> = ({f, night, door}) => {
	const a = night ? ['#1d2332', '#2b3347'] : ['#d8dee3', '#aeb9c2'];
	const steel = night ? '#566074' : '#cfd6dc';
	const steelD = night ? '#3a4458' : '#98a4ae';
	return (
		<Svg>
			<defs>
				<G id="k2w" stops={[[0, a[0]], [1, a[1]]]} />
				<G id="k2f" stops={[[0, night ? '#2a2230' : '#7e7f8b'], [1, night ? '#1a1520' : '#5d5e6b']]} />
			</defs>
			<rect x={-400} y={-200} width={2800} height={1200} fill="url(#k2w)" />
			{/* tiles */}
			{Array.from({length: 7}).map((_, r) =>
				Array.from({length: 26}).map((__, c) => <rect key={`${r}-${c}`} x={-200 + c * 100 + (r % 2) * 50} y={380 + r * 70} width={96} height={66} fill={night ? '#2f3850' : '#eef2f4'} opacity={0.5} />),
			)}
			{/* hood */}
			<path d="M1000,120 L1560,120 L1680,330 L880,330 Z" fill={steel} />
			<rect x={880} y={330} width={800} height={26} fill={steelD} />
			<rect x={1000} y={356} width={560} height={30} fill={night ? '#ffcf80' : '#fff3c9'} opacity={night ? 0.5 : 0.7} />
			{/* hanging utensils */}
			<rect x={120} y={190} width={760} height={10} fill={steelD} />
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const sw = Math.sin(f / 40 + i) * 2.2;
				return (
					<g key={i} transform={`translate(${190 + i * 120},200) rotate(${sw})`}>
						<line x1={0} y1={0} x2={0} y2={40} stroke={steelD} strokeWidth={5} />
						{i % 3 === 0 ? <circle cy={100} r={52} fill="#2b2f3a" /> : i % 3 === 1 ? <rect x={-34} y={40} width={68} height={110} rx={10} fill="#b4bcc6" /> : <ellipse cy={90} rx={34} ry={46} fill="#caa05a" />}
					</g>
				);
			})}
			{/* pass window with warm light and tickets */}
			<rect x={100} y={320} width={700} height={300} rx={10} fill="#251d1a" />
			<rect x={118} y={338} width={664} height={264} fill={night ? '#6b4a2a' : '#ffcf7a'} opacity={0.85 + 0.08 * Math.sin(f / 9)} />
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i} transform={`translate(${190 + i * 120},300) rotate(${Math.sin(f / 18 + i) * 2})`}>
					<rect x={-34} y={0} width={68} height={100} fill="#fffdf3" stroke="#ccc" strokeWidth={2} />
					{[0, 1, 2, 3].map((l) => (
						<rect key={l} x={-24} y={14 + l * 20} width={34 + (l % 2) * 8} height={5} fill="#555" />
					))}
				</g>
			))}
			<rect x={80} y={620} width={740} height={34} fill={steel} />
			{/* stove */}
			<rect x={950} y={640} width={700} height={260} fill={steel} />
			<rect x={950} y={640} width={700} height={22} fill={steelD} />
			{[0, 1, 2, 3, 4].map((i) => (
				<circle key={i} cx={1010 + i * 150} cy={780} r={20} fill="#2b2f3a" stroke="#ff8a2a" strokeWidth={night ? 4 : 0} />
			))}
			<rect x={970} y={700} width={660} height={160} rx={8} fill={steelD} opacity={0.55} />
			{[0, 1, 2].map((i) => (
				<g key={i}>
					<rect x={1000 + i * 210} y={560} width={150} height={80} rx={8} fill="#2b2f3a" />
					<rect x={992 + i * 210} y={552} width={166} height={16} rx={6} fill="#444a58" />
					<Flame x={1075 + i * 210} y={642} f={f} k={i} s={1.1} />
				</g>
			))}
			<Steam f={f} x={1075} y={552} s={1.2} seed="ka" />
			<Steam f={f} x={1495} y={552} s={1.1} seed="kb" />
			{/* prep table */}
			<rect x={150} y={690} width={620} height={26} fill={steel} />
			<rect x={170} y={716} width={580} height={190} fill={steelD} />
			<rect x={190} y={736} width={260} height={140} rx={6} fill={steel} opacity={0.6} />
			<rect x={480} y={736} width={240} height={140} rx={6} fill={steel} opacity={0.6} />
			{/* kitchen swing door with a porthole */}
			{door ? (
				<g>
					<rect x={1700} y={200} width={300} height={700} fill="#d9dde3" stroke="#6b7280" strokeWidth={8} />
					<circle cx={1850} cy={560} r={78} fill="#0e1424" stroke="#6b7280" strokeWidth={14} />
					<circle cx={1850} cy={560} r={66} fill={night ? '#c8a26a' : '#ffd8a0'} opacity={0.75 + 0.1 * Math.sin(f / 7)} />
				</g>
			) : null}
			<rect x={-400} y={900} width={2800} height={400} fill="url(#k2f)" />
			{Array.from({length: 16}).map((_, i) => (
				<rect key={i} x={-300 + i * 160} y={900} width={80} height={400} fill="#000" opacity={0.08} />
			))}
			<rect x={-400} y={896} width={2800} height={8} fill={night ? '#0e0c14' : '#4b4c58'} />
			{night ? <rect x={-400} y={-200} width={2800} height={1300} fill="#0b1030" opacity={0.28} /> : null}
		</Svg>
	);
};

/* ------------------------------- DINING ROOM ------------------------------- */
export const Dining: React.FC<{f: number; night?: boolean; crowd?: boolean}> = ({f, night = true, crowd = true}) => {
	return (
		<Svg>
			<defs>
				<G id="dw" stops={[[0, night ? '#3a1f2a' : '#8a3d4a'], [1, night ? '#2a1620' : '#6a2c38']]} />
				<G id="dfl" stops={[[0, '#6b4a34'], [1, '#3f2a1f']]} />
				<radialGradient id="dgl">
					<stop offset="0" stopColor="#ffd790" stopOpacity={0.85} />
					<stop offset="1" stopColor="#ffd790" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-400} y={-200} width={2800} height={1200} fill="url(#dw)" />
			{/* wainscot */}
			<rect x={-400} y={560} width={2800} height={340} fill="#4a2230" />
			{Array.from({length: 18}).map((_, i) => (
				<rect key={i} x={-380 + i * 160} y={590} width={130} height={280} rx={6} fill="#5a2a3a" />
			))}
			{/* window onto the street */}
			<rect x={700} y={170} width={520} height={340} fill="#0c1230" stroke="#2a1620" strokeWidth={16} />
			<rect x={716} y={186} width={488} height={308} fill={night ? '#16204a' : '#a6d6f0'} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<rect key={i} x={730 + i * 78} y={330 - (i % 3) * 40} width={56} height={164 + (i % 3) * 40} fill="#0d1230" />
			))}
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
				<rect key={i} x={742 + i * 54} y={350 + ((i * 37) % 120)} width={10} height={14} fill="#ffe08a" opacity={0.5 + 0.5 * Math.sin(f / 15 + i * 3)} />
			))}
			<line x1={960} y1={186} x2={960} y2={494} stroke="#2a1620" strokeWidth={10} />
			{/* neon sign (mirrored through the glass) */}
			<text x={960} y={450} textAnchor="middle" fontSize={64} fontFamily="Caveat, cursive" fontWeight={700} fill="#ff6a8a" opacity={0.75 + 0.2 * Math.sin(f / 6)} style={{filter: 'blur(1px)'}}>
				open
			</text>
			{/* pendant lamps */}
			{[250, 780, 1330, 1760].map((x, i) => (
				<g key={i} transform={`translate(${x},0) rotate(${Math.sin(f / 50 + i) * 1.4} 0 0)`}>
					<line x1={0} y1={-100} x2={0} y2={240} stroke="#222" strokeWidth={4} />
					<path d="M-60,300 Q-50,240 0,240 Q50,240 60,300 Z" fill="#2a1a14" />
					<ellipse cx={0} cy={300} rx={190} ry={140} fill="url(#dgl)" opacity={0.75 + 0.1 * Math.sin(f / 11 + i)} />
					<ellipse cx={0} cy={300} rx={46} ry={10} fill="#fff1c0" />
				</g>
			))}
			{/* bar on the right */}
			<rect x={1520} y={620} width={500} height={50} fill="#2a1a14" />
			<rect x={1520} y={670} width={500} height={240} fill="#3a251c" />
			{[0, 1, 2, 3, 4].map((i) => (
				<rect key={i} x={1560 + i * 80} y={540} width={30} height={80} rx={8} fill={['#2f8f6a', '#c98a2a', '#7a3a6a', '#3a6fd6', '#b83a3a'][i]} opacity={0.9} />
			))}
			{/* back tables with guests (silhouettes) */}
			{crowd
				? [330, 520, 1180, 1370].map((x, i) => (
						<g key={i} opacity={0.9}>
							<ellipse cx={x} cy={760} rx={78} ry={16} fill="#6b3a3a" />
							<rect x={x - 5} y={770} width={10} height={110} fill="#3a2020" />
							<circle cx={x - 36} cy={668 + Math.sin(f / 20 + i) * 3} r={24} fill="#d9a07a" opacity={0.8} />
							<rect x={x - 60} y={690 + Math.sin(f / 20 + i) * 3} width={48} height={60} rx={14} fill={['#b8e', '#8ab', '#e8a', '#ea8'][i] + 'c'} opacity={0.5} />
							<circle cx={x + 40} cy={672 + Math.sin(f / 17 + i) * 3} r={22} fill="#e8c09a" opacity={0.8} />
							<rect x={x + 18} y={694 + Math.sin(f / 17 + i) * 3} width={44} height={56} rx={14} fill="#5a7ab0" opacity={0.5} />
							<circle cx={x} cy={738} r={5} fill="#ffcf6a" opacity={0.6 + 0.4 * Math.sin(f / 4 + i)} />
						</g>
					))
				: null}
			<rect x={-400} y={900} width={2800} height={400} fill="url(#dfl)" />
			{Array.from({length: 20}).map((_, i) => (
				<rect key={i} x={-380 + i * 140} y={900} width={4} height={400} fill="#000" opacity={0.18} />
			))}
		</Svg>
	);
};

/* ----------------------------------- STREET ---------------------------------- */
export const Street2: React.FC<{f: number; mode?: 'day' | 'night' | 'dusk'; bakery?: boolean}> = ({f, mode = 'day', bakery}) => {
	const sky: [string, string] = mode === 'day' ? ['#7cc4ee', '#dff1fb'] : mode === 'dusk' ? ['#ff9a6a', '#ffd7a0'] : ['#080c26', '#26306a'];
	const bld = mode === 'day' ? ['#e8c9a0', '#d4a98a', '#b8c9d6', '#e6b8a0'] : mode === 'dusk' ? ['#b0607a', '#8a4a6a', '#6a4a7a', '#a05a6a'] : ['#141a3a', '#1a2146', '#10163a', '#202858'];
	const night = mode === 'night';
	return (
		<Svg>
			<defs>
				<G id="s2s" stops={[[0, sky[0]], [1, sky[1]]]} />
				<G id="s2g" stops={[[0, night ? '#1a1f3a' : '#8c8f9c'], [1, night ? '#0e1226' : '#62656f']]} />
				<radialGradient id="s2l">
					<stop offset="0" stopColor="#ffe9a8" stopOpacity={0.9} />
					<stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-400} y={-200} width={2800} height={1200} fill="url(#s2s)" />
			{night
				? Array.from({length: 50}).map((_, i) => <circle key={i} cx={random('sx' + i) * 2000 - 40} cy={random('sy' + i) * 360} r={1.2 + random('sr' + i) * 2} fill="#fff" opacity={0.4 + 0.5 * Math.sin(f / 12 + i)} />)
				: null}
			{/* far buildings */}
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
				const h = 360 + ((i * 97) % 260);
				return (
					<g key={i}>
						<rect x={-100 + i * 280} y={900 - h} width={250} height={h} fill={bld[i % 4]} />
						{Array.from({length: 4}).map((_, r) =>
							Array.from({length: 3}).map((__, c) => (
								<rect key={`${r}${c}`} x={-70 + i * 280 + c * 70} y={900 - h + 40 + r * 80} width={40} height={50} fill={night ? '#ffd870' : '#fff3d0'} opacity={night ? (random('w' + i + r + c) > 0.45 ? 0.8 : 0.12) : 0.5} />
							)),
						)}
					</g>
				);
			})}
			{/* bakery front */}
			{bakery ? (
				<g>
					<rect x={560} y={330} width={820} height={570} fill="#f0d9b0" />
					<rect x={560} y={330} width={820} height={90} fill="#8a3d2a" />
					<text x={970} y={394} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={74} fontWeight={700} fill="#ffe9c0">
						Bakery
					</text>
					{Array.from({length: 9}).map((_, i) => (
						<path key={i} d={`M${560 + i * 91},420 h91 v50 q-45,34 -91,0 Z`} fill={i % 2 ? '#fff' : '#e86a5a'} />
					))}
					<rect x={620} y={520} width={430} height={300} fill="#ffd9a0" opacity={0.9} stroke="#8a5a3a" strokeWidth={10} />
					{[0, 1, 2, 3].map((i) => (
						<ellipse key={i} cx={690 + i * 100} cy={730 - (i % 2) * 90} rx={44} ry={20} fill="#c98a3a" />
					))}
					<rect x={1100} y={500} width={220} height={400} fill="#6a3a2a" />
					<rect x={1120} y={530} width={180} height={220} fill="#ffd9a0" opacity={0.6} />
				</g>
			) : null}
			{/* sidewalk, curb, road */}
			<rect x={-400} y={880} width={2800} height={60} fill={night ? '#2a2f4a' : '#c5c6cc'} />
			<rect x={-400} y={940} width={2800} height={400} fill="url(#s2g)" />
			<rect x={-400} y={936} width={2800} height={10} fill={night ? '#0b0e20' : '#4b4e5a'} />
			{Array.from({length: 10}).map((_, i) => (
				<rect key={i} x={-300 + i * 240 + ((f * 1.5) % 240)} y={1010} width={120} height={12} fill="#f4e7a0" opacity={0.6} />
			))}
			{/* lamp post */}
			<g transform="translate(1500,0)">
				<rect x={-7} y={340} width={14} height={560} fill={night ? '#10142c' : '#444a5a'} />
				<ellipse cx={0} cy={350} rx={230} ry={200} fill="url(#s2l)" opacity={night ? 0.95 : 0.25} />
				<ellipse cx={0} cy={340} rx={34} ry={14} fill="#fff6d0" />
			</g>
			{/* a moving car in the distance */}
			<g transform={`translate(${((f * 4) % 2600) - 300},960)`} opacity={0.9}>
				<rect x={-80} y={-50} width={160} height={40} rx={14} fill={night ? '#3a4a8a' : '#d4533a'} />
				<rect x={-46} y={-80} width={92} height={36} rx={12} fill={night ? '#2a3466' : '#b8402a'} />
				<circle cx={-48} cy={-8} r={16} fill="#111" />
				<circle cx={48} cy={-8} r={16} fill="#111" />
				{night ? <ellipse cx={92} cy={-30} rx={60} ry={14} fill="#fff6c0" opacity={0.5} /> : null}
			</g>
		</Svg>
	);
};

/* ------------------------------------ LAB ------------------------------------ */
export const Lab: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<defs>
			<G id="lbw" stops={[[0, '#e8f0f6'], [1, '#c7d6e2']]} />
		</defs>
		<rect x={-400} y={-200} width={2800} height={1200} fill="url(#lbw)" />
		<rect x={-400} y={600} width={2800} height={300} fill="#9fb4c6" />
		{/* big screen with live graph */}
		<rect x={1000} y={160} width={720} height={380} rx={18} fill="#0e1830" stroke="#445a78" strokeWidth={12} />
		<polyline
			points={Array.from({length: 40}).map((_, i) => `${1030 + i * 17},${400 - 90 * Math.abs(Math.sin(i / 3 + f / 14)) - 30 * Math.sin(i + f / 5)}`).join(' ')}
			fill="none"
			stroke="#4aff9a"
			strokeWidth={6}
			strokeLinejoin="round"
		/>
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={1040 + i * 170} y={450} width={ 120 * (0.4 + 0.6 * Math.abs(Math.sin(f / 20 + i)))} height={20} rx={6} fill={['#4aff9a', '#4ac8ff', '#ffd84a', '#ff6a8a'][i]} />
		))}
		{/* shelves with flasks */}
		<rect x={140} y={250} width={600} height={12} fill="#6b7b8c" />
		<rect x={140} y={420} width={600} height={12} fill="#6b7b8c" />
		{[0, 1, 2, 3, 4].map((i) => (
			<g key={i}>
				<path d={`M${190 + i * 110},${250} l12,-60 h30 l12,60 Z`} fill={['#9ff0c0', '#ffd0e0', '#bfe0ff', '#fff0a0', '#d0c0ff'][i]} opacity={0.9} />
				<circle cx={207 + i * 110} cy={230 - ((f * 1.2 + i * 17) % 30)} r={4} fill="#fff" opacity={0.7} />
			</g>
		))}
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={200 + i * 130} y={360} width={60} height={60} rx={8} fill="#8aa0b8" />
		))}
		{/* bench with the electronic tongue */}
		<rect x={80} y={700} width={1000} height={30} fill="#eaf1f6" />
		<rect x={100} y={730} width={960} height={170} fill="#7d93a8" />
		<rect x={420} y={560} width={280} height={140} rx={14} fill="#2b3a52" />
		<rect x={440} y={580} width={160} height={90} rx={6} fill="#0e1830" />
		<circle cx={650} cy={590} r={9} fill={Math.sin(f / 6) > 0 ? '#ff5a5a' : '#5aff8a'} />
		<circle cx={650} cy={620} r={9} fill={Math.sin(f / 6 + 2) > 0 ? '#ffd84a' : '#4a5a6a'} />
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={470 + i * 30} y1={700} x2={470 + i * 30} y2={760} stroke="#c9d6e2" strokeWidth={6} />
		))}
		<rect x={-400} y={900} width={2800} height={400} fill="#b8c6d2" />
		<rect x={-400} y={896} width={2800} height={8} fill="#7b8a99" />
	</Svg>
);

/* ------------------------------- WALK-IN FRIDGE ------------------------------ */
export const Fridge: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<defs>
			<G id="frw" stops={[[0, '#cfe4f4'], [1, '#8fb4d0']]} />
		</defs>
		<rect x={-400} y={-200} width={2800} height={1200} fill="url(#frw)" />
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-300 + i * 200} y={-100} width={6} height={1100} fill="#fff" opacity={0.25} />
		))}
		{[360, 560, 760].map((y, r) => (
			<g key={r}>
				<rect x={100} y={y} width={820} height={12} fill="#7a8fa0" />
				{Array.from({length: 6}).map((_, i) => (
					<rect key={i} x={130 + i * 130} y={y - 90} width={110} height={90} rx={6} fill={['#c98a3a', '#5aa86a', '#d9d9e0', '#e86a5a'][(i + r) % 4]} />
				))}
			</g>
		))}
		<rect x={1250} y={160} width={470} height={740} rx={10} fill="#a8bccb" stroke="#6b8296" strokeWidth={10} />
		<rect x={1290} y={200} width={390} height={660} fill="#c5d6e2" />
		<rect x={1640} y={520} width={22} height={140} rx={10} fill="#4a5a6a" />
		<rect x={-400} y={900} width={2800} height={400} fill="#9db6c8" />
		<rect x={-400} y={896} width={2800} height={8} fill="#6b8296" />
		{Array.from({length: 22}).map((_, i) => (
			<circle key={i} cx={random('fr' + i) * 1900} cy={((random('fy' + i) * 1000 + f * (0.6 + random('fs' + i))) % 1000)} r={2 + random('fq' + i) * 3} fill="#fff" opacity={0.6} />
		))}
	</Svg>
);

/* ----------------------------- FACT / DATA BACKDROP -------------------------- */
export const FactBg: React.FC<{f: number; hue?: number}> = ({f, hue = 230}) => (
	<Svg>
		<defs>
			<G id="fbg" stops={[[0, `hsl(${hue},55%,16%)`], [1, `hsl(${hue + 30},60%,28%)`]]} />
		</defs>
		<rect x={-400} y={-200} width={2800} height={1400} fill="url(#fbg)" />
		{Array.from({length: 22}).map((_, i) => (
			<line key={'h' + i} x1={-400} x2={2400} y1={-100 + i * 70} y2={-100 + i * 70} stroke="#fff" opacity={0.05} strokeWidth={2} />
		))}
		{Array.from({length: 40}).map((_, i) => (
			<line key={'v' + i} y1={-200} y2={1200} x1={-400 + i * 70} x2={-400 + i * 70} stroke="#fff" opacity={0.05} strokeWidth={2} />
		))}
		{Array.from({length: 14}).map((_, i) => {
			const x = random('fx' + i) * 2000;
			const y = (random('fy' + i) * 1200 - f * (0.4 + random('fv' + i) * 0.8) + 1400) % 1300;
			return <circle key={i} cx={x} cy={y} r={8 + random('fr' + i) * 26} fill={`hsl(${hue + 60},80%,65%)`} opacity={0.14} />;
		})}
		<rect x={-400} y={900} width={2800} height={400} fill="#0b0f26" opacity={0.55} />
	</Svg>
);
