import React from 'react';
import {AbsoluteFill} from 'remotion';
import {env} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {CrowdRow} from '../kit/kit';
import {Bubble} from '../kit/ui';
import {Chair} from '../engine/props';
import {sc} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface} from './places';
import {Alert, Beams, Big, Envelope, ITEM, Pie, Rover, SignalRings, Ship, Stat, SunCompare, Thermo, Timer, Whiteboard, OrbitSignal, holdAt} from './gfx';
import {Dish} from './places';

const HEADY = 900 - 157 - 164;
const LIE = {lean: 88, head: 0, armB: [150, 10], armF: [140, 10], legB: [-85, 0], legF: [-80, 5]} as const;
const crowd = () => (
	<>
		<CrowdRow n={10} x0={-200} x1={1100} floor={885} s={0.74} mode="stand" seed="d1" />
		<CrowdRow n={7} x0={900} x1={2200} floor={885} s={0.74} mode="stand" seed="d2" />
	</>
);
const board = (c: any, items: {t: string; at: number; c?: string}[], x = 1450) => <Whiteboard x={x} y={190} f={c.f} title="SURVIVAL MATH" items={items} tilt={-1} />;
const wbItems = (c: any, upto: number) =>
	[
		{t: 'FOOD: 14 months', at: c.at('059') - c.at('057') < 0 ? 0 : c.at('059')},
		{t: 'WATER: underground ice', at: c.at('060')},
		{t: 'OXYGEN: Martian air', at: c.at('062')},
	].slice(0, upto);

export const P2: ShotDef[] = [
	sc({
		at: '029',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.0], [1200, 580, 1.3]],
		mid: crowd,
		actors: [
			{who: 'hale', x: 1480, fc: -1, g: [['stop', 20, 80], ['presentF', 80, '029e']], item: ITEM.marker},
			{who: 'hero', x: 0, w: [[-250, 640, 0, 60]], fc: 1},
			{who: 'mom', x: 0, w: [[-380, 800, 0, 70]], fc: 1},
			{who: 'eng1', x: 0, w: [[2200, 1180, 10, 70]]},
			{who: 'doc', x: 0, w: [[2300, 1300, 20, 80]]},
			{who: 'kid1', x: 0, s: 0.78, w: [[-300, 400, 0, 50]]},
		],
		fx: (c) => <Callout f={c.f} t0={c.at('029') + 40} t1={c.end('029')} from={[1480, HEADY]} to={[1480, 260]} text="COMMANDER HALE" align="center" c="#6ad4ff" />,
	}),
	sc({
		at: '030',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1480, 590, 2.4], [1480, 600, 3.1]],
		mid: crowd,
		actors: [
			{
				who: 'hale',
				x: 1480,
				fc: -1,
				ex: [['worried', 0, 999]],
				pose: (p, c) => ({...p, lean: 2, armF: [50 + Math.sin(c.f * 1.9) * 5, 96 + Math.sin(c.f * 2.3) * 7], armB: [40 + Math.cos(c.f * 2.1) * 5, 100 + Math.cos(c.f * 1.7) * 7]}),
			},
		],
	}),
	sc({
		at: '031',
		bg: <Room kind="dining" dim={0.15} />,
		bgDepth: 1.3,
		cam: [[800, 590, 1.35], [900, 580, 1.15]],
		mid: crowd,
		actors: [
			{who: 'hero', x: 660, fc: 1, ex: [['worried', 0, 999]], look: [0.9, 0]},
			{who: 'mom', x: 830, fc: 1, ex: [['worried', 0, 999]]},
			{who: 'hale', x: 1400, fc: -1, ex: [['worried', 0, 999]]},
		],
		ov: (c) => <Timer f={c.f} t0={c.at('031') + 6} t1={c.end('031')} from={0} to={19} unit="h" label="NO ANSWER FROM EARTH" x={1180} y={110} />,
	}),
	// 032-036 связь
	sc({
		at: '032',
		whip: true,
		bg: <Room kind="comms" screen="orbit" />,
		bgDepth: 1.3,
		cam: [[900, 560, 1.15], [1000, 540, 1.4]],
		actors: [
			{who: 'hero', x: 0, w: [[-250, 820, 0, 40]], fc: 1, g: [['think', 50, '032e']]},
			{who: 'dad', x: 0, w: [[2200, 1150, 6, 50]], fc: -1, g: [['point', 56, '032e']]},
		],
	}),
	sc({at: '033', bg: <Room kind="comms" screen="orbit" />, bgDepth: 1.3, cam: [[960, 480, 1.1], [960, 480, 1.0]], ov: (c) => <OrbitSignal f={c.f} t0={c.at('033') + 2} t1={c.end('034') + 4} />}),
	sc({
		at: '035',
		bg: <Room kind="comms" screen="static" />,
		bgDepth: 1.3,
		cam: [[860, 570, 1.5], [900, 560, 1.8]],
		actors: [{who: 'hero', x: 880, fc: 1, item: ITEM.radio, look: [0.3, -0.2], g: [['think', '035+40', '035e']]}],
		fx: (c) => (
			<Bubble x={960} y={290} w={230} h={110} t={c.f - c.at('035') - 30} tail={[-60, 130]} thought>
				<text textAnchor="middle" y={22} fontSize={64} fontFamily="Rubik" fontWeight={800} fill="#1a2250">
					…
				</text>
			</Bubble>
		),
	}),
	sc({
		at: '036',
		bg: <Room kind="comms" screen="static" />,
		bgDepth: 1.3,
		cam: [[900, 560, 1.1], [1000, 540, 1.25]],
		actors: [{who: 'hero', x: 700, fc: 1, g: [['wave', 20, '036e']], ex: [['wide', 0, 999]]}],
		fx: (c) => <Envelope f={c.f} t0={c.at('036') + 8} t1={c.end('036') + 20} x0={780} x1={2100} y={500} />,
		ov: (c) => <Stat f={c.f} t0={c.at('036') + 20} t1={c.end('036')} big="LETTER" label="not a phone call" x={90} y={110} w={540} c="#ffd34a" />,
	}),
	// 037-039 ждали час, шесть, девятнадцать
	sc({
		at: '037',
		bg: <Room kind="comms" screen="dark" />,
		bgDepth: 1.3,
		cam: [[900, 570, 1.2], [1000, 560, 1.4]],
		actors: [{who: 'hale', x: 1000, fc: -1, g: [['think', 20, 60], ['presentF', 70, '037e']]}, {who: 'hero', x: 600, fc: 1}],
		ov: (c) => <Timer f={c.f} t0={c.at('037')} t1={c.end('037') + 6} from={0} to={1} unit="h" label="WAITED" x={1160} y={110} />,
	}),
	sc({
		at: '038',
		bg: <Room kind="comms" screen="dark" />,
		bgDepth: 1.3,
		cam: [[1100, 570, 1.5], [1050, 560, 1.7]],
		actors: [{who: 'hale', x: 1000, fc: -1, ex: [['worried', 0, 999]], g: [['scratch', 4, '038e']]}],
		ov: (c) => <Timer f={c.f} t0={c.at('038')} t1={c.end('038') + 6} from={1} to={6} unit="h" label="WAITED" x={1160} y={110} />,
	}),
	sc({
		at: '039',
		bg: <Room kind="comms" screen="dark" />,
		bgDepth: 1.3,
		cam: [[1000, 560, 2.2], [1000, 560, 2.6]],
		actors: [{who: 'hale', x: 1000, fc: -1, ex: [['sad', 0, 999]], g: [['facepalm', 2, '039e']]}],
		ov: (c) => <Timer f={c.f} t0={c.at('039')} t1={c.end('039') + 6} from={6} to={19} unit="h" label="WAITED" x={1180} y={110} />,
		shake: ['039+8', '039+20', 5],
	}),
	// 040-043 тарелка антенны
	sc({
		at: '040',
		whip: true,
		bg: <Surface mode="night" base={false} />,
		bgDepth: 1.25,
		cam: [[1000, 560, 1.1], [1000, 480, 1.4]],
		actors: [{who: 'eng2', x: 760, fc: 1, look: [0.6, -0.8], g: [['point', 20, '041e']]}, {who: 'hero', x: 560, fc: 1, look: [0.6, -0.8]}],
		mid: () => <Dish x={1180} y={900} s={2.4} />,
		fx: (c) => <SignalRings x={1230} y={380} f={c.f} t0={c.at('040') + 10} t1={c.end('041') + 40} />,
	}),
	sc({
		at: '042',
		bg: <Surface mode="night" base={false} />,
		bgDepth: 1.25,
		cam: [[1100, 500, 1.4], [1150, 400, 1.7]],
		mid: () => <Dish x={1180} y={900} s={2.4} />,
		fx: (c) => <SignalRings x={1230} y={380} f={c.f} t0={0} t1={c.end('042')} c="#5cff9a" max={700} />,
		actors: [{who: 'eng2', x: 760, fc: 1, look: [0.6, -0.8]}],
	}),
	sc({
		at: '043',
		bg: <Surface mode="night" base={false} />,
		bgDepth: 1.25,
		cam: [[1100, 520, 1.3], [1000, 560, 1.1]],
		mid: () => <Dish x={1180} y={900} s={2.4} />,
		actors: [{who: 'hero', x: 700, fc: 1, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], g: [['handsOnHead', '043+10', '043e']]}, {who: 'eng2', x: 560, fc: 1, g: [['facepalm', 6, '043e']]}],
		ov: (c) => <Alert f={c.f} t0={c.at('043')} t1={c.end('043') + 20} text="NO SIGNAL" />,
	}),
	// 044-052 Анна встаёт
	sc({
		at: '044',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.2], [1100, 560, 1.6]],
		mid: () => (
			<>
				{crowd()}
				<Chair x={1100} y={800} facing={-1} />
			</>
		),
		actors: [{who: 'anna', x: 1100, fc: -1, sit: [[0, '044+70']], ex: [['sad', 0, 999]]}],
		fx: (c) => <Callout f={c.f} t0={c.at('044') + 40} t1={c.end('044')} from={[1100, HEADY]} to={[1250, 250]} text="ANNA · TELESCOPE OPERATOR" c="#2fb59f" />,
	}),
	sc({
		at: '045',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1050, 580, 1.4], [1050, 570, 1.7]],
		follow: 1.8,
		mid: crowd,
		actors: [
			{who: 'anna', x: 1100, fc: -1, g: [['point', '045+4', '045e']], ex: [['sad', 0, 999]]},
			{who: 'hero', x: 640, fc: 1, look: [0.9, 0]},
			{who: 'mom', x: 800, fc: 1},
			{who: 'hale', x: 1480, fc: -1},
		],
	}),
	sc({
		at: '046',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1050, 580, 1.4], [1050, 570, 1.7]],
		follow: 1.9,
		mid: crowd,
		actors: [
			{who: 'anna', x: 1100, fc: -1, g: [['shrug', '046+4', '047e'], ['handsOnHead', '048+6', '048e']], ex: [['sad', 0, 999]]},
			{who: 'hero', x: 640, fc: 1, look: [0.9, 0]},
			{who: 'mom', x: 800, fc: 1},
			{who: 'hale', x: 1480, fc: -1},
		],
	}),
	sc({
		at: '049',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1200, 590, 1.6], [1300, 580, 1.9]],
		mid: crowd,
		actors: [
			{who: 'eng1', x: 1320, fc: -1, sp: 'CREW', ex: [['wide', 0, 999]], g: [['point', 6, '049e']]},
			{who: 'anna', x: 1000, fc: 1},
		],
	}),
	sc({
		at: '051',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1100, 590, 1.9], [1100, 580, 2.3]],
		follow: 2.2,
		mid: crowd,
		actors: [{who: 'anna', x: 1100, fc: -1, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], pose: (p) => ({...p, head: p.head + 14})}],
	}),
	sc({
		at: '052',
		bg: <Room kind="dining" dim={0.3} />,
		bgDepth: 1.3,
		cam: [[1000, 580, 1.6], [960, 560, 0.95]],
		dust: '#ffe9a8',
		mid: crowd,
		actors: [
			{who: 'anna', x: 1100, fc: -1, ex: [['sad', 0, 999]]},
			{who: 'hero', x: 640, fc: 1, ex: [['sad', 0, 999]], pose: (p) => ({...p, head: p.head + 12})},
			{who: 'mom', x: 800, fc: 1, ex: [['sad', 0, 999]]},
			{who: 'hale', x: 1480, fc: -1, ex: [['sad', 0, 999]]},
		],
	}),
	// 053-056 мама берёт за руку
	sc({
		at: '053',
		bg: <Room kind="dining" dim={0.3} />,
		bgDepth: 1.3,
		cam: [[900, 590, 1.5], [900, 600, 1.9]],
		actors: [
			{who: 'hero', x: 820, fc: 1, ex: [['worried', 0, 999]], pose: (p, c, x) => holdAt(p, env(c.f, c.at('053') + 50, 9999, 12, 4), x, 1, 915)},
			{who: 'mom', x: 1010, fc: -1, look: [-0.8, 0.3], g: [['wave', 0, 1]], pose: (p, c, x) => holdAt(p, env(c.f, c.at('053') + 30, 9999, 14, 4), x, -1, 915)},
		],
	}),
	sc({
		at: '054',
		bg: <Room kind="dining" dim={0.3} />,
		bgDepth: 1.3,
		cam: [[915, 690, 3.2], [915, 680, 3.8]],
		actors: [
			{who: 'hero', x: 820, fc: 1, ex: [['worried', 0, 999]], pose: (p, c, x) => holdAt(p, 1, x, 1, 915)},
			{who: 'mom', x: 1010, fc: -1, pose: (p, c, x) => holdAt(p, 1, x, -1, 915)},
		],
	}),
	sc({
		at: '055',
		bg: <Room kind="dining" dim={0.3} />,
		bgDepth: 1.3,
		cam: [[960, 590, 1.9], [980, 580, 2.3]],
		follow: 2.0,
		actors: [
			{who: 'hero', x: 820, fc: 1, ex: [['worried', 0, 999]], pose: (p, c, x) => holdAt(p, 1, x, 1, 915)},
			{who: 'mom', x: 1010, fc: -1, ex: [['worried', 0, 999]], pose: (p, c, x) => holdAt(p, 1, x, -1, 915)},
		],
	}),
	sc({
		at: '056',
		bg: <Room kind="dining" dim={0.4} />,
		bgDepth: 1.3,
		cam: [[960, 590, 1.7], [960, 540, 0.95]],
		mid: crowd,
		dust: '#ffe9a8',
		actors: [
			{who: 'hero', x: 820, fc: 1, ex: [['worried', 0, 999]], pose: (p, c, x) => holdAt(p, 1, x, 1, 915)},
			{who: 'mom', x: 1010, fc: -1, pose: (p, c, x) => holdAt(p, 1, x, -1, 915)},
		],
	}),
	// 057-074 доска: математика выживания
	sc({
		at: '057',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1100, 560, 1.15], [1300, 500, 1.4]],
		mid: crowd,
		actors: [
			{who: 'hale', x: 0, w: [[2300, 1180, 6, 70]], fc: -1, item: ITEM.marker, g: [['point', '058', '058+50']]},
			{who: 'hero', x: 560, fc: 1, look: [0.9, -0.2]},
		],
		fx: (c) => <Whiteboard x={1450} y={190} f={c.f} title="SURVIVAL MATH" items={[]} tilt={-1} />,
		ov: (c) => <Big f={c.f} t0={c.at('057') + 4} t1={c.at('057') + 48} text="SOL 3" c="#fff" y={140} />,
	}),
	sc({
		at: '059',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1350, 420, 1.5], [1400, 440, 1.8]],
		mid: crowd,
		actors: [{who: 'hale', x: 1180, fc: 1, item: ITEM.marker, g: [['point', 4, '061e']]}],
		fx: (c) => <Whiteboard x={1450} y={190} f={c.f} title="SURVIVAL MATH" items={[{t: 'FOOD: 14 months', at: c.at('059') + 6}, {t: 'WATER: underground ice', at: c.at('060') + 4}]} tilt={-1} />,
	}),
	sc({
		at: '062',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1350, 440, 1.5], [1400, 440, 1.7]],
		mid: crowd,
		actors: [{who: 'hale', x: 1180, fc: 1, item: ITEM.marker, g: [['point', 4, '063e']]}],
		fx: (c) => <Whiteboard x={1450} y={190} f={c.f} title="SURVIVAL MATH" items={[{t: 'FOOD: 14 months', at: -50}, {t: 'WATER: underground ice', at: -50}, {t: 'OXYGEN: Martian air', at: c.at('062') + 4}]} tilt={-1} />,
		ov: (c) => <Pie f={c.f} t0={c.at('063') - 6} t1={c.end('063') + 10} pct={95} label="CARBON DIOXIDE" x={420} y={160} />,
	}),
	sc({
		at: '064',
		whip: true,
		bg: <Surface mode="day" base={false} />,
		bgDepth: 1.25,
		cam: [[800, 700, 1.15], [1300, 700, 1.4]],
		fx: (c) => <Rover x={600 + (c.f - c.at('064')) * 4} y={880} s={1.5} t={c.f} />,
		ov: (c) => <Stat f={c.f} t0={c.at('064') + 20} t1={c.end('065')} big="REAL" label="experiment on a real rover" x={90} y={110} w={600} c="#6ad4ff" />,
	}),
	sc({
		at: '066',
		bg: <Surface mode="day" base={false} />,
		bgDepth: 1.25,
		cam: [[1000, 700, 1.7], [1100, 700, 2.0]],
		fx: (c) => (
			<>
				<Rover x={1000} y={880} s={1.5} t={0} dust={false} />
				{Array.from({length: 8}).map((_, i) => {
					const u = ((c.f * 0.02 + i / 8) % 1);
					return <circle key={i} cx={1010 + Math.sin(i * 2 + c.f / 12) * 28} cy={640 - u * 260} r={10 - 6 * u} fill="#bfe8ff" opacity={1 - u} />;
				})}
			</>
		),
		ov: (c) => <Stat f={c.f} t0={c.at('066') + 14} t1={c.end('067')} big="grams" label="of breathable oxygen at a time" x={90} y={110} w={640} c="#9fe0f0" />,
	}),
	sc({
		at: '068',
		bg: <Room kind="lab" />,
		bgDepth: 1.3,
		cam: [[900, 580, 1.2], [1000, 560, 1.5]],
		actors: [{who: 'dad', x: 900, fc: 1, item: ITEM.wrench, g: [['presentF', 10, 80]]}, {who: 'hero', x: 1200, fc: -1}],
		ov: (c) => <SunCompare f={c.f} t0={c.at('069') - 20} t1={c.end('070') + 6} />,
	}),
	sc({
		at: '071',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1350, 440, 1.5], [1400, 440, 1.8]],
		mid: crowd,
		actors: [{who: 'hale', x: 1180, fc: 1, item: ITEM.marker, g: [['point', 4, '072e']]}],
		fx: (c) => (
			<Whiteboard
				x={1450}
				y={190}
				f={c.f}
				title="SURVIVAL MATH"
				items={[{t: 'FOOD: 14 months', at: -50}, {t: 'WATER: underground ice', at: -50}, {t: 'OXYGEN: Martian air', at: -50}, {t: 'RESUPPLY SHIP: 18 months', at: c.at('072'), c: '#c0392b'}]}
				tilt={-1}
			/>
		),
	}),
	sc({
		at: '073',
		bg: <Room kind="dining" dim={0.2} />,
		bgDepth: 1.3,
		cam: [[1100, 520, 1.2], [1380, 460, 1.7]],
		mid: crowd,
		actors: [{who: 'hero', x: 800, fc: 1, ex: [['sad', 0, 999]], look: [0.9, -0.3]}, {who: 'mom', x: 960, fc: 1, ex: [['sad', 0, 999]]}],
		fx: (c) => (
			<>
				<Whiteboard
					x={1450}
					y={190}
					f={c.f}
					title="SURVIVAL MATH"
					items={[{t: 'FOOD: 14 months', at: -50}, {t: 'WATER: underground ice', at: -50}, {t: 'OXYGEN: Martian air', at: -50}, {t: 'RESUPPLY SHIP: 18 months', at: -50, c: '#c0392b'}]}
					tilt={-1}
				/>
				<Callout f={c.f} t0={c.at('074') - 4} t1={c.end('074')} from={[1580, 470]} to={[1600, 700]} text="BUILT ON EARTH" c="#ff6a5a" />
			</>
		),
	}),
	// 075-091 поверхность
	sc({
		at: '075',
		whip: true,
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[800, 640, 1.1], [1100, 620, 1.4]],
		actors: [{who: 'hero', x: 0, w: [[-200, 800, 0, 70]], look: [0.8, -0.1]}],
	}),
	sc({
		at: '076',
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[1000, 560, 1.0], [1000, 560, 1.25]],
		mid: () => (
			<g>
				<path d="M900,780 L1150,330 L1200,380 L1250,350 L1480,780 Z" fill="#8a5a46" />
				<path d="M1150,330 L1200,380 L1250,350 L1220,320 Z" fill="#f4f6fa" />
			</g>
		),
		actors: [{who: 'hero', x: 560, fc: 1, g: [['handsOnHead', 20, '078e']], ex: [['wide', 0, 999]]}],
		fx: (c) => <Callout f={c.f} t0={c.at('076') + 40} t1={c.end('077')} from={[1200, 350]} to={[1200, 180]} text="TOP OF EVEREST" align="center" c="#9fe0f0" />,
		ov: (c) => <Stat f={c.f} t0={c.at('078') - 4} t1={c.end('078') + 6} big="<1%" label="of Earth's air pressure" x={90} y={110} w={600} c="#6ad4ff" />,
	}),
	sc({
		at: '079',
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.2], [900, 640, 1.7]],
		actors: [
			{
				who: 'hero',
				x: 0,
				w: [[-100, 860, 0, 30]],
				ex: [['wide', 30, '079e'], ['sleepy', '080+20', 999]],
				pose: (p, c) => {
					const t = c.at('080') + 36;
					const k = env(c.f, t, 9999, 18, 4);
					const wob = env(c.f, c.at('079') + 40, t, 10, 4);
					const q = {...p, lean: p.lean + Math.sin(c.f / 4) * 10 * wob, head: p.head + Math.sin(c.f / 5) * 14 * wob, armF: [p.armF[0] + 30 * wob, p.armF[1]]} as typeof p;
					return {lean: q.lean + (88 - q.lean) * k, head: q.head * (1 - k), armB: [q.armB[0] + (150 - q.armB[0]) * k, 10], armF: [q.armF[0] + (140 - q.armF[0]) * k, 10], legB: [q.legB[0] + (-85 - q.legB[0]) * k, 0], legF: [q.legF[0] + (-80 - q.legF[0]) * k, 5]};
				},
			},
		],
		ov: (c) => <Timer f={c.f} t0={c.at('079') + 30} t1={c.end('080') + 4} from={0} to={15} unit="sec" label="NO SUIT" x={1180} y={110} />,
	}),
	sc({
		at: '081',
		bg: <Surface mode="dusk" />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.4], [950, 590, 1.7]],
		actors: [{who: 'hero', x: 900, fc: 1, ex: [['worried', 0, 999]], pose: (p, c) => ({...p, lean: p.lean + 4 + Math.sin(c.f * 2.6) * 3, head: p.head + Math.sin(c.f * 3.1) * 4}), g: [['armsCrossed', 8, '081e']]}],
		ov: (c) => <Thermo f={c.f} t0={c.at('081')} t1={c.end('081') + 10} x={1560} y={130} from={20} to={-60} />,
	}),
	sc({
		at: '082',
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[950, 600, 1.2], [950, 600, 1.5]],
		actors: [{who: 'hero', x: 900, fc: 1, g: [['scratch', 20, '083e']], ex: [['worried', 0, 999]]}],
		fx: (c) => <Beams f={c.f} x0={500} x1={1500} y0={0} y1={900} n={22} />,
		ov: (c) => <Alert f={c.f} t0={c.at('082') + 40} t1={c.end('083') + 10} text="RADIATION" />,
	}),
	sc({
		at: '084',
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[950, 600, 1.2], [950, 600, 1.45]],
		actors: [{who: 'hero', x: 900, fc: 1, g: [['touchFace', 20, '084e']]}],
		fx: (c) => <Beams f={c.f} x0={500} x1={1500} y0={0} y1={900} n={28} />,
		ov: (c) => <Stat f={c.f} t0={c.at('084') + 10} t1={c.end('084') + 6} big="×10" label="chest X-rays, every day" x={90} y={110} w={620} c="#ffe27a" />,
		flash: '084+30',
	}),
	sc({
		at: '085',
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		dust: '#e0a070',
		cam: [[900, 620, 1.7], [950, 610, 2.1]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.potato, g: [['presentF', 10, '085e']]}],
		fx: (c) => <Callout f={c.f} t0={c.at('085') + 20} t1={c.end('085')} from={[1000, 700]} to={[1250, 520]} text="CINNAMON-RED DUST" c="#ffb15a" />,
	}),
	sc({
		at: '086',
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		dust: '#e0a070',
		cam: [[950, 590, 1.6], [950, 590, 2.0]],
		actors: [{who: 'hero', x: 900, fc: 1, ex: [['wide', '087', 999]], g: [['facepalm', '087+10', '087e']]}],
		ov: (c) => <Alert f={c.f} t0={c.at('086') + 20} t1={c.end('087') + 8} text="TOXIC: PERCHLORATES" />,
	}),
	sc({
		at: '088',
		whip: true,
		bg: <Surface mode="dawn" />,
		bgDepth: 1.25,
		cam: [[900, 640, 1.8], [1100, 520, 1.0]],
		actors: [{who: 'hero', x: 880, fc: 1, look: [0.8, -0.3], ex: [['wide', 0, 999]], hop: [['088+40', '088+66', 70]]}],
	}),
	sc({
		at: '089',
		bg: <Surface mode="dawn" />,
		bgDepth: 1.25,
		cam: [[400, 640, 1.2], [1500, 640, 1.2]],
		mid: () => <path d="M-200,790 L400,790 L520,830 L900,800 L1300,860 L1700,800 L2300,790 L2300,1100 L-200,1100 Z" fill="#3d1c22" />,
		actors: [{who: 'hero', x: 0, w: [[200, 1500, 0, '089e']], look: [0.6, 0.2]}],
		ov: (c) => <Stat f={c.f} t0={c.at('089') + 24} t1={c.end('089')} big="≈ USA" label="canyon as long as the US is wide" x={90} y={110} w={640} c="#ffb15a" />,
	}),
	sc({
		at: '090',
		bg: <Surface mode="dawn" />,
		bgDepth: 1.25,
		cam: [[1000, 560, 1.0], [1000, 480, 1.3]],
		mid: () => (
			<g>
				<path d="M200,790 Q900,150 1600,790 Z" fill="#9a5a4a" />
				<path d="M1500,790 L1660,560 L1700,560 L1840,790 Z" fill="#8a4a3a" />
			</g>
		),
		actors: [{who: 'hero', x: 560, fc: 1, look: [0.9, -0.6], ex: [['wide', 0, 999]]}],
		fx: (c) => <Callout f={c.f} t0={c.at('090') + 10} t1={c.end('090')} from={[900, 330]} to={[1250, 170]} text="TALLER THAN ANY MOUNTAIN ON EARTH" c="#ffb15a" />,
	}),
	sc({
		at: '091',
		bg: <Surface mode="storm" base={false} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[900, 620, 1.5], [950, 600, 1.9]],
		shake: [0, 999, 3],
		actors: [{who: 'hero', x: 900, fc: 1, ex: [['worried', 0, 999]], mo: [['frown', 0, 999]], pose: (p, c) => ({...p, lean: p.lean + 6 + Math.sin(c.f / 3) * 2})}],
		ov: (c) => <Alert f={c.f} t0={c.at('091') + 4} t1={c.end('091') + 10} text="TRYING TO KILL YOU" />,
	}),
];

