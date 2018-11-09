<template>
	<b-card-example title="Nested and dynamic">
		<div class="row">
			<div class="col-sm-4">
				<h5>Address book</h5>

				<b-card v-for="(person, i) in persons" :key="i" class="mb-4">
					<div slot="header" class="form-group mb-0">
						<input v-model="person.name" placeholder="Name" :class="$vd.persons[i]? getInputClass($vd.persons[i].name) : ''">
						<div v-show="$vd.persons[i].name.$error" class="invalid-feedback">{{ $vd.persons[i].name.$error }}</div>
					</div>

					<div class="form-group">
						<input v-model="person.address" placeholder="Address" :class="$vd.persons[i]? getInputClass($vd.persons[i].address) : ''">
						<div v-show="$vd.persons[i].address.$error" class="invalid-feedback">{{ $vd.persons[i].address.$error }}</div>
					</div>

					<b-button @click="removePerson(i)" variant="danger" size="sm">Remove</b-button>
				</b-card>

				<b-button @click="$vd.persons.$validate()" variant="primary" size="sm">Validate persons</b-button>
				<b-button @click="addPerson()" variant="secondary" size="sm" class="ml-2">Add person</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
persons: {
   name: { required: true, minlen: 5 },
   address: { required: true }
}
				</b-card-code>

				<b-card-code title="Errors">
$vd.persons.$errors = {{ $vd.persons.$errors }};
				</b-card-code>
			</div>
		</div>
	</b-card-example>
</template>

<script>
	import VueDaval from '@/mixins/VueDaval.js';
	import BCardExample from '@/components/bootstrap/BCardExample.vue';
	import BCardCode from '@/components/bootstrap/BCardCode.vue';

	export default {
		name: 'NestedValidations',

		components: {
			BCardExample,
			BCardCode
		},

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
