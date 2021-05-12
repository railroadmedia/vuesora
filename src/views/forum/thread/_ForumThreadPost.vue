<template>
    <div class="flex flex-row ph pv-3 bb-grey-1-1">
        <a
            :id="'post' + post.id"
            style="position:relative;top:-75px;"
        ></a>
        <div class="flex flex-column avatar-column">
            <div
                class="user-avatar smaller"
                :class="[avatarClassObject, brand]"
            >
                <a
                    :href="profileRoute"
                    target="_blank"
                    class="no-decoration"
                >
                    <img
                        :src="post.authorAvatar"
                        class="rounded"
                    >
                </a>
            </div>

            <p
                v-if="showUserExp"
                class="x-tiny dense font-bold uppercase text-center mt-1"
            >
                {{ userExpRank }}
            </p>
            <p
                v-if="showUserExp"
                class="x-tiny dense text-center font-compressed"
            >
                {{ userExpValue }} XP
            </p>
          <p
              class="x-tiny dense text-center font-bold"
          >
            Total Forums Posts {{ post.authorTotalPosts }}
          </p>
          <p
              class="x-tiny dense text-center font-bold"
          >
            Days as a Member {{ post.authorDaysAsMember }}
          </p>
        </div>
        <div class="flex flex-column ph">
            <div class="flex flex-row align-v-center mb-1">
                <div class="flex flex-column">
                    <h2 class="title">
                        {{ post.authorUsername }}
                    </h2>
                </div>

                <div class="flex flex-column align-h-right">
                    <div class="flex flex-row">
                        <p class="x-tiny text-grey-3 font-bold font-italic uppercase mr-2">
                            {{ post.createdOn }}
                        </p>
                        <p class="x-tiny text-grey-3 font-bold font-italic uppercase">
                            #{{ postNumber }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mv-2">
                <div
                    v-if="!editing"
                    class="flex flex-column post-body grow"
                    v-html="post.postBody"
                >
                    {{ post.postBody }}
                </div>

                <div
                    v-if="editing"
                    class="flex flex-column mb-1"
                >
                    <form
                        :action="'/post/update/' + this.post.id"
                        method="post"
                    >
                        <input
                            type="hidden"
                            name="_method"
                            value="patch"
                        >
                        <text-editor :initial-value="post.postBody"></text-editor>

                        <div class="flex flex-row align-h-right mt-2">
                            <a
                                class="btn bg-black text-black no-decoration flat collapse-150 no-border mr-1"
                                @click="editing = false"
                            >
                                Cancel
                            </a>

                            <button
                                class="btn collapse-250"
                                type="submit"
                            >
                                <span
                                    class="text-white corners-3"
                                    :class="themeBgClass"
                                >
                                    Save Post
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

          <div class="flex flex-row body mv-2">
            <div
                v-if="!editing"
                class="flex flex-column post-body grow"
                v-html="post.authorSignature"
            >
              {{ post.authorSignature }}
            </div>
          </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p
                            class="tiny mr-1 font-bold uppercase dense pointer reply-like noselect"
                            :class="post.isLiked ? themeTextClass : 'text-grey-3'"
                            @click="likePost"
                        >
                            <i
                                class="fa-thumbs-up"
                                :class="post.isLiked ? 'fas' : 'fal'"
                            ></i>
                        </p>
                        <p
                            class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                            :class="post.isLiked ? themeTextClass : 'text-grey-3'"
                            @click="openLikes"
                        >
                            {{ post.totalLikes }}
                        </p>

                        <p
                            v-if="!post.isLocked"
                            class="tiny text-grey-3 mr-3 font-bold uppercase dense pointer reply-like noselect"
                            @click="replyToPost"
                        >
                            Reply
                        </p>
                    </div>
                </div>
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center align-h-right">
                        <p
                            class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                            @click="reportPost"
                        >
                            Report
                        </p>

                        <!--<p v-if="currentUser.isAdmin" class="x-tiny text-grey-2 ml-3 font-bold font-italic uppercase dense pointer"-->
                        <!--@click="hidePost">-->
                        <!--Hide-->
                        <!--</p>-->

                        <p
                            v-if="index !== 0 && canEdit"
                            class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                            @click="deletePost"
                        >
                            Delete
                        </p>

                        <p
                            v-if="canEdit"
                            class="x-tiny text-grey-2 ml-3 font-bold font-italic uppercase dense pointer"
                            @click="editing = !editing"
                        >
                            Edit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TextEditor from '../../../components/TextEditor/TextEditor.vue';
import Toasts from '../../../assets/js/classes/toasts';
import ForumService from '../../../assets/js/services/forums';
import ThemeClasses from '../../../mixins/ThemeClasses';
import Utils from '../../../assets/js/classes/utils';
import xpMapper from '../../../assets/js/classes/xp-mapper';

export default {
    name: 'ForumThreadPost',
    components: {
        'text-editor': TextEditor,
    },
    mixins: [ThemeClasses],
    props: {
        post: {
            type: Object,
        },

        brand: {
            type: String,
            default: 'drumeo',
        },

        index: {
            type: Number,
            default: () => 0,
        },

        currentPage: {
            type: Number,
            default: () => 1,
        },

        currentUser: {
            type: Object,
            default: () => ({
                name: '',
                avatar: '',
                id: 0,
                isAdmin: false,
            }),
        },

        profileBaseRoute: {
            type: String,
            default: '/members/profile/',
        },
    },
    data() {
        return {
            editing: false,
        };
    },
    computed: {
        canEdit() {
            return this.currentUser.id === this.post.authorId || this.currentUser.isAdmin;
        },

        avatarClassObject() {
            return {
                subscriber: ['edge', 'lifetime', 'team', 'admin', 'guitar', 'piano'].indexOf(this.post.access_level) !== -1,
                edge: this.post.access_level === 'edge',
                pack: this.post.access_level === 'pack',
                team: ['team', 'admin'].indexOf(this.post.access_level) !== -1,
                guitar: this.post.access_level === 'guitar',
                piano: this.post.access_level === 'piano',
                lifetime: this.post.access_level === 'lifetime',
            };
        },

        userExpValue() {
            return Utils.parseXpValue(this.post.xp);
        },

        userExpRank() {
            if (['team', 'admin'].indexOf(this.post.access_level) !== -1) {
                return `${this.brand} Team`;
            }

            return xpMapper.getNearestValue(this.post.xp);
        },

        postNumber() {
            return ((this.currentPage - 1) * 15) + (this.index + 1);
        },

        profileRoute() {
            return this.profileBaseRoute + this.post.authorId;
        },

        showUserExp() {
            return this.userExpValue != null && (['team', 'pack', 'admin'].indexOf(this.post.access_level) === -1);
        },
    },
    methods: {
        replyToPost() {
            this.$emit('replyToPost', {
                id: this.post.id,
                userName: this.post.authorUsername,
                createdOn: this.post.createdOn,
                postBody: this.post.postBody,
            });
        },

        likePost() {
            this.$emit('likePost', {
                id: this.post.id,
                isLiked: this.post.isLiked,
            });
        },

        reportPost() {
            const vm = this;

            Toasts.confirm({
                title: 'Click report to send a notification to a moderator.',
                submitButton: {
                    text: '<span class="bg-error text-white">Report</span>',
                    callback: () => {
                        ForumService.reportForumPost(vm.post.id)
                            .then((resolved) => {
                                Toasts.push({
                                    icon: 'happy',
                                    title: 'GOOD EYE!',
                                    themeColor: this.themeColor,
                                    message: 'We will look into this post.',
                                });
                            });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        hidePost() {
            const vm = this;

            Toasts.confirm({
                title: 'Click report to send a notification to a moderator.',
                submitButton: {
                    text: '<span class="bg-warning text-white">Report</span>',
                    callback: () => {
                        this.$emit('hidePost', {
                            id: vm.post.id,
                        });

                        Toasts.push({
                            icon: 'happy',
                            title: 'GOOD EYE!',
                            themeColor: this.themeColor,
                            message: 'We have hidden this post.',
                        });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        deletePost() {
            const vm = this;

            Toasts.confirm({
                title: 'Are you sure you want to delete this post?',
                submitButton: {
                    text: '<span class="bg-error text-white">Delete</span>',
                    callback: () => {
                        this.$emit('deletePost', {
                            id: this.post.id,
                        });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        editPost() {
            this.$emit('editPost', {
                id: this.post.id,
            });
        },

        openLikes() {
            if (this.post.totalLikes > 0) {
                this.$emit('openLikes', {
                    id: this.post.id,
                    totalLikeUsers: this.post.totalLikes,
                });
            }
        },
    },
};
</script>
<style>

</style>
