import Vue from 'vue';
import YoutubePlayer from './YoutubePlayer.vue';

export default {
    install(Vue, options) {
        Vue.component(
            YoutubePlayer.name,
            YoutubePlayer,
        );
    },
};
