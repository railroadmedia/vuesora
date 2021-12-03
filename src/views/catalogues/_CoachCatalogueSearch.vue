<template>
  <div
    class="
      tw-w-full tw-py-10 tw-flex tw-flex-col
      sm:tw-flex-row
      tw-justify-between
    "
  >
    <div class="tw-w-full md:tw-w-3/6 lg:tw-w-2/6">
      <div class="tw-flex tw-text-gray-600 sm:tw-pr-5 tw-mb-3 ph-1">
        <input
          id="catalogueSearch"
          v-model="searchTermInterface"
          type="text"
          name="search"
          autocomplete="off"
          placeholder="Search..."
          class="
            tw-bg-white tw-py-3 tw-px-4 tw-mr-5 tw-rounded-full tw-w-full
            focus:outline-none
            tw-border-2
          "
          @keydown.enter="submitSearch"
        />
        <button
          class="tw-btn-primary tw-btn-circle tw-bg-drumeo tw-w-16"
          title="Search"
          @click="submitSearch"
        >
          <span class="tw-text-white" :class="`tw-bg-${themeColor}`">
            <i class="fas fa-search tw-px-1"></i>
          </span>
        </button>
      </div>
    </div>

    <div class="tw-w-full md:tw-w-3/6 lg:tw-w-2/6">
      <div class="tw-flex tw-items-center tw-justify-end">
        <div class="tw-input-wrapper tw-flex-grow sm:tw-mx-4">
          <catalogue-filter
            filter-name="type"
            :item="parsedTypes"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="selectedTypes"
            @filterChange="changeFilter"
          ></catalogue-filter>
        </div>
        <div class="sm:tw-pr-2 tw-mb-3 sm:tw-mb-0 ph-1">
          <select
            type="text"
            name="name"
            id="name"
            class="tw-pt-0"
            placeholder="Sort by"
            aria-placeholder="Sort By"
          >
            <option value="" disabled selected>Sort by</option>
            <option value="0" class="tw-py-1">Alphabetical</option>
            <option value="1" class="tw-py-1">Most Recent</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CatalogueFilter from "./_CatalogueFilter.vue";

export default {
  name: "CoachCatalogueSearch",
  components: {
    "catalogue-filter": CatalogueFilter,
  },
  props: {
    themeColor: {
      type: String,
      default: () => "",
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
  data() {
    return {
      search_term: this.searchTerm,
    };
  },
  computed: {
    searchTermInterface: {
      get() {
        return this.search_term === undefined
          ? this.searchTerm
          : this.search_term;
      },
      set(value) {
        this.search_term = value;
      },
    },

    currentResults() {
      return `${1 + (this.currentPage * this.limit - this.limit)}-${
        this.displayedLimit
      }`;
    },

    displayedLimit() {
      return this.limit > this.totalResults ? this.totalResults : this.limit;
    },

    parsedTypes() {
      const parsedArray = [];

      this.includedTypes.forEach((type) => {
        parsedArray.push({
          key: type.replace(/-/g, " "),
          value: type,
        });
      });

      return parsedArray;
    },
  },
  methods: {
    changeFilter(item) {
      this.$emit("typeChange", {
        key: item.key,
        value: item.value,
      });
    },

    submitSearch() {
      this.$emit("searchChange", {
        term: this.searchTermInterface,
      });
    },
  },
};
</script>
<style lang="scss">
@import "../../assets/sass/partials/variables";

.search-button-col {
  flex: 0 0 50px;
  max-width: 50px;
  min-width: 50px;
}
</style>
