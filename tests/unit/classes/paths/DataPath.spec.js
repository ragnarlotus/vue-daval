import DataPath from '@/classes/paths/DataPath.js';
import UndefinedPath from '@/classes/paths/UndefinedPath.js';

describe('DataPath class', () => {
	let vm, dataPath;

	window.console.error = jest.fn();

	beforeEach(() => {
		vm = {
			$vd: {
				$getConfig: jest.fn(),
				$getMessage: jest.fn()
			},
			$watch: jest.fn()
		};

		dataPath = {
			$getRules: jest.fn()
		};
	});

	it('creates a watcher if validateOnType set true', () => {
		vm.$vd.$getConfig.mockReturnValue(true);

		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(vm.$watch).toHaveBeenCalled();
	});

	it('does not creates a watcher if validateOnType set false', () => {
		vm.$vd.$getConfig.mockReturnValue(false);

		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(vm.$watch).not.toHaveBeenCalled();
	});

	it('creates a result if no childs', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.$result).toBeDefined();
		expect(Object.keys(dataPath.$childs).length).toBe(0);
	});

	it('does not creates a result if childs', () => {
		dataPath = new DataPath(vm, 'key', ['data'], {});

		expect(dataPath.$result).toBeInstanceOf(UndefinedPath);
		expect(Object.keys(dataPath.$childs).length).toBe(1);
	});

	it('returns a property if owns it', () => {
	});

	it('returns $validated if has rules', () => {
	});

	it('returns $hasError if has rules', () => {
	});

	it('returns $error if has rules', () => {
	});

	it('returns $errors if has rules', () => {
	});

	it('returns a rule if has rules', () => {
	});

	it('returns $errors recursively', () => {
	});

	it('returns a child', () => {
	});

	it('returns UndefinedPath if no valid property', () => {
	});

	it('gets the proxy target', () => {
	});

	it('creates childs when object data', () => {
	});

	it('creates childs when array data', () => {
	});

	it('does not create childs when not object nor array data', () => {
	});

	it('unwatches the existing watcher when creating the watcher', () => {
	});

	it('does not creates the watcher if root of data', () => {
	});

	it('adds watchers recursively', () => {
	});

	it('$updateChilds', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('', () => {
	});

	it('returns the full path', () => {
	});

	it('deletes itself and childs', () => {
	});

});
