<template>
    <div class="flex flex-row flex-wrap ph pv-3 filter-tabs">
        <div
            v-for="(item, i) in $_filters"
            class="heading-tab pointer mr-3 flex flex-auto"
            @click="changeFilter(item)"
        >
            <h3
                class="heading flex-auto hover-text-black"
                :class="$_selected_tab === item.value ? 'text-black bb-drumeo-2' : 'text-grey-3 font-regular'"
            >
                {{ item.title }}
            </h3>
        </div>
    </div>
</template>
<script>

export default {
    name: 'CatalogeTableFilters',
    props: {
        filters: {
            type: Array,
            default: () => [],
        },
        selectedTab: null,
    },
    methods: {
        changeFilter(item) {
            this.$emit('filterChange', {
                key: item.key,
                value: item.value,
            });
        },
    },
};
</script>
