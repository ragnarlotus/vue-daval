<template>
	<b-card-example title="Links">
		<div class="row">
			<div class="col-sm-4">
				<div class="form-group">
					<label>Field 1</label>
					<input v-model="field1" :class="getInputClass($vd.field1)">
					<div v-show="$vd.field1.$error" class="invalid-feedback">{{ $vd.field1.$error }}</div>
				</div>

				<div class="form-group">
					<label>Password repeat</label>
					<input type="field1" v-model="field2" :class="getInputClass($vd.field2)">
					<div v-show="$vd.field2.$error" class="invalid-feedback">{{ $vd.field2.$error }}</div>
				</div>

				<b-button variant="primary" @click="$vd.$validate()">Validate field1s</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
field1: { required: true, minlen: 5, linksThen: 'field2' },
field2: { required: true, type: 'email' }
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
			field1: undefined,
			field2: undefined
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			field1: { required: true, minlen: 5, linksThen: 'field2' },
			field2: { required: true, type: 'email' }
		}
	}
</script>
