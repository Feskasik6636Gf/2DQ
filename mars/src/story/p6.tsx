import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {env} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {sc} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface} from './places';
import {Alert, Big, Calendar, ITEM, LikeSub, SignalRings, Stat, Names} from './gfx';
import {EarthDot, Stars} from './places';

const HEADY = 900 - 157 - 164;
const kl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const warm = <AbsoluteFill style={{background: 'rgba(255,170,90,.18)', mixBlendMode: 'soft-light'}} />;
const cool = <AbsoluteFill style={{background: 'rgba(90,150,255,.2)', mixBlendMode: 'soft-light'}} />;
const crowdS = ['hero', 'mom', 'dad', 'hale', 'anna', 'husband', 'cook', 'doc', 'eng1', 'eng2', 'singh'];

export const P6: ShotDef[] = [
	sc({
		at: '279',
		whip: true,
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[900, 640, 1.2], [1100, 620, 1.4]],
		badge: 0,
		actors: [{who: 'hero', x: 800, fc: 1, look: [0.9, -0.2]}],
		ov: (c) => <Stat f={c.f} t0={c.at('279') + 8} t1={c.end('280')} big="687" label="days in one Martian year" sub="almost twice as long as ours" x={90} y={110} w={700} c="#ff8a5a" />,
	}),
	sc({
		at: '281',
		bg: <Surface mode="dusk" hill />,
		bgDepth: 1.25,
		cam: [[800, 640, 1.2], [1200, 620, 1.25]],
		actors: crowdS.map((w, i) => ({who: w, x: 0, fc: 1 as const, w: [[-300 - i * 130, 300 + i * 150, 4 + i * 4, 90 + i * 4]] as any, s: 0.95})),
		ov: (c) => <Stat f={c.f} t0={c.at('281') + 6} t1={c.end('281') + 6} big="LAST EVENING" label="of the first Martian year" x={90} y={110} w={760} c="#ffb15a" />,
	}),
	sc({
		at: '282',
		bg: <Surface mode="dusk" hill />,
		bgDepth: 1.25,
		cam: [[1000, 640, 1.1], [1100, 620, 1.4]],
		actors: crowdS.map((w, i) => ({who: w, x: 300 + i * 150, fc: 1 as const, s: 0.95, g: i % 3 === 0 ? [['wave', 20 + i * 6, 120]] : [], hop: [[10 + i * 5, 36 + i * 5, 60]] as any})),
	}),
	sc({
		at: '284',
		bg: <Surface mode="dusk" hill sunY={730} />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.7], [980, 590, 2.1]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.baby, g: [['presentF', 4, '285e']], pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), mo: [['smile', 0, 999]]}, {who: 'mom', x: 1120, fc: -1, mo: [['smile', 0, 999]]}],
		ov: () => warm,
	}),
	sc({
		at: '286',
		bg: (c) => <Surface mode="dusk" hill sunY={interpolate(c.f, [0, 120], [680, 760], kl)} sunX={1300} />,
		bgDepth: 1.25,
		cam: [[1000, 640, 1.2], [1300, 600, 1.5]],
		actors: crowdS.slice(0, 6).map((w, i) => ({who: w, x: 500 + i * 180, fc: 1 as const, look: [0.9, 0] as [number, number]})),
		ov: () => warm,
	}),
	sc({
		at: '287',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1100, 600, 1.1], [1300, 640, 1.5]],
		actors: [{who: 'hero', x: 800, fc: 1, look: [0.9, 0], ex: [['wide', 0, 999]]}],
		ov: (c) => <Big f={c.f} t0={c.at('288') + 2} t1={c.end('288') + 10} text="THE SUNSET IS BLUE" c="#9fd0ff" y={140} />,
	}),
	sc({
		at: '289',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1300, 640, 1.4], [1300, 560, 1.0]],
		fx: (c) => (
			<>
				{Array.from({length: 22}).map((_, i) => {
					const a = (i / 22) * Math.PI * 2;
					const u = ((c.f * 0.02 + i / 22) % 1);
					return <circle key={i} cx={1300 + Math.cos(a) * (60 + u * 420)} cy={720 + Math.sin(a) * (60 + u * 420) * 0.7} r={4} fill="#9fd0ff" opacity={1 - u} />;
				})}
				<Callout f={c.f} t0={c.at('289') + 10} t1={c.end('290')} from={[1520, 560]} to={[1560, 300]} text="DUST SCATTERS LIGHT" c="#9fd0ff" />
			</>
		),
		actors: [{who: 'hero', x: 700, fc: 1, look: [0.9, -0.2]}],
	}),
	sc({
		at: '291',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1200, 600, 1.1], [1000, 600, 1.4]],
		actors: [{who: 'hero', x: 700, fc: 1, look: [0.9, -0.2], mo: [['smile', 0, 999]]}, {who: 'mom', x: 880, fc: 1}],
		ov: (c) => <Stat f={c.f} t0={c.at('292') - 10} t1={c.end('292') + 6} big="↔" label="the opposite of Earth" x={90} y={110} w={640} c="#9fd0ff" />,
	}),
	sc({
		at: '293',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1000, 590, 1.7], [1000, 590, 2.1]],
		follow: 2.0,
		actors: [{who: 'mom', x: 1000, fc: 1, g: [['presentF', '294', '295e']], mo: [['smile', 0, 999]], look: [0.8, -0.3]}, {who: 'hero', x: 780, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]})}],
		ov: () => cool,
	}),
	sc({
		at: '296',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[950, 600, 2.4], [920, 580, 3.0]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0.3, 0.5], mo: [['smile', 0, 999]]}],
		ov: (c) => cool,
	}),
	sc({
		at: '297',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[950, 600, 2.2], [940, 560, 1.5]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0.3, 0.5], ex: [['sad', 0, 999]]}],
		fx: (c) => <EarthDot x={900} y={380} r={0.01} o={0} />,
		ov: (c) => <Big f={c.f} t0={c.at('298') - 4} t1={c.end('298') + 6} text="NEVER" c="#9fd0ff" y={140} />,
	}),
	sc({
		at: '299',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1000, 590, 2.6], [960, 570, 3.2]],
		actors: [{who: 'hero', x: 920, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0.5, -0.8], mo: [['smile', 0, 999]]}],
		ov: () => cool,
	}),
	sc({
		at: '300',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1000, 600, 1.6], [1000, 560, 1.1]],
		actors: [{who: 'hero', x: 920, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0.5, -0.5], mo: [['smile', 0, 999]]}, {who: 'mom', x: 1100, fc: -1}],
		ov: (c) => <Big f={c.f} t0={c.at('301') + 2} t1={c.end('301') + 10} text="THIS IS HER HOME" c="#fff" y={140} />,
	}),
	sc({
		at: '302',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[900, 590, 1.7], [950, 590, 2.1]],
		follow: 1.9,
		actors: [{who: 'hero', x: 820, fc: 1, ex: [['worried', 0, 999]], g: [['presentF', 4, '302e']]}, {who: 'mom', x: 1020, fc: -1, sp: 'MOM'}],
	}),
	sc({
		at: '303',
		bg: <Surface mode="blue" sunX={1300} sunY={720} />,
		bgDepth: 1.25,
		cam: [[1000, 590, 1.9], [1000, 590, 2.3]],
		follow: 2.0,
		actors: [{who: 'mom', x: 1020, fc: -1, g: [['shrug', '303+6', '304e']], mo: [['smile', '305', 999]], sp: 'MOM'}, {who: 'hero', x: 820, fc: 1}],
	}),
	// 306-319 свет
	sc({
		at: '306',
		whip: true,
		bg: <Surface mode="blue" sunX={1300} sunY={740} />,
		bgDepth: 1.25,
		cam: [[900, 590, 1.6], [900, 590, 2.0]],
		actors: [{who: 'hero', x: 880, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0, -0.4]}, {who: 'mom', x: 1060, fc: -1, look: [-0.5, -0.3]}],
		fx: (c) => <SignalRings x={880} y={640} f={c.f} t0={c.at('306') + 20} t1={c.end('307')} c="#5cff9a" max={300} />,
		ov: (c) => <Callout_ c={c} />,
	}),
	sc({
		at: '308',
		bg: <Surface mode="blue" sunX={1300} sunY={740} />,
		bgDepth: 1.25,
		cam: [[900, 590, 1.9], [900, 590, 2.3]],
		follow: 2.0,
		actors: [{who: 'hero', x: 880, fc: 1, item: ITEM.radio, look: [0, -0.4], ex: [['wide', '309', 999]]}, {who: 'mom', x: 1060, fc: -1, sp: 'ANNA', look: [-0.5, -0.3], ex: [['wide', '309', 999]]}],
		shake: ['309+10', '309+30', 3],
	}),
	sc({
		at: '310',
		bg: <Surface mode="blue" sunX={1300} sunY={740} />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.4], [1300, 560, 1.4]],
		actors: [{who: 'hero', x: 860, fc: -1, turn: [['310+14', 1]], ex: [['wide', 0, 999]], look: [0.9, -0.3, '310+14']}, {who: 'mom', x: 1040, fc: -1, turn: [['310+20', 1]]}],
	}),
	sc({
		at: '311',
		whip: true,
		bg: (c) => <Surface mode="night" earth={0} />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.1], [1300, 480, 1.5]],
		actors: [{who: 'hero', x: 820, fc: 1, look: [0.9, -0.5], ex: [['wide', 0, 999]]}, {who: 'mom', x: 1000, fc: 1, look: [0.9, -0.5]}],
		fx: (c) => {
			const k = Math.max(0, Math.min(1, (c.f - c.at('312')) / 60));
			return <g opacity={k}><circle cx={1500} cy={560} r={46 * k + 6} fill="#ff8a3c" opacity={0.25} /><circle cx={1500} cy={560} r={9} fill="#ffb15a" /></g>;
		},
	}),
	sc({
		at: '313',
		bg: <Surface mode="night" />,
		bgDepth: 1.25,
		cam: [[1400, 560, 1.4], [1500, 540, 2.2]],
		fx: (c) => (
			<>
				<circle cx={1500} cy={560} r={60} fill="#ff8a3c" opacity={0.25} />
				<circle cx={1500} cy={560} r={12} fill="#ffb15a" />
				<g opacity={env(c.f, c.at('313') + 6, c.at('314') + 24, 8, 8)}>
					<EarthDot x={1200} y={430} r={9} />
					<line x1={1160} y1={400} x2={1240} y2={460} stroke="#ff4d5a" strokeWidth={6} />
					<line x1={1240} y1={400} x2={1160} y2={460} stroke="#ff4d5a" strokeWidth={6} />
				</g>
			</>
		),
		ov: (c) => <Stat f={c.f} t0={c.at('313') + 6} t1={c.end('314')} big="NOT EARTH" label="not blue-white" x={90} y={110} w={600} c="#ff6a5a" />,
	}),
	sc({
		at: '315',
		bg: <Surface mode="night" />,
		bgDepth: 1.25,
		cam: [[1400, 560, 1.2], [1500, 540, 1.9]],
		actors: [{who: 'hero', x: 820, fc: 1, look: [0.9, -0.5], ex: [['wide', 0, 999]]}],
		fx: (c) => {
			const k = interpolate(c.f, [0, c.end('315')], [1, 3.4], kl);
			return <g><circle cx={1500} cy={560} r={46 * k} fill="#ff8a3c" opacity={0.22} /><circle cx={1500} cy={560} r={11 * k} fill="#ffb15a" /></g>;
		},
	}),
	sc({
		at: '316',
		bg: <Surface mode="night" />,
		bgDepth: 1.25,
		cam: [[1300, 560, 1.4], [1450, 540, 1.8]],
		shake: [0, 9999, 3],
		actors: [{who: 'hero', x: 820, fc: 1, look: [0.9, -0.5], ex: [['wide', 0, 999]]}, {who: 'anna', x: 1020, fc: 1, sp: 'ANNA', look: [0.9, -0.5], g: [['point', 6, '317e']]}],
		fx: (c) => {
			const k = interpolate(c.f, [0, c.end('317')], [3, 7], kl);
			return <g><circle cx={1500} cy={560} r={30 * k} fill="#ff8a3c" opacity={0.25} /><circle cx={1500} cy={560} r={10 * k} fill="#ffb15a" /></g>;
		},
		ov: (c) => <Alert f={c.f} t0={c.at('317')} t1={c.end('317') + 12} text="STRAIGHT TOWARD US" />,
	}),
	sc({
		at: '318',
		bg: <Surface mode="night" />,
		bgDepth: 1.25,
		cam: [[1000, 600, 1.2], [1000, 580, 1.0]],
		actors: ['hero', 'mom', 'dad', 'hale', 'anna', 'husband', 'cook'].map((w, i) => ({who: w, x: 500 + i * 170, fc: 1 as const, look: [0.9, -0.5] as [number, number], ex: [['wide', 0, 999]] as any})),
		fx: () => <g><circle cx={1500} cy={560} r={240} fill="#ff8a3c" opacity={0.3} /><circle cx={1500} cy={560} r={70} fill="#ffb15a" /></g>,
	}),
	sc({
		at: '319',
		bg: <Surface mode="night" />,
		bgDepth: 1.25,
		cam: [[900, 640, 2.8], [900, 640, 3.6]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.baby, pose: (p) => ({...p, armF: [40, 100], armB: [24, 100]}), look: [0.9, -0.5], ex: [['wide', 0, 999]]}],
		fx: () => <circle cx={1500} cy={560} r={300} fill="#ff8a3c" opacity={0.22} />,
	}),
	// 320-324 финал
	sc({
		at: '320',
		whip: true,
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1000, 560, 1.7], [1000, 560, 2.1]],
		actors: [{who: 'hero', x: 1000, fc: 1, ex: [['worried', 0, 999]], mo: [['frown', 0, 999]], look: [0.5, -0.3]}],
		ov: (c) => <Big f={c.f} t0={c.at('320') + 6} t1={c.end('321') + 10} text="WHAT WOULD YOU DO?" c="#fff" y={130} />,
	}),
	sc({
		at: '322',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1000, 580, 1.5], [1000, 580, 1.2]],
		actors: [{who: 'hero', x: 1000, fc: 1, g: [['point', 6, '322e']], hop: [['322+30', '322+50', 40]], mo: [['smile', 0, 999]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('322') + 4} t1={c.end('322') + 6} big="COMMENTS" label="tell us below" x={90} y={110} w={640} c="#ffd34a" />,
	}),
	sc({
		at: '323',
		bg: <Room kind="obs" earth={0} />,
		bgDepth: 1.3,
		cam: [[1000, 580, 1.3], [1000, 570, 1.7]],
		actors: [{who: 'hero', x: 1000, fc: 1, g: [['point', 6, '323e'], ['wave', '324', '324e']], hop: [['324+10', '324+32', 50]], mo: [['smile', 0, 999]]}],
		ov: (c) => (
			<>
				<Names f={c.f} t0={c.at('323')} t1={c.end('323')} names={['Grandma Lila', 'Pepper', 'Daniel']} y={900} x0={300} x1={1600} />
				<LikeSub f={c.f} t0={c.at('324') - 8} t1={c.end('324') + 40} />
			</>
		),
	}),
];

const Callout_: React.FC<{c: any}> = ({c}) => <Stat f={c.f} t0={c.at('306') + 24} t1={c.end('307')} big="RADIO" label="crackles in your helmet" x={90} y={110} w={620} c="#5cff9a" />;
