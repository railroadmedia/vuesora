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
       
        <div class="tw-grid tw-grid-cols-7 tw-grid-rows-2 tw-w-full tw-min-w-0 tw-pr-0 lg:tw-pr-10"
             :class="[ (forum.description)? 'tw-grid-flow-col': 'tw-grid-flow-row' ]">
             <!-- Title -->
            <h4 class="tw-leading-6 tw-col-span-5 tw-text-lg tw-font-bold tw-inline-flex tw-items-start md:tw-items-center tw-row-span-1 "
                :class="{ 'tw-row-span-2': !forum.description }">{{ forum.title }}</h4>
            
             <!-- Description -->
            <p v-if="forum.description" class=" tw-col-span-7 md:tw-col-span-5  tw-text-13">
                {{ forum.description }}
            </p>

            <!-- Reply Amount -->
            <div class="tw-text-gray-600 tw-text-left tw-px-4 tw-col-span-2 md:tw-row-span-2 tw-inline-flex tw-mt-1 tw-items-start md:tw-items-center"
                 :class="[ (forum.description)? 'tw-row-span-1': 'tw-row-span-2' ]">
                <h6 class="tw-text-13 tw-font-bold tw-with-tooltip tw-tooltip-center tw-tooltip-top tw-ml-auto">
                    <i class="fas fa-comment-lines tw-mr-1"></i>
                    {{ replyCount }}

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
                <span class="">By:</span>
                <span class="tw-font-bold">{{ forum.latestPost ? forum.latestPost.author_display_name : '' }}</span>
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
            },
            replyCount() {
                return (this.forum.replyAmount).toLocaleString("en-US");
            }
        }
    }
</script>