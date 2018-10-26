// DataPath extends Path

import Path from '../Path.js';
import * as Utils from '../../libraries/Utils.js';
import Result from '../Result.js';

export default class DataPath extends Path {

	constructor(vm, path, data, rules, parent) {
		super(vm, path, data, rules);

		this.$parent = parent;

		this.$createWatcher();

		if (this.$createChilds() === false) {
			this.$result = new Result(vm, this);

			this.$parent.$addValidation(this.$proxy);
		}

		return this.$proxy;
	}

	$createChilds() {
		this.$childs = new Map;

		let child;
		let childPath;

		if (Utils.isObject(this.$data)) {
			Object.keys(this.$rules).forEach((key) => {
				childPath = this.$path.concat(key);

				if (key in this.$data) {
					child = new DataPath(this.$vm, childPath, this.$data[key], this.$rules[key], this);

					this.$childs.set(child.$toString(), child);
					this.$vd.$addPath(child);
				}
			});

		} else if (Utils.isArray(this.$data)) {
			this.$data.forEach((item, index) => {
				childPath = this.$path.concat(index);

				child = new DataPath(this.$vm, childPath, item, this.$rules, this);

				this.$childs.set(child.$toString(), child);
				this.$vd.$addPath(child);
			});
		}

		return child !== undefined;
	}

	$updateChilds() {
		let oldChilds = (new Map(this.$childs)).values();
		let currentChilds = this.$data.values();
		let newChilds = new Map;
		let oldIndex, newIndex;
		let child;

		for (let [item, newIndex] of currentChilds) {
			oldIndex = oldChilds.indexOf(item);

			if (oldIndex !== -1) {
				child = oldChilds.splice(oldIndex, 1)[0];
				child.$path.splice(-1, 1, newIndex);

			} else {
				child = new DataPath(this.$vm, this.$path.concat(newIndex), item, this.$rules, this);
			}

			this.$vd.$addPath(child);
			newChilds.set(newIndex, child);
		}

		for (let path of this.$childs.keys()) {
			if (newChilds.has(path) === false)
				this.$vd.$removePath(path);
		}

		this.$childs = newChilds;
	}

	$createWatcher() {
		if (this.$watcher)
			this.$watcher();

		if (this.$path.length === 0)
			return;

		this.$watcher = this.$vm.$watch(this.$toString(), (newValue, oldValue) => {
			this.$data = newValue;

			if (Utils.isArray(this.$data)) {
				if (this.$data.length !== this.$childs.size)
					this.$updateChilds();

				return;
			}

			console.log('path', this.$toString());
			console.log('oldValue', oldValue);
			console.log('newValue', newValue);

			this.$validate(true);
		});
	}

	$removeWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = undefined;
	}

}
