<template>
    <div
        class="player-error bg-error text-white corners-3 shadow pa-1"
    >
        <p class="body font-bold mb-2">
            No compatible source was found for this video.
        </p>
        <p class="tiny">
            If the issue persists, please contact support using the chat
            widget on the bottom right of your screen.
        </p>
    </div>
</template>

<script>
export default {
    name: 'PlayerError',
};
</script>
