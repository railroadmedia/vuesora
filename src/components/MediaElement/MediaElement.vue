<template>
    <div class="flex flex-column">
        <div class="widescreen">
            <div
                :id="themeColor + 'Theme'"
                class="media-element"
            >
                <video
                    v-if="sortedSourcesArray.length"
                    :id="elementId"
                    :poster="poster"
                    :data-cast-title="castTitle"
                    :data-cast-description="castDescription"
                    :data-cast-poster="poster"
                    class="mejs__player"
                    playsinline
                >

                    <source
                        v-for="(source, i) in sortedSourcesArray"
                        :key="i"
                        :src="source.file"
                        :data-quality="sourceQualityLabel(source.height)"
                        type="video/mp4"
                    >
                </video>

                <div
                    v-else
                    id="errorContainer"
                    class="flex flex-row pv-5"
                >
                    <div class="flex flex-column align-center text-center">
                        <img
                            src="https://dmmior4id2ysr.cloudfront.net/icons/emoji-doh.svg"
                            class="error-icon mb-2"
                        >
                        <h1 class="title text-white">
                            Oops, something went wrong!<br>
                            Please refresh or contact support.
                        </h1>
                        <h6 class="tiny text-white">
                            to contact support click the chat widget on the bottom of your screen,<br>
                            or send an email to
                            <a :href="'mailto:support@' + brand + '.com'" class="text-white">support@{{ brand }}.com</a>.
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';
import 'mediaelement-plugins/src/quality/quality';
import 'mediaelement-plugins/src/quality/quality.css';
import 'mediaelement-plugins/src/speed/speed';
import 'mediaelement-plugins/src/speed/speed.css';
import 'mediaelement-plugins/src/markers/markers';
import 'mediaelement-plugins/src/jump-forward/jump-forward';
import 'mediaelement-plugins/src/jump-forward/jump-forward.css';
import 'mediaelement-plugins/src/skip-back/skip-back';
import 'mediaelement-plugins/src/skip-back/skip-back.css';
import 'mediaelement-plugins/src/airplay/airplay';
import 'mediaelement-plugins/src/airplay/airplay.css';
import * as QueryString from 'query-string';
import Utils from '../../assets/js/classes/utils';
import Toasts from '../../assets/js/classes/toasts';

export default {
    name: 'VideoMediaElement',
    props: {
        elementId: {
            type: String,
            default: () => 'mediaElementPlayer',
        },
        sources: {
            type: Array,
            default: () => [],
        },
        hlsManifestUrl: {
            type: String,
            default: () => '',
        },
        poster: {
            type: String,
            default: () => '',
        },
        brand: {
            type: String,
            default: () => 'recordeo',
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        checkForTimecode: {
            type: Boolean,
            default: () => false,
        },
        castTitle: {
            type: String,
            default: () => null,
        },
        castDescription: {
            type: String,
            default: () => null,
        },
        isLiked: {
            type: Boolean,
            default: () => false,
        },
        likeCount: {
            type: Number | String,
            default: () => 0,
        },
        chapters: {
            type: Array,
            default: () => [],
        },
        contentId: {
            type: [String, Number],
            default: () => null,
        },
        userId: {
            type: [String, Number],
            default: () => null,
        },
        progressState: {
            type: String,
            default: () => null,
        },
        currentSecond: {
            type: [String, Number],
            default: () => 0,
        },
        videoId: {
            type: [String, Number],
            default: () => null,
        },
        videoLength: {
            type: [String, Number],
            default: () => null,
        },
    },
    data() {
        return {
            mediaElement: Object,
            player: Object,
            events: [
                'loadedmetadata',
                'progress',
                'timeupdate',
                'seeking',
                'seeked',
                'canplay',
                'play',
                'playing',
                'pause',
                'ended',
                'volumechange',
                'captionschange',
            ],
            contextMenu: false,
            currentTimeInSeconds: 0,
        };
    },
    computed: {
        sortedSourcesArray() {
            if (this.sources.length) {
                return this.sources.sort(
                    Utils.dynamicSort('-height'),
                );
            }

            return [];
        },

        urlWithTimecode() {
            return `${location.protocol}//${location.host}${location.pathname}?time=${Math.floor(this.currentTimeInSeconds)}`;
        },

        defaultQuality: {
            get() {
                let defaultQuality = window.localStorage.getItem('defaultQuality');
                const guessedQuality = this.sortedSourcesArray.filter(source => source.width <= window.innerWidth);

                // Pick a default quality based on the closest size to the client width
                if ((defaultQuality === undefined || defaultQuality === null)
                        && (this.sortedSourcesArray.length > 0)) {
                    if (guessedQuality.length) {
                        // If we have some guessed qualities take the first one
                        defaultQuality = this.sourceQualityLabel(
                            guessedQuality[0].height,
                        );
                    } else {
                        // Otherwise take the last item in the qualities array (the smallest quality)
                        defaultQuality = this.sourceQualityLabel(
                            this.sortedSourcesArray[this.sortedSourcesArray.length - 1].height,
                        );
                    }
                } else {
                    const thisHeight = Number(defaultQuality.replace('p', ''));
                    const defaultExists = this.sortedSourcesArray.filter(source => source.height === thisHeight).length > 0;

                    if (!defaultExists) {
                        if (guessedQuality.length) {
                            // If we have some guessed qualities take the first one
                            defaultQuality = this.sourceQualityLabel(
                                guessedQuality[0].height,
                            );
                        } else {
                            // Otherwise take the last item in the qualities array (the smallest quality)
                            defaultQuality = this.sourceQualityLabel(
                                this.sortedSourcesArray[this.sortedSourcesArray.length - 1].height,
                            );
                        }
                    }
                }

                return defaultQuality;
            },
            set(val) {
                window.localStorage.setItem('defaultQuality', val);
            },
        },

        playerPlugins() {
            const pluginsMap = {
                playpause: true,
                skipback: true,
                jumpforward: true,
                current: true,
                duration: true,
                progress: true,
                quality: true,
                speed: true,
                volume: true,
                // 'chromecast': this.castTitle != null,
                airplay: true,
                fullscreen: true,
                markers: this.chapters.length > 0,
            };
            const mapArray = [];

            Object.keys(pluginsMap).forEach((map) => {
                if (pluginsMap[map] === true) {
                    mapArray.push(map);
                }
            });

            return mapArray;
        },

        readyState: {
            cache: false,
            get() {
                return this.mediaElement ? 0 : this.mediaElement.readyState;
            },
        },
    },
    mounted() {
        window[this.elementId] = this.initializeVideoPlayer();

        if (this.elementId === 'lessonPlayer') {
            this.initializeChapterMarkerLinks();
        }

        this.$root.$on('pauseVideos', () => {
            this.pauseVideo();
        });
    },
    beforeDestroy() {
        const vm = this;

        vm.removeMediaElementEventListeners(vm.mediaElement);
    },
    methods: {
        playVideo() {
            this.mediaElement.play();
        },

        pauseVideo() {
            this.mediaElement.pause();
        },

        emitEvent(event) {
            if (event.type === 'timeupdate') {
                this.currentTimeInSeconds = this.mediaElement.getCurrentTime();
            }

            this.$emit(event.type, {
                ...event,
                progressState: this.progressState,
                contentId: this.contentId,
                videoId: this.videoId,
                currentSecond: this.currentSecond,
                videoLength: this.videoLength,
                instance: this,
            });
        },

        emitCustomEvent(event) {
            const isQuality = Array.from(event.target.classList).indexOf('mejs__qualities-selector-input') !== -1;

            if (isQuality) {
                this.$emit('qualityChange', event);

                this.defaultQuality = event.target.value;
            }

            event.target.blur();
        },

        addMediaElementEventListeners(mediaElement) {
            const vm = this;

            vm.events.forEach((event) => {
                mediaElement.addEventListener(event, vm.emitEvent);
            });
        },

        removeMediaElementEventListeners(mediaElement) {
            const vm = this;

            vm.events.forEach((event) => {
                mediaElement.removeEventListener(event, vm.emitEvent);
            });
        },

        sourceQualityLabel(height) {
            if (height >= 2160) {
                return '4k';
            }

            return `${String(height)}p`;
        },

        copyTimecodeToClipboard() {
            const timecode = document.getElementById('currentTimeInSeconds');

            timecode.select();
            document.execCommand('copy');

            setTimeout(() => {
                timecode.blur();
            }, 100);

            Toasts.push({
                icon: 'happy',
                title: 'SHARE THE LOVE!',
                message: 'This URL has been copied, and is ready to share!',
            });
        },

        jumpToTime(timeInSeconds, play = false) {
            // if(this.mediaElement.readyState === 4){
            this.mediaElement.setCurrentTime(timeInSeconds);
            // }

            if (play && !this.isChromeCastConnected) {
                setTimeout(() => {
                    this.mediaElement.play();
                }, 100);
            }
        },

        initializeVideoPlayer() {
            const vm = this;
            const urlParams = QueryString.parse(window.location.search);

            return new MediaElementPlayer(vm.elementId, {
                defaultVideoWidth: 1280,
                defaultVideoHeight: 720,
                autosizeProgress: false,
                startVolume: 1,
                preload: 'metadata',
                // stretching: 'responsive',
                stretching: 'fill',
                setDimensions: false,
                enableAutosize: false,
                features: vm.playerPlugins,
                jumpForwardInterval: 10,
                skipBackInterval: 10,
                speeds: ['0.5', '0.75', '1.00', '1.25', '1.5'],
                timeAndDurationSeparator: ' / ',
                defaultQuality: vm.defaultQuality,
                qualityText: 'Video Quality',
                markers: vm.chapters,
                markerWidth: 3,
                markerColor: '#ffffff',
                success: (mediaElement, node, player) => {
                    vm.mediaElement = mediaElement;
                    vm.addMediaElementEventListeners(vm.mediaElement);

                    vm.mediaElement.load();
                    vm.mediaElement.addEventListener('loadedmetadata', (event) => {
                        // Below code helps to fix the bug where the speed and
                        // quality selectors remain visible and bug out after clicking
                        // Still a work in progress
                        const interactionInputs = document.querySelectorAll('.mejs__qualities-selector-input, .mejs__speed-selector-input');
                        for (let i = 0; i < interactionInputs.length; i++) {
                            interactionInputs[i].addEventListener('change', this.emitCustomEvent);
                        }

                        player.container.addEventListener('touchstart', () => {
                            player.showControls();

                            if (!player.paused) {
                                player.startControlsTimer(player.options.controlsTimeoutMouseLeave);
                            }
                        });

                        if (this.currentSecond > 0 && urlParams.time == null) {
                            setTimeout(() => {
                                vm.jumpToTime(this.currentSecond, false);
                            }, 200);
                        }

                        if (this.checkForTimecode && urlParams.time != null) {
                            setTimeout(() => {
                                vm.jumpToTime(urlParams.time, false);
                            }, 200);
                        }

                        if (vm.elementId === 'lessonPlayer') {
                            vm.initializeCopyTimecodeCommand(vm);
                        }
                    });
                },
                error: (error) => {
                    console.error(error);
                },
            });
        },

        initializeCopyTimecodeCommand(vm) {
            // Copy the current timecode if the user hits ctrl + shift + alt +  c;
            const keyMap = {};
            ['keydown', 'keyup'].forEach((eventType) => {
                document.addEventListener(eventType, (e) => {
                    e = e || event;
                    keyMap[e.keyCode] = e.type === 'keydown';

                    if (keyMap[17] && keyMap[16] && keyMap[18] && keyMap[67]) {
                        vm.copyTimecodeToClipboard();
                    }
                });
            });
        },

        initializeChapterMarkerLinks() {
            document.body.addEventListener('click', (event) => {
                if (event.target.dataset.jumpToTime) {
                    this.jumpToTime(
                        event.target.dataset.jumpToTime,
                        true,
                    );

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss">
    @import '../../assets/sass/partials/variables';

    @each $key, $value in $brand_colors {
        ##{$key}Theme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
    }
    @each $key, $value in $content_colors {
        ##{$key}Theme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
        ##{$key}sTheme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
    }

    #errorContainer {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;

        @include xSmallOnly {
            .title {
                font-size:14px;
            }
        }

        .error-icon {
            height:50px;
            min-height:50px;
            width:auto;

            @include small {
                height:150px;
                min-height:150px;
            }
        }
    }

    .media-element {

        .mejs__controls {
            height:96px;
        }

        .mejs__time-rail {
            position:absolute;
            bottom:4em;
            left:0;
            right:0;
            width:100%;
            box-sizing:border-box;
            padding:1em 1em 0;
            margin:0;
            height:16px;

            .mejs__time-total {
                width:calc(100% - 2em);
                height:6px;
                margin-top:0;
            }

            .mejs__time-marker {
                height:6px;
                pointer-events:none;
            }

            .mejs__time-current {
                background:#0b76db;
            }

            .mejs__time-buffering, .mejs__time-current, .mejs__time-hovered, .mejs__time-loaded {
                height:6px;
            }

            .mejs__time-handle, .mejs__time-handle-content {
                display:none;
            }
        }

        .mejs__fill-container {
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;

            .mejs__overlay {
                width:100%;
                height:100%;
            }

            .mejs__player {
                width:100%;
                height:100%;
                object-fit:contain;
            }
        }

        .mejs__skip-back-button {
            position:absolute;
            bottom:5em;
            left:1em;
        }

        .mejs__jump-forward-button {
            position:absolute;
            bottom:5em;
            right:1em;
        }

        .mejs__playpause-button {
            position:absolute;
            bottom:0;
            left:1em;
        }

        .mejs__time {
            position:absolute;
            bottom:0;
            left:5em;
        }

        .mejs__fullscreen-button {
            position:absolute;
            bottom:0;
            right:1em;
        }

        .mejs__volume-button {
            position:absolute;
            bottom:0;
            left:14.5em;
        }

        .mejs__chromecast-button,
        .mejs__airplay-button {
            position:absolute;
            bottom:0;
            right:14em;
        }

        .mejs__speed-button {
            position:absolute;
            bottom:0;
            right:5.5em;

            button {
                font-weight:700;
                font-family:'Open Sans', sans-serif;
            }

            .mejs__speed-selector {
                height:125px;

                .mejs__speed-selector-list-item {
                    margin:0;
                    padding:3px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4) !important;
                    }
                }
                .mejs__speed-selector-label {
                    font-weight:700;
                    font-family:'Open Sans', sans-serif;
                    margin-left:5px;

                    &.mejs__speed-selected {
                        color:#0b76db;
                    }
                }
            }
        }

        .mejs__qualities-button {
            position:absolute;
            bottom:0;
            right:10em;

            button {
                font-weight:700;
                font-family:'Open Sans', sans-serif;
            }

            .mejs__qualities-selector {

                .mejs__qualities-selector-list-item {
                    margin:0;
                    padding:3px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4) !important;
                    }
                }
                .mejs__qualities-selector-label {
                    font-weight:700;
                    font-family:'Open Sans', sans-serif;
                    margin-left:5px;

                    &.mejs__qualities-selected {
                        color:#0b76db;
                    }
                }
            }
        }
    }

    #currentTimeInSeconds {
        opacity:0;
        position:absolute;
        top:-9999px;
        left:-9999px;
    }
</style>
