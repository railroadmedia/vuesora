import Vue from 'vue';
import CartSidebar from './CartSidebar';

export default {
    install(Vue, options) {
        Vue.component(
            CartSidebar.name,
            CartSidebar,
        );
    },
};
