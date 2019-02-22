<template>
    <div class="flex flex-column">
        <div class="flex flex-row">
            <div class="exp-wrap">
                <div class="exp flex flex-column align-v-center align-h-right"
                     :class="themeBgClass"
                     :style="'width:' + xpPercentage + '%;'">
                    <p class="body dense font-bold ph-2 nowrap"
                       :class="expBarClassObject">
                        {{ formattedXp }} XP
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-row ph mt-1">
            <p class="body dense text-center nowrap font-compressed uppercase">
                <strong>{{ userExpRank }}</strong><br>{{ userExpRankAmount }} XP
            </p>

            <span class="flex flex-column grow"></span>

            <p class="body dense text-center nowrap font-compressed uppercase">
                <strong>{{ nextUserExpRank }}</strong><br>{{ nextUserExpRankAmount }} XP
            </p>
        </div>
    </div>
</template>
<script>
    import xpMap from '../assets/js/classes/xp-mapper';
    import Utils from '../assets/js/classes/utils';
    import ThemeClasses from "../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'user-exp-bar',
        props: {
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            brand: {
                type: String,
                default: () => 'drumeo'
            },
            xp: {
                type: String|Number,
                default: () => 0
            }
        },
        computed: {
            xpPercentage(){
                const thisKey = xpMap.getNearestKey(this.xp, this.brand);
                const nextKey = xpMap.getNearestKey(this.xp, this.brand, 1);
                const difference = nextKey - thisKey;
                const currentLevelProgress = this.xp - thisKey;

                if(this.xp < 10000000) {
                    return Math.floor((currentLevelProgress / difference) * 100);
                }

                return 100;
            },

            expBarClassObject(){
                return {
                    'text-black': this.xpPercentage < 15,
                    'move-text-over': this.xpPercentage < 15,
                    'text-white': this.xpPercentage >= 15,
                }
            },

            formattedXp(){
                return Utils.formatNumbersWithCommas(this.xp);
            },

            userExpRank(){
                return xpMap.getNearestValue(this.xp, this.brand);
            },

            userExpRankAmount(){
                return Utils.formatNumbersWithCommas(xpMap.getNearestKey(this.xp, this.brand));
            },

            nextUserExpRank(){
                if(this.xp < 10000000){
                    return xpMap.getNearestValue(this.xp, this.brand, 1);
                }

                return '';
            },

            nextUserExpRankAmount(){
                if(this.xp < 10000000) {
                    return Utils.formatNumbersWithCommas(xpMap.getNearestKey(this.xp, this.brand, 1));
                }

                return '';
            },
        }
    }
</script>