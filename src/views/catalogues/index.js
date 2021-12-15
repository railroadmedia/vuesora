import Vue from 'vue';
import ContentCatalogue from './ContentCatalogue';
import ContentCatalogueContainer from './ContentCatalogueContainer';

export default {
    install(Vue, options) {
        Vue.component(
            ContentCatalogue.name,
            ContentCatalogue,
            ContentCatalogueContainer.name,
            ContentCatalogueContainer,
        );
    },
};
