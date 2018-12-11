import Result from '@/classes/Result.js';

describe('Result class', () => {
	let task, dataPath;

	beforeEach(() => {
		dataPath = {
			$rules: {
				test: {},
				asdf: {}
			},
			$getRules: jest.fn().mockReturnValue([{}, {}]),
			$vd: {
				$getConfig: jest.fn(),
				$getMessage: jest.fn()
			}
		};
	});

	it('Initializes the values', () => {
		let result = new Result(dataPath);

		expect(result.rules).toBeDefined();
		expect(result.numRules).toBe(2);
		expect(result.validated).toBe(false);
	});

	it('adds a rule result as valid', () => {
		let result = new Result(dataPath);

		result.add('test', true);

		expect(dataPath.$vd.$getMessage).not.toHaveBeenCalled();
		expect(result.rules['test']).toBe(undefined);
	});

	it('adds a rule result without validity', () => {
		let result = new Result(dataPath);

		dataPath.$vd.$getMessage.mockReturnValue('error');
		result.add('test');

		expect(dataPath.$vd.$getMessage).toHaveBeenCalled();
		expect(result.rules['test']).toBe('error');
	});

	it('adds a rule result as invalid', () => {
		let result = new Result(dataPath);

		dataPath.$vd.$getMessage.mockReturnValue('error');
		result.add('test', false);

		expect(dataPath.$vd.$getMessage).toHaveBeenCalled();
		expect(result.rules['test']).toBe('error');
	});

	it('adds a rule result as invalid with message', () => {
		let result = new Result(dataPath);

		result.add('test', 'error');

		expect(dataPath.$vd.$getMessage).not.toHaveBeenCalled();
		expect(result.rules['test']).toBe('error');
	});

	it('sets the error of first error', () => {
		let result = new Result(dataPath);

		dataPath.$vd.$getMessage.mockReturnValue('error1');
		result.add('test', false);

		dataPath.$vd.$getMessage.mockReturnValue('error2');
		result.add('test', false);

		expect(result.error).toBe('error1');
	});

	it('has no error if all valid', () => {
		let result = new Result(dataPath);

		result.add('test1', true);
		result.add('test2', true);

		expect(result.error).toBe(undefined);
		expect(result.rules).toEqual({
			test1: undefined,
			test2: undefined
		});
	});

	it('sets result as validated when all rules finished', () => {
		let result = new Result(dataPath);

		result.add('test', false);
		expect(result.validated).toBe(false);

		result.add('asdf', true);
		expect(result.validated).toBe(true);
	});

	it('sets result as validated when error and skipRulesOnError configured', () => {
		let result = new Result(dataPath);

		dataPath.$vd.$getConfig.mockReturnValue(true);

		result.add('test', 'error');
		expect(dataPath.$vd.$getConfig).toHaveBeenCalledWith('skipRulesOnError');
		expect(result.validated).toBe(true);
	});

	it('gets the message based on the validation attribute', () => {
		dataPath.$rules.message = 'the message';

		let result = new Result(dataPath);

		expect(result.getMessage('test')).toBe('the message');
	});

	it('gets the message from rule messages', () => {
		dataPath.$vd.$getMessage.mockReturnValue('rule message');

		let result = new Result(dataPath);

		expect(result.getMessage('test')).toBe('rule message');
		expect(dataPath.$vd.$getMessage).toHaveBeenCalledWith('test');
	});

	it('gets the undefined message when no other message found', () => {
		let result = new Result(dataPath);

		result.getMessage('test');
		expect(dataPath.$vd.$getMessage).toHaveBeenCalledWith('undefined');
	});

	it('replaces the message field with the one defined in rules', () => {
		dataPath.$rules.field = 'asdf';

		let result = new Result(dataPath);

		expect(result.getMessage('test', 'message {field} error')).toBe('message asdf error');
	});

	it('replaces the message field with the one of rule path', () => {
		dataPath.$key = 'key';

		let result = new Result(dataPath);

		expect(result.getMessage('test', 'message {field} error')).toBe('message key error');
	});

	it('replaces the message rule', () => {
		dataPath.$rules.test = 5;

		let result = new Result(dataPath);

		expect(result.getMessage('test', 'message {rule} error')).toBe('message 5 error');
	});

	it('reports as having error when so', () => {
		let result = new Result(dataPath);
		result.error = 'error';

		expect(result.hasError()).toBe(true);
	});

	it('reports as not having error when so', () => {
		let result = new Result(dataPath);

		expect(result.hasError()).toBe(false);
	});

	it('gets the rules errors', () => {
		let result = new Result(dataPath);
		result.rules.test1 = 'error1';
		result.rules.test2 = undefined;
		result.rules.test3 = 'error3';

		expect(result.getErrors()).toEqual(['error1', 'error3']);
	});

});
