const { setup } = require('jest-dev-server');

module.exports = async () => {
	await setup({
		command: 'npm run serve -- --port 5000',
		host: 'localhost',
		protocol: 'http',
		port: 5000,
		launchTimeout: 10000,
	});
};
