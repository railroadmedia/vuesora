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

            <p class="x-tiny dense font-bold uppercase text-center mt-1">{{ userExpRank }}</p>
            <p class="x-tiny dense text-center font-compressed">1234 XP</p>
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
                           :class="replying ? 'text-' + themeColor : 'text-grey-3'"
                           @click="replyToComment">
                            <i class="fas fa-reply"></i>
                            <span class="hide-xs-only">
                                {{ replying ? 'Replying' : 'Reply' }}
                            </span>
                        </p>

                        <p v-if="!isUsersPost"
                           class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                           :class="is_liked ? 'text-' + themeColor : 'text-grey-3'"
                           @click="likeComment">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ is_liked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <span class="grow"></span>

                        <p class="x-tiny font-bold text-grey-3 uppercase nowrap pointer noselect"
                           data-open-modal="likeUsersModal"
                           @click="openLikes">
                            <i class="fas fa-thumbs-up text-white likes-icon"
                               :class="'bg-' + themeColor"></i> {{ like_count }}
                        </p>
                    </div>
                </div>
            </div>

            <transition name="slide-fade">
                <div class="flex flex-row comment-post mv-2" v-if="replying">
                    <div class="flex flex-column avatar-column pr hide-xs-only">
                        <img :src="currentUser.avatar" class="rounded">
                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row">
                            <text-editor toolbar="bold italic underline | bullist numlist"
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
                               @click="postReply">
                                <span class="text-white short"
                                      :class="'bg-' + themeColor">
                                    Reply
                                </span>
                            </button>
                        </div>

                        <div class="loading-reply flex-center" v-show="loading">
                            <i class="fas fa-spinner fa-spin" :class="'text-' + themeColor"></i>
                            <p class="x-tiny text-grey-3">loading...</p>
                        </div>
                    </div>
                </div>
            </transition>

            <transition-group name="slide-fade" tag="div">
                <comment-reply v-for="(reply, i) in replies"
                               v-if="i < 2 || showAllReplies"
                               :key="i"
                               v-bind="reply"
                               :currentUser="currentUser"
                               :themeColor="themeColor"
                               :profileBaseRoute="profileBaseRoute"
                               :hasPublicProfiles="hasPublicProfiles"
                               @likeReply="likeReply"
                               @deleteReply="deleteReply"
                               @openLikes="openLikes"></comment-reply>
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
    import Noty from 'noty';
    import Requests from '../../assets/js/classes/requests';
    import TextEditor from '../../components/TextEditor.vue';
    import CommentReply from './_CommentReply.vue';
    import xpMapper from '../../assets/js/classes/xp-mapper';
    import moment from 'moment';

    export default {
        name: 'comment-post',
        components: {
            'text-editor': TextEditor,
            'comment-reply': CommentReply
        },
        props: {
            brand: {
                type: String,
                default: () => 'drumeo'
            },
            themeColor: {
                type: String,
                default: () => 'recordeo'
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
                        xp: 1234,
                        access_level: 'edge'
                    }
                }
            },
            hasPublicProfiles: {
                type: Boolean,
                default: () => true
            },
        },
        data(){
            return {
                replying: false,
                showAllReplies: false,
                reply: '',
                loading: false
            }
        },
        computed: {
            avatarClassObject(){
                return {
                    'subscriber': ['edge', 'lifetime', 'team'].indexOf(this.user.access_level) !== -1,
                    'edge': this.user.access_level === 'edge',
                    'pack': this.user.access_level === 'pack',
                    'team': this.user.access_level === 'team',
                    'lifetime': this.user.access_level === 'lifetime'
                }
            },

            userExpRank: () => xpMapper.getNearestValue(100234),

            replyInterface: {
                get(){
                    return this.reply;
                },
                set(val) {
                    this.reply = val;
                }
            },

            domID(){
                if(this.pinned){
                    return 'pinnedComment' + this.id
                }

                return 'comment' + this.id
            },

            profileRoute(){
                return this.profileBaseRoute + this.user_id
            },

            isLiked(){
                return this.like_users.filter(user =>
                    user.display_name === this.currentUser.display_name
                ).length > 0;
            },

            userLikeString(){
                let userNames = [];
                let userNameString;
                let suffixString = ' like this';

                for(let i = 0; i < this.like_users.length; i++){
                    let nameExistsOrIsntCurrentUser = this.like_users[i]['display_name'] != null
                        && this.like_users[i]['display_name'] !== this.currentUser.display_name;

                    if(nameExistsOrIsntCurrentUser){
                        userNames.push(this.like_users[i]['display_name']);
                    }
                }

                if(userNames.length){
                    userNameString = userNames.join(', ');
                }

                if(this.like_count > 3){
                    suffixString = ' & ' + String(this.like_count - 3) + ' others like this';
                }
                else if(this.like_count === 0) {
                    suffixString = '';
                }

                if(this.is_liked){
                    userNames.splice((userNames.length - 1), 1);

                    if(this.like_count > 1){
                        return '<span class="font-bold">You, ' + userNameString + '</span>' + suffixString;
                    }

                    return '<span class="font-bold">You</span>' + suffixString;
                }
                else {
                    if(this.like_count > 0){
                        return '<span class="font-bold">' + userNameString + '</span>' + suffixString;
                    }
                }

                return 'Be the first to like this!';
            },

            commentUrl(){
                return window.location + '?goToComment=' + this.id;
            },

            dateString(){
                return moment.utc(this.created_on).local().fromNow();
            },

            isUsersPost(){
                return String(this.currentUser.id) === String(this.user_id);
            },

            isCurrentUserAdmin(){
                return this.currentUser.isAdmin === true;
            },
        },
        methods: {
            replyToComment(){
                this.replying = !this.replying;
            },

            postReply(){
                if(this.reply.currentValue){
                    this.loading = true;

                    return Requests.postReply({
                        parent_id: this.id,
                        comment: this.reply.currentValue
                    })
                        .then(resolved => {
                            if(resolved){
                                let thisComment = resolved['results'] || resolved['data'][0];

                                this.replyInterface = '';
                                this.replying = false;
                                this.$refs.textEditor.currentValue = '';
                                Toasts.success('Reply successfully posted!');

                                this.replies.splice(0, 0, thisComment);
                            }

                            this.loading = false;
                        });
                }
            },

            cancelReply(){
                this.replying = false;
                this.reply = '';
            },

            likeComment(){
                this.$emit('likeComment', {
                    id: this.id,
                    isLiked: this.is_liked,
                    pinned: this.pinned,
                });
            },

            deleteComment(){
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Are you sure you want to delete this comment?',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        Noty.button('<span class="bg-error text-white short">Delete</span>', 'btn mr-1', () => {
                            this.$emit('deleteComment', {
                                id: this.id
                            });

                            notification.close();
                        }),
                        Noty.button('<span class="bg-dark inverted text-grey-3 short">Cancel</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            },

            likeReply(payload){
                this.$emit('likeReply', {
                    parent_id: this.id,
                    id: payload.id,
                    isLiked: payload.isLiked
                });
            },

            deleteReply(payload){
                this.$emit('deleteReply', {
                    parent_id: this.id,
                    id: payload.id
                })
            },

            openLikes(payload){
                this.$emit('openLikes', {
                    likeUsers: payload.busToRoot ? payload.likeUsers : this.like_users
                });
            },

            getCommentLink(event) {
                const parentElement = event.target.parentElement;
                const commentId = parentElement.querySelector('.comment-id-copy');

                commentId.focus();
                commentId.select();

                console.log(commentId.contentEditable);

                document.execCommand('copy');

                setTimeout(() => {
                    commentId.blur();
                }, 50);

                Toasts.success('Comment Url Copied to Clipboard!')
            }
        }
    }
</script>
<style>
</style>