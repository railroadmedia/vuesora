<template>
    <a
        :href="forum.url+'?sortby_val=last_post_published_on'"
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
       
        <div class="tw-w-full tw-min-w-0 tw-pr-0"
        >
            <div class="tw-flex">
                <!-- Title -->
                <h4 class="tw-leading-6 tw-text-lg tw-font-bold tw-inline-flex tw-items-start md:tw-items-center tw-row-span-1 tw-pr-3">
                    {{ forum.title }}
                </h4>

                <!-- Reply Amount MOBILE ONLY -->
                <div class="tw-ml-auto tw-items-start tw-text-gray-600 tw-mt-1 tw-mr-4 tw-flex-shrink-0 tw-w-16 tw-text-left tw-flex md:tw-hidden">
                    <h6 class="tw-text-13 tw-font-bold tw-with-tooltip tw-tooltip-center tw-tooltip-top tw-ml-auto sm:tw-ml-0 sm:tw-mr-auto">
                        <i class="fas fa-comment-lines tw-mr-1"></i>
                        {{ replyCount }}

                        <!-- Tool Tip -->
                        <div class="tw-tooltip tw-tooltip-dark">
                            Total Threads
                        </div>
                    </h6>
                </div>

            </div>
            
            <!-- Description -->
            <p v-if="forum.description" class=" md:tw-pr-10 tw-text-13  tw-mt-2">
                {{ forum.description }}
            </p>
        </div>

        <!-- Reply Amount -->
        <div class="tw-items-center tw-text-gray-600 tw-mr-4 lg:tw-mr-12 tw-flex-shrink-0 tw-w-16 tw-text-left tw-hidden md:tw-flex">
            <h6 class="tw-text-13 tw-font-bold tw-with-tooltip tw-tooltip-center tw-tooltip-top tw-ml-auto sm:tw-ml-0 sm:tw-mr-auto">
                <i class="fas fa-comment-lines tw-mr-1"></i>
                {{ replyCount }}

                <!-- Tool Tip -->
                <div class="tw-tooltip tw-tooltip-dark">
                    Total Threads
                </div>
            </h6>
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
                return 'hover:tw-bg-'+this.brand+'-100'
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