const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({
	toMatchImageSnapshot,
});
jest.setTimeout(40000);
