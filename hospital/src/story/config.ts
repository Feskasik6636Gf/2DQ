/* Story-level settings: "St. Brendan's — the 42nd nurse". */
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
	title: "St. Brendan's — the 42nd nurse",
	hero: 'hero',
	counter: {
		label: 'STAFF',
		keys: [
			{line: '001', v: 0},
			{line: '001', off: 20, v: 41, roll: 6},
			{line: '002', off: 100, v: 42, roll: 4},
			{line: '009', off: 20, v: 41, roll: 4},
			{line: '010', off: 90, v: 42, roll: 4},
			{line: '029', off: 40, v: 41, roll: 4},
			{line: '050', off: 4, v: 42, roll: 4},
			{line: '056', off: 20, v: 41, roll: 4},
			{line: '056', off: 100, v: 42, roll: 4},
			{line: '205', off: 60, v: 41, roll: 6},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ["WOULD YOU ASK HER NAME?", 'TELL ME IN THE COMMENTS'],
};
