<template>
    <div class="loading-wrap heading"
         :class="themeTextClass"
         @click.stop.prevent>
        <!--<i class="fas fa-spinner fa-spin"></i>-->
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-bars">
            <rect y="30" height="40" :fill="strokeColor" x="16" width="8">
                <animate attributeName="opacity"
                         calcMode="spline"
                         values="1;0.2;1"
                         keyTimes="0;0.5;1"
                         dur="1"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
                         begin="-0.6s"
                         repeatCount="indefinite"></animate>
            </rect>
            <rect y="30" height="40" :fill="strokeColor" x="36" width="8">
                <animate attributeName="opacity"
                         calcMode="spline"
                         values="1;0.2;1"
                         keyTimes="0;0.5;1"
                         dur="1"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
                         begin="-0.4s"
                         repeatCount="indefinite"></animate>
            </rect>
            <rect y="30" height="40" :fill="strokeColor" x="56" width="8">
                <animate attributeName="opacity"
                         calcMode="spline"
                         values="1;0.2;1"
                         keyTimes="0;0.5;1"
                         dur="1"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
                         begin="-0.2s"
                         repeatCount="indefinite"></animate>
            </rect>
            <rect y="30" height="40" :fill="strokeColor" x="76" width="8">
                <animate attributeName="opacity"
                         calcMode="spline"
                         values="1;0.2;1"
                         keyTimes="0;0.5;1"
                         dur="1"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
                         begin="0s"
                         repeatCount="indefinite"></animate>
            </rect>
        </svg>
    </div>
</template>

<script>
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-loading',
        computed: {
            strokeColor(){
                const themeColor = this.themeBgClass.replace(/bg-/g, '');
                return {
                    drumeo: '#0B76DB',
                    guitareo: '#00C9AC',
                    pianote: '#F61A30',
                    course: '#07A0FF',
                    pack: '#07A0FF',
                    song: '#F8004F',
                    'play-along': '#FFB500',
                    'student-focus': '#A82FFF',
                    rudiment: '#d06835',
                    dft: '#0DD3BF',
                    'learning-path': '#0B76DB',
                    'my-list': '#0B76DB',
                    show: '#00C278',
                    'semester-pack': '#00BC75',
                }[themeColor];
            }
        }
    }
</script>

<style scoped>

</style>