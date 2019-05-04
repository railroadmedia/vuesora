<template>
    <div class="player-progress"
         @drag.prevent.stop
         @dragstart.prevent.stop
         @dragenter.prevent.stop>
        <div class="progress-tooltip tiny text-white"
             :style="toolTipOffset">
            {{ toolTipValue }}
        </div>

        <div class="progress-rail">
            <div class="progress-fill"
                 :class="themeBgClass"
                 :style="progressTransforms"></div>
        </div>
    </div>
</template>
<script>
    import PlayerUtils from './player-utils';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-progress',
        props: {
            currentProgress: {
                type: Number,
                default: () => 0
            },
            playerWidth: {
                type: Number,
                default: () => 0
            },
            currentMouseX: {
                type: Number,
                default: () => 0
            },
            mousedown: {
                type: Boolean,
                default: () => false
            },
            totalDuration: {
                type: Number,
                default: () => 0
            }
        },
        data(){
            return {
                toolTipOffset: 0,
                toolTipInterval: null,
            }
        },
        computed: {
            progressTransforms(){
                if(this.mousedown){
                    return {
                        'transform': 'translateX(-' + (100 - this.currentMouseX) + '%)',
                        '-webkit-transform': 'translateX(-' + (100 - this.currentMouseX) + '%)',
                    }
                }

                return {
                    'transform': 'translateX(-' + (100 - this.currentProgress) + '%)',
                    '-webkit-transform': 'translateX(-' + (100 - this.currentProgress) + '%)',
                }
            },

            currentOffsetLeft: {
                cache: false,
                get(){
                    return document.querySelector('[data-vjs-player]').parentElement.offsetLeft;
                }
            },

            toolTipValue(){
                return PlayerUtils.parseTime((this.currentMouseX / 100) * this.totalDuration);
            }
        },
        methods: {
            getToolTipOffset(){
                let offset = (this.currentMouseX / 100) * this.playerWidth;

                if (offset < 25) {
                    offset = 25;
                } else if (offset > (this.playerWidth - 25)) {
                    offset = this.playerWidth - 25;
                }

                return {
                    'transform': 'translateX(' + offset + 'px)',
                }
            }
        },
        mounted(){
            this.toolTipInterval = setInterval(() => {
                this.toolTipOffset = this.getToolTipOffset();
            }, 100);
        },
        beforeDestroy() {
            clearInterval(this.toolTipInterval);
        }
    }
</script>