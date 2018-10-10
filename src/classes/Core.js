// Core class

import * as Utils from '../libraries/Utils.js';
import Path from './Path.js';
import Task from './Task.js';

export default class Core {

	constructor() {
		this.$paths = new Map;
		this.$tasks = new Map;

		return new Proxy(this, this);
	}

	get(obj, prop) {
		return this[prop] || this.$getPath(prop);
	}

	$addPath(path) {
		this.$paths.set(path.$toString(), path);
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

	$addTask(path, revalidate, propagate) {
		if (path.$hasRules() === false && propagate === false)
			return;

		let task = this.$tasks.get(path.$toString());

		if (task === undefined) {
			task = new Task(path, revalidate, propagate);

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
