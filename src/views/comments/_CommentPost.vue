<template>
    <div :id="domID"
         class="flex flex-row comment-post pa mb-1"
         :class="{'pinned': pinned}">
        <div class="flex flex-column avatar-column pr">
            <div v-if="hasPublicProfiles"
                 class="user-avatar smaller"
                 :class="[avatarClassObject, brand]">
                <a :href="profileRoute" target="_blank"
                   class="no-decoration">
                    <img :src="user['fields.profile_picture_image_url']" class="rounded">
                </a>
            </div>
            <img v-if="!hasPublicProfiles"
                 :src="user['fields.profile_picture_image_url']" class="rounded">

            <p v-if="showUserExp"
               class="x-tiny dense font-bold uppercase text-center mt-1">{{ userExpRank }}</p>
            <p v-if="showUserExp"
               class="x-tiny dense text-center font-compressed">{{ userExpValue }} XP</p>
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold">
                        <a v-if="hasPublicProfiles"
                           :href="profileRoute" target="_blank"
                           class="text-black no-decoration">
                            {{ user.display_name }}
                        </a>
                        <span v-else class="text-black no-decoration">
                            {{ user.display_name }}
                        </span>

                        <span class="x-tiny text-grey-3 font-bold font-italic uppercase ml-1">
                            {{ dateString }}
                        </span>
                    </h2>
                </div>

                <div class="flex flex-column align-h-right align-v-center flex-auto">
                    <div class="flex flex-row">

                        <span class="tiny no-decoration text-grey-3 pointer mr-1"
                              v-if="(isUsersPost || isCurrentUserAdmin)">
                            <i class="fas fa-trash"
                               @click="deleteComment"></i>
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
                <div class="flex flex-column post-body grow"
                     v-html="comment">
                    {{ comment }}
                </div>
            </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                           :class="replying ? themeTextClass : 'text-grey-3'"
                           @click="replyToComment"
                           dusk="reply-button">
                            <i class="fas fa-reply"></i>
                            <span class="hide-xs-only">
                                {{ replying ? 'Replying' : 'Reply' }}
                            </span>
                        </p>

                        <p v-if="!isUsersPost"
                           class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                           :class="is_liked ? themeTextClass : 'text-grey-3'"
                           @click="likeComment"
                           dusk="like-button">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ is_liked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <span class="grow"></span>

                        <p class="x-tiny font-bold text-grey-3 uppercase nowrap pointer noselect"
                           :data-open-modal="openModalString"
                           @click="openLikes">
                            <i class="fas fa-thumbs-up text-white likes-icon"
                               :class="like_count > 0 ? themeBgClass : 'bg-grey-2'"></i> {{ like_count }}
                        </p>
                    </div>
                </div>
            </div>

            <transition name="slide-fade"
                        enter-active-class="slide-fade-enter-active"
                        leave-active-class="">
                <div class="flex flex-row comment-post mv-2" v-show="replying">
                    <div class="flex flex-column avatar-column pr hide-xs-only">
                        <img :src="currentUser.avatar" class="rounded">
                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row">
                            <text-editor toolbar="bold italic underline | bullist numlist | link"
                                         :height="150"
                                         ref="textEditor"
                                         v-model="replyInterface"></text-editor>
                        </div>
                        <div class="flex flex-row align-h-right mv-1">
                            <a class="btn flat text-black collapse-150 short mr-1"
                               @click="cancelReply">
                                Cancel
                            </a>
                            <button class="btn collapse-150" :disabled="loading"
                                    @click="postReply"
                                    dusk="submit-reply">
                                <span class="text-white short"
                                      :class="themeBgClass">
                                    Reply
                                </span>
                            </button>
                        </div>

                        <div class="loading-reply flex-center" v-show="loading">
                            <i class="fas fa-spinner fa-spin" :class="themeTextClass"></i>
                            <p class="x-tiny text-grey-3">loading...</p>
                        </div>
                    </div>
                </div>
            </transition>

            <transition-group name="slide-fade"
                              enter-active-class="slide-fade-enter-active"
                              leave-active-class=""
                              tag="div">
                <comment-reply v-for="(reply, i) in replies"
                               v-if="i < 2 || showAllReplies"
                               :key="reply.id"
                               v-bind="reply"
                               :id="reply.id"
                               :brand="brand"
                               :parentId="id"
                               :currentUser="currentUser"
                               :themeColor="themeColor"
                               :profileBaseRoute="profileBaseRoute"
                               :hasPublicProfiles="hasPublicProfiles"
                               @likeReply="likeReply"
                               @deleteReply="deleteReply"
                               @openLikes="openLikes"
                               @replyPosted="replyPosted"></comment-reply>
            </transition-group>

            <div class="flex flex-row align-center" v-if="replies.length > 2">
                <a class="btn btn-tiny flat text-grey-3 collapse-150"
                   @click="showAllReplies = !showAllReplies">
                    {{ showAllReplies ? 'Hide Replies' : 'Show All Replies' }}
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import Toasts from '../../assets/js/classes/toasts';
    import CommentService from '../../assets/js/services/comments';
    import TextEditor from '../../components/TextEditor/TextEditor.vue';
    import CommentReply from './_CommentReply.vue';
    import xpMapper from '../../assets/js/classes/xp-mapper';
    import Utils from '../../assets/js/classes/utils';
    import { DateTime } from 'luxon';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'comment-post',
        components: {
            'text-editor': TextEditor,
            'comment-reply': CommentReply
        },
        props: {
            brand: {
                type: String,
                default: () => ''
            },
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        display_name: '',
                        id: 0,
                        isAdmin: false,
                        avatar: '',
                    }
                }
            },
            id: {
                type: Number,
                default: () => 0
            },
            profileBaseRoute: {
                type: String,
                default: '/laravel/public/members/profile/'
            },
            comment: {
                type: String,
                default: () => ''
            },
            content_id: {
                type: Number,
                default: () => 0
            },
            created_on: {
                type: String,
                default: () => ''
            },
            display_name: {
                type: String,
                default: () => ''
            },
            is_liked: {
                type: Boolean,
                default: () => false
            },
            like_count: {
                type: Number,
                default: () => 0
            },
            like_users: {
                type: Array,
                default: () => []
            },
            replies: {
                type: Array,
                default: () => []
            },
            pinned: {
                type: Boolean,
                default: () => false
            },
            user_id: {
                type: Number,
                default: () => 0
            },
            user: {
                type: Object,
                default: () => {
                    return {
                        'fields.profile_picture_image_url': '',
                        id: 0,
                        display_name: '',
                        xp: 0,
                        access_level: ''
                    }
                }
            },
            hasPublicProfiles: {
                type: Boolean,
                default: () => true
            },
        },
        data() {
            return {
                replying: false,
                showAllReplies: false,
                reply: '',
                loading: false
            }
        },
        computed: {
            avatarClassObject() {
                return {
                    'subscriber': ['edge', 'lifetime', 'team', 'guitar', 'piano'].indexOf(this.user.access_level) !== -1,
                    'edge': this.user.access_level === 'edge',
                    'pack': this.user.access_level === 'pack',
                    'team': this.user.access_level === 'team',
                    'guitar': this.user.access_level === 'guitar',
                    'piano': this.user.access_level === 'piano',
                    'lifetime': this.user.access_level === 'lifetime'
                }
            },

            userExpValue() {
                if(this.brand === 'guitareo'){
                    return null;
                }

                return Utils.parseXpValue(this.user.xp);
            },

            userExpRank() {
                if(this.user.access_level === 'team'){
                    return  this.brand + ' Team';
                }

                return xpMapper.getNearestValue(this.user.xp);
            },

            replyInterface: {
                get() {
                    return this.reply;
                },
                set(val) {
                    this.reply = val;
                }
            },

            domID() {
                if (this.pinned) {
                    return 'pinnedComment' + this.id
                }

                return 'comment' + this.id
            },

            profileRoute() {
                return this.profileBaseRoute + this.user_id
            },

            isLiked() {
                return this.like_users.filter(user =>
                    user.display_name === this.currentUser.display_name
                ).length > 0;
            },

            commentUrl() {
                return window.location + '?goToComment=' + this.id;
            },

            dateString() {
                return DateTime.fromSQL(this.created_on, { zone: 'UTC'}).minus({seconds: 1}).toRelative();
            },

            isUsersPost() {
                return String(this.currentUser.id) === String(this.user_id);
            },

            isCurrentUserAdmin() {
                return this.currentUser.isAdmin === true;
            },

            openModalString(){
                return this.like_count > 0 ? 'likeUsersModal' : '';
            },

            showUserExp(){
                return this.userExpValue != null && (['team', 'pack'].indexOf(this.user.access_level) === -1);
            }
        },
        methods: {
            replyToComment() {
                this.replying = !this.replying;
                this.$root.$emit('replyOpened', {
                    id: this.id
                });
            },

            postReply() {
                if (this.reply.currentValue) {
                    this.loading = true;

                    return CommentService.postReply({
                        parent_id: this.id,
                        comment: this.reply.currentValue
                    })
                        .then(resolved => {
                            if (resolved) {
                                let thisComment = resolved['results'] || resolved['data'][0];

                                this.replyInterface = '';
                                this.replying = false;
                                this.$refs.textEditor.currentValue = '';
                                Toasts.push({
                                    icon: 'happy',
                                    title: 'Woohoo!',
                                    themeColor: this.themeColor,
                                    message: 'Thanks for your reply!'
                                });

                                this.replyPosted({data: thisComment});
                            }

                            this.loading = false;
                        });
                }
            },

            replyPosted(payload){
                this.replies.splice(this.replies.length, 0, payload.data);
                this.showAllReplies = true;
            },

            cancelReply() {
                this.replying = false;
                this.reply = '';
            },

            likeComment() {
                this.$emit('likeComment', {
                    id: this.id,
                    isLiked: this.is_liked,
                    pinned: this.pinned,
                });
            },

            deleteComment() {
                const vm = this;

                Toasts.confirm({
                    title: 'Are you sure you want to delete this comment?',
                    submitButton: {
                        text: '<span class="bg-error text-white">Delete</span>',
                        callback: () => {
                            vm.$emit('deleteComment', {
                                id: vm.id
                            });
                        }
                    },
                    cancelButton: {
                        text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>'
                    }
                });
            },

            likeReply(payload) {
                this.$emit('likeReply', {
                    parent_id: this.id,
                    id: payload.id,
                    isLiked: payload.isLiked
                });
            },

            deleteReply(payload) {
                this.$emit('deleteReply', {
                    parent_id: this.id,
                    id: payload.id
                })
            },

            openLikes(payload){
                const hasLikesOrIsBeingBussedFromRoot = this.like_count > 0 || payload.busToRoot;

                if(hasLikesOrIsBeingBussedFromRoot){
                    this.$emit('openLikes', {
                        id: payload.busToRoot ? payload.id : this.id,
                        totalLikeUsers: payload.busToRoot ? payload.totalLikeUsers : this.like_count
                    });
                }
            },

            getCommentLink(event) {
                const parentElement = event.target.parentElement;
                const commentId = parentElement.querySelector('.comment-id-copy');

                commentId.focus();
                commentId.select();

                document.execCommand('copy');

                setTimeout(() => {
                    commentId.blur();
                }, 50);
            }
        },
        mounted(){
            this.$root.$on('replyOpened', payload => {
                if(this.id !== payload.id){
                    this.replying = false;
                }
            })
        }
    }
</script>
<style>
</style>