<template>
    <div class="flex flex-column player-button">
        <button class="btn collapse-square"
                :class="[themeHoverTextClass]">
            <span class="flat text-white"
                  :class="active ? themeTextClass : ''">
                <slot></slot>
            </span>
        </button>
    </div>
</template>
<script>

    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-button',
        props: {
            active: {
                type: Boolean,
                default: () => false
            }
        }
    }
</script>