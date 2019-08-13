<template>
    <div
        class="context-menu bg-grey-5 hover-bg-grey-4 pointer text-white shadow overflow"
        @click.stop.prevent
    >
        <ul class="list-style-none tiny dense font-bold">
            <li
                class="pa-1"
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