import Vue from 'vue';
import NotificationToasts from './NotificationToasts.vue';

export default {
    install(Vue, options) {
        Vue.component(
            NotificationToasts.name,
            NotificationToasts,
        );
    },
};
