<template>
    <div id="addToCalendarModal" class="modal small">
        <div class="flex flex-column bg-white shadow corners-3 pa-3 align-h-center  overflow-visible">
            <h1 class="subheading text-center mb-2">Subscribe to Calendar</h1>

            <p class="tiny text-center mb-2">Here you can subscribe to this lesson format's full release calendar using the calendar provider you already use - Apple Calendar, Google Calendar, Outlook and Yahoo Calendar are all supported.</p>

            <div class="relative" style="width:100%;" v-show="$_subscriptionCalendarId">
                <button class="btn mb-1"
                        @click.stop="subscriptionCalendarDropdown = !subscriptionCalendarDropdown">
                        <span class="text-white"
                              :class="'bg-' + $_themeColor">
                            <i class="fas fa-calendar-plus mr-1"></i>
                            Subscribe to calendar
                        </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown v-show="subscriptionCalendarDropdown"
                                        key="subscriptionCalendar"
                                        :subscriptionCalendarId="$_subscriptionCalendarId"
                                        :isSubscription="true"></add-event-dropdown>
                </transition>
            </div>

            <p v-show="$_subscriptionCalendarId"
               class="x-tiny font-italic text-center mb-2">{{ subscriptionDescription }}</p>

            <div v-show="singleEvent.title"
                 class="tiny pointer relative" style="width:100%;">
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

            <p v-show="singleEvent.title"
               class="x-tiny font-italic text-center mb-2">{{ singleEventDescription }}</p>
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
            },
            subscriptionDescription: {
                type: String,
                default: () => 'Any upcoming releases will automatically show up in this calendar as they are scheduled by the Drumeo Team.'
            },
            singleEventDescription: {
                type: String,
                default: () => 'Only this event will be added to your calendar.'
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

            window.addEventListener('modalClose', () => {
                this.$emit('modalClose');
            })
        }
    }
</script>