<template>
    <div
        :id="domID"
        class="flex flex-row comment-post pv mb-1"
        :class="{'pinned': pinned}"
    >
        <div class="flex flex-column avatar-column pr">
            <div
                v-if="hasPublicProfiles"
                class="user-avatar smaller"
                :class="[avatarClassObject, brand]"
            >
                <a
                    :href="profileRoute"
                    target="_blank"
                    class="no-decoration"
                >
                    <img
                        src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
                        :data-ix-src="comment.user['fields.profile_picture_image_url']"
                        data-ix-fade
                        class="rounded"
                    >
                </a>
            </div>
            <img
                v-if="!hasPublicProfiles"
                :src="comment.user['fields.profile_picture_image_url']"
                class="rounded"
            >

            <p
                v-if="showUserExp"
                class="body dense font-bold uppercase text-center mt-1"
            >
                {{ userExpRank }}
            </p>
            <p
                v-if="showUserExp"
                class="tiny dense text-center font-compressed"
            >
                {{ userExpValue }} XP
            </p>
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold break-words">
                        <a
                            v-if="hasPublicProfiles"
                            :href="profileRoute"
                            target="_blank"
                            class="text-black no-decoration"
                        >
                            {{ comment.user.display_name }}
                        </a>
                        <span
                            v-else
                            class="text-black no-decoration"
                        >
                            {{ comment.user.display_name }}
                        </span>

                        <span class="x-tiny text-grey-3 font-bold font-italic uppercase ml-1">
                            {{ dateString }}
                        </span>
                    </h2>
                </div>

                <div class="flex flex-column align-h-right align-v-center flex-auto">
                    <div class="flex flex-row">
                        <span
                            v-if="(isUsersPost || isCurrentUserAdmin)"
                            class="tiny no-decoration text-grey-3 pointer mr-1"
                        >
                            <i
                                class="fas fa-trash"
                                @click="deleteComment"
                            ></i>
                        </span>

                        <!--<span class="tiny no-decoration text-grey-3 pointer">-->
                        <!--<i class="fas fa-link"-->
                        <!--@click="getCommentLink"></i>-->
                        <!--<textarea class="comment-id-copy"-->
                        <!--contenteditable="true">{{ commentUrl }}</textarea>-->
                        <!--</span>-->
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mb-1">
                <div
                    class="flex flex-column post-body grow"
                    v-html="comment.comment"
                >
                    {{ comment.comment }}
                </div>
            </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p
                            class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                            :class="replying ? themeTextClass : 'text-grey-3'"
                            dusk="reply-button"
                            @click="replyToComment"
                        >
                            <i class="fas fa-reply"></i>
                            <span class="hide-xs-only">
                                {{ replying ? 'Replying' : 'Reply' }}
                            </span>
                        </p>

                        <p
                            v-if="!isUsersPost"
                            class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                            :class="comment.is_liked ? themeTextClass : 'text-grey-3'"
                            dusk="like-button"
                            @click="likeComment"
                        >
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ comment.is_liked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <span class="grow"></span>

                        <p
                            class="x-tiny font-bold text-grey-3 uppercase nowrap pointer noselect"
                            :data-open-modal="openModalString"
                            @click="openLikes"
                        >
                            <i
                                class="fas fa-thumbs-up text-white likes-icon"
                                :class="comment.like_count > 0 ? themeBgClass : 'bg-grey-2'"
                            ></i> {{ comment.like_count }}
                        </p>
                    </div>
                </div>
            </div>

            <transition
                name="slide-fade"
                enter-active-class="slide-fade-enter-active"
                leave-active-class=""
            >
                <div
                    v-if="replying"
                    class="flex flex-row comment-post mv-2"
                >
                    <div class="flex flex-column avatar-column pr hide-xs-only">
                        <img
                            :src="currentUser.avatar"
                            class="rounded"
                        >
                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row">
                            <text-editor
                                ref="textEditor"
                                v-model="replyInterface"
                                toolbar="bold italic underline | bullist numlist | link"
                                :height="150"
                            ></text-editor>
                        </div>
                        <div class="flex flex-row align-h-right mv-1">
                            <a
                                class="btn flat text-black collapse-150 short mr-1"
                                @click="cancelReply"
                            >
                                Cancel
                            </a>
                            <button
                                class="btn collapse-150"
                                :disabled="loading"
                                dusk="submit-reply"
                                @click="postReply"
                            >
                                <span
                                    class="text-white short"
                                    :class="themeBgClass"
                                >
                                    Reply
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
            </transition>

            <transition-group
                name="slide-fade"
                enter-active-class="slide-fade-enter-active"
                leave-active-class=""
                tag="div"
            >
                <comment-reply
                    v-for="replyComment in repliesToShow"
                    :key="replyComment.id"
                    :comment="replyComment"
                    :brand="brand"
                    :parent-id="comment.id"
                    :current-user="currentUser"
                    :theme-color="themeColor"
                    :profile-base-route="profileBaseRoute"
                    :has-public-profiles="hasPublicProfiles"
                    @likeReply="likeReply"
                    @deleteReply="deleteReply"
                    @openLikes="openLikes"
                    @replyPosted="replyPosted"
                ></comment-reply>
            </transition-group>

            <div
                v-if="comment.replies && comment.replies.length > 2"
                class="flex flex-row align-center"
            >
                <a
                    class="btn btn-tiny flat text-grey-3 collapse-150"
                    @click="showAllReplies = !showAllReplies"
                >
                    {{ showAllReplies ? 'Hide Replies' : 'Show All Replies' }}
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import { DateTime } from 'luxon';
import Toasts from '../../assets/js/classes/toasts';
import CommentService from '../../assets/js/services/comments';
import TextEditor from '../../components/TextEditor/TextEditor.vue';
import CommentReply from './_CommentReply.vue';
import Utils from '../../assets/js/classes/utils';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CommentPost',
    components: {
        'text-editor': TextEditor,
        'comment-reply': CommentReply,
    },
    mixins: [ThemeClasses],
    props: {
        brand: {
            type: String,
            default: () => '',
        },
        currentUser: {
            type: Object,
            default: () => ({
                display_name: '',
                id: 0,
                isAdmin: false,
                avatar: '',
            }),
        },
        profileBaseRoute: {
            type: String,
            default: '/laravel/public/members/profile/',
        },
        comment: {
            type: Object,
            default: () => ({
                user: {},
            }),
        },
        hasPublicProfiles: {
            type: Boolean,
            default: () => true,
        },
        pinned: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            replying: false,
            showAllReplies: false,
            reply: '',
            loading: false,
        };
    },
    computed: {
        avatarClassObject() {
            return {
                subscriber: ['edge', 'lifetime', 'team', 'guitar', 'piano'].indexOf(this.comment.user.access_level) !== -1,
                edge: this.comment.user.access_level === 'edge',
                pack: this.comment.user.access_level === 'pack',
                team: this.comment.user.access_level === 'team',
                guitar: this.comment.user.access_level === 'guitar',
                piano: this.comment.user.access_level === 'piano',
                lifetime: this.comment.user.access_level === 'lifetime',
            };
        },

        userExpValue() {
            if (this.brand === 'guitareo') {
                return null;
            }

            return Utils.parseXpValue(this.comment.user.xp);
        },

        userExpRank() {
            if (this.comment.user.access_level === 'team') {
                return `${this.brand} Team`;
            }

            if (this.brand === 'pianote') {
                return this.comment.user.rank || 'Casual';
            }

            return 'Level ' + (this.comment.user.level_number || '0.0');
        },

        repliesToShow() {
            setTimeout(() => {
                // Sometimes vue caches the add event button.
                // If it doesn't we need to force a refresh, done with a timeout to
                // Prevent race conditions.
                if (window.addeventatc) {
                    window.addeventatc.refresh();
                }

                // Load the Imgix Service to load srcs and srcsets
                if (window.ImgixService) {
                    window.ImgixService.loadImageSources();
                }
            }, 300);

            if (this.showAllReplies || this.pinned) {
                this.showAllReplies = true;

                return this.comment.replies;
            }

            return this.comment.replies ? this.comment.replies.filter((reply, index) => index < 2) : [];
        },

        replyInterface: {
            get() {
                return this.reply;
            },
            set(val) {
                this.reply = val;
            },
        },

        domID() {
            if (this.pinned) {
                return `pinnedComment${this.comment.id}`;
            }

            return `comment${this.comment.id}`;
        },

        profileRoute() {
            return this.profileBaseRoute + this.comment.user_id;
        },

        isLiked() {
            return this.comment.is_liked;
        },

        commentUrl() {
            return `${window.location}?goToComment=${this.comment.id}`;
        },

        dateString() {
            return DateTime.fromSQL(this.comment.created_on, { zone: 'UTC' }).minus({ seconds: 1 }).toRelative();
        },

        isUsersPost() {
            return String(this.currentUser.id) === String(this.comment.user_id);
        },

        isCurrentUserAdmin() {
            return this.currentUser.isAdmin === true;
        },

        openModalString() {
            return this.comment.like_count > 0 ? 'likeUsersModal' : '';
        },

        showUserExp() {
            return this.userExpValue != null && this.comment.user.access_level !== 'team';
        },
    },
    mounted() {
        this.$root.$on('replyOpened', (payload) => {
            if (this.comment.id !== payload.id) {
                this.replying = false;
            }
        });
    },
    methods: {
        replyToComment() {
            this.replying = !this.replying;
            this.$root.$emit('replyOpened', {
                id: this.comment.id,
            });
        },

        postReply() {
            if (this.reply.currentValue) {
                this.loading = true;

                return CommentService.postReply({
                    parent_id: this.comment.id,
                    comment: this.reply.currentValue,
                })
                    .then((resolved) => {
                        if (resolved) {
                            const thisComment = resolved.results || resolved.data[0];

                            this.replyInterface = '';
                            this.replying = false;
                            this.$refs.textEditor.currentValue = '';
                            Toasts.push({
                                icon: 'happy',
                                title: 'Woohoo!',
                                themeColor: this.themeColor,
                                message: 'Thanks for your reply!',
                            });

                            this.replyPosted({ data: thisComment });
                        }

                        this.loading = false;
                    });
            }
        },

        replyPosted(payload) {
            if (this.comment.replies) {
                this.comment.replies.splice(this.comment.replies.length, 0, payload.data);
            }

            this.showAllReplies = true;
        },

        cancelReply() {
            this.replying = false;
            this.reply = '';
        },

        likeComment() {
            this.$emit('likeComment', {
                id: this.comment.id,
                isLiked: this.comment.is_liked,
                pinned: this.pinned,
            });
        },

        deleteComment() {
            Toasts.confirm({
                title: 'Are you sure you want to delete this comment?',
                submitButton: {
                    text: '<span class="bg-error text-white">Delete</span>',
                    callback: () => {
                        this.$emit('deleteComment', {
                            id: this.comment.id,
                            pinned: this.pinned,
                        });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        likeReply(payload) {
            this.$emit('likeReply', {
                parent_id: this.comment.id,
                id: payload.id,
                isLiked: payload.isLiked,
            });
        },

        deleteReply(payload) {
            this.$emit('deleteReply', {
                parent_id: this.comment.id,
                id: payload.id,
            });
        },

        openLikes(payload) {
            const hasLikesOrIsBeingBussedFromRoot = this.comment.like_count > 0 || payload.busToRoot;

            if (hasLikesOrIsBeingBussedFromRoot) {
                this.$emit('openLikes', {
                    id: payload.busToRoot ? payload.id : this.comment.id,
                    totalLikeUsers: payload.busToRoot ? payload.totalLikeUsers : this.comment.like_count,
                });
            }
        },

        getCommentLink(event) {
            const { parentElement } = event.target;
            const commentId = parentElement.querySelector('.comment-id-copy');

            commentId.focus();
            commentId.select();

            document.execCommand('copy');

            setTimeout(() => {
                commentId.blur();
            }, 50);
        },
    },
};
</script>
