<template>
	<b-card :header="title" header-bg-variant="info" header-text-variant="white">
		<highlight-code lang="javascript"><slot></slot></highlight-code>
	</b-card>
</template>

<script>
	export default {
		name: 'BCardCode',

		props: {
			title: String
		}
	}
</script>

<style lang="scss">
	.col-sm-8 {
		.card {
			margin-bottom: 1rem;
		}

		.card:last-child {
			margin-bottom: 0;
		}

		.card-header {
			padding: 0.35rem 0.62rem;
		}

		.card-body {
			padding: 0;
		}

		pre {
			margin-bottom: 0;
		}
	}
</style>