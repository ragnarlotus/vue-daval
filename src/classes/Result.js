import { isFunction } from '../libraries/Utils'

export default class Result {

	constructor(path) {
		this.path = path;

		this.reset();
	}

	get numRules() {
		return Object.keys(this.rules).length;
	}

	get valid() {
		return this.error === undefined;
	}

	get invalid() {
		return !this.valid;
	}

	get errors() {
		return Object.fromEntries(Object.entries(this.rules).filter(rule => rule[1]));
	}

	reset() {
		this.error = undefined;
		this.rules = {};
		this.validated = false;
	}

	add(rule, error = true) {
		if (error !== false) {
			error = this.getMessage(rule, error === true? undefined : error);

			if (!this.error)
				this.error = error;
		}

		this.rules[rule] = error;

		if (this.numRules >= this.path.$ruleSet.count || (this.error && this.path.$config.skipRulesOnError))
			this.validated = true;
	}

	getMessage(rule, message) {
		const rules = this.path.$ruleSet.entries;

		if (!message)
			message = rules.message;

		if (!message)
			message = this.path.$vm.$options.vdMessages[rule];

		if (!message)
			return this.path.$vm.$options.vdMessages['undefined'];

		if (isFunction(message))
			return message.call(this.path.$vm, rule);

		let field = rules.field || this.path.$key;

		message = message.replace('{field}', field);

		rule = rules[rule].toString();

		rule = rule.split('.').slice(-1)[0];

		message = message.replace('{rule}', rule);

		return message;
	}

}
