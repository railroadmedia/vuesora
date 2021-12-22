import Vue from 'vue';
import SupportEmailForm from './SupportEmailForm';

export default {
    install(Vue, options) {
        Vue.component(
            SupportEmailForm.name,
            SupportEmailForm,
        );
    },
};
