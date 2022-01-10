<template>
  <div>
    <!-- Toasts start -->
    <div
      class="tw-sticky tw-bottom-0 tw-text-center tw-pb-6"
      id="unsubscribeToast"
    >
      <div
        class="
                tw-bg-{{ brandName }}
                tw-px-3
                tw-py-2
                tw-w-4/6
                tw-justify-self-center
                tw-mx-auto
                tw-rounded-md"
      >
        <div class="tw-flex tw-justify-between tw-text-white tw-text-small">
          <div>
            <i class="far fa-bell-slash tw-mr-2"></i>You will no longer receive
            updates when {{ firstName }} releases new content
          </div>
          <button
            class="tw-bg-transparent tw-border-none"
            onclick="hideElement('unsubscribeToast');"
          >
            <i class="far fa-times-circle tw-text-white"></i>
          </button>
        </div>
      </div>
    </div>
    <div
      class="tw-sticky tw-bottom-0 tw-text-center tw-pb-6 tw-hidden"
      id="subscribeToast"
    >
      <div
        class="tw-bg-{{ brandName }}
                tw-px-3
                tw-py-2
                tw-w-4/6
                tw-justify-self-center
                tw-mx-auto
                tw-rounded-md"
      >
        <div class="tw-flex tw-justify-between tw-text-white tw-text-small">
          <div>
            <i class="fas fa-envelope tw-mr-2"></i>You will now receive updates
            when {{ firstName }} releases new content!
          </div>
          <button
            class="tw-bg-transparent tw-border-none"
            onclick="hideElement('subscribeToast');"
          >
            <i class="far fa-times-circle tw-text-white"></i>
          </button>
        </div>
      </div>
    </div>
    <div
      class="tw-sticky tw-bottom-0 tw-text-center tw-pb-6 tw-hidden"
      id="errorToast"
    >
      <div
        class="
          tw-bg-red
          tw-px-3
          tw-py-2
          tw-w-4/6
          tw-justify-self-center
          tw-mx-auto
          tw-rounded-md
        "
      >
        <div class="tw-flex tw-justify-between tw-text-white tw-text-small">
          <div>
            <i class="far fa-bell-slash tw-mr-2"></i>There has been an error
            please try again later
          </div>
          <button
            class="tw-bg-transparent tw-border-none"
            onclick="hideElement('errorToast');"
          >
            <i class="far fa-times-circle tw-text-white"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- Toasts end -->
  </div>
</template>

<script>
export default {
  name: "NotificationToasts",
  props: {
    brandName: {
      type: String,
      default: () => 'drumeo',
    },
    firstName: {
      type: String,
      default: () => 'TEST',
    },
  },
};
</script>
