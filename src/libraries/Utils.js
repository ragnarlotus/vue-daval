// Utils library

export default {

	isArray(o) {
		return Array.isArray(o);
	},

	isObject(o) {
		return o !== null && !Array.isArray(o) && typeof o === 'object';
	},

	isPromise(o) {
		return (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function';
	},

	extend(o, ...e) {
		return Object.assign(o, ...e);
	}

};
