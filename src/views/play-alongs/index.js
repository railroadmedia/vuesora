import PlayAlongs from './PlayAlongs.vue';

export default {
    install(Vue, options) {
        Vue.component(
            PlayAlongs.name,
            PlayAlongs,
        );
    },
};
