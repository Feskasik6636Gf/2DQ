import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Pose} from '../engine/Stickman';
import {blend, gesture, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {CrowdRow, Extra} from '../kit/kit';
import {Bubble, Cite} from '../kit/ui';
import {Corridor, Kitchen, KitchenTable, SchoolYard} from '../kit/sets';
import {Callout} from '../kit/graphics';
import {Cafeteria, Cinema, ClassRoom, HeroRoom, Lab, Meeting, MeetingTable, Park, RedVoid, SchoolDesk, TicketBooth, Bed} from './places';
import {Book, Bulb, Campfire, Classmates, Cookie, Jar, Key, Meter, Notepad, PhoneUp, Polaroid, Popcorn, TestPaper} from './bits';
import {Dog, Flash, Hero, LieStamp, Magic, P, Pow, Scene, Sparks, SpeedLines, Tag, Title, camCut, camK, env, ez, jump, lin, mover, pop, shake, useB, wordOff} from './lib';

const SEAT = 795;
const RB = "'Rubik', sans-serif";
const say = (text: string, size = 44) => (
	<text y={size * 0.36} textAnchor="middle" fontSize={size} fontFamily={RB} fontWeight={900} fill="#2a2030">
		{text}
	</text>
);
const bw = (text: string, size = 44) => text.length * size * 0.62 + 60;

/* 021 «Most people lie about once or twice a day.» — a street crowd, tiny lie bubbles pop */
const S021: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 760, 560, 1.05], [dur, 1160, 600, 1.3]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.4}} set={<Park f={f} />}>
			<CrowdRow n={9} x0={-200} x1={2100} floor={900} s={0.9} mode="walk" seed="st" t={f} dir={1} />
			{Array.from({length: 9}).map((_, i) => {
				const t = f - 8 - i * 5;
				const x = -200 + (2300 * (i + 0.5)) / 9 + f * (2 + random('st' + i));
				return t > 0 && t < 50 ? (
					<g key={i} transform={`translate(${x},${560 - Math.min(t, 10) * 3}) scale(${pop(t)})`} opacity={t > 40 ? (50 - t) / 10 : 1}>
						<rect x={-50} y={-34} width={100} height={60} rx={30} fill="#fff" />
						<text y={10} textAnchor="middle" fontSize={34} fontFamily={RB} fontWeight={900} fill="#d23b3b">
							{i % 3 ? '×1' : '×2'}
						</text>
					</g>
				) : null;
			})}
			<Title t={f - 2} lines={['1–2 LIES A DAY']} y={70} size={84} />
		</Scene>
	);
};

/* 022 «Small stuff. I'm fine.» — hero faceplants in the corridor, thumbs up */
const S022: React.FC = () => {
	const {f, w} = useB();
	const tf = w('022', 'fine');
	const fall = ez(f, 4, 14, 0, 1);
	const up = ez(f, tf - 10, tf, 0, 1);
	const pose: Pose = blend(blend(idle(f, 1), {lean: 80, head: 20, armF: [140, 20], armB: [-140, 20], legB: [-30, 10], legF: [40, 30]}, fall), gesture('point', {...idle(f, 1), armF: [150, 40]}, 1, f), up);
	const cam = shake(camCut(f, [[0, 900, 620, 1.4], [tf - 6, 900, 560, 1.8]]), f, 14, 12);
	return (
		<Scene cam={cam} bg="#f1e6c8" light={{x: 20, y: 10, o: 0.42}} set={<Corridor f={f} />}>
			<Hero x={900} pose={pose} floor={900 - (1 - up) * fall * 0} faceTurn={0.5} mouth={f > tf ? 'smile' : 'open'} expr={f < tf - 10 ? 'wide' : 'normal'} />
			<Pow x={1050} y={760} text="THUD" t={f - 14} size={56} />
			<Bubble x={1200} y={380} w={bw("I'M FINE!")} h={100} t={f - tf} tail={[-120, 110]}>
				{say("I'M FINE!")}
			</Bubble>
			<Tag x={620} y={360} t={f - 2} text="small stuff" size={50} />
		</Scene>
	);
};

/* 023 «I'm almost there. I love it.» — still in bed texting, then an ugly gift */
const S023: React.FC = () => {
	const {f, w} = useB();
	const tl = w('023', 'love') - 4;
	const first = f < tl;
	const cam = camCut(f, [[0, 760, 680, 1.6], [tl, 960, 560, 1.6]]);
	return first ? (
		<Scene cam={cam} bg="#cfe4ef" light={{x: 70, y: 20, o: 0.4}} set={<HeroRoom f={f} night={false} />}>
			<Bed x={760} night={false} />
			<g transform={`translate(560,690) rotate(-84)`}>
				<Actor who="hero" x={0} floor={157} pose={{lean: 0, head: 0, armB: [10, 10], armF: [150, 120], legB: [0, 0], legF: [0, 0]}} faceTurn={0.2} lidBase={0.5} shadow={false} />
			</g>
			<rect x={520} y={740} width={500} height={90} rx={30} fill="#ff2a3c" />
			<PhoneUp x={700} y={600} text="almost there!" s={2} />
			<Bubble x={980} y={380} w={bw("I'M ALMOST THERE")} h={100} t={f - 2} tail={[-200, 120]}>
				{say("I'M ALMOST THERE")}
			</Bubble>
			<Pow x={1250} y={300} text="ZZZ" t={f % 40} size={40} c="#fff" hold={30} />
		</Scene>
	) : (
		<Scene cam={cam} bg="#f6d9b0" light={{x: 30, y: 10, o: 0.45}} set={<Kitchen />}>
			<Hero x={860} pose={P.present(f)} faceTurn={0.3} mouth="smile" lidBase={0.3} />
			<g transform={`translate(1020,640) rotate(${Math.sin(f / 4) * 5})`}>
				<rect x={-60} y={-50} width={120} height={100} rx={8} fill="#7a9a3a" />
				<circle cx={0} cy={0} r={22} fill="#c94a8a" />
				<text y={8} textAnchor="middle" fontSize={22} fill="#fff">
					☹
				</text>
			</g>
			<Bubble x={1200} y={360} w={bw('I LOVE IT!')} h={100} t={f - tl - 2} tail={[-120, 110]}>
				{say('I LOVE IT!')}
			</Bubble>
		</Scene>
	);
};

/* 024 «Thank you. Scientists who study lying found that most of us tell a lie or two every day.» */
const S024: React.FC = () => {
	const {f, w} = useB();
	const ts = w('024', 'scientists');
	const tm = w('024', 'most');
	if (f < ts - 4)
		return (
			<Scene cam={camK(f, [[0, 900, 520, 1.6], [ts, 900, 520, 1.8]])} bg="#f6d9b0" set={<Kitchen />}>
				<Hero x={860} pose={gesture('wave', idle(f, 2), 1, f)} faceTurn={0.3} mouth="smile" />
				<Bubble x={1150} y={380} w={bw('THANK YOU!')} h={100} t={f} tail={[-120, 110]}>
					{say('THANK YOU!')}
				</Bubble>
			</Scene>
		);
	const g = f - tm;
	const cam = camCut(f, [[ts - 4, 700, 560, 1.35], [tm - 2, 1150, 520, 1.15]]);
	return (
		<Scene cam={cam} bg="#dff2f2" light={{x: 30, y: 10, o: 0.4}} set={<Lab f={f} />}>
			<Actor who="sci" x={500} pose={gesture('point', idle(f, 6), env(f, ts, 999, 8, 1), f)} handF="point" mouth="open" />
			<g transform="translate(1150,0)">
				<rect x={-380} y={220} width={760} height={520} rx={18} fill="#141826" />
				<text y={290} textAnchor="middle" fontSize={40} fontFamily={RB} fontWeight={900} fill="#fff">
					LIES PER DAY
				</text>
				{[0.2, 1, 0.8, 0.35, 0.15, 0.08].map((h, i) => (
					<g key={i}>
						<rect x={-300 + i * 105} y={680 - 300 * h * Math.min(1, Math.max(0, g / 20 - i * 0.15))} width={80} height={300 * h * Math.min(1, Math.max(0, g / 20 - i * 0.15))} fill={i === 1 || i === 2 ? '#ffd34a' : '#3a6fd2'} />
						<text x={-260 + i * 105} y={720} textAnchor="middle" fontSize={28} fontFamily={RB} fontWeight={800} fill="#c9cfdd">
							{i === 5 ? '5+' : i}
						</text>
					</g>
				))}
				<Pow x={-50} y={330} text="1–2 A DAY" t={g - 26} size={46} />
			</g>
			<g transform="translate(0,0)">
				<Cite text="Serota, Levine & Boster, 2010" t={g} x={1520} y={790} />
			</g>
		</Scene>
	);
};

/* 025 «And a small group of people tell a lot of them.» — one guy buried in his own bubbles */
const S025: React.FC = () => {
	const {f, w, dur} = useB();
	const tl = w('025', 'lot');
	const cam = camK(f, [[0, 960, 560, 1.0], [tl, 1300, 560, 1.4], [dur, 1300, 520, 1.55]]);
	const n = Math.max(0, Math.floor((f - tl + 10) / 2));
	return (
		<Scene cam={cam} bg="#dff2f2" set={<Lab f={f} />}>
			{[200, 380, 560, 740, 920].map((x, i) => (
				<Extra key={i} i={i} x={x} floor={900} s={0.85} pose={idle(f, i)} seed="grp" />
			))}
			<Actor who="guy" x={1300} pose={P.present(f)} mouth="smirk" />
			{Array.from({length: Math.min(30, n)}).map((_, i) => (
				<g key={i} transform={`translate(${1300 + (random('gb' + i) - 0.5) * 700},${420 - random('gc' + i) * 360}) scale(${pop(n - i) * 0.8})`}>
					<rect x={-60} y={-26} width={120} height={52} rx={26} fill="#fff" stroke="#d23b3b" strokeWidth={4} />
					<text y={10} textAnchor="middle" fontSize={26} fontFamily={RB} fontWeight={900} fill="#d23b3b">
						LIE
					</text>
				</g>
			))}
		</Scene>
	);
};

/* 026 «You figure you're somewhere in the middle.» */
const MeterScene: React.FC<{v: number; extra?: React.ReactNode; hero?: React.ReactNode}> = ({v, extra, hero}) => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 540, 1.0], [dur, 960, 560, 1.12]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Meter x={960} y={300} v={v} />
			{hero}
			{extra}
		</Scene>
	);
};
const S026: React.FC = () => {
	const {f} = useB();
	return <MeterScene v={ez(f, 4, 30, 0.05, 0.5)} hero={<Hero x={960} pose={gesture('shrug', idle(f, 2), env(f, 20, 999, 8, 1), f)} mouth="smile" badge={false} />} />;
};
/* 027 «Then you start counting. And you realize you're not.» */
const S027: React.FC = () => {
	const {f, w} = useB();
	const tr = w('027', 'realize');
	const n = Math.floor(lin(f, 4, tr, 0, 38));
	if (f < tr - 6)
		return (
			<Scene cam={camK(f, [[0, 960, 560, 1.5], [tr, 960, 600, 1.9]])} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
				<Hero x={760} pose={reach(idle(f, 1), 'F', [60, -60], 1)} faceTurn={0.6} look={[1, 0.5]} badge={false} mouth="flat" />
				<Notepad x={1050} y={600} n={n} s={0.8} />
				<Pow x={1250} y={400} text={`${n}`} t={6} size={90} hold={999} c="#fff" />
			</Scene>
		);
	return <MeterScene v={ez(f, tr, tr + 16, 0.5, 0.97)} hero={<Hero x={960} pose={P.scared(f)} expr="wide" lidBase={0} mouth="open" badge={false} />} extra={<Pow x={1500} y={220} text="NOPE." t={f - tr - 16} size={70} c="#fff" />} />;
};

/* 028 «So you test it. Carefully.» — sneaking with a magnifying glass */
const S028: React.FC = () => {
	const {f, w, dur} = useB();
	const tip = mover(f, 0, dur, 300, 1100, {seed: 1});
	const pose: Pose = {...tip.pose, lean: 18, head: 6, armF: [80, 40]};
	const cam = camK(f, [[0, 500, 600, 1.5], [dur, 1100, 600, 1.7]]);
	return (
		<Scene cam={cam} bg="#f3e6c4" set={<Kitchen />}>
			<Hero x={tip.x} pose={pose} bob={tip.bob * 0.5} faceTurn={0.6} look={[1, 0.3]} lidBase={0.6} mouth="flat" />
			<g transform={`translate(${tip.x + 120},${640})`}>
				<circle r={50} fill="#bfe3ff" opacity={0.5} stroke="#2b2f3a" strokeWidth={10} />
				<rect x={30} y={34} width={18} height={70} rx={8} fill="#6b4a2a" transform="rotate(-40 40 40)" />
			</g>
			<Title t={f - w('028', 'carefully')} lines={['CAREFULLY...']} y={80} size={76} c="#fff" />
		</Scene>
	);
};

/* 029 «At breakfast, your little sister Emma asks if you ate the last cookie.» */
const Breakfast: React.FC<{children: React.ReactNode; cam: any}> = ({children, cam}) => (
	<Scene cam={cam} bg="#f3e6c4" light={{x: 60, y: 10, o: 0.45}} set={<Kitchen />} front={null}>
		<KitchenTableSvg />
		{children}
	</Scene>
);
const KitchenTableSvg: React.FC = () => (
	<g>
		<ellipse cx={960} cy={760} rx={460} ry={46} fill="#c98a5a" />
		<ellipse cx={960} cy={752} rx={460} ry={42} fill="#e0a774" />
		<rect x={700} y={780} width={20} height={120} fill="#9a6a44" />
		<rect x={1200} y={780} width={20} height={120} fill="#9a6a44" />
	</g>
);
const S029: React.FC = () => {
	const {f, w} = useB();
	const tc = w('029', 'cookie');
	const ew = mover(f, 0, 24, 1900, 1300, {seed: 2});
	const cam = camCut(f, [[0, 960, 600, 1.15], [w('029', 'emma') - 2, 1300, 640, 1.8], [tc - 2, 760, 600, 1.8]]);
	return (
		<Breakfast cam={cam}>
			<Hero x={760} pose={reach(idle(f, 1), 'F', [40, -110 + Math.abs(Math.sin(f / 3)) * 10], 1)} faceTurn={0.6} look={[1, 0]} mouth="flat" />
			<Cookie x={800} y={660 + Math.abs(Math.sin(f / 3)) * 10} s={0.9} />
			{Array.from({length: 5}).map((_, i) => (
				<circle key={i} cx={780 + i * 9} cy={700 + ((f * 2 + i * 13) % 200)} r={3} fill="#9a6a3a" />
			))}
			<Actor who="emma" x={ew.x} s={0.72} facing={-1} pose={gesture('point', ew.pose, env(f, tc - 6, 999, 6, 1), f)} handF="point" vx={ew.vx} bob={ew.bob} expr="angry" mouth="open" />
			<Jar x={1080} y={740} fill={0} />
			<Bubble x={1350} y={420} w={bw('DID YOU EAT THE LAST COOKIE?', 34)} h={90} t={f - tc + 20} tail={[0, 120]}>
				{say('DID YOU EAT THE LAST COOKIE?', 34)}
			</Bubble>
		</Breakfast>
	);
};
/* 030 «You did. You say, no, there's more in the jar.» */
const S030: React.FC = () => {
	const {f, w} = useB();
	const tn = w('030', 'no');
	const gulp = env(f, 4, tn - 4, 4, 4);
	const cam = camCut(f, [[0, 760, 560, 2.1], [tn - 4, 960, 580, 1.3]]);
	return (
		<Breakfast cam={cam}>
			<Hero x={760} pose={f < tn ? gesture('touchFace', idle(f, 1), gulp, f) : gesture('presentF', idle(f, 1), 1, f)} armOver={gulp > 0.5} faceTurn={0.6} expr={f < tn ? 'wide' : 'normal'} lidBase={f < tn ? 0 : 0.45} mouth={f < tn ? 'flat' : 'smile'} squash={gulp * 0.06} />
			<Pow x={760} y={420} text="GULP" t={f - 8} size={50} />
			<Actor who="emma" x={1300} s={0.72} facing={-1} pose={gesture('armsCrossed', idle(f, 2), 1, f)} expr="angry" />
			<Jar x={1080} y={740} fill={0} />
			<Bubble x={760} y={330} w={bw("NO, THERE'S MORE IN THE JAR!", 34)} h={90} t={f - tn} tail={[0, 120]}>
				{say("NO, THERE'S MORE IN THE JAR!", 34)}
			</Bubble>
			<LieStamp x={1060} y={300} t={f - tn - 30} />
		</Breakfast>
	);
};
/* 031 «She opens the jar. It's full.» */
const S031: React.FC = () => {
	const {f, w} = useB();
	const to = w('031', 'opens');
	const tf = w('031', 'full');
	const lid = ez(f, to, to + 10, 0, 1);
	const cam = shake(camCut(f, [[0, 1180, 640, 1.6], [tf - 2, 1090, 640, 2.2]]), f, tf, 12);
	return (
		<Breakfast cam={cam}>
			<Actor who="emma" x={1300} s={0.72} facing={-1} pose={reach(idle(f, 2), 'F', [80, -40 - lid * 60], env(f, to - 6, 999, 6, 1))} expr={f > tf ? 'wide' : 'normal'} mouth={f > tf ? 'open' : 'flat'} />
			<Jar x={1080} y={740} fill={f > tf - 18 ? 1 : 0} lid={lid} />
			<Magic x={1080} y={660} t={f - tf + 20} w={200} h={150} />
			<Pow x={1080} y={430} text="FULL?!" t={f - tf} size={80} />
		</Breakfast>
	);
};
/* 032 «Full of cookies that weren't there five seconds ago.» — cookies overflow and rain */
const S032: React.FC = () => {
	const {f, w, dur} = useB();
	const t5 = w('032', 'five');
	const cam = camK(f, [[0, 1080, 600, 1.9], [dur, 960, 560, 1.1]]);
	return (
		<Breakfast cam={cam}>
			<Hero x={760} pose={gesture('handsOnHead', idle(f, 1), env(f, 10, 999, 8, 1), f)} expr="wide" lidBase={0} faceTurn={0.6} />
			<Actor who="emma" x={1300} s={0.72} facing={-1} pose={P.cheer(f)} mouth="smile" />
			<Jar x={1080} y={740} fill={1} lid={1} />
			{Array.from({length: 22}).map((_, i) => {
				const t = f - i * 2;
				if (t < 0) return null;
				const vx = (random('ck' + i) - 0.5) * 18;
				return <Cookie key={i} x={1080 + vx * t} y={600 - 18 * t + 0.6 * t * t} r={t * 9} s={0.9} />;
			})}
			{f > t5 ? (
				<g transform={`translate(1500,260) scale(${pop(f - t5)})`}>
					<rect x={-170} y={-70} width={340} height={140} rx={20} fill="#141826" stroke="#ffd34a" strokeWidth={6} />
					<text y={-14} textAnchor="middle" fontSize={30} fontFamily={RB} fontWeight={800} fill="#c9cfdd">
						5 SECONDS AGO
					</text>
					<text y={44} textAnchor="middle" fontSize={50} fontFamily={RB} fontWeight={900} fill="#ff3b4e">
						EMPTY
					</text>
				</g>
			) : null}
		</Breakfast>
	);
};

/* 033 «At school, your friend Kai asks if you studied for the history test.» */
const S033: React.FC = () => {
	const {f, w} = useB();
	const kw = mover(f, 0, 30, 2100, 1150, {seed: 3});
	const th = w('033', 'history');
	const cam = camCut(f, [[0, 1100, 560, 1.15], [w('033', 'kai') - 2, 1150, 560, 1.7], [th - 2, 950, 560, 1.4]]);
	return (
		<Scene cam={cam} bg="#f1e6c8" light={{x: 20, y: 10, o: 0.42}} set={<Corridor f={f} />}>
			<Hero x={780} pose={idle(f, 1)} faceTurn={0.6} look={[1, 0]} />
			<Actor who="kai" x={kw.x} facing={-1} pose={reach(kw.pose, 'F', [60, -90], env(f, 26, 999, 6, 1))} vx={kw.vx} bob={kw.bob} faceTurn={0.6} mouth="open" />
			<Book x={kw.x - 60} y={650} title="HISTORY" />
			<Bubble x={1150} y={330} w={bw('DID YOU STUDY FOR THE TEST?', 34)} h={90} t={f - th + 6} tail={[0, 110]}>
				{say('DID YOU STUDY FOR THE TEST?', 34)}
			</Bubble>
			<Tag x={500} y={300} t={f - 4} text="AT SCHOOL" size={50} />
		</Scene>
	);
};
/* 034 «You didn't. You say, yeah, all weekend.» */
const S034: React.FC = () => {
	const {f, w} = useB();
	const ty = w('034', 'yeah');
	const cam = camCut(f, [[0, 780, 560, 1.9], [ty - 2, 900, 560, 1.4]]);
	return (
		<Scene cam={cam} bg="#f1e6c8" light={{x: 20, y: 10, o: 0.42}} set={<Corridor f={f} />}>
			<Hero x={780} pose={f < ty ? gesture('scratch', idle(f, 1), 1, f) : gesture('fist', idle(f, 1), 0.7, f)} faceTurn={0.6} look={[1, 0]} mouth={f < ty ? 'frown' : 'smile'} lidBase={0.5} />
			<Actor who="kai" x={1150} facing={-1} pose={idle(f, 3)} faceTurn={0.6} />
			<Book x={1090} y={650} title="HISTORY" />
			{f < ty ? <Pow x={780} y={300} text="(I DIDN'T)" t={f - 2} size={44} c="#fff" hold={ty} /> : null}
			<Bubble x={760} y={330} w={bw('YEAH, ALL WEEKEND!')} h={100} t={f - ty} tail={[0, 120]}>
				{say('YEAH, ALL WEEKEND!')}
			</Bubble>
			<LieStamp x={1080} y={300} t={f - ty - 30} />
		</Scene>
	);
};
/* 035 «And then you sit down, look at the test, and you just know it.» */
const S035: React.FC = () => {
	const {f, w} = useB();
	const tk = w('035', 'know');
	const sit = ez(f, 0, 14, 0, 1);
	const cam = camCut(f, [[0, 900, 600, 1.2], [w('035', 'look') - 2, 900, 700, 1.9], [tk - 2, 820, 520, 1.7]]);
	return (
		<Scene cam={cam} bg="#f0e2b8" light={{x: 70, y: 10, o: 0.4}} set={<ClassRoom f={f} board="HISTORY TEST" />}>
			<Classmates f={f} />
			<Hero x={820} seat={SEAT + (1 - sit) * -40} pose={P.sitDesk(f)} faceTurn={0.6} look={[0.5, 1]} expr={f > tk ? 'wide' : 'normal'} lidBase={f > tk ? 0.1 : 0.42} mouth={f > tk ? 'smile' : 'flat'} />
			<SchoolDesk x={880} paper />
			<Bulb x={820} y={330} t={f - tk} />
			<Magic x={820} y={500} t={f - tk + 20} w={200} h={150} />
		</Scene>
	);
};
/* 036 «Every date. Every name.» — facts orbit the hero's head */
const S036: React.FC = () => {
	const {f, w} = useB();
	const tn = w('036', 'name');
	const facts = ['1492', '1776', '1865', '1969', 'LINCOLN', 'NAPOLEON', 'CLEOPATRA', 'MAGNA CARTA'];
	const cam = camK(f, [[0, 960, 520, 1.3], [60, 960, 500, 1.7]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} words={false} />}>
			<Hero x={960} pose={gesture('think', idle(f, 1), 1, f)} faceTurn={0.1} mouth="smirk" lidBase={0.5} />
			{facts.map((t, i) => {
				const isName = i >= 4;
				const t0 = isName ? tn + (i - 4) * 3 : 2 + i * 3;
				const a = f / 18 + (i / facts.length) * Math.PI * 2;
				return f > t0 ? (
					<g key={i} transform={`translate(${960 + Math.cos(a) * 380},${520 + Math.sin(a) * 160}) scale(${pop(f - t0)})`}>
						<rect x={-t.length * 16 - 22} y={-36} width={t.length * 32 + 44} height={70} rx={35} fill={isName ? '#ffd34a' : '#fff'} />
						<text y={12} textAnchor="middle" fontSize={40} fontFamily={RB} fontWeight={900} fill="#2a2030">
							{t}
						</text>
					</g>
				) : null;
			})}
		</Scene>
	);
};
/* 037 «Like you really did study all weekend.» — time-lapse memory of studying */
const S037: React.FC = () => {
	const {f, dur} = useB();
	const night = Math.floor(f / 12) % 2 === 1;
	const cam = camK(f, [[0, 900, 600, 1.2], [dur, 900, 560, 1.5]]);
	return (
		<Scene cam={cam} bg="#101225" light={night ? {night: true, o: 0.5} : {x: 60, y: 10, o: 0.4}} set={<HeroRoom f={f} night={night} />}>
			<Hero x={800} seat={SEAT} pose={{...P.sitDesk(f * 3), head: 14 + Math.sin(f / 2) * 6}} faceTurn={0.6} look={[1, 1]} badge={false} />
			<SchoolDesk x={880} c="#8a5a3a" />
			{Array.from({length: 1 + Math.floor(f / 10)}).map((_, i) => (
				<Book key={i} x={1030} y={680 - i * 26} rot={90} s={0.6} c={['#3a6fd2', '#d23b3b', '#3aa37a', '#f2b21c'][i % 4]} title="" />
			))}
			<g transform="translate(1500,300)">
				<rect x={-150} y={-70} width={300} height={140} rx={20} fill="#141826" />
				<text y={20} textAnchor="middle" fontSize={56} fontFamily={RB} fontWeight={900} fill="#3aff9a">
					{['SAT', 'SAT', 'SUN', 'SUN'][Math.floor(f / 12) % 4]} {String((f * 7) % 24).padStart(2, '0')}:00
				</text>
			</g>
			<SpeedLines k={0.5} seed={'tl' + Math.floor(f / 4)} c="#fff" />
		</Scene>
	);
};
/* 038 «Because now you did.» */
const S038: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 1.4], [dur, 940, 500, 2.0]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={960} pose={gesture('rubChin', idle(f, 1), 1, f)} faceTurn={0.1} mouth="smirk" lidBase={0.55} />
			<Magic x={960} y={420} t={f - 4} w={400} h={260} />
			<Title t={f - 4} lines={['NOW YOU DID.']} y={90} size={90} c="#ff3b4e" />
		</Scene>
	);
};
/* 039 «You get a hundred. Then it gets fun.» */
const S039: React.FC = () => {
	const {f, w} = useB();
	const th = w('039', 'hundred');
	const tf = w('039', 'fun');
	if (f < tf - 6)
		return (
			<Scene cam={shake(camK(f, [[0, 960, 540, 1.0], [tf, 960, 540, 1.15]]), f, th + 2, 14)} bg="#f0e2b8" set={<ClassRoom f={f} board="HISTORY TEST" />}>
				<TestPaper x={960} y={560} s={1.6} grade="100" t={f - th} />
				<Sparks x={1080} y={760} t={f - th - 2} c="#ffd34a" r={300} />
			</Scene>
		);
	const j = jump(f, tf, 140, 20);
	return (
		<Scene cam={camK(f, [[tf - 6, 960, 560, 1.4], [tf + 60, 960, 520, 1.2]])} bg="#f0e2b8" set={<ClassRoom f={f} board="HISTORY TEST" />}>
			<Hero x={960} floor={900 - j.lift} squash={j.squash} pose={P.cheer(f)} faceTurn={0.2} mouth="smile" lidBase={0.2} />
			{Array.from({length: 40}).map((_, i) => (
				<rect key={i} x={random('cf' + i) * 1920} y={((f - tf) * (4 + random('cv' + i) * 4) + random('cy' + i) * 300) - 300} width={14} height={22} fill={['#ff2a3c', '#ffd34a', '#3a6fd2', '#3aa37a'][i % 4]} transform={`rotate(${f * 6 + i * 20} ${random('cf' + i) * 1920} ${(f - tf) * 5})`} />
			))}
			<Title t={f - tf} lines={['THEN IT GETS FUN']} y={70} size={84} />
		</Scene>
	);
};

/* 040 «Zoe sits by the window in English class.» */
const ZoeClass: React.FC<{cam: any; children?: React.ReactNode; zoe?: Partial<React.ComponentProps<typeof Actor>>}> = ({cam, children, zoe}) => {
	const {f} = useB();
	return (
		<Scene cam={cam} bg="#f0e2b8" light={{x: 90, y: 20, o: 0.55}} set={<ClassRoom f={f} board="ENGLISH" />}>
			<Classmates f={f} xs={[180, 420]} />
			<g opacity={0.25}>
				<polygon points="1840,160 2320,160 1700,900 1250,900" fill="#fff6c0" />
			</g>
			<Actor who="zoe" x={1500} seat={800} pose={P.sitDesk(f + 5)} facing={-1} faceTurn={0.3} {...zoe} />
			<SchoolDesk x={1440} />
			{children}
		</Scene>
	);
};
const S040: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 900, 560, 1.1], [dur, 1480, 560, 1.75]]);
	return (
		<ZoeClass cam={cam}>
			<Hero x={820} seat={SEAT} pose={P.sitDesk(f)} faceTurn={0.6} look={[1, 0]} lidBase={0.3} />
			<SchoolDesk x={880} />
			{[0, 1, 2].map((i) => (
				<Pow key={i} x={1560 + i * 30} y={460 - ((f + i * 20) % 60) * 2} text="✦" t={10} size={40} c="#fff6c0" hold={999} />
			))}
		</ZoeClass>
	);
};
/* 041 «She's never said a word to you.» */
const S041: React.FC = () => {
	const {f, w} = useB();
	const cam = camCut(f, [[0, 1100, 560, 1.25], [w('041', 'word') - 2, 900, 560, 1.6]]);
	const wv = env(f, 6, 999, 6, 1);
	return (
		<ZoeClass cam={cam} zoe={{look: [-1, -0.5], faceTurn: 0.1, mouth: 'flat'}}>
			<Hero x={820} seat={SEAT} pose={gesture('wave', P.sitDesk(f), wv, f)} faceTurn={0.6} look={[1, 0]} mouth="smile" lidBase={0.2} />
			<SchoolDesk x={880} />
			<g transform={`translate(1150,280) scale(${pop(f - 10)})`}>
				<rect x={-190} y={-60} width={380} height={120} rx={60} fill="#141826" stroke="#fff" strokeWidth={5} />
				<text y={18} textAnchor="middle" fontSize={44} fontFamily={RB} fontWeight={900} fill="#fff">
					WORDS SAID: <tspan fill="#ff3b4e">0</tspan>
				</text>
			</g>
		</ZoeClass>
	);
};
/* 042 «Kai dares you to talk to her.» */
const S042: React.FC = () => {
	const {f, w} = useB();
	const td = w('042', 'dares');
	const cam = camCut(f, [[0, 800, 580, 1.75], [td + 10, 960, 580, 1.3]]);
	const nudge = env(f, td - 2, td + 20, 4, 6);
	return (
		<ZoeClass cam={cam}>
			<Hero x={820} seat={SEAT} pose={{...P.sitDesk(f), lean: 4 - nudge * 10}} faceTurn={0.6} look={[-1, 0]} expr="worried" mouth="flat" />
			<SchoolDesk x={880} />
			<Actor who="kai" x={600} seat={800} pose={reach(P.sitDesk(f), 'F', [150, -80], nudge)} faceTurn={0.6} mouth="smirk" lidBase={0.3} />
			<Pow x={720} y={330} text="DARE YA!" t={f - td} size={64} />
			<Pow x={1500} y={380} text="→" t={f - td - 10} size={90} c="#ff3b4e" rot={0} />
		</ZoeClass>
	);
};
/* 043 «You walk over and say, hey, we met at summer camp.» */
const S043: React.FC = () => {
	const {f, w} = useB();
	const th = w('043', 'hey');
	const hw = mover(f, 0, th, 700, 1260, {seed: 2});
	const cam = camCut(f, [[0, 1000, 580, 1.2], [th - 2, 1360, 560, 1.6]]);
	return (
		<ZoeClass cam={cam} zoe={{look: [-1, 0], faceTurn: 0.5}}>
			<Hero x={hw.x} pose={f > th ? gesture('wave', idle(f, 1), 1, f) : hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} mouth="smile" lidBase={0.3} />
			<Bubble x={1100} y={300} w={bw('HEY! WE MET AT SUMMER CAMP!', 36)} h={90} t={f - th} tail={[100, 120]}>
				{say('HEY! WE MET AT SUMMER CAMP!', 36)}
			</Bubble>
			<LieStamp x={1500} y={240} t={f - th - 30} />
		</ZoeClass>
	);
};
/* 044 «Remember, you've never been to summer camp.» — freeze frame aside */
const S044: React.FC = () => {
	const {f, w} = useB();
	const cam = camK(f, [[0, 960, 540, 1.0], [80, 960, 540, 1.08]]);
	const tn = w('044', 'never');
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<g transform={`translate(960,520) scale(${pop(f - 2)}) rotate(-3)`}>
				<rect x={-330} y={-230} width={660} height={460} rx={24} fill="#fbf8ef" />
				<rect x={-310} y={-210} width={620} height={330} fill="#141a46" />
				<Campfire x={0} y={90} f={f} s={1.2} />
				<text y={190} textAnchor="middle" fontSize={44} fontFamily={RB} fontWeight={900} fill="#2a2030">
					SUMMER CAMP
				</text>
				{f > tn ? <path d={`M-280,-180 L${-280 + 560 * Math.min(1, (f - tn) / 8)},${-180 + 340 * Math.min(1, (f - tn) / 8)}`} stroke="#ff2a3c" strokeWidth={28} strokeLinecap="round" /> : null}
			</g>
			<Title t={f - tn} lines={['NEVER BEEN THERE']} y={60} size={78} c="#ff3b4e" />
		</Scene>
	);
};
/* 045 «Zoe's face lights up.» */
const S045: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 1480, 520, 1.6], [dur, 1480, 500, 2.4]]);
	return (
		<ZoeClass cam={cam} zoe={{expr: 'wide', mouth: 'smile', look: [-1, -0.2], faceTurn: 0.5, pose: {...P.sitDesk(f), head: -10}}}>
			<Sparks x={1480} y={480} t={f % 30} c="#fff6c0" r={160} seed={'z' + Math.floor(f / 30)} />
			<circle cx={1480} cy={500} r={150 + Math.sin(f / 4) * 10} fill="#fff6c0" opacity={0.25} />
		</ZoeClass>
	);
};
/* 046 «Oh my gosh. Yes, you are the one who fell in the lake.» */
const S046: React.FC = () => {
	const {f, w} = useB();
	const tl = w('046', 'lake');
	const cam = camCut(f, [[0, 1440, 540, 1.7], [w('046', 'you') - 2, 1300, 560, 1.25]]);
	return (
		<ZoeClass cam={cam} zoe={{expr: 'wide', mouth: 'open', faceTurn: 0.5, pose: P.cheer(f)}}>
			<Hero x={1180} pose={idle(f, 1)} faceTurn={0.6} mouth="smile" lidBase={0.3} />
			<Bubble x={1500} y={260} w={bw('YOU FELL IN THE LAKE!', 40)} h={90} t={f - 4} tail={[0, 120]}>
				{say('YOU FELL IN THE LAKE!', 40)}
			</Bubble>
			{f > tl - 6 ? <Polaroid x={850} y={330} rot={-8} s={pop(f - tl + 6) * 1.2} kind="lake" /> : null}
			<Pow x={850} y={520} text="SPLASH!" t={f - tl} size={50} c="#9fd2f0" />
		</ZoeClass>
	);
};
/* 047 «And suddenly you have a whole summer of memories together that you've never lived.» */
const S047: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 600, 1.6], [dur, 960, 560, 1.05]]);
	const kinds = ['lake', 'fire', 'stars', 'lake', 'fire', 'stars'] as const;
	return (
		<Scene cam={cam} bg="#141a46" light={{night: true, o: 0.6}} set={<Park f={f} evening />}>
			<Campfire x={960} y={890} f={f} s={1.2} />
			<Hero x={720} pose={idle(f, 1)} faceTurn={0.6} look={[1, 0]} lidBase={0.2} expr="wide" />
			<Actor who="zoe" x={1200} facing={-1} pose={P.laugh(f)} mouth="smile" />
			{kinds.map((k, i) => {
				const t = f - 6 - i * 10;
				const a = (i / kinds.length) * Math.PI * 2 + f / 60;
				return t > 0 ? <Polaroid key={i} x={960 + Math.cos(a) * 700} y={360 + Math.sin(a) * 200} rot={Math.sin(a) * 12} s={pop(t) * 0.75} kind={k} /> : null;
			})}
		</Scene>
	);
};
/* 048 «She remembers all of it. You remember none of it.» — two thought bubbles */
const S048: React.FC = () => {
	const {f, w} = useB();
	const ty = w('048', 'you');
	const cam = camCut(f, [[0, 1350, 520, 1.5], [ty - 2, 700, 520, 1.5]]);
	return (
		<ZoeClass cam={cam} zoe={{seat: undefined, mouth: 'smile', pose: idle(f, 5), facing: -1}}>
			<Hero x={700} pose={gesture('scratch', idle(f, 1), env(f, ty, 999, 6, 1), f)} faceTurn={0.6} expr="worried" mouth="frown" />
			<Bubble x={1500} y={230} w={380} h={200} t={f - 2} thought tail={[-20, 160]}>
				<Polaroid x={-90} y={0} s={0.5} rot={-6} kind="lake" />
				<Polaroid x={0} y={0} s={0.5} rot={4} kind="fire" />
				<Polaroid x={90} y={0} s={0.5} rot={-3} kind="stars" />
			</Bubble>
			<Bubble x={700} y={220} w={260} h={190} t={f - ty} thought tail={[20, 160]}>
				<text y={50} textAnchor="middle" fontSize={150} fontFamily={RB} fontWeight={900} fill="#ff2a3c">
					?
				</text>
			</Bubble>
		</ZoeClass>
	);
};
/* 049 «She asks if you want to sit together at lunch.» */
const S049: React.FC = () => {
	const {f, w} = useB();
	const tl = w('049', 'lunch');
	const cam = camCut(f, [[0, 1350, 540, 1.6], [tl, 1000, 560, 1.25]]);
	return (
		<ZoeClass cam={cam} zoe={{seat: undefined, mouth: 'smile', pose: gesture('wave', idle(f, 5), 1, f), facing: -1}}>
			<Hero x={1100} pose={f > tl ? P.cheer(f) : idle(f, 1)} faceTurn={0.6} mouth="smile" lidBase={0.2} />
			<Bubble x={1550} y={260} w={bw('SIT WITH ME AT LUNCH?', 36)} h={90} t={f - 6} tail={[-40, 120]}>
				{say('SIT WITH ME AT LUNCH?', 36)}
			</Bubble>
			{f > tl ? [0, 1, 2].map((i) => <Pow key={i} x={1100 + (i - 1) * 120} y={380 - ((f - tl + i * 10) % 40) * 3} text="♥" t={8} size={50} c="#ff6a8a" hold={999} />) : null}
		</ZoeClass>
	);
};

/* 050 «A guy cuts in front of you in the lunch line.» */
const S050: React.FC = () => {
	const {f, w} = useB();
	const tc = w('050', 'cuts');
	const gw = mover(f, tc - 14, tc + 6, 2100, 1080, {run: true});
	const cam = shake(camK(f, [[0, 900, 560, 1.2], [tc + 6, 1000, 560, 1.55]]), f, tc + 6, 10);
	return (
		<Scene cam={cam} bg="#e6f0f4" light={{x: 40, y: 10, o: 0.4}} set={<Cafeteria f={f} />}>
			<Extra i={1} x={400} floor={900} s={0.95} pose={idle(f, 2)} seed="ln" />
			<Extra i={2} x={600} floor={900} s={0.95} pose={idle(f, 3)} seed="ln" />
			<Hero x={1250} pose={f > tc + 6 ? gesture('fist', P.shout(f), 0.6, f) : idle(f, 1)} facing={-1} faceTurn={0.5} expr={f > tc + 6 ? 'angry' : 'normal'} lidBase={0.3} mouth={f > tc + 6 ? 'open' : 'flat'} />
			<Actor who="guy" x={gw.x} facing={-1} pose={gw.pose} vx={gw.vx} bob={gw.bob} mouth="smirk" lidBase={0.4} />
			<rect x={1170} y={620} width={140} height={14} rx={4} fill="#9aa3b5" />
			<Pow x={1080} y={360} text="CUT!" t={f - tc - 6} size={64} />
		</Scene>
	);
};
/* 051 «You say, actually, my dad owns this school.» */
const S051: React.FC = () => {
	const {f, w} = useB();
	const ta = w('051', 'actually');
	const cam = camCut(f, [[0, 1250, 520, 1.8], [ta + 20, 1180, 540, 1.3]]);
	return (
		<Scene cam={cam} bg="#e6f0f4" set={<Cafeteria f={f} />}>
			<Hero x={1250} pose={gesture('armsCrossed', idle(f, 1), 1, f)} facing={-1} faceTurn={0.5} mouth="smirk" lidBase={0.55} />
			<Actor who="guy" x={980} facing={1} pose={idle(f, 3)} expr={f > ta + 30 ? 'wide' : 'normal'} />
			<Bubble x={1300} y={300} w={bw('MY DAD OWNS THIS SCHOOL.', 38)} h={90} t={f - ta} tail={[0, 120]}>
				{say('MY DAD OWNS THIS SCHOOL.', 38)}
			</Bubble>
			<LieStamp x={1600} y={420} t={f - ta - 26} />
		</Scene>
	);
};
/* 052 «By the next day, your dad owns the school.» */
const S052: React.FC = () => {
	const {f, w} = useB();
	const to = w('052', 'owns');
	const cam = camCut(f, [[0, 960, 500, 1.0], [to - 2, 960, 560, 1.55]]);
	return (
		<Scene cam={cam} bg="#7fc0ea" light={{x: 20, y: 10, o: 0.45}} set={<SchoolYard f={f} />}>
			<Actor who="dad" x={960} pose={gesture('scratch', idle(f, 4), env(f, to + 20, 999, 8, 1), f)} faceTurn={0.2} expr="wide" />
			<g transform={`translate(960,${620})`}>
				<path d="M-60,-120 L60,40" stroke="#ffd34a" strokeWidth={22} />
				<text x={0} y={-30} textAnchor="middle" fontSize={22} fontFamily={RB} fontWeight={900} fill="#2a2030" transform="rotate(53)">
					OWNER
				</text>
			</g>
			<Key x={1150} y={560} s={pop(f - to) * 1.3} rot={-20} />
			<Sparks x={1150} y={560} t={f - to} r={200} />
			<Magic x={960} y={600} t={f - to + 20} w={300} h={300} />
			<Tag x={960} y={240} t={f - 2} text="THE NEXT DAY" size={54} />
		</Scene>
	);
};
/* 053 «He doesn't know how it happened. He's just suddenly the owner of a middle school, sitting in a meeting about cafeteria ketchup.» */
const S053: React.FC = () => {
	const {f, w} = useB();
	const ts = w('053', 'sitting');
	const tk = w('053', 'ketchup');
	if (f < ts - 4)
		return (
			<Scene cam={camCut(f, [[0, 960, 560, 1.6], [w('053', 'suddenly') - 2, 960, 520, 1.15]])} bg="#7fc0ea" set={<SchoolYard f={f} />}>
				<Actor who="dad" x={960} pose={gesture('shrug', idle(f, 4), 1, f)} faceTurn={0.1} expr="worried" mouth="frown" />
				<QMarkMini x={1100} y={380} f={f} />
				<Pow x={960} y={240} text="OWNER?!" t={f - w('053', 'owner')} size={70} />
			</Scene>
		);
	return (
		<Scene cam={camCut(f, [[ts - 4, 960, 600, 1.15], [tk - 2, 1260, 360, 1.8]])} bg="#dfe6f2" set={<Meeting f={f - ts} />}>
			<Actor who="assistant" x={560} seat={790} pose={P.sitDesk(f)} />
			<Actor who="dad" x={960} seat={790} pose={gesture('rubChin', P.sitDesk(f), 1, f)} faceTurn={0.1} expr="worried" />
			<Actor who="sci" x={1360} seat={790} facing={-1} pose={gesture('point', P.sitDesk(f), 1, f)} handF="point" mouth="open" />
			<MeetingTable />
			<Pow x={1260} y={180} text="KETCHUP!" t={f - tk} size={56} c="#ff3b4e" />
		</Scene>
	);
};
const QMarkMini: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
	<text x={x} y={y + Math.sin(f / 6) * 8} fontSize={110} fontFamily={RB} fontWeight={900} fill="#ff2a3c" transform={`rotate(12 ${x} ${y})`}>
		?
	</text>
);
/* 054a «Very confused.» */
const S054a: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 520, 1.8], [dur, 960, 500, 2.3]]);
	return (
		<Scene cam={cam} bg="#dfe6f2" set={<Meeting f={60} />}>
			<Actor who="dad" x={960} seat={790} pose={gesture('handsOnHead', P.sitDesk(f), 1, f)} faceTurn={0} expr="worried" mouth="frown" />
			<MeetingTable />
			<QMarkMini x={1080} y={380} f={f} />
			<QMarkMini x={800} y={360} f={f + 20} />
		</Scene>
	);
};
/* 054b «At the mall, a shop assistant asks if you're old enough to buy a ticket to an R rated movie.» */
const S054b: React.FC = () => {
	const {f, w} = useB();
	const tr = w('054', 'r');
	const hw = mover(f, 0, 30, -100, 760, {seed: 1});
	const cam = camCut(f, [[0, 760, 560, 1.15], [w('054', 'asks') - 2, 1200, 560, 1.6], [tr - 2, 1000, 540, 1.3]]);
	return (
		<Scene cam={cam} bg="#1d1440" light={{x: 50, y: 10, o: 0.5, c: '255,200,240'}} set={<Cinema f={f} />}>
			<Actor who="clerk" x={1200} facing={-1} pose={gesture('stop', idle(f, 4), env(f, tr, 999, 6, 1), f)} lidBase={0.4} mouth="flat" />
			<TicketBooth x={1200} f={f} />
			<Hero x={hw.x} pose={hw.pose} vx={hw.vx} bob={hw.bob} faceTurn={0.6} mouth="smile" />
			<Bubble x={1200} y={300} w={bw('ARE YOU OLD ENOUGH?', 38)} h={90} t={f - w('054', 'asks')} tail={[-60, 130]}>
				{say('ARE YOU OLD ENOUGH?', 38)}
			</Bubble>
			<Pow x={760} y={330} text="R" t={f - tr} size={140} c="#ff2a3c" />
			<Tag x={400} y={250} t={f - 2} text="THE MALL" size={50} />
		</Scene>
	);
};
/* 055 «You say, I'm 18. You look down.» */
const S055: React.FC = () => {
	const {f, w} = useB();
	const t18 = w('055', '18');
	const tl = w('055', 'look');
	const cam = camCut(f, [[0, 760, 540, 1.8], [tl - 2, 760, 720, 1.9]]);
	return (
		<Scene cam={cam} bg="#1d1440" light={{x: 50, y: 10, o: 0.5, c: '255,200,240'}} set={<Cinema f={f} />}>
			<Actor who="clerk" x={1200} facing={-1} pose={idle(f, 4)} lidBase={0.4} />
			<TicketBooth x={1200} f={f} />
			<Hero x={760} pose={f > tl ? {...reach(idle(f, 1), 'F', [50, -40], 1), head: 26} : gesture('point', idle(f, 1), 0.5, f)} faceTurn={0.6} look={f > tl ? [0.5, 1] : [1, 0]} mouth={f > tl ? 'open' : 'smirk'} expr={f > tl ? 'wide' : 'normal'} lidBase={f > tl ? 0 : 0.45} />
			<Bubble x={760} y={300} w={bw("I'M 18.")} h={100} t={f - t18 + 6} tail={[0, 120]}>
				{say("I'M 18.")}
			</Bubble>
			<LieStamp x={1000} y={260} t={f - t18 - 10} />
		</Scene>
	);
};
/* 056 «Your hands are bigger. You have a beard.» — the hero grows up on the spot */
const S056: React.FC = () => {
	const {f, w} = useB();
	const tb = w('056', 'beard');
	const grow = ez(f, 0, 30, 0, 1);
	const cam = camCut(f, [[0, 840, 640, 1.9], [tb - 4, 760, 470, 2.1]]);
	return (
		<Scene cam={shake(cam, f, 2, 8, 20)} bg="#1d1440" light={{x: 50, y: 10, o: 0.5, c: '255,200,240'}} set={<Cinema f={f} />}>
			<Hero x={760} s={1 + 0.14 * grow} pose={reach({...idle(f, 1), head: f < tb - 4 ? 20 : -4}, 'F', f < tb - 4 ? [60, -40] : [20, -150], 1)} armOver={f > tb} age={grow} faceTurn={0.6} look={f < tb - 4 ? [0.6, 1] : [0, 0]} expr="wide" lidBase={0} mouth="open" />
			<Callout f={f} t0={6} t1={tb - 4} from={[870, 660]} to={[1180, 560]} text="BIG HANDS" />
			<Callout f={f} t0={tb} t1={tb + 90} from={[790, 420]} to={[1100, 300]} text="BEARD?!" c="#ff6a8a" />
			<Magic x={760} y={500} t={f + 6} w={260} h={360} />
		</Scene>
	);
};
/* 057 «You walk into the movie. And when it's over, you say, just kidding.» */
const S057: React.FC = () => {
	const {f, w} = useB();
	const to = w('057', 'over');
	const tj = w('057', 'just');
	if (f < to - 4) {
		const hw = mover(f, 0, to, 600, 1400, {seed: 2});
		return (
			<Scene cam={camK(f, [[0, 760, 560, 1.3], [to, 1300, 560, 1.4]])} bg="#1d1440" set={<Cinema f={f} />}>
				<Hero x={hw.x} s={1.14} age={1} pose={reach(hw.pose, 'F', [50, -70], 1)} vx={hw.vx} bob={hw.bob} faceTurn={0.6} mouth="smile" lidBase={0.4} />
				<Popcorn x={hw.x + 70} y={700} />
				<Pow x={1300} y={300} text="ENJOY THE SHOW" t={f - 10} size={44} c="#ffd34a" hold={60} />
			</Scene>
		);
	}
	return (
		<Scene cam={camCut(f, [[to - 4, 960, 560, 1.15], [tj - 2, 1000, 520, 1.75]])} bg="#1d1440" set={<Cinema f={f} />}>
			<Actor who="clerk" x={1250} facing={-1} pose={idle(f, 4)} />
			<TicketBooth x={1250} f={f} />
			<Hero x={960} s={1.14} age={1} pose={gesture('wave', idle(f, 1), env(f, tj, 999, 6, 1), f)} faceTurn={0.5} mouth="smirk" lidBase={0.5} />
			<Bubble x={960} y={260} w={bw('JUST KIDDING.')} h={100} t={f - tj} tail={[0, 120]}>
				{say('JUST KIDDING.')}
			</Bubble>
			<Tag x={500} y={300} t={f - to} text="2 HOURS LATER" size={46} />
		</Scene>
	);
};
/* 058 «I'm 14. And you're 14 again.» — POOF back to a kid */
const S058: React.FC = () => {
	const {f, w} = useB();
	const ta = w('058', 'again');
	const sh = ez(f, ta - 20, ta - 6, 1, 0);
	const cam = shake(camCut(f, [[0, 960, 520, 1.7], [ta - 20, 960, 560, 1.3]]), f, ta - 20, 14);
	return (
		<Scene cam={cam} bg="#1d1440" set={<Cinema f={f} />}>
			<Hero x={960} s={1 + 0.14 * sh} age={sh} pose={f > ta ? P.cheer(f) : idle(f, 1)} faceTurn={0.4} mouth="smile" lidBase={0.3} />
			<Bubble x={960} y={260} w={bw("I'M 14.")} h={100} t={f - 2} tail={[0, 120]}>
				{say("I'M 14.")}
			</Bubble>
			<Pow x={960} y={640} text="POOF!" t={f - ta + 20} size={90} c="#fff" />
			<Sparks x={960} y={600} t={f - ta + 20} r={300} />
			<Flash t={f - ta + 20} o={0.6} />
		</Scene>
	);
};
/* 059 «Kai saw the whole thing. He doesn't talk for an hour.» */
const S059: React.FC = () => {
	const {f, w} = useB();
	const th = w('059', 'hour');
	const cam = camCut(f, [[0, 960, 520, 2.0], [w('059', 'he') - 2, 960, 540, 1.3]]);
	return (
		<Scene cam={cam} bg="#1d1440" set={<Cinema f={f} />}>
			<Actor who="kai" x={960} pose={{...idle(f, 1), armF: [10, 40]}} expr="wide" mouth="open" faceTurn={0.1} />
			<Popcorn x={1040} y={700 + Math.max(0, f - 20) * 6} />
			{Array.from({length: 8}).map((_, i) => (
				<circle key={i} cx={1020 + i * 10} cy={680 + Math.max(0, f - 16 - i * 2) * (5 + i)} r={10} fill="#fff6d0" />
			))}
			<g transform="translate(1450,300)">
				<rect x={-160} y={-70} width={320} height={140} rx={20} fill="#141826" />
				<text y={22} textAnchor="middle" fontSize={64} fontFamily={RB} fontWeight={900} fill="#3aff9a">
					{f < th ? '0:00' : `0:${String(Math.min(59, Math.floor((f - th) * 1.5))).padStart(2, '0')}`}
				</text>
			</g>
			<Tag x={500} y={300} t={f - 4} text="saw EVERYTHING" size={46} />
		</Scene>
	);
};
/* 060 «Then it gets bigger.» */
const S060: React.FC = () => {
	const {f, dur} = useB();
	const cam = camK(f, [[0, 960, 560, 2.2], [dur, 960, 560, 0.9]]);
	return (
		<Scene cam={cam} bg="#2a0508" light={false} set={<RedVoid f={f} />}>
			<Hero x={960} pose={P.present(f)} mouth="smirk" lidBase={0.5} />
			<Title t={f - 2} lines={['THEN IT GETS', 'BIGGER']} y={60} size={100} c="#ff3b4e" />
		</Scene>
	);
};

export const SHOTS2: ShotDef[] = [
	{at: '021', C: S021, whip: true},
	{at: '022', C: S022, whip: true},
	{at: '023', C: S023, whip: true},
	{at: '024', C: S024},
	{at: '024', off: wordOff('024', 'scientists'), C: S024, whip: true},
	{at: '025', C: S025},
	{at: '026', C: S026, whip: true},
	{at: '027', C: S027},
	{at: '028', C: S028, whip: true},
	{at: '029', C: S029},
	{at: '030', C: S030},
	{at: '031', C: S031},
	{at: '032', C: S032},
	{at: '033', C: S033, whip: true},
	{at: '034', C: S034},
	{at: '035', C: S035, whip: true},
	{at: '036', C: S036},
	{at: '037', C: S037, whip: true},
	{at: '038', C: S038},
	{at: '039', C: S039, whip: true},
	{at: '040', C: S040},
	{at: '041', C: S041},
	{at: '042', C: S042},
	{at: '043', C: S043},
	{at: '044', C: S044, whip: true},
	{at: '045', C: S045, whip: true},
	{at: '046', C: S046},
	{at: '047', C: S047, whip: true},
	{at: '048', C: S048, whip: true},
	{at: '049', C: S049},
	{at: '050', C: S050, whip: true},
	{at: '051', C: S051},
	{at: '052', C: S052, whip: true},
	{at: '053', C: S053},
	{at: '054', C: S054a},
	{at: '054', off: wordOff('054', 'at'), C: S054b, whip: true},
	{at: '055', C: S055},
	{at: '056', C: S056},
	{at: '057', C: S057},
	{at: '058', C: S058},
	{at: '059', C: S059},
	{at: '060', C: S060, whip: true},
];
