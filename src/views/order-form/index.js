import vaComponent from './OrderForm.vue';

export default {
    install(Vue, options) {
        Vue.component(
            vaComponent.name,
            vaComponent,
        );
    },
};
