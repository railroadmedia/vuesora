<template>
    <div class="flex flex-column"
         data-vjs-player
         @mousemove="trackMousePosition">

        <video ref="player"></video>

        <div class="controls-wrap">
            <div class="controls flex flex-column noselect">
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

                    <div class="flex flex-column text-white body align-v-center noselect flex-auto">
                        {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                    </div>

                    <div class="flex flex-column spacer"></div>

                    <player-volume :themeColor="themeColor"
                                   :currentVolume="currentVolume"
                                   @volumeChange="changeVolume"></player-volume>

                    <player-settings :themeColor="themeColor"
                                     :videojsInstance="videojsInstance"
                                     :currentSource="currentSource"
                                     :currentPlaybackRate="currentPlaybackRate"
                                     :playbackQualities="playbackQualities"
                                     @setQuality="setQuality"
                                     @setRate="setRate"></player-settings>

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
            },
            hlsManifestUrl: {
                type: String,
                default: () => null
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
        computed: {
            playerWidth:{
                cache: false,
                get(){
                    return this.$refs.player ? this.$refs.player.clientWidth : 0;
                }
            },

            playbackQualities(){
                return this.sources.map(source => {
                    return {
                        label: source.height === 2160 ? '4k' : source.height + 'p',
                        source: source.file
                    }
                });
            },

            currentProgress(){
                const progress = (this.currentTime / this.totalDuration) * 100;

                return isNaN(progress) ? 0 : progress;
            },

            currentSource: {
                cache: false,
                get(){
                    return this.videojsInstance ? this.videojsInstance.src() : '';
                }
            },

            currentPlaybackRate: {
                cache: false,
                get(){
                    return this.videojsInstance ? this.videojsInstance.playbackRate() : 1;
                }
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

            setQuality(payload){
                const currentTime = this.videojsInstance.currentTime();

                this.videojsInstance.src(payload.source);

                setTimeout(() => {
                    this.seek(currentTime);
                }, 200);
            },

            setRate(payload){
                this.videojsInstance.playbackRate(payload.rate);
            },

            getDefaultPlaybackQuality(){
                // Pull the first source that matches the users screen size
                const closestQuality = this.sources.filter(source =>
                    source.width > document.documentElement.clientWidth
                );

                return closestQuality[0] ? closestQuality[0].file : this.sources[0].file;
            }
        },
        mounted(){
            const player = this.$refs.player;

            this.videojsInstance = videojs(player, {
                controls: false,
                children: [],
                responsive: false,
            });

            // this.videojsInstance.src(this.getDefaultPlaybackQuality());
            this.videojsInstance.src(this.hlsManifestUrl);

            this.videojsInstance.ready(() => {
                console.log(this.videojsInstance.tech().hls);
            });

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

            this.videojsInstance.on('userinactive', () => {
                this.$emit('userinactive');
            });

            document.addEventListener('mouseup', () => {
                if(this.mousedown){
                    const timeToSeekTo = this.totalDuration * (this.currentMouseX / 100);
                    this.seek(timeToSeekTo);
                }

                this.mousedown = false;
            });

            this.getDefaultPlaybackQuality();
        }
    }
</script>