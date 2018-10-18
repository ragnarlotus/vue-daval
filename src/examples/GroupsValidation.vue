<template>
	<div>
		<h4>Groups</h4>

		<div class="row">
			<div class="col-sm-4">
				<h5>Login</h5>

				<div class="form-group">
					<label>Email</label>
					<input v-model="login.email" :class="getInputClass($vd.login.email)">
					<div v-show="$vd.login.email.$error" class="invalid-feedback">{{ $vd.login.email.$error }}</div>
				</div>

				<div class="form-group">
					<label>Password</label>
					<input type="password" v-model="login.password" :class="getInputClass($vd.login.password)">
					<div v-show="$vd.login.password.$error" class="invalid-feedback">{{ $vd.login.password.$error }}</div>
				</div>

				<h5>Register</h5>

				<div class="form-group">
					<label>Name</label>
					<input v-model="register.name" :class="getInputClass($vd.register.name)">
					<div v-show="$vd.register.name.$error" class="invalid-feedback">{{ $vd.register.name.$error }}</div>
				</div>

				<div class="form-group">
					<label>Email</label>
					<input v-model="register.email" :class="getInputClass($vd.register.email)">
					<div v-show="$vd.register.email.$error" class="invalid-feedback">{{ $vd.register.email.$error }}</div>
				</div>

				<div class="form-group">
					<label>Password</label>
					<input type="password" v-model="register.password" :class="getInputClass($vd.register.password)">
					<div v-show="$vd.register.password.$error" class="invalid-feedback">{{ $vd.register.password.$error }}</div>
				</div>
			</div>

			<div class="col-sm-8">
			</div>
		</div>
	</div>
</template>

<script>
	import VueDaval from '../mixins/VueDaval.js';

	export default {
		name: 'GroupsValidation',

		mixins: [ VueDaval ],

		data: () => ({
			login: {
				email: undefined,
				password: undefined
			},

			register: {
				name: undefined,
				email: undefined,
				password: undefined
			}
		}),

		props: [
			'getInputClass'
		],

		vdRules: {
			login: {
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5 }
			},

			register: {
				name: { required: true, minlen: 3, regexp: /^[a-z0-9]$/ig },
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5 }
			}
		},

		mounted() {
			//console.log(this);
		}
	}
</script>
