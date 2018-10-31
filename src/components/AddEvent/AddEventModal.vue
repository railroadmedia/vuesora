<template>
    <div id="addToCalendarModal" class="modal small">
        <div class="flex flex-column bg-white shadow corners-3 pa-3 align-h-center  overflow-visible">
            <h1 class="subheading text-center mb-2">Add to Calendar</h1>

            <div class="relative" style="width:250px;">
                <button class="btn collapse-250 mb-2"
                        @click.stop="subscriptionCalendarDropdown = !subscriptionCalendarDropdown">
                        <span class="text-white"
                              :class="'bg-' + $_themeColor">
                            <i class="fas fa-calendar-plus mr-1"></i>
                            Sync All Lessons
                        </span>
                </button>

                <transition name="grow-fade">
                    <add-event-dropdown v-show="subscriptionCalendarDropdown"
                                        key="subscriptionCalendar"
                                        :subscriptionCalendarId="$_subscriptionCalendarId"
                                        :isSubscription="true"></add-event-dropdown>
                </transition>
            </div>

            <div class="tiny pointer relative">
                    <span :class="['text-' + $_themeColor, 'bb-' + $_themeColor + '-1']"
                          @click.stop="singleEventDropdown = !singleEventDropdown">
                        Add only this lesson
                    </span>

                <transition name="grow-fade">
                    <add-event-dropdown v-show="singleEventDropdown"
                                        key="singleEvent"
                                        :singleEvent="singleEvent"></add-event-dropdown>
                </transition>
            </div>
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