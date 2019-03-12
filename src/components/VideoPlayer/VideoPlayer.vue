<template>
    <div class="flex flex-column" data-vjs-player @mousemove="trackMousePosition">

        <video ref="player"></video>

        <div class="controls-wrap">
            <div class="controls flex flex-column">
                <!--  TOP ROW  -->
                <div class="flex flex-row">
                    <player-button @click.native="seek(currentTime - 10)"
                                   :themeColor="themeColor">
                        <i class="fas fa-undo"></i>
                    </player-button>

                    <div class="flex flex-column spacer"></div>

                    <player-button @click.native="seek(currentTime + 10)"
                                   :themeColor="themeColor">
                        <i class="fas fa-redo"></i>
                    </player-button>
                </div>

                <!--  MIDDLE ROW  -->
                <player-progress :themeColor="themeColor"
                                 :currentProgress="currentProgress"
                                 :currentMouseX="currentMouseX"
                                 :mousedown="mousedown"
                                 @mousedown.native="mousedown = true"></player-progress>

                <!--  BOTTOM ROW  -->
                <div class="flex flex-row">
                    <player-button @click.native="playPause"
                                   :themeColor="themeColor">
                        <i class="fas"
                           :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </player-button>

                    <div class="flex flex-column text-white body align-v-center">
                        {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                    </div>

                    <div class="flex flex-column spacer"></div>

                    <player-button :themeColor="themeColor">
                        <i class="fas fa-volume"></i>
                    </player-button>

                    <player-button :themeColor="themeColor">
                        <i class="fas fa-cog"></i>
                    </player-button>

                    <player-button @click.native="fullscreen"
                                   :themeColor="themeColor">
                        <i class="fas fa-expand"></i>
                    </player-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import videojs from 'video.js';
    import PlayerUtils from './player-utils';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import PlayerButton from './_PlayerButton';
    import PlayerProgress from './_PlayerProgress';

    export default {
        mixins: [ThemeClasses],
        name: 'video-player',
        components: {
            'player-button': PlayerButton,
            'player-progress': PlayerProgress,
        },
        props: {
            sources: {
                type: Array,
                default: () => []
            }
        },
        data(){
            return {
                videojsInstance: null,
                isPlaying: false,
                currentTime: 0,
                totalDuration: 0,
                mousedown: false,
                currentMouseX: 0
            }
        },
        methods: {
            playPause(){
                if(this.isPlaying){
                    this.videojsInstance.pause();
                }
                else {
                    this.videojsInstance.play();
                }
            },

            seek(time){
                this.videojsInstance.currentTime(time);
            },

            fullscreen(){
                if(this.videojsInstance.isFullscreen()){
                    this.videojsInstance.exitFullscreen();
                    this.videojsInstance.isFullscreen(false);
                }
                else {
                    this.videojsInstance.requestFullscreen();
                    this.videojsInstance.isFullscreen(true);
                }
            },

            parseTime: (time) => PlayerUtils.parseTime(time),

            trackMousePosition(event){
                this.currentMouseX = PlayerUtils.getTimeRailMouseEventOffsetPercentage(
                    event,
                    this.$refs.player
                );
            },
        },
        computed: {
            currentProgress(){
                const progress = (this.currentTime / this.totalDuration) * 100;

                return isNaN(progress) ? 0 : progress;
            }
        },
        mounted(){
            const player = this.$refs.player;

            this.videojsInstance = videojs(player, {
                controls: false,
                children: [],
                responsive: false,
                aspectRatio: '16:9'
            });

            this.videojsInstance.src(this.sources[0].file);

            this.videojsInstance.on(['waiting', 'pause'], () => {
                this.isPlaying = false;
            });

            this.videojsInstance.on(['play', 'playing'], () => {
                this.isPlaying = true;
            });

            this.videojsInstance.on('timeupdate', () => {
                this.totalDuration = this.videojsInstance.duration();
                this.currentTime = this.videojsInstance.currentTime();
            });

            document.addEventListener('mouseup', () => {
                if(this.mousedown){
                    const timeToSeekTo = this.totalDuration * (this.currentMouseX / 100);
                    this.seek(timeToSeekTo);
                }

                this.mousedown = false;
            });
        }
    }
</script>