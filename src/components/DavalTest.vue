<template>
	<div>
		<input type="text" name="email" v-model="email">

		<pre>{{ $vd.email.$errors }}</pre>

		<hr>

		<table>
			<tr>
				<td>Name</td>
				<td>Phone</td>
			</tr>

			<tr v-for="(contact, index) in contacts" :key="index">
				<td>{{ contact.name }}</td>
				<td>{{ contact.phone }}</td>
			</tr>
		</table>


		<button type="button" @click="validate">validate</button>
		<button type="button" @click="showVD()">log</button>

		<hr>

		<pre>{{ $data }}</pre>
	</div>
</template>

<script>
	import VueDaval from '@/mixins/VueDaval';
	import { rs } from '@/classes/RuleSet';

	export default {
		name: 'DavalTest',

		mixins: [ VueDaval ],

		data: () => ({
			email: 'asd@asd.com',
			contacts: [{
				name: 'zzz',
				phone: '123456789',
			}],
		}),

		vdRules: {
			email: rs({
				required: true,
				type: 'email',
			}),
			contacts: [{
				minlen: 2,
				items: rs({
					name: { required: true },
					phone: { length: 9 },
				}),
			}],
		},

		methods: {
			validate() {
				console.log('validate');

				this.$vd.email.$validate().then(() => {
					console.log('then');
				}).catch(() => {
					console.log('catch');
				});
			},

			showVD() {
				console.log(this.$vd);
			},
		},
	}
</script>
