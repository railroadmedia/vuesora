<template>
    <div class="flex flex-row flex-wrap-xs-only pv-2">
        <catalogue-filter
            v-for="option in availableFilters"
            :key="option"
            :filter-name="option"
            :item="filterOptions[option].map((value) => ({key: value, value: value}))"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="selectedFilters[option]"
            @filterChange="handleFilterChange"
        ></catalogue-filter>
    </div>
</template>

<script>
import ThemeClasses from '../../mixins/ThemeClasses';
import CatalogueFilter from '../catalogues/_CatalogueFilter.vue';

export default {
    name: 'PlayAlongsFilters',
    components: {
        'catalogue-filter': CatalogueFilter,
    },
    mixins: [ThemeClasses],
    props: {
        filterOptions: {
            type: Object,
            default: () => ({
                bpm: [],
                difficulty: [],
                style: [],
            }),
        },

        selectedFilters: {
            type: Object,
            default: () => ({
                bpm: null,
                difficulty: null,
                style: null,
            }),
        },

        loading: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            availableFilters: ['bpm', 'difficulty', 'style'],
        };
    },
    methods: {
        handleFilterChange(payload) {
            this.$emit('filterChange', payload);
        },
    },
};
</script>
