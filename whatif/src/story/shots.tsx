import type {ShotDef} from '../kit/coverage';
import {build} from './auto';
import {SPECS1} from './specs1';
import {SPECS2} from './specs2';
import {SPECS3} from './specs3';
import {SPECS4} from './specs4';

export const SHOTS: ShotDef[] = build([...SPECS1, ...SPECS2, ...SPECS3, ...SPECS4]);
