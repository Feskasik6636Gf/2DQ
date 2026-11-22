import type {ShotDef} from '../kit/coverage';
import {toShots} from './dsl';
import {ALL} from './all';

export const SHOTS: ShotDef[] = toShots(ALL);
