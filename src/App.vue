<template>
	<div id="app" class="container">
		<h1>vue-daval</h1>

		<examples-index></examples-index>
	</div>
</template>

<script>
	import ExamplesIndex from './examples/index.vue';

	export default {
		name: 'app',

		components: {
			ExamplesIndex
		}
	}
</script>

<style lang="scss">
	.form-control {
		border-width: 10px;
	}

	.form-control.is-valid {
		border-width: 10px;
	}

	.form-control.is-invalid {
		border-width: 10px;
	}
</style>
