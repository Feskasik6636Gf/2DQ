import type {Base} from '../kit/actions';

/* Characters: the hero is the user's own character — black round head, red hoodie. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2640', hair: 'none', rim: '#ffd0d6', rimW: 2.4, shoe: '#f2f2f2'},
	iris: {color: '#a89a7a', hair: 'ponytail', hairColor: '#4a3226', rim: '#fff0d8', rimW: 2.4, shoe: '#5a4a36'},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540'},
	noah: {color: '#2f6fd8', hair: 'spiky', hairColor: '#3a2a22', rim: '#dcebff', rimW: 2.2, shoe: '#f2f2f2'},
	leo: {color: '#3aa37a', hair: 'cap', hairColor: '#2f6fd8', rim: '#e8fff2', rimW: 2.2, shoe: '#f2f2f2'},
	siffre: {color: '#c9b79a', outfit: 'coat', hair: 'grey', acc: ['glasses', 'mustache'], rim: '#fff3e0', rimW: 2.4, shoe: '#2b2f3a'},
};
