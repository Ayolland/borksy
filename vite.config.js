import mdPlugin, { Mode } from 'vite-plugin-markdown';

export default {
	root: 'src',
	base: './',
	build: {
		outDir: '../docs',
		emptyOutDir: true,
	},
	plugins: [
		mdPlugin({
			mode: Mode.HTML,
		}),
	],
};
