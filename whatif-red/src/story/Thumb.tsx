import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Svg} from '../engine/camera';
import {Stickman} from '../engine/Stickman';
import {CAST} from './cast';
import {RedVoid} from './places';
import {ShotCtx} from '../kit/core';

/* YouTube thumbnail: the hero, a red LIE stamp, Biscuit appearing out of nowhere */
const RB = "'Rubik', sans-serif";
export const Thumb: React.FC = () => (
	<ShotCtx.Provider value={{f: 40, gf: 40, dur: 100, start: 0, at: () => 0, end: () => 0}}>
		<AbsoluteFill style={{background: '#2a0508'}}>
			<AbsoluteFill style={{transform: 'scale(1.3)'}}>
				<RedVoid f={40} words={false} />
			</AbsoluteFill>
			<Svg>
				<g transform="translate(-120,80)">
					<Stickman id="th" x={620} y={760} scale={2.3} pose={{lean: -4, head: -6, armF: [100, 10], armB: [-30, 30], legB: [-5, 2], legF: [6, 2]}} {...CAST.hero} handF="point" mouth="smirk" faceTurn={0.5} />
				</g>
				<g transform="translate(1440,560) rotate(-10)">
					<rect x={-330} y={-120} width={660} height={240} rx={30} fill="#ff2a3c" stroke="#fff" strokeWidth={14} />
					<text y={70} textAnchor="middle" fontSize={200} fontFamily={RB} fontWeight={900} fill="#fff">
						LIE?
					</text>
				</g>
				<text x={1440} y={250} textAnchor="middle" fontSize={120} fontFamily={RB} fontWeight={900} fill="#fff" stroke="#120812" strokeWidth={18} paintOrder="stroke">
					IT CAME TRUE
				</text>
				<text x={1440} y={900} textAnchor="middle" fontSize={84} fontFamily={RB} fontWeight={900} fill="#ffd34a" stroke="#120812" strokeWidth={14} paintOrder="stroke">
					"MY DOG ATE IT"
				</text>
			</Svg>
		</AbsoluteFill>
	</ShotCtx.Provider>
);
