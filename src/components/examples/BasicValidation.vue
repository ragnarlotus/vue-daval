<template>
	<b-card-example title="Basic">
		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Email</label>
					<input v-model="email">
					<div v-show="$vd.email.$error" class="invalid-feedback">{{ $vd.email.$error }}</div>
				</div>

				<b-button variant="primary" @click="$vd.email.$validate()">Validate email</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
email: { required: true, type: 'email' }
				</b-card-code>

				<b-card-code title="Errors">
$vd.email.$errors = {{ $vd.email.$errors }};
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
		name: 'BasicValidation',

		components: {
			BCardExample,
			BCardCode
		},

		mixins: [ VueDaval ],

		data: () => ({
			email: 'asd@asd.com',
		}),

		vdRules: {
			email: { required: true, type: 'email' }
		}
	}
</script>
