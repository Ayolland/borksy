import visualizer from 'rollup-plugin-visualizer';
import mdPlugin, { Mode } from 'vite-plugin-markdown';
import strPlugin from 'vite-plugin-string';

/** @type {() => import('vite').UserConfig} */
export default ({ command }) => ({
	root: 'src',
	base: './',
	build: {
		outDir: '../docs',
		emptyOutDir: true,
		rollupOptions: command === 'build' && {
			plugins: [visualizer({ open: true })],
		},
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
});
