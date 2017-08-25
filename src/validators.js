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


export function type(rules, value, data, vmv) {
	let error = vmv.messages.type.replace('{rule}', rules.type);

	if (types[rules.type] === undefined) {
		console.warn('Not a valid type: '+ rules.type);
		return error;
	}

	if (types[rules.type](value) === false)
		return error;
}


export function required(rules, value, data, vmv) {
	let error = vmv.messages.required.replace('{rule}', rules.required);

	if (typeof rules.required !== 'boolean') {
		console.warn('Not a valid required rule: '+ rules.required);
		return error;
	}

	if (rules.required === false)
		return;

	if (value === null)
		return error;

	let type = typeof value;

	if (type === 'undefined' || type === 'null')
		return error;

	if (/(string|array|number)/.test(type) === false)
		return error;

	if (value.toString().length === 0)
		return error;
}


export function regexp(rules, value, data, vmv) {
	let error = vmv.messages.regexp.replace('{rule}', rules.regexp);

	if (rules.exp instanceof RegExp === false) {
		console.warn('Not a valid regular expression rule: '+ rules.exp);
		return error;
	}

	if ((new RegExp(rules.exp)).test(value) === false)
		return error;
}


export function min(rules, value, data, vmv) {
	let error = vmv.messages.min.replace('{rule}', rules.min);

	if (typeof rules.min !== 'number') {
		console.warn('Not a valid min rule:'+ rules.min);
		return error;
	}

	if (typeof value !== 'number')
		return error;

	if (value < rules.min)
		return error;
}


export function max(rules, value, data, vmv) {
	let error = vmv.messages.max.replace('{rule}', rules.max);

	if (typeof rules.max !== 'number') {
		console.warn('Not a valid max rule: '+ rules.max);
		return error;
	}

	if (typeof value !== 'number')
		return error;

	if (value > rules.max)
		return error;

	return false;
}


export function minlen(rules, value, data, vmv) {
	let error = vmv.messages.minlen.replace('{rule}', rules.minlen);

	if (typeof rules.minlen !== 'number') {
		console.warn('Not a valid minlen rule:'+ rules.minlen);
		return error;
	}

	if (value === undefined || value === null)
		return;

	if (/(string|array)/.test(typeof value) === false)
		return error;

	if (value.length > 0 && value.length < rules.minlen)
		return error;
}


export function maxlen(rules, value, data, vmv) {
	let error = vmv.messages.maxlen.replace('{rule}', rules.maxlen);

	if (typeof rules.maxlen !== 'number') {
		console.warn('Not a valid maxlen rule: '+ rules.maxlen);
		return error;
	}

	if (/(string|array)/.test(typeof value) === false)
		return error;

	if (value.length > rules.maxlen)
		return error;
}


export function length(rules, value, data, vmv) {
	let error = vmv.messages.length.replace('{rule}', rules.length);

	if (typeof rules.length !== 'number') {
		console.warn('Not a valid length rule: '+ rules.length);
		return error;
	}

	let type = typeof value;

	if (/(string|array|number)/.test(type) === false)
		return error;

	if (type === 'array' && value.length !== rules.length)
		return error;

	if (value.toString().length !== rules.length)
		return error;
}


export function equals(rules, value, data, vmv) {
	let error = vmv.messages.equals.replace('{rule}', rules.equals.split('.').slice(-1)[0]);

	if (typeof rules.equals !== 'string') {
		console.warn('Not a valid equals rule:'+ rules.equals);
		return error;
	}

	let value2 = vmv.pathToObject(rules.equals, data);

	if (typeof value2 === 'undefined' && typeof value !== 'undefined')
		return error;

	if (value2.toString() !== value.toString())
		return error;
}


export function isin(rules, value, data, vmv) {
	let error = vmv.messages.isin.replace('{rule}', rules.isin);

	if (!Array.isArray(rules.isin)) {
		console.warn('Not a valid enumerator rule:'+ rules.isin);
		return error;
	}

	if (rules.isin.indexOf(value) === -1)
		return error;
}
