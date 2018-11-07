// Path class

import * as Utils from '../../libraries/Utils.js';
import UndefinedPath from './UndefinedPath.js';
import Result from '../Result.js';

export default class DataPath {

	constructor(vm, path, data, rules, parent) {
		this.$vm = vm;
		this.$vd = vm.$vd;

		this.$path = path;
		this.$data = data;
		this.$rules = rules;
		this.$parent = parent;
		this.$childs = {};
		this.$validations = new Map;
		this.$proxy = new Proxy(this, this);
		this.$target = this;

		this.$createWatcher();

		if (this.$createChilds() === false) {
			this.$result = new Result(vm, this);

			this.$parent.$addValidation(this.$proxy);
		}

		return this.$proxy;
	}

	get(obj, prop) {
		if (prop in obj)
			return this[prop];

		if (this.$hasRules()) {
			if (prop === '$validated')
				return this.$result.validated;

			if (prop === '$error')
				return this.$result.error;

			if (prop === '$errors')
				return this.$result.getErrors();

			if (prop in this.$rules)
				return this.$rules[prop];

		} else if (prop === '$errors') {
			let errors = {};
			let validationErrors;

			this.$validations.forEach((validation) => {
				validationErrors = validation.$errors;

				if (Object.keys(validationErrors).length > 0)
					errors[validation.$toString()] = validationErrors;
			});

			return errors;
		}

		if (prop in this.$childs)
			return this.$childs[prop];

		return new UndefinedPath(prop);
	}

	$getTarget() {
		return this.$target;
	}

	$createChilds() {
		let child;
		let childPath;

		if (Utils.isObject(this.$data)) {
			Object.keys(this.$rules).forEach((key) => {
				childPath = this.$path.concat(key);

				if (key in this.$data) {
					child = new DataPath(this.$vm, childPath, this.$data[key], this.$rules[key], this);

					this.$childs[key] = child;
				}
			});

		} else if (Utils.isArray(this.$data)) {
			this.$data.forEach((item, index) => {
				childPath = this.$path.concat(index);

				child = new DataPath(this.$vm, childPath, item, this.$rules, this);

				this.$childs[index] = child;
			});
		}

		return child !== undefined;
	}

	$updateChilds() {
		let oldChilds = Object.values(this.$childs);
		let newChilds = {};
		let oldIndex;
		let child;

		oldChilds.forEach((child) => {
			child.$deleteWatcher(true);
		});

		this.$data.forEach((item, newIndex) => {
			oldIndex = oldChilds.findIndex((child) => {
				return child.$data === item;
			});

			if (oldIndex !== -1) {
				child = oldChilds.splice(oldIndex, 1)[0];
				child.$path.splice(-1, 1, newIndex);
				child.$createWatcher(true);

			} else {
				child = new DataPath(this.$vm, this.$path.concat(newIndex), item, this.$rules, this);
			}

			newChilds[newIndex] = child;
		});

		this.$childs = newChilds;
	}

	$createWatcher(recursive = false) {
		if (this.$watcher)
			this.$watcher();

		if (this.$path.length === 0)
			return;

		if (recursive) {
			Object.values(this.$childs).forEach((child) => {
				child.$createWatcher();
			});
		}

		this.$watcher = this.$vm.$watch(this.$toString(), (newValue, oldValue) => {
			if (Utils.isArray(this.$data)) {
				let updated = Object.keys(this.$childs).length !== this.$data.length;

				if (updated === false) {
					updated = this.$data.some((item, index) => {
						let target = this.$childs[index].$getTarget();

						if (Utils.isObject(target.$data) || Utils.isArray(target.$data))
							return target.$data !== item;

						return item !== oldValue[index];
					});
				}

				if (updated)
					this.$updateChilds();

				return;
			}

			this.$data = newValue;

			this.$validate(true);
		});
	}

	$deleteWatcher(recursive = false) {
		if (recursive) {
			Object.values(this.$childs).forEach((child) => {
				child.$deleteWatcher(true);
			});
		}

		if ('$watcher' in this && Utils.isFunction(this.$watcher)) {
			this.$watcher();
			this.$watcher = undefined;
		}
	}

	$addValidation(child) {
		this.$validations.set(child.$toString(), child);

		if (this.$parent !== undefined)
			this.$parent.$addValidation(child);
	}

	$hasRules() {
		return '$result' in this;
	}

	$getRules() {
		let rules = Object.keys(this.$rules);

		let reserved = ['message', 'field', 'links', 'linksThen', 'linksCatch'];

		return rules.filter(rule => reserved.includes(rule) === false);
	}

	$reset() {
		this.$validations.forEach((validation) => {
			validation.$result.reset();
		});

		if (this.$result !== undefined)
			this.$result.reset();
	}

	$validate(revalidate = false) {
		let result = this.$vd.$addTask(this.$proxy, revalidate).promise;

		result.then(() => {
			this.$validateLinks(this.$rules.linksThen);

		}).catch(() => {
			this.$validateLinks(this.$rules.linksCatch);

		}).finally(() => {
			this.$validateLinks(this.$rules.links);
		})

		return result;
	}

	$validateLinks(links) {
		if (links === undefined)
			return;

		links = Utils.isArray(links)? links : [links];

		let path;

		links.forEach((link) => {
			path = this.$vd.$getPath(link);

			if (path !== undefined)
				path.$validate(true);
		});
	}

	$toString() {
		return this.$path.join('.');
	}

	$delete(recursive = true) {
		Object.values(this.$childs).forEach((child) => {
			child.$delete();
		});

		this.$deleteWatcher();

		if (this.$parent) {
			let key = this.$path.pop();

			delete this.$parent[key];
		}
	}

}
