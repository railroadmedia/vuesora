<template>
    <div class="settings-drawer bg-grey-5 text-white shadow overflow">
        <div class="flex flex-column">
            <div
                class="flex flex-row pa hover-bg-grey-4 bb-grey-4-1 pointer noselect"
                :class="currentSourceIndex === -1 ? 'bg-grey-4' : ''"
                @click.stop="openQualities"
            >
                <div class="flex flex-column">
                    <p class="body dense font-bold">
                        Quality:
                    </p>
                </div>
                <div class="flex flex-column selected-setting">
                    <p
                        class="body dense font-bold text-right"
                        :class="themeTextClass"
                    >
                        {{ currentSourceLabel }}
                    </p>
                </div>
            </div>

            <div
                v-show="qualitiesDropdown"
                class="flex flex-row bb-grey-4-1"
            >
                <div class="flex flex-column">
                    <ul class="list-style-none tiny text-right dense font-bold">
                        <li
                            v-for="(quality, i) in playbackQualities"
                            :key="quality.label"
                            class="pa-1 hover-bg-grey-4 pointer"
                            :class="[i === currentSourceIndex && !isAutoQuality ? themeTextClass : '']"
                            @click="setQuality(i)"
                        >
                            {{ quality.label }}
                        </li>

                        <li
                            class="pa-1 hover-bg-grey-4 pointer"
                            :class="[isAutoQuality ? themeTextClass : '']"
                            @click="setQuality('auto')"
                        >
                            Auto
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="flex flex-row pa hover-bg-grey-4 pointer noselect"
                @click.stop="openRates"
            >
                <div class="flex flex-column">
                    <p class="body dense font-bold">
                        Playback Rate:
                    </p>
                </div>
                <div class="flex flex-column selected-setting">
                    <p
                        class="body dense font-bold text-right"
                        :class="themeTextClass"
                    >
                        {{ currentPlaybackRate }}x
                    </p>
                </div>
            </div>

            <div
                v-show="ratesDropdown"
                class="flex flex-row bt-grey-4-1"
            >
                <div class="flex flex-column">
                    <ul class="list-style-none tiny text-right dense font-bold">
                        <li
                            v-for="rate in playbackRates"
                            class="pa-1 hover-bg-grey-4 pointer"
                            :class="rate === currentPlaybackRate ? themeTextClass : ''"
                            @click="setRate(rate)"
                        >
                            {{ rate }}x
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayerSettings',
    mixins: [ThemeClasses],
    props: {
        videojsInstance: {
            type: Object,
            default: null,
        },

        currentSource: {
            type: String,
            default: () => '',
        },

        currentSourceIndex: {
            type: Number,
            default: null,
        },

        currentPlaybackRate: {
            type: Number,
            default: () => 1,
        },

        playbackQualities: {
            type: Array,
            default: () => [],
        },

        drawer: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            qualitiesDropdown: false,
            ratesDropdown: false,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        };
    },
    computed: {
        currentSourceLabel() {
            if (this.currentSourceIndex >= 0 && !this.isAutoQuality) {
                return this.playbackQualities[this.currentSourceIndex].label;
            }

            return 'Auto';
        },

        isAutoQuality() {
            const enabledQualities = this.playbackQualities.map(quality => quality.enabled);

            return enabledQualities.indexOf(false) === -1;
        },
    },
    watch: {
        drawer() {
            this.qualitiesDropdown = false;
            this.ratesDropdown = false;
        },
    },
    mounted() {
        document.addEventListener('click', this.closeDrawer);

        this.$parent.$on('userinactive', this.closeDrawer);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDrawer);
    },
    methods: {
        openQualities() {
            if (this.currentSourceIndex >= 0) {
                this.qualitiesDropdown = true;
            }
            this.ratesDropdown = false;
        },

        openRates() {
            this.qualitiesDropdown = false;
            this.ratesDropdown = true;
        },

        setQuality(index) {
            this.$emit('setQuality', { index });
        },

        setRate(rate) {
            this.$emit('setRate', { rate });
        },
    },
};
</script>
