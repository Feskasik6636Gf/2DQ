import React from 'react';
import {interpolate, random} from 'remotion';
import {env} from '../kit/actions';
import {FONT, HAND} from '../kit/ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* comic speech bubble with a tail pointing to (tx,ty) */
export const Speech: React.FC<{f: number; t0: number; t1: number; x: number; y: number; text: string; tx?: number; ty?: number; c?: string; size?: number; fill?: string}> = ({f, t0, t1, x, y, text, tx, ty, c = '#14112a', size = 40, fill = '#fff'}) => {
	const k = env(f, t0, t1, 6, 6);
	if (k <= 0) return null;
	const w = text.length * size * 0.56 + 60;
	const h = size * 1.7;
	const sc = 0.6 + 0.4 * k;
	return (
		<g transform={`translate(${x},${y + Math.sin(f / 10) * 3}) scale(${sc})`} opacity={k}>
			<path d={`M${-w / 2 + 20},${h / 2 - 4} L${(tx ?? x) - x},${(ty ?? y + 120) - y} L${-w / 2 + 70},${h / 2 - 4} Z`} fill={fill} stroke={c} strokeWidth={5} strokeLinejoin="round" />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.2} fill={fill} stroke={c} strokeWidth={5} />
			<rect x={-w / 2 + 14} y={h / 2 - 8} width={60} height={10} fill={fill} />
			<text x={0} y={size * 0.3} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={c}>
				{text}
			</text>
		</g>
	);
};

/* thought bubble (a cloud with dots) holding children */
export const Thought: React.FC<{f: number; t0: number; t1: number; x: number; y: number; w?: number; h?: number; children?: React.ReactNode; fill?: string; tail?: [number, number]}> = ({f, t0, t1, x, y, w = 420, h = 300, children, fill = '#fffbe8', tail}) => {
	const k = env(f, t0, t1, 8, 8);
	if (k <= 0) return null;
	const sc = 0.5 + 0.5 * k;
	const [tx, ty] = tail ?? [-w / 2 + 40, h / 2 + 130];
	return (
		<g transform={`translate(${x},${y + Math.sin(f / 14) * 5}) scale(${sc})`} opacity={k}>
			<circle cx={tx} cy={ty} r={12} fill={fill} />
			<circle cx={tx + 24} cy={ty - 40} r={20} fill={fill} />
			<ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill={fill} stroke="#14112a" strokeWidth={5} />
			<clipPath id={`tb${Math.round(x)}${Math.round(y)}`}>
				<ellipse cx={0} cy={0} rx={w / 2 - 8} ry={h / 2 - 8} />
			</clipPath>
			<g clipPath={`url(#tb${Math.round(x)}${Math.round(y)})`}>{children}</g>
		</g>
	);
};

export const Clock: React.FC<{x: number; y: number; r?: number; f: number; speed?: number; c?: string; q?: boolean}> = ({x, y, r = 100, f, speed = 1, c = '#fff', q}) => (
	<g transform={`translate(${x},${y})`}>
		<circle r={r} fill="#14112a" stroke={c} strokeWidth={r / 14} />
		{Array.from({length: 12}).map((_, i) => (
			<line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.7} stroke={c} strokeWidth={r / 20} transform={`rotate(${i * 30})`} />
		))}
		<line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke={c} strokeWidth={r / 11} strokeLinecap="round" transform={`rotate(${f * 2 * speed})`} />
		<line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke="#ffd34a" strokeWidth={r / 9} strokeLinecap="round" transform={`rotate(${f * 0.17 * speed})`} />
		{q ? (
			<text x={0} y={r * 0.5} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 0.5} fill="#ff6a5a">
				?
			</text>
		) : null}
	</g>
);

/* calendar pages that fly away */
export const Pages: React.FC<{x: number; y: number; f: number; t0: number; n?: number}> = ({x, y, f, t0, n = 9}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const t = f - t0 - i * 7;
			if (t < 0) return null;
			const u = Math.min(1, t / 60);
			return (
				<g key={i} transform={`translate(${x + u * (300 + random('pg' + i) * 300) * (i % 2 ? 1 : -1)},${y - u * 220 + u * u * 300}) rotate(${u * (180 + i * 40)})`} opacity={1 - u * u}>
					<rect x={-40} y={-50} width={80} height={100} rx={6} fill="#fff" stroke="#c9433a" strokeWidth={5} />
					<rect x={-40} y={-50} width={80} height={22} fill="#c9433a" />
					<text x={0} y={24} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#14112a">
						{i + 1}
					</text>
				</g>
			);
		})}
	</g>
);

/* chalkboard with lines of chalk text appearing one after another */
export const Board: React.FC<{x: number; y: number; w?: number; h?: number; f: number; t0: number; lines: string[]; size?: number}> = ({x, y, w = 900, h = 420, f, t0, lines, size = 64}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2 - 16} y={-16} width={w + 32} height={h + 32} rx={12} fill="#8a5a3a" />
		<rect x={-w / 2} y={0} width={w} height={h} rx={6} fill="#1f4a3a" />
		{lines.map((l, i) => {
			const k = interpolate(f, [t0 + i * 14, t0 + i * 14 + 14], [0, 1], clamp);
			return (
				<text key={i} x={-w / 2 + 40} y={size + 14 + i * (size + 22)} fontFamily={HAND} fontWeight={700} fontSize={size} fill="#fffdf4" opacity={k} style={{clipPath: `inset(0 ${100 - k * 100}% 0 0)`}}>
					{l}
				</text>
			);
		})}
	</g>
);

export const Zzz: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
	<g fontFamily={FONT} fontWeight={900} fill="#bfe6ff">
		{[0, 1, 2].map((i) => {
			const k = ((f / 40 + i / 3) % 1);
			return (
				<text key={i} x={x + k * 60} y={y - k * 140} fontSize={40 + i * 14} opacity={1 - k}>
					Z
				</text>
			);
		})}
	</g>
);

export const Eyeball: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-120,0 Q0,-110 120,0 Q0,110 -120,0 Z" fill="#fff" stroke="#14112a" strokeWidth={6} />
		<circle cx={Math.sin(f / 18) * 26} cy={Math.cos(f / 23) * 10} r={42} fill="#ffd34a" stroke="#14112a" strokeWidth={5} />
		<circle cx={Math.sin(f / 18) * 26} cy={Math.cos(f / 23) * 10} r={18} fill="#14112a" />
	</g>
);

/* a ghost face hiding in the wallpaper */
export const WallFace: React.FC<{x: number; y: number; f: number; s?: number; o?: number}> = ({x, y, f, s = 1, o = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={o * (0.55 + 0.25 * Math.sin(f / 20 + x))}>
		<ellipse cx={0} cy={0} rx={70} ry={92} fill="#9c8530" />
		<ellipse cx={-26} cy={-16} rx={11} ry={18} fill="#2a2208" />
		<ellipse cx={26} cy={-16} rx={11} ry={18} fill="#2a2208" />
		<ellipse cx={0} cy={44} rx={14} ry={26} fill="#2a2208" />
	</g>
);

export const Note: React.FC<{x: number; y: number; f: number; t0: number; text: string; c?: string; size?: number}> = ({x, y, f, t0, text, c = '#fffdf4', size = 70}) => {
	const k = interpolate(f, [t0, t0 + 30], [0, 1], clamp);
	return (
		<text x={x} y={y} fontFamily={HAND} fontWeight={700} fontSize={size} fill={c} style={{clipPath: `inset(0 ${100 - k * 100}% 0 0)`}}>
			{text}
		</text>
	);
};

export const BarPair: React.FC<{x: number; y: number; f: number; t0: number}> = ({x, y, f, t0}) => {
	const a = interpolate(f, [t0, t0 + 30], [0, 1], clamp);
	const b = interpolate(f, [t0 + 40, t0 + 60], [0, 1], clamp);
	return (
		<g transform={`translate(${x},${y})`} fontFamily={FONT} fontWeight={800}>
			<text x={0} y={-20} fontSize={40} fill="#fff">WITHOUT FOOD</text>
			<rect x={0} y={0} width={900} height={70} rx={14} fill="#1c2150" />
			<rect x={0} y={0} width={900 * a} height={70} rx={14} fill="#7fd0ff" />
			<text x={20} y={50} fontSize={40} fill="#14112a">~3 WEEKS</text>
			<text x={0} y={150} fontSize={40} fill="#fff">WITHOUT WATER</text>
			<rect x={0} y={170} width={900} height={70} rx={14} fill="#1c2150" />
			<rect x={0} y={170} width={900 * (3 / 21) * b} height={70} rx={14} fill="#ff6a5a" />
			<text x={900 * (3 / 21) + 24} y={222} fontSize={40} fill="#fff" opacity={b}>~3 DAYS</text>
		</g>
	);
};
