import Vue from 'vue';
import MediaElement from './MediaElement';

export default {
    install(Vue, options) {
        Vue.component(
            MediaElement.name,
            MediaElement,
        );
    },
};
