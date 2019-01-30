<template>
    <div class="flex flex-row content-table-row scheduled bt-grey-1-1 pa-1"
         :class="month">
        <div class="month-col body text-white bg-grey-2">
            {{ month }}
        </div>

        <div class="flex flex-column align-v-center thumbnail-col">
            <div class="thumb-wrap corners-3 bg-black">
                <div class="thumb-img corners-3 widescreen text-center">
                    <div class="release-day">
                        <p class="tiny text-white font-bold">{{ day }}</p>
                        <p class="tiny text-white">{{ time }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-column align-v-center ph-1 title-column overflow">

            <p class="tiny uppercase text-truncate"
               :class="'text-' + $_themeColor">
                {{ mappedData.color_title }}
            </p>

            <p class="tiny text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p class="x-tiny text-grey-3 text-truncate font-italic uppercase hide-md-up">
                <span v-for="(item, i) in mappedData.column_data">
                    <span v-if="i > 0" class="bullet">-</span>

                    {{ item }}
                </span>
            </p>
        </div>

        <div v-for="(item, i) in mappedData.column_data"
             class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down">
            {{ item }}
        </div>

        <!-- ADD TO LIST OR RESET PROGRESS BUTTONS -->
        <div class="flex flex-column icon-col align-v-center hide-xs-only">

            <div class="body">
                <i class="add-to-list fas fa-plus flex-center pointer"
                   :class="$_is_added ? 'is-added text-' + $_themeColor : 'text-grey-2'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   @click.stop.prevent="addToList"></i>
            </div>
        </div>

        <div class="flex flex-column icon-col align-v-center" style="position:relative;">
            <div class="body pointer add-to"
                 title="Add to Calendar"
                 data-open-modal="scheduleAddToCalendarModal"
                 @click="addEvent">
                <i class="fas fa-calendar-plus flex-center text-grey-2 rounded"></i>
            </div>
        </div>
    </div>
</template>
<script>
    import * as Model from '../../assets/js/models/_model.js';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
    import { DateTime } from 'luxon';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'schedule-item',
        props: {
            $_item: {
                type: Object
            },
            $_timezone: {
                type: String,
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            }
        },
        computed: {

            time_to_display(){
                // Pull the live start time if it exists, otherwise just get the publish on date
                if(this.$_item['live_event_start_time_in_timezone']){
                    return this.$_item['live_event_start_time_in_timezone']['date'];
                }

                return this.$_item['published_on_in_timezone']['date'];
            },

            month(){
                return DateTime.fromSQL(this.time_to_display).toFormat('LLL').toLowerCase();
            },

            day(){
                return DateTime.fromSQL(this.time_to_display).toFormat('ccc d');
            },

            time(){
                return DateTime.fromSQL(this.time_to_display).toFormat('h:mm a');
            },

            mappedData(){
                const type = this.$_contentTypeOverride || this.$_item.type;

                const model = new Model[type.replace(/-/g, '_')]({
                    brand: this.$_brand,
                    post: this.$_item
                });

                return model['schedule'];
            },

            $_is_added(){
                return this.$_item.is_added_to_primary_playlist;
            },
        }
    }
</script>