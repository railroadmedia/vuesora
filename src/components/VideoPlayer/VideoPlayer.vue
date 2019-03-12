<template>
    <div class="flex flex-column"
         data-vjs-player
         @mousemove="trackMousePosition">

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
                <div class="flex flex-row">
                    <player-progress :themeColor="themeColor"
                                     :currentProgress="currentProgress"
                                     :playerWidth="playerWidth"
                                     :currentMouseX="currentMouseX"
                                     :totalDuration="totalDuration"
                                     :mousedown="mousedown"
                                     @mousedown.native="mousedown = true"></player-progress>
                </div>

                <!--  BOTTOM ROW  -->
                <div class="flex flex-row">
                    <player-button @click.native="playPause"
                                   :themeColor="themeColor">
                        <i class="fas"
                           :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </player-button>

                    <div class="flex flex-column text-white body align-v-center flex-auto">
                        {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                    </div>

                    <div class="flex flex-column spacer"></div>

                    <player-volume :themeColor="themeColor"
                                   :currentVolume="currentVolume"
                                   @volumeChange="changeVolume"></player-volume>

                    <player-settings :themeColor="themeColor"></player-settings>

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
    import PlayerVolume from './_PlayerVolume';
    import PlayerSettings from './_PlayerSettings';

    export default {
        mixins: [ThemeClasses],
        name: 'video-player',
        components: {
            'player-button': PlayerButton,
            'player-progress': PlayerProgress,
            'player-volume': PlayerVolume,
            'player-settings': PlayerSettings,
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
                currentMouseX: 0,
                currentVolume: 1
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
                this.videojsInstance.play();
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

            changeVolume(payload){
                this.videojsInstance.volume(payload.volume / 100);
                this.currentVolume = this.videojsInstance.volume();
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
            playerWidth:{
                cache: false,
                get(){
                    return this.$refs.player ? this.$refs.player.clientWidth : 0;
                }
            },

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

            this.videojsInstance.on('durationchange', () => {
                this.totalDuration = this.videojsInstance.duration();
            });

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