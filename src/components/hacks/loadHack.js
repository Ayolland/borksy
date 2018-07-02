import localHacks from './hacks/localHacks';

/**
 * Normalizes the process of loading a hack from github or local files
 *
 * @param {Object} hacks Object describing hacks
 * @returns {Promise} Resolves with an object containing:
 *  - hackFile: string with the contents of the file
 *  - isLocal: boolean, true when local file was returned
 */
export default async function loadHack(hackInfo) {
	var result = {};
	if (hackInfo.forceLocal !== false) {
		result.hackFile = loadThisHackLocally(hackInfo.github);
		result.isLocal = true;
	} else if (hackInfo.github !== false) {
		try {
			result.hackFile = await loadThisHackFromGithub(hackInfo.github);
			result.isLocal = false;
		} catch (error) {
			console.error('Couldn\'t load hack "' + hackInfo.title + '" from github, trying local', error);
			result.hackFile = await loadThisHackLocally(hackInfo.github);
			result.isLocal = true;
		}
	} else {
		throw new Error('Couldn\'t load hack "' + hackInfo.title + '"');
	}
	return result;
}


function loadThisHackLocally(filename) {
	return localHacks[filename];
}

async function loadThisHackFromGithub(filename) {
	var pathToDir = "https://raw.githubusercontent.com/seleb/bitsy-hacks/master/dist/";
	var response = await fetch(pathToDir + filename);
	return response.text();
}
