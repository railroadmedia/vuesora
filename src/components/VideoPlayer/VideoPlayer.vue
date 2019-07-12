<template>
    <div
        ref="container"
        class="flex flex-column video-player"
        :class="{'user-active': userActive || !isPlaying}"
        @contextmenu.stop.prevent="toggleContextMenu"
        @mousemove="trackMousePosition"
        @keydown.stop.prevent="keyboardControlEventHandler"
    >
        <transition name="grow-fade">
            <PlayerShortcuts
                v-show="keyboardShortcuts"
                @close="keyboardShortcuts = false"
            />
        </transition>

<!--        <transition name="grow-fade">-->
<!--            <PlayerError v-if="sources.length === 0" />-->
<!--        </transition>-->

        <transition name="grow-fade">
            <div
                v-show="contextMenu"
                ref="contextMenu"
                class="context-menu bg-grey-5 hover-bg-grey-4 pointer text-white shadow overflow"
                :style="contextMenuPosition"
                @click.stop.prevent
            >
                <ul class="list-style-none tiny dense font-bold">
                    <li
                        class="pa-1"
                        @click="keyboardShortcuts = !keyboardShortcuts"
                    >
                        {{ keyboardShortcuts ? 'Hide' : 'Show' }} Keyboard Shortcuts
                    </li>
                </ul>
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
                v-show="!loading && !isPlaying"
                class="player-overlay"
            >
                <div class="overlay-play rounded ba-white-3 flex-center shadows">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </transition>

        <transition name="grow-fade">
            <span
                v-show="currentPlaybackRate !== 1"
                class="speed-indicator subheading pa-2 text-center text-white"
            >
                {{ currentPlaybackRate }}x
                <i class="fas fa-hourglass"></i>
            </span>
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
            <div
                class="controls flex flex-column noselect"
                @click.stop.prevent
            >
                <!--  TOP ROW  -->
                <div class="flex flex-row">
                    <PlayerButton
                        :theme-color="themeColor"
                        title="Rewind 10 Seconds (Left Arrow)"
                        data-cy="rewind-button"
                        @click.stop.native="seek(currentTime - 10)"
                    >
                        <i class="fas fa-undo"></i>
                    </PlayerButton>

                    <div class="flex flex-column spacer"></div>

                    <PlayerButton
                        :theme-color="themeColor"
                        title="Forward 10 Seconds (Right Arrow)"
                        data-cy="fast-forward-button"
                        @click.stop.native="seek(currentTime + 10)"
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
                        :buffered-percent="bufferedPercent"
                        :buffered-time-ranges="parsedTimeRanges"
                        :chapters="chapters"
                        :mousedown="mousedown"
                        data-cy="progress-rail"
                        @mousedown.stop.native="triggerMouseDown"
                    />
                </div>

                <!--  BOTTOM ROW  -->
                <div class="flex flex-row">
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

                    <PlayerButton
                        v-if="captions.length > 0"
                        :theme-color="themeColor"
                        :active="currentCaptions != null"
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

        <transition :name="isMobile ? 'show-from-bottom' : 'grow-fade'">
            <PlayerSettings
                v-show="settingsDrawer"
                :drawer="settingsDrawer"
                :theme-color="themeColor"
                :videojs-instance="videojsInstance"
                :current-source="currentSource"
                :current-source-index="currentSourceIndex"
                :current-playback-rate="currentPlaybackRate"
                :playback-qualities="playbackQualities"
                :is-abr-enabled="isAbrEnabled"
                @setQuality="setQuality"
                @setRate="setRate"
            />
        </transition>

        <transition :name="isMobile ? 'show-from-bottom' : 'grow-fade'">
            <PlayerCaptions
                v-show="captionsDrawer"
                :theme-color="themeColor"
                :caption-options="captionOptions"
                :current-captions="currentCaptions"
                @captionsSelected="enableCaptions"
            />
        </transition>
    </div>
</template>
<script>
// import videojs from 'video.js';
// import 'videojs-contrib-quality-levels';
import * as muxjs from 'mux.js';
import shaka from 'shaka-player';
import ISO6391 from '../../../node_modules/iso-639-1';
import Utils from 'js-helper-functions/modules/utils';
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
    },
    mixins: [ThemeClasses, EventHandlers],
    props: {
        sources: {
            type: Array,
            default: () => [],
        },

        hlsManifestUrl: {
            type: String,
            default: () => null,
        },

        captions: {
            type: Array,
            default: () => [],
        },

        poster: {
            type: String,
            default: () => null,
        },

        chapters: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: false,
            isFullscreen: false,
            contextMenu: false,
            keyboardShortcuts: false,
            videojsInstance: null,
            shakaPlayer: null,
            mediaElement: null,
            playerReady: false,
            hlsInstance: null,
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
            noSourcesError: null,
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
            get(){
                if (this.shakaPlayer == null) {
                    return false;
                }

                const config = this.shakaPlayer.getConfiguration();

                return config.abr ? config.abr.enabled : false;
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

        currentSourceIndex: {
            cache: false,
            get() {
                if (this.hlsInstance) {
                    return this.videojsInstance.qualityLevels().selectedIndex;
                }

                return this.playbackQualities
                    .map(quality => quality.source)
                    .indexOf(this.currentSource);
            },
        },

        currentPlaybackRate: {
            cache: false,
            get() {
                return this.mediaElement ? this.mediaElement.playbackRate : 1;
            },
        },

        captionOptions: {
            cache: false,
            get() {
                const tracks = this.videojsInstance ? this.videojsInstance.remoteTextTracks() : [];
                const tracksMap = [];

                for (let i = 0; i < tracks.length; i += 1) {
                    if (tracks[i].kind === 'captions') {
                        tracksMap.push({
                            language: tracks[i].language,
                            label: ISO6391.getNativeName(tracks[i].language),
                        });
                    }
                }

                return tracksMap;
            },
        },

        bufferedPercent: {
            cache: false,
            get() {
                return this.videojsInstance ? this.videojsInstance.bufferedPercent() : 0;
            },
        },

        bufferedTimeRanges: {
            cache: false,
            get() {
                return this.videojsInstance ? this.videojsInstance.buffered() : null;
            },
        },

        parsedTimeRanges: {
            cache: false,
            get() {
                const ranges = [];

                if (this.bufferedTimeRanges != null && this.bufferedTimeRanges.length > 0) {
                    for (let i = 0; i < this.bufferedTimeRanges.length; i += 1) {
                        ranges.push({
                            start: Math.floor(this.bufferedTimeRanges.start(i)),
                            end: this.bufferedTimeRanges.end(i),
                        });
                    }
                }

                return ranges;
            },
        },

        canPlayPause() {
            if (!this.isPlaying) {
                return true;
            }

            return this.userActive;
        },

        isMobile: () => PlayerUtils.isMobile().any || window.matchMedia('(max-width: 640px)') === true,

        isSafari: () => PlayerUtils.isSafari(),

        isMobileDrawerOpen() {
            return (this.settingsDrawer || this.captionsDrawer) && this.isMobile;
        },
    },
    async mounted() {
        const { player } = this.$refs;
        const { container } = this.$refs;
        const supportsMSE = typeof MediaSource === 'function';
        this.loading = true;

        if (muxjs != null && supportsMSE) {
            window.muxjs = muxjs;
        }

        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported()) {
            this.shakaPlayer = new shaka.Player(player);

            Object.keys(this.eventHandlers).forEach((event) => {
                this.shakaPlayer.addEventListener(event, this.eventHandlers[event]);
            });

            this.mediaElement = player;

            this.shakaPlayer.load(this.hlsManifestUrl)
                .then(() => {
                    this.mediaElement = this.shakaPlayer.getMediaElement();
                    // HAVE TO MANUALLY TRIGGER A LOAD EVENT ON SAFARI, BREAKS CHROME THOUGH
                    // if (this.isSafari) {
                    console.log('hello?');

                    // this.mediaElement.src = this.hlsManifestUrl;
                    // setTimeout(() => {
                    //     this.$refs.player.load();
                    // }, 10000);
                    // }

                    // ENABLE MEDIA ELEMENT EVENT HANDLERS
                    Object.keys(this.mediaElementEventHandlers).forEach((event) => {
                        this.mediaElement.addEventListener(
                            event,
                            this.mediaElementEventHandlers[event],
                        );
                    });

                    // SET THE VOLUME FROM LOCALSTORAGE
                    if (window.localStorage.getItem('playerVolume') != null) {
                        this.changeVolume({
                            volume: Number(window.localStorage.getItem('playerVolume')),
                        });
                    }

                    // USER ACTIVE AND INACTIVE EVENTS
                    container.addEventListener('mousemove', () => {
                        Utils.triggerEvent(this.mediaElement, 'useractive');

                        clearTimeout(this.userActiveTimeout);
                        this.userActiveTimeout = setTimeout(() => {
                            Utils.triggerEvent(this.mediaElement, 'userinactive');
                        }, 3000);
                    });

                    // FULLSCREEN EVENT
                    document.addEventListener('fullscreenchange', () => {
                        this.isFullscreen = document.fullscreenElement != null;
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('hello?');

            this.mediaElement = this.$refs.player;

            this.mediaElement.play();
        }


        // Add the sources to the player instance
        // this.videojsInstance.src(source);

        // On Player Ready
        // this.videojsInstance.ready(() => {
        //     if (supportsMSE) {
        //         this.hlsInstance = this.videojsInstance.tech({IWillNotUseThisInPlugins: true}).hls;
        //     }
        //
        //     this.captions.forEach((caption) => {
        //         this.videojsInstance.addRemoteTextTrack({
        //             kind: 'captions',
        //             label: ISO6391.getNativeName(caption.language),
        //             mode: 'disabled',
        //             language: caption.language,
        //             src: caption.url,
        //         }, false);
        //     });
        //
        //     // This fixes captions for Airplay
        //     setTimeout(() => {
        //         this.enableCaptions({});
        //     }, 2000);
        //
        //     if (this.isSafari) {
        //         this.videojsInstance.load();
        //     }
        //
        //     this.playerReady = true;
        //     this.$emit('playerReady');
        //
        //     Object.keys(this.videoJsEventHandlers).forEach((event) => {
        //         this.videojsInstance.on(event, this.videoJsEventHandlers[event]);
        //     });
        //
        //
        //     container.focus();
        // });


        // Close drawers on any document click
        document.addEventListener('click', this.closeDrawers);

        // Mouse up events
        document.addEventListener('mouseup', this.mouseUpEventHandler);

        // Add Event Listeners to chapter marker links
        const chapterMarkerLinks = document.querySelectorAll('[data-jump-to-time]');
        Array.from(chapterMarkerLinks).forEach((marker) => {
            marker.addEventListener('click', (event) => {
                const link = event.target;

                this.seek(link.dataset.jumpToTime);

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            });
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
    },
    methods: {
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
            if (!this.canPlayPause) {
                return;
            }

            this.playPause();
        },

        seek(time) {
            const _time = time < 0 ? 0 : time;
            this.currentTime = _time;
            this.mediaElement.pause();

            if (this.isChromeCastConnected) {
                this.chromeCast.seek(_time);
            } else {
                this.mediaElement.currentTime = _time;

                this.mediaElement.play();
            }
        },

        fullscreen() {
            if (this.isFullscreen) {
                document.exitFullscreen();
            } else {
                this.$refs.container.requestFullscreen();
            }
        },

        changeVolume(payload) {
            this.mediaElement.volume = payload.volume / 100;
            this.currentVolume = this.mediaElement.volume;

            if (payload.volume > 0) {
                localStorage.setItem('playerVolume', payload.volume);
            }

            if (this.isChromeCastConnected) {
                this.chromeCast.volume(payload.volume);
            }
        },

        parseTime: time => PlayerUtils.parseTime(time),

        trackMousePosition(event) {
            this.currentMousePosition = PlayerUtils.getMousePosition(event, this.$refs.container);
        },

        setQuality(payload) {
            const { currentTime } = this.mediaElement;

            if (payload === 'auto') {
                this.shakaPlayer.configure({
                    abr: {
                        enabled: true,
                    },
                });
            } else {
                this.shakaPlayer.configure({
                    abr: {
                        enabled: false,
                    },
                });

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
            this.contextMenu = false;

            if (this.isMobile) document.body.classList.remove('drawer-open');
        },

        enableCaptions(payload) {
            const tracks = this.videojsInstance.remoteTextTracks();
            let foundCaptions;

            for (let i = 0; i < tracks.length; i += 1) {
                if (tracks[i].kind === 'captions' && tracks[i].language === payload.language) {
                    tracks[i].mode = 'showing';
                    foundCaptions = tracks[i].language;
                } else {
                    tracks[i].mode = 'disabled';
                }
            }
            this.currentCaptions = foundCaptions || null;

            if (this.isChromeCastConnected) {
                this.chromeCast.changeSubtitle(foundCaptions ? 0 : null);
            }
        },

        enableChromeCast() {
            this.chromeCast.cast({
                content: this.hlsManifestUrl,
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

        enableAirplay() {
            this.$refs.player.webkitShowPlaybackTargetPicker();
        },

        keyboardControlEventHandler(event) {
            console.log(event);

            if (this.keyboardEventHandlers[event.code]) {
                event.stopPropagation();
                event.preventDefault();

                this.keyboardEventHandlers[event.code]();
            }
        },

        triggerMouseDown(event) {
            if (event.button === 0) {
                this.mousedown = true;
            }
        },

        toggleContextMenu() {
            this.contextMenu = true;
            this.getContextMenuPosition();
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
            if (event.button !== 0) {
                return false;
            }

            if (this.mousedown) {
                const timeToSeekTo = this.totalDuration * (
                    this.currentMousePosition.x / this.playerWidth
                );
                this.seek(timeToSeekTo);
            }

            this.contextMenu = false;
            this.mousedown = false;
        },
    },
};
</script>
