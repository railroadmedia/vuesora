<template>
    <div class="flex flex-row flex-wrap pb">
        <catalogue-filter
            v-for="item in filterableValues"
            v-if="item !== 'progress'"
            :key="item.key"
            :filter_name="item"
            :item="filters[item]"
            :theme-color="themeColor"
            :loading="loading"
            :initial_value="filter_params[item]"
            @filterChange="handleFilterChange"
        ></catalogue-filter>

        <catalogue-filter
            v-if="hasProgressFilter"
            filter_name="progress"
            :item="progress_options"
            :theme-color="themeColor"
            :loading="loading"
            :initial_value="user_state"
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
    },
    data() {
        return {
            progress_options: [
                { key: 'in progress', value: 'started' },
                { key: 'completed', value: 'completed' },
            ],
        };
    },
    computed: {
        user_state() {
            return this.required_user_states.length ? this.required_user_states[0] : null;
        },

        hasProgressFilter() {
            return this.filterableValues.indexOf('progress') !== -1;
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
