import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {env} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {L} from '../kit/core';
import {sc, A} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface, SolarField} from './places';
import {Alert, Beam, Big, Fog, Globe, ITEM, Plant, Stat, Tears, Thermo, Timer} from './gfx';

const HEADY = 900 - 157 - 164;
const LIE = (p: any, k: number) => ({lean: p.lean + (88 - p.lean) * k, head: p.head * (1 - k), armB: [p.armB[0] + (150 - p.armB[0]) * k, 10], armF: [p.armF[0] + (140 - p.armF[0]) * k, 10], legB: [p.legB[0] + (-85 - p.legB[0]) * k, 0], legF: [p.legF[0] + (-80 - p.legF[0]) * k, 5]}) as any;
const glow = (x: number, y: number, r = 260) => <circle cx={x} cy={y} r={r} fill="#8aff9a" opacity={0.14} />;

export const P4: ShotDef[] = [
	sc({
		at: '153',
		whip: true,
		bg: <Room kind="greenhouse" state="seed" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.2], [1000, 620, 1.5]],
		actors: [
			{who: 'mom', x: 900, fc: 1, item: ITEM.potato, crouch: [[30, '153e']], g: [['presentF', 4, 28]]},
			{who: 'hero', x: 1200, fc: -1, item: ITEM.potato, g: [['presentF', 40, '153e']]},
		],
	}),
	sc({
		at: '154',
		bg: <Room kind="greenhouse" state="seed" />,
		bgDepth: 1.3,
		cam: [[1000, 700, 1.7], [900, 700, 1.9]],
		actors: [{who: 'mom', x: 1000, fc: 1, crouch: [[0, 9999]], item: ITEM.potato}],
		ov: (c) => <Stat f={c.f} t0={c.at('154') + 10} t1={c.end('155')} big="MARS SOIL" label="fake Martian dirt, tested on Earth" x={90} y={110} w={680} c="#ffb15a" />,
	}),
	sc({
		at: '156',
		bg: <Room kind="greenhouse" state="seed" />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.5], [1000, 600, 1.8]],
		actors: [{who: 'hero', x: 900, fc: 1, item: ITEM.mug, g: [['presentF', 10, '156e']]}, {who: 'mom', x: 1150, fc: -1, g: [['point', 20, '156e']]}],
		fx: (c) => <Callout f={c.f} t0={c.at('156') + 6} t1={c.end('156')} from={[1050, 820]} to={[1100, 380]} text="WASH OUT PERCHLORATES" align="center" c="#9fe0f0" />,
	}),
	sc({
		at: '157',
		bg: <Room kind="greenhouse" state="seed" />,
		bgDepth: 1.3,
		cam: [[1000, 620, 1.3], [1050, 620, 1.6]],
		actors: [
			{who: 'hero', x: 800, fc: 1, item: ITEM.potato, g: [['presentF', 10, 60], ['presentF', 80, 130]]},
			{who: 'mom', x: 1200, fc: -1, g: [['point', 20, '159e']]},
		],
		fx: (c) => <Callout f={c.f} t0={c.at('157') + 6} t1={c.end('159')} from={[1000, 820]} to={[1000, 480]} text="COMPOST: EVERY SCRAP OF LIFE" c="#9be564" />,
	}),
	sc({
		at: '160',
		whip: true,
		bg: (c) => <Room kind="greenhouse" state="green" grow={Math.min(1, (c.f + 10) / 80)} />,
		bgDepth: 1.3,
		cam: [[900, 640, 1.2], [1000, 700, 1.7]],
		badge: 0,
		actors: [{who: 'hero', x: 880, fc: 1, ex: [['wide', 20, 999]], hop: [['160+30', '160+56', 60]], g: [['presentF', 4, 30]]}, {who: 'mom', x: 1200, fc: -1, g: [['touchFace', 20, '160e']]}],
		ov: (c) => <Big f={c.f} t0={c.at('160') + 4} t1={c.at('160') + 56} text="SOL 40" c="#9be564" y={120} />,
	}),
	sc({
		at: '161',
		bg: <Room kind="greenhouse" state="green" />,
		bgDepth: 1.3,
		cam: [[1050, 600, 1.8], [1050, 590, 2.3]],
		badge: 0,
		actors: [{who: 'mom', x: 1050, fc: 1, item: ITEM.plant, ex: [['sad', 0, 999]], mo: [['smile', 0, 999]], g: [['presentF', 4, '163e']]}, {who: 'hero', x: 850, fc: 1}],
		fx: (c) => <Tears x={1050 + 22} y={560} f={c.f} />,
		ov: (c) => <Big f={c.f} t0={c.at('161') + 2} t1={c.at('161') + 46} text="SOL 60" c="#9be564" y={120} />,
	}),
	sc({
		at: '164',
		bg: <Room kind="greenhouse" state="green" />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.8], [1000, 590, 2.2]],
		follow: 2.0,
		actors: [{who: 'mom', x: 1050, fc: 1, item: ITEM.plant, mo: [['smile', 0, 999]], g: [['presentF', 4, '166e']]}, {who: 'hero', x: 800, fc: 1, look: [0.8, 0], ex: [['wide', 0, 999]]}],
		fx: () => glow(1100, 560),
	}),
	// 167-173 буря
	sc({
		at: '167',
		whip: true,
		bg: <Surface mode="day" />,
		bgDepth: 1.25,
		cam: [[900, 640, 1.2], [1250, 600, 1.7]],
		badge: 0,
		actors: [{who: 'hero', x: 700, fc: 1, look: [0.9, 0], ex: [['worried', '168', 999]]}],
		fx: (c) => <ellipse cx={1500} cy={756} rx={interpolate(c.f, [0, 260], [30, 700])} ry={interpolate(c.f, [0, 260], [14, 120])} fill="#4a2c1c" opacity={0.75} />,
		ov: (c) => <Big f={c.f} t0={c.at('167') + 4} t1={c.at('167') + 50} text="SOL 70" c="#fff" y={120} />,
	}),
	sc({
		at: '169',
		bg: (c) => <Surface mode={c.f > c.at('170') ? 'storm' : 'day'} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[1000, 640, 1.2], [900, 640, 1.2]],
		shake: ['170', 9999, 3],
		actors: [{who: 'hero', x: 600, fc: 1, ex: [['wide', 0, 999]], g: [['stop', 20, 70], ['handsOnHead', '170', '170e']]}],
		fx: (c) => {
			const k = Math.min(1, (c.f - 10) / 80);
			return <rect x={2100 - 2400 * k} y={-200} width={2800} height={1200} fill="#8a5a34" opacity={0.2 + 0.6 * k} />;
		},
	}),
	sc({
		at: '171',
		whip: true,
		bg: <Room kind="roof" ph={0.5} />,
		bgDepth: 1.8,
		cam: [[960, 500, 1.0], [960, 490, 1.1]],
		fx: (c) => <Globe x={960} y={470} r={270} f={c.f} t0={c.at('171')} t1={c.end('172')} />,
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('171') + 6} t1={c.end('171') + 6} big="BIGGEST" label="dust storms in the solar system" x={90} y={110} w={700} c="#ffb15a" />
				<Stat f={c.f} t0={c.at('172') + 4} t1={c.end('172') + 6} big="WHOLE PLANET" label="every few years" x={90} y={110} w={760} c="#ff6a5a" />
			</>
		),
	}),
	sc({
		at: '173',
		bg: <Room kind="roof" ph={0.5} />,
		bgDepth: 1.8,
		cam: [[960, 500, 1.1], [960, 480, 1.0]],
		fx: (c) => <Globe x={960} y={470} r={270} f={c.f + 300} t0={0} t1={1} />,
		ov: (c) => <Timer f={c.f} t0={c.at('173')} t1={c.end('173') + 6} from={0} to={12} unit="weeks" label="THEY CAN LAST FOR" x={110} y={110} c="#ffb15a" />,
	}),
	sc({
		at: '174',
		whip: true,
		bg: <Surface mode="storm" base={false} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[1000, 700, 1.3], [1200, 700, 1.5]],
		mid: () => <SolarField x={600} y={900} n={6} s={1.5} />,
		actors: [{who: 'eng1', x: 480, fc: 1, ex: [['worried', 0, 999]], g: [['scratch', 20, '174e']]}],
		ov: (c) => <Stat f={c.f} t0={c.at('174') + 20} t1={c.end('175')} big="25%" label="power left" x={90} y={110} w={520} c="#ff6a5a" />,
	}),
	sc({
		at: '176',
		bg: <Room kind="hall" dim={0.4} />,
		bgDepth: 1.3,
		cam: [[900, 580, 1.4], [900, 580, 1.7]],
		actors: [{who: 'hero', x: 900, fc: 1, ex: [['worried', 0, 999]], g: [['armsCrossed', 4, '176e']], pose: (p, c) => ({...p, lean: p.lean + Math.sin(c.f * 2.6) * 2.5})}],
		ov: (c) => <Thermo f={c.f} t0={c.at('176')} t1={c.end('176') + 10} x={1560} y={130} from={18} to={4} />,
	}),
	// 177-184 решение Хейл и ночь бури
	sc({
		at: '177',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1200, 580, 1.4], [1350, 570, 1.8]],
		actors: [{who: 'hale', x: 1400, fc: -1, ex: [['worried', 0, 999]], g: [['think', 4, '177e']]}, {who: 'hero', x: 800, fc: 1, look: [0.9, 0]}],
	}),
	sc({
		at: '178',
		bg: (c) => <Room kind="dining" dim={interpolate(c.f, [c.at('178') + 20, c.end('179')], [0.0, 0.62], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />,
		bgDepth: 1.3,
		cam: [[1300, 580, 1.3], [1200, 560, 1.2]],
		actors: [{who: 'hale', x: 1450, fc: -1, g: [['point', 4, '178e'], ['presentF', '179', '179e']]}],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('178') + 30} t1={c.at('179') + 14} from={[900, 300]} to={[700, 180]} text="LIGHTS" c="#ffd34a" />
				<Callout f={c.f} t0={c.at('179') + 6} t1={c.at('179') + 44} from={[1100, 300]} to={[1100, 160]} text="LABS" c="#6ad4ff" />
				<Callout f={c.f} t0={c.at('179') + 30} t1={c.end('179')} from={[1500, 300]} to={[1400, 190]} text="GREENHOUSE HEATERS" c="#9be564" />
			</>
		),
	}),
	sc({
		at: '180',
		bg: <Room kind="dining" dim={0.62} />,
		bgDepth: 1.3,
		cam: [[500, 700, 1.35], [1400, 700, 1.35]],
		actors: (['hero', 'mom', 'dad', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'kid1', 'eng1'] as string[]).map((w, i) => ({who: w, x: 200 + i * 170, fc: (i % 2 ? 1 : -1) as 1 | -1, s: 0.9, pose: (p: any) => LIE(p, 1), bobf: () => -150 + Math.sin(i) * 0, ex: [['sleepy', 0, 999]] as any})),
		fx: (c) => (
			<>
				{Array.from({length: 11}).map((_, i) => (
					<g key={i}>
						<rect x={110 + i * 170} y={780} width={200} height={70} rx={30} fill={['#c0392b', '#2f6fd8', '#8b6bd6', '#ffb15a'][i % 4]} opacity={0.95} />
						<Fog x={300 + i * 170} y={760} f={c.f + i * 9} />
					</g>
				))}
			</>
		),
	}),
	sc({
		at: '183',
		bg: <Room kind="dining" dim={0.62} />,
		bgDepth: 1.3,
		cam: [[1100, 560, 1.3], [1250, 560, 1.7]],
		shake: [0, 9999, 5],
		dust: '#f0c890',
		actors: [{who: 'hero', x: 1000, fc: 1, look: [0.9, -0.2], ex: [['worried', 0, 999]], g: [['handsOnHead', 30, '184e']]}, {who: 'mom', x: 1200, fc: -1, g: [['stop', 10, 60]]}],
		fx: (c) => <Callout f={c.f} t0={c.at('183') + 4} t1={c.end('184')} from={[1500, 460]} to={[1500, 300]} text="WHOOOOOO" c="#ff6a5a" />,
		ov: (c) => <Alert f={c.f} t0={c.at('184')} t1={c.end('184') + 6} text="" />,
	}),
	// 185-212 теплица замерзает
	sc({
		at: '185',
		whip: true,
		bg: <Room kind="greenhouse" state="frost" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.15], [1000, 600, 1.4]],
		badge: 0,
		actors: [{who: 'hero', x: 900, fc: 1, ex: [['worried', 0, 999]], g: [['armsCrossed', 10, '185e']]}],
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('185') + 6} t1={c.end('185')} big="31" label="nights into the storm" x={90} y={110} w={560} c="#6ad4ff" />
				<Thermo f={c.f} t0={c.at('185') + 20} t1={c.end('185') + 8} x={1560} y={130} from={12} to={-30} />
			</>
		),
	}),
	sc({
		at: '186',
		bg: <Room kind="greenhouse" state="frost" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.1], [1200, 600, 1.3]],
		actors: [
			{who: 'mom', x: 0, w: [[-250, 1150, 0, '186+40', 'run']], ex: [['wide', 0, 999]]},
			{who: 'hero', x: 0, w: [[-420, 880, 16, '187+20', 'run']], ex: [['worried', 0, 999]]},
		],
	}),
	sc({
		at: '188',
		bg: <Room kind="greenhouse" state="dead" />,
		bgDepth: 1.3,
		cam: [[1000, 760, 1.6], [1300, 760, 1.9]],
		actors: [{who: 'mom', x: 1150, fc: 1, ex: [['sad', 0, 999]], look: [0.6, 0.6]}, {who: 'hero', x: 900, fc: 1, ex: [['sad', 0, 999]]}],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('188')} t1={c.at('189') + 4} from={[1230, 790]} to={[1200, 560]} text="BLACK LEAVES" align="center" c="#ff6a5a" />
				<Callout f={c.f} t0={c.at('189') + 6} t1={c.end('190') - 20} from={[760, 800]} to={[760, 480]} text="SOIL LIKE STONE" align="center" c="#6ad4ff" />
			</>
		),
		ov: (c) => <Stat f={c.f} t0={c.at('190')} t1={c.end('190') + 6} big="1 MONTH" label="of work, ruined" x={90} y={110} w={640} c="#ff6a5a" />,
	}),
	sc({
		at: '191',
		bg: <Room kind="greenhouse" state="dead" />,
		bgDepth: 1.3,
		cam: [[1050, 700, 1.7], [1050, 740, 2.1]],
		actors: [{who: 'mom', x: 1050, fc: 1, ex: [['sad', 0, 999]], crouch: [[4, 9999]], item: ITEM.plant}],
		fx: (c) => {
			const t = c.at('193') + 10;
			return c.f > t ? (
				<g>
					{[0, 1, 2, 3].map((i) => <rect key={i} x={1130 + i * 14 + (c.f - t) * (i - 1.5) * 0.6} y={780 + Math.min(50, (c.f - t) * 2)} width={10} height={4} fill="#3fbf5a" transform={`rotate(${i * 30})`} />)}
				</g>
			) : null;
		},
		shake: ['193+10', '193+16', 4],
	}),
	sc({
		at: '194',
		bg: <Room kind="greenhouse" state="dead" />,
		bgDepth: 1.3,
		cam: [[980, 700, 1.8], [980, 690, 2.2]],
		actors: [{who: 'mom', x: 1100, fc: -1, crouch: [[0, 9999]], ex: [['sad', 0, 999]]}, {who: 'hero', x: 860, fc: 1, crouch: [[10, 9999]], ex: [['sad', 0, 999]], mo: [['frown', 0, 999]]}],
	}),
	sc({
		at: '196',
		bg: <Room kind="greenhouse" state="dead" />,
		bgDepth: 1.3,
		cam: [[1050, 590, 2.3], [1050, 600, 2.7]],
		actors: [{who: 'mom', x: 1100, fc: -1, ex: [['sad', 0, 999]], pose: (p) => ({...p, head: p.head + 10}), look: [-0.2, 0.5]}, {who: 'hero', x: 850, fc: 1, look: [0.9, 0]}],
		fx: (c) => (
			<>
				<Callout f={c.f} t0={c.at('196') + 4} t1={c.at('197') - 4} from={[1100, 700]} to={[1100, 380]} text="SO THIN" align="center" c="#ffb15a" />
				<Callout f={c.f} t0={c.at('197')} t1={c.at('198') - 2} from={[1100, 600]} to={[1100, 380]} text="SO TIRED" align="center" c="#ffb15a" />
				<Callout f={c.f} t0={c.at('198')} t1={c.end('198')} from={[1100, 500]} to={[1100, 380]} text="NO TALK ABOUT EARTH" align="center" c="#6ad4ff" />
			</>
		),
	}),
	sc({
		at: '199',
		bg: <Room kind="greenhouse" state="dead" dim={0.2} />,
		bgDepth: 1.3,
		cam: [[900, 580, 2.2], [900, 580, 2.6]],
		follow: 2.3,
		actors: [{who: 'hero', x: 880, fc: 1, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], look: [0.4, 0.5]}, {who: 'mom', x: 1060, fc: -1, ex: [['sad', 0, 999]]}],
		fx: (c) => <Tears x={880 + 20} y={570} f={c.f} />,
	}),
	sc({
		at: '200',
		bg: <Room kind="greenhouse" state="dead" dim={0.2} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.9], [1000, 600, 2.3]],
		follow: 2.2,
		actors: [
			{who: 'hero', x: 900, fc: 1, ex: [['sad', 0, 999]]},
			{who: 'mom', x: 1030, fc: -1, ex: [['sad', 0, 999]], pose: (p, c, x) => ({...p, armF: [-40 * env(c.f, 4, 9999, 12, 4) + p.armF[0], 30]})},
		],
	}),
	sc({
		at: '204',
		bg: <Room kind="greenhouse" state="dead" dim={0.5} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.5], [1000, 580, 1.0]],
		dust: '#bfe8ff',
		actors: [
			{who: 'hero', x: 900, fc: 1, ex: [['sad', 0, 999]], mo: [['frown', 0, 999]]},
			{who: 'mom', x: 1030, fc: -1, ex: [['sad', 0, 999]]},
		],
		fx: (c) => (
			<>
				<Tears x={920} y={570} f={c.f} />
				<Tears x={1010} y={570} f={c.f + 20} />
				<Fog x={925} y={620} f={c.f} />
				<Fog x={1005} y={620} f={c.f + 30} dir={-1} />
			</>
		),
	}),
	sc({
		at: '206',
		bg: <Room kind="greenhouse" state="dead" dim={0.55} />,
		bgDepth: 1.3,
		cam: [[1000, 600, 1.4], [1300, 560, 1.7]],
		actors: [
			{who: 'hero', x: 900, fc: 1, look: [0.9, 0], ex: [['wide', '207', 999]], turn: [['207+10', 1]]},
			{who: 'mom', x: 1030, fc: -1, ex: [['wide', '207', 999]], turn: [['207+16', 1]]},
		],
		ov: (c) => <Big f={c.f} t0={c.at('207') + 50} t1={c.end('207')} text="CRACK." c="#ffd34a" y={150} />,
		shake: ['207+50', '207+60', 5],
	}),
	sc({
		at: '208',
		bg: <Room kind="greenhouse" state="dead" dim={0.78} />,
		bgDepth: 1.3,
		cam: [[1100, 620, 1.3], [1500, 700, 1.6]],
		actors: [{who: 'hero', x: 1050, fc: 1, item: ITEM.flashlight, g: [['presentF', 4, '208e']], look: [0.9, 0.3]}],
		fx: (c) => <Beam x={1130} y={640} ang={14} len={900} o={0.6} />,
	}),
	sc({
		at: '209',
		bg: <Room kind="greenhouse" state="dead" dim={0.8} />,
		bgDepth: 1.3,
		cam: [[1500, 720, 1.2], [1700, 760, 2.0]],
		mid: () => <rect x={1560} y={760} width={150} height={140} rx={8} fill="#6a4a30" />,
		actors: [{who: 'hero', x: 1100, fc: 1, item: ITEM.flashlight, pose: (p) => ({...p, armF: [76, 4]})}],
		fx: (c) => (
			<>
				<Beam x={1180} y={640} ang={12} len={800} o={0.5} />
				<rect x={1420} y={800} width={190} height={20} fill="#5a3a2a" />
			</>
		),
	}),
	sc({
		at: '210',
		bg: <Room kind="greenhouse" state="dead" dim={0.8} />,
		bgDepth: 1.3,
		cam: [[1500, 760, 2.2], [1520, 740, 2.8]],
		fx: (c) => (
			<>
				{glow(1500, 780, 200)}
				<Plant x={1500} y={900} k={Math.min(1, 0.3 + c.f / 40)} s={1.1} />
				<Beam x={1100} y={680} ang={8} len={800} o={0.5} />
			</>
		),
		actors: [{who: 'hero', x: 1100, fc: 1, item: ITEM.flashlight, pose: (p) => ({...p, armF: [80, 4]}), ex: [['wide', 0, 999]]}],
	}),
	sc({
		at: '211',
		bg: <Room kind="greenhouse" state="dead" dim={0.7} />,
		bgDepth: 1.3,
		cam: [[1250, 640, 1.5], [1350, 640, 1.9]],
		actors: [{who: 'mom', x: 1300, fc: 1, ex: [['wide', 0, 999]], look: [0.8, 0.3]}, {who: 'hero', x: 1100, fc: 1, item: ITEM.flashlight, pose: (p) => ({...p, armF: [80, 4]})}],
		fx: (c) => (
			<>
				{glow(1560, 780, 200)}
				<Plant x={1560} y={900} k={1} s={1.0} />
			</>
		),
		ov: (c) => <Stat f={c.f} t0={c.at('211') + 4} t1={c.end('211') + 6} big="1 / 300" label="plants survived" x={90} y={110} w={560} c="#9be564" />,
	}),
	sc({
		at: '212',
		bg: <Room kind="greenhouse" state="dead" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[1250, 620, 1.3], [1250, 600, 1.6]],
		actors: [
			{who: 'mom', x: 1250, fc: 1, mo: [['open', 0, 999]], hop: [['212+10', '212+30', 40], ['212+40', '212+60', 40], ['212+70', '212+90', 40]], pose: (p, c) => ({...p, lean: p.lean - 6 + Math.sin(c.f * 0.9) * 6})},
			{who: 'hero', x: 1050, fc: 1, mo: [['smile', 0, 999]], hop: [['212+30', '212+50', 36]]},
		],
		fx: () => <Plant x={1560} y={900} k={1} s={1.0} />,
	}),
];
