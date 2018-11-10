<template>
	<b-card-example title="Nested">
		<div class="row">
			<div class="col-sm-4">
				<b-card v-for="(person, i) in persons" :key="i" class="mb-4">
					<div slot="header" class="form-group mb-0">
						<input v-model="person.name" placeholder="Name" :class="$vd.persons[i]? getInputClass($vd.persons[i].name) : ''">
						<div v-show="$vd.persons[i].name.$error" class="invalid-feedback">{{ $vd.persons[i].name.$error }}</div>
					</div>

					<div class="form-group mb-0">
						<input v-model="person.address" placeholder="Address" :class="$vd.persons[i]? getInputClass($vd.persons[i].address) : ''">
						<div v-show="$vd.persons[i].address.$error" class="invalid-feedback">{{ $vd.persons[i].address.$error }}</div>
					</div>
				</b-card>

				<b-button @click="$vd.persons.$validate()" variant="primary" size="sm">Validate persons</b-button>
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
				name: undefined,
				address: undefined
			}, {
				name: undefined,
				address: undefined
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
		}
	}
</script>
