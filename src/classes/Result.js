// Result class

import * as Utils from '../libraries/Utils.js';

export default class Result {

	constructor(path) {
		this.$path = path;
		this.$skipNextRulesOnError = this.$path.$vm.$options.vdConfig.skipNextRulesOnError;

		this.reset();
	}

	add(rule, valid = false) {
		let error;

		if (Utils.isString(valid)) {
			error = valid;
			valid = false;
		}

		if (valid !== true)
			error = this.getMessage(rule, error);

		this.$rules.set(rule, error);

		if (valid !== true && this.$error === undefined)
			this.$error = error;

		if (this.$numRules === this.$rules.size || (this.$error && this.$skipNextRulesOnError))
			this.$validated = true;
	}

	getMessage(rule, message) {
		if (!message)
			message = this.$path.$rules['message'];

		if (!message)
			message = this.$path.$vm.$options.vdMessages[rule];

		if (!message)
			return '';

		let field = this.$path.$rules['field'];

		if (field === undefined)
			field = this.$path.$path.slice(-1)[0];

		message = message.replace('{field}', this.$path.$path.slice(-1)[0]);
		message = message.replace('{rule}', this.$path.$rules[rule]);

		return message;
	}

	hasError() {
		return this.$error !== undefined;
	}

	getError(rule) {
		this.$rules.get(rule);
	}

	getErrors() {
		let errors = {};

		this.$rules.forEach((error, rule) => {
			if (error)
				errors[rule] = error
		});

		return errors;
	}

	reset() {
		this.$rules = new Map;
		this.$numRules = this.$path.$getRules().length;
		this.$validated = false;
		this.$error = undefined;
	}

};
