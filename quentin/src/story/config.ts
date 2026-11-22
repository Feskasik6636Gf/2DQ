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
	title: 'Five More Minutes',
	hero: 'hero',
	counter: {
		label: 'AGE',
		keys: [
			{line: '001', v: 17},
			{line: '120', off: 14, v: 19, roll: 40},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['WOULD YOU STOP TIME?', 'TELL ME IN THE COMMENTS'],
};
