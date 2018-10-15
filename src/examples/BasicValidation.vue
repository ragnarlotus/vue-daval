<template>
	<div>
		<h4>Basic</h4>

		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Email</label>
					<input v-model="email" :class="getInputClass($vd.email)">
					<div v-show="$vd.email.$error" class="invalid-feedback">{{ $vd.email.$error }}</div>
				</div>
			</div>

			<div class="col-sm-8">
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
