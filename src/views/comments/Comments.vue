<template>
    <div id="commentsSection" class="flex flex-column grow">
        <div class="flex flex-row flex-wrap ph pt-3 align-v-center">
            <div class="flex flex-column xs-12 sm-9 mb-3">
                <h1 class="heading">{{ totalComments }} Comments</h1>
            </div>

            <div class="flex flex-column xs-12 sm-4 md-3 mb-3">
                <div class="form-group xs-12" style="width:100%;">
                    <select id="commentSort" v-model="sortInterface">
                        <option value="-like_count">Popular</option>
                        <option value="-created_on">Latest</option>
                        <option value="created_on">Oldest</option>
                        <option value="-mine">My Comments</option>
                    </select>
                    <label for="commentSort" :class="themeColor">Sort By</label>
                </div>
            </div>
        </div>

        <div class="flex flex-row comment-post ph mv-3">
            <div class="flex flex-column avatar-column pr hide-xs-only">
                <div class="user-avatar smaller" :class="avatarClassObject">
                    <img :src="currentUser.avatar" class="rounded">
                </div>

                <p v-if="userExpValue"
                   class="x-tiny dense font-bold uppercase text-center mt-1">{{ userExpRank }}</p>
                <p v-if="userExpValue && this.currentUser.access_level !== 'team'"
                   class="x-tiny dense text-center font-compressed">{{ userExpValue }} XP</p>
            </div>

            <div class="flex flex-column">

                <text-editor toolbar="bold italic underline | bullist numlist | link"
                             v-model="commentInterface"
                             :height="150"
                             ref="textEditor"></text-editor>

                <div class="flex flex-row align-h-right mv-1">
                    <button class="btn collapse-150" :disabled="loading"
                            @click="postComment"
                            dusk="submit-comment">
                        <span class="text-white short"
                              :class="'bg-' + themeColor">
                            Comment
                        </span>
                    </button>
                </div>

                <div class="loading-reply flex-center" v-show="loading">
                    <i class="fas fa-spinner fa-spin"
                       :class="'text-' + themeColor"></i>
                    <p class="x-tiny text-grey-3">loading...</p>
                </div>
            </div>
        </div>

        <comment-post v-if="pinnedComment != null"
                      v-bind="pinnedComment"
                      :brand="brand"
                      :currentUser="currentUser"
                      :pinned="true"
                      :themeColor="themeColor"
                      :profileBaseRoute="profileBaseRoute"
                      :hasPublicProfiles="hasPublicProfiles"
                      @likeComment="handleCommentLike"
                      @likeReply="handleReplyLike"
                      @deleteComment="handleCommentDelete"
                      @deleteReply="handleReplyDelete"
                      @openLikes="addLikeUsersToModal"></comment-post>

        <comment-post v-for="(comment, i) in comments"
                      :key="i"
                      v-bind="comment"
                      :brand="brand"
                      :currentUser="currentUser"
                      :themeColor="themeColor"
                      :profileBaseRoute="profileBaseRoute"
                      :hasPublicProfiles="hasPublicProfiles"
                      @likeComment="handleCommentLike"
                      @likeReply="handleReplyLike"
                      @deleteComment="handleCommentDelete"
                      @deleteReply="handleReplyDelete"
                      @openLikes="addLikeUsersToModal"></comment-post>

        <comment-likes-modal :themeColor="themeColor"
                             :commentId="currentLikeUsersId"
                             :likeUsers="likeUsers"
                             :totalLikeUsers="totalLikeUsers"
                             :loadingLikeUsers="loadingLikeUsers"
                             :requestingLikeUsers="requestingLikeUsers"
                             :brand="brand"
                             @loadMoreLikeUsers="addLikeUsersToModal"></comment-likes-modal>
    </div>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js';
    import TextEditor from '../../components/TextEditor.vue';
    import Requests from '../../assets/js/classes/requests';
    import CommentPost from './_CommentPost.vue';
    import CommentLikesModal from './_CommentLikesModal.vue';
    import Toasts from '../../assets/js/classes/toasts';
    import Utils from '../../assets/js/classes/utils';
    import xpMapper from '../../assets/js/classes/xp-mapper';
    import axios from 'axios';
    import * as QueryString from 'query-string';

    export default {
        mixins: [BrandClasses],
        name: 'comments',
        components: {
            'text-editor': TextEditor,
            'comment-post': CommentPost,
            'comment-likes-modal': CommentLikesModal,
            // 'wysiwyg-editor': WYSIWYGEditor,
        },
        props: {
            contentId: {
                type: String,
                default: () => ''
            },
            brand: {
                type: String,
                default: () => ''
            },
            userId: {
                type: String|Number,
                default: () => 0
            },
            userName: {
                type: String,
                default: () => ''
            },
            userAvatar: {
                type: String,
                default: () => ''
            },
            userXp: {
                type: String|Number,
                default: () => 0
            },
            userAccessLevel: {
                type: String,
                default: () => ''
            },
            userIsAdmin: {
                type: Boolean,
                default: () => false
            },
            themeColor: {
                type: String,
                default: () => 'recordeo'
            },
            profileBaseRoute: {
                type: String,
                default: () => '/laravel/public/members/profile/'
            },
            hasPublicProfiles: {
                type: Boolean,
                default: () => true
            },
        },
        data(){
            return {
                currentPage: 1,
                totalComments: 0,
                totalCommentsAndReplies: 0,
                comments: [],
                pinnedComment: null,
                requestingData: false,
                sortOption: '-like_count',
                comment: '',
                loading: false,
                currentLikeUsersId: 0,
                likeUsers: [],
                loadingLikeUsers: false,
                requestingLikeUsers: true,
                totalLikeUsers: 0,
                likeUsersPage: 1
            }
        },
        computed: {
            currentUser(){
                return {
                    display_name: this.userName,
                    id: this.userId,
                    avatar: this.userAvatar,
                    isAdmin: this.userIsAdmin,
                    access_level: this.userAccessLevel,
                    xp: this.userXp,
                }
            },

            avatarClassObject(){
                return {
                    'subscriber': ['edge', 'lifetime', 'team', 'guitar'].indexOf(this.currentUser.access_level) !== -1,
                    'edge': this.currentUser.access_level === 'edge',
                    'pack': this.currentUser.access_level === 'pack',
                    'team': this.currentUser.access_level === 'team',
                    'guitar': this.currentUser.access_level === 'guitar',
                    'lifetime': this.currentUser.access_level === 'lifetime'
                }
            },

            userExpValue(){
                return Utils.parseXpValue(this.currentUser.xp);
            },

            userExpRank (){
                if(this.currentUser.access_level === 'team'){
                    return this.brand + ' Team';
                }

                return xpMapper.getNearestValue(this.currentUser.xp);
            },

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
                    content_id: this.contentId,
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
                            this.totalComments = resolved['meta'] ? resolved['meta']['totalResults'] : resolved['total_results'];
                            // this.totalCommentsAndReplies = resolved['meta']['totalCommentsAndReplies'];

                            if(replace){
                                this.comments = resolved['data'] || resolved['results'];
                            }
                            else {
                                this.comments = this.comments.concat(
                                    (resolved['data'] || resolved['results'])
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

                if(!!this.comment.currentValue){
                    this.loading = true;

                    return Requests.postComment({
                        content_id: this.contentId,
                        comment: this.comment.currentValue
                    })
                        .then(resolved => {
                            if(resolved){
                                let thisComment = resolved['results'] || resolved['data'][0];

                                this.commentInterface = '';
                                this.$refs.textEditor.currentValue = '';

                                Toasts.push({
                                    icon: 'happy',
                                    title: 'Woohoo!',
                                    themeColor: this.themeColor,
                                    message: 'Your input is what makes ' + Utils.toTitleCase(this.brand) + ' so great, thanks for commenting.'
                                });

                                this.comments.splice(0, 0, thisComment);
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
                    likedPost.is_liked = false;

                    Requests.unlikeComment(payload.id)
                        .then(response => {});
                }
                else {
                    likedPost.like_count += 1;
                    likedPost.is_liked = true;

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
                    likedPostReply.is_liked = false;

                    Requests.unlikeComment(payload.id)
                        .then(response => {});
                }
                else {
                    likedPostReply.like_count += 1;
                    likedPostReply.is_liked = true;

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

                        Toasts.push({
                            icon: 'happy',
                            title: 'TRASHED!',
                            message: 'We have removed your comment. Please add a better one!'
                        });
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

                            Toasts.push({
                                icon: 'happy',
                                title: 'TRASHED!',
                                message: 'We have removed your reply. Please add a better one!'
                            });
                        }
                    })
            },

            goToComment(id){
                Requests.getCommentById(id)
                    .then(resolved => {
                        if(resolved){
                            this.pinnedComment = resolved['data'].filter(result =>
                                result.id === Number(id)
                            )[0];

                            /*
                            * Check intermittently for the DOM Element, it could possibly take a couple
                            * of seconds for Vue to render the pinned comment so we want to wait until it exists
                            * before we scroll to it and remove the old one.
                            *
                            * Curtis - Sept 2018
                             */
                            let pinned;
                            let checkInterval = setInterval(() => {
                                pinned = document.getElementById('pinnedComment' + id);

                                if(pinned != null){
                                    let oldComment = document.getElementById('comment' + id);

                                    window.scrollTo(0, (pinned.offsetTop - 100));

                                    if(oldComment){
                                        oldComment.remove();
                                    }

                                    clearInterval(checkInterval);
                                }
                            }, 100);
                        }
                    })
            },

            addLikeUsersToModal(payload){
                const isSameComment = payload.id === this.currentLikeUsersId;

                this.likeUsersPage += 1;
                this.requestingLikeUsers = true;
                this.totalLikeUsers = payload.totalLikeUsers;

                if(!isSameComment){
                    this.loadingLikeUsers = true;
                    this.likeUsersPage = 1;
                }

                Requests.getCommentLikeUsers({
                    id: payload.id,
                    page: this.likeUsersPage
                })
                    .then(response => {
                        if(response){
                            if(isSameComment){
                                this.likeUsers = [...this.likeUsers, ...response.data.data];
                            }
                            else {
                                this.likeUsers = response.data.data;
                            }

                            this.requestingLikeUsers = false;
                            this.currentLikeUsersId = payload.id;
                        }

                        this.loadingLikeUsers = false;
                    });
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