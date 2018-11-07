// Task class

import * as Utils from '../libraries/Utils.js';

export default class Task {

	constructor(vm, path, revalidate) {
		this.$vm = vm;
		this.$vd = vm.$vd;

		this.promise = new Promise((resolve, reject) => {
			this.onSuccess = resolve;
			this.onError = reject;
		});

		this.path = path;
		this.revalidate = revalidate;
		this.validations = new Map(this.path.$validations);
		this.validated = 0;
		this.valid = true;

		if (this.path.$hasRules())
			this.validations.set(this.path.$toString(), this.path);
	}

	updateTime() {
		this.time = Date.now();
	}

	run() {
		let finishOnError = this.$vd.$getConfig('skipValidationsOnError');

		for (let [path, validation] of this.validations.entries()) {
			if (finishOnError && this.valid === false) {
				this.validated = this.validations.size;
				break;
			}

			this.checkValidation(validation);
		}

		this.checkValidationsFinished();
	}

	checkValidation(validation) {
		if (this.revalidate === false && validation.$validated === true) {
			if (validation.$result.hasError())
				this.valid = false;

			return;
		}

		validation.$reset();

		validation.$getRules().forEach((rule) => {
			if (validation.$validated)
				return;

			this.checkValidationRule(validation, rule);
		});
	}

	checkValidationRule(validation, ruleName) {
		let valid = false;
		let ruleValue = validation.$rules[ruleName];
		let validator = this.$vd.$getValidator(ruleName);
		let data = validation.$data;

		if (validator !== undefined) {
			if (Utils.isFunction(ruleValue))
				ruleValue = ruleValue.call($vm);

			valid = validator.call(this.$vm, ruleValue, data);

		} else if (Utils.isFunction(ruleValue)) {
			validator = validation.$rules[ruleName];
			valid = validator.call(this.$vm, data);

		} else {
			console.warn('Rule '+ ruleName +' not valid');
			valid = true;
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

		if (validation.$validated) {
			this.validated++;

			this.checkValidationsFinished();
		}
	}

	checkValidationsFinished() {
		if (this.validations.size > this.validated)
			return;

		this.valid? this.onSuccess() : this.onError();

		this.$vm.$forceUpdate();

		this.$vd.$removeTask(this);
	}

};
