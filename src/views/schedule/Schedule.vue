<template>
    <div class="flex flex-column">
        <schedule-item v-for="(item, i) in content"
                       :key="'schedule-item-' + item.id"
                       :$_item="item"
                       :$_timezone="$_timezone"
                       @addEvent="addEventToDropdown"></schedule-item>

        <add-event-modal :singleEvent="singleEvent"
                         :$_subscriptionCalendarId="$_subscriptionCalendarId"
                         subscriptionDescription="Here you can subscribe to the full Drumeo Release Calendar using the calendar provider you already use - Apple Calendar, Google Calendar, Outlook or Yahoo Calendar are all supported."
                         singleEventDescription="Here you can subscribe to the full Drumeo Release Calendar using the calendar provider you already use - Apple Calendar, Google Calendar, Outlook or Yahoo Calendar are all supported."></add-event-modal>
    </div>
</template>
<script>
    import Utils from '../../assets/js/classes/utils';
    import ScheduleItem from './_ScheduleItem.vue'
    import AddEventModal from '../../components/AddEvent/AddEventModal';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'content-schedule',
        components: {
            'schedule-item': ScheduleItem,
            'add-event-modal': AddEventModal
        },
        props: {
            $_content: {
                type: Array,
                default: []
            },
            $_timezone: {
                type: String,
                default: 'America/Los_Angeles'
            },
            $_subscriptionCalendarId: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                singleEvent: {
                    title: '',
                    date: ''
                }
            }
        },
        computed: {
            content() {
                return Utils.flattenContent(this.$_content);
            }
        },
        methods: {
            addEventToDropdown(payload){
                this.singleEvent = payload;
            }
        },
        mounted(){
            const monthsSelector = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

            monthsSelector.forEach(month => {
                const firstElement = document.querySelectorAll('.' + month)[0];
                if(firstElement){
                    firstElement.classList.add('show-month');
                }
            });
        }
    }
</script>