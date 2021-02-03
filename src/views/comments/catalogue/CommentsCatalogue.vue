<template>
    <div class="flex flex-column bg-white shadow corners-3">
        <div class="flex flex-row pa-2 align-v-center bb-grey-1-1">
            <h1 class="heading grow">
                Comments
            </h1>
            <button
                class="btn collapse-square"
                @click="filters = !filters"
            >
                <span :class="[themeBgClass, filters ? 'text-white' : 'inverted ' + themeTextClass]">
                    <i class="fas fa-filter"></i>
                </span>
            </button>
        </div>

        <transition name="slide-fade">
            <div
                v-if="filters"
                class="flex flex-row pa-2 bb-grey-1-1"
            >
                <div class="flex flex-column">
                    <div
                        v-for="contentType in availableTypes"
                        class="flex flex-row form-group align-v-center mb-1"
                    >
                        <span class="toggle-input mr-1">
                            <input
                                :id="contentType.key"
                                :name="contentType.key"
                                :v-model="contentType.active"
                                :checked="contentType.active"
                                type="checkbox"
                                @change="handleFilter"
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            :for="contentType.key"
                            class="toggle-label capitalize"
                        >
                            {{ contentType.key.replace(/-/g, ' ') }}
                        </label>
                    </div>

                    <div class="flex flex-row form-group align-v-center mb-1">
                        <span class="toggle-input mr-1">
                            <input
                                id="noRepliedTo"
                                name="noRepliedTo"
                                :v-model="noRepliedTo"
                                :checked="noRepliedTo"
                                type="checkbox"
                                @change="removeCommentsWithReplies"
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            :for="noRepliedTo"
                            class="toggle-label capitalize"
                        >
                            Dont show comments we've replied to
                        </label>
                    </div>

                    <div class="flex flex-row form-group align-v-center mb-1">
                        <span class="toggle-input mr-1">
                            <input
                                id="openOnly"
                                name="openOnly"
                                :v-model="openOnly"
                                :checked="openOnly"
                                type="checkbox"
                                @change="changeOpenClosedCommentsOnly"
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            :for="openOnly"
                            class="toggle-label capitalize"
                        >
                            Open conversation comments only
                        </label>
                    </div>

                    <div class="flex flex-row form-group align-v-center mb-1">
                        <span class="toggle-input mr-1">
                            <input
                                id="closedOnly"
                                name="closedOnly"
                                :v-model="closedOnly"
                                :checked="closedOnly"
                                type="checkbox"
                                @change="changeOpenClosedCommentsOnly"
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            :for="closedOnly"
                            class="toggle-label capitalize"
                        >
                            Closed conversation comments only
                        </label>
                    </div>
                </div>
            </div>
        </transition>

        <div class="flex flex-row bb-grey-1-1 pa-2 tiny align-v-center">
            <p class="tiny dense mr-3">
                <i class="fas fa-check-square text-success mr-1"></i> Replied to (no response)
            </p>
            <p class="tiny dense mr-3">
                <i class="fas fa-check-square text-warning mr-1"></i> Replied to (has response)
            </p>
            <p class="tiny dense mr-3">
                <i class="fas fa-times-square text-error mr-1"></i> Not replied to
            </p>
        </div>

        <div class="flex flex-row pa-2 bg-grey-7 bb-grey-1-1 comment-data">
            <div class="flex flex-column user-name tiny dense font-bold ph-1">
                User
            </div>
            <div class="flex flex-column comment-body tiny dense font-bold ph-1">
                Comment Body
            </div>
            <div class="flex flex-column lesson-title tiny dense font-bold hide-xs-only ph-1">
                Title
            </div>
            <div class="flex flex-column lesson-type tiny dense font-bold hide-xs-only ph-1 text-center">
                Type
            </div>
            <div class="flex flex-column replied-to tiny dense font-bold ph-1 text-center">
                Replied
            </div>
            <div class="flex flex-column status tiny dense font-bold ph-1 text-center">
                Status
            </div>
        </div>
        <div
            v-for="comment in comments"
            v-if="!loading"
            class="comment-item flex flex-row bb-grey-1-1 pointer hover-bg-grey-7"
            :class="[openCommentId === comment.id ? 'bg-grey-7' : '']"
            @click="openCommentThread(comment)"
        >
            <div class="flex flex-column">
                <div class="comment-data flex flex-row align-v-top pa-2">
                    <div class="flex flex-column align-center user-name ph-1">
                        <!--                        <div class="flex flex-row align-v-center">-->
                        <div class="rounded overflow avatar mb-1 hide-xs-only">
                            <img :src="comment.user['fields.profile_picture_image_url']">
                        </div>
                        <h6 class="tiny font-bold text-center text-truncate">
                            {{ comment.user.display_name }}
                        </h6>
                        <!--                        </div>-->
                    </div>

                    <div
                        class="flex flex-column comment-body tiny ph-1"
                        v-html="comment.comment"
                    >
                        {{ comment.comment }}
                    </div>

                    <div class="flex flex-column lesson-title hide-xs-only ph-1">
                        <h6
                            v-if="comment.content"
                            class="tiny font-bold"
                        >
                            {{ comment.content.title }}
                        </h6>
                    </div>

                    <div class="flex flex-column lesson-type hide-xs-only ph-1 align-center">
                        <i
                            v-if="comment.content"
                            :class="[getContentTypeIcon(comment.content.type), themeTextClass]"
                        ></i>
                        <h6
                            v-if="comment.content"
                            class="tiny capitalize text-center"
                        >
                            {{ comment.content.type.replace(/-/g, ' ') }}
                        </h6>
                    </div>

                    <div class="flex flex-column replied-to body ph-1 align-center">
                        <i
                            class="fas"
                            :class="repliedToClasses(comment)"
                        ></i>
                    </div>

                    <div class="flex flex-column status hide-xs-only ph-1 align-center text-center">
                        <h6
                            v-if="comment.conversation_status"
                            :class="['font-bold', 'body', 'text-center', 'uppercase', comment.conversation_status === 'open' ? 'color-green' : 'color-red']"
                        >
                            {{ comment.conversation_status }}
                        </h6>

                        <button
                            v-if="comment.conversation_status === 'open'"
                            class="button btn collapse-250"
                            style="margin-top: 15px;"
                            @click.prevent.stop="markClosed(comment)"
                        >
                            <span
                                class="text-white background-color-red tiny" style="height: 25px;"
                            >
                                Close
                            </span>
                        </button>

                        <button
                            v-if="comment.conversation_status === 'closed'"
                            class="button btn collapse-250"
                            style="margin-top: 15px;"
                            @click.prevent.stop="markOpen(comment)"
                        >
                            <span class="text-white background-color-green tiny" style="height: 25px;">Open</span>
                        </button>
                    </div>
                </div>

                <transition
                    name="slide-fade"
                    enter-active-class="slide-fade-enter-active"
                >
                    <div
                        v-if="openCommentId === comment.id"
                        class="flex flex-row pa-2 ba-grey-1-1 bg-white corners-3 active-comment"
                    >
                        <div class="flex flex-column">
                            <comment-post
                                :comment="comment"
                                :brand="brand"
                                :current-user="currentUser"
                                :theme-color="themeColor"
                                :profile-base-route="profileBaseRoute"
                                :has-public-profiles="hasPublicProfiles"
                                @likeComment="handleCommentLike"
                                @likeReply="handleReplyLike"
                                @deleteComment="handleCommentDelete"
                                @deleteReply="handleReplyDelete"
                                @openLikes="addLikeUsersToModal"
                            ></comment-post>

                            <a
                                :href="comment.content.url + '?goToComment=' + comment.id"
                                class="btn flat"
                                target="_blank"
                                :class="themeTextClass"
                            >
                                Go to Lesson
                            </a>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <comment-likes-modal
            :theme-color="themeColor"
            :comment-id="currentLikeUsersId"
            :like-users="likeUsers"
            :total-like-users="totalLikeUsers"
            :loading-like-users="loadingLikeUsers"
            :requesting-like-users="requestingLikeUsers"
            @loadMoreLikeUsers="addLikeUsersToModal"
        ></comment-likes-modal>

        <div class="flex flex-row pa-3 align-center">
            <button
                class="button btn collapse-250"
                @click="loadMore"
            >
                <span
                    class="text-white"
                    :class="themeBgClass"
                >
                    <i
                        v-if="loading || requestingData"
                        class="fas fa-spin fa-spinner mr-1"
                    ></i>
                    {{ loading || requestingData ? 'Loading...' : 'Load More' }}
                </span>
            </button>
        </div>
    </div>
</template>
<script>
import CommentService from '../../../assets/js/services/comments';
import ContentService from '../../../assets/js/services/content';
import Utils from '../../../assets/js/classes/utils';
import CommentPost from '../_CommentPost';
import CommentLikesModal from '../_CommentLikesModal.vue';
import CommentMixin from '../_mixin';
import ThemeClasses from '../../../mixins/ThemeClasses';

export default {
    name: 'CommentsCatalogue',
    components: {
        'comment-post': CommentPost,
        'comment-likes-modal': CommentLikesModal,
    },
    mixins: [CommentMixin, ThemeClasses],
    data() {
        return {
            comments: [],
            filters: false,
            loading: false,
            openCommentId: 0,
            filterTimeout: null,
            noRepliedTo: true,
            openOnly: true,
            closedOnly: false,
            contentTypes: [
                {
                    key: 'course-part',
                    brand: ['drumeo', 'pianote', 'guitareo'],
                    value: ['course-part'],
                    icon: 'icon-courses',
                    active: true,
                },
                {
                    key: 'song',
                    brand: ['drumeo', 'pianote', 'guitareo'],
                    value: ['song', 'song-part'],
                    icon: 'icon-songs',
                    active: true,
                },
                {
                    key: 'show',
                    brand: ['drumeo'],
                    value: [
                        'gear-guides', 'challenges', 'boot-camps', 'quick-tips',
                        'podcasts', 'on-the-road', 'behind-the-scenes', 'study-the-greats',
                        'live', 'solos', 'performances', 'exploring-beats', 'sonor-drums',
                        'paiste-cymbals', '25-days-of-christmas', 'rhythms-from-another-planet',
                    ],
                    icon: 'icon-shows',
                    active: true,
                },
                {
                    key: 'play-along',
                    brand: ['drumeo', 'guitareo'],
                    value: ['play-along', 'play-along-part'],
                    icon: 'icon-play-alongs',
                    active: true,
                },
                {
                    key: 'student-focus',
                    brand: ['drumeo'],
                    value: ['student-focus'],
                    icon: 'icon-student-focus',
                    active: true,
                },
                {
                    key: 'student-focus',
                    brand: ['pianote'],
                    value: ['quick-tips', 'boot-camps', 'question-and-answer', 'student-review'],
                    icon: 'icon-student-focus',
                    active: true,
                },
                {
                    key: 'rudiment',
                    brand: ['drumeo'],
                    value: ['rudiment'],
                    icon: 'icon-drums',
                    active: true,
                },
                {
                    key: 'semester-pack-lesson',
                    brand: ['drumeo', 'guitareo'],
                    value: ['semester-pack-lesson'],
                    icon: 'icon-packs',
                    active: this.brand === 'guitareo',
                },
                {
                    key: 'pack-bundle-lesson',
                    brand: ['drumeo', 'guitareo', 'pianote'],
                    value: ['pack-bundle-lesson'],
                    icon: 'icon-packs',
                    active: true,
                },
                {
                    key: 'learning-path-lesson',
                    brand: ['drumeo', 'pianote'],
                    value: ['learning-path-lesson'],
                    icon: 'icon-packs',
                    active: true,
                },
                {
                    key: 'unit',
                    brand: ['pianote'],
                    value: ['unit-part'],
                    icon: 'icon-course',
                    active: true,
                },
                {
                    key: 'entertainment',
                    brand: ['guitareo'],
                    value: ['entertainment'],
                    icon: 'icon-shows',
                    active: true,
                },
            ],
        };
    },
    computed: {
        availableTypes() {
            return this.contentTypes.filter(type => type.brand.indexOf(this.brand) !== -1);
        },

        activeTypes() {
            const parsedTypes = [];

            this.availableTypes.forEach((type) => {
                if (type.active) {
                    parsedTypes.push(
                        ...type.value,
                    );
                }
            });

            return parsedTypes;
        },

        sortParam() {
            if (this.brand === 'guitareo') {
                return '-created_on';
            }

            return '-replied_on';
        },
    },
    mounted() {
        this.getComments(true);
    },
    methods: {
        handleFilter(event) {
            this.contentTypes.forEach((type) => {
                if (type.key === event.target.name) {
                    type.active = !type.active;
                }
            });

            clearTimeout(this.filterTimeout);

            this.filterTimeout = setTimeout(() => {
                this.getComments(true);
            }, 2000);
        },

        getContentTypeIcon(type) {
            const thisType = this.contentTypes.filter(contentType => contentType.key === type)[0];


            return thisType ? thisType.icon : 'icon-shows';
        },

        isRepliedTo(comment) {
            comment.replies = comment.replies || [];
                
            for (let i = 0; i < comment.replies.length; i++) {
                if (comment.replies[i].user.access_level === 'team') {
                    return true;
                }
            }

            return false;
        },

        lastReplyIsByTeam(comment) {
            return this.isRepliedTo(comment) && comment.replies[comment.replies.length - 1].user.access_level === 'team';
        },

        repliedToClasses(comment) {
            return {
                'fa-check-square': this.isRepliedTo(comment) === true,
                'text-success': this.lastReplyIsByTeam(comment),
                'text-warning': !this.lastReplyIsByTeam(comment),
                'fa-times-square': this.isRepliedTo(comment) === false,
                'text-error': this.isRepliedTo(comment) === false,
            };
        },

        openCommentThread(comment) {
            this.openCommentId = comment.id;
        },


        markOpen(comment) {
            comment.conversation_status = 'open';

            CommentService.updateCommentConversationStatus(comment.id, 'open');

            if (this.closedOnly) {
                this.comments.splice(this.comments.indexOf(comment), 1);
            }
        },

        markClosed(comment) {
            comment.conversation_status = 'closed';

            CommentService.updateCommentConversationStatus(comment.id, 'closed');

            if (!this.closedOnly) {
                this.comments.splice(this.comments.indexOf(comment), 1);
            }
        },

        changeOpenClosedCommentsOnly(comment) {
            this.openOnly = !this.openOnly;
            this.closedOnly = !this.openOnly;

            clearTimeout(this.filterTimeout);

            this.filterTimeout = setTimeout(() => {
                this.getComments(true);
            }, 1000);
        },

        getComments(replace = false) {
            this.requestingData = true;

            if (replace) {
                this.currentPage = 1;
                this.loading = true;
            }
                
            CommentService.getComments({
                brand: 'drumeo',
                limit: 100,
                sort: this.sortParam,
                content_type: this.activeTypes,
                page: this.currentPage,
                conversation_status: this.openOnly === true ? 'open' : 'closed',
            })
                .then((response) => {
                    // Pulls all Content IDs from every comment and returns all uniques
                    const allContentIds = response.data
                        .map(data => data.content_id)
                        .filter((id, index, self) => self.indexOf(id) === index);

                    if (response) {
                        const comments = response.data;

                        ContentService.getContentByIds(allContentIds.join(','))
                            .then((response) => {
                                const content = Utils.flattenContent(response.data.data);

                                comments.forEach((comment) => {
                                    content.forEach((content) => {
                                        if (content.id === comment.content_id) {
                                            comment.content = content;
                                        }
                                    });
                                });

                                if (replace) {
                                    this.comments = comments;
                                } else {
                                    this.comments = [
                                        ...this.comments,
                                        ...comments,
                                    ];
                                }

                                this.$nextTick(() => {
                                    this.loading = false;
                                    this.$forceUpdate();
                                });

                                this.requestingData = false;
                            });
                    }
                });
        },

        loadMore() {
            if (!this.requestingData) {
                this.currentPage += 1;

                this.getComments(false);
            }
        },

        removeCommentsWithReplies() {
            this.noRepliedTo = !this.noRepliedTo;
        },
    },
};
</script>
<style lang="scss">
    @import '../../../assets/sass/partials/variables';

    .user-name {
        flex:0 0 100px;
        max-width:100px;

        @include small {
            flex: 0 0 250px;
            max-width:250px;
        }
        .avatar {
            max-width:45px;
        }

        h6 {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }

    .lesson-title {
        flex: 0 0 150px;
        max-width:150px;
        min-width:150px;
    }

    .status {
        flex: 0 0 100px;
        max-width:100px;
        min-width:100px;
    }

    .lesson-type {
        flex: 0 0 150px;
        max-width:150px;
        min-width:150px;

        i {
            font-size:12px;
        }
    }

    .comment-item.replied {
        display:none;
    }

    .replied-to {
        flex:0 0 60px;
        max-width:60px;
        min-width:60px;
    }

    .comment-body p {
        word-break:break-word;
    }

    .comment-data {
        padding:#{$gutterWidth / 2} 0;

        @include small {
            padding:$gutterWidth / 2;
        }
    }

    .active-comment {
        width:100%;
        max-width:960px;
        margin:0 auto #{$gutterWidth / 2};
    }

    .comment-item .user-name {
        flex:0 0 100px;
        max-width:100px;
        min-width:100px;
    }
</style>
