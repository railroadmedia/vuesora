<template>
    <div>
        <video-media-element
            ref="mediaElementVueInstance"
            :element-id="elementId"
            :brand="brand"
            :theme-color="themeColor"
            :poster="poster"
            :sources="$_range.sources"
            :hls-manifest-url="hlsManifestUrl"
            :video-id="rangesVideoIds[$_range.range]"
            :content-id="contentId"
            :current-second="currentTime"
            :progress-state="progressState"
            :chapters="chapters"
            :user-id="userId"
            :like-count="likeCount"
            :is-liked="isLiked"
            :check-for-timecode="checkForTimecode"
            :range="$_range.range"
            :key="$_range.range"
        >
            <div class="widescreen title text-singeo">
                <i class="fas fa-spinner fa-spin absolute-center"></i>
            </div>
        </video-media-element>
        <PlayerRanges
            :theme-color="themeColor"
            :current-range="currentRange"
            :ranges="Object.keys(ranges)"
            @setRange="setRange"
        ></PlayerRanges>
    </div>
</template>

<script>
import VideoMediaElement from '../MediaElement/MediaElement.vue';
import PlayerRanges from '../VideoPlayer/_PlayerRanges.vue';

export default {
    name: 'RangeMediaElement',
    components: {
        VideoMediaElement,
        PlayerRanges,
    },
    props: {
        elementId: {
            type: String,
            default: () => 'mediaElementPlayer',
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
        ranges: {
            type: Object,
            default: () => ({}),
        },
        rangesVideoIds: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            currentRange: 'original',
            currentTime: 0,
        };
    },
    computed: {
        $_range: {
            cache: false,
            get() {
                return {
                    range: this.currentRange,
                    sources: this.ranges[this.currentRange],
                };
            },
        },
    },
    mounted() {
        this.currentRange = window.localStorage.getItem('currentRange') || 'original';
        this.currentTime = this.currentSecond || 0;
        setTimeout(() => {
            this.attachEventBubbling();
        }, 300);
    },
    methods: {

        setRange({ range }) {
            if (this.ranges[range] && this.ranges[range].length) {

                this.currentTime = this.$refs.mediaElementVueInstance.getCurrentTime();
                this.$refs.mediaElementVueInstance.pauseVideo();
                this.detachEventBubbling();
                this.currentRange = range;

                window.localStorage.setItem('currentRange', range);

                setTimeout(() => {
                    this.$refs.mediaElementVueInstance.playVideo();
                    this.attachEventBubbling();
                }, 300);
            }
        },

        attachEventBubbling() {
            let eventHandler = this.handleEvent;

            this.$refs.mediaElementVueInstance.events.forEach((eventType) => {
                this.$refs.mediaElementVueInstance.$on(
                    eventType,
                    (eventData) => {
                        eventHandler({ type: eventType, event: eventData});
                    }
                );
            });
        },

        detachEventBubbling() {
            let eventHandler = this.handleEvent;

            this.$refs.mediaElementVueInstance.events.forEach((eventType) => {
                this.$refs.mediaElementVueInstance.$off(
                    eventType,
                    (eventData) => {
                        eventHandler({ type: eventType, event: eventData});
                    }
                );
            });
        },

        handleEvent({ type, event }) {
            // todo - add event bubbling logic
            console.log("RangeMediaElement::handleEvent event type: %s, keys: %s", type, JSON.stringify(Object.keys(event)));
        },
    },
}
</script>