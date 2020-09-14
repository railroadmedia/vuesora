<template>
    <div
        class="vs-player-dialog vs-bg-grey-5 vs-text-white vs-corners-3 vs-shadow vs-pa-1"
    >
        <span
            class="vs-close-shortcuts vs-body vs-text-grey-3 vs-hover-text-white vs-pointer"
            @click="close"
        >
            <i class="fas fa-times"></i>
        </span>

        <table class="vs-dense">
            <thead class="vs-body vs-font-bold">
                <tr>
                    <td>
                        Key
                    </td>
                    <td>
                        Action
                    </td>
                </tr>
            </thead>
            <tbody class="vs-tiny">
                <tr>
                    <td class="vs-font-bold">
                        Spacebar
                    </td>
                    <td class="vs-text-grey-3">
                        Play/Pause
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Up Arrow
                    </td>
                    <td class="vs-text-grey-3">
                        Volume up
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Down Arrow
                    </td>
                    <td class="vs-text-grey-3">
                        Volume down
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Left Arrow
                    </td>
                    <td class="vs-text-grey-3">
                        Rewind 5 seconds
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Right Arrow
                    </td>
                    <td class="vs-text-grey-3">
                        Forward 5 seconds
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Numbers 0-9
                    </td>
                    <td class="vs-text-grey-3">
                        Percentage of the video to seek to (1 = 10% etc..)
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        Home
                    </td>
                    <td class="vs-text-grey-3">
                        Seek to the beginning
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        End
                    </td>
                    <td class="vs-text-grey-3">
                        Seek to the end
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        F
                    </td>
                    <td class="vs-text-grey-3">
                        Toggle fullscreen
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        M
                    </td>
                    <td class="vs-text-grey-3">
                        Mute
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        -
                    </td>
                    <td class="vs-text-grey-3">
                        Slow down playback rate
                    </td>
                </tr>
                <tr>
                    <td class="vs-font-bold">
                        +
                    </td>
                    <td class="vs-text-grey-3">
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
