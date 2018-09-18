<template>
    <div class="flex flex-row comment-post pl pv mv-1">
        <div class="flex flex-column avatar-column pr">
            <a :href="profileRoute" target="_blank"
               class="no-decoration">
                <img :src="user['fields.profile_picture_image_url']" class="rounded">
            </a>
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row align-v-center mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold">
                        <a :href="profileRoute" target="_blank"
                           class="text-black no-decoration">
                            {{ user.display_name }}
                        </a>

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

                        <p v-if="!isUsersPost"
                           class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="isLiked ? 'text-' + themeColor : 'text-grey-3'"
                           @click="likeComment">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ isLiked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <p class="x-tiny text-grey-3 uppercase font-italic"
                           v-html="userLikeString">
                            {{ userLikeString }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Noty from 'noty';
    import moment from 'moment';

    export default {
        name: 'comment-reply',
        props: {
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
                        display_name: ''
                    }
                }
            }
        },
        data(){
            return {
                isLiked: this.is_liked
            }
        },
        computed: {
            profileRoute(){
                return '/laravel/public/members/profile/' + this.user_id
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
            likeComment(){
                this.isLiked = !this.isLiked;

                this.$emit('likeReply', {
                    id: this.id,
                    isLiked: this.is_liked,
                    isPinned: this.pinned
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
                            this.$emit('deleteReply', {
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
        }
    }
</script>
<style>

</style>