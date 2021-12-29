<template>
  <div
    class="
      tw-w-full tw-py-10 tw-flex tw-flex-col
      sm:tw-flex-row
      tw-justify-between
    "
  >
    <div class="tw-w-full md:tw-w-3/6 lg:tw-w-2/6">
      <div class="tw-flex tw-text-gray-600 sm:tw-pr-5 tw-mb-3 ph-1 sm:tw-pl-0">
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
          class="tw-btn-primary tw-btn-circle tw-flex-shrink-0"
          :class="`tw-bg-${themeColor}`"
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
        <div class="tw-flex-grow">
          <catalogue-filter
            filter-name="type"
            :item="parsedTypes"
            :theme-color="themeColor"
            :loading="loading"
            :initial-value="selectedTypes"
            @filterChange="changeFilter"
          ></catalogue-filter>
        </div>
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
              <option value="title" :selected="sort === 'title'">
                Name: A to Z
              </option>
              <option value="-title" :selected="sort === '-title'">
                Name: Z to A
              </option>
            </select>

            <label for="sortInput" :class="brand"> Sort By: </label>
          </div>
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
    brand: {
      type: String,
      default: () => "",
    },
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
      sort: "-published_on",
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

    handleContentSort(event) {
      this.$emit("handleContentSort", event);
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
