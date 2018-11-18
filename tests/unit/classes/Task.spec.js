import Task from '@/classes/Task.js';

describe('Task class', () => {
	let task;

	let vm = {};

	let dataPath = {
		$hasRules: () => {},
		$childs: {}
	};

	it('', () => {
		task = new Task(vm, dataPath, true);
	});

});
