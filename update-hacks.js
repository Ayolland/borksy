const { execSync } = require('child_process');
const fs = require('fs');

execSync('npm i @bitsy/hecks@latest');
execSync('rm src/hacks/*');
execSync('cp node_modules/@bitsy/hecks/dist/*.js src/hacks');

const files = fs.readdirSync('src/hacks');
files.forEach(i => {
	fs.renameSync(`src/hacks/${i}`, `src/hacks/${i}`.replace('.js', '.txt'));
});
