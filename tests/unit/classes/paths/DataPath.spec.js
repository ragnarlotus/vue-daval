import DataPath from '@/classes/paths/DataPath.js';

describe('DataPath class', () => {
	let dataPath;

	beforeEach(() => {
		dataPath = {
			$vd: {
				$getConfig: jest.fn(),
				$getMessage: jest.fn()
			},
			$getRules: jest.fn()
		};
	});

	it('', () => {
	});

});
