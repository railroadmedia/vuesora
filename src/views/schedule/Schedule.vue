<template>
    <div class="flex flex-column">
        <schedule-item v-for="(item, i) in content"
                       :key="'schedule-item-' + item.id"
                       :$_item="item"
                       :$_timezone="$_timezone"
                       :$_themeColor="$_themeColor"
                       @addToList="addToListEventHandler"
                       @addEvent="addEventToDropdown"></schedule-item>

        <add-event-modal $_modalId="scheduleAddToCalendarModal"
                         :$_subscriptionCalendarId="$_subscriptionCalendarId"
                         :singleEvent="singleEvent"
                         :$_themeColor="$_themeColor"
                         @modalClose="handleModalClose"></add-event-modal>
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
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_content: {
                type: Array,
                default: () => []
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
                    title: null,
                    date: null
                },
                content: Utils.flattenContent(this.$_content)
            }
        },
        computed: {

        },
        methods: {
            addEventToDropdown(payload){

                this.singleEvent = payload;
            },

            handleModalClose(){
                setTimeout(() => {
                    this.addEventToDropdown({
                        title: null,
                        date: null
                    });
                }, 300);
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