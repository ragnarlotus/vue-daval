<template>
	<div id="app" class="container">
		<h1>vue-daval</h1>

		<div class="row">
			<div class="col-sm-4">
				<section class="login mb-5">
					<h4>Login</h4>

					<div v-show="result.login !== undefined" class="alert" :class="alertClass('login')" role="alert">
						{{ message.login }}
					</div>

					<form @submit.prevent="doLogin" :class="formClass('login')" novalidate>
						<div class="form-group">
							<label>Email</label>
							<input type="text" v-model="login.email" class="form-control" :class="inputClass('login', 'email')">
							<!--<div v-show="$vd.login.email.$error" class="invalid-feedback">{{ $vd.login.email.$error }}</div>-->
						</div>

						<div class="form-group">
							<label>Password</label>
							<input type="password" v-model="login.password" class="form-control" :class="inputClass('login', 'password')">
							<!--<div v-show="$vd.login.password.$error" class="invalid-feedback">{{ $vd.login.password.$error }}</div>-->
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
						<div class="form-group">
							<label>Alias</label>
							<input type="text" v-model="register.alias" class="form-control">
							<!--<div v-show="$vd.register.alias.$error" class="invalid-feedback">{{ $vd.register.alias.$error }}</div>-->
						</div>

						<div class="form-group">
							<label>Email</label>
							<input type="text" v-model="register.email" class="form-control">
							<!--<div v-show="$vd.register.email.$error" class="invalid-feedback">{{ $vd.register.email.$error }}</div>-->
						</div>

						<div class="form-group">
							<label>Password</label>
							<input type="password" v-model="register.password" class="form-control">
							<!--<div v-show="$vd.register.password.$error" class="invalid-feedback">{{ $vd.register.password.$error }}</div>-->
						</div>

						<div class="form-group">
							<label>Repeat</label>
							<input type="password" v-model="register.passwordRepeat" class="form-control">
							<!--<div v-show="$vd.register.passwordRepeat.$error" class="invalid-feedback">{{ $vd.register.passwordRepeat.$error }}</div>-->
						</div>

						<button type="submit" class="btn btn-primary">Register</button>
					</form>
				</section>
			</div>

			<div class="col-sm-8">
				<pre><code class="language-js">data: () => ({
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
         callback(email === 'admin@vd.com'? 'Email already registered' : undefined);
      }},
      password: { required: true, minlen: 5 },
      passwordRepeat: { required: true, equals: 'register.password' }
   }
}
</code></pre>
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

		vdRules: {
			login: {
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5 },
			},

			register: {
				alias: { required: true, minlen: 5, checkAlias: (vm, alias, callback) => {
					callback(alias === 'admin'? 'Alias already in use' : undefined);
				}},
				email: { required: true, type: 'email', checkEmail: (vm, email, callback) => {
					callback(email === 'admin@vd.com'? 'Email already registered' : undefined);
				}},
				password: { required: true, minlen: 5 },
				passwordRepeat: { required: true, equals: 'register.password' }
			}
		},

		mounted() {
			console.log(this.$vd);
			console.log(this.$vd.login.email.$path);
		},

		methods: {
			formClass(form) {
				return this.result[form] !== undefined? 'was-validated' : '';
			},

			alertClass(form) {
				return this.result[form]? 'alert-success' : 'alert-danger';
			},

			inputClass(form, input) {
				return '';
/*
				if (!this.$vd)
					return '';

				if (!this.$vd[form])
					return '';

				if (this.$vd[form][input].$validated === false)
					return '';

				if (this.$vd[form][input].$error !== undefined)
					return 'is-invalid';

				return 'is-valid';*/
			},

			doLogin() {
				this.$vd.$validate('login', () => {
					this.result.login = true;
					this.message.login = 'Logged in!';

				}, () => {
					this.result.login = false;
					this.message.login = 'Error logging in';
				});
			},

			doRegister() {
				this.$vd.$validate('register', () => {
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
