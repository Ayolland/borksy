const { setup } = require('jest-dev-server');

module.exports = async () => {
	await setup({
		command: 'npm run serve',
		protocol: 'http',
		port: 5000,
	});
};
