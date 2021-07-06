<template>
    <transition name="show-from-bottom">
        <div
            v-if="open"
            id="practiceOverlay"
            class="bg-white"
        >
            <div class="flex flex-column embed-column">
                <div class="flex flex-row align-v-center flex-auto bb-grey-4-1 bg-grey-5 ph">
                    <div class="flex flex-column">
                        <h2 class="title text-white text-truncate-2-lines">
                            {{ title }}
                        </h2>
                    </div>

                    <div
                        class="flex flex-column close-exercise uppercase text-white align-v-center pv-1 pointer flex-auto"
                        @click="closeExercise"
                    >
                        <div class="flex flex-row tiny align-v-center">
                            Close <i class="fas fa-times ml-1"></i>
                        </div>
                    </div>
                    <div>src: {{ iframeSrc }}</div>
                </div>
                <div class="flex flex-row grow">
                    <div class="flex flex-column relative">
                        <iframe
                            id="ssEmbed"
                            :src="iframeSrc"
                            frameBorder="0"
                            allowfullscreen
                            @load="loading = false"
                        ></iframe>
                    </div>
                </div>
            </div>

            <div
                v-if="loading"
                class="loading-exercise heading ph-4 pv-2"
            >
                <loading-animation :theme-color="themeColor" />
            </div>
        </div>
    </transition>
</template>

<script>
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';

export default {
    name: 'SoundSlice',
    components: {
        'loading-animation': LoadingAnimation,
    },
    props: {
        soundSliceSlug: {
            type: String,
            default: () => '',
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        title: {
            type: String,
            default: () => '',
        },
        userId: {
          type: [Number, String],
          default: () => 0,
        },
    },
    computed: {
        open: {
            cache: false,
            get() {
                return this.soundSliceSlug != '';
            },
        },

        iframeSrc: {
            cache: false,
            get() {
                return 'https://www.soundslice.com/slices/' + this.soundSliceSlug + '/embed/?api=1&scroll_type=2&branding=0&u=' + this.userId;
            },
        },
    },
    watch: {
        soundSliceSlug(val) {
            if (val) {
                this.loading = true;
                document.body.classList.add('no-scroll', 'dim-sidebar');
            } else {
                document.body.classList.remove('no-scroll', 'dim-sidebar');
            }
        },
    },
    data() {
        return {
            loading: true,
        };
    },
    methods: {
        closeExercise() {
            this.$emit('soundSliceClosed', {});
        }
    },
}
</script>
