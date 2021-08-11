<template>
    <div
        :id="modalId"
        class="modal small"
    >
        <div class="flex flex-column bg-white shadow corners-10 pa-3 align-h-center  overflow-visible">
            <h1 class="subheading text-center mb-2">
                Subscribe to Calendar
            </h1>

            <p class="tiny text-center mb-2">
                Here you can subscribe to {{ toCapitalCase(brand) }}'s Lesson Calendar - Apple Calendar, Google Calendar, Outlook, and Yahoo Calendar are all supported.
            </p>

            <div
                v-show="subscriptionCalendarId"
                class="relative"
                style="width:100%;"
            >
                <button
                    class="btn mb-1"
                    @click.stop="subscriptionCalendarDropdown = !subscriptionCalendarDropdown"
                >
                    <span
                        class="text-white"
                        :class="themeBgClass"
                    >
                        <i class="fas fa-calendar-plus mr-1"></i>
                        Subscribe to calendar
                    </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown
                        v-show="subscriptionCalendarDropdown"
                        key="subscriptionCalendar"
                        :subscription-calendar-id="subscriptionCalendarId"
                        :is-subscription="true"
                    ></add-event-dropdown>
                </transition>
            </div>

            <p
                v-show="subscriptionCalendarId"
                class="x-tiny font-italic text-center mb-2"
            >
                Any upcoming releases will automatically show up in this calendar as they are scheduled by the {{ toCapitalCase(brand) }} Team.
            </p>

            <p
                v-show="hasSingleEvent"
                class="tiny text-center mb-2"
            >
                Or you can subscribe to this event only by clicking the button below.
            </p>
            <div
                v-show="hasSingleEvent"
                class="tiny pointer relative"
                style="width:100%;"
            >
                <button
                    class="btn mb-1"
                    @click.stop="singleEventDropdown = !singleEventDropdown"
                >
                    <span
                        class="inverted"
                        :class="[themeTextClass, themeBgClass]"
                    >
                        <i class="fas fa-calendar-plus mr-1"></i>
                        Subscribe to this event only
                    </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown
                        v-show="singleEventDropdown"
                        key="singleEvent"
                        :single-event="singleEvent"
                    ></add-event-dropdown>
                </transition>
            </div>

            <p
                v-show="hasSingleEvent"
                class="x-tiny font-italic text-center mb-2"
            >
                {{ singleEventDescription }}
            </p>
        </div>
    </div>
</template>
<script>
import UtilsHelpers from '@musora/helper-functions/modules/utils';
import AddEventDropdown from './AddEventDropdown.vue';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'AddEventModal',
    components: {
        'add-event-dropdown': AddEventDropdown,
    },
    mixins: [ThemeClasses],
    props: {
        modalId: {
            type: String,
            default: 'addToCalendarModal',
        },
        brand: {
            type: String,
            default: () => 'Musora',
        },
        singleEvent: {
            title: null,
            date: null,
        },
        subscriptionCalendarId: {
            type: String,
            default: '',
        },
        singleEventDescription: {
            type: String,
            default: () => 'Only this event will be added to your calendar.',
        },
    },
    data() {
        return {
            singleEventDropdown: false,
            subscriptionCalendarDropdown: false,
        };
    },
    computed: {
        hasSingleEvent() {
            return this.singleEvent.title != null && this.singleEvent.title.length > 0;
        },
    },
    watch: {
        singleEventDropdown(val) {
            if (val) {
                this.subscriptionCalendarDropdown = false;
            }
        },
        subscriptionCalendarDropdown(val) {
            if (val) {
                this.singleEventDropdown = false;
            }
        },
    },
    mounted() {
        document.body.addEventListener('click', () => {
            this.singleEventDropdown = false;
            this.subscriptionCalendarDropdown = false;
        });

        window.addEventListener('modalClose', () => {
            this.$emit('modalClose');
        });
    },
    methods: {
        toCapitalCase: string => UtilsHelpers.toCapitalCase(string),
    },
};
</script>
