<template>
  <div class="flex flex-column grow align-v-center">

    <div v-if="isCoachesGrid" 
         id="coach-section"
         class="tw-flex tw-flex-col tw-pt-4 tw-mb-6">
        <div class="tw-flex">
            <a class="tw-no-underline tw-mr-6 tw-transition"
               :href="coachIndexUrl + '#coach-section'"
               :class="[!isOnlySubscribed ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'tw-text-gray-400 hover:tw-text-gray-500', brandBorderColor ]"
            >
              <h3 class="tw-text-2xl md:tw-text-3xl tw-cursor-pointer">
                All Coaches
              </h3>
            </a>
            <a class="tw-no-underline tw-transition"
               :href="coachIndexUrl + '?only_subscribed=true#coach-section' "
               :class="[isOnlySubscribed ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'tw-text-gray-400 hover:tw-text-gray-500', brandBorderColor ]"
            >
              <h3 class="tw-text-2xl md:tw-text-3xl tw-cursor-pointer">
                  Subscribed Coaches
              </h3>
            </a>
        </div>
    </div>

    <coach-catalogue-search
      v-if="isCoach"
      :theme-color="themeColor"
      :brand="brand"
      :included-types="includedTypes"
      :selected-types="selected_types"
      :search-term="search_term"
      :current_page="page"
      :total-results="total_results"
      @typeChange="handleTypeChange"
      @searchChange="handleSearch"
      @handleContentSort="handleContentSort"
    />

    <div :class="{'tw-flex tw-w-full tw-flex-wrap tw-mb-3' : isCoachesGrid }">
        <catalogue-search
            v-if="searchBar && !isCoach"
            :theme-color="themeColor"
            :included-types="includedTypes"
            :selected-types="selected_types"
            :search-term="search_term"
            :current_page="page"
            :isCoachesGrid="isCoachesGrid"
            :total-results="total_results"
            :catalogueType="catalogueType"
            @typeChange="handleTypeChange"
            @searchChange="handleSearch"
        />

        <catalogue-playlist-tabs
            v-if="isPlaylists && !isCoach"
            :theme-color="themeColor"
            :included-types="includedTypes"
        />

        <catalogue-filters
            v-if="!isCoach && filterableValues.length"
            :filters="filters"
            :filterable-values="filterableValues"
            :filters-labels="filtersLabels"
            :required-user-states="required_user_states"
            :filter-params="filter_params"
            :isCoachesGrid="isCoachesGrid"
            :event-type="eventType"
            :loading="loading"
            :theme-color="themeColor"
            :content-types="selectedTypes"
            :brand="brand"
            @filterChange="handleFilterChange"
            @progressChange="handleProgressChange"
            @handleContentSort="handleContentSort"
        />

    </div>

    <div
      v-if="content.length === 0 && noResultsMessage.length > 0"
      class="flex flex-row pv-3 align-v-center"
    >
      <div class="flex flex-column icon-col face-icon mr-1">
        <div class="icon-wrap square" :class="noResultsIcon"></div>
      </div>
      <div class="flex flex-column">
        <h4 class="body" v-html="noResultsMessageWithProgress">
          {{ noResultsMessageWithProgress }}
        </h4>
      </div>
    </div>

    <coach-grid-catalogue
      v-if="catalogueType === 'coach-grid'"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :no-wrap="noWrapGrid"
      :user-id="userId"
      :is-admin="isAdmin"
      :lock-unowned="lockUnowned"
      :force-wide-thumbs="forceWideThumbs"
      :content-type-override="contentTypeOverride"
      :six-wide="sixWide"
      :five-wide="fiveWide"
      :show-my-list-action="showMyListAction"
      :display-inline="displayInline"
      @addToList="addToListEventHandler"
    />

    <!-- Coach Index Page -->
    <coaches-grid-catalogue
      v-if="isCoachesGrid"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :no-wrap="noWrapGrid"
      :user-id="userId"
      :is-admin="isAdmin"
      :lock-unowned="lockUnowned"
      :force-wide-thumbs="forceWideThumbs"
      :content-type-override="contentTypeOverride"
      :show-my-list-action="showMyListAction"
      :display-inline="displayInline"
      @addToList="addToListEventHandler"
    />

    <grid-catalogue
      v-if="catalogueType === 'grid'"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :no-wrap="noWrapGrid"
      :user-id="userId"
      :is-admin="isAdmin"
      :lock-unowned="lockUnowned"
      :force-wide-thumbs="forceWideThumbs"
      :content-type-override="contentTypeOverride"
      :six-wide="sixWide"
      :five-wide="fiveWide"
      :show-my-list-action="showMyListAction"
      :display-inline="displayInline"
      @addToList="addToListEventHandler"
    />

    <routines-catalogue
      v-if="catalogueType === 'routines'"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :no-wrap="noWrapGrid"
      :user-id="userId"
      :is-admin="isAdmin"
      :lock-unowned="lockUnowned"
      :force-wide-thumbs="forceWideThumbs"
      :content-type-override="contentTypeOverride"
      :six-wide="sixWide"
      :display-inline="displayInline"
      @addToList="addToListEventHandler"
    />

    <list-catalogue
      v-if="catalogueType === 'list'"
      :is-coach="isCoach"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :card_type="catalogueType"
      :user-id="userId"
      :is-admin="isAdmin"
      :display-items-as-overview="displayItemsAsOverview"
      :display-user-interactions="displayUserInteractions"
      :content-type-override="contentTypeOverride"
      :lock-unowned="lockUnowned"
      :show-numbers="showNumbers"
      :is_search="searchBar || isPlaylists"
      :reset-progress="resetProgress"
      :force-wide-thumbs="forceWideThumbs"
      :destroy-on-list-removal="destroyOnListRemoval"
      :compact-layout="compactLayout"
      :subscription-calendar-id="subscriptionCalendarId"
      @addToList="addToListEventHandler"
      @progressReset="resetProgressEventHandler"
    />

    <downloads-catalogue
      v-if="catalogueType === 'downloads'"
      :content="content"
      :brand="brand"
      :theme-color="themeColor"
      :use-theme-color="useThemeColor"
      :card_type="catalogueType"
      :user-id="userId"
      :is-admin="isAdmin"
      :display-items-as-overview="displayItemsAsOverview"
      :display-user-interactions="displayUserInteractions"
      :content-type-override="contentTypeOverride"
      :lock-unowned="lockUnowned"
      :show-numbers="showNumbers"
      :is_search="searchBar || isPlaylists"
      :reset-progress="resetProgress"
      :force-wide-thumbs="forceWideThumbs"
      :destroy-on-list-removal="destroyOnListRemoval"
      :compact-layout="compactLayout"
      :subscription-calendar-id="subscriptionCalendarId"
      @addToList="addToListEventHandler"
      @progressReset="resetProgressEventHandler"
    />

    <div
      v-if="paginate && total_pages > 1 && !infiniteScroll"
      class="flex flex-row pagination-row align-h-right"
    >
      <pagination
        :current-page="Number(page)"
        :total-pages="total_pages"
        @pageChange="handlePageChange"
      />
    </div>

    <transition name="show-from-bottom">
      <div
        v-show="loading && showLoadingAnimation"
        id="loadingDialog"
        class="flex flex-row align-center"
      >
        <div
          class="loading-spinner corners-10 shadow pa flex-center"
          :class="themeBgClass"
        >
          <i class="fas fa-spinner fa-spin text-white"></i>
          <p class="x-tiny text-white">Loading Please Wait...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import * as QueryString from "query-string";
import { Content as ContentHelpers } from "@musora/helper-functions";
import DownloadsCatalogue from "./DownloadsCatalogue.vue";
import GridCatalogue from "./GridCatalogue.vue";
import CoachGridCatalogue from "./CoachGridCatalogue.vue";
import CoachesGridCatalogue from "./CoachesGridCatalogue.vue";
import RoutinesCatalogue from "./RoutinesCatalogue.vue";
import ListCatalogue from "./ListCatalogue.vue";
import CatalogueFilters from "./_CatalogueFilters.vue";
import CatalogueSearch from "./_CatalogueSearch.vue";
import CoachCatalogueSearch from "./_CoachCatalogueSearch.vue";
import CataloguePlaylistTabs from "./_CataloguePlaylistTabs.vue";
import Toasts from "../../assets/js/classes/toasts";
import Pagination from "../../components/Pagination.vue";
import UserCatalogueEvents from "../../mixins/UserCatalogueEvents";
import ThemeClasses from "../../mixins/ThemeClasses";

export default {
  name: "ContentCatalogue",
  components: {
    "grid-catalogue": GridCatalogue,
    "coach-grid-catalogue": CoachGridCatalogue,
    "coaches-grid-catalogue": CoachesGridCatalogue,
    "routines-catalogue": RoutinesCatalogue,
    "list-catalogue": ListCatalogue,
    "downloads-catalogue": DownloadsCatalogue,
    pagination: Pagination,
    "catalogue-filters": CatalogueFilters,
    "catalogue-search": CatalogueSearch,
    "coach-catalogue-search": CoachCatalogueSearch,
    "catalogue-playlist-tabs": CataloguePlaylistTabs,
  },
  mixins: [UserCatalogueEvents, ThemeClasses],
  props: {
    catalogueType: {
      type: String,
      default: () => "grid",
    },
    userId: {
      type: String,
      default: () => "",
    },
    coachId: {
      type: String,
      default: () => "",
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
    brand: {
      type: String,
      default: () => "drumeo",
    },
    preLoadedContent: {
      type: Object,
      default: () => ({}),
    },
    limit: {
      type: String,
      default: () => "10",
    },
    totalPages: {
      type: String,
      default: () => "",
    },
    statuses: {
      type: Array,
      default: () => ["published"],
    },
    contentEndpoint: {
      type: String,
      default: () => "/railcontent/content",
    },
    includedTypes: {
      type: Array,
      default: () => [],
    },
    requiredFields: {
      type: Array,
      default: () => [],
    },
    requiredUserStates: {
      type: Array,
      default: () => [],
    },
    filterableValues: {
      type: Array,
      default: () => [],
    },
    filtersLabels: {
      type: Object,
      default: () => ({}),
    },
    paginate: {
      type: Boolean,
      default: () => false,
    },
    infiniteScroll: {
      type: Boolean,
      default: () => false,
    },
    destroyOnListRemoval: {
      type: Boolean,
      default: () => false,
    },
    displayItemsAsOverview: {
      type: Boolean,
      default: () => false,
    },
    displayUserInteractions: {
      type: Boolean,
      default: () => true,
    },
    noWrapGrid: {
      type: Boolean,
      default: () => false,
    },
    showLoadingAnimation: {
      type: Boolean,
      default: () => false,
    },
    useUrlParams: {
      type: Boolean,
      default: () => false,
    },
    noResultsMessage: {
      type: String,
      default: () => "No lessons found.",
    },
    noResultsIcon: {
      type: String,
      default: () => "disappointed",
    },
    forceWideThumbs: {
      type: Boolean,
      default: () => false,
    },
    contentTypeOverride: {
      type: String,
      default: () => "",
    },
    showNumbers: {
      type: Boolean,
      default: () => false,
    },
    lockUnowned: {
      type: Boolean,
      default: () => false,
    },
    searchBar: {
      type: Boolean,
      default: () => false,
    },
    isCoach: {
      type: Boolean,
      default: () => false,
    },
    searchEndpoint: {
      type: String,
      default: () => "/laravel/public/railcontent/search",
    },
    isPlaylists: {
      type: Boolean,
      default: () => false,
    },
    resetProgress: {
      type: Boolean,
      default: () => false,
    },
    initialPage: {
      type: [Number, String],
      default: () => null,
    },
    useThemeColor: {
      type: Boolean,
      default: () => true,
    },
    sortOverride: {
      type: String,
      default: () => "",
    },
    compactLayout: {
      type: Boolean,
      default: () => false,
    },
    subscriptionCalendarId: {
      type: String,
      default: "",
    },
    totalResults: {
      type: [String, Number],
      default: () => 0,
    },
    catalogueName: {
      type: String,
      default: () => "",
    },
    sixWide: {
      type: Boolean,
      default: () => false,
    },
    fiveWide: {
      type: Boolean,
      default: () => false,
    },
    displayInline: {
      type: Boolean,
      default: () => false,
    },
    filterDuplicates: {
      type: Boolean,
      default: () => false,
    },
    includedFields: {
      type: Array,
      default: () => [],
    },
    showMyListAction: {
        type: Boolean,
        default: () => true,
    },
  },
  data() {
    return {
      page: this.initialPage || 1,
      content: this.preLoadedContent ? this.preLoadedContent.data : [],
      filters: this.preLoadedContent ? ContentHelpers.flattenFilters( this.preLoadedContent.meta.filterOptions || [] ): {},
      total_results: this.totalResults || 0,
      total_pages: this.preLoadedContent
        ? Math.ceil(this.preLoadedContent.meta.totalResults / this.limit)
        : 0,
      loading: false,
      requestingMore: false,
      filter_params: {
        artist: null,
        bpm: null,
        difficulty: null,
        instructor: null,
        style: null,
        topic: null,
      },
      selected_types: null,
      search_term: undefined,
      required_user_states: this.requiredUserStates || [],
      selected_tab: "new",
      singleEventDropdown: false,
      subscriptionCalendarDropdown: false,
      singleEvent: {
        title: "",
        date: "",
      },
      eventType: null,
      loadedContentIds: {},
      included_fields: this.includedFields || [],
      sort: null,
      sortOptions: [
          {
              label: 'Alphabetical',
              value: 'slug'
          },
          {
              label: 'Most recent',
              value: '-published_on'
          }
      ],
    };
  },
  computed: {
    sortInterface: {
      get() {
          return this.sortOptions.filter(option => option.value === this.currentSort)[0].value;
      },
      set(value) {
          this.currentSort = value;
          this.handleSortChange(value);
      },
    },
    currentSort: {
      get() {
          const urlParams = QueryString.parse(location.search);
          if (urlParams['sort'] != null) {
              return urlParams['sort'];
          }
          return 'slug';
      },
      set(val) {
        return val;
      }
    },
    required_fields: {
      cache: false,
      get() {
        const filterKeys = Object.keys(this.filter_params);
        const includedFields = [];

        filterKeys.forEach((filter) => {
          if (this.filter_params[filter] != null) {
            includedFields.push(`${filter},${this.filter_params[filter]}`);
          }
        });

        return includedFields;
      },
    },
    coachIndexUrl() {
        return '/members/coaches';
    },
    isOnlySubscribed() {
       return String(location.search).includes('only_subscribed=true');
    },
    isCoachesGrid() {
      return this.catalogueType === 'coaches-grid';
    },
    selectedTypes() {
      if (this.searchBar) {
        return this.selected_types ? [this.selected_types] : this.includedTypes;
      }

      return this.includedTypes;
    },
    brandBorderColor() {
      return 'tw-border-' + this.themeColor;
    },

    request_params: {
      cache: false,
      get() {
        return {
          required_fields: this.required_fields.concat(this.requiredFields),
          statuses: this.statuses,
          required_user_states: this.required_user_states,
          [this.isCoach ? 'title' : 'term']: this.search_term,
          included_types: this.selectedTypes,
          page: this.page,
          included_fields: this.included_fields,
        };
      },
    },

    $_contentEndpoint() {
      if (this.search_term && !this.isCoach) {
        return this.searchEndpoint;
      }

      return this.contentEndpoint;
    },

    sortBy() {
      if (this.search_term && !this.isCoach) {
        return "-score";
      }
      return this.sort || this.sortOverride || "-published_on";
    },

    noResultsMessageWithProgress() {
      if (this.required_user_states.length) {
        return `You do not have any ${this.required_user_states[0] || ""} ${
          this.catalogueName || "lessons"
        } that match those filters. Please remove some filters.`;
      }

      return this.noResultsMessage;
    },
  },
  mounted() {
    if (!this.preLoadedContent && !this.preLoadedContent.results.length) {
      this.getContent();
    }

    if (this.infiniteScroll && !this.loadMoreButton) {
      window.addEventListener("scroll", this.infiniteScrollEventHandler);
    }

    if (this.useUrlParams) {
      this.getUrlParams();
    }

    if (this.filterDuplicates && this.preLoadedContent) {
      this.preLoadedContent.data.forEach((item) => {
        this.loadedContentIds[item.id] = true;
      });
    }
  },
  watch: {
    catalogueType: function () {
      this.getContent();
    },
  },
  beforeDestroy() {
    if (this.infiniteScroll && !this.loadMoreButton) {
      window.removeEventListener("scroll", this.infiniteScrollEventHandler);
    }
  },
  methods: {
    handleContentSort(event) {
      this.sort = event.target.value;

      if (this.useUrlParams) {
        this.setUrlParams();
      }

      return this.getContent();
    },

    handleSortChange(value) {
        if (value != 0) {
            window.location.href = `${location.protocol}//${location.host
            }${location.pathname}?sort=${value}`;
        } else {
            window.location.href = `${location.protocol}//${location.host
            }${location.pathname}`;
        }
    },

    getUrlParams() {
      const params = window.location.search;
      const query_object = QueryString.parse(params, {
        arrayFormat: "bracket",
      });
      const keys = Object.keys(query_object);

      keys.forEach((key) => {
        if (key === "required_user_states") {
          // query-string is weird and parses arrays with 1 value as a string
          if (!Array.isArray(query_object[key])) {
            this.required_user_states = [query_object[key]];
          } else {
            query_object[key].forEach((param) => {
              this.required_user_states.push(param);
            });
          }
        } else if (key === "included_fields") {
          // query-string is weird and parses arrays with 1 value as a string
          if (!Array.isArray(query_object[key])) {
            this.included_fields = [query_object[key]];
          } else {
            query_object[key].forEach((param) => {
              this.included_fields.push(param);
            });
          }
        } else if (key === "required_fields") {
          if (!Array.isArray(query_object[key])) {
            let this_val = query_object[key].split(",");
            let this_key = this_val.shift();
            this.filter_params[this_key] = this_val.toString();
            if (this_key == "live_event_start_time") {
              this.eventType = this_val.pop() == ">" ? "upcoming" : "lessons";
            }
          } else {
            query_object[key].forEach((param) => {
              let this_val = param.split(",");
              let this_key = this_val.shift();
              this.filter_params[this_key] = this_val.toString();
              if (this_key == "live_event_start_time") {
                this.eventType = this_val.pop() == ">" ? "upcoming" : "lessons";
              }
            });
          }
        } else if (key === "included_types" && this.searchBar) {
          if (!Array.isArray(query_object[key])) {
            const this_val = query_object[key].split(",");
            this.selected_types[this_val[0]] = this_val[1];
          } else {
            if (query_object[key].length === 1) {
              query_object[key].forEach((param) => {
                this.selected_types = param;
              });
            }
          }
        } else if (key === "term" && this.searchBar) {
          this.search_term = query_object[key];
        } else if (key === "page" && this.paginate) {
          this.page = query_object[key];
        }
      });
    },

    setUrlParams() {
      const params = JSON.parse(JSON.stringify(this.request_params));

      if (!this.searchBar) {
        if (params.included_types) {
          delete params.included_types;
        }
        if (params.term) {
          delete params.term;
        }
      }

      if (!this.paginate) {
        if (params.page) {
          delete params.page;
        }
      }

      // If published is our only status just remove it fromm the url params
      if (this.statuses[0] === "published" && this.statuses.length === 1) {
        delete params.statuses;
      }

      const string = QueryString.stringify(params, { arrayFormat: "bracket" });

      const new_url = `${
        window.location.origin + window.location.pathname
      }?${string}`;

      window.history.replaceState(history.state, null, new_url);
    },

    fetchContent() {
      return axios
        .get(this.$_contentEndpoint, {
          params: {
            brand: this.brand,
            limit: this.limit,
            statuses: this.statuses,
            sort: this.sort || this.sortBy,
            ...this.request_params,
          },
        })
        .then((response) => response)
        .catch((error) => {
          console.error(error);
          Toasts.push({
            icon: "doh",
            themeColor: this.themeColor,
            title: "This is Embarrassing That didn't work",
            message:
              "Refresh the page and try once more, if it happens again please let us know using the chat below. ",
          });

          this.loading = false;
        });
    },

    getContent(replace = true, displayLoading = true) {
      if (!this.loading) {
        this.loading = displayLoading;
        this.requestingMore = true;

        return this.fetchContent().then((response) =>
          this.setContent(response, replace)
        );
      }
    },

    setContent(response, replace) {
      if (response) {
        // If infinite scroll is enabled:
        // Just add it to the array, don't replace it
        if (!replace) {
          let newContent;

          if (this.filterDuplicates) {
            newContent = response.data.data.filter((item) => {
              return !this.loadedContentIds[item.id];
            });
            newContent.forEach((item) => {
              this.loadedContentIds[item.id] = true;
            });
          } else {
            newContent = response.data.data;
          }

          this.content = [...this.content, ...newContent];
        } else {
          this.content = response.data.data;
        }
        this.page = Number(response.data.meta.page);
        this.total_results = response.data.meta.totalResults;
        this.total_pages = Math.ceil(
          response.data.meta.totalResults / this.limit
        );

        if (response.data.meta.filterOptions) {
          this.filters = ContentHelpers.flattenFilters(
            response.data.meta.filterOptions
          );
        }
      }

      setTimeout(() => {
        // Sometimes vue caches the add event button.
        // If it doesn't we need to force a refresh, done with a timeout to
        // Prevent race conditions.
        if (window.addeventatc) {
          window.addeventatc.refresh();
        }

        // Load the Imgix Service to load srcs and srcsets
        if (window.ImgixService) {
          window.ImgixService.loadImageSources();
        }
      }, 500);

      this.loading = false;
      this.requestingMore = false;
    },

    infiniteScrollEventHandler() {
      const scroll_position = window.pageYOffset + window.innerHeight;
      const scroll_buffer = document.body.scrollHeight * 0.75;

      if (scroll_position >= scroll_buffer && this.page < this.total_pages) {
        this.loadMore();
      }
    },

    loadMore() {
      if (!this.requestingMore) {
        this.page += 1;

        this.getContent(false, false);
      }
    },

    handlePageChange(payload) {
      if (!this.isPlaylists) {
        this.page = payload.page;

        if (this.paginate) {
          this.setUrlParams();
        }

        this.getContent();
      } else {
        const params = window.location.search;
        const query_object = QueryString.parse(params, {
          arrayFormat: "bracket",
        });

        query_object.page = payload.page;

        window.location.href = `${location.protocol}//${location.host}${
          location.pathname
        }?${QueryString.stringify(query_object)}`;
      }
    },

    handleFilterChange(payload) {
      this.$set(this.filter_params, payload.key, payload.value);
      this.page = 1;

      if (this.useUrlParams) {
        this.setUrlParams();
      }

      this.getContent();
    },

    handleProgressChange(payload) {
      this.required_user_states = [];
      this.page = 1;

      if (payload.type) {
        this.required_user_states.push(payload.type);
      }

      if (this.useUrlParams) {
        this.setUrlParams();
      }

      this.getContent();
    },

    handleTypeChange(payload) {
      this.selected_types = payload.value;
      this.page = 1;

      this.setUrlParams();

      this.getContent();
    },

    handleSearch(payload) {
      this.search_term = payload.term || undefined;
      this.page = 1;

      this.setUrlParams();

      this.getContent();
    },
  },
};
</script>
