<template>
    <div class="flex flex-row comment-post pa mv-1">
        <div class="flex flex-column avatar-column pr">
            <img :src="user['fields.profile_picture_image_url']" class="rounded">
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row align-v-center mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold">
                        {{ display_name }}

                        <span class="x-tiny text-dark font-bold font-italic uppercase ml-1">
                            {{ dateString }}
                        </span>
                    </h2>
                </div>
            </div>

            <div class="flex flex-row body mb-1">
                <div class="flex flex-column post-body grow"
                     v-html="comment">
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
        </div>
    </div>
</template>
<script>
    import Toasts from '../../assets/js/classes/toasts';
    import moment from 'moment';

    export default {
        name: 'comment-reply',
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
        computed: {
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

                if(this.like_count > 0){
                    return '<span class="font-bold">' + userLikesString + '</span>' + additionalUserLikes;
                }
            },

            commentUrl(){
                return window.location + '?goToComment=' + this.id;
            },

            dateString(){
                return moment(this.created_on).fromNow();
            }
        },
        methods: {
            likeComment(){
                this.$emit('likeReply', {
                    id: this.id,
                    isLiked: this.isLiked
                });
            }
        }
    }
</script>
<style>

</style>