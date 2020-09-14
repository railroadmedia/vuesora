<template>
    <div class="vs-settings-drawer vs-captions vs-bg-grey-5 vs-text-white vs-shadow vs-overflow">
        <div class="vs-flex vs-flex-column">
            <div class="vs-flex vs-flex-row">
                <div class="vs-flex vs-flex-column">
                    <ul class="vs-list-style-none vs-body vs-text-right vs-dense vs-font-bold">
                        <li
                            v-for="caption in captionOptions"
                            :key="caption.language"
                            class="vs-pa-1 vs-hover-bg-grey-4 vs-pointer vs-relative"
                            :class="[{ 'vs-selected-caption': isSelected(caption) }, isSelected(caption) ? themeTextClass : '']"
                            @click="selectCaptionHandler(caption)"
                        >
                            {{ caption.label }}
                        </li>
                        <li
                            class="vs-pa-1 vs-hover-bg-grey-4 vs-pointer vs-relative"
                            :class="isOff ? [themeTextClass, 'vs-selected-caption'] : ''"
                            @click="selectCaptionHandler(null)"
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

        isCaptionsEnabled: {
            type: Boolean,
            default: () => null,
        },
    },

    computed: {
        isOff() {
            return !this.isCaptionsEnabled;
        },
    },

    methods: {
        isSelected(caption) {
            return caption.mode === 'showing';
        },

        selectCaptionHandler(caption) {
            this.$emit('captionsSelected', caption);
        },
    },
};
</script>
