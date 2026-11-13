import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Pose} from '../engine/Stickman';
import {blend, gesture, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {CrowdRow, Extra} from '../kit/kit';
import {Bubble, Cite} from '../kit/ui';
import {Kitchen, SchoolYard, Shop} from '../kit/sets';
import {Callout} from '../kit/graphics';
import {Armchair, Backyard, Bed, BossDesk, CakeTable, Car, Cafeteria, ClassRoom, Couch, GrandmaRoom, HeroRoom, HouseFront, Lab, LivingRoom, Office, Park, PhoneFrame, Pizzeria, RedVoid, Register, Runway, Scanner, SchoolDesk, Sweater, TVVan, Yarn} from './places';
import {Bill, Book, Brain, CalPage, Coin, Cookie, Key, Mic, Polaroid, Popcorn, TestPaper, Thermo} from './bits';
import {Dog, Flash, Hero, LieStamp, Magic, P, Pow, Scene, Sparks, SpeedLines, Tag, Title, camCut, camK, env, ez, jump, lin, mover, pop, shake, useB, wordOff} from './lib';

const SEAT = 795;
const RB = "'Rubik', sans-serif";
const say = (text: string, size = 44) => (
	<text y={size * 0.36} textAnchor="middle" fontSize={size} fontFamily={RB} fontWeight={900} fill="#2a2030">
		{text}
	</text>
);
const bw = (text: string, size = 44) => text.length * size * 0.62 + 60;
const Table: React.FC<{night?: boolean}> = ({night}) => (
	<g>
		<ellipse cx={960} cy={760} rx={460} ry={46} fill={night ? '#6a5a7a' : '#c98a5a'} />
		<ellipse cx={960} cy={752} rx={460} ry={42} fill={night ? '#8a7aa0' : '#e0a774'} />
		<rect x={700} y={780} width={20} height={120} fill={night ? '#4a3d5a' : '#9a6a44'} />
		<rect x={1200} y={780} width={20} height={120} fill={night ? '#4a3d5a' : '#9a6a44'} />
	</g>
);
const Plate: React.FC<{x: number; empty?: boolean}> = ({x, empty}) => (
	<g>
		<ellipse cx={x} cy={738} rx={60} ry={14} fill="#fbf8ef" stroke="#c9c4b0" strokeWidth={3} />
		{empty ? null : <ellipse cx={x} cy={730} rx={34} ry={10} fill="#e8a03a" />}
	</g>
);

/* 061 «Your family has never had much money.» — empty wallet, a moth flies out */
const S061: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.2], [dur, 960, 600, 1.45]]);
	const open = ez(f, 6, 20, 0, 1);
	return (
		<Scene cam={cam} bg="#2a2a48" light={{night: true, o: 0.45}} set={<Kitchen night />}>
			<Actor who="dad" x={680} pose={reach(idle(f, 2), 'F', [70, -60], 1)} faceTurn={0.5} expr="sad" />
			<Actor who="mom" x={1260} facing={-1} pose={idle(f, 3)} expr="worried" />
			<g transform="translate(830,650)">
				<rect x={-70} y={-40} width={140} height={80} rx={10} fill="#6b4a2a" />
				<rect x={-70} y={-40 - open * 40} width={140} height={40} rx={10} fill="#8a5a3a" transform={`rotate(${-open * 30} -70 -40)`} />
			</g>
			{f > 18 ? (
				<g transform={`translate(${830 + (f - 18) * 6},${600 - (f - 18) * 5 + Math.sin(f / 2) * 10})`}>
					<ellipse cx={-14} rx={16} ry={10} fill="#c9c4b0" transform={`rotate(${Math.sin(f) * 30})`} />
					<ellipse cx={14} rx={16} ry={10} fill="#c9c4b0" transform={`rotate(${-Math.sin(f) * 30})`} />
					<ellipse rx={5} ry={9} fill="#6b5a4a" />
				</g>
			) : null}
			<Pow x={830} y={480} text="$0" t={f - 20} size={70} c="#ff3b4e" />
		</Scene>
	);
};
/* 062 «Your dad works two jobs.» — split: burger flipper | night guard */
const S062: React.FC = () => {
	const {f} = useB();
	const k = ez(f, 0, 10, 0, 1);
	const k2 = ez(f, 6, 16, 0, 1);
	return (
		<AbsoluteFill style={{background: '#0c0e22'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${1.02 + f * 0.0015})`}}>
				<g transform={`translate(${(k - 1) * 1000},0)`}>
					<polygon points="0,0 1010,0 910,1080 0,1080" fill="#f08a3c" />
					<text x={470} y={150} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#fff">
						JOB #1 · 6AM
					</text>
					<rect x={200} y={760} width={560} height={30} fill="#5a3a2a" />
					<Actor who="dad" x={430} floor={1000} s={1.5} color="#d23b3b" outfit="apron" pose={reach(idle(f, 1), 'F', [80, -60 - Math.abs(Math.sin(f / 5)) * 50], 1)} faceTurn={0.5} lidBase={0.4} />
					<ellipse cx={600} cy={700 - Math.abs(Math.sin(f / 5)) * 120} rx={40} ry={14} fill="#7a4a2a" />
				</g>
				<g transform={`translate(${(1 - k2) * 1000},0)`}>
					<polygon points="1010,0 1920,0 1920,1080 910,1080" fill="#1d2a5a" />
					<text x={1450} y={150} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#fff">
						JOB #2 · 11PM
					</text>
					<Actor who="dad" x={1400} floor={1000} s={1.5} color="#3a4256" outfit="suit" hair="cap" hairColor="#28304a" acc={['mustache']} pose={reach(idle(f, 2), 'F', [90, -80], 1)} faceTurn={0.5} lidBase={0.6} />
					<polygon points={`1540,620 1920,${480 + Math.sin(f / 10) * 60} 1920,${760 + Math.sin(f / 10) * 60}`} fill="#fff6c0" opacity={0.35} />
				</g>
				<line x1={1010} y1={0} x2={910} y2={1080} stroke="#fff" strokeWidth={10} opacity={Math.min(k, k2)} />
			</svg>
		</AbsoluteFill>
	);
};
/* 063 «Your mom counts coins at the grocery store.» */
const S063: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 1000, 640, 1.8], [dur, 960, 600, 1.35]]);
	const n = Math.min(14, Math.floor(f / 4));
	return (
		<Scene cam={cam} bg="#f2efe6" set={<Shop f={f} />}>
			<Register x={1300} f={f} />
			<Actor who="cashier" x={1500} facing={-1} pose={idle(f, 5)} lidBase={0.3} />
			<Actor who="mom" x={950} pose={reach(idle(f, 3), 'F', [110, -80 + Math.abs(Math.sin(f / 3)) * 20], 1)} faceTurn={0.6} look={[1, 1]} expr="worried" />
			{Array.from({length: n}).map((_, i) => (
				<Coin key={i} x={1080 + (i % 5) * 12} y={634 - Math.floor(i / 5) * 8 - (i === n - 1 ? Math.max(0, 8 - (f % 4) * 2) * 6 : 0)} s={0.8} />
			))}
			<Pow x={1100} y={500} text="CLINK" t={f % 12} size={34} c="#ffd34a" hold={8} />
			<Pow x={900} y={300} text={`$${(n * 0.25).toFixed(2)}`} t={10} size={60} c="#fff" hold={999} />
		</Scene>
	);
};
/* 064 «So one night at dinner, you test the biggest lie you can think of.» */
const Dinner: React.FC<{cam: any; children?: React.ReactNode; dad?: Partial<React.ComponentProps<typeof Actor>>}> = ({cam, children, dad}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#2a2a48" light={{night: true, o: 0.5}} set={<Kitchen night />}>
			<Actor who="mom" x={1180} facing={-1} pose={idle(f, 3)} />
			<Actor who="emma" x={1380} s={0.72} facing={-1} pose={idle(f, 4)} />
			<Actor who="dad" x={560} pose={reach(idle(f, 2), 'F', [90, -30], 1)} faceTurn={0.6} {...dad} />
			{children}
			<Table night />
			<Plate x={760} />
			<Plate x={960} />
			<Plate x={1160} />
		</Scene>
	);
};
const S064: React.FC = () => {
	const {f, w, dur} = useB();
	const tb = w('064', 'biggest');
	const cam = camCut(f, [[0, 960, 600, 1.1], [tb - 4, 860, 520, 1.7]]);
	return (
		<Dinner cam={cam}>
			<Hero x={860} pose={gesture('rubChin', idle(f, 1), env(f, 8, 999, 8, 1), f)} faceTurn={0.2} mouth="smirk" lidBase={0.55} />
			<Bubble x={1150} y={300} w={300} h={170} t={f - tb} thought tail={[-200, 150]}>
				<text y={40} textAnchor="middle" fontSize={110} fontFamily={RB} fontWeight={900} fill="#3aa37a">
					$$$
				</text>
			</Bubble>
			<Tag x={500} y={260} t={f - 2} text="DINNER" size={50} />
		</Dinner>
	);
};
/* 065 «You say, don't worry, dad's a millionaire.» */
const S065: React.FC = () => {
	const {f, w} = useB();
	const tm = w('065', 'millionaire');
	const cam = shake(camCut(f, [[0, 860, 520, 1.7], [tm + 4, 700, 580, 1.4]]), f, tm + 8, 12);
	return (
		<Dinner cam={cam} dad={{expr: f > tm + 8 ? 'wide' : 'normal', mouth: f > tm + 8 ? 'open' : undefined, pose: f > tm + 8 ? P.scared(f) : undefined}}>
			<Hero x={860} pose={gesture('presentF', idle(f, 1), 1, f)} faceTurn={0.2} mouth="smile" lidBase={0.5} />
			<Bubble x={900} y={300} w={bw("DON'T WORRY, DAD'S A MILLIONAIRE!", 34)} h={90} t={f - 4} tail={[0, 120]}>
				{say("DON'T WORRY, DAD'S A MILLIONAIRE!", 34)}
			</Bubble>
			<LieStamp x={1250} y={430} t={f - tm} />
			<Pow x={560} y={420} text="COUGH!" t={f - tm - 8} size={54} />
		</Dinner>
	);
};
/* 066 «The next morning, there's a new car in the driveway.» */
const S066: React.FC = () => {
	const {f, w} = useB();
	const tc = w('066', 'car');
	const cam = camCut(f, [[0, 960, 540, 1.0], [tc - 4, 1300, 680, 1.5]]);
	const fam = mover(f, tc, tc + 30, 900, 1000, {run: true});
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 70, y: 10, o: 0.5}} set={<HouseFront f={f} doorOpen={ez(f, tc - 10, tc, 0, 1)} />}>
			<Car x={1450} f={f} shiny bow c="#ff2a3c" />
			{f > tc ? <Hero x={fam.x - 120} pose={P.cheer(f)} mouth="open" expr="wide" lidBase={0} /> : null}
			{f > tc ? <Actor who="emma" x={fam.x + 40} s={0.72} pose={P.cheer(f + 5)} mouth="open" /> : null}
			<Pow x={1450} y={540} text="WOW!" t={f - tc - 6} size={80} />
			<Tag x={500} y={250} t={f - 2} text="NEXT MORNING" size={50} />
		</Scene>
	);
};
/* 067 «Your dad isn't working two jobs anymore.» — uniform POOF into a suit */
const S067: React.FC = () => {
	const {f, w} = useB();
	const ta = w('067', 'anymore');
	const rich = f > ta;
	const cam = shake(camCut(f, [[0, 960, 560, 1.5], [ta, 960, 520, 1.75]]), f, ta, 12);
	return (
		<Scene cam={cam} bg="#7fc0ea" set={<HouseFront f={f} />}>
			<Actor who={rich ? 'dadRich' : 'dad'} x={960} outfit={rich ? 'suit' : 'apron'} pose={rich ? P.cheer(f) : gesture('shrug', idle(f, 1), 1, f)} faceTurn={0.1} mouth={rich ? 'smile' : 'frown'} />
			<Sparks x={960} y={600} t={f - ta} r={300} />
			<Pow x={960} y={600} text="POOF!" t={f - ta} size={90} c="#fff" />
			{!rich ? (
				<g transform={`translate(1350,320) scale(${pop(f - 2)})`}>
					<rect x={-150} y={-60} width={300} height={120} rx={20} fill="#141826" />
					<text y={20} textAnchor="middle" fontSize={56} fontFamily={RB} fontWeight={900} fill="#fff">
						2 JOBS
					</text>
					<line x1={-140} y1={0} x2={140 * lin(f, ta - 20, ta - 10, -1, 1)} y2={0} stroke="#ff2a3c" strokeWidth={16} />
				</g>
			) : null}
		</Scene>
	);
};
/* 068 «He's running a company. He has an assistant.» */
const S068: React.FC = () => {
	const {f, w} = useB();
	const ta = w('068', 'assistant');
	const aw = mover(f, ta - 10, ta + 14, 2100, 1350, {seed: 4});
	const cam = camCut(f, [[0, 920, 560, 1.6], [ta - 4, 1150, 560, 1.55]]);
	return (
		<Scene cam={cam} bg="#8fc8ee" light={{x: 30, y: 10, o: 0.45}} set={<Office f={f} />}>
			<Actor who="dadRich" x={900} pose={gesture('point', idle(f, 1), env(f, 4, 999, 8, 1), f)} handF="point" facing={1} mouth="smile" />
			<BossDesk x={960} f={f} />
			<Actor who="assistant" x={aw.x} facing={-1} pose={reach(aw.pose, 'F', [60, -70], 1)} vx={aw.vx} bob={aw.bob} mouth="smile" />
			<g transform={`translate(${aw.x - 60},640)`}>
				<rect x={-30} y={-40} width={60} height={80} rx={4} fill="#9a6a44" />
				<rect x={-24} y={-30} width={48} height={64} fill="#fbf8ef" />
			</g>
			<Tag x={600} y={260} t={f - 4} text="CEO" size={60} c="#ffd34a" />
		</Scene>
	);
};
/* 069 «He has a phone that never stops ringing.» */
const S069: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 1000, 580, 2.1], [dur, 960, 560, 1.6]]);
	return (
		<Scene cam={shake(cam, f, f - (f % 10), 3, 6)} bg="#8fc8ee" set={<Office f={f} />}>
			<Actor who="dadRich" x={900} pose={P.phoneEar(f)} faceTurn={0.3} mouth={f % 20 < 10 ? 'open' : 'flat'} expr="worried" />
			<BossDesk x={960} f={f} ring />
			{[0, 1, 2, 3].map((i) => (
				<Pow key={i} x={1100 + (i % 2) * 300} y={420 + i * 60} text="RING!" t={f - i * 12} size={50} rot={i % 2 ? 10 : -10} c="#ffd34a" hold={14} />
			))}
		</Scene>
	);
};
/* 070 «Your mom cries when she sees the bank account.» */
const S070: React.FC = () => {
	const {f, w} = useB();
	const tb = w('070', 'bank');
	const cam = camCut(f, [[0, 960, 540, 1.6], [tb - 2, 1150, 420, 1.8]]);
	const v = Math.round(lin(f, tb, tb + 30, 312, 1000000));
	return (
		<Scene cam={cam} bg="#f6d9b0" set={<LivingRoom f={f} />}>
			<Actor who="mom" x={900} pose={reach(idle(f, 3), 'F', [80, -100], 1)} faceTurn={0.5} mouth="open" expr={f > tb ? 'sad' : 'normal'} />
			<g transform="translate(1150,420) rotate(-4)">
				<rect x={-190} y={-120} width={380} height={240} rx={20} fill="#0b0d18" />
				<rect x={-176} y={-106} width={352} height={212} rx={10} fill="#f4f6fa" />
				<text y={-50} textAnchor="middle" fontSize={26} fontFamily={RB} fontWeight={800} fill="#555">
					ACCOUNT BALANCE
				</text>
				<text y={30} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#2a7a2a">
					${v.toLocaleString('en-US')}
				</text>
			</g>
			{f > tb + 10
				? [0, 1].map((i) => (
						<path key={i} d={`M${880 + i * 40},560 q-6,${20 + ((f * 3) % 80)} 0,${30 + ((f * 3) % 80)}`} stroke="#9fd2ff" strokeWidth={8} fill="none" strokeLinecap="round" />
					))
				: null}
		</Scene>
	);
};
/* 071 «You've never seen her look so relaxed.» */
const S071: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 600, 1.2], [dur, 960, 560, 1.6]]);
	return (
		<Scene cam={cam} bg="#f6d9b0" set={<LivingRoom f={f} />}>
			<Armchair x={960} />
			<Actor who="mom" x={960} seat={720} pose={{lean: -14, head: -12, armB: [-40, 90], armF: [-30, 100], legB: [88, 85], legF: [92, 90]}} faceTurn={0} lidBase={0.7} mouth="smile" />
			<circle cx={945} cy={556} r={11} fill="#8fd06a" />
			<circle cx={975} cy={556} r={11} fill="#8fd06a" />
			<Pow x={1200} y={400} text="AHHH~" t={f - 4} size={60} c="#fff" hold={999} />
			{[0, 1, 2].map((i) => (
				<Pow key={i} x={720 + i * 60} y={420 - ((f + i * 25) % 60) * 2} text="♪" t={8} size={44} c="#fff" hold={999} />
			))}
		</Scene>
	);
};
/* 072 «You lie to a famous basketball player in a video comment.» */
const S072: React.FC = () => {
	const {f, w, dur} = useB();
	const cam = camK(f, [[0, 960, 540, 1.0], [dur, 960, 560, 1.2]]);
	return (
		<Scene cam={cam} bg="#cfe4ef" set={<HeroRoom f={f} night={false} />}>
			<Hero x={520} pose={reach(idle(f, 1), 'F', [90, -80], 1)} faceTurn={0.6} look={[1, 0]} mouth="smirk" />
			<PhoneFrame x={1150} y={540} s={1.1} tilt={4}>
				<rect x={-182} y={-350} width={364} height={260} fill="#f08a3c" />
				<circle cx={0} cy={-250} r={50} fill="#000" />
				<rect x={-40} y={-200} width={80} height={110} rx={20} fill="#fff" />
				<circle cx={80} cy={-150} r={34} fill="#f08a3c" stroke="#7a3a10" strokeWidth={4} />
				<text x={-160} y={-50} fontSize={26} fontFamily={RB} fontWeight={900} fill="#2a2030">
					SUPERSTAR #23
				</text>
				<text x={-160} y={-10} fontSize={20} fontFamily={RB} fill="#777">
					12M views · comments
				</text>
				{['nice shot!!', 'GOAT!!', 'legend'].map((t, i) => (
					<g key={i} transform={`translate(-160,${40 + i * 60})`}>
						<circle cx={16} cy={-6} r={16} fill={['#3aa37a', '#9b6cf0', '#3a6fd2'][i]} />
						<text x={44} fontSize={22} fontFamily={RB} fill="#333">
							{t}
						</text>
					</g>
				))}
				<rect x={-170} y={230} width={340} height={70} rx={14} fill="#e6eaf2" />
				<text x={-150} y={274} fontSize={22} fontFamily={RB} fill="#2a2030">
					{'you promised to come to'.slice(0, Math.max(0, Math.floor((f - 20) / 2)))}
				</text>
			</PhoneFrame>
		</Scene>
	);
};
/* 073 «You promise to come to my birthday.» */
const S073: React.FC = () => {
	const {f} = useB();
	const cam = camK(f, [[0, 1150, 700, 1.7], [50, 1150, 680, 1.9]]);
	return (
		<Scene cam={cam} bg="#cfe4ef" set={<HeroRoom f={f} night={false} />}>
			<PhoneFrame x={1150} y={540} s={1.1} tilt={4}>
				<rect x={-182} y={-350} width={364} height={700} fill="#f4f6fa" />
				<rect x={-170} y={170} width={340} height={110} rx={14} fill="#3a6fd2" />
				<text x={-150} y={214} fontSize={22} fontFamily={RB} fontWeight={800} fill="#fff">
					YOU PROMISED TO COME
				</text>
				<text x={-150} y={250} fontSize={22} fontFamily={RB} fontWeight={800} fill="#fff">
					TO MY BIRTHDAY!
				</text>
				<text x={110} y={310} fontSize={20} fontFamily={RB} fill="#3a6fd2">
					SENT ✓
				</text>
			</PhoneFrame>
			<LieStamp x={1350} y={360} t={f - 14} />
		</Scene>
	);
};
/* 074 «Three weeks later, he's in your backyard, eating cake, saying, I really don't remember promising this, but happy birthday, man.» */
const S074: React.FC = () => {
	const {f, w} = useB();
	const tb = w('074', 'backyard');
	const te = w('074', 'eating');
	const ts = w('074', 'saying');
	const th = w('074', 'happy');
	const cam = camCut(f, [[0, 960, 540, 1.0], [tb - 2, 960, 520, 1.15], [te - 2, 1080, 480, 1.8], [ts + 10, 960, 520, 1.25], [th - 4, 1080, 470, 1.6]]);
	const bite = Math.abs(Math.sin(f / 4));
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}} set={<Backyard f={f} />}>
			<Actor who="emma" x={500} s={0.72} pose={P.cheer(f)} mouth="open" />
			<Hero x={720} pose={P.cheer(f + 7)} mouth="smile" lidBase={0.2} />
			<Actor who="player" x={1080} s={1.38} facing={-1} pose={f < ts ? reach(idle(f, 2), 'F', [60, -150 + bite * 20], 1) : gesture('shrug', idle(f, 2), 1, f)} mouth={f < ts ? (bite > 0.5 ? 'open' : 'flat') : undefined} faceTurn={0.4} />
			{f < ts ? <path d={`M1020,${560 + bite * 20} l30,0 l-15,-26 z`} fill="#ffe0f0" stroke="#ff6a9a" strokeWidth={3} /> : null}
			<CakeTable x={1450} f={f} slices={1} />
			<Dog x={1700} f={f} mode="sit" />
			<Bubble x={1300} y={230} w={bw("I DON'T REMEMBER PROMISING THIS...", 30)} h={80} t={f - ts} tail={[-160, 110]}>
				{say("I DON'T REMEMBER PROMISING THIS...", 30)}
			</Bubble>
			<Pow x={1150} y={360} text="HAPPY BIRTHDAY, MAN!" t={f - th} size={56} hold={60} />
			<Tag x={960} y={150} t={f - 2} text="3 WEEKS LATER" size={50} />
		</Scene>
	);
};
/* 075 «A TV reporter stops you outside school and asks what makes your town special.» */
const S075: React.FC = () => {
	const {f, w} = useB();
	const ta = w('075', 'asks');
	const rw = mover(f, 0, 30, 2100, 1150, {run: true});
	const cam = camCut(f, [[0, 1100, 560, 1.05], [ta - 2, 1000, 520, 1.55]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" set={<SchoolYard f={f} />}>
			<TVVan x={1650} f={f} />
			<Hero x={820} pose={gesture('stop', idle(f, 1), env(f, 20, ta, 6, 6), f)} faceTurn={0.6} expr="wide" lidBase={0.1} />
			<Actor who="reporter" x={rw.x} facing={-1} pose={reach(rw.pose, 'F', [100, -110], 1)} vx={rw.vx} bob={rw.bob} mouth="open" />
			<Mic x={rw.x - 100} y={600} />
			<Bubble x={1200} y={300} w={bw('WHAT MAKES YOUR TOWN SPECIAL?', 34)} h={90} t={f - ta} tail={[0, 120]}>
				{say('WHAT MAKES YOUR TOWN SPECIAL?', 34)}
			</Bubble>
			<g transform="translate(1500,200)" opacity={Math.floor(f / 15) % 2 ? 1 : 0.4}>
				<circle r={16} fill="#ff2a3c" />
				<text x={26} y={12} fontSize={34} fontFamily={RB} fontWeight={900} fill="#fff">
					LIVE
				</text>
			</g>
		</Scene>
	);
};
/* 076 «You panic and say, we have the best pizza in America.» */
const S076: React.FC = () => {
	const {f, w} = useB();
	const tw = w('076', 'we');
	const cam = camCut(f, [[0, 820, 500, 2.2], [tw - 2, 960, 540, 1.4]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" set={<SchoolYard f={f} />}>
			<Hero x={820} pose={f < tw ? gesture('handsOnHead', idle(f, 1), 1, f) : P.present(f)} faceTurn={0.6} expr={f < tw ? 'wide' : 'normal'} lidBase={f < tw ? 0 : 0.3} mouth="open" />
			{f < tw ? [0, 1, 2].map((i) => <circle key={i} cx={760 + i * 60} cy={460 + ((f * 4 + i * 20) % 80)} r={8} fill="#9fd2ff" />) : null}
			<Actor who="reporter" x={1150} facing={-1} pose={reach(idle(f, 3), 'F', [100, -110], 1)} />
			<Mic x={1050} y={600} />
			<Bubble x={900} y={300} w={bw('WE HAVE THE BEST PIZZA IN AMERICA!', 34)} h={90} t={f - tw} tail={[-40, 120]}>
				{say('WE HAVE THE BEST PIZZA IN AMERICA!', 34)}
			</Bubble>
			<LieStamp x={1350} y={430} t={f - tw - 26} />
			<Pow x={820} y={300} text="PANIC!" t={f - 2} size={60} c="#ff3b4e" hold={tw - 12} />
		</Scene>
	);
};
/* 077 «You don't. You have one pizza place and it's bad.» */
const S077: React.FC = () => {
	const {f, w, dur} = useB();
	const tb = w('077', 'bad');
	const cam = camK(f, [[0, 960, 520, 1.0], [dur, 900, 600, 1.4]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 30, y: 10, o: 0.3}} set={<Pizzeria f={f} />}>
			<Actor who="chef" x={900} pose={gesture('shrug', idle(f, 1), 1, f)} faceTurn={0.2} expr="sad" mouth="frown" />
			<g transform="translate(1180,700)">
				<path d="M-70,0 L70,0 L0,-120 Z" fill="#e8a03a" stroke="#9a6a3a" strokeWidth={5} />
				<circle cx={-10} cy={-30} r={10} fill="#5a7a2a" />
				{[0, 1].map((i) => (
					<g key={i} transform={`translate(${Math.sin(f / 5 + i * 3) * 50},${-120 + Math.cos(f / 4 + i) * 30})`}>
						<circle r={6} fill="#141826" />
						<ellipse cx={-6} cy={-6} rx={7} ry={4} fill="#fff" opacity={0.7} />
					</g>
				))}
			</g>
			<g transform={`translate(1450,330) scale(${pop(f - tb)})`}>
				<rect x={-170} y={-50} width={340} height={100} rx={20} fill="#fbf8ef" stroke="#2a2030" strokeWidth={5} />
				<text y={18} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#d23b3b">
					★☆☆☆☆
				</text>
			</g>
			<Title t={f - 2} dur={tb - 4} lines={['(YOU DON\'T.)']} y={60} size={70} c="#fff" />
		</Scene>
	);
};
/* 078 «A month later, there are lines around the block, tourists from six states, and the owner is crying into a pile of dough, asking nobody in particular what changed.» */
const S078: React.FC = () => {
	const {f, w} = useB();
	const tt = w('078', 'tourists');
	const to = w('078', 'owner');
	const tc = w('078', 'changed');
	if (f < to - 4) {
		const cam = camCut(f, [[0, 960, 520, 0.95], [tt - 2, 600, 600, 1.5]]);
		return (
			<Scene cam={cam} bg="#7fc0ea" set={<Pizzeria f={f} busy />}>
				<CrowdRow n={14} x0={-300} x1={2300} floor={900} s={0.85} mode="stand" seed="pzq" />
				<CrowdRow n={10} x0={-500} x1={600} floor={920} s={0.9} mode="walk" seed="tou" t={f} dir={1} />
				{f > tt
					? ['TX', 'OH', 'NY', 'CA', 'FL', 'IL'].map((s, i) => (
							<g key={i} transform={`translate(${200 + i * 140},${420 + (i % 2) * 40}) scale(${pop(f - tt - i * 4)})`}>
								<path d="M0,40 C-30,0 -30,-30 0,-30 C30,-30 30,0 0,40 Z" fill="#ff2a3c" stroke="#fff" strokeWidth={4} />
								<text y={-4} textAnchor="middle" fontSize={20} fontFamily={RB} fontWeight={900} fill="#fff">
									{s}
								</text>
							</g>
						))
					: null}
				<Tag x={960} y={120} t={f - 2} text="A MONTH LATER" size={54} />
			</Scene>
		);
	}
	const cam = camCut(f, [[to - 4, 960, 600, 1.6], [tc - 6, 960, 560, 1.95]]);
	return (
		<Scene cam={cam} bg="#2a2a48" light={{x: 40, y: 10, o: 0.5}} set={<Kitchen night />}>
			<Actor who="chef" x={960} pose={{...P.slump(f), lean: 30 + Math.sin(f / 3) * 4}} faceTurn={0} expr="sad" mouth="open" />
			<ellipse cx={1010} cy={760} rx={140} ry={50} fill="#f6e6c0" stroke="#d9c49a" strokeWidth={4} />
			{[0, 1].map((i) => (
				<path key={i} d={`M${950 + i * 40},560 q-8,${30 + ((f * 4) % 100)} 0,${40 + ((f * 4) % 100)}`} stroke="#9fd2ff" strokeWidth={9} fill="none" strokeLinecap="round" />
			))}
			<Bubble x={1300} y={320} w={bw('WHAT CHANGED?!', 44)} h={100} t={f - tc + 20} tail={[-200, 120]}>
				{say('WHAT CHANGED?!', 44)}
			</Bubble>
			<Pow x={700} y={420} text="SOB!" t={(f - to) % 30} size={50} c="#9fd2ff" hold={20} />
		</Scene>
	);
};
/* 079 «Grandma knits you a sweater for your birthday.» */
const S079: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.15], [dur, 1000, 620, 1.65]]);
	const k = Math.sin(f / 1.8) * 14;
	return (
		<Scene cam={cam} bg="#f2d8e0" light={{x: 70, y: 20, o: 0.5}} set={<GrandmaRoom f={f} />}>
			<Armchair x={960} />
			<Actor who="grandma" x={960} seat={720} pose={{lean: 2, head: 10, armF: [70 + k, 60], armB: [60 - k, 70], legB: [88, 85], legF: [92, 90]}} faceTurn={0.2} mouth="smile" />
			<rect x={990} y={640} width={90 + Math.min(80, f)} height={60} rx={6} fill="#f08a3c" />
			<line x1={1000} y1={620} x2={1080} y2={700} stroke="#c9cfdd" strokeWidth={5} transform={`rotate(${k} 1040 660)`} />
			<Yarn x={1240} y={860} f={f} />
			<Yarn x={1320} y={870} f={-f} c="#3aa37a" />
			<path d={`M1240,860 Q1150,${780 + Math.sin(f / 3) * 20} 1060,680`} stroke="#f08a3c" strokeWidth={4} fill="none" />
			<Pow x={1250} y={460} text="CLICK CLICK" t={f % 30} size={38} c="#fff" hold={22} />
		</Scene>
	);
};
/* 080 «It's orange and green, with a reindeer that looks like it's screaming.» */
const S080: React.FC = () => {
	const {f, w} = useB();
	const tr = w('080', 'reindeer');
	const ts = w('080', 'screaming');
	const cam = camCut(f, [[0, 960, 540, 1.0], [tr - 2, 960, 500, 1.6]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<GrandmaRoom f={f} />}>
			<Sweater x={960} y={560} s={1.6 * pop(f)} f={f} />
			<Tag x={560} y={300} t={f - w('080', 'orange')} text="ORANGE" c="#ffb070" size={50} />
			<Tag x={1360} y={300} t={f - w('080', 'green')} text="GREEN" c="#a8e6a8" size={50} rot={5} />
			<Pow x={1250} y={460} text="AAAAA!" t={f - ts} size={70} c="#ff3b4e" />
		</Scene>
	);
};
/* 081 «You say what everyone says. I love it.» */
const S081: React.FC = () => {
	const {f, w} = useB();
	const tl = w('081', 'love');
	const cam = camCut(f, [[0, 960, 560, 1.2], [tl - 6, 860, 520, 1.7]]);
	return (
		<Scene cam={cam} bg="#f2d8e0" set={<GrandmaRoom f={f} />}>
			<Actor who="grandma" x={1260} facing={-1} pose={idle(f, 2)} mouth="smile" />
			<Hero x={760} pose={P.carry(f)} faceTurn={0.4} mouth={f > tl ? 'smile' : 'flat'} lidBase={0.5} />
			<Sweater x={880} y={640} s={0.45} f={f} />
			<Bubble x={760} y={290} w={bw('I LOVE IT!')} h={100} t={f - tl + 6} tail={[0, 120]}>
				{say('I LOVE IT!')}
			</Bubble>
			<LieStamp x={1040} y={260} t={f - tl - 10} />
		</Scene>
	);
};
/* 082 «It's my favorite. And then you do love it.» */
const S082: React.FC = () => {
	const {f, w} = useB();
	const td = w('082', 'do');
	const cam = camCut(f, [[0, 860, 520, 1.6], [td - 2, 900, 540, 1.3]]);
	return (
		<Scene cam={cam} bg="#f2d8e0" set={<GrandmaRoom f={f} />}>
			<Hero x={860} pose={f > td ? P.hug(f) : P.carry(f)} faceTurn={0.4} mouth="smile" lidBase={f > td ? 0.7 : 0.4} />
			<Sweater x={960} y={640} s={0.45} f={f} />
			<Magic x={900} y={600} t={f - td + 20} w={240} h={240} />
			{f > td ? [0, 1, 2, 3].map((i) => <Pow key={i} x={760 + i * 80} y={400 - ((f - td + i * 15) % 50) * 3} text="♥" t={8} size={50} c="#ff6a8a" hold={999} />) : null}
			<Bubble x={760} y={290} w={bw("IT'S MY FAVORITE!", 40)} h={100} t={f - 2} tail={[0, 120]}>
				{say("IT'S MY FAVORITE!", 40)}
			</Bubble>
		</Scene>
	);
};
/* 083 «Deeply, you wear it every day for three weeks in June.» */
const S083: React.FC = () => {
	const {f, w, dur} = useB();
	const tj = w('083', 'june');
	const hw = mover(f, 0, dur, 300, 1600, {seed: 1});
	const cam = camOn3(hw.x, 560, 1.3);
	const day = Math.min(21, 1 + Math.floor(f / 6));
	return (
		<Scene cam={cam} bg="#ffd27a" light={{x: 70, y: 0, o: 0.7, c: '255,200,120'}} set={<SchoolYard f={f} />}>
			<circle cx={1700} cy={120} r={110} fill="#fff4b0" opacity={0.9} />
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} color="#f08a3c" faceTurn={0.5} mouth="smile" lidBase={0.6} />
			{[0, 1, 2].map((i) => <circle key={i} cx={hw.x - 40 + i * 40} cy={520 + ((f * 3 + i * 30) % 60)} r={7} fill="#9fd2ff" />)}
			<CalPage x={hw.x + 380} y={360} top="JUNE" big={`${day}`} s={0.8} rot={6} />
			<Pow x={hw.x - 300} y={300} text="34°C" t={f - tj} size={64} c="#ff6a3a" hold={999} />
		</Scene>
	);
};
const camOn3 = (X: number, Y: number, z: number) => ({x: (X - 960) * z, y: (Y - 540) * z, zoom: z, focus: 1, farBlur: 3, nearBlur: 10});
/* 084 «Kids start asking where you got it.» */
const S084: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.05], [dur, 960, 540, 1.4]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" set={<SchoolYard f={f} />}>
			<Hero x={960} pose={P.present(f)} color="#f08a3c" faceTurn={0.1} mouth="smile" lidBase={0.5} />
			{[560, 700, 1220, 1360].map((x, i) => {
				const m = mover(f, i * 4, 24 + i * 4, x < 960 ? -200 : 2100, x, {seed: i});
				return <Extra key={i} i={i} x={m.x} floor={900} s={0.85} pose={gesture('point', m.pose, env(f, 26 + i * 4, 999, 6, 1), f)} facing={x < 960 ? 1 : -1} seed="kd" expr="wide" />;
			})}
			{['WHERE?!', 'SO COOL', 'I NEED IT', 'WHO MADE IT?'].map((t, i) => (
				<Bubble key={i} x={[420, 700, 1260, 1520][i]} y={[360, 280, 280, 360][i]} w={t.length * 22 + 50} h={70} t={f - 26 - i * 5} tail={[0, 80]}>
					{say(t, 32)}
				</Bubble>
			))}
		</Scene>
	);
};
/* 085 «You hear yourself say, my grandma is a famous designer.» */
const S085: React.FC = () => {
	const {f, w} = useB();
	const tm = w('085', 'my');
	const cam = camCut(f, [[0, 960, 520, 1.8], [tm - 2, 960, 540, 1.35]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" set={<SchoolYard f={f} />}>
			<Hero x={960} pose={gesture('touchFace', idle(f, 1), env(f, 0, tm, 6, 6), f)} armOver={f < tm} color="#f08a3c" faceTurn={0.1} mouth="smirk" lidBase={0.5} />
			<Bubble x={960} y={290} w={bw('MY GRANDMA IS A FAMOUS DESIGNER.', 34)} h={90} t={f - tm} tail={[0, 120]}>
				{say('MY GRANDMA IS A FAMOUS DESIGNER.', 34)}
			</Bubble>
			<LieStamp x={1300} y={460} t={f - tm - 30} />
		</Scene>
	);
};
/* 086 «By Friday, grandma has a fashion line in Paris and a waiting list of eight months.» */
const S086: React.FC = () => {
	const {f, w} = useB();
	const tp = w('086', 'paris');
	const te = w('086', 'eight');
	const gw = mover(f, 4, 80, 300, 1100, {seed: 2});
	const cam = camCut(f, [[0, 960, 560, 1.0], [tp - 2, gw.x, 540, 1.4], [te - 2, 1400, 400, 1.3]]);
	return (
		<Scene cam={cam} bg="#0a0a18" light={{x: 50, y: 0, o: 0.5, c: '255,220,255'}} set={<Runway f={f} />}>
			<Actor who="grandma" x={gw.x} floor={890} pose={{...gw.pose, lean: -4}} vx={gw.vx} bob={gw.bob} faceTurn={0.6} mouth="smirk" lidBase={0.5} />
			<Sweater x={gw.x + 10} y={700} s={0.32} f={f} />
			{f > te ? (
				<g transform={`translate(1400,380) scale(${pop(f - te)})`}>
					<rect x={-240} y={-90} width={480} height={180} rx={24} fill="#141826" stroke="#ffd34a" strokeWidth={6} />
					<text y={-28} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={800} fill="#c9cfdd">
						WAITING LIST
					</text>
					<text y={50} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#ffd34a">
						8 MONTHS
					</text>
				</g>
			) : null}
			<Tag x={960} y={130} t={f - 2} text="BY FRIDAY" size={50} />
		</Scene>
	);
};
/* 087 «You start to feel like the luckiest kid alive.» */
const S087: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.5], [dur, 960, 540, 1.0]]);
	const items = ['car', 'cookie', 'key', 'pizza', 'sweater', '100', 'dog', '$'];
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={960} floor={900 - jump(f % 30, 2, 60, 18).lift} pose={P.cheer(f)} mouth="smile" lidBase={0.3} />
			{items.map((it, i) => {
				const a = (i / items.length) * Math.PI * 2 + f / 25;
				const x = 960 + Math.cos(a) * 520;
				const y = 480 + Math.sin(a) * 240;
				const s = pop(f - i * 3);
				return (
					<g key={i} transform={`translate(${x},${y}) scale(${s})`}>
						{it === 'car' ? <Car x={0} y={60} s={0.35} f={f} c="#ff2a3c" shiny /> : null}
						{it === 'cookie' ? <Cookie x={0} y={0} s={2} /> : null}
						{it === 'key' ? <Key x={0} y={0} s={0.8} /> : null}
						{it === 'pizza' ? <path d="M-50,30 L50,30 L0,-60 Z" fill="#e8a03a" stroke="#9a6a3a" strokeWidth={5} /> : null}
						{it === 'sweater' ? <Sweater x={0} y={0} s={0.3} f={f} /> : null}
						{it === '100' ? <TestPaper x={0} y={0} s={0.3} grade="100" t={20} /> : null}
						{it === 'dog' ? <Dog x={0} floor={60} s={0.4} f={f} mode="sit" /> : null}
						{it === '$' ? <Bill x={0} y={0} s={1.4} /> : null}
					</g>
				);
			})}
			<Title t={f - 4} lines={['LUCKIEST KID ALIVE']} y={70} size={84} />
		</Scene>
	);
};
/* 088 «You can have anything as long as you say it wrong.» */
const S088: React.FC = () => {
	const {f, w, dur} = useB();
	const tw = w('088', 'wrong');
	const cam = camK(f, [[0, 960, 540, 1.1], [dur, 960, 500, 1.6]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={960} pose={gesture('wave', {...idle(f, 1), armF: [150, 40]}, 1, f)} handF="snap" mouth="smirk" lidBase={0.6} />
			{[0, 1, 2].map((i) => (
				<Sparks key={i} x={1060} y={520} t={f - 4 - i * 20} r={120} seed={'sn' + i} />
			))}
			<Title t={f - 2} lines={['ANYTHING...', f > tw - 4 ? 'IF YOU SAY IT WRONG' : '']} y={70} size={80} c="#ff3b4e" />
		</Scene>
	);
};
/* 089 «But here's the thing about lies.» — the lights drop */
const S089: React.FC = () => {
	const {f, dur} = useB();
	const dim = lin(f, 0, 20, 0, 0.6);
	const cam = camK(f, [[0, 960, 540, 1.3], [dur, 960, 520, 1.7]]);
	return (
		<Scene cam={cam} bg="#100206" light={false} set={<RedVoid f={f} c="#4a0810" />} over={<AbsoluteFill style={{background: '#000', opacity: dim * (Math.random ? 1 : 1) * (0.9 + 0.1 * Math.sin(f))}} />}>
			<Hero x={960} pose={idle(f, 1)} faceTurn={0.1} mouth="flat" expr="worried" lidBase={0.2} />
		</Scene>
	);
};
/* 090 «Even normal ones, they don't stay where you put them.» — a little lie escapes the box */
const S090: React.FC = () => {
	const {f, w, dur} = useB();
	const td = w('090', 'stay');
	const esc = Math.max(0, f - td);
	const bx = 1200 + esc * 9;
	const by = 620 - Math.abs(Math.sin(esc / 5)) * 160;
	const hw = mover(f, td + 8, dur + 10, 800, 1700, {run: true});
	const cam = camK(f, [[0, 1100, 620, 1.6], [td, 1150, 600, 1.4], [dur, 1500, 600, 1.1]]);
	return (
		<Scene cam={cam} bg="#cfe4ef" set={<HeroRoom f={f} night={false} />}>
			<rect x={1100} y={640} width={200} height={140} fill="#c98a5a" stroke="#8a5a3a" strokeWidth={5} />
			<rect x={1100} y={600} width={200} height={40} fill="#d9a066" stroke="#8a5a3a" strokeWidth={5} transform={`rotate(${f > td ? -40 : 0} 1100 640)`} />
			<Hero x={f > td + 8 ? hw.x : 800} pose={f > td + 8 ? hw.pose : reach(idle(f, 1), 'F', [140, -40], env(f, 0, td, 6, 6))} vx={hw.vx} bob={hw.bob} faceTurn={0.5} expr={f > td ? 'wide' : 'normal'} lidBase={f > td ? 0 : 0.4} mouth={f > td ? 'open' : 'smile'} />
			<g transform={`translate(${f > td ? bx : 1200},${f > td ? by : 600}) rotate(${Math.sin(f / 3) * 10})`}>
				<rect x={-60} y={-34} width={120} height={60} rx={30} fill="#fff" stroke="#ff2a3c" strokeWidth={5} />
				<text y={8} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
					LIE
				</text>
				<circle cx={-20} cy={-50} r={8} fill="#fff" />
				<circle cx={20} cy={-50} r={8} fill="#fff" />
			</g>
			<Pow x={1300} y={420} text="BOING!" t={f - td} size={56} />
		</Scene>
	);
};
/* 091 «Scientists at a university in London once put people in a brain scanner and gave them the chance to lie for money.» */
const S091: React.FC = () => {
	const {f, w} = useB();
	const tb = w('091', 'brain');
	const tm = w('091', 'money');
	const slide = ez(f, tb, tb + 30, 0, 1);
	const cam = camCut(f, [[0, 960, 540, 1.0], [tb - 2, 1000, 600, 1.3], [tm - 4, 1250, 520, 1.6]]);
	return (
		<Scene cam={cam} bg="#dff2f2" light={{x: 30, y: 10, o: 0.4}} set={<Lab f={f} />}>
			<Scanner x={960} />
			<g transform={`translate(${1340 - slide * 300},752) rotate(-90)`}>
				<Actor who="guy" x={0} floor={157} pose={{lean: 0, head: 0, armB: [0, 0], armF: [0, 0], legB: [0, 0], legF: [0, 0]}} faceTurn={0} shadow={false} />
			</g>
			<Actor who="sci" x={500} pose={gesture('presentF', idle(f, 2), 1, f)} mouth="open" />
			{f > tm ? [0, 1, 2, 3, 4].map((i) => <Bill key={i} x={1300 + i * 50} y={300 + Math.sin(f / 5 + i) * 20} rot={i * 12 - 20} s={pop(f - tm - i * 3)} />) : null}
			<Tag x={1500} y={160} t={f - 4} text="LONDON" size={50} />
		</Scene>
	);
};
/* 092 «At first, the part of the brain linked to emotion lit up every time they lied.» */
const BrainBoard: React.FC<{glow: number; children?: React.ReactNode}> = ({glow, children}) => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 540, 1.0], [dur, 960, 540, 1.12]]);
	return (
		<Scene cam={cam} bg="#141a3a" light={false} set={<RedVoid f={f} c="#1d2a5a" words={false} />}>
			<Brain x={760} y={520} s={1.5} glow={glow} />
			{children}
		</Scene>
	);
};
const S092: React.FC = () => {
	const {f, w} = useB();
	const te = w('092', 'emotion');
	const pulse = f > te ? Math.max(0, Math.sin((f - te) / 5)) : 0;
	return (
		<BrainBoard glow={pulse}>
			<Callout f={f} t0={te} t1={999} from={[730, 610]} to={[1250, 400]} text="EMOTION" c="#ff3b4e" />
			{f > te ? <Pow x={1350} y={660} text="LIE = BAD" t={f - te - 10} size={54} c="#ff3b4e" hold={999} /> : null}
		</BrainBoard>
	);
};
/* 093 «It felt bad. But the more they lied, the quieter it got.» */
const S093: React.FC = () => {
	const {f, w} = useB();
	const tm = w('093', 'more');
	const n = Math.max(0, Math.floor((f - tm) / 10));
	const g = f < tm ? 1 : Math.max(0.08, 1 - n * 0.18) * Math.max(0, Math.sin(((f - tm) % 10) / 3));
	return (
		<BrainBoard glow={f < tm ? 0.8 + 0.2 * Math.sin(f / 3) : g}>
			<g transform="translate(1450,560)">
				{Array.from({length: Math.min(6, n + 1)}).map((_, i) => (
					<g key={i}>
						<rect x={-260 + i * 90} y={-Math.max(30, 300 - i * 50)} width={60} height={Math.max(30, 300 - i * 50)} fill="#ff3b4e" opacity={0.9} />
						<text x={-230 + i * 90} y={40} textAnchor="middle" fontSize={24} fontFamily={RB} fontWeight={800} fill="#c9cfdd">
							#{i + 1}
						</text>
					</g>
				))}
				<text x={-30} y={100} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={900} fill="#fff">
					LIE NUMBER
				</text>
			</g>
			<Pow x={760} y={240} text="IT FELT BAD" t={f - 2} size={56} c="#fff" hold={tm - 10} />
		</BrainBoard>
	);
};
/* 094 «Each lie felt a little less wrong.» */
const S094: React.FC = () => {
	const {f, dur} = useB();
	const k = lin(f, 4, dur - 10, 0, 1);
	return (
		<BrainBoard glow={0.15}>
			<g transform="translate(1400,560)">
				<rect x={-320} y={-300} width={640} height={420} rx={20} fill="#0b0d18" opacity={0.8} />
				<polyline points={Array.from({length: 20}).filter((_, i) => i / 19 <= k).map((_, i) => `${-280 + i * 29},${-230 + Math.pow(i / 19, 0.5) * 300}`).join(' ')} stroke="#ff3b4e" strokeWidth={8} fill="none" />
				<text x={0} y={100} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={900} fill="#fff">
					HOW BAD IT FEELS
				</text>
			</g>
			<g>
				<Cite text="Garrett et al., Nature Neuroscience, 2016" t={f} x={1860} y={1030} />
			</g>
		</BrainBoard>
	);
};
/* 095 «And the lies got bigger. That's exactly what happens to you.» — the counter races */
const S095: React.FC = () => {
	const {f, w} = useB();
	const tt = w('095', "that's");
	const cam = camCut(f, [[0, 960, 540, 1.0], [tt - 2, 960, 470, 1.9]]);
	return (
		<Scene cam={shake(cam, f, 0, 4, 60)} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={960} pose={P.present(f)} mouth="smirk" lidBase={0.5} />
			{Array.from({length: 10}).map((_, i) => {
				const t = f - i * 5;
				const s = 0.4 + i * 0.18;
				return t > 0 ? (
					<g key={i} transform={`translate(${960 + Math.cos(i * 2.1) * 560},${460 + Math.sin(i * 2.1) * 240}) scale(${pop(t) * s})`}>
						<rect x={-80} y={-36} width={160} height={66} rx={33} fill="#fff" stroke="#ff2a3c" strokeWidth={6} />
						<text y={12} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
							LIE
						</text>
					</g>
				) : null;
			})}
		</Scene>
	);
};
/* 096 «You stop noticing when you're lying.» — stamps pop all around, he whistles on */
const S096: React.FC = () => {
	const {f, dur} = useB();
	const hw = mover(f, 0, dur, 400, 1500, {seed: 2});
	const cam = camOn3(hw.x, 560, 1.35);
	return (
		<Scene cam={cam} bg="#f1e6c8" set={<SchoolYard f={f} />}>
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.5} mouth="smile" lidBase={0.7} />
			<Pow x={hw.x + 120} y={400} text="♪" t={f % 20} size={50} c="#fff" hold={14} />
			{[0, 1, 2, 3].map((i) => (
				<LieStamp key={i} x={hw.x + [-260, 260, -200, 220][i]} y={[340, 300, 560, 600][i]} t={f - 4 - i * 10} />
			))}
		</Scene>
	);
};
/* 097 «And that's when things start going wrong.» — flicker and a crack */
const S097: React.FC = () => {
	const {f, w} = useB();
	const tw = w('097', 'wrong');
	const cam = shake(camK(f, [[0, 960, 540, 1.2], [tw, 960, 520, 1.5]]), f, tw, 20, 20);
	const flick = f > 10 && Math.floor(f / 3) % 4 === 0 ? 0.6 : 0;
	return (
		<Scene cam={cam} bg="#100206" light={false} set={<RedVoid f={f} c="#4a0810" />} over={<AbsoluteFill style={{background: '#000', opacity: flick}} />}>
			<Hero x={960} pose={P.scared(f)} expr="wide" lidBase={0} mouth="open" />
			{f > tw ? <path d={`M960,0 L920,180 L1000,300 L930,460 L1010,600 L960,${Math.min(1080, 600 + (f - tw) * 30)}`} stroke="#fff" strokeWidth={6} fill="none" /> : null}
			<Pow x={1300} y={300} text="CRACK" t={f - tw} size={70} c="#fff" />
		</Scene>
	);
};
/* 098 «Your dad, the millionaire, is never home anymore.» */
const S098: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 600, 1.1], [dur, 760, 640, 1.6]]);
	return (
		<Scene cam={cam} bg="#2a2a48" light={{night: true, o: 0.5}} set={<Kitchen night />}>
			<Actor who="mom" x={1180} facing={-1} pose={idle(f, 3)} expr="sad" />
			<Hero x={1000} pose={idle(f, 1)} faceTurn={0.5} look={[-1, 0]} expr="sad" />
			<rect x={660} y={600} width={20} height={300} fill="#8a6a50" />
			<rect x={660} y={770} width={150} height={20} fill="#8a6a50" />
			<Table night />
			<Plate x={760} />
			<Pow x={740} y={540} text="EMPTY CHAIR" t={f - 20} size={40} c="#fff" hold={999} />
		</Scene>
	);
};
/* 099 «He works 18 hours a day.» */
const S099: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 920, 560, 1.9], [dur, 960, 560, 1.5]]);
	return (
		<Scene cam={cam} bg="#050820" light={{night: true, o: 0.6}} set={<Office f={f} night />}>
			<Actor who="dadRich" x={900} pose={{...P.slump(f), head: 26}} faceTurn={0.3} lidBase={0.7} expr="sad" />
			<BossDesk x={960} f={f} />
			<g transform="translate(1450,300)">
				<rect x={-170} y={-70} width={340} height={140} rx={20} fill="#141826" stroke="#ff3b4e" strokeWidth={5} />
				<text y={24} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#ff3b4e">
					{Math.min(18, Math.floor(f / 2))} HRS
				</text>
			</g>
		</Scene>
	);
};
/* 100 «He misses dinner, then the weekend, then Emma's birthday.» */
const S100: React.FC = () => {
	const {f, w} = useB();
	const tw = w('100', 'weekend');
	const tb = w('100', "emma's");
	if (f < tb - 4)
		return (
			<Scene cam={camCut(f, [[0, 960, 600, 1.4], [tw - 2, 1100, 560, 1.4]])} bg="#2a2a48" light={{night: true, o: 0.5}} set={<Kitchen night />}>
				<Table night />
				<Plate x={960} />
				<CalPage x={f < tw ? 960 : 1100} y={360} top={f < tw ? 'DINNER' : 'WEEKEND'} big={f < tw ? '7PM' : 'SAT'} s={pop(f % (tw - 2))} />
				<path d="M840,240 L1080,480 M1080,240 L840,480" stroke="#ff2a3c" strokeWidth={22} opacity={f > 16 && f < tw ? 1 : 0} transform={f >= tw ? 'translate(140,0)' : undefined} />
				{f > tw + 14 ? <path d="M980,240 L1220,480 M1220,240 L980,480" stroke="#ff2a3c" strokeWidth={22} /> : null}
			</Scene>
		);
	return (
		<Scene cam={camK(f, [[tb - 4, 960, 600, 1.3], [tb + 60, 1000, 600, 1.7]])} bg="#2a2a48" light={{night: true, o: 0.5}} set={<Kitchen night />}>
			<Actor who="emma" x={1000} s={0.72} pose={{...P.slump(f), lean: 6}} expr="sad" />
			<CakeTable x={1200} f={f} />
			<Pow x={1200} y={430} text="8" t={10} size={80} c="#ff6a9a" hold={999} />
			<Tag x={760} y={300} t={f - tb} text="EMMA'S B-DAY" size={50} />
		</Scene>
	);
};
/* 101 «He used to fall asleep on the couch with Biscuit.» — warm memory */
const S101: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 640, 1.2], [dur, 900, 660, 1.6]]);
	return (
		<Scene cam={cam} bg="#f6d9b0" light={{x: 30, y: 10, o: 0.6, c: '255,210,150'}} set={<LivingRoom f={f} />} over={<AbsoluteFill style={{background: 'rgba(255,180,90,.18)', mixBlendMode: 'multiply'}} />}>
			<Couch x={900} />
			<g transform="translate(700,700) rotate(-80)">
				<Actor who="dad" x={0} floor={157} pose={{lean: 0, head: 0, armB: [10, 10], armF: [40, 60], legB: [0, 0], legF: [4, 0]}} lidBase={1} faceTurn={0.2} shadow={false} />
			</g>
			<Dog x={1000} floor={770} s={0.7} f={f} mode="lie" facing={-1} tongue={false} />
			<Pow x={760} y={480} text="Z z z" t={f % 50} size={50} c="#fff" hold={40} />
			<Tag x={1400} y={260} t={f - 4} text="BEFORE" size={50} />
		</Scene>
	);
};
/* 102 «Now, Biscuit waits by the door every night.» */
const S102: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 1300, 600, 1.2], [dur, 1500, 680, 1.7]]);
	return (
		<Scene cam={cam} bg="#2a2f55" light={{night: true, o: 0.6}} set={<LivingRoom f={f} night />}>
			<Dog x={1450} f={f} mode="sit" facing={1} tongue={false} look={-1} />
			<Pow x={1620} y={560} text="whimper..." t={f - 10} size={36} c="#c9cfdd" hold={999} />
			<Tag x={1000} y={260} t={f - 2} text="NOW" size={50} />
		</Scene>
	);
};
/* 103 «You did that. You made him rich, but you never said he'd be happy.» */
const S103: React.FC = () => {
	const {f, w} = useB();
	const th = w('103', 'happy');
	const cam = camCut(f, [[0, 960, 480, 2.1], [w('103', 'you', 1) - 2, 960, 540, 1.2]]);
	return (
		<Scene cam={cam} bg="#100206" light={false} set={<RedVoid f={f} c="#4a0810" />}>
			<Hero x={960} pose={P.slump(f)} faceTurn={0} expr="sad" mouth="frown" lidBase={0.3} />
			<Title t={f - 2} dur={w('103', 'you', 1) - 4} lines={['YOU DID THAT.']} y={80} size={90} c="#ff3b4e" />
			<g transform={`translate(1450,420) scale(${pop(f - w('103', 'rich'))})`}>
				<rect x={-200} y={-80} width={400} height={180} rx={20} fill="#fbf8ef" />
				<text x={-170} y={-10} fontSize={40} fontFamily={RB} fontWeight={900} fill="#3aa37a">
					✓ RICH
				</text>
				<text x={-170} y={60} fontSize={40} fontFamily={RB} fontWeight={900} fill="#d23b3b" opacity={f > th ? 1 : 0}>
					✗ HAPPY
				</text>
			</g>
		</Scene>
	);
};
/* 104 «Zoe tells you about the summer camp again and again.» */
const S104: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.15], [dur, 960, 540, 1.5]]);
	return (
		<Scene cam={cam} bg="#e6f0f4" set={<Cafeteria f={f} />}>
			<Hero x={800} pose={idle(f, 1)} faceTurn={0.6} mouth="flat" lidBase={0.5} />
			<Actor who="zoe" x={1130} facing={-1} pose={gesture('wave', P.laugh(f), 0.5, f)} mouth="open" />
			{[0, 1, 2].map((i) => (
				<Bubble key={i} x={1250 + i * 60} y={360 - i * 90} w={bw('...AND THE LAKE!', 30)} h={70} t={f - 4 - i * 26} tail={[-80, 80]}>
					{say('...AND THE LAKE!', 30)}
				</Bubble>
			))}
			<Pow x={1500} y={600} text="AGAIN" t={f - 60} size={50} c="#ff3b4e" />
		</Scene>
	);
};
/* 105 «The time you fell in the lake, the campfire songs, the night you watched the stars.» */
const S105: React.FC = () => {
	const {f, w} = useB();
	const tl = w('105', 'lake');
	const tc = w('105', 'campfire');
	const ts = w('105', 'stars');
	const cam = camCut(f, [[0, 700, 540, 1.3], [tc - 2, 960, 540, 1.3], [ts - 2, 1220, 540, 1.3]]);
	return (
		<Scene cam={cam} bg="#141a46" light={false} set={<RedVoid f={f} c="#1d2a5a" words={false} />}>
			<Polaroid x={600} y={520} rot={-8} s={1.6 * pop(f - 1)} kind="lake" />
			<Polaroid x={960} y={540} rot={4} s={1.6 * pop(f - tc + 4)} kind="fire" />
			<Polaroid x={1320} y={520} rot={-3} s={1.6 * pop(f - ts + 4)} kind="stars" />
		</Scene>
	);
};
/* 106 «She loves those memories. And every time she brings them up, you feel sick.» */
const S106: React.FC = () => {
	const {f, w} = useB();
	const ts = w('106', 'sick');
	const cam = camCut(f, [[0, 1130, 540, 1.6], [w('106', 'and') - 2, 800, 520, 1.8]]);
	return (
		<Scene cam={cam} bg="#e6f0f4" set={<Cafeteria f={f} />}>
			<Hero x={800} pose={gesture('touchFace', {...idle(f, 1), lean: 8 + Math.sin(f / 6) * 4}, env(f, ts - 10, 999, 6, 1), f)} armOver faceTurn={0.4} expr="sad" mouth="frown" />
			<Actor who="zoe" x={1130} facing={-1} pose={P.laugh(f)} mouth="smile" />
			{f > ts - 10 ? [0, 1, 2].map((i) => <path key={i} d={`M${720 + i * 40},${420 - ((f + i * 10) % 30)} q10,-14 0,-28 q-10,-14 0,-28`} stroke="#8fd06a" strokeWidth={6} fill="none" />) : null}
			<Pow x={600} y={360} text="ugh..." t={f - ts} size={50} c="#8fd06a" />
			{f < w('106', 'and') ? [0, 1].map((i) => <Pow key={i} x={1130 + i * 70} y={380 - ((f + i * 20) % 50) * 2} text="♥" t={8} size={46} c="#ff6a8a" hold={999} />) : null}
		</Scene>
	);
};
/* 107 «Because they're fake. She likes a version of you that never existed.» */
const S107: React.FC = () => {
	const {f, w} = useB();
	const tf = w('107', 'fake');
	const tv = w('107', 'version');
	const cam = camCut(f, [[0, 960, 540, 1.2], [tv - 2, 1100, 560, 1.4]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			{f < tv - 4 ? (
				<g>
					<Polaroid x={960} y={500} s={2} rot={-3} kind="lake" />
					<LieStamp x={960} y={520} t={f - tf} text="FAKE" />
				</g>
			) : (
				<g>
					<Actor who="zoe" x={1300} facing={-1} pose={reach(idle(f, 3), 'F', [100, -40], 1)} mouth="smile" />
					<g opacity={0.35 + 0.1 * Math.sin(f / 5)}>
						<Actor who="hero" x={1060} pose={P.cheer(f)} mouth="smile" lidBase={0} color="#ffd0d4" />
					</g>
					<Hero x={600} pose={P.slump(f)} faceTurn={0.4} expr="sad" look={[1, 0]} />
					<Callout f={f} t0={tv + 6} t1={999} from={[1060, 420]} to={[900, 220]} text="NOT REAL YOU" c="#ff6a8a" />
				</g>
			)}
		</Scene>
	);
};
/* 108 «You lie to your teacher that you're sick to skip a test.» */
const S108: React.FC = () => {
	const {f, w} = useB();
	const ts = w('108', 'sick');
	const cam = camCut(f, [[0, 960, 560, 1.15], [ts - 4, 860, 520, 1.6]]);
	return (
		<Scene cam={cam} bg="#f0e2b8" set={<ClassRoom f={f} board="TEST TODAY" />}>
			<Actor who="hollis" x={1180} facing={-1} pose={gesture('armsCrossed', idle(f, 3), 1, f)} lidBase={0.4} />
			<Hero x={820} pose={gesture('touchFace', {...idle(f, 1), lean: 10}, 1, f)} armOver faceTurn={0.6} mouth="open" expr="sad" lidBase={0.6} />
			<Pow x={760} y={400} text="*cough cough*" t={f - 6} size={44} c="#fff" hold={40} />
			<Bubble x={860} y={280} w={bw("I'M SICK...")} h={100} t={f - ts} tail={[0, 120]}>
				{say("I'M SICK...")}
			</Bubble>
			<LieStamp x={1150} y={300} t={f - ts - 16} />
		</Scene>
	);
};
/* 109 «You wake up the next day with a real fever.» */
const S109: React.FC = () => {
	const {f, w} = useB();
	const tf = w('109', 'fever');
	const cam = shake(camCut(f, [[0, 960, 600, 1.2], [tf - 2, 900, 600, 1.7]]), f, tf, 8);
	return (
		<Scene cam={cam} bg="#1d2550" light={{x: 60, y: 10, o: 0.5, c: '255,150,130'}} set={<HeroRoom f={f} night={false} />}>
			<Bed x={860} night={false} />
			<g transform={`translate(660,700) rotate(-84)`}>
				<Actor who="hero" x={0} floor={157} pose={{lean: 0, head: 0, armB: [10, 10], armF: [6, 10], legB: [0, 0], legF: [0, 0]}} faceTurn={0.2} lidBase={0.6} expr="sad" mouth="open" shadow={false} />
			</g>
			<rect x={600} y={740} width={560} height={90} rx={30} fill="#ff2a3c" />
			<Thermo x={1250} y={560} v={lin(f, tf - 10, tf + 20, 0.2, 1)} s={1.2} />
			{[0, 1, 2].map((i) => <circle key={i} cx={560 + i * 20} cy={620 + ((f * 2 + i * 20) % 50)} r={7} fill="#9fd2ff" />)}
			<Pow x={900} y={400} text="REAL FEVER" t={f - tf} size={60} c="#ff3b4e" />
		</Scene>
	);
};
/* 110 «You lie that you're fine so your mom doesn't worry.» */
const S110: React.FC = () => {
	const {f, w} = useB();
	const tf = w('110', 'fine');
	const cam = camCut(f, [[0, 960, 600, 1.2], [tf - 2, 760, 560, 1.5]]);
	return (
		<Scene cam={cam} bg="#cfe4ef" set={<HeroRoom f={f} night={false} />}>
			<Bed x={860} night={false} />
			<Hero x={700} seat={700} pose={{...P.sitDesk(f), armF: [150, 40]}} faceTurn={0.5} mouth="smile" lidBase={0.4} />
			<Actor who="mom" x={1150} facing={-1} pose={reach(idle(f, 3), 'F', [140, -150], env(f, 4, tf, 8, 8))} expr="worried" />
			<Bubble x={760} y={300} w={bw("I'M FINE, MOM!")} h={100} t={f - tf + 4} tail={[0, 120]}>
				{say("I'M FINE, MOM!")}
			</Bubble>
			<LieStamp x={1060} y={300} t={f - tf - 16} />
		</Scene>
	);
};

export const SHOTS3: ShotDef[] = [
	{at: '061', C: S061, whip: true},
	{at: '062', C: S062, whip: true},
	{at: '063', C: S063, whip: true},
	{at: '064', C: S064, whip: true},
	{at: '065', C: S065},
	{at: '066', C: S066, whip: true},
	{at: '067', C: S067},
	{at: '068', C: S068, whip: true},
	{at: '069', C: S069},
	{at: '070', C: S070, whip: true},
	{at: '071', C: S071},
	{at: '072', C: S072, whip: true},
	{at: '073', C: S073},
	{at: '074', C: S074, whip: true},
	{at: '075', C: S075, whip: true},
	{at: '076', C: S076},
	{at: '077', C: S077, whip: true},
	{at: '078', C: S078},
	{at: '078', off: wordOff('078', 'owner'), C: S078, whip: true},
	{at: '079', C: S079, whip: true},
	{at: '080', C: S080},
	{at: '081', C: S081},
	{at: '082', C: S082},
	{at: '083', C: S083, whip: true},
	{at: '084', C: S084},
	{at: '085', C: S085},
	{at: '086', C: S086, whip: true},
	{at: '087', C: S087, whip: true},
	{at: '088', C: S088},
	{at: '089', C: S089},
	{at: '090', C: S090, whip: true},
	{at: '091', C: S091, whip: true},
	{at: '092', C: S092, whip: true},
	{at: '093', C: S093},
	{at: '094', C: S094},
	{at: '095', C: S095, whip: true},
	{at: '096', C: S096, whip: true},
	{at: '097', C: S097, whip: true},
	{at: '098', C: S098, whip: true},
	{at: '099', C: S099, whip: true},
	{at: '100', C: S100, whip: true},
	{at: '101', C: S101, whip: true},
	{at: '102', C: S102},
	{at: '103', C: S103, whip: true},
	{at: '104', C: S104, whip: true},
	{at: '105', C: S105, whip: true},
	{at: '106', C: S106, whip: true},
	{at: '107', C: S107, whip: true},
	{at: '108', C: S108, whip: true},
	{at: '109', C: S109, whip: true},
	{at: '110', C: S110},
];
