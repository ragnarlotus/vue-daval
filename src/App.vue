<template>
	<div id="app" class="container">
		<h1>vuejs-model-validator</h1>

		<p class="lead">This is a data validator inspired by <a href="https://github.com/yiminghe/async-validator" target="_blank">async-validator</a> and adapted to VueJS fixing the lack of other data validators and with many features</p>

		<section class="login mb-5">
			<h4>Login</h4>

			<div v-show="result.login !== undefined" class="alert" :class="alertClass('login')" role="alert">
				{{ message.login }}
			</div>

			<form @submit.prevent="doLogin" :class="formClass('login')" novalidate>
				<div class="form-row">
					<div class="col-md-6 mb-3">
						<label>Email</label>
						<input type="text" v-model="login.email" class="form-control" :class="inputClass('login', 'email')">
						<div v-show="$vmv.login.email.$error" class="invalid-feedback">{{ $vmv.login.email.$error }}</div>
					</div>

					<div class="col-md-6 mb-3">
						<label>Password</label>
						<input type="password" v-model="login.password" class="form-control" :class="inputClass('login', 'password')">
						<div v-show="$vmv.login.password.$error" class="invalid-feedback">{{ $vmv.login.password.$error }}</div>
					</div>
				</div>

				<button type="submit" class="btn btn-primary">Login</button>
			</form>
		</section>

		<section class="register mb-5">
			<h4>Register</h4>

			<div v-show="result.register !== undefined" class="alert" :class="alertClass('register')" role="alert">
				{{ message.register }}
			</div>

			<form @submit.prevent="doRegister" :class="formClass('register')" novalidate>
				<div class="form-row">
					<div class="col-md-6 mb-3">
						<label>Alias</label>
						<input type="text" v-model="register.alias" class="form-control">
						<div v-show="$vmv.register.alias.$error" class="invalid-feedback">{{ $vmv.register.alias.$error }}</div>
					</div>

					<div class="col-md-6 mb-3">
						<label>Email</label>
						<input type="text" v-model="register.email" class="form-control">
						<div v-show="$vmv.register.email.$error" class="invalid-feedback">{{ $vmv.register.email.$error }}</div>
					</div>
				</div>

				<div class="form-row">
					<div class="col-md-6 mb-3">
						<label>Password</label>
						<input type="password" v-model="register.password" class="form-control">
						<div v-show="$vmv.register.password.$error" class="invalid-feedback">{{ $vmv.register.password.$error }}</div>
					</div>

					<div class="col-md-6 mb-3">
						<label>Repeat</label>
						<input type="password" v-model="register.passwordRepeat" class="form-control">
						<div v-show="$vmv.register.passwordRepeat.$error" class="invalid-feedback">{{ $vmv.register.passwordRepeat.$error }}</div>
					</div>
				</div>

				<button type="submit" class="btn btn-primary">Register</button>
			</form>
		</section>
	</div>
</template>

<script>
	import vmv from './components';

	export default {
		name: 'app',
		mixins: [ vmv ],

		data: () => ({
			result: {
				login: undefined,
				register: undefined
			},

			message: {
				login: undefined,
				register: undefined
			},

			login: {
				email: null,
				password: null
			},

			register: {
				alias: null,
				email: null,
				password: null,
				passwordRepeat: null
			}
		}),

		validations: {
			login: {
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5 },
			},

			register: {
				alias: { required: true, minlen: 5, checkAlias: (vm, alias, callback) => {
					callback(alias === 'admin'? 'Alias already in use' : undefined);
				}},
				email: { required: true, type: 'email', checkEmail: (vm, email, callback) => {
					callback(email === 'admin@vmv.com'? 'Email already registered' : undefined);
				}},
				password: { required: true, minlen: 5 },
				passwordRepeat: { required: true, equals: 'register.password' }
			}
		},

		methods: {
			formClass(form) {
				return this.result[form] !== undefined? 'was-validated' : '';
			},

			alertClass(form) {
				return this.result[form]? 'alert-success' : 'alert-danger';
			},

			inputClass(form, input) {
				if (!this.$vmv[form])
					return '';

				if (this.$vmv[form][input].$validated === false)
					return '';

				if (this.$vmv[form][input].$error !== undefined)
					return 'is-invalid';

				return 'is-valid';
			},

			doLogin() {
				this.$vmv.$validate('login', () => {
					this.result.login = true;
					this.message.login = 'Logged in!';

				}, () => {
					this.result.login = false;
					this.message.login = 'Error logging in';
				});
			},

			doRegister() {
				this.$vmv.$validate('register', () => {
					this.result.register = true;
					this.message.register = 'Registered successfully!';

				}, () => {
					this.result.register = false;
					this.message.register = 'Error registering';
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invalid-feedback {
		display: block;
	}
</style>
