<template>
    <div
        class="player-dialog bg-grey-5 text-white corners-3 shadow pa-1"
    >
        <span
            class="close-shortcuts body text-grey-3 hover-text-white pointer"
            @click="close"
        >
            <i class="fas fa-times"></i>
        </span>

        <table class="dense">
            <thead class="body font-bold">
                <tr>
                    <td>
                        Key
                    </td>
                    <td>
                        Action
                    </td>
                </tr>
            </thead>
            <tbody class="tiny">
                <tr>
                    <td class="font-bold">
                        Spacebar
                    </td>
                    <td class="text-grey-3">
                        Play/Pause
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Up Arrow
                    </td>
                    <td class="text-grey-3">
                        Volume up
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Down Arrow
                    </td>
                    <td class="text-grey-3">
                        Volume down
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Left Arrow
                    </td>
                    <td class="text-grey-3">
                        Rewind 10 seconds
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Right Arrow
                    </td>
                    <td class="text-grey-3">
                        Forward 10 seconds
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Numbers 0-9
                    </td>
                    <td class="text-grey-3">
                        Percentage of the video to seek to (1 = 10% etc..)
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Home
                    </td>
                    <td class="text-grey-3">
                        Seek to the beginning
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        End
                    </td>
                    <td class="text-grey-3">
                        Seek to the end
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        F
                    </td>
                    <td class="text-grey-3">
                        Toggle fullscreen
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        M
                    </td>
                    <td class="text-grey-3">
                        Mute
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        -
                    </td>
                    <td class="text-grey-3">
                        Slow down playback rate
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        +
                    </td>
                    <td class="text-grey-3">
                        Speed up playback rate
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'PlayerShortcuts',
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>
