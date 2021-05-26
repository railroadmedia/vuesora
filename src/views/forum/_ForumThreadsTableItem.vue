<template>
    <a
        :href="thread.url"
        class="tw-relative tw-flex tw-flex-row tw-items-center tw-py-4 tw-px-2 tw-text-black tw-no-underline tw-border-0 tw-border-b tw-border-solid tw-border-gray-200"
        :class="[brandHoverColor]"
    >
        <!-- Avatar -->
        <div class="tw-h-14 tw-w-14 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-relative tw-mr-6 tw-flex-shrink-0">
            <div class="user-avatar"
                 :class="[avatarClassObject, themeColor]"    
            >
                <img :src="thread.authorAvatar" class="tw-rounded-full tw-border-3">
                <i v-if="!thread.authorAvatar" class="tw-text-2xl tw-text-white fas fa-comments"></i>
            </div>
        </div>
        
        <!-- Description -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-pr-4">
            <p class="tw-text-sm tw-text-black tw-font-bold">
                <i v-if="thread.isPinned" class="fas fa-thumbtack"></i>
                <i v-if="thread.isLocked" class="fas fa-lock"></i>
                {{ thread.title }}
            </p>
            <p class="tw-text-xs tw-text-gray-600">
                Started on <strong>{{ thread.createdOn }}</strong> by <strong>{{ thread.authorUsername }}</strong> 
            </p>
            <p class="tw-text-xs tw-text-gray-600 text-truncate hide-md-up capitalize">
                {{ thread.topic }}
                <span class="bullet">&#x25CF;</span>
                {{ (thread.replyAmount - 1) }} {{ (thread.replyAmount - 1) === 1 ? 'reply' : 'replies' }}
            </p>
        </div>

        <!-- New Badge-->
        <div v-if="thread.isNew"
             class="tw-flex-col tw-hidden tw-ml-4 sm:tw-flex">
            <span class="tw-text-white tw-rounded-sm tw-uppercase tw-flex tw-p-0.5 tw-pr-1 tw-text-xs tw-items-center tw-font-bold"
                 :class="themeBgColor">
                <i class="fas fa-star tw-mr-0.5"></i> New
            </span>
        </div>

        <!-- Reply Count -->
        <div class="tw-flex tw-items-center tw-text-gray-600 tw-ml-auto tw-mr-12 tw-flex-shrink-0">
            <h6 class="tw-text-xs tw-font-bold">
                <i class="fas fa-comment-lines tw-mr-1"></i>
                {{ (thread.replyAmount - 1) }}
            </h6>
        </div>

        <!-- Post Date -->
        <div class="tw-flex tw-flex-col tw-justify-center tw-mr-12 tw-text-gray-600 tw-flex-shrink-0">
            <h6 class="tw-text-xs tw-font-bold">{{ thread.latestPost ? thread.latestPost.created_at_diff : ''}}</h6>
            <p class="tw-text-xs"><span class="tw-font-bold">By:</span> {{  thread.latestPost ? thread.latestPost.author_display_name : '' }}</p>
        </div>

        <!-- Arrow -->
        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center">
            <i class="fas fa-arrow-circle-right tw-rounded-full tw-text-3xl"
               :class="thread.isRead ? 'tw-text-gray-300' : themeTextColor"
            ></i>
        </div>
    </a>
</template>
<script>
export default {
    name: 'ForumThreadsTableItem',
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        brand: {
            type: String,
            default: () => '',
        },
        thread: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        themeBgColor() {
            return 'tw-bg-' + this.brand;
        },
        themeTextColor() {
            return 'tw-text-'+ this.brand;
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
        brandHoverColor() {
            return 'hover:tw-bg-'+this.brand+'-lightest'
        }
    },
};
</script>
<style>

</style>
