<template>
    <div class="settings-drawer captions bg-grey-5 text-white shadow overflow">
        <div class="flex flex-column">
            <div class="flex flex-row">
                <div class="flex flex-column">
                    <ul class="list-style-none body text-right dense font-bold">
                        <li
                            v-for="caption in captionOptions"
                            :key="caption.language"
                            class="pa-1 hover-bg-grey-4 pointer relative"
                            :class="[{ 'selected-caption': isSelected(caption) }, isSelected(caption) ? themeTextClass : '']"
                            @click="selectCaptionHandler(caption)"
                        >
                            {{ caption.label }}
                        </li>
                        <li
                            class="pa-1 hover-bg-grey-4 pointer relative"
                            :class="noCaptions ? [themeTextClass, 'selected-caption'] : ''"
                            @click="selectCaptionHandler({})"
                        >
                            Off
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
    name: 'PlayerCaptions',
    mixins: [ThemeClasses],
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },

        captionOptions: {
            type: Array,
            default: () => [],
        },

        currentCaptions: {
            type: String,
            default: () => null,
        },
    },

    computed: {
        noCaptions() {
            return this.currentCaptions === null;
        },
    },

    methods: {
        isSelected(caption) {
            return caption.language === this.currentCaptions;
        },

        selectCaptionHandler(caption) {
            this.$emit('captionsSelected', caption);
        },
    },
};
</script>
