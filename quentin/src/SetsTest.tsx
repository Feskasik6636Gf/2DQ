import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ShotCtx} from './kit/core';
import {Stage, Layer, Svg, camOn} from './kit/kit';
import {Actor} from './kit/core';
import {Bedroom, Kitchen, KitchenTable, Elevator, Pharmacy, SchoolYard, Corridor, Toilet, Entrance, ClassroomEve, Shop, HallBack, NightStreet} from './kit/sets';
import {CityDay} from './kit/world';
import {Street, Shelter, Sky, Skyline, Facades} from './reference/PauseTime';
const items: [string, (f: number) => React.ReactNode][] = [
 ['Bedroom', (f)=><Bedroom f={f}/>],['Kitchen',()=><Kitchen/>],['Elevator',(f)=><Elevator f={f}/>],['Pharmacy',()=><Pharmacy/>],
 ['SchoolYard',(f)=><SchoolYard f={f}/>],['Corridor',(f)=><Corridor f={f}/>],['Toilet',(f)=><Toilet f={f}/>],['Entrance',()=><Entrance/>],
 ['ClassroomEve',()=><ClassroomEve/>],['Shop',(f)=><Shop f={f}/>],['HallBack',(f)=><HallBack f={f}/>],['NightStreet',(f)=><NightStreet f={f}/>],
 ['CityDay',(f)=><CityDay f={f}/>],['Street',(f)=><><Sky wt={f/30}/><Skyline wt={f/30}/><Street wt={f/30}/></>],
];
export const SetsTest: React.FC = () => (
	<AbsoluteFill style={{background:'#222', display:'flex', flexWrap:'wrap'}}>
		{items.map(([n, mk], i) => (
			<div key={n} style={{width: 480, height: 270, position:'relative', overflow:'hidden'}}>
				<div style={{width:1920,height:1080,transform:'scale(0.25)',transformOrigin:'0 0',position:'relative'}}>
					<ShotCtx.Provider value={{f:40,gf:40,dur:300,start:0,at:()=>0,end:()=>0}}>
						<Stage cam={camOn(960,540,1)} still>
							<Layer depth={1.0}>{mk(40)}</Layer>
							<Layer depth={1}><Svg><Actor who="hero" x={700} floor={900} s={1} uid={'t'+i}/><Actor who="mom" x={1100} floor={900} s={1} uid={'m'+i}/></Svg></Layer>
						</Stage>
					</ShotCtx.Provider>
				</div>
				<div style={{position:'absolute',left:6,top:4,color:'#ff0',fontSize:22,fontWeight:800}}>{n}</div>
			</div>
		))}
	</AbsoluteFill>
);
