// ComputedPath extends Path

import Path from '../Path.js';
import DataPath from './DataPath.js';

let $vm, $vd;

export default class ComputedPath extends Path {

	constructor(vm, path, data, rules) {
		({$vm, $vd} = vm.$vd.$defVars());

		super($vd, path, data, rules);

		if (this.$data)
			this.$createChilds();

		return this.$proxy;
	}

	$createChilds() {
		let child;
		let parent = $vd.$getPath('');

		Object.keys(this.$rules).forEach((key) => {
			if (key in this.$data) {
				child = new DataPath($vm, this.$path.concat(key), this[key], this.$rules[key], parent);

				$vd.$addPath(child);
			}
		});
	}

}
