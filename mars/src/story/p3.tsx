import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {env, run} from '../kit/actions';
import {Callout} from '../kit/graphics';
import {Chair} from '../engine/props';
import {L} from '../kit/core';
import {sc} from './dsl';
import type {ShotDef} from '../kit/coverage';
import {Room, Surface} from './places';
import {Alert, Ball, Barbell, Big, Bubbles, Calendar, Cup, ITEM, Rover, Ship, Sparks, Stat, Timer, Treadmill} from './gfx';

const HEADY = 900 - 157 - 164;
const warm = <AbsoluteFill style={{background: 'rgba(255,190,110,.16)', mixBlendMode: 'soft-light'}} />;
const P0 = () => L('111').from;
const P1 = () => L('124').from + L('124').dur;
const phr = (gf: number) => Math.max(0, Math.min(1, 0.04 + (0.9 * (gf - P0())) / (P1() - P0())));
const phx = (gf: number) => -200 + phr(gf) * 2400;
const phy = (gf: number) => 180 + 70 * Math.sin(phr(gf) * 3);
const bench = (
	<g>
		<rect x={640} y={782} width={760} height={22} rx={6} fill="#6a738c" />
		<rect x={680} y={804} width={14} height={100} fill="#4a5578" />
		<rect x={1350} y={804} width={14} height={100} fill="#4a5578" />
	</g>
);
const table = () => (
	<g>
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<g key={i}>
				<ellipse cx={640 + i * 150} cy={712} rx={36} ry={8} fill="#f4f4f0" />
				<Chair x={700 + i * 150} y={790} facing={1} seat="#6a738c" />
			</g>
		))}
	</g>
);
const seat = [{who: 'hero', x: 700}, {who: 'mom', x: 850}, {who: 'dad', x: 1000}, {who: 'eng1', x: 1150}, {who: 'eng2', x: 1300}, {who: 'hale', x: 1450}, {who: 'anna', x: 1600}];

export const P3: ShotDef[] = [
	sc({
		at: '092',
		whip: true,
		bg: <Surface mode="dawn" />,
		bgDepth: 1.25,
		cam: [[900, 640, 1.2], [1200, 620, 1.5]],
		actors: [
			{who: 'eng1', x: 0, w: [[-200, 1050, 0, 60]], fc: 1},
			{who: 'eng2', x: 0, w: [[-380, 880, 8, 70]], fc: 1},
		],
		fx: (c) => <Rover x={1500} y={880} s={1.4} dir={-1} t={0} dust={false} />,
		ov: (c) => <Big f={c.f} t0={c.at('092') + 4} t1={c.at('092') + 50} text="SOL 9" c="#fff" y={120} />,
	}),
	sc({
		at: '093',
		whip: true,
		bg: <Room kind="hall" />,
		bgDepth: 1.3,
		cam: [[800, 570, 1.3], [900, 560, 1.6]],
		actors: [
			{who: 'eng1', x: 700, fc: 1, g: [['wave', '094+4', '094e']], ex: [['sleepy', 0, 999]]},
			{who: 'eng2', x: 900, fc: 1, g: [['shrug', '094+30', '094e']]},
			{who: 'hale', x: 1400, fc: -1, look: [-0.8, 0]},
		],
		fx: (c) => <Callout f={c.f} t0={c.at('094') + 6} t1={c.end('094')} from={[700, HEADY]} to={[1000, 260]} text="“CHECK THE LAUNCH PAD”" c="#ffb15a" />,
	}),
	sc({
		at: '095',
		whip: true,
		bg: <Surface mode="day" base={false} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[500, 700, 1.3], [1300, 700, 1.3]],
		fx: (c) => <Rover x={200 + (c.f - c.at('095')) * 6} y={880} s={1.5} t={c.f} />,
	}),
	sc({
		at: '096',
		bg: <Surface mode="day" base={false} />,
		bgDepth: 1.25,
		dust: '#f0c890',
		cam: [[900, 700, 1.2], [1500, 700, 1.1]],
		fx: (c) => (
			<>
				<Ship x={1750} y={870} s={0.9} />
				<Rover x={300 + (c.f - c.at('096')) * 5.4} y={880} s={1.4} t={c.f} />
			</>
		),
	}),
	sc({
		at: '097',
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		cam: [[1300, 600, 1.0], [1500, 560, 1.7]],
		mid: () => <Ship x={1500} y={880} s={1.2} />,
		fx: (c) => <Rover x={500 + (c.f - c.at('097')) * 5} y={880} s={1.2} t={c.f} />,
	}),
	sc({
		at: '099',
		whip: true,
		bg: <Room kind="comms" screen="static" />,
		bgDepth: 1.3,
		cam: [[800, 570, 1.5], [860, 560, 1.8]],
		actors: [{who: 'hero', x: 860, fc: 1, item: ITEM.radio, look: [0.3, -0.2], g: [['think', 4, '099e']], ex: [['worried', 0, 999]]}, {who: 'mom', x: 1100, fc: -1}],
	}),
	sc({
		at: '100',
		whip: true,
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		cam: [[1100, 600, 1.3], [1100, 590, 1.7]],
		mid: () => <Ship x={1540} y={880} s={1.25} />,
		actors: [
			{who: 'eng1', x: 760, fc: 1, hop: [['100+6', '100+22', 22], ['100+26', '100+42', 18]], pose: (p, c) => ({...p, lean: p.lean + Math.sin(c.f * 1.2) * 4}), mo: [['open', 0, 999]]},
			{who: 'eng2', x: 1000, fc: 1, ex: [['sad', '103', 999]]},
		],
	}),
	sc({
		at: '101',
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		cam: [[900, 600, 1.7], [900, 590, 2.0]],
		follow: 1.9,
		mid: () => <Ship x={1540} y={880} s={1.25} />,
		actors: [
			{who: 'eng1', x: 760, fc: 1, sp: 'ENG1', g: [['shrug', '101+4', '101+60'], ['presentF', '102', '102e']]},
			{who: 'eng2', x: 1000, fc: -1, look: [-0.8, 0]},
		],
	}),
	sc({
		at: '103',
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		cam: [[1100, 600, 1.6], [1160, 590, 2.1]],
		follow: 2.1,
		mid: () => <Ship x={1540} y={880} s={1.25} />,
		actors: [
			{who: 'eng1', x: 760, fc: 1, ex: [['sad', 0, 999]], pose: (p) => ({...p, head: p.head + 12})},
			{who: 'eng2', x: 1000, fc: -1, sp: 'ENG2', ex: [['sad', 0, 999]], pose: (p) => ({...p, head: p.head + 16}), g: [['facepalm', '104+10', '104e']]},
		],
	}),
	sc({
		at: '105',
		whip: true,
		bg: <Surface mode="dusk" base={false} />,
		bgDepth: 1.25,
		dust: '#d9a070',
		cam: [[1500, 700, 1.3], [700, 700, 1.3]],
		fx: (c) => <Rover x={1900 - (c.f - c.at('105')) * 6} y={880} s={1.4} dir={-1} t={c.f} />,
	}),
	sc({
		at: '106',
		whip: true,
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[700, 590, 1.35], [1300, 590, 1.35]],
		mid: table,
		actors: seat.map((s, i) => ({...s, fc: 1 as const, sit: [[0, 9999]] as [number, number][], g: i % 2 ? [['think', 30 + i * 12, 90 + i * 12]] : [], ex: [['sad', 0, 999]] as any})),
		fx: (c) => <Cup x={1150} y={712} steam={1} f={c.f} />,
	}),
	sc({
		at: '107',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[1300, 590, 1.35], [700, 590, 1.35]],
		mid: table,
		actors: seat.map((s, i) => ({...s, fc: 1 as const, sit: [[0, 9999]] as [number, number][], g: [['presentF', 10 + i * 8, 50 + i * 8]] as any})),
		fx: (c) => <Cup x={850} y={712} steam={1} f={c.f} />,
	}),
	sc({
		at: '108',
		bg: <Room kind="dining" />,
		bgDepth: 1.3,
		cam: [[960, 640, 1.8], [960, 600, 1.0]],
		mid: table,
		actors: seat.map((s, i) => ({...s, fc: 1 as const, sit: [[0, 9999]] as [number, number][], ex: [['sleepy', 0, 999]] as any, mo: [['smile', 30, 999]] as any})),
	}),
	// 109-127 купол и Фобос
	sc({
		at: '109',
		whip: true,
		bg: <Room kind="quarters" earth={0} />,
		bgDepth: 1.3,
		cam: [[500, 560, 1.4], [420, 560, 1.7]],
		actors: [{who: 'hero', x: 330, fc: 1, sit: [[0, 9999]], ex: [['worried', 0, 999]], look: [0.5, -0.5, 50], g: [['scratch', 30, '109e']]}],
		fx: (c) => <Alert f={c.f} t0={0} t1={0} text="" />,
	}),
	sc({
		at: '110',
		whip: true,
		bg: <Room kind="roof" ph={0.04} />,
		bgDepth: 1.4,
		cam: [[900, 560, 1.1], [1100, 520, 1.3]],
		actors: [{who: 'hero', x: 0, w: [[-250, 1000, 0, '110+70']], look: [0.6, -0.6, '110+60']}],
	}),
	sc({
		at: '111',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1000, 560, 1.15], [1000, 520, 1.5]],
		actors: [{who: 'hero', x: 1000, fc: 1, look: [0, -0.9], ex: [['wide', '112', 999]]}],
	}),
	sc({
		at: '113',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[phx(L('113').from), phy(L('113').from), 2.3], [phx(L('114').from + L('114').dur), phy(L('114').from + L('114').dur), 2.5]],
		fx: (c) => <Callout f={c.f} t0={c.at('113') + 30} t1={c.end('114')} from={[phx(c.gf), phy(c.gf) + 40]} to={[phx(c.gf) + 200, phy(c.gf) + 260]} text="LIKE A POTATO" c="#ffd34a" />,
	}),
	sc({
		at: '115',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[phx(L('115').from), 400, 1.4], [phx(L('115').from + L('115').dur) , 400, 1.4]],
		actors: [{who: 'hero', x: 1000, fc: 1, look: [0, -0.9], g: [['point', 8, '115e']]}],
		fx: (c) => <Callout f={c.f} t0={c.at('115') + 8} t1={c.end('115')} from={[phx(c.gf), phy(c.gf) + 40]} to={[phx(c.gf) + 200, phy(c.gf) + 260]} text="PHOBOS" c="#ffd34a" />,
	}),
	sc({
		at: '116',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[960, 480, 1.0], [960, 470, 1.15]],
		actors: [{who: 'hero', x: 1000, fc: 1, look: [0, -0.9]}],
		ov: (c) => (
			<>
				<Stat f={c.f} t0={c.at('116') + 20} t1={c.end('117') + 6} big="3×" label="Phobos circles Mars three times a day" x={90} y={110} w={720} c="#ffd34a" />
				<Big f={c.f} t0={c.at('116') + 4} t1={c.at('116') + 60} text="WEST  →  EAST" c="#fff" y={520} />
			</>
		),
	}),
	sc({
		at: '118',
		whip: true,
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1000, 560, 1.4], [1100, 540, 1.7]],
		follow: 1.9,
		actors: [
			{who: 'hero', x: 920, s: 0.82, fc: 1, look: [0.5, -0.8]},
			{who: 'dad', x: 1120, fc: -1, sp: 'DAD', g: [['point', '118+20', '120e']], look: [-0.4, -0.8]},
		],
		ov: () => warm,
	}),
	sc({
		at: '121',
		whip: true,
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[900, 600, 1.2], [1050, 590, 1.45]],
		mid: () => bench,
		actors: [
			{who: 'hero', x: 1000, fc: 1, sit: [[0, 9999]], look: [0.7, -0.6]},
			{who: 'dad', x: 0, w: [[-250, 1160, 0, '121+60']], fc: 1, sit: [['122-8', 9999]], item: ITEM.thermos},
		],
	}),
	sc({
		at: '123',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1080, 640, 1.9], [1100, 630, 2.2]],
		mid: () => bench,
		actors: [
			{who: 'hero', x: 1000, fc: 1, sit: [[0, 9999]], item: ITEM.mug, look: [0.7, -0.6], g: [['presentF', '124-20', '124+20']]},
			{who: 'dad', x: 1160, fc: 1, sit: [[0, 9999]], item: ITEM.thermos, g: [['presentF', 20, 70]]},
		],
		fx: (c) => <Cup x={1100} y={650} steam={1} f={c.f} />,
	}),
	sc({
		at: '124',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1050, 560, 1.4], [1250, 420, 1.2]],
		mid: () => bench,
		actors: [
			{who: 'hero', x: 1000, fc: 1, sit: [[0, 9999]], look: [0.9, -0.7], item: ITEM.mug},
			{who: 'dad', x: 1160, fc: 1, sit: [[0, 9999]], look: [0.9, -0.7]},
		],
	}),
	sc({
		at: '125',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1100, 600, 1.6], [1100, 600, 1.9]],
		follow: 1.9,
		mid: () => bench,
		actors: [
			{who: 'hero', x: 1000, fc: 1, sit: [[0, 9999]], look: [0.4, 0.2]},
			{who: 'dad', x: 1160, fc: -1, sp: 'DAD', sit: [[0, 9999]], g: [['think', 10, '126e']], ex: [['sad', 0, 999]]},
		],
	}),
	sc({
		at: '127',
		bg: (c) => <Room kind="roof" ph={phr(c.gf)} />,
		bgDepth: 1.4,
		cam: [[1000, 600, 2.0], [1000, 600, 2.4]],
		follow: 2.2,
		mid: () => bench,
		actors: [
			{who: 'hero', x: 1000, fc: 1, sit: [[0, 9999]], ex: [['sad', 0, 999]], mo: [['frown', 0, 999]], pose: (p) => ({...p, head: p.head + 10})},
			{who: 'dad', x: 1160, fc: -1, sit: [[0, 9999]], look: [-0.5, 0.3]},
		],
	}),
	// 128-129 дни становятся неделями
	sc({
		at: '128',
		whip: true,
		bg: (c) => <Surface mode={(['dawn', 'day', 'dusk', 'night'] as const)[Math.floor(c.f / 14) % 4]} />,
		bgDepth: 1.25,
		cam: [[900, 620, 1.2], [1100, 620, 1.3]],
		actors: [{who: 'hero', x: 0, w: [[-200, 600, 0, 40], [600, 1500, 44, '128e', 'run']]}],
		ov: (c) => <Calendar f={c.f} t0={c.at('128') + 6} t1={c.end('128') + 6} x={1500} y={160} title="SOLS" />,
	}),
	sc({
		at: '129',
		bg: <Surface mode="dusk" />,
		bgDepth: 1.25,
		cam: [[1000, 620, 1.9], [1000, 560, 1.0]],
		actors: [{who: 'hero', x: 900, fc: 1, look: [0.8, -0.3], ex: [['sleepy', 0, 999]], mo: [['smile', 40, 999]]}],
	}),
	// 130-134 гравитация
	sc({
		at: '130',
		whip: true,
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[900, 600, 1.2], [1000, 580, 1.5]],
		actors: [{who: 'hero', x: 900, fc: 1, hop: [['130+30', '130+56', 80]], g: [['presentF', 4, 30]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('130') + 8} t1={c.end('130')} big="38%" label="of Earth's gravity" x={90} y={110} w={560} c="#9be564" />,
	}),
	sc({
		at: '131',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[800, 520, 1.1], [1100, 520, 1.1]],
		actors: [{who: 'hero', x: 0, w: [[-200, 1600, 0, '131e']], hop: [[10, 34, 130], [38, 62, 150], [66, 90, 130]]}],
	}),
	sc({
		at: '132',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[950, 560, 1.3], [1000, 540, 1.5]],
		actors: [
			{who: 'mom', x: 900, fc: 1, hop: [['132+10', '132+60', 110], ['132+66', '132+120', 110]], sp: 'MOM'},
			{who: 'hero', x: 1100, fc: -1, hop: [['132+20', '132+70', 90]]},
		],
		fx: (c) => <Bubbles x={900} y={760} f={c.f} />,
	}),
	sc({
		at: '134',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[900, 580, 1.4], [900, 600, 1.7]],
		actors: [{who: 'hero', x: 900, fc: 1, g: [['fist', 10, 50]], pose: (p, c) => ({...p, lean: p.lean + 8 * env(c.f, 50, 9999, 20, 4), head: p.head + 10 * env(c.f, 50, 9999, 20, 4)}), ex: [['sleepy', 0, 999]]}],
		ov: (c) => <Stat f={c.f} t0={c.at('134') + 12} t1={c.end('134') + 8} big="↓" label="thinner bones, weaker muscles" x={90} y={110} w={680} c="#ff8a5a" />,
	}),
	// 135-139 тренировки
	sc({
		at: '135',
		whip: true,
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[800, 600, 1.1], [1100, 600, 1.2]],
		mid: (c) => (
			<>
				{[420, 820, 1220, 1620].map((x) => (
					<Treadmill key={x} x={x} y={900} f={c.gf} s={1.2} />
				))}
			</>
		),
		actors: ['hero', 'eng1', 'anna', 'doc'].map((w, i) => ({who: w, x: 420 + i * 400, fc: 1 as const, pose: (p: any, c: any) => run(c.f * (0.4 + i * 0.03)), bobf: (c: any) => Math.abs(Math.sin(c.f * 0.4 * 1.15)) * 8})),
		ov: (c) => <Stat f={c.f} t0={c.at('135') + 30} t1={c.end('136')} big="2 h" label="of exercise, every morning" x={90} y={110} w={600} c="#6ad4ff" />,
	}),
	sc({
		at: '137',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[1000, 580, 1.4], [1000, 570, 1.7]],
		actors: [
			{who: 'cook', x: 1300, fc: -1, g: [['point', 10, '137e']], item: ITEM.mug, mo: [['open', 0, 999]], ex: [['angry', 0, 999]]},
			{who: 'eng2', x: 760, fc: 1, pose: (p, c) => run(c.f * 0.42), bobf: (c) => Math.abs(Math.sin(c.f * 0.48)) * 8},
		],
		mid: (c) => <Treadmill x={760} y={900} f={c.gf} s={1.2} />,
		fx: (c) => <Callout f={c.f} t0={c.at('137') + 20} t1={c.end('137')} from={[1300, HEADY]} to={[1000, 250]} text="MORE PROTEIN!" c="#ffd34a" />,
	}),
	sc({
		at: '138',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[900, 560, 1.5], [900, 520, 1.8]],
		actors: [{who: 'dad', x: 900, fc: 1, ex: [['angry', 0, 999]], crouch: [[0, 24], [64, 90], [130, 160]], pose: (p, c) => ({...p, armF: [150, 20], armB: [150, 20]})}],
		fx: (c) => <Barbell x={900} y={540 + 150 * (1 - Math.max(env(c.f, 24, 50, 10, 10), env(c.f, 94, 122, 10, 10), env(c.f, 160, 190, 10, 10)) * 0)} />,
		ov: (c) => <Stat f={c.f} t0={c.at('138') + 10} t1={c.end('139')} big="DAD" label="used to hate exercise" x={90} y={110} w={560} c="#ffb15a" />,
	}),
	sc({
		at: '139',
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[900, 560, 1.3], [900, 560, 1.6]],
		actors: [{who: 'dad', x: 900, fc: 1, g: [['fist', 4, '139e']], mo: [['smile', 0, 999]], hop: [['139+30', '139+60', 90]]}],
		fx: (c) => <Barbell x={640} y={860} />,
	}),
	// 140-146 баскетбол
	sc({
		at: '140',
		whip: true,
		bg: <Room kind="tunnel" />,
		bgDepth: 1.3,
		cam: [[1050, 560, 1.4], [1250, 440, 1.6]],
		actors: [{who: 'dad', x: 1100, fc: 1, g: [['presentF', 4, '140e']], item: ITEM.flashlight, look: [0.8, -0.5]}],
		fx: (c) => <Sparks x={1330} y={560} f={c.f} />,
	}),
	sc({
		at: '141',
		bg: (c) => <Room kind="tunnel" hoop />,
		bgDepth: 1.3,
		cam: [[1300, 480, 1.3], [1450, 420, 1.7]],
		actors: [{who: 'dad', x: 1250, fc: 1, look: [0.6, -0.8], g: [['presentF', 20, '141e']], mo: [['smile', 30, 999]]}],
	}),
	sc({
		at: '142',
		bg: <Room kind="tunnel" hoop />,
		bgDepth: 1.3,
		cam: [[1200, 560, 1.3], [1350, 400, 1.5]],
		actors: [{who: 'hero', x: 0, w: [[-200, 1150, 0, 40, 'run']], hop: [[44, 84, 330]], mo: [['smile', 0, 999]]}],
		fx: (c) => {
			const u = Math.max(0, Math.min(1, (c.f - 70) / 22));
			return <Ball x={1150 + 350 * u} y={600 - 150 * Math.sin(u * 3.1) + (u > 0.9 ? 80 * (u - 0.9) * 10 : 0)} />;
		},
		ov: (c) => <Stat f={c.f} t0={c.at('142') + 30} t1={c.end('142')} big="3×" label="higher jumps" x={90} y={110} w={480} c="#9be564" />,
	}),
	sc({
		at: '143',
		bg: <Room kind="tunnel" hoop />,
		bgDepth: 1.3,
		cam: [[900, 540, 1.1], [1100, 540, 1.2]],
		actors: [
			{who: 'kid1', x: 800, s: 0.78, fc: 1, hop: [[4, 34, 150], [60, 90, 150]]},
			{who: 'kid2', x: 1000, s: 0.78, fc: -1, hop: [[20, 50, 140], [74, 104, 150]]},
			{who: 'kid3', x: 1200, s: 0.78, fc: -1, hop: [[10, 44, 130], [90, 120, 150]]},
			{who: 'hero', x: 600, fc: 1, hop: [[34, 64, 160], [100, 130, 160]]},
		],
		fx: (c) => <Ball x={600 + 700 * Math.abs(Math.sin(c.f / 24))} y={820 - 280 * Math.abs(Math.sin(c.f / 12))} />,
	}),
	sc({
		at: '144',
		bg: <Room kind="tunnel" hoop />,
		bgDepth: 1.3,
		cam: [[900, 540, 1.15], [1250, 480, 1.5]],
		actors: [
			{who: 'hale', x: 0, w: [[-200, 1180, 0, 50, 'run']], hop: [[52, 100, 340]], g: [['wave', 60, 100]]},
			{who: 'kid1', x: 600, s: 0.78, fc: 1, g: [['wave', 40, 130]]},
			{who: 'kid2', x: 740, s: 0.78, fc: 1, g: [['wave', 50, 130]]},
		],
		fx: (c) => {
			const u = Math.max(0, Math.min(1, (c.f - 78) / 24));
			return <Ball x={1260 + 240 * u} y={560 - 40 * Math.sin(u * 3) + 40 * u * u} />;
		},
	}),
	sc({
		at: '146',
		bg: <Room kind="tunnel" hoop />,
		bgDepth: 1.3,
		cam: [[1000, 560, 1.1], [1000, 560, 1.3]],
		actors: [
			{who: 'hale', x: 1300, fc: -1, mo: [['smile', 0, 999]], g: [['fist', 0, 40]]},
			{who: 'hero', x: 700, fc: 1, hop: [[0, 30, 120], [40, 70, 120]], g: [['wave', 0, 80]]},
			{who: 'mom', x: 900, fc: 1, hop: [[10, 40, 110]]},
			{who: 'dad', x: 480, fc: 1, hop: [[20, 50, 110]]},
			{who: 'eng1', x: 1500, fc: -1, hop: [[6, 36, 110]]},
		],
	}),
	// 147-152 Хейл в коридоре
	sc({
		at: '147',
		whip: true,
		bg: <Room kind="hall" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[1300, 580, 1.2], [1450, 580, 1.6]],
		actors: [{who: 'hale', x: 1560, fc: -1, ex: [['sad', 0, 999]], pose: (p, c) => ({...p, lean: p.lean - 12}), g: [['facepalm', 10, 120]]}],
	}),
	sc({
		at: '149',
		bg: <Room kind="hall" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[1200, 580, 1.2], [1300, 580, 1.5]],
		actors: [
			{who: 'hero', x: 0, w: [[-250, 880, 0, 40]], fc: 1, ex: [['worried', 30, 999]]},
			{who: 'hale', x: 1560, fc: -1, ex: [['sad', 0, 999]], g: [['touchFace', 20, '149e']]},
		],
	}),
	sc({
		at: '150',
		bg: <Room kind="hall" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[1400, 580, 1.7], [1400, 580, 2.0]],
		follow: 1.9,
		actors: [
			{who: 'hero', x: 1050, fc: 1, ex: [['worried', 0, 999]]},
			{who: 'hale', x: 1400, fc: -1, ex: [['sad', 0, 999]], g: [['presentF', '151+6', '151e']]},
		],
	}),
	sc({
		at: '152',
		bg: <Room kind="hall" dim={0.35} />,
		bgDepth: 1.3,
		cam: [[1200, 580, 1.8], [1150, 580, 2.2]],
		actors: [
			{who: 'hero', x: 1050, fc: 1, mo: [['flat', 0, 999]], pose: (p, c) => ({...p, head: p.head + 14 * env(c.f, 10, 40, 8, 10)})},
			{who: 'hale', x: 1400, fc: -1, ex: [['sad', 0, 999]]},
		],
	}),
];

