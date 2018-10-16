<template>
	<div>
		<h4>Groups</h4>

		<div class="row">
			<div class="col-sm-4">
				<h5>Address book</h5>

				<div v-for="(person, i) in persons" :key="i">
					<div class="form-group">
						<label>Name</label>
						<input v-model="person.name" :class="$vd.persons[i]? getInputClass($vd.persons[i].name) : ''">
						<div v-show="$vd.persons[i].name.$error" class="invalid-feedback">{{ $vd.persons[i].name.$error }}</div>
					</div>

					<div class="form-group">
						<label>Address</label>
						<input v-model="person.address" :class="$vd.persons[i]? getInputClass($vd.persons[i].address) : ''">
						<div v-show="$vd.persons[i].address.$error" class="invalid-feedback">{{ $vd.persons[i].address.$error }}</div>
					</div>
				</div>

				<button type="button" @click="addPerson()">Add</button>
			</div>

			<div class="col-sm-8">
			</div>
		</div>
	</div>
</template>

<script>
	import VueDaval from '../mixins/VueDaval.js';

	export default {
		name: 'NestedValidations',

		mixins: [ VueDaval ],

		data: () => ({
			persons: [{
				name: 'Name 1',
				address: 'Address 1'
			}, {
				name: 'Name 2',
				address: 'Address 2'
			}]
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			persons: {
				name: { required: true, minlen: 5 },
				address: { required: true }
			}
		},

		methods: {
			addPerson() {
				this.persons.push({
					name: 'xxx',
					address: 'zzzz'
				});
			}
		}
	}
</script>
