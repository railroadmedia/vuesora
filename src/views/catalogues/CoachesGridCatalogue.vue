<template>
  <div
    class="
      tw-grid tw-gap-4 tw-grid-cols-2
      sm:tw-grid-cols-3
      md:tw-grid-cols-4
      lg:tw-grid-cols-5
      xl:tw-grid-cols-6
      tw-mb-4
    "
  >
    <NotificationToasts :icon="toast.icon" :text="toast.text" :isError="toast.showErrorMessage"/>
    <!-- Loop through Cards -->
    <coach-card
      v-for="(item, i) in content"
      :key="i"
      :item="item"
      :brand="brand"
      :content-type="item.type"
      :user-id="userId"
      :lock-unowned="lockUnowned"
      :content-type-override="contentTypeOverride"
      :show-my-list-action="showMyListAction"
      @onShowNotification="onShowNotificationMessage"
    />
  </div>
</template>
<script>
import CoachCard from "./_CoachCard.vue";
import UserCatalogueEvents from "../../mixins/UserCatalogueEvents";
import NotificationToasts from '../../components/NotificationToasts/NotificationToasts.vue';

export default {
  name: "CoachesGridCatalogue",
  components: {
    "coach-card": CoachCard,
    "NotificationToasts": NotificationToasts
  },
  mixins: [UserCatalogueEvents],
  data() {
    return {
      toast: {
        icon: "",
        text: "",
        showErrorMessage: false,
      },
    };
  },
  methods: {
    onShowNotificationMessage({ icon, text, error }) {
      if (error) {
        this.toast.showErrorMessage = true;
        this.toast.icon = '';
        this.toast.text = '';
      } else {
        this.toast.icon = icon;
        this.toast.text = text;
      }
    },
  },
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    themeColor: {
      type: String,
      default: () => "drumeo",
    },
    useThemeColor: {
      type: Boolean,
      default: () => true,
    },
    userId: {
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
    noWrap: {
      type: Boolean,
      default: () => false,
    },
    forceWideThumbs: {
      type: Boolean,
      default: () => false,
    },
    contentTypeOverride: {
      type: String,
      default: () => "",
    },
    lockUnowned: {
      type: Boolean,
      default: () => false,
    },
    displayInline: {
      type: Boolean,
      default: () => false,
    },
    showMyListAction: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>
