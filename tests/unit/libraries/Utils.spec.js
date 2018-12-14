import * as Utils from '@/libraries/Utils.js';

describe('Utils.isString', () => {

	it('identifies a string as string', () => {
		let value = 'this is a string';

		expect(Utils.isString(value)).toBe(true);
	});

	it('identifies an array as not string', () => {
		let value = [];

		expect(Utils.isString(value)).toBe(false);
	});

	it('identifies an object as not string', () => {
		let value = {};

		expect(Utils.isString(value)).toBe(false);
	});

	it('identifies undefined as not string', () => {
		let value = undefined;

		expect(Utils.isString(value)).toBe(false);
	});

	it('identifies null as not string', () => {
		let value = null;

		expect(Utils.isString(value)).toBe(false);
	});

	it('identifies a function as not string', () => {
		let value = new Function;

		expect(Utils.isString(value)).toBe(false);
	});

});

describe('Utils.isArray', () => {

	it('identifies a string as not array', () => {
		let value = 'this is a string';

		expect(Utils.isArray(value)).toBe(false);
	});

	it('identifies an array as array', () => {
		let value = [];

		expect(Utils.isArray(value)).toBe(true);
	});

	it('identifies an object as not array', () => {
		let value = {};

		expect(Utils.isArray(value)).toBe(false);
	});

	it('identifies undefined as not array', () => {
		let value = undefined;

		expect(Utils.isArray(value)).toBe(false);
	});

	it('identifies null as not array', () => {
		let value = null;

		expect(Utils.isArray(value)).toBe(false);
	});

	it('identifies a function as not array', () => {
		let value = new Function;

		expect(Utils.isArray(value)).toBe(false);
	});

});

describe('Utils.isObject', () => {

	it('identifies a string as not object', () => {
		let value = 'this is a string';

		expect(Utils.isObject(value)).toBe(false);
	});

	it('identifies an array as not object', () => {
		let value = [];

		expect(Utils.isObject(value)).toBe(false);
	});

	it('identifies an object as object', () => {
		let value = {};

		expect(Utils.isObject(value)).toBe(true);
	});

	it('identifies undefined as not object', () => {
		let value = undefined;

		expect(Utils.isObject(value)).toBe(false);
	});

	it('identifies null as not object', () => {
		let value = null;

		expect(Utils.isObject(value)).toBe(false);
	});

	it('identifies a function as not object', () => {
		let value = new Function;

		expect(Utils.isObject(value)).toBe(false);
	});

});

describe('Utils.isPromise', () => {

	it('identifies a string as not promise', () => {
		let value = 'this is a string';

		expect(Utils.isPromise(value)).toBe(false);
	});

	it('identifies an array as not promise', () => {
		let value = [];

		expect(Utils.isPromise(value)).toBe(false);
	});

	it('identifies a promise as promise', () => {
		let value = new Promise((resolve, reject) => {});

		expect(Utils.isPromise(value)).toBe(true);
	});

	it('identifies undefined as not promise', () => {
		let value = undefined;

		expect(Utils.isPromise(value)).toBe(false);
	});

	it('identifies null as not promise', () => {
		let value = null;

		expect(Utils.isPromise(value)).toBe(false);
	});

	it('identifies a function as not promise', () => {
		let value = new Function;

		expect(Utils.isPromise(value)).toBe(false);
	});

});

describe('Utils.isFunction', () => {

	it('identifies a string as not function', () => {
		let value = 'this is a string';

		expect(Utils.isFunction(value)).toBe(false);
	});

	it('identifies an array as not function', () => {
		let value = [];

		expect(Utils.isFunction(value)).toBe(false);
	});

	it('identifies an object as not function', () => {
		let value = {};

		expect(Utils.isFunction(value)).toBe(false);
	});

	it('identifies undefined as not function', () => {
		let value = undefined;

		expect(Utils.isFunction(value)).toBe(false);
	});

	it('identifies null as not function', () => {
		let value = null;

		expect(Utils.isFunction(value)).toBe(false);
	});

	it('identifies a function as function', () => {
		let value = new Function;

		expect(Utils.isFunction(value)).toBe(true);
	});

});

describe('Utils.sortObjectAttributes', () => {

	it('returns an object with properties sorted', () => {
		let o = {
			b: 2,
			a: {
				d: 4,
				c: 3
			}
		};

		o = Utils.sortObjectAttributes(o);

		expect(JSON.stringify(o)).toBe('{"a":{"c":3,"d":4},"b":2}');
	});

});

describe('Utils.pathToValue', () => {

	it('returns the value of object attibute from string path', () => {
		let o = {
			a: {
				b: [{
					c: 'c'
				}]
			}
		};

		let value = Utils.pathToValue('a.b.0.c', o);

		expect(value).toBe('c');
	});

	it('returns the value of object attibute from array path', () => {
		let o = {
			a: {
				b: [{
					c: 'c'
				}]
			}
		};

		let value = Utils.pathToValue(['a', 'b', '0', 'c'], o);

		expect(value).toBe('c');
	});

	it('returns undefined when invalid path', () => {
		let o = {
			a: {
				b: 'b'
			}
		};

		let value = Utils.pathToValue('a.c', o);

		expect(value).toBe(undefined);
	});

});
