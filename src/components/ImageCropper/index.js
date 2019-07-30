import Vue from 'vue';
import ImageCropper from './ImageCropper';

export default {
    install(Vue, options) {
        Vue.component(
            ImageCropper.name,
            ImageCropper,
        );
    },
};
