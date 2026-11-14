import React from 'react';
import type {Spec} from './dsl';
import {Arrow, Phone, Rings} from './places';
import {Clock, Note, Speech} from './fxlib';
import {FONT} from '../kit/ui';

const Y = '#ffd34a';
const RED = '#ff5a5a';
const BLUE = '#7fd0ff';
const W = '#fffdf4';

/* ---- 166–237: the door ---- */
export const S5: Spec[] = [
	{
		at: '166', whip: true, place: 'hall', pv: {seed: 'w1', chalk: true, open: [1500]}, cam: [300, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['166+10', 'e166', 1500]]}, {who: 'iris', x: -80, go: [['166+10', 'e166', 1360]]}],
		gfx: [{k: 'big', t: ['166+4', '166+80'], text: 'DAY 98', sub: 'YOU GO TOGETHER', c: Y, y: 120, size: 170}],
	},
	{
		at: '167', place: 'hall', pv: {seed: 'w2', tint: '#e6d98a', flick: 0.05}, cam: [300, 540, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['167', 'e167', 700]], ex: [['wide', 'open', '167+20', 'e167']]}, {who: 'iris', x: -80, go: [['167', 'e167', 560]]}],
		gfx: [{k: 'tag', t: ['167+6', 'e167'], x: 700, y: 300, text: 'THE HALLWAY STARTS TO CHANGE', size: 40, c: '#fff'}],
	},
	{
		at: '168', place: 'hall', pv: (c: any) => ({seed: 'w3', tint: '#efe6b8', flick: 0, lights: 1.6, open: []}), cam: [500, 560, 1.4], follow: 'hero',
		actors: [{who: 'hero', x: 300, go: [['168', 'e168', 1300]], ex: [['wide', 'open', '168+20', 'e168']]}, {who: 'iris', x: 130, go: [['168', 'e168', 1150]]}],
		fx: (c) => <Rings x={1700} y={300} f={c.gf} c={Y} n={Math.max(1, 4 - Math.floor(c.f / 60))} r={Math.max(100, 500 - c.f * 3)} />,
		gfx: [{k: 'tag', t: ['168+6', '168+60'], x: 700, y: 840, text: 'THINNER CARPET', size: 36, c: '#fff'}, {k: 'tag', t: ['168+50', '168+110'], x: 1000, y: 160, text: 'BRIGHTER LIGHTS', size: 36, c: '#fff'}, {k: 'tag', t: ['168+100', 'e168'], x: 1300, y: 300, text: 'THE HUM… STOPS', size: 40, c: Y}],
	},
	{
		at: '169', place: 'hall', pv: {seed: 'w3', tint: '#efe6b8', flick: 0, lights: 1.6}, cam: [900, 540, 1.5, 900, 540, 2.0],
		actors: [{who: 'hero', x: 800, g: [['handsOnHead', '169+40', 'e169']], ex: [['wide', 'open', '169+30', 'e169']]}, {who: 'iris', x: 1050, face: -1, g: [['handsOnHead', '169+50', 'e169']], ex: [['wide', 'open', '169+30', 'e169']]}],
		gfx: [{k: 'big', t: ['169+10', 'e169'], text: 'SILENCE', sub: 'SO STRANGE YOU WANNA SCREAM', c: '#fff', y: 110, size: 190}, {k: 'shake', t: ['169+70', 'e169'], amp: 10}],
	},
	{
		at: '170', whip: true, place: 'door', pv: {f: 0}, cam: [900, 540, 1.1, 1300, 560, 1.4],
		actors: [{who: 'hero', x: 300, go: [['170+10', 'e170', 800]], ex: [['wide', 'open', '170+30', 'e170']]}, {who: 'iris', x: 120, go: [['170+10', 'e170', 650]]}],
		gfx: [{k: 'tag', t: ['170+30', 'e170'], x: 1500, y: 170, text: 'A WHITE DOOR · SILVER HANDLE', size: 40, c: '#14112a'}],
	},
	{
		at: '171', place: 'door', pv: {f: 0}, cam: [1400, 540, 1.6, 1500, 540, 2.0],
		actors: [{who: 'hero', x: 1000, ex: [['wide', 'open', '171', 'e171']], look: [1, 0]}, {who: 'iris', x: 850, look: [1, 0], ex: [['wide', 'open', '171', 'e171']]}],
		gfx: [{k: 'tag', t: ['171+6', 'e171'], x: 1500, y: 170, text: 'LIKE ANY DOOR IN ANY HOUSE', size: 40, c: '#14112a'}],
	},
	{
		at: '172', place: 'door', pv: {f: 0}, cam: [1500, 800, 1.6, 1500, 860, 2.2],
		actors: [{who: 'hero', x: 1100, lean: [10, '172', 'e172'], look: [1, 0.3], ex: [['wide', 'smile', '172', 'e172']]}],
		fx: (c) => <rect x={1330} y={890} width={350} height={10} fill="#ffcf6a" opacity={0.6 + 0.4 * Math.sin(c.gf / 7)} />,
		gfx: [{k: 'tag', t: ['172+10', 'e172'], x: 1500, y: 700, text: 'WARM LIGHT UNDER THE DOOR', size: 36, c: '#8a5a10'}],
	},
	{
		at: '173', place: 'door', pv: {f: 0}, cam: [1100, 640, 1.7, 1100, 700, 2.1],
		actors: [{who: 'hero', x: 1100, lean: [[10, '173', '173+40'], [34, '173+60', 'e173']], ex: [['wide', 'smile', '173', 'e173']], g: [['touchFace', '173+10', '173+50']]}],
		fx: (c) => (
			<g stroke="#ffcf6a" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8}>
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M${1330 + i * 40},${860 - ((c.f * 2 + i * 30) % 160)} q18,-20 0,-40 q-18,-20 0,-40`} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['173+20', 'e173'], x: 1100, y: 420, text: 'A SMELL THAT BRINGS YOU TO YOUR KNEES', size: 34, c: '#8a5a10'}],
	},
	{
		at: '174', place: 'door', pv: {f: 0}, cam: [1300, 600, 1.3, 1300, 600, 1.6],
		actors: [{who: 'hero', x: 1100, sit: true, ex: [['sad', 'smile', '174', 'e174']], g: [['touchFace', '174+10', 'e174']]}, {who: 'iris', x: 900, sit: true, ex: [['sad', 'smile', '174', 'e174']]}],
		gfx: [{k: 'tag', t: ['174+6', '174+60'], x: 1400, y: 360, text: 'DISHWASHER SOAP', size: 40, c: '#14112a'}, {k: 'tag', t: ['174+50', '174+100'], x: 1400, y: 460, text: 'LASAGNA', size: 40, c: '#8a5a10'}, {k: 'tag', t: ['174+90', 'e174'], x: 1400, y: 560, text: 'CLEAN CARPET', size: 40, c: '#14112a'}],
	},
	{
		at: '175', place: 'door', pv: {f: 0}, cam: [1100, 620, 1.1, 1130, 640, 1.5],
		actors: [{who: 'hero', x: 800, go: [['175+10', '175+70', 980]], ex: [['wide', 'open', '175+40', 'e175']]}],
		gfx: [{k: 'tag', t: ['175+30', 'e175'], x: 1130, y: 380, text: 'AN IRON LEVER · TALLER THAN YOU', size: 38, c: '#14112a'}],
	},
	{
		at: '176', place: 'door', pv: {f: 0}, cam: [1130, 700, 1.7, 1130, 640, 2.1],
		actors: [{who: 'hero', x: 980, reachTo: [['176+10', 'e176', 1115, 700]], ex: [['normal', 'flat', '176', 'e176']]}],
		fx: (c) => (
			<g>
				{Array.from({length: 24}).map((_, i) => (
					<circle key={i} cx={1000 + ((i * 53 + c.f * 0.6) % 260)} cy={500 + ((i * 97 + c.f * 0.4) % 360)} r={3} fill="#cfc8b0" opacity={0.7} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['176+6', 'e176'], x: 1130, y: 450, text: 'STICKY WITH OLD DUST', size: 36, c: '#14112a'}],
	},
	{
		at: '177', place: 'door', pv: {f: 0}, cam: [1130, 540, 2.2, 1130, 530, 2.8],
		actors: [{who: 'hero', x: 980, lean: [10, '177', 'e177'], reachTo: [['177', 'e177', 1130, 540]], ex: [['normal', 'flat', '177', 'e177']]}, {who: 'iris', x: 830, ex: [['normal', 'flat', '177', 'e177']]}],
		fx: (c) => <Note x={1060} y={500} f={c.f} t0={c.R('177+30')} text="…" size={50} c="#14112a" />,
		gfx: [{k: 'tag', t: ['177+10', 'e177'], x: 1130, y: 380, text: 'A SCRATCHED MESSAGE — NOT IRIS\'S HANDWRITING', size: 30, c: '#14112a'}],
	},
	{
		at: '178', place: 'door', pv: {f: 0}, cam: [1100, 560, 1.4, 1100, 560, 1.7],
		actors: [{who: 'hero', x: 950, ex: [['normal', 'flat', '178', 'e178']]}, {who: 'iris', x: 800, ex: [['normal', 'flat', '178', 'e178']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fontSize={56} textAnchor="middle">
				<text x={1380} y={300} fill="#14112a" opacity={Math.min(1, c.f / 12)}>HOLD IT DOWN → DOOR OPENS</text>
				<text x={1380} y={380} fill="#8a1a1a" opacity={Math.min(1, Math.max(0, c.f - 50) / 12)}>LET GO → DOOR CLOSES</text>
			</g>
		),
	},
	{
		at: '179', place: 'door', pv: {f: 0}, cam: [1000, 560, 1.6, 1000, 560, 2.0],
		actors: [{who: 'iris', x: 900, ex: [['wide', 'open', '179+30', 'e179']], g: [['think', '179+10', 'e179']], look: [1, -0.2]}, {who: 'hero', x: 740}],
		gfx: [{k: 'tag', t: ['179+6', 'e179'], x: 900, y: 320, text: 'IRIS READS IT 3 TIMES', size: 40, c: '#14112a'}],
	},
	{
		at: '180', place: 'door', pv: {f: 0}, cam: [900, 680, 1.4, 900, 700, 1.8],
		actors: [{who: 'iris', x: 900, sit: true, ex: [['sad', 'flat', '180', 'e180']], g: [['facepalm', '180+30', 'e180']]}, {who: 'hero', x: 700, ex: [['worried', 'flat', '180', 'e180']]}],
		gfx: [{k: 'dim', t: ['180', 'e180'], o: 0.2}],
	},
	{
		at: '181', place: 'door', pv: {f: 0}, cam: [1000, 620, 1.5, 1000, 620, 1.8],
		actors: [{who: 'iris', x: 900, sit: true, face: 1, ex: [['sad', 'frown', '181', 'e181']]}, {who: 'hero', x: 700, ex: [['wide', 'flat', '181', 'e181']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('181+4')} t1={c.R('e181')} x={900} y={380} text="That's why nobody gets out." tx={900} ty={560} size={40} />,
	},
	{
		at: '182', place: 'door', pv: (c: any) => ({f: c.gf, lever: 0.7}), cam: [1130, 600, 1.2, 1200, 600, 1.4],
		actors: [{who: 'iris', x: 950, face: 1, reachTo: [['182+10', '182+70', 1058, 740]], ex: [['normal', 'flat', '182', 'e182']]}, {who: 'hero', x: 800, ex: [['normal', 'flat', '182', 'e182']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fontSize={44} fill="#14112a">
				<text x={1100} y={300} opacity={Math.min(1, c.f / 12)}>SOMEONE HOLDS THE LEVER…</text>
				<text x={1100} y={370} fill="#8a1a1a" opacity={Math.min(1, Math.max(0, c.f - 70) / 12)}>…AND CAN'T GO THROUGH</text>
			</g>
		),
	},
	{
		at: '183', place: 'door', pv: {f: 0}, cam: [900, 560, 1.1, 1500, 560, 1.4],
		actors: [{who: 'hero', x: 1000, look: [1, 0], g: [['think', '183+90', 'e183']], ex: [['worried', 'flat', '183', 'e183']]}, {who: 'iris', x: 830, look: [1, 0]}],
		fx: (c) => <Arrow x={1180} y={470} f={c.gf} c="#14112a" />,
		gfx: [{k: 'tag', t: ['183+6', '183+60'], x: 1500, y: 250, text: 'THE DOOR', size: 40, c: '#14112a'}, {k: 'tag', t: ['183+60', '183+110'], x: 1130, y: 300, text: 'THE LEVER', size: 40, c: '#14112a'}, {k: 'tag', t: ['183+110', 'e183'], x: 830, y: 330, text: 'HER', size: 44, c: '#14112a'}],
	},
	{
		at: '184', place: 'door', pv: {f: 0}, cam: [900, 580, 1.6, 900, 580, 2.0],
		actors: [{who: 'iris', x: 1000, face: -1, g: [['presentF', '184+30', 'e184']], ex: [['sad', 'smile', '184', 'e184']]}, {who: 'hero', x: 780, ex: [['worried', 'flat', '184', 'e184']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('184+6')} t1={c.R('e184')} x={1000} y={360} text="One goes. One stays." tx={1000} ty={520} size={44} />,
	},
	{
		at: '185', place: 'door', pv: {f: 0}, cam: [900, 580, 1.6, 900, 580, 1.9],
		actors: [{who: 'iris', x: 1000, face: -1, g: [['shrug', '185+10', 'e185']], ex: [['sad', 'smile', '185', 'e185']]}, {who: 'hero', x: 780, g: [['stop', '185+10', 'e185']], ex: [['worried', 'open', '185', 'e185']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('185')} t1={c.R('e185')} x={780} y={340} text="We'll figure it out." tx={780} ty={470} size={44} />,
	},
	{
		at: '186', place: 'door', pv: {f: 0}, cam: [1000, 580, 1.9, 1000, 580, 2.3],
		actors: [{who: 'iris', x: 1000, face: -1, g: [['fist', '186+40', 'e186']], ex: [['sad', 'smile', '186', 'e186']], lean: [[-4, '186+10', 'e186']]}, {who: 'hero', x: 780, ex: [['wide', 'open', '186', 'e186']]}],
		gfx: [{k: 'shake', t: ['186+40', 'e186'], amp: 5}, {k: 'tag', t: ['186+30', 'e186'], x: 1000, y: 340, text: 'SMILING · HANDS SHAKING', size: 38, c: '#14112a'}],
	},
	{
		at: '187', place: 'door', pv: {f: 0}, cam: [1000, 580, 1.7, 1000, 580, 2.1],
		actors: [{who: 'iris', x: 1000, face: -1, g: [['presentF', '187+10', 'e187']], ex: [['sad', 'smile', '187', 'e187']]}, {who: 'hero', x: 780, ex: [['worried', 'flat', '187', 'e187']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('187')} t1={c.R('e187')} x={1000} y={340} text="I've had 3 years to figure it out." tx={1000} ty={470} size={36} />,
	},
	{
		at: '188', place: 'door', pv: {f: 0}, cam: [900, 580, 1.4, 900, 580, 1.7],
		actors: [{who: 'iris', x: 1000, face: -1, g: [['point', '188+10', 'e188']], ex: [['normal', 'smile', '188', 'e188']]}, {who: 'hero', x: 780, ex: [['sad', 'frown', '188', 'e188']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('188')} t1={c.R('e188')} x={1000} y={340} text="You go. Your mom's waiting. GO." tx={1000} ty={470} size={38} />,
		gfx: [{k: 'tag', t: ['188+60', 'e188'], x: 1500, y: 180, text: 'MOM · BROTHER · HOME', size: 36, c: '#14112a'}],
	},
	{
		at: '189', place: 'door', pv: {f: 0}, cam: [900, 580, 1.7, 900, 580, 2.0],
		actors: [{who: 'hero', x: 780, g: [['fist', '189+10', '189+80']], ex: [['angry', 'open', '189', '189+90']]}, {who: 'iris', x: 1000, face: -1, g: [['stop', '189+60', 'e189']], ex: [['sad', 'smile', '189', 'e189']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('189')} t1={c.R('189+70')} x={780} y={340} text="I'm not leaving you!" tx={780} ty={470} size={40} />,
		gfx: [{k: 'tag', t: ['189+80', 'e189'], x: 1000, y: 340, text: '"YOU HAVE TO."', size: 40, c: '#14112a'}],
	},
	{
		at: '190', place: 'door', pv: (c: any) => ({f: c.gf, lever: Math.min(1, Math.max(0, (c.f - 40) / 80))}), cam: [900, 620, 1.1, 1100, 640, 1.8],
		actors: [{who: 'hero', x: 700, go: [['190+30', '190+80', 960]], reachTo: [['190+90', 'e190', 1058, 730]], lean: [[14, '190+100', 'e190']], ex: [['angry', 'open', '190+90', 'e190']]}, {who: 'iris', x: 1000, sit: true, ex: [['sad', 'frown', '190', 'e190']]}],
		gfx: [{k: 'big', t: ['190+6', '190+50'], text: '"NO."', c: RED, y: 120, size: 200}],
	},
	{
		at: '191', place: 'door', pv: (c: any) => ({f: c.gf, lever: Math.min(1, c.f / 60)}), cam: [1100, 640, 1.7, 1150, 660, 2.1],
		actors: [{who: 'hero', x: 960, reachTo: [['191', 'e191', 1058, 740]], lean: [[14, '191', 'e191']], ex: [['angry', 'open', '191', 'e191']]}],
		gfx: [{k: 'shake', t: ['191', 'e191'], amp: 10}, {k: 'tag', t: ['191+10', 'e191'], x: 1000, y: 400, text: 'WITH YOUR WHOLE BODY', size: 40, c: '#14112a'}],
	},
	{
		at: '192', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: Math.min(1, c.f / 14)}), cam: [1300, 600, 1.2, 1400, 620, 1.7],
		actors: [{who: 'hero', x: 960, reachTo: [['192', 'e192', 1058, 740]], lean: [[14, '192', 'e192']], ex: [['wide', 'open', '192', 'e192']]}],
		gfx: [{k: 'flash', t: ['192']}, {k: 'big', t: ['192+4', 'e192'], text: 'CLICK!', sub: 'THE DOOR OPENS', c: Y, y: 110, size: 190}],
	},
	{
		at: '193', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 620, 1.3, 1500, 660, 1.8],
		actors: [{who: 'hero', x: 960, reachTo: [['193', 'e193', 1058, 740]], lean: [[14, '193', 'e193']], ex: [['wide', 'smile', '193', 'e193']]}],
		fx: (c) => <Rings x={1560} y={620} f={c.gf} c="#ffe9a0" n={3} r={380} />,
		gfx: [{k: 'tag', t: ['193+10', 'e193'], x: 1500, y: 260, text: 'WARM LIGHT SPILLS IN', size: 44, c: '#8a5a10'}],
	},
	{
		at: '194', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 620, 1.2, 1400, 620, 1.5],
		actors: [{who: 'hero', x: 960, reachTo: [['194', 'e194', 1058, 740]], lean: [[14, '194', 'e194']], ex: [['wide', 'smile', '194', 'e194']], look: [1, 0]}],
		gfx: [{k: 'tag', t: ['194+6', '194+60'], x: 1450, y: 320, text: '*CLINK* A FORK', size: 38, c: '#14112a'}, {k: 'tag', t: ['194+60', '194+110'], x: 1450, y: 400, text: '*HMMMM* THE FRIDGE', size: 38, c: '#14112a'}, {k: 'tag', t: ['194+110', 'e194'], x: 1450, y: 480, text: '*COUGH* SOMEONE', size: 38, c: '#14112a'}],
	},
	{
		at: '195', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1000, 620, 1.4, 900, 620, 1.7],
		actors: [{who: 'hero', x: 960, face: -1, reachTo: [['195', 'e195', 1058, 740]], ex: [['wide', 'open', '195', 'e195']]}, {who: 'iris', x: 760, sit: true, face: 1, ex: [['sad', 'smile', '195', 'e195']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('195+10')} t1={c.R('e195')} x={960} y={330} text="Go through. —What?" tx={960} ty={470} size={38} />,
	},
	{
		at: '196', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1000, 620, 1.5, 900, 620, 1.8],
		actors: [{who: 'iris', x: 760, sit: true, face: 1, g: [['point', '196+20', 'e196']], ex: [['normal', 'smile', '196', 'e196']]}, {who: 'hero', x: 960, face: -1, reachTo: [['196', 'e196', 1058, 740]], ex: [['sad', 'frown', '196', 'e196']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('196+4')} t1={c.R('e196')} x={760} y={440} text="Three years. YOU go." tx={760} ty={600} size={40} />,
	},
	{
		at: '197', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1000, 620, 1.6, 1000, 620, 1.9],
		actors: [{who: 'hero', x: 960, face: -1, reachTo: [['197', 'e197', 1058, 740]], g: [], ex: [['normal', 'smile', '197', 'e197']]}, {who: 'iris', x: 760, sit: true, face: 1, ex: [['wide', 'flat', '197+20', 'e197']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('197')} t1={c.R('197+60')} x={960} y={330} text="I'll hold it." tx={960} ty={470} size={44} />,
	},
	{
		at: '198', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1000, 620, 1.2, 1400, 620, 1.5],
		actors: [{who: 'hero', x: 960, face: -1, reachTo: [['198', 'e198', 1058, 740]], ex: [['wide', 'flat', '198', 'e198']]}, {who: 'iris', x: 760, go: [['198+20', 'e198', 1400]], ex: [['normal', 'smile', '198+30', 'e198']]}],
		gfx: [{k: 'tag', t: ['198+30', 'e198'], x: 1150, y: 300, text: 'FIRST STEPS IN 3 YEARS', size: 40, c: '#14112a'}],
	},
	{
		at: '199', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 600, 1.8, 1400, 600, 2.2],
		actors: [{who: 'iris', x: 1400, face: 1, ex: [['worried', 'flat', '199', 'e199']], g: [['stop', '199+10', 'e199']]}, {who: 'hero', x: 960, reachTo: [['199', 'e199', 1058, 740]], face: -1}],
		gfx: [{k: 'shake', t: ['199+6', '199+16'], amp: 10}, {k: 'tag', t: ['199+10', 'e199'], x: 1400, y: 330, text: 'SHE STOPS…', size: 44, c: '#14112a'}],
	},
	{
		at: '200', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 600, 1.6, 1200, 600, 1.9],
		actors: [{who: 'iris', x: 1400, face: -1, g: [['presentF', '200+30', 'e200']], ex: [['normal', 'smile', '200+10', 'e200']]}, {who: 'hero', x: 960, face: 1, reachTo: [['200', 'e200', 1058, 740]], ex: [['worried', 'flat', '200', 'e200']]}],
		gfx: [{k: 'tag', t: ['200+40', 'e200'], x: 1300, y: 300, text: 'SOMETHING NOBODY SAID IN 100 DAYS', size: 38, c: '#14112a'}],
	},
	{
		at: '201', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1200, 600, 1.8, 1200, 600, 2.2],
		actors: [{who: 'iris', x: 1400, face: -1, g: [['point', '201+10', 'e201']], ex: [['normal', 'smile', '201', 'e201']]}, {who: 'hero', x: 960, reachTo: [['201', 'e201', 1058, 740]], ex: [['wide', 'open', '201+20', 'e201']]}],
		gfx: [{k: 'big', t: ['201+6', 'e201'], text: "DON'T HOLD IT.", sub: 'PULL IT.', c: Y, y: 110, size: 150}],
	},
	{
		at: '202', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1100, 600, 1.3, 1100, 640, 1.6],
		actors: [{who: 'hero', x: 960, g: [['scratch', '202+10', '202+60']], reachTo: [['202+70', 'e202', 1058, 740]], ex: [['worried', 'flat', '202', 'e202']]}, {who: 'iris', x: 1400, face: -1, g: [['point', '202+60', 'e202']]}],
		gfx: [{k: 'tag', t: ['202+6', '202+60'], x: 960, y: 330, text: '"I DON\'T UNDERSTAND"', size: 40, c: '#14112a'}, {k: 'tag', t: ['202+70', 'e202'], x: 1130, y: 330, text: '"LOOK AT THE LEVER"', size: 40, c: '#14112a'}],
	},
	{
		at: '203', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1100, 620, 1.5, 1200, 640, 1.9],
		actors: [{who: 'iris', x: 1400, face: -1, g: [['point', '203+10', 'e203']], ex: [['normal', 'smile', '203', 'e203']]}, {who: 'hero', x: 960, reachTo: [['203', 'e203', 1058, 740]], ex: [['wide', 'flat', '203+30', 'e203']]}],
		gfx: [{k: 'tag', t: ['203+10', 'e203'], x: 1200, y: 300, text: 'HOLD IT DOWN FROM THE OTHER SIDE, TOO', size: 34, c: '#14112a'}],
	},
	{
		at: '204', place: 'void', cam: [960, 540, 1.1, 960, 540, 1.5],
		back: (c) => (
			<g>
				<rect x={700} y={180} width={520} height={720} fill="#fbfbfb" stroke="#d3d0c6" strokeWidth={10} />
				<rect x={1180} y={180} width={40} height={720} fill="#d3d0c6" />
			</g>
		),
		actors: [{who: 'hero', x: 540, ex: [['wide', 'open', '204+40', 'e204']], g: [['point', '204+50', 'e204']]}],
		fx: (c) => (
			<g transform="translate(940,520)">
				<rect x={-30} y={-20} width={60} height={60} rx={10} fill="#3a3e46" />
				<g transform={`rotate(${-Math.min(40, c.f / 2)} 0 0)`}>
					<rect x={-9} y={0} width={18} height={220} rx={7} fill="#7a4a2a" />
					<circle cx={0} cy={220} r={22} fill="#4a2e1a" />
				</g>
			</g>
		),
		gfx: [{k: 'tag', t: ['204+30', 'e204'], x: 940, y: 150, text: 'BACK OF THE DOOR: A SECOND LEVER', size: 38, c: '#14112a'}],
	},
	{
		at: '205', place: 'void', cam: [940, 560, 1.6, 940, 600, 2.0],
		back: (c) => <rect x={700} y={180} width={520} height={720} fill="#fbfbfb" stroke="#d3d0c6" strokeWidth={10} />,
		actors: [{who: 'hero', x: 560, lean: [10, '205', 'e205'], ex: [['wide', 'open', '205', 'e205']]}],
		fx: (c) => (
			<g transform="translate(940,520)">
				<rect x={-30} y={-20} width={60} height={60} rx={10} fill="#3a3e46" />
				<g transform="rotate(-40)">
					<rect x={-9} y={0} width={18} height={220} rx={7} fill="#7a4a2a" />
					<circle cx={0} cy={220} r={22} fill="#4a2e1a" />
				</g>
				<text x={0} y={330} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={54} fill="#14112a" opacity={Math.min(1, Math.max(0, c.f - 50) / 20)}>SMALLER · RUSTY · FACING THE OTHER WAY</text>
			</g>
		),
		gfx: [{k: 'tag', t: ['205+6', 'e205'], x: 940, y: 150, text: 'AND AN ENGRAVING UNDERNEATH…', size: 38, c: '#14112a'}],
	},
	{
		at: '206', place: 'void', cam: [940, 620, 1.7, 940, 640, 2.2],
		back: (c) => <rect x={700} y={180} width={520} height={720} fill="#fbfbfb" stroke="#d3d0c6" strokeWidth={10} />,
		actors: [{who: 'hero', x: 560, ex: [['normal', 'flat', '206', 'e206']], lean: [10, '206', 'e206']}],
		fx: (c) => <Note x={780} y={760} f={c.f} t0={c.R('206+4')} text="…" size={80} c="#14112a" />,
		gfx: [{k: 'tag', t: ['206+6', 'e206'], x: 940, y: 150, text: 'SAME CAREFUL HANDWRITING', size: 38, c: '#14112a'}],
	},
	{
		at: '207', place: 'void', cam: [940, 640, 1.5, 940, 640, 2.0],
		back: (c) => <rect x={700} y={180} width={520} height={720} fill="#fbfbfb" stroke="#d3d0c6" strokeWidth={10} />,
		actors: [{who: 'hero', x: 560, ex: [['wide', 'open', '207', 'e207']], g: [['stop', '207+20', 'e207']]}],
		fx: (c) => <Note x={740} y={740} f={c.f} t0={c.R('207+2')} text="If you go through, turn around." size={68} c="#14112a" />,
		gfx: [{k: 'flash', t: ['207+50']}],
	},
	{
		at: '208', whip: true, place: 'door', pv: {f: 0}, cam: [1000, 600, 1.0, 1000, 600, 1.2],
		actors: [{who: 'hero', x: 700, ex: [['wide', 'open', '208+20', 'e208']]}],
		fx: (c) => (
			<g>
				{[0, 1, 2, 3].map((i) => {
					const u = Math.max(0, (c.f - i * 24) / 90);
					return (
						<g key={i} opacity={Math.min(1, u * 4) * (1 - Math.max(0, u - 0.8) * 5)}>
							<ellipse cx={1160 + u * 460} cy={900} rx={50} ry={9} fill="#000" opacity={0.15} />
							<g transform={`translate(${1160 + u * 460},720) scale(${1 - u * 0.4})`}>
								<circle r={26} cy={-100} fill="#222" />
								<rect x={-18} y={-72} width={36} height={100} rx={12} fill={['#7a5cc4', '#3aa37a', '#2f6fd8', '#d94a3a'][i]} />
								<rect x={-16} y={28} width={9} height={90} fill="#222" />
								<rect x={7} y={28} width={9} height={90} fill="#222" />
							</g>
						</g>
					);
				})}
			</g>
		),
		gfx: [{k: 'tag', t: ['208+6', 'e208'], x: 1000, y: 250, text: 'EVERYONE WHO EVER ESCAPED…', size: 40, c: '#14112a'}],
	},
	{
		at: '209', place: 'door', pv: {f: 0, open: 1}, cam: [1300, 620, 1.4, 1300, 620, 1.7],
		actors: [{who: 'hero', x: 700, g: [['think', '209+30', 'e209']], ex: [['worried', 'flat', '209', 'e209']]}],
		fx: (c) => (
			<g>
				{[0, 1, 2].map((i) => {
					const u = Math.max(0, Math.min(1, (c.f - i * 30) / 70));
					return (
						<g key={i} transform={`translate(${1100 + u * 560},${760 - u * 40}) scale(${1 - u * 0.5})`} opacity={1 - u * u}>
							<circle r={26} cy={-100} fill="#222" />
							<rect x={-18} y={-72} width={36} height={100} rx={12} fill={['#7a5cc4', '#3aa37a', '#2f6fd8'][i]} />
						</g>
					);
				})}
			</g>
		),
		gfx: [{k: 'big', t: ['209+30', 'e209'], text: 'NEVER ONCE LOOKED BACK', c: '#14112a', y: 110, size: 110}],
	},
	{
		at: '210', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 620, 1.2, 1500, 640, 1.6],
		actors: [{who: 'iris', x: 1250, go: [['210+4', '210+50', 1620]], hide: [0, '210+60'], ex: [['wide', 'open', '210+40', '210+60']]}, {who: 'hero', x: 960, face: 1, reachTo: [['210', 'e210', 1058, 740]], ex: [['normal', 'smile', '210', 'e210']]}],
		fx: (c) => <rect x={1330} y={220} width={340} height={680} fill="#ffe7a8" opacity={c.f > 50 ? 0.5 : 0} />,
		gfx: [{k: 'tag', t: ['210+60', 'e210'], x: 1500, y: 300, text: '*GASP*', size: 54, c: '#8a5a10'}],
	},
	{
		at: '211', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1100, 620, 1.2, 1100, 620, 1.4],
		actors: [{who: 'hero', x: 960, face: 1, reachTo: [['211', 'e211', 1058, 740]], g: [], ex: [['wide', 'smile', '211+20', 'e211']], look: [1, 0]}],
		fx: (c) => <Rings x={1600} y={640} f={c.gf} c="#ffe9a0" n={4} r={420} />,
		gfx: [{k: 'tag', t: ['211+10', 'e211'], x: 1450, y: 300, text: 'A WILD, HAPPY SHOUT!', size: 44, c: '#8a5a10'}, {k: 'tag', t: ['211+80', 'e211'], x: 1450, y: 400, text: 'AND THE SOUND OF RUNNING', size: 40, c: '#14112a'}],
	},
	{
		at: '212', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1500, 620, 1.4, 1500, 600, 1.8],
		actors: [{who: 'iris', x: 1850, go: [['212+4', '212+50', 1560]], face: -1, ex: [['sad', 'smile', '212+50', 'e212']], g: [['presentF', '212+70', 'e212']]}, {who: 'hero', x: 960, reachTo: [['212', 'e212', 1058, 740]], ex: [['wide', 'open', '212+30', 'e212']]}],
		gfx: [{k: 'tag', t: ['212+10', 'e212'], x: 1560, y: 330, text: 'SHE COMES BACK…', size: 44, c: '#14112a'}],
	},
	{
		at: '213', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1400, 640, 1.8, 1400, 640, 2.2],
		actors: [{who: 'iris', x: 1560, face: -1, reachTo: [['213', 'e213', 1700, 700, 'F'], ['213', 'e213', 1700, 700, 'B']], ex: [['sad', 'smile', '213', 'e213']]}],
		fx: (c) => (
			<g transform="translate(1700,520)">
				<rect x={-30} y={-20} width={60} height={60} rx={10} fill="#3a3e46" />
				<g transform="rotate(-40)"><rect x={-9} y={0} width={18} height={220} rx={7} fill="#7a4a2a" /></g>
			</g>
		),
		gfx: [{k: 'tag', t: ['213+6', 'e213'], x: 1560, y: 330, text: 'HOLDING THE OUTER LEVER', size: 40, c: '#14112a'}],
	},
	{
		at: '214', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1, open: 1}), cam: [1300, 620, 1.5, 1300, 620, 1.9],
		actors: [{who: 'iris', x: 1560, face: -1, g: [['point', '214+10', 'e214']], ex: [['wide', 'smile', '214', 'e214']]}, {who: 'hero', x: 960, reachTo: [['214', 'e214', 1058, 740]], ex: [['sad', 'smile', '214', 'e214']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('214')} t1={c.R('e214')} x={1560} y={350} text="Go! I've got it. Go home." tx={1560} ty={480} size={38} />,
	},
	{
		at: '215', place: 'door', pv: (c: any) => ({f: c.gf, lever: 1 - Math.min(1, c.f / 20), open: 1}), cam: [1100, 620, 1.4, 1250, 620, 1.7],
		actors: [{who: 'hero', x: 960, go: [['215+10', 'e215', 1200]], ex: [['sad', 'smile', '215', 'e215']]}],
		gfx: [{k: 'tag', t: ['215+6', 'e215'], x: 1100, y: 330, text: 'YOU LET GO', size: 46, c: '#14112a'}],
	},
	{
		at: '216', place: 'door', pv: {f: 0, open: 1}, cam: [1300, 620, 1.3, 1600, 620, 1.7],
		actors: [{who: 'hero', x: 1200, go: [['216+4', '216+60', 1640]], ex: [['wide', 'open', '216+50', 'e216']], hide: [0, '216+110']}, {who: 'iris', x: 1800, face: -1, ex: [['sad', 'smile', '216', 'e216']], hide: [0, '216+110'], g: [['wave', '216+70', 'e216']]}],
		gfx: [{k: 'tag', t: ['216+60', 'e216'], x: 1650, y: 300, text: 'IRIS LETS GO BEHIND YOU', size: 38, c: '#14112a'}],
	},
	{
		at: '217', place: 'door', pv: (c: any) => ({f: c.gf, open: Math.max(0, 1 - c.f / 12)}), cam: [1500, 620, 1.2, 1500, 620, 1.5],
		fx: (c) => <rect x={0} y={0} width={0} height={0} />,
		gfx: [{k: 'shake', t: ['217+10', '217+24'], amp: 24}, {k: 'big', t: ['217+10', 'e217'], text: 'CLICK.', c: '#14112a', y: 120, size: 240}, {k: 'dim', t: ['217+20', 'e217'], o: 0.6}],
	},
	{
		at: '218', whip: true, place: 'living', pv: {portal: 0}, cam: [700, 600, 1.2, 900, 600, 1.4],
		actors: [{who: 'hero', x: 500, face: 1, ex: [['wide', 'open', '218', 'e218']], go: [['218+10', '218+40', 560]], g: [['stop', '218+60', 'e218']]}],
		fx: (c) => <g />,
		gfx: [{k: 'flash', t: ['218']}, {k: 'tag', t: ['218+30', 'e218'], x: 600, y: 330, text: 'JUST A WALL…', size: 44}, {k: 'tag', t: ['218+90', 'e218'], x: 860, y: 330, text: 'BEHIND YOUR LIVING ROOM COUCH', size: 40, c: Y}],
	},
	{
		at: '219', place: 'living', pv: {portal: 0}, cam: [900, 560, 1.4, 1200, 560, 1.7],
		actors: [{who: 'hero', x: 700, ex: [['wide', 'smile', '219', 'e219']], g: [['presentF', '219+10', 'e219']]}],
		fx: (c) => <Rings x={1850} y={560} f={c.gf} c="#ffe9a0" n={3} r={300} />,
		gfx: [{k: 'tag', t: ['219+4', 'e219'], x: 1300, y: 310, text: 'THE WARM LIGHT OF YOUR HOUSE', size: 40, c: '#8a5a10'}],
	},
	{
		at: '220', place: 'living', pv: {portal: 0}, cam: [1000, 560, 1.7, 1000, 560, 2.1],
		actors: [{who: 'hero', x: 900, ex: [['wide', 'smile', '220', 'e220']], lean: [[-8, '220+10', 'e220']]}],
		fx: (c) => (
			<g stroke="#ffd9a0" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8}>
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M${1100 + i * 40},${600 - ((c.f * 2 + i * 30) % 140)} q18,-20 0,-40 q-18,-20 0,-40`} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['220+4', 'e220'], x: 1000, y: 330, text: 'THE AIR SMELLS LIKE LASAGNA', size: 38, c: '#8a5a10'}],
	},
	{
		at: '221', place: 'living', pv: {portal: 0}, cam: [900, 540, 1.8, 900, 520, 2.3],
		actors: [{who: 'hero', x: 700, reachTo: [['221+4', 'e221', 840, 520]], ex: [['wide', 'open', '221+30', 'e221']], look: [1, 0.3]}],
		fx: (c) => <Phone x={870} y={520} text="…" s={1.8} rot={-6} />,
		gfx: [{k: 'tag', t: ['221+10', 'e221'], x: 800, y: 340, text: 'PHONE IN YOUR HAND', size: 40, c: '#fff'}],
	},
	{
		at: '222', place: 'living', pv: {portal: 0}, cam: [900, 540, 1.6, 900, 540, 1.8],
		actors: [{who: 'hero', x: 700, reachTo: [['222', 'e222', 840, 520]], ex: [['wide', 'open', '222', 'e222']]}, {who: 'iris', x: 1000, face: -1, g: [['handsOnHead', '222+60', 'e222']], ex: [['sad', 'open', '222+40', 'e222']], hide: [0, 'e222']}],
		fx: (c) => <Phone x={870} y={520} text="6:43 PM" s={1.8} rot={-6} glow="#9ff0b0" />,
		gfx: [{k: 'big', t: ['222+4', '222+80'], text: '6:43 PM', c: '#9ff0b0', y: 110, size: 200}, {k: 'tag', t: ['222+90', 'e222'], x: 1000, y: 300, text: 'IRIS — SHAKING, LAUGHING, CRYING', size: 38, c: '#fff'}],
	},
	{
		at: '223', place: 'living', pv: {portal: 0}, cam: [900, 580, 1.5, 900, 580, 2.0],
		actors: [{who: 'hero', x: 800, ex: [['wide', 'smile', '223', 'e223']], reachTo: [['223', 'e223', 880, 620]]}, {who: 'iris', x: 960, face: -1, reachTo: [['223', 'e223', 880, 620]], ex: [['sad', 'smile', '223', 'e223']]}],
		gfx: [{k: 'tag', t: ['223+6', 'e223'], x: 880, y: 330, text: 'STILL HOLDING HANDS', size: 44, c: '#ffe9a0'}],
	},
	{
		at: '224', place: 'living', pv: {portal: 0}, cam: [900, 560, 1.2, 900, 540, 1.5],
		actors: [{who: 'hero', x: 780, g: [['shrug', '224+20', 'e224']], ex: [['normal', 'smile', '224', 'e224']]}, {who: 'iris', x: 1020, face: -1, ex: [['normal', 'smile', '224', 'e224']], g: [['think', '224+40', 'e224']]}],
		gfx: [{k: 'tag', t: ['224+6', '224+50'], x: 780, y: 300, text: 'DIRTY HAIR', size: 38}, {k: 'tag', t: ['224+50', '224+100'], x: 960, y: 250, text: 'RAGGED CLOTHES', size: 38}, {k: 'tag', t: ['224+100', 'e224'], x: 900, y: 300, text: 'THINNER ARMS', size: 38}],
	},
	{
		at: '225', place: 'living', pv: {portal: 0}, cam: [900, 560, 1.6, 900, 560, 1.9],
		actors: [{who: 'hero', x: 780, ex: [['wide', 'open', '225', 'e225']], g: [['handsOnHead', '225+10', 'e225']]}, {who: 'iris', x: 1020, face: -1, ex: [['wide', 'open', '225', 'e225']]}],
		gfx: [{k: 'big', t: ['225+4', 'e225'], text: '100 DAYS GONE', c: Y, y: 110, size: 150}],
	},
	{
		at: '226', whip: true, place: 'kitchen', cam: [1000, 560, 1.4, 1000, 560, 1.7],
		actors: [{who: 'mom', x: 1000, face: -1, ex: [['normal', 'smile', '226', 'e226']], g: [['armsCrossed', '226+10', 'e226']]}],
		fx: (c) => <Clock x={1400} y={330} r={90} f={c.f} speed={3} />,
		gfx: [{k: 'big', t: ['226+4', 'e226'], text: 'MOM WAITED 1 MINUTE', c: '#ffe9a0', y: 110, size: 110}],
	},
	{
		at: '227', place: 'kitchen', cam: [1000, 700, 1.6, 1000, 700, 2.0],
		actors: [{who: 'mom', x: 1400, face: -1, g: [['wave', '227+20', 'e227']], ex: [['normal', 'smile', '227', 'e227']]}],
		fx: (c) => (
			<g transform="translate(850,640)">
				<ellipse cx={0} cy={0} rx={130} ry={26} fill="#fff" stroke="#c9c9d3" strokeWidth={5} />
				<rect x={-60} y={-16} width={120} height={24} rx={8} fill="#ffb35a" />
				<rect x={-60} y={-24} width={120} height={14} rx={7} fill="#d94a3a" />
				<g stroke="#ffd9a0" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8}>
					{[0, 1, 2].map((i) => (
						<path key={i} d={`M${-40 + i * 40},-30 q12,-20 0,-40 q-12,-20 0,-40`} />
					))}
				</g>
			</g>
		),
		gfx: [{k: 'tag', t: ['227+6', 'e227'], x: 880, y: 450, text: 'A PLATE WITH YOUR NAME', size: 40, c: '#8a5a10'}],
	},
	{
		at: '228', place: 'living', pv: {portal: 0}, cam: [900, 560, 1.8, 900, 560, 2.2],
		actors: [{who: 'hero', x: 780, face: 1, look: [1, 0], ex: [['sad', 'smile', '228', 'e228']]}, {who: 'iris', x: 1000, face: -1, look: [-1, 0], ex: [['sad', 'smile', '228', 'e228']]}],
		gfx: [{k: 'tag', t: ['228+20', 'e228'], x: 900, y: 340, text: 'NOTHING YOU CAN SAY', size: 44, c: '#fff'}, {k: 'dim', t: ['228+100', 'e228'], o: 0.25}],
	},
	{
		at: '229', place: 'void', cam: [960, 520, 1.0, 960, 500, 1.2],
		actors: [{who: 'hero', x: 780, s: 1, ex: [['normal', 'smirk', '229', 'e229']], g: [['point', '229+30', 'e229']]}, {who: 'iris', x: 1120, s: 1, face: -1, ex: [['normal', 'smirk', '229', 'e229']], g: [['point', '229+40', 'e229']]}],
		gfx: [{k: 'big', t: ['229+4', 'e229'], text: 'WOULD YOU HAVE GONE BACK', sub: 'FOR SOMEONE YOU BARELY KNEW?', c: '#7fd0ff', y: 100, size: 100}],
	},
	{
		at: '230', place: 'void', cam: [960, 520, 1.0, 960, 500, 1.25],
		actors: [{who: 'iris', x: 780, ex: [['wide', 'open', '230', 'e230']], g: [['shrug', '230+20', 'e230']]}, {who: 'hero', x: 1120, face: -1, g: [['think', '230+30', 'e230']]}],
		gfx: [{k: 'big', t: ['230+4', 'e230'], text: 'IF YOU WERE IRIS…', sub: 'WOULD YOU LET HIM GO FIRST?', c: '#ffd9a0', y: 100, size: 100}],
	},
	{
		at: '231', place: 'void', cam: [960, 520, 1.0, 960, 500, 1.2],
		actors: [{who: 'hero', x: 780, g: [['wave', '231+10', 'e231']], ex: [['wide', 'smile', '231', 'e231']]}, {who: 'iris', x: 1120, face: -1, g: [['wave', '231+20', 'e231']], ex: [['wide', 'smile', '231', 'e231']]}],
		gfx: [{k: 'big', t: ['231', 'e231'], text: 'TELL US IN THE COMMENTS', c: '#fff26a', y: 120, size: 100}],
	},
	{
		at: '232', whip: true, place: 'living', pv: {portal: 0}, cam: [900, 560, 1.4, 1100, 560, 1.7],
		actors: [{who: 'hero', x: 700, ex: [['wide', 'open', '232+40', 'e232']], g: [['stop', '232+50', 'e232']]}, {who: 'iris', x: 900, face: -1, hide: [0, 0]}],
		gfx: [{k: 'tag', t: ['232+10', 'e232'], x: 1000, y: 330, text: 'JUST WHEN YOU THINK IT\'S OVER…', size: 40, c: '#fff'}],
	},
	{
		at: '233', place: 'living', pv: {portal: 0}, cam: [1100, 580, 1.4, 1500, 580, 1.7],
		actors: [{who: 'hero', x: 800, face: 1, look: [1, 0], ex: [['wide', 'flat', '233', 'e233']]}, {who: 'mom', x: 1830, s: 0.9, face: -1, hide: ['233+10', 'e233'], g: [['wave', '233+30', 'e233']]}],
		fx: (c) => <Rings x={1760} y={560} f={c.gf} c="#ffe9a0" n={3} r={300} />,
		gfx: [{k: 'tag', t: ['233+10', 'e233'], x: 1600, y: 330, text: "FROM THE KITCHEN: MOM'S VOICE", size: 38, c: '#8a5a10'}],
	},
	{
		at: '234', place: 'living', pv: {portal: 0}, cam: [1300, 580, 1.4, 1600, 580, 1.7],
		actors: [{who: 'mom', x: 1830, face: -1, g: [['wave', '234', 'e234']], ex: [['normal', 'open', '234', 'e234']]}, {who: 'hero', x: 1000, face: 1, look: [1, 0], ex: [['wide', 'smile', '234', 'e234']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('234')} t1={c.R('e234')} x={1600} y={340} text="Dinner's ready, buddy." tx={1780} ty={480} size={44} />,
	},
	{
		at: '235', place: 'living', pv: (c: any) => ({portal: 1, f: c.gf}), cam: [1000, 640, 1.2, 1020, 700, 1.9],
		actors: [{who: 'hero', x: 900, face: -1, look: [1, 0], ex: [['wide', 'flat', '235+20', 'e235']], g: [['stop', '235+40', 'e235']], lean: [[-10, '235+40', 'e235']]}],
		fx: (c) => <Rings x={1020} y={760} f={c.gf} c="#ffe9a0" n={4} r={340} />,
		gfx: [{k: 'tag', t: ['235+20', 'e235'], x: 1020, y: 500, text: 'FROM INSIDE THE WALL…', size: 44, c: RED}, {k: 'dim', t: ['235+50', 'e235'], o: 0.3}],
	},
	{
		at: '236', place: 'living', pv: (c: any) => ({portal: 1, f: c.gf}), cam: [1020, 680, 1.6, 1020, 700, 2.1],
		actors: [{who: 'hero', x: 800, face: 1, look: [1, 0], ex: [['wide', 'open', '236+10', 'e236']], g: [['handsOnHead', '236+40', 'e236']]}],
		fx: (c) => (
			<g>
				<Rings x={1020} y={760} f={c.gf} c="#ff5a5a" n={4} r={380} />
				<Speech f={c.f} t0={c.R('236')} t1={c.R('236+60')} x={1140} y={440} text="Dinner's ready." tx={1020} ty={680} size={44} c="#ff5a5a" />
			</g>
		),
		gfx: [{k: 'shake', t: ['236+60', 'e236'], amp: 12}, {k: 'tag', t: ['236+70', 'e236'], x: 1020, y: 330, text: 'IT FINISHES THE SENTENCE', size: 40, c: RED}],
	},
	{
		at: '237', place: 'living', pv: (c: any) => ({portal: 1, f: c.gf}), cam: [1020, 680, 1.4, 1020, 680, 2.4],
		actors: [{who: 'hero', x: 800, face: 1, look: [1, 0], ex: [['wide', 'open', '237', 'e237']], g: [['handsOnHead', '237+10', 'e237']]}],
		fx: (c) => <Rings x={1020} y={760} f={c.gf} c="#ff5a5a" n={5} r={420} />,
		gfx: [{k: 'big', t: ['237', 'e237'], text: '"…BUDDY."', c: '#ff5a5a', y: 110, size: 240}, {k: 'dim', t: ['237+20', 'e237'], o: 0.2}, {k: 'tag', t: ['237+30', 'e237'], x: 1020, y: 940, text: 'LIKE + SUBSCRIBE FOR PART 2', size: 48, c: '#fff'}],
	},
];
