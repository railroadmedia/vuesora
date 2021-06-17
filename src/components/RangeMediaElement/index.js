import Vue from 'vue';
import RangeMediaElement from './RangeMediaElement';

export default {
    install(Vue, options) {
        Vue.component(
            RangeMediaElement.name,
            RangeMediaElement,
        );
    },
};
