import React from 'react';
import {Easing, interpolate, spring, useVideoConfig} from 'remotion';
import {clamp} from '../kit/kit';
import {FONT, HAND} from '../kit/ui';
import {env} from '../kit/actions';

/* World-space cards (draw inside <Layer depth={1}><Svg>): scanner screen, handwritten
   note, chart on a clipboard, personnel file. Everything animates on its own frame t0. */

const pop = (f: number, t0: number, fps = 30) => spring({frame: f - t0, fps, config: {damping: 11, stiffness: 150}});
const rev = (f: number, t0: number, len: number) => interpolate(f, [t0, t0 + len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

export const CardBg: React.FC<{c?: string}> = ({c = '#0b1020'}) => (
	<g>
		<rect x={-600} y={-400} width={3200} height={1900} fill={c} />
		{Array.from({length: 24}).map((_, i) => (
			<line key={i} x1={-600 + i * 140} y1={-400} x2={-600 + i * 140} y2={1500} stroke="#fff" opacity={0.035} strokeWidth={2} />
		))}
	</g>
);

type Row = {t: number; a: string; b: string; warn?: boolean};
export const ScannerScreen: React.FC<{f: number; rows?: Row[]; count?: {t: number; v: number; c?: string}; sil?: number; stamp?: {t: number; text: string}; x?: number; y?: number; s?: number; head?: string}> = ({
	f,
	rows = [],
	count,
	sil,
	stamp,
	x = 960,
	y = 540,
	s = 1,
	head = "ST. BRENDAN'S · MAIN ENTRANCE",
}) => {
	const k = pop(f, 0);
	return (
		<g transform={`translate(${x},${y}) scale(${s * (0.92 + 0.08 * k)})`} opacity={Math.min(1, k * 2)}>
			<rect x={-640} y={-360} width={1280} height={720} rx={28} fill="#10151f" stroke="#2b3550" strokeWidth={8} />
			<rect x={-612} y={-332} width={1224} height={664} rx={12} fill="#04150d" />
			{Array.from({length: 66}).map((_, i) => (
				<rect key={i} x={-612} y={-332 + i * 10} width={1224} height={2} fill="#000" opacity={0.25} />
			))}
			<text x={-580} y={-280} fontFamily={FONT} fontWeight={700} fontSize={30} fill="#6dffb0" opacity={0.85}>
				{head}
			</text>
			<line x1={-580} y1={-258} x2={580} y2={-258} stroke="#6dffb0" opacity={0.4} strokeWidth={2} />
			{rows.map((r, i) => {
				const p = rev(f, r.t, 8);
				if (p <= 0) return null;
				return (
					<g key={i} transform={`translate(${-580 + (1 - p) * 60},${-200 + i * 56})`} opacity={p}>
						<text fontFamily="monospace" fontWeight={700} fontSize={34} fill={r.warn ? '#ff7a7a' : '#6dffb0'}>
							{r.a}
						</text>
						<text x={820} fontFamily="monospace" fontWeight={700} fontSize={34} fill={r.warn ? '#ff7a7a' : '#6dffb0'} textAnchor="end">
							{r.b}
						</text>
					</g>
				);
			})}
			{sil !== undefined && f >= sil ? (
				<g transform={`translate(440,-60) scale(${pop(f, sil)})`}>
					<rect x={-120} y={-150} width={240} height={290} rx={14} fill="#1a2a24" stroke="#6dffb0" strokeWidth={3} />
					<circle cx={0} cy={-52} r={52} fill="#8a9690" />
					<path d="M-92,134 Q-92,20 0,20 Q92,20 92,134 Z" fill="#8a9690" />
					<text y={168} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={26} fill="#ff7a7a">
						NO PHOTO
					</text>
				</g>
			) : null}
			{count && f >= count.t ? (
				<g transform={`translate(-200,230) scale(${0.6 + 0.4 * pop(f, count.t)})`}>
					<text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#6dffb0" y={-70}>
						STAFF COUNT
					</text>
					<text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={count.c ?? '#ff5a5a'} y={60}>
						{count.v}
					</text>
				</g>
			) : null}
			{stamp && f >= stamp.t ? (
				<g transform={`translate(260,250) rotate(-8) scale(${1 + 1.4 * Math.max(0, 1 - (f - stamp.t) / 5)})`} opacity={Math.min(1, (f - stamp.t) / 2)}>
					<rect x={-230} y={-50} width={460} height={100} rx={10} fill="none" stroke="#ff5a5a" strokeWidth={8} />
					<text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={900} fontSize={60} fill="#ff5a5a">
						{stamp.text}
					</text>
				</g>
			) : null}
		</g>
	);
};

/* handwriting on paper: each line is revealed left to right */
export const Paper: React.FC<{f: number; t0: number; appear?: number; lines: string[]; per?: number; x?: number; y?: number; w?: number; h?: number; rot?: number; c?: string; ink?: string; size?: number; title?: string; red?: number}> = ({
	f,
	t0,
	appear,
	lines,
	per = 26,
	x = 960,
	y = 540,
	w = 820,
	h = 700,
	rot = -2,
	c = '#ffe14a',
	ink = '#1c1c26',
	size = 78,
	title,
	red,
}) => {
	const k = pop(f, (appear ?? t0) - 6);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot + (1 - k) * 6}) scale(${0.85 + 0.15 * k})`} opacity={Math.min(1, k * 2)}>
			<rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} fill="#000" opacity={0.3} />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} fill={c} />
			<rect x={-w / 2} y={-h / 2} width={w} height={46} fill="#000" opacity={0.06} />
			<rect x={-60} y={-h / 2 - 18} width={120} height={40} fill="#e8e0b0" opacity={0.9} />
			{title ? (
				<text x={0} y={-h / 2 + 100} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={size * 0.8} fill={ink}>
					{title}
				</text>
			) : null}
			{lines.map((ln, i) => {
				const a = t0 + i * per;
				const p = rev(f, a, per * 0.9);
				const yy = -h / 2 + (title ? 200 : 120) + i * (size * 1.18);
				const id = `pp-${Math.round(x)}-${i}`;
				return (
					<g key={i}>
						<clipPath id={id}>
							<rect x={-w / 2 + 30} y={yy - size} width={(w - 60) * p} height={size * 1.4} />
						</clipPath>
						<text x={-w / 2 + 44} y={yy} fontFamily={HAND} fontWeight={700} fontSize={size} fill={red !== undefined && i >= red ? '#c0201a' : ink} clipPath={`url(#${id})`}>
							{ln}
						</text>
					</g>
				);
			})}
		</g>
	);
};

type ChartRow = {n: string; room: string; time: string; fresh?: boolean; t?: number};
export const ChartSheet: React.FC<{f: number; t0: number; rows: ChartRow[]; per?: number; x?: number; y?: number; rot?: number; flash?: number}> = ({f, t0, rows, per = 40, x = 960, y = 540, rot = 3, flash}) => {
	const k = pop(f, t0 - 6);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot + (1 - k) * -8}) scale(${0.85 + 0.15 * k})`} opacity={Math.min(1, k * 2)}>
			<rect x={-470} y={-420} width={940} height={860} rx={24} fill="#5a4630" />
			<rect x={-100} y={-450} width={200} height={70} rx={14} fill="#9aa4ac" />
			<rect x={-430} y={-360} width={860} height={770} fill="#e6d8a8" />
			<rect x={-430} y={-360} width={860} height={770} fill="#9a7a3a" opacity={0.16} />
			<text x={-380} y={-290} fontFamily={HAND} fontWeight={700} fontSize={64} fill="#3a3020">
				NIGHT ROUNDS
			</text>
			<line x1={-390} y1={-266} x2={390} y2={-266} stroke="#3a3020" strokeWidth={3} opacity={0.6} />
			{rows.map((r, i) => {
				const a = r.t ?? t0 + i * per;
				const p = rev(f, a, per * 0.8);
				const yy = -190 + i * 108;
				const id = `ch-${i}`;
				return (
					<g key={i}>
						<clipPath id={id}>
							<rect x={-400} y={yy - 70} width={800 * p} height={100} />
						</clipPath>
						<g clipPath={`url(#${id})`}>
							<text x={-390} y={yy} fontFamily={HAND} fontWeight={700} fontSize={r.fresh ? 78 : 64} fill={r.fresh ? '#1a2a6a' : '#3a3020'}>
								{r.n}
							</text>
							<text x={-390} y={yy + 40} fontFamily={HAND} fontWeight={700} fontSize={44} fill={r.fresh ? '#2a3a8a' : '#5a4a30'}>
								{r.room} · {r.time}
							</text>
							{r.fresh ? <rect x={-396} y={yy - 70} width={800} height={130} rx={10} fill="#4a7bff" opacity={0.14 + 0.1 * Math.sin(f / 4)} /> : null}
						</g>
					</g>
				);
			})}
			{flash !== undefined && f > flash && f < flash + 14 ? <rect x={-430} y={-360} width={860} height={770} fill="#fff" opacity={0.5 * (1 - (f - flash) / 14)} /> : null}
		</g>
	);
};

export const FileCard: React.FC<{f: number; t0: number; lines?: [string, string, number?][]; stamp?: number; x?: number; y?: number; rot?: number}> = ({f, t0, lines = [], stamp, x = 960, y = 540, rot = -3}) => {
	const k = pop(f, t0 - 4);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot + (1 - k) * 8}) scale(${0.85 + 0.15 * k})`} opacity={Math.min(1, k * 2)}>
			<rect x={-480} y={-420} width={960} height={860} rx={14} fill="#8d939a" />
			<path d="M-480,-420 h260 l40,-50 h-300 z" fill="#8d939a" />
			<rect x={-440} y={-380} width={880} height={780} fill="#f1ecdc" />
			<text x={-400} y={-320} fontFamily={FONT} fontWeight={800} fontSize={44} fill="#2a3340">
				EMPLOYEE FILE
			</text>
			<line x1={-400} y1={-296} x2={400} y2={-296} stroke="#2a3340" strokeWidth={4} />
			{/* stapled photo: the hero's own face */}
			<g transform="translate(240,-170)">
				<rect x={-110} y={-120} width={220} height={250} fill="#e6e6e6" stroke="#bbb" strokeWidth={4} />
				<circle cx={0} cy={-5} r={80} fill="#0a0a0a" stroke="#fff0cc" strokeWidth={4} />
				<ellipse cx={-28} cy={-10} rx={14} ry={19} fill="#fff" />
				<ellipse cx={30} cy={-10} rx={14} ry={19} fill="#fff" />
				<path d="M-24,36 Q0,52 24,36" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
				<rect x={-100} y={-130} width={30} height={14} fill="#aaa" />
			</g>
			{lines.map(([a, b, tt], i) => {
				const p = rev(f, tt ?? t0 + 12 + i * 22, 16);
				return (
					<g key={i} opacity={p} transform={`translate(${(1 - p) * -30},0)`}>
						<text x={-400} y={-220 + i * 76} fontFamily={FONT} fontWeight={600} fontSize={30} fill="#6a7480">
							{a}
						</text>
						<text x={-400} y={-220 + i * 76 + 36} fontFamily={HAND} fontWeight={700} fontSize={50} fill="#1c1c26">
							{b}
						</text>
					</g>
				);
			})}
			{stamp !== undefined && f >= stamp ? (
				<g transform={`translate(70,230) rotate(-12) scale(${1 + 1.6 * Math.max(0, 1 - (f - stamp) / 5)})`} opacity={Math.min(1, (f - stamp) / 2)}>
					<rect x={-300} y={-70} width={600} height={140} rx={12} fill="none" stroke="#c0201a" strokeWidth={10} />
					<text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={900} fontSize={88} fill="#c0201a">
						DECEASED
					</text>
				</g>
			) : null}
		</g>
	);
};

/* two panels: "payroll says 41 / scanner says 42" */
export const VsPanel: React.FC<{f: number; t0: number; t1: number; a: [string, string]; b: [string, string]; ca?: string; cb?: string}> = ({f, t0, t1, a, b, ca = '#6dd3ff', cb = '#ff6a6a'}) => {
	const ka = pop(f, t0);
	const kb = pop(f, t1);
	const Pn: React.FC<{x: number; k: number; t: [string, string]; c: string}> = ({x, k, t, c}) => (
		<g transform={`translate(${x},540) scale(${k})`} opacity={Math.min(1, k * 2)}>
			<rect x={-400} y={-300} width={800} height={600} rx={36} fill="#10152c" stroke={c} strokeWidth={8} />
			<text textAnchor="middle" y={-170} fontFamily={FONT} fontWeight={800} fontSize={54} fill="#cfd6f0">
				{t[0]}
			</text>
			<text textAnchor="middle" y={90} fontFamily={FONT} fontWeight={900} fontSize={300} fill={c}>
				{t[1]}
			</text>
		</g>
	);
	return (
		<g>
			<Pn x={470} k={ka} t={a} c={ca} />
			<Pn x={1450} k={kb} t={b} c={cb} />
		</g>
	);
};
export {env};
