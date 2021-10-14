import mdPlugin, { Mode } from 'vite-plugin-markdown';
import strPlugin from 'vite-plugin-string';

export default {
	root: 'src',
	base: './',
	build: {
		outDir: '../docs',
		emptyOutDir: true,
	},
	plugins: [
		strPlugin({
			include: ['**/*.txt'],
			compress: false,
		}),
		mdPlugin({
			mode: Mode.HTML,
		}),
	],
};
