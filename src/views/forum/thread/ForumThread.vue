<template>
    <div class="container mv-3 forum-post">
        <div class="flex flex-column bg-white shadow corners-3">
            <div class="flex flex-row pa-3 flex-wrap align-v-center">
                <div class="flex flex-column mb-1 xs-12 sm-6">
                    <h1 class="heading thread-title">
                        <a href="/members/forums" class="no-decoration mr-1 back-arrow">
                            <i class="fas fa-arrow-circle-left text-grey-2"></i>
                        </a>

                        {{ thread.title }}
                    </h1>
                </div>

                <div class="flex flex-column mb-1 xs-12 sm-6">
                    <div class="flex flex-row align-h-right">
                        <button class="btn collapse-square short mr-1" @click="update"
                                v-if="currentUser.isAdmin">
                            <span class="inverted"
                                  :class="[themeTextClass, themeBgClass]">
                                <i class="fas fa-edit"></i>
                            </span>
                        </button>

                        <button class="btn collapse-square short mr-1" @click="pinPost"
                                v-if="currentUser.isAdmin">
                            <span :class="[themeBgClass, isPinned ? 'text-white' : 'inverted ' + themeTextClass]">
                                <i class="fas fa-thumbtack"></i>
                            </span>
                        </button>

                        <button class="btn collapse-square short mr-1" @click="lockPost"
                                v-if="currentUser.isAdmin">
                            <span :class="[themeBgClass, isLocked ? 'text-white' : 'inverted ' + themeTextClass]">
                                <i class="fas fa-lock"></i>
                            </span>
                        </button>

                        <button class="btn collapse-150 short mr-1" @click="followPost">
                            <span :class="[themeBgClass, isFollowed ? 'text-white' : 'inverted ' + themeTextClass]">
                                {{ isFollowed ? 'Followed' : 'Follow' }}
                            </span>
                        </button>

                        <button class="btn collapse-150 short" @click="scrollToReply">
                            <span class="inverted"
                                  :class="[themeTextClass, themeBgClass]">
                                  Add Reply
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-row pagination-row align-h-right bg-grey-7 bv-grey-1-1" v-if="totalPages > 1">
                <pagination :currentPage="currentPage"
                            :totalPages="totalPages"
                            @pageChange="handlePageChange"></pagination>
            </div>

            <forum-thread-post v-for="(post, i) in posts"
                               :key="post.id"
                               :index="i"
                               :post="post"
                               :brand="brand"
                               :currentPage="currentPage"
                               :currentUser="currentUser"
                               :isLocked="thread.isLocked"
                               :themeColor="themeColor"
                               @likePost="handlePostLike"
                               @openLikes="addLikeUsersToModal"
                               @deletePost="handlePostDelete"
                               @replyToPost="handleReplyToPost"></forum-thread-post>

            <div class="flex flex-row pagination-row align-h-right bg-grey-7 bb-grey-1-1" v-if="totalPages > 1">
                <pagination :currentPage="currentPage"
                            :totalPages="totalPages"
                            @pageChange="handlePageChange"></pagination>
            </div>

            <div class="flex flex-row ph pv-3" v-if="!thread.isLocked">
                <div class="flex flex-column avatar-column hide-xs-only">
                    <div class="square">
                        <img class="rounded" :src="currentUser.avatar">
                    </div>
                </div>
                <div id="replyContainer" class="flex flex-column ph">
                    <form method="post" action="/post/store" @submit="formDisabled = !formDisabled">
                        <text-editor v-model="postReplyInterface"
                                     ref="textEditor"
                                     @input="handleInput"></text-editor>

                        <input type="hidden" name="_method" value="PUT">

                        <input type="hidden" name="thread_id" :value="this.thread.id">

                        <div class="flex flex-row align-h-right mt-2">

                            <button class="btn collapse-250 thread-reply-button"
                                    type="submit"
                                    :disabled="formDisabled">
                                <span class="text-white corners-3"
                                      :class="themeBgClass">
                                    Reply
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <comment-likes-modal :themeColor="themeColor"
                                 :brand="brand"
                                 :commentId="currentLikeUsersId"
                                 :likeUsers="likeUsers"
                                 :totalLikeUsers="totalLikeUsers"
                                 :loadingLikeUsers="loadingLikeUsers"
                                 :requestingLikeUsers="requestingLikeUsers"
                                 @loadMoreLikeUsers="addLikeUsersToModal"></comment-likes-modal>
        </div>
    </div>
</template>
<script>
    import ForumThreadPost from './_ForumThreadPost.vue';
    import Pagination from '../../../components/Pagination.vue';
    import ForumService from '../../../assets/js/services/forums';
    import TextEditor from '../../../components/TextEditor/TextEditor.vue';
    import Toasts from '../../../assets/js/classes/toasts';
    import * as QueryString from 'query-string/index';
    import ThemeClasses from '../../../mixins/ThemeClasses';
    import CommentLikesModal from '../../comments/_CommentLikesModal.vue';

    export default {
        mixins: [ThemeClasses],
        name: 'forum-thread',
        components: {
            "forum-thread-post": ForumThreadPost,
            "pagination": Pagination,
            "text-editor": TextEditor,
            "comment-likes-modal": CommentLikesModal,
        },
        props: {
            thread: {
                type: Object,
                default: () => {
                }
            },
            brand: {
                type: String,
                default: () => 'drumeo'
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
        data() {
            return {
                posts: this.thread.posts,
                currentPage: Number(this.thread.currentPage),
                totalPages: Number(this.thread.totalPages),
                isFollowed: this.thread.isFollowed,
                isLocked: this.thread.isLocked,
                isPinned: this.thread.isPinned,
                postReplyBody: '',
                formDisabled: false,
                currentLikeUsersId: 0,
                likeUsers: [],
                loadingLikeUsers: false,
                requestingLikeUsers: true,
                totalLikeUsers: 0,
                likeUsersPage: 1,
            }
        },
        computed: {
            postReplyInterface: {
                get() {
                    return this.postReplyBody;
                },
                set(val) {
                    this.postReplyBody = val;
                    this.$refs.textEditor.contentInterface = this.postReplyBody;
                }
            }
        },
        methods: {
            update() {
                window.location.href = this.thread.update;
            },

            getPosts() {

                return ForumService.getForumThreadPosts()
                    .then(data => {
                        this.posts = data;
                    });
            },

            handlePageChange(payload) {
                this.currentPage = payload.page;

                let urlParams = QueryString.parse(location.search);

                urlParams.page = this.currentPage;

                window.location.href = location.protocol + '//' + location.host + location.pathname + '?' + QueryString.stringify(urlParams);

                // this.getPosts();
            },

            handlePostDelete(payload) {
                ForumService.deleteForumsPost(payload.id)
                    .then(response => {
                        Toasts.push({
                            icon: 'happy',
                            title: 'YOU\'RE OUTTA HERE!',
                            themeColor: this.themeColor,
                            message: 'We have deleted this post.'
                        });

                        this.posts = this.posts.filter(post =>
                            post.id !== payload.id
                        )
                    })
            },

            handlePostLike(payload) {
                let index = this.posts.map(post => post.id).indexOf(payload.id);
                let likedPost = this.posts[index];

                if (likedPost.isLiked) {
                    likedPost.totalLikes -= 1;

                    ForumService.unlikeForumPost(payload.id)
                        .then(resolved => resolved);
                }
                else {
                    likedPost.totalLikes += 1;

                    ForumService.likeForumPost(payload.id)
                        .then(resolved => resolved);
                }

                likedPost.isLiked = !likedPost.isLiked;
            },

            handleReplyToPost(payload) {
                let blockQuoteHtmlString = '<blockquote>' +
                    '<span class="post-id">' + payload.id + '</span>' +
                    '<p class="quote-heading"><strong>' + payload.userName + '</strong>' +
                    '<em> - ' + payload.createdOn + '</em></p><br>' +
                    payload.postBody +
                    '</blockquote>' +
                    '<br><p></p>';

                this.scrollToReply();
                this.postReplyInterface += blockQuoteHtmlString;
            },

            handleInput(payload) {
                this.postReplyInterface = payload.currentValue;
            },

            pinPost() {
                ForumService.pinForumsThread(this.thread.id, !this.isPinned)
                    .then(resolved => resolved);

                this.isPinned = !this.isPinned;
            },

            lockPost() {
                ForumService.lockForumsThread(this.thread.id, !this.isLocked)
                    .then(resolved => resolved);

                this.isLocked = !this.isLocked;
            },

            followPost() {
                ForumService.followForumsThread(this.thread.id, this.isFollowed)
                    .then(resolved => resolved);

                this.isFollowed = !this.isFollowed;
            },

            scrollToReply(){
                window.scrollTo(0, document.getElementById('replyContainer').offsetTop);
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

                // ForumService.getForumPostById(payload.id)
                //     .then(response => {
                //         console.log(response);
                //     });

                // CommentService.getCommentLikeUsers({
                //     id: payload.id,
                //     page: this.likeUsersPage
                // })
                //     .then(response => {
                //         if(response){
                //             if(isSameComment){
                //                 this.likeUsers = [...this.likeUsers, ...response.data.data];
                //             }
                //             else {
                //                 this.likeUsers = response.data.data;
                //             }
                //
                //             this.requestingLikeUsers = false;
                //             this.currentLikeUsersId = payload.id;
                //
                //             // window.modalSimpleBar.recalculate();
                //         }
                //
                //         this.loadingLikeUsers = false;
                //     });
            }
        },

        mounted(){
            const youtubeIframes = document.querySelectorAll('iframe');

            Array.from(youtubeIframes).forEach(iframe => {
                iframe.setAttribute('width', '360');
                iframe.setAttribute('height', '205');
            });
        }
    }
</script>
<style lang="scss">
    @import '../../../assets/sass/partials/variables';

    .thread-title {
        @include xSmallOnly {
            font-size:20px;
        }
    }

    .btn.thread-reply-button {
        @include xSmallOnly {
            max-width:100%;
        }
    }

    .back-arrow i {
        transition:color .1s ease-in-out;
        will-change:color;
    }

    .back-arrow:hover {
        i {
            color:#000;
        }
    }

    p iframe {
        max-width:100%;
    }
</style>