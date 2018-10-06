// Core class

import Utils from '../libraries/Utils.js';
import Path from './Path.js';
import Task from './Task.js';

export default class Core {

	constructor(vm) {
		this.$vm = vm;
		this.$data = vm._data;
		this.$rules = vm.$options.vdRules;
		this.$paths = new Map;
		this.$tasks = new Map;

		this.$addPath([], this.$data, this.$rules);

		return new Proxy(this, this);
	}

	get(obj, prop) {
		return this[prop] || this.$getPath(prop);
	}

	$addPath(path, data, rules, parent) {
		let pathModel = new Path(this.$vm, path, data, rules, parent);

		this.$paths.set(path.join('.'), pathModel);

		let child;

		if (Utils.isObject(data)) {
			Object.keys(rules).forEach((key) => {
				child = this.$addPath(path.concat(key), data[key], rules[key], pathModel);

				pathModel.$addChild(child);
			});

		} else if (Utils.isArray(data)) {
			data.forEach((item, index) => {
				child = this.$addPath(path.concat(index), item, rules, pathModel);

				pathModel.$addChild(child);
			});
		}

		return pathModel;
	}

	$getPath(path) {
		if (Utils.isArray(path))
			path = path.join('.');

		if (this.$paths.has(path))
			return this.$paths.get(path);

		console.error('Rules not defined for '+ path);

		return undefined;
	}

	$removePath(path) {
		let pathModel = this.$getPath(path);

		if (pathModel) {
			pathModel.$removeWatcher();
			this.$path.delete(path);
		}
	}

	$addTask(path, onSuccess, onError, revalidate, propagate, rootTask) {
		let time = Date.now();

		let task = new Task(path, onSuccess, onError, revalidate, time);

		this.tasks.set(path.toString(), task);

		if (propagate && path.$childs.length) {
			rootTask = rootTask || task;

			let childTask;

			path.$childs.forEach((childPath) => {
				childTask = this.$addTask(childPath, undefined, undefined, revalidate, propagate, rootTask);

				originTask.$addChild(childTask);
			});
		}

		if (rootTask === undefined || rootTask === task) {
			this.$runTask(task);
		}

		return task;
	}

};
