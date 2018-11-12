import Core from '../classes/Core.js';
import DataPath from '../classes/Paths/DataPath.js';
import * as Validators from '../libraries/Validators.js';

export default {

	beforeMount() {
		this.$vd = new Core(this);

		let data = Object.assign({}, this.$data);

		if (this._computedWatchers) {
			Object.keys(this._computedWatchers).forEach((key) => {
				data[key] = this[key];
			});
		}

		this.$vd.$paths[''] = new DataPath(this, '', data, this.$options.vdRules);
	},

	beforeDestroy() {
		this.$vd.$paths[''].$delete();
	},

	vdConfig: {
		validateOnType: true,
		skipValidationsOnError: false,
		skipRulesOnError: false
	},

	vdRules: {},

	vdValidators: Validators,

	vdMessages: {
		type: 'This is not a valid {rule}',
		required: 'This field is required',
		regexp: 'This is not a valid value',
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
