// DataPath extends Path

import Path from '../Path.js';
import * as Utils from '../../libraries/Utils.js';
import Result from '../Result.js';

let $vm, $vd;

export default class DataPath extends Path {

	constructor(vm, path, data, rules, parent) {
		({$vm, $vd} = vm.$vd.$defVars());

		super($vd, path, data, rules);

		this.$parent = parent;

		this.$createWatcher();

		if (this.$createChilds() === false) {
			this.$result = new Result($vd, this);

			this.$parent.$addValidation(this.$proxy);
		}

		return this.$proxy;
	}

	$createChilds() {
		let child;

		if (Utils.isObject(this.$data)) {
			Object.keys(this.$rules).forEach((key) => {
				if (key in this.$data) {
					child = new DataPath($vm, this.$path.concat(key), this.$data[key], this.$rules[key], this);

					$vd.$addPath(child);
				}
			});

		} else if (Utils.isArray(this.$data)) {
			this.$data.forEach((item, index) => {
				child = new DataPath($vm, this.$path.concat(index), item, this.$rules, this);

				$vd.$addPath(child);
			});
		}

		return child !== undefined;
	}

	$createWatcher() {
		if (this.$watcher)
			this.$watcher();

		if (this.$path.length === 0)
			return;

		this.$watcher = $vm.$watch(this.$toString(), (value) => {
			this.$data = value;

			this.$validate(true);
		});
	}

	$removeWatcher() {
		if (this.$watcher)
			this.$watcher();

		this.$watcher = undefined;
	}

}
