<template>
    <div class="coach-event container mt-4">
        <div class="flex flex-row">
            <div class="coach-event-image relative">
                <img
                    class=""
                    src="https://d1923uyy6spedc.cloudfront.net/Randy_Cooke_4K.jpg"
                >
                <div class="coach-event-upcoming uppercase dense font-bold text-white">upcoming event</div>
                <div class="coach-event-counter flex flex-row align-center">
                    <div class="coach-event-counter-inner text-white flex flex-row align-center">
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>02</span></div>
                                <div class="event-counter-label sans font-bold uppercase">hours</div>
                            </div>
                        </div>
                        <div>
                            <div class="event-counter-number dense font-bold">:</div>
                            <div class="event-counter-label sans font-bold uppercase">&nbsp;</div>
                        </div>
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>23</span></div>
                                <div class="event-counter-label sans font-bold uppercase">minutes</div>
                            </div>
                        </div>
                        <div>
                            <div class="event-counter-number dense font-bold">:</div>
                            <div class="event-counter-label sans font-bold uppercase">&nbsp;</div>
                        </div>
                        <div class="ph-1">
                            <div class="flex flex-column align-center">
                                <div class="event-counter-number dense font-bold"><span>52</span></div>
                                <div class="event-counter-label sans font-bold uppercase">seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="coach-event-data flex flex-column align-v-center">
                <div class="mv-2">
                    <div class="flex flex-row align-v-center">
                        <div class="coach-avatar">
                            <img class="bg-grey-2 rounded drumeo" src="https://s3.amazonaws.com/pianote/defaults/avatar.png">
                        </div>
                        <h4 class="sans coach-name font-bold text-drumeo uppercase">aaron edgar</h4>
                    </div>
                </div>
                <div class="coach-event-details mv-2">
                    <h3 class="sans font-bold capitalize">this is the video title</h3>
                    <div class="coach-event-description mv-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                </div>
                <div class="coach-event-subscribe">
                    <button class="btn" data-open-modal="scheduleAddToCalendarModal">
                        <span class="text-white bg-drumeo">
                            <i class="fas fa-calendar-plus mr-1"></i>
                            Subscribe to Calendar
                        </span>
                    </button>
                </div>

                <content-schedule
                              subscription-calendar-id="{{ config('add-event.content-type-to-id-map')['brand-overview'] }}"
                              :theme-color="brand"></content-schedule>
            </div>
        </div>
    </div>
</template>

<script>
import ContentSchedule from '../../views/schedule/Schedule.vue';

export default {
    components: {
        'content-schedule': ContentSchedule,
    },
    name: 'CoachEvent',
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },
    },
}
</script>
