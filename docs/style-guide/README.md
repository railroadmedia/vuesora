# Style Guide

## Javascript

Vuesora uses a custom ESLint Configuration based off of the 
[eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) package. 

You can view [Airbnb's Javascript Style Guide](https://github.com/airbnb/javascript) to reference the individual rules.

### PHPStorm/Webstorm

#### Code Hinting

If you are using the PHPStorm or WebStorm IDEs, you can turn on the ESLint code hinting by going into:

**File -> Settings -> Languages & Frameworks -> Javascript -> Code Quality Tools -> ESLint -> Automatic ESLint Configuration**

![ESLint Config](/eslint-config.jpg)

#### Auto-Formatting

In order to set up auto-formatting you need to set up an External Tool with your IDE.

**File -> Settings -> Tools -> External Tools -> [ + ]**

![ESLint Auto-format](/eslint-autoformat.jpg)

After hitting accept you can now go to:

**Tools -> External Tools -> ESLint Fix**

This will auto-format the current file in focus.

Alternatively, you can bind a keyboard shortcut to run this external tool. 

**File -> Settings -> Keymap**

Find ESLint Fix (or whatever you named your external tool configuration) under External Tools. 
Now you can bind a key to run ESLint fix just like you would with any of the built-in features.

## Vue

It is recommended that all developers follow the official [Vue Style Guide](https://vuejs.org/v2/style-guide/). 
Aswell as the guide lines listed below:

### Component Structure

All components should follow the same property structure. Try to tell a top down story with your component, in the 
order it happens.

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

## CSS/SASS

_Coming Soon_