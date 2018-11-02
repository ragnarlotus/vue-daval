// Utils library

export function isString(o) {
	return typeof o === 'string';
}

export function isArray(o) {
	return Array.isArray(o);
}

export function isObject(o) {
	return o !== null && !Array.isArray(o) && typeof o === 'object';
}

export function isPromise(o) {
	return (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function';
}

export function isFunction(o) {
	return typeof o === 'function';
}

export function extend(o, ...e) {
	return Object.assign(o, ...e);
}

export function pathToValue(path, data) {
	if (isString(path))
		path = path.split('.');

	let value;

	try {
		value = path.reduce((prev, cur) => {
			return prev[cur];
		}, data);

	} catch(e) {
		console.warn('Not a valid path for '+ path);
	}

	return value;
}
