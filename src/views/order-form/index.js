import vaComponent from './VaOrderForm.vue';

export default {
    install(Vue, options){
        Vue.component(
            vaComponent.name,
            vaComponent
        )
    }
}