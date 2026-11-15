import React from 'react';
import {AbsoluteFill} from 'remotion';
import {env} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {CrowdRow} from '../kit/kit';
import {sc, tf} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface, EarthDot} from './places';
import {Alert, Big, Chip, ClockFace, Envelope, Names, OrbitSignal, SignalRings, Stat, Timer, Whiteboard, Rover, ITEM, Beam, holdAt} from './gfx';

const warm = <AbsoluteFill style={{background: 'rgba(255,190,110,.16)', mixBlendMode: 'soft-light'}} />;
const HEADY = 900 - 157 - 164; // ≈ центр головы стоящего (s=1)

export const P1: ShotDef[] = [
	// 001 — вечером герой желает спокойной ночи звезде
	sc({
		at: '001',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[1020, 560, 1.1], [1160, 530, 1.5]],
		actors: [{who: 'hero', x: 0, w: [[-260, 1040, 0, 52]], look: [0.9, -0.5, 54], g: [['wave', 66, '001e']], ex: [['sleepy', 0, 999]], mo: [['smile', 0, 999]]}],
	}),
	// 002-003 — крупно: маленькая сине-белая точка
	sc({
		at: '002',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[1230, 520, 2.2], [1250, 500, 3.0]],
		actors: [{who: 'hero', x: 1040, look: [0.9, -0.5], g: [['touchFace', '003-10', '003e']]}],
		fx: (c) => <Callout f={c.f} t0={c.at('003') + 6} t1={c.end('003')} from={[1232, 514]} to={[1470, 380]} text="BRIGHTEST 'STAR'" />,
	}),
	// 004-005 — воспоминание: мама показывает Землю
	sc({
		at: '004',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[1180, 570, 1.25], [1300, 540, 1.5]],
		follow: 1.9,
		actors: [
			{who: 'hero', x: 1120, s: 0.82, look: [0.8, -0.4], ex: [['wide', 0, 999]]},
			{who: 'mom', x: 0, fc: -1, w: [[2150, 1400, 0, '004+40']], g: [['point', '005-4', '005e-10']], look: [-0.9, -0.4, '005-10']},
		],
		fx: (c) => <Callout f={c.f} t0={c.at('004') + 50} t1={c.end('004')} from={[1400, HEADY]} to={[1640, 330]} text="MOM" c="#c9a6ff" />,
		ov: () => warm,
	}),
	// 006-008 — смотровая: лоб к стеклу, Земли нет
	sc({
		at: '006',
		whip: true,
		bg: (c) => {
			const t = c.at('008') + 56;
			const e = c.f < t ? 1 : c.f < t + 4 ? 0.2 : c.f < t + 7 ? 0.8 : 0;
			return <Room kind="obs" earth={e} />;
		},
		bgDepth: 1.3,
		cam: [[1000, 540, 1.05], [1120, 540, 1.7]],
		actors: [
			{
				who: 'hero',
				x: 0,
				w: [[-260, 1000, 0, '007-6']],
				look: [0.9, -0.2],
				pose: (p, c) => {
					const k = env(c.f, c.at('007') + 4, c.end('008') - 10, 12, 12);
					return {...p, lean: p.lean + 20 * k, head: p.head + 10 * k, armF: [p.armF[0] + 30 * k, p.armF[1]]};
				},
				ex: [['worried', '008', 999]],
			},
		],
	}),
	// 009 — другая сторона неба
	sc({
		at: '009',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1250, 560, 1.15], [1500, 540, 1.3]],
		actors: [{who: 'hero', x: 0, w: [[700, 1600, 0, '009e-4', 'run']], look: [0, -0.7], ex: [['worried', 0, 999]]}],
	}),
	// 010 — телескоп на крыше
	sc({
		at: '010',
		whip: true,
		bg: <Room kind="roof" ph={0.3} />,
		bgDepth: 1.4,
		cam: [[1200, 600, 1.15], [1350, 540, 1.5]],
		actors: [{who: 'hero', x: 0, w: [[-250, 1150, 0, 50]], pose: (p, c) => ({...p, lean: p.lean + 20 * env(c.f, 56, 999, 12, 10), head: p.head + 8 * env(c.f, 56, 999, 12, 10), armF: [60 * env(c.f, 56, 999, 12, 10) + p.armF[0], 30]})}],
		mid: () => (
			<g>
				<path d="M1230,900 L1300,700 L1370,900" fill="none" stroke="#6a738c" strokeWidth={10} />
				<g transform="rotate(-28 1300 700)">
					<rect x={1180} y={668} width={420} height={64} rx={14} fill="#d8deea" />
					<rect x={1560} y={660} width={50} height={80} rx={10} fill="#2a2f44" />
					<rect x={1160} y={676} width={36} height={48} rx={6} fill="#ff6a3c" />
				</g>
			</g>
		),
	}),
	// 011 — проверяешь снова и снова
	sc({
		at: '011',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1000, 540, 2.3], [1060, 530, 2.8]],
		actors: [
			{
				who: 'hero',
				x: 1040,
				look: [0, 0],
				ex: [['worried', 0, 999]],
				g: [['touchFace', 6, 30], ['facepalm', 40, 70], ['scratch', 80, 108]],
				pose: (p, c) => ({...p, head: p.head + Math.sin(c.f / 7) * 8}),
			},
			// второй «герой» не нужен: направление взгляда прыгает
		],
		ov: (c) => (
			<>
				<Big f={c.f} t0={c.at('011') + 0} t1={c.at('011') + 28} text="AGAIN." c="#ff6a5a" y={120} />
				<Big f={c.f} t0={c.at('011') + 36} t1={c.at('011') + 64} text="AGAIN." c="#ff6a5a" y={160} />
				<Big f={c.f} t0={c.at('011') + 72} t1={c.at('011') + 104} text="AGAIN." c="#ff6a5a" y={200} />
			</>
		),
	}),
	// 012 — просто звёзды
	sc({
		at: '012',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1040, 560, 1.9], [960, 500, 0.95]],
		actors: [{who: 'hero', x: 1000, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], look: [0.5, -0.3]}],
	}),
	// 013 — Земли нет
	sc({
		at: '013',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[980, 560, 2.2], [980, 540, 1.3]],
		actors: [{who: 'hero', x: 1000, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], look: [0.6, -0.4]}],
		ov: (c) => <Big f={c.f} t0={c.at('013') + 4} t1={c.at('013') + 62} text="EARTH IS GONE" c="#ff6a5a" y={180} />,
		shake: ['013+2', '013+12', 6],
	}),
	// 014 — пылевая буря
	sc({
		at: '014',
		whip: true,
		bg: <Surface mode="storm" />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[700, 700, 1.1], [1000, 700, 1.35]],
		shake: [10, 999, 4],
		actors: [{who: 'hero', x: 0, w: [[-200, 1260, 0, '014e-8', 'run']], pose: (p) => ({...p, lean: p.lean + 6})}],
		ov: (c) => (
			<>
				<Alert f={c.f} t0={c.at('014') + 20} t1={c.end('014') - 10} text="DUST STORM" />
				<Stat f={c.f} t0={c.at('014') + 70} t1={c.end('014')} big="#1" label="biggest dust storm in Martian history" x={90} y={120} w={640} c="#ffb15a" />
			</>
		),
	}),
	// 015 — 40 человек называют имена
	sc({
		at: '015',
		whip: true,
		bg: <Room kind="dining" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.15], [1000, 590, 1.35]],
		mid: (c) => (
			<>
				<CrowdRow n={11} x0={-100} x1={1250} floor={885} s={0.78} mode="stand" seed="dn1" />
				<CrowdRow n={9} x0={800} x1={2100} floor={885} s={0.78} mode="stand" seed="dn2" />
			</>
		),
		actors: [
			{who: 'hero', x: 800, fc: 1, g: [['touchFace', 30, 90]]},
			{who: 'mom', x: 1000, fc: -1},
			{who: 'dad', x: 1180, fc: -1},
		],
		ov: (c) => <Names f={c.f} t0={c.at('015')} t1={c.end('015')} names={['Mom', 'Dad', 'Grandma', 'Daniel', 'Aunt May', 'Pepper', 'Mr. Carver', 'Lila']} />,
	}),
	// 016 — восемь часов подряд
	sc({
		at: '016',
		bg: <Room kind="dining" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[900, 620, 1.4], [980, 600, 1.2]],
		mid: () => (
			<>
				<CrowdRow n={11} x0={-100} x1={1250} floor={885} s={0.78} mode="stand" seed="dn1" />
				<CrowdRow n={9} x0={800} x1={2100} floor={885} s={0.78} mode="stand" seed="dn2" />
			</>
		),
		actors: [
			{who: 'hero', x: 900, fc: 1, ex: [['worried', 0, 999]]},
			{who: 'singh', x: 1120, fc: -1, g: [['think', 10, 60]]},
		],
		ov: (c) => (
			<>
				<Names f={c.f} t0={c.at('016')} t1={c.end('016')} names={['Priya', 'Mom', 'Rohan', 'Papa', 'Sam', 'Nina']} y={880} />
				<Timer f={c.f} t0={c.at('016') + 8} t1={c.end('016')} from={0} to={8} unit="h" label="NAMES, NONSTOP" x={110} y={110} c="#ffe9a8" />
			</>
		),
	}),
	// 017-018 — то, чего там быть не должно
	sc({
		at: '017',
		whip: true,
		bg: <Surface mode="blue" hill />,
		bgDepth: 1.25,
		cam: [[1000, 620, 1.05], [1300, 560, 1.5]],
		actors: [{who: 'hero', x: 880, fc: 1, look: [0.8, -0.7, '018'], hand: [], ex: [['wide', '018', 999]]}],
		fx: (c) => {
			const k = Math.max(0, Math.min(1, (c.f - c.at('018')) / (c.end('018') - c.at('018'))));
			const y = 740 - 260 * k;
			return (
				<g opacity={Math.min(1, k * 4)}>
					<circle cx={1430} cy={y} r={70 + Math.sin(c.f / 6) * 4} fill="#ff8a3c" opacity={0.25} />
					<circle cx={1430} cy={y} r={14} fill="#ffb15a" />
				</g>
			);
		},
		ov: (c) => <Big f={c.f} t0={c.at('018') + 60} t1={c.end('018')} text="?" c="#ffb15a" y={220} />,
	}),
	// 019 — сначала надо сказать маме. SOL 1
	sc({
		at: '019',
		whip: true,
		bg: <Room kind="hall" />,
		bgDepth: 1.3,
		cam: [[1000, 580, 1.1], [1300, 560, 1.3]],
		badge: 0,
		actors: [
			{who: 'hero', x: 0, w: [[-250, 1100, 0, '019+70', 'run']], g: [['wave', '019+80', '019e']]},
			{who: 'mom', x: 1500, fc: -1, look: [-0.8, 0], g: [['wave', '019+86', '019e']]},
		],
		ov: (c) => <Big f={c.f} t0={c.at('019') + 6} t1={c.end('019') - 4} text="SOL 1" c="#fff" y={150} />,
	}),
	// 020 — сутки на Марсе
	sc({
		at: '020',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[900, 560, 1.15], [1000, 540, 1.35]],
		actors: [
			{who: 'hero', x: 800, fc: 1, g: [['point', '020+20', '020e']]},
			{who: 'mom', x: 1000, fc: -1, item: ITEM.mug},
		],
		fx: (c) => <ClockFace x={1560} y={300} r={120} f={c.f} t0={c.at('020')} t1={c.end('021')} spins={1.03} />,
	}),
	// 021 — 24 часа 39 минут
	sc({
		at: '021',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[1100, 520, 1.3], [1300, 420, 1.6]],
		actors: [{who: 'hero', x: 800, fc: 1, g: [['think', 10, 70]], look: [0.8, -0.3]}, {who: 'mom', x: 1000, fc: -1, item: ITEM.mug}],
		fx: (c) => <ClockFace x={1560} y={300} r={120} f={c.f} t0={0} t1={c.end('021')} spins={1.03} />,
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('021') + 4} t1={c.end('021')} big="24h 39m" label="one Martian day (sol)" sub="a little longer than ours" x={90} y={120} w={640} c="#ff8a5a" />
			</>
		),
	}),
	// 022-023 — 40 человек
	sc({
		at: '022',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[900, 620, 1.0], [1000, 600, 1.25]],
		mid: () => (
			<>
				<CrowdRow n={12} x0={-200} x1={2100} floor={880} s={0.72} mode="stand" seed="cr1" />
			</>
		),
		actors: [{who: 'hero', x: 960, fc: -1, g: [['wave', 14, 60]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('022')} t1={c.end('022')} big="40" label="people on the station" x={90} y={110} w={560} c="#6ad4ff" />,
	}),
	sc({
		at: '023',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[500, 600, 1.35], [1500, 600, 1.35]],
		actors: [
			{who: 'mom', x: 330, fc: 1, g: [['wave', '023+6', '023+34']]},
			{who: 'eng1', x: 600, fc: 1, g: [['wave', '023+26', '023+52']]},
			{who: 'doc', x: 870, fc: 1, g: [['wave', '023+46', '023+72']]},
			{who: 'cook', x: 1140, fc: 1, g: [['wave', '023+66', '023+92']]},
			{who: 'kid1', x: 1380, s: 0.78, fc: 1, hop: [['023+88', '023+112', 40]]},
			{who: 'kid2', x: 1500, s: 0.78, fc: 1, hop: [['023+94', '023+118', 40]]},
			{who: 'hero', x: 1660, fc: -1, hop: [['023+100', '023+126', 60]]},
		],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('023') + 4} t1={c.at('023') + 40} from={[330, HEADY]} to={[330, 300]} text="SCIENTISTS" align="center" c="#9fe0f0" />
				<Callout f={c.f} t0={c.at('023') + 24} t1={c.at('023') + 62} from={[600, HEADY]} to={[640, 190]} text="ENGINEERS" align="center" c="#ffb15a" />
				<Callout f={c.f} t0={c.at('023') + 44} t1={c.at('023') + 84} from={[870, HEADY]} to={[880, 300]} text="DOCTOR" align="center" c="#9be564" />
				<Callout f={c.f} t0={c.at('023') + 64} t1={c.at('023') + 106} from={[1140, HEADY]} to={[1160, 190]} text="COOK" align="center" c="#ffd34a" />
				<Callout f={c.f} t0={c.at('023') + 86} t1={c.end('023')} from={[1450, HEADY + 40]} to={[1450, 300]} text="4 KIDS" align="center" c="#ff6a5a" />
			</>
		),
	}),
	// 024 — 14 месяцев
	sc({
		at: '024',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[900, 560, 1.2], [1000, 540, 1.5]],
		actors: [{who: 'hero', x: 920, fc: 1, ex: [['sleepy', 0, 999]], g: [['scratch', 20, 70]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('024') + 4} t1={c.end('024')} big="14" label="months on Mars" x={90} y={120} w={540} c="#9be564" />,
	}),
	// 025 — мама и растения, папа и машины
	sc({
		at: '025',
		whip: true,
		bg: <Room kind="lab" />,
		bgDepth: 1.3,
		cam: [[960, 580, 1.15], [960, 560, 1.4]],
		actors: [
			{who: 'mom', x: 560, fc: 1, item: ITEM.plant, g: [['presentF', '025+10', '025+60']]},
			{who: 'hero', x: 960, fc: 1, g: [['shrug', '025+30', '025+80']]},
			{who: 'dad', x: 1360, fc: -1, item: ITEM.wrench, hand: [], g: [['fist', '025+60', '025e']]},
		],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('025') + 12} t1={c.at('025') + 70} from={[560, HEADY]} to={[560, 300]} text="PLANTS" align="center" c="#9be564" />
				<Callout f={c.f} t0={c.at('025') + 72} t1={c.end('025')} from={[1360, HEADY]} to={[1360, 300]} text="MACHINES" align="center" c="#ffb15a" />
			</>
		),
	}),
	// 026 — никто не хотел
	sc({
		at: '026',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[960, 590, 1.1], [960, 570, 1.35]],
		actors: [
			{who: 'hero', x: 960, fc: -1, g: [['shrug', '026+20', '026e']], ex: [['worried', 0, 999]]},
			{who: 'eng1', x: 0, fc: 1, w: [[560, 1800, 8, '026+70']], hide: [0, '026+70']},
			{who: 'doc', x: 0, fc: 1, w: [[380, 1800, 14, '026+80']]},
			{who: 'cook', x: 0, fc: -1, w: [[1500, -300, 4, '026+60']]},
			{who: 'eng2', x: 0, fc: -1, w: [[1700, -300, 22, '026+84']]},
		],
	}),
	// 027 — тебе было 15
	sc({
		at: '027',
		bg: <Room kind="quarters" earth={1} />,
		cam: [[900, 560, 1.4], [1000, 540, 1.8]],
		actors: [{who: 'hero', x: 900, fc: 1, g: [['fist', '027+10', '027e']], hop: [['027+30', '027+56', 50]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('027')} t1={c.end('027')} big="15" label="years old" x={90} y={120} w={480} c="#ff6a5a" />,
	}),
	// 028 — величайшее приключение
	sc({
		at: '028',
		whip: true,
		bg: <Surface mode="dawn" />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.1], [1100, 520, 1.5]],
		actors: [{who: 'hero', x: 0, w: [[-200, 900, 0, 34]], hop: [[40, 66, 90], [72, 100, 110]], }],
	}),
];
