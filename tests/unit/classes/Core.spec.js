import Core from '@/classes/Core.js';
import Task from '@/classes/Task.js';

describe('Core class', () => {
	let core;

	it('gets config from vue component', () => {
		core = new Core({
			$options: {
				vdConfig: {
					config1: 'config1',
					config2: true
				}
			}
		});

		expect(core.$getConfig('config1')).toBe('config1');
		expect(core.$getConfig('config2')).toBe(true);
	});

	it('gets a validator by name', () => {
		core = new Core({
			$options: {
				vdValidators: {
					Validator1: 'validator1',
					Validator2: 'validator2'
				}
			}
		});

		expect(core.$getValidator('Validator1')).toBe('validator1');
		expect(core.$getValidator('Validator2')).toBe('validator2');
	});

	it('gets a message by name', () => {
		core = new Core({
			$options: {
				vdMessages: {
					Message1: 'message1',
					Message2: 'message2'
				}
			}
		});

		expect(core.$getMessage('Message1')).toBe('message1');
		expect(core.$getMessage('Message2')).toBe('message2');
	});

	it('adds a new task', () => {
		Task.prototype.run = jest.fn();
		Task.prototype.addValidation = jest.fn();

		core = new Core({
			$vm: {
				$vd: {}
			}
		});

		let dataPath = {
			$toString: jest.fn().mockReturnValue('dataPath1'),
			$hasRules: jest.fn()
		};

		core.$addTask(dataPath, true);

		expect(core.$tasks.size).toBe(1);
		expect(core.$tasks.has('dataPath1')).toBe(true);
	});

	it('updates an existing task', () => {
		Task.prototype.run = jest.fn();
		Task.prototype.addValidation = jest.fn();

		core = new Core({
			$vm: {
				$vd: {}
			}
		});

		let dataPath = {
			$toString: jest.fn().mockReturnValue('dataPath1'),
			$hasRules: jest.fn()
		};

		core.$addTask(dataPath, true);
		core.$addTask(dataPath, true);

		expect(core.$tasks.size).toBe(1);
		expect(core.$tasks.has('dataPath1')).toBe(true);
	});

	it('removes a task', () => {
		core = new Core();
		core.$tasks.set('dataPath1', {});

		expect(core.$tasks.size).toBe(1);

		let task = {
			dataPath: {
				$toString: jest.fn().mockReturnValue('dataPath1')
			}
		};

		core.$removeTask(task);

		expect(core.$tasks.size).toBe(0);
	});

	it('returns a dataPath property', () => {
		core = new Core();
		core.$paths[''] = {
			anypath: 'anypath'
		};

		expect(core.anypath).toBe('anypath');
	});

});
