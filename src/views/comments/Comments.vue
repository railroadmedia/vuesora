<template>
    <div id="commentsSection" class="flex flex-column grow">
        <div class="flex flex-row flex-wrap ph pt-3 align-v-center">
            <div class="flex flex-column xs-12 sm-9 mb-3">
                <h1 class="heading">{{ totalComments }} Comments</h1>
            </div>
            <div class="flex flex-column xs-12 sm-4 md-3 mb-3">
                <div class="form-group xs-12" style="width:100%;">
                    <select id="commentSort" v-model="sortInterface">
                        <option value="-created_on">Latest First</option>
                        <option value="created_on">Oldest First</option>
                        <option value="-like_count">Popular</option>
                        <option value="mine">My Comments</option>
                    </select>
                    <label for="commentSort" :class="brand">Sort By</label>
                </div>
            </div>
        </div>

        <div class="flex flex-row comment-post ph mv-3">
            <div class="flex flex-column avatar-column pr hide-xs-only">
                <img :src="currentUser.avatar" class="rounded">
            </div>

            <div class="flex flex-column">

                <text-editor toolbar="bold italic underline | bullist numlist"
                             v-model="commentInterface"
                             :height="150"
                             ref="textEditor"></text-editor>

                <div class="flex flex-row align-h-right mv-1">
                    <button class="btn collapse-150" :disabled="loading"
                            @click="postComment">
                        <span class="text-white bg-recordeo short">
                            Comment
                        </span>
                    </button>
                </div>

                <div class="loading-reply flex-center" v-show="loading">
                    <i class="fas fa-spinner fa-spin text-recordeo"></i>
                    <p class="x-tiny text-dark">loading...</p>
                </div>
            </div>
        </div>

        <comment-post v-if="pinnedComment != null"
                      v-bind="pinnedComment"
                      :currentUser="currentUser"
                      :pinned="true"
                      @likeComment="handleCommentLike"
                      @likeReply="handleReplyLike"
                      @deleteComment="handleCommentDelete"
                      @deleteReply="handleReplyDelete"></comment-post>

        <comment-post v-for="(comment, i) in comments"
                      :key="i"
                      v-bind="comment"
                      :currentUser="currentUser"
                      @likeComment="handleCommentLike"
                      @likeReply="handleReplyLike"
                      @deleteComment="handleCommentDelete"
                      @deleteReply="handleReplyDelete"></comment-post>
    </div>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js';
    import TextEditor from '../../components/TextEditor.vue';
    import Requests from '../../assets/js/classes/requests';
    import CommentPost from './_CommentPost.vue';
    import Toasts from '../../assets/js/classes/toasts';
    import axios from 'axios';
    import * as QueryString from 'query-string';

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
                totalComments: 0,
                comments: [],
                pinnedComment: null,
                requestingData: false,
                sortOption: '-created_on',
                comment: '',
                loading: false
            }
        },
        computed: {
            sortInterface: {
                get(){
                    return this.sortOption;
                },
                set(val){
                    this.sortOption = val;

                    this.getComments(this.requestParams, true);
                }
            },

            commentInterface: {
                get(){
                    return this.comment;
                },
                set(val){
                    this.comment = val;
                }
            },

            totalPages(){
                return Math.ceil(this.totalComments / 25);
            },

            requestParams(){
                return {
                    page: this.currentPage,
                    limit: 25,
                    content_id: this.content_id,
                    sort: this.sortOption
                }
            }
        },
        methods: {
            getComments(params, replace = false){
                this.requestingData = true;

                Requests.getComments(params)
                    .then(resolved => {
                        this.requestingData = false;

                        if(resolved){
                            this.totalComments = resolved['total_results'];

                            if(replace){
                                this.comments = resolved['results'];
                            }
                            else {
                                this.comments = this.comments.concat(
                                    resolved['results']
                                );
                            }
                        }
                    });
            },

            getCommentById(id){
                return axios.get('/railcontent/comment/' + id)
                    .then(response => {
                        return response.data;
                    })
                    .catch(Requests.handleError);
            },

            postComment(){
                console.log(this.comment.currentValue);

                if(!!this.comment.currentValue){
                    this.loading = true;

                    return Requests.postComment({
                        content_id: this.content_id,
                        comment: this.comment.currentValue
                    })
                        .then(resolved => {
                            if(resolved){
                                this.commentInterface = '';
                                this.$refs.textEditor.currentValue = '';
                                Toasts.success('Comment successfully posted!');

                                this.comments.splice(0, 0, resolved['results']);
                            }

                            this.loading = false;
                        });
                }
            },

            handleInput(payload) {
                this.commentInterface = payload.currentValue;
            },

            handleCommentLike(payload){
                let index = this.comments.map(comment => comment.id).indexOf(payload.id);
                let likedPost = payload.isPinned ? this.pinnedComment : this.comments[index];

                if(payload.isLiked){
                    likedPost.like_count -= 1;

                    Requests.unlikeComment(payload.id)
                        .then(response => {});
                }
                else {
                    likedPost.like_count += 1;

                    Requests.likeComment(payload.id)
                        .then(response => {});
                }
            },

            handleReplyLike(payload){
                let index = this.comments.map(comment => comment.id).indexOf(payload.parent_id);
                let likedPostReplies = payload.isPinned ? this.pinnedComment.replies : this.comments[index].replies;
                let likedPostReplyIndex = likedPostReplies.map(reply => reply.id).indexOf(payload.id);
                let likedPostReply = likedPostReplies[likedPostReplyIndex];


                if(payload.isLiked){
                    likedPostReply.like_count -= 1;

                    Requests.unlikeComment(payload.id)
                        .then(response => {});
                }
                else {
                    likedPostReply.like_count += 1;

                    Requests.likeComment(payload.id)
                        .then(response => {});
                }
            },

            handleCommentDelete(payload){

                Requests.deleteComment(payload.id)
                    .then(resolved => {
                        this.comments = this.comments.filter(comment =>
                            comment.id !== payload.id
                        );

                        Toasts.success('Comment successfully deleted');
                    })
            },

            handleReplyDelete(payload){
                let index = this.comments.map(comment => comment.id).indexOf(payload.parent_id);
                let deletedPostReplies = this.comments[index].replies;
                let deletedPostReplyIndex = deletedPostReplies.map(reply => reply.id).indexOf(payload.id);
                let deletedPostReply = deletedPostReplies[deletedPostReplyIndex];

                Requests.deleteComment(payload.id)
                    .then(resolved => {
                        if(resolved){
                            this.comments[index].replies = this.comments[index].replies.filter(reply =>
                                reply.id !== payload.id
                            );

                            Toasts.success('Comment successfully deleted');
                        }
                    })
            },

            goToComment(id){
                this.getCommentById(id)
                    .then(resolved => {
                        if(resolved){
                            this.pinnedComment = resolved['results'].filter(result =>
                                result.id === Number(id)
                            )[0];

                            setTimeout(() => {
                                let pinned = document.getElementById('pinnedComment' + id);
                                let oldComment = document.getElementById('comment' + id);

                                window.scrollTo(0, (pinned.offsetTop - 100));

                                if(oldComment){
                                    oldComment.remove();
                                }
                            }, 1000);
                        }
                    })
            }
        },
        created(){
            this.getComments(this.requestParams);
        },
        mounted(){
            // Check the URI Params if 'goToComment' exists
            const uriParams = QueryString.parse(location.search);
            // Run the goToComment method if it does
            if(Object.keys(uriParams).indexOf('goToComment') !== -1){
                this.goToComment(uriParams['goToComment']);
            }

            window.addEventListener('scroll', () => {
                let scrollPosition = window.pageYOffset + window.innerHeight;
                let bodyHeight = document.body.scrollHeight;

                if((scrollPosition > bodyHeight - 200) && (this.comments.length !== this.totalComments)){
                    if(!this.requestingData){
                        this.currentPage += 1;

                        this.getComments(this.requestParams);
                    }
                }
            });
        }
    }
</script>
<style>

</style>