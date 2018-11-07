<template>
	<div>
		<h4>Groups</h4>

		<div class="row">
			<div class="col-sm-4">
				<h5>Address book</h5>

				<div v-for="(name, i) in names" :key="i">
					<div class="form-group">
						<label>Name</label>
						<input v-model="names[i]" :class="getInputClass($vd.names[i])">
						<button type="button" @click="removeName(i)">Remove</button>
						<div v-show="$vd.names[i].$error" class="invalid-feedback">{{ $vd.names[i].$error }}</div>
					</div>
				</div>

				<button type="button" @click="addName()">Add</button>
			</div>

			<div class="col-sm-8">
			</div>
		</div>
	</div>
</template>

<script>
	import VueDaval from '../mixins/VueDaval.js';

	export default {
		name: 'NestedValidations',

		mixins: [ VueDaval ],

		data: () => ({
			names: ['Name 1', 'Name 2'],
			prueba: {
				la: 'siono'
			}
		}),

		computed: {
			kk: function() {
				return 'kk';
			}
		},

		props: [
			'getInputClass'
		],

		vdRules: {
			names: { required: true, minlen: 5 }
		},

		mounted() {
			console.log(this);
			//console.log(Object.keys(this._data));
			//console.log(this.$vd.$paths);
		},

		methods: {
			addName() {
				this.names.push('');
				//console.log(this.$vd.$paths);
			},

			removeName(index) {
				//delete this.names[index];
				this.names.splice(index, 1);
				//console.log(this.$vd.$paths);
			}
		}
	}
</script>
