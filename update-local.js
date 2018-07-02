// downloads hack repo from github.
// copies the hacks to borksy's hack component,
// then deletes the hack repo
const downloadGitRepo = require('download-git-repo');
const fs = require('fs');
const {
	join,
	basename
} = require('path');
const rimraf = require('rimraf');

const tempDir = './temp';
const hackRepo = 'seleb/bitsy-hacks#master';
const targetDir = './src/components/hacks/hacks';
const localHacksFile = join(targetDir, 'localHacks.js');


function download(repo, dest) {
	return new Promise((resolve, reject) => {
		downloadGitRepo(repo, dest, function (err) {
			if (err) {
				reject(err)
			}
			console.log(`downloaded "${repo}" to "${dest}"`);
			resolve();
		})
	});
}

async function main() {
	// safety first
	if (fs.existsSync(tempDir)) {
		throw new Error(`temp directory "${tempDir}" already exists; delete this before trying to update-local`);
	}

	try {
		// download repo to temp dir
		await download(hackRepo, tempDir);

		// copy temp files to src
		const hackDir = join(tempDir, 'dist');
		const files = fs.readdirSync(hackDir);
		files.forEach(file =>
			fs.copyFileSync(join(hackDir, file), join(targetDir, basename(file)))
		);
		console.log(`copied ${files.length} hacks to "${targetDir}"`);
		// create localHacks file for importing in borksy

		const string = `// this is an auto-generated file!
// you probably want to check update-local.js instead of changing it directly
${files.map((file,idx)=>`import hack${idx} from 'raw-loader!./${file}';`).join('\n')}

export default {
${files.map((file,idx)=>`	'${encodeURIComponent(file)}': hack${idx}`).join(',\n')}
};`;
		fs.writeFileSync(localHacksFile, string);
		console.log(`wrote "${localHacksFile}"`);
	} catch (err) {
		throw err;
	} finally {
		// remove temp dir
		rimraf.sync(tempDir);
		console.log(`removed "${tempDir}"`);
	}
}

main()
	.then(() => console.log('✓ update-local complete'))
	.catch(error => console.error('x update-local failed\n', error));
