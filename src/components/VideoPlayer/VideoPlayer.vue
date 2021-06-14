<template>
    <div>
        <div
            ref="videoWrap"
            class="video-wrap"
            :class="{'picture-in-picture': isPipEnabled}"
        >
            <div class="widescreen bg-black">
                <div
                    ref="container"
                    class="flex flex-column video-player"
                    :class="{'user-active': userActive || !isPlaying}"
                    @contextmenu.stop.prevent="toggleContextMenu"
                    @mousemove="trackMousePosition"
                    @touchmove="trackMousePosition"
                >
                    <!--                    <transition name="grow-fade">-->
                    <!--                        <PlayerStats-->
                    <!--                            v-if="playerStats"-->
                    <!--                            v-show="dialogs.stats"-->
                    <!--                            :player-stats="playerStats"-->
                    <!--                            @close="closeAllDialogs"-->
                    <!--                        />-->
                    <!--                    </transition>-->

                    <transition name="grow-fade">
                        <PlayerShortcuts
                            v-show="dialogs.keyboardShortcuts"
                            @close="closeAllDialogs"
                        />
                    </transition>

                    <transition name="grow-fade">
                        <PlayerError
                            v-if="playerError"
                            :error-code="playerErrorCode"
                        />
                    </transition>

                    <transition name="fade">
                        <span
                            v-show="currentPlaybackRate !== 1"
                            class="rate-indicator title text-white pa-1"
                        >
                            {{ currentPlaybackRate }}x
                        </span>
                    </transition>

                    <div
                        v-show="contextMenu"
                        ref="contextMenu"
                        class="context-menu bg-grey-5 pointer text-white shadow overflow"
                        :style="contextMenuPosition"
                        @click.stop.prevent
                    >
                        <ul class="list-style-none tiny dense font-bold">
                            <li
                                v-if="!isMobile && useKeyboard"
                                class="pa-1 hover-bg-grey-4"
                                @click="openDialog('keyboardShortcuts')"
                            >
                                {{ dialogs.keyboardShortcuts ? 'Hide' : 'Show' }} Keyboard Shortcuts
                            </li>
                            <!--                            <li-->
                            <!--                                class="pa-1 hover-bg-grey-4"-->
                            <!--                                @click="openDialog('stats')"-->
                            <!--                            >-->
                            <!--                                {{ dialogs.stats ? 'Hide' : 'Show' }} Player Stats-->
                            <!--                            </li>-->
                            <li
                                v-if="!isMobile"
                                class="pa-1 hover-bg-grey-4"
                                @click="togglePip"
                            >
                                {{ isPipEnabled || isExperimentalPictureInPictureEnabled
                                    ? 'Disable' : 'Enable' }} Picture in Picture
                            </li>
                        </ul>
                    </div>

                    <transition name="grow-fade">
                        <div
                            v-show="loading && !isPlaying"
                            class="player-overlay"
                            @click.stop.prevent
                        >
                            <LoadingAnimation :theme-color="themeColor " />
                        </div>
                    </transition>

                    <transition name="fade">
                        <div
                            v-show="isChromeCastConnected"
                            class="cast-dialog flex flex-center pa-3 text-center text-white"
                        >
                            <span style="font-size:72px;">
                                <i class="fab fa-chromecast"></i>
                            </span>
                            <h1 class="subheading">
                                Video is playing on another device
                            </h1>
                        </div>
                    </transition>

                    <video
                        ref="player"
                        playsinline
                        preload="metadata"
                        :poster="poster"
                    >

                        <track v-if="captions" :src="captions" label="English" kind="subtitles" srclang="en" default>

                    </video>

                    <div
                        ref="controls"
                        class="controls-wrap"
                        @dblclick.stop.prevent="fullscreen"
                        @click.stop="playPauseViaControlWrap"
                    >
                        <transition name="fast-fade">
                            <div
                                v-show="isTransitioning"
                                class="player-overlay big-play-button pointer"
                            >
                                <div class="overlay-play rounded flex-center shadows">
                                    <i
                                        class="fas"
                                        :class="isPlaying ? 'fa-pause' : 'fa-play'"
                                    ></i>
                                </div>
                            </div>
                        </transition>

                        <div class="top-controls">
                            <div class="flex flex-row align-h-right">
                                <transition name="grow-fade">
                                    <PlayerButton
                                        v-if="isChromeCastSupported && controls.chromecast && !isPipEnabled"
                                        :theme-color="themeColor"
                                        title="Chromecast"
                                        :active="chromeCast && chromeCast.Connected"
                                        @click.stop.native="enableChromeCast"
                                    >
                                        <i class="fab fa-chromecast"></i>
                                    </PlayerButton>
                                </transition>

                                <transition name="grow-fade">
                                    <PlayerButton
                                        v-if="isAirplaySupported && controls.airplay && !isPipEnabled"
                                        :theme-color="themeColor"
                                        title="Apple Airplay"
                                        :active="isAirplayConnected"
                                        @click.stop.native="enableAirplay"
                                    >
                                        <i class="icon-airplay"></i>
                                    </PlayerButton>
                                </transition>

                                <transition name="grow-fade">
                                    <PlayerButton
                                        v-show="isPipEnabled"
                                        :theme-color="themeColor"
                                        title="Disable PIP"
                                        @click.stop.native="isPipEnabled = false"
                                    >
                                        <i class="fas fa-times"></i>
                                    </PlayerButton>
                                </transition>
                            </div>
                        </div>

                        <div class="player-controls flex flex-column noselect">
                            <!--  TOP ROW  -->
                            <div
                                class="flex flex-row"
                                style="min-height:50px;"
                                @dblclick.stop.prevent="() => false"
                                @click.stop.prevent="() => false"
                            >
                                <PlayerButton
                                    v-if="controls.backward"
                                    :theme-color="themeColor"
                                    title="Rewind 5 Seconds (Left Arrow)"
                                    data-cy="rewind-button"
                                    @click.stop.native="seek(currentTime - 5)"
                                >
                                    <i class="fas fa-undo"></i>
                                </PlayerButton>

                                <div class="flex flex-column spacer"></div>

                                <PlayerButton
                                    v-if="controls.forward"
                                    :theme-color="themeColor"
                                    title="Forward 5 Seconds (Right Arrow)"
                                    data-cy="fast-forward-button"
                                    @click.stop.native="seek(currentTime + 5)"
                                >
                                    <i class="fas fa-redo"></i>
                                </PlayerButton>
                            </div>

                            <!--  MIDDLE ROW  -->
                            <div
                                v-if="controls.progress"
                                class="flex flex-row"
                                @dblclick.stop.prevent="() => false"
                            >
                                <PlayerProgress
                                    :theme-color="themeColor"
                                    :current-progress="currentProgress"
                                    :current-time="currentTime"
                                    :player-width="playerWidth"
                                    :current-mouse-x="currentMousePosition.x"
                                    :total-duration="totalDuration"
                                    :buffered-time-ranges="bufferedTimeRanges"
                                    :chapters="chapters"
                                    :mousedown="mousedown"
                                    data-cy="progress-rail"
                                    @mousedown.stop.native="triggerMouseDown"
                                    @touchstart.stop.native="triggerMouseDown"
                                />
                            </div>

                            <!--  BOTTOM ROW  -->
                            <div
                                class="flex flex-row"
                                @dblclick.stop.prevent="() => false"
                                @click.stop.prevent="() => false"
                            >
                                <PlayerButton
                                    v-if="controls.play"
                                    :theme-color="themeColor"
                                    :title="isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'"
                                    data-cy="play-pause-button"
                                    @click.stop.native="playPause"
                                >
                                    <i
                                        class="fas"
                                        :class="isPlaying ? 'fa-pause' : 'fa-play'"
                                    ></i>
                                </PlayerButton>

                                <div
                                    v-if="controls.time"
                                    class="flex flex-column text-white body align-v-center noselect flex-auto"
                                >
                                    {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                                </div>

                                <div class="flex flex-column spacer"></div>

                                <PlayerVolume
                                    v-if="!isMobile && controls.volume"
                                    :theme-color="themeColor"
                                    :current-volume="currentVolume"
                                    @volumeChange="changeVolume"
                                />

                                <PlayerButton
                                    v-show="!isPipEnabled"
                                    v-if="textTracks.length > 0 && controls.captions"
                                    :theme-color="themeColor"
                                    :active="isCaptionsEnabled"
                                    @click.stop.native="toggleCaptionsDrawer"
                                >
                                    <i class="fas fa-closed-captioning"></i>
                                </PlayerButton>

                                <PlayerButton
                                    v-show="!isPipEnabled"
                                    v-if="controls.settings"
                                    :theme-color="themeColor"
                                    title="Settings"
                                    :disabled="isChromeCastConnected"
                                    @click.stop.native="toggleSettingsDrawer"
                                >
                                    <i class="fas fa-cog"></i>
                                </PlayerButton>

                                <PlayerButton
                                    v-show="!isPipEnabled"
                                    v-if="controls.fullscreen"
                                    :theme-color="themeColor"
                                    title="Fullscreen (F)"
                                    :disabled="isChromeCastConnected"
                                    @click.stop.native="fullscreen"
                                >
                                    <i
                                        class="fas"
                                        :class="isFullscreen ? 'fa-compress' : 'fa-expand'"
                                    ></i>
                                </PlayerButton>
                            </div>
                        </div>
                    </div>

                    <div
                        v-show="isMobileDrawerOpen"
                        class="settings-mobile-overlay"
                        @click="settingsDrawer = false"
                    ></div>

                    <transition :name="drawersShouldOpenFromBottom ? 'show-from-bottom' : 'grow-fade'">
                        <PlayerSettings
                            v-if="controls.settings"
                            v-show="settingsDrawer"
                            :drawer="settingsDrawer"
                            :theme-color="themeColor"
                            :current-source="currentSource"
                            :current-playback-rate="currentPlaybackRate"
                            :playback-qualities="playbackQualities"
                            :is-abr-enabled="isAbrEnabled"
                            @setQuality="setQuality"
                            @setRate="setRate"
                        />
                    </transition>

                    <transition :name="drawersShouldOpenFromBottom ? 'show-from-bottom' : 'grow-fade'">
                        <PlayerCaptions
                            v-if="controls.settings"
                            v-show="captionsDrawer"
                            :theme-color="themeColor"
                            :is-captions-enabled="isCaptionsEnabled"
                            :caption-options="textTracks"
                            :current-captions="currentTextTrackLanguage"
                            @captionsSelected="enableCaptions"
                        />
                    </transition>
                </div>
            </div>
        </div>

        <div
            v-if="isPipEnabled"
            class="widescreen bg-black"
        ></div>

        <div class="flex flex-row nmh-1 mt-3" style="justify-content: space-between;">
            <div class="flex flex-column ph-1" style="max-width: 250px">
                <a
                    href="#"
                    class="btn uppercase"
                    :class="rangeButtonClasses()"
                ><i class="fas fa-arrow-up"></i><span class="ml-1">low range</span></a>
            </div>

            <div class="flex flex-column ph-1" style="max-width: 250px">
                <a
                    href="#"
                    class="btn uppercase"
                    :class="currentRangeButtonClasses()"
                >original range</a>
            </div>

            <div class="flex flex-column ph-1" style="max-width: 250px">
                <a
                    href="#"
                    class="btn uppercase"
                    :class="rangeButtonClasses()"
                ><i class="fas fa-arrow-down"></i><span class="ml-1">high range</span></a>
            </div>
        </div>
    </div>
</template>
<script>
import shaka from 'shaka-player';
import Utils from '@musora/helper-functions/modules/utils';
import Screenfull from 'screenfull';
import ContentService from '../../assets/js/services/content';
import PlayerUtils from './player-utils';
import ChromeCastPlugin from './chromecast';
import ThemeClasses from '../../mixins/ThemeClasses';
import PlayerButton from './_PlayerButton.vue';
import PlayerProgress from './_PlayerProgress.vue';
import PlayerVolume from './_PlayerVolume.vue';
import PlayerSettings from './_PlayerSettings.vue';
import PlayerCaptions from './_PlayerCaptions.vue';
import EventHandlers from './event-handlers';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation.vue';
import PlayerShortcuts from './_PlayerShortcuts.vue';
import PlayerError from './_PlayerError.vue';
import Intercom from '../../assets/js/services/intercom';
// import PlayerStats from './_PlayerStats.vue';

export default {
    name: 'VideoPlayer',
    components: {
        PlayerButton,
        PlayerProgress,
        PlayerVolume,
        PlayerSettings,
        PlayerCaptions,
        LoadingAnimation,
        PlayerShortcuts,
        PlayerError,
        // PlayerStats,
    },
    mixins: [ThemeClasses, EventHandlers],
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        hlsManifestUrl: {
            type: String,
            default: () => null,
        },

        sources: {
            type: Array,
            default: () => [],
        },

        captions: {
            type: String,
            default: () => null,
        },

        poster: {
            type: String,
            default: () => null,
        },

        chapters: {
            type: Array,
            default: () => [],
        },

        currentSecond: {
            type: [Number, String],
            default: () => 0,
        },

        contentId: {
            type: [Number, String],
            default: () => null,
        },

        videoId: {
            type: [Number, String],
            default: () => null,
        },

        castTitle: {
            type: String,
            default: () => '',
        },

        useKeyboard: {
            type: Boolean,
            default: () => true,
        },

        controls: {
            type: Object,
            default: () => ({
                chromecast: true,
                airplay: true,
                forward: true,
                backward: true,
                progress: true,
                play: true,
                time: true,
                volume: true,
                settings: true,
                fullscreen: true,
                captions: true,
            }),
        },

        useIntersectionObserver: {
            type: Boolean,
            default: () => false,
        },

        ranges: {
            type: Object,
            default: () => ({}),
        },

        showRangeButtons: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            source: this.hlsManifestUrl,
            loading: false,
            playerError: false,
            playerErrorCode: null,
            isFullscreen: false,
            contextMenu: false,
            shakaPlayer: null,
            mediaElement: null,
            textTracks: [],
            currentTextTrackLanguage: null,
            playerReady: false,
            userActive: true,
            userActiveTimeout: null,
            isPlaying: false,
            lastPlayPauseToggleTime: Date.now(),
            currentTime: 0,
            totalDuration: 0,
            mousedown: false,
            currentMouseX: 0,
            currentVolume: 1,
            settingsDrawer: false,
            captionsDrawer: false,
            chromeCast: null,
            isChromeCastSupported: false,
            isChromeCastConnected: false,
            isAirplaySupported: false,
            isAirplayConnected: false,
            performanceNow: 0,
            currentMousePosition: { x: 0, y: 0 },
            contextMenuPosition: null,
            isPipEnabled: false,
            isExperimentalPictureInPictureEnabled: false,
            isKeyboardControlsEnabled: false,
            hasBeenPlayed: false,
            currentPlaybackRate: 1,
            hasRetriedSource: false,
            dialogs: {
                stats: false,
                keyboardShortcuts: false,
            },
            intersection: null,
            timeouts: {
                controlWrapClick: null,
                isTransitioning: null,
            },
            isTransitioning: false,
        };
    },
    computed: {
        playerWidth: {
            cache: false,
            get() {
                return this.$refs.player ? this.$refs.player.clientWidth : 0;
            },
        },

        isAbrEnabled: {
            cache: false,
            get() {
                // if (this.shakaPlayer == null) {
                //     return false;
                // }
                //
                // const { abr } = this.shakaPlayer.getConfiguration();
                //
                // return abr ? abr.enabled : false;

                return false;
            },
        },

        currentRange: {
            cache: false,
            get() {
                // todo - update with localStorage
                return 'original';
            },
        },

        playbackQualities: {
            cache: false,
            get() {
                if (this.shakaPlayer == null) {
                    return [];
                }

                // const qualities = this.shakaPlayer.getVariantTracks().map(source => ({
                //     ...source,
                //     label: PlayerUtils.getQualityLabelByHeight(source.height),
                // }));

                const qualities = this.$_sources.map(source => ({
                    ...source,
                    label: PlayerUtils.getQualityLabelByHeight(source.height),
                }));

                return Utils.dynamicSort(qualities, 'height');
            },
        },

        currentProgress() {
            if (this.isChromeCastConnected) {
                const progress = (this.chromeCast.Player.currentTime / this.totalDuration) * 100;

                return isNaN(progress) ? 0 : progress;
            }

            const progress = (this.currentTime / this.totalDuration) * 100;

            return isNaN(progress) ? 0 : progress;
        },

        currentSource: {
            cache: false,
            get() {
                return this.mediaElement ? this.mediaElement.src : '';
            },
        },

        $_sources: {
            cache: false,
            get() {
                let sources;

                if (this.sources.length) {
                    sources = this.sources;
                } else if (this.ranges[this.currentRange] && this.ranges[this.currentRange].length) {
                    sources = this.ranges[this.currentRange];
                }

                return sources;
            },
        },

        bufferedTimeRanges: {
            cache: false,
            get() {
                if (this.shakaPlayer != null) {
                    // const supportsMSE = typeof MediaSource === 'function';
                    // if (supportsMSE) {
                    //     return this.shakaPlayer.getBufferedInfo().total;
                    // }

                    if (this.mediaElement) {
                        return PlayerUtils.parseTimeRangesAsArray(this.mediaElement.buffered);
                    }

                    return [];
                }

                return [];
            },
        },

        canPlayPause() {
            if (!this.isPlaying) {
                return true;
            }

            if (this.isMobile) {
                return this.userActive;
            }

            return true;
        },

        isCaptionsEnabled() {
            return this.currentTextTrackLanguage !== null;
        },

        playerStats: {
            get() {
                if (this.shakaPlayer != null) {
                    return this.shakaPlayer.getStats();
                }

                return null;
            },
        },

        isMobile: () => PlayerUtils.isMobile().any,

        isMobileViewport: {
            cache: false,
            get() {
                return window.matchMedia('(min-width: 641px)').matches === false;
            },
        },

        isSafari: () => PlayerUtils.isSafari(),

        isMobileDrawerOpen() {
            if ((this.settingsDrawer || this.captionsDrawer) && this.drawersShouldOpenFromBottom) {
                Intercom.hideWidget();
            } else {
                Intercom.showWidget();
            }

            return (this.settingsDrawer || this.captionsDrawer) && this.drawersShouldOpenFromBottom;
        },

        drawersShouldOpenFromBottom: {
            cache: false,
            get() {
                return this.isMobileViewport || this.isPipEnabled;
            },
        },
    },
    mounted() {
        const { player, videoWrap } = this.$refs;
        const supportsMSE = false;

        /*
        * Mux.js is required to mux TS streams into Mp4 on the fly, Shaka requires the
        * window.muxjs object to exist is order to accomplish this.
        *
        * Curtis, July 2019
        */
        // if (window.muxjs == null && supportsMSE) {
        //     window.muxjs = muxjs;
        // }

        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported() && !PlayerUtils.isIE()) {
            this.shakaPlayer = new shaka.Player();

            Object.keys(this.eventHandlers).forEach((event) => {
                this.shakaPlayer.addEventListener(event, this.eventHandlers[event]);
            });

            // this.mediaElement = player;
            this.shakaPlayer.attach(player)
                .then(() => {
                    this.mediaElement = this.shakaPlayer.getMediaElement();

                    this.shakaPlayer.configure({
                        abr: {
                            restrictions: {
                                maxHeight: window.screen.height,
                            },
                        },
                        streaming: {
                            bufferingGoal: 25,
                            rebufferingGoal: 10,
                            bufferBehind: 1000,
                            useNativeHlsOnSafari: true,
                        },
                    });

                    return this.loadSource();
                })
                .then(() => {
                    this.initializePlayer();
                })
                .catch((error) => {
                    if (error.severity === 2) {
                        this.playerError = true;
                        this.playerErrorCode = error.code;
                    }
                });
        } else {
            this.playerError = true;
            this.playerErrorCode = 'Browser Not Supported';
        }

        // Close drawers on any document click
        document.addEventListener('click', this.closeDrawers);

        // Mouse up events
        ['touchend', 'mouseup'].forEach((event) => {
            document.addEventListener(event, this.mouseUpEventHandler);
        });

        // Add Event Listeners to chapter marker links
        document.addEventListener('click', (event) => {
            const element = event.target;

            if (element.matches('[data-jump-to-time]')) {
                this.seek(element.dataset.jumpToTime);

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        });

        // Initialize the ChromeCast plugin and it's event handlers
        this.chromeCast = new ChromeCastPlugin();

        this.chromeCast.on('available', () => {
            this.isChromeCastSupported = true;

            // Add all chromecast event handlers
            Object.keys(this.chromeCastEventHandlers).forEach((event) => {
                this.chromeCast.on(event, this.chromeCastEventHandlers[event]);
            });

            // Immediately disconnect ChromeCast if the user refreshes/leaves the page
            window.addEventListener('unload', () => {
                this.chromeCast.disconnect();
            });
        });

        // Initialize Apple Airplay and create an event listener for playback change
        if (window.WebKitPlaybackTargetAvailabilityEvent) {
            player.addEventListener('webkitplaybacktargetavailabilitychanged', (event) => {
                if (event.availability === 'available') {
                    this.isAirplaySupported = true;
                }
            });

            player.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => {
                this.isAirplayConnected = !this.isAirplayConnected;
            });
        }

        if (this.useIntersectionObserver && typeof IntersectionObserver !== 'undefined') {
            this.enableIntersectionObserver(videoWrap);
        }
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDrawers);
        document.removeEventListener('mouseup', this.mouseUpEventHandler);

        this.shakaPlayer.destroy();
    },
    methods: {
        rangeButtonClasses() {
            return `text-${this.themeColor} bg-${this.themeColor} inverted`;
        },

        currentRangeButtonClasses() {
            return `text-white bg-${this.themeColor}`;
        },

        getSource(source) {
            if (source) {
                this.source = source;
            } else {
                this.source = this.getDefaultPlaybackQualityIndex();
            }
        },

        loadSource(source) {
            // const supportsMSE = typeof MediaSource === 'function';
            this.getSource(source);

            return new Promise((resolve) => {
                // Shaka player does not like MP4s for whatever reason, I think its related to MSE so switching to
                // media player resolved all seeking issues.
                // Caleb - May 2020

                // if (supportsMSE) {
                // this.shakaPlayer.load(this.source.file, null, 'video/mp4')
                //     .then(() => {
                //         this.$nextTick(() => this.$forceUpdate());
                //
                //         console.log(this.shakaPlayer.loadMode_);
                //
                //         resolve();
                //
                //         if (this.captions) {
                //             setTimeout(() => {
                //                 let promise1 = this.shakaPlayer.addTextTrack('https://gofile.io/d/ha1xNl', 'en', 'subtitle', 'text/vtt', null, 'English')
                //                 console.log(promise1);
                //
                //             }, 5000);
                //
                //         }
                //     })
                //     .catch((error) => {
                //         if (error.severity === 2) {
                //             // The following code was removed after ABR
                //             // was stripped from the player
                //             // Curtis - Jan 2020
                //
                //             // if (error.code === 1001 && !this.hasRetriedSource) {
                //             //     this.retryVimeoUrl(error);
                //             // } else {
                //             this.playerError = true;
                //             this.playerErrorCode = error.code;
                //             // }
                //         }
                //     });
                // } else {

                this.mediaElement.src = this.source.file;

                setTimeout(() => {
                    resolve();
                }, 100);

                // }
            });
        },

        retryVimeoUrl(error) {
            this.hasRetriedSource = true;

            if (error.data.length < 2 && error.data[1] !== 410) {
                this.playerError = true;
                this.playerErrorCode = error.code;
            } else {
                this.loading = true;

                ContentService.getVimeoUrlByVimeoId(this.videoId)
                    .then((response) => {
                        if (response) {
                            const hlsManifest = response.data.files.find(
                                file => file.quality === 'hls',
                            );

                            this.source = hlsManifest.link;
                            return this.loadSource();
                        }
                    })
                    .then(() => {
                        this.initializePlayer(this.currentTime);
                    });
            }
        },

        initializePlayer(time) {
            const urlParams = new URLSearchParams(window.location.search);
            const timeToSeekTo = time || (urlParams.get('time') || window.localStorage.getItem(`${this.videoId}_currentTime`) || this.currentSecond);

            if (parseInt(timeToSeekTo) !== parseInt(this.currentTime)) {
                this.seek(timeToSeekTo);
            }

            this.attachMediaElementEventHandlers();

            this.getDefaultVolume();

            if (this.mediaElement) {
                for (let i = 0, L = this.mediaElement.textTracks.length; i < L; i++) {
                    const thisTextTrack = this.mediaElement.textTracks[i];

                    if (thisTextTrack.label !== 'Shaka Player TextTrack') {
                        this.textTracks.push(thisTextTrack);
                    }

                    if (window.localStorage.getItem('currentTextTrackLanguage') === thisTextTrack.language) {
                        this.currentTextTrackLanguage = thisTextTrack.language;
                    }

                    if (!window.localStorage.getItem('currentTextTrackLanguage')) {
                        this.currentTextTrackLanguage = null;
                        thisTextTrack.mode = 'hidden';
                    }
                }
            }

            // FULLSCREEN EVENT
            document.addEventListener('fullscreenchange', () => {
                this.isFullscreen = document.fullscreenElement != null;
            });

            if (this.useKeyboard) {
                this.enableKeyboardControls();
            }

            setTimeout(() => {
                this.hasRetriedSource = false;
                this.mediaElement.focus();
            }, 100);

            setInterval(() => {
                window.localStorage.setItem(`${this.videoId}_currentTime`, this.currentTime);
            }, 2500);
        },

        attachMediaElementEventHandlers() {
            Object.keys(this.mediaElementEventHandlers).forEach((event) => {
                this.mediaElement.addEventListener(
                    event,
                    this.mediaElementEventHandlers[event],
                );
            });
        },

        getDefaultVolume() {
            if (window.localStorage.getItem('isMuted') != null) {
                this.changeVolume({
                    volume: Number(0),
                }, false);

                return;
            }

            if (window.localStorage.getItem('playerVolume') != null) {
                this.changeVolume({
                    volume: Number(window.localStorage.getItem('playerVolume')),
                });
            }
        },

        playPause() {
            if (Date.now() - this.lastPlayPauseToggleTime < 200) {
                return;
            }

            this.lastPlayPauseToggleTime = Date.now();

            if (this.chromeCast && this.chromeCast.Connected && this.isChromeCastConnected) {
                this.chromeCast.playOrPause();
            } else if (this.isPlaying) {
                this.mediaElement.pause();
            } else {
                this.mediaElement.play();
            }
        },

        playPauseViaControlWrap(event) {
            if (this.userActive || !this.isPlaying) {
                this.isTransitioning = true;
            }

            clearTimeout(this.timeouts.controlWrapClick);
            clearTimeout(this.timeouts.isTransitioning);

            if (event.detail === 1) {
                if (this.userActive || !this.isPlaying) {
                    this.timeouts.controlWrapClick = setTimeout(() => {
                        if (this.settingsDrawer || this.captionsDrawer || !this.canPlayPause) {
                            this.settingsDrawer = false;
                            this.captionsDrawer = false;

                            return;
                        }

                        setTimeout(() => {
                            this.playPause();
                        }, 10);
                    }, 500);
                }

                this.timeouts.isTransitioning = setTimeout(() => {
                    this.isTransitioning = false;
                }, 300);
            }
        },

        seek(time) {
            this.mediaElement.pause();
            const seekTime = Number(time) > 0 ? Math.round(Number(time)) : 0;

            this.currentTime = seekTime;

            if (this.isChromeCastConnected) {
                this.chromeCast.seek(seekTime);
            }

            this.mediaElement.currentTime = seekTime;
        },

        fullscreen() {
            const { container } = this.$refs;
            this.isTransitioning = false;

            // If we have access to the requestFullscreen API then use that
            if (Screenfull.enabled) {
                Screenfull.toggle(container);
            } else {
                // Otherwise we just take the video element and make it fullscreen
                this.mediaElement.webkitEnterFullScreen();
            }
        },

        changeVolume(payload, remember = true) {
            if (remember) {
                localStorage.setItem('playerVolume', payload.volume);
            }

            if (this.isChromeCastConnected) {
                this.chromeCast.volume(payload.volume);
                this.mediaElement.volume = 0;

                return;
            }

            this.mediaElement.volume = payload.volume / 100;
            this.currentVolume = this.mediaElement.volume;
        },

        parseTime: time => PlayerUtils.parseTime(time),

        trackMousePosition(event) {
            this.currentMousePosition = PlayerUtils.getMousePosition(event, this.$refs.container);

            if (this.mediaElement) {
                Utils.triggerEvent(this.mediaElement, 'useractive');

                clearTimeout(this.userActiveTimeout);
                this.userActiveTimeout = setTimeout(() => {
                    Utils.triggerEvent(this.mediaElement, 'userinactive');
                }, 3000);
            }
        },

        setQuality(payload) {
            const { currentTime } = this.mediaElement;
            this.setDefaultPlaybackQualityWidth(payload.width);

            this.loadSource(payload)
                .then(() => {
                    setTimeout(() => {
                        this.seek(currentTime);
                    }, 200);
                });

            // if (payload === 'auto') {
            //     this.shakaPlayer.configure('abr.enabled', true);
            // } else {
            //     this.shakaPlayer.configure('abr.enabled', false);
            //
            //     this.shakaPlayer.selectVariantTrack(payload, true);
            // }
        },

        setRate(payload) {
            if (payload.rate > 0.25 && payload.rate <= 2) {
                this.mediaElement.playbackRate = payload.rate;
            }
        },

        setDefaultPlaybackQualityWidth(width) {
            window.localStorage.setItem('vuesoraDefaultVideoQuality', width);
        },

        getDefaultPlaybackQualityIndex() {
            const widthToCheck = window.localStorage.getItem('vuesoraDefaultVideoQuality')
                || document.documentElement.clientWidth;
            const matchedQualities = this.playbackQualities.filter(quality => quality.width >= widthToCheck);

            return matchedQualities[0] || this.playbackQualities[0];
        },

        toggleSettingsDrawer() {
            if (this.isChromeCastConnected) {
                return false;
            }

            this.captionsDrawer = false;
            this.settingsDrawer = !this.settingsDrawer;

            if (this.drawersShouldOpenFromBottom && this.settingsDrawer) {
                document.body.classList.add('drawer-open');
            }

            if (this.drawersShouldOpenFromBottom && !this.settingsDrawer) {
                document.body.classList.remove('drawer-open');
            }
        },

        toggleCaptionsDrawer() {
            this.captionsDrawer = !this.captionsDrawer;
            this.settingsDrawer = false;

            if (this.drawersShouldOpenFromBottom && this.captionsDrawer) {
                document.body.classList.add('drawer-open');
            }

            if (this.drawersShouldOpenFromBottom && !this.captionsDrawer) {
                document.body.classList.remove('drawer-open');
            }
        },

        closeDrawers() {
            this.settingsDrawer = false;
            this.captionsDrawer = false;
            this.contextMenu = false;

            document.body.classList.remove('drawer-open');
        },

        enableCaptions(payload) {
            if (payload) {
                this.textTracks[0].mode = 'showing';
                this.currentTextTrackLanguage = this.textTracks[0].language;
                window.localStorage.setItem('currentTextTrackLanguage', this.currentTextTrackLanguage);

            } else {
                this.textTracks[0].mode = 'hidden';
                this.currentTextTrackLanguage = null;
                window.localStorage.removeItem('currentTextTrackLanguage');
            }
        },

        enableChromeCast() {
            this.chromeCast.cast({
                content: this.source,
                poster: this.poster,
                title: this.castTitle,
                subtitles: {
                    active: false,
                    srclang: 'en',
                    src: this.captions,
                },
                time: this.currentTime,
                volume: this.currentVolume,
                muted: false,
                paused: false,
            });
        },

        enableAirplay() {
            this.$refs.player.webkitShowPlaybackTargetPicker();
        },

        keyboardControlEventHandler(event) {
            if (this.keyboardEventHandlers[event.code]) {
                event.stopPropagation();
                event.preventDefault();

                this.keyboardEventHandlers[event.code]();
            }
        },

        triggerMouseDown(event) {
            if (event.button !== 2) {
                this.mousedown = true;
            }
        },

        toggleContextMenu() {
            this.contextMenu = true;
            setTimeout(() => {
                // 1ms timeout allows the browser to calculate the context menu dimensions properly
                this.getContextMenuPosition();
            }, 1);
        },

        getContextMenuPosition() {
            const playerWidth = this.$refs.player ? this.$refs.player.clientWidth : 0;
            const playerHeight = this.$refs.player ? this.$refs.player.clientHeight : 0;
            const menuWidth = this.$refs.contextMenu ? this.$refs.contextMenu.clientWidth : 0;
            const menuHeight = this.$refs.contextMenu ? this.$refs.contextMenu.clientHeight : 0;

            let { x } = this.currentMousePosition;
            let { y } = this.currentMousePosition;

            if (x > (playerWidth - menuWidth)) {
                x = this.currentMousePosition.x - menuWidth;
            }

            if (y > (playerHeight - menuHeight)) {
                y = this.currentMousePosition.y - menuHeight;
            }

            this.contextMenuPosition = {
                transform: `translate(${x}px, ${y}px)`,
                'webkit-transform': `translate(${x}px, ${y}px)`,
            };
        },

        mouseUpEventHandler(event) {
            if (event.button !== 2) {
                if (this.mousedown) {
                    const timeToSeekTo = this.totalDuration * (
                        PlayerUtils.getTimeRailMouseEventOffsetPercentage(
                            this.currentMousePosition.x,
                            this.playerWidth,
                        )
                    );
                    this.seek(timeToSeekTo);
                }

                this.contextMenu = false;
                this.mousedown = false;
            }
        },

        openDialog(dialog) {
            const alreadyOpen = this.dialogs[dialog] === true;
            this.closeAllDialogs();

            if (!alreadyOpen) {
                this.dialogs[dialog] = true;
            }
        },

        togglePip() {
            if (document.pictureInPictureEnabled) {
                this.toggleExperimentalPip();
            } else {
                this.toggleFakePip();
            }
        },

        toggleFakePip() {
            const { videoWrap } = this.$refs;
            this.isPipEnabled = !this.isPipEnabled;

            /*
            * Safari has a bug that doesn't trigger a repaint when the player
            * is put into PIP. The following hack will manually trigger the repaint
            * allowing the new styles to propagate.
            *
            * Curtis - July 2019
            * */
            videoWrap.style.display = 'none';
            setTimeout(() => {
                videoWrap.style.display = null;
            }, 50);
        },

        toggleExperimentalPip() {
            return new Promise((resolve, reject) => {
                if (this.isExperimentalPictureInPictureEnabled) {
                    document.exitPictureInPicture()
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    this.mediaElement.requestPictureInPicture()
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            });
        },

        enableKeyboardControls() {
            document.addEventListener('keydown', this.keyboardControlEventHandler);
            this.isKeyboardControlsEnabled = true;

            document.addEventListener('focusin', (event) => {
                const path = event.path || (event.composedPath && event.composedPath());

                const isVideoPlayerElement = path.filter((el) => {
                    if (typeof el.matches !== 'undefined' && el.matches('#lessonVideoWrap')) {
                        return el;
                    }
                }).length > 0;

                if (!isVideoPlayerElement) {
                    document.removeEventListener('keydown', this.keyboardControlEventHandler);
                    this.isKeyboardControlsEnabled = false;
                }
            });

            document.addEventListener('focusout', () => {
                if (!this.isKeyboardControlsEnabled) {
                    document.addEventListener('keydown', this.keyboardControlEventHandler);
                    this.isKeyboardControlsEnabled = true;
                }
            });
        },

        closeAllDialogs() {
            Object.keys(this.dialogs).forEach((dialog) => {
                this.dialogs[dialog] = false;
            });
        },

        enableIntersectionObserver(videoWrap) {
            this.intersection = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.intersectionRatio >= 0.5;
                    this.isPipEnabled = !isVisible && !this.isMobileViewport && this.isPlaying;
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            });
            this.intersection.observe(videoWrap.parentElement);
        },
    },
};
</script>
