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
		let child;
		let childPath;

		if (Utils.isObject(this.$data)) {
			Object.keys(this.$rules).forEach((key) => {
				childPath = this.$path.concat(key);

				if (key in this.$data) {
					child = new DataPath(this.$vm, childPath, this.$data[key], this.$rules[key], this);

					this.$childs.push(child);
					this.$vd.$addPath(child);
				}
			});

		} else if (Utils.isArray(this.$data)) {
			this.$data.forEach((item, index) => {
				childPath = this.$path.concat(index);

				child = new DataPath(this.$vm, childPath, item, this.$rules, this);

				this.$childs.push(child);
				this.$vd.$addPath(child);
			});
		}

		return child !== undefined;
	}

	$createWatcher() {
		if (this.$watcher)
			this.$watcher();

		if (this.$path.length === 0)
			return;

		this.$watcher = this.$vm.$watch(this.$toString(), (newValue, oldValue) => {
/*			if (Utils.isObject(newValue) && '__ob__' in newValue)
				return;

			console.log('path', this.$toString());
			console.log('oldValue', oldValue);
			console.log('newValue', newValue);

			if (Utils.isArray(this.$data)) {
				this.$childs.forEach((child) => {
					child.$removeWatcher();
				});
			}

			if (Utils.isObject(this.$data) || Utils.isArray(this.$data)) {
				return this.$createChilds();
			}
*/
			this.$data = newValue;

			this.$validate(true);
		});
	}

	$removeWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = undefined;
	}

}
