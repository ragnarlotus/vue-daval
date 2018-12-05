// UndefinedPath

export default class UndefinedPath {

	constructor(prop) {
		this.prop = prop;

		// eslint-disable-next-line no-console
		console.error('Rules not defined for '+ prop);

		return new Proxy(this, this);
	}

	get(obj, prop) {
		if (prop[0] === '$')
			return '';

		return new UndefinedPath(this.prop +'.'+ prop);
	}

}
