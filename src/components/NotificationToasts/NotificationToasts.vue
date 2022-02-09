<template>
  <div
    v-if="showNotification"
    style="position: fixed; left: 0; width: 100vw; z-index: 2000; bottom: 40px;"
  >
    <div class="tw-text-center tw-pb-6">
      <div
        :style="isError ? 'background-color: red;' : ''"
        class="
          tw-px-3
          tw-py-2
          tw-w-4/6
          tw-justify-self-center
          tw-mx-auto
          tw-rounded-md
        "
        :class="isError ? '' : 'tw-bg-' + brandName"
      >
        <div class="tw-flex tw-justify-between tw-text-white tw-text-small">
          <div>
            <i class="far tw-mr-2" :class="notificationIcon ? notificationIcon : 'fa-bell'"></i>
            {{ notificationText }}
          </div>
          <button
            class="tw-bg-transparent tw-border-none"
            v-on:click="hide();"
          >
            <i class="far fa-times-circle tw-text-white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let timeout = null;
const hideToast = (context) => {
  context.showNotification = false;
  context.notificationIcon = '';
  context.notificationText = '';
  clearTimeout(timeout);
};
const autoHide = (context) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      hideToast(context);
    }, 3000);
};
export default {
  name: "NotificationToasts",
  props: {
    brandName: {
      type: String,
      default: () => "drumeo",
    },
    text: {
      type: String,
      default: () => "",
    },
    icon: {
      type: String,
      default: () => "",
    },
    isError: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      showNotification: false,
      notificationIcon: this.icon,
      notificationText: this.text,
    };
  },
  methods: {
    hide: function() {
      hideToast(this);
    },
  },
  watch: {
    icon(val) {
      this.showNotification = true;
      this.notificationIcon = val;
    },
    text(val) {
      this.showNotification = true;
      this.notificationText = val;
    },
    isError(val) {
      if (val) {
        this.showNotification = true;
        this.notificationText = 'There has been an error, please try again later';
        this.notificationIcon = 'fa-exclamation-circle';
      }
    },
  },
  mounted() {
    autoHide(this);
  },
  updated() {
    autoHide(this);
  },
};
</script>
