<template>
	<b-card-example title="Custom">
		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Full name</label>
					<input v-model="fullName" :class="getInputClass($vd.fullName)">
					<div v-show="$vd.fullName.$error" class="invalid-feedback">{{ $vd.fullName.$error }}</div>
				</div>

				<b-button variant="primary" @click="$vd.fullName.$validate()">Validate full name</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
fullName: {
   required: true,
   checkFullName(fullName) {
      let error;

      if (!fullName || fullName.indexOf(' ') === -1)
         error = 'Invalid full name';

      return error || true;
   }
}
				</b-card-code>

				<b-card-code title="Errors">
$vd.fullName.$errors = {{ $vd.fullName.$errors }};
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
		name: 'CustomValidation',

		components: {
			BCardExample,
			BCardCode
		},

		mixins: [ VueDaval ],

		data: () => ({
			fullName: undefined
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			fullName: {
				required: true,
				checkFullName(fullName) {
					let error;

					if (!fullName || fullName.indexOf(' ') === -1)
						error = 'Invalid full name';

					return error || true;
				}
			}
		}
	}
</script>
