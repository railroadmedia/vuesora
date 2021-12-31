<template>
    <div class="container tw-my-3 tw-w-full">
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-flex-wrap md:tw-flex-nowrap " v-if="content">
            
            <!-- Live Event Image -->
            <a :href="eventIsLive ? '/members/live' : eventCoachProfileUrl" 
                class="tw-w-full md:tw-w-52 tw-cursor-pointer tw-flex tw-flex-col tw-mb-2 md:tw-mb-0 md:tw-mr-4">
                <div class="tw-relative">
                    <img
                        class="tw-rounded-lg tw-w-full"
                        :src="'https://cdn.musora.com/image/fetch/c_thumb,g_face,w_320,h_180,z_0.75,q_auto:best/' + (content.thumbnail_url ? content.thumbnail_url : instructor.head_shot_picture_url)"
                    >
                </div>
            </a>

            <div class="tw-flex tw-w-full tw-flex-col sm:tw-flex-row">
                <!-- Event Details -->
                <div class="tw-flex tw-flex-col tw-justify-center tw-pr-4">
                    
                    <div class="tw-flex tw-items-center tw-mb-1.5">
                        <!-- Live Badge -->
                        <a href="/members/live" class="tw-flex tw-no-underline flex-row" v-if="eventIsLive">
                            <div class="flex-center tw-text-white tw-uppercase tw-rounded tw-bg-red-500 tw-text-sm tw-font-bold tw-leading-none tw-p-1.5"><span>live</span></div>
                        </a>

                        <!-- Countdown -->
                        <div class="tw-text-white tw-text-sm font-bold tw-p-1.5 tw-leading-none tw-rounded tw-inline-flex tw-mr-2" 
                            :class="[brandBGColor]"
                            v-if="!eventIsLive">
                            <span class="tw-uppercase ">Upcoming:&nbsp;</span>
                            <span>{{ $_hours }}</span>
                            <span>&nbsp;hrs&nbsp;-&nbsp;</span>
                            <span>{{ $_minutes }}</span>
                            <span>&nbsp;minutes</span>
                        </div>

                        <!-- Start Date -->
                        <p class="tw-uppercase tw-leading-none tw-hidden xl:tw-block" v-if="!eventIsLive">
                            <span>{{ startWeekday }}</span>,
                            <span>{{ startMonth }}</span>
                            <span> {{ startDay }}</span>
                            @
                            <span>{{ formattedTime }}</span>
                        </p>
                    </div>

                    <!-- Event Title & Desc -->
                    <div class="tw-mb-1.5">
                        <a :href="eventIsLive ? '/members/live' : eventCoachProfileUrl"
                            class="tw-font-bold tw-no-underline tw-text-black tw-capitalize tw-leading-none tw-text-2xl">
                            {{ content.title }}
                        </a>
                    </div>

                    <!-- Coach --> 
                    <a :href="eventCoachProfileUrl" class="tw-flex tw-flex-row tw-items-center tw-no-underline">
                        <h4 class="tw-leading-none  tw-text-lg tw-uppercase tw-font-normal"
                            :class="[brandTextColor]"
                        >
                            {{ instructor.name.split(' ')[0] }}
                            <span class="tw-font-bold"> {{ instructor.name.split(' ')[1] }}</span>
                            <!-- Optional third name -->
                            <span class="tw-font-bold"> {{ instructor.name.split(' ')[2] }}</span>
                        </h4>
                    </a>
                </div>

                <!-- Buttons -->
                <div class="tw-flex tw-flex-col tw-justify-center tw-mt-3 sm:tw-mt-0 sm:tw-ml-auto">
                    <div class="tw-mb-3" v-if="eventIsLive || showWatch">
                        <div class="tw-flex tw-flex-row tw-flex-wrap-md tw-mt-2">
                            <div>
                                <a href="/members/live" 
                                class="tw-btn-primary tw-w-full" 
                                :class="[brandBGColor, brandHoverColor]"
                                >
                                    watch now
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="tw-flex tw-flex-nowrap"
                        :class="{'tw-pt-3': showWatch}"
                        v-if="!eventIsLive && !showWatch"
                    >
                        <!-- Add to My List -->
                        <button class="tw-cursor-pointer tw-with-tooltip tw-tooltip-top tw-tooltip-center tw-border-0 tw-bg-transparent tw-transition tw-text-3xl tw-mr-6"
                                @click.stop.prevent="toggleMyList" 
                                :class="[is_added ? 'is-added ' + brandTextColor : 'tw-text-gray-400' ]"
                        >
                            <i class="fas fa-plus tw-transform tw-transition tw-origin-center" 
                               :class="[is_added  ? 'tw-rotate-45' : 'tw-rotate-0']">
                            </i>
                            <!-- Tooltip -->
                            <div role="tooltip" 
                                class="tw-tooltip tw-tooltip-dark" 
                                :class="[is_added ? brandBGColor : 'tw-bg-gray-400' ]"
                                id="tooltip-#"
                            >
                                {{ is_added ? 'Added to My List' : 'Add to My List'  }}
                            </div>
                        </button>

                        <!-- Subscribe to Calendar -->
                        <button class="tw-cursor-pointer tw-with-tooltip tw-tooltip-top tw-tooltip-right tw-border-0 tw-bg-transparent tw-text-3xl" 
                                data-open-modal="scheduleAddToCalendarModal"
                                :class="[brandTextColor]"
                        >
                            <i class="fas fa-calendar-plus"></i> 
                            <!-- Tooltip -->
                            <div role="tooltip" 
                                class="tw-tooltip tw-tooltip-dark" 
                                :class="[brandBGColor]"
                                id="tooltip-#"
                            >
                                Subscribe to Calendar
                            </div>
                        </button>

                        <content-schedule
                            :subscription-calendar-id="subscriptionCalendarId"
                            :theme-color="brand"
                        ></content-schedule>
                    </div>
                </div>
            </div>
            
        </div>

    </div>
</template>

<script>
import {Content as ContentHelpers} from '@musora/helper-functions';
import ContentSchedule from '../../views/schedule/Schedule.vue';
import ContentService from '../../assets/js/services/content';
import {DateTime} from 'luxon';

export default {
    components: {
        'content-schedule': ContentSchedule,
    },
    name: 'CoachEvent',
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        preloadedContent: {
            type: Object,
            default: () => ({}),
        },
        currentDateString: {
            type: String,
            default: () => '',
        },
        subscriptionCalendarId: {
            type: String,
            default: () => '',
        },
        timeCutoffMinutes: {
            type: Number,
            default: () => 0,
        },
        youtubeEventId: {
            type: String,
            default: () => '',
        },
        eventCoachProfileUrl: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            content: null,
            instructor: null,
            currentDate: DateTime.fromSQL(this.currentDateString, { zone: 'UTC' }),
            counterValue: 0,
            eventIsLive: false,
            showWatch: false,
            showWatchSecondsBeforeLive: 60*15,
            startTime: '',
            startDate: '',
            startDay: '',
            startWeekday: '',
            startMonth: '',
            formattedTime: '',
        }
    },
    mounted() {
        if (this.preloadedContent && this.preloadedContent.data && this.preloadedContent.data[0]) {

            this.content = ContentHelpers.flattenContentObject(this.preloadedContent.data[0], true);
            this.instructor = this.content.instructor[0];
            
            this.startTime = DateTime
                                    .fromSQL(this.content.live_event_start_time, { zone: 'UTC' });
            this.startDate = new Date(this.startTime);
            this.startWeekday = this.startDate.toLocaleString("en-US", { weekday: "long" });;
            this.startMonth = this.startDate.toLocaleString("en-US", { month: "long" });
            this.startDay = this.startDate.getDate();
            this.formattedTime = this.startDate.toLocaleTimeString([], { timeStyle: 'short' }) +'';

            if (this.startTime < this.currentDate) {
                this.setLiveState();
            } else {
                this.eventIsLive = false;
                let secondsToStart = this.startTime.diff(this.currentDate, 'seconds').toObject().seconds;

                if (secondsToStart < this.showWatchSecondsBeforeLive) {
                    this.showWatch = true;
                } else {
                    setTimeout(() => {
                        this.showWatch = true;
                    }, (secondsToStart - this.showWatchSecondsBeforeLive) * 1000);
                }

                this.counterValue = secondsToStart;

                this.startCounter();
            }
        }
    },
    computed: {
        $_hours() {
            return this.padTwoDigits(Math.floor(this.counterValue / 3600));
        },
        $_minutes() {
            let hours = Math.floor(this.counterValue / 3600);
            let secondsForMinutes = this.counterValue - hours * 3600;

            return this.padTwoDigits(Math.floor(secondsForMinutes / 60));
        },
        $_seconds() {
            let hours = Math.floor(this.counterValue / 3600);
            let secondsForMinutes = this.counterValue - hours * 3600;
            let minutes = Math.floor(secondsForMinutes / 60);

            return this.padTwoDigits(secondsForMinutes - minutes * 60);
        },
        $_iframeSource() {
            return `https://www.youtube.com/embed/${  this.youtubeEventId  }?rel=0&autoplay=1&playsinline=1&modestthemeColoring=1`;
        },
        is_added: {
            cache: false,
            get() {
                return this.content.is_added_to_primary_playlist;
            },
        },
        brandBGColor() {
            return 'tw-bg-' + this.brand;
        },
        brandHoverColor() {
            return 'hover:tw-bg-' + this.brand + '-600';
        },
        brandBorderColor() {
            return 'tw-border-' + this.brand;
        },
        brandTextColor() {
            return 'tw-text-' + this.brand;
        }
    },
    methods: {
        startCounter() {
            this.$nextTick(() => {
                const interval = setInterval(function () {
                    this.counterValue -= 1;
                    if(this.counterValue <= 0) {
                        this.setLiveState();
                        clearInterval(interval);
                    }
                }.bind(this), 1000);
            });
        },

        padTwoDigits(number) {
            if (number < 100) {
                return ('0' + number).slice(-2);
            } else {
                return number;
            }
        },

        toggleMyList() {
            ContentService
                .addOrRemoveContentFromList(this.content.id, this.content.is_added_to_primary_playlist)
                .then((response) => {
                    this.content.is_added_to_primary_playlist = !this.content.is_added_to_primary_playlist;
                });
        },

        setLiveState() {
            this.eventIsLive = true;
            document.body.classList.add('live');
        },
    },
}
</script>