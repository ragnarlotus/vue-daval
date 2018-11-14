import { shallowMount } from '@vue/test-utils';
import * as Utils from '@/libraries/Utils.js';

describe('Utils.js', () => {
	it('identifies a string properly', () => {
		let value = 'this is a string';

		expect(Utils.isString(value)).toBe(true);
	});

	it('identifies a not a string when array properly', () => {

	});

	it('identifies a not a string when number properly', () => {

	});

	it('identifies a not a string when object properly', () => {

	});

	it('identifies a not a string when function properly', () => {

	});

});
