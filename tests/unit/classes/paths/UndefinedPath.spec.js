import UndefinedPath from '@/classes/paths/UndefinedPath.js';

describe('UndefinedPath class', () => {
	let undefinedPath;

	window.console.error = jest.fn();

	it('accepts any property and consoles error', () => {
		undefinedPath = new UndefinedPath('any');

		expect(undefinedPath.property).toBeInstanceOf(UndefinedPath);

		expect(console.error.mock.calls[0][0]).toContain('any');
		expect(console.error.mock.calls[1][0]).toContain('any.property');
	});

	it('returns empty string if vue-daval property', () => {
		undefinedPath = new UndefinedPath('any');

		expect(undefinedPath.$property).toBe('');
	});

});
