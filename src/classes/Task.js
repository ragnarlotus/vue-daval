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
		if (this.revalidate === false && validation.$result.$validated === true) {
			if (validation.$result.hasError())
				this.valid = false;

			this.removeValidation(validation);

			this.checkValidationsFinished();

			return;
		}

		validation.$result.reset();

		let validator, valid, ruleValue;

		validation.$getRules().forEach((ruleName) => {
			if (validation.$result.$validated)
				return;

			valid = false;
			ruleValue = validation.$rules[ruleName];
			validator = validation.$vm.$options.vdValidators[ruleName];

			if (validator !== undefined) {
				valid = validator.call(validation.$vm, ruleValue, validation.$data);

			} else if (Utils.isFunction(ruleValue)) {
				validator = validation.$rules[ruleName];
				valid = validator.call(validation.$vm, validation.$data);

			} else {
				return;
			}

			if (Utils.isPromise(valid) === true) {
				valid.then(() => {
					this.addPathResult(validation, ruleName, true);

				}).catch((error) => {
					this.addPathResult(validation, ruleName, error.statusText || error);
				});

				return;
			}

			this.addValidationResult(validation, ruleName, valid);
		});
	}

	removeValidation(validation) {
		let index = this.validations.indexOf(validation);

		if (index !== -1)
			this.validations.splice(index, 1);
	}

	addValidationResult(validation, rule, valid) {
		validation.$result.add(rule, valid);

		if (valid !== true)
			this.valid = false;

		if (validation.$result.$validated) {
			this.removeValidation(validation);
			this.checkValidationsFinished();
		}
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
