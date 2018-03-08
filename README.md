This is a data validator inspired by https://github.com/yiminghe/async-validator and adapted to VueJS fixing the lack of other data validators and with the following features:

### Template agnostic
No matter what template library you use, this validator will simply work.

### Simplicity in custom validations
Focused in developer easiness to save time and headaches.

### Maintain validations reactivity when data replaced
When an object is loaded from server you can set it without worring, it will restore attribute watchers.

### Data tree support (objects and array of objects)
If you have nested data objects to validate, this mixin will deal with it without trouble.

### Very simple logic performing validations by order and skipping the rest when validation fails
If a validation in value fails will not run the rest of validations for the value, reducing time and processing considerably.

### Support for promises
Will detect if the returned validation is a promise and handle properly without need of external packages.

### Real time results
I have found that in some validators the results are showed in the next tick. This mixin forces the render to be updated once the validations are finished so no delays on result are produced.

### Multiple async validations will be controlled and only last one will be taken
If a typing is being validated against a resource it will control the times in order to ensure that the last one is the validation that prevails against the previuos.

### Do not revalidate a value already validated
It controls whether a validation is performed or not, so if the value does not change it will not be validated again, saving time and processing.

### Dependencies free, being ~25 KB minified
This validator is served as a mixin just with vue as dependency in order to reduce the processing, time and load. It is set out to accomplish most of the use cases so it is adapted to common use needs.

### Community open
Feel free to contribute or bring suggestions, any improvement will be at least taken in mind, discussed and accepted if reasonable, just keep the the previous rules in mind.

# Documentation
Please visit our wiki that we bother to keep updated to know everything about this component: https://github.com/deulos/vuejs-model-validator/wiki
