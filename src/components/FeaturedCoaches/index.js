import Vue from 'vue';
import FeaturedCoaches from './FeaturedCoaches.vue';

export default {
    install(Vue, options) {
        Vue.component(
            FeaturedCoaches.name,
            FeaturedCoaches,
        );
    },
};
