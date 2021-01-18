<template>
    <div class="flex flex-row comment-post pv mv-1">
        <div class="flex flex-column avatar-column pr">
            <div
                v-if="hasPublicProfiles && comment.user.access_level != 'lifetime'"
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
            <div
                class="lifetime-user-avatar-wrapper rounded"
                v-if="hasPublicProfiles && comment.user.access_level == 'lifetime'"
            >
                <a
                    :href="profileRoute"
                    target="_blank"
                    class="no-decoration"
                >
                    <div
                        class="lifetime-user-avatar"
                        :style="lifetimeUserAvatar"
                    ></div>
                </a>
            </div>
            <div
                class="lifetime-user-avatar-wrapper smaller rounded"
                v-if="!hasPublicProfiles && comment.user.access_level == 'lifetime'"
            >
                <div
                    class="lifetime-user-avatar"
                    :style="{ 'background-image': lifetimeUserAvatarQuoted() }"
                ></div>
            </div>
            <img
                v-if="!hasPublicProfiles && comment.user.access_level != 'lifetime'"
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
            <div class="flex flex-row align-v-center mb-1 comment-meta">
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
                            @click="openReply"
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

            <transition name="slide-fade">
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
                                @click="replying = false"
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
        </div>
    </div>
</template>
<script>
import { DateTime } from 'luxon';
import Utils from '../../assets/js/classes/utils';
import TextEditor from '../../components/TextEditor/TextEditor.vue';
import Toasts from '../../assets/js/classes/toasts';
import CommentService from '../../assets/js/services/comments';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CommentReply',
    components: {
        'text-editor': TextEditor,
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
        parentId: {
            type: [String, Number],
            default: () => null,
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
        contentId: {
            type: Number,
            default: () => 0,
        },
        pinned: {
            type: Boolean,
            default: () => false,
        },
        hasPublicProfiles: {
            type: Boolean,
            default: () => true,
        },
    },
    data() {
        return {
            isLiked: this.comment.is_liked,
            reply: '',
            replying: false,
            loading: false,
        };
    },
    computed: {
        avatarClassObject() {
            return {
                subscriber: ['coach', 'edge', 'lifetime', 'team', 'guitar', 'piano']
                    .indexOf(this.comment.user.access_level) !== -1,
                coach: this.comment.user.access_level === 'coach',
                edge: this.comment.user.access_level === 'edge',
                pack: this.comment.user.access_level === 'pack',
                team: this.comment.user.access_level === 'team',
                guitar: this.comment.user.access_level === 'guitar',
                piano: this.comment.user.access_level === 'piano',
                lifetime: this.comment.user.access_level === 'lifetime',
            };
        },

        replyInterface: {
            get() {
                return this.reply;
            },
            set(val) {
                this.reply = val;
            },
        },

        userExpValue() {
            if (this.brand === 'guitareo') {
                return null;
            }

            return Utils.parseXpValue(this.comment.user.xp);
        },

        userExpRank() {
            if (this.comment.user.access_level === 'coach') {
                return 'Coach';
            }

            if (this.comment.user.access_level === 'team') {
                return `${this.brand} Team`;
            }

            if (this.brand === 'pianote') {
                return this.comment.user.rank || 'Casual';
            }

            return 'Level ' + (this.comment.user.level_number || '0.0');
        },

        profileRoute() {
            return this.profileBaseRoute + this.comment.user_id;
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
        likeComment() {
            this.isLiked = !this.isLiked;

            this.$emit('likeReply', {
                id: this.comment.id,
                isLiked: this.comment.is_liked,
                isPinned: this.pinned,
            });
        },

        openLikes() {
            if (this.comment.like_count > 0) {
                this.$emit('openLikes', {
                    id: this.comment.id,
                    totalLikeUsers: this.comment.like_count,
                    busToRoot: true,
                });
            }
        },

        openReply() {
            this.replying = !this.replying;
            this.$root.$emit('replyOpened', {
                id: this.comment.id,
            });
        },

        postReply() {
            if (this.reply.currentValue) {
                this.loading = true;

                return CommentService.postReply({
                    parent_id: this.parentId,
                    comment: this.reply.currentValue,
                })
                    .then((resolved) => {
                        if (resolved) {
                            this.replyInterface = '';
                            this.replying = false;
                            this.$refs.textEditor.currentValue = '';
                            Toasts.push({
                                icon: 'happy',
                                title: 'Woohoo!',
                                themeColor: this.themeColor,
                                message: 'Thanks for your reply!',
                            });

                            this.$emit('replyPosted', {
                                data: resolved.results || resolved.data[0],
                            });
                        }

                        this.loading = false;
                    });
            }
        },

        deleteComment() {
            Toasts.confirm({
                title: 'Are you sure you want to delete this reply?',
                submitButton: {
                    text: '<span class="bg-error text-white">Delete</span>',
                    callback: () => {
                        this.$emit('deleteReply', {
                            id: this.comment.id,
                        });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        lifetimeUserAvatar() {
            return `background-image: url("${this.comment.user['fields.profile_picture_image_url']}");`;
        },
    },
};
</script>
