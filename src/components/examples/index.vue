<template>
	<div>
		<component v-for="example in examples" :key="example" :is="example" class="example" :get-input-class="getInputClass"></component>
	</div>
</template>

<script>
	import BasicValidation from './BasicValidation.vue';
	import GroupsValidation from './GroupsValidation.vue';
	import NestedValidations from './NestedValidations.vue';
	import DynamicValidation from './DynamicValidation.vue';
	import CustomValidation from './CustomValidation.vue';
	import Links from './Links.vue';

	export default {
		name: 'ExamplesIndex',

		components: {
			BasicValidation,
			GroupsValidation,
			NestedValidations,
			DynamicValidation,
			CustomValidation,
			Links
		},

		data: () => ({
			examples: [
				'BasicValidation',
				'GroupsValidation',
				'NestedValidations',
				'DynamicValidation',
				'CustomValidation',
				'Links'
			]
		}),

		methods: {
			getInputClass(field) {
				let css = 'form-control';

				if (field === undefined)
					return css;

				if (field['$error'])
					css += ' is-invalid';

				else if (field['$validated'])
					css += ' is-valid';

				return css;
			}
		}
	}
</script>

<style lang="scss">
</style>
