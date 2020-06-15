<template>
    <div class="flex flex-row flex-wrap mb">
        <catalogue-filter
            v-for="item in filterableValues.filter(item => item !== 'progress')"
            :key="item.key"
            :filter-name="item"
            :item="filters[item]"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="filterParams[item]"
            @filterChange="handleFilterChange"
        ></catalogue-filter>

        <catalogue-filter
            v-if="hasProgressFilter"
            filter-name="progress"
            :item="progressOptions"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="user_state"
            @filterChange="handleProgressChange"
        ></catalogue-filter>
    </div>
</template>
<script>
import CatalogueFilter from './_CatalogueFilter.vue';

export default {
    name: 'CatalogueFilters',
    components: {
        'catalogue-filter': CatalogueFilter,
    },
    props: {
        loading: {
            type: Boolean,
            default: () => false,
        },
        filters: {
            type: Object,
            default: () => ({}),
        },
        filterableValues: {
            type: Array,
            default: () => [],
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        requiredUserStates: {
            type: Array,
            default: () => [],
        },
        filterParams: {
            type: Object,
            default() {
                return {
                    artist: null,
                    bpm: null,
                    difficulty: null,
                    instructor: null,
                    style: null,
                    topic: null,
                    key: null,
                    key_pitch_type: null,
                };
            },
        },
        contentTypes: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
        };
    },
    computed: {
        user_state() {
            return this.requiredUserStates.length ? this.requiredUserStates[0] : null;
        },

        hasProgressFilter() {
            return this.filterableValues.indexOf('progress') !== -1;
        },

        progressOptions() {
            if (this.contentTypes[0] === 'song' && this.contentTypes.length === 1) {
                return [
                    { key: 'Completed', value: 'completed' },
                ];
            }

            return [
                { key: 'In Progress', value: 'started' },
                { key: 'Completed', value: 'completed' },
            ];
        },
    },
    methods: {

        handleFilterChange(payload) {
            this.$emit('filterChange', payload);
        },

        handleProgressChange(payload) {
            this.$emit('progressChange', {
                type: payload.value,
            });
        },
    },
};
</script>
