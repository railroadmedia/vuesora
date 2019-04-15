<template>
    <div class="loading-wrap heading"
         :class="themeTextClass"
         @click.stop.prevent>
        <!--<i class="fas fa-spinner fa-spin"></i>-->
        <div class="loader text-white" :class="themeColor">
            <div class="square-1"></div>
            <div class="square-2"></div>
            <div class="square-3"></div>
            <div class="square-4"></div>
            loading..
        </div>
    </div>
</template>

<script>
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-loading'
    }
</script>

<style scoped>

</style>