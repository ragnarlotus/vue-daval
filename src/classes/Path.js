import Result from './Result';
import RuleSet from './RuleSet';
import Task from './Task';
import * as Utils from '@/libraries/Utils.js';

export default class Path {

	constructor(vm, key, rules, parent) {
		this.$vm = vm;
		this.$key = key;
		this.$ruleSet = rules;
		this.$parent = parent;
		this.$config = vm.$options.vdConfig;

		this.$setChilds();
		this.$createWatcher();
	}

	$setChilds() {
		if (this.$ruleSet instanceof RuleSet) {
			this.$result = new Result(this);
			return;
		}

		this.$childs = [];

		if (Utils.isArray(this.$ruleSet)) {
			this.$result = new Result(this);

			this.$data.forEach((item, index) => {
				this[index] = new Path(this.$vm, index, this.$ruleSet.items, this);
				this.$childs.push(index);
			});

			return;
		}

		if (Utils.isObject(this.$ruleSet)) {
			for (const key in this.$ruleSet) {
				this[key] = new Path(this.$vm, key, this.$ruleSet[key], this);

				if (!this.$childs.includes(key))
					this.$childs.push(key);
			}

			return;
		}
	}

	get $data() {
		return this.$key? this.$parent.$data[this.$key] : this.$parent.$data;
	}

	get $rules() {
		return this.$ruleSet.rules;
	}

	$createWatcher() {
		if (this.$result && !this.$config.validateOnType)
			return;

		this.$watcher = this.$vm.$watch(() => this.$data, () => {
			if (this.$result)
				this.$validate(true).then(() => {}).catch(() => {});
		});
	}

	get $validated() {
		return this.$result.validated;
	}

	get $valid() {
		return this.$result.valid;
	}

	get $invalid() {
		return this.$result.invalid;
	}

	get $error() {
		return this.$result.error;
	}

	get $errors() {
		return this.$result.errors;
	}

	$reset(recursive = true) {
		if (recursive) {
			for (const key of this.$childs) {
				this[key].$reset();
			}
		}

		if ('$result' in this)
			this.$result.reset();
	}

	$validate(revalidate = false) {
		const task = new Task(this);
		task.run(revalidate);
		return task.promise;
	}

}
