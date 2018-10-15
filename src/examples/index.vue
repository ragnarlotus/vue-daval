<template>
	<div>
		<h1>Examples</h1>

		<basic-validation class="example" :get-input-class="getInputClass"></basic-validation>
		<groups-validation class="example" :get-input-class="getInputClass"></groups-validation>

	</div>
</template>

<script>
	import BasicValidation from './BasicValidation.vue';
	import GroupsValidation from './GroupsValidation.vue';
	import NestedValidations from './NestedValidations.vue';
	import DynamicValidation from './DynamicValidation.vue';
	import CustomValidation from './CustomValidation.vue';
	import Links from './Links.vue';
	import OwnValidators from './OwnValidators.vue';
	import CustomMessages from './CustomMessages.vue';
	import SpecificMessage from './SpecificMessage.vue';
	import Result from './Result.vue';
	import ValidationResult from './ValidationResult.vue';
	import ResetResult from './ResetResult.vue';
	import Errors from './Errors.vue';
	import Configurations from './Configurations.vue';

	export default {
		name: 'ExamplesIndex',

		components: {
			BasicValidation,
			GroupsValidation,
			NestedValidations,
			DynamicValidation,
			CustomValidation,
			Links,
			OwnValidators,
			CustomMessages,
			SpecificMessage,
			Result,
			ValidationResult,
			ResetResult,
			Errors,
			Configurations
		},

		methods: {
			getInputClass(field) {
				let css = 'form-control';

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
	.example h4 {
		padding: 4px 0 6px 12px;
		color: #eee;
		background-color: #333;
	}
</style>