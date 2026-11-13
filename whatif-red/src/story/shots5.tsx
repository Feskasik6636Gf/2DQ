import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Pose} from '../engine/Stickman';
import {blend, gesture, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Extra} from '../kit/kit';
import {Bubble, Cite} from '../kit/ui';
import {Kitchen} from '../kit/sets';
import {Bench, Cage, ClassRoom, Couch, FrontDesk, HeroRoom, HouseFront, Lab, LivingRoom, Park, Puppy, RedVoid, SchoolDesk, ShelterFront, ShelterInside} from './places';
import {Bulb, Campfire, Classmates, Coin, Polaroid} from './bits';
import {Dog, Flash, Hero, LieStamp, Magic, P, Pow, Scene, Sparks, Tag, Title, camCut, camK, env, ez, jump, lin, mover, pop, shake, useB, wordOff} from './lib';
import {Gaming, Monitor} from './bits';

const SEAT = 795;
const RB = "'Rubik', sans-serif";
const say = (text: string, size = 44, c = '#2a2030') => (
	<text y={size * 0.36} textAnchor="middle" fontSize={size} fontFamily={RB} fontWeight={900} fill={c}>
		{text}
	</text>
);
const bw = (text: string, size = 44) => text.length * size * 0.62 + 60;
const TruthStamp: React.FC<{x: number; y: number; t: number; text?: string}> = ({x, y, t, text = 'TRUTH ✓'}) => {
	if (t < 0) return null;
	const k = pop(t);
	return (
		<g transform={`translate(${x},${y}) rotate(-10) scale(${0.4 + 0.6 * k})`}>
			<rect x={-140} y={-40} width={280} height={80} rx={12} fill="#3aa37a" stroke="#fff" strokeWidth={6} />
			<text y={20} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#fff">
				{text}
			</text>
		</g>
	);
};

/* the classroom again (day one, second time): Kai sits next to the hero */
const Class2: React.FC<{cam: any; children?: React.ReactNode; hero?: any; kai?: any; hollis?: any; hx?: number}> = ({cam, children, hero, kai, hollis, hx = 1050}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}} set={<ClassRoom f={f} />}>
			<Classmates f={f} xs={[180, 1500, 1740]} />
			<Actor who="kai" x={480} seat={800} pose={P.sitDesk(f + 7)} faceTurn={0.6} look={[1, 0]} {...kai} />
			<SchoolDesk x={540} />
			<Hero x={760} seat={SEAT} pose={P.sitDesk(f)} faceTurn={0.6} {...hero} />
			<SchoolDesk x={820} paper />
			<Actor who="hollis" x={hx} s={1.12} facing={-1} pose={gesture('armsCrossed', idle(f, 3), 1, f)} expr="angry" {...hollis} />
			{children}
		</Scene>
	);
};

/* 167 «Everything goes quiet. Where's your homework?» */
const S167: React.FC = () => {
	const {f, w} = useB();
	const tw = w('167', "where's");
	if (f < tw - 4)
		return (
			<AbsoluteFill style={{background: '#fff'}}>
				<Title t={f - 6} lines={['...']} y={420} size={140} c="#9aa3b5" />
			</AbsoluteFill>
		);
	return (
		<Class2 cam={shake(camK(f, [[tw - 4, 1080, 520, 2.0], [tw + 40, 1000, 560, 1.5]]), f, tw + 6, 14)} hollis={{pose: gesture('point', {...idle(f, 3), lean: 12}, 1, f), handF: 'point'}}>
			<Pow x={1050} y={320} text="WHERE'S YOUR HOMEWORK?!" t={f - tw} size={52} c="#fff" hold={60} />
			<Flash t={f - tw + 4} o={1} len={14} />
		</Class2>
	);
};
/* 168 «You look up. Mr. Hollis is standing over your desk.» */
const S168: React.FC = () => {
	const {f, w} = useB();
	return (
		<Class2 cam={camCut(f, [[0, 760, 560, 2.1], [w('168', 'mr') - 2, 950, 520, 1.3]])} hero={{expr: 'wide', lidBase: 0, pose: {...P.sitDesk(f), head: -16}}} hollis={{pose: {...idle(f, 3), lean: 14}}} hx={960}>
			<Pow x={760} y={330} text="?!" t={f - 2} size={90} c="#ff3b4e" />
		</Class2>
	);
};
/* 169 «It's that day again. The first day.» */
const S169: React.FC = () => {
	const {f, w} = useB();
	const n = Math.max(1, 12 - Math.floor(f / 3));
	return (
		<Scene cam={camK(f, [[0, 960, 540, 1.0], [70, 960, 540, 1.2]])} bg="#2a0508" light={false} set={<RedVoid f={f} c="#1d2a5a" words={false} />}>
			<g transform={`translate(960,520) rotate(${Math.sin(f / 2) * (n > 1 ? 6 : 0)})`}>
				<rect x={-220} y={-220} width={440} height={440} rx={30} fill="#fbf8ef" />
				<rect x={-220} y={-220} width={440} height={110} rx={30} fill="#d23b3b" />
				<text y={-145} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#fff">
					MONTH
				</text>
				<text y={130} textAnchor="middle" fontSize={200} fontFamily={RB} fontWeight={900} fill="#2a2030">
					{n}
				</text>
			</g>
			<Title t={f - w('169', 'first')} lines={['DAY ONE. AGAIN.']} y={60} size={80} c="#fff" />
		</Scene>
	);
};
/* 170 «Your homework isn't done. You were playing games until two in the morning.» */
const S170: React.FC = () => {
	const {f, w} = useB();
	const ty = w('170', 'you', 1);
	if (f < ty - 4)
		return (
			<Class2 cam={camK(f, [[0, 900, 720, 2.0], [ty, 900, 700, 2.2]])}>
				<g transform="translate(860,690)">
					<rect x={-70} y={-12} width={140} height={14} fill="#fbf8ef" />
					<text x={0} y={-24} textAnchor="middle" fontSize={22} fontFamily={RB} fontWeight={900} fill="#d23b3b">
						BLANK
					</text>
				</g>
			</Class2>
		);
	return (
		<Scene cam={camK(f, [[ty - 4, 900, 560, 1.4], [ty + 90, 900, 520, 1.7]])} bg="#101225" light={{night: true, o: 0.6}} set={<HeroRoom f={f} />}>
			<Gaming f={f} x={760} />
			<Monitor x={1060} f={f} />
			<Pow x={1300} y={300} text="2 AM" t={f - ty} size={70} c="#ff3b4e" />
		</Scene>
	);
};
/* 171 «And next to you, in the seat that was empty yesterday, is Kai, chewing a pen, rolling his eyes at you, like always.» */
const S171: React.FC = () => {
	const {f, w} = useB();
	const tk = w('171', 'kai');
	const tc = w('171', 'chewing');
	const tr = w('171', 'rolling');
	const roll = f > tr ? [Math.cos((f - tr) / 5), -0.8] : [0.6, 0];
	return (
		<Class2
			cam={camCut(f, [[0, 760, 560, 1.4], [tk - 2, 480, 520, 2.0], [tr - 2, 500, 500, 2.3], [tr + 50, 620, 560, 1.5]])}
			kai={{pose: reach(P.sitDesk(f), 'F', [50, -150], env(f, tc - 4, 999, 6, 1)), look: roll, faceTurn: 0.6, mouth: 'flat'}}
			hero={{look: [-1, 0], facing: -1, expr: f > tk ? 'wide' : 'normal', lidBase: f > tk ? 0 : 0.4}}
		>
			{f > tc - 4 ? <rect x={510} y={560 + Math.sin(f / 2) * 3} width={60} height={8} rx={4} fill="#3a6fd2" transform={`rotate(${-20 + Math.sin(f / 3) * 6} 540 564)`} /> : null}
			<Tag x={480} y={300} t={f - tk} text="KAI!!" size={60} c="#bfe3ff" />
			<Sparks x={480} y={560} t={f - tk} r={220} c="#bfe3ff" />
		</Class2>
	);
};
/* 172 «The whole class is waiting.» */
const S172: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Class2 cam={camK(f, [[0, 300, 560, 1.4], [dur, 1500, 560, 1.4]])} kai={{look: [1, 0]}} hero={{lidBase: 0.2}}>
			<Pow x={960} y={300} text="...tick... tock..." t={f - 4} size={50} c="#fff" hold={999} />
		</Class2>
	);
};
/* 173 «You open your mouth to say it.» */
const S173: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Class2 cam={camK(f, [[0, 760, 520, 1.8], [dur, 760, 500, 2.5]])} hero={{mouth: f > 10 ? 'open' : 'flat', lidBase: 0.3}}>
			<Bubble x={980} y={330} w={bw('MY DOG A—')} h={100} t={f - 30} tail={[-120, 120]}>
				{say('MY DOG A—')}
			</Bubble>
		</Class2>
	);
};
/* 174 «My dog ate it. And you don't.» */
const S174: React.FC = () => {
	const {f, w} = useB();
	const tn = w('174', "don't");
	return (
		<Class2 cam={camCut(f, [[0, 900, 520, 1.6], [tn - 2, 760, 520, 2.0]])} hero={{mouth: f > tn ? 'flat' : 'open', pose: gesture('touchFace', P.sitDesk(f), env(f, tn, 999, 6, 1), f), armOver: f > tn}}>
			<Bubble x={1000} y={320} w={bw('MY DOG ATE IT')} h={100} t={f - 2} tail={[-120, 120]}>
				{say('MY DOG ATE IT')}
				{f > tn ? <line x1={-200} y1={0} x2={-200 + 400 * Math.min(1, (f - tn) / 8)} y2={0} stroke="#ff2a3c" strokeWidth={14} /> : null}
			</Bubble>
			<Pow x={1250} y={460} text="NOPE." t={f - tn - 8} size={64} c="#3aa37a" />
		</Class2>
	);
};
/* 175 «I didn't do it, sir. I was playing games.» */
const S175: React.FC = () => {
	const {f, w} = useB();
	const tg = w('175', 'games');
	return (
		<Class2 cam={camCut(f, [[0, 760, 520, 1.9], [tg - 2, 900, 540, 1.4]])} hero={{mouth: 'open', lidBase: 0.2, expr: 'worried'}}>
			<Bubble x={1000} y={300} w={bw("I DIDN'T DO IT, SIR.", 40)} h={90} t={f - 2} tail={[-120, 120]}>
				{say("I DIDN'T DO IT, SIR.", 40)}
			</Bubble>
			<Bubble x={1050} y={420} w={bw('I WAS PLAYING GAMES.', 40)} h={90} t={f - tg + 10} tail={[-160, 100]}>
				{say('I WAS PLAYING GAMES.', 40)}
			</Bubble>
			<TruthStamp x={1350} y={560} t={f - tg - 4} />
		</Class2>
	);
};
/* 176 «I'm sorry. The class goes silent.» */
const S176: React.FC = () => {
	const {f, w} = useB();
	const ts = w('176', 'silent');
	return (
		<Class2 cam={camCut(f, [[0, 760, 520, 1.8], [w('176', 'the') - 2, 960, 560, 1.05]])} hero={{mouth: 'frown', expr: 'sad', lidBase: 0.3}} kai={{expr: 'wide', lidBase: 0, look: [1, 0]}}>
			<Bubble x={980} y={330} w={bw("I'M SORRY.")} h={100} t={f - 2} tail={[-120, 120]}>
				{say("I'M SORRY.")}
			</Bubble>
			<Pow x={1500} y={300} text="..." t={f - ts} size={100} c="#fff" hold={999} />
		</Class2>
	);
};
/* 177 «Nobody tells the truth about homework.» */
const S177: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Class2 cam={camK(f, [[0, 960, 560, 1.05], [dur, 960, 540, 1.25]])} kai={{expr: 'wide', mouth: 'open', lidBase: 0}}>
			<Title t={f - 2} lines={['NOBODY TELLS THE TRUTH', 'ABOUT HOMEWORK']} y={60} size={70} />
		</Class2>
	);
};
/* 178 «Mr. Hollis blinks. Well, he says.» */
const S178: React.FC = () => {
	const {f, w} = useB();
	const tb = w('178', 'blinks');
	return (
		<Class2 cam={camCut(f, [[0, 1050, 470, 2.4], [w('178', 'well') - 2, 1000, 520, 1.6]])} hollis={{blink: f > tb && f < tb + 5 ? 1 : f > tb + 9 && f < tb + 13 ? 1 : 0, expr: 'normal', mouth: 'flat'}}>
			<Pow x={1250} y={330} text="blink blink" t={f - tb} size={40} c="#fff" hold={20} />
			<Bubble x={1300} y={300} w={bw('WELL...')} h={100} t={f - w('178', 'well')} tail={[-160, 120]}>
				{say('WELL...')}
			</Bubble>
		</Class2>
	);
};
/* 179 «Detention. But thank you for being honest.» */
const S179: React.FC = () => {
	const {f, w} = useB();
	const tt = w('179', 'thank');
	return (
		<Class2 cam={camCut(f, [[0, 900, 560, 1.4], [tt - 2, 1050, 500, 1.8]])} hollis={{pose: gesture('presentF', idle(f, 3), 1, f), mouth: f > tt ? 'smile' : 'flat', expr: 'normal'}} hx={1000}>
			<g transform={`translate(860,${560}) rotate(-8) scale(${pop(f - 2)})`}>
				<rect x={-120} y={-60} width={240} height={120} rx={8} fill="#ffd9e0" stroke="#d23b3b" strokeWidth={5} />
				<text y={10} textAnchor="middle" fontSize={36} fontFamily={RB} fontWeight={900} fill="#d23b3b">
					DETENTION
				</text>
			</g>
			<Bubble x={1300} y={300} w={bw('THANK YOU FOR BEING HONEST.', 32)} h={80} t={f - tt} tail={[-180, 120]}>
				{say('THANK YOU FOR BEING HONEST.', 32)}
			</Bubble>
		</Class2>
	);
};
/* 180 «Kai leans over. You okay?» */
const S180: React.FC = () => {
	const {f, w} = useB();
	const lean = ez(f, 2, 16, 0, 1);
	return (
		<Class2 cam={camK(f, [[0, 620, 540, 1.5], [60, 620, 520, 1.85]])} kai={{pose: {...P.sitDesk(f), lean: 4 + lean * 18}, mouth: 'open'}} hero={{look: [-1, 0]}}>
			<Bubble x={480} y={300} w={bw('YOU OKAY?')} h={100} t={f - w('180', 'you')} tail={[60, 120]}>
				{say('YOU OKAY?')}
			</Bubble>
		</Class2>
	);
};
/* 181 «You look weird. You look at him for a long time.» */
const S181: React.FC = () => {
	const {f, w, dur} = useB();
	const tl = w('181', 'you', 1);
	if (f < tl - 4)
		return (
			<Class2 cam={camK(f, [[0, 520, 520, 1.9], [tl, 520, 520, 2.1]])} kai={{pose: {...P.sitDesk(f), lean: 20}, mouth: 'open', expr: 'worried'}}>
				<Bubble x={480} y={300} w={bw('YOU LOOK WEIRD.')} h={100} t={f} tail={[60, 120]}>
					{say('YOU LOOK WEIRD.')}
				</Bubble>
			</Class2>
		);
	return (
		<Class2 cam={camK(f, [[tl - 4, 760, 500, 2.2], [dur, 760, 490, 2.6]])} hero={{look: [-1, 0], lidBase: 0.2, expr: 'sad', mouth: 'smile'}}>
			{[0, 1].map((i) => (
				<circle key={i} cx={735 + i * 30} cy={575 + ((f - tl) % 40) * 1.2} r={4} fill="#9fd2ff" opacity={(f - tl) > 20 ? 0.9 : 0} />
			))}
		</Class2>
	);
};
/* 182 «Then you say, I'm really glad you're my friend.» */
const S182: React.FC = () => {
	const {f, w} = useB();
	const tg = w('182', 'glad');
	return (
		<Class2 cam={camCut(f, [[0, 760, 520, 1.6], [tg - 2, 620, 540, 1.3]])} hero={{look: [-1, 0], facing: -1, mouth: 'smile', lidBase: 0.3}}>
			<Bubble x={700} y={280} w={bw("I'M REALLY GLAD YOU'RE MY FRIEND.", 34)} h={90} t={f - w('182', "i'm")} tail={[40, 130]}>
				{say("I'M REALLY GLAD YOU'RE MY FRIEND.", 34)}
			</Bubble>
			<TruthStamp x={1100} y={420} t={f - tg - 20} />
		</Class2>
	);
};
/* 183 «He makes a face. That's the weirdest thing anyone's ever said to me.» */
const S183: React.FC = () => {
	const {f, w} = useB();
	const tw = w('183', 'weirdest');
	return (
		<Class2 cam={camCut(f, [[0, 480, 500, 2.2], [w('183', "that's") - 2, 600, 540, 1.5]])} kai={{expr: 'angry', mouth: 'smirk', lidBase: 0.5, pose: {...P.sitDesk(f), lean: -10}}}>
			<Bubble x={520} y={280} w={bw("THAT'S THE WEIRDEST THING EVER.", 32)} h={80} t={f - w('183', "that's")} tail={[40, 130]}>
				{say("THAT'S THE WEIRDEST THING EVER.", 32)}
			</Bubble>
			<Pow x={360} y={420} text="UGH" t={f - 2} size={50} c="#fff" hold={tw - 6} />
		</Class2>
	);
};
/* 184 «But he's smiling. That night at dinner, your dad comes home from his second job, tired.» */
const S184: React.FC = () => {
	const {f, w} = useB();
	const tn = w('184', 'night');
	if (f < tn - 6)
		return (
			<Class2 cam={camK(f, [[0, 480, 500, 2.4], [tn, 480, 500, 2.6]])} kai={{mouth: 'smile', lidBase: 0.4, pose: {...P.sitDesk(f), lean: 8}}}>
				<Pow x={520} y={420} text="♥" t={f - 6} size={50} c="#ff6a8a" />
			</Class2>
		);
	const dw = mover(f, tn + 10, tn + 90, 1400, 880, {seed: 2});
	return (
		<Scene cam={camK(f, [[tn - 6, 960, 560, 1.0], [tn + 120, 900, 580, 1.4]])} bg="#0b1030" light={{night: true, o: 0.5}} set={<HouseFront f={f} night doorOpen={ez(f, tn + 70, tn + 90, 0, 1)} />}>
			<Actor who="dad" x={dw.x} facing={-1} outfit="apron" pose={{...dw.pose, lean: dw.pose.lean + 10, head: 14}} vx={dw.vx} bob={dw.bob} lidBase={0.6} expr="sad" />
			<Tag x={960} y={150} t={f - tn} text="THAT NIGHT" size={50} />
			<Pow x={1250} y={420} text="*sigh*" t={f - tn - 30} size={44} c="#c9cfdd" />
		</Scene>
	);
};
/* 185 «He falls asleep on the couch before dessert.» */
const S185: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 620, 1.2], [dur, 880, 660, 1.6]])} bg="#2a2f55" light={{night: true, x: 30, y: 20, o: 0.6, c: '255,210,150'}} set={<LivingRoom f={f} night />}>
			<Couch x={900} />
			<g transform="translate(700,700) rotate(-80)">
				<Actor who="dad" x={0} floor={157} outfit="apron" pose={{lean: 0, head: 0, armB: [10, 10], armF: [40, 60], legB: [0, 0], legF: [4, 0]}} lidBase={1} faceTurn={0.2} shadow={false} />
			</g>
			<Pow x={760} y={480} text="Z z z" t={f % 50} size={50} c="#fff" hold={40} />
			<g transform="translate(1300,760)">
				<ellipse rx={60} ry={14} fill="#fbf8ef" />
				<path d="M-30,-6 L30,-6 L0,-60 Z" fill="#ffe0f0" stroke="#ff6a9a" strokeWidth={4} />
			</g>
		</Scene>
	);
};
/* 186 «Your mom counts the coins for tomorrow's groceries.» */
const S186: React.FC = () => {
	const {f, dur} = useB();
	const n = Math.min(12, Math.floor(f / 6));
	return (
		<Scene cam={camK(f, [[0, 960, 640, 1.8], [dur, 960, 600, 1.4]])} bg="#2a2a48" light={{night: true, o: 0.6, c: '255,210,150'}} set={<Kitchen night />}>
			<Actor who="mom" x={800} pose={reach(idle(f, 3), 'F', [120, -60 + Math.abs(Math.sin(f / 3)) * 10], 1)} faceTurn={0.6} look={[1, 1]} mouth="smile" lidBase={0.3} />
			<ellipse cx={960} cy={760} rx={460} ry={46} fill="#6a5a7a" />
			<ellipse cx={960} cy={752} rx={460} ry={42} fill="#8a7aa0" />
			{Array.from({length: n}).map((_, i) => (
				<Coin key={i} x={960 + (i % 4) * 30} y={740 - Math.floor(i / 4) * 8} s={0.8} />
			))}
			<Pow x={1100} y={600} text="clink" t={f % 12} size={30} c="#ffd34a" hold={8} />
		</Scene>
	);
};
/* 187 «Emma tells a long story about a bug she found.» */
const S187: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 600, 1.15], [dur, 1100, 560, 1.6]])} bg="#2a2a48" light={{night: true, o: 0.6, c: '255,210,150'}} set={<Kitchen night />}>
			<Actor who="mom" x={700} pose={P.laugh(f)} mouth="smile" />
			<Hero x={880} pose={P.laugh(f + 5)} mouth="smile" lidBase={0.4} badge={false} />
			<Actor who="emma" x={1150} s={0.72} facing={-1} pose={gesture('wave', idle(f, 4), 1, f)} mouth="open" />
			<Bubble x={1350} y={360} w={300} h={200} t={f - 4} tail={[-120, 140]}>
				<g transform={`translate(0,${Math.sin(f / 3) * 6})`}>
					<ellipse rx={50} ry={34} fill="#3aa37a" />
					<circle cx={50} cy={-6} r={20} fill="#2a7a5a" />
					{[-30, 0, 30].map((x) => (
						<line key={x} x1={x} y1={20} x2={x + Math.sin(f / 2 + x) * 10} y2={50} stroke="#2a2030" strokeWidth={5} />
					))}
					<text y={88} textAnchor="middle" fontSize={26} fontFamily={RB} fontWeight={800} fill="#2a2030">
						...and THEN...
					</text>
				</g>
			</Bubble>
		</Scene>
	);
};
/* 188 «Nothing is perfect. Everything is real.» */
const S188: React.FC = () => {
	const {f, w, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 600, 1.4], [dur, 960, 560, 1.0]])} bg="#2a2a48" light={{night: true, o: 0.6, c: '255,200,140'}} set={<Kitchen night />} over={<AbsoluteFill style={{background: 'rgba(255,170,90,.15)', mixBlendMode: 'multiply'}} />}>
			<Actor who="mom" x={640} pose={P.laugh(f)} mouth="smile" />
			<Hero x={860} pose={P.laugh(f + 5)} mouth="smile" lidBase={0.4} badge={false} />
			<Actor who="emma" x={1080} s={0.72} facing={-1} pose={P.cheer(f)} mouth="smile" />
			<Actor who="dad" x={1300} facing={-1} outfit="apron" pose={P.laugh(f + 3)} mouth="smile" lidBase={0.4} />
			<Title t={f - 2} lines={['NOTHING IS PERFECT.', f > w('188', 'everything') ? 'EVERYTHING IS REAL.' : '']} y={60} size={76} c="#ffd34a" />
		</Scene>
	);
};
/* 189 «Here's one more thing scientists found.» */
const S189: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 700, 560, 1.4], [dur, 760, 540, 1.7]])} bg="#dff2f2" set={<Lab f={f} />}>
			<Actor who="sci" x={700} pose={gesture('point', idle(f, 2), 1, f)} handF="point" mouth="open" />
			<Pow x={1050} y={330} text="ONE MORE THING..." t={f - 4} size={56} hold={999} />
		</Scene>
	);
};
/* 190 «Most people only catch a lie about half the time, barely better than flipping a coin.» */
const S190: React.FC = () => {
	const {f, w} = useB();
	const th = w('190', 'half');
	const tc = w('190', 'coin');
	const flip = Math.max(0, f - tc + 10);
	return (
		<Scene cam={camK(f, [[0, 960, 540, 1.0], [150, 960, 540, 1.12]])} bg="#141a3a" light={false} set={<RedVoid f={f} c="#1d2a5a" words={false} />}>
			<g transform="translate(620,520)">
				<circle r={200} fill="#0b0d18" />
				<circle r={170} fill="none" stroke="#2a3366" strokeWidth={40} />
				<circle r={170} fill="none" stroke="#ffd34a" strokeWidth={40} strokeDasharray={`${2 * Math.PI * 170 * 0.54 * lin(f, th - 10, th + 20, 0, 1)} 2000`} transform="rotate(-90)" />
				<text y={30} textAnchor="middle" fontSize={90} fontFamily={RB} fontWeight={900} fill="#fff">
					{Math.round(54 * lin(f, th - 10, th + 20, 0, 1))}%
				</text>
				<text y={260} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={800} fill="#c9cfdd">
					LIES CAUGHT
				</text>
			</g>
			{f > tc - 10 ? (
				<g transform={`translate(1350,${520 - Math.sin(Math.min(Math.PI, flip / 12)) * 260}) scale(1,${Math.cos(flip / 2)})`}>
					<circle r={110} fill="#ffd34a" stroke="#c9a010" strokeWidth={10} />
					<text y={30} textAnchor="middle" fontSize={90} fontFamily={RB} fontWeight={900} fill="#c9a010">
						{Math.cos(flip / 2) > 0 ? 'H' : 'T'}
					</text>
				</g>
			) : null}
			<text x={1350} y={800} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={800} fill="#c9cfdd" opacity={f > tc ? 1 : 0}>
				COIN FLIP = 50%
			</text>
			<Cite text="Bond & DePaulo, 2006 (meta-analysis)" t={f} x={1860} y={1040} />
		</Scene>
	);
};
/* 191 «Which means most of our lies work.» */
const S191: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 560, 1.1], [dur, 960, 540, 1.3]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i} transform={`translate(${400 + i * 280},500) scale(${pop(f - i * 5)})`}>
					<rect x={-100} y={-40} width={200} height={80} rx={40} fill="#fff" stroke="#ff2a3c" strokeWidth={5} />
					<text y={14} textAnchor="middle" fontSize={40} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
						LIE
					</text>
					<text y={110} textAnchor="middle" fontSize={60} fontFamily={RB} fontWeight={900} fill={i === 2 ? '#ff3b4e' : '#3aa37a'}>
						{i === 2 ? '✗' : '✓'}
					</text>
				</g>
			))}
			<Title t={f - 4} lines={['MOST LIES WORK']} y={80} size={84} />
		</Scene>
	);
};
/* 192 «We get away with them. And maybe that's the problem.» */
const S192: React.FC = () => {
	const {f, w, dur} = useB();
	const tp = w('192', 'problem');
	const hw = mover(f, 0, 50, 700, 1500, {seed: 1});
	return (
		<Scene cam={camCut(f, [[0, 960, 560, 1.2], [tp - 6, 1300, 520, 1.8]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Extra i={1} x={hw.x} floor={900} pose={{...hw.pose, lean: 14}} seed="sn" facing={1} />
			<Pow x={hw.x} y={330} text="sneak sneak" t={f - 2} size={40} c="#fff" hold={tp - 10} />
			<Pow x={1300} y={300} text="THE PROBLEM?" t={f - tp} size={64} c="#ff3b4e" />
		</Scene>
	);
};
/* 193 «When a lie works, it doesn't feel like it changed anything.» */
const S193: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 600, 1.4], [dur, 960, 560, 1.1]])} bg="#2a0508" light={false} set={<RedVoid f={f} words={false} />}>
			<rect x={300} y={780} width={1320} height={30} fill="#5a1a2a" />
			<g transform="translate(560,700)">
				<rect x={-60} y={-34} width={120} height={60} rx={30} fill="#fff" stroke="#ff2a3c" strokeWidth={5} />
				<text y={8} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
					LIE
				</text>
			</g>
			{Array.from({length: 10}).map((_, i) => (
				<rect key={i} x={760 + i * 80} y={640} width={26} height={140} fill="#fbf8ef" stroke="#2a2030" strokeWidth={3} />
			))}
			<Pow x={1200} y={400} text="nothing happened?" t={f - 6} size={50} c="#fff" hold={999} />
		</Scene>
	);
};
/* 194 «But it always does.» — the domino run starts */
const Dominoes: React.FC<{f: number; t0: number}> = ({f, t0}) => (
	<g>
		<rect x={300} y={780} width={1320} height={30} fill="#5a1a2a" />
		{Array.from({length: 10}).map((_, i) => {
			const a = Math.min(75, Math.max(0, (f - t0 - i * 4) * 12));
			return <rect key={i} x={760 + i * 80} y={640} width={26} height={140} fill="#fbf8ef" stroke="#2a2030" strokeWidth={3} transform={`rotate(${a} ${786 + i * 80} 780)`} />;
		})}
	</g>
);
const S194: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={shake(camK(f, [[0, 900, 600, 1.6], [dur, 1100, 620, 1.3]]), f, 8, 6, 40)} bg="#2a0508" light={false} set={<RedVoid f={f} words={false} />}>
			<Dominoes f={f} t0={4} />
			<Title t={f - 2} lines={['IT ALWAYS DOES']} y={80} size={84} c="#ff3b4e" />
		</Scene>
	);
};
/* 195 «It just changes it quietly.» */
const S195: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 1300, 640, 1.9], [dur, 1300, 660, 2.3]])} bg="#2a0508" light={false} set={<RedVoid f={f} words={false} />}>
			<Dominoes f={f + 60} t0={4} />
			<Pow x={1350} y={560} text="shh..." t={f - 6} size={50} c="#fff" hold={999} />
		</Scene>
	);
};
/* the park on Saturday */
const ParkSat: React.FC<{cam: any; children?: React.ReactNode; zoe?: any}> = ({cam, children, zoe}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}} set={<Park f={f} />}>
			<Bench x={1250} />
			<Actor who="zoe" x={1200} seat={790} pose={{...P.sitDesk(f), armF: [40, 60]}} facing={-1} faceTurn={0.4} {...zoe} />
			{children}
		</Scene>
	);
};
/* 196 «On Saturday, you see Zoe at the park.» */
const S196: React.FC = () => {
	const {f, dur} = useB();
	const hw = mover(f, 0, dur, -100, 620, {seed: 1});
	return (
		<ParkSat cam={camK(f, [[0, 600, 560, 1.1], [dur, 900, 560, 1.25]])}>
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} badge={false} />
			<Tag x={500} y={250} t={f - 2} text="SATURDAY" size={54} />
		</ParkSat>
	);
};
/* 197 «She doesn't know you. There's no summer camp.» */
const S197: React.FC = () => {
	const {f, w} = useB();
	const tn = w('197', 'no');
	return (
		<ParkSat cam={camCut(f, [[0, 1200, 520, 1.9], [tn - 2, 960, 540, 1.2]])} zoe={{look: [1, 0], mouth: 'flat'}}>
			<Hero x={620} pose={idle(f, 1)} faceTurn={0.6} badge={false} />
			{f > tn ? (
				<g transform={`translate(960,280) scale(${pop(f - tn)})`}>
					<rect x={-180} y={-100} width={360} height={200} rx={20} fill="#141a46" />
					<Campfire x={0} y={70} f={f} s={0.7} />
					<line x1={-170} y1={-90} x2={170} y2={90} stroke="#ff2a3c" strokeWidth={18} />
				</g>
			) : null}
			<Pow x={1200} y={420} text="?" t={f - 4} size={80} c="#fff" hold={tn - 10} />
		</ParkSat>
	);
};
/* 198 «No lake. No stars.» — memories crumble */
const S198: React.FC = () => {
	const {f, w} = useB();
	const tl = w('198', 'lake');
	const ts = w('198', 'stars');
	return (
		<ParkSat cam={camK(f, [[0, 960, 480, 1.2], [50, 960, 470, 1.4]])}>
			<g opacity={lin(f, tl, tl + 20, 1, 0)} transform={`translate(0,${Math.max(0, f - tl) * 6})`}>
				<Polaroid x={760} y={320} rot={-6} s={0.9} kind="lake" />
			</g>
			<g opacity={lin(f, ts, ts + 20, 1, 0)} transform={`translate(0,${Math.max(0, f - ts) * 6})`}>
				<Polaroid x={1160} y={320} rot={6} s={0.9} kind="stars" />
			</g>
		</ParkSat>
	);
};
/* 199 «You walk over anyway. You don't lie this time.» */
const S199: React.FC = () => {
	const {f, w} = useB();
	const hw = mover(f, 0, 50, 600, 980, {seed: 2});
	return (
		<ParkSat cam={camK(f, [[0, 900, 560, 1.2], [80, 1050, 540, 1.5]])} zoe={{look: [-1, 0]}}>
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} badge={false} mouth="flat" />
			<Pow x={760} y={330} text="NO LIES." t={f - w('199', 'lie')} size={60} c="#3aa37a" />
		</ParkSat>
	);
};
/* 200 «You say, Hi, I'm the guy who sits behind you in English.» */
const S200: React.FC = () => {
	const {f, w} = useB();
	return (
		<ParkSat cam={camCut(f, [[0, 960, 520, 1.7], [w('200', 'sits') - 2, 1080, 540, 1.35]])} zoe={{look: [-1, -0.2], faceTurn: 0.5}}>
			<Hero x={980} pose={gesture('wave', idle(f, 1), env(f, w('200', 'hi'), w('200', "i'm"), 6, 8), f)} faceTurn={0.6} mouth="smile" lidBase={0.3} badge={false} />
			<Bubble x={900} y={290} w={bw("HI! I SIT BEHIND YOU IN ENGLISH.", 32)} h={80} t={f - w('200', 'hi')} tail={[40, 130]}>
				{say("HI! I SIT BEHIND YOU IN ENGLISH.", 32)}
			</Bubble>
		</ParkSat>
	);
};
/* 201 «I've wanted to talk to you for a year, and I didn't know what to say.» */
const S201: React.FC = () => {
	const {f, w} = useB();
	return (
		<ParkSat cam={camCut(f, [[0, 980, 500, 2.0], [w('201', 'and') - 2, 1080, 540, 1.4]])} zoe={{look: [-1, -0.2], faceTurn: 0.5, mouth: 'smile'}}>
			<Hero x={980} pose={gesture('scratch', idle(f, 1), 1, f)} faceTurn={0.6} mouth="smile" lidBase={0.3} badge={false} />
			<Bubble x={900} y={290} w={bw("I DIDN'T KNOW WHAT TO SAY...", 34)} h={80} t={f - w('201', 'and') + 6} tail={[40, 130]}>
				{say("I DIDN'T KNOW WHAT TO SAY...", 34)}
			</Bubble>
			<TruthStamp x={1450} y={300} t={f - w('201', 'say') - 4} />
		</ParkSat>
	);
};
/* 202 «She laughs. That's honest.» */
const S202: React.FC = () => {
	const {f, w} = useB();
	return (
		<ParkSat cam={camK(f, [[0, 1200, 520, 1.9], [50, 1150, 540, 1.6]])} zoe={{pose: {...P.laugh(f), legB: [88, 85], legF: [92, 90]}, mouth: 'smile', lidBase: 0.4}}>
			<Hero x={980} pose={idle(f, 1)} faceTurn={0.6} mouth="smile" lidBase={0.3} badge={false} />
			<Pow x={1350} y={360} text="HA HA" t={f - 2} size={50} c="#fff" />
			<Bubble x={1350} y={280} w={bw("THAT'S HONEST.")} h={100} t={f - w('202', "that's")} tail={[-120, 120]}>
				{say("THAT'S HONEST.")}
			</Bubble>
		</ParkSat>
	);
};
/* 203 «Then she moves over on the bench.» */
const S203: React.FC = () => {
	const {f, dur} = useB();
	const zx = ez(f, 4, 24, 1200, 1340);
	const hs = ez(f, 26, 44, 0, 1);
	return (
		<Scene cam={camK(f, [[0, 1150, 560, 1.4], [dur, 1200, 600, 1.6]])} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}} set={<Park f={f} />}>
			<Bench x={1250} />
			<Actor who="zoe" x={zx} seat={790} pose={{...P.sitDesk(f), armF: [40, 60]}} facing={-1} faceTurn={0.4} mouth="smile" />
			<Hero x={980 + hs * 140} seat={hs > 0.5 ? 790 : undefined} pose={hs > 0.5 ? {...P.sitDesk(f), armF: [40, 60]} : idle(f, 1)} faceTurn={0.6} mouth="smile" lidBase={0.3} badge={false} />
			{f > 30 ? [0, 1, 2].map((i) => <Pow key={i} x={1180 + i * 60} y={480 - ((f + i * 15) % 50) * 2} text="♥" t={8} size={40} c="#ff6a8a" hold={999} />) : null}
		</Scene>
	);
};
/* 204 «You walk home the long way, pass the shelter on the corner, pass the window with the puppies, and you stop.» */
const S204: React.FC = () => {
	const {f, w, dur} = useB();
	const ts = w('204', 'stop');
	const hw = mover(f, 0, ts, -300, 900, {seed: 1});
	return (
		<Scene cam={{x: (hw.x + 100 - 960) * 1.15, y: 0, zoom: 1.15, focus: 1, farBlur: 3, nearBlur: 10}} bg="#ff9a6a" light={{x: 70, y: 0, o: 0.5, c: '255,190,120'}} set={<ShelterFront f={f} evening />}>
			<Windows f={f} />
			<Hero x={hw.x} pose={f > ts ? {...idle(f, 1), head: -4} : hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} look={f > ts ? [1, -0.2] : [1, 0]} badge={false} expr={f > ts ? 'wide' : 'normal'} lidBase={f > ts ? 0.1 : 0.4} />
			<Pow x={hw.x} y={330} text="!" t={f - ts} size={90} c="#fff" />
		</Scene>
	);
};
const Windows: React.FC<{f: number; big?: boolean}> = ({f, big = true}) => (
	<g>
		<Puppy x={430} y={720} c="#f2f2f2" f={f} seed={1} />
		<Puppy x={600} y={730} c="#2a2a2a" f={f} seed={2} />
		{big ? <Dog x={980} floor={760} s={0.6} f={f} mode="sit" facing={-1} age={1} /> : null}
		<Cage x={330} y={400} w={840} h={360} />
	</g>
);
/* 205 «There's a big brown dog in the window, older than the others, slobbery, sitting in the corner, looking at you like he's seen you before.» */
const S205: React.FC = () => {
	const {f, w} = useB();
	const to = w('205', 'older');
	const ts = w('205', 'slobbery');
	const tl = w('205', 'looking');
	const tb = w('205', 'before');
	return (
		<Scene cam={camCut(f, [[0, 960, 580, 1.2], [w('205', 'big') - 2, 980, 640, 2.0], [tl - 2, 1050, 620, 1.6], [tb - 2, 980, 600, 2.4]])} bg="#ff9a6a" light={{x: 70, y: 0, o: 0.5, c: '255,190,120'}} set={<ShelterFront f={f} evening />}>
			<Windows f={f} />
			<Hero x={1300} pose={reach(idle(f, 1), 'F', [-60, -90], env(f, tl, 999, 8, 1))} facing={-1} faceTurn={0.5} look={[-1, 0]} badge={false} expr="wide" lidBase={0.1} />
			<Tag x={880} y={520} t={f - to} text="older" size={40} />
			<Tag x={1080} y={520} t={f - ts} text="slobbery" size={40} c="#c9f0ff" />
			{f > tb ? <Pow x={1000} y={540} text="♥" t={f - tb} size={50} c="#ff6a8a" hold={999} /> : null}
		</Scene>
	);
};
/* 206 «The sign on his cage says, Biscuit, needs a family.» */
const S206: React.FC = () => {
	const {f, w} = useB();
	const tb = w('206', 'biscuit');
	return (
		<Scene cam={camK(f, [[0, 980, 620, 1.6], [tb, 980, 560, 2.2]])} bg="#ff9a6a" light={{x: 70, y: 0, o: 0.5, c: '255,190,120'}} set={<ShelterFront f={f} evening />}>
			<Windows f={f} />
			<g transform={`translate(980,520) rotate(${Math.sin(f / 15) * 3}) scale(${pop(f - 4)})`}>
				<rect x={-130} y={-60} width={260} height={120} rx={8} fill="#fbf8ef" stroke="#6b4a2a" strokeWidth={5} />
				<text y={-6} textAnchor="middle" fontSize={44} fontFamily="'Caveat', cursive" fontWeight={700} fill="#2a2030">
					{f > tb ? 'BISCUIT' : '...'}
				</text>
				<text y={36} textAnchor="middle" fontSize={30} fontFamily="'Caveat', cursive" fontWeight={700} fill="#d23b3b">
					needs a family ♥
				</text>
			</g>
		</Scene>
	);
};
/* 207 «You walk inside. The woman at the desk asks, Do you know him?» */
const S207: React.FC = () => {
	const {f, w} = useB();
	const ta = w('207', 'do');
	const hw = mover(f, 0, 40, -150, 760, {seed: 1});
	return (
		<Scene cam={camCut(f, [[0, 760, 560, 1.15], [ta - 2, 1050, 520, 1.55]])} bg="#fff0d0" light={{x: 30, y: 10, o: 0.45}} set={<ShelterInside f={f} />}>
			<Actor who="clerk" x={1200} facing={-1} pose={gesture('presentF', idle(f, 3), env(f, ta, 999, 6, 1), f)} mouth="smile" />
			<FrontDesk x={1200} />
			<Dog x={1550} f={f} mode="sit" facing={-1} age={1} />
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} badge={false} mouth="smile" />
			<Bubble x={1250} y={300} w={bw('DO YOU KNOW HIM?')} h={100} t={f - ta} tail={[-60, 130]}>
				{say('DO YOU KNOW HIM?')}
			</Bubble>
		</Scene>
	);
};
/* 208 «And for once, you can say it.» */
const S208: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 760, 520, 1.8], [dur, 760, 500, 2.3]])} bg="#fff0d0" light={{x: 30, y: 10, o: 0.5}} set={<ShelterInside f={f} />}>
			<Hero x={760} pose={idle(f, 1)} faceTurn={0.5} mouth="smile" lidBase={0.5} badge={false} />
			<Sparks x={760} y={500} t={f - 10} c="#8fe0b0" r={200} />
		</Scene>
	);
};
/* 209 «And it's completely true. Yeah, I really do.» — the dog runs into his arms */
const S209: React.FC = () => {
	const {f, w} = useB();
	const ty = w('209', 'yeah');
	const dw = mover(f, ty - 10, ty + 10, 1700, 960, {run: true});
	const j = jump(f, ty + 10, 160, 22);
	const hug = env(f, ty + 20, 999, 8, 1);
	return (
		<Scene cam={camCut(f, [[0, 900, 540, 1.3], [ty - 2, 900, 600, 1.15], [ty + 26, 820, 560, 1.7]])} bg="#fff0d0" light={{x: 30, y: 10, o: 0.5}} set={<ShelterInside f={f} />}>
			<Hero x={760} pose={hug > 0 ? P.hug(f) : P.cheer(f)} mouth="smile" lidBase={0.6} badge={false} />
			<Dog x={hug > 0.5 ? 880 : dw.x} floor={900 - j.lift} f={f} mode={hug > 0.5 ? 'sit' : 'run'} facing={-1} />
			<Bubble x={700} y={300} w={bw('YEAH. I REALLY DO.')} h={100} t={f - ty} tail={[40, 120]}>
				{say('YEAH. I REALLY DO.')}
			</Bubble>
			<TruthStamp x={1250} y={300} t={f - 4} text="COMPLETELY TRUE" />
			{hug > 0.5 ? [0, 1, 2, 3, 4].map((i) => <Pow key={i} x={700 + i * 80} y={480 - ((f + i * 15) % 60) * 3} text="♥" t={8} size={50} c="#ff6a8a" hold={999} />) : null}
		</Scene>
	);
};
/* 210 «So what's the first lie you'd tell if every lie came true?» */
const S210: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 960, 560, 1.4], [dur, 960, 540, 1.1]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={1250} pose={gesture('point', idle(f, 1), 1, f)} handF="point" facing={-1} faceTurn={0.2} look={[0, 0]} mouth="smirk" />
			<g transform={`translate(1500,330) rotate(12) scale(${pop(f - 10)})`}>
				<text textAnchor="middle" fontSize={300} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
					?
				</text>
			</g>
			<Title t={f - 2} lines={["WHAT'S THE FIRST LIE", "YOU'D TELL?"]} y={120} size={74} />
		</Scene>
	);
};
/* 211 «And what's the one you'd never dare to say?» */
const S211: React.FC = () => {
	const {f, dur} = useB();
	return (
		<Scene cam={camK(f, [[0, 900, 520, 1.6], [dur, 900, 520, 1.9]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={900} pose={gesture('touchFace', idle(f, 1), 1, f)} armOver mouth="flat" lidBase={0.5} />
			<Title t={f - 2} lines={["AND THE ONE YOU'D", 'NEVER DARE TO SAY?']} y={90} size={74} c="#ff3b4e" />
		</Scene>
	);
};
/* 212 «Tell us in the comments. And if you'd have told the truth to get your best friend back, hit like and subscribe for more What Ifs.» */
const S212: React.FC = () => {
	const {f, w, dur} = useB();
	const tl = w('212', 'like');
	const ts = w('212', 'subscribe');
	const press = (t0: number) => (f > t0 && f < t0 + 8 ? 0.9 : 1);
	return (
		<Scene cam={camK(f, [[0, 960, 540, 1.0], [dur, 960, 540, 1.08]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={560} pose={f > tl ? P.cheer(f) : gesture('wave', idle(f, 1), 1, f)} mouth="smile" lidBase={0.4} />
			<Actor who="kai" x={360} pose={P.cheer(f + 5)} mouth="smile" />
			<Dog x={800} f={f} mode="sit" />
			<g transform={`translate(1350,330) scale(${pop(f - 4)})`}>
				<rect x={-300} y={-70} width={600} height={140} rx={30} fill="#fbf8ef" />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#2a2030">
					COMMENTS ↓
				</text>
			</g>
			<g transform={`translate(1200,620) scale(${pop(f - tl) * press(tl + 10)})`}>
				<rect x={-130} y={-60} width={260} height={120} rx={60} fill={f > tl + 10 ? '#3a6fd2' : '#fbf8ef'} />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill={f > tl + 10 ? '#fff' : '#2a2030'}>
					LIKE
				</text>
			</g>
			<g transform={`translate(1520,620) scale(${pop(f - ts) * press(ts + 10)})`}>
				<rect x={-180} y={-60} width={360} height={120} rx={20} fill={f > ts + 10 ? '#5a5a6a' : '#ff2a3c'} />
				<text y={18} textAnchor="middle" fontSize={46} fontFamily={RB} fontWeight={900} fill="#fff">
					{f > ts + 10 ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}
				</text>
			</g>
			<Sparks x={1200} y={620} t={f - tl - 10} r={200} />
			<Sparks x={1520} y={620} t={f - ts - 10} r={240} seed="sub" />
			<Title t={f - ts} lines={['MORE WHAT IFS →']} y={850} size={64} c="#ffd34a" />
		</Scene>
	);
};

export const SHOTS5: ShotDef[] = [
	{at: '167', C: S167},
	{at: '168', C: S168},
	{at: '169', C: S169, whip: true},
	{at: '170', C: S170, whip: true},
	{at: '170', off: wordOff('170', 'you', 1), C: S170, whip: true},
	{at: '171', C: S171, whip: true},
	{at: '172', C: S172},
	{at: '173', C: S173},
	{at: '174', C: S174},
	{at: '175', C: S175},
	{at: '176', C: S176},
	{at: '177', C: S177},
	{at: '178', C: S178},
	{at: '179', C: S179},
	{at: '180', C: S180},
	{at: '181', C: S181},
	{at: '182', C: S182},
	{at: '183', C: S183},
	{at: '184', C: S184},
	{at: '184', off: wordOff('184', 'night'), C: S184, whip: true},
	{at: '185', C: S185, whip: true},
	{at: '186', C: S186, whip: true},
	{at: '187', C: S187},
	{at: '188', C: S188},
	{at: '189', C: S189, whip: true},
	{at: '190', C: S190, whip: true},
	{at: '191', C: S191, whip: true},
	{at: '192', C: S192},
	{at: '193', C: S193},
	{at: '194', C: S194},
	{at: '195', C: S195},
	{at: '196', C: S196, whip: true},
	{at: '197', C: S197},
	{at: '198', C: S198},
	{at: '199', C: S199},
	{at: '200', C: S200},
	{at: '201', C: S201},
	{at: '202', C: S202},
	{at: '203', C: S203},
	{at: '204', C: S204, whip: true},
	{at: '205', C: S205},
	{at: '206', C: S206},
	{at: '207', C: S207, whip: true},
	{at: '208', C: S208},
	{at: '209', C: S209},
	{at: '210', C: S210, whip: true},
	{at: '211', C: S211},
	{at: '212', C: S212},
];
