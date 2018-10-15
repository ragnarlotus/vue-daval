// Task class

import * as Utils from '../libraries/Utils.js';

let $vm, $vd, $vdConfig, $vdValidators;

export default class Task {

	constructor(vd, path, revalidate) {
		({$vm, $vd, $vdConfig, $vdValidators} = vd.$defVars());

		this.promise = new Promise((resolve, reject) => {
			this.onSuccess = resolve;
			this.onError = reject;
		});

		this.path = path;
		this.revalidate = revalidate;
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
			if ($vdConfig.skipNextValidationsOnError && this.valid === false) {
				this.validations = validations = [];

				return;
			}

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
		let validator = $vdValidators[ruleName];
		let data = validation.$data;

		if (validator !== undefined) {
			if (Utils.isFunction(ruleValue))
				ruleValue = ruleValue.call($vm);

			valid = validator.call($vm, ruleValue, data);

		} else if (Utils.isFunction(ruleValue)) {
			validator = validation.$rules[ruleName];
			valid = validator.call($vm, data);

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

		this.valid? this.onSuccess() : this.onError();

		$vm.$forceUpdate();

		$vd.$removeTask(this);
	}

};
