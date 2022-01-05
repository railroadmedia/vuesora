<template>
  <div
    class="
      tw-w-full tw-grid tw-grid-cols-1
      sm:tw-grid-cols-2
      xl:tw-grid-cols-4
      tw-grid-flow-row tw-gap-0
    "
  >
    <div
      v-for="instructor in instructorList"
      :key="
        String(instructor.id) + String(instructor.current_user_is_subscribed)
      "
      class="tw-flex tw-font-normal tw-text-sm sm:tw-pr-6 tw-mb-6"
    >
      <div>
        <div
          class="
            tw-relative
            tw-w-14
            tw-h-14
            tw-rounded-full
            tw-bg-contain
            tw-bg-center
            tw-bg-no-repeat
            tw-overflow-hidden
            tw-box-border
            tw-p-0
            tw-m-0
          "
          :style="
            'background-image:url( ' + instructor.coach_profile_image + ' );'
          "
        >
          <div
            class="tw-absolute tw-bottom-0 tw-w-full tw-h-3 tw-p-0 tw-m-0 tw-bg-yellow-500"
          >
            <svg
              class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-mx-auto"
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style="margin-bottom: 2px"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35215 3.84595V3.84324L9.35052 3.84405C9.21476 3.6904 7.08676 1.28058 6.09742 0.488782C5.14899 -0.240968 3.41689 -0.194628 1.80131 1.1142L1.57802 1.29223C1.56528 1.30171 1.55201 1.30903 1.53981 1.31933C0.605203 2.05639 0.525263 3.51345 1.36123 4.57271C2.19693 5.63251 3.63231 5.894 4.56665 5.15694C4.75769 5.00655 4.95036 4.67107 5.06932 4.47001L7.00032 6.75952L9.31855 5.22849L9.35188 3.85381L9.35567 3.85029C9.35486 3.84921 9.35296 3.84704 9.35215 3.84596V3.84595ZM8.86032 5.03745L7.73278 5.72628V5.40408L8.86032 4.71552V5.03745ZM7.29189 5.01089L4.76447 1.92986C4.7577 1.92119 4.75228 1.91198 4.74523 1.90303C4.72789 1.88108 4.70892 1.86184 4.69103 1.84071L4.63304 1.76998L4.63195 1.77188C4.12983 1.21068 3.45102 0.910442 2.79525 0.903392C3.9835 0.271742 5.16117 0.194782 5.87574 0.766272C6.76672 1.47895 8.68851 3.63323 9.03428 4.02317L7.29189 5.01089Z"
                fill="white"
              />
            </svg>
          </div>
          <div
            v-on:click="goToCoachProfile(instructor.slug)"
            class="tw-w-full tw-h-full tw-absolute tw-rounded-full tw-cursor-pointer tw-border-solid tw-border-yellow-500"
            :style="'border: 2px solid;'"
          ></div>
        </div>
      </div>
      <div
        class="
          tw-flex
          tw-flex-col
          tw-pl-3
          tw-text-gray-500
          tw-uppercase
          tw-justify-between
        "
      >
        <h4 v-on:click="goToCoachProfile(instructor.slug)" class="tw-cursor-pointer">
          <span class="tw-text-xs sm:tw-text-base tw-font-normal">
            {{ instructor.name.split(" ")[0] }}
          </span>
          <span class="tw-text-xs sm:tw-text-base tw-font-bold">
            {{ instructor.name.split(" ")[1] }}
          </span>
        </h4>
        <button
          v-if="!instructor.current_user_is_subscribed"
          v-on:click="followCoach(instructor.id)"
          class="
            tw-text-left tw-px-0 tw-py-0 tw-text-xs
            sm:tw-text-base
            tw-transition-none
            tw-text-white
            tw-border-none
            tw-bg-transparent
            tw-uppercase
            tw-font-bold
            tw-cursor-pointer
          "
        >
          <span>
            <i aria-hidden="true" class="fa fa-bell"></i>
            <span class="tw-pl-2">Subscribe</span></span
          >
        </button>
        <button
          v-if="instructor.current_user_is_subscribed"
          v-on:click="unfollowCoach(instructor.id)"
          class="
            tw-text-left tw-px-0 tw-py-0 tw-text-xs
            sm:tw-text-base
            tw-transition-none
            tw-text-white
            tw-border-none
            tw-bg-transparent
            tw-uppercase
            tw-font-bold
            tw-cursor-pointer
          "
        >
          <span>
            <i aria-hidden="true" class="fa fa-check"></i>
            <span class="tw-pl-2">Subscribed</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ContentService from "../../assets/js/services/content";

export default {
  name: "CoachesInLesson",
  props: {
    brand: {
      type: String,
      default: () => "drumeo",
    },

    instructors: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      instructorList: [],
    };
  },
  mounted() {
    this.instructorList = [...this.instructors];
  },
  methods: {
    updateCoachState(id) {
      const instructorIndex = this.instructorList.findIndex(
        (instructor) => instructor.id === id
      );
      const selectedInstructor = this.instructorList[instructorIndex];
      this.instructorList[instructorIndex] = {
        ...selectedInstructor,
        current_user_is_subscribed:
          !selectedInstructor.current_user_is_subscribed,
      };
      this.$forceUpdate();
    },
    followCoach(id) {
      return ContentService.followCoach({
        coachId: id,
      }).then(() => {
        this.updateCoachState(id);
      });
    },

    unfollowCoach(id) {
      return ContentService.unfollowCoach({
        coachId: id,
      }).then(() => {
        this.updateCoachState(id);
      });
    },

    goToCoachProfile(slug) {
      window.location.href = `${window.location.origin}/members/coaches/${slug}`
    }
  },
};
</script>
