# Style Guide

## Vue

It is recommended that all developers follow the official [Vue Style Guide](https://vuejs.org/v2/style-guide/). 
Aswell as the guide lines listed below:

### Component Structure

All components should follow the same property structure. Try to tell a top down story with your component, in the order it
happens.

All properties should ideally be in the order displayed:

```javascript
export default {
    mixins,
    name,
    beforeCreate() {},
    created() {},
    components: {},
    props: {},
    data() {},
    computed: {},
    watchers: {},
    methods: {},
    beforeMount() {},
    mounted() {},
    beforeDestroy() {},
}
```

### Component Names

All component names must be **kebab-case**

```javascript
export default {
    name: 'sample-component',
    // ...
}
```
```html
<sample-component>
    ...
</sample-component>
```

### Prop Definitions

Always define props with a type and a default if you can.

```javascript
props: {
    sampleProp: {
        type: String,
        default: () => 'sample prop'
    }
}
```

## Javascript

## CSS