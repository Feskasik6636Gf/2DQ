import {buildShots} from './scene';
import {PART1} from './shots1';
import {PART2} from './shots2';
import {PART3} from './shots3';

export const SHOTS = buildShots([...PART1, ...PART2, ...PART3]);
