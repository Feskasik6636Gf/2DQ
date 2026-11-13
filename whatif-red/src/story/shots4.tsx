import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Pose} from '../engine/Stickman';
import {blend, gesture, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Extra} from '../kit/kit';
import {Bubble} from '../kit/ui';
import {Kitchen, Shop} from '../kit/sets';
import {Callout} from '../kit/graphics';
import {Bed, BossDesk, Car, ClassRoom, Couch, HeroRoom, HouseFront, LivingRoom, Office, PhoneFrame, QMark, RedVoid, Register, SchoolDesk, StoreNight, Sweater} from './places';
import {Bill, Bulb, Classmates, Polaroid, TestPaper, Thermo} from './bits';
import {Dog, Flash, Hero, LieStamp, Magic, P, Pow, Scene, Sparks, SpeedLines, Tag, Title, camCut, camK, env, ez, jump, lin, mover, pop, shake, useB, wordOff} from './lib';

const SEAT = 795;
const RB = "'Rubik', sans-serif";
const say = (text: string, size = 44, c = '#2a2030') => (
	<text y={size * 0.36} textAnchor="middle" fontSize={size} fontFamily={RB} fontWeight={900} fill={c}>
		{text}
	</text>
);
const bw = (text: string, size = 44) => text.length * size * 0.62 + 60;
const Void: React.FC<{cam: any; children?: React.ReactNode; c?: string; words?: boolean; over?: React.ReactNode}> = ({cam, children, c, words, over}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} c={c} words={words} />} over={over}>
			{children}
		</Scene>
	);
};
const TruthStamp: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
	if (t < 0) return null;
	const k = pop(t);
	return (
		<g transform={`translate(${x},${y}) rotate(-10) scale(${0.4 + 0.6 * k})`}>
			<rect x={-120} y={-40} width={240} height={80} rx={12} fill="#3aa37a" stroke="#fff" strokeWidth={6} />
			<text y={20} textAnchor="middle" fontSize={54} fontFamily={RB} fontWeight={900} fill="#fff">
				TRUE ✓
			</text>
		</g>
	);
};

/* 111 «The fever disappears. You realize you can't even tell yourself the truth anymore without changing it.» */
const S111: React.FC = () => {
	const {f, w} = useB();
	const tr = w('111', 'realize');
	if (f < tr - 4) {
		const j = jump(f, 22, 120, 18);
		return (
			<Scene cam={camK(f, [[0, 960, 600, 1.5], [tr, 960, 560, 1.2]])} bg="#cfe4ef" set={<HeroRoom f={f} night={false} />}>
				<Bed x={860} night={false} />
				<Hero x={760} floor={900 - j.lift} squash={j.squash} pose={f > 22 ? P.cheer(f) : idle(f, 1)} mouth="smile" />
				<Thermo x={1250} y={560} v={lin(f, 0, 18, 1, 0.1)} s={1.2} />
				<Pow x={1250} y={300} text="98°F?!" t={f - 18} size={56} />
			</Scene>
		);
	}
	const tt = w('111', 'truth');
	const tc = w('111', 'changing');
	const word = f < tc ? 'TRUTH' : 'L1E?!';
	return (
		<Void cam={camK(f, [[tr - 4, 960, 520, 1.3], [tr + 140, 960, 500, 1.7]])}>
			<Hero x={760} pose={gesture('handsOnHead', idle(f, 1), env(f, tc, 999, 6, 1), f)} faceTurn={0.5} mouth="open" expr={f > tc ? 'wide' : 'worried'} lidBase={f > tc ? 0 : 0.3} />
			{f > tt ? (
				<g transform={`translate(1200,420) scale(${pop(f - tt)}) rotate(${f > tc ? Math.sin(f) * 6 : 0})`}>
					<rect x={-180} y={-60} width={360} height={110} rx={55} fill={f < tc ? '#3aa37a' : '#ff2a3c'} />
					<text y={20} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#fff">
						{word}
					</text>
				</g>
			) : null}
			<Sparks x={1200} y={420} t={f - tc} c="#ff3b4e" r={200} />
		</Void>
	);
};
/* 112 «Then comes the worst night of your life.» — thunder over the store */
const S112: React.FC = () => {
	const {f, w, dur} = useB();
	const tw = w('112', 'worst');
	return (
		<Scene cam={shake(camK(f, [[0, 1000, 500, 1.0], [dur, 1000, 560, 1.25]]), f, tw, 18, 20)} bg="#070b1f" light={{night: true, o: 0.5}} set={<StoreNight f={f} />} over={<Flash t={f - tw} c="#dfe8ff" o={0.85} len={10} />}>
			{f > tw && f < tw + 8 ? <path d="M1500,-50 L1440,200 L1520,240 L1420,520" stroke="#fff" strokeWidth={10} fill="none" /> : null}
			<Title t={f - tw} lines={['THE WORST NIGHT']} y={80} size={90} c="#ff3b4e" />
		</Scene>
	);
};
/* 113 «Kai finds out. He sees you lie to a cashier and watches her register suddenly fill with money.» */
const S113: React.FC = () => {
	const {f, w} = useB();
	const tl = w('113', 'lie');
	const tm = w('113', 'money');
	const cash = lin(f, tm - 14, tm + 20, 0, 1);
	const cam = camCut(f, [[0, 500, 560, 1.7], [tl - 2, 1000, 560, 1.25], [tm - 14, 1250, 560, 1.6], [tm + 16, 480, 520, 1.9]]);
	return (
		<Scene cam={cam} bg="#f2efe6" set={<Shop f={f} />}>
			<Actor who="kai" x={480} pose={reach(idle(f, 3), 'F', [60, -100], 1)} faceTurn={0.6} expr={f > tm ? 'wide' : 'normal'} mouth={f > tm ? 'open' : 'flat'} lidBase={f > tm ? 0 : 0.2} />
			<rect x={300} y={600} width={330} height={300} fill="#b9b2a0" />
			<Hero x={980} pose={P.present(f)} faceTurn={0.6} mouth="smirk" lidBase={0.5} />
			<Register x={1300} f={f} cash={cash} />
			<Actor who="cashier" x={1500} facing={-1} pose={f > tm ? P.scared(f) : idle(f, 5)} expr={f > tm ? 'wide' : 'normal'} />
			<Bubble x={1050} y={320} w={bw('...AND YOU OWE ME $500', 34)} h={90} t={f - tl} tail={[0, 120]}>
				{say('...AND YOU OWE ME $500', 34)}
			</Bubble>
			<Tag x={480} y={300} t={f - 2} text="KAI" size={54} c="#bfe3ff" />
			<Pow x={480} y={420} text="!!!" t={f - tm - 16} size={80} c="#ff3b4e" />
		</Scene>
	);
};
/* the confrontation outside the store */
const Fight: React.FC<{cam: any; kai?: Partial<React.ComponentProps<typeof Actor>>; hero?: Partial<React.ComponentProps<typeof Hero>>; children?: React.ReactNode; kx?: number; hx?: number}> = ({cam, kai, hero, children, kx = 1120, hx = 800}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#070b1f" light={{night: true, x: 40, y: 10, o: 0.55}} set={<StoreNight f={f} />}>
			<Hero x={hx} pose={idle(f, 1)} faceTurn={0.6} look={[1, 0]} {...hero} />
			<Actor who="kai" x={kx} facing={-1} pose={idle(f, 3)} faceTurn={0.6} look={[-1, 0]} {...kai} />
			{children}
		</Scene>
	);
};
/* 114 «He grabs your arm outside the store.» */
const S114: React.FC = () => {
	const {f, w} = useB();
	const tg = w('114', 'grabs');
	const kw = mover(f, 0, tg + 2, 1700, 1000, {run: true});
	const spin = ez(f, tg + 2, tg + 10, 0, 1);
	const hw = mover(f, 0, 60, 500, 760, {seed: 2});
	return (
		<Fight cam={shake(camCut(f, [[0, 860, 560, 1.3], [tg + 2, 880, 600, 1.85]]), f, tg + 2, 12)} kx={kw.x} hx={hw.x} kai={{pose: reach(kw.pose, 'F', [100, -70], env(f, tg - 4, 999, 4, 1)), vx: kw.vx, bob: kw.bob, expr: 'angry', mouth: 'open'}} hero={{facing: spin > 0.5 ? 1 : 1, pose: f < tg ? hw.pose : reach(idle(f, 1), 'B', [-80, -60], spin), expr: f > tg ? 'wide' : 'normal', lidBase: f > tg ? 0 : 0.4}}>
			<Pow x={900} y={520} text="GRAB!" t={f - tg - 2} size={60} />
		</Fight>
	);
};
/* 115 «Was it all you? The test?» */
const S115: React.FC = () => {
	const {f, w} = useB();
	const tt = w('115', 'test');
	return (
		<Fight cam={camCut(f, [[0, 1100, 520, 1.9], [tt - 4, 960, 540, 1.35]])} kai={{pose: gesture('point', P.shout(f), 1, f), handF: 'point', expr: 'angry', mouth: 'open'}}>
			<Bubble x={1300} y={280} w={bw('WAS IT ALL YOU?!')} h={100} t={f - 2} tail={[-120, 120]}>
				{say('WAS IT ALL YOU?!')}
			</Bubble>
			{f > tt ? <TestPaper x={960} y={330} s={0.45 * pop(f - tt)} grade="100" t={20} rot={-10} /> : null}
		</Fight>
	);
};
/* 116 «Your dad? Zoe? You nod.» */
const S116: React.FC = () => {
	const {f, w} = useB();
	const td = w('116', 'dad');
	const tz = w('116', 'zoe');
	const tn = w('116', 'nod');
	const nod = f > tn ? Math.sin((f - tn) / 3) * 14 * Math.max(0, 1 - (f - tn) / 30) : 0;
	return (
		<Fight cam={camCut(f, [[0, 1100, 520, 1.6], [tn - 2, 800, 520, 2.0]])} kai={{pose: P.shout(f), expr: 'angry', mouth: 'open'}} hero={{pose: {...P.slump(f), head: 10 + nod}, expr: 'sad', mouth: 'frown'}}>
			<g transform={`translate(1350,280) scale(${pop(f - td)})`}>
				<circle r={80} fill="#fbf8ef" />
				<text y={20} textAnchor="middle" fontSize={44} fontFamily={RB} fontWeight={900} fill="#2a2030">
					$DAD
				</text>
			</g>
			<g transform={`translate(1560,360) scale(${pop(f - tz)})`}>
				<circle r={80} fill="#efe2ff" />
				<text y={20} textAnchor="middle" fontSize={44} fontFamily={RB} fontWeight={900} fill="#9b6cf0">
					ZOE
				</text>
			</g>
			<Pow x={800} y={330} text="*nod*" t={f - tn} size={50} c="#fff" />
		</Fight>
	);
};
/* 117 «He goes white. Did you ever lie about me?» */
const S117: React.FC = () => {
	const {f, w} = useB();
	const td = w('117', 'did');
	const pale = lin(f, 2, 14, 0, 1);
	return (
		<Fight cam={camCut(f, [[0, 1120, 520, 2.1], [td - 2, 1050, 540, 1.6]])} kai={{color: pale > 0.5 ? '#c9d4e6' : '#2f8fe0', pose: gesture('handsOnHead', idle(f, 3), env(f, 0, td, 6, 6), f), expr: 'wide', mouth: 'open', lidBase: 0}}>
			<Bubble x={1300} y={280} w={bw('DID YOU EVER LIE ABOUT ME?', 36)} h={90} t={f - td} tail={[-120, 120]}>
				{say('DID YOU EVER LIE ABOUT ME?', 36)}
			</Bubble>
		</Fight>
	);
};
/* 118 «You haven't, but he doesn't believe you.» */
const S118: React.FC = () => {
	const {f, w} = useB();
	const tb = w('118', 'but');
	const shake2 = Math.sin(f / 2.5) * 12;
	return (
		<Fight cam={camCut(f, [[0, 800, 520, 1.9], [tb - 2, 960, 540, 1.3]])} hero={{pose: {...gesture('stop', idle(f, 1), 1, f), head: shake2}, expr: 'worried', mouth: 'open', lidBase: 0.1}} kai={{color: '#c9d4e6', pose: gesture('armsCrossed', idle(f, 3), env(f, tb, 999, 6, 1), f), facing: f > tb + 20 ? 1 : -1, expr: 'angry'}}>
			<Bubble x={760} y={290} w={bw('NO! NEVER!')} h={100} t={f - 2} tail={[0, 120]}>
				{say('NO! NEVER!')}
			</Bubble>
			<Pow x={1250} y={330} text="SURE..." t={f - tb - 6} size={56} c="#c9d4e6" />
		</Fight>
	);
};
/* 119 «He says you're not his friend.» */
const S119: React.FC = () => {
	const {f} = useB();
	return (
		<Fight cam={camK(f, [[0, 1100, 520, 1.5], [45, 1100, 510, 2.0]])} kai={{color: '#c9d4e6', pose: gesture('point', P.shout(f), 1, f), handF: 'point', expr: 'angry', mouth: 'open'}}>
			<Bubble x={1300} y={260} w={bw("YOU'RE NOT MY FRIEND.")} h={100} t={f - 4} tail={[-120, 120]}>
				{say("YOU'RE NOT MY FRIEND.")}
			</Bubble>
		</Fight>
	);
};
/* 120 «You're just a guy who makes the world do whatever he wants.» — puppet strings on a globe */
const S120: React.FC = () => {
	const {f, w, dur} = useB();
	const tw = w('120', 'world');
	const cam = camK(f, [[0, 960, 540, 1.1], [dur, 960, 520, 1.35]]);
	return (
		<Void cam={cam} c="#3a0a14">
			<Hero x={960} floor={420} s={0.8} pose={{...idle(f, 1), armF: [150 + Math.sin(f / 5) * 10, 20], armB: [-150 - Math.sin(f / 5) * 10, -20]}} mouth="smirk" lidBase={0.6} badge={false} />
			<g transform={`translate(960,${780}) rotate(${Math.sin(f / 10) * 8}) scale(${pop(f - tw)})`}>
				<circle r={170} fill="#3a7ac8" />
				<path d="M-120,-60 q60,-40 100,0 t80,40 q-40,60 -100,20 z M40,-140 q60,20 80,80 q-60,10 -80,-80 z M-60,80 q40,-20 90,10 q-20,50 -90,-10 z" fill="#5ac85a" />
			</g>
			{[-1, 1].map((s) =>
				[0, 1].map((i) => <line key={s + '-' + i} x1={960 + s * (150 + i * 30)} y1={260} x2={960 + s * (60 + i * 60)} y2={640} stroke="#fff" strokeWidth={2} opacity={0.7} />),
			)}
			<Title t={f - 4} lines={['"YOU MAKE THE WORLD', 'DO WHATEVER YOU WANT"']} y={60} size={64} c="#ff3b4e" />
		</Void>
	);
};
/* 121 «And you're angry and you're scared and you shout the cruelest thing you can think of.» */
const S121: React.FC = () => {
	const {f, w, dur} = useB();
	const ta = w('121', 'angry');
	const ts = w('121', 'scared');
	const tc = w('121', 'cruelest');
	const pulse = 0.25 + 0.15 * Math.sin(f / 3);
	return (
		<Fight
			cam={camCut(f, [[0, 800, 540, 1.6], [ts - 2, 800, 500, 1.9], [tc - 4, 800, 470, 2.4]])}
			hero={{pose: f < ts ? gesture('fist', P.shout(f), 1, f) : gesture('handsOnHead', idle(f, 1), 1, f), expr: f < ts ? 'angry' : 'worried', mouth: 'frown', lidBase: 0.2}}
			kai={{color: '#c9d4e6', pose: gesture('armsCrossed', idle(f, 3), 1, f), expr: 'angry'}}
		>
			<rect x={-400} y={-300} width={2800} height={1600} fill="#ff0020" opacity={f > tc ? pulse : 0} />
			<Pow x={600} y={330} text="ANGRY" t={f - ta} size={50} c="#ff3b4e" hold={ts - ta} />
			<Pow x={600} y={330} text="SCARED" t={f - ts} size={50} c="#bfe3ff" hold={tc - ts} />
		</Fight>
	);
};
/* 122 «I don't even know who you are!» — the shout */
const S122: React.FC = () => {
	const {f} = useB();
	return (
		<Fight cam={shake(camK(f, [[0, 800, 500, 2.3], [14, 900, 540, 1.25]]), f, 2, 26, 30)} hero={{pose: P.shout(f), expr: 'angry', mouth: 'open', lidBase: 0}} kai={{color: '#c9d4e6', pose: {...idle(f, 3), lean: -14}, expr: 'wide', lidBase: 0}}>
			{[0, 1, 2].map((i) => {
				const t = f - i * 6;
				return t > 0 ? <circle key={i} cx={860} cy={570} r={t * 30} fill="none" stroke="#fff" strokeWidth={Math.max(0, 14 - t * 0.6)} opacity={Math.max(0, 1 - t / 25)} /> : null;
			})}
			<Pow x={960} y={280} text="I DON'T EVEN KNOW WHO YOU ARE!" t={f - 2} size={62} c="#ff3b4e" hold={60} rot={-4} />
			<SpeedLinesWorld f={f} />
		</Fight>
	);
};
const SpeedLinesWorld: React.FC<{f: number}> = ({f}) => (
	<g opacity={Math.max(0, 1 - f / 30)}>
		{Array.from({length: 30}).map((_, i) => {
			const a = (i / 30) * Math.PI * 2;
			return <line key={i} x1={860 + Math.cos(a) * 300} y1={570 + Math.sin(a) * 300} x2={860 + Math.cos(a) * 1200} y2={570 + Math.sin(a) * 1200} stroke="#fff" strokeWidth={4} opacity={0.5} />;
		})}
	</g>
);
/* 123 «The second it leaves your mouth, you know.» — slow motion, grey */
const S123: React.FC = () => {
	const {f, w, dur} = useB();
	const tk = w('123', 'know');
	return (
		<Fight cam={camK(f, [[0, 860, 520, 1.6], [dur, 820, 500, 2.2]])} hero={{pose: gesture('touchFace', idle(f * 0.3, 1), env(f, tk - 6, 999, 10, 1), f * 0.3), armOver: true, expr: 'wide', mouth: 'open', lidBase: 0}} kai={{color: '#c9d4e6', pose: idle(f * 0.3, 3), expr: 'normal'}}>
			{"I DON'T KNOW YOU".split('').map((c, i) => (
				<text key={i} x={900 + i * 34 + f * 2} y={540 - f * 0.8 + Math.sin(i + f / 10) * 10} fontSize={44} fontFamily={RB} fontWeight={900} fill="#fff" opacity={Math.max(0, 1 - f / 70)}>
					{c}
				</text>
			))}
			<rect x={-400} y={-300} width={2800} height={1600} fill="#000" opacity={lin(f, 0, 30, 0, 0.35)} />
		</Fight>
	);
};
/* 124 «Kai blinks. He looks at you like a stranger.» */
const S124: React.FC = () => {
	const {f, w} = useB();
	const tb = w('124', 'blinks');
	const blink = f > tb && f < tb + 6 ? 1 : 0;
	return (
		<Fight cam={camCut(f, [[0, 1120, 500, 2.4], [w('124', 'he') - 2, 960, 540, 1.4]])} kai={{color: '#2f8fe0', blink, pose: idle(f, 3), expr: 'normal', mouth: 'flat', look: [-0.3, 0]}} hero={{expr: 'wide', lidBase: 0}}>
			<Callout f={f} t0={w('124', 'stranger')} t1={999} from={[1120, 420]} to={[1450, 260]} text="STRANGER" c="#bfe3ff" />
		</Fight>
	);
};
/* 125 «Sorry, he says politely.» */
const S125: React.FC = () => {
	const {f} = useB();
	return (
		<Fight cam={camK(f, [[0, 1100, 520, 1.8], [50, 1100, 520, 2.0]])} kai={{pose: gesture('wave', idle(f, 3), 0.6, f), mouth: 'smile', look: [-0.3, 0]}}>
			<Bubble x={1300} y={300} w={bw('OH, SORRY...')} h={100} t={f - 2} tail={[-120, 120]}>
				{say('OH, SORRY...')}
			</Bubble>
		</Fight>
	);
};
/* 126 «Have we met? He walks away.» */
const S126: React.FC = () => {
	const {f, w, dur} = useB();
	const tw = w('126', 'walks');
	const kw = mover(f, tw, dur + 30, 1120, 2200, {seed: 3});
	return (
		<Fight cam={camCut(f, [[0, 1100, 520, 1.7], [tw - 2, 960, 560, 1.15]])} kx={kw.x} kai={{facing: f > tw ? 1 : -1, pose: f > tw ? kw.pose : gesture('shrug', idle(f, 3), 1, f), vx: kw.vx, bob: kw.bob, mouth: 'smile'}} hero={{pose: gesture('wave', idle(f, 1), env(f, tw, 999, 8, 1) * 0.6, f), expr: 'sad', lidBase: 0}}>
			<Bubble x={1300} y={300} w={bw('HAVE WE MET?')} h={100} t={f - 2} tail={[-120, 120]}>
				{say('HAVE WE MET?')}
			</Bubble>
		</Fight>
	);
};
/* 127 «The next morning, his seat at school belongs to someone else.» */
const S127: React.FC = () => {
	const {f, w} = useB();
	const ts = w('127', 'seat');
	return (
		<Scene cam={camCut(f, [[0, 960, 560, 1.1], [ts - 2, 640, 600, 1.8]])} bg="#f0e2b8" set={<ClassRoom f={f} board="GOOD MORNING!" />}>
			<Classmates f={f} xs={[1240, 1500, 1740]} />
			<Actor who="sit1" x={600} seat={800} pose={P.sitDesk(f)} mouth="smile" />
			<SchoolDesk x={660} />
			<Hero x={900} seat={SEAT} pose={P.sitDesk(f)} faceTurn={0.6} look={[-1, 0]} facing={-1} expr="wide" lidBase={0} />
			<SchoolDesk x={840} />
			<Callout f={f} t0={ts + 6} t1={999} from={[600, 560]} to={[380, 300]} text="KAI'S SEAT?" c="#ff6a8a" />
			<Tag x={1300} y={150} t={f - 2} text="NEXT MORNING" size={50} />
		</Scene>
	);
};
/* 128 «His name isn't on the class list.» */
const S128: React.FC = () => {
	const {f, w} = useB();
	const names = ['ADAMS, LEO', 'BROOKS, MIA', 'CHEN, AMY', 'KAI ———', 'LOPEZ, SAM', 'YOU', 'ZOE'];
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.0], [50, 960, 600, 1.35]])} c="#3a3a4a" words={false}>
			<g transform="translate(960,540) rotate(-2)">
				<rect x={-300} y={-380} width={600} height={760} fill="#fbf8ef" />
				<text y={-300} textAnchor="middle" fontSize={44} fontFamily={RB} fontWeight={900} fill="#2a2030">
					CLASS 7B
				</text>
				{names.map((n, i) => (
					<text key={i} x={-240} y={-210 + i * 80} fontSize={40} fontFamily={RB} fontWeight={700} fill="#2a2030" opacity={i === 3 ? lin(f, 10, 34, 1, 0) : 1}>
						{i === 3 ? 'KAI MORENO' : n}
					</text>
				))}
				{f > 10 ? <rect x={-250} y={20 - 50} width={Math.min(480, (f - 10) * 30)} height={60} fill="#fbf8ef" /> : null}
			</g>
			<Pow x={1450} y={300} text="GONE" t={f - 34} size={80} c="#ff3b4e" />
		</Void>
	);
};
/* 129 «His mom doesn't remember he was ever friends with you.» */
const S129: React.FC = () => {
	const {f, w} = useB();
	const tr = w('129', 'remember');
	return (
		<Scene cam={camCut(f, [[0, 960, 560, 1.2], [tr - 2, 1150, 520, 1.7]])} bg="#7fc0ea" set={<HouseFront f={f} doorOpen={1} />}>
			<Hero x={700} pose={P.present(f)} faceTurn={0.6} expr="worried" />
			<Actor who="kaimom" x={960} facing={-1} pose={gesture('shrug', idle(f, 3), env(f, tr, 999, 6, 1), f)} mouth="flat" />
			<Bubble x={1200} y={300} w={bw('FRIENDS? WITH YOU?', 40)} h={90} t={f - tr} tail={[-160, 120]}>
				{say('FRIENDS? WITH YOU?', 40)}
			</Bubble>
		</Scene>
	);
};
/* 130 «In your phone, nine years of messages are gone.» */
const S130: React.FC = () => {
	const {f, w} = useB();
	const tg = w('130', 'gone');
	const msgs = ['bro ur late', 'lol', 'game tonight?', 'happy bday!!', 'best friends 4ever', 'u ok?'];
	const left = f < tg ? msgs.length : Math.max(0, msgs.length - Math.floor((f - tg) / 3));
	return (
		<Scene cam={camK(f, [[0, 960, 540, 1.0], [70, 960, 560, 1.25]])} bg="#1d2550" light={false} set={<HeroRoom f={f} />}>
			<PhoneFrame x={960} y={540} s={1.25}>
				<rect x={-182} y={-350} width={364} height={80} fill="#2f8fe0" />
				<text y={-300} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={900} fill="#fff">
					{f < tg ? 'KAI ♥' : 'UNKNOWN'}
				</text>
				{msgs.slice(0, left).map((m, i) => (
					<g key={i} transform={`translate(${i % 2 ? 60 : -60},${-220 + i * 80})`}>
						<rect x={-110} y={-26} width={220} height={52} rx={26} fill={i % 2 ? '#2f8fe0' : '#e6eaf2'} />
						<text y={8} textAnchor="middle" fontSize={22} fontFamily={RB} fill={i % 2 ? '#fff' : '#2a2030'}>
							{m}
						</text>
					</g>
				))}
				{left === 0 ? (
					<text y={40} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={800} fill="#9aa3b5">
						No messages
					</text>
				) : null}
			</PhoneFrame>
			<Pow x={1400} y={300} text="9 YEARS" t={f - 6} size={64} hold={tg} />
			<Pow x={1400} y={300} text="DELETED" t={f - tg} size={64} c="#ff3b4e" />
		</Scene>
	);
};
/* 131 «Your photos from every birthday since second grade have someone missing in them.» */
const S131: React.FC = () => {
	const {f, w} = useB();
	const tm = w('131', 'missing');
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.25], [120, 960, 540, 1.0]])} c="#2a2a3a" words={false}>
			{[0, 1, 2, 3, 4].map((i) => (
				<Polaroid key={i} x={360 + i * 300} y={500 + (i % 2) * 60} rot={(i - 2) * 5} s={0.95 * pop(f - i * 5)} kind="kai" gap={f > tm + i * 4} />
			))}
			{['2ND', '3RD', '4TH', '5TH', '6TH'].map((t, i) => (
				<text key={i} x={360 + i * 300} y={720 + (i % 2) * 60} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={900} fill="#fff" opacity={pop(f - i * 5)}>
					{t} GRADE
				</text>
			))}
		</Void>
	);
};
/* 132 «A gap where a person should be.» */
const S132: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.0], [dur, 1040, 520, 1.6]])} c="#2a2a3a" words={false}>
			<Polaroid x={960} y={540} s={2.6} kind="kai" gap />
		</Void>
	);
};
/* 133 «You try to fix it. You say, Kai is my best friend.» */
const S133: React.FC = () => {
	const {f, w} = useB();
	const tk = w('133', 'kai');
	return (
		<Scene cam={camCut(f, [[0, 960, 560, 1.2], [tk - 2, 860, 520, 1.7]])} bg="#1d2550" light={{night: true, o: 0.5}} set={<HeroRoom f={f} />}>
			<Hero x={860} pose={f > tk ? P.shout(f) : gesture('handsOnHead', idle(f, 1), 1, f)} faceTurn={0.4} mouth="open" expr="worried" lidBase={0} />
			<Bubble x={960} y={290} w={bw('KAI IS MY BEST FRIEND!')} h={100} t={f - tk} tail={[-60, 120]}>
				{say('KAI IS MY BEST FRIEND!')}
			</Bubble>
		</Scene>
	);
};
/* 134 «But Kai doesn't appear. Because the power only works on lies.» */
const S134: React.FC = () => {
	const {f, w} = useB();
	const tb = w('134', 'because');
	if (f < tb - 4)
		return (
			<Scene cam={camK(f, [[0, 1150, 600, 1.5], [tb, 1150, 600, 1.7]])} bg="#1d2550" light={{night: true, o: 0.5}} set={<HeroRoom f={f} />}>
				<Hero x={760} pose={gesture('presentF', idle(f, 1), 1, f)} faceTurn={0.6} look={[1, 0]} expr="worried" />
				<rect x={1060} y={560} width={180} height={340} fill="none" stroke="#9aa3b5" strokeWidth={4} strokeDasharray="12 12" />
				<Pow x={1150} y={460} text="..." t={f - 2} size={80} c="#fff" hold={999} />
				<Pow x={1350} y={820} text="cricket" t={(f % 30) - 2} size={26} c="#8fd06a" hold={20} />
			</Scene>
		);
	return (
		<Void cam={camK(f, [[tb - 4, 960, 540, 1.2], [tb + 60, 960, 520, 1.4]])}>
			<Title t={f - tb + 2} lines={['THE POWER ONLY', 'WORKS ON LIES']} y={300} size={100} c="#ff3b4e" />
		</Void>
	);
};
/* 135 «And that sentence was true. It was always true.» */
const S135: React.FC = () => {
	const {f, w} = useB();
	const tt = w('135', 'true');
	const ta = w('135', 'always');
	return (
		<Void cam={camCut(f, [[0, 960, 540, 1.3], [ta - 2, 960, 520, 1.1]])} c="#0a3a24">
			<Bubble x={960} y={420} w={bw('KAI IS MY BEST FRIEND.', 54)} h={130} t={f}>
				{say('KAI IS MY BEST FRIEND.', 54)}
			</Bubble>
			<TruthStamp x={1300} y={560} t={f - tt} />
			<Title t={f - ta} lines={['ALWAYS TRUE']} y={760} size={80} c="#8fe0b0" />
		</Void>
	);
};
/* 136 «You just lied the other way. For the first time, you understand how the power really works.» */
const S136: React.FC = () => {
	const {f, w} = useB();
	const tf = w('136', 'first');
	if (f < tf - 4)
		return (
			<Void cam={camK(f, [[0, 960, 540, 1.1], [tf, 960, 540, 1.3]])}>
				<Bubble x={960} y={420} w={bw("I DON'T EVEN KNOW WHO YOU ARE", 44)} h={110} t={f}>
					{say("I DON'T EVEN KNOW WHO YOU ARE", 44)}
				</Bubble>
				<LieStamp x={1350} y={560} t={f - 6} text="THE LIE" />
				<path d={`M600,700 Q960,${900 + Math.sin(f / 5) * 20} 1320,700`} stroke="#fff" strokeWidth={8} fill="none" markerEnd="" />
				<Pow x={960} y={820} text="↺ THE OTHER WAY" t={f - 10} size={50} c="#fff" hold={999} />
			</Void>
		);
	return (
		<Void cam={camK(f, [[tf - 4, 960, 540, 1.6], [tf + 90, 960, 520, 1.2]])}>
			<Hero x={960} pose={gesture('think', idle(f, 1), 1, f)} faceTurn={0.1} mouth="flat" lidBase={0.2} />
			<Bulb x={1060} y={330} t={f - tf - 10} />
		</Void>
	);
};
/* 137 «It doesn't give you what you want.» */
const S137: React.FC = () => {
	const {f} = useB();
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.2], [60, 960, 540, 1.35]])}>
			<Hero x={760} pose={reach(idle(f, 1), 'F', [160, -120], 1)} faceTurn={0.6} look={[1, -0.5]} expr="sad" />
			<g transform={`translate(${1200 + f * 4},${380 - f * 2})`}>
				<path d="M0,30 C-50,-10 -40,-60 0,-30 C40,-60 50,-10 0,30 Z" fill="#ff6a8a" transform="scale(2)" />
			</g>
			<Title t={f - 2} lines={["IT DOESN'T GIVE YOU", 'WHAT YOU WANT']} y={60} size={72} />
		</Void>
	);
};
/* 138 «It gives you what you say.» */
const S138: React.FC = () => {
	const {f, w} = useB();
	const ts = w('138', 'say');
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.2], [50, 960, 520, 1.45]])}>
			<Hero x={760} pose={P.present(f)} faceTurn={0.6} mouth="open" />
			{f < ts + 10 ? (
				<Bubble x={1180} y={420} w={260} h={100} t={f}>
					{say('"CAR"')}
				</Bubble>
			) : (
				<Car x={1250} y={800} s={0.7} f={f} shiny c="#ff2a3c" />
			)}
			<Sparks x={1200} y={600} t={f - ts - 10} r={260} />
			<Title t={f - ts} lines={['IT GIVES YOU WHAT YOU SAY']} y={60} size={72} c="#ff3b4e" />
		</Void>
	);
};
/* 139 «And you can't take back a lie with the truth.» */
const S139: React.FC = () => {
	const {f, w} = useB();
	const tt = w('139', 'truth');
	const x = f < tt ? 400 + f * 12 : 400 + tt * 12 - (f - tt) * 14;
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.1], [70, 960, 540, 1.25]])}>
			<g transform="translate(1250,540)">
				<rect x={-60} y={-300} width={120} height={600} rx={20} fill="#ff2a3c" />
				<text y={10} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#fff" transform="rotate(-90)">
					LIE
				</text>
			</g>
			<g transform={`translate(${Math.min(x, 1100)},540) rotate(${f > tt ? (f - tt) * -8 : 0})`}>
				<rect x={-120} y={-50} width={240} height={100} rx={50} fill="#3aa37a" />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#fff">
					TRUTH
				</text>
			</g>
			<Pow x={1150} y={360} text="BONK" t={f - tt} size={60} />
		</Void>
	);
};
/* 140 «Only with another lie.» */
const S140: React.FC = () => {
	const {f} = useB();
	return (
		<Void cam={shake(camK(f, [[0, 960, 540, 1.4], [40, 960, 540, 1.1]]), f, 20, 14)}>
			<g transform={`translate(${Math.min(1100, 300 + f * 40)},540)`}>
				<rect x={-110} y={-50} width={220} height={100} rx={50} fill="#ff2a3c" />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#fff">
					LIE
				</text>
			</g>
			<g transform={`translate(1250,540) rotate(${f > 20 ? (f - 20) * 6 : 0}) translate(${f > 20 ? (f - 20) * 20 : 0},${f > 20 ? -(f - 20) * 10 : 0})`}>
				<rect x={-60} y={-300} width={120} height={600} rx={20} fill="#ff2a3c" />
			</g>
			<Title t={f - 2} lines={['ONLY WITH', 'ANOTHER LIE']} y={60} size={84} c="#ff3b4e" />
		</Void>
	);
};
/* bedroom at night with Biscuit */
const Night: React.FC<{cam: any; children?: React.ReactNode; hero?: Partial<React.ComponentProps<typeof Hero>>}> = ({cam, children, hero}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#1d2550" light={{night: true, x: 70, y: 20, o: 0.55}} set={<HeroRoom f={f} />}>
			<Bed x={860} />
			<Hero x={760} seat={720} pose={{...P.sitDesk(f), armF: [60, 50], armB: [40, 60]}} faceTurn={0.5} look={[1, 0.5]} expr="sad" {...hero} />
			<Dog x={1010} f={f} mode="sit" facing={-1} s={0.85} look={0.5} tongue={false} />
			{children}
		</Scene>
	);
};
/* 141 «So you sit on your bed with Biscuit's head on your knee.» */
const S141: React.FC = () => {
	const {f, dur} = useB();
	return <Night cam={camK(f, [[0, 960, 560, 1.0], [dur, 880, 640, 1.5]])} />;
};
/* 142 «And you think, what lie could bring Kai back?» */
const S142: React.FC = () => {
	const {f, w} = useB();
	const tk = w('142', 'kai');
	return (
		<Night cam={camK(f, [[0, 860, 520, 1.4], [80, 900, 480, 1.6]])} hero={{pose: gesture('think', {...P.sitDesk(f)}, 1, f)}}>
			<Bubble x={1150} y={300} w={360} h={220} t={f - 6} thought tail={[-260, 180]}>
				<g opacity={f > tk ? 1 : 0.3}>
					<circle cx={-60} cy={-20} r={40} fill="#000" />
					<path d="M-100,-40 q40,-30 80,0 v-12 q-40,-26 -80,0 z" fill="#f2b21c" />
					<rect x={-90} y={20} width={60} height={60} rx={14} fill="#2f8fe0" />
				</g>
				<text x={70} y={40} textAnchor="middle" fontSize={120} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
					?
				</text>
			</Bubble>
		</Night>
	);
};
/* 143 «Kai remembers me. That would make him remember.» */
const S143: React.FC = () => {
	const {f, w} = useB();
	return (
		<Night cam={camK(f, [[0, 900, 480, 1.6], [80, 960, 480, 1.4]])} hero={{expr: 'normal', mouth: 'open', lidBase: 0.2}}>
			<Bubble x={1150} y={280} w={bw('"KAI REMEMBERS ME."', 40)} h={100} t={f - 2} thought tail={[-260, 180]}>
				{say('"KAI REMEMBERS ME."', 40)}
			</Bubble>
			<Bulb x={760} y={330} t={f - w('143', 'that')} />
		</Night>
	);
};
/* 144 «But then what? He'd remember every lie.» */
const S144: React.FC = () => {
	const {f, w} = useB();
	const te = w('144', 'every');
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.6], [70, 960, 540, 1.15]])}>
			<Actor who="kai" x={960} pose={gesture('armsCrossed', idle(f, 3), 1, f)} expr="angry" faceTurn={0.1} />
			{Array.from({length: 8}).map((_, i) => (
				<LieStamp key={i} x={960 + Math.cos(i * 0.8) * 500} y={480 + Math.sin(i * 0.8) * 260} t={f - te - i * 3} />
			))}
			<Pow x={960} y={200} text="BUT THEN WHAT?" t={f - 2} size={60} c="#fff" hold={te} />
		</Void>
	);
};
/* 145 «The fake test, the fake dad, the fake summer.» */
const S145: React.FC = () => {
	const {f, w} = useB();
	const items: [string, number][] = [
		['TEST', w('145', 'test')],
		['DAD', w('145', 'dad')],
		['SUMMER', w('145', 'summer')],
	];
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.1], [80, 960, 540, 1.25]])}>
			{items.map(([t, at], i) => (
				<g key={i} transform={`translate(${480 + i * 480},520) scale(${pop(f - at + 4)})`}>
					<rect x={-190} y={-140} width={380} height={280} rx={24} fill="#fbf8ef" />
					{i === 0 ? <TestPaper x={0} y={-10} s={0.5} grade="100" t={20} /> : null}
					{i === 1 ? <Car x={0} y={60} s={0.45} f={f} c="#ff2a3c" /> : null}
					{i === 2 ? <Polaroid x={0} y={-10} s={0.8} kind="fire" /> : null}
					<LieStamp x={40} y={80} t={f - at - 4} text="FAKE" />
				</g>
			))}
		</Void>
	);
};
/* 146 «He'd remember that his best friend erased him from the world.» */
const S146: React.FC = () => {
	const {f, w} = useB();
	const te = w('146', 'erased');
	const wipe = lin(f, te, te + 30, 0, 1);
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.3], [90, 960, 520, 1.6]])} c="#3a0a14">
			<Actor who="kai" x={960} pose={P.slump(f)} expr="sad" faceTurn={0.1} />
			<rect x={760} y={240 + 0} width={400} height={700 * wipe} fill="#3a0a14" />
			{f > te ? (
				<g transform={`translate(${1120},${240 + 700 * wipe}) rotate(-20)`}>
					<rect x={-60} y={-30} width={140} height={60} rx={10} fill="#ff8fc0" />
					<rect x={-60} y={-30} width={50} height={60} rx={10} fill="#3a6fd2" />
				</g>
			) : null}
			<Title t={f - te} lines={['ERASED']} y={80} size={110} c="#ff3b4e" />
		</Void>
	);
};
/* 147 «You'd get him back and lose him at the same time.» */
const S147: React.FC = () => {
	const {f, w} = useB();
	const tl = w('147', 'lose');
	const kw = mover(f, tl, tl + 50, 1150, 2200, {seed: 2});
	return (
		<Void cam={camCut(f, [[0, 960, 540, 1.3], [tl - 2, 1100, 540, 1.15]])}>
			<Hero x={760} pose={f < tl ? P.cheer(f) : gesture('wave', idle(f, 1), 0.6, f)} mouth={f < tl ? 'smile' : 'frown'} expr={f < tl ? 'normal' : 'sad'} faceTurn={0.6} lidBase={0.2} />
			<Actor who="kai" x={kw.x} facing={f > tl ? 1 : -1} pose={f > tl ? kw.pose : P.cheer(f)} vx={kw.vx} bob={kw.bob} mouth={f < tl ? 'smile' : 'frown'} />
			<Pow x={960} y={240} text="BACK" t={f - 2} size={70} c="#8fe0b0" hold={tl - 8} />
			<Pow x={1300} y={240} text="...GONE" t={f - tl} size={70} c="#ff3b4e" />
		</Void>
	);
};
/* 148 «Unless. Unless you tell one more lie.» */
const S148: React.FC = () => {
	const {f, w} = useB();
	const to = w('148', 'one');
	return (
		<Night cam={camCut(f, [[0, 760, 480, 2.2], [to - 2, 900, 540, 1.3]])} hero={{expr: 'wide', lidBase: 0, pose: {...P.sitDesk(f), head: -12}}}>
			<Bulb x={760} y={300} t={f - 6} />
			<Pow x={1150} y={300} text="ONE MORE LIE" t={f - to} size={64} c="#ff3b4e" />
		</Night>
	);
};
/* 149 «The biggest one you've ever told.» */
const S149: React.FC = () => {
	const {f} = useB();
	return (
		<Void cam={camK(f, [[0, 960, 540, 2.0], [50, 960, 540, 1.0]])}>
			<g transform={`translate(960,560) scale(${0.3 + Math.min(1.3, f / 30)})`}>
				<rect x={-200} y={-80} width={400} height={160} rx={80} fill="#ff2a3c" stroke="#fff" strokeWidth={10} />
				<text y={30} textAnchor="middle" fontSize={90} fontFamily={RB} fontWeight={900} fill="#fff">
					LIE
				</text>
			</g>
			<Title t={f - 4} lines={['THE BIGGEST ONE']} y={60} size={90} />
		</Void>
	);
};
/* 150 «One that undoes all the others.» — rewind */
const S150: React.FC = () => {
	const {f} = useB();
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.1], [50, 960, 540, 1.3]])} over={<AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px ${6 + (f % 3)}px)`}} />}>
			<g transform={`translate(960,520) rotate(${-f * 8})`}>
				<circle r={200} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray="60 30" />
			</g>
			<text x={960} y={560} textAnchor="middle" fontSize={120} fontFamily={RB} fontWeight={900} fill="#fff">
				◀◀
			</text>
			{['$', 'CAR', '100', 'PIZZA', 'PARIS', 'CEO'].map((t, i) => (
				<text key={i} x={1700 - ((f * 30 + i * 300) % 2200)} y={260 + (i % 3) * 300} fontSize={60} fontFamily={RB} fontWeight={900} fill="#fff" opacity={0.6}>
					{t}
				</text>
			))}
			<Title t={f - 2} lines={['UNDO EVERYTHING']} y={60} size={80} c="#ff3b4e" />
		</Void>
	);
};
/* 151 «You'd lose everything. The money.» */
const S151: React.FC = () => {
	const {f, w} = useB();
	const tm = w('151', 'money');
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.2], [60, 960, 540, 1.0]])}>
			<Hero x={960} pose={P.slump(f)} expr="sad" faceTurn={0.1} />
			{Array.from({length: 24}).map((_, i) => {
				const t = Math.max(0, f - tm);
				return <Bill key={i} x={960 + (random('m' + i) - 0.5) * 300 + t * (random('mx' + i) - 0.5) * 30} y={500 - t * (4 + random('my' + i) * 8)} rot={t * 10 + i * 30} s={1.2} />;
			})}
			<Title t={f - 2} lines={['LOSE EVERYTHING']} y={60} size={84} />
		</Void>
	);
};
/* 152 «Zoe's memories. The basketball player's birthday visit.» */
const S152: React.FC = () => {
	const {f, w} = useB();
	const tb = w('152', 'basketball');
	return (
		<Void cam={camCut(f, [[0, 760, 540, 1.3], [tb - 2, 1150, 540, 1.3]])}>
			<g opacity={lin(f, 10, 40, 1, 0.1)}>
				<Polaroid x={600} y={500} rot={-6} s={1.2} kind="lake" />
				<Polaroid x={880} y={520} rot={5} s={1.2} kind="stars" />
			</g>
			<g opacity={lin(f, tb + 10, tb + 50, 1, 0.1)}>
				<Actor who="player" x={1250} s={1.3} pose={P.cheer(f)} mouth="smile" />
			</g>
		</Void>
	);
};
/* 153 «Your dad's company. Biscuit.» */
const S153: React.FC = () => {
	const {f, w} = useB();
	const tb = w('153', 'biscuit');
	if (f < tb - 4)
		return (
			<Scene cam={camK(f, [[0, 960, 540, 1.2], [tb, 960, 540, 1.1]])} bg="#8fc8ee" set={<Office f={f} />}>
				<g opacity={lin(f, 4, 30, 1, 0.1)}>
					<Actor who="dadRich" x={960} pose={P.present(f)} mouth="smile" />
				</g>
			</Scene>
		);
	return (
		<Void cam={camK(f, [[tb - 4, 960, 600, 1.6], [tb + 60, 960, 600, 1.9]])} c="#4a0810" words={false}>
			<Dog x={900} f={f} mode="sit" />
			<Pow x={1150} y={360} text="...BISCUIT." t={f - tb} size={60} c="#fff" hold={999} />
		</Void>
	);
};
/* 154 «You look down at biscuit. He wags his tail.» */
const S154: React.FC = () => {
	const {f, w} = useB();
	return (
		<Night cam={camCut(f, [[0, 800, 480, 2.0], [w('154', 'he') - 2, 1050, 660, 1.9]])} hero={{pose: {...P.sitDesk(f), head: 24}, look: [0.6, 1]}}>
			<Pow x={1180} y={600} text="wag wag" t={f - w('154', 'wags')} size={40} c="#ffd34a" hold={999} />
		</Night>
	);
};
/* 155 «He doesn't know what you're about to do.» */
const S155: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Night cam={camK(f, [[0, 1100, 640, 2.3], [dur, 1100, 640, 2.6]])}>
			<Pow x={1250} y={540} text="♥" t={f - 10} size={50} c="#ff6a8a" hold={999} />
		</Night>
	);
};
/* 156 «Of all the lies, he's the only one that made everyone happier.» */
const S156: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 600, 1.4], [dur, 960, 580, 1.05]])} bg="#f6d9b0" light={{x: 30, y: 10, o: 0.6, c: '255,210,150'}} set={<LivingRoom f={f} />} over={<AbsoluteFill style={{background: 'rgba(255,180,90,.15)', mixBlendMode: 'multiply'}} />}>
			<Actor who="mom" x={600} pose={P.laugh(f)} mouth="smile" />
			<Actor who="dad" x={1300} facing={-1} pose={P.laugh(f + 4)} mouth="smile" />
			<Actor who="emma" x={760} s={0.72} pose={P.cheer(f)} mouth="smile" />
			<Hero x={1120} pose={P.cheer(f + 9)} mouth="smile" facing={-1} />
			<Dog x={960} f={f} mode="sit" />
			{[0, 1, 2, 3, 4].map((i) => (
				<Pow key={i} x={700 + i * 130} y={420 - ((f * 2 + i * 40) % 200)} text="♥" t={10} size={46} c="#ff6a8a" hold={999} />
			))}
			<Tag x={960} y={150} t={f - 4} text="the only GOOD lie" size={54} />
		</Scene>
	);
};
/* 157 «And he has to go too. You walk downstairs.» */
const S157: React.FC = () => {
	const {f, w} = useB();
	const tw = w('157', 'walk');
	if (f < tw - 4)
		return (
			<Night cam={camK(f, [[0, 920, 600, 1.7], [tw, 920, 600, 1.9]])} hero={{pose: P.hug(f), lidBase: 0.8}}>
				<Pow x={960} y={360} text="sorry, buddy" t={f - 6} size={44} c="#fff" hold={999} />
			</Night>
		);
	const hw = mover(f, tw - 4, tw + 60, 300, 1100, {seed: 1});
	return (
		<Scene cam={camK(f, [[tw - 4, 500, 520, 1.3], [tw + 60, 1000, 640, 1.3]])} bg="#2a2f55" light={{night: true, o: 0.5}} set={<LivingRoom f={f} night />}>
			{Array.from({length: 8}).map((_, i) => (
				<rect key={i} x={100 + i * 120} y={420 + i * 60} width={140} height={20} fill="#4a3a5a" />
			))}
			<Hero x={hw.x} floor={Math.min(900, 420 + (hw.x - 160) * 0.5)} pose={hw.pose} vx={hw.vx} bob={hw.bob} expr="sad" faceTurn={0.5} />
		</Scene>
	);
};
/* 158 «Your dad is on the phone in his office.» */
const S158: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 1100, 560, 1.2], [dur, 960, 560, 1.6]])} bg="#050820" light={{night: true, o: 0.6}} set={<Office f={f} night />}>
			<Actor who="dadRich" x={900} pose={P.phoneEar(f)} faceTurn={0.3} mouth={f % 20 < 10 ? 'open' : 'flat'} lidBase={0.5} />
			<BossDesk x={960} f={f} />
			<g opacity={0.6}>
				<Hero x={1650} pose={idle(f, 1)} facing={-1} expr="sad" />
			</g>
		</Scene>
	);
};
/* 159 «At midnight. Again.» */
const S159: React.FC = () => {
	const {f, w} = useB();
	return (
		<Void cam={camK(f, [[0, 960, 540, 1.4], [44, 960, 540, 1.1]])} c="#1d2a5a" words={false}>
			<g transform="translate(960,520)">
				<circle r={240} fill="#fbf8ef" stroke="#2a2030" strokeWidth={14} />
				{Array.from({length: 12}).map((_, i) => (
					<line key={i} x1={Math.sin((i / 12) * Math.PI * 2) * 200} y1={-Math.cos((i / 12) * Math.PI * 2) * 200} x2={Math.sin((i / 12) * Math.PI * 2) * 222} y2={-Math.cos((i / 12) * Math.PI * 2) * 222} stroke="#2a2030" strokeWidth={8} />
				))}
				<line x1={0} y1={0} x2={0} y2={-150} stroke="#2a2030" strokeWidth={14} strokeLinecap="round" />
				<line x1={0} y1={0} x2={Math.sin(lin(f, 0, 20, -1, 0)) * 190} y2={-Math.cos(lin(f, 0, 20, -1, 0)) * 190} stroke="#ff2a3c" strokeWidth={8} strokeLinecap="round" />
			</g>
			<Pow x={1350} y={300} text="AGAIN." t={f - w('159', 'again')} size={80} c="#ff3b4e" />
		</Void>
	);
};
/* 160 «Emma is asleep on the couch, waiting up for him.» */
const S160: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 640, 1.3], [dur, 900, 680, 1.7]])} bg="#2a2f55" light={{night: true, o: 0.6}} set={<LivingRoom f={f} night />}>
			<Couch x={900} c="#4a5590" />
			<g transform="translate(760,720) rotate(-82)">
				<Actor who="emma" x={0} floor={157 * 0.72} s={0.72} pose={{lean: 0, head: 0, armB: [10, 10], armF: [30, 60], legB: [0, 0], legF: [4, 0]}} lidBase={1} faceTurn={0.2} shadow={false} />
			</g>
			<Pow x={820} y={540} text="z z" t={f % 50} size={44} c="#fff" hold={40} />
			<Tag x={1300} y={300} t={f - 6} text="waiting for dad" size={46} />
		</Scene>
	);
};
/* 161 «Your mom is reading the news on her phone about a family who woke up rich and doesn't know why.» */
const S161: React.FC = () => {
	const {f, w} = useB();
	const tn = w('161', 'news');
	return (
		<Scene cam={camCut(f, [[0, 960, 560, 1.3], [tn + 6, 1250, 500, 1.4]])} bg="#2a2a48" light={{night: true, o: 0.6}} set={<Kitchen night />}>
			<Actor who="mom" x={900} pose={reach(idle(f, 3), 'F', [80, -110], 1)} faceTurn={0.4} look={[1, 0]} lidBase={0.3} />
			<PhoneFrame x={1300} y={500} s={0.7 * pop(f - tn)} tilt={4}>
				<rect x={-182} y={-350} width={364} height={700} fill="#fbf8ef" />
				<rect x={-182} y={-350} width={364} height={90} fill="#d23b3b" />
				<text y={-290} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={900} fill="#fff">
					NEWS
				</text>
				<text x={-160} y={-200} fontSize={28} fontFamily={RB} fontWeight={900} fill="#2a2030">
					FAMILY WAKES UP
				</text>
				<text x={-160} y={-160} fontSize={28} fontFamily={RB} fontWeight={900} fill="#2a2030">
					RICH. NOBODY
				</text>
				<text x={-160} y={-120} fontSize={28} fontFamily={RB} fontWeight={900} fill="#2a2030">
					KNOWS WHY.
				</text>
				<rect x={-160} y={-80} width={320} height={200} fill="#9fd2f0" />
				<text y={40} textAnchor="middle" fontSize={80} fontFamily={RB} fontWeight={900} fill="#2a7a2a">
					$$$
				</text>
			</PhoneFrame>
		</Scene>
	);
};
/* 162 «You hug her. She asks what's wrong.» */
const S162: React.FC = () => {
	const {f, w} = useB();
	const ts = w('162', 'she');
	const hw = mover(f, 0, 14, 400, 760, {run: true});
	return (
		<Scene cam={camCut(f, [[0, 840, 560, 1.4], [ts - 2, 860, 520, 1.8]])} bg="#2a2a48" light={{night: true, o: 0.6}} set={<Kitchen night />}>
			<Actor who="mom" x={900} facing={-1} pose={blend(idle(f, 3), P.hug(f), env(f, 14, 999, 8, 1))} faceTurn={0.4} expr="worried" />
			<Hero x={hw.x} pose={blend(hw.pose, P.hug(f), env(f, 12, 999, 8, 1))} lidBase={0.8} expr="sad" />
			<Bubble x={1150} y={330} w={bw("WHAT'S WRONG, HONEY?", 36)} h={90} t={f - ts} tail={[-140, 120]}>
				{say("WHAT'S WRONG, HONEY?", 36)}
			</Bubble>
		</Scene>
	);
};
/* 163 «You almost say nothing.» */
const S163: React.FC = () => {
	const {f} = useB();
	return (
		<Scene cam={camK(f, [[0, 780, 500, 1.9], [50, 780, 490, 2.3]])} bg="#2a2a48" light={{night: true, o: 0.6}} set={<Kitchen night />}>
			<Actor who="mom" x={1000} facing={-1} pose={idle(f, 3)} expr="worried" />
			<Hero x={780} pose={gesture('touchFace', idle(f, 1), 1, f)} armOver mouth="flat" lidBase={0.4} expr="sad" />
			<Bubble x={980} y={320} w={bw('"NOTHING..."')} h={100} t={f - 6} tail={[-140, 120]}>
				{say('"NOTHING..."', 44, '#9aa3b5')}
			</Bubble>
		</Scene>
	);
};
/* 164 «You stop yourself. You've learned that much.» */
const S164: React.FC = () => {
	const {f, w} = useB();
	const tl = w('164', 'learned');
	return (
		<Scene cam={camCut(f, [[0, 900, 520, 1.6], [tl - 2, 900, 560, 1.25]])} bg="#2a2a48" light={{night: true, o: 0.6}} set={<Kitchen night />}>
			<Actor who="mom" x={1000} facing={-1} pose={P.hug(f)} mouth="smile" lidBase={0.6} />
			<Hero x={780} pose={P.hug(f)} lidBase={0.6} mouth="flat" />
			<g transform={`translate(900,300) scale(${pop(f - 2)})`}>
				<rect x={-140} y={-60} width={280} height={110} rx={55} fill="#fbf8ef" />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#9aa3b5">
					NOTHING
				</text>
				<line x1={-130} y1={0} x2={-130 + 260 * Math.min(1, Math.max(0, (f - 8) / 8))} y2={0} stroke="#ff2a3c" strokeWidth={14} />
			</g>
		</Scene>
	);
};
/* 165 «Then you go back to your room, look at the ceiling, and tell the biggest lie of your life.» */
const S165: React.FC = () => {
	const {f, w} = useB();
	const tc = w('165', 'ceiling');
	const tb = w('165', 'biggest');
	return (
		<Scene cam={camCut(f, [[0, 960, 600, 1.15], [tc - 2, 760, 680, 1.9], [tb - 2, 760, 620, 1.4]])} bg="#1d2550" light={{night: true, o: 0.6}} set={<HeroRoom f={f} />}>
			<Bed x={860} />
			<g transform="translate(620,700) rotate(-84)">
				<Actor who="hero" x={0} floor={157} pose={{lean: 0, head: 0, armB: [10, 10], armF: [6, 10], legB: [0, 0], legF: [0, 0]}} faceTurn={0} lidBase={0.1} look={[0, -1]} shadow={false} />
			</g>
			<rect x={600} y={740} width={560} height={90} rx={30} fill="#5a3a6a" />
			<Dog x={1100} floor={900} s={0.75} f={f} mode="lie" facing={-1} tongue={false} />
			<Title t={f - tb} lines={['THE BIGGEST LIE', 'OF YOUR LIFE']} y={60} size={78} c="#ff3b4e" />
		</Scene>
	);
};
/* 166 «I've never told a single lie.» — everything spins and whites out */
const S166: React.FC = () => {
	const {f, dur} = useB();
	const spin = lin(f, 20, dur, 0, 1);
	return (
		<Void cam={camK(f, [[0, 960, 500, 1.6], [dur, 960, 540, 0.6]])} over={<AbsoluteFill style={{background: '#fff', opacity: lin(f, dur - 25, dur, 0, 1)}} />}>
			<g transform={`rotate(${spin * spin * 720} 960 540)`}>
				<Hero x={960} pose={P.shout(f)} mouth="open" faceTurn={0.1} lidBase={0} />
				{Array.from({length: 12}).map((_, i) => (
					<LieStamp key={i} x={960 + Math.cos(i) * (300 + spin * 700)} y={540 + Math.sin(i) * (200 + spin * 500)} t={10 + (i % 4)} />
				))}
			</g>
			<Pow x={960} y={240} text="I'VE NEVER TOLD A SINGLE LIE." t={f - 2} size={60} c="#fff" hold={60} />
		</Void>
	);
};

export const SHOTS4: ShotDef[] = [
	{at: '111', C: S111, whip: true},
	{at: '111', off: wordOff('111', 'realize'), C: S111, whip: true},
	{at: '112', C: S112, whip: true},
	{at: '113', C: S113, whip: true},
	{at: '114', C: S114, whip: true},
	{at: '115', C: S115},
	{at: '116', C: S116},
	{at: '117', C: S117},
	{at: '118', C: S118},
	{at: '119', C: S119},
	{at: '120', C: S120, whip: true},
	{at: '121', C: S121, whip: true},
	{at: '122', C: S122},
	{at: '123', C: S123},
	{at: '124', C: S124},
	{at: '125', C: S125},
	{at: '126', C: S126},
	{at: '127', C: S127, whip: true},
	{at: '128', C: S128, whip: true},
	{at: '129', C: S129, whip: true},
	{at: '130', C: S130, whip: true},
	{at: '131', C: S131, whip: true},
	{at: '132', C: S132},
	{at: '133', C: S133, whip: true},
	{at: '134', C: S134},
	{at: '134', off: wordOff('134', 'because'), C: S134},
	{at: '135', C: S135},
	{at: '136', C: S136},
	{at: '136', off: wordOff('136', 'first'), C: S136},
	{at: '137', C: S137},
	{at: '138', C: S138},
	{at: '139', C: S139},
	{at: '140', C: S140},
	{at: '141', C: S141, whip: true},
	{at: '142', C: S142},
	{at: '143', C: S143},
	{at: '144', C: S144, whip: true},
	{at: '145', C: S145},
	{at: '146', C: S146},
	{at: '147', C: S147},
	{at: '148', C: S148, whip: true},
	{at: '149', C: S149, whip: true},
	{at: '150', C: S150},
	{at: '151', C: S151},
	{at: '152', C: S152},
	{at: '153', C: S153},
	{at: '153', off: wordOff('153', 'biscuit'), C: S153},
	{at: '154', C: S154, whip: true},
	{at: '155', C: S155},
	{at: '156', C: S156, whip: true},
	{at: '157', C: S157, whip: true},
	{at: '157', off: wordOff('157', 'walk'), C: S157, whip: true},
	{at: '158', C: S158, whip: true},
	{at: '159', C: S159},
	{at: '160', C: S160, whip: true},
	{at: '161', C: S161, whip: true},
	{at: '162', C: S162},
	{at: '163', C: S163},
	{at: '164', C: S164},
	{at: '165', C: S165, whip: true},
	{at: '166', C: S166},
];
