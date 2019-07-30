import CommentService from '../../assets/js/services/comments';
import Toasts from '../../assets/js/classes/toasts';

export default {
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        profileBaseRoute: {
            type: String,
            default: () => '/laravel/public/members/profile/',
        },

        hasPublicProfiles: {
            type: Boolean,
            default: () => true,
        },

        userId: {
            type: Number | String,
        },

        userName: {
            type: String,
        },

        userAvatar: {
            type: String,
        },

        userXp: {
            type: String | Number,
        },

        userAccessLevel: {
            type: String,
        },

        isAdmin: {
            type: Boolean,
        },
    },
    data() {
        return {
            currentPage: 1,
            totalComments: 0,
            totalCommentsAndReplies: 0,
            requestingData: false,
            currentLikeUsersId: 0,
            likeUsers: [],
            loadingLikeUsers: false,
            requestingLikeUsers: true,
            totalLikeUsers: 0,
            likeUsersPage: 1,
        };
    },
    computed: {
        currentUser() {
            return {
                display_name: this.userName,
                id: this.userId,
                avatar: this.userAvatar,
                xp: this.userXp,
                access_level: this.userAccessLevel,
                isAdmin: this.isAdmin,
            };
        },
    },
    methods: {
        handleCommentLike(payload) {
            const index = this.comments.map(comment => comment.id).indexOf(payload.id);
            const likedPost = payload.isPinned ? this.pinnedComment : this.comments[index];

            if (payload.isLiked) {
                likedPost.like_count -= 1;
                likedPost.is_liked = false;

                CommentService.unlikeComment(payload.id)
                    .then((response) => {});
            } else {
                likedPost.like_count += 1;
                likedPost.is_liked = true;

                CommentService.likeComment(payload.id)
                    .then((response) => {});
            }
        },

        handleReplyLike(payload) {
            const index = this.comments.map(comment => comment.id).indexOf(payload.parent_id);
            const likedPostReplies = payload.isPinned ? this.pinnedComment.replies : this.comments[index].replies;
            const likedPostReplyIndex = likedPostReplies.map(reply => reply.id).indexOf(payload.id);
            const likedPostReply = likedPostReplies[likedPostReplyIndex];


            if (payload.isLiked) {
                likedPostReply.like_count -= 1;
                likedPostReply.is_liked = false;

                CommentService.unlikeComment(payload.id)
                    .then((response) => {});
            } else {
                likedPostReply.like_count += 1;
                likedPostReply.is_liked = true;

                CommentService.likeComment(payload.id)
                    .then((response) => {});
            }
        },

        handleCommentDelete(payload) {
            CommentService.deleteComment(payload.id)
                .then((resolved) => {
                    this.comments = this.comments.filter(comment => comment.id !== payload.id);

                    Toasts.push({
                        icon: 'happy',
                        themeColor: this.themeColor,
                        title: 'TRASHED!',
                        message: 'We have removed your comment. Please add a better one!',
                    });
                });
        },

        handleReplyDelete(payload) {
            const index = this.comments.map(comment => comment.id).indexOf(payload.parent_id);
            const deletedPostReplies = this.comments[index].replies;
            const deletedPostReplyIndex = deletedPostReplies.map(reply => reply.id).indexOf(payload.id);
            const deletedPostReply = deletedPostReplies[deletedPostReplyIndex];

            CommentService.deleteComment(payload.id)
                .then((resolved) => {
                    if (resolved) {
                        this.comments[index].replies = this.comments[index].replies.filter(reply => reply.id !== payload.id);

                        Toasts.push({
                            icon: 'happy',
                            themeColor: this.themeColor,
                            title: 'TRASHED!',
                            message: 'We have removed your reply. Please add a better one!',
                        });
                    }
                });
        },

        addLikeUsersToModal(payload) {
            const isSameComment = payload.id === this.currentLikeUsersId;

            this.likeUsersPage += 1;
            this.requestingLikeUsers = true;
            this.totalLikeUsers = payload.totalLikeUsers;

            if (!isSameComment) {
                this.loadingLikeUsers = true;
                this.likeUsersPage = 1;
            }

            CommentService.getCommentLikeUsers({
                id: payload.id,
                page: this.likeUsersPage,
            })
                .then((response) => {
                    if (response) {
                        if (isSameComment) {
                            this.likeUsers = [...this.likeUsers, ...response.data.data];
                        } else {
                            this.likeUsers = response.data.data;
                        }

                        this.requestingLikeUsers = false;
                        this.currentLikeUsersId = payload.id;

                        // window.modalSimpleBar.recalculate();
                    }

                    this.loadingLikeUsers = false;
                });
        },
    },
};
