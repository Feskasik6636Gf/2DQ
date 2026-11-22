import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';

/* Locations made for this video. World px: 1920x1080 frame, floor y = 900, drawn x = -500…2420. */
const INK = '#1d1626';
const o = {stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round' as const};
const T = (f: number) => f / 30;
const X0 = -500;
const WW = 3000;

const Sky: React.FC<{id: string; a: string; b: string; h?: number}> = ({id, a, b, h = 900}) => (
	<>
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={a} />
				<stop offset="1" stopColor={b} />
			</linearGradient>
		</defs>
		<rect x={X0} y={-300} width={WW} height={h + 300} fill={`url(#${id})`} />
	</>
);
const Ground: React.FC<{y?: number; a: string; b?: string}> = ({y = 900, a, b}) => (
	<>
		<rect x={X0} y={y} width={WW} height={400} fill={a} />
		{b ? <rect x={X0} y={y} width={WW} height={14} fill={b} /> : null}
		<rect x={X0} y={y + 40} width={WW} height={400} fill="#000" opacity={0.1} />
	</>
);
const Cloud: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = '#fff', o: op = 0.9}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
		<ellipse cx={0} cy={0} rx={90} ry={34} fill={c} />
		<ellipse cx={-50} cy={8} rx={60} ry={28} fill={c} />
		<ellipse cx={50} cy={10} rx={70} ry={26} fill={c} />
		<ellipse cx={10} cy={-22} rx={50} ry={30} fill={c} />
	</g>
);
const Bricks: React.FC<{id: string; a: string; b: string}> = ({id, a, b}) => (
	<defs>
		<pattern id={id} width={72} height={36} patternUnits="userSpaceOnUse">
			<rect width={72} height={36} fill={a} />
			<path d="M0,0 H72 M0,18 H72 M0,0 V18 M36,18 V36 M72,0 V18" stroke={b} strokeWidth={2.4} fill="none" />
		</pattern>
	</defs>
);
const Win: React.FC<{x: number; y: number; w?: number; h?: number; lit?: boolean; c?: string; blind?: boolean}> = ({x, y, w = 110, h = 150, lit, c = '#ffd98a', blind}) => (
	<g>
		<rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={6} fill="#e9e2d0" {...o} strokeWidth={3} />
		<rect x={x} y={y} width={w} height={h} fill={lit ? c : '#2b3a5a'} />
		{lit ? <rect x={x} y={y} width={w} height={h} fill="#fff" opacity={0.18} /> : <path d={`M${x},${y + h} L${x + w * 0.5},${y} L${x + w},${y}  L${x + w},${y + 20} L${x + 20},${y + h} Z`} fill="#fff" opacity={0.14} />}
		<path d={`M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}`} stroke="#e9e2d0" strokeWidth={5} />
		{blind ? <rect x={x} y={y} width={w} height={h * 0.45} fill="#e8d6a8" opacity={0.9} /> : null}
	</g>
);
const Smoke: React.FC<{x: number; y: number; f: number; n?: number; c?: string; sp?: number}> = ({x, y, f, n = 6, c = '#e8e8ef', sp = 1}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const k = (((f * sp) / 60 + i / n) % 1);
			return <circle key={i} cx={x + Math.sin(k * 6 + i) * 18 * k + k * 40} cy={y - k * 200} r={12 + k * 38} fill={c} opacity={0.5 * (1 - k)} />;
		})}
	</g>
);

/* ============================== COURTYARD ============================== */
export const Courtyard: React.FC<{f: number; night?: boolean; couch?: boolean; fire?: boolean}> = ({f, night, couch = true, fire}) => {
	const t = T(f);
	const flick = 0.75 + 0.25 * Math.sin(f / 2.3) * Math.sin(f / 5.1);
	return (
		<Svg>
			<Sky id={'cy-sky' + night} a={night ? '#0b1030' : '#7ec4f2'} b={night ? '#27305e' : '#fbe2b0'} />
			{night ? Array.from({length: 40}).map((_, i) => <circle key={i} cx={X0 + random('cs' + i) * WW} cy={random('cy' + i) * 300} r={1.4} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 15 + i)} />) : <><Cloud x={300 + ((t * 8) % 2600) - 400} y={150} s={1.3} /><Cloud x={1500 - ((t * 5) % 2600) + 600} y={90} s={1} o={0.7} /></>}
			{/* back building with windows */}
			<Bricks id={'cy-b' + night} a={night ? '#4a3340' : '#c7694a'} b={night ? '#2d1f2a' : '#9d4a34'} />
			<rect x={-200} y={90} width={2400} height={810} fill={`url(#cy-b${night})`} {...o} />
			<rect x={-200} y={90} width={2400} height={70} fill={night ? '#2b2230' : '#8a3f2c'} {...o} />
			{[0, 1, 2].map((r) =>
				Array.from({length: 11}).map((_, c) => {
					const lit = night ? random('w' + r + c) > 0.4 : random('w' + r + c) > 0.7;
					return <Win key={`${r}${c}`} x={-120 + c * 215} y={200 + r * 205} w={104} h={130} lit={lit} blind={random('bl' + r + c) > 0.7} />;
				}),
			)}
			{/* fire escape */}
			<g stroke="#2b2a36" strokeWidth={5} fill="none">
				{[0, 1].map((k) => (
					<g key={k}>
						<path d={`M${1480 + k * 0},${410 + k * 200} H${1700} M${1480},${340 + k * 200} H${1700}`} />
						{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${1488 + i * 24},${340 + k * 200} V${410 + k * 200}`} strokeWidth={3} />)}
					</g>
				))}
			</g>
			{/* laundry lines */}
			{[0, 1].map((k) => (
				<g key={k}>
					<path d={`M${-100 + k * 600},${170 + k * 20} Q${300 + k * 600},${250 + k * 20} ${700 + k * 600},${170 + k * 20}`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.9} />
					{[0.2, 0.4, 0.6, 0.8].map((q, i) => {
						const x = -100 + k * 600 + q * 800;
						const sw = Math.sin(f / 18 + i + k) * 6;
						return <path key={i} d={`M${x},${210 + k * 20} l${sw - 22},${70} h44 l${sw},${-70}`} fill={['#ffb02e', '#6ec8ff', '#fff', '#ff7aa0'][i]} opacity={0.95} {...o} strokeWidth={2.4} />;
					})}
				</g>
			))}
			<Ground a={night ? '#3a3548' : '#bdb6a2'} b={night ? '#2a2638' : '#9a9382'} />
			{/* cobbles */}
			{Array.from({length: 40}).map((_, i) => <ellipse key={i} cx={X0 + (i % 20) * 160 + (Math.floor(i / 20) % 2) * 80} cy={940 + Math.floor(i / 20) * 70} rx={44} ry={12} fill="#000" opacity={0.08} />)}
			{/* picnic tables */}
			{[-120, 560].map((x, i) => (
				<g key={i} transform={`translate(${x},0)`}>
					<rect x={0} y={760} width={360} height={26} rx={6} fill="#c28a52" {...o} />
					<rect x={20} y={786} width={20} height={120} fill="#8a5c34" {...o} strokeWidth={2.6} />
					<rect x={320} y={786} width={20} height={120} fill="#8a5c34" {...o} strokeWidth={2.6} />
					<rect x={-30} y={850} width={420} height={18} rx={5} fill="#a8723e" {...o} strokeWidth={2.6} />
					<path d="M40,760 h90 v-12 h-90 Z M200,760 h100 v-12 h-100 Z" fill="#fff" {...o} strokeWidth={2.4} />
					<ellipse cx={90} cy={755} rx={26} ry={5} fill="#fff" stroke={INK} strokeWidth={2} />
					<ellipse cx={250} cy={755} rx={26} ry={5} fill="#fff" stroke={INK} strokeWidth={2} />
				</g>
			))}
			{/* grill */}
			<g transform="translate(1180,0)">
				<rect x={0} y={640} width={150} height={92} rx={36} fill="#2b2a36" {...o} />
				<rect x={-8} y={632} width={166} height={18} rx={9} fill="#46455a" {...o} />
				<path d="M20,810 L62,732 M130,810 L88,732" stroke={INK} strokeWidth={8} />
				<rect x={52} y={730} width={46} height={150} fill="#2b2a36" />
				<ellipse cx={75} cy={650} rx={56} ry={10} fill={`rgba(255,${120 + 60 * flick},40,${0.85})`} />
				<Smoke x={75} y={640} f={f} c="#cfcfd8" />
			</g>
			{/* couch */}
			{couch ? (
				<g transform="translate(1330,0)">
					<rect x={0} y={690} width={400} height={170} rx={28} fill="#8a4a38" {...o} />
					<rect x={-20} y={720} width={60} height={160} rx={22} fill="#a35a44" {...o} />
					<rect x={360} y={720} width={60} height={160} rx={22} fill="#a35a44" {...o} />
					<rect x={40} y={780} width={320} height={90} rx={16} fill="#b0654c" {...o} />
					<rect x={24} y={868} width={16} height={34} fill="#3a2a22" /><rect x={380} y={868} width={16} height={34} fill="#3a2a22" />
					<path d="M60,700 q20,-6 40,0" stroke="#fff" strokeOpacity={0.25} strokeWidth={5} fill="none" />
				</g>
			) : null}
			{/* string lights */}
			<path d="M-300,120 Q300,260 900,130 Q1500,250 2200,110" stroke="#2b2a36" strokeWidth={4} fill="none" />
			{Array.from({length: 20}).map((_, i) => {
				const x = -300 + i * 125;
				const y = 120 + 80 * Math.sin((i / 20) * Math.PI * 2 * 1.5 - 1) + 60;
				const on = Math.sin(f / 9 + i * 1.7) > -0.4;
				return (
					<g key={i}>
						<circle cx={x} cy={y} r={night ? 26 : 12} fill={['#ffd84a', '#ff7aa0', '#7ae0ff', '#a6ff8a'][i % 4]} opacity={on ? (night ? 0.28 : 0.1) : 0} />
						<circle cx={x} cy={y} r={8} fill={['#ffd84a', '#ff7aa0', '#7ae0ff', '#a6ff8a'][i % 4]} stroke={INK} strokeWidth={2} opacity={on ? 1 : 0.6} />
					</g>
				);
			})}
			{fire ? <g transform="translate(-200,0)"><ellipse cx={500} cy={880} rx={600} ry={40} fill="#ff3a3a" opacity={0.12 + 0.1 * Math.sin(f / 4)} /></g> : null}
		</Svg>
	);
};

/* =============================== APARTMENT HALL =============================== */
export const AptHall: React.FC<{f: number; night?: boolean; door?: string; open?: number}> = ({f, night, door = '4B', open = 0}) => {
	const flick = night ? 0.8 + 0.2 * Math.sin(f / 3) * Math.sin(f / 7.3) : 1;
	return (
		<Svg>
			<rect x={X0} y={-200} width={WW} height={1200} fill={night ? '#2d2a3f' : '#d9c8a8'} />
			<rect x={X0} y={-200} width={WW} height={180} fill={night ? '#201e30' : '#c3ae88'} />
			<rect x={X0} y={700} width={WW} height={30} fill={night ? '#1c1a2a' : '#8a7452'} />
			<rect x={X0} y={420} width={WW} height={10} fill={night ? '#3a3752' : '#b79d72'} opacity={0.7} />
			{/* doors */}
			{[-200, 330, 860, 1390, 1920].map((x, i) => {
				const isT = i === 3;
				const op = isT ? open : 0;
				return (
					<g key={i}>
						<rect x={x} y={250} width={200} height={460 + 190} fill={night ? '#241e30' : '#b9a27c'} opacity={op > 0.1 ? 1 : 0} />
						<g transform={`translate(${x},0)`}>
							<rect x={-14} y={236} width={228} height={670} rx={6} fill={night ? '#17141f' : '#8a6a44'} {...o} />
							<rect x={0} y={250} width={200} height={650} rx={4} fill={night ? '#6b4a3a' : '#c69558'} {...o} style={{transformBox: 'fill-box', transformOrigin: 'left', transform: `scaleX(${1 - op * 0.8})`}} />
							<rect x={20} y={280} width={70} height={240} rx={4} fill="#000" opacity={0.12} /><rect x={110} y={280} width={70} height={240} rx={4} fill="#000" opacity={0.12} />
							<circle cx={172} cy={600} r={9} fill="#e6c040" stroke={INK} strokeWidth={2.4} />
							<circle cx={100} cy={226} r={4} fill="#111" /><rect x={70} y={190} width={60} height={34} rx={6} fill="#f2f2f2" {...o} strokeWidth={2.6} />
							<text x={100} y={216} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={24} fill={INK}>{isT ? door : `${2 + i}${'ACDAB'[i]}`}</text>
						</g>
					</g>
				);
			})}
			<Ground y={900} a={night ? '#3a2a40' : '#a4474a'} />
			<rect x={X0} y={900} width={WW} height={90} fill={night ? '#53345c' : '#c4585b'} opacity={0.5} />
			{/* lamps */}
			{[130, 660, 1190, 1720].map((x, i) => (
				<g key={i} opacity={flick}>
					<ellipse cx={x} cy={330} rx={220} ry={360} fill="#ffe3a0" opacity={night ? 0.1 : 0.06} />
					<path d={`M${x - 20},180 q20,60 40,0 z`} fill="#fff1c0" {...o} strokeWidth={2.6} />
				</g>
			))}
		</Svg>
	);
};

/* ================================== ROOF ================================== */
export const Roof: React.FC<{f: number; night?: boolean; smoke?: number}> = ({f, night, smoke = 0}) => {
	const t = T(f);
	return (
		<Svg>
			<Sky id={'rf-sky' + night} a={night ? '#070a20' : '#8fd0ff'} b={night ? '#2b2f66' : '#fff0c8'} />
			{night ? Array.from({length: 60}).map((_, i) => <circle key={i} cx={X0 + random('rs' + i) * WW} cy={random('ry' + i) * 520} r={1.5} fill="#fff" opacity={0.35 + 0.4 * Math.sin(f / 13 + i)} />) : <><Cloud x={200 + ((t * 10) % 2600) - 300} y={170} s={1.4} /><Cloud x={1300 - ((t * 6) % 2600) + 700} y={260} s={1} o={0.8} /></>}
			{night ? <circle cx={1500} cy={170} r={64} fill="#f4f1d8" /> : <circle cx={1600} cy={170} r={70} fill="#fff6c0" />}
			{/* skyline far */}
			{Array.from({length: 14}).map((_, i) => {
				const h = 220 + random('sk' + i) * 300;
				return (
					<g key={i}>
						<rect x={-400 + i * 190} y={900 - h} width={170} height={h} fill={night ? '#1a1d44' : '#9fb4d6'} />
						{Array.from({length: 6}).map((__, k) => <rect key={k} x={-380 + i * 190 + (k % 2) * 70} y={900 - h + 30 + Math.floor(k / 2) * 70} width={36} height={40} fill={night && random('l' + i + k) > 0.5 ? '#ffd98a' : night ? '#2b3068' : '#c6d6ee'} />)}
					</g>
				);
			})}
			{/* water tower */}
			<g transform="translate(1250,0)">
				<rect x={20} y={540} width={14} height={380} fill="#5a4a44" /><rect x={166} y={540} width={14} height={380} fill="#5a4a44" />
				<path d="M0,540 H200 V380 Q100,350 0,380 Z" fill="#9a6a44" {...o} />
				<path d="M-10,380 L100,310 L210,380 Z" fill="#7a4a30" {...o} />
				{[0, 1, 2].map((k) => <path key={k} d={`M0,${420 + k * 48} H200`} stroke={INK} strokeWidth={4} opacity={0.6} />)}
			</g>
			<Ground y={900} a={night ? '#2a2a40' : '#8b8a96'} b={night ? '#1a1a2c' : '#6b6a78'} />
			{/* chimney (the culprit) */}
			<g transform="translate(300,0)">
				<rect x={0} y={560} width={150} height={340} fill={night ? '#6a3a3a' : '#b0583c'} {...o} />
				<rect x={-14} y={540} width={178} height={30} fill={night ? '#4a2a30' : '#8a3f2c'} {...o} />
				{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={10 + c * 70} y={600 + r * 80} width={60} height={50} fill="#000" opacity={0.08} />))}
				<Smoke x={75} y={540} f={f} c={smoke ? '#7a7f90' : '#bcc2d4'} n={7} sp={smoke ? 1.5 : 0.7} />
				{/* twigs nest sticks out */}
				{smoke ? <path d="M30,545 l-14,-30 M60,545 l8,-34 M96,545 l24,-26 M120,545 l-4,-30" stroke="#6a4a2a" strokeWidth={6} strokeLinecap="round" /> : null}
			</g>
			{/* antenna + vent */}
			<g transform="translate(900,0)"><path d="M0,900 V520 M-50,560 H50 M-36,600 H36 M-24,640 H24" stroke="#2b2a36" strokeWidth={6} strokeLinecap="round" /></g>
			<rect x={560} y={820} width={150} height={80} rx={10} fill="#a9b0c0" {...o} />
			<rect x={1650} y={790} width={200} height={110} rx={10} fill="#a9b0c0" {...o} />
			<rect x={X0} y={864} width={WW} height={40} fill="#000" opacity={0.08} />
		</Svg>
	);
};

/* ================================== MARKET ================================== */
export const Market: React.FC<{f: number}> = ({f}) => {
	const t = T(f);
	return (
		<Svg>
			<Sky id="mk-sky" a="#8fd6ff" b="#fff2cc" />
			<Cloud x={400 + ((t * 9) % 2600) - 300} y={140} s={1.2} />
			{Array.from({length: 8}).map((_, i) => (
				<g key={i}>
					<rect x={-420 + i * 400} y={300} width={300} height={600} fill={['#e8a24a', '#7ab0d8', '#d87a8a', '#a8c870'][i % 4]} {...o} />
					{[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-390 + i * 400 + c * 140} y={350 + r * 150} width={80} height={100} fill="#fff6d0" {...o} strokeWidth={2.6} />))}
				</g>
			))}
			<Ground y={900} a="#c9b891" b="#a89870" />
			{/* stalls */}
			{[-80, 1250].map((x, i) => (
				<g key={i} transform={`translate(${x},0)`}>
					<rect x={0} y={420} width={10} height={480} fill="#6a4a30" /><rect x={560} y={420} width={10} height={480} fill="#6a4a30" />
					{Array.from({length: 8}).map((_, k) => <path key={k} d={`M${k * 72 - 6},430 h72 v-26 q-36,-30 -72,0 Z`} fill={k % 2 ? '#fff' : i ? '#4aa86a' : '#e8503a'} {...o} strokeWidth={2.6} />)}
					<rect x={-10} y={430} width={590} height={20} fill={i ? '#3a8a54' : '#c63a2a'} {...o} />
					<rect x={20} y={730} width={530} height={170} fill="#b38352" {...o} />
					<rect x={0} y={700} width={570} height={36} rx={6} fill="#d6a468" {...o} />
					{i === 0 ? ['#ff8a3a', '#e8503a', '#ffd84a', '#7ac85a', '#a35ad8'].map((c, k) => <circle key={k} cx={60 + k * 100} cy={684} r={28} fill={c} {...o} strokeWidth={2.6} />) : [0, 1, 2, 3].map((k) => (
						<g key={k}><rect x={40 + k * 128} y={640} width={80} height={60} rx={14} fill="#f2b21c" {...o} strokeWidth={2.6} /><rect x={50 + k * 128} y={624} width={60} height={20} rx={5} fill="#7a4a1a" {...o} strokeWidth={2.4} /></g>
					))}
				</g>
			))}
			{/* bunting */}
			<path d="M-300,260 Q300,340 900,270 Q1500,350 2200,260" stroke="#2b2a36" strokeWidth={3.4} fill="none" />
			{Array.from({length: 18}).map((_, i) => {
				const x = -300 + i * 140;
				const y = 270 + 36 * Math.sin((i / 18) * Math.PI * 2.4) + 40;
				const sw = Math.sin(f / 12 + i) * 6;
				return <path key={i} d={`M${x},${y} l${40},${sw} l-${20},${50} Z`} fill={['#ff5a6a', '#ffd84a', '#5ab8ff', '#7ae08a'][i % 4]} {...o} strokeWidth={2.4} />;
			})}
		</Svg>
	);
};

/* ================================== VET CLINIC ================================== */
export const VetRoom: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={X0} y={-200} width={WW} height={1100} fill="#d6ecea" />
		<rect x={X0} y={520} width={WW} height={380} fill="#b8dbd6" />
		<rect x={X0} y={510} width={WW} height={14} fill="#fff" />
		<Ground y={900} a="#e8e2d0" b="#cfc8b2" />
		{Array.from({length: 24}).map((_, i) => <rect key={i} x={X0 + i * 130} y={900} width={65} height={400} fill="#000" opacity={0.04} />)}
		{/* posters */}
		<rect x={260} y={190} width={200} height={260} rx={10} fill="#fff" {...o} />
		<path d="M360,260 q40,-20 50,30 q-10,50 -50,60 q-50,-10 -50,-60 q10,-50 50,-30 Z" fill="#e8b27a" {...o} strokeWidth={2.6} />
		<text x={360} y={410} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={26} fill="#3a7a8a">VET</text>
		<rect x={1500} y={210} width={240} height={190} rx={10} fill="#fff" {...o} />
		<path d="M1530,380 L1560,300 L1600,340 L1650,250 L1710,380" fill="none" stroke="#3a7a8a" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
		{/* clock */}
		<g transform="translate(960,230)">
			<circle r={62} fill="#fff" {...o} />
			<path d={`M0,0 L0,-44`} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(f / 30) * 6})`} />
			<path d={`M0,0 L0,-30`} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${(f / 30) * 0.5 + 60})`} />
		</g>
		{/* window */}
		<rect x={600} y={170} width={230} height={250} fill="#aee0ff" {...o} />
		<path d="M715,170 V420 M600,295 H830" stroke="#fff" strokeWidth={6} />
		{/* bench */}
		<g transform="translate(40,0)">
			<rect x={0} y={760} width={560} height={50} rx={14} fill="#4a86b8" {...o} />
			<rect x={0} y={700} width={560} height={70} rx={14} fill="#5a96c8" {...o} />
			<rect x={30} y={810} width={14} height={90} fill="#2b2a36" /><rect x={516} y={810} width={14} height={90} fill="#2b2a36" />
		</g>
		<g transform="translate(1360,0)">
			<rect x={0} y={760} width={500} height={50} rx={14} fill="#4a86b8" {...o} />
			<rect x={0} y={700} width={500} height={70} rx={14} fill="#5a96c8" {...o} />
			<rect x={30} y={810} width={14} height={90} fill="#2b2a36" /><rect x={456} y={810} width={14} height={90} fill="#2b2a36" />
		</g>
		{/* plant */}
		<g transform="translate(900,0)">
			<path d="M-34,900 L-26,790 H26 L34,900 Z" fill="#c8704a" {...o} />
			{[-40, -14, 10, 36].map((a, i) => <path key={i} d={`M0,790 Q${a * 2},${690 - i * 20 + Math.sin(f / 20 + i) * 6} ${a * 3.2},${650 - i * 10 + Math.sin(f / 20 + i) * 8}`} stroke="#3a9a5a" strokeWidth={16} strokeLinecap="round" fill="none" />)}
		</g>
	</Svg>
);

/* ================================== ZOO ================================== */
export const Zoo: React.FC<{f: number}> = ({f}) => {
	const t = T(f);
	return (
		<Svg>
			<Sky id="zoo-sky" a="#9ad8ff" b="#fff0c4" />
			<Cloud x={300 + ((t * 7) % 2600) - 300} y={150} s={1.2} />
			<Cloud x={1400 - ((t * 5) % 2600) + 600} y={110} s={1.0} o={0.8} />
			{/* far trees */}
			{[-200, 300, 800, 1400, 1900].map((x, i) => (
				<g key={i} transform={`translate(${x},0)`}>
					<rect x={-16} y={600} width={32} height={300} fill="#6a4a30" {...o} />
					{[[0, 560, 130], [-80, 620, 90], [80, 620, 94]].map((c, k) => <circle key={k} cx={c[0] + Math.sin(f / 30 + i) * 6} cy={c[1]} r={c[2]} fill={['#4aa05a', '#3a8a4a', '#5ab86a'][k]} {...o} />)}
				</g>
			))}
			<Ground y={900} a="#d9c28a" b="#b59a62" />
			{/* rocks & pond */}
			<ellipse cx={1500} cy={960} rx={420} ry={44} fill="#5ab0e0" {...o} />
			<path d={`M1250,960 q60,${-6 + Math.sin(f / 10) * 4} 120,0 t120,0 t120,0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} />
			<path d="M-300,900 Q-200,740 -40,760 Q80,780 140,900 Z" fill="#8f8a8c" {...o} />
			<path d="M1700,900 Q1760,760 1900,770 Q2020,790 2100,900 Z" fill="#8f8a8c" {...o} />
			{/* fence in front */}
			<rect x={X0} y={740} width={WW} height={14} fill="#3a3a4a" />
			{Array.from({length: 46}).map((_, i) => <rect key={i} x={X0 + i * 66} y={680} width={9} height={220} rx={4} fill="#3a3a4a" />)}
			<rect x={X0} y={880} width={WW} height={14} fill="#3a3a4a" />
			{/* sign */}
			<g transform="translate(260,0)"><rect x={0} y={420} width={12} height={260} fill="#6a4a30" /><rect x={-80} y={360} width={190} height={80} rx={10} fill="#2f7a4a" {...o} /><text x={15} y={412} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={36} fill="#fff">ZOO</text></g>
		</Svg>
	);
};

/* ============================== NIGHT ALLEY ============================== */
export const Alley: React.FC<{f: number}> = ({f}) => {
	const flick = 0.7 + 0.3 * Math.sin(f / 2.7) * Math.sin(f / 9);
	return (
		<Svg>
			<Sky id="al-sky" a="#060818" b="#1f2450" />
			{Array.from({length: 30}).map((_, i) => <circle key={i} cx={X0 + random('as' + i) * WW} cy={random('ay' + i) * 160} r={1.4} fill="#fff" opacity={0.5} />)}
			<Bricks id="al-b" a="#3d2c3c" b="#241a26" />
			<rect x={-500} y={160} width={1000} height={740} fill="url(#al-b)" {...o} />
			<rect x={1500} y={100} width={1000} height={800} fill="url(#al-b)" {...o} />
			{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <Win key={`${r}${c}`} x={-420 + c * 280} y={230 + r * 200} w={100} h={130} lit={random('al' + r + c) > 0.6} />))}
			<rect x={500} y={300} width={1000} height={600} fill="#161a38" />
			{/* fire escape */}
			<g stroke="#0e1024" strokeWidth={6} fill="none">
				<path d="M560,420 H1000 M560,560 H1000 M560,700 H1000 M570,420 V900 M990,420 V900 M600,420 L960,560 M600,560 L960,700" />
			</g>
			<Ground y={900} a="#1a1c34" b="#101226" />
			<path d={`M${X0},950 H${X0 + WW}`} stroke="#6a78c8" strokeWidth={4} opacity={0.2} />
			{/* dumpster */}
			<g transform="translate(1180,0)">
				<rect x={0} y={700} width={340} height={200} rx={10} fill="#2e6a52" {...o} />
				<rect x={-12} y={680} width={364} height={30} rx={8} fill="#1f4a3a" {...o} />
				<circle cx={50} cy={920} r={16} fill="#111" /><circle cx={290} cy={920} r={16} fill="#111" />
				<path d="M60,680 q-20,-40 6,-60 M200,680 q30,-30 70,-20 M110,680 l24,-50" stroke="#a89a7a" strokeWidth={10} strokeLinecap="round" fill="none" />
			</g>
			{/* lamp */}
			<g transform="translate(300,0)">
				<rect x={-6} y={380} width={12} height={520} fill="#2b2a36" />
				<path d="M-6,390 q60,-40 90,0" stroke="#2b2a36" strokeWidth={10} fill="none" />
				<ellipse cx={86} cy={560} rx={190} ry={380} fill="#ffe3a0" opacity={0.1 * flick} />
				<ellipse cx={86} cy={400} rx={30} ry={12} fill="#fff1c0" opacity={flick} />
			</g>
			{/* steam vent */}
			<Smoke x={800} y={900} f={f} n={5} c="#9aa0c8" />
		</Svg>
	);
};

/* ================================== BASEMENT ================================== */
export const Basement: React.FC<{f: number; alarm?: boolean}> = ({f, alarm}) => {
	const shake = Math.sin(f * 1.7) * 1.5;
	return (
		<Svg>
			<rect x={X0} y={-200} width={WW} height={1200} fill="#2a2d3c" />
			<Bricks id="bs-b" a="#3a3e52" b="#252838" />
			<rect x={X0} y={-200} width={WW} height={1100} fill="url(#bs-b)" opacity={0.7} />
			<Ground y={900} a="#33364a" b="#232536" />
			{/* pipes */}
			{[200, 280].map((y, i) => <rect key={i} x={X0} y={y} width={WW} height={34} fill={i ? '#7a8294' : '#a05a3a'} {...o} />)}
			{[100, 700, 1500, 2100].map((x, i) => <rect key={i} x={x} y={150} width={36} height={160} fill="#7a8294" {...o} />)}
			{/* boiler */}
			<g transform={`translate(${760 + shake},0)`}>
				<rect x={0} y={330} width={420} height={570} rx={40} fill="#8a96a8" {...o} />
				<rect x={20} y={350} width={380} height={160} rx={30} fill="#aab4c4" opacity={0.6} />
				<rect x={50} y={620} width={320} height={160} rx={10} fill="#4a5468" {...o} />
				<circle cx={210} cy={460} r={64} fill="#f2f2f2" {...o} />
				<path d="M210,460 L210,410" stroke={alarm ? '#e03a3a' : INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${alarm ? 70 + Math.sin(f / 3) * 6 : -30 + Math.sin(f / 9) * 10} 210 460)`} />
				<path d="M160,430 A60,60 0 0 1 260,430" fill="none" stroke="#3aa05a" strokeWidth={6} /><path d="M246,418 A60,60 0 0 1 266,450" fill="none" stroke="#e03a3a" strokeWidth={7} />
				<path d="M120,900 V860 M300,900 V860" stroke={INK} strokeWidth={14} />
				<circle cx={100} cy={700} r={16} fill={alarm ? '#ff4a4a' : '#6aff8a'} {...o} strokeWidth={2.6} opacity={0.6 + 0.4 * Math.sin(f / 4)} />
				<Smoke x={210} y={330} f={f} c="#b0b8c8" n={5} />
			</g>
			{/* bulb */}
			<path d="M300,-100 V300" stroke="#111" strokeWidth={4} /><circle cx={300} cy={320} r={22} fill="#ffe09a" /><ellipse cx={300} cy={560} rx={260} ry={420} fill="#ffe3a0" opacity={0.07 + 0.03 * Math.sin(f / 3)} />
			{/* crates */}
			<rect x={1500} y={760} width={150} height={140} fill="#9a7048" {...o} /><rect x={1580} y={640} width={130} height={120} fill="#b0844e" {...o} />
		</Svg>
	);
};

/* ========================== simple colour backdrop for info cards ========================== */
export const InfoBg: React.FC<{f: number; a?: string; b?: string; dots?: boolean}> = ({f, a = '#141a3d', b = '#2a3470', dots = true}) => (
	<Svg>
		<Sky id={'ib' + a} a={a} b={b} h={1200} />
		{dots
			? Array.from({length: 26}).map((_, i) => {
					const x = X0 + random('id' + i) * WW;
					const y = random('iy' + i) * 1200;
					return <circle key={i} cx={x} cy={(y + f * (0.2 + random('iv' + i) * 0.4)) % 1200 - 50} r={3 + random('ir' + i) * 6} fill="#fff" opacity={0.08} />;
				})
			: null}
		<path d={`M${X0},900 H${X0 + WW}`} stroke="#fff" strokeOpacity={0.06} strokeWidth={4} />
	</Svg>
);
