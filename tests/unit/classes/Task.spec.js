import Task from '@/classes/Task.js';

describe('Task class', () => {
	let vm, task, dataPath;

	beforeEach(() => {
		vm = {
			$forceUpdate: jest.fn(),
			$vd: {
				$getConfig: jest.fn(),
				$removeTask: jest.fn(),
				$getValidator: jest.fn()
			}
		};
	});

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

	it('initializes revalidate to false by default', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath);

		expect(task.revalidate).toBe(false);
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

		vm.$vd.$getConfig.mockReturnValue(false);

		task = new Task(vm, dataPath, false);
		task.promise.then(jest.fn, jest.fn);
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
		task.promise.then(jest.fn, jest.fn);
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

	it('sets valid to false if error found on already validated', () => {
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

	it('resets validated validation if revalidate set to true', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$validated: true,
			$error: 'error',
			$getRules: jest.fn().mockReturnValue([]),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, true);
		task.checkValidation(dataPath);

		expect(dataPath.$reset).toHaveBeenCalled();
	});

	it('does not resets validated validation if revalidate set to false', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$validated: true,
			$error: 'error',
			$getRules: jest.fn().mockReturnValue([]),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, false);
		task.checkValidation(dataPath);

		expect(dataPath.$reset).not.toHaveBeenCalled();
	});

	it('checks rules', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$getRules: jest.fn().mockReturnValue([{}]),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, false);
		task.checkValidationRule = jest.fn();
		task.checkValidation(dataPath, task.time);

		expect(dataPath.$getRules).toHaveBeenCalled();
		expect(task.checkValidationRule).toHaveBeenCalled();
	});

	it('validates all rules but required if no value and required not defined', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: undefined,
			$toString: () => 'path1',
			$rules: {
				min: 5,
				is: 'abc'
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();

		task.checkValidationRule(dataPath, 'min');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'min', true);

		task.checkValidationRule(dataPath, 'is');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'is', true);

		dataPath.$data = null;

		task.checkValidationRule(dataPath, 'min');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'min', true);

		task.checkValidationRule(dataPath, 'is');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'is', true);
	});

	it('validates all rules but required if no value and required set to false', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: undefined,
			$toString: () => 'path1',
			$rules: {
				required: false,
				min: 5,
				is: 'abc'
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();

		task.checkValidationRule(dataPath, 'min');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'min', true);

		task.checkValidationRule(dataPath, 'is');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'is', true);

		dataPath.$data = null;

		task.checkValidationRule(dataPath, 'min');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'min', true);

		task.checkValidationRule(dataPath, 'is');
		expect(task.addValidationRuleResult).toHaveBeenCalledWith(dataPath, 'is', true);
	});

	it('checks a rule using defined validator', () => {
		let validator = jest.fn();

		vm.$vd.$getValidator.mockReturnValue(validator);

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 1,
			$toString: () => 'path1',
			$rules: {
				min: 5
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();

		task.checkValidationRule(dataPath, 'min');
		expect(validator).toHaveBeenCalled();
		expect(task.addValidationRuleResult).toHaveBeenCalled();
	});

	it('checks a dynamic rule using defined validator', () => {
		let validator = jest.fn();

		vm.$vd.$getValidator.mockReturnValue(validator);

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				min: jest.fn()
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();
		task.checkValidationRule(dataPath, 'min');

		expect(dataPath.$rules.min).toHaveBeenCalled();
		expect(validator).toHaveBeenCalled();
		expect(task.addValidationRuleResult).toHaveBeenCalled();
	});

	it('checks a rule using validator defined on the fly', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				otf: jest.fn()
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();
		task.checkValidationRule(dataPath, 'otf');

		expect(dataPath.$rules.otf).toHaveBeenCalled();
		expect(task.addValidationRuleResult).toHaveBeenCalled();
	});

	it('displays a warning if wrong validator', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				otf: 'otf'
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();

		global.console = {
			warn: jest.fn()
		};
		task.checkValidationRule(dataPath, 'otf');

		expect(console.warn).toHaveBeenCalled();
		expect(task.addValidationRuleResult).toHaveBeenCalled();
	});

	it('adds a rule result if it is not a promise', () => {
		let validator = jest.fn();
		vm.$vd.$getValidator.mockReturnValue(validator);

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				min: 1
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();
		task.checkValidationRule(dataPath, 'min');

		expect(task.addValidationRuleResult).toHaveBeenCalled();
	});

	it('adds a rule result after resolved if it is a promise', () => {
		expect.assertions(2);

		let onSuccess, onError;
		let response = new Promise((resolve, reject) => {
			onSuccess = resolve;
			onError = reject;
		});

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				otf: jest.fn().mockReturnValue(response)
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();
		task.checkValidationRule(dataPath, 'otf');

		expect(task.addValidationRuleResult).not.toHaveBeenCalled();

		onSuccess();

		return response.then(() => {
			expect(task.addValidationRuleResult).toHaveBeenCalled();
		});
	});

	it('adds a rule result after rejected if it is a promise', () => {
		expect.assertions(2);

		let onSuccess, onError;
		let response = new Promise((resolve, reject) => {
			onSuccess = resolve;
			onError = reject;
		});

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$data: 5,
			$toString: () => 'path1',
			$rules: {
				otf: jest.fn().mockReturnValue(response)
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult = jest.fn();
		task.checkValidationRule(dataPath, 'otf');

		expect(task.addValidationRuleResult).not.toHaveBeenCalled();

		onError('error');

		response.catch((error) => {
			expect(error).toBe('error');
		});
	});

	it('adds the rule result to validation', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$result: {
				add: jest.fn()
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult(dataPath, 'otf', true);

		expect(dataPath.$result.add).toHaveBeenCalled();
	});

	it('sets task valid to false on error', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$result: {
				add: jest.fn()
			}
		};

		task = new Task(vm, dataPath, false);
		task.addValidationRuleResult(dataPath, 'otf', false);

		expect(task.valid).toBe(false);
	});

	it('adds one to counter when validation is validated', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$result: {
				add: jest.fn()
			},
			$validated: true
		};

		task = new Task(vm, dataPath, false);
		task.checkValidationsFinished = jest.fn();
		expect(task.validated).toBe(0);

		task.addValidationRuleResult(dataPath, 'abc', false);
		expect(task.validated).toBe(1);
	});

	it('checks if the validated validation is the last', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$result: {
				add: jest.fn()
			},
			$validated: true
		};

		task = new Task(vm, dataPath, false);
		task.checkValidationsFinished = jest.fn();

		task.addValidationRuleResult(dataPath, 'otf', true);
		expect(task.checkValidationsFinished).toHaveBeenCalled();
	});

	it('detects when task is finished when all validations validated', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.promise.then(jest.fn, jest.fn);
		task.validated++;

		task.checkValidationsFinished();

		expect(task.finished).toBe(true);
		expect(task.$vd.$removeTask).toHaveBeenCalled();
	});

	it('detects when task is finished if set as finished', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.promise.then(jest.fn, jest.fn);
		task.finished = true;

		task.checkValidationsFinished();

		expect(task.finished).toBe(true);
		expect(task.$vd.$removeTask).toHaveBeenCalled();
	});

	it('detects when task is not finished when all validations not validated and task not finished', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.promise.then(jest.fn, jest.fn);

		task.checkValidationsFinished();

		expect(task.finished).toBe(false);
		expect(task.$vd.$removeTask).not.toHaveBeenCalled();
	});

	it('resolves the task when valid', () => {
		expect.assertions(1);

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.valid = true;
		task.finished = true;

		let onSuccess = jest.spyOn(task, 'onSuccess');

		task.checkValidationsFinished();

		expect(onSuccess).toHaveBeenCalled();
	});

	it('rejects the task when not valid', () => {
		expect.assertions(1);

		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.promise.then(jest.fn, jest.fn);
		task.valid = false;
		task.finished = true;

		let onError = jest.spyOn(task, 'onError');

		task.checkValidationsFinished();

		expect(onError).toHaveBeenCalled();
	});

	it('updates the view when task finished', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.finished = true;
		task.checkValidationsFinished();

		expect(vm.$forceUpdate).toHaveBeenCalled();
	});

	it('removes itself from validator tasks', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1'
		};

		task = new Task(vm, dataPath, false);
		task.finished = true;
		task.checkValidationsFinished();

		expect(task.$vd.$removeTask).toHaveBeenCalled();
	});

	it('skip rules checking if values have been updated', () => {
		dataPath = {
			$hasRules: () => true,
			$childs: {},
			$toString: () => 'path1',
			$getRules: jest.fn().mockReturnValue([{}]),
			$reset: jest.fn()
		};

		task = new Task(vm, dataPath, true);
		task.checkValidationRule = jest.fn();

		task.updateTime();
		task.checkValidation(dataPath, 1);

		expect(task.checkValidationRule).not.toHaveBeenCalled();
	});

});
