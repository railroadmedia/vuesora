<template>
    <div class="flex flex-column">
        <div class="flex flex-row flex-wrap">
            <div
                class="flex flex-column xs-12 pa-1"
                :class="includedTypes.length ? 'sm-8' : ''"
            >
                <div class="form-group">
                    <input
                        id="catalogueSearch"
                        v-model.lazy="searchTermInterface"
                        type="text"
                        name="search"
                        autocomplete="off"
                        placeholder="Search..."
                        class="no-label"
                    >
                </div>
            </div>

            <div
                v-if="includedTypes.length"
                class="flex flex-column xs-12 sm-4 pv-1"
            >
                <catalogue-filter
                    filter-name="type"
                    :item="parsedTypes"
                    :theme-color="themeColor"
                    :loading="loading"
                    :initial-value="selectedTypes"
                    @filterChange="changeFilter"
                ></catalogue-filter>
            </div>
        </div>
        <div class="flex flex-row ph-1 pb-1">
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
        limit: {
            type: [String, Number],
            default: () => 20,
        },
        totalResults: {
            type: [String, Number],
            default: () => 0,
        },
    },
    computed: {
        searchTermInterface: {
            get() {
                return this.searchTerm;
            },
            set(value) {
                if (value) {
                    this.$emit('searchChange', {
                        term: value,
                    });
                }
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
                    key: type,
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
    },
};
</script>
