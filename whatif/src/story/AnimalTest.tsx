import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Animal, AnimalKind} from './animals';
const K: AnimalKind[] = ['bulldog','beagle','retriever','shepherd','greyhound','spaniel','cat','crow','canary','pigeon','gull','raccoon','bee','elephant'];
export const AnimalTest: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#cfe8ff'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<rect y={800} width={1920} height={300} fill="#8fcf7a" />
				{K.map((k, i) => <Animal key={k} kind={k} x={140 + (i % 5) * 330} y={330 + Math.floor(i / 5) * 330} s={k==='elephant'?0.5:1.1} t={f} talk={i % 2 ? 0.8 : 0} pose={i===4?'walk':'stand'} flap={k==='pigeon'?1:0} />)}
			</svg>
		</AbsoluteFill>
	);
};
