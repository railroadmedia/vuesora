import Vue from 'vue';
import AssignmentsContainer from './AssignmentsContainer.vue';

export default {
    install(Vue, options) {
        Vue.component(
            AssignmentsContainer.name,
            AssignmentsContainer,
        );
    },
};
