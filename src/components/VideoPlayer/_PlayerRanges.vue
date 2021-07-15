<template>
    <div class="flex flex-row nmh-1 mt-3" style="justify-content: space-between;">
        <template v-for="range in ['lower', 'low', 'original', 'high', 'higher']">
            <div
                class="flex flex-column ph-1"
                style="max-width: 250px"
                v-if="hasRange(range)"
            >
                <a
                    href="#"
                    class="btn uppercase"
                    :class="getRangeButtonClasses(range)"
                    @click.stop.prevent="setRange(range)"
                ><i :class="getRangeIconClasses(range)" v-if="getRangeIconClasses(range)"></i><span :class="{'ml-1': getRangeIconClasses(range) != ''}">{{ range }} range</span></a>
            </div>
        </template>
    </div>
</template>

<script>
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayerRanges',
    mixins: [ThemeClasses],
    props: {
        currentRange: {
            type: String,
            default: () => null,
        },
        ranges: {
            type: Array,
            default: () => [],
        },
    },
    methods: {

        hasRange(range) {
            return this.ranges.includes(range);
        },

        getRangeButtonClasses(range) {
            return range == this.currentRange
                ? `text-white bg-${this.themeColor}`
                : `text-${this.themeColor} bg-${this.themeColor} inverted`;
        },

        getRangeIconClasses(range) {
            let iconClasses = {
                'lower': 'fas fa-angle-double-down',
                'low': 'fas fa-arrow-down',
                'original': '',
                'high': 'fas fa-arrow-up',
                'higher': 'fas fa-angle-double-up',
            };

            return iconClasses[range];
        },

        setRange(range) {
            this.$emit('setRange', { range });
        },
    }
}
</script>