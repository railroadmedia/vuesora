<template>
    <div class="add-event-dropdown bg-white">
        <div v-if="isSubscription"
             class="flex flex-column bg-white shadow corners-3">
            <a v-for="platform in platforms"
               :href="'https://www.addevent.com/subscribe/' + subscriptionCalendarId + '+' + platform.key"
               target="_blank"
               class="text-black pointer bg-white no-decoration">

                <p class="body pa-1"
                   v-html="platform.value">
                    {{ platform.value }}
                </p>
            </a>
        </div>

        <div v-else
             class="flex flex-column bg-white shadow corners-3">

            <div v-for="platform in platforms"
                 :key="platform.key"
                 class="addeventatc pointer"
                 data-styling="none"
                 :data-direct="platform.key">

                <p class="body pa-1"
                   v-html="platform.value">
                    {{ platform.value }}
                </p>

                <span class="start">{{ $_event_date }}</span>
                <span class="timezone">UTC</span>
                <span class="title">{{ $_event_title }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'add-event-dropdown',
        props: {
            isSubscription: {
                type: Boolean,
                default: () => false
            },
            subscriptionCalendarId: {
                type: String,
                default: () => ''
            },
            singleEvent: {
                type: Object,
                default: () => {
                    return {
                        title: '',
                        date: ''
                    }
                }
            }
        },
        data(){
            return {
                platforms: [
                    {
                        key: 'apple',
                        value: '<i class="fab fa-apple mr-1"></i> Apple'
                    },
                    {
                        key: 'google',
                        value: '<i class="fab fa-google mr-1"></i> Google <em>(online)</em>'
                    },
                    {
                        key: 'outlook',
                        value: '<i class="fab fa-windows mr-1"></i> Outlook'
                    },
                    {
                        key: 'outlookcom',
                        value: '<i class="fab fa-windows mr-1"></i> Outlook.com <em>(online)</em>'
                    },
                    {
                        key: 'yahoo',
                        value: '<i class="fab fa-yahoo mr-1"></i> Yahoo <em>(online)</em>'
                    }
                ]
            }
        },
        computed: {
            $_event_title() {
                return this.singleEvent.title;
            },

            $_event_date() {
                return this.singleEvent.date;
            }
        },
    }
</script>