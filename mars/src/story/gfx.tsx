import React from 'react';
import {AbsoluteFill, Easing, interpolate, random} from 'remotion';
import {env} from '../kit/actions';
import {FONT, HAND} from '../kit/ui';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const bk = Easing.out(Easing.back(2));

/* ============================== предметы в руке (координаты кисти) ============================== */
export const ITEM = {
	thermos: (
		<g transform="rotate(-10)">
			<rect x={-9} y={-6} width={18} height={44} rx={6} fill="#e8eaf2" stroke="#8a93b0" strokeWidth={2} />
			<rect x={-9} y={-12} width={18} height={10} rx={4} fill="#ff4d5a" />
		</g>
	),
	flashlight: (
		<g>
			<rect x={-7} y={-4} width={14} height={34} rx={4} fill="#2a2f44" />
			<rect x={-9} y={26} width={18} height={10} rx={3} fill="#ffd34a" />
		</g>
	),
	radio: (
		<g>
			<rect x={-10} y={-8} width={20} height={40} rx={5} fill="#2a2f44" />
			<rect x={-5} y={-2} width={10} height={14} rx={2} fill="#5cff9a" opacity={0.8} />
			<rect x={-2} y={-28} width={4} height={22} fill="#8a93b0" />
		</g>
	),
	chalk: <rect x={-3} y={-2} width={6} height={22} rx={2} fill="#fff" />,
	marker: (
		<g>
			<rect x={-5} y={-2} width={10} height={34} rx={3} fill="#2a8cff" />
			<rect x={-3} y={30} width={6} height={8} fill="#1a1a1a" />
		</g>
	),
	wrench: (
		<g transform="rotate(20)">
			<rect x={-4} y={-4} width={8} height={54} rx={3} fill="#9aa4ba" />
			<circle cx={0} cy={-8} r={12} fill="none" stroke="#9aa4ba" strokeWidth={8} />
		</g>
	),
	mug: (
		<g>
			<rect x={-12} y={-4} width={24} height={26} rx={5} fill="#f4f4f0" />
			<path d="M12,4 q12,2 0,14" stroke="#f4f4f0" strokeWidth={4} fill="none" />
		</g>
	),
	baby: (
		<g transform="translate(6,4) rotate(-20)">
			<ellipse cx={0} cy={0} rx={24} ry={15} fill="#ffe0e8" />
			<circle cx={-22} cy={-4} r={11} fill="#111" />
			<circle cx={-24} cy={-4} r={2} fill="#fff" />
		</g>
	),
	potato: (
		<g>
			<ellipse cx={0} cy={4} rx={14} ry={10} fill="#c9a06a" />
			<circle cx={-4} cy={2} r={2} fill="#8a6a40" />
		</g>
	),
	plant: (
		<g>
			<path d="M0,20 Q4,0 0,-20" stroke="#3fbf5a" strokeWidth={5} fill="none" />
			<path d="M0,-4 q-22,-8 -24,-26 q20,2 24,26z" fill="#58d46a" />
			<path d="M0,-12 q22,-8 24,-26 q-20,2 -24,26z" fill="#3fbf5a" />
		</g>
	),
	lamp: (
		<g>
			<rect x={-12} y={0} width={24} height={20} rx={4} fill="#c9a27a" />
			<circle cx={0} cy={-6} r={14} fill="#ffe08a" />
			<circle cx={0} cy={-6} r={44} fill="#ffe08a" opacity={0.2} />
		</g>
	),
	wheel: <g />,
};

/* ================================ мировая графика (внутри <Svg>) ================================ */
export const Rover: React.FC<{x: number; y: number; s?: number; dir?: 1 | -1; t?: number; dust?: boolean}> = ({x, y, s = 1, dir = 1, t = 0, dust = true}) => (
	<g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
		{dust ? (
			<g opacity={0.5}>
				{[0, 1, 2, 3].map((i) => {
					const k = ((t / 14 + i / 4) % 1);
					return <circle key={i} cx={-130 - k * 150} cy={-10 - k * 40} r={16 + k * 36} fill="#d9a070" opacity={(1 - k) * 0.8} />;
				})}
			</g>
		) : null}
		<rect x={-110} y={-86} width={230} height={50} rx={14} fill="#e8eaf2" />
		<path d="M-60,-86 L-30,-140 L60,-140 L96,-86 Z" fill="#cfd5e4" />
		<path d="M-44,-92 L-24,-130 L50,-130 L80,-92 Z" fill="#3a5a8a" />
		<rect x={-110} y={-50} width={230} height={14} fill="#ff6a3c" />
		<rect x={116} y={-70} width={30} height={14} rx={7} fill="#ffe08a" />
		<rect x={-4} y={-190} width={6} height={52} fill="#8d97ad" />
		<circle cx={-1} cy={-192} r={8} fill="#ff4d4d" />
		{[-84, 0, 84].map((wx, i) => (
			<g key={i} transform={`translate(${wx},-18)`}>
				<circle r={30} fill="#1a1d2a" />
				<circle r={12} fill="#8d97ad" />
				<g transform={`rotate(${t * 18 * dir})`}>
					<line x1={-26} y1={0} x2={26} y2={0} stroke="#8d97ad" strokeWidth={4} />
					<line x1={0} y1={-26} x2={0} y2={26} stroke="#8d97ad" strokeWidth={4} />
				</g>
			</g>
		))}
	</g>
);

/* белая доска со списком: строки пишутся мелом по очереди */
export const Whiteboard: React.FC<{x: number; y: number; w?: number; h?: number; f: number; items: {t: string; at: number; c?: string}[]; title?: string; tilt?: number}> = ({x, y, w = 560, h = 420, f, items, title, tilt = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${tilt})`}>
		<rect x={-w / 2 - 14} y={-14} width={w + 28} height={h + 28} rx={14} fill="#8d97ad" />
		<rect x={-w / 2} y={0} width={w} height={h} rx={8} fill="#f4f6fa" />
		<rect x={-w / 2} y={h} width={w} height={12} fill="#6a738c" />
		{title ? (
			<text x={0} y={52} textAnchor="middle" fontFamily={HAND} fontSize={52} fontWeight={700} fill="#1a2250">
				{title}
			</text>
		) : null}
		{items.map((it, i) => {
			const k = interpolate(f, [it.at, it.at + 14], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
			if (k <= 0) return null;
			const yy = (title ? 120 : 70) + i * 62;
			const tw = it.t.length * 21;
			return (
				<g key={i}>
					<clipPath id={'wb' + Math.round(x) + i}>
						<rect x={-w / 2 + 20} y={yy - 40} width={(w - 40) * k} height={60} />
					</clipPath>
					<g clipPath={`url(#wb${Math.round(x)}${i})`}>
						<text x={-w / 2 + 70} y={yy} fontFamily={HAND} fontSize={44} fontWeight={700} fill={it.c ?? '#1a2250'}>
							{it.t}
						</text>
					</g>
					<g opacity={k}>
						<path d={`M${-w / 2 + 28},${yy - 12} l12,14 l22,-30`} stroke="#2fbf6a" strokeWidth={7} fill="none" strokeLinecap="round" />
					</g>
					<line x1={-w / 2 + 70} y1={yy + 8} x2={-w / 2 + 70 + tw * k} y2={yy + 8} stroke={it.c ?? '#1a2250'} strokeWidth={2} opacity={0.2} />
				</g>
			);
		})}
	</g>
);

/* расходящиеся кольца сигнала */
export const SignalRings: React.FC<{x: number; y: number; f: number; t0: number; t1: number; c?: string; n?: number; max?: number}> = ({x, y, f, t0, t1, c = '#5cff9a', n = 4, max = 420}) => {
	const k = env(f, t0, t1, 6, 8);
	if (k <= 0) return null;
	return (
		<g opacity={k}>
			{Array.from({length: n}).map((_, i) => {
				const u = ((f * 0.025 + i / n) % 1);
				return <circle key={i} cx={x} cy={y} r={u * max} fill="none" stroke={c} strokeWidth={6 * (1 - u) + 1} opacity={1 - u} />;
			})}
		</g>
	);
};

export const Beam: React.FC<{x: number; y: number; ang: number; len?: number; w?: number; o?: number}> = ({x, y, ang, len = 520, w = 190, o = 0.5}) => (
	<g transform={`translate(${x},${y}) rotate(${ang})`} style={{mixBlendMode: 'screen'}}>
		<defs>
			<linearGradient id={'bm' + Math.round(x)} x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stopColor="#fff6c8" stopOpacity={o} />
				<stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
			</linearGradient>
		</defs>
		<path d={`M0,-8 L${len},${-w / 2} L${len},${w / 2} L0,8 Z`} fill={`url(#bm${Math.round(x)})`} />
	</g>
);

export const Treadmill: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-130} y={-24} width={260} height={24} rx={10} fill="#2a2f44" />
		{Array.from({length: 9}).map((_, i) => (
			<rect key={i} x={-120 + ((i * 30 + f * 4) % 270)} y={-22} width={6} height={18} fill="#4a5578" />
		))}
		<rect x={96} y={-170} width={14} height={150} fill="#6a738c" />
		<rect x={70} y={-190} width={70} height={36} rx={8} fill="#10202a" />
		<rect x={78} y={-184} width={54} height={20} rx={4} fill="#5cff9a" opacity={0.6} />
	</g>
);

export const Plant: React.FC<{x: number; y: number; k?: number; s?: number; c?: string}> = ({x, y, k = 1, s = 1, c = '#3fbf5a'}) => (
	<g transform={`translate(${x},${y}) scale(${s * k})`}>
		<path d="M0,0 Q10,-60 0,-120" stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
		<path d="M0,-50 q-52,-20 -58,-60 q46,6 58,60 Z" fill="#58d46a" />
		<path d="M0,-86 q52,-20 58,-60 q-46,6 -58,60 Z" fill={c} />
		<path d="M0,-118 q-30,-14 -34,-44 q28,4 34,44 Z" fill="#7fe88a" />
	</g>
);

export const Cup: React.FC<{x: number; y: number; steam?: number; f?: number}> = ({x, y, steam = 0, f = 0}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-14} y={-26} width={28} height={26} rx={6} fill="#f4f4f0" />
		{steam > 0
			? [0, 1].map((i) => (
					<path key={i} d={`M${-6 + i * 12},-30 q-8,-16 0,-30 q8,-14 0,-28`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.45 * steam} transform={`translate(0,${-((f + i * 12) % 30)})`} />
				))
			: null}
	</g>
);

export const Lamp: React.FC<{x: number; y: number; on?: number; s?: number}> = ({x, y, on = 1, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<circle cx={0} cy={-30} r={240} fill="#ffd98a" opacity={0.16 * on} />
		<circle cx={0} cy={-30} r={110} fill="#ffd98a" opacity={0.18 * on} />
		<rect x={-26} y={-6} width={52} height={10} rx={4} fill="#8d97ad" />
		<path d="M-18,-6 q-6,-38 18,-42 q24,4 18,42 Z" fill={on > 0.2 ? '#ffe9a8' : '#555'} />
	</g>
);

/* ============================== экранная графика (HTML-оверлей) ============================== */
/* карточка со статистикой: число вылетает, подпись печатается */
export const Stat: React.FC<{f: number; t0: number; t1: number; big: string; label: string; sub?: string; x?: number; y?: number; c?: string; w?: number; align?: 'left' | 'right' | 'center'}> = ({
	f,
	t0,
	t1,
	big,
	label,
	sub,
	x = 120,
	y = 120,
	c = '#ffc94a',
	w = 520,
	align = 'left',
}) => {
	const k = env(f, t0, t1, 10, 9);
	if (k <= 0) return null;
	const pop = interpolate(f, [t0, t0 + 14], [0.6, 1], {...cl, easing: bk});
	const left = align === 'right' ? undefined : align === 'center' ? 960 - w / 2 : x;
	const right = align === 'right' ? x : undefined;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left,
					right,
					top: y,
					width: w,
					opacity: k,
					transform: `scale(${pop}) translateY(${Math.sin(f / 22) * 4}px) rotate(${(align === 'right' ? 1 : -1) * 1.5}deg)`,
					transformOrigin: align === 'right' ? 'right top' : 'left top',
					background: 'linear-gradient(135deg,rgba(14,16,40,.94),rgba(30,20,50,.94))',
					border: `4px solid ${c}`,
					borderRadius: 26,
					padding: '16px 28px 18px',
					boxShadow: `0 10px 40px rgba(0,0,0,.5), 0 0 40px ${c}55`,
					fontFamily: FONT,
					color: '#fff',
				}}
			>
				<div style={{fontSize: 92, fontWeight: 900, lineHeight: 1, color: c, letterSpacing: -2}}>{big}</div>
				<div style={{fontSize: 34, fontWeight: 700, marginTop: 6, letterSpacing: 1.5, textTransform: 'uppercase'}}>{label}</div>
				{sub ? <div style={{fontSize: 26, opacity: 0.8, marginTop: 4}}>{sub}</div> : null}
				<div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${interpolate(f, [t0 + 4, t0 + 22], [0, 100], cl)}%`, background: c, borderRadius: 6}} />
			</div>
		</AbsoluteFill>
	);
};

/* плашка-имя над персонажем: «COMMANDER HALE» */
export const Chip: React.FC<{f: number; t0: number; t1: number; text: string; x: number; y: number; c?: string; size?: number}> = ({f, t0, t1, text, x, y, c = '#6ad4ff', size = 34}) => {
	const k = env(f, t0, t1, 8, 8);
	if (k <= 0) return null;
	const pop = interpolate(f, [t0, t0 + 12], [0.5, 1], {...cl, easing: bk});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) scale(${pop})`, opacity: k, background: '#11142c', border: `3px solid ${c}`, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: size, padding: '6px 22px', borderRadius: 40, letterSpacing: 1.2, whiteSpace: 'nowrap', boxShadow: `0 0 24px ${c}66`}}>
				{text}
			</div>
		</AbsoluteFill>
	);
};

/* крупный заголовок на весь кадр: «SOL 1», «70 DAYS LATER» */
export const Big: React.FC<{f: number; t0: number; t1: number; text: string; sub?: string; c?: string; y?: number}> = ({f, t0, t1, text, sub, c = '#fff', y = 360}) => {
	const k = env(f, t0, t1, 8, 10);
	if (k <= 0) return null;
	const pop = interpolate(f, [t0, t0 + 16], [0.4, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', alignItems: 'center'}}>
			<div style={{position: 'absolute', top: y, opacity: k, transform: `scale(${pop}) rotate(${Math.sin(f / 30) * 0.8}deg)`, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: c, textShadow: '0 6px 0 rgba(0,0,0,.45), 0 0 50px rgba(255,120,90,.4)'}}>
				<div style={{fontSize: 190, lineHeight: 1, letterSpacing: -4}}>{text}</div>
				{sub ? <div style={{fontSize: 54, marginTop: 10, letterSpacing: 4, fontWeight: 700}}>{sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

/* термометр: ртуть падает до значения */
export const Thermo: React.FC<{f: number; t0: number; t1: number; x?: number; y?: number; from?: number; to?: number; label?: string}> = ({f, t0, t1, x = 1560, y = 140, from = 20, to = -60, label = '°C'}) => {
	const k = env(f, t0, t1, 10, 9);
	if (k <= 0) return null;
	const v = interpolate(f, [t0 + 6, t0 + 50], [from, to], {...cl, easing: Easing.inOut(Easing.cubic)});
	const h = ((v + 100) / 140) * 520;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{opacity: k}}>
				<g transform={`translate(${x},${y})`}>
					<rect x={-40} y={-20} width={80} height={600} rx={40} fill="#11142c" stroke="#6ad4ff" strokeWidth={5} />
					<rect x={-14} y={560 - h} width={28} height={h} rx={14} fill={v < 0 ? '#6ad4ff' : '#ff6a5a'} />
					<circle cx={0} cy={560} r={34} fill={v < 0 ? '#6ad4ff' : '#ff6a5a'} />
					<text x={86} y={300} fontFamily={FONT} fontWeight={900} fontSize={84} fill="#fff">
						{Math.round(v)}
						{label}
					</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};

/* таймер/часы: цифры бегут */
export const Timer: React.FC<{f: number; t0: number; t1: number; from: number; to: number; unit: string; x?: number; y?: number; c?: string; label?: string}> = ({f, t0, t1, from, to, unit, x = 120, y = 120, c = '#ff6a5a', label}) => {
	const k = env(f, t0, t1, 8, 8);
	if (k <= 0) return null;
	const v = interpolate(f, [t0 + 4, t1 - 8], [from, to], {...cl, easing: Easing.inOut(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: x, top: y, opacity: k, background: '#0b0e22', border: `4px solid ${c}`, borderRadius: 24, padding: '12px 30px', fontFamily: FONT, color: '#fff', boxShadow: `0 0 36px ${c}66`, transform: `scale(${0.85 + 0.15 * k})`}}>
				{label ? <div style={{fontSize: 28, letterSpacing: 3, color: c, fontWeight: 800}}>{label}</div> : null}
				<div style={{fontSize: 110, fontWeight: 900, lineHeight: 1}}>
					{Math.round(v)}
					<span style={{fontSize: 46, marginLeft: 12}}>{unit}</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* имена, которые поднимаются вверх (церемония) */
export const Names: React.FC<{f: number; t0: number; t1: number; names: string[]; x0?: number; x1?: number; y?: number; c?: string}> = ({f, t0, t1, names, x0 = 300, x1 = 1620, y = 900, c = '#ffe9a8'}) => {
	if (f < t0 || f > t1 + 80) return null;
	const n = names.length;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{names.map((nm, i) => {
				const s = t0 + (i * (t1 - t0)) / n;
				const u = (f - s) / 80;
				if (u < 0 || u > 1) return null;
				const xx = x0 + ((i * 337) % (x1 - x0));
				return (
					<div key={i} style={{position: 'absolute', left: xx, top: y - u * 640, transform: 'translateX(-50%)', opacity: Math.sin(u * Math.PI), fontFamily: HAND, fontWeight: 700, fontSize: 72 + (i % 3) * 10, color: c, textShadow: '0 0 24px #ffb84a, 0 3px 0 rgba(0,0,0,.5)', whiteSpace: 'nowrap'}}>
						{nm}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* схема «Земля — Марс»: сигнал летит туда и обратно */
export const OrbitSignal: React.FC<{f: number; t0: number; t1: number; c?: string}> = ({f, t0, t1, c = '#5cff9a'}) => {
	const k = env(f, t0, t1, 12, 10);
	if (k <= 0) return null;
	const u = ((f - t0) / 70) % 1;
	const px = 380 + 1160 * u;
	const py = 540 - Math.sin(u * Math.PI) * 160;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<rect x={240} y={240} width={1440} height={600} rx={30} fill="#080c20" opacity={0.92} stroke="#3b4a78" strokeWidth={6} />
				<circle cx={380} cy={540} r={46} fill="#6fb0ff" />
				<circle cx={380} cy={540} r={74} fill="none" stroke="#6fb0ff" strokeWidth={3} opacity={0.4} />
				<text x={380} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#bfe0ff">EARTH</text>
				<circle cx={1540} cy={540} r={32} fill="#ff6a4a" />
				<text x={1540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#ffb59a">MARS</text>
				<path d="M380,540 Q960,300 1540,540" fill="none" stroke={c} strokeWidth={3} strokeDasharray="10 12" opacity={0.7} />
				<circle cx={px} cy={py} r={16} fill={c} />
				<circle cx={px} cy={py} r={34} fill={c} opacity={0.25} />
				<text x={960} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff">3 – 22 MINUTES</text>
				<text x={960} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#9fb4ff">one way, depending on where the planets are</text>
			</svg>
		</AbsoluteFill>
	);
};

/* круговая диаграмма (состав воздуха и т.п.) */
export const Pie: React.FC<{f: number; t0: number; t1: number; pct: number; label: string; c?: string; x?: number; y?: number}> = ({f, t0, t1, pct, label, c = '#ff9a5a', x = 1400, y = 180}) => {
	const k = env(f, t0, t1, 10, 9);
	if (k <= 0) return null;
	const u = interpolate(f, [t0 + 4, t0 + 40], [0, pct / 100], {...cl, easing: Easing.out(Easing.cubic)});
	const R = 130;
	const a = u * Math.PI * 2;
	const large = a > Math.PI ? 1 : 0;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<g transform={`translate(${x},${y + R + 20})`}>
					<circle r={R + 18} fill="#0b0e22" stroke={c} strokeWidth={4} />
					<circle r={R} fill="#2a3050" />
					<path d={`M0,0 L0,${-R} A${R},${R} 0 ${large} 1 ${Math.sin(a) * R},${-Math.cos(a) * R} Z`} fill={c} />
					<text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#fff" stroke="#0b0e22" strokeWidth={8} paintOrder="stroke">
						{Math.round(u * 100)}%
					</text>
					<text y={R + 74} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff" letterSpacing={2}>
						{label}
					</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};

/* предупреждение: красная рамка, мигает */
export const Alert: React.FC<{f: number; t0: number; t1: number; text: string}> = ({f, t0, t1, text}) => {
	const k = env(f, t0, t1, 6, 6);
	if (k <= 0) return null;
	const blink = 0.55 + 0.45 * Math.sin(f / 2.2);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 ${120 * blink}px ${30 * blink}px rgba(255,40,60,.65)`}} />
			<div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#ff4d5a', letterSpacing: 6, textShadow: '0 4px 0 #000'}}>⚠ {text} ⚠</div>
		</AbsoluteFill>
	);
};
export const rnd = random;

/* настенные часы: стрелка делает оборот (и ещё чуть-чуть — лишние 39 минут) */
export const ClockFace: React.FC<{x: number; y: number; r?: number; f: number; t0: number; t1: number; spins?: number; c?: string}> = ({x, y, r = 120, f, t0, t1, spins = 1, c = '#ffc94a'}) => {
	const k = env(f, t0, t1, 8, 8);
	if (k <= 0) return null;
	const u = interpolate(f, [t0 + 6, t1 - 8], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
	const a = u * 360 * spins;
	return (
		<g transform={`translate(${x},${y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
			<circle r={r + 12} fill="#11142c" stroke={c} strokeWidth={8} />
			<circle r={r} fill="#f4f6fa" />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={0} y1={-r + 10} x2={0} y2={-r + (i % 3 === 0 ? 30 : 20)} stroke="#1a2250" strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />
			))}
			<line x1={0} y1={0} x2={0} y2={-r + 24} stroke="#ff4d5a" strokeWidth={7} strokeLinecap="round" transform={`rotate(${a})`} />
			<line x1={0} y1={0} x2={0} y2={-r * 0.55} stroke="#1a2250" strokeWidth={9} strokeLinecap="round" transform={`rotate(${a / 12})`} />
			<circle r={9} fill="#1a2250" />
		</g>
	);
};

export const Envelope: React.FC<{f: number; t0: number; t1: number; x0: number; x1: number; y: number}> = ({f, t0, t1, x0, x1, y}) => {
	if (f < t0 || f > t1) return null;
	const u = (f - t0) / (t1 - t0);
	return (
		<g transform={`translate(${x0 + (x1 - x0) * u},${y - Math.sin(u * Math.PI) * 140}) rotate(${Math.sin(u * 6) * 14})`}>
			<rect x={-60} y={-40} width={120} height={80} rx={8} fill="#f4f0e0" stroke="#8a7a50" strokeWidth={4} />
			<path d="M-60,-40 L0,8 L60,-40" fill="none" stroke="#8a7a50" strokeWidth={4} />
			<circle cx={34} cy={22} r={9} fill="#ff4d5a" />
		</g>
	);
};

/* пара берётся за руки: возвращает позы с нужной рукой в точке между ними */
import {Pose, toLocal} from '../engine/Stickman';
import {reach} from '../kit/actions';
export const holdAt = (p: Pose, k: number, x: number, facing: 1 | -1, midX: number, midY = 676, s = 1, fl = 900) => reach(p, 'F', toLocal(midX, midY, x, fl - 157 * s, s, facing), k);

/* календарь: клетки по очереди зачёркиваются */
export const Calendar: React.FC<{f: number; t0: number; t1: number; x?: number; y?: number; title?: string}> = ({f, t0, t1, x = 960, y = 200, title = 'SOLS'}) => {
	const k = env(f, t0, t1, 10, 8);
	if (k <= 0) return null;
	const n = Math.floor(interpolate(f, [t0 + 8, t1 - 8], [0, 35], cl));
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<g transform={`translate(${x},${y}) scale(${0.8 + 0.2 * k})`}>
					<rect x={-300} y={-20} width={600} height={470} rx={22} fill="#f4f6fa" stroke="#ff6a5a" strokeWidth={8} />
					<rect x={-300} y={-20} width={600} height={80} rx={22} fill="#ff6a5a" />
					<text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" letterSpacing={6}>
						{title}
					</text>
					{Array.from({length: 35}).map((_, i) => {
						const cx = -240 + (i % 7) * 80;
						const cy = 110 + Math.floor(i / 7) * 64;
						return (
							<g key={i}>
								<text x={cx} y={cy + 12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#1a2250">
									{i + 1}
								</text>
								{i < n ? <path d={`M${cx - 26},${cy - 22} L${cx + 26},${cy + 22} M${cx + 26},${cy - 22} L${cx - 26},${cy + 22}`} stroke="#ff4d5a" strokeWidth={7} strokeLinecap="round" /> : null}
							</g>
						);
					})}
				</g>
			</svg>
		</AbsoluteFill>
	);
};

/* два солнца: на Земле и на Марсе (вдвое слабее) */
export const SunCompare: React.FC<{f: number; t0: number; t1: number}> = ({f, t0, t1}) => {
	const k = env(f, t0, t1, 10, 8);
	if (k <= 0) return null;
	const u = interpolate(f, [t0 + 10, t0 + 46], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<rect x={260} y={200} width={1400} height={520} rx={30} fill="#0a0d20" opacity={0.9} stroke="#ffd34a" strokeWidth={6} />
				<g transform="translate(620,430)">
					<circle r={170} fill="#ffd34a" opacity={0.22} />
					<circle r={110} fill="#ffe27a" />
					<text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">EARTH</text>
				</g>
				<g transform="translate(1300,430)">
					<circle r={170 * (1 - 0.3 * u)} fill="#ffb15a" opacity={0.18} />
					<circle r={110 * (1 - 0.3 * u)} fill={u > 0.5 ? '#d89a5a' : '#ffe27a'} />
					<text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">MARS</text>
					<text y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#ff8a5a" opacity={u}>HALF AS BRIGHT</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};

/* грузовой корабль, наполовину занесённый песком */
export const Ship: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(-6)`}>
		<path d="M-70,0 L-70,-260 Q-70,-380 0,-440 Q70,-380 70,-260 L70,0 Z" fill="#e8eaf2" />
		<path d="M0,-440 Q70,-380 70,-260 L70,0 L0,0 Z" fill="#b8c0d4" />
		<circle cx={0} cy={-300} r={26} fill="#3a5a8a" stroke="#8d97ad" strokeWidth={6} />
		<rect x={-70} y={-170} width={140} height={22} fill="#ff6a3c" />
		<path d="M-70,-60 L-140,40 L-70,10 Z M70,-60 L140,40 L70,10 Z" fill="#8d97ad" />
		<path d="M-260,40 Q-100,-90 40,-60 Q180,-90 300,40 Z" fill="#a8502c" />
	</g>
);

/* скелет-рентген для «кости слабеют» */
export const Beams: React.FC<{f: number; x0: number; x1: number; y0: number; y1: number; n?: number; c?: string}> = ({f, x0, x1, y0, y1, n = 16, c = '#ffe27a'}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const sp = 6 + random('bm' + i) * 8;
			const t = ((f * sp + random('bt' + i) * 900) % 900) / 900;
			const sx = x0 + random('bx' + i) * (x1 - x0);
			return <line key={i} x1={sx - 200 * t} y1={y0 + (y1 - y0) * t * 0 - 100 + 900 * t * 0.9 - 600} x2={sx - 200 * t - 30} y2={y0 + (y1 - y0) * t * 0 - 100 + 900 * t * 0.9 - 560} stroke={c} strokeWidth={3} opacity={0.8} />;
		})}
	</g>
);

export const Ball: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 24}) => (
	<g transform={`translate(${x},${y})`}>
		<circle r={r} fill="#ff8a3c" stroke="#8a3a10" strokeWidth={3} />
		<path d={`M${-r},0 H${r} M0,${-r} V${r}`} stroke="#8a3a10" strokeWidth={3} />
	</g>
);

export const Sparks: React.FC<{x: number; y: number; f: number; n?: number}> = ({x, y, f, n = 18}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const u = ((f * 0.07 + random('sp' + i)) % 1);
			const a = -Math.PI * (0.1 + random('sa' + i) * 0.8);
			return <circle key={i} cx={x + Math.cos(a) * 160 * u} cy={y + Math.sin(a) * 160 * u + 280 * u * u} r={4 * (1 - u) + 1} fill="#ffe27a" opacity={1 - u} />;
		})}
		<circle cx={x} cy={y} r={26} fill="#bfe8ff" opacity={0.85} />
	</g>
);

export const Barbell: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-150} y={-6} width={300} height={12} rx={5} fill="#9aa4ba" />
		{[-150, 150].map((px) => (
			<g key={px}>
				<rect x={px - 16} y={-44} width={32} height={88} rx={8} fill="#2a2f44" />
				<rect x={px - 30} y={-30} width={14} height={60} rx={6} fill="#4a5578" />
			</g>
		))}
	</g>
);
export const Bubbles: React.FC<{x: number; y: number; f: number; n?: number}> = ({x, y, f, n = 10}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const u = ((f * 0.012 + i / n) % 1);
			return <circle key={i} cx={x + Math.sin(i * 3 + f / 20) * 50} cy={y - u * 340} r={5 + (i % 3) * 4} fill="none" stroke="#bfe8ff" strokeWidth={3} opacity={1 - u} />;
		})}
	</g>
);

/* планета с пылевой бурей, которая постепенно закрывает её целиком */
export const Globe: React.FC<{x: number; y: number; r: number; f: number; t0: number; t1: number}> = ({x, y, r, f, t0, t1}) => {
	const k = interpolate(f, [t0, t1], [0, 1], cl);
	return (
		<g transform={`translate(${x},${y})`}>
			<defs>
				<radialGradient id="gl-g" cx="0.35" cy="0.3" r="0.9">
					<stop offset="0" stopColor="#e8905a" />
					<stop offset="1" stopColor="#6a2a1c" />
				</radialGradient>
				<clipPath id="gl-c"><circle r={r} /></clipPath>
			</defs>
			<circle r={r + 30} fill="#ff8a5a" opacity={0.12} />
			<circle r={r} fill="url(#gl-g)" />
			<g clipPath="url(#gl-c)">
				<path d={`M${-r},${-r * 0.1} Q${-r * 0.4},${-r * 0.4} ${r * 0.1},${-r * 0.1} T${r},${r * 0.1}`} stroke="#a85a3a" strokeWidth={r * 0.12} fill="none" opacity={0.6} />
				<g opacity={k}>
					{Array.from({length: 14}).map((_, i) => (
						<ellipse key={i} cx={Math.sin(f / 60 + i) * r * 0.5 + (random('gb' + i) - 0.5) * r * 1.4} cy={(random('gc' + i) - 0.5) * r * 1.8} rx={r * (0.5 + random('gd' + i) * 0.5) * Math.min(1, k * 1.6)} ry={r * 0.22} fill="#c89a62" opacity={0.7} transform={`rotate(${(i * 24 + f * 0.3) % 360})`} />
					))}
					<circle r={r} fill="#b98458" opacity={Math.max(0, k - 0.5) * 1.2} />
				</g>
			</g>
			<circle r={r} fill="none" stroke="#ffd0b0" strokeWidth={3} opacity={0.5} />
		</g>
	);
};
export const Tears: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
	<g>
		{[0, 1].map((i) => {
			const u = ((f * 0.035 + i * 0.5) % 1);
			return <ellipse key={i} cx={x + (i ? 14 : -14)} cy={y + u * 70} rx={3.5} ry={6} fill="#bfe8ff" opacity={1 - u} />;
		})}
	</g>
);
export const Fog: React.FC<{x: number; y: number; f: number; dir?: 1 | -1}> = ({x, y, f, dir = 1}) => (
	<g>
		{[0, 1, 2].map((i) => {
			const u = ((f * 0.02 + i / 3) % 1);
			return <circle key={i} cx={x + dir * (10 + u * 60)} cy={y - u * 24} r={6 + u * 22} fill="#fff" opacity={0.35 * (1 - u)} />;
		})}
	</g>
);

/* лайк и подписка */
export const LikeSub: React.FC<{f: number; t0: number; t1: number}> = ({f, t0, t1}) => {
	const k = env(f, t0, t1, 10, 10);
	if (k <= 0) return null;
	const pop = interpolate(f, [t0, t0 + 16], [0.4, 1], {...cl, easing: bk});
	const press = Math.sin(Math.max(0, f - t0 - 24) / 5) * Math.exp(-Math.max(0, f - t0 - 24) / 14);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center', gap: 36, transform: `scale(${pop})`}}>
				<div style={{background: '#2f6fd8', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: '18px 44px', borderRadius: 24, boxShadow: '0 8px 0 #1a3f8f', transform: `scale(${1 + 0.1 * press})`}}>LIKE</div>
				<div style={{background: '#ff3b3b', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: '18px 44px', borderRadius: 24, boxShadow: '0 8px 0 #9a1a1a'}}>SUBSCRIBE</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 120, color: '#ffd34a', textShadow: '0 6px 0 rgba(0,0,0,.5)', transform: `scale(${pop}) rotate(${Math.sin(f / 18) * 1.5}deg)`}}>PART 2</div>
		</AbsoluteFill>
	);
};
