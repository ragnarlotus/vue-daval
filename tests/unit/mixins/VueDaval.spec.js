import VueDaval from '@/mixins/VueDaval.js';
import DataPath from '@/classes/paths/DataPath.js';
import UndefinedPath from '@/classes/paths/UndefinedPath.js';
import * as Validators from '@/libraries/Validators.js';

describe('VueDaval mixin', () => {
	let vm;

	window.console.error = jest.fn();

	beforeEach(() => {
		vm = {
			$data: {
				data1: 'data1',
				data2: {
					data21: 'data21',
					data22: 'data22'
				}
			},
			_computedWatchers: {
				computed1: {}
			},
			computed1: 'computed1',
			$options: {
				vdConfig: {},
				vdRules: {
					data1: {},
					data2: {
						data21: {},
						data22: {},
					},
					computed1: {}
				}
			}
		};
	});

	it('takes data from vue instance before mount', () => {
		VueDaval.beforeMount.call(vm);

		expect(vm.$vd.data1).toBeInstanceOf(DataPath);
		expect(vm.$vd.data2.data21).toBeInstanceOf(DataPath);
		expect(vm.$vd.data2.data22).toBeInstanceOf(DataPath);
	});

	it('takes computed from vue instance before mount', () => {
		VueDaval.beforeMount.call(vm);

		expect(vm.$vd.computed1).toBeInstanceOf(DataPath);

		delete vm._computedWatchers;

		VueDaval.beforeMount.call(vm);

		expect(vm.$vd.computed1).toBeInstanceOf(UndefinedPath);
	});

	it('creates root path before mount', () => {
		VueDaval.beforeMount.call(vm);

		expect(vm.$vd.$paths['']).toBeInstanceOf(DataPath);
	});

	it('contains default config', () => {
		expect(VueDaval.vdConfig).toBeDefined();
		expect(Object.keys(VueDaval.vdConfig).length).toBe(3);
	});

	it('contains default validators', () => {
		expect(VueDaval.vdValidators).toBeDefined();

		let numValidators = Object.keys(Validators).length
		expect(Object.keys(VueDaval.vdValidators).length).toBe(numValidators);
	});

	it('contains default messages', () => {
		expect(VueDaval.vdMessages).toBeDefined();

		let numValidators = Object.keys(Validators).length
		expect(Object.keys(VueDaval.vdMessages).length).toBe(numValidators + 1);
	});

	it('deletes paths before destroy', () => {
		VueDaval.beforeMount.call(vm);

		vm.$vd.$paths[''].$delete = jest.fn();

		VueDaval.beforeDestroy.call(vm);

		expect(vm.$vd.$paths[''].$delete).toHaveBeenCalled();
	});

});
