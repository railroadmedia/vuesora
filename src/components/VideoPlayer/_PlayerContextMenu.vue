<template>
    <div
        class="vs-context-menu vs-bg-grey-5 vs-hover-bg-grey-4 vs-pointer vs-text-white vs-shadow vs-overflow"
        @click.stop.prevent
    >
        <ul class="vs-list-style-none vs-tiny vs-dense vs-font-bold">
            <li
                class="vs-pa-1"
                @click="keyboardShortcuts = !keyboardShortcuts"
            >
                {{ keyboardShortcuts ? 'Hide' : 'Show' }} Keyboard Shortcuts
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'PlayerContextMenu',
    inheritAttrs: true,
};
</script>