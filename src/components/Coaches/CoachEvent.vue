<template>
    <div class="coach-event container mv-2">
        <div class="flex flex-row flex-wrap-md" v-if="content">
            <div class="coach-event-image flex flex-column align-v-center" v-if="!eventIsLive">
                <div class="relative">
                    <img
                        class=""
                        :src="'http://cdn.musora.com/image/fetch/w_915,q_515,f_auto/' + (content.thumbnail_url ? content.thumbnail_url : instructor.header_image_url)"
                    >
                    <div class="coach-event-upcoming uppercase dense font-bold text-white" v-if="!eventIsLive">upcoming event</div>
                    <div class="coach-event-counter flex flex-row align-v-bottom" v-if="!eventIsLive">
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
            </div>
            <div class="coach-event-video flex flex-column" v-if="eventIsLive">
                <div style="width: 100%; padding-bottom: 56.25%; position: relative;">
                    <iframe id="player"
                            frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" :src="$_iframeSource"></iframe>
                </div>
            </div>
            <div class="coach-event-data flex flex-column align-v-center">
                <div class="mb-2" v-if="eventIsLive">
                    <div class="flex flex-row">
                        <div class="flex-center corners-5 bg-live text-white uppercase live-badge sans"><span>live</span></div>
                    </div>
                </div>
                <div class="mv-2">
                    <div class="flex flex-row align-v-center">
                        <div class="coach-avatar">
                            <img
                                class="bg-grey-2 rounded drumeo"
                                :src=" 'http://cdn.musora.com/image/fetch/w_150,h_150,f_auto,c_fill,g_face/' + (instructor.head_shot_picture_url ? instructor.head_shot_picture_url : 'https://s3.amazonaws.com/pianote/defaults/avatar.png')"
                                data-test-src="instructor.thumbnail_url"
                            >
                        </div>
                        <h4 class="sans coach-name font-bold text-drumeo uppercase">{{ instructor.name }}</h4>
                    </div>
                </div>
                <div class="coach-event-details mv-2">
                    <h3 class="heading sans font-bold capitalize">{{ content.title }}</h3>
                    <div class="coach-event-description mv-2" v-html="content.description"></div>
                </div>
                <div class="coach-event-subscribe" v-if="!eventIsLive">
                    <div>
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
                    <div class="flex flex-row flex-wrap-md">
                        <div class="coach-event-cta">
                            <a href="/members/live">
                                <button class="btn">
                                    <span class="text-white bg-drumeo uppercase">
                                        watch
                                    </span>
                                </button>
                            </a>
                        </div>

                        <div class="coach-event-cta my-list">
                            <button class="btn" @click.stop.prevent="toggleMyList">
                                <span
                                    class="text-drumeo bg-drumeo inverted"
                                    :class="is_added ? 'is-added' : ''"
                                >
                                    <i class="fal fa-plus"></i>
                                    My List
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

            let startTimeCutoff = DateTime
                                    .fromSQL(this.content.live_event_start_time, { zone: 'UTC' });

            if (startTimeCutoff < this.currentDate) {
                this.eventIsLive = true;
            } else {
                this.eventIsLive = false;

                this.counterValue = startTimeCutoff.diff(this.currentDate, 'seconds').toObject().seconds;

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
    },
}
</script>

<style lang="scss">
@import '../../assets/sass/partials/variables';

.coach-event {
    margin-bottom: 100px;

    #player {
        width: 100%;
    }

    .coach-event-video {
        max-width: 915px;
        height: 100%;

        iframe {
            height: 100%;
            position:absolute;
            top:0;
            left:0;
        }

        @include medium {
            flex: 0 0 60%;
        }

        width: 100%;
    }

    .coach-event-image {
        max-width: 915px;
        cursor: pointer;

        @include medium {
            flex: 0 0 60%;
        }

        .coach-event-upcoming {
            position: absolute;
            top: 20px;
            left: 0;
            font-size: 13px;
            padding: 15px 90px 15px 15px;
            background: -webkit-gradient(linear, right top, left top, from(transparent), to(rgba(8, 85, 160, 1)));
            background: linear-gradient(to left, transparent 0%, rgba(8, 85, 160, 1) 100%);

            @include small {
                font-size: 17px;
            }

            @include medium {
                font-size: 20px;
            }

            @include large {
                font-size: 24px;
            }
        }

        .coach-event-counter {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            @include xLarge {
                margin-bottom: 25px;
            }

            .coach-event-counter-inner {
                background-color: rgba(0, 0, 0, 0.5);
                padding: 10px;
            }

            .event-counter-number {
                font-size: 18px;

                @include small {
                    font-size: 22px;
                }

                @include medium {
                    font-size: 30px;
                }

                @include large {
                    font-size: 50px;
                }
            }

            .event-counter-label {
                font-size: 9px;

                @include small {
                    font-size: 10px;
                }

                @include medium {
                    font-size: 11px;
                }

                @include large {
                    font-size: 12px;
                }
            }
        }
    }

    .coach-event-data {
        @include small {
            margin-top: 25px;
        }

        @include medium {
            margin-left: 50px;
            margin-top: 0px;
        }

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
            font-size: 18px;
            margin-left: 10px;

            @include small {
                font-size: 24px;
            }
        }

        .coach-event-details {
            @include xSmallOnly {
                margin-top: 0;
            }

            .coach-event-description {
                font-size: 16px;
                line-height: 24px;

                @include small {
                    font-size: 18px;
                    line-height: 30px;
                }
            }
        }

        .coach-event-subscribe {
            margin: 0 auto;

            @include medium {
                margin: 0;
            }

            &> div {
                width: 300px;
            }
        }

        .coach-event-cta {
            width: 40%;
            min-width: 145px;

            &.my-list {
                span i {
                    transition: transform .1s ease-in-out;
                    margin-right: 5px;
                    font-size: 18px;
                }

                span.is-added i {
                    transform: rotate(45deg);
                }
            }
        }

        .coach-event-cta + .coach-event-cta {
            margin-left: 20px;
        }
    }
}
</style>