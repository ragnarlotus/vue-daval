import * as Utils from '../libraries/Utils.js';

export default class Result {

	constructor(dataPath) {
		this.vd = dataPath.$vd;
		this.dataPath = dataPath;

		this.reset();
	}

	add(rule, valid = false) {
		let error;

		if (Utils.isString(valid)) {
			error = valid;
			valid = false;
		}

		if (!valid)
			error = this.getMessage(rule, error);

		this.rules[rule] = error;

		if (!valid && !this.error)
			this.error = error;

		if (Object.keys(this.rules).length === this.numRules || (this.error && this.vd.$getConfig('skipRulesOnError')))
			this.validated = true;
	}

	getMessage(rule, message) {
		if (!message)
			message = this.dataPath.$rules.message;

		if (!message)
			message = this.vd.$getMessage(rule);

		if (!message)
			return this.vd.$getMessage('undefined');

		let field = this.dataPath.$rules.field || this.dataPath.$key;

		message = message.replace('{field}', field);

		rule = this.dataPath.$rules[rule].toString();

		rule = rule.split('.').slice(-1)[0];

		message = message.replace('{rule}', rule);

		return message;
	}

	hasError() {
		return this.error !== undefined;
	}

	getErrors() {
		return Object.values(this.rules).filter(error => error);
	}

	reset() {
		this.error = undefined;
		this.rules = {};
		this.numRules = this.dataPath.$getRules().length;
		this.validated = false;
	}

}
