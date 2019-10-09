<template>
    <div class="flex flex-row">
        <div class="flex flex-column">
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

            <div class="flex flex-row flex-wrap-xs-only">
                <div class="flex flex-column xs-12 sm-6">
                    <div class="flex flex-row flex-wrap-xs-only ph-1">
                        <div class="flex flex-column enable-filters mr-1">
                            <button
                                class="btn collapse-square mr-1"
                                title="Toggle Favorites"
                                @click="toggleFavorites"
                            >
                                <span
                                    class="bg-drumeo"
                                    :class="showFavoritesOnly ? 'text-white' : 'inverted text-drumeo'"
                                >
                                    <i class="fas fa-star"></i>
                                </span>
                            </button>
                        </div>

                        <div class="flex flex-column enable-filters mr-1">
                            <button
                                class="btn collapse-square mr-1"
                                title="Toggle Completed"
                                @click="toggleCompleted"
                            >
                                <span
                                    class="bg-drumeo"
                                    :class="showCompletedOnly ? 'text-white' : 'inverted text-drumeo'"
                                >
                                    <i class="fas fa-check"></i>
                                </span>
                            </button>
                        </div>

                        <div class="flex flex-column enable-filters">
                            <button
                                class="btn collapse-square mr-1"
                                title="Toggle Shuffle"
                                @click="toggleShuffle"
                            >
                                <span
                                    class="bg-drumeo"
                                    :class="isShuffle ? 'text-white' : 'inverted text-drumeo'"
                                >
                                    <i class="fas fa-random"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 align-h-right align-v-center pa-2">
                    <div class="flex flex-row flex-wrap">
                        <div class="flex flex-column form-group mr-1">
                            <select
                                id="sortInput"
                                type="text"
                                class="borderless"
                                style="width:200px;"
                                @change="handleContentSort"
                            >
                                <option
                                    value="-published_on"
                                    :selected="sort === '-published_on'"
                                >
                                    Newest First
                                </option>
                                <option
                                    value="published_on"
                                    :selected="sort === 'published_on'"
                                >
                                    Oldest First
                                </option>
                                <option
                                    value="slug"
                                    :selected="sort === 'slug'"
                                >
                                    Name: A to Z
                                </option>
                                <option
                                    value="-slug"
                                    :selected="sort === '-slug'"
                                >
                                    Name: Z to A
                                </option>
                            </select>

                            <label
                                for="sortInput"
                                :class="brand"
                            >
                                Sort By:
                            </label>
                        </div>

                        <div class="flex flex-column form-group">
                            <select
                                id="limitInput"
                                type="text"
                                class="borderless"
                                style="width:100px;"
                                @change="handleContentLimit"
                            >
                                <option
                                    value="10"
                                    :selected="Number(limit) === 10"
                                >
                                    10
                                </option>
                                <option
                                    value="20"
                                    :selected="Number(limit) === 20"
                                >
                                    20
                                </option>
                                <option
                                    value="50"
                                    :selected="Number(limit) === 50"
                                >
                                    50
                                </option>
                            </select>

                            <label
                                for="limitInput"
                                :class="brand"
                            >
                                Per Page:
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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

        brand: {
            type: String,
            default: () => 'drumeo',
        },

        loading: {
            type: Boolean,
            default: () => false,
        },

        limit: {
            type: [String, Number],
            default: () => 20,
        },

        sort: {
            type: String,
            default: () => '-published_on',
        },

        showFavoritesOnly: {
            type: Boolean,
            default: () => false,
        },

        showCompletedOnly: {
            type: Boolean,
            default: () => false,
        },

        isShuffle: {
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

        toggleFavorites() {
            this.$emit('toggleFavorites');
        },

        toggleCompleted() {
            this.$emit('toggleCompleted');
        },

        toggleShuffle() {
            this.$emit('toggleShuffle');
        },

        handleContentLimit(event) {
            this.$emit('handleContentLimit', event);
        },

        handleContentSort(event) {
            this.$emit('handleContentSort', event);
        },
    },
};
</script>
