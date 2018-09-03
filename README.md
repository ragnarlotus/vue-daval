## Overview

This is a Vue data validator, developed with the lack of other valiadtors in mind.

## Demo

You can view a [demo here](https://deulos.github.io/vuejs-model-validator/).

## Features
| Feature | Description |
|---------|-------------|
| Template agnostic | No matter what template library you use, this validator will simply work |
| Simplicity | Focused in developer easiness to save time and headaches |
| Reactivity persistance | When data is loaded from server you can set it without worring, it will restore the watchers |
| Data tree | If you have nested data objects to validate, this mixin will deal with it without trouble |
| Performance | If a validation in value fails will not run the rest of validations for the value, reducing time and processing considerably |
| Promises | Will detect if the returned validation is a promise and handle properly without need of external packages |
| Real time | I have found that in some validators the results are showed in the next tick. This mixin forces the render to be updated once the validations are finished so no delays on result are produced |
| Async validations | If a typing is being validated against a resource it will control the times in order to ensure that the last one is the validation that prevails against the previuos |
| Revalidations | It controls whether a validation is performed or not, so if the value does not change it will not be validated again, saving time and processing |
| Dependencies free | Its just ~25KB minified and served as mixin just with vue as dependency in order to reduce the processing, time and load. It is set out to accomplish most of the use cases so it is adapted to common use needs |
| Community open | Feel free to contribute or bring suggestions, any improvement will be at least taken in mind, discussed and accepted if reasonable, just keep the the previous rules in mind |

## Quickstart

``` bash
npm install --save vuejs-model-validator
```

``` html
<form @submit.prevent="validateLogin" class="login">
   <input name="email" v-model="login.email">
   <input type="password" name="password" v-model="login.password">

   <button type="submit">Login</button>
</form>

<form @submit.prevent="validateRegister" class="register">
   <input name="alias" v-model="register.alias">
   <input type="email" name="email" v-model="register.email">
   <input type="password" name="password" v-model="register.password">
   <input type="password" name="passwordRepeat" v-model="register.passwordRepeat">

   <button type="submit">Register</button>
</form>
```

``` javascript
import vmv from 'vuejs-model-validator';

export default {
   mixins: [ vmv ],

   data: () => ({
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
         alias: { required: true, minlen: 5, checkAlias: (vm, alias) => {
            return vm.$http.post('/users/check/alias', { alias: alias });
         }},
         email: { required: true, type: 'email', checkEmail: (vm, email) => {
            return vm.$http.post('/users/check/email', { email: email });
         }},
         password: { required: true, minlen: 5 },
         passwordRepeat: { required: true, equals: 'register.password' }
      }
   },

   methods: {
      validateLogin() {
         this.$vmv.$validate('login', () => {
            this.$http.post('/users/login', this.login);

         }, () => {
            alert('Error in login form');
         });
      },

      validateRegister() {
         this.$vmv.$validate('register', () => {
            this.$http.post('/users/register', this.register);

         }, () => {
            alert('Error in register form');
         });
      }
   }
}
```

## Performance

Weight is just 25KB so is pretty light and is tweaked to be as fast as possible.

## Included validations

* Type: check the type of value, supporting boolean, number, integer, float, string, url, email and date.
* Required: check if value is empty.
* Regular expression: check the value against regular expression.
* Minimum: check if value is greater than the number specified.
* Maximum: check if value is less than the number specified.
* Minimum length: check if value lengh is greater than the number specified.
* Maximum length: check if value lengh is less than the number specified.
* Length: check if value lengh is exactly the number specified.
* Equals: check if value equals another value.
* Is in: check if value is one of an array.

## Troubleshooting

If you find yourself running into issues during installation or running the validator, please check our [Wiki](https://github.com/deulos/vuejs-model-validator/wiki). If still needs help open an [issue](https://github.com/deulos/vuejs-model-validator/issues/new). We would be happy to discuss how they can be solved.

## Documentation

You can view the full documentation at the project's [Wiki](https://github.com/deulos/vuejs-model-validator/wiki) with examples and detailed information.

## Inspiration

This slider was inspired by [async-validator](https://github.com/yiminghe/async-validator).

## Contributing

Contributions, questions and comments are all welcome and encouraged.
