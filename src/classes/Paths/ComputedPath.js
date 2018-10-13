// ComputedPath extends Path

import Path from '../Path.js';

let $vm, $vd, cw, cb;

export default class ComputedPath extends Path {

	constructor(vm, path, data, rules) {
		({$vm, $vd} = vm.$vd.$defVars());

		super($vd, path, data, rules);

		if (this.$data.cb)
			this.$createWatcher();

		else
			this.$createChilds();

		return this.$proxy;
	}

	$createChilds() {
		let child;

		Object.keys(this.$rules).forEach((key) => {
			if (key in this.$data) {
				child = new ComputedPath($vm, this.$path.concat(key), this.$data[key], this.$rules[key]);

				$vd.$addPath(child);
			}
		});
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
