// Task class

import * as Utils from '../libraries/Utils.js';

export default class Task {

	constructor(vm, dataPath, revalidate) {
		this.$vm = vm;
		this.$vd = vm.$vd;

		this.promise = new Promise((resolve, reject) => {
			this.onSuccess = resolve;
			this.onError = reject;
		});

		this.dataPath = dataPath;
		this.revalidate = revalidate;
		this.validations = new Map();
		this.validated = 0;
		this.finished = false;
		this.valid = true;

		this.addValidation(this.dataPath);
	}

	addValidation(dataPath) {
		if (dataPath.$hasRules())
			this.validations.set(dataPath.$toString(), dataPath);

		Object.values(dataPath.$childs).forEach((child) => {
			this.addValidation(child);
		});
	}

	updateTime() {
		this.time = Date.now();
	}

	run() {
		let skipValidationsOnError = this.$vd.$getConfig('skipValidationsOnError');

		for (let [path, validation] of this.validations.entries()) {
			if (skipValidationsOnError && this.valid === false) {
				this.validated = this.validations.size;
				break;
			}

			this.checkValidation(validation);
		}

		this.checkValidationsFinished();
	}

	checkValidation(validation) {
		if (this.revalidate === false && validation.$validated === true) {
			this.validated++;

			if (validation.$error)
				this.valid = false;

			return;
		}

		validation.$reset(false);

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
		if (this.validations.size > this.validated || this.finished)
			return;

		this.finished = true;

		this.valid? this.onSuccess() : this.onError();

		this.$vm.$forceUpdate();

		this.$vd.$removeTask(this);
	}

};
