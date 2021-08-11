<template>
    <div
        class="player-error bg-error text-white corners-10 shadow pa-1 text-center"
    >
        <p class="body font-bold mb-2">
            Oops! An error occurred on the player and it can't seem to recover.
        </p>

        <p
            v-if="errorCode"
            class="body dense mb-2"
        >
            Error Code: <br> <strong>{{ errorCode }}</strong>
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
    props: {
        errorCode: {
            type: [Number, String],
            default: () => null,
        },
    },
};
</script>
