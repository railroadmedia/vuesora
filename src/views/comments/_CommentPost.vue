<template>
    <div :id="domID"
         class="flex flex-row comment-post pa mb-1"
         :class="{'pinned': pinned}">
        <div class="flex flex-column avatar-column pr">
            <img src="https://placehold.it/250x250" class="rounded">
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold">
                        {{ display_name }}

                        <span class="x-tiny text-dark font-bold font-italic uppercase ml-1">
                            {{ dateString }}
                        </span>
                    </h2>
                </div>

                <div class="flex flex-column align-h-right align-v-center flex-auto">
                    <span class="tiny no-decoration text-dark pointer">
                        <i class="fas fa-link"
                           @click="getCommentLink"></i>
                        <textarea class="comment-id-copy">{{ commentUrl }}</textarea>
                    </span>
                </div>
            </div>

            <div class="flex flex-row body mb-1">
                <div class="flex flex-column post-body grow">
                    {{ comment }}
                </div>

                <!--<div v-if="editing" class="flex flex-column mb-1">-->
                <!--<text-editor :initialValue="postBody"></text-editor>-->

                <!--<div class="flex flex-row align-h-right mt-2">-->
                <!--<a class="btn bg-black text-black no-decoration flat collapse-150 no-border mr-1"-->
                <!--@click="editing = false">-->
                <!--Cancel-->
                <!--</a>-->

                <!--<button class="btn collapse-250" type="submit">-->
                <!--<span class="bg-recordeo text-white corners-3">-->
                <!--Save Post-->
                <!--</span>-->
                <!--</button>-->
                <!--</div>-->
                <!--</div>-->
            </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="replying ? 'text-recordeo' : 'text-dark'"
                           @click="replyToComment">
                            <i class="fas fa-reply"></i>
                            <span class="hide-xs-only">
                                {{ replying ? 'Replying' : 'Reply' }}
                            </span>
                        </p>

                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="isLiked ? 'text-recordeo' : 'text-dark'"
                           @click="likeComment">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ isLiked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <p class="x-tiny text-dark uppercase font-italic"
                           v-html="userLikeString">
                            {{ userLikeString }}
                        </p>
                    </div>
                </div>
            </div>

            <transition name="slide-fade">
                <div class="flex flex-row comment-post mv-2" v-if="replying">
                    <div class="flex flex-column avatar-column pr hide-xs-only">
                        <img src="https://placehold.it/250x250" class="rounded">
                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row">
                            <text-editor toolbar="bold italic underline | bullist numlist"
                                         :height="150"
                                         v-model="replyInterface"></text-editor>
                        </div>
                        <div class="flex flex-row align-h-right mv-1">
                            <a class="btn flat text-black collapse-150 short mr-1"
                               @click="cancelReply">
                                Cancel
                            </a>
                            <a class="btn text-white bg-recordeo collapse-150 short"
                               @click="postReply">
                                Reply
                            </a>
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
                               @likeReply="likeReply"></comment-reply>
            </transition-group>

            <div class="flex flex-row align-center" v-if="replies.length > 2">
                <a class="btn btn-tiny flat text-dark collapse-150"
                   @click="showAllReplies = !showAllReplies">
                    {{ showAllReplies ? 'Hide Replies' : 'Show All Replies' }}
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import Toasts from '../../assets/js/classes/toasts';
    import Requests from '../../assets/js/classes/requests';
    import TextEditor from '../../components/TextEditor.vue';
    import CommentReply from './_CommentReply.vue';
    import moment from 'moment';

    export default {
        name: 'comment-post',
        components: {
            'text-editor': TextEditor,
            'comment-reply': CommentReply
        },
        props: {
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        display_name: '',
                        id: 0,
                        isAdmin: false
                    }
                }
            },
            id: {
                type: Number,
                default: () => 0
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
            }
        },
        data(){
            return {
                replying: false,
                showAllReplies: false,
                reply: ''
            }
        },
        computed: {
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

            isLiked(){
                return this.like_users.filter(user =>
                    user.display_name === this.currentUser.display_name
                ).length > 0;
            },

            userLikeString(){
                let userLikes = this.like_users.map(user =>
                    user['display_name']
                );
                let userLikesString = userLikes.join(', ');
                let additionalUserLikes = ' like this';

                if(this.like_count > 3){
                    additionalUserLikes = ' & ' + String(this.like_count - 3) + ' others like this';
                }

                if(this.isLiked && this.like_count > 3){
                    if(this.like_count > 3){
                        userLikesString =  'You, ' + userLikes[0] + ', ' + userLikes[1];
                    }
                    else {
                        userLikesString = 'You, ' + userLikes.join(', ');
                    }
                }

                return '<span class="font-bold">' + userLikesString + '</span>' + additionalUserLikes;
            },

            commentUrl(){
                return window.location + '?goToComment=' + this.id;
            },

            dateString(){
                return moment(this.created_on).fromNow();
            }
        },
        methods: {
            replyToComment(){
                this.replying = !this.replying;
            },

            postReply(){
                return Requests.postReply({
                    parent_id: this.id,
                    comment: this.reply.currentValue
                })
                    .then(resolved => {
                        if(resolved){
                            this.reply = '';
                        }
                    })
            },

            cancelReply(){
                this.replying = false;
                this.reply = '';
            },

            likeComment(){
                this.$emit('likeComment', {
                    id: this.id,
                    isLiked: this.isLiked
                });
            },

            likeReply(payload){
                this.$emit('likeReply', {
                    parent_id: this.id,
                    id: payload.id,
                    isLiked: payload.isLiked
                });
            },

            getCommentLink(event) {
                const parentElement = event.target.parentElement;
                const textArea = parentElement.querySelector('textarea');

                textArea.select();
                document.execCommand('copy');

                Toasts.success('Comment Url Copied to Clipboard!')
            }
        }
    }
</script>
<style>

</style>