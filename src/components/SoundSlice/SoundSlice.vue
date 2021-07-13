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
import ContentService from '../../assets/js/services/content';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import ProgressTracker from '../../assets/js/classes/progress-tracker';
import Intercom from '../../assets/js/services/intercom';

export default {
    name: 'SoundSlice',
    components: {
        'loading-animation': LoadingAnimation,
    },
    props: {
        contentId: {
            type: [Number, String],
            default: () => 0,
        },
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
                this.soundSliceOpened();
            } else {
                this.soundSliceClosed();
            }
        },

        contentId(val) {
            if (val) {
                this.$nextTick(() => {
                    this.setLastContentId();
                });
            }
        },
    },
    data() {
        return {
            loading: true,
            isPlaying: false,
            progressTracker: null,
            progressTrackerEventListener: false,
            lastContentId: '',
        };
    },
    methods: {
        closeExercise() {
            this.$emit('soundSliceClosed', {});
        },

        setLastContentId() {
            this.lastContentId = this.contentId;
        },

        soundSliceOpened() {
            Intercom.hideWidget();

            this.progressTracker = new ProgressTracker();

            window.addEventListener('message', this.handleSoundSliceEvent);
            document.addEventListener('keyup', this.spacebarToPlayPause);

            document.body.classList.add('no-scroll', 'dim-sidebar');
        },

        soundSliceClosed() {
            Intercom.showWidget();

            this.progressTracker.sendAsync({
                mediaId: this.lastContentId,
                mediaType: 'assignment',
                mediaCategory: 'soundslice',
            });

            this.progressTracker = null;

            if (this.progressTrackerEventListener) {
                window.removeEventListener('unload', () => this.sendProgressTracking);
            }

            window.removeEventListener('message', this.handleSoundSliceEvent);
            document.removeEventListener('keyup', this.spacebarToPlayPause);

            Intercom.showWidget();

            document.body.classList.remove('no-scroll', 'dim-sidebar');
        },

        sendProgressTracking() {
            this.progressTracker.send({
                mediaId: this.lastContentId,
                mediaType: 'assignment',
                mediaCategory: 'soundslice',
            });
        },

        handlePlay() {
            this.isPlaying = true;

            this.progressTracker.start();

            ContentService.markContentAsStarted(this.contentId);

            if (!this.progressTrackerEventListener) {
                this.progressTrackerEventListener = true;

                window.addEventListener('unload', this.sendProgressTracking);
            }
        },

        handlePause() {
            this.isPlaying = false;

            this.progressTracker.stop();
        },

        handleSoundSliceEvent(event) {
            const vm  = this;

            if (event.origin === 'https://www.soundslice.com') {
                const cmd = JSON.parse(event.data);

                switch (cmd.method) {
                    case 'ssPlay':
                        vm.handlePlay();
                        break;
                    case 'ssPause':
                        vm.handlePause();
                        break;
                }
            }
        },

        spacebarToPlayPause(event) {
            if (event.keyCode === 32) {
                const embeddedPlayer = document.getElementById('ssEmbed').contentWindow;

                event.preventDefault();

                if (this.isPlaying) {
                    embeddedPlayer.postMessage('{"method": "pause"}', 'https://www.soundslice.com');
                } else {
                    embeddedPlayer.postMessage('{"method": "play"}', 'https://www.soundslice.com');
                }
            }
        },
    },
}
</script>
