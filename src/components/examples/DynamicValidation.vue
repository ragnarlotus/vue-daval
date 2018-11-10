<template>
	<b-card-example title="Dynamic">
		<div class="row">
			<div class="col-sm-4">
				<b-card v-for="(url, i) in urls" :key="i" class="mb-4">
					<div class="form-group">
						<input v-model="urls[i]" placeholder="URL" :class="$vd.urls[i]? getInputClass($vd.urls[i]) : ''">
						<div v-show="$vd.urls[i].$error" class="invalid-feedback">{{ $vd.urls[i].$error }}</div>
					</div>

					<b-button @click="removeUrl(i)" variant="danger" size="sm">Remove</b-button>
				</b-card>

				<b-button @click="$vd.urls.$validate()" variant="primary" size="sm">Validate urls</b-button>
				<b-button @click="addUrl()" variant="secondary" size="sm" class="ml-2">Add url</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
urls: { required: true, type: 'url' }
				</b-card-code>

				<b-card-code title="Errors">
$vd.urls.$errors = {{ $vd.urls.$errors }};
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
		name: 'DynamicValidations',

		components: {
			BCardExample,
			BCardCode
		},

		mixins: [ VueDaval ],

		data: () => ({
			urls: ['http://www.url1.com', '']
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			urls: { required: true, type: 'url' }
		},

		methods: {
			addUrl() {
				this.urls.push('');
			},

			removeUrl(index) {
				this.urls.splice(index, 1);
			}
		}
	}
</script>
