const { setup } = require('jest-dev-server');

module.exports = async () => {
	await setup({
		command: 'npx http-server --cors -c-1 -p 5000 ./docs',
		protocol: 'http',
		port: 5000,
	});
};
