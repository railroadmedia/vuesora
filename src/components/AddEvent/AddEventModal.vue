<template>
    <div id="addToCalendarModal" class="modal small">
        <div class="flex flex-column bg-white shadow corners-3 pa-3 align-h-center  overflow-visible">
            <h1 class="subheading text-center mb-2">Subscribe to Calendar</h1>

            <p class="tiny text-center mb-2">Here you can add an upcoming lesson release to the Calendar provider you already use - Apple Calendar, Google Calendar, Outlook, or Yahoo Calendar are all supported.</p>

            <p class="tiny text-center mb-2">There are to subscription options:</p>

            <div class="relative" style="width:100%;" v-if="$_subscriptionCalendarId">
                <button class="btn mb-1"
                        @click.stop="subscriptionCalendarDropdown = !subscriptionCalendarDropdown">
                        <span class="text-white"
                              :class="'bg-' + $_themeColor">
                            <i class="fas fa-calendar-plus mr-1"></i>
                            Subscribe to course calendar
                        </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown v-show="subscriptionCalendarDropdown"
                                        key="subscriptionCalendar"
                                        :subscriptionCalendarId="$_subscriptionCalendarId"
                                        :isSubscription="true"></add-event-dropdown>
                </transition>
            </div>

            <p class="x-tiny font-italic text-center mb-2">This subscribes you to the Drumeo Course Calendar. Any upcoming releases will automatically show up in this Calendar as they are scheduled by the Drumeo Team.</p>

            <div class="tiny pointer relative" style="width:100%;">
                <button class="btn mb-1"
                        @click.stop="singleEventDropdown = !singleEventDropdown">
                        <span class="inverted"
                              :class="['text-' + $_themeColor, 'bg-' + $_themeColor]">
                            <i class="fas fa-calendar-plus mr-1"></i>
                            Subscribe to this event only
                        </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown v-show="singleEventDropdown"
                                        key="singleEvent"
                                        :singleEvent="singleEvent"></add-event-dropdown>
                </transition>
            </div>

            <p class="x-tiny font-italic text-center mb-2">Only this event will be added to your calendar.</p>
        </div>
    </div>
</template>
<script>
    import AddEventDropdown from './AddEventDropdown.vue';

    export default {
        name: 'add-event-modal',
        components: {
            'add-event-dropdown': AddEventDropdown
        },
        props: {
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            singleEvent: {
                title: '',
                date: ''
            },
            $_subscriptionCalendarId: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                singleEventDropdown: false,
                subscriptionCalendarDropdown: false,
            }
        },
        watch: {
            singleEventDropdown(val){
                if(val){
                    this.subscriptionCalendarDropdown = false;
                }
            },
            subscriptionCalendarDropdown(val){
                if(val){
                    this.singleEventDropdown = false;
                }
            }
        },
        mounted(){
            document.body.addEventListener('click', () => {
                this.singleEventDropdown = false;
                this.subscriptionCalendarDropdown = false;
            });
        }
    }
</script>