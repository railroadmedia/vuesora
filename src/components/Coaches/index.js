import Vue from 'vue';
import CoachEvent from './CoachEvent.vue';

export default {
    install(Vue, options) {
        Vue.component(
            CoachEvent.name,
            CoachEvent,
        );
    },
};
