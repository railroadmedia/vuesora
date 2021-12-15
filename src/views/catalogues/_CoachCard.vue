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
        <div class="tw-absolute tw-flex tw-h-full tw-w-full tw-top-0 tw-left-0 tw-bg-black tw-bg-opacity-30 tw-transition tw-opacity-0 hover:tw-opacity-100">
            <!-- Subscribe -->
            <button class="tw-btn-primary tw-btn-small tw-h-6 tw-w-6 tw-p-0 tw-ml-auto tw-mt-1 tw-mr-1 hover:tw-bg-white"
                    :class="[themeBgClass, themeTextClass ]"
            >
                <i class="fas fa-bell tw-text-sm"></i>
            </button>
        </div>
        
    </a>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CoachCatalogueCard',
    mixins: [Mixin, ThemeClasses],
    data() {
        return {
            coachName: '',
            coachImage: '',
            coachSlug: '',
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
            return "hover:tw-text-" + this.brand;
        },

    },
    beforeMount() {
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
    }
};
</script>
