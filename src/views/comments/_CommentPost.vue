<template>
    <div class="flex flex-row comment-post mb-2">
        <div class="flex flex-column avatar-column pr">
            <img src="https://placehold.it/250x250" class="rounded">
        </div>
        <div class="flex flex-column">
            <div class="flex flex-row align-v-center mb-1">
                <div class="flex flex-column">
                    <h2 class="body font-bold">{{ display_name }}</h2>
                </div>

                <div class="flex flex-column align-h-right">
                    <div class="flex flex-row">
                        <p class="x-tiny text-dark font-bold font-italic uppercase mr-2">
                            {{ created_on }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mb-1">
                <div class="flex flex-column post-body">
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
                        <p class="tiny text-dark mr-3 font-bold uppercase dense pointer reply-like noselect"
                           @click="replyToComment">
                            <i class="fas fa-reply"></i> Reply
                        </p>

                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="isLiked ? 'text-recordeo' : 'text-dark'"
                           @click="likeComment">
                            <i class="fas fa-thumbs-up"></i>
                            {{ isLiked ? 'Liked' : 'Like' }}
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
    export default {
        name: 'comment-post',
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

                return '<span class="font-bold">' + userLikesString + '</span>' + additionalUserLikes;
            }
        },
        methods: {
            likeComment(){
                this.$emit('likeComment', {
                    id: this.id,
                    isLiked: this.isLiked
                });
            },

            replyToComment(){
                console.log('replying');
            }
        }
    }
</script>
<style>

</style>