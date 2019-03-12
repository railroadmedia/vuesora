<template>
    <div class="flex flex-row">
        <div class="player-progress">
            <div class="progress-rail">
                <div class="progress-fill"
                     :class="themeBgClass"
                     :style="progressTransforms"></div>
            </div>
        </div>
    </div>
</template>
<script>

    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-progress',
        props: {
            currentProgress: {
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
            }
        },
        computed: {
            progressTransforms(){
                if(this.mousedown){
                    return {
                        'transform': 'translateX(-' + (100 - this.currentMouseX) + '%)'
                    }
                }

                return {
                    'transform': 'translateX(-' + (100 - this.currentProgress) + '%)',
                }
            },

            currentOffsetLeft: {
                cache: false,
                get(){
                    return document.querySelector('[data-vjs-player]').parentElement.offsetLeft;
                }
            },

            currentPlayerWidth: {
                cache: false,
                get(){
                    return document.querySelector('[data-vjs-player]').clientWidth;
                }
            }
        },
        methods: {
            seekToPosition(event){
                const mouseX = event.clientX || (event.touches[0] ? event.touches[0].clientX : event.changedTouches[0].clientX);
                const percentageToSeekTo = (mouseX - this.currentOffsetLeft) / this.currentPlayerWidth;

                console.log((mouseX - this.currentOffsetLeft));
                console.log(this.currentPlayerWidth);
                console.log(percentageToSeekTo);
            },


        },
        mounted(){
            console.log(this.currentOffsetLeft);

            window.addEventListener('resize', () => {
                console.log(this.currentOffsetLeft);
            })
        }
    }
</script>