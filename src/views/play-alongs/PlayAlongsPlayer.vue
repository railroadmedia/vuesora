<template>
    <div
        id="playAlongsPlayer"
        class="container collapsed fluid bg-white shadow"
        :class="collapsed ? 'collapsed-down' : ''"
    >
        <div
            v-if="loop"
            id="anchorA"
            class="loop-anchor bg-drumeo text-white body rounded noselect pointer"
            :style="'left:' + anchorOffsets.a + '%;'"
            @mousedown="emitAnchorMouseDown('a')"
            @touchstart="emitAnchorMouseDown('a')"
        >
            A
        </div>

        <div
            v-if="loop"
            id="anchorB"
            class="loop-anchor bg-drumeo text-white body rounded noselect pointer"
            :style="'left:' + anchorOffsets.b + '%;'"
            @mousedown="emitAnchorMouseDown('b')"
            @touchstart="emitAnchorMouseDown('b')"
        >
            B
        </div>

        <div
            class="player-tab title text-drumeo bg-white shadow flex-center pointer"
            @click="collapsed = !collapsed"
        >
            <i
                class="fas"
                :class="collapsed ? 'fa-plus' : 'fa-minus'"
            ></i>
        </div>

        <div
            ref="progressBar"
            class="progress-container flex flex-row bg-grey-5 pointer"
            @mousedown="mousedown = true"
            @touchstart="mousedown = true"
        >
            <div
                class="progress-amount bg-drumeo"
                :style="durationOffsetStyles"
            ></div>
        </div>

        <div class="flex flex-row align-h-center pv-1 noselect">
            <div
                v-show="loop"
                class="flex flex-column align-center xs-4"
            >
                <button
                    class="btn collapse-square short mb-1"
                    @click="emitAnchorButtonClick('a')"
                >
                    <span class="bg-black text-white">
                        A
                    </span>
                </button>

                <p class="tiny text-grey-4 dense">
                    {{ getAnchorOffsetTime(anchorOffsets.a) }}
                </p>
            </div>

            <div class="flex flex-column align-center grow no-events">
                <h4 class="title text-center">
                    {{ $_title }}
                </h4>
                <h6 class="body text-center text-grey-4 mb-2">
                    <span class="capitalize">{{ $_style }}</span> @ {{ $_bpm }} BPM
                </h6>
                <h6 class="body dense text-grey-4 text-center">
                    {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                </h6>
            </div>

            <div
                v-show="loop"
                class="flex flex-column align-center xs-4"
            >
                <button
                    class="btn collapse-square short mb-1"
                    @click="emitAnchorButtonClick('b')"
                >
                    <span class="bg-black text-white">
                        B
                    </span>
                </button>

                <p class="tiny text-grey-4 dense">
                    {{ getAnchorOffsetTime(anchorOffsets.b) }}
                </p>
            </div>
        </div>

        <div class="flex flex-row align-h-center pv-1">
            <button
                class="btn collapse-square mh-1"
                :disabled="disablePreviousTrack"
                @click="previousTrack"
                @keyup.prevent
                @keydown.prevent
            >
                <span class="flat bg-black">
                    <i class="fas fa-step-backward"></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1 skip-5"
                @click="skipFive(false)"
                @keyup.prevent
                @keydown.prevent
            >
                <span class="flat bg-black">
                    <i class="fas fa-undo"></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1"
                @click="playPause"
                @keydown.prevent
            >
                <span class="flat bg-black">
                    <i
                        class="fas"
                        :class="isPlaying ? 'fa-pause' : 'fa-play'"
                    ></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1 skip-5"
                @click="skipFive(true)"
                @keydown.prevent
            >
                <span class="flat bg-black">
                    <i class="fas fa-redo"></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1"
                :disabled="isShuffle && playedContent.length === totalResults"
                @click="nextTrack"
                @keydown.prevent
            >
                <span class="flat bg-black">
                    <i class="fas fa-step-forward"></i>
                </span>
            </button>
        </div>

        <div class="flex flex-row bg-grey-5 pv-1 align-h-center">
            <div class="flex flex-column ph-1 grow"></div>
            <div class="flex flex-column player-buttons">
                <div class="flex flex-row">
                    <button
                        class="btn collapse-square mh-1"
                        :title="click ? 'Disable Click Track' : 'Enable Click Track'"
                        @click="toggleMetronome"
                        @keydown.prevent
                    >
                        <span
                            class="bg-white rounded"
                            :class="click ? 'text-grey-5' : 'inverted text-white'"
                        >
                            <i class="icon-metronome"></i>
                        </span>
                    </button>

                    <button
                        class="btn collapse-square mh-1"
                        :title="drums ? 'Disable Drum Track' : 'Enable Drum Track'"
                        @click="toggleDrums"
                        @keydown.prevent
                    >
                        <span
                            class="bg-white rounded"
                            :class="drums ? 'text-grey-5' : 'inverted text-white'"
                        >
                            <i class="icon-drums"></i>
                        </span>
                    </button>

                    <button
                        class="btn collapse-square mh-1"
                        :title="loop ? 'Disable Loop' : 'Enable Loop'"
                        @click="toggleLoop"
                        @keydown.prevent
                    >
                        <span
                            class="bg-white rounded"
                            :class="loop ? 'text-grey-5' : 'inverted text-white'"
                        >
                            <i class="fa fa-repeat"></i>
                        </span>
                    </button>
                </div>
            </div>

            <div class="flex flex-column grow ph-1">
                <div class="flex flex-row">
                    <div class="flex flex-column grow"></div>

                    <div
                        v-if="!isMobile"
                        class="flex flex-column volume"
                    >
                        <div class="flex flex-row align-h-right align-v-center">
                            <div class="flex flex-column volume-rail-wrap">
                                <div class="volume-rail">
                                    <div
                                        class="volume-fill bg-white"
                                        :style="volumeOffset"
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

                            <button
                                :title="currentVolume === 0 ? 'Unmute (M)' : 'Mute (M)'"
                                class="btn collapse-square text-white"
                                @click="emitVolumeChange(0)"
                                @keydown.prevent
                            >
                                <span
                                    class="text-white flat"
                                >
                                    <i
                                        class="fa"
                                        :class="volumeButtonClass"
                                    ></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PlayerUtils from '../../components/VideoPlayer/player-utils';

export default {
    name: 'PlayAlongsPlayer',
    props: {
        activeItem: {
            type: Object,
            default: () => null,
        },

        audioPlayer: {
            type: [Object, HTMLAudioElement],
            default: () => ({}),
        },

        isPlaying: {
            type: Boolean,
            default: () => false,
        },

        click: {
            type: Boolean,
            default: () => false,
        },

        drums: {
            type: Boolean,
            default: () => false,
        },

        loop: {
            type: Boolean,
            default: () => false,
        },

        anchorOffsets: {
            type: Object,
            default: () => ({
                a: 0,
                b: 100,
            }),
        },

        currentTime: {
            type: Number,
            default: () => 0,
        },

        totalDuration: {
            type: Number,
            default: () => 0,
        },

        currentPosition: {
            type: Number,
            default: () => 0,
        },

        currentMouseX: {
            type: Number,
            default: () => 0,
        },

        playedContent: {
            type: Array,
            default: () => [],
        },

        currentVolume: {
            type: Number,
            default: () => 100,
        },

        totalResults: {
            type: Number,
            default: () => 0,
        },

        isShuffle: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            mousedown: false,
            collapsed: false,
            volumeCache: this.currentVolume,
        };
    },
    computed: {
        isMobile: () => PlayerUtils.isMobile().any,

        volumeOffset() {
            return {
                width: `${this.currentVolume}%`,
            };
        },

        volumeButtonClass() {
            return {
                'fa-volume-slash': this.currentVolume === 0,
                'fa-volume-down': this.currentVolume > 0 && this.currentVolume < 50,
                'fa-volume-up': this.currentVolume >= 50,
            };
        },

        $_title() {
            return this.activeItem ? this.activeItem.getPostField('title') : '';
        },

        $_style() {
            return this.activeItem ? this.activeItem.getPostFieldMulti('style').join(', ') : '';
        },

        $_bpm() {
            return this.activeItem ? this.activeItem.getPostField('bpm') : '';
        },

        durationOffsetStyles() {
            if (this.mousedown) {
                const percentOffset = (this.currentMouseX / this.$refs.progressBar.clientWidth) * 100;

                return {
                    transform: `translateX(${percentOffset - 100}%)`,
                    'webkit-transform': `translateX(${percentOffset - 100}%)`,
                };
            }

            return {
                transform: `translateX(${this.currentPosition - 100}%)`,
                'webkit-transform': `translateX(${this.currentPosition - 100}%)`,
            };
        },

        $_isPlaying: {
            cache: false,
            get() {
                return this.audioPlayer ? !this.audioPlayer.paused : false;
            },
        },

        anchorOffsetsInSeconds() {
            return {
                a: (this.anchorOffsets.a / 100) * this.totalDuration,
                b: (this.anchorOffsets.b / 100) * this.totalDuration,
            };
        },

        disablePreviousTrack() {
            if (this.isShuffle) {
                return this.playedContent.length < 2;
            }

            return false;
        },
    },
    watch: {
        collapsed() {
            if (this.collapsed) {
                document.body.classList.remove('play-alongs-player-open');
            } else {
                document.body.classList.add('play-alongs-player-open');
            }
        },

        activeItem() {
            if (this.activeItem != null) {
                document.body.classList.add('play-alongs-player-open');
            } else {
                document.body.classList.remove('play-alongs-player-open');
            }
        },
    },
    mounted() {
        document.addEventListener('mouseup', this.handleMouseUp);
    },
    beforeDestroy() {
        document.removeEventListener('mouseup', this.handleMouseUp);
    },
    methods: {
        playPause() {
            this.$emit('playPause');
            this.$nextTick(() => this.$forceUpdate());
        },

        seek(position) {
            this.$emit('seek', position);
        },

        toggleDrums() {
            this.$emit('drums', !this.drums);
        },

        toggleMetronome() {
            this.$emit('click', !this.click);
        },

        toggleLoop() {
            this.$emit('loop', !this.loop);
        },

        skipFive(forward = true) {
            const newPosition = forward ? this.currentTime + 5 : this.currentTime - 5;
            this.seek(newPosition);
        },

        nextTrack() {
            this.$emit('nextTrack');
        },

        previousTrack() {
            this.$emit('previousTrack');
        },

        seekViaProgressBar(event) {
            const percentToSeekTo = (event.clientX || event.touches[0].clientX) / this.$refs.progressBar.clientWidth;
            const offsetToSeekTo = this.totalDuration * percentToSeekTo;

            this.$emit('seek', offsetToSeekTo);
        },

        getAnchorOffsetTime(offset) {
            return this.parseTime(this.totalDuration * (offset / 100));
        },

        handleMouseUp() {
            if (this.mousedown) {
                const percentToSeekTo = (this.currentMouseX / this.$refs.progressBar.clientWidth);
                const offsetToSeekTo = this.totalDuration * percentToSeekTo;

                this.$emit('seek', offsetToSeekTo);
            }

            setTimeout(() => {
                this.mousedown = false;
            }, 100);
        },

        emitAnchorMouseDown(anchor) {
            this.$emit('anchorMouseDown', anchor);
        },

        emitAnchorButtonClick(anchor) {
            this.$emit('anchorButtonClick', anchor);
        },

        emitVolumeChange(event) {
            if (event) {
                this.$emit('volumeChange', event.target.value);
            } else {
                let volume = this.volumeCache;

                if (this.currentVolume) {
                    volume = 0;
                    this.volumeCache = this.currentVolume;
                }

                this.$emit('volumeChange', volume);
            }
        },

        parseTime: time => PlayerUtils.parseTime(time),
    },
};
</script>
