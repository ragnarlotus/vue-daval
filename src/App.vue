<template>
	<div id="app" class="container">
		<h1>vue-daval</h1>

		<div class="row">
			<div class="col-sm-6">
				<section class="login mb-5">
					<h4>Login</h4>

					<div v-show="result.login !== undefined" class="alert" :class="alertClass('login')" role="alert">
						{{ message.login }}
					</div>

					<form @submit.prevent="doLogin" novalidate>
						<div class="form-group">
							<label>Email</label>
							<input type="text" v-model="login.email">
						</div>

						<div class="form-group">
							<label>Password</label>
							<input type="password" v-model="login.password">
						</div>

						<button type="submit" class="btn btn-primary">Login</button>
					</form>
				</section>

				<pre>{{ prueba }}</pre>

				<pre>{{ $vd.prueba.$errors }}</pre>

				<section class="register mb-5">
					<div v-show="$vd.prueba.$error" class="invalid-feedback">{{ $vd.prueba.$error }}</div>
				</section>
			</div>

			<div class="col-sm-6">
				<h4>Register</h4>

				<div v-show="result.register !== undefined" class="alert" :class="alertClass('register')" role="alert">
					{{ message.register }}
				</div>

				<form @submit.prevent="doRegister" :class="formClass('register')" novalidate>
					<div class="form-group">
						<label>Alias</label>
						<input type="text" v-model="register.alias" :class="inputClass('register', 'alias')">
						<div v-show="$vd.register.alias.$error" class="invalid-feedback">{{ $vd.register.alias.$error }}</div>
					</div>

					<div class="form-group">
						<label>Email</label>
						<input type="text" v-model="register.email" :class="inputClass('register', 'email')">
						<div v-show="$vd.register.email.$error" class="invalid-feedback">{{ $vd.register.email.$error }}</div>
					</div>

					<div class="form-group">
						<label>Password</label>
						<input type="password" v-model="register.password" :class="inputClass('register', 'password')">
						<div v-show="$vd.register.password.$error" class="invalid-feedback">{{ $vd.register.password.$error }}</div>
					</div>

					<div class="form-group">
						<label>Repeat</label>
						<input type="password" v-model="register.passwordRepeat" :class="inputClass('register', 'passwordRepeat')">
						<div v-show="$vd.register.passwordRepeat.$error" class="invalid-feedback">{{ $vd.register.passwordRepeat.$error }}</div>
					</div>

					<button type="submit" class="btn btn-primary">Register</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import vd from './mixins/VueDaval.js';

	export default {
		name: 'app',
		mixins: [ vd ],

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
				email: undefined,
				password: undefined
			},

			register: {
				alias: undefined,
				email: undefined,
				password: undefined,
				passwordRepeat: undefined
			}
		}),

		computed: {
			prueba() {
				return this.login.email +''+ this.login.password;
			}
		},

		vdRules: {
			prueba: { required: true, minlen: 5 },
/*
			login: {
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5 }
			},
*/
			register: {
				alias: { required: true, minlen: 5, checkAlias: (alias) => {
					return alias === 'admin'? 'Alias already in use' : true;
				}},
				email: { required: true, type: 'email', checkEmail: (email) => {
					return email === 'admin@vd.com'? 'Email already registered' : true;
				}},
				password: { required: true, minlen: 5, links: 'register.passwordRepeat' },
				passwordRepeat: { required: true, equals: 'register.password' }
			}
		},

		mounted() {
			//console.clear();
			//this.$vd.prueba.$validate()

			//console.log(this);
			//console.log(this._data.login.__ob__.dep.constructor.target);
			//console.log(this._computedWatchers.prueba);
			//console.log(this.$vd);
			//console.log(this.$vd.$errors);
			//console.log(this.$vd.$getPath('').$validations);
		},

		methods: {
			formClass(form) {
				return this.result[form] !== undefined? 'was-validated' : '';
			},

			alertClass(form) {
				return this.result[form]? 'alert-success' : 'alert-danger';
			},

			inputClass(form, input) {
				let inputClass = 'form-control';

				if (!this.$vd[form])
					return inputClass;

				if (this.$vd[form][input].$validated === false)
					return inputClass;

				if (this.$vd[form][input].$error !== undefined)
					return inputClass +' is-invalid';

				return inputClass +' is-valid';
			},

			doLogin() {
				this.$vd.login.$validate().then(() => {
					this.result.login = true;
					this.message.login = 'Logged in!';

				}).catch(() => {
					this.result.login = false;
					this.message.login = 'Error logging in';
				});
			},

			doRegister() {
				this.$vd.register.$validate().then(() => {
					this.result.register = true;
					this.message.register = 'Registered successfully!';

				}).catch(() => {
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
