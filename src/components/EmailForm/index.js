import Vue from 'vue';
import EmailForm from './EmailForm';

export default {
    install(Vue, options){
        Vue.component(
            EmailForm.name,
            EmailForm
        )
    }
}