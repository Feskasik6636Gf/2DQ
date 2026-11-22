import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Long, LONG_FRAMES} from './Long';
import {Short, SHORT_FRAMES} from './Short';
import {Sheet, SheetProps, sheetSize} from './Sheet';
import {PauseTime} from './reference/PauseTime';
import {WorldTour, WORLD_TOUR_FRAMES} from './reference/WorldTour';
import {AnimalTest} from './story/AnimalTest';
import {FxReel, FX_REEL_FRAMES} from './reference/FxReel';

/* open-licence fonts from public/fonts: loaded inside the composition (a module-level delayRender
   timed out after ~2 minutes on long renders) */
const FONTS: [string, string, string][] = [
	['Rubik', 'fonts/Rubik.ttf', '300 900'],
	['Caveat', 'fonts/Caveat.ttf', '400 700'],
];
let fontsPromise: Promise<unknown> | null = null;
const loadFonts = () =>
	(fontsPromise ??= Promise.all(
		FONTS.map(([family, file, weight]) => {
			const f = new FontFace(family, `url(${staticFile(file)})`, {weight});
			document.fonts.add(f);
			return f.load();
		}),
	).catch(() => undefined));
const Fonts: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [h] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 90000}));
	useEffect(() => {
		loadFonts().then(() => continueRender(h));
	}, [h]);
	return <>{children}</>;
};
const LongF: React.FC = () => (
	<Fonts>
		<Long />
	</Fonts>
);
const ShortF: React.FC = () => (
	<Fonts>
		<Short />
	</Fonts>
);

// headings are heavy unless a text asks for another weight (the style's chunky lettering)
const css = document.createElement('style');
css.textContent = `text[font-family*="Rubik"]:not([font-weight]){font-weight:800}`;
document.head.appendChild(css);

const defaultSheet: SheetProps = {comp: 'Long', frames: [0, 30, 60, 90], cols: 4};

export const Root: React.FC = () => (
	<>
		<Composition id="Long" component={LongF} durationInFrames={Math.max(1, LONG_FRAMES)} fps={30} width={1920} height={1080} />
		<Composition id="Short" component={ShortF} durationInFrames={Math.max(1, SHORT_FRAMES)} fps={30} width={1080} height={1920} />
		<Composition
			id="Sheet"
			component={Sheet}
			// as long as the videos: frozen scenes keep their Sequences alive
			durationInFrames={Math.max(LONG_FRAMES, SHORT_FRAMES, 1)}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={defaultSheet}
			calculateMetadata={({props}) => {
				const s = sheetSize(props);
				return {width: s.width, height: Math.ceil(s.height / 2) * 2};
			}}
		/>
		{/* the approved style reference: 10 s, built by hand, shows what "our level" means */}
		<Composition id="Reference" component={PauseTime} durationInFrames={300} fps={30} width={1920} height={1080} />
		{/* the world library: five living locations with the hero and a friend */}
		{/* every effect of the library with its sound name */}
		<Composition id="Fx" component={FxReel} durationInFrames={FX_REEL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="World" component={WorldTour} durationInFrames={WORLD_TOUR_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="AnimalTest" component={AnimalTest} durationInFrames={90} fps={30} width={1920} height={1080} />
	</>
);
