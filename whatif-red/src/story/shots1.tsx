import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Pose, frontHand} from '../engine/Stickman';
import {blend, gesture, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg} from '../kit/kit';
import {Bubble} from '../kit/ui';
import {Kitchen} from '../kit/sets';
import {Callout} from '../kit/graphics';
import {ClassRoom, Couch, Fridge, HouseFront, LivingRoom, Park, QMark, RedVoid, SchoolDesk, HeroRoom} from './places';
import {Dog, Flash, Hero, LieStamp, Magic, P, Pow, Sparks, SpeedLines, Tag, Title, camCut, camK, env, ez, headY, jump, lin, mover, pop, shake, useB} from './lib';
import {Classmates, Gaming, Monitor} from './bits';

const FL = 900;
const SEAT = 795;

/* 001 «Where's your homework? You look up at Mr. Hollis.» — Hollis storms in, slams the desk */
const S001: React.FC = () => {
	const {f, w} = useB();
	const hw = mover(f, 0, 26, 1500, 1010, {seed: 2});
	const slam = w('001', 'homework') + 4;
	let hp: Pose = hw.pose;
	hp = gesture('point', {...hp, lean: hp.lean + 12 * env(f, slam - 4, 999, 6, 1)}, env(f, slam - 4, 999, 5, 1), f);
	const up = env(f, w('001', 'look'), 999, 8, 1);
	const cam = shake(camCut(f, [[0, 1150, 560, 1.9], [w('001', 'you') - 2, 790, 600, 1.75]]), f, slam, 18);
	return (
		<Stage cam={cam} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<ClassRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Classmates f={f} />
					<Hero x={760} seat={SEAT} pose={{...P.sitDesk(f), head: -14 * up}} faceTurn={0.6} expr={up > 0.5 ? 'wide' : 'normal'} lidBase={up > 0.5 ? 0.15 : 0.42} mouth="flat" />
					<SchoolDesk x={820} paper />
					<Actor who="hollis" x={hw.x} s={1.12} facing={-1} pose={hp} vx={hw.vx} bob={hw.bob} expr="angry" handF={f > slam - 4 ? 'point' : undefined} />
					<Pow x={1050} y={380} text="WHERE'S YOUR HOMEWORK?!" t={f - 6} size={52} hold={50} c="#fff" />
					<Pow x={900} y={700} text="SLAM!" t={f - slam} size={60} rot={10} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 002 «You didn't do it. You were playing games until two in the morning.» — flashback */
const S002: React.FC = () => {
	const {f, w} = useB();
	const t2 = w('002', 'two');
	const cam = camCut(f, [[0, 900, 560, 1.25], [w('002', 'you', 1) - 2, 760, 520, 1.9], [t2, 1250, 330, 1.7]]);
	return (
		<Stage cam={cam} bg="#101225" light={{night: true, x: 60, y: 30, o: 0.6, c: '120,180,255'}}>
			<Layer depth={1.6}>
				<HeroRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Gaming f={f} x={760} />
					<Monitor x={1060} f={f} />
					<g transform="translate(1250,330)">
						<rect x={-150} y={-60} width={300} height={120} rx={20} fill="#0b0d18" stroke="#ff2a3c" strokeWidth={5} />
						<text y={30} textAnchor="middle" fontSize={84} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#ff3b4e" opacity={Math.floor(f / 15) % 2 ? 1 : 0.6}>
							{f < t2 ? '11:58' : '2:00'}
						</text>
					</g>
					<Pow x={1250} y={500} text="2 AM!" t={f - t2} size={70} />
				</Svg>
			</Layer>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,30,80,.55) 100%)'}} />
			<Title t={f - 2} dur={w('002', 'you', 1) - 4} lines={["YOU DIDN'T DO IT."]} y={70} size={80} />
		</Stage>
	);
};

/* 003 «So, you say the oldest lie in the world.» — crash zoom on a sly grin */
const S003: React.FC = () => {
	const {f, w} = useB();
	const t = w('003', 'oldest');
	const cam = camK(f, [[0, 840, 560, 1.15], [t - 6, 840, 560, 1.2], [t + 4, 760, 520, 2.2]]);
	return (
		<Stage cam={shake(cam, f, t + 4, 10)} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<ClassRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Classmates f={f} />
					<Hero x={760} seat={SEAT} pose={gesture('rubChin', P.sitDesk(f), env(f, 4, t, 8, 8), f)} faceTurn={0.6} mouth="smirk" lidBase={0.5} />
					<SchoolDesk x={820} paper />
					<Actor who="hollis" x={1080} s={1.12} facing={-1} pose={gesture('armsCrossed', idle(f, 3), 1, f)} expr="angry" />
				</Svg>
			</Layer>
			<SpeedLines k={lin(f, t, t + 14, 1, 0)} />
			<Title t={f - t} lines={['THE OLDEST LIE', 'IN THE WORLD']} y={60} size={86} />
		</Stage>
	);
};

/* 004 «Sorry, sir. My dog ate it.» — shrug, LIE stamp, counter clicks to 1 */
const S004: React.FC = () => {
	const {f, w} = useB();
	const tdog = w('004', 'dog');
	const sh = env(f, w('004', 'sorry'), 999, 8, 1);
	const cam = camCut(f, [[0, 800, 520, 1.8], [tdog - 4, 900, 520, 1.35]]);
	return (
		<Stage cam={cam} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<ClassRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Classmates f={f} />
					<Hero x={760} seat={SEAT} pose={gesture('shrug', P.sitDesk(f), sh, f)} faceTurn={0.6} mouth="smile" lidBase={0.35} />
					<SchoolDesk x={820} paper />
					<Actor who="hollis" x={1080} s={1.12} facing={-1} pose={gesture('armsCrossed', idle(f, 3), 1, f)} expr={f > tdog ? 'sad' : 'angry'} />
					<Bubble x={560} y={330} w={420} h={110} t={f - tdog + 6} tail={[120, 120]}>
						<text y={18} textAnchor="middle" fontSize={50} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#2a2030">
							MY DOG ATE IT
						</text>
					</Bubble>
					<LieStamp x={980} y={290} t={f - tdog - 14} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 005 «The whole class laughs.» — everybody falls about laughing, camera sweeps the room */
const S005: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 400, 560, 1.5], [dur, 1400, 560, 1.4]]);
	return (
		<Stage cam={shake(cam, f, 4, 6, 30)} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<ClassRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Classmates f={f} laugh={1} wide />
					<Hero x={960} seat={SEAT} pose={P.slump(f)} faceTurn={0.2} mouth="flat" lidBase={0.5} />
					<SchoolDesk x={1020} paper />
					{[300, 700, 1250, 1600].map((x, i) => (
						<Pow key={i} x={x} y={360 + (i % 2) * 60} text={i % 2 ? 'HA!' : 'HAHA'} t={f - 3 - i * 6} size={56} rot={i % 2 ? 8 : -8} c="#fff" />
					))}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 006 «Because everyone knows you don't have a dog.» — Kai points, crossed-out dog icon */
const S006: React.FC = () => {
	const {f, w} = useB();
	const tk = w('006', 'knows');
	const cam = camCut(f, [[0, 1180, 560, 1.75], [tk + 4, 960, 520, 1.3]]);
	const kp = gesture('point', P.laugh(f), 1, f);
	return (
		<Stage cam={cam} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<ClassRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={760} seat={SEAT} pose={gesture('facepalm', P.sitDesk(f), env(f, tk, 999, 8, 1), f)} armOver faceTurn={0.6} mouth="flat" />
					<SchoolDesk x={820} />
					<Actor who="kai" x={1200} facing={-1} pose={kp} handF="point" mouth="open" expr="wide" />
					<g transform={`translate(960,300) scale(${pop(f - tk)})`}>
						<circle r={120} fill="#fff" stroke="#d23b3b" strokeWidth={14} />
						<ellipse cx={-10} cy={20} rx={60} ry={34} fill="#9a5b2e" />
						<circle cx={50} cy={-10} r={34} fill="#9a5b2e" />
						<line x1={-85} y1={85} x2={85} y2={-85} stroke="#d23b3b" strokeWidth={16} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 007 «That afternoon, you open your front door.» */
const S007: React.FC = () => {
	const {f, w} = useB();
	const hw = mover(f, 0, w('007', 'open') + 4, -150, 830, {seed: 1});
	const open = ez(f, w('007', 'door') - 4, w('007', 'door') + 10, 0, 1);
	const pose = reach(hw.pose, 'F', [70, -90], env(f, w('007', 'open') + 2, 999, 6, 1));
	const cam = camK(f, [[0, 500, 560, 1.15], [w('007', 'open'), 860, 600, 1.45]]);
	return (
		<Stage cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.5}>
				<HouseFront f={f} doorOpen={open} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={hw.x} pose={pose} facing={1} vx={hw.vx} bob={hw.bob} faceTurn={0.5} />
				</Svg>
			</Layer>
			<Title t={f - 2} dur={60} lines={['THAT AFTERNOON']} y={60} size={64} c="#fff" />
		</Stage>
	);
};

/* 008 «And there's a dog in your kitchen.» — crash zoom, hero jumps */
const S008: React.FC = () => {
	const {f, w} = useB();
	const td = w('008', 'dog');
	const j = jump(f, td + 2, 90, 16);
	const cam = camCut(f, [[0, 760, 560, 1.6], [td, 1180, 640, 1.8]]);
	return (
		<Stage cam={shake(cam, f, td, 14)} bg="#f3e6c4" light={{x: 60, y: 20, o: 0.45}}>
			<Layer depth={1.5}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={620} floor={FL - j.lift} pose={P.scared(f)} squash={j.squash} expr="wide" lidBase={0} mouth="open" faceTurn={0.5} />
					<Dog x={1200} f={f} mode="sit" chew tongue={false} look={-1} />
					<Pow x={700} y={300} text="?!" t={f - td} size={120} c="#ff3b4e" />
				</Svg>
			</Layer>
			<Flash t={f - td} o={0.5} />
		</Stage>
	);
};

/* 009 «A big, brown, slobbery dog you've never seen in your life, sitting on the floor, chewing on your math homework.» */
const S009: React.FC = () => {
	const {f, w} = useB();
	const tb = w('009', 'big');
	const tbr = w('009', 'brown');
	const ts = w('009', 'slobbery');
	const tn = w('009', 'never');
	const tc = w('009', 'chewing');
	const tm = w('009', 'math');
	const cam = camCut(f, [[0, 1150, 600, 1.4], [tn - 2, 600, 520, 1.7], [w('009', 'sitting') - 2, 1150, 700, 1.3], [tc - 2, 1330, 680, 2.0]]);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 60, y: 20, o: 0.45}}>
			<Layer depth={1.5}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={560} pose={gesture('handsOnHead', idle(f, 1), env(f, tn, 999, 8, 1), f)} expr="wide" lidBase={0} faceTurn={0.5} look={[1, 0]} />
					<Dog x={1180} f={f} mode="sit" chew={f > tc - 10} look={-0.5} />
					{/* the homework in the dog's mouth */}
					{f > tc - 10 ? (
						<g transform={`translate(1350,${770 + Math.sin(f / 2.5) * 6}) rotate(${-14 + Math.sin(f / 3) * 6})`}>
							<rect x={-60} y={-40} width={120} height={80} fill="#fbf8ef" stroke="#c9c4b0" strokeWidth={3} />
							<text y={-6} textAnchor="middle" fontSize={22} fontFamily="'Rubik', sans-serif" fontWeight={800} fill="#3a6fd2">
								MATH
							</text>
							<path d="M-50,10 h80 M-50,24 h60" stroke="#9aa3b5" strokeWidth={3} />
							<path d="M40,-40 l20,14 l-10,10 l14,16" fill="#f3e6c4" />
						</g>
					) : null}
					<Tag x={980} y={500} t={f - tb} text="BIG" size={56} />
					<Tag x={1380} y={480} t={f - tbr} text="BROWN" rot={6} size={56} c="#ffd9a0" />
					<Tag x={1200} y={380} t={f - ts} text="SLOBBERY" rot={-3} size={56} c="#c9f0ff" />
					{f > ts ? Array.from({length: 4}).map((_, i) => <circle key={i} cx={1300 + i * 14} cy={700 + ((f * 4 + i * 30) % 120)} r={6} fill="#cfe9ff" opacity={0.8} />) : null}
					<Pow x={1350} y={600} text="CHOMP" t={f - tm} size={54} rot={-10} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 010 «Your mom walks in, rubs its head, and says, Did you feed Biscuit today?» */
const S010: React.FC = () => {
	const {f, w} = useB();
	const mw = mover(f, 0, w('010', 'rubs'), 2100, 1420, {seed: 3});
	const rub = env(f, w('010', 'rubs'), w('010', 'did') + 10, 8, 8);
	const mp = reach(mw.pose, 'F', [70 + Math.sin(f / 3) * 10, -40], rub);
	const td = w('010', 'did');
	const cam = camCut(f, [[0, 1350, 560, 1.3], [td - 2, 1400, 480, 1.8]]);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 60, y: 20, o: 0.45}}>
			<Layer depth={1.5}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={620} pose={gesture('stop', idle(f, 1), 0.6, f)} expr="wide" lidBase={0.1} faceTurn={0.5} look={[1, 0]} />
					<Dog x={1180} f={f} mode="sit" look={rub > 0.5 ? 1 : 0} />
					<Actor who="mom" x={mw.x} facing={-1} pose={mp} vx={mw.vx} bob={mw.bob} mouth="smile" />
					<Bubble x={1450} y={250} w={560} h={110} t={f - td} tail={[40, 130]}>
						<text y={16} textAnchor="middle" fontSize={40} fontFamily="'Rubik', sans-serif" fontWeight={800} fill="#2a2030">
							Did you feed Biscuit today?
						</text>
					</Bubble>
					{rub > 0.5 ? <Pow x={1260} y={560} text="♥" t={(f - w('010', 'rubs')) % 30} size={60} c="#ff6a8a" hold={20} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 011 «Biscuit. Your dog, who you've apparently had for six years.» */
const S011: React.FC = () => {
	const {f, w} = useB();
	const ty = w('011', 'six');
	const cam = camCut(f, [[0, 1180, 640, 1.9], [w('011', 'your') - 2, 760, 560, 1.6], [ty - 4, 960, 520, 1.15]]);
	const years = Math.round(lin(f, ty - 2, ty + 18, 0, 6));
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 60, y: 20, o: 0.45}}>
			<Layer depth={1.5}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={640} pose={gesture('scratch', idle(f, 1), env(f, w('011', 'your'), 999, 8, 1), f)} faceTurn={0.5} look={[1, 0]} mouth="frown" />
					<Dog x={1180} f={f} mode="sit" look={-1} />
					<Tag x={1300} y={720} t={f - 2} text="BISCUIT" size={44} />
					{f > ty - 4 ? (
						<g transform={`translate(960,250) scale(${pop(f - ty + 4)})`}>
							<rect x={-170} y={-110} width={340} height={220} rx={20} fill="#fbf8ef" stroke="#d23b3b" strokeWidth={8} />
							<rect x={-170} y={-110} width={340} height={60} rx={20} fill="#d23b3b" />
							<text y={-66} textAnchor="middle" fontSize={34} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#fff">
								OWNED FOR
							</text>
							<text y={80} textAnchor="middle" fontSize={120} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#2a2030">
								{years} YRS
							</text>
						</g>
					) : null}
				</Svg>
			</Layer>
			<Title t={f} dur={w('011', 'your') - 2} lines={['BISCUIT?!']} y={80} size={110} />
		</Stage>
	);
};

/* 012 «There are photos of him on the fridge.» — photos slap onto the fridge one by one */
const S012: React.FC = () => {
	const {f, dur} = useB();
	const n = Math.min(6, Math.floor(f / 7));
	const cam = camK(f, [[0, 1100, 500, 1.6], [dur, 1100, 640, 1.9]]);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 60, y: 20, o: 0.45}}>
			<Layer depth={1.5}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Fridge x={1100} dogPhotos={n} />
					{Array.from({length: n}).map((_, i) => (
						<Pow key={i} x={1040 + (i % 2) * 110} y={600 + Math.floor(i / 2) * 120} text="SNAP" t={f - i * 7} size={30} hold={8} c="#fff" />
					))}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 013 «There's a leash by the door. There's a dent in the couch, the exact shape of him.» */
const S013: React.FC = () => {
	const {f, w} = useB();
	const tl = w('013', 'leash');
	const td = w('013', 'dent');
	const te = w('013', 'exact');
	const dw = mover(f, te - 20, te + 6, 2000, 700, {run: true});
	const cam = camCut(f, [[0, 1700, 560, 1.7], [td - 4, 760, 720, 1.5], [te + 4, 720, 700, 1.9]]);
	const inDent = f > te + 6;
	return (
		<Stage cam={cam} bg="#f6d9b0" light={{x: 30, y: 10, o: 0.45}}>
			<Layer depth={1.5}>
				<LivingRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Couch x={760} dent />
					{f > te - 20 && !inDent ? <Dog x={dw.x} f={f} mode="run" facing={-1} /> : null}
					{inDent ? <Dog x={740} floor={760} f={f} mode="lie" s={0.85} facing={-1} /> : null}
					<Callout f={f} t0={tl} t1={td} from={[1810, 560]} to={[1500, 300]} text="LEASH" c="#ffd34a" />
					<Callout f={f} t0={td + 4} t1={te + 4} from={[760, 770]} to={[1060, 520]} text="DOG-SHAPED DENT" c="#ff6a8a" />
					<Pow x={760} y={560} text="PERFECT FIT!" t={f - te - 8} size={60} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 014 «And everyone in your family remembers him.» — family hug-pile on the dog */
const S014: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 600, 1.1], [dur, 960, 640, 1.35]]);
	const hugK = env(f, 6, 999, 10, 1);
	return (
		<Stage cam={cam} bg="#f6d9b0" light={{x: 30, y: 10, o: 0.45}}>
			<Layer depth={1.5}>
				<LivingRoom f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Dog x={960} f={f} mode="sit" />
					<Actor who="mom" x={760} facing={1} pose={blend(idle(f, 1), P.hug(f), hugK)} mouth="smile" />
					<Actor who="dad" x={1260} facing={-1} pose={blend(idle(f, 2), P.hug(f), hugK)} mouth="smile" />
					<Actor who="emma" x={620} s={0.75} facing={1} pose={P.cheer(f)} mouth="smile" />
					{[0, 1, 2, 3, 4].map((i) => (
						<Pow key={i} x={800 + i * 110} y={420 - ((f * 2 + i * 40) % 200)} text="♥" t={10} size={50 + i * 4} c="#ff6a8a" hold={999} />
					))}
				</Svg>
			</Layer>
			<Title t={f - 4} lines={['EVERYONE REMEMBERS HIM']} y={70} size={70} />
		</Stage>
	);
};

/* 015 «Everyone except you.» — heads turn to the hero, spotlight, giant question mark */
const S015: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 760, 560, 1.4], [dur, 640, 520, 1.95]]);
	return (
		<Stage cam={cam} bg="#2a2030" light={{x: 30, y: 30, o: 0.6, c: '255,220,200'}}>
			<Layer depth={1.5}>
				<LivingRoom f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<ellipse cx={600} cy={905} rx={200} ry={30} fill="#fff6d0" opacity={0.35} />
					<Hero x={600} pose={gesture('shrug', idle(f, 1), env(f, 6, 999, 8, 1), f)} lidBase={0.1} expr="worried" faceTurn={0.2} />
					<Actor who="mom" x={1100} facing={-1} pose={idle(f, 3)} look={[-1, 0]} />
					<Dog x={1350} f={f} mode="sit" look={-1} />
					<QMark x={860} y={420} t={f - 10} s={0.8} />
				</Svg>
			</Layer>
			<AbsoluteFill style={{background: 'radial-gradient(circle at 32% 55%, rgba(0,0,0,0) 18%, rgba(0,0,0,.55) 48%)'}} />
		</Stage>
	);
};

/* 016 «Here's what you don't know yet.» — the red void: hero walks into the light */
const S016: React.FC = () => {
	const {f, dur} = useB();
	const hw = mover(f, 0, dur - 6, 500, 900, {seed: 4});
	const cam = camK(f, [[0, 900, 560, 1.0], [dur, 900, 520, 1.3]]);
	return (
		<Stage cam={cam} bg="#2a0508" light={false}>
			<Layer depth={1.6}>
				<RedVoid f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.4} mouth="smirk" badge={false} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 017 «Every lie you tell from now on is going to become true.» */
const S017: React.FC = () => {
	const {f, w} = useB();
	const tt = w('017', 'true');
	const cam = shake(camCut(f, [[0, 960, 560, 1.5], [tt - 4, 960, 520, 1.15]]), f, tt, 14);
	return (
		<Stage cam={cam} bg="#2a0508" light={false}>
			<Layer depth={1.6}>
				<RedVoid f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={960} pose={gesture('wave', idle(f, 4), env(f, 4, 40, 8, 8), f)} faceTurn={0.1} mouth="smirk" badge={f > tt} />
					<Magic x={960} y={420} t={f - tt + 20} w={500} h={300} />
				</Svg>
			</Layer>
			<Title t={f - 2} lines={['EVERY LIE YOU TELL', f > tt ? 'BECOMES TRUE' : '...']} y={80} size={84} c="#ff3b4e" />
			<Flash t={f - tt} c="#ff2a3c" o={0.45} />
		</Stage>
	);
};

/* 018 «Every single one. And by the end of this year, you'll tell one lie so big that it erases the most important person in your life.» */
const S018: React.FC = () => {
	const {f, w} = useB();
	const tby = w('018', 'by');
	const tbig = w('018', 'big');
	const te = w('018', 'erases');
	const fade = lin(f, te, te + 40, 1, 0);
	const cam = camCut(f, [[0, 960, 520, 1.7], [tby - 2, 960, 560, 1.05], [tbig - 2, 760, 520, 1.6], [te - 4, 1050, 560, 1.35]]);
	return (
		<Stage cam={cam} bg="#2a0508" light={false}>
			<Layer depth={1.6}>
				<RedVoid f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={820} pose={gesture('handsOnHead', idle(f, 4), env(f, te + 4, 999, 8, 1), f)} faceTurn={0.4} expr={f > te ? 'wide' : 'normal'} lidBase={f > te ? 0 : 0.42} look={[1, 0]} />
					<g opacity={fade}>
						<Actor who="kai" x={1150} facing={-1} pose={idle(f, 5)} hair="none" color="#3a3a4a" mouth="smile" />
					</g>
					{f > te ? <Magic x={1150} y={600} t={f - te} w={240} h={400} seed="er" /> : null}
					{f > tby && f < tbig ? (
						<g transform={`translate(1350,300) scale(${pop(f - tby)}) rotate(${(f - tby) * 0.5})`}>
							<rect x={-110} y={-110} width={220} height={220} rx={18} fill="#fbf8ef" />
							<rect x={-110} y={-110} width={220} height={60} rx={18} fill="#d23b3b" />
							<text y={60} textAnchor="middle" fontSize={90} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#2a2030">
								{Math.min(12, 1 + Math.floor((f - tby) / 6))}
							</text>
							<text y={-68} textAnchor="middle" fontSize={26} fontFamily="'Rubik', sans-serif" fontWeight={800} fill="#fff">
								MONTH
							</text>
						</g>
					) : null}
					<Pow x={980} y={300} text="ONE HUGE LIE" t={f - tbig} size={64} c="#ff3b4e" hold={40} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 019 «And the only way to bring them back will be the hardest thing you've ever had to say.» */
const S019: React.FC = () => {
	const {f, w, dur} = useB();
	const th = w('019', 'hardest');
	const cam = camK(f, [[0, 960, 560, 1.1], [dur, 900, 500, 1.85]]);
	return (
		<Stage cam={cam} bg="#2a0508" light={false}>
			<Layer depth={1.6}>
				<RedVoid f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={900} pose={P.slump(f)} faceTurn={0.2} mouth="open" lidBase={0.2} expr="worried" />
					{f > th
						? 'TRUTH'.split('').map((c, i) => {
								const t = f - th - i * 3;
								return t > 0 ? (
									<text key={i} x={980 + i * 50} y={480 - t * 0.6 + (t > 30 ? (t - 30) ** 2 * 0.3 : 0)} fontSize={60} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#fff" opacity={Math.max(0, 1 - Math.max(0, t - 40) / 20)} transform={`rotate(${t > 30 ? (t - 30) * (i % 2 ? 3 : -3) : 0} ${980 + i * 50} 480)`}>
										{c}
									</text>
								) : null;
							})
						: null}
				</Svg>
			</Layer>
			<Title t={f - th} lines={['THE HARDEST THING', 'TO SAY']} y={70} size={74} c="#ff3b4e" />
		</Stage>
	);
};

/* 020 «But first, biscuit needs a walk.» — Biscuit drags the hero through the park */
const S020: React.FC = () => {
	const {f, dur} = useB();
	const x0 = -300;
	const dog = mover(f, 0, dur + 20, x0 + 500, 2300, {run: true});
	const hero = mover(f, 0, dur + 20, x0, 1800, {run: true});
	const hy = FL - 157;
	const hp: Pose = {...hero.pose, lean: -22, armF: [80, 0]};
	const hand = frontHand(hp, hero.x, hy - hero.bob, 1, 1);
	const camX = (dog.x + hero.x) / 2;
	const cam = camOn2(camX, 600, 1.25);
	return (
		<Stage cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.6}>
				<Park f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={hero.x} pose={hp} vx={14} bob={hero.bob} expr="wide" lidBase={0} mouth="open" faceTurn={0.5} />
					<path d={`M${hand[0]},${hand[1]} Q${(hand[0] + dog.x + 90) / 2},${hand[1] + 30} ${dog.x + 70},${FL - 110 - dog.bob}`} stroke="#d23b3b" strokeWidth={7} fill="none" />
					<Dog x={dog.x} f={f} mode="run" />
					<Pow x={dog.x - 200} y={560} text="WHOOSH" t={f - 10} size={56} rot={-4} />
				</Svg>
			</Layer>
			<Title t={f - 2} lines={['BUT FIRST...']} y={70} size={70} c="#fff" />
		</Stage>
	);
};
const camOn2 = (X: number, Y: number, z: number) => ({x: (X - 960) * z, y: (Y - 540) * z, zoom: z, focus: 1, farBlur: 3, nearBlur: 10});

export const SHOTS1: ShotDef[] = [
	{at: '001', C: S001},
	{at: '002', C: S002, whip: true},
	{at: '003', C: S003, whip: true},
	{at: '004', C: S004},
	{at: '005', C: S005},
	{at: '006', C: S006},
	{at: '007', C: S007, whip: true},
	{at: '008', C: S008, whip: true},
	{at: '009', C: S009},
	{at: '010', C: S010},
	{at: '011', C: S011},
	{at: '012', C: S012},
	{at: '013', C: S013, whip: true},
	{at: '014', C: S014},
	{at: '015', C: S015},
	{at: '016', C: S016, whip: true},
	{at: '017', C: S017},
	{at: '018', C: S018},
	{at: '019', C: S019},
	{at: '020', C: S020, whip: true},
];
