<template>
    <div
        class="player-dialog bg-grey-5 text-white corners-10 shadow pa-1"
    >
        <span
            class="close-shortcuts body text-grey-3 hover-text-white pointer"
            @click="close"
        >
            <i class="fas fa-times"></i>
        </span>

        <table class="dense">
            <tbody class="tiny">
                <tr>
                    <td class="font-bold">
                        Current Resolution
                    </td>
                    <td class="text-grey-3">
                        {{ playerStats.width }}x{{ playerStats.height }}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Frames Dropped/Total
                    </td>
                    <td class="text-grey-3">
                        {{ playerStats.droppedFrames }} / {{ playerStats.decodedFrames }}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Connection Speed
                    </td>
                    <td class="text-grey-3">
                        {{ Math.floor(playerStats.estimatedBandwidth / 1000) }} Kbps
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Play Time
                    </td>
                    <td class="text-grey-3">
                        {{ parseTime(playerStats.playTime) }}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Pause Time
                    </td>
                    <td class="text-grey-3">
                        {{ parseTime(playerStats.pauseTime) }}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">
                        Buffer Time
                    </td>
                    <td class="text-grey-3">
                        {{ parseTime(playerStats.bufferingTime) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import PlayerUtils from './player-utils';

export default {
    name: 'PlayerStats',
    props: {
        playerStats: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },

        parseTime: time => PlayerUtils.parseTime(time),
    },
};
</script>
