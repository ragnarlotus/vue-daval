<template>
	<div class="mt-4">
		<h4>Nested validations</h4>

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
					<button type="button" @click="removePerson(i)">Remove</button>
				</div>

				<button type="button" @click="addPerson()">Add</button>
			</div>

			<div class="col-sm-8">
				<b-tabs>
					<b-tab title="Component" active>
						<highlight-code lang="javascript">data: () => ({
   persons: [{
      name: 'Name 1',
      address: 'Address 1'
   }, {
      name: 'Name 2',
      address: 'Address 2'
   }]
}),

vdRules: {
   persons: {
      name: { required: true, minlen: 5 },
      address: { required: true }
   }
}
</highlight-code>
					</b-tab>

					<b-tab title="Result">
<highlight-code lang="javascript">$vd.persons.$errors = {{ $vd.persons.$errors }};</highlight-code>
					</b-tab>
				</b-tabs>
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
					name: undefined,
					address: undefined
				});
			},

			removePerson(index) {
				this.persons.splice(index, 1);
			}
		}
	}
</script>
