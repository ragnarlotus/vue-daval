import Core from '../classes/Core.js';
import DataPath from '../classes/Paths/DataPath.js';
import ComputedPath from '../classes/Paths/ComputedPath.js';
import * as Validators from '../libraries/Validators.js';

export default {

	beforeMount() {
		this.$vd = new Core(this);

		let path;

		path = new DataPath(this, [], this._data, this.$options.vdRules);
		this.$vd.$addPath(path);

		new ComputedPath(this, [], this._computedWatchers, this.$options.vdRules);
	},

	beforeDestroyed() {
		this.$vd.$paths.forEach((undefined, path) => {
			this.$vd.$removePath(path);
		});
	},

	vdConfig: {
		skipNextValidationsOnError: false,
		skipNextRulesOnError: false
	},

	vdRules: {},

	vdValidators: Validators,

	vdMessages: {
		type: 'This is not a valid {rule}',
		required: 'This field is required',
		regexp: 'This is no a valid value',
		min: 'Minimun value is {rule}',
		max: 'Maximun value is {rule}',
		minlen: 'Minimun length is {rule}',
		maxlen: 'Maximun length is {rule}',
		length: 'Length must be {rule}',
		equals: 'Must equal the field {rule}',
		is: 'Must be {rule}',
		isnot: 'Must not be {rule}',
		isin: 'Must be one of {rule}',
		undefined: 'Undefined error'
	}

};
