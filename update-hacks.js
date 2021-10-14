const { execSync } = require('child_process');
const fs = require('fs');

execSync('npm i @bitsy/hecks@latest');
execSync('rm src/hacks/*');
execSync('cp node_modules/@bitsy/hecks/dist/*.js src/hacks');

const files = fs.readdirSync('src/hacks');
files.forEach(i => {
	fs.renameSync(`src/hacks/${i}`, `src/hacks/${i}`.replace('.js', '.txt'));
});
fs.writeFileSync(
	'src/hacks/index.js',
	`// NOTE: This is a generated file; use \`npm run update-hacks\` instead of updating it manually

	${files.map(i => `import ${i.replace(/-/g, '').replace('.js', '')} from './${i.replace('.js', '.txt')}';`).join('\n')}

export default [${files.map(i => i.replace(/-/g, '').replace('.js', '')).join(', ')}]`,
	{ encoding: 'utf-8' }
);
execSync('prettier src/hacks/index.js --write');
