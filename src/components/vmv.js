import * as validators from './validators.js';

export default {
	vm: undefined,
	data: {},
	validations: {},
	tasks: {},
	results: {},
	watchers: {},
	messages: {
		type: 'This is not a valid {rule}',
		required: 'This field is required',
		regexp: 'This is no a valid value',
		min: 'Minimun value is {rule}',
		max: 'Maximun value is {rule}',
		minlen: 'Minimun length is {rule}',
		maxlen: 'Maximun length is {rule}',
		length: 'Length must be {rule}',
		equals: 'Must equal the field {rule}',
		enum: 'Must be one of {rule}'
	},


	isObject(o) {
		return o !== null && !Array.isArray(o) && typeof o === 'object';
	},


	isPromise(o) {
		return (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function';
	},


	pathToObject(path, object) {
		if (typeof path === 'string')
			path = path.split('.');

		try {
			for (let i = 0; i < path.length; i++) {
				if (/^[0-9]+$/.test(path[i]) && object[path[i]] === undefined)
					continue;

				object = object[path[i]];
			}

		} catch(e) {
			console.warn('Not a valid path for '+ path);
		}

		return object;
	},


	init(vm, data, validations) {
		this.vm = vm;
		this.data = data;
		this.validations = validations;

		this.removeWatchers();
		this.addObjectWatchers([], this.data, this.validations, this.results);
	},


	setMessages(messages) {
		Object.assign(this.messages, messages);
	},


	addValidators(newValidators) {
		Object.assign(validators, newValidators);
	},


	addWatchers(key, path, value, validation, result) {
		result[key] = {};

		if (this.isObject(value[key]))
			this.addObjectWatchers(path, value[key], validation[key] || validation, result[key]);

		else if (Array.isArray(value[key]))
			this.addArrayWatchers(path, value[key], validation[key], result[key]);

		else
			this.resetResult(result[key]);

		this.watchers[path.join('.')] = this.vm.$watch(() => {
			return value[key];

		}, () => {
			if (this.isObject(value[key]) || Array.isArray(value[key])) {
				this.removeWatchers(path);
				this.addWatchers(key, path, value, validation, result);
			}

			this.validate(path.join('.'), undefined, undefined, true, false);
		});
	},


	addObjectWatchers(path, value, validation, result) {
		Object.keys(validation).forEach((key) => {
			this.addWatchers(key, path.concat(key), value, validation, result);
		});
	},


	addArrayWatchers(path, value, validation, result) {
		value.forEach((element, index) => {
			this.addWatchers(index, path.concat(index), value, validation, result);
		});
	},


	removeWatchers(path) {
		let keys = Object.keys(this.watchers);
		let isChild = new RegExp('^'+ path +'\\.', 'i');

		if (path !== undefined) {
			keys = keys.filter((key) => {
				return path === key || isChild.test(key);
			});
		}

		keys.forEach((key) => {
			this.watchers[key]();
			delete this.watchers[key];
		});
	},


	validate(path, callbackSuccess, callbackError, revalidate, propagate = true) {
		if (!this.isObject(this.tasks[path]))
			this.tasks[path] = {};

		Object.assign(this.tasks[path], {
			$success: typeof callbackSuccess === 'function'? callbackSuccess : undefined,
			$error: typeof callbackError === 'function'? callbackError : undefined
		});

		this.addTasks(Date.now(), {
			origin: path,
			current: path
		}, revalidate, propagate, true);
	},


	addTasks(time, paths, revalidate, propagate, validateOnFinish = false) {
		let value = this.pathToObject(paths.current, this.data);

		if (Array.isArray(value)) {
			if (propagate || paths.current !== paths.origin)
				this.addArrayTasks(value, time, paths, revalidate, propagate);

		} else if (this.isObject(value)) {
			if (propagate || paths.current !== paths.origin)
				this.addObjectTasks(time, paths, revalidate, propagate);

		} else {
			let result = this.pathToObject(paths.current, this.results);

			if (revalidate || result.$validated === false) {
				if (this.tasks[paths.origin][paths.current] === undefined)
					this.tasks[paths.origin][paths.current] = {};

				Object.assign(this.tasks[paths.origin][paths.current], {
					time: time,
					value: value,
					rules: this.pathToObject(paths.current, this.validations),
					result: this.resetResult(result),
					finishedRules: 0
				});
			}
		}

		if (validateOnFinish) {
			if (Object.keys(this.tasks[paths.origin]).length === 2) {
				this.checkValidationsFinished(paths.origin);
				return;
			}

			this.runTasks(time, paths.origin);
		}
	},


	addObjectTasks(time, paths, revalidate, propagate) {
		let validation = this.pathToObject(paths.current, this.validations);

		Object.keys(validation).forEach((key) => {
			this.addTasks(time, {
				origin: paths.origin,
				current: paths.current +'.'+ key
			}, revalidate, propagate);
		});
	},


	addArrayTasks(elements, time, paths, revalidate, propagate) {
		elements.forEach((element, index) => {
			this.addTasks(time, {
				origin: paths.origin,
				current: paths.current +'.'+ index
			}, revalidate, propagate);
		});
	},


	runTasks(time, originPath) {
		Object.keys(this.tasks[originPath]).forEach((currentPath) => {
			if (currentPath === '$success' || currentPath === '$error')
				return;

			this.validateRules({
				time: time,
				paths: {
					origin: originPath,
					current: currentPath
				},
				task: this.tasks[originPath][currentPath]
			});
		});
	},


	validateRules(validation) {
		let task = validation.task;

		if (validation.time < task.time)
			return;

		Object.keys(task.rules).every((ruleName) => {
			if (task.result.$error)
				return false;

			if (typeof task.rules[ruleName] === 'function') {
				let result = task.rules[ruleName](this.vm, task.value, (error) => {
					this.addResult(validation, error);
				});

				if (this.isPromise(result)) {
					result.then(() => {
						this.addResult(validation, undefined);

					}).catch((error) => {
						this.addResult(validation, error.statusText);
					});

					return true;
				}

				this.addResult(validation, result);

				return true;
			}

			let error = validators[ruleName](task.rules, task.value, this.data, this);

			this.addResult(validation, error);

			return !error;
		});
	},


	addResult(validation, error) {
		let task = validation.task;

		if (validation.time < task.time)
			return;

		task.finishedRules++;

		if (error && !task.result.$error)
			task.result.$error = error;

		if (error || task.finishedRules === Object.keys(task.rules).length) {
			task.result.$validated = true;

			delete this.tasks[validation.paths.origin][validation.paths.current];

			this.checkValidationsFinished(validation.paths.origin);
		}
	},


	resetResult(result) {
		if (result === undefined)
			result = {};

		result.$validated = false;
		result.$error = undefined;

		return result;
	},


	checkValidationsFinished(path) {
		if (Object.keys(this.tasks[path]).length > 2)
			return;

		let results = this.pathToObject(path, this.results);
		let hasError = this.validationHasError(results);
		let callback = hasError? this.tasks[path].$error : this.tasks[path].$success;

		if (typeof callback === 'function')
			callback(this.vm);

		delete this.tasks[path.origin];

		this.vm.$forceUpdate();
	},


	validationHasError(results) {
		if (results.$validated === undefined) {
			return Object.keys(results).some((key) => {
				return this.validationHasError(results[key]);
			});
		}

		return results.$error !== undefined;
	}

};
