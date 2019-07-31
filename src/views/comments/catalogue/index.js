import Vue from 'vue';
import CommentsCatalogue from './CommentsCatalogue';

export default {
    install(Vue, options) {
        Vue.component(
            CommentsCatalogue.name,
            CommentsCatalogue,
        );
    },
};
