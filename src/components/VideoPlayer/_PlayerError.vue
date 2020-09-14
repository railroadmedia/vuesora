<template>
    <div
        class="vs-player-error vs-bg-error vs-text-white vs-corners-3 vs-shadow vs-pa-1 vs-text-center"
    >
        <p class="vs-body vs-font-bold vs-mb-2">
            Oops! An error occurred on the player and it can't seem to recover.
        </p>

        <p
            v-if="errorCode"
            class="vs-body vs-dense vs-mb-2"
        >
            Error Code: <br> <strong>{{ errorCode }}</strong>
        </p>

        <p class="vs-tiny">
            If the issue persists, please contact support using the chat
            widget on the bottom right of your screen.
        </p>
    </div>
</template>

<script>
export default {
    name: 'PlayerError',
    props: {
        errorCode: {
            type: [Number, String],
            default: () => null,
        },
    },
};
</script>
