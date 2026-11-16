import type {Base} from '../kit/actions';

/* Cast of "St. Brendan's". Hero stays yellow so the viewer finds him in any crowd. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#f2b21c', outfit: 'suit', hair: 'short', hairColor: '#3a2a1a', rim: '#fff0cc', rimW: 2.4, shoe: '#2a2020'},
	scrubs: {color: '#3b7fd1', outfit: 'tee', hair: 'short', hairColor: '#2a2a3a', rim: '#d8ebff', rimW: 2.4, shoe: '#e9eef2', sp: 'HERO'},
	admin: {color: '#8e3a4f', outfit: 'coat', hair: 'bun', hairColor: '#b9b9c4', rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24', sp: 'ADMIN'},
	dennis: {color: '#2f6fc0', outfit: 'tee', hair: 'grey', acc: ['glasses', 'mustache'], rim: '#d8ebff', rimW: 2.4, shoe: '#e9eef2', sp: 'DENNIS'},
	priya: {color: '#3a9ad1', outfit: 'tee', hair: 'ponytail', hairColor: '#1f1f2c', rim: '#d8f1ff', rimW: 2.4, shoe: '#e9eef2', sp: 'PRIYA'},
	ghost: {color: '#f1f5f6', outfit: 'gown', hair: 'bun', hairColor: '#cfd6dc', rim: '#bfe9ff', rimW: 3.2, shoe: '#dfe6ea', sp: 'GHOST'},
	nurse: {color: '#3b7fd1', outfit: 'tee', hair: 'short', rim: '#d8ebff', rimW: 2.2, shoe: '#e9eef2', sp: 'NURSE'},
	newb: {color: '#8a6bd6', outfit: 'suit', hair: 'short', hairColor: '#2a2030', acc: ['glasses'], rim: '#ece4ff', rimW: 2.4, shoe: '#221c2a', sp: 'NEWB'},
	patient: {color: '#e9eef0', outfit: 'gown', hair: 'grey', rim: '#fff', rimW: 2.2, sp: 'PATIENT'},
};
