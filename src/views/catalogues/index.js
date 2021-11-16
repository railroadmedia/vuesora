import Vue from 'vue';
import ContentCatalogue from './ContentCatalogue';
import CoachesCatalogue from './CoachesCatalogue';

export default {
    install(Vue, options) {
        Vue.component(
            ContentCatalogue.name,
            ContentCatalogue,
            CoachesCataglogue,
        );
    },
};
