import Vue from 'vue';
import AssignmentsContainer from './AssignmentsContainer';

export default {
    install(Vue, options) {
        Vue.component(
            AssignmentsContainer.name,
            AssignmentsContainer,
        );
    },
};
