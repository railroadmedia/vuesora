import Vue from 'vue';
import ContactMemberEmailForm from './ContactMemberEmailForm';

export default {
    install(Vue, options) {
        Vue.component(
            ContactMemberEmailForm.name,
            ContactMemberEmailForm,
        );
    },
};
