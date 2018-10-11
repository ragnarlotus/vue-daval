// Path class

import * as Utils from '../libraries/Utils.js';
import Result from './Result.js';

export default class Path {

	constructor(vm, path, data, rules, parent) {
		this.$vm = vm;
		this.$path = path;
		this.$data = data;
		this.$rules = rules;
		this.$parent = parent;
		this.$validations = [];

		this.$createWatcher();

		let numPaths = this.$vm.$vd.$paths.size;

		this.$createChilds();

		if (numPaths === this.$vm.$vd.$paths.size) {
			this.$result = new Result(this);

			this.$parent.$addValidation(this);
		}

		return new Proxy(this, this);
	}

	get(obj, prop) {
		if (prop in obj)
			return this[prop];

		if (this.$hasRules()) {
			if (prop === '$validated')
				return this.$result.$validated;

			if (prop === '$error')
				return this.$result.$error;

			if (prop === '$errors')
				return this.$result.$getErrors();

			if (prop in this.$rules)
				return this.$rules[prop];

		} else if (prop === '$errors') {
			let errors = {};

			this.$validations.forEach((validation) => {
				errors[validation.$toString()] = validation.$errors;
			});

			return errors;
		}

		let childPath = this.$path.concat(prop);

		return this.$vm.$vd.$getPath(childPath);
	}

	$hasRules() {
		return '$result' in this;
	}

	$getRules() {
		let rules = Object.keys(this.$rules);

		return rules.filter(rule => rule !== 'message' && rule !== 'field');
	}

	$addValidation(path) {
		this.$validations.push(path);

		if (this.$parent !== undefined)
			this.$parent.$addValidation(this);
	}

	$createChilds() {
		let child;

		if (Utils.isObject(this.$data)) {
			Object.keys(this.$rules).forEach((key) => {
				child = new Path(this.$vm, this.$path.concat(key), this.$data[key], this.$rules[key], this);

				this.$vm.$vd.$addPath(child);
			});

		} else if (Utils.isArray(this.$data)) {
			this.$data.forEach((item, index) => {
				child = new Path(this.$vm, this.$path.concat(index), item, this.$rules, this);

				this.$vm.$vd.$addPath(child);
			});
		}
	}

	$reset() {
		this.$validations.forEach((validation) => {
			child.$reset(propagate);
		});

		if (this.$result !== undefined)
			this.$result.reset();
	}

	$createWatcher() {
		if (this.$watcher)
			this.$watcher();

		if (this.$path.length === 0)
			return;

		this.$watcher = this.$vm.$watch(this.$toString(), (value) => {
			this.$data = value;
			this.$validate(true, false).then(() => {}).catch(() => {});
		});
	}

	$removeWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = undefined;
	}

	$validate(revalidate = false, propagate = true) {
		let task = this.$vm.$vd.$addTask(this, revalidate, propagate);

		return task.promise;
	}

	$toString() {
		return this.$path.join('.');
	}

};
