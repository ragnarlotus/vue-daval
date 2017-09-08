# vuejs-model-validator

This is a data validator inspired by https://github.com/yiminghe/async-validator and adapted to VueJS fixing the lack of other data validators and with the following characteristics:
* Template agnostic
* Simplicity in custom validations
* Maintain validations reactivity when data replaced
* Data tree support (objects and array of objects)
* Very simple logic performing validations by order and skipping the rest when validation fails (if a validation in value fails will not run the rest to validations for the value), reducing time considerably.
* Support for promises
* Real time results
* Multiple async validations will be controlled and only last one will be taken
* Do not revalidate a value already validated
* Dependencies free, being ~25 KB minified

This validator is served as a mixin in order to reduce the processing and time.

# Installation
You can install it via npm
```
npm install --save vuejs-model-validator
```

# Usage
First you need to import the mixin and then add it to you vue component.

Then just create an object in the component named "validations" imitating the data structure, with an object with the validators as value.

The included validators are:

* Check the type of value (`type: 'email'`)

  > type: (String) ['boolean', 'nombre', 'integer', 'float', 'string', 'url', 'email', 'date']

* Check if value is empty (`required: true`)

  > required: (Boolean)

* Check the value against regular expression (`regexp: /^[0-9]$/`)

  > regexp: (RegExp)

* Check if value is greater than the number specified (`min: 5`)

  > min: (Number)

* Check if value is less than the number specified (`max: 99`)

  > max: (Number)

* Check if value lengh is greater than the number specified (`minlen: 6`)

  > minlen: (Number)

* Check if value lengh is less than the number specified (`maxlen: 24`)

  > maxlen: (Number)

* Check if value lengh is exactly the number specified (`required: 9`)

  > length: (Number)

* Check if value equals another value (`equals: 'user.passwordRepeat'`)

  > equals: (String)

* Check if value is one of an array (`isin: ['house', 'car', 'tree', 'clouds']`)

  > isin: (Array)

## Example of usage:
```
<script>
   import vmv from 'vuejs-model-validator';

   export default {
      mixins: [ vmv ],

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
   }
</script>
```

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
this.$vmv.$validate(validationPath [, successCallback [, errorCallback [, revalidate [, propagate]]]]);
```

validationPath: is a string representing the data path we want to validate.

successCallback: is the function that will be run if validation success.

errorCallback: is the function that will be run if validation fails.

revalidate: is a boolean indicating if values should be validated again even if they were already, being false by default.

propagate: is a boolean telling the validation to follow the object childs, being true by default.


## Displaying erors:
Just use the same path of data based on $vmv. For example:
```
$vmv.user.email.$error
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
