<template>
  <section id="content-catalogue">
    <div class="tw-flex tw-justify-between tw-items-center">
      <h1 class="tw-text-4xl tw-font-bold">All Lessons</h1>
      <button
        v-on:click="changeGridState"
        class="tw-bg-transparent tw-border-none tw-cursor-pointer"
        :class="{
          [`tw-text-${brand}`]: brand,
        }"
      >
        <span v-if="!showGrid">
          Grid View <i aria-hidden="true" class="fas fa-th tw-ml-2"></i>
        </span>
        <span v-if="showGrid">
          List View <i aria-hidden="true" class="fas fa-list tw-ml-2"></i>
        </span>
      </button>
    </div>
    <content-catalogue
      :theme-color="catalogueProps.themeColor"
      :brand="catalogueProps.brand"
      :content-endpoint="catalogueProps.contentEndpoint"
      :catalogue-type="showGrid ? 'coach-grid' : 'list'"
      :limit="String(catalogueProps.limit)"
      :infinite-scroll="catalogueProps.infiniteScroll"
      :statuses="catalogueProps.statuses"
      :included-types="catalogueProps.includedTypes"
      :required-fields="catalogueProps.requiredFields"
      :included-fields="catalogueProps.includedFields"
      :pre-loaded-content="catalogueProps.preLoadedContent"
      :user-id="String(catalogueProps.userId)"
      :is-admin="catalogueProps.isAdmin"
      :use-url-params="catalogueProps.useUrlParams"
      :sort-override="catalogueProps.sortOverride"
      :lock-unowned="catalogueProps.lockUnowned"
      :show-loading-animation="catalogueProps.showLoadingAnimation"
      :search-bar="catalogueProps.searchBar"
      :total-results="catalogueProps.totalResults"
      :paginate="catalogueProps.paginate"
      :four-wide="catalogueProps.fourWide"
      :coach-id="String(catalogueProps.coachId)"
      :is-coach="catalogueProps.isCoach"
    >
      <slot></slot>
    </content-catalogue>
  </section>
</template>

<script>
import { getCookie, setCookie } from "../../assets/js/functions/cookies";
import ContentCatalogue from "./ContentCatalogue.vue";

export default {
  name: "ContentCatalogueContainer",
  components: {
    "content-catalogue": ContentCatalogue,
  },
  props: {
    brand: {
      type: String,
      default: () => "drumeo",
    },
    catalogueProps: {
      type: Object,
      default: () => null,
    },
  },
  data: function () {
    return {
      showGrid: true,
    };
  },
  mounted: function () {
    const userPrefersGridMode = getCookie("userPrefersGridMode");
    if (userPrefersGridMode === "YES") {
      this.showGrid = true;
    } else if (userPrefersGridMode === "NOPE") {
      this.showGrid = false;
    }
  },
  methods: {
    changeGridState() {
      this.showGrid = !this.showGrid;
      if (this.showGrid) {
        setCookie("userPrefersGridMode", "YES", 365);
      } else {
        setCookie("userPrefersGridMode", "NOPE", 365);
      }
    },
  },
};
</script>
