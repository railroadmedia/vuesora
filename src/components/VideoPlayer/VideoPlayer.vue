<template>
    <div class="flex flex-column"
         data-vjs-player
         @mousemove="trackMousePosition">

        <transition name="grow-fade">
            <player-loading v-if="loading && !isPlaying"
                            :themeColor="themeColor"></player-loading>
        </transition>

        <video ref="player" playsinline preload="auto"></video>

        <div class="controls-wrap" v-if="playerReady">
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

                    <player-volume v-if="!isMobile"
                                   :themeColor="themeColor"
                                   :currentVolume="currentVolume"
                                   @volumeChange="changeVolume"></player-volume>

                    <player-button :themeColor="themeColor"
                                   @click.native.stop="toggleDrawer">
                        <i class="fas fa-cog"></i>
                    </player-button>

                    <player-button @click.native="fullscreen"
                                   :themeColor="themeColor">
                        <i class="fas fa-expand"></i>
                    </player-button>
                </div>
            </div>
        </div>

        <div v-if="settingsDrawer && isMobile"
             class="settings-mobile-overlay"
             @click="settingsDrawer = false"></div>
        <transition name="show-from-bottom">
            <player-settings v-show="settingsDrawer"
                             :drawer="settingsDrawer"
                             :themeColor="themeColor"
                             :videojsInstance="videojsInstance"
                             :currentSource="currentSource"
                             :currentSourceIndex="currentSourceIndex"
                             :currentPlaybackRate="currentPlaybackRate"
                             :playbackQualities="playbackQualities"
                             @setQuality="setQuality"
                             @setRate="setRate"></player-settings>
        </transition>

    </div>
</template>
<script>
    import videojs from 'video.js';
    import PlayerUtils from './player-utils';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import PlayerButton from './_PlayerButton.vue';
    import PlayerProgress from './_PlayerProgress.vue';
    import PlayerVolume from './_PlayerVolume.vue';
    import PlayerSettings from './_PlayerSettings.vue';
    import PlayerLoading from './_PlayerLoading.vue';
    import 'videojs-contrib-quality-levels';

    export default {
        mixins: [ThemeClasses],
        name: 'video-player',
        components: {
            'player-button': PlayerButton,
            'player-progress': PlayerProgress,
            'player-volume': PlayerVolume,
            'player-settings': PlayerSettings,
            'player-loading': PlayerLoading,
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
                loading: false,
                videojsInstance: null,
                playerReady: false,
                hlsInstance: null,
                isPlaying: false,
                currentTime: 0,
                totalDuration: 0,
                mousedown: false,
                currentMouseX: 0,
                currentVolume: 1,
                settingsDrawer: false,
            }
        },
        computed: {
            playerWidth:{
                cache: false,
                get(){
                    return this.$refs.player ? this.$refs.player.clientWidth : 0;
                }
            },

            playbackQualities: {
                cache: false,
                get(){
                    if(this.hlsInstance != null && this.videojsInstance.qualityLevels().levels_){
                        return this.videojsInstance.qualityLevels().levels_.map(source => {
                            return {
                                label: PlayerUtils.getQualityLabelByHeight(source.height),
                                source: source.id,
                                width: source.width,
                                height: source.height,
                            }
                        });
                    }

                    return this.sources.map(source => {
                        return {
                            label: PlayerUtils.getQualityLabelByHeight(source.height),
                            source: source.file,
                            width: source.width,
                            height: source.height,
                        }
                    });
                },
            },

            currentProgress(){
                const progress = (this.currentTime / this.totalDuration) * 100;

                return isNaN(progress) ? 0 : progress;
            },

            currentSource: {
                cache: false,
                get(){
                    if(this.hlsInstance != null && this.hlsInstance.playlists.media_){
                        return this.hlsInstance.playlists.media_.resolvedUri;
                    }

                    return this.videojsInstance ? this.videojsInstance.src() : '';
                }
            },

            currentSourceIndex: {
                cache: false,
                get(){
                    if(this.hlsInstance){
                        return this.videojsInstance.qualityLevels().selectedIndex;
                    }

                    return this.playbackQualities.map(quality => quality.source).indexOf(this.currentSource);
                }
            },

            currentPlaybackRate: {
                cache: false,
                get(){
                    return this.videojsInstance ? this.videojsInstance.playbackRate() : 1;
                }
            },

            dontUseHls(){
                return typeof MediaSource === 'undefined' || this.hlsManifestUrl == null;
            },

            isMobile:() => PlayerUtils.isMobile().any,

            isSafari:() => PlayerUtils.isSafari()
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
                const wasPlaying = this.isPlaying;

                if(this.hlsInstance != null){
                    this.videojsInstance.qualityLevels().levels_.forEach((quality, index) => {
                        quality.enabled = index === payload.index;
                    });

                    this.videojsInstance.qualityLevels().selectedIndex_ = payload.index;
                    this.videojsInstance.qualityLevels().trigger({
                        type: 'change', selectedIndex: payload.index
                    });
                }
                else {
                    this.videojsInstance.src(this.sources[payload.index].file);
                }

                this.setDefaultPlaybackQualityWidth(this.playbackQualities[payload.index].width);
                if(wasPlaying){
                    setTimeout(() => {
                        this.seek(currentTime);
                    }, 200);
                }
            },

            setRate(payload){
                this.videojsInstance.playbackRate(payload.rate);
            },

            setDefaultPlaybackQualityWidth(width){
                window.localStorage.setItem('vuesoraDefaultVideoQuality', width);
            },

            getDefaultPlaybackQualityIndex(){
                let widthToCheck = window.localStorage.getItem('vuesoraDefaultVideoQuality') || document.documentElement.clientWidth;
                let qualityIndexes = this.playbackQualities.map((quality, index) => {
                    if(quality.width >= widthToCheck){
                        return index;
                    }
                });
                const closestIndex = qualityIndexes.filter(index => index != null)[0];

                // If we don't find an index, that probably means we're looking at a massive viewport,
                // Just take the highest quality
                return closestIndex || (this.playbackQualities.length - 1);
            },

            toggleDrawer(){
                this.settingsDrawer = !this.settingsDrawer;
                if(this.isMobile && this.settingsDrawer) document.body.classList.add('drawer-open');
                if(this.isMobile && !this.settingsDrawer) document.body.classList.remove('drawer-open');
            },

            closeDrawer(){
                this.settingsDrawer = false;
                if(this.isMobile) document.body.classList.remove('drawer-open');
            },
        },
        mounted(){
            const player = this.$refs.player;
            let source = [
                {
                    src: this.hlsManifestUrl,
                    type: 'application/x-mpegURL',
                    overrideNative: !this.isSafari,
                },
                {
                    src: this.sources[this.getDefaultPlaybackQualityIndex()].file,
                    type: 'video/mp4',
                }
            ];

            // if(typeof MediaSource === 'undefined' || this.hlsManifestUrl == null){
            //     source = this.sources[this.getDefaultPlaybackQualityIndex()].file;
            // }
            // else {
            //     source = {
            //         src: this.hlsManifestUrl,
            //         overrideNative: !this.isSafari,
            //     };
            // }

            this.loading  = true;

            this.videojsInstance = videojs(player, {
                controls: false,
                children: [],
                responsive: false,
                inactivityTimeout: 5000,
                nativeAudioTracks: false,
                nativeVideoTracks: false,
                html5: {
                    hls: {
                        overrideNative: !this.isSafari,
                    }
                }
            });

            this.videojsInstance.src(source);

            this.videojsInstance.ready(() => {
                // if(!this.dontUseHls) {
                    this.hlsInstance = this.videojsInstance.tech({ IWillNotUseThisInPlugins: true }).hls;
                // }

                // alert(this.videojsInstance.readyState());

                if(this.isSafari){
                    this.videojsInstance.load();
                }

                // if(PlayerUtils.isMobile().apple){
                //     this.videojsInstance.load();
                // }

                this.playerReady = true;
            });

            this.videojsInstance.on('canplaythrough', () => {
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            });

            this.videojsInstance.on('loadeddata', () => {
                if(this.hlsInstance){
                    this.setQuality({ index: this.getDefaultPlaybackQualityIndex() });
                }

                setTimeout(() => {
                    this.loading = false;
                }, 500);
            });

            this.videojsInstance.on('durationchange', () => {
                this.totalDuration = this.videojsInstance.duration();
            });

            this.videojsInstance.on(['waiting', 'pause'], () => {
                this.isPlaying = false;
            });

            this.videojsInstance.on('waiting', () => {
                this.loading = true;
            });

            this.videojsInstance.on(['play', 'playing'], () => {
                this.isPlaying = true;
                this.loading = false;
            });

            this.videojsInstance.on('timeupdate', () => {
                this.totalDuration = this.videojsInstance.duration();
                this.currentTime = this.videojsInstance.currentTime();
            });

            this.videojsInstance.on('error', event => {
                alert(event.type);
            });

            this.videojsInstance.on('userinactive', this.closeDrawer);

            document.addEventListener('click', this.closeDrawer);

            document.addEventListener('mouseup', () => {
                if(this.mousedown){
                    const timeToSeekTo = this.totalDuration * (this.currentMouseX / 100);
                    this.seek(timeToSeekTo);
                }

                this.mousedown = false;
            });
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDrawer);
        }
    }
</script>