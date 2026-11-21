/* Story-level settings. */
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
	title: 'A $100 bill for every scary truth',
	hero: 'hero',
	counter: {
		label: 'CASH $',
		color: '#6ef0a0',
		keys: [
			{line: '001', v: 0},
			{line: '012', off: 6, v: 100, roll: 10},
			{line: '039', off: 12, v: 200, roll: 8},
			{line: '050', v: 300, roll: 8},
			{line: '065', off: 10, v: 400, roll: 8},
			{line: '078', off: 40, v: 500, roll: 8},
			{line: '085', off: 20, v: 2400, roll: 50},
			{line: '091', off: 20, v: 2500, roll: 8},
			{line: '093', v: 2300, roll: 14},
			{line: '094', v: 2000, roll: 14},
			{line: '095', v: 1700, roll: 14},
			{line: '103', off: 70, v: 1800, roll: 8},
			{line: '108', v: 1900, roll: 8},
			{line: '111', off: 20, v: 2000, roll: 8},
			{line: '128', v: 2100, roll: 8},
			{line: '138', off: 20, v: 2200, roll: 8},
			{line: '159', v: 62000, roll: 70},
			{line: '162', off: 30, v: 61900, roll: 8},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['WOULD YOU TAKE THE MONEY?', 'TELL ME IN THE COMMENTS'],
};
