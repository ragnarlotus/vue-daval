import * as Utils from '@/libraries/Utils.js';
import DataPath from '@/classes/paths/DataPath.js';
import UndefinedPath from '@/classes/paths/UndefinedPath.js';
import Result from '@/classes/Result.js';

describe('DataPath class', () => {
	let vm, dataPath, taskResult, onSuccess, onError;

	beforeEach(() => {
		window.console.error = jest.fn();

		taskResult = new Promise((resolve, reject) => {
			onSuccess = resolve;
			onError = reject;
		});

		vm = {
			$vd: {
				$addTask: jest.fn().mockReturnValue({
					promise: taskResult
				}),
				$getConfig: jest.fn(),
				$getMessage: jest.fn()
			},
			$watch: jest.fn().mockReturnValue(jest.fn())
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

	it('returns a property if owned', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.$key).toBe('key');
	});

	it('returns $validated if has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test: 'test'
		});

		dataPath.$result.validated = true;

		expect(dataPath.$validated).toBe(true);
	});

	it('returns $hasError if has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test: 'test'
		});

		dataPath.$result.hasError = jest.fn().mockReturnValue(false);

		expect(dataPath.$hasError).toBe(false);
		expect(dataPath.$result.hasError).toHaveBeenCalled();
	});

	it('returns $error if has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test: 'test'
		});

		dataPath.$result.error = 'resultado test';

		expect(dataPath.$error).toBe('resultado test');
	});

	it('returns $errors if has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test1: 'test1',
			test2: 'test2'
		});

		dataPath.$result.getErrors = jest.fn().mockReturnValue([
			'resultado test1',
			'resultado test2'
		]);

		expect(dataPath.$errors).toEqual([
			'resultado test1',
			'resultado test2'
		]);
		expect(dataPath.$result.getErrors).toHaveBeenCalled();
	});

	it('returns a rule if has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test: 'test'
		});

		expect(dataPath.test).toBe('test');
	});

	it('returns $errors recursively', () => {
		dataPath = new DataPath(vm, 'key', {
			data1: 'data1',
			data2: {
				data21: 'data21'
			}
		}, {
			data1: {
				test1: 'test1'
			},
			data2: {
				data21: {
					test2: 'test2'
				}
			}
		});

		dataPath.data1.$errors = ['test1 error'];
		dataPath.data2.data21.$errors = ['test2 error'];

		expect(dataPath.$errors).toEqual({
			data1: ['test1 error'],
			data2: {
				data21: ['test2 error']
			}
		});
	});

	it('returns a child', () => {
		dataPath = new DataPath(vm, 'key', {
			asdf: 'asdf'
		}, {
			asdf: {}
		});

		expect(dataPath.asdf.$data).toBe('asdf');
	});

	it('returns UndefinedPath if no valid property', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.any).toBeInstanceOf(UndefinedPath);
		expect(console.error.mock.calls[0][0]).toContain('any');
	});

	it('gets the proxy target', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.$getTarget()).toBeInstanceOf(DataPath);
	});

	it('creates childs when object data', () => {
		dataPath = new DataPath(vm, 'key', {
			data1: 'data1'
		}, {
			data1: {}
		});

		expect(dataPath.$childs.data1).toBeDefined();
	});

	it('does not creates childs if has no tests or data', () => {
		dataPath = new DataPath(vm, 'key', {
			data1: 'data1'
		}, {});

		expect(dataPath.$childs.data1).toBeUndefined();

		dataPath = new DataPath(vm, 'key', {
			data2: 'data2'
		}, {
			data1: {}
		});

		expect(dataPath.$childs.data1).toBeUndefined();
	});

	it('creates childs when array data', () => {
		dataPath = new DataPath(vm, 'key', ['data1'], {
			data1: {}
		});

		expect(dataPath.$childs[0]).toBeDefined();
	});

	it('does not create childs when not object nor array data', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.$createChilds()).toBe(false);
		expect(dataPath.$childs).toEqual({});
	});

	it('unwatches the existing watcher when creating the watcher', () => {
		dataPath = new DataPath(vm, '', {}, {});
		dataPath.$watcher = jest.fn();

		dataPath.$createWatcher();

		expect(dataPath.$watcher).toBeUndefined();
	});

	it('does not creates the watcher if root of data', () => {
		dataPath = new DataPath(vm, '', {}, {});

		dataPath.$createWatcher();

		expect('$watcher' in dataPath).toBe(false);
	});

	it('adds watchers recursively', () => {
		dataPath = new DataPath(vm, 'key', {
			asdf: 'asdf'
		}, {
			asdf: {}
		});

		dataPath.$createWatcher(true);

		expect(dataPath.asdf.$watcher.mock).toBeDefined();
	});

	it('creates the watcher with the correct path', () => {
		dataPath = new DataPath(vm, 'key', {
			asdf: 'asdf'
		}, {
			asdf: {
				test: 'test'
			}
		});

		dataPath.$createWatcher(true);

		expect(vm.$watch.mock.calls[0][0]).toBe('key.asdf');
	});

	it('assigns the new value when data modified', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});
		dataPath.$createWatcher();

		let cb = vm.$watch.mock.calls[0][1];
		cb('new data');

		expect(dataPath.$data).toBe('new data');
	});

	it('triggers validate when data changed', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});
		dataPath.$createWatcher();

		dataPath.$validate = jest.fn();

		let cb = vm.$watch.mock.calls[0][1];
		cb('new data');

		expect(dataPath.$validate).toHaveBeenCalled();
	});

	it('updates childs if array length changed', () => {
		vm.$vd.$getConfig.mockReturnValue(true);
		dataPath = new DataPath(vm, 'key', ['data'], {});

		dataPath.$updateChilds = jest.fn();

		let cb = vm.$watch.mock.calls[0][1];

		dataPath.$data.push('new data');
		cb(['data', 'new data']);

		expect(dataPath.$updateChilds).toHaveBeenCalled();
	});

	it('update childs if array of objects changed', () => {
		vm.$vd.$getConfig.mockReturnValue(true);
		dataPath = new DataPath(vm, 'key', [{}, {}], {});

		dataPath.$updateChilds = jest.fn();

		let cb = vm.$watch.mock.calls[0][1];

		dataPath.$data[1] = {};
		cb();

		expect(dataPath.$updateChilds).toHaveBeenCalled();
	});

	it('update childs if array of arrays changed', () => {
		vm.$vd.$getConfig.mockReturnValue(true);
		dataPath = new DataPath(vm, 'key', [[], []], {});

		dataPath.$updateChilds = jest.fn();

		let cb = vm.$watch.mock.calls[0][1];

		dataPath.$data[1] = [];
		cb();

		expect(dataPath.$updateChilds).toHaveBeenCalled();
	});

	it('does not update childs if array data changed and are not objects nor arrays', () => {
		vm.$vd.$getConfig.mockReturnValue(true);
		dataPath = new DataPath(vm, 'key', ['data'], {});

		dataPath.$updateChilds = jest.fn();

		let cb = vm.$watch.mock.calls[0][1];

		dataPath.$data[0] = 'new data';
		cb(['data'], ['new data']);

		expect(dataPath.$updateChilds).not.toHaveBeenCalled();
	});

	it('updates childs managing watchers', () => {
		vm.$vd.$getConfig.mockReturnValue(true);

		let data = [{}, {}];
		dataPath = new DataPath(vm, 'key', data, {});

		dataPath.$data.push({});
		dataPath.$data.splice(0, 1, data[1]);
		dataPath.$data.splice(1, 1, data[0]);
		dataPath.$updateChilds();

		expect(Object.keys(dataPath.$childs).length).toBe(3);
		expect(dataPath.$childs[0].$data).toBe(data[1]);
		expect(dataPath.$childs[1].$data).toBe(data[0]);

		expect(dataPath.$childs[0].$watcher).toHaveBeenCalled();
		expect(dataPath.$childs[1].$watcher).toHaveBeenCalled();
	});

	it('deletes own watcher', () => {
		vm.$vd.$getConfig.mockReturnValue(true);

		dataPath = new DataPath(vm, 'key', 'data', {});
		dataPath.$deleteWatcher();

		expect(dataPath.$watcher).toBeUndefined();
	});

	it('deletes own and child watchers', () => {
		vm.$vd.$getConfig.mockReturnValue(true);

		dataPath = new DataPath(vm, 'key', ['qwe', 'asd'], {});

		expect(dataPath.$watcher).toBeDefined();
		expect(dataPath.$childs[0].$watcher).toBeDefined();
		expect(dataPath.$childs[1].$watcher).toBeDefined();

		dataPath.$deleteWatcher(true);

		expect(dataPath.$watcher).toBeUndefined();
		expect(dataPath.$childs[0].$watcher).toBeUndefined();
		expect(dataPath.$childs[1].$watcher).toBeUndefined();
	});

	it('detects if path has rules', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		expect(dataPath.$hasRules()).toBe(true);

		dataPath = new DataPath(vm, 'key', [{}], {});

		expect(dataPath.$hasRules()).toBe(false);
	});

	it('gets the rules omitting reserved words', () => {
		dataPath = new DataPath(vm, 'key', 'data', {
			test: 'test',
			message: 'message',
			field: 'field',
			links: 'links',
			linksThen: 'linksThen',
			linksCatch: 'linksCatch'
		});

		expect(dataPath.$getRules()).toEqual(['test']);
	});

	it('resets own result', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});
		dataPath.$result.reset = jest.fn();

		dataPath.$reset(false);

		expect(dataPath.$result.reset).toHaveBeenCalled();
	});

	it('resets child results', () => {
		dataPath = new DataPath(vm, 'key', ['qwe', 'asd'], {});
		dataPath.$childs[0].$result.reset = jest.fn();
		dataPath.$childs[1].$result.reset = jest.fn();

		dataPath.$reset(true);

		expect(dataPath.$childs[0].$result.reset).toHaveBeenCalled();
		expect(dataPath.$childs[1].$result.reset).toHaveBeenCalled();
	});

	it('performs the validation', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});
		let response = dataPath.$validate();

		expect(response).toBeInstanceOf(Promise);
		expect(vm.$vd.$addTask).toHaveBeenCalled();
	});

	it('performs the validation revalidating', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});
		let response = dataPath.$validate(true);

		expect(response).toBeInstanceOf(Promise);
		expect(vm.$vd.$addTask.mock.calls[0][1]).toBe(true);
	});

	it('runs links after validation success', (done) => {
		dataPath = new DataPath(vm, 'key', 'data', {
			links: 'links',
			linksThen: 'linksThen'
		});

		dataPath.$validateLinks = jest.fn().mockImplementation(() => {
			let validateLinksCalls = dataPath.$validateLinks.mock.calls;

			if (validateLinksCalls.length === 2) {
				expect(dataPath.$validateLinks).toHaveBeenCalledWith('links');
				expect(dataPath.$validateLinks).toHaveBeenCalledWith('linksThen');

				done();
			}
		});

		dataPath.$validate();

		onSuccess();
	});

	it('runs links after validation error', (done) => {
		dataPath = new DataPath(vm, 'key', 'data', {
			links: 'links',
			linksCatch: 'linksCatch'
		});

		dataPath.$validateLinks = jest.fn().mockImplementation(() => {
			let validateLinksCalls = dataPath.$validateLinks.mock.calls;

			if (validateLinksCalls.length === 2) {
				expect(dataPath.$validateLinks).toHaveBeenCalledWith('links');
				expect(dataPath.$validateLinks).toHaveBeenCalledWith('linksCatch');

				done();
			}
		});

		dataPath.$validate();

		onError();
	});

	it('does not validate links if not defined', () => {
		dataPath = new DataPath(vm, 'key', 'data', {});

		jest.spyOn(Utils, 'isArray');

		dataPath.$validateLinks();

		expect(Utils.isArray).not.toHaveBeenCalled();
	});

	xit('validates single link defined as string', () => {
		dataPath = new DataPath(vm, 'key', ['qwe', 'asd'], {});

		dataPath.$childs[0].$validate = jest.fn();
		dataPath.$childs[1].$validate = jest.fn();

		jest.spyOn(Utils, 'isArray').mockReturnValue(false);
		jest.spyOn(Utils, 'pathToValue').mockReturnValue(dataPath.$childs[0]);

		dataPath.$validateLinks('qwe');

		expect(dataPath.$childs[0].$validate).toHaveBeenCalled();
		expect(dataPath.$childs[1].$validate).not.toHaveBeenCalled();
	});

	it('validates multiple links defined as array', () => {
		dataPath = new DataPath(vm, 'key', ['qwe', 'asd'], {});

		dataPath.$childs[0].$validate = jest.fn();
		dataPath.$childs[1].$validate = jest.fn();

		console.log(Object.keys(dataPath.$childs));
		jest.spyOn(Utils, 'isArray').mockReturnValue(true);
		jest.spyOn(Utils, 'pathToValue').mockImplementation((path) => {
			console.log(path);
			if (path === 'qwe')
				return dataPath.$childs[0];

			if (path === 'asd')
				return dataPath.$childs[1];
		});

		dataPath.$validateLinks(['qwe', 'asd']);

		expect(dataPath.$childs[0].$validate).toHaveBeenCalled();
		expect(dataPath.$childs[1].$validate).toHaveBeenCalled();
	});

	it('does not validate wrong links', () => {

	});

	it('returns the full path', () => {
		dataPath = new DataPath(vm, '', {
			data1: {
				data2: 'data2'
			}
		}, {
			data1: {
				data2: {}
			}
		});

		expect(dataPath.data1.data2.$toString()).toBe('data1.data2');
	});

	it('deletes itself and childs', () => {
		dataPath = new DataPath(vm, '', {
			data1: {
				data2: 'data2'
			}
		}, {
			data1: {
				data2: {}
			}
		});

		expect(dataPath.data1.data2.$data).toBe('data2');
		expect(Object.keys(dataPath.$childs).length).toBe(1);

		dataPath.$deleteWatcher = jest.fn();
		dataPath.$delete();

		expect(dataPath.$deleteWatcher).toHaveBeenCalled();
		expect(Object.keys(dataPath.$childs).length).toBe(0);
	});

});
