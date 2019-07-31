import Vue from 'vue';
import ContentCatalogue from './ContentCatalogue';

export default {
    install(Vue, options) {
        Vue.component(
            ContentCatalogue.name,
            ContentCatalogue,
        );
    },
};
