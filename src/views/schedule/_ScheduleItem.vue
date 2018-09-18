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

            <p class="tiny text-recordeo uppercase text-truncate"
               :class="'text-' + $_item.type">
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

        <div class="flex flex-column icon-col align-v-center" style="position:relative;">
            <div class="body addeventatc"
                 data-dropdown-y="up"
                 data-dropdown-x="right"
                 data-intel-apple="true">

                <i class="fas fa-calendar-plus flex-center text-grey-2 rounded"></i>

                <span class="start">{{ time_to_display }}</span>
                <span class="timezone">{{ $_timezone }}</span>
                <span class="title">{{ $_item['title'] }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import DataMapper from '../../assets/js/classes/data-mapper.js';
    import moment from 'moment';

    export default {
        name: 'schedule-item',
        props: {
            $_item: Object,
            $_timezone: String
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
                return moment(this.time_to_display).format('MMM').toLowerCase();
            },

            day(){
                return moment(this.time_to_display).format('ddd D');
            },

            time(){
                return moment(this.time_to_display).format('h:mm A');
            },

            mappedData(){
                return new DataMapper({
                    content_type: this.$_item.type,
                    card_type: 'schedule',
                    post: this.$_item
                });
            }
        }
    }
</script>