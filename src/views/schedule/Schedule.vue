<template>
    <div class="flex flex-column">
        <schedule-item
            v-for="(item, i) in content"
            :key="'schedule-item-' + item.id"
            :item="item"
            :timezone="timezone"
            :theme-color="themeColor"
            @addToList="addToListEventHandler"
            @addEvent="addEventToDropdown"
        ></schedule-item>

        <add-event-modal
            modal-id="scheduleAddToCalendarModal"
            :subscription-calendar-id="subscriptionCalendarId"
            :single-event="singleEvent"
            :theme-color="themeColor"
            @modalClose="handleModalClose"
        ></add-event-modal>
    </div>
</template>
<script>
import { Content as ContentHelpers } from '@musora/helper-functions';
import ScheduleItem from './_ScheduleItem.vue';
import AddEventModal from '../../components/AddEvent/AddEventModal.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    name: 'ContentSchedule',
    components: {
        'schedule-item': ScheduleItem,
        'add-event-modal': AddEventModal,
    },
    mixins: [UserCatalogueEvents],
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        preloadedContent: {
            type: Array,
            default: () => [],
        },
        timezone: {
            type: String,
            default: 'America/Los_Angeles',
        },
        subscriptionCalendarId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            singleEvent: {
                title: null,
                date: null,
            },
            content: ContentHelpers.flattenContent(this.preloadedContent, true),
        };
    },
    computed: {

    },
    mounted() {
        const monthsSelector = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

        monthsSelector.forEach((month) => {
            const firstElement = document.querySelectorAll(`.${month}`)[0];
            if (firstElement) {
                firstElement.classList.add('show-month');
            }
        });
    },
    methods: {
        addEventToDropdown(payload) {
            this.singleEvent = payload;
        },

        handleModalClose() {
            setTimeout(() => {
                this.addEventToDropdown({
                    title: null,
                    date: null,
                });
            }, 300);
        },
    },
};
</script>
