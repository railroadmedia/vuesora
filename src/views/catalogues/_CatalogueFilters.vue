<template>
    <div class="flex flex-row flex-wrap mb nmh-1">
        <catalogue-filter
            v-for="item in filterableValues.filter(item => item !== 'progress' && item !== 'event')"
            :key="item.key"
            :filter-name="item"
            :filters-labels="filtersLabels"
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

        <catalogue-filter
            v-if="hasEventTypeFilter"
            filter-name="event"
            :filters-labels="filtersLabels"
            :item="eventTypeOptions"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="event_type"
            @filterChange="handleEventChange"
        ></catalogue-filter>
    </div>
</template>
<script>
import CatalogueFilter from './_CatalogueFilter.vue';
import { DateTime } from 'luxon';

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
        filtersLabels:{
            type: Object,
            default: () => ({}),
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
        brand: {
            type: String,
            default: () => 'drumeo',
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

        event_type() {
            return null;
        },

        hasProgressFilter() {
            return this.filterableValues.indexOf('progress') !== -1;
        },

        hasEventTypeFilter() {
            return this.filterableValues.indexOf('event') !== -1;
        },

        progressOptions() {
            if (this.contentTypes[0] === 'song' && this.contentTypes.length === 1 && this.brand === 'drumeo') {
                return [
                    { key: 'Completed', value: 'completed' },
                ];
            }

            return [
                { key: 'In Progress', value: 'started' },
                { key: 'Completed', value: 'completed' },
            ];
        },

        eventTypeOptions() {
            return [
                { key: 'All', value: 'all' },
                { key: 'Upcoming Live Events', value: 'upcoming' },
                { key: 'Video Lessons', value: 'lessons' },
            ];
        },
    },
    methods: {

        handleFilterChange(payload) {
            console.log("_CatalogueFilters::handleFilterChange payload: %s", JSON.stringify(this.payload));
            this.$emit('filterChange', payload);
        },

        handleProgressChange(payload) {
            this.$emit('progressChange', {
                type: payload.value,
            });
        },

        handleEventChange(payload) {
            console.log("_CatalogueFilters::handleEventChange payload: %s", JSON.stringify(payload));
            let currentDate = DateTime.utc().toFormat('yyyy-LL-dd');
            let valueMap = {
                all: '',
                upcoming: currentDate + ',string,>',
                lessons: currentDate + ',string,<=',
            };
            let eventChangeData = {
                key: 'live_event_start_time',
                value: valueMap[payload.value],
            };
            this.$emit('filterChange', eventChangeData);
        },
    },
    mounted() {
        // console.log("_CatalogueFilters::mounted filterableValues: %s", JSON.stringify(this.filterableValues));
        // console.log("_CatalogueFilters::mounted filters: %s", JSON.stringify(this.filters));
    },
};
</script>
