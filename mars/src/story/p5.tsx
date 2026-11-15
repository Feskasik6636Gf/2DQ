import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {env} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {CrowdRow} from '../kit/kit';
import {Chair} from '../engine/props';
import {sc} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface} from './places';
import {Barbell, Big, Cup, Fog, ITEM, Lamp, Names, Plant, Sparks, Stat, Tears, Timer} from './gfx';

const HEADY = 900 - 157 - 164;
const warm = <AbsoluteFill style={{background: 'rgba(255,170,90,.2)', mixBlendMode: 'soft-light'}} />;
const kl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const crowd = (dim = 0) => () => (
	<>
		<CrowdRow n={10} x0={-200} x1={1100} floor={885} s={0.74} mode="stand" seed="d1" />
		<CrowdRow n={7} x0={900} x1={2200} floor={885} s={0.74} mode="stand" seed="d2" />
	</>
);
const dc = crowd();

export const P5: ShotDef[] = [
	sc({
		at: '213',
		whip: true,
		bg: (c) => <Surface mode="dawn" sunY={interpolate(c.f, [0, 200], [800, 690], kl)} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[900, 640, 1.2], [1000, 620, 1.5]],
		badge: 0,
		actors: [{who: 'hero', x: 800, fc: 1, look: [0.9, -0.2], ex: [['wide', 20, 999]]}, {who: 'mom', x: 1000, fc: 1}],
		ov: (c) => <Big f={c.f} t0={c.at('213') + 4} t1={c.at('213') + 56} text="SOL 109" c="#fff" y={120} />,
	}),
	sc({
		at: '214',
		bg: (c) => <Surface mode="dawn" sunY={interpolate(c.f, [0, 230], [740, 600], kl)} sunX={1250} />,
		bgDepth: 1.25,
		cam: [[1000, 640, 1.1], [1250, 560, 1.5]],
		actors: [{who: 'hero', x: 700, fc: 1, look: [0.9, -0.2]}, {who: 'mom', x: 880, fc: 1}, {who: 'dad', x: 1040, fc: 1}, {who: 'hale', x: 560, fc: 1}],
		ov: () => warm,
	}),
	sc({
		at: '216',
		bg: <Surface mode="dawn" sunY={600} sunX={1250} />,
		bgDepth: 1.25,
		cam: [[1000, 600, 1.3], [1100, 580, 1.8]],
		actors: [{who: 'hero', x: 800, fc: 1, mo: [['smile', 0, 999]], look: [0.9, -0.1]}, {who: 'mom', x: 960, fc: 1, mo: [['smile', 0, 999]]}],
		ov: () => warm,
	}),
	sc({
		at: '217',
		bg: <Surface mode="dawn" sunY={590} sunX={1250} />,
		bgDepth: 1.25,
		cam: [[900, 620, 1.9], [1000, 600, 1.0]],
		actors: ['hero', 'mom', 'dad', 'hale', 'eng1', 'doc'].map((w, i) => ({who: w, x: 500 + i * 190, fc: 1 as const, look: [0.9, -0.2] as [number, number], mo: [['smile', 0, 999]] as any})),
		ov: () => warm,
	}),
	sc({
		at: '218',
		whip: true,
		bg: <Room kind="roof" ph={0.7} />,
		bgDepth: 1.4,
		cam: [[1000, 600, 1.2], [1250, 540, 1.5]],
		actors: [{who: 'anna', x: 0, w: [[-250, 1100, 0, '218+80']], fc: 1}],
		mid: () => (
			<g>
				<path d="M1230,900 L1300,700 L1370,900" fill="none" stroke="#6a738c" strokeWidth={10} />
				<g transform="rotate(-28 1300 700)">
					<rect x={1180} y={668} width={420} height={64} rx={14} fill="#d8deea" />
					<rect x={1560} y={660} width={50} height={80} rx={10} fill="#2a2f44" />
				</g>
			</g>
		),
	}),
	sc({
		at: '219',
		bg: <Room kind="roof" ph={0.75} />,
		bgDepth: 1.4,
		cam: [[1200, 600, 1.6], [1250, 580, 1.9]],
		actors: [{who: 'anna', x: 1120, fc: 1, pose: (p, c) => ({...p, lean: p.lean + 18, head: p.head + 8, armF: [70, 8]}), look: [0.9, -0.2]}],
		mid: () => (
			<g>
				<path d="M1230,900 L1300,700 L1370,900" fill="none" stroke="#6a738c" strokeWidth={10} />
				<g transform="rotate(-28 1300 700)">
					<rect x={1180} y={668} width={420} height={64} rx={14} fill="#d8deea" />
					<rect x={1560} y={660} width={50} height={80} rx={10} fill="#2a2f44" />
				</g>
			</g>
		),
		ov: (c) => <Timer f={c.f} t0={c.at('219') + 4} t1={c.end('219') + 6} from={0} to={3} unit="h" label="AND SHE STAYS" x={110} y={110} c="#2fb59f" />,
	}),
	// 220-249 ночь имён
	sc({
		at: '220',
		whip: true,
		bg: <Room kind="dining" dim={0.25} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.15], [1100, 580, 1.3]],
		mid: dc,
		actors: [
			{who: 'hale', x: 1450, fc: -1, g: [['stop', 20, 80]]},
			{who: 'hero', x: 0, w: [[-250, 720, 0, 60]], fc: 1},
			{who: 'mom', x: 0, w: [[-400, 880, 6, 70]], fc: 1},
			{who: 'dad', x: 0, w: [[2300, 1100, 4, 70]], fc: -1},
		],
	}),
	sc({
		at: '221',
		bg: <Room kind="dining" dim={0.25} />,
		bgDepth: 1.3,
		cam: [[1400, 590, 1.9], [1400, 580, 2.2]],
		follow: 2.0,
		mid: dc,
		actors: [{who: 'hale', x: 1450, fc: -1, g: [['presentF', '221+6', '222e']]}],
	}),
	sc({
		at: '223',
		bg: <Room kind="dining" dim={0.3} />,
		bgDepth: 1.3,
		cam: [[1400, 590, 2.1], [1400, 580, 2.5]],
		follow: 2.3,
		actors: [{who: 'hale', x: 1450, fc: -1, ex: [['sad', 0, 999]], g: [['fist', 4, '223e']]}],
	}),
	sc({
		at: '224',
		bg: <Room kind="dining" dim={0.4} />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.05], [1000, 560, 1.35]],
		mid: dc,
		actors: [{who: 'hale', x: 1000, fc: 1, g: [['presentF', 10, 70]]}, {who: 'hero', x: 700, fc: 1}],
		fx: (c) => <Lamp x={1240} y={700} on={0.8} />,
	}),
	sc({
		at: '226',
		bg: <Room kind="dining" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[960, 560, 1.4], [960, 560, 1.15]],
		mid: dc,
		actors: [{who: 'hero', x: 800, fc: 1, look: [0.8, -0.2]}, {who: 'mom', x: 960, fc: 1}, {who: 'hale', x: 1120, fc: -1}],
		ov: (c) => <Big f={c.f} t0={c.at('226') + 6} t1={c.end('226')} text="THE NIGHT OF NAMES" c="#ffe9a8" y={150} />,
		fx: (c) => <Lamp x={1240} y={700} on={1} />,
	}),
	sc({
		at: '227',
		bg: <Room kind="dining" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[800, 600, 1.1], [1200, 600, 1.1]],
		mid: dc,
		actors: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((w, i) => ({who: w, x: 300 + i * 270, fc: 1 as const, sit: [[0, 12 + i * 22]] as [number, number][], g: [['presentF', 20 + i * 22, 60 + i * 22]] as any})),
		ov: (c) => <Names f={c.f} t0={c.at('227')} t1={c.end('228')} names={['Mama', 'Sofia', 'Kenji', 'Papa', 'Elena', 'Marcus']} y={860} />,
	}),
	sc({
		at: '229',
		bg: <Room kind="dining" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.2], [1000, 560, 1.0]],
		mid: dc,
		actors: [{who: 'singh', x: 1000, fc: 1, g: [['presentF', 4, '230e']]}],
		ov: (c) => <Names f={c.f} t0={c.at('229')} t1={c.end('230')} names={['Parents', 'Husband', 'Wife', 'Children', 'Best friend', 'Our dog', 'A teacher']} y={900} x0={200} x1={1700} />,
	}),
	sc({
		at: '231',
		bg: <Room kind="dining" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.3], [1000, 600, 1.5]],
		mid: dc,
		actors: [{who: 'x2', x: 780, fc: 1, g: [['presentF', 8, '231e']]}, {who: 'x5', x: 1180, fc: -1, g: [['presentF', 10, '232e']]}],
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('231') + 4} t1={c.end('231') + 6} big="1" label="some say only one" x={90} y={110} w={520} c="#ffe9a8" />
				<Stat f={c.f} t0={c.at('232') + 2} t1={c.end('232') + 6} big="50" label="some say fifty" x={90} y={110} w={520} c="#ffb15a" />
			</>
		),
	}),
	sc({
		at: '233',
		bg: <Room kind="dining" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 590, 1.7], [1000, 580, 2.1]],
		mid: dc,
		actors: [{who: 'singh', x: 1000, fc: 1, ex: [['sad', 0, 999]], g: [['presentF', '233+30', '236e']], look: [0.8, -0.2]}],
		fx: (c) => <Callout f={c.f} t0={c.at('233') + 6} t1={c.at('234') - 4} from={[1000, HEADY]} to={[1300, 300]} text="DR. SINGH" c="#ffe9a8" />,
		ov: (c) => <Names f={c.f} t0={c.at('234')} t1={c.end('235')} names={['Aarav', 'Meera', 'Old Ramesh', 'Lakshmi', 'Dev', 'Sita', 'Kiran']} y={900} x0={300} x1={1600} />,
	}),
	sc({
		at: '236',
		bg: <Room kind="dining" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.4], [1000, 560, 1.0]],
		mid: dc,
		actors: [{who: 'singh', x: 1000, fc: 1, ex: [['sad', 0, 999]], g: [['presentF', 0, '236e']]}],
		ov: (c) => <Timer f={c.f} t0={c.at('236') + 2} t1={c.end('236') + 6} from={0} to={8} unit="h" label="IT LASTS" x={110} y={110} c="#ffe9a8" />,
	}),
	sc({
		at: '237',
		bg: <Room kind="dining" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 590, 1.9], [1000, 580, 2.3]],
		follow: 2.2,
		mid: dc,
		badge: 0,
		actors: [{who: 'hero', x: 1000, fc: 1, sit: [[0, 40]], ex: [['sad', 0, 999]], mo: [['frown', 0, 999]]}],
		fx: (c) => <Chair x={1000} y={800} facing={1} />,
	}),
	sc({
		at: '238',
		bg: <Room kind="dining" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 590, 2.1], [1000, 580, 2.5]],
		follow: 2.3,
		actors: [{who: 'hero', x: 1000, fc: 1, ex: [['sad', 0, 999]], g: [['presentF', 10, '239e']]}],
		ov: (c) => <Names f={c.f} t0={c.at('238')} t1={c.end('239')} names={['Grandma Lila', 'Aunt May', 'Daniel', 'Mr. Carver']} y={900} x0={400} x1={1500} />,
	}),
	sc({
		at: '240',
		bg: <Room kind="dining" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 590, 1.9], [1000, 580, 2.3]],
		follow: 2.2,
		actors: [{who: 'hero', x: 1000, fc: 1, ex: [['sad', 0, 999]], mo: [['smile', '241', 999]]}],
		ov: (c) => <Names f={c.f} t0={c.at('240')} t1={c.end('241')} names={['Pepper']} y={900} x0={900} x1={1100} />,
	}),
	sc({
		at: '242',
		bg: <Room kind="dining" dim={0.45} />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.2], [1000, 580, 1.5]],
		mid: dc,
		actors: [
			{who: 'hero', x: 800, fc: 1, mo: [['smile', 0, 999]], hop: [['242+10', '242+30', 30]]},
			{who: 'mom', x: 960, fc: 1, mo: [['smile', 0, 999]], g: [['touchFace', '243', '243e']]},
			{who: 'dad', x: 1120, fc: -1, mo: [['smile', 0, 999]]},
		],
		fx: (c) => <Tears x={980} y={570} f={c.f} />,
	}),
	sc({
		at: '244',
		bg: <Room kind="dining" dim={0.6} />,
		bgDepth: 1.3,
		cam: [[960, 590, 1.5], [960, 540, 0.95]],
		dust: '#ffe9a8',
		mid: dc,
		actors: [{who: 'hero', x: 800, fc: 1, ex: [['sad', 0, 999]]}, {who: 'mom', x: 960, fc: 1}, {who: 'hale', x: 1120, fc: -1}],
	}),
	sc({
		at: '245',
		bg: (c) => <Room kind="dining" dim={interpolate(c.f, [0, 60], [0.7, 0.45], kl)} />,
		bgDepth: 1.3,
		cam: [[1100, 600, 1.4], [1200, 650, 2.0]],
		actors: [{who: 'hale', x: 1000, fc: 1, item: ITEM.lamp, g: [['presentF', 6, '245e']]}],
		fx: (c) => <Lamp x={1320} y={720} on={interpolate(c.f, [c.at('245') + 30, c.end('245')], [0, 1], kl)} />,
	}),
	sc({
		at: '246',
		bg: <Room kind="dining" dim={0.45} />,
		bgDepth: 1.3,
		cam: [[1050, 590, 1.9], [1050, 580, 2.3]],
		follow: 2.1,
		actors: [{who: 'hale', x: 1050, fc: 1, ex: [['sad', 0, 999]], mo: [['smile', '247', 999]], g: [['presentF', 8, '247e']]}],
		fx: (c) => <Lamp x={1320} y={720} on={1} />,
	}),
	sc({
		at: '248',
		bg: <Room kind="dining" dim={0.45} />,
		bgDepth: 1.3,
		cam: [[950, 590, 2.0], [950, 590, 2.5]],
		actors: [{who: 'hero', x: 950, fc: 1, mo: [['smile', 20, 999]], look: [0.8, 0.2]}],
		fx: (c) => <Lamp x={1180} y={720} on={1} />,
		ov: () => warm,
	}),
	// 250-265 станция меняется
	sc({
		at: '250',
		whip: true,
		bg: <Room kind="hall" />,
		bgDepth: 1.3,
		cam: [[900, 580, 1.1], [1000, 580, 1.3]],
		actors: [
			{who: 'hero', x: 0, w: [[-250, 800, 0, 50]], fc: 1, mo: [['smile', 60, 999]]},
			{who: 'mom', x: 0, w: [[2200, 1100, 8, 60]], fc: -1, g: [['wave', 70, '251e']]},
		],
	}),
	sc({
		at: '252',
		bg: <Room kind="lab" />,
		bgDepth: 1.3,
		cam: [[900, 580, 1.2], [1100, 560, 1.5]],
		actors: [{who: 'hale', x: 800, fc: 1, item: ITEM.marker, g: [['point', 6, '252e']]}, {who: 'dad', x: 1100, fc: -1, g: [['think', 20, '252e']]}, {who: 'eng1', x: 1400, fc: -1}],
		ov: (c) => <Stat f={c.f} t0={c.at('252')} t1={c.end('252') + 6} big="PLAN" label="people start planning" x={90} y={110} w={540} c="#6ad4ff" />,
	}),
	sc({
		at: '253',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.2], [1100, 600, 1.5]],
		actors: [
			{who: 'eng1', x: 900, fc: 1, item: ITEM.wrench, g: [['fist', 4, '254e']]},
			{who: 'eng2', x: 1200, fc: -1, item: ITEM.wrench, g: [['fist', 20, '254e']]},
		],
		fx: (c) => (
			<>
				<Sparks x={1050} y={700} f={c.f} />
				<Callout f={c.f} t0={c.at('254')} t1={c.end('254')} from={[1050, 640]} to={[1050, 330]} text="ROCK BLOCKS RADIATION" align="center" c="#ffb15a" />
			</>
		),
	}),
	sc({
		at: '255',
		whip: true,
		bg: <Room kind="greenhouse" state="green" grow={1.1} />,
		bgDepth: 1.3,
		cam: [[400, 640, 1.1], [1500, 640, 1.1]],
		actors: [{who: 'mom', x: 0, w: [[300, 1500, 0, '255e']], fc: 1, g: [['presentF', 20, '255e']]}],
		ov: (c) => <Stat f={c.f} t0={c.at('255')} t1={c.end('255') + 6} big="BIGGER" label="greenhouses" x={90} y={110} w={560} c="#9be564" />,
	}),
	sc({
		at: '256',
		bg: <Room kind="greenhouse" state="green" grow={1.2} />,
		bgDepth: 1.3,
		cam: [[900, 640, 1.2], [1100, 620, 1.5]],
		actors: [{who: 'mom', x: 900, fc: 1, item: ITEM.plant, g: [['presentF', 4, '257e']]}, {who: 'hero', x: 1200, fc: -1, item: ITEM.plant}],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('256')} t1={c.at('257') - 4} from={[900, 800]} to={[560, 360]} text="MELT ICE FASTER" c="#6ad4ff" />
				<Callout f={c.f} t0={c.at('257')} t1={c.at('257') + 36} from={[1000, 800]} to={[900, 340]} text="BEANS" c="#9be564" />
				<Callout f={c.f} t0={c.at('257') + 30} t1={c.at('257') + 66} from={[1200, 800]} to={[1300, 340]} text="WHEAT" c="#ffd34a" />
				<Callout f={c.f} t0={c.at('257') + 60} t1={c.at('257') + 96} from={[1400, 800]} to={[1500, 420]} text="LETTUCE" c="#9be564" />
				<Callout f={c.f} t0={c.at('257') + 90} t1={c.end('257')} from={[700, 800]} to={[600, 460]} text="STRAWBERRIES" c="#ff6a8a" />
			</>
		),
	}),
	sc({
		at: '258',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.3], [800, 600, 1.2]],
		actors: [
			{who: 'cook', x: 1500, fc: -1, item: ITEM.potato, g: [['presentF', 10, '259e']], mo: [['smile', 0, 999]]},
			...['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((w, i) => ({who: w, x: 0, fc: 1 as const, w: [[-250 - i * 120, 1000 - i * 90, i * 8, 50 + i * 8]] as any})),
		],
		fx: (c) => <Callout f={c.f} t0={c.at('258') + 20} t1={c.end('259')} from={[1500, HEADY]} to={[1300, 300]} text="POTATO BREAD" align="center" c="#ffd34a" />,
	}),
	sc({
		at: '260',
		bg: <Room kind="lab" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.3], [1000, 600, 1.6]],
		actors: [{who: 'dad', x: 900, fc: 1, item: ITEM.wrench, g: [['fist', 4, '260e']], mo: [['smile', 0, 999]]}],
		fx: (c) => (
			<>
				<rect x={1060} y={720} width={300} height={180} rx={14} fill="#6a738c" />
				<rect x={1080} y={740} width={90} height={30} rx={6} fill="#5cff9a" opacity={0.7} />
				<Sparks x={1040} y={760} f={c.f} />
				<Callout f={c.f} t0={c.at('260') + 10} t1={c.end('260')} from={[1200, 730]} to={[1100, 440]} text="GENERATOR FROM ROVER PARTS" align="center" c="#ffb15a" />
			</>
		),
	}),
	sc({
		at: '261',
		whip: true,
		bg: <Room kind="roof" ph={0.4} />,
		bgDepth: 1.4,
		cam: [[1100, 600, 1.3], [1250, 540, 1.6]],
		actors: [{who: 'anna', x: 1100, fc: 1, item: ITEM.marker, look: [0.8, -0.8], pose: (p) => ({...p, lean: p.lean + 8, head: p.head - 10}), g: [['think', 4, '262e']]}],
		fx: (c) => <Callout f={c.f} t0={c.at('262')} t1={c.end('262')} from={[1100, HEADY - 20]} to={[1200, 260]} text="LOOKING FOR HOME" align="center" c="#6ad4ff" />,
	}),
	sc({
		at: '263',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.5], [960, 560, 0.95]],
		mid: dc,
		actors: ['hero', 'mom', 'dad', 'hale', 'anna', 'cook', 'eng1', 'singh'].map((w, i) => ({who: w, x: 300 + i * 190, fc: (i < 4 ? 1 : -1) as 1 | -1, g: [['wave', 20 + i * 8, 120]] as any, mo: [['smile', 0, 999]] as any})),
		ov: (c) => <Big f={c.f} t0={c.at('265') - 6} t1={c.end('265') + 10} text="A TOWN" c="#ffe9a8" y={150} />,
	}),
	// 266-278 рождение
	sc({
		at: '266',
		whip: true,
		bg: <Room kind="med" />,
		bgDepth: 1.3,
		cam: [[1200, 600, 1.2], [1250, 580, 1.4]],
		actors: [{who: 'anna', x: 1300, fc: -1, mo: [['smile', 0, 999]], item: ITEM.baby, g: [['presentF', 20, '266e']]}, {who: 'husband', x: 1480, fc: -1}],
		ov: (c) => <Big f={c.f} t0={c.at('266') + 4} t1={c.at('266') + 56} text="SOL 500" c="#fff" y={110} />,
	}),
	sc({
		at: '267',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[1300, 620, 1.7], [1300, 600, 2.1]],
		actors: [{who: 'anna', x: 1300, fc: -1, mo: [['smile', 0, 999]], item: ITEM.baby, g: [['presentF', 0, '268e']]}],
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('267') + 4} t1={c.end('267') + 6} big="FIRST" label="human born on Mars" x={90} y={110} w={620} c="#ffd1dc" />
				<Stat f={c.f} t0={c.at('268') + 4} t1={c.end('268') + 6} big="6 lb" label="a full head of dark hair" x={90} y={110} w={620} c="#ffd1dc" />
			</>
		),
	}),
	sc({
		at: '269',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[500, 600, 1.2], [900, 600, 1.4]],
		actors: ['hero', 'mom', 'dad', 'cook', 'doc', 'kid1'].map((w, i) => ({who: w, x: 200 + i * 130, s: i === 5 ? 0.78 : 1, fc: 1 as const, hop: [[10 + i * 6, 30 + i * 6, 40]] as any, look: [0.9, 0] as [number, number], mo: [['smile', 0, 999]] as any})),
		fx: (c) => <Callout f={c.f} t0={c.at('270')} t1={c.end('270')} from={[600, 400]} to={[900, 240]} text="WHISPERING" c="#9fe0f0" />,
	}),
	sc({
		at: '271',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[1300, 620, 1.4], [1300, 560, 1.6]],
		actors: [{who: 'husband', x: 1300, fc: -1, item: ITEM.baby, g: [['presentF', '271+10', '272e']], pose: (p) => ({...p, armF: [150, 20]}), mo: [['smile', 0, 999]]}, {who: 'anna', x: 1520, fc: -1, mo: [['smile', 0, 999]]}],
	}),
	sc({
		at: '273',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[1100, 600, 1.7], [1100, 600, 2.0]],
		follow: 1.9,
		actors: [{who: 'hale', x: 1000, fc: 1, g: [['presentF', 4, '274e']]}, {who: 'anna', x: 1300, fc: -1, sp: 'ANNA', mo: [['smile', '275', 999]]}],
	}),
	sc({
		at: '276',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[1250, 600, 2.0], [1250, 600, 2.4]],
		follow: 2.2,
		actors: [{who: 'anna', x: 1300, fc: -1, item: ITEM.baby, mo: [['smile', 0, 999]]}, {who: 'hale', x: 1000, fc: 1, mo: [['smile', 0, 999]]}],
		ov: (c) => <Big f={c.f} t0={c.at('276') + 20} t1={c.end('276')} text="TARA = EARTH" c="#ffd1dc" y={160} />,
	}),
	sc({
		at: '277',
		bg: <Room kind="med" crib />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.2], [1000, 580, 1.5]],
		actors: ['hero', 'mom', 'dad', 'hale', 'anna', 'husband'].map((w, i) => ({who: w, x: 400 + i * 230, fc: 1 as const, hop: [[6 + i * 5, 30 + i * 5, 50], [60 + i * 4, 84 + i * 4, 50]] as any, mo: [['open', 0, 999]] as any})),
		fx: (c) => (
			<>
				<Tears x={640} y={570} f={c.f} />
				<Tears x={870} y={570} f={c.f + 12} />
				<Tears x={1100} y={570} f={c.f + 20} />
			</>
		),
	}),
];
