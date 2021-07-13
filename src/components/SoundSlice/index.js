import Vue from 'vue';
import SoundSlice from './SoundSlice';

export default {
    install(Vue, options) {
        Vue.component(
            SoundSlice.name,
            SoundSlice,
        );
    },
};
