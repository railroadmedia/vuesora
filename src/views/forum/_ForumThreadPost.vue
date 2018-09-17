<template>
    <div class="flex flex-row ph pv-3 bb-grey-1-1" v-bind:id="'post' + id">
        <div class="flex flex-column avatar-column">
            <div class="square">
                <img class="rounded" :src="authorAvatar">
            </div>
        </div>
        <div class="flex flex-column ph">
            <div class="flex flex-row align-v-center mb-1">
                <div class="flex flex-column">
                    <h2 class="title">{{ authorUsername }}</h2>
                </div>

                <div class="flex flex-column align-h-right">
                    <div class="flex flex-row">
                        <p class="x-tiny text-dark font-bold font-italic uppercase mr-2">
                            {{ createdOn }}
                        </p>
                        <p class="x-tiny text-dark font-bold font-italic uppercase">
                            #{{ postNumber }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mv-2">
                <div v-if="!editing" class="flex flex-column post-body" v-html="postBody">
                    {{ postBody }}
                </div>

                <div v-if="editing" class="flex flex-column mb-1">
                    <form :action="'/post/update/' + this.id" method="post">
                        <input type="hidden" name="_method" value="patch">
                        <text-editor :initialValue="postBody"></text-editor>

                        <div class="flex flex-row align-h-right mt-2">
                            <a class="btn bg-black text-black no-decoration flat collapse-150 no-border mr-1"
                               @click="editing = false">
                                Cancel
                            </a>

                            <button class="btn collapse-250" type="submit">
                                <span class="bg-recordeo text-white corners-3">
                                    Save Post
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p class="tiny text-dark mr-3 font-bold uppercase dense pointer reply-like noselect"
                           @click="replyToPost"
                           v-if="!isLocked">
                            <i class="fas fa-reply"></i> Reply
                        </p>

                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="isLiked ? 'text-recordeo' : 'text-dark'"
                           @click="likePost">
                            <i class="fas fa-thumbs-up"></i>
                            {{ isLiked ? 'Liked' : 'Like' }}
                        </p>

                        <p class="x-tiny text-dark uppercase font-italic"
                           v-html="userLikeString">
                            {{ userLikeString }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center align-h-right">
                        <p v-if="currentUser.isAdmin" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                            @click="reportPost">
                            Report
                        </p>

                        <!--<p v-if="currentUser.isAdmin" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"-->
                           <!--@click="hidePost">-->
                            <!--Hide-->
                        <!--</p>-->

                        <p v-if="index !== 0 && canEdit" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="deletePost">
                            Delete
                        </p>

                        <p v-if="canEdit" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="editing = !editing">
                            Edit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TextEditor from '../../components/TextEditor.vue';
    import BrandClasses from '../../mixins/BrandClasses.js';
    import Toasts from '../../assets/js/classes/toasts';
    import Noty from 'noty';
    import Requests from '../../assets/js/classes/requests';

    export default {
        mixins: [BrandClasses],
        name: 'forum-thread-post',
        components: {
            "text-editor": TextEditor
        },
        props: {
            authorAvatar: {
                type: String,
                default: () => ''
            },
            authorUsername: {
                type: String,
                default: () => ''
            },
            authorId: {
                type: Number,
                default: () => 0
            },
            createdOn: {
                type: String,
                default: () => ''
            },
            id: {
                type: Number,
                default: () => 0
            },
            isLiked: {
                type: Boolean,
                default: () => false
            },
            postBody: {
                type: String,
                default: () => ''
            },
            totalLikes: {
                type: Number,
                default: () => 0
            },
            userLikes: {
                type: Array,
                default: () => ''
            },
            index: {
                type: Number,
                default: () => 0
            },
            currentPage: {
                type: Number,
                default: () => 1
            },
            isLocked: {
                type: Boolean,
                default: () => false
            },
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        name: '',
                        avatar: '',
                        id: 0,
                        isAdmin: false
                    }
                }
            }
        },
        data(){
            return {
                editing: false
            }
        },
        computed: {
            canEdit(){
                return this.currentUser.id === this.authorId || this.currentUser.isAdmin;
            },

            userLikeString(){
                let userNames = [];
                let userNameString;
                let suffixString = ' like this';

                for(let i = 0; i < this.userLikes.length; i++){
                    let nameExistsOrIsntCurrentUser = this.userLikes[i]['name'] != null
                        && this.userLikes[i]['name'] !== this.currentUser.name;

                    if(nameExistsOrIsntCurrentUser){
                        userNames.push(this.userLikes[i]['name']);
                    }
                }

                if(userNames.length){
                    userNameString = userNames.join(', ');
                }

                if(this.totalLikes > 3){
                    suffixString = ' & ' + String(this.totalLikes - 3) + ' others like this';
                }
                else if(this.totalLikes === 0) {
                    suffixString = '';
                }

                if(this.isLiked){
                    userNames.splice((userNames.length - 1), 1);

                    return '<span class="font-bold">You' + (userNameString ? ', ' + userNameString : ' ')  + '</span>' + suffixString;
                }
                else {
                    if(this.totalLikes > 0){
                        return '<span class="font-bold">' + userNameString + '</span>' + suffixString;
                    }
                }

                return 'Be the first to like this!';
            },

            postNumber(){
                return ((this.currentPage - 1) * 15) + (this.index + 1)
            }
        },
        methods: {
            replyToPost(){
                this.$emit('replyToPost', {
                    id: this.id,
                    userName: this.authorUsername,
                    createdOn: this.createdOn,
                    postBody: this.postBody
                })
            },

            likePost(){
                this.$emit('likePost', {
                    id: this.id,
                    isLiked: this.isLiked
                })
            },

            reportPost(){
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Click report to send a notification to a moderator',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        Noty.button('<span class="bg-error text-white short">Report</span>', 'btn mr-1', () => {

                            Requests
                                .reportForumPost(this.id)
                                .then(resolved => resolved);

                            Toasts.success('A notification has been sent to the moderation team to review this post, thank you for your feedback!');

                            notification.close();
                        }),
                        Noty.button('<span class="bg-dark inverted text-dark short">Cancel</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            },

            hidePost(){
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Are you sure you want to hide this post?',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        Noty.button('<span class="bg-warning text-white short">Hide</span>', 'btn mr-1', () => {

                            this.$emit('hidePost', {
                                id: this.id
                            });

                            Toasts.success('Post ' + this.id + ' has been hidden.');

                            notification.close();
                        }),
                        Noty.button('<span class="bg-dark inverted text-dark short">Cancel</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            },

            deletePost(){
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Are you sure you want to delete this post?',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        Noty.button('<span class="bg-error text-white short">Delete</span>', 'btn mr-1', () => {

                            this.$emit('deletePost', {
                                id: this.id
                            });

                            notification.close();
                        }),
                        Noty.button('<span class="bg-dark inverted text-dark short">Cancel</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            },

            editPost(){
                this.$emit('editPost', {
                    id: this.id
                })
            }
        }
    }
</script>
<style>

</style>