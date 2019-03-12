<template>
    <button class="btn collapse-square"
            :class="themeHoverTextClass">
            <span class="flat text-white">
                <slot></slot>
            </span>
    </button>
</template>
<script>

    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-button',
    }
</script>