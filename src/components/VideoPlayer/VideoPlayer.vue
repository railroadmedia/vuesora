<template>
    <div class="flex flex-column"
         data-vjs-player
         @mousemove="trackMousePosition">

        <transition name="grow-fade">
            <player-loading
                    v-if="loading && !isPlaying"
                    :themeColor="themeColor" />
        </transition>

        <video ref="player"
               playsinline
               crossorigin="anonymous"
               preload="auto">
        </video>

        <div v-if="playerReady"
             class="controls-wrap">
            <div class="controls flex flex-column noselect">
                <!--  TOP ROW  -->
                <div class="flex flex-row">
                    <player-button
                            @click.native="seek(currentTime - 10)"
                            :themeColor="themeColor"
                            data-cy="rewind-button">
                        <i class="fas fa-undo"></i>
                    </player-button>

                    <div class="flex flex-column spacer"></div>

                    <player-button
                            @click.native="seek(currentTime + 10)"
                            :themeColor="themeColor"
                            data-cy="fast-forward-button">
                        <i class="fas fa-redo"></i>
                    </player-button>
                </div>

                <!--  MIDDLE ROW  -->
                <div class="flex flex-row">
                    <player-progress
                            :themeColor="themeColor"
                            :currentProgress="currentProgress"
                            :playerWidth="playerWidth"
                            :currentMouseX="currentMouseX"
                            :totalDuration="totalDuration"
                            :mousedown="mousedown"
                            @mousedown.native="mousedown = true"
                            data-cy="progress-rail" />
                </div>

                <!--  BOTTOM ROW  -->
                <div class="flex flex-row">
                    <player-button
                            @click.native="playPause"
                            :themeColor="themeColor"
                            data-cy="play-pause-button">
                        <i class="fas"
                           :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </player-button>

                    <div class="flex flex-column text-white body align-v-center noselect flex-auto">
                        {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                    </div>

                    <div class="flex flex-column spacer"></div>

                    <player-volume
                            v-if="!isMobile"
                            :themeColor="themeColor"
                            :currentVolume="currentVolume"
                            @volumeChange="changeVolume" />

                    <player-button
                            :themeColor="themeColor"
                            @click.native.stop="toggleCaptionsDrawer">
                        <i class="fas fa-closed-captioning"></i>
                    </player-button>

                    <player-button
                            :themeColor="themeColor"
                            @click.native.stop="toggleSettingsDrawer">
                        <i class="fas fa-cog"></i>
                    </player-button>

                    <player-button
                            @click.native="fullscreen"
                            :themeColor="themeColor">
                        <i class="fas fa-expand"></i>
                    </player-button>
                </div>
            </div>
        </div>

        <div v-show="isMobileDrawerOpen"
             class="settings-mobile-overlay"
             @click="settingsDrawer = false"></div>

        <transition name="show-from-bottom">
            <player-settings
                    v-show="settingsDrawer"
                    :drawer="settingsDrawer"
                    :themeColor="themeColor"
                    :videojsInstance="videojsInstance"
                    :currentSource="currentSource"
                    :currentSourceIndex="currentSourceIndex"
                    :currentPlaybackRate="currentPlaybackRate"
                    :playbackQualities="playbackQualities"
                    @setQuality="setQuality"
                    @setRate="setRate" />
        </transition>

        <transition name="show-from-bottom">
            <player-captions
                    v-show="captionsDrawer"
                    :themeColor="themeColor"
                    :captions="captions" />
        </transition>
    </div>
</template>
<script>
    import videojs from 'video.js';
    import 'videojs-contrib-quality-levels';
    import { getNativeName } from 'iso-639-1';
    import PlayerUtils from './player-utils';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import PlayerButton from './_PlayerButton.vue';
    import PlayerProgress from './_PlayerProgress.vue';
    import PlayerVolume from './_PlayerVolume.vue';
    import PlayerSettings from './_PlayerSettings.vue';
    import PlayerLoading from './_PlayerLoading.vue';
    import PlayerCaptions from './_PlayerCaptions.vue';

    export default {
        mixins: [ThemeClasses],
        name: 'video-player',
        components: {
            'player-button': PlayerButton,
            'player-progress': PlayerProgress,
            'player-volume': PlayerVolume,
            'player-settings': PlayerSettings,
            'player-loading': PlayerLoading,
            'player-captions': PlayerCaptions,
        },
        props: {
            sources: {
                type: Array,
                default: () => []
            },

            hlsManifestUrl: {
                type: String,
                default: () => null
            },

            captions: {
                type: Array,
                default: () => []
            },
        },
        data() {
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
                captionsDrawer: false,
            }
        },
        computed: {
            playerWidth: {
                cache: false,
                get() {
                    return this.$refs.player ? this.$refs.player.clientWidth : 0;
                }
            },

            playbackQualities: {
                cache: false,
                get() {
                    if (this.hlsInstance != null && this.videojsInstance.qualityLevels().levels_) {
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

            currentProgress() {
                const progress = (this.currentTime / this.totalDuration) * 100;

                return isNaN(progress) ? 0 : progress;
            },

            currentSource: {
                cache: false,
                get() {
                    if (this.hlsInstance != null && this.hlsInstance.playlists.media_) {
                        return this.hlsInstance.playlists.media_.resolvedUri;
                    }

                    return this.videojsInstance ? this.videojsInstance.src() : '';
                }
            },

            currentSourceIndex: {
                cache: false,
                get() {
                    if (this.hlsInstance) {
                        return this.videojsInstance.qualityLevels().selectedIndex;
                    }

                    return this.playbackQualities.map(quality => quality.source).indexOf(this.currentSource);
                }
            },

            currentPlaybackRate: {
                cache: false,
                get() {
                    return this.videojsInstance ? this.videojsInstance.playbackRate() : 1;
                }
            },

            isMobile: () => PlayerUtils.isMobile().any,

            isSafari: () => PlayerUtils.isSafari(),

            isMobileDrawerOpen(){
                return (this.settingsDrawer || this.captionsDrawer) && this.isMobile;
            }
        },
        methods: {
            playPause() {
                if (this.isPlaying) {
                    this.videojsInstance.pause();
                } else {
                    this.videojsInstance.play();
                }
            },

            seek(time) {
                this.videojsInstance.currentTime(time);

                if (this.isPlaying) {
                    this.videojsInstance.play();
                }
            },

            fullscreen() {
                if (this.videojsInstance.isFullscreen()) {
                    this.videojsInstance.exitFullscreen();
                    this.videojsInstance.isFullscreen(false);
                } else {
                    this.videojsInstance.requestFullscreen();
                    this.videojsInstance.isFullscreen(true);
                }
            },

            changeVolume(payload) {
                this.videojsInstance.volume(payload.volume / 100);
                this.currentVolume = this.videojsInstance.volume();
            },

            parseTime: (time) => PlayerUtils.parseTime(time),

            trackMousePosition(event) {
                this.currentMouseX = PlayerUtils.getTimeRailMouseEventOffsetPercentage(
                    event,
                    this.$refs.player
                );
            },

            setQuality(payload) {
                const currentTime = this.videojsInstance.currentTime();
                const wasPlaying = this.isPlaying;

                if (this.hlsInstance != null) {
                    this.videojsInstance.qualityLevels().levels_.forEach((quality, index) => {
                        quality.enabled = index === payload.index;
                    });

                    this.videojsInstance.qualityLevels().selectedIndex_ = payload.index;
                    this.videojsInstance.qualityLevels().trigger({
                        type: 'change', selectedIndex: payload.index
                    });
                } else {
                    this.videojsInstance.src(this.sources[payload.index].file);
                }

                this.setDefaultPlaybackQualityWidth(this.playbackQualities[payload.index].width);
                if (wasPlaying) {
                    setTimeout(() => {
                        this.seek(currentTime);
                    }, 200);
                }
            },

            setRate(payload) {
                this.videojsInstance.playbackRate(payload.rate);
            },

            setDefaultPlaybackQualityWidth(width) {
                window.localStorage.setItem('vuesoraDefaultVideoQuality', width);
            },

            getDefaultPlaybackQualityIndex() {
                let widthToCheck = window.localStorage.getItem('vuesoraDefaultVideoQuality') || document.documentElement.clientWidth;
                let qualityIndexes = this.playbackQualities.map((quality, index) => {
                    if (quality.width >= widthToCheck) {
                        return index;
                    }
                });
                const closestIndex = qualityIndexes.filter(index => index != null)[0];

                // If we don't find an index, that probably means we're looking at a massive viewport,
                // Just take the highest quality
                return closestIndex || (this.playbackQualities.length - 1);
            },

            toggleSettingsDrawer() {
                this.captionsDrawer = false;
                this.settingsDrawer = !this.settingsDrawer;
                if (this.isMobile && this.settingsDrawer) document.body.classList.add('drawer-open');
                if (this.isMobile && !this.settingsDrawer) document.body.classList.remove('drawer-open');
            },

            toggleCaptionsDrawer() {
                this.enableCaptions();

                this.captionsDrawer = !this.captionsDrawer;
                this.settingsDrawer = false;
                if (this.isMobile && this.captionsDrawer) document.body.classList.add('drawer-open');
                if (this.isMobile && !this.captionsDrawer) document.body.classList.remove('drawer-open');
            },

            closeDrawers() {
                this.settingsDrawer = false;
                this.captionsDrawer = false;
                if (this.isMobile) document.body.classList.remove('drawer-open');
            },

            enableCaptions(payload) {
                const tracks = this.videojsInstance.remoteTextTracks();

                console.log(tracks);
                for(let i = 0; i < tracks.length; i++){
                    if(tracks[i].kind === 'captions'){
                        tracks[i].mode = 'showing';
                        tracks[i].default = true;
                    }
                }
            },
        },
        mounted() {
            const player = this.$refs.player;
            let source = [];

            if (this.hlsManifestUrl != null) {
                source.push({
                    src: this.hlsManifestUrl,
                    type: 'application/x-mpegURL',
                    overrideNative: !this.isSafari,
                });
            }

            if (this.sources.length > 0) {
                source.push({
                    src: this.sources[this.getDefaultPlaybackQualityIndex()].file,
                    type: 'video/mp4',
                });
            }

            this.loading = true;

            this.videojsInstance = videojs(player, {
                controls: false,
                children: [],
                responsive: false,
                inactivityTimeout: 5000,
                nativeAudioTracks: false,
                nativeVideoTracks: false,
                textTrackSettings: false,
                html5: {
                    hls: {
                        overrideNative: !this.isSafari,
                    },
                    nativeTextTracks: true,
                }
            });

            this.videojsInstance.src(source);

            this.videojsInstance.ready(() => {
                this.hlsInstance = this.videojsInstance.tech({IWillNotUseThisInPlugins: true}).hls;

                if (this.isSafari) {
                    this.videojsInstance.load();
                }

                this.captions.forEach(caption => {
                    this.videojsInstance.addRemoteTextTrack({
                        kind: 'captions',
                        label: getNativeName(caption.language),
                        language: caption.language,
                        src: caption.mp4,
                    }, false);
                });


                this.playerReady = true;
                this.$emit('playerReady');
            });

            this.videojsInstance.on('canplaythrough', () => {
                this.$emit('canplaythrough');

                setTimeout(() => {
                    this.loading = false;
                }, 500);
            });

            this.videojsInstance.on('loadeddata', () => {
                if (this.hlsInstance) {
                    this.setQuality({index: this.getDefaultPlaybackQualityIndex()});
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

                this.$emit('paused');
            });

            this.videojsInstance.on('waiting', () => {
                this.loading = true;
            });

            this.videojsInstance.on(['play', 'playing'], () => {
                this.isPlaying = true;
                this.loading = false;

                this.$emit('playing');
            });

            this.videojsInstance.on('timeupdate', () => {
                this.totalDuration = this.videojsInstance.duration();
                this.currentTime = this.videojsInstance.currentTime();
            });

            this.videojsInstance.on('userinactive', this.closeDrawers);

            document.addEventListener('click', this.closeDrawers);

            document.addEventListener('mouseup', () => {
                if (this.mousedown) {
                    const timeToSeekTo = this.totalDuration * (this.currentMouseX / 100);
                    this.seek(timeToSeekTo);
                }

                this.mousedown = false;
            });
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDrawers);
        }
    }
</script>