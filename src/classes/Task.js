import * as Utils from '@/libraries/Utils.js';

export default class Task {

	constructor(path) {
		this.rootPath = path;

		this.promise = new Promise((resolve, reject) => {
			this.onSuccess = resolve;
			this.onError = reject;
		});

		this.validationPaths = [];
		this.validated = 0;
		this.finished = false;
		this.valid = true;
		this.validators = this.rootPath.$vm.$options.vdValidators;
		this.skipValidationsOnError = this.rootPath.$config.skipValidationsOnError;

		this.addValidationPath(this.rootPath);
	}

	addValidationPath(path) {
		if (path.$result)
			this.validationPaths.push(path);

		if (!path.$childs)
			return;

		for (const child of path.$childs)
			this.addValidationPath(path[child]);
	}

	run(revalidate = false) {
		for (const path of this.validationPaths) {
			if (this.finished)
				break;

			this.validatePath(path, revalidate);
		}

		this.checkFinished();
	}

	validatePath(path, revalidate) {
		if (!revalidate && path.$validated) {
			this.validated++;

			if (path.$error)
				this.valid = false;

			return;
		}

		path.$reset(false);

		const rules = path.$ruleSet.rules;

		for (const [ruleName, ruleValue] of Object.entries(rules)) {
			if (path.$validated)
				break;

			this.validateRule(path, ruleName, ruleValue);
		}
	}

	validateRule(path, ruleName, ruleValue) {
		let valid = false;
		let validator = this.validators[ruleName];
		let data = path.$data;

		if (
			ruleName !== 'required' &&
			[undefined, null].includes(data) &&
			('required' in path.$rules === false || path.$rules.required === false)
		) {
			valid = true;

		} else if (validator !== undefined) {
			if (Utils.isFunction(ruleValue))
				ruleValue = ruleValue.call(this.rootPath.$vm);

			valid = validator.call(this.rootPath.$vm, ruleValue, data, path);

		} else if (Utils.isFunction(ruleValue)) {
			validator = path.$rules[ruleName];
			valid = validator.call(this.rootPath.$vm, data, path);

		} else {
			// eslint-disable-next-line no-console
			console.warn('Rule '+ ruleName +' not valid');
			valid = true;
		}

		if (Utils.isPromise(valid)) {
			valid.then(() => {
				this.addRuleResult(path, ruleName, false);

			}).catch(error => {
				this.addRuleResult(path, ruleName, error.statusText || error);
			});

			return;
		}

		this.addRuleResult(path, ruleName, !valid);
	}

	addRuleResult(path, rule, error) {
		path.$result.add(rule, error);

		if (error !== false)
			this.valid = false;

		if (path.$validated) {
			this.validated++;

			this.checkFinished();
		}
	}

	checkFinished() {
		if (this.validationPaths.length > this.validated && !this.finished)
			return;

		this.finished = true;

		this.rootPath.$vm.$forceUpdate();

		if (this.valid)
			this.onSuccess();

		else
			this.onError();
	}

}
