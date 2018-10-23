<template>
    <div class="flex flex-row">
        <div class="exp-wrap">
            <div class="exp flex flex-column align-v-center align-h-right"
                 :class="'bg-' + themeColor">
                <p class="tiny dense font-bold ph-2"
                   :class="expBarClassObject">
                    {{ userExpRank }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import xpMap from '../assets/js/classes/xp-mapper';

    export default {
        name: 'user-exp-bar',
        props: {
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            xp: {
                default: () => 0
            }
        },
        computed: {
            xpPercentage(){
                const nextKey = xpMap.getNearestKey(this.xp, 1);

                return Math.floor((this.xp / nextKey) * 100);
            },
            expBarClassObject(){
                return {
                    'text-black': this.xpPercentage < 25,
                    'move-text-over': this.xpPercentage < 25,
                    'text-white': this.xpPercentage >= 25,
                }
            },
            userExpRank(){
                return xpMap.getNearestValue(this.xp);
            },
        }
    }
</script>