<template>
    <div class="settings-drawer bg-grey-5 text-white shadow overflow">

        <div class="flex flex-column">
            <div class="flex flex-row pa hover-bg-grey-4 bb-grey-4-1 pointer noselect"
                 :class="this.currentSourceIndex === -1 ? 'bg-grey-4' : ''"
                 @click.stop="openQualities">
                <div class="flex flex-column">
                    <p class="body dense font-bold">Quality:</p>
                </div>
                <div class="flex flex-column selected-setting">
                    <p class="body dense font-bold text-right"
                       :class="themeTextClass">
                        {{ currentSourceLabel }}
                    </p>
                </div>
            </div>

<!--                    <transition name="show-from-bottom"-->
<!--                                mode="out-in">-->
                <div class="flex flex-row bb-grey-4-1" v-show="qualitiesDropdown">
                    <div class="flex flex-column">
                        <ul class="list-style-none tiny text-right dense font-bold">
                            <li v-for="(quality, i) in playbackQualities"
                                class="pa-1 hover-bg-grey-4 pointer"
                                :class="[i === currentSourceIndex ? themeTextClass : '']"
                                @click="setQuality(i)">
                                {{ quality.label }}
                            </li>
                        </ul>
                    </div>
                </div>
<!--                    </transition>-->

            <div class="flex flex-row pa hover-bg-grey-4 pointer noselect"
                 @click.stop="openRates">
                <div class="flex flex-column">
                    <p class="body dense font-bold">Playback Rate:</p>
                </div>
                <div class="flex flex-column selected-setting">
                    <p class="body dense font-bold text-right"
                       :class="themeTextClass">{{ currentPlaybackRate }}x</p>
                </div>
            </div>

<!--                    <transition name="show-from-bottom"-->
<!--                                mode="out-in">-->
                <div class="flex flex-row bt-grey-4-1" v-show="ratesDropdown">
                    <div class="flex flex-column">
                        <ul class="list-style-none tiny text-right dense font-bold">
                            <li v-for="rate in playbackRates"
                                class="pa-1 hover-bg-grey-4 pointer"
                                :class="rate === currentPlaybackRate ? themeTextClass : ''"
                                @click="setRate(rate)">
                                {{ rate }}x
                            </li>
                        </ul>
                    </div>
                </div>
<!--                    </transition>-->
        </div>
    </div>
</template>
<script>
    import PlayerButton from "./_PlayerButton.vue";
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-settings',
        components: {
            'player-button': PlayerButton
        },
        props: {
            videojsInstance: {
                type: Object
            },

            currentSource: {
                type: String,
                default: () => ''
            },

            currentSourceIndex: {
                type: Number,
            },

            currentPlaybackRate: {
                type: Number,
                default: () => 1
            },

            playbackQualities: {
                type: Array,
                default: () => []
            },

            drawer: {
                type: Boolean,
                default: () => false,
            }
        },
        data(){
            return {
                qualitiesDropdown: false,
                ratesDropdown: false,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5],
            }
        },
        computed: {
            currentSourceLabel(){
                if(this.currentSourceIndex >= 0){
                    return this.playbackQualities[this.currentSourceIndex].label;
                }

                return 'Auto';
            }
        },
        methods: {
            openQualities(){
                if(this.currentSourceIndex >= 0) {
                    this.qualitiesDropdown = true;
                }
                this.ratesDropdown = false;
            },

            openRates(){
                this.qualitiesDropdown = false;
                this.ratesDropdown = true;
            },

            setQuality(index){
                this.$emit('setQuality', { index });
            },

            setRate(rate){
                this.$emit('setRate', { rate });
            }
        },
        watch: {
            drawer(){
                this.qualitiesDropdown = false;
                this.ratesDropdown = false;
            }
        },
        mounted(){
            document.addEventListener('click', this.closeDrawer);

            this.$parent.$on('userinactive', this.closeDrawer);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDrawer);
        }
    }
</script>