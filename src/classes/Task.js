// Task class

import * as Utils from '../libraries/Utils.js';

export default class Task {

	constructor(path, revalidate, propagate) {
		this.promise = new Promise((resolve, reject) => {
			this.onSuccess = resolve;
			this.onError = reject;
		});

		this.path = path;
		this.revalidate = revalidate;
		this.propagate = propagate;
		this.validations = [].concat(this.path.$validations);
		this.valid = true;

		if (this.path.$hasRules())
			this.validations.push(this.path);
	}

	updateTime() {
		this.time = Date.now();
	}

	run() {
		let validations = [].concat(this.validations);

		validations.forEach((validation) => {
			this.checkValidation(validation);
		});

		this.checkValidationsFinished();
	}

	checkValidation(validation) {
		if (this.revalidate === false && validation.$validated === true) {
			if (validation.$result.hasError())
				this.valid = false;

			this.removeValidation(validation);

			return;
		}

		validation.$result.reset();

		validation.$getRules().forEach((rule) => {
			if (validation.$validated)
				return;

			this.checkValidationRule(validation, rule);
		});
	}

	checkValidationRule(validation, ruleName) {
		let valid = false;
		let ruleValue = validation.$rules[ruleName];
		let validator = validation.$vm.$options.vdValidators[ruleName];

		if (validator !== undefined) {
			if (Utils.isFunction(ruleValue))
				ruleValue = ruleValue.call(validation.$vm);

			valid = validator.call(validation.$vm, ruleValue, validation.$data);

		} else if (Utils.isFunction(ruleValue)) {
			validator = validation.$rules[ruleName];
			valid = validator.call(validation.$vm, validation.$data);

		} else {
			return;
		}

		if (Utils.isPromise(valid) === true) {
			valid.then(() => {
				this.addValidationRuleResult(validation, ruleName, true);

			}).catch((error) => {
				this.addValidationRuleResult(validation, ruleName, error.statusText || error);
			});

			return;
		}

		this.addValidationRuleResult(validation, ruleName, valid);
	}

	addValidationRuleResult(validation, rule, valid) {
		validation.$result.add(rule, valid);

		if (valid !== true)
			this.valid = false;

		if (validation.$validated)
			this.removeValidation(validation);
	}

	removeValidation(validation) {
		let index = this.validations.indexOf(validation);

		if (index !== -1)
			this.validations.splice(index, 1);

		this.checkValidationsFinished();
	}

	checkValidationsFinished() {
		if (this.validations.length > 0)
			return;

		if (this.valid)
			this.onSuccess();

		else
			this.onError();

		this.path.$vm.$forceUpdate();

		this.path.$vm.$vd.$removeTask(this);
	}

};
