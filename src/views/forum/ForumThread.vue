<template>
    <div class="container mv-3 forum-post">
        <div class="flex flex-column bg-white shadow corners-3">
            <div class="flex flex-row pa-3">
                <h1 class="heading">
                    <a href="/members/forums" class="no-decoration mr-1">
                        <i class="fas fa-arrow-circle-left text-light"></i>
                    </a>

                    This is a Forum Title
                </h1>
            </div>

            <forum-thread-post v-for="(post, i) in posts"
                               :key="post.id"
                               :index="i"
                               v-bind="post"
                               :isAdmin="currentUser.isAdmin"
                               :currentPage="currentPage"
                               @likePost="handlePostLike"
                               @replyToPost="handleReplyToPost"></forum-thread-post>

            <div class="flex flex-row pagination-row align-h-right bb-light-1">
                <pagination :currentPage="currentPage"
                            :totalPages="totalPages"
                            @pageChange="handlePageChange"></pagination>
            </div>
            <div class="flex flex-row ph pv-3">
                <div class="flex flex-column avatar-column hide-xs-only">
                    <div class="square">
                        <img class="rounded" :src="currentUser.avatar">
                    </div>
                </div>
                <div id="replyContainer" class="flex flex-column ph">
                    <form method="post" action="/post/store">
                        <!--<text-editor v-model="postReplyInterface"-->
                                     <!--ref="textEditor"-->
                                     <!--@input="handleInput"></text-editor>-->

                        <input type="hidden" name="_method" value="PUT">

                        <textarea name="content"></textarea>
                        <input type="hidden" name="thread_id" :value="this.thread.id">

                        <div class="flex flex-row align-h-right mt-2">
                            <a class="btn bg-black text-black no-decoration flat collapse-150 no-border mr-1"
                               @click="cancelReply">
                                Cancel
                            </a>

                            <button class="btn collapse-250" type="submit">
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

    export default {
        name: 'forum-thread',
        components: {
            "forum-thread-post": ForumThreadPost,
            "pagination" : Pagination,
            "text-editor": TextEditor
        },
        props: {
            thread: {
                type: Object,
                default: () => {}
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
                posts: this.thread.posts,
                currentPage: this.thread.currentPage,
                totalPages: this.thread.totalPages,
                postReplyBody: ''
            }
        },
        computed: {
            postReplyInterface: {
                get(){
                    return this.postReplyBody;
                },
                set(val){
                    this.postReplyBody = val;
                    this.$refs.textEditor.contentInterface = this.postReplyBody;
                }
            }
        },
        methods: {
            getPosts(){

                return Requests.getForumThreadPosts()
                    .then(data => {
                        this.posts = data;
                    });
            },

            handlePageChange(payload){
                this.currentPage = payload.page;

                this.getPosts();
            },

            handlePostLike(payload){
                let index = this.posts.map(post => post.id).indexOf(payload.id);
                let likedPost = this.posts[index];

                if(likedPost.isLiked){
                    likedPost.totalLikes -= 1;
                }
                else {
                    likedPost.totalLikes += 1;
                }

                likedPost.isLiked = !likedPost.isLiked;
            },

            handleReplyToPost(payload){
                let blockQuoteHtmlString = '<blockquote data-post-id="' + payload.id + '">' +
                    '<p class="quote-heading"><strong>' + payload.userName + '</strong>' +
                    '<em> - ' + payload.createdOn + '</em></p><br>' +
                    payload.postBody +
                    '</blockquote>' +
                    '<br><p></p>';

                window.scrollTo(0, document.getElementById('replyContainer').offsetTop);
                this.postReplyInterface += blockQuoteHtmlString;
            },

            handleInput(payload){
                this.postReplyInterface = payload.currentValue;
            },

            cancelReply(){
                this.postReplyBody = '';
            },
        }
    }
</script>
<style lang="scss">
    .reply-like {
        min-width:50px;
    }
</style>