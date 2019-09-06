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
        >
            A
        </div>

        <div
            v-if="loop"
            id="anchorB"
            class="loop-anchor bg-drumeo text-white body rounded noselect pointer"
            :style="'left:' + anchorOffsets.b + '%;'"
            @mousedown="emitAnchorMouseDown('b')"
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
            class="progress-container flex flex-row bg-grey-5 pointer"
            ref="progressBar"
            @mousedown="mousedown = true"
        >
            <div
                class="progress-amount bg-drumeo"
                :style="durationOffsetStyles"
            ></div>
        </div>

        <div class="flex flex-row align-h-center pv-1 noselect">
            <div class="flex flex-column">
                <h4 class="title text-center">
                    {{ $_title }}
                </h4>
                <h6 class="body text-center">
                    <span class="capitalize">{{ $_style }}</span> @ {{ $_bpm }} BPM
                </h6>
            </div>
        </div>

        <div class="flex flex-row align-h-center pv-1">
            <button
                class="btn collapse-square mh-1 skip-10"
                @click="skipTen(false)"
            >
                <span class="flat bg-black">
                    <i class="fas fa-undo"></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1"
                @click="playPause"
            >
                <span class="flat bg-black">
                    <i
                        class="fas"
                        :class="isPlaying ? 'fa-pause' : 'fa-play'"
                    ></i>
                </span>
            </button>

            <button
                class="btn collapse-square mh-1 skip-10"
                @click="skipTen(true)"
            >
                <span class="flat bg-black">
                    <i class="fas fa-redo"></i>
                </span>
            </button>
        </div>

        <div class="flex flex-row bg-grey-5 pv-1 align-h-center">
            <button
                class="btn collapse-square mh-1"
                @click="toggleMetronome"
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
                @click="toggleDrums"
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
                @click="toggleLoop"
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
</template>
<script>
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
    },
    data() {
        return {
            mousedown: false,
            collapsed: false,
        };
    },
    computed: {

        $_title() {
            return this.activeItem ? this.activeItem.getPostField('title') : '';
        },

        $_style() {
            return this.activeItem ? this.activeItem.getPostField('style') : '';
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

        skipTen(forward = true) {
            const newPosition = forward ? this.currentTime + 10 : this.currentTime - 10;
            this.seek(newPosition);
        },

        seekViaProgressBar(event) {
            const percentToSeekTo = (event.clientX || event.touches[0].clientX) / this.$refs.progressBar.clientWidth;
            const offsetToSeekTo = this.totalDuration * percentToSeekTo;

            this.$emit('seek', offsetToSeekTo);
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
    },
};
</script>
