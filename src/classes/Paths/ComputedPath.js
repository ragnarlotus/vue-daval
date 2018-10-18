// ComputedPath extends Path

import Path from '../Path.js';
import DataPath from './DataPath.js';

export default class ComputedPath extends Path {

	constructor(vm, path, data, rules) {
		super(vm, path, data, rules);

		if (this.$data)
			this.$createChilds();

		return this.$proxy;
	}

	$createChilds() {
		let child;
		let parent = this.$vd.$getPath('');

		Object.keys(this.$rules).forEach((key) => {
			if (key in this.$data) {
				child = new DataPath(this.$vm, this.$path.concat(key), this[key], this.$rules[key], parent);

				this.$vd.$addPath(child);
			}
		});
	}

}
