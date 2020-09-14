<template>
    <div class="vs-flex vs-flex-column vs-player-button">
        <button
            class="vs-btn vs-collapse-square"
            :title="title"
            :class="!disabled ? themeHoverTextClass : ''"
            :disabled="disabled"
        >
            <span
                class="vs-flat vs-text-white"
                :class="active ? themeTextClass : ''"
            >
                <slot></slot>
            </span>
        </button>
    </div>
</template>
<script>

import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayerButton',
    mixins: [ThemeClasses],
    props: {
        active: {
            type: Boolean,
            default: () => false,
        },
        disabled: {
            type: Boolean,
            default: () => false,
        },
        title: {
            type: String,
            default: () => '',
        },
    },
};
</script>
