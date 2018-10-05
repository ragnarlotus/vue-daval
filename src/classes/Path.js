// Path class

import Utils from '../libraries/Utils.js';
import Result from './Result.js';

export default class Path {

	constructor(vm, path, data, rules, parent) {
		this.$vm = vm;
		this.$path = path;
		this.$data = data;
		this.$rules = rules;
		this.$parent = parent;
		this.$childs = [];

		this.$result = new Result;
		this.$createWatcher();

		return new Proxy(this, this);
	}

	get(obj, prop) {
		if (prop in obj)
			return this[prop];

		let childPath = this.$path.concat(prop);

		return this.$vm.$vd.$getPath(childPath);
	}

	$addChild(child) {
		this.$childs.push(child);
	}

	$reset(propagate = false) {
		this.$result.reset();
	}

	$createWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = this.$vm.$watch(() => {
			return this.$data;

		}, () => {
			this.$validate(undefined, undefined, true, false);
		});
	}

	$removeWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = undefined;
	}

	$validate(callbackSuccess, callbackError, revalidate = false, propagate = true) {

	}

	$toString() {
		return this.$path.join('.');
	}

};
