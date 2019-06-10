<template>
    <div class="loading-wrap heading"
         @click.stop.prevent>
        <!--<i class="fas fa-spinner fa-spin"></i>-->
        <loading-animation :themeColor="themeColor "/>
    </div>
</template>

<script>
    import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

    export default {
        name: 'player-loading',
        components: {
            'loading-animation': LoadingAnimation
        },
        props: {
            themeColor: {
                type: String,
                default: 'drumeo'
            }
        },
    }
</script>