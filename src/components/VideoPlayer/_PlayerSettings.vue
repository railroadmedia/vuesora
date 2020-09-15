<template>
    <div class="vs-settings-drawer vs-bg-grey-5 vs-text-white vs-shadow vs-overflow">
        <div class="flex flex-column">
            <div
                class="vs-flex vs-flex-row vs-pa vs-hover-bg-grey-4 vs-bb-grey-4-1 vs-pointer vs-noselect"
                :class="isSingleSource ? 'vs-bg-grey-4' : ''"
                @click.stop="toggleQualities"
            >
                <div class="vs-flex vs-flex-column">
                    <p class="vs-body vs-dense vs-font-bold">
                        Quality:
                    </p>
                </div>
                <div class="vs-flex vs-flex-column vs-align-v-center">
                    <p
                        class="vs-tiny vs-dense vs-font-bold vs-text-right"
                        :class="themeTextClass"
                    >
                        {{ currentSourceLabel }}
                        <i
                            class="fas vs-ml-1"
                            :class="qualitiesDropdown ? 'fa-caret-down' : 'fa-caret-up'"
                        ></i>
                    </p>
                </div>
            </div>

            <div
                v-show="qualitiesDropdown"
                class="vs-flex vs-flex-row vs-bb-grey-4-1"
            >
                <div class="vs-flex vs-flex-column">
                    <ul class="vs-list-style-none vs-tiny vs-text-right vs-dense vs-font-bold">
                        <li
                            v-for="quality in playbackQualities"
                            :key="quality.label"
                            class="vs-pa-1 vs-hover-bg-grey-4 vs-pointer"
                            :class="quality.file === currentSource ? themeTextClass : ''"
                            @click="setQuality(quality)"
                        >
                            {{ quality.label }}
                        </li>

<!--                        <li-->
<!--                            class="pa-1 hover-bg-grey-4 pointer"-->
<!--                            :class="[isAbrEnabled ? themeTextClass : '']"-->
<!--                            @click="setQuality('auto')"-->
<!--                        >-->
<!--                            Auto-->
<!--                        </li>-->
                    </ul>
                </div>
            </div>

            <div
                class="vs-flex vs-flex-row vs-pa vs-hover-bg-grey-4 vs-pointer vs-noselect"
                @click.stop="toggleRates"
            >
                <div class="vs-flex vs-flex-column">
                    <p class="vs-body vs-dense vs-font-bold">
                        Playback Rate:
                    </p>
                </div>
                <div class="vs-flex vs-flex-column vs-align-v-center">
                    <p
                        class="vs-tiny vs-dense vs-font-bold vs-text-right"
                        :class="themeTextClass"
                    >
                        {{ currentPlaybackRate }}x
                        <i
                            class="fas vs-ml-1"
                            :class="ratesDropdown ? 'fa-caret-down' : 'fa-caret-up'"
                        ></i>
                    </p>
                </div>
            </div>

            <div
                v-show="ratesDropdown"
                class="vs-flex vs-flex-row vs-bt-grey-4-1"
            >
                <div class="vs-flex vs-flex-column vs-align-v-center">
                    <ul class="vs-list-style-none vs-tiny vs-text-right vs-dense vs-font-bold">
                        <li
                            v-for="rate in playbackRates"
                            :key="`playbackRate-${rate}`"
                            class="vs-pa-1 vs-hover-bg-grey-4 vs-pointer"
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

        currentPlaybackRate: {
            type: Number,
            default: () => 1,
        },

        playbackQualities: {
            type: Array,
            default: () => [],
        },

        isAbrEnabled: {
            type: Boolean,
            default: () => false,
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
            const currentQuality = this.playbackQualities.find(quality => quality.file === this.currentSource);

            if (this.isAbrEnabled) {
                if (!this.isSingleSource) {
                    return currentQuality ? `Auto (${currentQuality.label})` : 'Auto';
                }

                return 'Auto';
            }

            if (currentQuality) {
                return currentQuality.label;
            }

            return 'Auto';
        },

        isSingleSource() {
            return this.playbackQualities.length <= 1;
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
        toggleQualities() {
            if (this.isSingleSource) {
                return;
            }

            this.qualitiesDropdown = !this.qualitiesDropdown;
            this.ratesDropdown = false;
        },

        toggleRates() {
            this.qualitiesDropdown = false;
            this.ratesDropdown = !this.ratesDropdown;
        },

        setQuality(quality) {
            this.$emit('setQuality', quality);
        },

        setRate(rate) {
            this.$emit('setRate', { rate });
        },
    },
};
</script>
