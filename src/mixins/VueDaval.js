import Path from '@/classes/Path';
import * as Validators from '@/libraries/Validators';

export default {

	beforeMount() {
		this.$vd = new Path(this, undefined, this.$options.vdRules, this);
		// this.$set(this, '$vd', $vd);
	},

	beforeDestroy() {
		// this.$vd.$delete();
	},

	// watch: {
	// 	$data: {
	// 		deep: true,
	// 		handler(newData, oldData) {
	// 			console.log('old', oldData);
	// 			console.log('new', newData);
	// 			this.$vd.$setChilds();
	// 		},
	// 	},
	// },

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
