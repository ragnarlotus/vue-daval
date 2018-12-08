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

	$getMessage(rule) {
		return this.$vm.$options.vdMessages[rule];
	}

	$addTask(dataPath, revalidate) {
		let path = dataPath.$toString();

		let task = this.$tasks.get(path);

		if (task === undefined) {
			task = new Task(this.$vm, dataPath, revalidate);

			this.$tasks.set(path, task);

		} else {
			task.updateTime();
		}

		task.run();

		return task;
	}

	$removeTask(task) {
		let path = task.dataPath.$toString();

		this.$tasks.delete(path);
	}

}
