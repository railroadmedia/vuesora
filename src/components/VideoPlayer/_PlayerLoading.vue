<template>
    <div
        class="loading-wrap heading"
        @click.stop.prevent
    >
        <!--<i class="fas fa-spinner fa-spin"></i>-->
        <loading-animation :theme-color="themeColor " />
    </div>
</template>

<script>
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

export default {
    name: 'PlayerLoading',
    components: {
        'loading-animation': LoadingAnimation,
    },
    props: {
        themeColor: {
            type: String,
            default: 'drumeo',
        },
    },
};
</script>
