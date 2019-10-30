import LegacyLoops from './LegacyLoops.vue';

export default {
    install(Vue, options) {
        Vue.component(
            LegacyLoops.name,
            LegacyLoops,
        );
    },
};
