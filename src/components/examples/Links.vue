<template>
	<b-card-example title="Links">
		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Password</label>
					<input type="password" v-model="password" :class="getInputClass($vd.password)">
					<div v-show="$vd.password.$error" class="invalid-feedback">{{ $vd.password.$error }}</div>
				</div>

				<div class="form-group">
					<label>Password repeat</label>
					<input type="password" v-model="passwordRepeat" :class="getInputClass($vd.passwordRepeat)">
					<div v-show="$vd.passwordRepeat.$error" class="invalid-feedback">{{ $vd.passwordRepeat.$error }}</div>
				</div>

				<b-button variant="primary" @click="$vd.$validate()">Validate passwords</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
password: { required: true, minlen: 5, linksThen: 'passwordRepeat' },
passwordRepeat: { required: true, equals: 'password' }
				</b-card-code>

				<b-card-code title="Errors">
$vd.$errors = {{ $vd.$errors }};
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
		name: 'Links',

		components: {
			BCardExample,
			BCardCode
		},

		mixins: [ VueDaval ],

		data: () => ({
			password: undefined,
			passwordRepeat: undefined
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			password: { required: true, minlen: 5, linksThen: 'passwordRepeat' },
			passwordRepeat: { required: true, equals: 'password' }
		}
	}
</script>
