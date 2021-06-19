<template>
    <a
        :href="forum.url"
        class="tw-relative tw-flex tw-flex-row tw-items-center tw-py-4 tw-px-2 tw-text-black tw-no-underline tw-border-0 tw-border-b tw-border-solid tw-border-gray-200"
        :class="[brandHoverColor]"
    >
        <!-- Avatar -->
        <div class="tw-h-14 tw-w-14 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-relative tw-mr-6 tw-flex-shrink-0" 
             :class="[bgColor]">
            <i class="tw-text-2xl tw-text-white" 
               :class="[forumIcon, (forum.icon === 'fa-cube')?'fal':'fas' ]">
            </i>
        </div>
       
        <div class="tw-flex tw-flex-wrap tw-justify-center tw-w-full tw-min-w-0 md:tw-pr-10">
             <!-- Title -->
            <h4 class="tw-text-lg tw-w-3/4 md:tw-w-full tw-font-bold">{{ forum.title }}</h4>
            
             <!-- Description -->
            <p class="tw-text-13 tw-w-full tw-order-last md:tw-order-2 md:tw-w-3/4">
                {{ forum.description }}
            </p>

            <!-- Reply Amount -->
            <div class="tw-inline-flex md:tw-items-start tw-text-gray-600 tw-flex-shrink-0 tw-w-1/4 tw-text-left tw-justify-end tw-px-4 md:tw-order-last">
                <h6 class="tw-text-13 tw-font-bold tw-with-tooltip tw-tooltip-center tw-tooltip-top">
                    <i class="fas fa-comment-lines tw-mr-1"></i>
                    {{ forum.replyAmount }}

                    <!-- Tool Tip -->
                    <div class="tw-tooltip tw-tooltip-dark">
                        Total Threads
                    </div>
                </h6>
            </div>
        </div>

        <!-- Post Date -->
        <div class="tw-flex-col tw-justify-center tw-text-gray-600 tw-flex-shrink-0 tw-w-28 tw-hidden lg:tw-flex">
            <h6 class="tw-text-13 tw-font-bold">{{ forum.latestPost ? forum.latestPost.created_at_diff : '' }}</h6>
            <!-- <p class="tw-text-13"><span class="tw-font-bold">In:</spanZ> </p> -->
            <p class="tw-text-13 tw-truncate">
                <span class="tw-font-bold">By:</span> 
                <span class="">{{ forum.latestPost ? forum.latestPost.author_display_name : '' }}</span>    
            </p>
        </div>
    </a>
</template>
<script>
    export default {
        name: 'ForumItem',
        props: {
            brand: {
                type: String,
                default: () => 'drumeo',
                require: true
            },
            forum: {
                type: Object,
                default: () => {},
                require: true
            },
        },
        computed: {
            bgColor() {
                return 'tw-bg-'+this.brand;
            },
            brandHoverColor() {
                return 'hover:tw-bg-'+this.brand+'-lightest'
            },
            forumIcon() {
                return this.forum.icon || 'fa-comments'
            }
        }
    }
</script>