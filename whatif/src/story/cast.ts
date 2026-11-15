import type {Base} from '../kit/actions';

/* Characters of this video. Hero = the channel's red-hoodie guy with the glossy black head. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2442', hair: 'none', rim: '#ffc9d0', rimW: 2.4, sp: 'HERO'},
	dad: {color: '#3a6fd2', hair: 'short', hairColor: '#2b2f3a', acc: ['mustache'], rim: '#dbe8ff', rimW: 2.4, shoe: '#222', sp: 'DAD'},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540', sp: 'MOM'},
	nurse: {color: '#4fb8a6', outfit: 'coat', hair: 'bob', rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40', sp: 'NURSE'},
	rosa: {color: '#b86fa8', outfit: 'tee', hair: 'grey', acc: ['glasses'], rim: '#ffe3f4', rimW: 2.4, shoe: '#3a2a36', sp: 'ROSA'},
	jonah: {color: '#2fae6a', hair: 'cap', hairColor: '#f2b21c', rim: '#d8ffe6', rimW: 2.4, shoe: '#f2f2f2', sp: 'JONAH'},
	harp: {color: '#6b7f8e', hair: 'grey', acc: ['mustache'], rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a', sp: 'HARP'},
	pilot: {color: '#2c4a8a', outfit: 'suit', hair: 'ponytail', hairColor: '#7a4a2a', rim: '#dde8ff', rimW: 2.4, shoe: '#111', sp: 'PILOT'},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24', sp: 'TEACHER'},
	friend: {color: '#f2b21c', hair: 'spiky', hairColor: '#2b2f3a', rim: '#fff0cc', rimW: 2.4, shoe: '#f2f2f2', sp: 'FRIEND'},
	wife: {color: '#e8743a', hair: 'ponytail', hairColor: '#5a3a22', rim: '#ffe6d0', rimW: 2.4, shoe: '#2b2530', sp: 'WIFE'},
	mia: {color: '#ff8fb8', hair: 'bun', hairColor: '#ffd34a', rim: '#ffe6f2', rimW: 2.4, shoe: '#ffffff', sp: 'MIA'},
	doctor: {color: '#eef3f2', outfit: 'coat', hair: 'none', acc: ['glasses'], rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40', sp: 'DOCTOR'},
	grandpa: {color: '#6b7f8e', outfit: 'tee', hair: 'grey', acc: ['glasses', 'mustache'], rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a', sp: 'GRANDPA'},
	seller: {color: '#3aa37a', outfit: 'apron', hair: 'bun', rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24', sp: 'SELLER'},
	boss: {color: '#3a4256', outfit: 'suit', hair: 'none', acc: ['glasses'], rim: '#e6ecff', rimW: 2.4, shoe: '#111', sp: 'BOSS'},
};
