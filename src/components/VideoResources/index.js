import Vue from 'vue';
import VideoResources from './VideoResources.vue';

export default {
    install(Vue, options) {
        Vue.component(
            VideoResources.name,
            VideoResources,
        );
    },
};
