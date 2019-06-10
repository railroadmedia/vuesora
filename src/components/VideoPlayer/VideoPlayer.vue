<template>
    <div class="flex flex-column"
         ref="container"
         data-vjs-player
         @mousemove="trackMousePosition">

        <transition name="grow-fade">
            <div v-show="loading && !isPlaying"
                 class="player-overlay"
                 @click.stop.prevent>
                <!--<i class="fas fa-spinner fa-spin"></i>-->
                <loading-animation :themeColor="themeColor "/>
            </div>
        </transition>

        <transition name="grow-fade">
            <div v-show="!loading && !isPlaying"
                 class="player-overlay no-events">
                <div class="overlay-play rounded ba-white-3 flex-center shadows">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </transition>

        <transition name="grow-fade">
            <span v-show="currentPlaybackRate !== 1"
                  class="speed-indicator subheading pa-2 text-center text-white">
                {{ currentPlaybackRate }}x
                <i class="fas fa-hourglass"></i>
            </span>
        </transition>

        <transition name="grow-fade">
            <div v-show="isChromeCastConnected"
                 class="cast-dialog flex flex-center pa-3 text-center">
                <span style="font-size:72px;">
                    <i class="fab fa-chromecast"></i>
                </span>
                <h1 class="subheading text-white">
                    Video is playing on another device
                </h1>
            </div>
        </transition>

        <video ref="player"
               playsinline
               crossorigin="anonymous"
               :poster="poster"
               preload="auto">
        </video>

        <div class="controls-wrap"
             ref="controls"
             @click.stop="playPauseViaControlWrap">
            <div class="controls flex flex-column noselect">
                <!--  TOP ROW  -->
                <div class="flex flex-row">
                    <player-button
                            @click.stop.native="seek(currentTime - 10)"
                            :themeColor="themeColor"
                            title="Rewind 10 Seconds (Left Arrow)"
                            data-cy="rewind-button">
                        <i class="fas fa-undo"></i>
                    </player-button>

                    <div class="flex flex-column spacer"></div>

                    <player-button
                            @click.stop.native="seek(currentTime + 10)"
                            :themeColor="themeColor"
                            title="Forward 10 Seconds (Right Arrow)"
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
                            @mousedown.stop.native="mousedown = true"
                            data-cy="progress-rail" />
                </div>

                <!--  BOTTOM ROW  -->
                <div class="flex flex-row">
                    <player-button
                            @click.stop.native="playPause"
                            :themeColor="themeColor"
                            :title="isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'"
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

                    <transition name="grow-fade">
                        <player-button
                                v-if="isChromeCastSupported"
                                :themeColor="themeColor"
                                title="Chromecast"
                                @click.stop.native="enableChromeCast"
                                :active="this.chromeCast && this.chromeCast.Connected">
                            <i class="fab fa-chromecast"></i>
                        </player-button>
                    </transition>

                    <transition name="grow-fade">
                        <player-button
                                v-if="isAirplaySupported"
                                :themeColor="themeColor"
                                title="Apple Airplay"
                                @click.stop.native="enableAirplay"
                                :active="isAirplayConnected">
                            <i class="fab fa-apple"></i>
                        </player-button>
                    </transition>

                    <player-button
                            v-if="captions.length > 0"
                            :themeColor="themeColor"
                            @click.stop.native="toggleCaptionsDrawer"
                            :active="currentCaptions != null">
                        <i class="fas fa-closed-captioning"></i>
                    </player-button>

                    <player-button
                            :themeColor="themeColor"
                            title="Settings"
                            @click.stop.native="toggleSettingsDrawer"
                            :disabled="isChromeCastConnected">
                        <i class="fas fa-cog"></i>
                    </player-button>

                    <player-button
                            @click.stop.native="fullscreen"
                            :themeColor="themeColor"
                            title="Fullscreen (F)"
                            :disabled="isChromeCastConnected">
                        <i class="fas fa-expand"></i>
                    </player-button>
                </div>
            </div>
        </div>

        <div v-show="isMobileDrawerOpen"
             class="settings-mobile-overlay"
             @click="settingsDrawer = false"></div>

        <transition :name="isMobile ? 'show-from-bottom' : 'grow-fade'">
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

        <transition :name="isMobile ? 'show-from-bottom' : 'grow-fade'">
            <player-captions
                    v-show="captionsDrawer"
                    :themeColor="themeColor"
                    :captionOptions="captionOptions"
                    :currentCaptions="currentCaptions"
                    @captionsSelected="enableCaptions"/>
        </transition>
    </div>
</template>
<script>
    import videojs from 'video.js';
    import 'videojs-contrib-quality-levels';
    import ISO6391 from '../../../node_modules/iso-639-1';
    import PlayerUtils from './player-utils';
    import ChromeCastPlugin from './chromecast';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import PlayerButton from './_PlayerButton.vue';
    import PlayerProgress from './_PlayerProgress.vue';
    import PlayerVolume from './_PlayerVolume.vue';
    import PlayerSettings from './_PlayerSettings.vue';
    import PlayerLoading from './_PlayerLoading.vue';
    import PlayerCaptions from './_PlayerCaptions.vue';
    import EventHandlers from './event-handlers';
    import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

    export default {
        mixins: [ThemeClasses, EventHandlers],
        name: 'video-player',
        components: {
            'player-button': PlayerButton,
            'player-progress': PlayerProgress,
            'player-volume': PlayerVolume,
            'player-settings': PlayerSettings,
            'player-loading': PlayerLoading,
            'player-captions': PlayerCaptions,
            'loading-animation': LoadingAnimation,
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

            poster: {
                type: String,
                default: () => null
            },
        },
        data() {
            return {
                loading: false,
                videojsInstance: null,
                playerReady: false,
                hlsInstance: null,
                userActive: true,
                isPlaying: false,
                currentTime: 0,
                totalDuration: 0,
                mousedown: false,
                currentMouseX: 0,
                currentVolume: 1,
                settingsDrawer: false,
                captionsDrawer: false,
                currentCaptions: null,
                chromeCast: null,
                isChromeCastSupported: false,
                isChromeCastConnected: false,
                isAirplaySupported: false,
                isAirplayConnected: false,
                performanceNow: 0,
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
                                enabled: source.enabled,
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

            captionOptions: {
                cache: false,
                get() {
                    const tracks = this.videojsInstance ? this.videojsInstance.remoteTextTracks() : [];
                    const tracks_map = [];

                    for(let i = 0; i < tracks.length; i++){

                        if(tracks[i].kind === 'captions'){
                            tracks_map.push({
                                language: tracks[i].language,
                                label: ISO6391.getNativeName(tracks[i].language),
                            });
                        }
                    }

                    return tracks_map;
                }
            },

            canPlayPause(){
                if(!this.isPlaying){
                    return true;
                }

                return this.userActive;
            },

            isMobile: () => PlayerUtils.isMobile().any,

            isSafari: () => PlayerUtils.isSafari(),

            isMobileDrawerOpen(){
                return (this.settingsDrawer || this.captionsDrawer) && this.isMobile;
            }
        },
        methods: {
            playPause() {
                if(this.chromeCast && this.chromeCast.Connected){
                    this.chromeCast.playOrPause();
                } else {
                    if (this.isPlaying) {
                        this.videojsInstance.pause();
                    } else {
                        this.videojsInstance.play();
                    }
                }
            },

            playPauseViaControlWrap(){
                if(!this.canPlayPause){
                    return;
                }

                this.playPause();
            },

            seek(time) {
                time = time < 0 ? 0 : time;
                this.currentTime = time;
                this.videojsInstance.pause();

                if(this.isChromeCastConnected){
                    this.chromeCast.seek(time);
                } else {
                    this.videojsInstance.currentTime(time);

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

                if(payload.volume > 0){
                    localStorage.setItem('playerVolume', payload.volume);
                }

                if(this.isChromeCastConnected){
                    this.chromeCast.volume(payload.volume);
                }
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

                if (this.hlsInstance != null) {
                    if(payload.index === 'auto'){
                        this.videojsInstance.qualityLevels().levels_.forEach(quality => {
                            quality.enabled = true;
                        });
                    } else {
                        this.videojsInstance.qualityLevels().levels_.forEach((quality, index) => {
                            quality.enabled = index === payload.index;
                        });

                        this.videojsInstance.qualityLevels().selectedIndex_ = payload.index;
                        this.videojsInstance.qualityLevels().trigger({
                            type: 'change', selectedIndex: payload.index
                        });
                    }

                } else {
                    this.videojsInstance.src(this.sources[payload.index].file);
                    this.setDefaultPlaybackQualityWidth(this.playbackQualities[payload.index].width);
                }

                setTimeout(() => {
                    this.seek(currentTime);
                }, 200);
            },

            setRate(payload) {
                if(payload.rate >= 0 && payload.rate <= 2){
                    console.log(payload);

                    this.videojsInstance.playbackRate(payload.rate);
                }
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

                return closestIndex || 0;
            },

            toggleSettingsDrawer() {
                this.captionsDrawer = false;
                this.settingsDrawer = !this.settingsDrawer;
                if (this.isMobile && this.settingsDrawer) document.body.classList.add('drawer-open');
                if (this.isMobile && !this.settingsDrawer) document.body.classList.remove('drawer-open');
            },

            toggleCaptionsDrawer() {
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
                let foundCaptions;

                for(let i = 0; i < tracks.length; i++){
                    if(tracks[i].kind === 'captions' && tracks[i].language === payload.language){
                        tracks[i].mode = 'showing';
                        foundCaptions = tracks[i].language;
                    } else {
                        tracks[i].mode = 'disabled';
                    }
                }
                this.currentCaptions = foundCaptions || null;

                if(this.isChromeCastConnected){
                    this.chromeCast.changeSubtitle(foundCaptions ? 0 : null);
                }
            },

            enableChromeCast(){
                this.chromeCast.cast({
                    content: this.currentSource,
                    poster: this.poster,
                    title: 'Test Title',
                    description: 'Test Description',
                    subtitles: this.captions.map(caption => ({
                        active: false,
                        srclang: caption.language,
                        src: caption.url,
                    })),
                    time: this.currentTime,
                    volume: this.currentVolume,
                    muted: false,
                    paused: false,
                });
            },

            enableAirplay(){
                this.$refs.player.webkitShowPlaybackTargetPicker();
            },

            keyboardControlEventHandler(event){
                if(this.keyboardEventHandlers[event.code]){
                    event.stopPropagation();
                    event.preventDefault();

                    this.keyboardEventHandlers[event.code]();
                }
            },
        },
        mounted() {
            const player = this.$refs.player;
            let source = [];

            // Add HLS manifest URL
            if (this.hlsManifestUrl != null) {
                source.push({
                    src: this.hlsManifestUrl,
                    type: 'application/x-mpegURL',
                    overrideNative: !this.isSafari,
                });
            }

            // Add MP4 Sources
            if (this.sources.length > 0) {
                source.push({
                    src: this.sources[this.getDefaultPlaybackQualityIndex()].file,
                    type: 'video/mp4',
                });
            }

            this.loading = true;

            // Initialize Player
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
                        overrideNative: false,
                    },
                    nativeTextTracks: true,
                }
            });

            this.videojsInstance.src(source);

            // On Player Ready
            this.videojsInstance.on('ready', () => {
                this.hlsInstance = this.videojsInstance.tech({IWillNotUseThisInPlugins: true}).hls;

                this.captions.forEach(caption => {
                    this.videojsInstance.addRemoteTextTrack({
                        kind: 'captions',
                        label: ISO6391.getNativeName(caption.language),
                        mode: 'disabled',
                        language: caption.language,
                        src: caption.url,
                    }, false);
                });

                // This fixes captions for Airplay
                setTimeout(() => {
                    this.enableCaptions({});
                }, 2000);

                this.playerReady = true;
                this.$emit('playerReady');

                Object.keys(this.videoJsEventHandlers).forEach(event => {
                    this.videojsInstance.on(event, this.videoJsEventHandlers[event]);
                });

                // Add Keyboard Events on video focus
                this.$refs.container.addEventListener('focus', () => {
                    document.addEventListener('keydown', this.keyboardControlEventHandler);
                });

                // Remove keyboard events on video blur
                this.$refs.container.addEventListener('blur', () => {
                    document.removeEventListener('keydown', this.keyboardControlEventHandler);
                });

                if(window.localStorage.getItem('playerVolume') != null){
                    this.changeVolume({
                        volume: Number(window.localStorage.getItem('playerVolume'))
                    });
                }

                this.$refs.container.focus();
            });


            // Close drawers on any document click
            document.addEventListener('click', this.closeDrawers);

            // Mouse up events
            document.addEventListener('mouseup', () => {
                if (this.mousedown) {
                    const timeToSeekTo = this.totalDuration * (this.currentMouseX / 100);
                    this.seek(timeToSeekTo);
                }

                this.mousedown = false;
            });


            // Initialize the ChromeCast plugin and it's event handlers
            this.chromeCast = new ChromeCastPlugin();

            this.chromeCast.on('available', () => {
                this.isChromeCastSupported = true;

                // Add all chromecast event handlers
                Object.keys(this.chromeCastEventHandlers).forEach(event => {
                    this.chromeCast.on(event, this.chromeCastEventHandlers[event]);
                });

                // Immediately disconnect ChromeCast if the user refreshes/leaves the page
                window.addEventListener('unload', () => {
                    this.chromeCast.disconnect();
                });
            });

            // Initialize Apple Airplay and create an event listener for playback change
            if(window.WebKitPlaybackTargetAvailabilityEvent){
                this.$refs.player.addEventListener('webkitplaybacktargetavailabilitychanged', event => {
                    if(event.availability === 'available'){
                        this.isAirplaySupported = true;
                    }
                });
            }

            this.$refs.player.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', event => {
                this.isAirplayConnected = !this.isAirplayConnected;
            });
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDrawers);
        }
    }
</script>