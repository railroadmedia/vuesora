<template>
    <div class="flex flex-column volume">
        <div class="flex flex-row align-v-center">
            <div class="flex flex-column volume-rail-wrap">
                <div class="volume-rail">
                    <div
                        class="volume-fill"
                        :style="volumeOffset"
                        :class="themeBgClass"
                        @click.stop
                    ></div>

                    <input
                        type="range"
                        class="volume-range"
                        min="0"
                        max="100"
                        :value="currentVolume"
                        @click.stop
                        @input="emitVolumeChange"
                    >
                </div>
            </div>

            <player-button
                :theme-color="themeColor"
                :active="currentVolume === 0"
                :title="currentVolume === 0 ? 'Unmute (M)' : 'Mute (M)'"
                @click.native.stop="emitMute"
            >
                <i
                    class="fas"
                    :class="volumeButtonClass"
                ></i>
            </player-button>
        </div>
    </div>
</template>
<script>
import PlayerButton from './_PlayerButton.vue';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayerVolume',
    components: {
        'player-button': PlayerButton,
    },
    mixins: [ThemeClasses],
    props: {
        currentVolume: {
            type: Number,
            default: () => 1,
        },
    },
    data() {
        return {
            volumeCache: this.currentVolume,
        };
    },
    computed: {
        volumeOffset() {
            return {
                width: `${(this.currentVolume * 100)}%`,
            };
        },

        volumeButtonClass() {
            return {
                'fa-volume-slash': this.currentVolume === 0,
                'fa-volume-down': this.currentVolume > 0 && this.currentVolume < 0.5,
                'fa-volume-up': this.currentVolume >= 0.5,
            };
        },
    },
    methods: {
        emitVolumeChange(event) {
            if (event) {
                this.$emit('volumeChange', {
                    volume: event.target.value,
                });
            } else {
                let volume = this.volumeCache * 100;

                if (this.currentVolume) {
                    volume = 0;
                    this.volumeCache = this.currentVolume;
                }

                this.$emit('volumeChange', {
                    volume,
                });
            }
        },
        emitMute() {
            if (window.localStorage.getItem('isMuted') === null) {
                window.localStorage.setItem('isMuted', true);

                this.$emit('volumeChange', {
                    volume: 0,
                }, false);
            } else {
                window.localStorage.removeItem('isMuted');

                this.$emit('volumeChange', {
                    volume: Number(window.localStorage.getItem('playerVolume') || 75),
                });
            }
        },
    },
};
</script>
