import * as Validators from '@/libraries/Validators.js';
import * as Utils from '@/libraries/Utils.js';

describe('Validators:type', () => {

	// Boolean
	it('validates true as boolean', () => {
		expect(Validators.type('boolean', true)).toBe(true);
	});

	it('validates false as boolean', () => {
		expect(Validators.type('boolean', false)).toBe(true);
	});

	it('validates string as not boolean', () => {
		expect(Validators.type('boolean', 'string')).toBe(false);
	});

	it('validates number as not boolean', () => {
		expect(Validators.type('boolean', 1)).toBe(false);
	});

	it('validates array as not boolean', () => {
		expect(Validators.type('boolean', [])).toBe(false);
	});

	it('validates object as not boolean', () => {
		expect(Validators.type('boolean', {})).toBe(false);
	});

	// Number
	it('validates boolean as not number', () => {
		expect(Validators.type('number', true)).toBe(false);
	});

	it('validates number as number', () => {
		expect(Validators.type('number', 5)).toBe(true);
	});

	it('validates string as not number', () => {
		expect(Validators.type('number', 'string')).toBe(false);
	});

	it('validates array as not number', () => {
		expect(Validators.type('number', [])).toBe(false);
	});

	it('validates object as not number', () => {
		expect(Validators.type('number', {})).toBe(false);
	});

	// Integer
	it('validates boolean as not integer', () => {
		expect(Validators.type('integer', true)).toBe(false);
	});

	it('validates integer as integer', () => {
		expect(Validators.type('integer', 5)).toBe(true);
	});

	it('validates float as not integer', () => {
		expect(Validators.type('integer', 5.5)).toBe(false);
	});

	it('validates string as not integer', () => {
		expect(Validators.type('integer', 'string')).toBe(false);
	});

	it('validates array as not integer', () => {
		expect(Validators.type('integer', [])).toBe(false);
	});

	it('validates object as not integer', () => {
		expect(Validators.type('integer', {})).toBe(false);
	});

	// Float
	it('validates boolean as not float', () => {
		expect(Validators.type('float', true)).toBe(false);
	});

	it('validates integer as not float', () => {
		expect(Validators.type('float', 5)).toBe(false);
	});

	it('validates float as float', () => {
		expect(Validators.type('float', 5.5)).toBe(true);
	});

	it('validates string as not float', () => {
		expect(Validators.type('float', 'string')).toBe(false);
	});

	it('validates array as not float', () => {
		expect(Validators.type('float', [])).toBe(false);
	});

	it('validates object as not float', () => {
		expect(Validators.type('float', {})).toBe(false);
	});

	// String
	it('validates boolean as not string', () => {
		expect(Validators.type('string', true)).toBe(false);
	});

	it('validates number as not string', () => {
		expect(Validators.type('string', 5)).toBe(false);
	});

	it('validates string as string', () => {
		expect(Validators.type('string', 'string')).toBe(true);
	});

	it('validates array as not string', () => {
		expect(Validators.type('string', [])).toBe(false);
	});

	it('validates object as not string', () => {
		expect(Validators.type('string', {})).toBe(false);
	});

	// URL
	it('validates a valid URL', () => {
		expect(Validators.type('url', 'http://www.github.com')).toBe(true);
	});

	it('validates a not valid URL', () => {
		expect(Validators.type('url', 'not an url')).toBe(false);
	});

	// Email
	it('validates a valid email', () => {
		expect(Validators.type('email', 'user@github.com')).toBe(true);
	});

	it('validates a not valid email', () => {
		expect(Validators.type('email', 'user.github.com')).toBe(false);
	});

	// Date
	it('validates boolean as not date', () => {
		expect(Validators.type('date', true)).toBe(false);
	});

	it('validates number as not date', () => {
		expect(Validators.type('date', 5)).toBe(false);
	});

	it('validates string as not date', () => {
		expect(Validators.type('date', 'string')).toBe(false);
	});

	it('validates array as not date', () => {
		expect(Validators.type('date', [])).toBe(false);
	});

	it('validates object as not date', () => {
		expect(Validators.type('date', {})).toBe(false);
	});

	it('validates date as date', () => {
		expect(Validators.type('date', new Date)).toBe(true);
	});

});

describe('Validators:required', () => {

	it('validates undefined when required as error', () => {
		expect(Validators.required(true, undefined)).toBe(false);
	});

	it('validates null when required as error', () => {
		expect(Validators.required(true, null)).toBe(false);
	});

	it('validates empty string when required as error', () => {
		expect(Validators.required(true, '')).toBe(false);
	});

	it('validates 0 when required as valid', () => {
		expect(Validators.required(true, 0)).toBe(true);
	});

	it('validates false when required as valid', () => {
		expect(Validators.required(true, false)).toBe(true);
	});

	it('validates non empty string when required as valid', () => {
		expect(Validators.required(true, 'string')).toBe(true);
	});

	it('validates array when required as valid', () => {
		expect(Validators.required(true, [])).toBe(true);
	});

	it('validates object when required as valid', () => {
		expect(Validators.required(true, {})).toBe(true);
	});

	it('validates anything when not required as valid', () => {
		expect(Validators.required(false, undefined)).toBe(true);
	});

});

describe('Validators:regexp', () => {

	it('validates a valid regexp', () => {
		expect(Validators.regexp(/^[0-9]+$/, '1234')).toBe(true);
	});

	it('validates a not valid regexp', () => {
		expect(Validators.regexp(/^[0-9]+$/, '12ab')).toBe(false);
	});

});

describe('Validators:min', () => {

	it('validates a number being bigger than min as valid', () => {
		expect(Validators.min(5, 8)).toBe(true);
	});

	it('validates a number being lower than min as not valid', () => {
		expect(Validators.min(5, 2)).toBe(false);
	});

	it('validates not a number as not valid', () => {
		expect(Validators.min(5, '8')).toBe(false);
	});

});

describe('Validators:max', () => {

	it('validates a number being bigger than max as not valid', () => {
		expect(Validators.max(5, 8)).toBe(false);
	});

	it('validates a number being lower than max as valid', () => {
		expect(Validators.max(5, 2)).toBe(true);
	});

	it('validates not a number as not valid', () => {
		expect(Validators.max(5, '2')).toBe(false);
	});

});

describe('Validators:minlen', () => {

	it('validates a string being larger than minlen as valid', () => {
		expect(Validators.minlen(5, 'abcdfghi')).toBe(true);
	});

	it('validates a string being shorter than minlen as not valid', () => {
		expect(Validators.minlen(5, 'ab')).toBe(false);
	});

	it('validates a number being larger than minlen as valid', () => {
		expect(Validators.minlen(5, 12345678)).toBe(true);
	});

	it('validates a number being shorter than minlen as not valid', () => {
		expect(Validators.minlen(5, 12)).toBe(false);
	});

	it('validates an array being bigger than minlen as valid', () => {
		expect(Validators.minlen(5, ['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toBe(true);
	});

	it('validates an array being smaller than minlen as not valid', () => {
		expect(Validators.minlen(5, ['a', 'b'])).toBe(false);
	});

	it('validates not a string nor array nor number as not valid', () => {
		expect(Validators.minlen(5, {})).toBe(false);
	});

});

describe('Validators:maxlen', () => {

	it('validates a string being larger than maxlen as not valid', () => {
		expect(Validators.maxlen(5, 'abcdfghi')).toBe(false);
	});

	it('validates a string being shorter than maxlen as valid', () => {
		expect(Validators.maxlen(5, 'ab')).toBe(true);
	});

	it('validates a number being larger than maxlen as not valid', () => {
		expect(Validators.maxlen(5, 12345678)).toBe(false);
	});

	it('validates a number being shorter than maxlen as valid', () => {
		expect(Validators.maxlen(5, 12)).toBe(true);
	});

	it('validates an array being bigger than maxlen as not valid', () => {
		expect(Validators.maxlen(5, ['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toBe(false);
	});

	it('validates an array being smaller than maxlen as valid', () => {
		expect(Validators.maxlen(5, ['a', 'b'])).toBe(true);
	});

	it('validates not a string nor array nor number as not valid', () => {
		expect(Validators.maxlen(5, {})).toBe(false);
	});

});

describe('Validators:length', () => {

	it('validates a string being larger than length as not valid', () => {
		expect(Validators.length(5, 'abcdfghi')).toBe(false);
	});

	it('validates a string being same length as valid', () => {
		expect(Validators.length(5, 'abcde')).toBe(true);
	});

	it('validates a number being larger than length as not valid', () => {
		expect(Validators.length(5, 12345678)).toBe(false);
	});

	it('validates a number being same length as valid', () => {
		expect(Validators.length(5, 12345)).toBe(true);
	});

	it('validates an array being bigger than length as not valid', () => {
		expect(Validators.length(5, ['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toBe(false);
	});

	it('validates an array being same length as valid', () => {
		expect(Validators.length(5, ['a', 'b', 'd', 'e', 'f'])).toBe(true);
	});

	it('validates not a string nor array nor number as not valid', () => {
		expect(Validators.length(5, {})).toBe(false);
	});

});

describe('Validators:equals', () => {

	it('validates a string not equal as not valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: 'abcde'
		});

		expect(Validators.equals('a.b.c.d', 'abcdfghi')).toBe(false);
	});

	it('validates a string equal as valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: 'abcde'
		});

		expect(Validators.equals('a.b.c.d.e', 'abcde')).toBe(true);
	});

	it('validates an array not equal as not valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: 'abcd'
		});

		expect(Validators.equals('a.b', ['a', 'b', 'c', 'd'])).toBe(false);
	});

	it('validates an array equal as valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: ['a', 'b']
		});

		expect(Validators.equals('a.b', ['a', 'b'])).toBe(true);
	});

	it('validates an object not equal as not valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: {}
		});

		expect(Validators.equals('a.b', {a: 1, b: 2})).toBe(false);
	});

	it('validates an object equal as valid', () => {
		Utils.pathToValue = jest.fn().mockReturnValue({
			$data: {b: 2, a: 1}
		});

		expect(Validators.equals('a.b', {a: 1, b: 2})).toBe(true);
	});

});

describe('Validators:is', () => {

	it('validates a value being the same', () => {
		expect(Validators.is(5, 5)).toBe(true);
	});

	it('validates a value not being the same', () => {
		expect(Validators.is(5, 6)).toBe(false);
	});

});

describe('Validators:isnot', () => {

	it('validates a value being the same', () => {
		expect(Validators.isnot(5, 5)).toBe(false);
	});

	it('validates a value not being the same', () => {
		expect(Validators.isnot(5, 6)).toBe(true);
	});

});

describe('Validators:isint', () => {

	it('validates a value being in the array', () => {
		let a = ['a', 'b', 'c'];

		expect(Validators.isin(a, 'b')).toBe(true);
	});

	it('validates a value not being the same', () => {
		let a = ['a', 'b', 'c'];

		expect(Validators.isin(a, 'd')).toBe(false);
	});

});
