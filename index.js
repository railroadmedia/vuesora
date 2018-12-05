import * as components from './src/components';
import Vue from 'vue';

export default {
    install(Vue, options){
        Object.keys(components).forEach(key => {
            Vue.component(components[key].name, components[key])
        });
    }
}
