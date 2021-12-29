<template>
    <div class="flex flex-row flex-wrap mb nmh-1"
         :class="{'tw-w-full md:tw-w-4/12 lg:tw-w-5/12' : isCoachesGrid}"
    >   
        <catalogue-filter
            v-for="item in filterableValues.filter(item => item !== 'progress' && item !== 'event')"
            :key="item.key"
            :filter-name="item"
            :filters-labels="filtersLabels"
            :item="filters[item]"
            :is-coaches-grid="isCoachesGrid"
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
            :short-filter-container="true"
            @filterChange="handleEventChange"
        ></catalogue-filter>

      <div class="sm:tw-pr-0 tw-mb-3 sm:tw-mb-0 ph-1">
        <div class="flex flex-column form-group mr-1">
          <select
              id="sortInput"
              type="text"
              class="borderless"
              @change="handleContentSort($event)"
              v-model="sort"
          >
            <option
                value="-popularity"
                :selected="sort === '-popularity'"
            >
              Most Popular
            </option>
            <option
                value="-published_on"
                :selected="sort === '-published_on'"
            >
              Newest First
            </option>
            <option value="published_on" :selected="sort === 'published_on'">
              Oldest First
            </option>
            <option value="slug" :selected="sort === 'slug'">
              Name: A to Z
            </option>
            <option value="-slug" :selected="sort === '-slug'">
              Name: Z to A
            </option>
          </select>

          <label for="sortInput" :class="brand"> Sort By: </label>
        </div>
      </div>
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
        isCoachesGrid: {
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
                    focus: null,
                    topic: null,
                    key: null,
                    key_pitch_type: null,
                };
            },
        },
        eventType: {
            type: String,
            default: () => '',
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
            eventTypeValue: this.eventType,
            sort: "-published_on",
        };
    },
    watch: {
        eventType(val) {
            if (val) {
                this.eventTypeValue = val;
            }
        },
    },
    computed: {
        user_state() {
            return this.requiredUserStates.length ? this.requiredUserStates[0] : null;
        },

        event_type() {
            return this.eventTypeValue;
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
                { key: 'Upcoming Live Events', value: 'upcoming' },
                { key: 'Recorded Events', value: 'lessons' },
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

        handleEventChange(payload) {
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
            this.eventTypeValue = payload.value;
            this.$emit('filterChange', eventChangeData);
        },

        handleContentSort(event) {
            this.$emit("handleContentSort", event);
        },
    },
};
</script>
