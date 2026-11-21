import React from 'react';
import type {ShotDef} from '../kit/coverage';
import {S, Item, ActorSpec, Ev} from './dsl';

/* THE VIDEO: "What if you got $1,000 every time you said no?" — scenes written as data (see dsl.tsx). */
const A = (id: string, who: string, x: number, ev: Ev[] = [], o: Partial<ActorSpec> = {}): ActorSpec => ({id, who, x, ev, ...o});
const H = (x: number, ev: Ev[] = [], o: Partial<ActorSpec> = {}) => A('hero', 'hero', x, ev, o);
const PH = (t: string, d = 70, glow = '#8affb0'): Ev => [t, 'hold', 'phone', d, glow];

/* tiny world props */
const Cat: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
	<g transform={`translate(${x},${y}) scale(${k})`}>
		<ellipse cx={0} cy={-34} rx={50} ry={34} fill="#9a8a7a" stroke="#1d1626" strokeWidth={4} />
		<circle cx={44} cy={-62} r={30} fill="#9a8a7a" stroke="#1d1626" strokeWidth={4} />
		<path d="M26,-84 l6,-26 l16,18 z M56,-88 l14,-22 l6,28 z" fill="#9a8a7a" stroke="#1d1626" strokeWidth={4} strokeLinejoin="round" />
		<ellipse cx={36} cy={-64} rx={7} ry={9} fill="#fff" /><circle cx={38} cy={-62} r={3} fill="#1d1626" />
		<ellipse cx={56} cy={-64} rx={7} ry={9} fill="#fff" /><circle cx={58} cy={-62} r={3} fill="#1d1626" />
		<path d="M38,-48 q6,-5 12,0" stroke="#1d1626" strokeWidth={3} fill="none" />
		<path d="M-48,-30 q-40,-10 -30,-60" stroke="#9a8a7a" strokeWidth={12} fill="none" strokeLinecap="round" />
	</g>
);
const House: React.FC<{x: number; y?: number; roof: string; s?: number}> = ({x, y = 900, roof, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-170} y={-230} width={340} height={230} fill="#f2e2c2" stroke="#1d1626" strokeWidth={5} />
		<path d="M-210,-226 L0,-380 L210,-226 Z" fill={roof} stroke="#1d1626" strokeWidth={5} strokeLinejoin="round" />
		<rect x={-40} y={-130} width={80} height={130} fill="#8a5a3a" stroke="#1d1626" strokeWidth={4} />
		<rect x={-140} y={-190} width={70} height={70} fill="#bfe0ff" stroke="#1d1626" strokeWidth={4} />
		<rect x={70} y={-190} width={70} height={70} fill="#bfe0ff" stroke="#1d1626" strokeWidth={4} />
	</g>
);
const Billboard: React.FC<{x: number; y: number; text: string; sub?: string; c?: string}> = ({x, y, text, sub, c = '#ffd84a'}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-300} y={-120} width={600} height={240} rx={16} fill="#11142c" stroke={c} strokeWidth={8} />
		<text y={-10} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={64} fill="#fff">{text}</text>
		{sub ? <text y={70} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={40} fill={c}>{sub}</text> : null}
		<rect x={-16} y={120} width={32} height={500} fill="#3a3f6a" />
	</g>
);
const Drone: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
	<g transform={`translate(${x},${y + Math.sin(t / 7) * 8})`}>
		<ellipse rx={36} ry={12} fill="#20223a" stroke="#1d1626" strokeWidth={3} />
		<line x1={-60} y1={-6} x2={60} y2={-6} stroke="#9aa6b8" strokeWidth={4} />
		<ellipse cx={-52} cy={-12} rx={30} ry={5} fill="#cfd8ff" opacity={0.5 + 0.3 * Math.sin(t * 2)} />
		<ellipse cx={52} cy={-12} rx={30} ry={5} fill="#cfd8ff" opacity={0.5 + 0.3 * Math.cos(t * 2)} />
		<circle cy={10} r={5} fill="#ff3a4a" />
	</g>
);

export const SHOTS: ShotDef[] = [
	/* 001-002: the hook, the pizza man */
	S('001', {
		bg: 'street', mood: 'excited', zoom: 1.05,
		cast: [H(300, [['001', 'walk', 760, 8], ['001:0.6', 'g', 'presentF', 60]]), A('pizza', 'pizza', 2150, [['001:0.7', 'walk', 1230, 11], ['002', 'hold', 'flyer', 200], ['002:0.5', 'g', 'presentF', 60]], {face: -1})],
		fx: [['001', 'stat', '$1,000', 'EVERY TIME YOU SAY NO', 150, '#7dff9a', 130, 140], ['002:0.2', 'say', 'pizza', 'Free pizza slice?', 90]],
	}),
	S('003', {
		bg: 'street', mood: 'excited',
		cast: [H(760, [['003', 'g', 'stop', 40], ['003', 'say', 'hero', 'No, thanks.'], PH('003:0.3', 120), ['003:0.35', 'e', 'wide', 90], ['004:0.1', 'look', [0.6, 0.3], 60], ['004:0.55', 'look', [1, 0], 60]]),
			A('pizza', 'pizza', 1230, [['003', 'hold', 'flyer', 100], ['004:0.55', 'g', 'shrug', 70], ['004:0.55', 'e', 'normal', 60]], {face: -1})],
		fx: [['003:0.33', '!', 'hero'], ['004:0.6', 'say', 'pizza', 'Your loss.', 60]],
	}),
	S('005', {
		bg: 'street', mood: 'excited',
		cast: [H(760, [['005:0.4', 'g', 'point', 50], ['005:0.4', 'say', 'hero', 'Say that again?', 80], ['006:0.1', 'g', 'stop', 40], ['006:0.1', 'say', 'hero', 'No.'], ['006:0.3', 'hop', 14], ['006:0.35', 'm', 'smirk', 90]]),
			A('pizza', 'pizza', 1230, [['005:0.2', 'hold', 'pizza', 160], ['005:0.45', 'g', 'presentF', 60], ['006:0.5', 'walk', 1750, 4], ['006:0.5', 'e', 'worried', 120]], {face: -1})],
		fx: [['006:0.28', 'sparkle', 'hero'], ['006:0.6', '!', 'pizza']],
	}),
	S('007', {
		bg: 'street', mood: 'tense', zoom: 1.3,
		cast: [H(900, [['007', 'g', 'shrug', 70], ['007:0.5', 'g', 'presentF', 70], ['007:0.3', 'look', [1, 0], 20]])],
		fx: [['007', 'glitch'], ['007:0.15', 'stat', 'SOMETHING IS WRONG', undefined, 80, '#ff6a5a', 160, 90], ['007:0.62', 'bulb', 'hero']],
	}),
	S('008', {
		bg: 'hardware', mood: 'calm',
		cast: [H(1480, [['008', 'g', 'presentF', 50], ['008:0.55', 'g', 'wave', 50]]), A('man', 'man', 300, [['008:0.1', 'walk', 1000, 7], ['008:0.7', 'g', 'point', 50]])],
		fx: [['008', 'tag', 'hero', 'HARDWARE STORE · WEEKENDS', 100], ['008:0.2', 'say', 'man', 'Where are the nails?', 70]],
	}, true),
	S('009', {
		bg: 'kitchen', mood: 'calm',
		cast: [H(1250, [['009', 'face', -1], ['009:0.35', 'g', 'presentF', 40]]), A('theo', 'theo', -250, [['009:0.1', 'walk', 640, 12], ['009:0.4', 'g', 'wave', 60]]),
			A('mom', 'mom', 2200, [['009:0.45', 'walk', 1560, 12]], {face: -1}), A('zoe', 'zoe', 1000, [['009:0.75', 'g', 'wave', 60], ['009:0.75', 'hop', 14, 30]], {size: 'kid', hidden: true, face: -1})],
		fx: [['009:0.18', 'tag', 'theo', 'THEO · BEST FRIEND', 90], ['009:0.46', 'tag', 'mom', 'MOM · TWO JOBS', 90], ['009:0.74', 'tag', 'zoe', 'ZOE · 7', 100]],
	}),
	S('010', {
		bg: 'bedroom', mood: 'sad',
		cast: [H(1000, [PH('010', 110, '#ffd84a'), ['010:0.4', 'g', 'shrug', 60], ['010:0.65', 'face', 1], ['010:0.7', 'e', 'worried', 90]]), A('theo', 'theo', -250, [['010:0.5', 'walk', 400, 11], ['010:0.6', 'g', 'point', 40]]), A('mom', 'mom', 2200, [['010:0.6', 'walk', 1500, 11], ['010:0.7', 'g', 'presentF', 40]], {face: -1})],
		fx: [['010:0.05', 'stat', '$212', 'ALL YOUR SAVINGS', 100, '#ffd84a', 160, 120], ['010:0.6', 'say', 'theo', 'Can you…?'], ['010:0.78', 'say', 'hero', 'Sure…', 70]],
	}, true),
	S('011', {
		bg: 'kitchen', mood: 'calm',
		cast: [H(1050, [['011', 'walk', 1000, 5], ['011:0.7', 'face', -1]]), A('zoe', 'zoe', 520, [['011', 'hold', 'waffle', 200], ['011:0.55', 'g', 'presentF', 60]], {size: 'kid', face: 1})],
		fx: [['011:0.05', 'tag', 'hero', 'THE MORNING IT STARTED', 90], ['011:0.6', 'say', 'zoe', 'Trade me your last waffle?', 90]],
	}),
	S('012', {
		bg: 'kitchen', mood: 'excited',
		cast: [H(1000, [['012', 'face', -1], ['012', 'g', 'stop', 40], ['012', 'say', 'hero', 'No.'], PH('012:0.45', 80, '#8affb0'), ['012:0.5', 'e', 'wide', 80]]), A('zoe', 'zoe', 560, [['012', 'hold', 'waffle', 100]], {size: 'kid'})],
		fx: [['012:0.55', '?', 'hero'], ['012:0.8', 'say', 'hero', 'Wait… what?', 70]],
	}),
	S('013', {
		bg: 'kitchen', mood: 'excited',
		cast: [H(1000, [['013', 'face', -1], ['013:0.55', 'g', 'stop', 40], ['013:0.55', 'say', 'hero', 'No.']]), A('zoe', 'zoe', 560, [['013', 'hold', 'waffle', 120], ['013:0.1', 'g', 'point', 40], ['013:0.1', 'e', 'wide', 90]], {size: 'kid'})],
		fx: [['013:0.1', 'say', 'zoe', 'Is that a yes?', 80], ['013:0.6', 'hop', 'hero']],
	}),
	S('014', {
		bg: 'kitchen', mood: 'calm',
		cast: [H(1000, [['014', 'face', -1], ['014:0.1', 'e', 'wide', 70], ['014:0.2', 'g', 'shrug', 70]]), A('zoe', 'zoe', 560, [['014:0.05', 'e', 'worried', 90], ['014:0.55', 'hold', 'waffle', 100], ['014:0.55', 'e', 'normal', 100], ['014:0.55', 'hop', 14, 22]], {size: 'kid'})],
		fx: [['014:0.12', '?', 'zoe'], ['014:0.7', 'bang', 'zoe', 560, 400, 'CHOMP!', '#ffb02e', 0.6]],
	}),
	S('015', {
		bg: 'kitchen', mood: 'excited',
		cast: [H(900, [['015', 'g', 'fist', 40], PH('015:0.15', 80), ['015:0.55', 'g', 'rubChin', 60], ['015:0.55', 'e', 'normal', 60]])],
		fx: [['015:0.05', 'stat', '3 BUZZES BEFORE 8 AM', undefined, 100, '#7dff9a', 150, 90], ['015:0.62', 'bulb', 'hero'], ['015:0.78', 'say', 'hero', "Let's test it.", 80]],
	}),
	S('016', {
		bg: 'street', mood: 'excited',
		cast: [H(300, [['016', 'walk', 880, 9], ['016:0.5', 'g', 'presentF', 70]]), A('woman', 'woman', 2100, [['016:0.3', 'walk', 1320, 12], ['016:0.45', 'g', 'presentF', 60]], {face: -1})],
		fx: [['016:0.45', 'stat', 'NO  =  +$1,000', undefined, 110, '#7dff9a', 140, 120]],
	}, true),
	S('017', {
		bg: 'bedroom', mood: 'tense',
		cast: [H(900, [['017', 'walk', 960, 3], ['017:0.45', 'g', 'stop', 60], ['017:0.7', 'g', 'point', 60]])],
		fx: [['017:0.05', 'stat', 'RULE #1', 'THE NO MUST BE OUT LOUD', 90, '#ffd84a', 120, 110], ['017:0.5', 'stat', 'RULE #2', 'THE NO MUST BE REAL', 95, '#ff6a5a', 120, 110]],
	}, true),
	S('018', {
		bg: 'bedroom', mood: 'sad',
		cast: [H(850, [['018', 'g', 'stop', 40], ['018', 'say', 'hero', 'No. NO! NOOO!', 80], ['018:0.3', 'g', 'fist', 40], ['018:0.55', 'e', 'worried', 90], ['018:0.65', 'g', 'shrug', 80]])],
		props: (c) => <Cat x={1350} y={900} k={1.3} />,
		fx: [['018:0.15', 'stat', 'EMPTY ROOM: $0', undefined, 90, '#ff6a5a', 160, 100], ['018:0.72', 'say', 'hero', 'Even the cat is worried.', 90]],
	}),
	S('019', {
		bg: 'street', mood: 'sad',
		cast: [H(1250, [['019', 'face', -1], ['019:0.5', 'g', 'stop', 60]]), A('woman', 'woman', 600, [['019', 'g', 'presentF', 90], ['019:0.3', 'e', 'worried', 100], ['019:0.5', 'g', 'handsOnHead', 80]])],
		fx: [['019:0.05', 'stat', 'SOMEONE HAS TO HOPE FOR A YES', undefined, 130, '#ffd84a', 160, 80], ['019:0.45', 'sparkle', 'woman'], ['019:0.5', 'say', 'hero', 'No.']],
	}),
	S('020', {
		bg: 'street', mood: 'calm',
		cast: [H(1100, [['020', 'face', -1], ['020:0.5', 'g', 'shrug', 60], PH('020:0.55', 80, '#9aa6b8')]), A('pizza', 'man', 600, [['020', 'hold', 'phone', 100, '#ff6a5a'], ['020:0.2', 'g', 'presentF', 60]], {face: 1})],
		fx: [['020:0.05', 'stat', 'ROBOCALL', 'NO HUMAN HOPING = $0', 130, '#ff6a5a', 160, 110], ['020:0.52', 'say', 'hero', 'No.'], ['020:0.7', 'glitch']],
	}),
	S('021', {
		bg: 'street', mood: 'excited',
		cast: [H(1000, [['021', 'g', 'presentF', 60], ['021:0.5', 'g', 'point', 60], ['021:0.3', 'face', -1]]), A('kidA', 'kidA', 400, [['021', 'e', 'sad', 120]], {face: 1})],
		fx: [['021:0.08', 'bulb', 'hero'], ['021:0.4', 'stat', 'THE UNIVERSE PAYS YOU TO DISAPPOINT A REAL PERSON', undefined, 120, '#ffd84a', 200, 60], ['021:0.8', 'sparkle', 'hero']],
	}),
	S('022', {
		bg: 'cafe', mood: 'calm',
		cast: [H(1000, [['022', 'face', -1], ['022:0.7', 'hold', 'salt', 90], ['022:0.75', 'g', 'presentF', 60]]), A('theo', 'theo', 480, [['022:0.2', 'g', 'point', 50], ['022:0.8', 'hold', 'salt', 60], ['022:0.8', 'e', 'happy', 80]], {face: 1})],
		fx: [['022:0.05', 'tag', 'theo', 'LUNCH', 90], ['022:0.35', 'say', 'theo', 'Pass the salt?', 90]],
	}, true),
	S('023', {
		bg: 'cafe', mood: 'tense',
		cast: [H(1000, [['023', 'face', -1], ['023', 'hold', 'salt', 50], ['023', 'say', 'hero', 'Sure!'], ['023:0.3', 'e', 'wide', 100], ['023:0.45', 'g', 'facepalm', 60]]), A('theo', 'theo', 480, [['023:0.2', 'hold', 'salt', 60]], {face: 1})],
		fx: [['023:0.35', 'shake'], ['023:0.4', '!', 'hero'], ['023:0.4', 'wave', 'hero']],
	}),
	S('024', {
		bg: 'cafe', mood: 'tense',
		cast: [H(900, [['024', 'g', 'presentF', 60], ['024:0.5', 'g', 'point', 60]])],
		fx: [['024:0.05', 'stat', 'EVERY NO PAYS YOU', undefined, 55, '#7dff9a', 140, 110], ['024:0.5', 'stat', 'EVERY YES COSTS YOU', undefined, 70, '#ff6a5a', 140, 110]],
	}),
	S('025', {
		bg: 'corridor', mood: 'excited',
		cast: [H(300, [['025', 'walk', 960, 9], ['025:0.55', 'g', 'fist', 40]]), A('kidA', 'kidA', 2150, [['025', 'walk', 1500, 7]], {face: -1}), A('theo', 'theo', 1400, [['025:0.4', 'g', 'wave', 60]], {face: -1})],
		fx: [['025:0.5', 'confetti'], ['025:0.1', 'stat', 'WHAT IF?', '$1,000 PER NO', 100, '#ffd84a', 130, 130]],
	}, true),
	S('026', {
		bg: 'class', mood: 'calm',
		cast: [A('teacher', 'teacher', 1500, [['026:0.4', 'g', 'presentF', 60], ['026:0.4', 'face', -1]], {face: -1}), A('theo', 'theo', 520, [['026:0.5', 'g', 'shrug', 60]]), A('kidA', 'kidA', 760, [['026:0.6', 'look', [0, 1], 60]]), H(1000, [['026', 'face', -1], ['026:0.65', 'g', 'presentF', 40]], {badge: true})],
		fx: [['026', 'tag', 'teacher', 'ANY VOLUNTEERS?', 100], ['026:0.7', 'say', 'teacher', 'Hello…?']],
	}, true),
	S('027', {
		bg: 'class', mood: 'excited',
		cast: [A('teacher', 'teacher', 1500, [['027:0.3', 'hold', 'eraser', 60]], {face: -1}), H(900, [['027', 'g', 'wave', 40], ['027', 'say', "hero", "I'll do it!"], ['027:0.4', 'walk', 1250, 6], ['027:0.4', 'hold', 'eraser', 60], ['027:0.7', 'e', 'worried', 80], ['027:0.7', 'g', 'facepalm', 80]])],
		fx: [['027:0.3', 'bang', 'hero', 900, 300, '-$1,000!', '#ff6a5a', 0.7], ['027:0.75', 'say', 'hero', 'Never again.', 90]],
	}),
	S('028', {
		bg: 'cafe', mood: 'excited',
		cast: [H(900, [['028:0.3', 'g', 'stop', 40], ['028:0.3', 'say', 'hero', 'No fries.'], ['028:0.6', 'g', 'fist', 40]]), A('lunch', 'lunch', 1500, [['028', 'hold', 'cookie', 130], ['028:0.35', 'e', 'wide', 90], ['028:0.35', 'g', 'shrug', 60]], {face: -1})],
		fx: [['028:0.05', 'stat', 'SO YOU LEARN THE GAME', undefined, 80, '#ffd84a', 150, 90], ['028:0.6', 'sparkle', 'hero']],
	}),
	S('029', {
		bg: 'corridor', mood: 'excited',
		cast: [H(900, [['029:0.2', 'g', 'stop', 40], ['029:0.2', 'say', 'hero', 'Nope!']]), A('seller', 'seller', -250, [['029', 'walk', 1400, 14], ['029', 'hold', 'book', 100], ['029:0.5', 'e', 'sad', 80]], {face: -1})],
		fx: [['029:0.3', 'hop', 'hero'], ['029:0.5', 'say', 'seller', 'Magazines?', 70]],
	}),
	S('030', {
		bg: 'school', mood: 'excited',
		cast: [H(850, [['030:0.25', 'g', 'stop', 40], ['030:0.25', 'say', 'hero', 'No.'], ['030:0.6', 'walk', 600, 6]]), A('kidA', 'kidA', 1500, [['030', 'hold', 'clip', 100], ['030:0.2', 'e', 'wide', 80], ['030:0.3', 'g', 'presentF', 60]], {face: -1})],
		fx: [['030:0.05', 'tag', 'kidA', 'FOUNTAIN PETITION', 80], ['030:0.6', 'sparkle', 'hero']],
	}),
	S('031', {
		bg: 'bedroom', mood: 'excited',
		cast: [H(1000, [['031', 'g', 'fist', 40], ['031:0.4', 'hop', 14, 30], ['031:0.7', 'g', 'presentF', 60], ['031:0.4', 'e', 'happy', 120]])],
		props: (c) => <Item kind="cash" x={760} y={760} s={1.6} />,
		fx: [['031:0.05', 'confetti'], ['031:0.1', 'stat', '$41,000', 'BY FRIDAY', 120, '#7dff9a', 170, 130], ['031:0.6', 'say', 'hero', 'All by being annoying.', 100]],
	}),
	S('032', {
		bg: 'street', mood: 'excited',
		cast: [H(800, [['032', 'walk', 960, 3], ['032:0.3', 'g', 'presentF', 60]]), A('woman', 'woman', -250, [['032', 'walk', 340, 10]], {}), A('man', 'man', 2200, [['032:0.2', 'walk', 1500, 10], ['032:0.6', 'g', 'point', 50]], {face: -1}), A('kidA', 'kidA', 1700, [['032:0.4', 'g', 'wave', 60]], {face: -1, hidden: false})],
		fx: [['032:0.03', 'stat', '1 ASK / MINUTE', undefined, 90, '#ffd84a', 130, 120], ['032:0.35', 'stat', '× $1,000', undefined, 80, '#7dff9a', 130, 120], ['032:0.65', 'stat', '$60,000 / HOUR', undefined, 90, '#ff6a5a', 130, 140], ['032:0.66', 'shake']],
	}),
	S('033', {
		bg: 'cafe', mood: 'calm',
		cast: [H(900, [['033', 'g', 'point', 60], ['033:0.5', 'g', 'presentF', 60]])],
		fx: [['033:0.03', 'stat', 'AVERAGE U.S. WORKER', '$60,000 A YEAR', 140, '#9aa6ff', 120, 100], ['033:0.58', 'stat', 'YOU', '$60,000 AN HOUR', 90, '#7dff9a', 120, 110]],
	}),
	S('034', {
		bg: 'cafe', mood: 'excited',
		cast: [H(1000, [['034', 'hold', 'cookie', 80], ['034:0.25', 'hop', 14, 20], ['034:0.5', 'g', 'rubChin', 70]]), A('theo', 'theo', 450, [['034:0.2', 'g', 'point', 40], ['034:0.2', 'e', 'wide', 80]])],
		fx: [['034:0.2', 'say', 'theo', 'Before lunch is over?!', 90], ['034:0.65', 'bulb', 'hero'], ['034:0.7', 'say', 'hero', 'Time to get ambitious.', 90]],
	}),
	S('035', {
		bg: 'callcenter', mood: 'tense',
		cast: [H(300, [['035', 'walk', 900, 9], ['035:0.4', 'g', 'think', 60], ['035:0.6', 'g', 'presentF', 60]])],
		fx: [['035:0.04', 'tag', 'hero', 'ONE PROBLEM', 70], ['035:0.45', '?', 'hero'], ['035:0.55', 'say', 'hero', 'Who will ask me?', 80]],
	}, true),
	S('036', {
		bg: 'callcenter', mood: 'excited',
		cast: [H(900, [['036', 'g', 'presentF', 50], ['036:0.4', 'walk', 1200, 5], ['036:0.5', 'g', 'point', 60]]), A('gary', 'gary', 1650, [['036:0.5', 'g', 'wave', 70]], {face: -1}), A('woman', 'woman', 300, [['036:0.4', 'hold', 'phone', 90, '#7ac8ff']], {face: 1, still: false})],
		fx: [['036:0.05', 'stat', 'THE MOST PERSISTENT PEOPLE ON EARTH', undefined, 110, '#ffd84a', 130, 70], ['036:0.55', 'stat', 'REAL HUMANS · NOT ROBOCALLS', undefined, 75, '#7dff9a', 130, 70]],
	}),
	S('037', {
		bg: 'callcenter', mood: 'calm',
		cast: [H(1000, [PH('037:0.15', 180, '#7ac8ff'), ['037:0.5', 'e', 'sleepy', 80], ['037:0.8', 'e', 'wide', 60]])],
		fx: [['037:0.02', 'stat', 'BILLIONS OF ROBOCALLS A MONTH', undefined, 100, '#ff6a5a', 130, 80], ['037:0.5', 'say', 'hero', '♪ on hold… ♪', 100], ['037:0.85', '!', 'hero']],
	}),
	S('038', {
		bg: 'callcenter', mood: 'excited',
		cast: [H(750, [PH('038', 90, '#7ac8ff'), ['038:0.5', 'g', 'point', 50]]), A('gary', 'gary', 1450, [['038:0.45', 'g', 'presentF', 60], ['038:0.45', 'say', 'gary', 'Hello?', 80]], {face: -1})],
		fx: [['038:0.55', 'tag', 'gary', 'GARY', 100], ['038:0.55', 'sparkle', 'gary']],
	}),
	S('039', {
		bg: 'callcenter', mood: 'excited',
		cast: [H(750, [['039:0.55', 'g', 'stop', 40], ['039:0.55', 'say', 'hero', 'No.']]), A('gary', 'gary', 1450, [['039', 'g', 'presentF', 100], ['039:0.65', 'g', 'point', 50]], {face: -1})],
		fx: [['039:0.1', 'say', 'gary', "Your car's extended warranty!", 120], ['039:0.75', 'say', 'gary', "It's a very good deal.", 90]],
	}),
	S('040', {
		bg: 'callcenter', mood: 'tense',
		cast: [H(750, [['040:0.15', 'g', 'stop', 40], ['040:0.15', 'say', 'hero', 'No.'], ['040:0.5', 'g', 'stop', 40], ['040:0.5', 'say', 'hero', 'No.']]), A('gary', 'gary', 1450, [['040', 'g', 'presentF', 60], ['040:0.6', 'g', 'handsOnHead', 90], ['040:0.6', 'e', 'worried', 100]], {face: -1})],
		fx: [['040:0.7', 'say', 'gary', 'I have a family!', 90]],
	}),
	S('041', {
		bg: 'callcenter', mood: 'sad',
		cast: [H(750, [['041:0.1', 'g', 'stop', 40], ['041:0.1', 'say', 'hero', 'No.'], ['041:0.6', 'g', 'facepalm', 90], ['041:0.6', 'e', 'worried', 90]]), A('gary', 'gary', 1450, [['041', 'e', 'worried', 120], ['041:0.15', 'g', 'shrug', 60]], {face: -1})],
		fx: [['041:0.3', 'say', 'gary', 'Gary has a family.', 90], ['041:0.62', 'say', 'hero', 'I am not proud of this.', 90]],
	}),
	S('042', {
		bg: 'mall', mood: 'excited',
		cast: [H(800, [['042', 'walk', 1000, 3], ['042:0.4', 'g', 'presentF', 60]]), A('hired', 'hired', 250, [['042', 'walk', 620, 6], ['042:0.4', 'hold', 'cookie', 120], ['042:0.5', 'g', 'presentF', 50]])],
		fx: [['042:0.03', 'tag', 'hero', 'THE MALL', 70], ['042:0.55', 'say', 'hired', 'Want a cookie?', 80], ['042:0.7', 'say', 'hero', 'No.']],
	}, true),
	S('043', {
		bg: 'mall', mood: 'excited',
		cast: [H(1000, [['043:0.5', 'g', 'fist', 40], ['043:0.7', 'hop', 14, 30]]), A('hired', 'hired', 600, [['043', 'hold', 'cookie', 80], ['043:0.5', 'e', 'wide', 90]])],
		fx: [['043:0.05', 'stat', 'HE EARNS $20 / HOUR', undefined, 70, '#9aa6ff', 130, 90], ['043:0.55', 'stat', 'YOU EARN $180,000 / HOUR', undefined, 80, '#7dff9a', 130, 80], ['043:0.55', 'confetti']],
	}),
	S('044', {
		bg: 'mall', mood: 'calm',
		cast: [H(1000, [['044:0.5', 'g', 'stop', 40], ['044:0.5', 'say', 'hero', 'No.'], ['044:0.1', 'g', 'think', 60]]), A('hired', 'hired', 600, [['044', 'hold', 'cookie', 80], ['044:0.35', 'g', 'point', 60], ['044:0.35', 'e', 'worried', 90]])],
		fx: [['044:0.3', 'say', 'hired', 'Want to switch?', 90], ['044:0.65', 'sparkle', 'hero']],
	}),
	S('045', {
		bg: 'kitchen', mood: 'excited',
		cast: [H(700, [['045', 'hold', 'letter', 120], ['045:0.5', 'g', 'presentF', 60], ['045:0.55', 'walk', 900, 4]]), A('mom', 'mom', 1400, [['045:0.55', 'hold', 'letter', 80], ['045:0.55', 'e', 'wide', 100]], {face: -1})],
		fx: [['045:0.03', 'stat', '$22,000,000', 'AFTER ONE MONTH', 120, '#7dff9a', 130, 130], ['045:0.45', 'confetti'], ['045:0.7', 'say', 'hero', "Mom, I paid off the loan.", 90]],
	}, true),
	S('046', {
		bg: 'kitchen', mood: 'sad',
		cast: [A('mom', 'mom', 1000, [['046', 'hold', 'letter', 120], ['046:0.35', 'e', 'sad', 120], ['046:0.5', 'g', 'facepalm', 140], ['046:0.65', 'squash', 1]], {face: -1}), H(500, [['046:0.5', 'g', 'presentF', 60], ['046:0.5', 'e', 'worried', 100]], {face: 1})],
		fx: [['046:0.3', 'say', 'mom', 'Read it again…', 80], ['046:0.55', 'sparkle', 'mom']],
	}),
	S('047', {
		bg: 'street', mood: 'sad',
		cast: [A('theo', 'theo', 700, [['047:0.4', 'g', 'wave', 60]]), A('reyes', 'reyes', 1450, [['047', 'g', 'point', 80], ['047:0.55', 'g', 'facepalm', 100], ['047:0.55', 'face', 1]], {face: -1}), H(1000, [['047', 'face', -1], ['047:0.3', 'g', 'presentF', 60]])],
		world: (c) => <House x={1500} roof="#e0503a" s={1.2} />,
		fx: [['047:0.05', 'tag', 'hero', 'A NEW ROOF FOR THEO', 90], ['047:0.5', 'sparkle', 'reyes'], ['047:0.6', 'say', 'reyes', "Dust. It's just dust.", 90]],
	}),
	S('048', {
		bg: 'street', mood: 'calm', zoom: 1.4,
		cast: [A('reyes', 'reyes', 900, [['048', 'g', 'wave', 80], ['048:0.5', 'e', 'happy', 80], ['048:0.5', 'g', 'presentF', 60]], {badge: false}), H(1400, [['048', 'face', -1]])],
		fx: [['048:0.1', 'tag', 'reyes', 'MR. REYES · THEO\'S DAD', 120], ['048:0.5', 'stat', 'REMEMBER HIM', undefined, 80, '#ffd84a', 140, 90], ['048:0.55', 'bulb', 'reyes']],
	}),
	S('049', {
		bg: 'street', mood: 'calm',
		cast: [H(1000, [['049', 'g', 'presentF', 60], ['049:0.5', 'g', 'point', 60]]), A('theo', 'theo', 500, [['049:0.5', 'g', 'shrug', 60]]), A('woman', 'woman', 1500, [['049:0.3', 'e', 'worried', 100]], {face: -1})],
		fx: [['049:0.03', 'stat', '1 IN 3 AMERICANS', "CAN'T COVER A SURPRISE $1,000", 170, '#ff6a5a', 120, 110]],
	}),
	S('050', {
		bg: 'street', mood: 'excited',
		cast: [H(1000, [['050:0.1', 'g', 'stop', 40], ['050:0.1', 'say', 'hero', 'No.'], PH('050:0.5', 130, '#ffd84a'), ['050:0.55', 'e', 'wide', 100]]), A('woman', 'woman', 500, [['050:0.1', 'g', 'presentF', 50]])],
		fx: [['050:0.15', 'stat', 'ONE NO PAYS THAT BILL', undefined, 80, '#7dff9a', 130, 90], ['050:0.55', 'stat', 'NEW EMAIL · IRS', 'a very polite one', 100, '#ffd84a', 130, 120], ['050:0.6', '!', 'hero']],
	}),
	S('051', {
		bg: 'street', mood: 'calm',
		cast: [H(950, [['051', 'g', 'rubChin', 70], ['051:0.5', 'g', 'presentF', 70], ['051:0.5', 'e', 'happy', 100]])],
		fx: [['051:0.03', 'stat', 'MONEY FROM NO = STILL INCOME', undefined, 90, '#ffd84a', 140, 90], ['051:0.6', 'say', 'hero', 'Greatest loophole in history.', 100], ['051:0.62', 'sparkle', 'hero']],
	}),
	S('052', {
		bg: 'night', mood: 'sad', night: true,
		cast: [H(1000, [['052:0.3', 'e', 'worried', 120], ['052:0.35', 'g', 'think', 80]]), A('theo', 'theo', 400, [['052:0.5', 'walk', -300, 4], ['052:0.5', 'face', -1]]), A('mom', 'mom', 1600, [['052:0.55', 'walk', 2300, 4], ['052:0.55', 'face', 1]], {face: -1})],
		fx: [['052:0.02', 'stat', 'THEN THE QUIET STARTS', undefined, 100, '#9aa6ff', 140, 100], ['052:0.55', 'say', 'hero', 'Wait…?', 80]],
	}, true),
	S('053', {
		bg: 'night', mood: 'sad', night: true, zoom: 1.2,
		cast: [H(1000, [['053:0.5', 'g', 'shrug', 70], ['053:0.5', 'e', 'sad', 100]])],
		fx: [['053:0.04', 'stat', 'PEOPLE STOP ASKING', undefined, 100, '#ff6a5a', 140, 100], ['053:0.5', 'say', 'hero', 'It starts small.', 90]],
	}),
	S('054', {
		bg: 'lake', mood: 'calm',
		cast: [A('theo', 'theo', 520, [['054', 'g', 'point', 60], ['054:0.2', 'say', 'theo', 'Lake today?', 90]]), H(1200, [['054', 'face', -1], ['054:0.5', 'g', 'stop', 40], ['054:0.5', 'say', 'hero', 'No.']])],
		fx: [['054:0.65', 'stat', 'SATURDAY', undefined, 50, '#9aa6ff', 140, 90]],
	}, true),
	S('055', {
		bg: 'lake', mood: 'sad',
		cast: [A('theo', 'theo', 520, [['055', 'e', 'worried', 120], ['055:0.5', 'g', 'point', 60], ['055:0.5', 'e', 'sad', 100]]), H(1200, [['055', 'face', -1], ['055:0.3', 'g', 'stop', 40], ['055:0.3', 'say', 'hero', 'No.'], ['055:0.8', 'g', 'stop', 40]])],
		fx: [['055:0.02', 'stat', 'SUNDAY', undefined, 50, '#9aa6ff', 140, 90], ['055:0.35', 'stat', 'MONDAY', undefined, 60, '#ff6a5a', 140, 90]],
	}),
	S('056', {
		bg: 'lake', mood: 'sad', zoom: 1.2,
		cast: [A('theo', 'theo', 520, [['056:0.25', 'walk', -300, 3], ['056:0.25', 'face', -1], ['056:0.25', 'e', 'sad', 100]]), H(1200, [['056', 'face', -1], ['056:0.05', 'g', 'stop', 40], ['056:0.05', 'say', 'hero', 'No.'], ['056:0.6', 'e', 'worried', 100], ['056:0.6', 'g', 'think', 100]])],
		fx: [['056:0.35', 'say', 'hero', 'He did not ask.', 100]],
	}),
	S('057', {
		bg: 'kitchen', mood: 'sad',
		cast: [A('mom', 'mom', 600, [['057:0.1', 'g', 'presentF', 80], ['057:0.1', 'say', 'mom', 'Dinner on Sunday?', 100]]), H(1250, [['057', 'face', -1], ['057:0.7', 'g', 'shrug', 60]])],
		fx: [['057:0.02', 'tag', 'mom', 'EVERY SUNDAY FOR 16 YEARS', 130], ['057:0.8', 'say', 'hero', 'No.']],
	}, true),
	S('058', {
		bg: 'kitchen', mood: 'sad', zoom: 1.3,
		cast: [A('mom', 'mom', 600, [['058:0.4', 'e', 'sad', 140], ['058:0.55', 'g', 'touchFace', 80]]), H(1250, [['058', 'face', -1], ['058:0.05', 'g', 'stop', 40], ['058:0.05', 'say', 'hero', 'No.'], ['058:0.5', 'e', 'worried', 100]])],
		fx: [['058:0.4', 'say', 'mom', 'Okay.', 80]],
	}),
	S('059', {
		bg: 'kitchen', mood: 'sad',
		cast: [A('mom', 'mom', 600, [['059:0.1', 'e', 'sad', 100], ['059:0.4', 'walk', -300, 3], ['059:0.4', 'face', -1]]), H(1250, [['059', 'face', -1], ['059:0.5', 'g', 'rubChin', 90], ['059:0.5', 'e', 'sad', 100]])],
		fx: [['059:0.02', 'say', 'mom', 'Not angry. Just… okay.', 100], ['059:0.6', 'stat', 'SHE DOES NOT ASK AGAIN', undefined, 90, '#ff6a5a', 140, 90]],
	}),
	S('060', {
		bg: 'class', mood: 'calm',
		cast: [A('woman', 'woman', 1350, [['060', 'g', 'presentF', 100], ['060:0.5', 'g', 'point', 80]], {face: -1}), H(700, [['060:0.3', 'g', 'think', 90]])],
		fx: [['060:0.03', 'tag', 'woman', 'PSYCHOLOGIST VANESSA BOHN', 140], ['060:0.4', 'stat', 'THE ASKING PERSON UNDERESTIMATES', 'how hard it is to say no', 120, '#ffd84a', 130, 90]],
	}, true),
	S('061', {
		bg: 'class', mood: 'calm',
		cast: [A('woman', 'woman', 1350, [['061', 'g', 'presentF', 100], ['061:0.5', 'g', 'fist', 80]], {face: -1}), H(700, [['061:0.5', 'g', 'rubChin', 90]])],
		fx: [['061:0.2', 'stat', 'ALMOST ALWAYS', undefined, 80, '#ff6a5a', 140, 110]],
	}),
	S('062', {
		bg: 'night', mood: 'sad', night: true, zoom: 1.3,
		cast: [H(1000, [['062', 'g', 'touchFace', 90], ['062:0.5', 'e', 'worried', 100], ['062:0.55', 'g', 'shrug', 80]])],
		fx: [['062:0.05', 'stat', 'SAYING NO IS HEAVY', 'it costs something', 100, '#9aa6ff', 130, 110], ['062:0.62', 'stat', 'YOU MADE IT FREE', undefined, 80, '#ffd84a', 150, 100]],
	}),
	S('063', {
		bg: 'night', mood: 'sad', night: true,
		cast: [H(1100, [['063', 'face', -1], ['063:0.4', 'g', 'presentF', 70]]), A('theo', 'theo', 500, [['063:0.1', 'e', 'sad', 100]]), A('mom', 'mom', 760, [['063:0.2', 'e', 'sad', 100]]), A('zoe', 'zoe', 280, [['063:0.3', 'e', 'sad', 100]], {size: 'kid'})],
		fx: [['063:0.05', 'stat', 'THE COST LANDS ON EVERYONE WHO ASKS', undefined, 130, '#ff6a5a', 160, 70]],
	}),
	S('064', {
		bg: 'street', mood: 'sad',
		cast: [H(1050, [['064:0.5', 'g', 'shrug', 70], ['064:0.5', 'e', 'worried', 100]]), A('kidA', 'kidA', 600, [['064', 'g', 'presentF', 60]])],
		fx: [['064:0.05', 'stat', 'THE HABIT TAKES OVER', undefined, 90, '#ff6a5a', 140, 100]],
	}),
	S('065', {
		bg: 'street', mood: 'tense',
		cast: [H(1050, [['065', 'face', -1], ['065:0.55', 'g', 'stop', 40], ['065:0.55', 'say', 'hero', 'No.'], ['065:0.7', 'e', 'wide', 90]]), A('kidA', 'kidA', 560, [['065:0.05', 'g', 'presentF', 60], ['065:0.05', 'say', 'kidA', 'Want a ride home?', 80]])],
		fx: [['065:0.75', '?', 'hero']],
	}),
	S('066', {
		bg: 'cafe', mood: 'sad',
		cast: [H(1000, [['066', 'face', -1], ['066:0.3', 'g', 'stop', 40], ['066:0.3', 'say', 'hero', 'No.'], ['066:0.7', 'g', 'touchFace', 120], ['066:0.7', 'e', 'sad', 120]]), A('kidA', 'kidA', 450, [['066:0.05', 'say', 'kidA', 'Sit with us?', 70], ['066:0.55', 'e', 'worried', 100]]), A('theo', 'theo', 680, [['066:0.5', 'say', 'theo', 'Are you okay?', 70], ['066:0.5', 'g', 'presentF', 60]])],
		fx: [['066:0.72', 'say', 'hero', 'No.', 90], ['066:0.8', 'stat', 'FIRST NO YOU MEAN', undefined, 100, '#ffd84a', 140, 90]],
	}),
	S('067', {
		bg: 'bedroomNight', mood: 'calm',
		cast: [H(1100, [['067', 'face', -1], ['067:0.7', 'g', 'presentF', 60]]), A('zoe', 'zoe', -250, [['067:0.2', 'walk', 500, 7], ['067:0.2', 'hold', 'book', 300], ['067:0.55', 'g', 'presentF', 60]], {size: 'kid'})],
		fx: [['067:0.5', 'bang', 'hero', 300, 480, 'KNOCK KNOCK', '#ffb02e', 0.5], ['067:0.7', 'tag', 'zoe', 'THE SAME BOOK', 90]],
	}, true),
	S('068', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1100, [['068', 'face', -1], ['068:0.35', 'g', 'presentF', 60], ['068:0.35', 'say', 'hero', 'Sure, come in.', 80]]), A('zoe', 'zoe', 500, [['068', 'hold', 'book', 280], ['068:0.35', 'e', 'happy', 100], ['068:0.4', 'walk', 760, 4]], {size: 'kid'})],
		fx: [['068:0.6', 'stat', 'A FREE YES', undefined, 60, '#7dff9a', 150, 110]],
	}),
	S('069', {
		bg: 'bedroomNight', mood: 'tense',
		cast: [H(1100, [['069', 'face', -1], ['069:0.5', 'g', 'rubChin', 80], ['069:0.5', 'e', 'worried', 90]]), A('zoe', 'zoe', 760, [['069', 'hold', 'book', 120]], {size: 'kid'})],
		fx: [['069:0.02', 'stat', 'NOW IT IS A $1,000 YES', undefined, 100, '#ff6a5a', 140, 100], ['069:0.7', 'say', 'hero', "You've been counting.", 90]],
	}),
	S('070', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1100, [['070', 'face', -1], ['070:0.3', 'g', 'stop', 40], ['070:0.3', 'say', 'hero', 'Not tonight.'], ['070:0.55', 'e', 'worried', 100]]), A('zoe', 'zoe', 520, [['070', 'hold', 'book', 200], ['070:0.1', 'g', 'presentF', 60], ['070:0.45', 'e', 'sad', 100]], {size: 'kid'})],
		fx: [['070:0.02', 'tag', 'zoe', 'LAST THURSDAY', 80]],
	}),
	S('071', {
		bg: 'bedroomNight', mood: 'sad', zoom: 1.2,
		cast: [H(1100, [['071', 'face', -1], ['071:0.5', 'g', 'touchFace', 120], ['071:0.5', 'e', 'sad', 100]]), A('zoe', 'zoe', 760, [['071', 'hold', 'book', 300], ['071:0.1', 'e', 'sad', 90], ['071:0.2', 'walk', -300, 2.5], ['071:0.2', 'face', -1]], {size: 'kid'})],
		fx: [['071:0.15', 'say', 'zoe', 'Okay.', 70], ['071:0.5', 'say', 'hero', "Her footsteps get smaller…", 110]],
	}),
	S('072', {
		bg: 'bedroomNight', mood: 'sad', zoom: 1.15,
		cast: [H(1100, [['072', 'face', -1], ['072:0.2', 'g', 'think', 100], ['072:0.2', 'e', 'sad', 120]])],
		fx: [['072:0.05', 'tag', 'hero', 'THE NEXT NIGHT: NO KNOCK', 100], ['072:0.55', 'stat', '$28,000,000', undefined, 100, '#ffd84a', 150, 140]],
	}),
	S('073', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1000, [['073', 'g', 'touchFace', 120], ['073:0.35', 'e', 'sad', 150]])],
		fx: [['073:0.03', 'stat', 'RICH. AND ALONE.', undefined, 100, '#ff6a5a', 130, 120], ['073:0.6', 'stat', '1978 STUDY', 'LOTTERY WINNERS', 130, '#9aa6ff', 130, 110]],
	}),
	S('074', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1000, [['074', 'g', 'rubChin', 100], ['074:0.5', 'g', 'shrug', 70]])],
		fx: [['074:0.03', 'stat', 'NOT HAPPIER', 'than people who did not win', 130, '#ffd84a', 140, 110]],
	}),
	S('075', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1000, [['075', 'g', 'presentF', 80], ['075:0.5', 'g', 'touchFace', 90], ['075:0.55', 'e', 'sad', 120]])],
		fx: [['075:0.03', 'stat', 'MONEY FIXES PROBLEMS', undefined, 90, '#7dff9a', 140, 100], ['075:0.5', 'stat', 'NOT BEING LOVED', undefined, 100, '#ff6a5a', 140, 100]],
	}),
	S('076', {
		bg: 'bedroomNight', mood: 'tense', zoom: 1.1,
		cast: [H(1000, [['076', 'g', 'think', 120]])],
		fx: [['076:0.05', 'stat', 'WEAK SOCIAL TIES', undefined, 90, '#9aa6ff', 130, 100], ['076:0.5', 'stat', '+26% RISK', 'of dying early', 100, '#ff6a5a', 130, 140]],
	}),
	S('077', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1000, [['077:0.5', 'g', 'point', 70], ['077:0.5', 'e', 'worried', 100]])],
		fx: [['077:0.05', 'glitch'], ['077:0.45', 'stat', "THAT'S NOT A FEELING.", "THAT'S A NUMBER.", 110, '#ff6a5a', 130, 110]],
	}),
	S('078', {
		bg: 'boardroom', mood: 'calm',
		cast: [H(1000, [['078', 'g', 'rubChin', 80], ['078:0.5', 'g', 'think', 70]])],
		fx: [['078:0.1', 'stat', 'WARREN BUFFETT', "is he on to something?", 100, '#ffd84a', 130, 100], ['078:0.7', '?', 'hero']],
	}, true),
	S('079', {
		bg: 'boardroom', mood: 'calm',
		cast: [H(1000, [['079', 'g', 'presentF', 80], ['079:0.5', 'g', 'point', 70]])],
		fx: [['079:0.05', 'stat', '"SAY NO TO ALMOST EVERYTHING"', undefined, 150, '#ffd84a', 130, 70]],
	}),
	S('080', {
		bg: 'bedroomNight', mood: 'sad',
		cast: [H(1250, [['080', 'face', -1], ['080:0.4', 'e', 'sad', 120], ['080:0.4', 'g', 'touchFace', 120]]), A('zoe', 'zoe', 600, [['080:0.45', 'hold', 'book', 200], ['080:0.45', 'e', 'sad', 100]], {size: 'kid', hidden: true})],
		fx: [['080:0.45', 'sparkle', 'zoe'], ['080:0.55', 'say', 'hero', 'But never to my little sister.', 110]],
	}, true),
	S('081', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(400, [['081', 'walk', 760, 7], ['081:0.4', 'e', 'wide', 90]]), A('aldridge', 'aldridge', 1500, [['081:0.2', 'g', 'presentF', 80]], {face: -1})],
		fx: [['081:0.03', 'stat', 'THEN THE OFFER COMES', undefined, 100, '#ffd84a', 140, 100], ['081:0.45', 'tag', 'aldridge', 'MR. ALDRIDGE · CHAIRMAN', 130], ['081:0.55', '!', 'hero']],
	}, true),
	S('082', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['082', 'face', 1], ['082:0.6', 'e', 'wide', 100]]), A('aldridge', 'aldridge', 1500, [['082', 'g', 'presentF', 100], ['082:0.4', 'hold', 'tablet', 100], ['082:0.7', 'walk', 1100, 3]], {face: -1})],
		fx: [['082:0.05', 'say', 'aldridge', 'Sit down, kid.', 80], ['082:0.75', 'sparkle', 'aldridge']],
	}),
	S('083', {
		bg: 'boardroom', mood: 'excited', zoom: 1.3,
		cast: [H(760, [['083', 'face', 1], ['083:0.3', 'e', 'wide', 120], ['083:0.3', 'g', 'handsOnHead', 100]]), A('aldridge', 'aldridge', 1150, [['083', 'hold', 'tablet', 120, '#3a6aff'], ['083:0.2', 'g', 'presentF', 60]], {face: -1})],
		fx: [['083:0.2', 'stat', '$1 BILLION', undefined, 100, '#7dff9a', 130, 190], ['083:0.25', 'shake'], ['083:0.3', 'confetti']],
	}),
	S('084', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['084:0.4', 'g', 'rubChin', 90]]), A('aldridge', 'aldridge', 1150, [['084', 'g', 'presentF', 100], ['084:0.6', 'g', 'point', 60]], {face: -1})],
		fx: [['084:0.1', 'stat', 'THE PERFECT REFUSAL', undefined, 90, '#ffd84a', 130, 90], ['084:0.65', 'stat', '24 HOURS · LIVE', undefined, 90, '#ff6a5a', 130, 110]],
	}),
	S('085', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['085', 'e', 'wide', 100], ['085:0.5', 'g', 'stop', 40], ['085:0.5', 'say', 'hero', 'No.']]), A('aldridge', 'aldridge', 1150, [['085', 'g', 'point', 80], ['085:0.4', 'g', 'presentF', 60]], {face: -1})],
		fx: [['085:0.1', 'stat', 'EVERYONE WHO ASKS', 'you say NO', 100, '#7dff9a', 130, 90]],
	}),
	S('086', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['086:0.5', 'e', 'wide', 120], ['086:0.6', 'g', 'handsOnHead', 100]]), A('aldridge', 'aldridge', 1150, [['086', 'g', 'fist', 60], ['086:0.5', 'g', 'presentF', 80]], {face: -1})],
		fx: [['086:0.05', 'stat', 'SAY YES ONCE', 'and the deal is OFF', 100, '#ff6a5a', 130, 100], ['086:0.55', 'stat', '40 MILLION SIGNED UP', undefined, 100, '#9aa6ff', 130, 90]],
	}),
	S('087', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['087', 'g', 'rubChin', 80], ['087:0.5', 'g', 'presentF', 60], ['087:0.85', 'say', 'hero', 'Yes!', 50]]), A('aldridge', 'aldridge', 1150, [['087', 'hold', 'tablet', 200, '#3a6aff']], {face: -1})],
		fx: [['087:0.05', 'stat', '$1 BILLION', 'for doing what you already do', 120, '#7dff9a', 130, 110]],
	}),
	S('088', {
		bg: 'boardroom', mood: 'tense', zoom: 1.2,
		cast: [H(760, [['088', 'e', 'wide', 100], ['088:0.3', 'g', 'facepalm', 80], ['088:0.3', 'squash', 1]]), A('aldridge', 'aldridge', 1150, [['088:0.3', 'e', 'wide', 100]], {face: -1})],
		fx: [['088:0.1', 'bang', 'hero', 760, 300, 'OOPS!', '#ff6a5a', 0.8], ['088:0.35', 'shake'], ['088:0.35', 'glitch']],
	}),
	S('089', {
		bg: 'boardroom', mood: 'tense',
		cast: [H(760, [['089:0.5', 'g', 'wave', 40], ['089:0.5', 'say', 'hero', "I meant… I'll do it!", 100]]), A('aldridge', 'aldridge', 1150, [['089', 'e', 'angry', 70], ['089:0.1', 'g', 'point', 60], ['089:0.1', 'say', 'aldridge', 'That was a yes.', 80]], {face: -1})],
		fx: [],
	}),
	S('090', {
		bg: 'boardroom', mood: 'excited',
		cast: [H(760, [['090', 'g', 'fist', 40], ['090', 'say', 'hero', 'I accept.', 70]]), A('aldridge', 'aldridge', 1150, [['090:0.3', 'hold', 'tablet', 140, '#7dff9a'], ['090:0.4', 'e', 'happy', 100]], {face: -1})],
		fx: [['090:0.35', 'flash', '#7dff9a'], ['090:0.4', 'stat', '24:00:00', 'THE CLOCK STARTS', 120, '#7dff9a', 130, 150], ['090:0.4', 'wave', 'hero']],
	}),
	S('091', {
		bg: 'studio', mood: 'excited',
		cast: [H(500, [['091', 'walk', 960, 7], ['091:0.5', 'g', 'presentF', 60]]), A('producer', 'producer', 1600, [['091:0.3', 'g', 'point', 60]], {face: -1})],
		fx: [['091:0.05', 'stat', 'LIVE · NOON', undefined, 60, '#ff3a4a', 130, 120], ['091:0.4', 'stat', '1 MILLION', 'viewers by one o’clock', 100, '#ffd84a', 130, 130], ['091:0.75', 'stat', '10 MILLION', 'by four', 80, '#7dff9a', 130, 130]],
	}, true),
	S('092', {
		bg: 'studio', mood: 'excited',
		cast: [H(960, [['092:0.1', 'g', 'presentF', 60], ['092:0.5', 'g', 'fist', 50]]), A('producer', 'producer', 1600, [['092:0.4', 'g', 'wave', 60]], {face: -1})],
		fx: [['092:0.05', 'stat', '38 MILLION', 'watching a 16-year-old say no', 140, '#ff6a5a', 130, 150], ['092:0.06', 'shake'], ['092:0.55', 'confetti']],
	}),
	S('093', {
		bg: 'studio', mood: 'excited',
		cast: [H(1100, [['093', 'face', -1], ['093:0.5', 'g', 'stop', 40], ['093:0.5', 'say', 'hero', 'No.']]), A('woman', 'woman', 450, [['093:0.4', 'g', 'presentF', 80], ['093:0.4', 'say', 'woman', 'Hold my baby?', 90]])],
		fx: [['093:0.05', 'stat', 'THE CHAT SCROLLS TOO FAST', undefined, 100, '#7ac8ff', 130, 80]],
	}),
	S('094', {
		bg: 'studio', mood: 'excited',
		cast: [H(1100, [['094', 'face', -1], ['094:0.1', 'g', 'stop', 40], ['094:0.1', 'say', 'hero', 'No.'], ['094:0.8', 'g', 'stop', 40]]), A('man', 'man', 450, [['094', 'g', 'point', 80], ['094:0.1', 'say', 'man', 'Directions?', 70], ['094:0.4', 'walk', -300, 9]]), A('pizza', 'pizza', 2150, [['094:0.5', 'walk', 1550, 12], ['094:0.6', 'hold', 'pizza', 120]], {face: -1})],
		fx: [['094:0.6', '!', 'hero'], ['094:0.7', 'tag', 'pizza', 'DAY ONE', 80]],
	}),
	S('095', {
		bg: 'studio', mood: 'excited',
		cast: [H(1100, [['095', 'face', -1], ['095:0.4', 'g', 'stop', 40], ['095:0.4', 'say', 'hero', 'No.'], ['095:0.6', 'hop', 14, 30]]), A('pizza', 'pizza', 600, [['095', 'hold', 'pizza', 100], ['095:0.1', 'say', 'pizza', 'Free slice?', 80]])],
		fx: [['095:0.6', 'confetti'], ['095:0.6', 'bang', 'hero', 960, 340, 'WILD!', '#ffd84a', 0.8]],
	}),
	S('096', {
		bg: 'studio', mood: 'excited',
		cast: [H(960, [['096', 'g', 'presentF', 60], ['096:0.5', 'g', 'fist', 60]])],
		fx: [['096:0.1', 'stat', '+$1,000   +$1,000', undefined, 90, '#7dff9a', 130, 120], ['096:0.5', 'stat', 'BALANCE CLIMBS', undefined, 60, '#ffd84a', 130, 100]],
	}),
	S('097', {
		bg: 'studio', mood: 'tense',
		cast: [H(960, [['097', 'e', 'sleepy', 120], ['097:0.4', 'g', 'rubChin', 70], ['097:0.6', 'e', 'normal', 60]])],
		fx: [['097:0.15', 'stat', 'HOUR 20', '$61,000,000', 140, '#7dff9a', 120, 150], ['097:0.7', 'stat', '+ $1 BILLION WAITING', undefined, 100, '#ffd84a', 120, 90]],
	}),
	S('098', {
		bg: 'studio', mood: 'tense',
		cast: [H(960, [['098:0.45', 'g', 'presentF', 40], PH('098:0.5', 200, '#7ac8ff'), ['098:0.55', 'e', 'wide', 120], ['098:0.6', 'hop', 14, 22]])],
		fx: [['098:0.05', 'stat', 'EVERY ROOF IN THE TOWN', undefined, 90, '#7dff9a', 130, 90], ['098:0.45', 'bang', 'hero', 960, 300, 'RING!', '#7ac8ff', 0.8], ['098:0.6', 'say', 'hero', "It's Theo.", 90]],
	}),
	S('099', {
		bg: 'studio', mood: 'sad', zoom: 1.4,
		cast: [H(960, [PH('099', 200, '#7ac8ff'), ['099:0.5', 'e', 'worried', 120]])],
		fx: [['099:0.1', 'tag', 'hero', 'TWO WEEKS OF SILENCE', 110], ['099:0.65', 'say', 'hero', 'Hello?', 80]],
	}),
	S('100', {
		bg: 'hospital', mood: 'sad',
		cast: [A('theo', 'theo', 1100, [['100', 'hold', 'phone', 200, '#7ac8ff'], ['100', 'e', 'worried', 200]], {face: -1, badge: false}), A('doctor', 'nurse', 1500, [['100:0.5', 'g', 'presentF', 80]], {face: -1}), A('reyes', 'reyes', 760, [['100', 'sit', 640], ['100:0.5', 'e', 'sleepy', 120]], {face: 1})],
		fx: [['100:0.05', 'tag', 'theo', "ST. MARY'S HOSPITAL", 100], ['100:0.3', 'shake'], ['100:0.35', 'say', 'theo', 'Dad had a heart attack.', 110]],
	}, true),
	S('101', {
		bg: 'hospital', mood: 'sad',
		cast: [A('theo', 'theo', 1100, [['101', 'hold', 'phone', 200, '#7ac8ff'], ['101:0.4', 'e', 'worried', 150]], {face: -1}), A('reyes', 'reyes', 760, [['101', 'sit', 640], ['101:0.3', 'g', 'point', 70], ['101:0.3', 'e', 'happy', 120]], {face: 1})],
		fx: [['101:0.3', 'say', 'reyes', 'Where is the kid?', 100], ['101:0.7', 'say', 'theo', 'He only laughs with you.', 100]],
	}),
	S('102', {
		bg: 'studio', mood: 'sad', zoom: 1.5,
		cast: [H(960, [PH('102', 200, '#7ac8ff'), ['102:0.4', 'e', 'worried', 150], ['102:0.6', 'g', 'touchFace', 90]])],
		fx: [['102:0.15', 'say', 'hero', 'Theo…?', 80], ['102:0.55', 'say', 'theo', 'Please, Pen. Will you come?', 110]],
	}),
	S('103', {
		bg: 'studio', mood: 'sad',
		cast: [H(960, [PH('103', 120, '#7ac8ff'), ['103:0.6', 'e', 'sad', 100], ['103:0.6', 'g', 'touchFace', 120]])],
		fx: [['103:0.05', 'stat', '40 MINUTES AWAY', undefined, 90, '#ff6a5a', 130, 100], ['103:0.55', 'say', 'theo', "I'll understand if you can't.", 110]],
	}),
	S('104', {
		bg: 'studio', mood: 'tense',
		cast: [H(900, [['104', 'face', 1], ['104:0.3', 'g', 'rubChin', 80], ['104:0.3', 'look', [1, 0], 40]]), A('producer', 'producer', 1500, [['104:0.1', 'g', 'point', 100]], {face: -1}), A('aldridge', 'aldridge', 1750, [['104:0.5', 'g', 'presentF', 60]], {face: -1})],
		fx: [['104:0.15', 'say', 'producer', '4 hours left!', 90], ['104:0.6', 'stat', '4:00:00', undefined, 90, '#ff6a5a', 130, 160]],
	}),
	S('105', {
		bg: 'studio', mood: 'tense',
		cast: [H(960, [['105', 'look', [-1, -0.4], 40], ['105:0.3', 'look', [1, 0], 40], ['105:0.5', 'look', [0, 0], 40], ['105:0.55', 'g', 'rubChin', 90], ['105:0.8', 'e', 'worried', 100]])],
		fx: [['105:0.05', 'stat', '$1 BILLION', undefined, 60, '#7dff9a', 130, 140], ['105:0.38', 'stat', 'THE CLOCK', undefined, 50, '#ff6a5a', 130, 140], ['105:0.65', 'stat', '38M EYES', undefined, 90, '#9aa6ff', 130, 140]],
	}),
	S('106', {
		bg: 'studio', mood: 'tense', zoom: 1.3,
		cast: [H(960, [['106', 'g', 'think', 100], ['106:0.6', 'e', 'worried', 100]])],
		fx: [['106:0.05', 'stat', 'IF YOU SAY YES…', undefined, 80, '#ffd84a', 150, 100], ['106:0.5', 'stat', 'A BILLION GONE FOR ONE WORD', undefined, 110, '#ff6a5a', 150, 70]],
	}),
	S('107', {
		bg: 'studio', mood: 'sad', zoom: 1.5,
		cast: [H(960, [['107', 'g', 'presentF', 60], ['107:0.5', 'g', 'touchFace', 100], ['107:0.5', 'e', 'sad', 120]])],
		fx: [['107:0.15', 'stat', 'YES', 'the word that used to be free', 130, '#7dff9a', 130, 190]],
	}),
	S('108', {
		bg: 'street', mood: 'sad',
		cast: [A('reyes', 'reyes', 1500, [['108:0.2', 'g', 'facepalm', 100]], {face: -1}), A('theo', 'theo', 1000, [['108:0.1', 'g', 'wave', 60]]), H(500, [['108:0.5', 'e', 'wide', 100]])],
		world: (c) => <House x={1600} roof="#e0503a" s={1.2} />,
		fx: [['108', 'tag', 'reyes', 'MR. REYES · THE ROOF', 120], ['108:0.2', 'say', 'reyes', "I'm not crying.", 100], ['108:0.6', 'bulb', 'hero']],
	}, true),
	S('109', {
		bg: 'kitchenNight', mood: 'sad',
		cast: [A('mom', 'mom', 1250, [['109:0.4', 'g', 'presentF', 100], ['109:0.4', 'face', -1], ['109:0.4', 'e', 'happy', 100]], {face: -1}), H(700, [['109', 'face', 1], ['109:0.6', 'e', 'wide', 100]])],
		fx: [['109:0.4', 'say', 'mom', 'Money comes and goes.', 100], ['109:0.75', 'say', 'mom', "People don't.", 80], ['109:0.8', 'sparkle', 'mom']],
	}, true),
	S('110', {
		bg: 'studio', mood: 'excited', zoom: 1.2,
		cast: [H(960, [['110', 'g', 'fist', 40], ['110', 'say', 'hero', 'Theo! Yes!'], ['110:0.5', 'hop', 14, 36], ['110:0.5', 'e', 'happy', 120]])],
		fx: [['110:0.45', 'flash', '#ff3a4a'], ['110:0.5', 'stat', 'DEAL TERMINATED', undefined, 130, '#ff3a4a', 130, 130], ['110:0.5', 'shake'], ['110:0.5', 'glitch']],
	}),
	S('111', {
		bg: 'studio', mood: 'sad',
		cast: [H(960, [['111:0.3', 'g', 'shrug', 70]]), A('producer', 'producer', 1600, [['111', 'e', 'wide', 140], ['111:0.4', 'g', 'handsOnHead', 100]], {face: -1}), A('aldridge', 'aldridge', 360, [['111:0.5', 'e', 'wide', 100]])],
		fx: [['111:0.1', 'stat', '40 MILLION PEOPLE TYPE', '…', 110, '#9aa6ff', 130, 100], ['111:0.6', '?', 'producer']],
	}),
	S('112', {
		bg: 'studio', mood: 'tense',
		cast: [H(700, [['112:0.4', 'e', 'worried', 100]]), A('aldridge', 'aldridge', 1300, [['112', 'sit', 700], ['112:0.1', 'stand'], ['112:0.1', 'g', 'fist', 60], ['112:0.55', 'g', 'rubChin', 90], ['112:0.55', 'e', 'normal', 100]], {face: -1})],
		fx: [['112:0.1', 'wave', 'aldridge'], ['112:0.15', 'say', 'aldridge', '…', 80]],
	}),
	S('113', {
		bg: 'studio', mood: 'excited',
		cast: [H(900, [['113', 'g', 'presentF', 40], ['113:0.3', 'hold', 'jacket', 60], ['113:0.65', 'run', 2250, 15]]), A('aldridge', 'aldridge', 1500, [['113:0.1', 'hold', 'tablet', 100]], {face: -1})],
		fx: [['113:0.1', 'say', 'aldridge', 'Then…it hits you.', 80], ['113:0.7', 'bang', 'hero', 960, 300, 'RUN!', '#ffd84a', 0.9]],
	}),
	S('114', {
		bg: 'road', mood: 'excited',
		cast: [H(400, [['114', 'run', 1500, 11]], {badge: true})],
		world: (c) => (
			<g>
				<Drone x={600} y={160} t={c.gf} />
				<Drone x={1300} y={110} t={c.gf + 5} />
				<Drone x={1700} y={200} t={c.gf + 9} />
			</g>
		),
		fx: [['114:0.1', 'stat', 'THE STREAM FOLLOWS', undefined, 100, '#ff3a4a', 130, 100], ['114:0.6', 'stat', '100 CARS · 1,000 DRONES', undefined, 100, '#ffd84a', 130, 80]],
	}, true),
	S('115', {
		bg: 'road', mood: 'excited',
		cast: [H(300, [['115', 'run', 2250, 14]])],
		world: (c) => (
			<g>
				<Drone x={1000} y={170} t={c.gf} />
				<Drone x={1500} y={120} t={c.gf + 4} />
			</g>
		),
		fx: [['115:0.4', 'say', 'hero', 'Shoelaces untied!', 90], ['115:0.5', 'bang', 'hero', 960, 300, 'ZOOM!', '#ffd84a', 0.8]],
	}),
	S('116', {
		bg: 'road', mood: 'excited',
		cast: [H(300, [['116', 'run', 1900, 12], ['116:0.8', 'hop', 14, 20]])],
		fx: [['116:0.05', 'stat', '40 MIN ROAD', undefined, 50, '#ff6a5a', 130, 110], ['116:0.4', 'stat', 'YOU MAKE IT IN 26', undefined, 70, '#7dff9a', 130, 110]],
	}),
	S('117', {
		bg: 'hospital', mood: 'sad',
		cast: [A('reyes', 'reyes', 760, [['117', 'sit', 640], ['117:0.4', 'g', 'wave', 60]], {face: 1}), A('theo', 'theo', 1500, [['117:0.2', 'e', 'worried', 120]], {face: -1}), H(-250, [['117:0.1', 'walk', 1150, 12], ['117:0.1', 'face', 1], ['117:0.6', 'face', -1]])],
		fx: [['117:0.03', 'tag', 'reyes', 'ROOM 414', 80], ['117:0.55', 'sparkle', 'reyes']],
	}, true),
	S('118', {
		bg: 'hospital', mood: 'calm',
		cast: [A('reyes', 'reyes', 760, [['118', 'sit', 640], ['118:0.2', 'e', 'happy', 150], ['118:0.5', 'g', 'presentF', 70]], {face: 1}), A('theo', 'theo', 1500, [['118:0.6', 'g', 'shrug', 60]], {face: -1}), H(1150, [['118', 'face', -1], ['118:0.5', 'e', 'wide', 80]])],
		fx: [['118:0.45', 'say', 'reyes', 'There he is!', 80], ['118:0.7', 'say', 'reyes', 'The kid who lost a billion.', 110]],
	}),
	S('119', {
		bg: 'hospital', mood: 'calm',
		cast: [A('reyes', 'reyes', 760, [['119', 'sit', 640], ['119:0.4', 'g', 'presentF', 70]], {face: 1}), H(1150, [['119', 'face', -1], ['119:0.65', 'walk', 1000, 3], ['119:0.65', 'hold', 'screwdriver', 90]]), A('theo', 'theo', 1600, [], {face: -1})],
		fx: [['119:0.1', 'say', 'reyes', "I've seen it. Everyone has.", 100], ['119:0.5', 'say', 'reyes', 'Tell me a bad joke.', 90]],
	}),
	S('120', {
		bg: 'hospital', mood: 'excited',
		cast: [A('reyes', 'reyes', 760, [['120', 'sit', 640], ['120:0.7', 'e', 'happy', 100], ['120:0.7', 'g', 'fist', 40]], {face: 1}), H(1050, [['120', 'face', -1], ['120', 'hold', 'screwdriver', 120], ['120:0.4', 'g', 'presentF', 70]]), A('nurse', 'nurse', 1650, [['120:0.8', 'walk', 1400, 5]], {face: -1, hidden: false})],
		fx: [['120:0.05', 'tag', 'hero', 'A BAD JOKE ABOUT A SCREWDRIVER', 120], ['120:0.7', 'bang', 'reyes', 760, 360, 'HA HA!', '#ffd84a', 0.7]],
	}),
	S('121', {
		bg: 'hospital', mood: 'excited',
		cast: [A('reyes', 'reyes', 760, [['121', 'sit', 640], ['121', 'e', 'happy', 200], ['121:0.1', 'hop', 14, 22], ['121:0.4', 'hop', 14, 22]], {face: 1}), H(1050, [['121', 'face', -1], ['121:0.5', 'e', 'wide', 100]]), A('nurse', 'nurse', 1650, [['121:0.3', 'walk', 1350, 5], ['121:0.5', 'g', 'point', 80]], {face: -1})],
		fx: [['121:0.15', 'bang', 'hero', 1100, 330, 'BEEP BEEP BEEP', '#ff6a8a', 0.6], ['121:0.55', 'say', 'nurse', 'Both of you, calm down!', 100]],
	}),
	S('122', {
		bg: 'hospital', mood: 'sad',
		cast: [A('theo', 'theo', 1500, [['122', 'g', 'facepalm', 200], ['122', 'e', 'happy', 200], ['122:0.3', 'squash', 1]], {face: -1}), A('reyes', 'reyes', 760, [['122', 'sit', 640], ['122', 'e', 'happy', 200]], {face: 1}), H(1050, [['122', 'face', 1], ['122:0.4', 'hop', 14, 22]])],
		fx: [['122:0.3', 'sparkle', 'theo']],
	}),
	S('123', {
		bg: 'hospital', mood: 'calm',
		cast: [A('reyes', 'reyes', 760, [['123:0.1', 'sit', 640], ['123:0.55', 'stand'], ['123:0.55', 'g', 'fist', 60]], {face: 1}), H(1050, [['123', 'face', 1], ['123:0.55', 'g', 'presentF', 60]]), A('theo', 'theo', 1500, [['123:0.55', 'g', 'wave', 60]], {face: -1})],
		fx: [['123:0.05', 'stat', 'BY MORNING: STABLE', undefined, 80, '#7dff9a', 130, 100], ['123:0.55', 'stat', 'BY FRIDAY: HOME', undefined, 80, '#7dff9a', 130, 100], ['123:0.55', 'confetti']],
	}),
	S('124', {
		bg: 'street', mood: 'excited',
		cast: [H(900, [['124:0.5', 'g', 'presentF', 70]]), A('woman', 'woman', 450, [['124:0.2', 'g', 'point', 80]]), A('man', 'man', 1500, [['124:0.3', 'g', 'wave', 80]], {face: -1})],
		world: (c) => <Billboard x={960} y={280} text="THE BOY WHO SAID YES" sub="BREAKING NEWS" c="#ff6a5a" />,
		fx: [['124:0.1', 'tag', 'woman', 'NEW NAME', 80]],
	}, true),
	S('125', {
		bg: 'street', mood: 'excited',
		cast: [H(900, [['125', 'g', 'presentF', 70], ['125:0.5', 'hop', 14, 20]]), A('woman', 'woman', 450, [['125:0.2', 'g', 'wave', 80]]), A('man', 'man', 1500, [['125:0.3', 'g', 'point', 80]], {face: -1})],
		world: (c) => <Billboard x={960} y={280} text="TEEN WALKS AWAY" sub="FROM A BILLION DOLLARS" c="#ffd84a" />,
		fx: [['125:0.55', 'confetti']],
	}),
	S('126', {
		bg: 'street', mood: 'excited', zoom: 1.2,
		cast: [H(960, [PH('126', 200, '#7dff9a'), ['126:0.5', 'hop', 14, 30], ['126:0.5', 'e', 'wide', 100]])],
		fx: [['126:0.05', 'stat', '200 MILLION VIEWS', 'running through the hospital doors', 130, '#7ac8ff', 130, 120], ['126:0.6', 'confetti']],
	}),
	S('127', {
		bg: 'boardroom', mood: 'calm',
		cast: [A('aldridge', 'aldridge', 1200, [['127:0.1', 'g', 'presentF', 80], ['127:0.55', 'g', 'point', 70]], {face: -1}), H(600, [['127:0.5', 'g', 'shrug', 70]])],
		fx: [['127:0.05', 'stat', 'NO BILLION PAID', undefined, 70, '#ff6a5a', 130, 100], ['127:0.45', 'stat', 'NEW WING AT ST. MARY\'S', 'named after Mr. Reyes', 130, '#7dff9a', 130, 110]],
	}),
	S('128', {
		bg: 'kitchen', mood: 'calm',
		cast: [H(900, [['128', 'g', 'rubChin', 80], ['128:0.5', 'g', 'shrug', 70]])],
		fx: [['128:0.05', 'stat', '$60,000,000', 'still in the bank', 100, '#7dff9a', 130, 130], ['128:0.6', 'say', 'hero', 'Now what?', 70], ['128:0.62', '?', 'hero']],
	}),
	S('129', {
		bg: 'kitchen', mood: 'calm',
		cast: [H(1000, [['129:0.2', 'g', 'presentF', 40], PH('129:0.3', 150, '#ffd84a'), ['129:0.65', 'e', 'happy', 100]])],
		fx: [['129:0.02', 'tag', 'hero', 'SUNDAY', 70], ['129:0.4', 'say', 'mom', 'Dinner tonight? I know you’re busy.', 140], ['129:0.4', 'sparkle', 'hero']],
	}),
	S('130', {
		bg: 'kitchen', mood: 'tense',
		cast: [H(1000, [PH('130', 90, '#ffd84a'), ['130:0.4', 'g', 'rubChin', 80], ['130:0.4', 'e', 'worried', 80]])],
		fx: [['130:0.45', 'stat', 'A YES COSTS $1,000', undefined, 100, '#ff6a5a', 130, 110]],
	}),
	S('131', {
		bg: 'kitchen', mood: 'excited',
		cast: [H(1000, [PH('131', 100, '#ffd84a'), ['131:0.05', 'say', 'hero', 'Yes!'], ['131:0.4', 'hop', 14, 30], ['131:0.4', 'e', 'happy', 150], ['131:0.4', 'm', 'laugh', 100]])],
		fx: [['131:0.35', 'sparkle', 'hero']],
	}),
	S('132', {
		bg: 'bedroomNight', mood: 'calm',
		cast: [H(1100, [['132:0.1', 'face', -1], ['132:0.55', 'g', 'presentF', 60]]), A('zoe', 'zoe', -250, [['132:0.45', 'walk', 600, 9], ['132:0.45', 'hold', 'book', 250], ['132:0.7', 'e', 'happy', 120]], {size: 'kid'})],
		fx: [['132:0.05', 'stat', 'THE BEST $1,000', 'YOU EVER SPENT', 110, '#7dff9a', 130, 120], ['132:0.5', 'bang', 'zoe', 300, 480, 'KNOCK KNOCK', '#ffb02e', 0.5]],
	}, true),
	S('133', {
		bg: 'bedroomNight', mood: 'calm', zoom: 1.4,
		cast: [H(1100, [['133', 'face', -1], ['133:0.4', 'g', 'presentF', 60]]), A('zoe', 'zoe', 780, [['133', 'hold', 'book', 250], ['133:0.3', 'e', 'happy', 100]], {size: 'kid'})],
		fx: [['133:0.3', 'tag', 'zoe', 'A PURPLE MARKER SPOT', 110], ['133:0.4', 'sparkle', 'zoe']],
	}),
	S('134', {
		bg: 'bedroomNight', mood: 'calm',
		cast: [H(1100, [['134', 'face', -1], ['134:0.45', 'g', 'presentF', 60], ['134:0.5', 'say', 'hero', 'Yes!', 50], ['134:0.5', 'e', 'happy', 120]]), A('zoe', 'zoe', 780, [['134', 'hold', 'book', 250], ['134:0.1', 'say', 'zoe', 'Wanna read it?', 80]], {size: 'kid'})],
		fx: [['134:0.7', 'stat', 'READ IT 3 TIMES', undefined, 80, '#ffd84a', 130, 110]],
	}),
	S('135', {
		bg: 'bedroomNight', mood: 'calm', zoom: 1.3,
		cast: [H(1100, [['135', 'face', -1], ['135:0.2', 'e', 'happy', 200]]), A('zoe', 'zoe', 800, [['135', 'hold', 'book', 100], ['135:0.5', 'e', 'sleepy', 200], ['135:0.5', 'g', 'touchFace', 200]], {size: 'kid'})],
		fx: [['135:0.5', 'tag', 'zoe', 'z z z', 120], ['135:0.7', 'say', 'hero', "I don't move for an hour.", 120]],
	}),
	S('136', {
		bg: 'street', mood: 'calm',
		cast: [H(300, [['136', 'walk', 760, 8], ['136:0.55', 'g', 'presentF', 60]]), A('pizza', 'pizza', 1500, [['136:0.4', 'hold', 'flyer', 200], ['136:0.5', 'e', 'worried', 100]], {face: -1})],
		fx: [['136:0.03', 'tag', 'hero', 'A WEEK LATER', 80], ['136:0.55', 'say', 'pizza', 'Free slice?', 90]],
	}, true),
	S('137', {
		bg: 'street', mood: 'calm',
		cast: [H(760, [['137:0.5', 'g', 'presentF', 60]]), A('pizza', 'pizza', 1230, [['137', 'hold', 'flyer', 90], ['137:0.3', 'hold', 'pizza', 100], ['137:0.3', 'e', 'worried', 100]], {face: -1})],
		fx: [['137:0.3', 'say', 'pizza', 'Free slice?', 90]],
	}),
	S('138', {
		bg: 'street', mood: 'calm', zoom: 1.3,
		cast: [H(760, [['138:0.3', 'g', 'rubChin', 80]]), A('pizza', 'pizza', 1230, [['138', 'hold', 'pizza', 200], ['138', 'e', 'worried', 200]], {face: -1})],
		fx: [['138:0.4', 'tag', 'pizza', 'A MAN WHO LEARNED HIS LESSON', 130]],
	}),
	S('139', {
		bg: 'street', mood: 'excited',
		cast: [H(760, [['139:0.1', 'hold', 'pizza', 100], ['139:0.2', 'say', 'hero', 'Yes!'], ['139:0.4', 'hop', 14, 30], ['139:0.4', 'm', 'laugh', 100]]), A('pizza', 'pizza', 1230, [['139:0.1', 'hold', 'pizza', 80], ['139:0.5', 'e', 'wide', 120]], {face: -1})],
		fx: [['139:0.4', 'stat', '−$1,000', undefined, 70, '#ff6a5a', 130, 110]],
	}),
	S('140', {
		bg: 'street', mood: 'calm',
		cast: [H(900, [['140:0.3', 'hold', 'pizza', 300], ['140:0.5', 'e', 'happy', 150]]), A('pizza', 'pizza', 1400, [['140', 'e', 'wide', 100], ['140:0.2', 'g', 'shrug', 60], ['140:0.5', 'walk', 2200, 3]], {face: -1})],
		fx: [['140:0.2', 'say', 'pizza', 'Seriously?', 80], ['140:0.7', 'bang', 'hero', 900, 380, 'CHOMP!', '#ffb02e', 0.6]],
	}),
	S('141', {
		bg: 'street', mood: 'calm', zoom: 1.35,
		cast: [H(900, [['141', 'hold', 'pizza', 300], ['141:0.4', 'e', 'happy', 200], ['141:0.4', 'm', 'smile', 200]])],
		fx: [['141:0.05', 'stat', 'TERRIBLE SLICE', 'lukewarm · cheese sliding off', 100, '#ff6a5a', 130, 110], ['141:0.6', 'stat', 'BEST SLICE EVER', undefined, 90, '#7dff9a', 130, 110], ['141:0.6', 'sparkle', 'hero']],
	}),
	S('142', {
		bg: 'street', mood: 'calm',
		cast: [H(800, [['142', 'walk', 1000, 3], ['142:0.5', 'g', 'presentF', 70]])],
		fx: [['142:0.03', 'stat', 'IN THE REAL WORLD…', undefined, 70, '#9aa6ff', 130, 90], ['142:0.5', 'stat', 'NOBODY PAYS YOU TO SAY NO', undefined, 100, '#ff6a5a', 150, 80]],
	}),
	S('143', {
		bg: 'park', mood: 'calm',
		cast: [H(1000, [['143', 'g', 'presentF', 80], ['143:0.5', 'g', 'point', 60]])],
		fx: [['143:0.03', 'stat', 'SAYING NO PROTECTS', 'your time · your energy · your peace', 160, '#7dff9a', 130, 100]],
	}, true),
	S('144', {
		bg: 'park', mood: 'calm',
		cast: [H(1000, [['144', 'g', 'fist', 60], ['144:0.5', 'g', 'presentF', 80]])],
		fx: [['144:0.03', 'stat', 'A SKILL, AND A GOOD ONE', undefined, 80, '#ffd84a', 130, 100], ['144:0.5', 'stat', 'WHICH YESES ARE WORTH THE PRICE?', undefined, 130, '#7dff9a', 130, 70]],
	}),
	S('145', {
		bg: 'night', mood: 'calm', night: true,
		cast: [H(300, [['145', 'walk', 960, 4], ['145:0.65', 'hold', 'flyer', 60], PH('145:0.65', 120, '#8affb0'), ['145:0.7', 'e', 'wide', 100]])],
		fx: [['145:0.7', 'bang', 'hero', 960, 280, 'BZZT', '#7ac8ff', 0.7], ['145:0.7', '!', 'hero']],
	}, true),
	S('146', {
		bg: 'night', mood: 'tense', night: true, zoom: 1.35,
		cast: [H(960, [PH('146:0.1', 250, '#7ac8ff'), ['146:0.4', 'e', 'worried', 150]])],
		fx: [['146:0.1', 'stat', 'UNKNOWN NUMBER', undefined, 100, '#ff6a5a', 130, 110], ['146:0.4', 'glitch']],
	}),
	S('147', {
		bg: 'night', mood: 'tense', night: true, zoom: 1.4,
		cast: [H(960, [PH('147', 250, '#7ac8ff'), ['147:0.1', 'e', 'wide', 150], ['147:0.6', 'look', [0, -0.6], 40]])],
		fx: [['147:0.08', 'stat', '"NICE WORK."', undefined, 70, '#ffd84a', 130, 100], ['147:0.35', 'stat', 'ROUND TWO STARTS AT MIDNIGHT', undefined, 100, '#ff6a5a', 130, 70], ['147:0.68', 'stat', 'SAY ANYTHING BUT YES', undefined, 110, '#ff3a4a', 130, 100], ['147:0.7', 'shake'], ['147:0.7', 'glitch']],
	}),
	S('148', {
		bg: 'street', mood: 'excited',
		cast: [H(960, [['148', 'g', 'presentF', 70], ['148:0.55', 'g', 'point', 70]]), A('theo', 'theo', 520, [['148:0.3', 'g', 'wave', 60]]), A('mom', 'mom', 1450, [['148:0.4', 'g', 'wave', 60]], {face: -1}), A('zoe', 'zoe', 1250, [['148:0.5', 'hop', 14, 26]], {size: 'kid', face: -1})],
		fx: [['148:0.03', 'stat', 'SO HERE IS THE QUESTION', undefined, 90, '#ffd84a', 130, 100], ['148:0.3', 'stat', '$1,000 FOR EVERY NO', 'how many would you refuse?', 160, '#7dff9a', 130, 100]],
	}, true),
	S('149', {
		bg: 'street', mood: 'tense',
		cast: [H(960, [PH('149', 150, '#7ac8ff'), ['149:0.5', 'g', 'point', 70]]), A('theo', 'theo', 520, [['149', 'hold', 'phone', 100, '#7ac8ff']]), A('mom', 'mom', 1450, [['149:0.4', 'e', 'worried', 100]], {face: -1})],
		fx: [['149:0.03', 'stat', 'ONE YES vs A BILLION', undefined, 100, '#ff6a5a', 130, 100], ['149:0.5', 'stat', 'WOULD YOU PICK UP?', undefined, 140, '#ffd84a', 130, 130]],
	}),
	S('150', {
		bg: 'street', mood: 'excited',
		cast: [H(960, [['150', 'g', 'presentF', 70], ['150:0.5', 'hop', 14, 26]]), A('theo', 'theo', 560, [['150:0.3', 'g', 'fist', 60]]), A('zoe', 'zoe', 1380, [['150:0.2', 'hop', 14, 26]], {size: 'kid', face: -1}), A('mom', 'mom', 1560, [['150:0.5', 'g', 'wave', 60]], {face: -1})],
		fx: [['150:0.05', 'stat', 'TELL US IN THE COMMENTS', undefined, 120, '#ffd84a', 130, 100], ['150:0.5', 'confetti']],
	}),
	S('151', {
		bg: 'street', mood: 'excited',
		cast: [H(960, [['151', 'g', 'fist', 50], ['151:0.3', 'hop', 14, 26], ['151:0.6', 'g', 'wave', 100]]), A('theo', 'theo', 560, [['151:0.2', 'hop', 14, 26]]), A('mom', 'mom', 1450, [['151:0.3', 'g', 'wave', 80]], {face: -1}), A('zoe', 'zoe', 1250, [['151:0.5', 'hop', 14, 26]], {size: 'kid', face: -1}), A('pizza', 'pizza', 300, [['151:0.4', 'hold', 'pizza', 100]])],
		fx: [['151:0.05', 'confetti'], ['151:0.4', 'stat', 'LIKE & SUBSCRIBE', 'for more WHAT IFS', 130, '#ff6a5a', 130, 120], ['151:0.4', 'sparkle', 'hero']],
	}),
];
