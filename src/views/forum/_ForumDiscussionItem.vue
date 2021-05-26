<template>
    <a
        :href="discussion.url"
        class="tw-relative tw-flex tw-flex-row tw-items-center tw-py-4 tw-px-2 tw-text-black tw-no-underline tw-border-0 tw-border-b tw-border-solid tw-border-gray-200"
        :class="[brandHoverColor]"
    >
        <!-- Avatar -->
        <div class="tw-h-14 tw-w-14 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-relative tw-mr-6 tw-flex-shrink-0" 
             :class="[bgColor]">
            <i class="tw-text-2xl tw-text-white" 
               :class="[discussion.icon, (discussion.icon === 'fa-cube')?'fal':'fas' ]">
            </i>
        </div>

        <!-- Title & Description -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-w-full tw-max-w-lg tw-min-w-0 tw-pr-10">
            <h4 class="tw-text-lg tw-font-bold">{{ discussion.title }}</h4>
            <p class="tw-text-xs tw-truncate tw-w-full">
                {{ discussion.description }}
            </p>
        </div>

        <!-- Reply Amount -->
        <div class="tw-flex tw-items-center tw-text-gray-600 tw-ml-auto tw-mr-12 tw-flex-shrink-0">
            <h6 class="tw-text-xs tw-font-bold">
                <i class="fas fa-comment-lines tw-mr-1"></i>
                {{ discussion.replyAmount }}
            </h6>
        </div>

        <!-- Post Date -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-text-gray-600 tw-flex-shrink-0">
            <h6 class="tw-text-xs tw-font-bold">{{ discussion.latestPost ? discussion.latestPost.created_at_diff : '' }}</h6>
            <!-- <p class="tw-text-xs"><span class="tw-font-bold">In:</spanZ> </p> -->
            <p class="tw-text-xs"><span class="tw-font-bold">By:</span> {{ discussion.latestPost ? discussion.latestPost.author_display_name : '' }}</p>
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
                return 'tw-bg-'+this.brand;
            },
            brandHoverColor() {
                return 'hover:tw-bg-'+this.brand+'-lightest'
            }
        }
    }
</script>