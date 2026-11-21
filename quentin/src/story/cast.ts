import type {Base} from '../kit/actions';

export type CastMember = Base & {sp?: string};

const rim = {rimW: 2.4};
export const CAST: Record<string, CastMember> = {
	hero: {color: '#f2b21c', hair: 'short', rim: '#fff0cc', ...rim},
	rosa: {color: '#c2557f', hair: 'grey', acc: ['glasses'], outfit: 'tee', rim: '#ffe6ee', shoe: '#5a2f3f', ...rim},
	kofi: {color: '#2f9d6a', hair: 'spiky', hairColor: '#2a1a12', rim: '#d8ffe8', shoe: '#f2f2f2', ...rim},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', shoe: '#2c2540', ...rim},
	dana: {color: '#18a0a8', hair: 'ponytail', hairColor: '#e8b04a', rim: '#d8fffb', shoe: '#efe2ff', ...rim},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', shoe: '#2b1d24', ...rim},
	coach: {color: '#2b3a67', hair: 'cap', hairColor: '#c63a2a', acc: ['mustache'], outfit: 'tee', rim: '#d9e6ff', shoe: '#111', ...rim},
	colm: {color: '#c24a3a', hair: 'short', hairColor: '#2a1a12', rim: '#ffe0c8', shoe: '#f2f2f2', ...rim},
	principal: {color: '#3a4256', outfit: 'suit', hair: 'none', acc: ['glasses'], rim: '#e6ecff', shoe: '#111', ...rim},
	rep: {color: '#d94a5a', outfit: 'suit', hair: 'bob', hairColor: '#4a2a1a', rim: '#ffe0e6', shoe: '#2c1a20', ...rim},
	medic: {color: '#eef3f2', outfit: 'coat', hair: 'short', rim: '#d8fff2', shoe: '#2c3a40', ...rim},
	admin: {color: '#6e7a8a', outfit: 'coat', hair: 'bob', hairColor: '#3a3a44', rim: '#dde6f2', shoe: '#222', ...rim},
	str: {color: '#8a5ac4', hair: 'cap', hairColor: '#2a1a12', rim: '#eadcff', ...rim},
	yt: {color: '#e44a9a', hair: 'spiky', hairColor: '#7a3ac4', acc: ['headphones'], rim: '#ffd8ee', shoe: '#fff', ...rim},
	lawyer: {color: '#2a3a52', outfit: 'suit', hair: 'grey', rim: '#dde6ff', shoe: '#111', ...rim},
	fresh: {color: '#4a8ad4', hair: 'short', hairColor: '#e8c04a', rim: '#d8ecff', ...rim},
	ibrahim: {color: '#3aa37a', outfit: 'apron', hair: 'none', acc: ['mustache'], rim: '#e8fff2', shoe: '#1d2b24', ...rim},
	uncle: {color: '#6b7f8e', outfit: 'tee', hair: 'grey', acc: ['mustache'], rim: '#eef4ff', ...rim},
	girl: {color: '#b45ac4', hair: 'bob', hairColor: '#2a1a12', rim: '#f6dcff', ...rim},
	man: {color: '#8a6a3a', hair: 'short', hairColor: '#3a2a1a', rim: '#fff0d8', ...rim},
	woman: {color: '#c46a4a', hair: 'bun', rim: '#ffe6d8', ...rim},
};
