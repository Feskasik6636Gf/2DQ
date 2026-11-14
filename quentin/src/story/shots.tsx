import type {ShotDef} from '../kit/coverage';
import {makeShot} from './dsl';
import {S1} from './s1';
import {S2, S3} from './s2';
import {S4} from './s3';
import {S5} from './s4';

export const SHOTS: ShotDef[] = [...S1, ...S2, ...S3, ...S4, ...S5].map(makeShot);
