<template>
    <div class="coach-event container mv-4">
        <div class="flex flex-row" v-if="content">
            <div class="coach-event-image relative">
                <img
                    class=""
                    :src="content.thumbnail_url"
                >
                <div class="coach-event-upcoming uppercase dense font-bold text-white" v-if="!eventIsLive">upcoming event</div>
                <div class="coach-event-counter flex flex-row align-center" v-if="!eventIsLive">
                    <div class="coach-event-counter-inner text-white flex flex-row align-center">
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>{{ $_hours }}</span></div>
                                <div class="event-counter-label sans font-bold uppercase">hours</div>
                            </div>
                        </div>
                        <div>
                            <div class="event-counter-number dense font-bold">:</div>
                            <div class="event-counter-label sans font-bold uppercase">&nbsp;</div>
                        </div>
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>{{ $_minutes }}</span></div>
                                <div class="event-counter-label sans font-bold uppercase">minutes</div>
                            </div>
                        </div>
                        <div>
                            <div class="event-counter-number dense font-bold">:</div>
                            <div class="event-counter-label sans font-bold uppercase">&nbsp;</div>
                        </div>
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>{{ $_seconds }}</span></div>
                                <div class="event-counter-label sans font-bold uppercase">seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="coach-event-data flex flex-column align-v-center">
                <div class="mb-2" v-if="eventIsLive">
                    <div class="flex flex-row">
                        <div class="flex-center corners-5 bg-live text-white uppercase live-badge sans"><span>live</span></div>
                        <div class="flex flex-row align-center ml-1 corners-5 bg-grey-4 text-white viewer-count sans"><i class="fas fa-eye"></i> <span>143</span></div>
                    </div>
                </div>
                <div class="mv-2">
                    <div class="flex flex-row align-v-center">
                        <div class="coach-avatar">
                            <img
                                class="bg-grey-2 rounded drumeo"
                                src="https://s3.amazonaws.com/pianote/defaults/avatar.png"
                                data-test-src="instructor.thumbnail_url"
                            >
                        </div>
                        <h4 class="sans coach-name font-bold text-drumeo uppercase">{{ instructor.name }}</h4>
                    </div>
                </div>
                <div class="coach-event-details mv-2">
                    <h3 class="heading sans font-bold capitalize">{{ content.title }}</h3>
                    <div class="coach-event-description mv-2">{{ content.description }}</div>
                </div>
                <div v-if="!eventIsLive">
                    <div class="coach-event-subscribe">
                        <button class="btn" data-open-modal="scheduleAddToCalendarModal">
                            <span class="text-white bg-drumeo">
                                <i class="fas fa-calendar-plus mr-1"></i>
                                Subscribe to Calendar
                            </span>
                        </button>
                    </div>

                    <content-schedule
                        :subscription-calendar-id="subscriptionCalendarId"
                        :theme-color="brand"
                    ></content-schedule>
                </div>
                <div class="mt-2" v-if="eventIsLive">
                    <div class="flex flex-row">
                        <div class="coach-event-cta">
                            <button class="btn">
                                <span class="text-white bg-drumeo uppercase">
                                    watch
                                </span>
                            </button>
                        </div>
                        <div class="coach-event-cta">
                            <button class="btn">
                                <span class="text-drumeo bg-drumeo inverted uppercase">
                                    <i class="far fa-plus mr-1"></i>
                                    my list
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Content as ContentHelpers } from '@musora/helper-functions';
import ContentSchedule from '../../views/schedule/Schedule.vue';
import { DateTime } from 'luxon';

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
        },
        subscriptionCalendarId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            content: null,
            instructor: null,
            currentDate: DateTime.fromSQL(this.currentDateString, { zone: 'UTC' }),
            counterValue: 0,
            eventIsLive: false,
        }
    },
    mounted() {
        if (this.preloadedContent && this.preloadedContent.data && this.preloadedContent.data[0]) {

            this.content = ContentHelpers.flattenContentObject(this.preloadedContent.data[0], true);
            this.instructor = this.content.instructor[0];

            if (this.content.live_event_start_time < this.currentDate) {
                this.eventIsLive = true;
            } else {
                this.eventIsLive = false;

                const eventStartDate = DateTime.fromSQL(this.content.live_event_start_time, { zone: 'UTC' });

                this.counterValue = eventStartDate.diff(this.currentDate, 'seconds').toObject().seconds;

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
    },
    methods: {
        startCounter() {
            this.$nextTick(() => {
                const interval = setInterval(function () {
                    this.counterValue -= 1;
                    if(this.counterValue <= 0) {
                        this.eventIsLive = true;
                        clearInterval(interval);
                    }
                }.bind(this), 1000);
            });
        },

        padTwoDigits(number) {
            return ('0' + number).slice(-2)
        },
    },
}
</script>

<style lang="scss">
.coach-event {
    margin-bottom: 100px;

    .coach-event-image {
        max-width: 915px;
        cursor: pointer;

        .coach-event-upcoming {
            position: absolute;
            top: 20px;
            left: 0;
            font-size: 24px;
            padding: 15px 90px 15px 15px;
            background: -webkit-gradient(linear, right top, left top, from(transparent), to(rgba(8, 85, 160, 1)));
            background: linear-gradient(to left, transparent 0%, rgba(8, 85, 160, 1) 100%);
        }

        .coach-event-counter {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            .event-counter-number {
                font-size: 50px;
            }

            .event-counter-label {
                font-size: 12px;
            }
        }
    }

    .coach-event-data {
        margin-left: 50px;

        .live-badge,
        .viewer-count {
            font-size: 15px;
            line-height: 15px;
            font-weight: 600;
            height: 25px;
            border-radius: 5px;
        }

        .live-badge {
            width: 48px;
        }

        .viewer-count {
            max-width: 54px;
            width: 54px;

            i {
                margin-right: 3px;
            }
        }

        .coach-avatar {
            max-width: 50px;
            max-height: 50px;

            img.drumeo {
                border: 3px solid #0B76DB;
            }
        }

        .coach-name {
            font-size: 24px;
            margin-left: 10px;
        }

        .coach-event-details .coach-event-description {
            font-size: 18px;
            line-height: 30px;
        }

        .coach-event-subscribe {
            max-width: 300px;
        }

        .coach-event-cta {
            width: 217px;
        }

        .coach-event-cta + .coach-event-cta {
            margin-left: 20px;
        }
    }
}
</style>