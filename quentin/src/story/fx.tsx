import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig} from 'remotion';
import {Bubble, FONT, HAND} from '../kit/ui';

/* motion-graphics pieces. A call = {k: kind, o: frame offset in the line, d: duration, ...args}.
   World kinds are drawn inside the camera; screen kinds over the whole frame. */
export type FxCall = {
	k: string;
	o?: number;
	d?: number;
	a?: string; // actor to anchor to
	x?: number;
	y?: number;
	tx?: number;
	ty?: number;
	text?: string;
	sub?: string;
	to?: number;
	from?: number;
	n?: number;
	c?: string;
	m?: string;
	pre?: string;
	suf?: string;
	s?: number;
	th?: boolean;
	cite?: string;
};
export type Pos = (id: string) => {x: number; head: number; floor: number; s: number; facing: number};
type Item = {fx: FxCall; t0: number; t1: number};

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fmt = (v: number, pre = '', suf = '') => pre + Math.round(v).toLocaleString('en-US') + suf;

/* ------------------------------- bill graphic ------------------------------- */
(Math as any).easeOut = (u: number) => 1 - (1 - u) * (1 - u);
export const Bill: React.FC<{x: number; y: number; r?: number; s?: number; o?: number}> = ({x, y, r = 0, s = 1, o = 1}) => (
	<g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} opacity={o}>
		<rect x={-80} y={-34} width={160} height={68} rx={6} fill="#000" opacity={0.25} transform="translate(5,8)" />
		<rect x={-80} y={-34} width={160} height={68} rx={6} fill="#7fcf86" stroke="#2f7a3a" strokeWidth={4} />
		<rect x={-70} y={-25} width={140} height={50} rx={3} fill="none" stroke="#2f7a3a" strokeWidth={2} opacity={0.6} />
		<ellipse cx={0} cy={0} rx={26} ry={21} fill="#b4ecb8" stroke="#2f7a3a" strokeWidth={3} />
		<text x={0} y={9} textAnchor="middle" fontSize={26} fontFamily={FONT} fontWeight={900} fill="#1f5a2a">
			100
		</text>
		<text x={-62} y={-10} fontSize={16} fontFamily={FONT} fontWeight={800} fill="#2f7a3a">
			100
		</text>
		<text x={62} y={22} textAnchor="end" fontSize={16} fontFamily={FONT} fontWeight={800} fill="#2f7a3a">
			100
		</text>
	</g>
);

/* ------------------------------- world effects ------------------------------ */
const WorldFx: React.FC<{c: FxCall; t: number; d: number; pos: Pos}> = ({c, t, d, pos}) => {
	const A = c.a ? pos(c.a) : null;
	const ax = c.x ?? (A ? A.x : 960);
	const headY = A ? A.head : 560;
	const handY = A ? A.floor - 157 * A.s - 30 * A.s : 700;
	switch (c.k) {
		case 'bill': {
			// flutters down from above onto a target (hand by default)
			const tx = c.tx ?? (A ? A.x + A.facing * 55 * A.s : ax);
			const ty = c.ty ?? handY;
			const dur = c.m === 'slow' ? 60 : 38;
			const u = Math.min(1, t / dur);
			const e = Easing.out(Easing.quad)(u);
			const sw = Math.sin(t / 4) * 70 * (1 - u);
			const x = tx + sw;
			const y = ty - 520 * (1 - e);
			const r = Math.sin(t / 3.5) * 28 * (1 - u) + (c.m === 'slide' ? 12 * u : 0);
			const slide = c.m === 'slide' ? Math.max(0, t - dur) * 3 : 0;
			const out = c.m === 'fly' ? Math.max(0, t - dur - 12) : 0;
			return <Bill x={x + slide} y={y - out * 8} r={r} s={c.s ?? 1} o={Math.min(1, t / 4) * (out > 0 ? Math.max(0, 1 - out / 14) : 1)} />;
		}
		case 'pile': {
			// a stack of bills that grows
			const n = Math.max(1, Math.round(interpolate(t, [0, d * 0.8], [c.from ?? 1, c.to ?? 8], cl)));
			return (
				<g>
					{Array.from({length: n}).map((_, i) => (
						<Bill key={i} x={ax + (random('p' + i) - 0.5) * 24} y={(c.y ?? 880) - i * 14} r={(random('q' + i) - 0.5) * 14} s={0.8} />
					))}
				</g>
			);
		}
		case 'tag': {
			const k = spring({frame: t, fps: 30, config: {damping: 11, stiffness: 160}});
			const w = (c.text ?? '').length * 24 + 44;
			return (
				<g transform={`translate(${ax},${headY - 90 * (A?.s ?? 1)}) scale(${k})`}>
					<rect x={-w / 2} y={-28} width={w} height={56} rx={28} fill="#11142c" stroke={c.c ?? '#ffc94a'} strokeWidth={4} />
					<path d="M-9,28 L0,42 L9,28 Z" fill={c.c ?? '#ffc94a'} />
					<text x={0} y={11} textAnchor="middle" fontSize={32} fontFamily={FONT} fontWeight={800} fill="#fff">
						{c.text}
					</text>
				</g>
			);
		}
		case 'say': {
			const w = Math.max(160, (c.text ?? '').length * 25 + 50);
			return (
				<Bubble x={ax + (c.tx ?? 0)} y={headY - 130 * (A?.s ?? 1) + (c.ty ?? 0)} w={w} h={74} t={t} tail={[0, 66]} thought={c.th} fill={c.c ?? '#fbf8ef'}>
					<text x={0} y={11} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={700} fill="#1b1e2a">
						{c.text}
					</text>
				</Bubble>
			);
		}
		case 'mark': {
			// big ! ? ✓ ✗ pop over the head
			const k = spring({frame: t, fps: 30, config: {damping: 7, stiffness: 190}});
			const col = c.c ?? (c.text === '✓' ? '#6ef0a0' : c.text === '✗' ? '#ff6a5a' : '#ffc94a');
			return (
				<g transform={`translate(${ax},${headY - 110 * (A?.s ?? 1) - Math.sin(t / 5) * 4}) scale(${k * (c.s ?? 1)}) rotate(${Math.sin(t / 3) * 6 * Math.exp(-t / 12)})`}>
					<text x={0} y={0} textAnchor="middle" fontSize={120} fontFamily={FONT} fontWeight={900} fill={col} stroke="#11142c" strokeWidth={10} paintOrder="stroke">
						{c.text}
					</text>
				</g>
			);
		}
		case 'ono': {
			const k = spring({frame: t, fps: 30, config: {damping: 6, stiffness: 220}});
			const x = c.x ?? ax + (c.tx ?? 0);
			const y = c.y ?? headY - 40 + (c.ty ?? 0);
			return (
				<g transform={`translate(${x},${y}) rotate(${-8 + Math.sin(t / 2) * 3}) scale(${k * (c.s ?? 1)})`} opacity={interpolate(t, [d - 8, d], [1, 0], cl)}>
					<text textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill={c.c ?? '#ffd34a'} stroke="#11142c" strokeWidth={14} paintOrder="stroke">
						{c.text}
					</text>
				</g>
			);
		}
		case 'ring': {
			const u = Math.min(1, t / 20);
			return <circle cx={ax} cy={c.y ?? headY} r={20 + 190 * u} fill="none" stroke={c.c ?? '#ffe08a'} strokeWidth={10 * (1 - u)} opacity={1 - u} />;
		}
		case 'sweat': {
			return (
				<g>
					{Array.from({length: 6}).map((_, i) => {
						const k = ((t / 24 + i / 6) % 1);
						const side = i % 2 ? 1 : -1;
						return <path key={i} d={`M0,-14 q10,16 0,26 q-10,-10 0,-26`} transform={`translate(${ax + side * (50 + (i % 3) * 10)},${headY - 30 + k * 80})`} fill="#9fdcff" opacity={(1 - k) * 0.9} />;
					})}
				</g>
			);
		}
		case 'shimmer': {
			return (
				<g opacity={0.5}>
					{Array.from({length: 5}).map((_, i) => (
						<path key={i} d={`M${200 + i * 330},900 q30,-40 0,-80 q-30,-40 0,-80`} transform={`translate(0,${-Math.sin(t / 8 + i) * 12})`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.5} />
					))}
				</g>
			);
		}
		case 'thermo': {
			const v = interpolate(t, [0, Math.min(d * 0.8, 60)], [c.from ?? 37, c.to ?? 41.7], {...cl, easing: Easing.out(Easing.cubic)});
			const k = interpolate(v, [36, 42], [0, 1], cl);
			const x = ax + (c.tx ?? 150);
			const y = (c.y ?? 600);
			const sc = spring({frame: t, fps: 30, config: {damping: 12}});
			return (
				<g transform={`translate(${x},${y}) scale(${sc * (c.s ?? 1)})`}>
					<rect x={-26} y={-190} width={52} height={330} rx={26} fill="#f6f3ea" stroke="#11142c" strokeWidth={6} />
					<circle cx={0} cy={150} r={44} fill="#f6f3ea" stroke="#11142c" strokeWidth={6} />
					<rect x={-26} y={-185} width={52} height={170} fill="#f6f3ea" />
					<circle cx={0} cy={150} r={32} fill={k > 0.6 ? '#ff4a3a' : '#ff9a4a'} />
					<rect x={-12} y={140 - k * 300} width={24} height={k * 300 + 10} rx={12} fill={k > 0.6 ? '#ff4a3a' : '#ff9a4a'} />
					<text x={86} y={-120} fontSize={70} fontFamily={FONT} fontWeight={900} fill="#fff" stroke="#11142c" strokeWidth={10} paintOrder="stroke">
						{v.toFixed(1)}°C
					</text>
				</g>
			);
		}
		case 'clock': {
			const x = ax + (c.tx ?? 0);
			const y = c.y ?? headY - 160;
			const k = spring({frame: t, fps: 30, config: {damping: 10}});
			return (
				<g transform={`translate(${x},${y}) scale(${k * (c.s ?? 1)})`}>
					<circle r={70} fill="#fff" stroke="#11142c" strokeWidth={8} />
					<rect x={-9} y={-96} width={18} height={20} fill="#11142c" />
					<line x1={0} y1={0} x2={Math.sin(t / 5) * 48} y2={-Math.cos(t / 5) * 48} stroke="#e2402f" strokeWidth={7} strokeLinecap="round" />
					<circle r={7} fill="#11142c" />
					<text x={0} y={140} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff" stroke="#11142c" strokeWidth={10} paintOrder="stroke">
						{c.text}
					</text>
				</g>
			);
		}
		case 'whistle': {
			return (
				<g transform={`translate(${ax + 70},${headY + 20})`}>
					{[0, 1, 2].map((i) => {
						const k = ((t / 14 + i / 3) % 1);
						return <path key={i} d={`M${20 + k * 40},${-20 - k * 30} q30,${20} 0,${50 + k * 30}`} stroke="#ffd34a" strokeWidth={8} fill="none" opacity={1 - k} strokeLinecap="round" />;
					})}
				</g>
			);
		}
		case 'sun': {
			return (
				<g opacity={0.9}>
					<circle cx={c.x ?? 1500} cy={c.y ?? 170} r={190 + Math.sin(t / 8) * 10} fill="#fff7c8" opacity={0.5} />
				</g>
			);
		}
		case 'plane': {
			const u = Math.min(1, t / Math.max(1, d));
			return (
				<g transform={`translate(${-300 + 2500 * u},${260 - 60 * u}) rotate(-6)`}>
					<path d="M0,0 L160,0 q40,0 60,12 q-20,12 -60,12 L0,24 Z" fill="#f4f6fa" stroke="#9aa4b8" strokeWidth={4} />
					<path d="M60,12 L20,-60 L50,-60 L110,12 Z" fill="#c8d0e0" />
					<path d="M60,12 L20,84 L50,84 L110,12 Z" fill="#c8d0e0" />
					<rect x={-120} y={8} width={120} height={6} fill="#fff" opacity={0.6} />
				</g>
			);
		}
		case 'hearts': {
			return (
				<g>
					{Array.from({length: 8}).map((_, i) => {
						const k = ((t / 40 + i / 8) % 1);
						return <text key={i} x={ax + (random('h' + i) - 0.5) * 220} y={headY - 40 - k * 220} fontSize={46} fontFamily={FONT} fill="#ff5a7a" opacity={1 - k} textAnchor="middle">
							♥
						</text>;
					})}
				</g>
			);
		}
		case 'tears': {
			return (
				<g>
					{[0, 1].map((i) => {
						const k = ((t / 20 + i / 2) % 1);
						return <path key={i} d="M0,-12 q9,14 0,22 q-9,-8 0,-22" transform={`translate(${ax + 14 + i * 22},${headY + 5 + k * 70})`} fill="#7fd0ff" opacity={1 - k} />;
					})}
				</g>
			);
		}
		case 'ice': {
			const x = ax;
			return (
				<g>
					{Array.from({length: 10}).map((_, i) => {
						const k = Math.min(1, Math.max(0, (t - i * 2) / 30));
						return <rect key={i} x={x + (random('i' + i) - 0.5) * 340 - 24} y={(c.y ?? 760) - Math.sin(k * Math.PI) * 170 * (0.5 + random('j' + i)) + k * 30} width={48} height={44} rx={8} fill="#bfeaff" stroke="#6fc4f0" strokeWidth={4} transform={`rotate(${k * 220 * (random('r' + i) - 0.5)} ${x} 760)`} opacity={0.95} />;
					})}
				</g>
			);
		}
		case 'speed': {
			return (
				<g opacity={0.6}>
					{Array.from({length: 7}).map((_, i) => (
						<line key={i} x1={ax - 220 - ((t * 40 + i * 120) % 300)} y1={560 + i * 52} x2={ax - 60 - ((t * 40 + i * 120) % 300)} y2={560 + i * 52} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
					))}
				</g>
			);
		}
		case 'arrow': {
			const k = spring({frame: t, fps: 30, config: {damping: 9}});
			return (
				<g transform={`translate(${ax},${(c.y ?? headY - 90) + Math.sin(t / 5) * 8}) scale(${k})`}>
					<path d="M-34,-40 L34,-40 L34,0 L56,0 L0,60 L-56,0 L-34,0 Z" fill={c.c ?? '#ffd34a'} stroke="#11142c" strokeWidth={6} />
				</g>
			);
		}
		case 'ambulance': {
			const u = Math.min(1, t / 50);
			const x = 2300 - 1250 * (Math as any).easeOut(u);
			const blink = Math.floor(t / 4) % 2;
			return (
				<g transform={`translate(${x},760)`}>
					<ellipse cx={0} cy={140} rx={260} ry={16} fill="#000" opacity={0.25} />
					<rect x={-240} y={-90} width={420} height={210} rx={24} fill="#f4f6fa" stroke="#9aa4b8" strokeWidth={5} />
					<path d="M180,-50 L260,-50 q30,0 40,34 L300,120 L180,120 Z" fill="#e8ecf4" stroke="#9aa4b8" strokeWidth={5} />
					<rect x={200} y={-30} width={70} height={60} rx={8} fill="#8fc8ee" />
					<rect x={-240} y={30} width={540} height={26} fill="#e2402f" />
					<rect x={-120} y={-60} width={90} height={26} fill="#e2402f" />
					<rect x={-87} y={-93} width={26} height={90} fill="#e2402f" />
					<rect x={-30} y={-112} width={60} height={26} rx={6} fill={blink ? '#ff4a3a' : '#4a7aff'} />
					<circle cx={-120} cy={124} r={44} fill="#222" />
					<circle cx={220} cy={124} r={44} fill="#222" />
				</g>
			);
		}
		case 'zz': return null;
		default:
			return null;
	}
};

/* ------------------------------ screen effects ------------------------------ */
const Stat: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const {fps} = useVideoConfig();
	const k = spring({frame: t, fps, config: {damping: 13, stiffness: 150}});
	const out = interpolate(t, [d - 8, d], [1, 0], cl);
	const v = c.to !== undefined ? interpolate(t, [2, 26], [c.from ?? 0, c.to], {...cl, easing: Easing.out(Easing.cubic)}) : undefined;
	const txt = v !== undefined ? fmt(v, c.pre ?? '', c.suf ?? '') : c.text;
	const side = c.m === 'left' ? 'flex-start' : c.m === 'right' ? 'flex-end' : 'center';
	const col = c.c ?? '#ffd34a';
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
			<div style={{position: 'absolute', left: 90, right: 90, top: c.y ?? 150, display: 'flex', flexDirection: 'column', alignItems: side, transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -5}deg)`}}>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: c.s ?? 190, lineHeight: 1, color: col, WebkitTextStroke: '10px #0e1024', paintOrder: 'stroke', textShadow: '0 12px 30px rgba(0,0,0,.55)', textAlign: 'center'}}>{(txt ?? '').split('|').map((l, i) => <div key={i}>{l}</div>)}</div>
				{c.sub ? <div style={{marginTop: 6, fontFamily: FONT, fontWeight: 800, fontSize: 56, color: '#fff', WebkitTextStroke: '7px #0e1024', paintOrder: 'stroke', letterSpacing: 2}}>{c.sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

const Title: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const inK = interpolate(t, [0, 9], [0, 1], cl);
	const o = Math.min(inK, interpolate(t, [d - 8, d], [1, 0], cl));
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
			<div style={{position: 'absolute', left: 0, top: c.y ?? 60, transform: `translateX(${(inK - 1) * 400}px)`}}>
				<div style={{background: '#ffd34a', color: '#11142c', fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: '8px 40px 8px 50px', borderRadius: '0 18px 18px 0', boxShadow: '0 10px 24px rgba(0,0,0,.4)', letterSpacing: 2}}>{c.text}</div>
				{c.sub ? <div style={{background: '#11142c', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 32, padding: '6px 34px 6px 50px', borderRadius: '0 14px 14px 0', width: 'fit-content', marginTop: 6}}>{c.sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

const RuleCard: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const k = Easing.out(Easing.back(1.6))(Math.min(1, t / 12));
	const o = interpolate(t, [d - 8, d], [1, 0], cl);
	const lines = (c.text ?? '').split('|');
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: o, alignItems: 'center', justifyContent: 'center'}}>
			<div style={{transform: `scale(${0.5 + 0.5 * k}) rotate(${(1 - k) * 6 - 1.2}deg)`, background: '#244a3a', border: '14px solid #8a5a34', borderRadius: 18, padding: '34px 64px', boxShadow: '0 30px 60px rgba(0,0,0,.5)', textAlign: 'center'}}>
				{c.sub ? <div style={{fontFamily: HAND, fontSize: 60, color: '#ffd34a', marginBottom: 6}}>{c.sub}</div> : null}
				{lines.map((l, i) => {
					const ik = interpolate(t, [6 + i * 7, 16 + i * 7], [0, 1], cl);
					return (
						<div key={i} style={{fontFamily: HAND, fontSize: 104, lineHeight: 1.05, color: '#f6f2e4', clipPath: `inset(0 ${(1 - ik) * 100}% 0 0)`}}>
							{l}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/* a full-frame fact card (cut-away): icon + big words + source */
const Icon: React.FC<{kind: string; t: number}> = ({kind, t}) => {
	const dr = Math.min(1, t / 28);
	switch (kind) {
		case 'bridge':
			return (
				<g stroke="#ffd34a" strokeWidth={10} fill="none" strokeLinecap="round">
					<path d="M-260,60 L260,60" />
					<path d="M-260,60 Q0,-150 260,60" strokeDasharray={900} strokeDashoffset={900 * (1 - dr)} />
					{[-180, -90, 0, 90, 180].map((x) => (
						<line key={x} x1={x} y1={60} x2={x} y2={60 - 120 * (1 - (x / 260) ** 2) * 0.88} strokeWidth={5} />
					))}
					<path d="M-20,60 l14,-24 l-18,-14 l22,-30" stroke="#ff5a4a" strokeWidth={8} opacity={interpolate(t, [18, 30], [0, 1], cl)} />
				</g>
			);
		case 'folder':
			return (
				<g>
					<rect x={-220} y={-140} width={440} height={300} rx={14} fill="#e8c46a" />
					<rect x={-220} y={-170} width={170} height={44} rx={10} fill="#d6b052" />
					{Array.from({length: 6}).map((_, i) => (
						<rect key={i} x={-170} y={-100 + i * 38} width={(260 - ((i * 53) % 90)) * Math.min(1, Math.max(0, (t - i * 3) / 10))} height={14} rx={7} fill="#7a5a22" opacity={0.8} />
					))}
				</g>
			);
		case 'coin':
			return (
				<g>
					<circle r={150} fill="#ffd34a" stroke="#c4962a" strokeWidth={12} />
					<circle r={115} fill="none" stroke="#c4962a" strokeWidth={6} />
					<text y={52} textAnchor="middle" fontSize={150} fontFamily={FONT} fontWeight={900} fill="#9a6e14">
						$
					</text>
				</g>
			);
		case 'chat':
			return (
				<g>
					<rect x={-250} y={-130} width={300} height={130} rx={40} fill="#6ac4ff" transform={`translate(0,${Math.sin(t / 8) * 6})`} />
					<rect x={-50} y={10} width={300} height={130} rx={40} fill="#ffd34a" transform={`translate(0,${-Math.sin(t / 8) * 6})`} />
					{[0, 1, 2].map((i) => (
						<circle key={i} cx={-160 + i * 50} cy={-65} r={11} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t / 4 + i)} />
					))}
				</g>
			);
		case 'scale':
			return (
				<g stroke="#ffd34a" strokeWidth={10} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(t / 10) * 4})`}>
					<line x1={0} y1={-150} x2={0} y2={150} />
					<line x1={-210} y1={-110} x2={210} y2={-110} />
					<path d="M-210,-110 l-60,150 h120 z" fill="#ffd34a33" />
					<path d="M210,-110 l-60,150 h120 z" fill="#ffd34a33" />
					<line x1={-90} y1={150} x2={90} y2={150} />
				</g>
			);
		case 'brain':
			return (
				<g>
					<circle cx={-70} cy={-20} r={100} fill="#ff9ac0" />
					<circle cx={70} cy={-20} r={100} fill="#ff8ab4" />
					<circle cx={0} cy={50} r={90} fill="#ff9ac0" />
					<path d="M0,-110 L0,90" stroke="#c8527c" strokeWidth={8} />
					<path d="M-110,-20 q30,-30 60,0 M40,-30 q30,30 60,0 M-60,60 q30,30 60,0" stroke="#c8527c" strokeWidth={7} fill="none" />
				</g>
			);
		case 'flame':
			return (
				<g>
					<path d="M0,-170 C60,-90 120,-40 100,50 C85,130 -85,130 -100,50 C-120,-40 -50,-80 0,-170 Z" fill="#ff7a3a" transform={`scale(${1 + Math.sin(t / 4) * 0.04})`} />
					<path d="M0,-70 C30,-20 56,10 46,60 C38,100 -38,100 -46,60 C-56,10 -20,-20 0,-70 Z" fill="#ffd34a" />
				</g>
			);
		case 'bars':
			return (
				<g>
					{[0.3, 0.6, 0.9, 0.5, 0.75].map((h, i) => (
						<rect key={i} x={-230 + i * 100} y={150 - 280 * h * Math.min(1, Math.max(0, (t - i * 4) / 14))} width={70} height={280 * h * Math.min(1, Math.max(0, (t - i * 4) / 14))} rx={8} fill={['#6ac4ff', '#ffd34a', '#ff7a8a', '#6ef0a0', '#b79aff'][i]} />
					))}
				</g>
			);
		case 'tie':
			return (
				<g>
					<path d="M-50,-150 L50,-150 L36,-90 L0,-30 L-36,-90 Z" fill="#e2402f" />
					<path d="M-34,-90 L34,-90 L90,150 L0,200 L-90,150 Z" fill="#e2402f" />
					<path d="M-20,0 l40,80 M-30,60 l50,60" stroke="#ffb0a0" strokeWidth={10} opacity={0.7} />
				</g>
			);
		default:
			return null;
	}
};

const Fact: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const k = Easing.out(Easing.cubic)(Math.min(1, t / 10));
	const o = Math.min(k, interpolate(t, [d - 6, d], [1, 0], cl));
	const v = c.to !== undefined ? interpolate(t, [4, 34], [c.from ?? 0, c.to], {...cl, easing: Easing.out(Easing.cubic)}) : undefined;
	const big = v !== undefined ? (Number.isInteger(c.to) ? fmt(v, c.pre ?? '', c.suf ?? '') : (c.pre ?? '') + v.toFixed(1) + (c.suf ?? '')) : c.text;
	const sway = Math.sin(t / 30) * 1.5;
	return (
		<AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse at 50% 38%, ${c.c ?? '#2a3a7a'} 0%, #151a3c 62%, #0a0c1e 100%)`, transform: `scale(${1.04 - 0.04 * k + t * 0.0004}) rotate(${sway * 0.4}deg)`}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
				{Array.from({length: 24}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1920} y2={i * 46} stroke="#fff" opacity={0.035} />
				))}
				<g transform={`translate(${c.m === 'noicon' ? -9999 : 520},470) scale(${0.9 + 0.1 * k})`}>
					<Icon kind={c.m ?? 'coin'} t={t} />
				</g>
			</svg>
			<div style={{position: 'absolute', left: c.m === 'noicon' ? 120 : 960, right: 100, top: 250, textAlign: 'left', fontFamily: FONT}}>
				{c.sub ? <div style={{fontWeight: 800, fontSize: 44, color: '#9fb4ff', letterSpacing: 4, marginBottom: 6, transform: `translateX(${(1 - k) * 80}px)`}}>{c.sub}</div> : null}
				<div style={{fontWeight: 900, fontSize: (c.s ?? 150), lineHeight: 1.02, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,.5)', transform: `translateX(${(1 - k) * 160}px)`}}>
					{(big ?? '').split('|').map((l, i) => (
						<div key={i} style={{color: i % 2 ? '#ffd34a' : '#fff'}}>
							{l}
						</div>
					))}
				</div>
			</div>
			{c.cite ? (
				<div style={{position: 'absolute', right: 70, bottom: 50, fontFamily: FONT, fontSize: 26, color: '#aab3d6', opacity: interpolate(t, [10, 22], [0, 0.9], cl)}}>{c.cite}</div>
			) : null}
		</AbsoluteFill>
	);
};

const News: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const k = interpolate(t, [0, 10], [0, 1], cl);
	const o = Math.min(k, interpolate(t, [d - 8, d], [1, 0], cl));
	return (
		<AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 70, transform: `translateY(${(1 - k) * 160}px)`}}>
				<div style={{display: 'flex', alignItems: 'stretch', fontFamily: FONT, height: 104}}>
					<div style={{background: '#e2302f', color: '#fff', fontWeight: 900, fontSize: 44, padding: '0 34px', display: 'flex', alignItems: 'center', letterSpacing: 2}}>{c.sub ?? 'BREAKING'}</div>
					<div style={{background: '#10173a', color: '#fff', fontWeight: 800, fontSize: 52, padding: '0 40px', display: 'flex', alignItems: 'center', flex: 1}}>{c.text}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Followers: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const k = spring({frame: t, fps: 30, config: {damping: 12}});
	const v = interpolate(t, [3, Math.min(d - 4, 50)], [0, c.to ?? 14000], {...cl, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: interpolate(t, [d - 8, d], [1, 0], cl)}}>
			<div style={{position: 'absolute', right: 70, top: 70, transform: `scale(${k})`, transformOrigin: 'top right', background: '#11142c', border: '5px solid #ff5a7a', borderRadius: 26, padding: '14px 30px', fontFamily: FONT, color: '#fff'}}>
				<div style={{fontSize: 28, fontWeight: 700, color: '#ff9ab0', letterSpacing: 2}}>FOLLOWERS</div>
				<div style={{fontSize: 84, fontWeight: 900}}>♥ {Math.round(v).toLocaleString('en-US')}</div>
			</div>
		</AbsoluteFill>
	);
};

const Rain: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const n = c.n ?? 24;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				{Array.from({length: n}).map((_, i) => {
					const st = random('rs' + i) * Math.min(30, d * 0.6);
					const u = Math.max(0, t - st) / 46;
					if (u <= 0 || u >= 1.3) return null;
					return <Bill key={i} x={random('rx' + i) * 1900 + Math.sin(t / 6 + i) * 40} y={-80 + u * 1200} r={Math.sin(t / 5 + i) * 40} s={0.9 + random('rz' + i) * 0.5} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

const Flash: React.FC<{c: FxCall; t: number}> = ({c, t}) => <AbsoluteFill style={{background: c.c ?? '#fff', opacity: interpolate(t, [0, 1, 8], [0, 0.85, 0], cl), pointerEvents: 'none'}} />;
const Tint: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => <AbsoluteFill style={{background: c.c ?? '#ff3a2a', opacity: 0.22 * Math.min(1, t / 8) * interpolate(t, [d - 10, d], [1, 0], cl) + 0.04 * Math.sin(t / 5), mixBlendMode: 'multiply', pointerEvents: 'none'}} />;

const Question: React.FC<{c: FxCall; t: number; d: number}> = ({c, t, d}) => {
	const k = spring({frame: t, fps: 30, config: {damping: 12, stiffness: 140}});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: interpolate(t, [d - 10, d], [1, 0], cl), alignItems: 'center', justifyContent: 'center'}}>
			<div style={{transform: `scale(${0.7 + 0.3 * k})`, background: 'rgba(14,16,36,.92)', border: '6px solid #ffd34a', borderRadius: 30, padding: '34px 60px', fontFamily: FONT, fontWeight: 900, fontSize: 78, lineHeight: 1.12, color: '#fff', textAlign: 'center', maxWidth: 1500}}>
				{(c.text ?? '').split('|').map((l, i) => (
					<div key={i} style={{color: i % 2 ? '#ffd34a' : '#fff'}}>
						{l}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const SCREEN = new Set(['stat', 'title', 'rule', 'fact', 'news', 'followers', 'rain', 'flash', 'tint', 'ask']);
const itemDur = (it: Item) => (SCREEN.has(it.fx.k) ? Math.min(it.fx.d ?? 9999, Math.max(14, it.t1 - it.t0 + 5)) : it.fx.d ?? Math.max(20, it.t1 - it.t0 + 6));

export const FxLayerWorld: React.FC<{fx: Item[]; f: number; pos: Pos}> = ({fx, f, pos}) => (
	<g>
		{fx.map((it, i) => {
			if (SCREEN.has(it.fx.k)) return null;
			const d = itemDur(it);
			const t = f - it.t0;
			if (t < 0 || t > d) return null;
			return <WorldFx key={i} c={it.fx} t={t} d={d} pos={pos} />;
		})}
	</g>
);
export const FxLayerScreen: React.FC<{fx: Item[]; f: number; pos: Pos}> = ({fx, f}) => (
	<>
		{fx.map((it, i) => {
			if (!SCREEN.has(it.fx.k)) return null;
			const d = itemDur(it);
			const t = f - it.t0;
			if (t < 0 || t > d) return null;
			const p = {c: it.fx, t, d};
			switch (it.fx.k) {
				case 'stat':
					return <Stat key={i} {...p} />;
				case 'title':
					return <Title key={i} {...p} />;
				case 'rule':
					return <RuleCard key={i} {...p} />;
				case 'fact':
					return <Fact key={i} {...p} />;
				case 'news':
					return <News key={i} {...p} />;
				case 'followers':
					return <Followers key={i} {...p} />;
				case 'rain':
					return <Rain key={i} {...p} />;
				case 'flash':
					return <Flash key={i} c={it.fx} t={t} />;
				case 'tint':
					return <Tint key={i} {...p} />;
				case 'ask':
					return <Question key={i} {...p} />;
			}
			return null;
		})}
	</>
);
