<template>
    <div class="flex flex-column"
         :class="[isCoachesGrid ? 'tw-mr-4' : '']"
    >
        <div class="flex flex-row flex-wrap mb nmh-1">
            <div
                v-if="includedTypes.length"
                class="flex flex-column xs-12 sm-4"
                :class="[isCoachesGrid ? 'tw-hidden' : '']"
            >
                <catalogue-filter
                    filter-name="type"
                    :item="parsedTypes"
                    :theme-color="themeColor"
                    :loading="loading"
                    :initial-value="selectedTypes"
                    @filterChange="changeFilter"
                />
            </div>

            <div class="flex flex-column ph-1">
                <div class="flex flex-row">
                    <div class="flex flex-column grow form-group pr-2">
                        <input
                            id="catalogueSearch"
                            v-model="searchTermInterface"
                            type="text"
                            name="search"
                            autocomplete="off"
                            placeholder="Search..."
                            class="no-label"
                            @keydown.enter="submitSearch"
                        >
                    </div>

                    <div class="flex flex-column search-button-col">
                        <button
                            class="btn"
                            title="Search"
                            @click="submitSearch"
                        >
                            <span
                                class="text-white"
                                :class="`bg-${themeColor}`"
                            >
                                <i class="fas fa-search"></i>
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <div v-if="catalogueType !== 'coaches-grid'" 
             class="flex flex-row ph-1 pb-1"
        >
            <p class="tiny text-grey-3 font-italic">
                Displaying <span v-if="totalResults > 0">{{ currentResults }} of</span> {{ totalResults }} results.
            </p>
        </div>
    </div>
</template>
<script>
import CatalogueFilter from './_CatalogueFilter.vue';

export default {
    name: 'CatalogueSearch',
    components: {
        'catalogue-filter': CatalogueFilter,
    },
    props: {
        themeColor: {
            type: String,
            default: () => '',
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
        includedTypes: {
            type: Array,
            default: () => [],
        },
        isCoachesGrid: {
            type: Boolean,
            default: () => false,
        },
        selectedTypes: {
            type: String,
            default: () => null,
        },
        searchTerm: {
            type: String,
            default: () => undefined,
        },
        currentPage: {
            type: [String, Number],
            default: () => 1,
        },
        catalogueType: {
            type: String,
            default: () => undefined,
        },
        limit: {
            type: [String, Number],
            default: () => 20,
        },
        totalResults: {
            type: [String, Number],
            default: () => 0,
        },
    },
    data() {
        return {
            search_term: this.searchTerm,
        };
    },
    computed: {
        searchTermInterface: {
            get() {
                return this.search_term === undefined ? this.searchTerm : this.search_term;
            },
            set(value) {
                this.search_term = value;
            },
        },

        currentResults() {
            return `${1 + ((this.currentPage * this.limit) - this.limit)}-${this.displayedLimit}`;
        },

        displayedLimit() {
            return this.limit > this.totalResults ? this.totalResults : this.limit;
        },

        parsedTypes() {
            const parsedArray = [];

            this.includedTypes.forEach((type) => {
                parsedArray.push({
                    key: type.replace(/-/g, ' '),
                    value: type,
                });
            });

            return parsedArray;
        },
    },
    methods: {
        changeFilter(item) {
            this.$emit('typeChange', {
                key: item.key,
                value: item.value,
            });
        },

        submitSearch() {
            this.$emit('searchChange', {
                term: this.searchTermInterface,
            });
        },
    },
};
</script>
<style lang="scss">
    @import '../../assets/sass/partials/variables';

    .search-button-col {
        flex: 0 0 50px;
        max-width:50px;
        min-width:50px;
    }
</style>
