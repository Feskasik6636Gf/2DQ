/* Story-level settings. Claude rewrites this file for every new video. */
import KEYS from './counter-keys.json';
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string; // cast id of the main character
	counter?: {label: string; color?: string; keys: CounterKeyDef[]}; // badge over the hero (age, lives, money…)
	heroAge?: (counter: number) => number; // 0..1 body ageing driven by the counter (optional)
	heroGrow?: number; // how much bigger the hero gets at full ageing (0.07 = +7 %)
	bed: string; // sound bed in public/ (ambience + sfx, music only if the user wants it)
	musicVolume?: number; // only if the bed has music in it
	endCaption?: string[]; // last words on screen (call to action), optional
} = {
	title: 'What if you got $1,000 every time you said no?',
	hero: 'hero',
	counter: {label: 'BALANCE $', color: '#7dff9a', keys: KEYS as CounterKeyDef[]},
	bed: 'sfx/bed.wav',
	endCaption: ['TELL US IN THE COMMENTS', 'LIKE & SUBSCRIBE'],
};
