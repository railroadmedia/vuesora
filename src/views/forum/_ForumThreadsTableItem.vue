<template>
    <a
        :href="thread.url"
        class="tw-relative tw-flex tw-flex-row tw-items-center tw-py-4 tw-px-2 tw-text-black tw-no-underline tw-border-0 tw-border-b tw-border-solid tw-border-gray-200"
        :class="[brandHoverColor]"
    >
        <!-- Avatar -->
        <div class="tw-h-14 tw-w-14 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-relative tw-mr-6 tw-flex-shrink-0">
            <div class="user-avatar"
                 :class="[avatarClassObject, brand]"    
            >
                <img :src="thread.authorAvatar" class="tw-rounded-full tw-border-3">
                <i v-if="!thread.authorAvatar" class="tw-text-2xl tw-text-white fas fa-comments"></i>
            </div>
        </div>
        
        <!-- Description -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-pr-4 tw-mr-auto">
            <p class="tw-text-sm tw-text-black tw-font-bold">
                <i v-if="thread.isPinned" class="fas fa-thumbtack"></i>
                <i v-if="thread.isLocked" class="fas fa-lock"></i>
                {{ thread.title }}
            </p>
            <p class="tw-text-xs tw-text-gray-600">
                Started on <strong>{{ thread.createdOn }}</strong> by <strong>{{ thread.authorUsername }}</strong> 
            </p>
        </div>

        <!-- New Badge-->
        <div v-if="thread.isNew"
             class="tw-flex-col tw-hidden tw-ml-6 tw-mr-10 tw-hidden md:tw-flex">
            <span class="tw-text-white tw-rounded-sm tw-uppercase tw-flex tw-p-0.5 tw-pr-1 tw-text-xs tw-items-center tw-font-bold"
                 :class="brandBgColor">
                <i class="fas fa-star tw-mr-0.5"></i> New
            </span>
        </div>

        <!-- Reply Count -->
        <div class="tw-items-center tw-text-gray-600 tw-mr-4 md:tw-mr-12 tw-flex-shrink-0 tw-w-16 tw-text-left tw-hidden md:tw-flex">
            <h6 class="tw-text-xs tw-font-bold tw-with-tooltip tw-tooltip-center tw-tooltip-top">
                <i class="fas fa-comment-lines tw-mr-1"></i>
                {{ (thread.replyAmount - 1) }}

                <!-- Tool Tip -->
                <div class="tw-tooltip tw-tooltip-dark">
                    Total Replies
                </div>
            </h6>
        </div>

        <!-- Post Date -->
        <div class="tw-flex-col tw-justify-center tw-mr-6 tw-text-gray-600 tw-flex-shrink-0 tw-w-28 tw-hidden md:tw-flex">
            <h6 class="tw-text-xs tw-font-bold">{{ thread.latestPost ? thread.latestPost.created_at_diff : ''}}</h6>
            <p class="tw-text-xs tw-truncate">
                <span class="tw-font-bold">By:</span> 
                <span>{{  thread.latestPost ? thread.latestPost.author_display_name : '' }}</span>
            </p>
        </div>

        <!-- Arrow -->
        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center">
            <i class="fas fa-arrow-circle-right tw-rounded-full tw-text-3xl"
               :class="thread.isRead ? 'tw-text-gray-300' : brandTextColor"
            ></i>
        </div>
    </a>
</template>
<script>
export default {
    name: 'ForumThreadsTableItem',
    props: {
        brand: {
            type: String,
            default: () => '',
            require: true
        },
        thread: {
            type: Object,
            default: () => {},
            require: true
        },
    },
    computed: {
        brandBgColor() {
            return 'tw-bg-' + this.brand;
        },
        brandTextColor() {
            return 'tw-text-'+ this.brand;
        },
        brandHoverColor() {
            return 'hover:tw-bg-'+this.brand+'-lightest'
        },
        topicIdMap() {
            const topics = {
                1: 'general',
                2: 'gear',
                3: 'website feedback',
                4: 'off topic',
            };
            return topics[this.thread.topic];
        },
        avatarClassObject() {
            return {
                subscriber: ['edge', 'lifetime', 'team', 'admin', 'guitar', 'piano'].indexOf(this.thread.access_level) !== -1,
                edge: this.thread.access_level === 'edge',
                pack: this.thread.access_level === 'pack',
                team: ['team', 'admin'].indexOf(this.thread.access_level) !== -1,
                guitar: this.thread.access_level === 'guitar',
                piano: this.thread.access_level === 'piano',
                lifetime: this.thread.access_level === 'lifetime',
            };
        },
    },
};
</script>
