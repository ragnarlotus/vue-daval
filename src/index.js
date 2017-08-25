import vmv from './vmv.js';

export default {
	created() {
		if (!this.$options.validations) {
			console.warn('No validations defined');
			return;
		}

		vmv.init(this, this._data, this.$options.validations);

		this.$vmv = vmv.results;
		this.$vmv.$validate = vmv.validate.bind(vmv);
		this.$vmv.$setMessages = this.$options.validationMessages || vmv.setMessages;
	},


	beforeDestroy() {
		vmv.removeWatchers();
	}

};
