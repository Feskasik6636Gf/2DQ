import React from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Long, LONG_FRAMES} from './Long';
import {Short, SHORT_FRAMES} from './Short';
import {Sheet, SheetProps, sheetSize} from './Sheet';
import {PauseTime} from './reference/PauseTime';

/* open-licence fonts from public/fonts. Plain CSS @font-face (no delayRender: a stuck font
   handle froze long renders). The family is also requested up front so the first frame has it. */
const fontCss = document.createElement('style');
fontCss.textContent = [
	['Rubik', 'fonts/Rubik.ttf', '300 900'],
	['Caveat', 'fonts/Caveat.ttf', '400 700'],
]
	.map(([family, file, weight]) => `@font-face{font-family:'${family}';src:url(${staticFile(file)}) format('truetype');font-weight:${weight};font-display:block}`)
	.join('\n');
document.head.appendChild(fontCss);
const fontsReady = delayRender('fonts', {timeoutInMilliseconds: 7200000});
Promise.all([document.fonts.load("800 40px Rubik"), document.fonts.load("400 40px Rubik"), document.fonts.load("700 40px Caveat")]).then(
	() => continueRender(fontsReady),
	() => continueRender(fontsReady),
);

// headings are heavy unless a text asks for another weight (the style's chunky lettering)
const css = document.createElement('style');
css.textContent = `text[font-family*="Rubik"]:not([font-weight]){font-weight:800}`;
document.head.appendChild(css);

const defaultSheet: SheetProps = {comp: 'Long', frames: [0, 30, 60, 90], cols: 4};

export const Root: React.FC = () => (
	<>
		<Composition id="Long" component={Long} durationInFrames={Math.max(1, LONG_FRAMES)} fps={30} width={1920} height={1080} />
		<Composition id="Short" component={Short} durationInFrames={Math.max(1, SHORT_FRAMES)} fps={30} width={1080} height={1920} />
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
	</>
);
