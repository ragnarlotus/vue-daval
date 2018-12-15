## Overview

This is a Vue data validator, trying to cover all needs and built on top of ES6 to achieve the best architecture.

[![npm](https://img.shields.io/npm/v/vue-daval.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![npm](https://img.shields.io/npm/dt/vue-daval.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/vue-daval.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/vue-daval.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![GitHub issues](https://img.shields.io/github/issues-raw/deulos/vue-daval.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![Codacy Badge](https://img.shields.io/codacy/coverage/16ba5056c78347f19ae7fafaeb6c30eb.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)
[![Codacy Badge](https://img.shields.io/codacy/grade/16ba5056c78347f19ae7fafaeb6c30eb.svg?style=flat-square)](https://www.npmjs.com/package/vue-daval)

## Demo

You can view a [demo and examples here](https://deulos.github.io/vue-daval/).

## Features

| Feature | Description |
|---------|-------------|
| Template agnostic | No matter what template library you use, this validator will simply work |
| Simplicity | Focused in developer easiness to save time and code |
| Dynamic | Validations can be run on defined circumstances |
| Reactivity persistance | When data is replaced there is no worring, it will restore the watchers |
| Data tree | If you have nested data objects to validate, this mixin will deal with it without trouble |
| Maximum customization | Trying always to be as open and configurable as possible, validations, messages and behaviour |
| Performance | It is developed with performance in mind, reducing time and processing considerably |
| Promises | Will detect promises and handle properly without need of external packages |
| Real time | Some validators show the results in next tick, so they are not displayed. This component updates the template once the validations are finished |
| Async validations | If multiple validations are done it will control the times |
| Revalidations | It controls whether a validation is performed or not and needs to revalide |
| Dependencies free | Its just ~46 KB minified and served as mixin just with vue as dependency |
| Community open | Feel free to contribute or bring suggestions, any improvement will be at least taken in mind, discussed and accepted if reasonable, just keep the the previous rules in mind |

## Quickstart

``` bash
npm install --save vue-daval
```

``` html
<form @submit.prevent="doLogin">
   <input v-model="login.email">
   <input type="password" v-model="login.password">

   <button type="submit">Login</button>
</form>

<form @submit.prevent="doRegister">
   <input v-model="register.alias">
   <input type="email" v-model="register.email">
   <input type="password" v-model="register.password">

   <button type="submit">Register</button>
</form>
```

``` javascript
import VueDaval from 'vue-daval';

export default {
   mixins: [ VueDaval ],

   data: () => ({
      login: {
         email: undefined,
         password: undefined
      },

      register: {
         alias: undefined,
         email: undefined,
         password: undefined
      }
   }),

   vdRules: {
      login: {
         email: { required: true, type: 'email' },
         password: { required: true, minlen: 5 }
      },

      register: {
         alias: { required: true, minlen: 5, checkAlias: (alias) => {
            return alias === 'admin'? 'Alias already in use' : true;
         }},
         email: { required: true, type: 'email', checkEmail: (email) => {
            return this.$http.post('/users/check/email', { email: email });
         }},
         password: { required: true, minlen: 5 }
      }
   },

   methods: {
      doLogin() {
         this.$vd.login.$validate().then(() => {
            this.$http.post('/users/login', this.login);

         }).catch(() => {
            alert('Error in login form');
         });
      },

      doRegister() {
         this.$vd.register.$validate().then(() => {
            this.$http.post('/users/register', this.register);

         }).catch(() => {
            alert('Error in register form');
         });
      }
   }
}
```

## Performance

Weight is just 46 KB so is pretty light and is tweaked to be as fast as possible keeping code readability, developed with ES6 syntax and built with Vue CLI 3.

## Included validatiors

* Type: check the type of value, supporting boolean, number, integer, float, string, url, email and date.
* Required: check if value is empty.
* Regular expression: check the value against regular expression.
* Minimum: check if value is greater than the number specified.
* Maximum: check if value is less than the number specified.
* Minimum length: check if value lengh is greater than the number specified.
* Maximum length: check if value lengh is less than the number specified.
* Length: check if value lengh is exactly the number specified.
* Equals: check if value equals another value.
* Is: check if value is a given one.
* Is not: check if value is not a given one.
* Is in: check if value is in a string or one element of an array.

## Troubleshooting

If you find yourself running into issues during installation or running the validator, please check our [Wiki](https://github.com/deulos/vue-daval/wiki). If still need help open an [issue](https://github.com/deulos/vue-daval/issues/new). We would be happy to discuss how they can be solved.

## Documentation

You can view the full documentation at the project's [Wiki](https://github.com/deulos/vue-daval/wiki) with examples and detailed information.

## Contributing

Contributions, questions and comments are all welcome and encouraged.
