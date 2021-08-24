<template>
    <div class="container tw-my-3">
        <div class="tw-flex tw-flex-row tw-flex-wrap md:tw-flex-nowrap " v-if="content">
            
            <!-- Live Event Image -->
            <a :href="eventCoachProfileUrl" class="tw-w-full tw-max-w-7xl tw-cursor-pointer tw-flex tw-flex-col" v-if="!eventIsLive">
                <div class="tw-relative">
                    <img
                        class="tw-rounded-lg tw-w-full"
                        :src="'http://cdn.musora.com/image/fetch/w_915,q_515,q_auto:best/' + (content.thumbnail_url ? content.thumbnail_url : instructor.header_image_url)"
                    >
                </div>
            </a>

            <!-- Video -->
            <div class="tw-h-full tw-w-full tw-flex tw-flex-col tw-max-w-7xl tw-mx-auto" v-if="eventIsLive">
                <div class="tw-w-full tw-relative" style="padding-bottom: 56.25%;">
                    <iframe id="player"
                            frameborder="0" 
                            class="tw-h-full tw-w-full tw-absolute tw-top-0 tw-left-0"
                            allowfullscreen="1" 
                            allow="autoplay; encrypted-media" 
                            title="YouTube video player" 
                            :src="$_iframeSource">
                    </iframe>
                </div>
            </div>

            <!-- Event Details -->
            <div class="tw-flex tw-flex-col tw-justify-center tw-mt-3 tw-ml-0 md:tw-mt-0 md:tw-mx-5 xl:tw-mx-10">
                
                <!-- Live Badge -->
                <div class="tw-my-2"  v-if="eventIsLive">
                    <div class="tw-flex flex-row">
                        <div class="flex-center tw-text-white tw-uppercase tw-rounded tw-bg-red-500 tw-text-sm tw-font-bold tw-py-0.5 tw-px-2"><span>live</span></div>
                    </div>
                </div>

                <!-- Coach -->
                <div class="tw-my-3">
                    <a :href="eventCoachProfileUrl" class="tw-flex tw-flex-row tw-items-center tw-no-underline">
                        <div>
                            <img
                                class="tw-rounded-full tw-border-3 tw-border-solid tw-w-16 tw-h-16"
                                :class="[brandBorderColor]"
                                :src=" 'http://cdn.musora.com/image/fetch/w_150,h_150,q_auto:best,c_fill,g_face/' + (instructor.head_shot_picture_url ? instructor.head_shot_picture_url : 'https://s3.amazonaws.com/pianote/defaults/avatar.png')"
                            >
                        </div>
                        <h4 class="tw-ml-3 tw-text-lg tw-font-bold tw-uppercase"
                            :class="[brandTextColor]"
                        >{{ instructor.name }}</h4>
                    </a>
                </div>

                <!-- Event Title & Desc -->
                <div class="tw-mb-4">
                    <h3 class="tw-font-bold tw-capitalize tw-text-2xl lg:tw-text-32">{{ content.title }}</h3>
                    <div class="tw-mt-2 tw-text-base" v-html="content.description"></div>
                </div>

                <!-- Countdown -->
                <div class="tw-mb-3 lg:tw-mb-6 tw-italic" 
                     :class="[brandTextColor]"
                     v-if="!eventIsLive">
                  <span class="font-bold">Starts in:&nbsp;</span><span>{{ $_hours }}</span><span>&nbsp;Hours&nbsp;-&nbsp;</span><span>{{ $_minutes }}</span><span>&nbsp;Minutes&nbsp;-&nbsp;</span><span>{{ $_seconds }}</span><span>&nbsp;Seconds</span>
                </div>

                <!-- Event CTAs -->
                <div class="tw-mb-3" v-if="eventIsLive || showWatch">
                    <div class="tw-flex tw-flex-row tw-flex-wrap-md tw-mt-2">
                        <div>
                            <a href="/members/live" 
                               class="tw-btn-primary tw-w-full" 
                               :class="[brandBGColor]"
                            >
                                watch
                            </a>
                        </div>

                        <div class=" tw-ml-3" v-if="eventIsLive">
                            <button @click.stop.prevent="toggleMyList" 
                                    :class="[is_added ? 'is-added tw-btn-primary ' + brandBGColor : 'tw-btn-secondary ' + brandTextColor ]"
                            >
                                <i class="fal fa-plus tw-mr-1"></i>
                                My List
                            </button>
                        </div>
                    </div>
                </div>

                <div :class="{'tw-pt-3': showWatch}"
                     v-if="!eventIsLive"
                >
                    <div>
                        <button class="tw-btn-primary" 
                                data-open-modal="scheduleAddToCalendarModal"
                                :class="[brandBGColor]"
                        >
                            <i class="fas fa-calendar-plus tw-mr-1"></i>
                            Subscribe to {{ instructor.name.split(' ')[0] }}'s Calendar
                        </button>
                    </div>

                    <content-schedule
                        :subscription-calendar-id="subscriptionCalendarId"
                        :theme-color="brand"
                    ></content-schedule>
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
        }
    },
    mounted() {
        if (this.preloadedContent && this.preloadedContent.data && this.preloadedContent.data[0]) {

            this.content = ContentHelpers.flattenContentObject(this.preloadedContent.data[0], true);
            this.instructor = this.content.instructor[0];

            let startTime = DateTime
                                    .fromSQL(this.content.live_event_start_time, { zone: 'UTC' });

            if (startTime < this.currentDate) {
                this.setLiveState();
            } else {
                this.eventIsLive = false;
                let secondsToStart = startTime.diff(this.currentDate, 'seconds').toObject().seconds;

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