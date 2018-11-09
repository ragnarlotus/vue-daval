<template>
	<b-card-example title="Groups">
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

				<b-button variant="primary" @click="$vd.login.$validate()">Validate login</b-button>

				<h5 class="mt-3">Register</h5>

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

				<b-button variant="primary" @click="$vd.register.$validate()">Validate register</b-button>
			</div>

			<div class="col-sm-8">
				<b-card-code title="Rules">
login: {
   email: { required: true, type: 'email' },
   password: { required: true, minlen: 5 }
},

register: {
   email: { required: true, type: 'email' },
   password: { required: true, minlen: 5, regexp: /^[a-z0-9 ]+$/ig }
}
				</b-card-code>

				<b-card-code title="Errors">
$vd.login.$errors = {{ $vd.login.$errors }};

$vd.register.$errors = {{ $vd.register.$errors }};
				</b-card-code>
			</div>
		</div>
	</b-card-example>
</template>

<script>
	import VueDaval from '@/mixins/VueDaval.js';
	import BCardExample from '@/components/bootstrap/BCardExample.vue';
	import BCardCode from '@/components/bootstrap/BCardCode.vue';

	export default {
		name: 'GroupsValidation',

		components: {
			BCardExample,
			BCardCode
		},

		mixins: [ VueDaval ],

		data: () => ({
			login: {
				email: undefined,
				password: undefined
			},

			register: {
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
				email: { required: true, type: 'email' },
				password: { required: true, minlen: 5, regexp: /^[a-z0-9 ]+$/ig }
			}
		},

		mounted() {
			//console.log(this);
		}
	}
</script>
