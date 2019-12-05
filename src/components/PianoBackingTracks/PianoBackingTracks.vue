<template>
    <div class="flex flex-row">
        <div class="flex flex-column">
            <h1 class="subheading mb-1">
                {{ title }}
            </h1>

            <audio
                ref="audioPlayer"
                :src="currentSource"
                controls
                style="width:100%;height:50px;outline:none;"
            ></audio>

            <div class="flex flex-row nmh-1 mb-1 align-v-center">
                <div class="flex flex-column ph-1 flex-auto">
                    <button
                        class="btn"
                        style="width:50px;font-size:20px;"
                        :title="`${leftHand ? 'Disable' : 'Enable'} Left Hand`"
                        @click="toggleLeftHand"
                    >
                        <span
                            class="bg-pianote text-white"
                            :class="leftHand ? 'text-white' : 'inverted text-pianote'"
                        >
                            <i
                                class="fal fa-hand-paper fa-flip-horizontal"
                                style="font-size:24px;"
                            ></i>
                        </span>
                    </button>
                </div>

                <div class="flex flex-column ph-1 flex-auto">
                    <button
                        class="btn"
                        style="width:50px;font-size:20px;"
                        :title="`${rightHand ? 'Disable' : 'Enable'} Right Hand`"
                        @click="toggleRightHand"
                    >
                        <span
                            class="bg-pianote text-white"
                            :class="rightHand ? 'text-white' : 'inverted text-pianote'"
                        >
                            <i
                                class="fal fa-hand-paper"
                                style="font-size:24px;"
                            ></i>
                        </span>
                    </button>
                </div>

                <div class="flex flex-column ph-1">
                    <div class="form-group mv-1">
                        <select
                            class="borderless body"
                            v-model="selectedIndex"
                            @change="updateSource"
                        >
                            <option
                                v-for="(bpm, i) in bpmOptions"
                                :key="`bpm-${bpm}`"
                                :value="i"
                            >
                                {{ bpm }} BPM
                            </option>
                        </select>
                        <label :class="brand">Tempo</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PianoBackingTracks',
    mixins: [ThemeClasses],
    props: {
        title: {
            type: String,
            default: () => '',
        },

        brand: {
            type: String,
            default: () => 'pianote',
        },

        backingTracks: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            baseUrl: 'https://d2vyvo0tyx8ig5.cloudfront.net/books/foundations/mp3s',
            leftHand: true,
            rightHand: true,
            selectedIndex: 0,
            currentSource: null,
            currentTime: 0,
            isPlaying: false,
            audioPlayer: null,
        };
    },
    computed: {
        bpmOptions() {
            return this.backingTracks.map(track => track.bpm);
        },
    },
    mounted() {
        this.audioPlayer = this.$refs.audioPlayer;

        this.updateSource();

        ['timeupdate', 'pause', 'play'].forEach((event) => {
            this.audioPlayer.addEventListener(event, () => {
                this.currentTime = this.audioPlayer.currentTime;
                this.isPlaying = !this.audioPlayer.paused;
            });
        });
    },
    methods: {
        getCurrentSource() {
            if (!this.leftHand && !this.rightHand) {
                return `${this.baseUrl}${this.backingTracks[this.selectedIndex].no_hands}`;
            }

            if (!this.leftHand) {
                return `${this.baseUrl}${this.backingTracks[this.selectedIndex].no_left_hand}`;
            }

            if (!this.rightHand) {
                return `${this.baseUrl}${this.backingTracks[this.selectedIndex].no_right_hand}`;
            }

            return `${this.baseUrl}${this.backingTracks[this.selectedIndex].complete}`;
        },

        setCurrentSource(source) {
            const { currentTime } = this;
            const percentageOffset = (currentTime / this.audioPlayer.duration);
            const vm = this;

            function seekBackToLocation() {
                vm.audioPlayer.currentTime = vm.audioPlayer.duration * percentageOffset;
                vm.audioPlayer.play();

                vm.audioPlayer.removeEventListener('loadeddata', seekBackToLocation);
            }

            if (this.isPlaying) {
                this.audioPlayer.addEventListener('loadeddata', seekBackToLocation);
            }

            this.currentSource = source;
        },

        updateSource() {
            this.setCurrentSource(
                this.getCurrentSource(),
            );
        },

        toggleLeftHand() {
            this.leftHand = !this.leftHand;

            this.updateSource();
        },

        toggleRightHand() {
            this.rightHand = !this.rightHand;

            this.updateSource();
        },
    },
};
</script>
