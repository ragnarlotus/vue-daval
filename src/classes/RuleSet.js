const paramKeys = ['message', 'field', 'links', 'linksThen', 'linksCatch'];

export default class RuleSet {

	constructor(entries) {
		this.entries = entries;
	}

	get params() {
		const params = {};

		for (const key in this.entries) {
			if (paramKeys.includes(key)) {
				params[key] = this.entries[key];
			}
		}

		return params;
	}

	get rules() {
		const rules = {};

		for (const key in this.entries) {
			if (!paramKeys.includes(key)) {
				rules[key] = this.entries[key];
			}
		}

		return rules;
	}

	get count() {
		return Object.keys(this.rules).length;
	}
}
