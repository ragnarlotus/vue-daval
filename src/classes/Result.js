// Result class

import * as Utils from '../libraries/Utils.js';

export default class Result {

	constructor(vm, path) {
		this.$vdConfig = vm.$options.vdConfig;
		this.$vdMessages = vm.$options.vdMessages;

		this.path = path;

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

		this.rules.set(rule, error);

		if (valid !== true && this.error === undefined)
			this.error = error;

		if (this.numRules === this.rules.size || (this.error && this.$vdConfig.skipNextRulesOnError))
			this.validated = true;
	}

	getMessage(rule, message) {
		let path = this.path;

		if (!message)
			message = path.$rules['message'];

		if (!message)
			message = this.$vdMessages[rule];

		if (!message)
			return this.$vdMessages['undefined'];

		let field = path.$rules['field'] || path.$path.slice(-1)[0];

		message = message.replace('{field}', field);

		rule = path.$rules[rule].toString();

		rule = rule.split('.').slice(-1)[0];

		message = message.replace('{rule}', rule);

		return message;
	}

	hasError() {
		return this.error !== undefined;
	}

	getError(rule) {
		this.rules.get(rule);
	}

	getErrors() {
		let errors = {};

		this.rules.forEach((error, rule) => {
			if (error)
				errors[rule] = error;
		});

		return errors;
	}

	reset() {
		this.rules = new Map;
		this.numRules = this.path.$getRules().length;
		this.validated = false;
		this.error = undefined;
	}

};
