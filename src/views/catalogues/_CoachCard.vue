<template>
    <a :href="item.url"
       class="tw-flex tw-bg-cover tw-bg-top tw-h-64 tw-relative tw-bg-gray-200 tw-overflow-hidden tw-rounded-xl tw-no-underline tw-text-white"
       :style="'background-image: url('+ item.coach_card_image +');'"
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
        <!-- hover -->
        <div class="tw-absolute tw-flex tw-h-full tw-w-full tw-top-0 tw-left-0 tw-bg-black  tw-transition"
             :class="item.current_user_is_subscribed ? 'tw-bg-opacity-0 hover:tw-bg-opacity-30' : 'tw-bg-opacity-30 tw-opacity-0 hover:tw-opacity-100' "
        >
            <!-- Subscribe -->
            <button class="tw-btn-primary tw-btn-small tw-h-6 tw-w-6 tw-p-0 tw-ml-auto tw-mt-1 tw-mr-1"
                    :class="item.current_user_is_subscribed ? 'tw-bg-white ' + themeTextClass : themeBgClass"
                    @click.prevent="updateCoachSubscription(item.id)"
            >
                <i class="fas fa-bell tw-text-base"></i>
                <span class="tw-sr-only">
                    <template v-if="item.current_user_is_subscribed" >Unsubscribe From Coach</template>
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
    //Get name before mounting
    beforeMount() {
        this.item["fields"].forEach(field => {
            if(field.key === "name") {
                this.coachName = field.value;
            }
        })
    },
    //Get new name when updated
    beforeUpdate() {        
        this.item["fields"].forEach(field => {
            if(field.key === "name") {
                this.coachName = field.value;
            }
        })
    },
    methods: {
        updateCoachSubscription(id) {
            if(!this.item.current_user_is_subscribed) {
                axios.put(this.subscriptionEndpoint, { content_id: id } )
                    .then(() => {
                        console.log('Subscribed to: '+ this.coachName)
                        this.item.current_user_is_subscribed = true;
                    })
                    .catch(() => {
                        console.log('Subscribed did not work')
                    })
            } else {
                axios.put(this.subscriptionEndpoint, { content_id: id } )
                    .then(() => {
                        console.log('Unsubscribed to: '+ this.coachName)
                        this.item.current_user_is_subscribed = false;
                    })
                    .catch(() => {
                        console.log('Unubscribed did not work')
                    })
            }
        }

    }
};
</script>
