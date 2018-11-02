// Core class

import * as Utils from '../libraries/Utils.js';
import UndefinedPath from './Paths/UndefinedPath.js';
import Task from './Task.js';

export default class Core {

	constructor(vm) {
		this.$vm = vm;

		this.$paths = new Map;
		this.$tasks = new Map;

		return new Proxy(this, this);
	}

	get(obj, prop) {
		return this[prop] || this.$getPath(prop) || new UndefinedPath(prop);
	}

	$addPath(path) {
		this.$paths.set(path.$toString(), path);
	}

	$getPath(path) {
		if (Utils.isArray(path))
			path = path.join('.');

		if (['$errors', '$reset', '$validate'].includes(path))
			return this.$paths.get('')[path];

		if (this.$paths.has(path))
			return this.$paths.get(path);

		return undefined;
	}

	$removePath(path, recursive = true) {
		dataPath = this.$getPath(path);

		if (dataPath) {
			if (recursive) {
				dataPath.$childs.forEach((child) => {
					this.$removePath(child.$path);
				});
			}

			dataPath.$removeWatcher();

			this.$vm.$nextTick(() => {
				this.$paths.delete(path);
			});
		}
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
