export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};
export const STORY: {
	title: string;
	hero: string;
	counter?: {label: string; color?: string; keys: CounterKeyDef[]};
	heroAge?: (counter: number) => number;
	heroGrow?: number;
	bed: string;
	musicVolume?: number;
	endCaption?: string[];
} = {
	title: 'Tank and the Blue Cushion',
	hero: 'hero',
	bed: 'sfx/bed.wav',
	endCaption: ['WOULD YOU HAVE PULLED THE ALARM?', 'TELL ME IN THE COMMENTS'],
};
