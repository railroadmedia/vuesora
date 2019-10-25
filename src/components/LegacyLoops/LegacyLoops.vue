<template>
    <div class="flex flex-column">
        <div
            v-for="loop in loopTitles"
            :key="loop"
            class="flex flex-row"
        >
            <div class="flex flex-column pa-1">
                <div class="flex flex-row">
                    <h1 class="title">
                        {{ loop }}
                    </h1>
                </div>
                <div class="flex flex-row flex-wrap">
                    <div
                        v-for="tempo in loops[loop].tempos"
                        :key="`${loop}-${tempo}`"
                        class="flex flex-column loop-play-button"
                    >
                        <button
                            class="btn short"
                            @click="selectLoop(loop, tempo)"
                        >
                            <span
                                class="bg-drumeo"
                                :class="isCurrentLoop(loop, tempo) ? 'text-white' : 'flat text-drumeo'"
                            >
                                {{ tempo }} BPM
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-row pa-1">
            <div class="flex flex-column icon-col">
                <button
                    class="btn"
                    @click="enableClick"
                >
                    <span
                        class="bg-drumeo"
                        :class="click ? 'text-white' : 'inverted text-drumeo'"
                    >
                        <i class="icon-metronome"></i>
                    </span>
                </button>
            </div>
            <div class="flex flex-column pl-1">
                <audio
                    ref="audioPlayer"
                    id="loopsAudioPlayer"
                    controls
                    loop
                    :src="currentSource"
                    style="width:100%;height:50px;outline:none;"
                ></audio>
            </div>
        </div>
    </div>
</template>

<script>
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'LegacyLoops',
    mixins: [ThemeClasses],
    props: {
        loops: {
            type: Object,
            default: () => ({}),
        },

        audioPlayerId: {
            type: String,
            default: () => 'loopsAudioPlayer',
        },
    },
    data() {
        return {
            currentLoop: null,
            currentBpm: null,
            currentSource: null,
            click: false,
            loopTitles: Object.keys(this.loops),
        };
    },
    mounted() {
        const audioPlayers = document.querySelectorAll('audio');
        const { audioPlayer } = this.$refs;

        // Pause the player if any other audio players on the page are played
        Array.from(audioPlayers).forEach((player) => {
            if (!player.matches(`#${this.audioPlayerId}`)) {
                player.addEventListener('play', () => {
                    audioPlayer.pause();
                });
            }
        });
    },
    methods: {
        selectLoop(loop, tempo) {
            const { audioPlayer } = this.$refs;

            this.currentLoop = loop;
            this.currentBpm = tempo;
            this.currentSource = `${this.loops[loop].base_url}${tempo}bpm${this.click ? '-click' : ''}.mp3`;

            audioPlayer.load();

            audioPlayer.addEventListener('canplay', this.playTrack);
        },

        playTrack() {
            const { audioPlayer } = this.$refs;

            audioPlayer.play();
            audioPlayer.removeEventListener('canplay', this.playTrack);
        },

        isCurrentLoop(loop, tempo) {
            return this.currentLoop === loop && this.currentBpm === tempo;
        },

        enableClick() {
            this.click = !this.click;

            if (this.currentSource) {
                this.selectLoop(this.currentLoop, this.currentBpm);
            }
        },
    },
};
</script>
<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

    .loop-play-button {
        flex:0 0 33.3333%;
        max-width:33.3333%;
        min-width:33.3333%;

        @include small {
            flex:0 0 100px;
            max-width:100px;
            min-width:100px;
        }
    }
</style>
