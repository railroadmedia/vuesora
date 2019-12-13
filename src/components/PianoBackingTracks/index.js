import PianoBackingTracks from './PianoBackingTracks.vue';

export default {
    install(Vue, options) {
        Vue.component(
            PianoBackingTracks.name,
            PianoBackingTracks,
        );
    },
};
