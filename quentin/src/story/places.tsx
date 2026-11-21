import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {Bedroom, ClassroomEve, Corridor, Kitchen, NightStreet, SchoolYard, Shop} from '../kit/sets';
import {Beach, CityDay, Forest} from '../kit/world';
import {FONT} from '../kit/ui';

/* Locations made for this video. Floor line y = 900, world x = 0..1920 (extra drawn beyond so the camera never shows edges). */
const INK = '#1d1626';
const X0 = -700;
const W = 3400;

const Floor: React.FC<{a: string; b: string; line?: string}> = ({a, b, line = 'rgba(0,0,0,0.12)'}) => (
	<g>
		<defs>
			<linearGradient id={'fl' + a.slice(1)} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={a} />
				<stop offset="1" stopColor={b} />
			</linearGradient>
		</defs>
		<rect x={X0} y={900} width={W} height={400} fill={`url(#fl${a.slice(1)})`} />
		<rect x={X0} y={896} width={W} height={8} fill={line} />
		{Array.from({length: 18}).map((_, i) => (
			<line key={i} x1={X0 + i * 200} y1={904} x2={X0 + i * 200 - 160} y2={1100} stroke={line} strokeWidth={3} />
		))}
	</g>
);
const Wall: React.FC<{id: string; a: string; b: string}> = ({id, a, b}) => (
	<g>
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={a} />
				<stop offset="1" stopColor={b} />
			</linearGradient>
		</defs>
		<rect x={X0} y={-300} width={W} height={1200} fill={`url(#${id})`} />
	</g>
);
const Lights: React.FC<{y?: number; c?: string}> = ({y = 40, c = '#fff8dc'}) => (
	<g>
		{[200, 760, 1320, 1880].map((x) => (
			<g key={x}>
				<rect x={x - 90} y={y} width={180} height={16} rx={8} fill={c} />
				<polygon points={`${x - 80},${y + 16} ${x + 80},${y + 16} ${x + 220},880 ${x - 220},880`} fill={c} opacity={0.06} />
			</g>
		))}
	</g>
);

/* ------------------------------------ hardware store ------------------------------------ */
export const Hardware: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	return (
		<Svg>
			<Wall id="hw-w" a="#e6d6b0" b="#cdb98e" />
			<Floor a="#a98b64" b="#7d6546" />
			<Lights />
			<rect x={80} y={170} width={760} height={520} rx={10} fill="#b98a52" stroke={INK} strokeWidth={5} />
			{Array.from({length: 7}).map((_, r) => Array.from({length: 13}).map((__, c) => <circle key={r + '-' + c} cx={110 + c * 56} cy={200 + r * 70} r={3} fill="#8a6234" />))}
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i} transform={`translate(${150 + i * 140},240)`}>
					<rect x={-6} y={0} width={12} height={110} rx={4} fill="#7c8696" stroke={INK} strokeWidth={3} />
					<rect x={-34} y={-14} width={68} height={30} rx={8} fill={['#d6403a', '#4a8fe0', '#f2b21c', '#3aa37a', '#b06ad9'][i]} stroke={INK} strokeWidth={4} />
				</g>
			))}
			{[0, 1, 2, 3].map((i) => (
				<g key={i} transform={`translate(${200 + i * 160},450)`}>
					<path d="M0,0 l0,120 M-18,-4 a18,18 0 1 1 36,0" fill="none" stroke="#7c8696" strokeWidth={14} strokeLinecap="round" />
				</g>
			))}
			<rect x={980} y={190} width={560} height={14} fill="#8a6234" stroke={INK} strokeWidth={3} />
			<rect x={980} y={390} width={560} height={14} fill="#8a6234" stroke={INK} strokeWidth={3} />
			<rect x={980} y={590} width={560} height={14} fill="#8a6234" stroke={INK} strokeWidth={3} />
			{[190, 390, 590].map((y, r) =>
				Array.from({length: 8}).map((_, i) => (
					<rect key={r + '-' + i} x={1000 + i * 66} y={y - 62} width={52} height={62} rx={6} fill={['#e0503a', '#4a8fe0', '#f2c21c', '#46a874', '#9a6ad0', '#f08ab0'][(i + r * 2) % 6]} stroke={INK} strokeWidth={3} />
				)),
			)}
			<rect x={1620} y={640} width={520} height={260} fill="#8a6234" stroke={INK} strokeWidth={5} />
			<rect x={1620} y={620} width={520} height={30} fill="#d9c4a0" stroke={INK} strokeWidth={4} />
			<rect x={1740} y={530} width={150} height={90} rx={8} fill="#3a3f55" stroke={INK} strokeWidth={4} />
			<rect x={1756} y={546} width={118} height={40} rx={4} fill={Math.floor(t * 2) % 2 ? '#8affb0' : '#5fd88a'} />
			<rect x={1120} y={70} width={380} height={64} rx={14} fill="#241c36" stroke="#ffb02e" strokeWidth={5} />
			<text x={1310} y={116} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#ffb02e" opacity={0.75 + 0.25 * Math.sin(t * 7)}>HARDWARE</text>
			<g transform={`translate(1000,150) rotate(${Math.sin(t * 2) * 6})`}>
				<line x1={0} y1={-30} x2={0} y2={0} stroke={INK} strokeWidth={3} />
				<rect x={-46} y={0} width={92} height={40} rx={6} fill="#d6403a" stroke={INK} strokeWidth={4} />
				<text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#fff">OPEN</text>
			</g>
		</Svg>
	);
};

/* ------------------------------------- call center ------------------------------------- */
export const CallCenter: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	return (
		<Svg>
			<Wall id="cc-w" a="#9fb0c8" b="#7c8da8" />
			<Floor a="#5a6580" b="#3f485f" />
			<Lights c="#e6f2ff" />
			<rect x={760} y={120} width={400} height={170} rx={12} fill="#10142c" stroke={INK} strokeWidth={5} />
			<text x={960} y={186} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#7fd4ff">CALLS WAITING</text>
			<text x={960} y={258} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#ffd84a">{Math.floor(40 + 20 * Math.sin(t * 1.3))}</text>
			{[0, 1, 2, 3].map((i) => (
				<g key={i} transform={`translate(${20 + i * 520},0)`}>
					<rect x={0} y={560} width={420} height={340} fill="#6e7d99" stroke={INK} strokeWidth={5} />
					<rect x={0} y={540} width={420} height={30} fill="#8a9ab8" stroke={INK} strokeWidth={4} />
					<rect x={90} y={380} width={240} height={160} rx={10} fill="#20223a" stroke={INK} strokeWidth={5} />
					<rect x={102} y={392} width={216} height={130} rx={4} fill={['#3a5aa0', '#2f8a7a', '#8a4a8a', '#a0603a'][i]} opacity={0.75 + 0.25 * Math.sin(t * 4 + i)} />
					{[0, 1, 2].map((r) => (
						<rect key={r} x={116} y={410 + r * 30} width={90 + ((i * 37 + r * 53 + Math.floor(t * 3) * 17) % 80)} height={10} rx={5} fill="#fff" opacity={0.6} />
					))}
					<rect x={176} y={540} width={68} height={14} fill="#20223a" />
				</g>
			))}
			<rect x={1780} y={740} width={70} height={160} rx={10} fill="#a0603a" stroke={INK} strokeWidth={4} />
			{[-30, 0, 30].map((d) => (
				<ellipse key={d} cx={1815 + d} cy={700 - Math.abs(d)} rx={26} ry={70} fill="#3aa37a" stroke={INK} strokeWidth={4} transform={`rotate(${d * 0.9 + Math.sin(t + d) * 3} ${1815 + d} 740)`} />
			))}
		</Svg>
	);
};

/* ------------------------------------------ mall ------------------------------------------ */
export const Mall: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	const shops = [
		['COOKIES', '#f08a3a'],
		['SHOES', '#4a8fe0'],
		['PHONES', '#9a6ad0'],
		['COFFEE', '#46a874'],
		['TOYS', '#e0503a'],
	];
	return (
		<Svg>
			<Wall id="ml-w" a="#f4ecdc" b="#e2d6bc" />
			<rect x={X0} y={-300} width={W} height={380} fill="#bfe0ff" opacity={0.55} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<line key={i} x1={X0 + i * 700} y1={-300} x2={X0 + i * 700 - 200} y2={80} stroke="#fff" strokeWidth={14} opacity={0.65} />
			))}
			<Floor a="#e8e0d2" b="#c9bfa8" line="rgba(120,100,70,0.2)" />
			{shops.map(([n, c], i) => (
				<g key={n} transform={`translate(${-60 + i * 480},0)`}>
					<rect x={0} y={260} width={420} height={640} fill={c} opacity={0.18} />
					<rect x={0} y={250} width={420} height={80} rx={10} fill={c} stroke={INK} strokeWidth={5} />
					<text x={210} y={308} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">{n}</text>
					<rect x={40} y={400} width={340} height={500} rx={8} fill="#fff" opacity={0.28} stroke={INK} strokeWidth={4} />
					{[0, 1, 2].map((k) => (
						<circle key={k} cx={100 + k * 110} cy={640} r={28} fill={c} stroke={INK} strokeWidth={4} />
					))}
				</g>
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const x = X0 + ((t * (40 + i * 10) + i * 600) % 3400);
				const col = ['#6a7aa8', '#a86a7a', '#7aa88a'][i % 3];
				return (
					<g key={i} opacity={0.5} transform={`translate(${x},${820 + (i % 2) * 18})`}>
						<circle cy={-170} r={26} fill={col} />
						<rect x={-26} y={-150} width={52} height={110} rx={20} fill={col} />
						<rect x={-22} y={-44} width={18} height={60} fill="#34364a" />
						<rect x={4} y={-44} width={18} height={60} fill="#34364a" />
					</g>
				);
			})}
			<rect x={1500} y={780} width={80} height={120} rx={12} fill="#a0603a" stroke={INK} strokeWidth={4} />
			{[-34, 0, 34].map((d) => (
				<ellipse key={d} cx={1540 + d} cy={730 - Math.abs(d) * 0.4} rx={30} ry={80} fill="#46a874" stroke={INK} strokeWidth={4} transform={`rotate(${d + Math.sin(t * 1.4 + d) * 3} ${1540 + d} 780)`} />
			))}
		</Svg>
	);
};

/* --------------------------------- live-stream studio --------------------------------- */
export const Studio: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	return (
		<Svg>
			<Wall id="st-w" a="#171a3a" b="#0d0f26" />
			<Floor a="#262a52" b="#13152e" line="rgba(120,140,255,0.2)" />
			<rect x={300} y={90} width={1320} height={560} rx={16} fill="#0a0c20" stroke="#6a7aff" strokeWidth={6} />
			<rect x={324} y={114} width={1272} height={512} rx={8} fill="#141a48" />
			<text x={420} y={230} fontFamily={FONT} fontWeight={900} fontSize={110} fill="#ff3a4a" opacity={0.7 + 0.3 * Math.sin(t * 6)}>● LIVE</text>
			<text x={420} y={400} fontFamily={FONT} fontWeight={900} fontSize={190} fill="#fff">{Math.min(40, 1 + Math.floor(t * 0.3 + 30))}M</text>
			<text x={430} y={470} fontFamily={FONT} fontWeight={700} fontSize={46} fill="#8ab4ff">VIEWERS WATCHING</text>
			<text x={420} y={580} fontFamily={FONT} fontWeight={900} fontSize={56} fill="#ffd84a">THE PERFECT REFUSAL</text>
			<rect x={1160} y={150} width={400} height={440} rx={10} fill="#0a0c20" opacity={0.7} />
			{Array.from({length: 9}).map((_, i) => {
				const y = (i * 52 + t * 90) % 440;
				return <rect key={i} x={1180} y={150 + y} width={140 + ((i * 71) % 200)} height={20} rx={10} fill={['#ff7a9a', '#7affb0', '#ffd84a', '#7ac8ff'][i % 4]} opacity={0.8} />;
			})}
			{[120, 1800].map((x) => (
				<g key={x}>
					<line x1={x} y1={420} x2={x} y2={900} stroke="#3a3f6a" strokeWidth={14} />
					<circle cx={x} cy={420} r={70} fill="none" stroke="#fff6dc" strokeWidth={18} opacity={0.9} />
					<circle cx={x} cy={420} r={70} fill="none" stroke="#fff6dc" strokeWidth={34} opacity={0.2} style={{filter: 'blur(10px)'}} />
				</g>
			))}
			<g transform="translate(1700,760)">
				<rect x={-60} y={-70} width={120} height={70} rx={8} fill="#20223a" stroke={INK} strokeWidth={4} />
				<circle cx={-20} cy={-34} r={20} fill="#10142c" stroke="#6a7aff" strokeWidth={3} />
				<circle cx={46} cy={-56} r={6} fill={Math.floor(t * 2) % 2 ? '#ff3a4a' : '#6a1a22'} />
				<line x1={0} y1={0} x2={0} y2={140} stroke="#3a3f6a" strokeWidth={10} />
			</g>
			<rect x={560} y={760} width={800} height={26} rx={6} fill="#c9cfe8" stroke={INK} strokeWidth={4} />
			<rect x={600} y={786} width={30} height={114} fill="#8a92b8" />
			<rect x={1290} y={786} width={30} height={114} fill="#8a92b8" />
		</Svg>
	);
};

/* ----------------------------------------- hospital ----------------------------------------- */
export const Hospital: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	const beat = Math.floor(t * 1.6);
	const pts: string[] = [];
	for (let i = 0; i < 40; i++) {
		const ph = (i / 40 + t * 0.6) % 1;
		const spike = ph > 0.45 && ph < 0.5 ? -50 : ph > 0.5 && ph < 0.55 ? 40 : 0;
		pts.push(`${i * 6},${spike}`);
	}
	return (
		<Svg>
			<Wall id="hp-w" a="#dff0ea" b="#bfe0d6" />
			<rect x={X0} y={660} width={W} height={20} fill="#9ccbbd" />
			<Floor a="#cfd8d8" b="#a9b6b8" />
			<Lights c="#ffffff" />
			<rect x={1180} y={140} width={420} height={340} rx={10} fill="#243060" stroke={INK} strokeWidth={6} />
			<rect x={1194} y={154} width={392} height={312} fill="#1a2250" />
			{Array.from({length: 14}).map((_, i) => (
				<circle key={i} cx={1210 + ((i * 97) % 360)} cy={180 + ((i * 53) % 260)} r={3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
			))}
			<line x1={1390} y1={154} x2={1390} y2={466} stroke={INK} strokeWidth={5} />
			<rect x={120} y={180} width={140} height={90} rx={10} fill="#fff" stroke={INK} strokeWidth={5} />
			<text x={190} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#3a8a7a">414</text>
			<rect x={420} y={640} width={640} height={36} rx={8} fill="#8a92a8" stroke={INK} strokeWidth={5} />
			<rect x={430} y={560} width={620} height={90} rx={26} fill="#f4f8f8" stroke={INK} strokeWidth={5} />
			<rect x={430} y={500} width={150} height={100} rx={26} fill="#ffffff" stroke={INK} strokeWidth={5} />
			<rect x={440} y={676} width={16} height={224} fill="#8a92a8" />
			<rect x={1020} y={676} width={16} height={224} fill="#8a92a8" />
			<g transform="translate(1100,460)">
				<rect x={-10} y={0} width={14} height={440} fill="#8a92a8" />
				<rect x={-60} y={-110} width={280} height={190} rx={14} fill="#10142c" stroke={INK} strokeWidth={6} />
				<g transform="translate(-30,-10)">
					<polyline points={pts.join(' ')} fill="none" stroke="#7dff9a" strokeWidth={5} strokeLinejoin="round" />
				</g>
				<text x={170} y={-50} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={40} fill={beat % 2 ? '#ff7a8a' : '#a04a55'}>♥ 72</text>
			</g>
			<g transform="translate(380,0)">
				<line x1={0} y1={280} x2={0} y2={900} stroke="#9aa6b8" strokeWidth={8} />
				<rect x={-30} y={260} width={60} height={90} rx={14} fill="#bfe8ff" stroke={INK} strokeWidth={4} />
				<circle cx={0} cy={380 + ((t * 40) % 30)} r={5} fill="#bfe8ff" />
			</g>
		</Svg>
	);
};

/* ----------------------------------------- boardroom ----------------------------------------- */
export const Boardroom: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	return (
		<Svg>
			<defs>
				<linearGradient id="br2-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#ff8a5a" />
					<stop offset="0.6" stopColor="#7a5aa8" />
					<stop offset="1" stopColor="#2a3a7a" />
				</linearGradient>
			</defs>
			<Wall id="br2-w" a="#2a2f4e" b="#1c2038" />
			<rect x={X0} y={-300} width={W} height={940} fill="url(#br2-sky)" />
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
				const h = 200 + ((i * 97) % 260);
				return (
					<g key={i}>
						<rect x={-200 + i * 250} y={640 - h} width={200} height={h} fill="#1c2250" opacity={0.85} />
						{Array.from({length: 6}).map((_, k) => (
							<rect key={k} x={-180 + i * 250 + (k % 3) * 60} y={640 - h + 24 + Math.floor(k / 3) * 60} width={34} height={36} fill="#ffd88a" opacity={random('bw' + i + k) > 0.45 ? 0.9 : 0.15} />
						))}
					</g>
				);
			})}
			{[0, 1, 2, 3, 4].map((i) => (
				<rect key={i} x={X0 + i * 800} y={-300} width={14} height={980} fill="#10142c" />
			))}
			<rect x={X0} y={640} width={W} height={40} fill="#10142c" />
			<Floor a="#3a3f66" b="#1c2038" line="rgba(150,160,255,0.18)" />
			<rect x={340} y={690} width={1240} height={30} rx={10} fill="#d9dcee" stroke={INK} strokeWidth={5} />
			<rect x={440} y={720} width={40} height={180} fill="#8a92b8" />
			<rect x={1440} y={720} width={40} height={180} fill="#8a92b8" />
			<ellipse cx={960} cy={706} rx={620} ry={10} fill="#fff" opacity={0.35 + 0.1 * Math.sin(t * 2)} />
		</Svg>
	);
};

/* ------------------------------ night road for the sprint ------------------------------ */
const mod = (a: number, n: number) => ((a % n) + n) % n;
export const Road: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	return (
		<Svg>
			<defs>
				<linearGradient id="rd-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0d1030" />
					<stop offset="1" stopColor="#5a3a7a" />
				</linearGradient>
			</defs>
			<rect x={X0} y={-300} width={W} height={1200} fill="url(#rd-sky)" />
			{Array.from({length: 24}).map((_, i) => (
				<circle key={i} cx={X0 + ((i * 337) % W)} cy={-200 + ((i * 131) % 600)} r={2.5} fill="#fff" opacity={0.4 + 0.5 * Math.sin(t * 2 + i)} />
			))}
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
				const x = X0 + mod(i * 470 - t * 160, 3760);
				return (
					<g key={i} transform={`translate(${x},0)`}>
						<rect x={0} y={400 - ((i * 53) % 120)} width={260} height={500} fill="#151a3e" />
						{[0, 1, 2, 3].map((k) => (
							<rect key={k} x={26 + (k % 2) * 110} y={440 - ((i * 53) % 120) + Math.floor(k / 2) * 80} width={56} height={40} fill="#ffd88a" opacity={random('rd' + i + k) > 0.5 ? 0.9 : 0.2} />
						))}
					</g>
				);
			})}
			<rect x={X0} y={880} width={W} height={400} fill="#262a46" />
			<rect x={X0} y={874} width={W} height={10} fill="#8a92b8" />
			{Array.from({length: 14}).map((_, i) => (
				<rect key={i} x={X0 + mod(i * 300 - t * 420, 3600)} y={1010} width={150} height={14} rx={6} fill="#f2e6a0" />
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const x = X0 + mod(i * 640 - t * 360, 3840);
				return (
					<g key={i}>
						<line x1={x} y1={300} x2={x} y2={880} stroke="#8a92b8" strokeWidth={10} />
						<circle cx={x + 30} cy={300} r={22} fill="#fff3c0" />
						<circle cx={x + 30} cy={300} r={80} fill="#fff3c0" opacity={0.18} />
					</g>
				);
			})}
			{[0, 1].map((i) => {
				const x = 1100 + i * 380 - ((t * 60 + i * 40) % 90);
				return (
					<g key={i} transform={`translate(${x},${960 + i * 22})`}>
						<rect x={-80} y={-48} width={170} height={48} rx={14} fill={i ? '#e8e8f2' : '#10142c'} stroke={INK} strokeWidth={4} />
						<rect x={-40} y={-80} width={90} height={38} rx={10} fill={i ? '#bfd0f0' : '#3a4a8a'} stroke={INK} strokeWidth={4} />
						<circle cx={-48} cy={0} r={18} fill="#1a1c2a" stroke={INK} strokeWidth={3} />
						<circle cx={56} cy={0} r={18} fill="#1a1c2a" stroke={INK} strokeWidth={3} />
						<circle cx={0} cy={-86} r={8} fill={Math.floor(t * 6 + i) % 2 ? '#ff3a4a' : '#3a6aff'} />
					</g>
				);
			})}
		</Svg>
	);
};

export const BG: Record<string, (f: number) => React.ReactNode> = {
	street: (f) => <CityDay f={f} />,
	night: (f) => <NightStreet f={f} />,
	bedroom: (f) => <Bedroom f={f} />,
	bedroomNight: (f) => <Bedroom f={f} night />,
	kitchen: () => <Kitchen />,
	kitchenNight: () => <Kitchen night />,
	school: (f) => <SchoolYard f={f} />,
	corridor: (f) => <Corridor f={f} />,
	class: () => <ClassroomEve />,
	cafe: (f) => <Shop f={f} />,
	lake: (f) => <Beach f={f} />,
	park: (f) => <Forest f={f} />,
	hardware: (f) => <Hardware f={f} />,
	callcenter: (f) => <CallCenter f={f} />,
	mall: (f) => <Mall f={f} />,
	studio: (f) => <Studio f={f} />,
	hospital: (f) => <Hospital f={f} />,
	boardroom: (f) => <Boardroom f={f} />,
	road: (f) => <Road f={f} />,
};
