import vaComponent from './PaymentMethods.vue';

export default {
    install(Vue, options) {
        Vue.component(
            vaComponent.name,
            vaComponent,
        );
    },
};
