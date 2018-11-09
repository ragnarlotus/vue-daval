<template>
	<b-card header-bg-variant="success" header-text-variant="white" class="mb-4">
		<h6 slot="header" class="mb-0">{{ title }}</h6>
		<slot></slot>
	</b-card>
</template>

<script>
	export default {
		name: 'BCardExample',

		props: {
			title: String
		}
	}
</script>

<style lang="scss">

</style>
