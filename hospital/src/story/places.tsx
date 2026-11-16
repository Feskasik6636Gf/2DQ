import React from 'react';
import {random} from 'remotion';
import {Layer, Svg} from '../engine/camera';
import {darken, lighten, mix} from '../engine/color';
import {FONT, HAND} from '../kit/ui';

/* Locations of the St. Brendan's story. Every set = back layers (Set) and optional
   foreground furniture (SetFront) that overlaps the actors. All in the 1920x1080 world,
   floor line y = 900. */

const G: React.FC<{id: string; a: string; b: string; h?: boolean}> = ({id, a, b, h}) => (
	<linearGradient id={id} x1="0" y1="0" x2={h ? 1 : 0} y2={h ? 0 : 1}>
		<stop offset={0} stopColor={a} />
		<stop offset={1} stopColor={b} />
	</linearGradient>
);
const Wall: React.FC<{id: string; a: string; b: string; y0?: number; y1?: number}> = ({id, a, b, y0 = -300, y1 = 920}) => (
	<g>
		<defs>
			<G id={id} a={a} b={b} />
		</defs>
		<rect x={-500} y={y0} width={2900} height={y1 - y0} fill={`url(#${id})`} />
	</g>
);
const Floor: React.FC<{y?: number; c: string; lines?: boolean; shine?: number}> = ({y = 900, c, lines = true, shine = 0.12}) => (
	<g>
		<rect x={-500} y={y} width={2900} height={700} fill={c} />
		<rect x={-500} y={y} width={2900} height={10} fill={darken(c, 0.3)} />
		{lines ? Array.from({length: 34}).map((_, i) => <line key={i} x1={-500 + i * 110} y1={y} x2={-500 + i * 110 - 360} y2={y + 700} stroke={darken(c, 0.12)} strokeWidth={2} />) : null}
		<rect x={-500} y={y + 10} width={2900} height={90} fill="#fff" opacity={shine} />
	</g>
);
const flick = (f: number, seed: number, amount = 1) => {
	const r = random(`fl-${seed}-${Math.floor(f / 3)}`);
	return r > 0.86 ? 1 - 0.8 * amount : 1;
};
const Win: React.FC<{x: number; y: number; w: number; h: number; night?: boolean; blinds?: boolean; id: string; sky?: [string, string]}> = ({x, y, w, h, night = true, blinds, id, sky}) => {
	const [a, b] = sky ?? (night ? ['#0b1230', '#27356b'] : ['#9fd2f0', '#e8f5fb']);
	return (
		<g>
			<defs>
				<G id={id} a={a} b={b} />
			</defs>
			<rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={6} fill="#d9e3e0" />
			<rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
			{night
				? Array.from({length: 14}).map((_, i) => <circle key={i} cx={x + random(id + i) * w} cy={y + random(id + 'y' + i) * h * 0.6} r={1.6 + random(id + 's' + i) * 1.6} fill="#fff" opacity={0.7} />)
				: null}
			{blinds ? Array.from({length: Math.floor(h / 26)}).map((_, i) => <rect key={i} x={x} y={y + i * 26} width={w} height={11} fill="#cfd8d6" opacity={0.85} />) : null}
			<rect x={x + w / 2 - 4} y={y} width={8} height={h} fill="#d9e3e0" />
		</g>
	);
};

/* a cone of flashlight / light spill: from (x,y) toward angle (deg, 0 = right) */
export const Beam: React.FC<{x: number; y: number; angle: number; len?: number; w?: number; o?: number; c?: string; id?: string}> = ({x, y, angle, len = 800, w = 220, o = 0.5, c = '#fff6d0', id = 'bm'}) => (
	<g transform={`translate(${x},${y}) rotate(${angle})`} style={{mixBlendMode: 'screen'}}>
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
				<stop offset={0} stopColor={c} stopOpacity={o} />
				<stop offset={1} stopColor={c} stopOpacity={0} />
			</linearGradient>
		</defs>
		<path d={`M0,-8 L${len},${-w / 2} L${len},${w / 2} L0,8 Z`} fill={`url(#${id})`} />
	</g>
);

/* ------------------------------- exterior ------------------------------- */
export const HospitalExt: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Wall id="hx-sky" a="#070b22" b="#2b3a78" />
				{Array.from({length: 60}).map((_, i) => (
					<circle key={i} cx={random('hs' + i) * 2400 - 240} cy={random('hy' + i) * 520 - 60} r={1 + random('hr' + i) * 2} fill="#fff" opacity={0.35 + 0.5 * Math.abs(Math.sin(f / 30 + i))} />
				))}
				<circle cx={1540} cy={190} r={80} fill="#f2f0d8" />
				<circle cx={1510} cy={170} r={80} fill="#070b22" opacity={0.0} />
			</Svg>
		</Layer>
		<Layer depth={2.1}>
			<Svg>
				{[0, 1, 2, 3, 4, 5, 6].map((i) => (
					<rect key={i} x={-300 + i * 380} y={560 - (i % 3) * 70} width={300} height={400} fill="#121a40" />
				))}
			</Svg>
		</Layer>
		<Layer depth={1.4}>
			<Svg>
				<rect x={180} y={170} width={1560} height={740} fill="#dbe4ea" />
				<rect x={180} y={170} width={1560} height={40} fill="#b9c8d2" />
				<rect x={180} y={170} width={1560} height={740} fill="#0a1030" opacity={0.55} />
				{Array.from({length: 5}).map((_, r) =>
					Array.from({length: 11}).map((__, c) => {
						const on = random(`wn${r}${c}`) > 0.45;
						const fl = on ? flick(f, r * 11 + c, 0.25) : 1;
						return <rect key={r + '-' + c} x={240 + c * 138} y={250 + r * 120} width={92} height={74} fill={on ? '#ffe9a8' : '#223055'} opacity={on ? 0.9 * fl : 0.9} />;
					}),
				)}
				{/* entrance canopy */}
				<rect x={740} y={640} width={440} height={30} fill="#2b3566" />
				<rect x={760} y={670} width={400} height={240} fill="#ffe9a8" opacity={0.9} />
				<rect x={955} y={670} width={10} height={240} fill="#8a96b8" />
				{/* sign */}
				<rect x={650} y={90} width={620} height={110} rx={14} fill="#0e1636" stroke="#ff5a5a" strokeWidth={5} />
				<text x={960} y={166} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#ff6a6a" opacity={flick(f, 99, 0.5)}>
					ST. BRENDAN'S
				</text>
				<g transform="translate(1320,100)" fill="#ff5a5a">
					<rect x={30} y={0} width={30} height={90} rx={4} />
					<rect x={0} y={30} width={90} height={30} rx={4} />
				</g>
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<Floor c="#161a2c" lines={false} shine={0.05} />
				<rect x={-200} y={960} width={2400} height={8} fill="#cfd6e6" opacity={0.5} />
				<g>
					<line x1={360} y1={300} x2={360} y2={900} stroke="#20253c" strokeWidth={12} />
					<ellipse cx={360} cy={302} rx={46} ry={14} fill="#ffe3a0" />
					<ellipse cx={360} cy={900} rx={260} ry={26} fill="#ffe3a0" opacity={0.16} />
					<line x1={1580} y1={300} x2={1580} y2={900} stroke="#20253c" strokeWidth={12} />
					<ellipse cx={1580} cy={302} rx={46} ry={14} fill="#ffe3a0" />
					<ellipse cx={1580} cy={900} rx={260} ry={26} fill="#ffe3a0" opacity={0.16} />
				</g>
			</Svg>
		</Layer>
	</>
);

/* -------------------------------- office -------------------------------- */
export const Office: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer depth={1.8}>
			<Svg>
				<Wall id="of-w" a="#27355e" b="#1a2447" />
				<Win id="of-win" x={1250} y={170} w={440} h={400} night />
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={1262 + i * 48} y={440 - (i % 4) * 40} width={34} height={130 + (i % 4) * 40} fill="#0f1738" />
				))}
				{Array.from({length: 22}).map((_, i) => (
					<rect key={i} x={1272 + (i % 9) * 48} y={470 + Math.floor(i / 9) * 22 - (i % 4) * 30} width={8} height={10} fill="#ffe08a" opacity={0.8} />
				))}
				<rect x={160} y={190} width={280} height={360} fill="#f0ead6" />
				<text x={300} y={238} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#9a3a3a">
					AUDIT
				</text>
				{Array.from({length: 25}).map((_, i) => (
					<rect key={i} x={180 + (i % 5) * 52} y={270 + Math.floor(i / 5) * 54} width={44} height={44} fill={i % 7 === 0 ? '#e87a7a' : '#d9d2b8'} />
				))}
				<Floor c="#2d2a3c" lines={false} shine={0.06} />
			</Svg>
		</Layer>
	</>
);
export const OfficeFront: React.FC<{f: number; screen?: number}> = ({f, screen = 1}) => (
	<Layer depth={1}>
		<Svg>
			<rect x={700} y={690} width={800} height={30} fill="#6b5236" />
			<rect x={730} y={720} width={22} height={180} fill="#4b3a26" />
			<rect x={1450} y={720} width={22} height={180} fill="#4b3a26" />
			{/* two monitors */}
			{[0, 1].map((i) => (
				<g key={i} transform={`translate(${760 + i * 340},510)`}>
					<rect x={-10} y={-10} width={300} height={180} rx={8} fill="#161a2c" />
					<rect x={0} y={0} width={280} height={160} fill="#e6f0ff" opacity={0.92} />
					{Array.from({length: 9}).map((_, r) =>
						Array.from({length: 6}).map((__, c) => <rect key={r + '-' + c} x={8 + c * 45} y={8 + r * 17} width={40} height={12} fill={(r * 7 + c * 3 + i) % 5 === 0 ? '#ff9a9a' : '#b9c8e8'} />),
					)}
					<rect x={0} y={(f * 2) % 160} width={280} height={3} fill="#4a7bd6" opacity={0.5 * screen} />
					<rect x={120} y={170} width={40} height={10} fill="#222" />
				</g>
			))}
			{/* keyboard */}
			<rect x={780} y={676} width={200} height={14} rx={4} fill="#2a2f3a" />
			{/* coffee mugs */}
			{[0, 1, 2].map((i) => (
				<g key={i} transform={`translate(${1370 + i * 36},${650})`}>
					<rect x={0} y={0} width={28} height={40} rx={5} fill={['#f2f2f2', '#d96a4a', '#4a8fd9'][i]} />
					<path d="M28,10 q14,4 0,20" stroke="#bbb" strokeWidth={5} fill="none" />
					<path d={`M10,-6 q-6,-12 0,-22`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.4 + 0.3 * Math.sin(f / 10 + i)} />
				</g>
			))}
			<rect x={1010} y={664} width={120} height={26} fill="#f3efe0" />
			<rect x={1014} y={650} width={120} height={16} fill="#e8e2cc" />
		</Svg>
	</Layer>
);

export const OfficeChair: React.FC = () => (
	<Layer depth={1.02}>
		<Svg>
			<rect x={470} y={800} width={190} height={22} rx={8} fill="#3a4466" />
			<rect x={440} y={640} width={26} height={170} rx={8} fill="#3a4466" />
			<rect x={546} y={822} width={14} height={78} fill="#222a40" />
			<rect x={500} y={896} width={110} height={10} rx={5} fill="#222a40" />
		</Svg>
	</Layer>
);

/* ---------------------------------- lobby ---------------------------------- */
export const Lobby: React.FC<{f: number; night?: boolean; day?: number}> = ({f, night = true, day = 0}) => {
	const sky: [string, string] = day > 0.5 ? ['#bfe3f7', '#f4fbff'] : ['#0b1230', '#27356b'];
	return (
		<>
			<Layer depth={1.7}>
				<Svg>
					<Wall id="lb-w" a={night ? '#8fa9ad' : '#dce9e8'} b={night ? '#6e898e' : '#bcd2d0'} />
					<rect x={-500} y={620} width={2900} height={14} fill="#4d6a6e" />
					{/* glass doors + outside */}
					<rect x={1280} y={210} width={560} height={690} fill="#0a102c" />
					<Win id="lb-door" x={1300} y={230} w={520} h={650} night={day < 0.5} sky={sky} />
					<rect x={1300} y={230} width={520} height={650} fill="#fff" opacity={0.08} />
					<rect x={1556} y={230} width={10} height={650} fill="#cfd8d6" />
					<circle cx={1700} cy={560} r={9} fill="#cfd8d6" />
					{/* sign + clock */}
					<rect x={380} y={170} width={560} height={90} rx={12} fill="#1d3a40" />
					<text x={660} y={234} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill="#fff">
						ST. BRENDAN'S
					</text>
					<circle cx={1080} cy={230} r={58} fill="#f5f1e4" stroke="#394a4d" strokeWidth={8} />
					<line x1={1080} y1={230} x2={1080} y2={190} stroke="#222" strokeWidth={5} />
					<line x1={1080} y1={230} x2={1108} y2={236} stroke="#222" strokeWidth={5} />
					{/* plant */}
					<rect x={100} y={760} width={90} height={140} rx={10} fill="#8a5a3a" />
					{[-40, -15, 15, 40].map((a, i) => (
						<path key={i} d={`M145,760 q${a * 2},-120 ${a * 3},-${140 + i * 8}`} stroke="#3f9a5a" strokeWidth={22} strokeLinecap="round" fill="none" />
					))}
					<Floor c={night ? '#b6c3c0' : '#dfe9e6'} shine={0.2} />
				</Svg>
			</Layer>
		</>
	);
};
export const LobbyFront: React.FC<{f: number}> = ({f}) => (
	<Layer depth={1}>
		<Svg>
			<rect x={360} y={660} width={640} height={240} rx={14} fill="#2f6f6a" />
			<rect x={340} y={640} width={680} height={34} rx={10} fill="#e9f4f1" />
			<rect x={420} y={590} width={150} height={50} rx={6} fill="#222c3a" />
			<rect x={430} y={598} width={130} height={34} fill="#9fd0ff" />
			<rect x={800} y={610} width={140} height={30} rx={4} fill="#f6f2e2" />
			<rect x={640} y={606} width={60} height={34} fill="#e8c24a" />
			<text x={670} y={630} textAnchor="middle" fontSize={16} fontFamily={FONT} fill="#333">
				VISITOR
			</text>
		</Svg>
	</Layer>
);

/* -------------------------------- ward corridor -------------------------------- */
export const Ward: React.FC<{f: number; elev?: number; light312?: number; dark?: number; flicker?: number}> = ({f, elev = 0, light312 = 0, dark = 0, flicker = 0.3}) => (
	<>
		<Layer depth={1.6}>
			<Svg>
				<Wall id="wd-w" a="#cfe3df" b="#a9c8c3" />
				<rect x={-500} y={600} width={2900} height={22} fill="#7fa6a0" />
				<rect x={-500} y={640} width={2900} height={10} fill="#e9f2f0" opacity={0.7} />
				{/* ceiling lights */}
				{Array.from({length: 6}).map((_, i) => (
					<g key={i}>
						<rect x={80 + i * 360} y={-30} width={200} height={34} rx={6} fill="#fffbe6" opacity={0.95 * flick(f, i, flicker)} />
						<path d={`M${80 + i * 360},4 L${280 + i * 360},4 L${360 + i * 360},560 L${0 + i * 360},560 Z`} fill="#fffbe6" opacity={0.07 * flick(f, i, flicker)} />
					</g>
				))}
				{/* doors */}
				{[0, 1, 2, 3, 4].map((i) => {
					const x = 120 + i * 360 + (i >= 3 ? 400 : 0);
					const nums = ['310', '311', '312', '314', '316'];
					const lit = i === 2 ? light312 : 0;
					return (
						<g key={i}>
							<rect x={x} y={300} width={160} height={600} fill="#8c6a4a" />
							<rect x={x + 10} y={312} width={140} height={588} fill={lit > 0 ? mix('#6b4f36', '#fff3b0', lit * 0.85) : '#a07a56'} />
							<rect x={x + 44} y={350} width={72} height={140} fill={lit > 0 ? '#fff8c8' : '#2f3d46'} opacity={lit > 0 ? 0.5 + 0.5 * lit : 0.8} />
							<rect x={x + 30} y={260} width={100} height={36} rx={5} fill="#fff" />
							<text x={x + 80} y={287} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#233">
								{nums[i]}
							</text>
							<circle cx={x + 134} cy={650} r={8} fill="#d8d0b8" />
							{lit > 0 ? <rect x={x + 8} y={880} width={150} height={20} fill="#fff3b0" opacity={0.6 * lit} /> : null}
						</g>
					);
				})}
				{/* elevator */}
				<g transform="translate(1560,0)">
					<rect x={0} y={240} width={300} height={660} fill="#8e9aa0" />
					<rect x={20} y={270} width={260} height={630} fill="#2b3338" />
					<rect x={20 + 130 - 130 * elev} y={270} width={130 - 0} height={630} fill="#aab6bb" opacity={1} />
					<rect x={150 + 130 * elev - 0} y={270} width={130} height={630} fill="#aab6bb" />
					{elev > 0 ? <rect x={20 + 130 - 130 * elev * 0.98} y={270} width={Math.max(0, 260 * elev * 0.98)} height={630} fill="#fff6d0" opacity={0.8 * elev} /> : null}
					<rect x={20} y={270} width={260} height={630} fill="none" stroke="#6b767b" strokeWidth={6} />
					<rect x={90} y={196} width={120} height={34} rx={6} fill="#10151a" />
					<text x={150} y={222} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={elev > 0 ? '#7dff9a' : '#ff6a6a'}>
						{elev > 0 ? '3 ▲' : '—'}
					</text>
				</g>
				{/* exit sign */}
				<rect x={960} y={120} width={130} height={46} rx={6} fill="#0f4a2a" />
				<text x={1025} y={154} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#7dffa0">
					EXIT
				</text>
				{/* bulletin board */}
				<rect x={1090} y={380} width={190} height={130} fill="#c9a06a" />
				{[0, 1, 2].map((i) => (
					<rect key={i} x={1102 + i * 58} y={396 + (i % 2) * 18} width={46} height={62} fill={['#fbf8ef', '#ffe08a', '#bfe3ff'][i]} />
				))}
				<Floor c="#89aaa6" shine={0.22} />
				{/* floor reflection of lights */}
				{Array.from({length: 6}).map((_, i) => (
					<rect key={i} x={140 + i * 360} y={930} width={160} height={16} rx={8} fill="#fffbe6" opacity={0.18 * flick(f, i, flicker)} />
				))}
			</Svg>
		</Layer>
		{dark > 0 ? (
			<Layer depth={0.9} sharp>
				<Svg>
					<rect x={-600} y={-400} width={3200} height={1900} fill="#030612" opacity={dark} />
				</Svg>
			</Layer>
		) : null}
	</>
);

/* ------------------------------ nurses station ------------------------------ */
export const Station: React.FC<{f: number; minutes?: number; note?: boolean; flicker?: number; clockDown?: boolean}> = ({f, minutes = 23 * 60 + 48, note = true, flicker = 0.1, clockDown}) => {
	const mh = ((minutes / 60) % 12) * 30;
	const mm = (minutes % 60) * 6;
	return (
		<Layer depth={1.7}>
			<Svg>
				<Wall id="st-w" a="#cfe0dc" b="#a8c4be" />
				<rect x={-500} y={610} width={2900} height={20} fill="#7ea49d" />
				{Array.from({length: 5}).map((_, i) => (
					<rect key={i} x={20 + i * 420} y={-30} width={220} height={34} rx={6} fill="#fffbe6" opacity={0.92 * flick(f, i + 40, flicker)} />
				))}
				{/* wall clock */}
				<g transform={`translate(860,250) ${clockDown ? 'rotate(180)' : ''}`}>
					<circle r={92} fill="#f7f3e6" stroke="#37494c" strokeWidth={10} />
					{Array.from({length: 12}).map((_, i) => (
						<line key={i} x1={0} y1={-74} x2={0} y2={-84} stroke="#37494c" strokeWidth={4} transform={`rotate(${i * 30})`} />
					))}
					<line x1={0} y1={0} x2={0} y2={-46} stroke="#222" strokeWidth={8} strokeLinecap="round" transform={`rotate(${mh + (minutes % 60) * 0.5})`} />
					<line x1={0} y1={0} x2={0} y2={-70} stroke="#222" strokeWidth={5} strokeLinecap="round" transform={`rotate(${mm})`} />
					<circle r={7} fill="#c33" />
				</g>
				{/* board: roster */}
				<rect x={300} y={180} width={340} height={240} fill="#e9f0ee" stroke="#6a8580" strokeWidth={6} />
				{Array.from({length: 7}).map((_, i) => (
					<rect key={i} x={324} y={206 + i * 29} width={200 + ((i * 53) % 90)} height={10} fill="#8aa5a0" />
				))}
				{/* phone + note */}
				<rect x={1280} y={440} width={120} height={80} rx={10} fill="#222c3a" />
				<rect x={1296} y={456} width={88} height={30} rx={4} fill="#9fb4c6" />
				{note ? (
					<g transform="translate(1440,360) rotate(3)">
						<rect width={150} height={190} fill="#ffe14a" />
						<rect width={150} height={190} fill="#fff" opacity={0.08} />
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<path key={i} d={`M14,${30 + i * 26} q20,-8 40,0 t40,0 t30,-2`} stroke="#222" strokeWidth={3.5} fill="none" />
						))}
						<rect x={55} y={-10} width={40} height={18} fill="#e8e0b0" opacity={0.85} />
					</g>
				) : null}
				{/* key rack */}
				<rect x={1000} y={380} width={200} height={110} rx={8} fill="#6b4f36" />
				{Array.from({length: 5}).map((_, i) => (
					<circle key={i} cx={1030 + i * 36} cy={430} r={7} fill="#e8c24a" />
				))}
				<Floor c="#86a8a3" shine={0.22} />
			</Svg>
		</Layer>
	);
};
export const StationFront: React.FC<{f: number; count?: number; cups?: number}> = ({f, count = 41, cups = 5}) => (
	<Layer depth={1}>
		<Svg>
			<rect x={420} y={700} width={1180} height={200} rx={12} fill="#2f6f8a" />
			<rect x={400} y={676} width={1220} height={36} rx={10} fill="#e9f4f1" />
			{/* scanner monitor */}
			<g transform="translate(1290,520)">
				<rect x={0} y={0} width={230} height={150} rx={8} fill="#141a2a" />
				<rect x={10} y={10} width={210} height={110} fill="#0c2a1f" />
				<text x={115} y={52} textAnchor="middle" fontFamily={FONT} fontSize={18} fill="#6dffb0">
					STAFF COUNT
				</text>
				<text x={115} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill="#7dffb0">
					{count}
				</text>
				<rect x={90} y={150} width={50} height={26} fill="#222" />
			</g>
			{Array.from({length: cups}).map((_, i) => (
				<g key={i} transform={`translate(${470 + i * 54},${640})`}>
					<path d="M0,0 L34,0 L28,36 L6,36 Z" fill="#f4f0e6" />
					<rect x={0} y={0} width={34} height={6} fill="#c9c2ae" />
				</g>
			))}
			<rect x={880} y={650} width={120} height={26} fill="#f6f2e2" />
		</Svg>
	</Layer>
);

/* --------------------------------- patient room --------------------------------- */
export const Room: React.FC<{f: number; lit?: number; heart?: 'beat' | 'flat' | 'none'; bedX?: number; night?: boolean; empty?: boolean}> = ({f, lit = 1, heart = 'none', bedX = 1180, night = true, empty = false}) => {
	const dark = 1 - lit;
	return (
		<>
			<Layer depth={1.7}>
				<Svg>
					<Wall id="rm-w" a="#cfe0cf" b="#a9c4a9" />
					<Win id="rm-win" x={220} y={190} w={400} h={330} night blinds />
					<rect x={-500} y={620} width={2900} height={16} fill="#82a582" />
					<rect x={760} y={230} width={160} height={70} rx={6} fill="#fff" stroke="#6a8" strokeWidth={4} />
					<text x={840} y={276} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#365">
						{heart === 'none' && !empty ? '312' : '308'}
					</text>
					{/* ecg monitor */}
					<g transform={`translate(${bedX - 330},430)`}>
						<rect x={0} y={0} width={190} height={130} rx={10} fill="#151b26" />
						<rect x={12} y={12} width={166} height={86} fill="#06140c" />
						{heart !== 'none' ? (
							<path
								d={
									heart === 'flat'
										? 'M12,55 L178,55'
										: (() => {
												const o = (f * 3) % 83;
												let d = 'M12,55';
												for (let x = 0; x < 166; x += 2) {
													const p = (x + o) % 83;
													const y = p > 30 && p < 34 ? -30 : p > 34 && p < 38 ? 24 : p > 20 && p < 26 ? -6 : 0;
													d += ` L${12 + x},${55 + y}`;
												}
												return d;
											})()
								}
								stroke={heart === 'flat' ? '#ff5a5a' : '#6dff9a'}
								strokeWidth={3}
								fill="none"
							/>
						) : null}
						<rect x={90} y={130} width={10} height={290} fill="#6a7580" />
					</g>
					<Floor c="#8aa98a" shine={0.18} />
				</Svg>
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					{/* bed */}
					<g transform={`translate(${bedX},0)`}>
						<rect x={-20} y={560} width={26} height={340} fill="#58626c" />
						<rect x={440} y={600} width={22} height={300} fill="#58626c" />
						<rect x={-10} y={700} width={470} height={46} rx={8} fill="#7b8794" />
						<rect x={0} y={640} width={450} height={70} rx={20} fill="#fbfbf6" />
						{!empty ? <rect x={20} y={600} width={150} height={50} rx={22} fill="#f2f2ea" /> : null}
						<rect x={0} y={660} width={450} height={10} fill="#e0e7ea" />
					</g>
					<rect x={bedX - 200} y={640} width={110} height={26} fill="#a07a56" />
					<rect x={bedX - 190} y={666} width={90} height={234} fill="#8c6a4a" />
				</Svg>
			</Layer>
			{dark > 0 ? (
				<Layer depth={0.9} sharp>
					<Svg>
						<rect x={-600} y={-400} width={3200} height={1900} fill="#02040e" opacity={dark} />
					</Svg>
				</Layer>
			) : null}
		</>
	);
};

/* ------------------------------ admin office / archive ------------------------------ */
export const Archive: React.FC<{f: number; open?: number}> = ({f, open = 0}) => (
	<>
		<Layer depth={1.7}>
			<Svg>
				<Wall id="ar-w" a="#5b4a3a" b="#3a2e24" />
				<rect x={-500} y={640} width={2900} height={14} fill="#2c231b" />
				<Win id="ar-win" x={1380} y={200} w={300} h={320} night blinds />
				{/* filing cabinets */}
				{[0, 1, 2, 3].map((i) => (
					<g key={i} transform={`translate(${160 + i * 250},300)`}>
						<rect width={220} height={600} rx={6} fill="#7a8a96" />
						{[0, 1, 2, 3].map((d) => (
							<g key={d}>
								<rect x={14} y={16 + d * 146} width={192} height={130} rx={4} fill="#93a3af" />
								<rect x={80} y={58 + d * 146} width={60} height={14} rx={4} fill="#43515c" />
								<rect x={80} y={84 + d * 146} width={60} height={26} fill="#f0ead6" />
							</g>
						))}
					</g>
				))}
				<Floor c="#4a3a2c" shine={0.08} />
			</Svg>
		</Layer>
	</>
);
export const ArchiveFront: React.FC<{f: number; open?: number}> = ({f, open = 0}) => (
	<Layer depth={1}>
		<Svg>
			{/* open drawer of cabinet 2 */}
			{open > 0 ? (
				<g transform={`translate(${160 + 2 * 250 + 14},${316 + 146 * 2})`}>
					<rect x={0} y={0} width={192} height={130} rx={4} fill="#93a3af" />
					<rect x={-80 * open} y={50} width={192} height={90} fill="#6f808c" opacity={0} />
					<path d={`M0,10 L${-110 * open},60 L${-110 * open},170 L0,130 Z`} fill="#6f808c" />
					<rect x={-110 * open} y={60} width={110 * open + 192} height={26} fill="#3e4a54" opacity={0.0} />
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={-100 * open + i * 10} y={40 - (i % 2) * 8} width={14} height={110} fill="#f0ead6" opacity={open} transform={`skewX(-8)`} />
					))}
				</g>
			) : null}
			<rect x={1080} y={690} width={500} height={26} fill="#6b5236" />
			<rect x={1100} y={716} width={20} height={184} fill="#4b3a26" />
			<rect x={1540} y={716} width={20} height={184} fill="#4b3a26" />
			<g transform="translate(1240,590)">
				<line x1={0} y1={100} x2={0} y2={20} stroke="#222" strokeWidth={8} />
				<path d="M-60,20 Q0,-50 60,20 Z" fill="#1f6b3f" />
				<ellipse cx={0} cy={22} rx={50} ry={8} fill="#ffe3a0" opacity={0.6} />
			</g>
		</Svg>
	</Layer>
);

/* ---------------------------------- stairwell B ---------------------------------- */
export const Stairs: React.FC<{f: number; open?: number}> = ({f, open = 0.15}) => (
	<>
		<Layer depth={1.7}>
			<Svg>
				<Wall id="sw-w" a="#4d5560" b="#2d333c" />
				{/* stair diagonal */}
				{Array.from({length: 12}).map((_, i) => (
					<g key={i}>
						<rect x={-200 + i * 80} y={900 - i * 38} width={80} height={38} fill={i % 2 ? '#6b7580' : '#5c6670'} />
					</g>
				))}
				<path d="M-200,520 L760,70" stroke="#8a95a2" strokeWidth={10} />
				<rect x={-500} y={900} width={2900} height={700} fill="#30363f" />
				<rect x={-500} y={900} width={2900} height={10} fill="#1c2026" />
				{/* door */}
				<g transform="translate(1160,300)">
					<rect x={-20} y={-20} width={380} height={640} fill="#1b1f26" />
					<path d={`M0,0 L${300 - 260 * open},${-20} L${300 - 260 * open},${600} L0,600 Z`} fill="#6b4f36" opacity={0} />
					<rect x={0} y={0} width={340} height={600} fill="#fff8d8" opacity={0.95} />
					<path d={`M0,0 L${340 * (1 - open)},${30 * open} L${340 * (1 - open)},${600 - 30 * open} L0,600 Z`} fill="#4a5560" />
					<rect x={40} y={-70} width={300} height={56} rx={8} fill="#0e1218" stroke="#e8e8e8" strokeWidth={3} />
					<text x={190} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#fff">
						STAIRWELL B
					</text>
				</g>
				<ellipse cx={1330} cy={906} rx={520} ry={40} fill="#fff8d8" opacity={0.4 + 0.2 * Math.sin(f / 9)} />
			</Svg>
		</Layer>
	</>
);
