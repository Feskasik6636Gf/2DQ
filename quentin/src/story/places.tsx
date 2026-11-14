import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten} from '../engine/color';
import {Bottle} from '../engine/props';
import {Kitchen} from '../kit/sets';
import {FONT, HAND} from '../kit/ui';

/* Locations of this story. Every place takes the global frame `f`. World = 1920x1080, floor y = 900.
   Wide (−600…2600) so the camera can pan and shake without showing edges. */

const X0 = -700;
const W = 3400;

/* ------------------------------ yellow hallways ------------------------------ */
export const Hall: React.FC<{f: number; flick?: number; open?: number[]; dark?: number; chalk?: boolean; seed?: string; tint?: string; lights?: number}> = ({
	f,
	flick = 0.12,
	open = [],
	dark = 0,
	chalk,
	seed = 'h',
	tint = '#d8c560',
	lights = 1,
}) => {
	const wall = tint;
	return (
		<Svg>
			<defs>
				<linearGradient id={'hw' + seed} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={darken(wall, 0.1)} />
					<stop offset="1" stopColor={wall} />
				</linearGradient>
				<linearGradient id={'hd' + seed} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#1b1706" />
					<stop offset="0.5" stopColor="#3b3210" />
					<stop offset="1" stopColor="#1b1706" />
				</linearGradient>
			</defs>
			<rect x={X0} y={-300} width={W} height={1250} fill={`url(#hw${seed})`} />
			{Array.from({length: 50}).map((_, i) => (
				<rect key={i} x={X0 + i * 70} y={-300} width={16} height={1200} fill="#000" opacity={0.055} />
			))}
			{Array.from({length: 7}).map((_, i) => (
				<ellipse key={'s' + i} cx={X0 + random(seed + 'sx' + i) * W} cy={300 + random(seed + 'sy' + i) * 450} rx={30 + random(seed + 'sr' + i) * 60} ry={20 + random(seed + 'sq' + i) * 40} fill="#8b7420" opacity={0.18} />
			))}
			{open.map((x, i) => (
				<g key={'o' + i}>
					<rect x={x} y={230} width={280} height={670} fill={`url(#hd${seed})`} />
					<rect x={x - 14} y={230} width={14} height={670} fill={darken(wall, 0.25)} />
					<rect x={x + 280} y={230} width={14} height={670} fill={darken(wall, 0.25)} />
				</g>
			))}
			{chalk ? (
				<g stroke="#fffdf4" strokeWidth={5} strokeLinecap="round" opacity={0.92}>
					{Array.from({length: 9}).map((_, g) => (
						<g key={g} transform={`translate(${60 + g * 190},${380 + (g % 2) * 8})`}>
							{[0, 1, 2, 3].map((k) => (
								<line key={k} x1={k * 22} y1={0} x2={k * 22 + 2} y2={90} />
							))}
							<line x1={-8} y1={72} x2={78} y2={14} />
						</g>
					))}
					<g transform="translate(1900,520)">
						<path d="M0,0 L220,0 M220,0 L170,-34 M220,0 L170,34" fill="none" strokeWidth={9} />
						<text x={20} y={110} fontFamily={HAND} fontSize={90} fill="#fffdf4" stroke="none">
							Hi
						</text>
					</g>
				</g>
			) : null}
			<rect x={X0} y={-300} width={W} height={470} fill="#cfc27e" />
			<rect x={X0} y={170} width={W} height={12} fill={darken(wall, 0.3)} />
			{Array.from({length: 8}).map((_, i) => {
				const x = -100 + i * 520;
				const lit = random(seed + 'l' + i + Math.floor(f / 2)) > flick * (i % 2 ? 1.4 : 0.8);
				return (
					<g key={'l' + i}>
						<rect x={x} y={120} width={330} height={32} rx={4} fill={lit ? '#fffbe2' : '#7a7448'} />
						{lit && lights ? <path d={`M${x + 10},152 L${x + 320},152 L${x + 470},880 L${x - 140},880 Z`} fill="#fff6c0" opacity={0.15 * lights} style={{mixBlendMode: 'screen'}} /> : null}
					</g>
				);
			})}
			<rect x={X0} y={880} width={W} height={26} fill="#85722e" />
			<rect x={X0} y={906} width={W} height={400} fill="#a18d3b" />
			{Array.from({length: 40}).map((_, i) => (
				<rect key={'c' + i} x={X0 + i * 90} y={906} width={10} height={400} fill="#000" opacity={0.06} />
			))}
			<rect x={X0} y={906} width={W} height={80} fill="#000" opacity={0.12} />
			{dark > 0 ? <rect x={X0} y={-300} width={W} height={1700} fill="#0a0800" opacity={dark} /> : null}
		</Svg>
	);
};

/* ------------------------------ living room ------------------------------ */
export const Living: React.FC<{f: number; portal?: number}> = ({f, portal = 0}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1200} fill="#efd9bd" />
		<rect x={X0} y={620} width={W} height={20} fill="#c9a877" />
		<rect x={X0} y={900} width={W} height={400} fill="#a9784a" />
		{Array.from({length: 30}).map((_, i) => (
			<rect key={i} x={X0 + i * 130} y={900} width={6} height={400} fill="#000" opacity={0.1} />
		))}
		{/* window at dusk */}
		<g>
			<rect x={1230} y={150} width={330} height={340} fill="#ff9a62" />
			<rect x={1230} y={150} width={330} height={170} fill="#ffcf8a" />
			<rect x={1390} y={150} width={10} height={340} fill="#fff" />
			<rect x={1230} y={310} width={330} height={10} fill="#fff" />
			<rect x={1218} y={138} width={354} height={364} fill="none" stroke="#fff6ea" strokeWidth={16} />
		</g>
		<path d="M1590,140 q60,200 20,380 L1700,520 L1700,140 Z" fill="#c05a72" opacity={0.9} />
		{/* couch */}
		<g>
			<rect x={140} y={640} width={620} height={250} rx={34} fill="#5f6fb5" />
			<rect x={90} y={700} width={120} height={200} rx={30} fill="#51619f" />
			<rect x={690} y={700} width={120} height={200} rx={30} fill="#51619f" />
			<rect x={200} y={760} width={500} height={140} rx={20} fill="#6e7fc4" />
		</g>
		{/* frames + lamp */}
		<rect x={900} y={210} width={150} height={110} fill="#fff" stroke="#c9a877" strokeWidth={8} />
		<rect x={912} y={222} width={126} height={86} fill="#9fc7e8" />
		<rect x={450} y={240} width={220} height={140} fill="#fbf1de" stroke="#c9a877" strokeWidth={8} />
		<g transform="translate(980,0)">
			<rect x={560} y={500} width={14} height={400} fill="#6a4a2a" />
			<path d="M520,500 L614,500 L590,410 L544,410 Z" fill="#ffe4a0" />
		</g>
		{/* kitchen door with warm light */}
		<rect x={1760} y={300} width={300} height={600} fill="#ffdd9a" />
		<rect x={1760} y={300} width={300} height={600} fill="url(#kl)" />
		<defs>
			<linearGradient id="kl" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stopColor="#fff2c8" stopOpacity={0.9} />
				<stop offset="1" stopColor="#ffb866" stopOpacity={0.2} />
			</linearGradient>
		</defs>
		<rect x={1744} y={286} width={332} height={620} fill="none" stroke="#fff" strokeWidth={16} />
		{/* the wall that eats the hand */}
		<g opacity={0.35 + portal * 0.65}>
			<ellipse cx={1020} cy={760} rx={70 + portal * 40} ry={60 + portal * 30} fill="#2b2410" opacity={portal * 0.9} />
			{[0, 1, 2].map((i) => (
				<ellipse key={i} cx={1020} cy={760} rx={40 + i * 28 + Math.sin(f / 6 + i) * 6 * portal} ry={34 + i * 24 + Math.cos(f / 7 + i) * 5 * portal} fill="none" stroke="#fff6ca" strokeWidth={3} opacity={0.5 * portal} />
			))}
		</g>
		{/* phone charger cable */}
		<path d="M1020,900 q-30,-40 0,-80" stroke="#222" strokeWidth={5} fill="none" />
	</Svg>
);

/* ------------------------------ closet with bottles ------------------------------ */
export const Closet: React.FC<{f: number; bottles?: number}> = ({f, bottles = 8}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1250} fill="#b79f42" />
		<rect x={300} y={90} width={1500} height={810} fill="#d8c560" />
		<rect x={300} y={90} width={1500} height={810} fill="none" stroke="#7a6820" strokeWidth={14} />
		{Array.from({length: 22}).map((_, i) => (
			<rect key={i} x={310 + i * 70} y={100} width={14} height={790} fill="#000" opacity={0.05} />
		))}
		<rect x={300} y={880} width={1500} height={30} fill="#85722e" />
		<rect x={X0} y={900} width={W} height={400} fill="#8e7a2e" />
		<rect x={820} y={110} width={260} height={26} rx={4} fill={random('cl' + Math.floor(f / 3)) > 0.2 ? '#fffbe2' : '#8f8960'} />
		<path d="M830,136 L1070,136 L1250,890 L650,890 Z" fill="#fff6c0" opacity={0.13} />
		{Array.from({length: bottles}).map((_, i) => (
			<g key={i} transform={`translate(${760 + i * 58},900) scale(1.5)`}>
				<Bottle x={0} y={0} c="#bfe6f4" />
			</g>
		))}
		<rect x={X0} y={-300} width={400} height={1400} fill="#000" opacity={0.18} />
	</Svg>
);

/* ------------------------------ cardboard room ------------------------------ */
export const Boxes: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1250} fill="#8a7a3c" />
		<rect x={X0} y={900} width={W} height={400} fill="#7f6d2e" />
		{Array.from({length: 24}).map((_, i) => {
			const col = i % 8;
			const row = Math.floor(i / 8);
			const w = 170 + random('bx' + i) * 40;
			return (
				<g key={i} transform={`translate(${280 + col * 200 + (row % 2) * 60},${900 - (row + 1) * 150})`}>
					<rect width={w} height={146} fill={['#c9a06a', '#bd9460', '#d1aa75'][i % 3]} stroke="#8a6a3a" strokeWidth={4} />
					<rect x={w / 2 - 14} y={0} width={28} height={146} fill="#e8d3a8" opacity={0.7} />
				</g>
			);
		})}
		<g transform="translate(1100,900)">
			<rect x={0} y={-34} width={300} height={34} rx={14} fill="#b0505a" />
			<rect x={0} y={-50} width={300} height={22} rx={10} fill="#c9606a" />
		</g>
		{[0, 1, 2, 3].map((i) => (
			<g key={i} transform={`translate(${1500 + i * 56},900) scale(1.4)`}>
				<Bottle x={0} y={0} c="#bfe6f4" />
			</g>
		))}
		<circle cx={1020} cy={330} r={260} fill="#ffe9a0" opacity={0.14} />
		<rect x={990} y={260} width={60} height={80} rx={14} fill="#ffe9a0" />
	</Svg>
);

/* ------------------------------ the white door + lever ------------------------------ */
export const DoorHall: React.FC<{f: number; open?: number; lever?: number}> = ({f, open = 0, lever = 0}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1250} fill="#e9e7e0" />
		{Array.from({length: 50}).map((_, i) => (
			<rect key={i} x={X0 + i * 70} y={-300} width={14} height={1200} fill="#000" opacity={0.03} />
		))}
		<rect x={X0} y={-300} width={W} height={470} fill="#f4f2ec" />
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={-100 + i * 600} y={120} width={330} height={32} rx={4} fill="#ffffff" />
		))}
		<rect x={X0} y={880} width={W} height={26} fill="#bfb9a6" />
		<rect x={X0} y={906} width={W} height={400} fill="#cfcab8" />
		{/* door */}
		<defs>
			<linearGradient id="dl" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#fff4c8" />
				<stop offset="1" stopColor="#ffca6a" />
			</linearGradient>
		</defs>
		<rect x={1340} y={220} width={330} height={680} fill="#ffe7a8" opacity={open} />
		<g transform={`translate(1340,220) skewY(${-open * 6})`}>
			<rect width={330 * (1 - open * 0.75)} height={680} fill="#fbfbfb" stroke="#d3d0c6" strokeWidth={8} />
			<rect x={30} y={50} width={Math.max(0, 270 * (1 - open * 0.75))} height={260} fill="none" stroke="#e0ddd2" strokeWidth={6} />
			<rect x={30} y={360} width={Math.max(0, 270 * (1 - open * 0.75))} height={260} fill="none" stroke="#e0ddd2" strokeWidth={6} />
			<circle cx={290 * (1 - open * 0.75)} cy={360} r={16} fill="#b8bcc4" stroke="#8a8e98" strokeWidth={4} />
		</g>
		<rect x={1330} y={880} width={350} height={22} fill="url(#dl)" opacity={0.9 - open * 0.3} />
		<path d="M1330,900 L1680,900 L1900,1100 L1110,1100 Z" fill="#ffd98a" opacity={0.35 + open * 0.3} />
		{/* iron lever */}
		<g transform={`translate(1130,520)`}>
			<rect x={-34} y={-14} width={68} height={420} fill="#4a4e57" opacity={0} />
			<rect x={-40} y={-30} width={80} height={80} rx={14} fill="#3a3e46" />
			<g transform={`rotate(${lever * 18} 0 0)`}>
				<rect x={-12} y={0} width={24} height={-0} fill="#555" />
				<rect x={-14} y={-8} width={28} height={430} rx={10} fill="#5d626d" transform="translate(0,0)" />
				<circle cx={0} cy={430} r={34} fill="#2d3038" />
				<rect x={-6} y={14} width={5} height={380} fill="#8a909c" opacity={0.6} />
			</g>
			<circle cx={0} cy={10} r={18} fill="#2d3038" />
		</g>
	</Svg>
);

/* ------------------------------ cave (Siffre) ------------------------------ */
export const Cave: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1500} fill="#2a2018" />
		{Array.from({length: 22}).map((_, i) => (
			<path key={i} d={`M${X0 + i * 170},-300 q${30 + random('cv' + i) * 60},${150 + random('cw' + i) * 160} ${-20},${300 + random('cx' + i) * 200}`} stroke="#3d2e22" strokeWidth={50 + random('cy' + i) * 40} fill="none" opacity={0.8} />
		))}
		<rect x={X0} y={900} width={W} height={400} fill="#40301f" />
		{/* cot + lamp + clock without hands + calendar */}
		<rect x={1250} y={740} width={420} height={40} rx={10} fill="#8a5a3a" />
		<rect x={1250} y={780} width={14} height={120} fill="#5a3a24" />
		<rect x={1656} y={780} width={14} height={120} fill="#5a3a24" />
		<rect x={1250} y={710} width={150} height={40} rx={18} fill="#e7d9c0" />
		<g transform="translate(560,330)">
			<circle r={90} fill="#efe9da" stroke="#6a5a42" strokeWidth={10} />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={0} y1={-70} x2={0} y2={-58} stroke="#6a5a42" strokeWidth={5} transform={`rotate(${i * 30})`} />
			))}
			<text x={0} y={22} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#c9433a">
				?
			</text>
		</g>
		<g transform="translate(900,260) rotate(2)">
			<rect width={160} height={210} fill="#f6f1e2" stroke="#a89878" strokeWidth={6} />
			<rect width={160} height={44} fill="#c9433a" />
			{Array.from({length: 20}).map((_, i) => (
				<rect key={i} x={14 + (i % 5) * 28} y={62 + Math.floor(i / 5) * 36} width={20} height={20} fill="#b8ad92" />
			))}
		</g>
		<circle cx={1030} cy={640} r={380} fill="#ffcf7a" opacity={0.1} />
		<rect x={980} y={600} width={50} height={90} rx={12} fill="#ffe3a0" />
		<rect x={X0} y={-300} width={W} height={1700} fill="#000" opacity={0.25} />
	</Svg>
);

/* ------------------------------ a dark card background for science beats ------------------------------ */
export const Void: React.FC<{f: number; c?: string}> = ({f, c = '#101436'}) => (
	<Svg>
		<rect x={X0} y={-300} width={W} height={1700} fill={c} />
		{Array.from({length: 26}).map((_, r) =>
			Array.from({length: 46}).map((__, k) => <circle key={r + '-' + k} cx={X0 + k * 80} cy={-300 + r * 80} r={2.4} fill="#7e8bd8" opacity={0.25} />),
		)}
		<rect x={X0} y={900} width={W} height={400} fill="#0a0d26" />
	</Svg>
);

export const Kit: React.FC<{f: number; night?: boolean}> = ({night}) => <Kitchen night={night} />;

export const PLACES: Record<string, React.FC<any>> = {
	hall: Hall,
	living: Living,
	closet: Closet,
	boxes: Boxes,
	door: DoorHall,
	cave: Cave,
	void: Void,
	kitchen: Kit,
};

/* ------------------------------ props / overlays ------------------------------ */
export const Phone: React.FC<{x: number; y: number; text: string; s?: number; rot?: number; glow?: string}> = ({x, y, text, s = 1, rot = 0, glow = '#9fd2ff'}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<circle r={90} fill={glow} opacity={0.18} />
		<rect x={-36} y={-64} width={72} height={128} rx={12} fill="#15171f" />
		<rect x={-30} y={-56} width={60} height={112} rx={7} fill="#0f1b2e" />
		<text x={0} y={-4} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={text.length > 6 ? 15 : 20} fill="#fff">
			{text}
		</text>
		<text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={11} fill="#ff7a6a">
			NO SIGNAL
		</text>
	</g>
);

export const Chalk: React.FC<{x: number; y: number; n: number; c?: string}> = ({x, y, n, c = '#fffdf4'}) => (
	<g stroke={c} strokeWidth={5} strokeLinecap="round" transform={`translate(${x},${y})`}>
		{Array.from({length: n}).map((_, i) => {
			const g = Math.floor(i / 5);
			const k = i % 5;
			return k < 4 ? <line key={i} x1={g * 120 + k * 20} y1={0} x2={g * 120 + k * 20 + 2} y2={70} /> : <line key={i} x1={g * 120 - 8} y1={54} x2={g * 120 + 80} y2={14} />;
		})}
	</g>
);

/* a sound ripple that grows out of a point (mom's voice, hum…) */
export const Rings: React.FC<{x: number; y: number; f: number; c?: string; n?: number; r?: number}> = ({x, y, f, c = '#ffe9a0', n = 3, r = 260}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const k = ((f / 28 + i / n) % 1);
			return <circle key={i} cx={x} cy={y} r={20 + k * r} fill="none" stroke={c} strokeWidth={6 * (1 - k)} opacity={1 - k} />;
		})}
	</g>
);

export const Arrow: React.FC<{x: number; y: number; f: number; c?: string; dir?: 1 | -1}> = ({x, y, f, c = '#ffe9a0', dir = 1}) => (
	<g transform={`translate(${x + Math.sin(f / 5) * 12},${y}) scale(${dir},1)`}>
		<path d="M0,0 L120,0 M120,0 L78,-34 M120,0 L78,34" stroke={c} strokeWidth={16} strokeLinecap="round" fill="none" />
	</g>
);

export const Water: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M0,-60 C30,-14 44,8 44,28 A44,44 0 0 1 -44,28 C-44,8 -30,-14 0,-60 Z" fill="#6cc4f0" stroke="#d8f2ff" strokeWidth={5} />
	</g>
);

/* fluorescent flicker waveform: 50/60 Hz mains → 100/120 Hz light */
export const Wave: React.FC<{f: number; x: number; y: number; w: number; h: number; hz: number; c?: string}> = ({f, x, y, w, h, hz, c = '#ffe9a0'}) => {
	const pts = Array.from({length: 120}).map((_, i) => `${x + (i / 119) * w},${y + Math.abs(Math.sin((i / 119) * Math.PI * hz + f / 5)) * -h}`);
	return <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />;
};
export { lighten };
