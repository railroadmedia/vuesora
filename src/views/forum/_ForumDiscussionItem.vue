<template>
    <a
        :href="discussion.url"
        class="tw-relative tw-flex tw-flex-row tw-items-center tw-p-4 tw-pl-0 tw-text-black tw-no-underline tw-border-0 tw-border-b tw-border-solid tw-border-gray-200 hover:tw-bg-red-50"
    >
        <!-- Avatar -->
        <div class="tw-h-14 tw-w-14 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-relative tw-mr-6 tw-flex-shrink-0" 
             :class="[bgColor]">
            <i class="tw-text-2xl tw-text-white fas" :class="discussion.icon"></i>
        </div>

        <!-- Title & Description -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-w-full tw-max-w-lg tw-min-w-0 tw-pr-10">
            <h4 class="tw-text-lg tw-font-bold">{{ discussion.title }}</h4>
            <p class="tw-text-sm tw-text-gray-500 tw-truncate tw-w-full">
                {{ discussion.description }}
            </p>
        </div>

        <!-- Reply Amount -->
        <div class="tw-flex tw-items-center tw-text-gray-400 tw-ml-auto tw-mr-12 tw-flex-shrink-0">
            <h6 class="tw-text-sm tw-font-bold">
                <i class="fas fa-comment tw-mr-1"></i>
                {{ discussion.replyAmount }}
            </h6>
        </div>

        <!-- Post Date -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-text-gray-400 tw-flex-shrink-0">
            <h6 class="tw-text-sm tw-font-bold">{{ discussion.lastPostDate }}</h6>
            <!-- <p class="tw-text-sm"><span class="tw-font-bold">In:</span> </p> -->
            <p class="tw-text-sm"><span class="tw-font-bold">By:</span> {{ discussion.authorUsername }}</p>
        </div>
    </a>
</template>
<script>
    import ThemeClasses from '../../mixins/ThemeClasses.js';

    export default {
        name: 'ForumDiscussionItem',
        mixins: [ThemeClasses],
        props: {
            brand: {
                type: String,
                default: () => '',
            },
            discussion: {
                type: Object,
                default: () => {},
            },
        },
        computed: {
            bgColor() {
                if(this.discussion.icon === "fa-cube" || this.discussion.icon === "fa-browser" || this.discussion.icon === "fa-user-shield") {
                    return 'tw-bg-gray-600';
                }
                return 'tw-bg-'+this.brand;
            }
        }
    }
</script>