import Task from '@/classes/Task.js';

describe('Task class', () => {
	let task, dataPath;

	let vm = {
		$forceUpdate: jest.fn(),
		$vd: {
			$getConfig: jest.fn(),
			$removeTask: jest.fn()
		}
	};

	it('creates a task for a path with rules', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, true);

		expect(task.validations.size).toBe(1);
	});

	it('creates a task for a path with childs', () => {
		dataPath = {
			$hasRules: () => false,

			$childs: {
				child1: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child1'
				},

				child2: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child2'
				}
			},

			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, true);

		expect(task.validations.size).toBe(2);
	});

	it('does all validations if skipValidationsOnError set to false', () => {
		dataPath = {
			$hasRules: () => false,

			$childs: {
				child1: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child1',
					$validated: true,
					$error: 'error'
				},

				child2: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child2',
					$validated: true,
					$error: 'error'
				}
			},

			$toString: () => 'path1'
		};

		vm.$vd.$getConfig.mockReturnValue(false)

		task = new Task(vm, dataPath, false);
		task.run();

		expect(task.validated).toBe(2);
		expect(task.finished).toBe(true);
		expect(task.$vd.$removeTask).toHaveBeenCalled();
	});

	it('skips rest of validations if skipValidationsOnError set to true', () => {
		dataPath = {
			$hasRules: () => false,

			$childs: {
				child1: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child1',
					$validated: true,
					$error: 'error'
				},

				child2: {
					$hasRules: () => true,
					$childs: {},
					$toString: () => 'child2'
				}
			},

			$toString: () => 'path1'
		};

		vm.$vd.$getConfig.mockReturnValue(true);

		task = new Task(vm, dataPath, false);
		task.run();

		expect(task.validated).toBe(1);
		expect(task.finished).toBe(true);
		expect(task.$vd.$removeTask).toHaveBeenCalled();
	});

	it('revalidates if revalidate set to true', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$validated: true,
			$error: undefined,
			$getRules: jest.fn().mockReturnValue([]),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, true);
		task.checkValidation(dataPath);

		expect(dataPath.$getRules).toHaveBeenCalled();
	});

	it('skips validated if revalidate set to false', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$validated: true,
			$error: undefined,
			$getRules: jest.fn(),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, false);
		task.checkValidation(dataPath);

		expect(dataPath.$getRules).not.toHaveBeenCalled();
	});

	it('sets valid to false if error on already validated', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$validated: true,
			$error: 'error',
			$getRules: jest.fn(),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, false);
		task.checkValidation(dataPath);

		expect(task.valid).toBe(false);
	});



});
