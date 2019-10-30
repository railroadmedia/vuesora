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
                    <transition name="grow-fade">
                        <PlayerStats
                            v-if="playerStats"
                            v-show="dialogs.stats"
                            :player-stats="playerStats"
                            @close="closeAllDialogs"
                        />
                    </transition>

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

                    <transition name="grow-fade">
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
                                v-if="!isMobile"
                                class="pa-1 hover-bg-grey-4"
                                @click="openDialog('keyboardShortcuts')"
                            >
                                {{ dialogs.keyboardShortcuts ? 'Hide' : 'Show' }} Keyboard Shortcuts
                            </li>
                            <li
                                class="pa-1 hover-bg-grey-4"
                                @click="openDialog('stats')"
                            >
                                {{ dialogs.stats ? 'Hide' : 'Show' }} Player Stats
                            </li>
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
                            v-show="isPipEnabled"
                            class="close-pip"
                            @click.stop.prevent
                        >
                            <PlayerButton
                                :theme-color="themeColor"
                                title="Disable PIP"
                                @click.stop.native="isPipEnabled = false"
                            >
                                <i class="fas fa-times"></i>
                            </PlayerButton>
                        </div>
                    </transition>

                    <transition name="grow-fade">
                        <div
                            v-show="loading && !isPlaying"
                            class="player-overlay"
                            @click.stop.prevent
                        >
                            <LoadingAnimation :theme-color="themeColor " />
                        </div>
                    </transition>

                    <transition name="grow-fade">
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
                        preload="auto"
                        crossorigin="anonymous"
                        :poster="poster"
                    ></video>


                    <div
                        ref="controls"
                        class="controls-wrap"
                        @click.stop="playPauseViaControlWrap"
                    >
                        <transition name="grow-fade">
                            <div
                                v-show="!loading && !isPlaying"
                                class="player-overlay big-play-button pointer"
                                @click.stop="playPauseViaControlWrap"
                            >
                                <div class="overlay-play rounded ba-white-3 flex-center shadows">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        </transition>

                        <div class="top-controls">
                            <div class="flex flex-row align-h-right">
                                <transition name="grow-fade">
                                    <PlayerButton
                                        v-if="isChromeCastSupported"
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
                                        v-if="isAirplaySupported"
                                        :theme-color="themeColor"
                                        title="Apple Airplay"
                                        :active="isAirplayConnected"
                                        @click.stop.native="enableAirplay"
                                    >
                                        <i class="icon-airplay"></i>
                                    </PlayerButton>
                                </transition>
                            </div>
                        </div>

                        <div class="player-controls flex flex-column noselect">
                            <!--  TOP ROW  -->
                            <div
                                class="flex flex-row"
                                @click.stop.native="playPauseViaControlWrap"
                            >
                                <PlayerButton
                                    :theme-color="themeColor"
                                    title="Rewind 5 Seconds (Left Arrow)"
                                    data-cy="rewind-button"
                                    @click.stop.native="seek(currentTime - 5)"
                                >
                                    <i class="fas fa-undo"></i>
                                </PlayerButton>

                                <div class="flex flex-column spacer"></div>

                                <PlayerButton
                                    :theme-color="themeColor"
                                    title="Forward 5 Seconds (Right Arrow)"
                                    data-cy="fast-forward-button"
                                    @click.stop.native="seek(currentTime + 5)"
                                >
                                    <i class="fas fa-redo"></i>
                                </PlayerButton>
                            </div>

                            <!--  MIDDLE ROW  -->
                            <div class="flex flex-row">
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
                                @click.stop.prevent
                            >
                                <PlayerButton
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

                                <div class="flex flex-column text-white body align-v-center noselect flex-auto">
                                    {{ parseTime(currentTime) }} / {{ parseTime(totalDuration) }}
                                </div>

                                <div class="flex flex-column spacer"></div>

                                <PlayerVolume
                                    v-if="!isMobile"
                                    :theme-color="themeColor"
                                    :current-volume="currentVolume"
                                    @volumeChange="changeVolume"
                                />

                                <PlayerButton
                                    v-if="captionOptions.length > 0"
                                    :theme-color="themeColor"
                                    :active="isCaptionsEnabled"
                                    @click.stop.native="toggleCaptionsDrawer"
                                >
                                    <i class="fas fa-closed-captioning"></i>
                                </PlayerButton>

                                <PlayerButton
                                    :theme-color="themeColor"
                                    title="Settings"
                                    :disabled="isChromeCastConnected"
                                    @click.stop.native="toggleSettingsDrawer"
                                >
                                    <i class="fas fa-cog"></i>
                                </PlayerButton>

                                <PlayerButton
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
                            v-show="captionsDrawer"
                            :theme-color="themeColor"
                            :is-captions-enabled="isCaptionsEnabled"
                            :caption-options="captionOptions"
                            :current-captions="currentCaptions"
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

        <div
            v-if="!hideBottomBars"
            class="flex flex-row bg-black text-white pa-1 align-center flex-wrap"
        >
            <p class="tiny">
                You are currently viewing our new video player beta!
            </p>

            <button class="btn collapse-150"
                    @click="stopTesting">
                <span
                    class="flat short"
                    :class="themeTextClass"
                >
                    Stop Testing
                </span>
            </button>
        </div>

        <VideoSocialButtons
            v-if="!hideBottomBars"
            :theme-color="themeColor"
            :is-liked="isLiked"
            :like-count="likeCount"
            :content-id="contentId"
            :user-id="userId"
            :brand="brand"
            :current-time-in-seconds="currentTime"
        />
    </div>
</template>
<script>
import * as muxjs from 'mux.js';
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
import PlayerStats from './_PlayerStats.vue';
import VideoSocialButtons from '../_VideoSocialButtons.vue';

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
        PlayerStats,
        VideoSocialButtons,
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

        isLiked: {
            type: Boolean,
            default: () => false,
        },

        likeCount: {
            type: [Number, String],
            default: () => 0,
        },

        contentId: {
            type: [Number, String],
            default: () => null,
        },

        userId: {
            type: [Number, String],
            default: () => null,
        },

        videoId: {
            type: [Number, String],
            default: () => null,
        },

        progressState: {
            type: String,
            default: () => 'unstarted',
        },

        castTitle: {
            type: String,
            default: () => '',
        },

        hideBottomBars: {
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
            playerReady: false,
            userActive: true,
            userActiveTimeout: null,
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
                if (this.shakaPlayer == null) {
                    return false;
                }

                const { abr } = this.shakaPlayer.getConfiguration();

                return abr ? abr.enabled : false;
            },
        },

        playbackQualities: {
            cache: false,
            get() {
                if (this.shakaPlayer == null) {
                    return [];
                }

                const qualities = this.shakaPlayer.getVariantTracks().map(source => ({
                    ...source,
                    label: PlayerUtils.getQualityLabelByHeight(source.height),
                }));

                return Utils.dynamicSort(qualities, 'height');
            },
        },

        currentProgress() {
            const progress = (this.currentTime / this.totalDuration) * 100;

            return isNaN(progress) ? 0 : progress;
        },

        currentSource: {
            cache: false,
            get() {
                return this.mediaElement ? this.mediaElement.currentSrc : '';
            },
        },

        captionOptions: {
            cache: false,
            get() {
                if (this.shakaPlayer) {
                    return this.shakaPlayer.getTextTracks().filter(track => track.kind === 'subtitle');
                }

                return [];
            },
        },

        bufferedTimeRanges: {
            cache: false,
            get() {
                if (this.shakaPlayer != null) {
                    const supportsMSE = typeof MediaSource === 'function';
                    if (supportsMSE) {
                        return this.shakaPlayer.getBufferedInfo().total;
                    }

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
            if (this.shakaPlayer) {
                return this.shakaPlayer.isTextTrackVisible();
            }

            return false;
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
        const { player } = this.$refs;
        const supportsMSE = typeof MediaSource === 'function';

        /*
        * Mux.js is required to mux TS streams into Mp4 on the fly, Shaka requires the
        * window.muxjs object to exist is order to accomplish this.
        *
        * Curtis, July 2019
        */
        if (window.muxjs == null && supportsMSE) {
            window.muxjs = muxjs;
        }

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
                            bufferingGoal: 15,
                            rebufferingGoal: 5,
                            bufferBehind: 0,
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
        }

        player.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => {
            this.isAirplayConnected = !this.isAirplayConnected;
        });
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDrawers);
        document.removeEventListener('mouseup', this.mouseUpEventHandler);

        this.shakaPlayer.destroy();
    },
    methods: {
        loadSource() {
            const supportsMSE = typeof MediaSource === 'function';

            return new Promise((resolve) => {
                if (supportsMSE) {
                    this.shakaPlayer.load(this.source)
                        .then(() => {
                            this.$nextTick(() => this.$forceUpdate());
                            resolve();
                        })
                        .catch((error) => {
                            if (error.severity === 2) {
                                if (error.code === 1001 && !this.hasRetriedSource) {
                                    this.retryVimeoUrl(error);
                                } else {
                                    this.playerError = true;
                                    this.playerErrorCode = error.code;
                                }
                            }
                        });
                } else {
                    this.mediaElement.src = this.source;

                    setTimeout(() => {
                        resolve();
                    }, 100);
                }
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
            const timeToSeekTo = time || (urlParams.get('time') || this.currentSecond);

            if (timeToSeekTo !== this.currentTime) {
                this.seek(timeToSeekTo);
            }

            if (this.captions) {
                this.shakaPlayer.addTextTrack(this.captions, 'en', 'subtitle', 'text/vtt', null, 'English');
            }

            this.attachMediaElementEventHandlers();

            this.getDefaultVolume();

            // FULLSCREEN EVENT
            document.addEventListener('fullscreenchange', () => {
                this.isFullscreen = document.fullscreenElement != null;
            });

            this.enableKeyboardControls();

            setTimeout(() => {
                this.hasRetriedSource = false;
                this.mediaElement.focus();
            }, 100);
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
            if (window.localStorage.getItem('playerVolume') != null) {
                this.changeVolume({
                    volume: Number(window.localStorage.getItem('playerVolume')),
                });
            }
        },

        playPause() {
            if (this.chromeCast && this.chromeCast.Connected) {
                this.chromeCast.playOrPause();
            } else if (this.isPlaying) {
                this.mediaElement.pause();
            } else {
                this.mediaElement.play();
            }
        },

        playPauseViaControlWrap() {
            if (this.settingsDrawer || this.captionsDrawer || !this.canPlayPause) {
                this.settingsDrawer = false;
                this.captionsDrawer = false;

                return;
            }

            this.playPause();
        },

        seek(time) {
            this.mediaElement.pause();

            const seekTime = Number(time) > 0 ? Math.round(Number(time)) : 0;
            this.currentTime = seekTime;

            this.mediaElement.currentTime = seekTime;
        },

        fullscreen() {
            const { container } = this.$refs;

            // If we have access to the requestFullscreen API then use that
            if (Screenfull.enabled) {
                Screenfull.toggle(container);
            } else {
                // Otherwise we just take the video element and make it fullscreen
                this.mediaElement.webkitEnterFullScreen();
            }
        },

        changeVolume(payload) {
            this.mediaElement.volume = payload.volume / 100;
            this.currentVolume = this.mediaElement.volume;

            localStorage.setItem('playerVolume', payload.volume);

            if (this.isChromeCastConnected) {
                this.chromeCast.volume(payload.volume);
            }
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

            if (payload === 'auto') {
                this.shakaPlayer.configure('abr.enabled', true);
            } else {
                this.shakaPlayer.configure('abr.enabled', false);

                this.shakaPlayer.selectVariantTrack(payload, true);
            }

            setTimeout(() => {
                this.seek(currentTime);
            }, 200);
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
            const qualityIndexes = this.playbackQualities.map((quality, index) => {
                if (quality.width >= widthToCheck) {
                    return index;
                }
            });
            const closestIndex = qualityIndexes.filter(index => index != null)[0];

            return closestIndex || 0;
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
            this.shakaPlayer.setTextTrackVisibility(payload != null);

            if (payload != null) {
                if (this.isChromeCastConnected) {
                    this.chromeCast.changeSubtitle(payload ? 0 : null);
                } else {
                    this.shakaPlayer.selectTextTrack(payload);
                }
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
                    videoWrap.style.display = '';
                }, 50);
            }
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
                const isVideoPlayerElement = event.path.filter((el) => {
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

        stopTesting() {
            document.cookie = 'enableHlsPlayer=;path=/;expires=0;';
            window.location.reload();
        },
    },
};
</script>
