<template>
    <a
        :href="thread.url"
        class="content-table-row flex flex-row bt-grey-1-1 no-decoration pa-1"
    >
        <div class="flex flex-column avatar-col align-v-center">
            <div
                class="thumb-img square rounded bg-center user-avatar"
                :class="[avatarClassObject, themeColor]"
                :style="'background-image:url(' + thread.authorAvatar + ');'"
            ></div>
        </div>

        <div class="flex flex-column align-v-center pl-1 title-column overflow">

            <p class="tiny text-black font-bold item-title">
                <i
                    v-if="thread.isPinned"
                    class="fas fa-thumbtack"
                ></i>
                <i
                    v-if="thread.isLocked"
                    class="fas fa-lock"
                ></i>
                {{ thread.title }}
            </p>

            <p class="x-tiny text-grey-3 uppercase font-italic">
                last post <strong>{{ thread.lastPostDate }}</strong> by <strong>{{ thread.authorUsername }}</strong>
            </p>

            <p class="x-tiny text-grey-3 text-truncate font-italic hide-md-up capitalize">

                {{ thread.topic }}
                <span class="bullet">&#x25CF;</span>
                {{ (thread.replyAmount - 1) }} {{ (thread.replyAmount - 1) === 1 ? 'reply' : 'replies' }}
            </p>
        </div>

        <div
            v-if="thread.isNew"
            class="flex flex-column icon-col align-center hide-xs-only new-post-badge"
        >
            <span
                class="text-white corners-3 uppercase flex flex-row x-tiny align-center font-bold"
                :class="themeBgClass"
            >
                <i class="fas fa-star flex-center"></i> New
            </span>
        </div>

        <div class="flex flex-column align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down uppercase">
            {{ topicIdMap }}
        </div>

        <div class="flex flex-column align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down uppercase">
            {{ (thread.replyAmount - 1) }} {{ (thread.replyAmount - 1) === 1 ? 'reply' : 'replies' }}
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="body">
                <i
                    class="fas fa-arrow-circle-right flex-center rounded"
                    :class="thread.isRead ? 'text-grey-2' : themeTextClass"
                ></i>
            </div>
        </div>
    </a>
</template>
<script>
import ThemeClasses from '../../mixins/ThemeClasses.js';

export default {
    name: 'ForumThreadsTableItem',
    mixins: [ThemeClasses],
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },

        thread: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
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
    methods: {
    },
};
</script>
<style>

</style>
