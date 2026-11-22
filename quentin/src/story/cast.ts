import {crowdLook, type Base} from '../kit/actions';

export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2540', hero: true, outfit: 'hoodie', legColor: '#1c1a26', shoe: '#f4f1ea', rim: '#ffd0d6', rimW: 2.4},
	nikhil: {color: '#2f8fd8', hair: 'spiky', hairColor: '#1d1d28', skin: '#a8714a', eye: '#3a2a1a', legColor: '#2b2f3a', rim: '#ffe0c8', rimW: 2.4, shoe: '#f2f2f2'},
	teacher: {color: '#8e3a8f', outfit: 'suit', build: 'f', hair: 'bun', hairColor: '#3a2a22', acc: ['glasses'], skin: '#d9a07a', eye: '#4a3a2a', age: 0.3, legColor: '#2b1d34', rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	mom: {color: '#2fb5a8', outfit: 'tee', build: 'f', hair: 'ponytail', hairColor: '#3a2418', skin: '#d9a07a', eye: '#5a3a2a', age: 0.35, legColor: '#2b8f86', rim: '#e8fff6', rimW: 2.4, shoe: '#f2f2f2'},
	bruno: {color: '#e8c628', outfit: 'hoodie', hair: 'cap', hairColor: '#ffd23a', beard: true, skin: '#c98d63', eye: '#4a3a2a', age: 0.55, legColor: '#3a4256', rim: '#fff2c8', rimW: 2.4, shoe: '#4a3a2a'},
	marco: {color: '#e8a028', outfit: 'tee', hair: 'cap', hairColor: '#ffd23a', skin: '#8d5a3b', eye: '#2a1d18', legColor: '#2d3a63', rim: '#ffe6c8', rimW: 2.4, shoe: '#3a2a1a'},
	worker1: {color: '#f2f2f2', outfit: 'tee', hair: 'cap', hairColor: '#ffd23a', skin: '#f1c4a0', beard: true, eye: '#5a7a8a', legColor: '#3a4256', rimW: 0, shoe: '#2a2a2a'},
	worker2: {color: '#f08a3c', outfit: 'tee', hair: 'cap', hairColor: '#ffd23a', skin: '#e0a878', eye: '#3a2a1a', age: 0.5, legColor: '#4a4a56', rimW: 0, shoe: '#2a2a2a'},
	worker3: {color: '#4aa8d8', outfit: 'hoodie', hair: 'cap', hairColor: '#ffd23a', skin: '#8d5a3b', eye: '#2a1d18', legColor: '#2b2f3a', rimW: 0, shoe: '#2a2a2a'},
	grandpa: {color: '#6b8ea8', outfit: 'tee', hair: 'grey', hairColor: '#e0e0e0', beard: true, acc: ['glasses'], skin: '#d9a07a', eye: '#6a7a8a', age: 0.75, legColor: '#3a3f4b', rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a'},
	doctor: {color: '#eef3f2', outfit: 'coat', build: 'f', hair: 'long', hairColor: '#2b1f3a', skin: '#8d5a3b', eye: '#3a2a1a', legColor: '#2c3a40', rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40'},
	librarian: {color: '#6b9a6a', outfit: 'suit', build: 'f', hair: 'bun', hairColor: '#cfcfcf', acc: ['glasses'], skin: '#f1c4a0', eye: '#4a5a6a', age: 0.6, legColor: '#3a4a3a', rim: '#fff2d6', rimW: 2.4, shoe: '#3a3a3a'},
	oldman: {color: '#7a5a3a', outfit: 'coat', hair: 'grey', hairColor: '#f0f0f0', beard: true, skin: '#e8b48c', eye: '#6a7a8a', age: 0.9, legColor: '#4a4036', rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a'},
	medic: {color: '#f4f6f6', outfit: 'coat', hair: 'short', hairColor: '#2a1d18', skin: '#c98d63', eye: '#3a2a1a', legColor: '#2d4a8a', rimW: 0, shoe: '#222'},
	kid1: {color: '#3aa37a', outfit: 'tee', build: 'f', hair: 'ponytail', hairColor: '#ffb02e', skin: '#f6d2b4', eye: '#3aa0e0', legColor: '#2d3a63', rimW: 0, shoe: '#f2f2f2'},
};

/* generic background people c0..c15 (frozen crowds, workers, students) */
for (let i = 0; i < 16; i++) CAST['c' + i] = crowdLook(i, 'fz');
CAST.prof = {color: '#f4f6f6', outfit: 'coat', hair: 'grey', hairColor: '#e8e8e8', acc: ['glasses'], skin: '#e8b48c', eye: '#4a5a6a', age: 0.5, legColor: '#3a3f4b', rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a'};
