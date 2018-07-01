export default function parseHack(hackFile) {
	var header = /^(\/\*[\S\s]*?\*\/)$/m.exec(hackFile)[1];
	var options = (/^var\s+hackOptions\s?=\s?{([\s\S]*?)^};$/m.exec(hackFile) || {})[1];

	var emoji = /^\/\*\*\s*([^]+?)$/m.exec(header)[1];
	var file = /^@file\s*(.*)?$/m.exec(header)[1];
	var summary = /^@summary\s*(.*)?$/m.exec(header)[1];
	var license = (/^@license\s*(.*)?$/m.exec(header) || {})[1];
	var version = /^@version\s*(.*)?$/m.exec(header)[1];
	var author = /^@author\s*(.*)?$/m.exec(header)[1];
	var description = /^@description\s*([^]*?)\*\/$/m.exec(header)[1];

	return {
		header,
		options,
		emoji,
		file,
		summary,
		license,
		version,
		author,
		description,
	};
}
