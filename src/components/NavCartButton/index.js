import Vue from 'vue';
import NavCartButton from './NavCartButton';

export default {
    install(Vue, options) {
        Vue.component(
            NavCartButton.name,
            NavCartButton,
        );
    },
};
