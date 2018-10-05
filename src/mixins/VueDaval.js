import Core from '../classes/Core.js';
import * as Validators from '../libraries/Validators.js';

export default {

	beforeMount() {
		this.$vd = new Core(this);
	},

	beforeDestroyed() {
		this.$vd.$paths.forEach((pathModel, path) => {
			this.$vd.$removePath(path);
		});
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
		enum: 'Must be one of {rule}'
	}

};
