<template>
    <a :href="item.url"
       class="tw-flex tw-bg-cover tw-bg-top tw-h-64 tw-relative tw-bg-gray-200 tw-overflow-hidden tw-rounded-xl tw-no-underline tw-text-white"
       :style="'background-image: url('+ coachImage +');'"
    >
        <!-- Coach Details -->
        <div class="tw-flex tw-mt-auto tw-w-full tw-items-center tw-justify-center tw-h-2/3 "
             style="background-image: linear-gradient(180deg, rgba(0, 0, 23, 0) 17.28%, #000017 100%);"
        >
            <h3 class="tw-uppercase tw-mt-auto tw-mb-6 tw-px-2 tw-text-center"
                style="hyphens: auto;"
            >
                <span class="tw-font-normal">{{ coachFirstName }}</span><br>
                <span>{{ coachLastName }}</span>
            </h3>
        </div>
        <!-- hover later-->
        <div class="tw-absolute tw-flex tw-h-full tw-w-full tw-top-0 tw-left-0 tw-bg-black  tw-transition"
             :class="isSubscribed ? 'tw-bg-opacity-0 hover:tw-bg-opacity-30' : 'tw-bg-opacity-30 tw-opacity-0 hover:tw-opacity-100' "
        >
            <!-- Subscribe -->
            <button class="tw-btn-primary tw-btn-small tw-h-6 tw-w-6 tw-p-0 tw-ml-auto tw-mt-1 tw-mr-1"
                    :class="isSubscribed ? 'tw-bg-white ' + themeTextClass : themeBgClass"
                    @click.prevent="updateCoachSubscription(item.id)"
            >
                <i class="fas fa-bell tw-text-base"></i>
                <span class="tw-sr-only">
                    <template v-if="isSubscribed" >Unsubscribe From Coach</template>
                    <template v-else>Subscribe to Coach</template>
                </span>
            </button>
        </div>
        
    </a>
</template>
<script>
import axios from "axios";
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';
import Toasts from "../../assets/js/classes/toasts";

export default {
    name: 'CoachCatalogueCard',
    mixins: [Mixin, ThemeClasses],
    data() {
        return {
            coachName: '',
            coachImage: '',
            isSubscribed: false,
        }
    },
    props: {
        showMyListAction: {
            type: Boolean,
            default: () => true,
        },
        brand: {
            type: String,
            default: () => "drumeo",
        }
    },
    computed: {
        coachFirstName() {
            return this.coachName.split(" ")[0];
        },
        coachLastName() {
            return this.coachName.substr(this.coachName.indexOf(" ") + 1);
        },
        themeBgClass() {
            return "tw-bg-" + this.brand;
        },
        themeTextClass() {
            return "tw-text-" + this.brand;
        },
        subscriptionEndpoint() {
            if(this.brand === "drumeo") {
                return '/laravel/public/railcontent/follow';
            } else {
                return '/railcontent/follow'
            }
        }
    },
    beforeMount() {
        if(this.item.current_user_is_subscribed) {
            this.isSubscribed = true;
        }
        
        this.item["fields"].forEach(field => {
            if(field.key === "name") {
                this.coachName = field.value;
            }
        }),
        this.item["data"].forEach(coach => {
            if(coach.key === "coach_card_image" ) {
                this.coachImage = coach.value;
            }
        })
    },
    methods: {
        updateCoachSubscription(id) {
            if(!this.isSubscribed) {
                axios.put(this.subscriptionEndpoint, { content_id: id } )
                    .then(() => {
                        console.log('Subscribed to: '+ this.coachName)
                        this.isSubscribed = true;
                    })
                    .catch(() => {
                        console.log('Subscribed did not work')
                    })
            } else {
                axios.put(this.subscriptionEndpoint, { content_id: id } )
                    .then(() => {
                        console.log('Unsubscribed to: '+ this.coachName)
                        this.isSubscribed = false;
                    })
                    .catch(() => {
                        console.log('Unubscribed did not work')
                    })
            }
        }

    }
};
</script>
