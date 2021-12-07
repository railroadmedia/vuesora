import Vue from 'vue';
import ContentCatalogue from './ContentCatalogue';
import ContentCatalogueContainer from './ContentCatalogueContainer';
import CoachesCatalogue from './CoachesCatalogue';

export default {
    install(Vue, options) {
        Vue.component(
            ContentCatalogue.name,
            ContentCatalogue,
            CoachesCatalogue,
            ContentCatalogueContainer.name,
            ContentCatalogueContainer,
        );
    },
};
