<template>
    <div
        class="flex flex-row content-table-row scheduled bt-grey-1-1 pa-1"
        :class="month"
    >
        <div class="month-col body text-white bg-grey-2">
            {{ month }}
        </div>

        <div class="flex flex-column align-v-center thumbnail-col">
            <div class="thumb-wrap corners-3 bg-black">
                <div
                    class="thumb-img corners-3 widescreen text-center"
                    style="background:black;"
                >
                    <div class="release-day">
                        <p class="tiny text-white font-bold">
                            {{ day }}
                        </p>
                        <p class="tiny text-white">
                            {{ time }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-column align-v-center ph-1 title-column overflow">
            <p
                class="tiny uppercase text-truncate"
                :class="themeTextClass"
            >
                {{ mappedData.color_title }}
            </p>

            <p class="tiny text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p class="x-tiny text-grey-3 text-truncate font-italic uppercase hide-md-up">
                <span v-for="(item, i) in mappedData.column_data">
                    <span
                        v-if="i > 0"
                        class="bullet"
                    >-</span>

                    {{ item }}
                </span>
            </p>
        </div>

        <div class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down">
            {{ releaseType }}
        </div>

        <div
            v-for="(item, i) in mappedData.column_data"
            class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down text-center"
        >
            {{ item }}
        </div>

        <!-- ADD TO LIST OR RESET PROGRESS BUTTONS -->
        <div class="flex flex-column icon-col align-v-center hide-xs-only">
            <div class="body">
                <i
                    class="add-to-list fas fa-plus flex-center pointer"
                    :class="is_added ? 'is-added ' + themeTextClass : 'text-grey-2'"
                    :title="is_added ? 'Remove from list' : 'Add to list'"
                    @click.stop.prevent="addToList"
                ></i>
            </div>
        </div>

        <div
            class="flex flex-column icon-col align-v-center"
            style="position:relative;"
        >
            <div
                class="body pointer add-to"
                title="Add to Calendar"
                data-open-modal="scheduleAddToCalendarModal"
                @click="addEvent"
            >
                <i class="fas fa-calendar-plus flex-center text-grey-2 rounded"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { Content as ContentHelpers } from '@musora/helper-functions';
import { DateTime } from 'luxon';
import ContentModel from '../../assets/js/models/_model.js';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'ScheduleItem',
    mixins: [UserCatalogueEvents, ThemeClasses],
    props: {
        item: {
            type: Object,
        },
        timezone: {
            type: String,
        },
    },
    data() {
        return {
            mappedData: this.getContentModel(),
        };
    },
    computed: {

        time_to_display() {
            // Pull the live start time with timezoe if it exists
            if (this.item.live_event_start_time_in_timezone) {
                return this.item.live_event_start_time_in_timezone.date;
            }

            // Pull the published on with timezone if it exists
            if (this.item.published_on_in_timezone) {
                return this.item.published_on_in_timezone.date;
            }

            // Just pull the default published on
            return this.item.published_on;
        },

        month() {
            return DateTime.fromSQL(this.time_to_display).toFormat('LLL').toLowerCase();
        },

        day() {
            return DateTime.fromSQL(this.time_to_display).toFormat('ccc d');
        },

        time() {
            return DateTime.fromSQL(this.time_to_display).toFormat('h:mm a');
        },

        releaseType() {
            if (this.item.status === 'scheduled') {
                return 'Live Broadcast';
            }

            return 'Lesson Release';
        },

        is_added() {
            return this.item.is_added_to_primary_playlist;
        },
    },
    beforeDestroy() {
        this.mappedData = null;
    },
    methods: {

        getContentModel() {
            const shows = ContentHelpers.shows();
            let type = this.contentTypeOverride || this.item.type;

            if (shows.indexOf(type) !== -1) {
                type = 'show';
            }

            const model = new ContentModel(type, {
                brand: this.brand,
                post: this.item,
            });

            return model.schedule;
        },
    },
};
</script>
