const { setup } = require('jest-dev-server');

module.exports = async () => {
	await setup({
		command: 'npm run serve -- --port 5000',
		protocol: 'http',
		port: 5000,
	});
};
