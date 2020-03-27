<template>
    <div
        id="commentsSection"
        class="flex flex-column grow"
    >
        <div class="flex flex-row flex-wrap pt-3 align-v-center">
            <div class="flex flex-column xs-12 sm-9 mb-3">
                <h1 class="heading">
                    {{ totalComments }} Comments
                </h1>
            </div>

            <div class="flex flex-column xs-12 sm-4 md-3 mb-3">
                <div
                    class="form-group xs-12"
                    style="width:100%;"
                >
                    <select
                        id="commentSort"
                        v-model="sortInterface"
                    >
                        <option value="-like_count">
                            Popular
                        </option>
                        <option value="-created_on">
                            Latest
                        </option>
                        <option value="created_on">
                            Oldest
                        </option>
                        <option value="-mine">
                            My Comments
                        </option>
                    </select>
                    <label
                        for="commentSort"
                        :class="themeColor"
                    >Sort By</label>
                </div>
            </div>
        </div>

        <div
            id="postComment"
            class="flex flex-row comment-post mv-3"
        >
            <div class="flex flex-column avatar-column pr hide-xs-only">
                <div
                    class="user-avatar smaller"
                    :class="avatarClassObject"
                >
                    <img
                        src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
                        :data-ix-src="currentUser.avatar"
                        data-ix-fade
                        class="rounded"
                    >
                </div>

                <p
                    v-if="showUserExp"
                    class="x-tiny dense font-bold uppercase text-center mt-1"
                >
                    {{ userExpRank }}
                </p>
                <p
                    v-if="showUserExp"
                    class="x-tiny dense text-center font-compressed"
                >
                    {{ userExpValue }} XP
                </p>
            </div>

            <div class="flex flex-column">
                <text-editor
                    ref="textEditor"
                    v-model="commentInterface"
                    toolbar="bold italic underline | bullist numlist | link"
                    :height="150"
                ></text-editor>

                <div class="flex flex-row align-h-right mv-1">
                    <button
                        class="btn collapse-150"
                        :disabled="loading"
                        dusk="submit-comment"
                        @click="postComment"
                    >
                        <span
                            class="text-white short"
                            :class="themeBgClass"
                        >
                            Comment
                        </span>
                    </button>
                </div>

                <div
                    v-show="loading"
                    class="loading-reply flex-center"
                >
                    <i
                        class="fas fa-spinner fa-spin"
                        :class="themeTextClass"
                    ></i>
                    <p class="x-tiny text-grey-3">
                        loading...
                    </p>
                </div>
            </div>
        </div>

        <comment-post
            v-if="pinnedComment != null"
            :comment="pinnedComment"
            :brand="brand"
            :current-user="currentUser"
            :pinned="true"
            :theme-color="themeColor"
            :profile-base-route="profileBaseRoute"
            :has-public-profiles="hasPublicProfiles"
            @likeComment="handleCommentLike"
            @likeReply="handleReplyLike"
            @deleteComment="handleCommentDelete"
            @deleteReply="handleReplyDelete"
            @openLikes="addLikeUsersToModal"
        ></comment-post>

        <comment-post
            v-for="(comment, i) in comments"
            :key="i"
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

        <comment-likes-modal
            :theme-color="themeColor"
            :brand="brand"
            :comment-id="currentLikeUsersId"
            :like-users="likeUsers"
            :total-like-users="totalLikeUsers"
            :loading-like-users="loadingLikeUsers"
            :requesting-like-users="requestingLikeUsers"
            @loadMoreLikeUsers="addLikeUsersToModal"
        ></comment-likes-modal>
    </div>
</template>
<script>
import axios from 'axios';
import * as QueryString from 'query-string';
import TextEditor from '../../components/TextEditor/TextEditor.vue';
import CommentService from '../../assets/js/services/comments';
import CommentPost from './_CommentPost.vue';
import CommentLikesModal from './_CommentLikesModal.vue';
import Toasts from '../../assets/js/classes/toasts';
import Utils from '../../assets/js/classes/utils';
import xpMapper from '../../assets/js/classes/xp-mapper';
import CommentMixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'Comments',
    components: {
        'text-editor': TextEditor,
        'comment-post': CommentPost,
        'comment-likes-modal': CommentLikesModal,
        // 'wysiwyg-editor': WYSIWYGEditor,
    },
    mixins: [ThemeClasses, CommentMixin],
    props: {
        contentId: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            comments: [],
            pinnedComment: null,
            sortOption: '-like_count',
            comment: '',
            loading: false,
        };
    },
    computed: {
        avatarClassObject() {
            return {
                subscriber: ['edge', 'lifetime', 'team'].indexOf(this.currentUser.access_level) !== -1,
                edge: this.currentUser.access_level === 'edge',
                pack: this.currentUser.access_level === 'pack',
                team: this.currentUser.access_level === 'team',
                lifetime: this.currentUser.access_level === 'lifetime',
            };
        },

        userExpValue() {
            return Utils.parseXpValue(this.currentUser.xp);
        },

        userExpRank() {
            if (this.currentUser.access_level === 'team') {
                return `${this.brand} Team`;
            }

            return xpMapper.getNearestValue(this.currentUser.xp);
        },

        sortInterface: {
            get() {
                return this.sortOption;
            },
            set(val) {
                this.sortOption = val;

                this.currentPage = 1;
                this.getComments(this.requestParams, true);
            },
        },

        commentInterface: {
            get() {
                return this.comment;
            },
            set(val) {
                this.comment = val;
            },
        },

        totalPages() {
            return Math.ceil(this.totalComments / 25);
        },

        requestParams() {
            return {
                page: this.currentPage,
                limit: 25,
                content_id: this.contentId,
                sort: this.sortOption,
            };
        },

        showUserExp() {
            return this.userExpValue != null && (['team', 'pack'].indexOf(this.currentUser.access_level) === -1);
        },
    },
    created() {
        this.getComments(this.requestParams);
    },
    mounted() {
        // Check the URI Params if 'goToComment' exists
        const uriParams = QueryString.parse(window.location.search);
        // Run the goToComment method if it does
        if (Object.keys(uriParams).indexOf('goToComment') !== -1) {
            this.goToComment(uriParams.goToComment);
        }

        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset + window.innerHeight;
            const bodyHeight = document.body.scrollHeight;

            if ((scrollPosition > bodyHeight - 200) && (this.comments.length !== this.totalComments)) {
                if (!this.requestingData) {
                    this.currentPage += 1;

                    this.getComments(this.requestParams);
                }
            }
        });
    },
    methods: {
        getComments(params, replace = false) {
            this.requestingData = true;

            CommentService.getComments(params)
                .then((resolved) => {
                    this.requestingData = false;

                    if (resolved) {
                        this.totalComments = resolved.meta ? resolved.meta.totalResults : resolved.total_results;
                        // this.totalCommentsAndReplies = resolved['meta']['totalCommentsAndReplies'];

                        if (replace) {
                            this.comments = resolved.data || resolved.results;
                        } else {
                            this.comments = this.comments.concat(
                                (resolved.data || resolved.results),
                            );
                        }

                        if (this.pinnedComment != null) {
                            this.comments = this.comments.filter(comment => comment.id !== this.pinnedComment.id);
                        }

                        window.ImgixService.reloadCommentImages();

                        setTimeout(() => {
                            // Load the Imgix Service to load srcs and srcsets
                            if (window.ImgixService) {
                                window.ImgixService.loadImageSources();
                            }
                        }, 500);
                    }
                });
        },

        getCommentById(id) {
            return axios.get(`/railcontent/comment/${id}`)
                .then(response => response.data)
                .catch(CommentService.handleError);
        },

        postComment() {
            if (this.comment.currentValue) {
                this.loading = true;

                return CommentService.postComment({
                    content_id: this.contentId,
                    comment: this.comment.currentValue,
                })
                    .then((resolved) => {
                        if (resolved) {
                            const thisComment = resolved.results || resolved.data[0];

                            this.commentInterface = '';
                            this.$refs.textEditor.currentValue = '';

                            Toasts.push({
                                icon: 'happy',
                                title: 'Woohoo!',
                                themeColor: this.themeColor,
                                message: `Your input is what makes ${Utils.toTitleCase(this.brand)} so great, thanks for commenting.`,
                            });

                            this.comments.splice(0, 0, thisComment);

                            window.ImgixService.reloadCommentImages();
                        }

                        this.loading = false;
                    });
            }
        },

        handleInput(payload) {
            this.commentInterface = payload.currentValue;
        },

        goToComment(id) {
            CommentService.getCommentById(id)
                .then((resolved) => {
                    if (resolved) {
                        const commentsSection = document.getElementById('postComment');
                        this.pinnedComment = resolved.data.find(result => result.id == id);

                        console.log(resolved);

                        /*
                            * Check intermittently for the DOM Element, it could possibly take a couple
                            * of seconds for Vue to render the pinned comment so we want to wait until it exists
                            * before we scroll to it and remove the old one.
                            *
                            * Curtis - Sept 2018
                             */
                        const checkInterval = setInterval(() => {
                            if (this.pinnedComment != null) {
                                this.comments = this.comments.filter(comment => comment.id !== this.pinnedComment.id);

                                setTimeout(() => {
                                    window.scrollTo(0, ((commentsSection.offsetTop + commentsSection.clientHeight) - 150));
                                }, 200);

                                clearInterval(checkInterval);
                            }
                        }, 100);
                    }
                });
        },
    },
};
</script>
