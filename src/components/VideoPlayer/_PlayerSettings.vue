<template>
    <div class="flex flex-column player-button relative">
        <player-button :themeColor="themeColor"
                       @click.native.stop="drawer = !drawer">
            <i class="fas fa-cog"></i>
        </player-button>

        <transition name="slide-fade">
            <div v-if="drawer"
                 class="settings-drawer bg-grey-5 text-white shadow corners-3 overflow">

                <div class="flex flex-column">
                    <div class="flex flex-row pa hover-bg-grey-4 bb-grey-4-1 pointer noselect"
                         @click.stop="openQualities">
                        <div class="flex flex-column">
                            <p class="body dense">Quality</p>
                        </div>
                        <div class="flex flex-column selected-setting">
                            <p class="body dense font-bold text-right"
                               :class="themeTextClass">
                                {{ currentSourceLabel }}
                            </p>
                        </div>
                    </div>

                    <transition name="show-from-bottom">
                        <div class="flex flex-row bb-grey-4-1" v-if="qualitiesDropdown">
                            <div class="flex flex-column">
                                <ul class="list-style-none body text-right dense">
                                    <li v-for="(quality, i) in playbackQualities"
                                        class="pa-1 hover-bg-grey-4 pointer"
                                        :class="quality.source === currentSource ? themeTextClass : ''"
                                        @click="setQuality(i)">
                                        {{ quality.label }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </transition>

                    <div class="flex flex-row pa hover-bg-grey-4 pointer noselect"
                         @click.stop="openRates">
                        <div class="flex flex-column">
                            <p class="body dense">Playback Rate:</p>
                        </div>
                        <div class="flex flex-column selected-setting">
                            <p class="body dense font-bold text-right"
                               :class="themeTextClass">{{ currentPlaybackRate }}x</p>
                        </div>
                    </div>

                    <transition name="show-from-bottom">
                        <div class="flex flex-row bt-grey-4-1" v-if="ratesDropdown">
                            <div class="flex flex-column">
                                <ul class="list-style-none body text-right dense">
                                    <li v-for="rate in playbackRates"
                                        class="pa-1 hover-bg-grey-4 pointer"
                                        :class="rate === currentPlaybackRate ? themeTextClass : ''"
                                        @click="setRate(rate)">
                                        {{ rate }}x
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import PlayerButton from "./_PlayerButton";
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

            currentPlaybackRate: {
                type: Number,
                default: () => 1
            },

            playbackQualities: {
                type: Array,
                default: () => []
            }
        },
        data(){
            return {
                drawer: false,
                qualitiesDropdown: false,
                ratesDropdown: false,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5],
            }
        },
        computed: {
            currentSourceLabel(){
                // return this.playbackQualities ? this.playbackQualities.filter(quality =>
                //     quality.source === this.currentSource
                // )[0].label : null;

                return '????';
            }
        },
        methods: {
            closeDrawer(){
                this.drawer = false;
                this.qualitiesDropdown = false;
                this.ratesDropdown = false;
            },

            openQualities(){
                this.qualitiesDropdown = true;
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
        mounted(){
            document.addEventListener('click', this.closeDrawer);

            this.$parent.$on('userinactive', this.closeDrawer);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDrawer);
        }
    }
</script>