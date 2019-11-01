<template>
    <div
        class="player-progress"
        @click.stop
        @drag.prevent.stop
        @dragstart.prevent.stop
        @dragenter.prevent.stop
    >
        <div
            class="progress-tooltip tiny text-white"
            :style="toolTipOffset"
        >
            {{ toolTipValue }}
        </div>

        <div class="progress-rail">
            <div
                class="progress-fill"
                :class="themeBgClass"
                :style="progressTransforms"
            ></div>

            <div
                v-for="(range, i) in bufferedTimeRanges"
                :key="`range-${i}`"
                class="buffer-fill bg-grey-3"
                :style="getTimeRangePosition(range)"
            ></div>

            <span
                v-for="(chapter, i) in chapters"
                :key="`chapter-${i}`"
                class="chapter-marker"
                :class="chapter.chapter_timecode > currentTime ? themeBgClass : 'bg-white'"
                :style="getChapterPosition(chapter)"
            ></span>
        </div>
    </div>
</template>
<script>
import PlayerUtils from './player-utils';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayerProgress',
    mixins: [ThemeClasses],
    props: {
        currentProgress: {
            type: Number,
            default: () => 0,
        },

        currentTime: {
            type: Number,
            default: () => 0,
        },

        playerWidth: {
            type: Number,
            default: () => 0,
        },

        currentMouseX: {
            type: Number,
            default: () => 0,
        },

        mousedown: {
            type: Boolean,
            default: () => false,
        },

        totalDuration: {
            type: Number,
            default: () => 0,
        },

        bufferedTimeRanges: {
            type: Array,
            default: () => [],
        },

        chapters: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            toolTipInterval: null,
        };
    },
    computed: {
        progressTransforms() {
            if (this.mousedown) {
                const offset = PlayerUtils.getTimeRailMouseEventOffsetPercentage(
                    this.currentMouseX,
                    this.playerWidth,
                );

                return {
                    transform: `translateX(-${100 - (offset * 100)}%)`,
                    '-webkit-transform': `translateX(-${100 - (offset * 100)}%)`,
                };
            }

            return {
                transform: `translateX(-${100 - this.currentProgress}%)`,
                '-webkit-transform': `translateX(-${100 - this.currentProgress}%)`,
            };
        },

        currentOffsetLeft: {
            cache: false,
            get() {
                return document.querySelector('[data-vjs-player]').parentElement.offsetLeft;
            },
        },

        toolTipOffset() {
            let offset = this.currentMouseX;

            if (offset < 25) {
                offset = 25;
            } else if (offset > (this.playerWidth - 25)) {
                offset = this.playerWidth - 25;
            }

            return {
                left: `${offset}px`,
            };
        },

        toolTipValue() {
            const offsetPercentage = PlayerUtils.getTimeRailMouseEventOffsetPercentage(
                this.currentMouseX,
                this.playerWidth,
            );

            return PlayerUtils.parseTime(offsetPercentage * this.totalDuration);
        },
    },
    methods: {
        getTimeRangePosition(range) {
            const time = (this.playerWidth - 14) / this.totalDuration;

            return {
                transform: `translateX(${range.start * time}px)`,
                '-webkit-transform': `translateX(${range.start * time}px)`,
                width: `${(range.end * time) - (range.start * time)}px`,
            };
        },

        getChapterPosition(chapter) {
            const time = (this.playerWidth - 14) / this.totalDuration;

            return {
                transform: `translateX(${chapter.chapter_timecode * time}px)`,
                '-webkit-transform': `translateX(${chapter.chapter_timecode * time}px)`,
            };
        },
    },
};
</script>
