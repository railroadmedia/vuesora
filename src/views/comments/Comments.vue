<template>
    <div id="commentsSection" class="flex flex-column">
        <div class="flex flex-row pv-3 align-v-center">
            <div class="flex flex-column xs-12 sm-9">
                <h1 class="heading">7 Comments</h1>
            </div>

            <div class="flex flex-column align-h-right xs-12 sm-3">
                <div class="form-group xs-12" style="width:100%;">
                    <select id="commentSort">
                        <option>Popular</option>
                        <option>Latest First</option>
                        <option>Oldest First</option>
                        <option>My Comments</option>
                    </select>
                    <label for="commentSort" :class="brand">Sort By</label>
                </div>
            </div>
        </div>

        <div class="flex flex-row comment-post mv-3">
            <div class="flex flex-column avatar-column pr hide-xs-only">
                <img src="https://placehold.it/250x250" class="rounded">
            </div>
            <div class="flex flex-column">
                <text-editor toolbar="bold italic underline | bullist numlist"></text-editor>
            </div>
        </div>

        <comment-post v-for="(comment, i) in comments"
                      :key="i"
                      v-bind="comment"
                      :currentUser="currentUser"
                      @likeComment="handleCommentLike"></comment-post>
    </div>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js';
    import TextEditor from '../../components/TextEditor.vue';
    import CommentPost from './_CommentPost.vue';
    import Toasts from '../../assets/js/classes/toasts';
    import axios from 'axios';

    export default {
        mixins: [BrandClasses],
        name: 'comments',
        components: {
            'text-editor': TextEditor,
            'comment-post': CommentPost
        },
        props: {
            content_id: {
                type: String,
                default: () => ''
            },
            user_id: {
                type: Number,
                default: () => 0
            },
            brand: {
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
            }
        },
        data(){
            return {
                currentPage: 1,
                totalPages: 0,
                totalComments: 0,
                comments: []
            }
        },
        methods: {
            getComments(params){
                return axios.get('/railcontent/comment', {
                    params: params
                })
                    .then(response => {
                        return response.data
                    })
                    .catch(error => {
                        console.error(error);
                        Toasts.errorWarning();
                    })
            },


            handleCommentLike(payload){
                let index = this.comments.map(comment => comment.id).indexOf(payload.id);
                let likedPost = this.comments[index];

                if(payload.isLiked){
                    likedPost.like_users = likedPost.like_users.filter(user =>
                        user['display_name'] !== this.currentUser.display_name
                    )
                }
                else {
                    likedPost.like_users.push({
                        display_name: this.currentUser.display_name,
                        id: this.currentUser.id
                    });
                }
            }
        },
        created(){
            this.getComments({
                page: this.currentPage,
                limit: 25,
                content_id: this.content_id,
                sort: '-created_on'
            })
                .then(resolved => {

                    if(resolved){
                        this.comments = this.comments.concat(
                            resolved.results
                        )
                    }
                })
        }
    }
</script>
<style>

</style>