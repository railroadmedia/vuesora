import Vue from 'vue';
import ContactEmailForm from './ContactEmailForm';

export default {
    install(Vue, options) {
        Vue.component(
            ContactEmailForm.name,
            ContactEmailForm,
        );
    },
};
