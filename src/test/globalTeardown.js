const { teardown } = require('jest-dev-server');

module.exports = async () => {
	await teardown();
};
