// Utils library

export function isString(o) {
	return typeof o === 'string';
}

export function isNumber(o) {
	return typeof o === 'number';
}

export function isArray(o) {
	return Array.isArray(o);
}

export function isObject(o) {
	return o !== null && !Array.isArray(o) && typeof o === 'object';
}

export function isPromise(o) {
	return (typeof o === 'object' || typeof o === 'function') && o !== null && typeof o.then === 'function';
}

export function isFunction(o) {
	return typeof o === 'function';
}

export function sortObjectAttributes(o) {
	if (typeof o !== 'object' || !o)
		return o;

	return Object.keys(o).sort().reduce((c, key) => (c[key] = sortObjectAttributes(o[key]), c), {});
}

export function pathToValue(path, data) {
	if (isString(path))
		path = path.split('.');

	let value = path.reduce((prev, cur) => {
		return prev[cur];
	}, data);

	return value;
}
