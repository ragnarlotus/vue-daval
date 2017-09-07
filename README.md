# vuejs-model-validator

This is a data validator inspired by https://github.com/yiminghe/async-validator and adapted to Vue.js 2.0 fixing the lack of other data validators like:
* Template agnostic
* Simplicity in custom validations
* Maintain validations reactivity when element replaced
* Data tree support (objects and array of objects)
* Very simple logic performing validations by order and skipping the rest when validation fails
* Support for promises
* Real time results
* Multiple async validations will be controlled and only last one will be taken.

This validator is served as a mixin in order to reduce the processing and time.

# Installation
You can install it via npm
```
npm install --save vuejs-model-validator
```

# Usage
Just create an object in the component named "validations" and create a tree of validations imitating the data structure.

The included validators are:
_Check the type of value_
* type: (String) ['boolean', 'nombre', 'integer', 'float', 'string', 'url', 'email', 'date']
`type: 'email'`

_Check if value is empty_
* required: (Boolean) [true, false]
`required: true`

_Check the value against regular expression_
* regexp: (RegExp)
`regexp: /^[0-9]$/`

_Check if value is greater than the number specified_
* min (Number)
`min: 5`

_Check if value is less than the number specified_
* max (Number)
`max: 99`

_Check if value lengh is greater than the number specified_
* minlen (Number)
`minlen: 6`

_Check if value lengh is less than the number specified_
* maxlen (Number)
`maxlen: 24`

_Check if value lengh is exactly the number specified_
* length (Number)
`required: 9`

_Check if value equals another value_
* equals (String)
`equals: 'user.passwordRepeat'`

_Check if value is one of an array_
* isin (Array)
`isin: ['house', 'car', 'tree', 'clouds']`

# Custom validation
To create a custom validator just give any non existing name and define it as a function that receives three parameters, current vue component, the value to check, and a callback with a string message of error or empty if success, to be called when validation ends.

```
  data() {
		return {
			fullName: null
		};
	},

	validations: {
		fullName: {
			required: true,
			nameValid: (vm, value, callback) => {
				if (value.indexOf(' ') === -1) {
					callback('Use first and last name');
				}
			});
		}
	}
```

## Check validation:
```
this.$vmv.$validate('VALIDATION_PATH', SUCCESS_CALLBACK, ERROR_CALLBACK);
```

## Displaying erors:
Just use the same path of data based on $vmv. For example:
```
$vmv.user.email.$error
```

## Example of usage:
```
  data() {
		return {
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
		};
	},

	validations: {
		login: {
			email: { required: true, type: 'email' },
			password: { required: true, minlen: config.user.minPasswordLength },
		},

		register: {
			alias: { required: true, minlen: 5, checkAlias: (vm, alias) => {
				return vm.$http.post('/users/check/alias', { alias: alias });
			}},
			email: { required: true, type: 'email', checkEmail: (vm, email) => {
				return vm.$http.post('/users/check/email', { email: email });
			}},
			password: { required: true, minlen: config.user.minPasswordLength },
			passwordRepeat: { required: true, equals: 'register.password' }
		}
	}
```

# Configuration
Messages can set the validation text by adding them to the component:
```
validationMessages: {
		type: 'This is not a valid {rule}',
		required: 'This field is required',
		regexp: 'This is no a valid value',
		min: 'Minimun value is {rule}',
		max: 'Maximun value is {rule}',
		minlen: 'Minimun length is {rule}',
		maxlen: 'Maximun length is {rule}',
		length: 'Length must be {rule}',
		equals: 'Must equal the field {rule}',
		enum: 'Must be one of {rule}'
}
```
It will mix and replace the messages specified.
