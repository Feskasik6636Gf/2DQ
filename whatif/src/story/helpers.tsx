import React from 'react';
import {interpolate} from 'remotion';
import type {PersonSpec, Ctx} from './dsl';

/* the hero ("you"): a teen in the red hoodie */
export const hero = (x: number, o: Partial<PersonSpec> = {}): PersonSpec => ({who: 'hero', x, size: 'teen', ...o});
export const ppl = (who: string, x: number, o: Partial<PersonSpec> = {}): PersonSpec => ({who, x, ...o});

/* a horizontal gust: streaks flying across the world */
export const Wind: React.FC<{f: number; t0: number; t1: number; n?: number; y0?: number; y1?: number}> = ({f, t0, t1, n = 14, y0 = 300, y1 = 800}) => {
	if (f < t0 || f > t1) return null;
	const o = interpolate(f, [t0, t0 + 6, t1 - 6, t1], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<g opacity={o}>
			{Array.from({length: n}).map((_, i) => {
				const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
				const r2 = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
				const x = ((f - t0) * (40 + r * 30) + r2 * 2400) % 2800 - 400;
				const y = y0 + r2 * (y1 - y0);
				return <path key={i} d={`M${x},${y} q60,-18 120,0 t120,0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />;
			})}
		</g>
	);
};

/* a big arrow that bounces toward a target */
export const Arrow: React.FC<{f: number; t0: number; x: number; y: number; dir?: 1 | -1 | 0; s?: number; c?: string}> = ({f, t0, x, y, dir = 1, s = 1, c = '#ffd84a'}) => {
	if (f < t0) return null;
	const b = Math.sin((f - t0) / 3.5) * 14;
	const k = Math.min(1, (f - t0) / 6);
	const rot = dir === 0 ? 90 : dir === 1 ? 0 : 180;
	return (
		<g transform={`translate(${x + (dir === 0 ? 0 : b * dir)},${y + (dir === 0 ? b : 0)}) rotate(${rot}) scale(${s * k})`}>
			<path d="M-60,-22 H20 V-52 L78,0 L20,52 V22 H-60 Z" fill={c} stroke="#1d1626" strokeWidth={6} strokeLinejoin="round" />
		</g>
	);
};

/* a floating label with a pill background (world space) */
export const Tag: React.FC<{f: number; t0: number; t1: number; x: number; y: number; text: string; c?: string; size?: number; fg?: string}> = ({f, t0, t1, x, y, text, c = '#ffd84a', size = 40, fg = '#1d1626'}) => {
	if (f < t0 || f > t1) return null;
	const k = Math.min(1, (f - t0) / 7);
	const e = 1 - Math.pow(1 - k, 3);
	const out = interpolate(f, [t1 - 5, t1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const w = text.length * size * 0.62 + 50;
	return (
		<g transform={`translate(${x},${y + (1 - e) * 30 + Math.sin(f / 12) * 3}) scale(${0.6 + 0.4 * e})`} opacity={Math.min(e, out)}>
			<rect x={-w / 2 + 4} y={-size * 0.8 + 8} width={w} height={size * 1.5} rx={size * 0.5} fill="#000" opacity={0.25} />
			<rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.5} rx={size * 0.5} fill={c} stroke="#1d1626" strokeWidth={5} />
			<text x={0} y={size * 0.32} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={size} fill={fg}>{text}</text>
		</g>
	);
};

export type {Ctx};

/* a big stat card in world space: huge number + label */
export const Stat: React.FC<{f: number; t0: number; t1: number; x: number; y: number; big: string; label: string; c?: string; s?: number}> = ({f, t0, t1, x, y, big, label, c = '#ffd84a', s = 1}) => {
	if (f < t0 || f > t1) return null;
	const k = Math.min(1, (f - t0) / 9);
	const e = 1 - Math.pow(1 - k, 3);
	const out = interpolate(f, [t1 - 6, t1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<g transform={`translate(${x},${y}) scale(${s * (0.5 + 0.5 * e)})`} opacity={Math.min(e, out)}>
			<rect x={-300} y={-120} width={600} height={240} rx={36} fill="#10142e" stroke={c} strokeWidth={8} />
			<text y={20} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={120} fill={c}>{big}</text>
			<text y={84} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={38} fill="#fff">{label}</text>
		</g>
	);
};
