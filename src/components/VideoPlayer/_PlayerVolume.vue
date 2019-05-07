<template>
    <div class="flex flex-column volume">
        <div class="flex flex-row align-v-center">
            <div class="flex flex-column volume-rail-wrap">
                <div class="volume-rail">
                    <div class="volume-fill"
                         :style="volumeOffset"
                         :class="themeBgClass"></div>

                    <input type="range"
                           class="volume-range"
                           min="0"
                           max="100"
                           :value="currentVolume"
                           @input="emitVolumeChange">
                </div>
            </div>

            <player-button :themeColor="themeColor"
                           :active="currentVolume === 0"
                           @click.native.stop="emitVolumeChange(0)">
                <i class="fas" :class="volumeButtonClass"></i>
            </player-button>
        </div>
    </div>
</template>
<script>
    import PlayerButton from "./_PlayerButton.vue";
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-volume',
        components: {
            'player-button': PlayerButton
        },
        props: {
            currentVolume: {
                type: Number,
                default: () => 1
            }
        },
        data(){
            return {
                volumeCache: this.currentVolume
            }
        },
        computed: {
            volumeOffset(){
                return {
                    'transform': 'translateX(-' + (100 - (this.currentVolume * 100)) + '%)'
                }
            },

            volumeButtonClass(){
                return {
                    'fa-volume-slash': this.currentVolume === 0,
                    'fa-volume-down': this.currentVolume > 0 && this.currentVolume < 0.5,
                    'fa-volume-up': this.currentVolume >= 0.5,
                }
            }
        },
        methods: {
            emitVolumeChange(event){
                if(event){
                    this.$emit('volumeChange', {
                        volume: event.target.value
                    })
                }
                else {
                    let volume = this.volumeCache * 100;

                    if(this.currentVolume){
                        volume = 0;
                        this.volumeCache = this.currentVolume;
                    }

                    this.$emit('volumeChange', {
                        volume: volume
                    })
                }
            }
        }
    }
</script>