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
                class="buffer-fill bg-grey-3"
                :style="bufferTransforms"
            ></div>
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
        bufferedPercent: {
            type: Number,
            default: () => 0,
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
                return {
                    transform: `translateX(-${(100 - (this.currentMouseX / this.playerWidth) * 100)}%)`,
                    '-webkit-transform': `translateX(-${100 - ((this.currentMouseX / this.playerWidth) * 100)}%)`,
                };
            }

            return {
                transform: `translateX(-${100 - this.currentProgress}%)`,
                '-webkit-transform': `translateX(-${100 - this.currentProgress}%)`,
            };
        },

        bufferTransforms() {
            return {
                transform: `translateX(-${100 - (this.bufferedPercent * 100)}%)`,
                '-webkit-transform': `translateX(-${100 - (this.bufferedPercent * 100)}%)`,
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
                transform: `translateX(${offset}px)`,
                '-webkit-transform': `translateX(${offset}px)`,
            };
        },

        toolTipValue() {
            return PlayerUtils.parseTime((this.currentMouseX / 100) * this.totalDuration);
        },
    },
};
</script>
