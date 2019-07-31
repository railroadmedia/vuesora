import Vue from 'vue';
import ContentAssignment from './ContentAssignment';

export default {
    install(Vue, options) {
        Vue.component(
            ContentAssignment.name,
            ContentAssignment,
        );
    },
};
