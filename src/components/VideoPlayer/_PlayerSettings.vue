<template>
    <div class="flex flex-column player-button relative">
        <player-button :themeColor="themeColor"
                       @click.native="drawer = !drawer">
            <i class="fas fa-cog"></i>
        </player-button>

        <transition name="slide-fade">
            <div v-if="drawer"
                 class="settings-drawer bg-grey-5 text-white shadow corners-3 overflow">
                <div class="flex flex-column">
                    <div class="flex flex-row pa hover-bg-grey-4 pointer noselect">
                        <div class="flex flex-column">
                            <p class="body dense">Quality</p>
                        </div>
                        <div class="flex flex-column selected-setting">
                            <p class="body dense font-bold text-right"
                               :class="themeTextClass">1080p</p>
                        </div>
                    </div>

                    <div class="flex flex-row pa hover-bg-grey-4 pointer noselect">
                        <div class="flex flex-column">
                            <p class="body dense">Playback Rate:</p>
                        </div>
                        <div class="flex flex-column selected-setting">
                            <p class="body dense font-bold text-right"
                               :class="themeTextClass">1x</p>
                        </div>
                    </div>
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
        data(){
            return {
                drawer: false
            }
        }
    }
</script>