import vmv from './vmv.js';

export default {

	beforeMount() {
		if (!this.$options.validations) {
			console.warn('No validations defined');
			return;
		}

		vmv.init(this, this._data, this.$options.validations);

		this.$vmv = vmv.results;
		this.$vmv.$validate = vmv.validate.bind(vmv);
		this.$vmv.$setMessages = vmv.setMessages;

		if (this.$options.validationMessages)
			this.vmv.setMessages(this.$options.validationMessages);
	},


	beforeDestroy() {
		vmv.removeWatchers();
	}

};
