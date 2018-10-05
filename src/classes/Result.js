// Result class

export default class Result {

	constructor() {
		this.reset();
	}

	get validated() {
		return this.$validated;
	}

	set validated(v) {
		this.$validated = v;
	}

	get error() {
		return this.$error;
	}

	set error(e) {
		this.$error = e;
	}

	hasError() {
		return this.error !== undefined;
	}

	reset() {
		this.$validated = false;
		this.$error = undefined;
	}

};
