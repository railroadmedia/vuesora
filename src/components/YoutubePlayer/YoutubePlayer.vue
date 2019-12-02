<template>
    <div
        ref="videoWrap"
        class="video-wrap"
        :class="{'picture-in-picture': isPipEnabled}"
    >
        <div class="widescreen">
            <div
                ref="youtubeIframe"
                class="iframe"
            ></div>
        </div>
    </div>
</template>

<script>
import PlayerUtils from "../VideoPlayer/player-utils";

export default {
    name: 'YoutubePlayer',
    props: {
        videoId: {
            type: [String, Number],
            default: () => null,
        },

        currentSecond: {
            type: Number,
            default: () => 0,
        },

        totalDuration: {
            type: Number,
            default: () => 0,
        },

        progressState: {
            type: String,
            default: () => 'unstarted',
        },

        contentId: {
            type: [String, Number],
            default: () => null,
        },

        useIntersectionObserver: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            player: null,
            syncInterval: null,
            currentTime: 0,
            isPipEnabled: false,
        };
    },
    computed: {
        isMobileViewport: {
            cache: false,
            get() {
                return window.matchMedia('(min-width: 641px)').matches === false;
            },
        },
    },
    mounted() {
        const youtubeIframeApi = document.getElementById('youtubeIframeApi');

        if (youtubeIframeApi == null) {
            this.appendIframeApi();

            window.onYouTubeIframeAPIReady = () => {
                this.initPlayer();
            };
        } else {
            this.initPlayer();
        }

        if (this.useIntersectionObserver) {
            this.enableIntersectionObserver();
        }
    },
    beforeDestroy() {
        clearInterval(this.syncInterval);
    },
    methods: {

        appendIframeApi() {
            const scriptTag = document.createElement('script');
            const firstScriptTag = document.querySelector('script');

            scriptTag.setAttribute('id', 'youtubeIframeApi');
            scriptTag.setAttribute('src', 'https://www.youtube.com/iframe_api');

            firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        },

        initPlayer() {
            const { youtubeIframe } = this.$refs;
            const urlParams = new URLSearchParams(window.location.search);
            const timeToSeekTo = urlParams.get('time') || this.currentSecond;
            const vm = this;

            this.player = new YT.Player(youtubeIframe, {
                videoId: this.videoId,
                playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    enablejsapi: 1,
                    playsinline: 1,
                },
                events: {
                    onReady() {
                        if (timeToSeekTo > 0) {
                            vm.player.seekTo(timeToSeekTo);
                            vm.player.pauseVideo();
                        }

                        vm.syncInterval = setInterval(() => {
                            vm.currentTime = vm.player.getCurrentTime();
                        }, 1000);
                    },
                    onStateChange(event) {
                        if (event.data === 1) {
                            vm.$emit('play', {
                                ...event,
                                contentId: vm.contentId,
                                progressState: vm.progressState,
                            });
                        }

                        if (event.data === 2) {
                            vm.$emit('pause', {
                                ...event,
                                contentId: vm.contentId,
                            });
                        }
                    },
                },
            });
        },

        enableIntersectionObserver() {
            this.intersection = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.intersectionRatio >= 0.5;
                    this.isPipEnabled = !isVisible && !this.isMobileViewport;
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            });
            this.intersection.observe(this.$refs.videoWrap.parentElement);
        },
    },
};
</script>
