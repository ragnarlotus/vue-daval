// Validators library

import * as Utils from './Utils.js';

const types = {
	boolean(value) {
		return typeof value === 'boolean';
	},

	number(value) {
		return typeof value === 'number';
	},

	integer(value) {
		return typeof value === 'number' && parseInt(value, 10) === value;
	},

	float(value) {
		return typeof value === 'number' && parseInt(value, 10) !== value;
	},

	string(value) {
		return typeof value === 'string';
	},

	url(value) {
		return (new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i')).test(value);
	},

	email(value) {
		return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	},

	date(value) {
		return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
	}
};


export function type(rule, value) {
	if (types[rule](value) === false)
		return false;

	return true;
}


export function required(rule, value) {
	if (rule === false)
		return true;

	let type = typeof value;

	if (type === 'undefined' || type === 'null')
		return false;

	if (value.toString().length === 0)
		return false;

	return true;
}


export function regexp(rule, value) {
	if ((new RegExp(rule)).test(value) === false)
		return false;

	return true;
}


export function min(rule, value) {
	if (typeof value !== 'number')
		return false;

	if (value < rule)
		return false;

	return true;
}


export function max(rule, value) {
	if (typeof value !== 'number')
		return false;

	if (value > rule)
		return false;

	return true;
}


export function minlen(rule, value) {
	if (/(string|array)/.test(typeof value) === false)
		return false;

	if (value.length < rule)
		return false;

	return true;
}


export function maxlen(rule, value) {
	if (/(string|array)/.test(typeof value) === false)
		return false;

	if (value.length > rule)
		return false;

	return true;
}


export function length(rule, value) {
	let type = typeof value;

	if (/(string|array|number)/.test(type) === false)
		return false;

	if (type === 'array' && value.length !== rule)
		return false;

	if (value.toString().length !== rule)
		return false;

	return true;
}


export function equals(rule, value) {
	let value2 = Utils.pathToValue(rule, this.$vd).$data;

	if (value2 === undefined && value !== undefined)
		return false;

	if (value2.toString() !== value.toString())
		return false;

	return true;
}


export function is(rule, value) {
	if (rule != value)
		return false;

	return true;
}


export function isnot(rule, value) {
	if (rule == value)
		return false;

	return true;
}


export function isin(rule, value) {
	if (rule.indexOf(value) === -1)
		return false;

	return true;
}
