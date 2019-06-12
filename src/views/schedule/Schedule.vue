<template>
    <div class="flex flex-column">
        <schedule-item v-for="(item, i) in content"
                       :key="'schedule-item-' + item.id"
                       :item="item"
                       :timezone="timezone"
                       :themeColor="themeColor"
                       @addToList="addToListEventHandler"
                       @addEvent="addEventToDropdown"></schedule-item>

        <add-event-modal modalId="scheduleAddToCalendarModal"
                         :subscriptionCalendarId="subscriptionCalendarId"
                         :singleEvent="singleEvent"
                         :themeColor="themeColor"
                         @modalClose="handleModalClose"></add-event-modal>
    </div>
</template>
<script>
    import { Content as ContentHelpers }  from 'js-helper-functions';
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
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            preloadedContent: {
                type: Array,
                default: () => []
            },
            timezone: {
                type: String,
                default: 'America/Los_Angeles'
            },
            subscriptionCalendarId: {
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
                content: ContentHelpers.flattenContent(this.preloadedContent, true)
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