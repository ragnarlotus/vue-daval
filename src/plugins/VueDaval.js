const VueDaval = {
	install(Vue, options = {}) {
		let modal

		modal = Vue.prototype.$modal = new Vue(VueDaval)

		if (options.defaultOptions) {
			Object.assign(modal.defaultOptions, options.defaultOptions)
		}
	},

	data: () => ({
		defaultOptions: {
			closeOnEsc: true,
			closeOnClickMask: true,
		},
		component: undefined,
		props: {},
		options: {},
		resolve: undefined,
		reject: undefined,
	}),

	methods: {
		open(component, props = {}, options = {}) {
			options = Object.assign({}, this.defaultOptions, options)

			Object.assign(this, {
				options,
				props,
				component,
			})

			return new Promise((resolve, reject) => {
				this.resolve = resolve
				this.reject = reject
			})
		},

		close(resolve = true, response = {}) {
			this.component = undefined

			this.$nextTick(() => {
				resolve ? this.resolve(response) : this.reject(response)
			})
		},
	},
}

export default VueDaval
