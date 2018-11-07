// Core class

import * as Utils from '../libraries/Utils.js';
import UndefinedPath from './Paths/UndefinedPath.js';
import Task from './Task.js';

export default class Core {

	constructor(vm) {
		this.$vm = vm;

		this.$paths = {};
		this.$tasks = new Map;

		return new Proxy(this, this);
	}

	get(obj, prop) {
		if (prop in obj)
			return this[prop];

		return this.$paths[''][prop];
	}

	$getConfig(config) {
		return this.$vm.$options.vdConfig[config];
	}

	$getValidator(validator) {
		return this.$vm.$options.vdValidators[validator];
	}

	$addTask(path, revalidate) {
		let task = this.$tasks.get(path.$toString());

		if (task === undefined) {
			task = new Task(this.$vm, path, revalidate);

			this.$tasks.set(path.$toString(), task);
		}

		this.$runTask(task);

		return task;
	}

	$runTask(task) {
		task.run();
	}

	$removeTask(task) {
		this.$tasks.delete(task.path.$toString());
	}

};
