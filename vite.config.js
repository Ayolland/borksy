import mdPlugin, { Mode } from 'vite-plugin-markdown';
import strPlugin from 'vite-plugin-string';

/** @type {import('vite').UserConfig} */
export default {
	root: 'src',
	base: './',
	build: {
		outDir: '../docs',
		emptyOutDir: true,
	},
	plugins: [
		strPlugin({
			include: ['**/*.txt', '**/*.hbs'],
			compress: false,
		}),
		mdPlugin({
			mode: Mode.HTML,
		}),
	],
};
