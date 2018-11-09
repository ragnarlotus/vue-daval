<template>
	<div class="mt-4">
		<h4>Basic</h4>

		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Email</label>
					<input v-model="email" :class="getInputClass($vd.email)">
					<div v-show="$vd.email.$error" class="invalid-feedback">{{ $vd.email.$error }}</div>
				</div>

				<b-button variant="primary" @click="$vd.email.$validate()">Validate email</b-button>
			</div>

			<div class="col-sm-8">
				<b-tabs>
					<b-tab title="Component" active>
						<highlight-code lang="javascript">data: () => ({
   email: undefined
}),

vdRules: {
   email: { required: true, type: 'email' }
}
</highlight-code>
					</b-tab>

					<b-tab title="Result">
<highlight-code lang="javascript">$vd.email.$errors = {{ $vd.email.$errors }};</highlight-code>
					</b-tab>
				</b-tabs>
			</div>
		</div>
	</div>
</template>

<script>
	import VueDaval from '../mixins/VueDaval.js';

	export default {
		name: 'BasicValidation',

		mixins: [ VueDaval ],

		data: () => ({
			email: undefined
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			email: { required: true, type: 'email' }
		}
	}
</script>
