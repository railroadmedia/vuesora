<template>
    <div class="container mv-3 forum-post">
        <div class="flex flex-column bg-white shadow corners-3">
            <div class="flex flex-row pa-3 flex-wrap align-v-center">
                <div class="flex flex-column mb-1 xs-12 sm-6">
                    <h1 class="heading thread-title">
                        <a href="/members/forums" class="no-decoration mr-1 back-arrow">
                            <i class="fas fa-arrow-circle-left text-light"></i>
                        </a>

                        {{ thread.title }}
                    </h1>
                </div>

                <div class="flex flex-column mb-1 xs-12 sm-6">
                    <div class="flex flex-row align-h-right">
                        <button class="btn collapse-150 mr-1" @click="update"
                                v-if="currentUser.isAdmin">
                            <span class="bg-recordeo corners-3 inverted text-recordeo">
                                Update
                            </span>
                        </button>

                        <button class="btn collapse-square mr-1" @click="pinPost"
                                v-if="currentUser.isAdmin">
                            <span class="bg-recordeo corners-3"
                                  :class="isPinned ? 'text-white' : 'inverted text-recordeo'">
                                <i class="fas fa-thumbtack"></i>
                            </span>
                        </button>

                        <button class="btn collapse-square mr-1" @click="lockPost"
                                v-if="currentUser.isAdmin">
                            <span class="bg-recordeo corners-3"
                                  :class="isLocked ? 'text-white' : 'inverted text-recordeo'">
                                <i class="fas fa-lock"></i>
                            </span>
                        </button>

                        <button class="btn collapse-150 mr-1" @click="followPost">
                            <span class="bg-recordeo corners-3"
                                  :class="isFollowed ? 'text-white' : 'inverted text-recordeo'">
                                {{ isFollowed ? 'Followed' : 'Follow' }}
                            </span>
                        </button>

                        <button class="btn collapse-150" @click="scrollToReply">
                            <span class="bg-recordeo corners-3 inverted text-recordeo">
                                  Add Reply
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-row pagination-row align-h-right bb-grey-1-1" v-if="totalPages > 1">
                <pagination :currentPage="currentPage"
                            :totalPages="totalPages"
                            @pageChange="handlePageChange"></pagination>
            </div>

            <forum-thread-post v-for="(post, i) in posts"
                               :key="post.id"
                               :index="i"
                               v-bind="post"
                               :currentPage="currentPage"
                               :currentUser="currentUser"
                               :isLocked="thread.isLocked"
                               @likePost="handlePostLike"
                               @deletePost="handlePostDelete"
                               @replyToPost="handleReplyToPost"></forum-thread-post>

            <div class="flex flex-row pagination-row align-h-right bb-grey-1-1" v-if="totalPages > 1">
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
                    <form method="post" action="/post/store">
                        <text-editor v-model="postReplyInterface"
                                     ref="textEditor"
                                     @input="handleInput"></text-editor>

                        <input type="hidden" name="_method" value="PUT">

                        <input type="hidden" name="thread_id" :value="this.thread.id">

                        <div class="flex flex-row align-h-right mt-2">

                            <button class="btn collapse-250 thread-reply-button" type="submit">
                                <span class="bg-recordeo text-white corners-3">
                                    Reply
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ForumThreadPost from './_ForumThreadPost.vue';
    import Pagination from '../../components/Pagination.vue';
    import Requests from '../../assets/js/classes/requests';
    import TextEditor from '../../components/TextEditor.vue';
    import Toasts from '../../assets/js/classes/toasts';
    import * as QueryString from 'query-string';

    export default {
        name: 'forum-thread',
        components: {
            "forum-thread-post": ForumThreadPost,
            "pagination": Pagination,
            "text-editor": TextEditor
        },
        props: {
            thread: {
                type: Object,
                default: () => {
                }
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
                postReplyBody: ''
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

                return Requests.getForumThreadPosts()
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
                Requests.deleteForumsPost(payload.id)
                    .then(response => {
                        Toasts.success('Post ' + payload.id + ' has been deleted.');

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

                    Requests.unlikeForumPost(payload.id)
                        .then(resolved => resolved);
                }
                else {
                    likedPost.totalLikes += 1;

                    Requests.likeForumPost(payload.id)
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
                Requests.pinForumsThread(this.thread.id, !this.isPinned)
                    .then(resolved => resolved);

                this.isPinned = !this.isPinned;
            },

            lockPost() {
                Requests.lockForumsThread(this.thread.id, !this.isLocked)
                    .then(resolved => resolved);

                this.isLocked = !this.isLocked;
            },

            followPost() {
                Requests.followForumsThread(this.thread.id)
                    .then(resolved => resolved);

                this.isFollowed = !this.isFollowed;
            },

            scrollToReply(){
                window.scrollTo(0, document.getElementById('replyContainer').offsetTop);
            }
        }
    }
</script>
<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

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

    .reply-like {
        min-width: 50px;
    }
</style>