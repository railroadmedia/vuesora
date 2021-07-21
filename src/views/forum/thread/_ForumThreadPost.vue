<template>
    <div class="tw-flex tw-flex-col tw-py-7 tw-px-4 sm:tw-px-14 tw-mb-7 tw-bg-white tw-rounded-2xl tw-overflow-hidden">
        <a
            :id="'post' + post.id"
            style="position:relative;top:-75px;"
        ></a>

        <!-- Post Header -->
        <div class="tw-flex tw-items-center">
            <!-- Avatar -->
            <div class="tw-w-20 tw-h-20 tw-mr-4"> 
                <div class="user-avatar tw-w-20 tw-h-20"
                    :class="[avatarClassObject, brand]">
                    <a :href="profileRoute"
                        class="no-decoration"
                    >
                        <img class="rounded" :src="post.authorAvatar">
                    </a>
                </div>
            </div>
            <div class="tw-flex tw-flex-wrap tw-flex-grow">
                <!-- Name -->
                <h2 class="tw-mb-2 tw-w-3/4 tw-break-all md:tw-break-normal md:tw-w-full">
                    {{ post.authorUsername }}
                </h2>
                <div class="tw-text-13 tw-text-gray-500 tw-italic tw-font-medium tw-uppercase tw-font-roboto-condensed tw-w-full tw-order-3 md:tw-order-2 md:tw-w-1/2">
                    <span>{{ post.authorTotalPosts }} Posts</span> -
                    <span>{{ userExpValue }}</span> -
                        <span>Level {{ post.progressLevel }}</span>
                </div>
                <div class="tw-inline-flex tw-text-13 tw-text-gray-500 tw-italic tw-font-medium tw-uppercase tw-font-roboto-condensed tw-justify-end md:tw-order-last tw-w-1/4 md:tw-w-1/2">
                    <span class="tw-mb-4">{{ post.createdOn }}</span>
                    <span>&nbsp;- #{{ postNumber }}</span>
                </div>
            </div>
        </div>

        <!-- Post Content -->
        <div class="flex flex-column">
            <!-- Body -->
            <div class="flex flex-row body tw-my-6">
                <div
                    v-if="!editing"
                    :class="['flex', 'flex-column', 'post-body', 'grow', brand]"
                    v-html="post.postBody"
                >
                    {{ post.postBody }}
                </div>

                <div
                    v-if="editing"
                    class="flex flex-column mb-1"
                >
                    <form
                        :action="updatePostRoute"
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

            <!-- Actions -->
            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                <div class="flex flex-row align-v-center">
                    <p
                        class="tw-text-13 tw-mr-1 font-bold uppercase dense pointer reply-like noselect"
                        :class="post.isLiked ? themeTextClass : 'text-grey-3'"
                        @click="likePost"
                    >
                    <i
                        class=" fas fa-thumbs-up"
                        :class="post.isLiked ? 'fas' : 'fal'"
                    ></i>
                    </p>
                    <p
                        class="tw-text-13 tw-mr-2 font-bold uppercase dense pointer reply-like noselect"
                        :class="post.isLiked ? themeTextClass : 'tw-text-gray-500'"
                        :data-open-modal="openModalString"
                        @click="openLikes"
                    >
                    {{ post.totalLikes }}
                    </p>

                    <p
                        v-if="!post.isLocked"
                        class="tw-text-13 tw-text-gray-500 mr-3 font-bold uppercase dense pointer reply-like noselect"
                        @click="replyToPost"
                    >
                    Reply
                    </p>
                </div>
                </div>
                <div class="flex flex-column mb-1">
                <div class="flex flex-row align-v-center align-h-right">
                    <p
                        class="tw-text-xs tw-text-gray-500 ml-3 font-bold font-italic uppercase dense pointer"
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
                        class="tw-text-xs tw-text-gray-500 ml-3 font-bold font-italic uppercase dense pointer"
                        @click="deletePost"
                    >
                    Delete
                    </p>
                    <p
                        v-if="canEdit"
                        class="tw-text-xs tw-text-gray-500 ml-3 font-bold font-italic uppercase dense pointer"
                        @click="editing = !editing"
                    >
                    Edit
                    </p>
                </div>
                </div>
            </div>
            
            <!-- Signature -->
            <div class="flex flex-row body">
                <div
                    v-if="post.authorSignature && !signaturesHidden"
                    class="tw-flex tw-flex-col post-body grow bt-grey-1-1 tiny text-grey-3 tw-pt-7 tw-mt-7"
                    v-html="post.authorSignature"
                >
                {{ post.authorSignature }}
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
            require: true
        },

        signaturesHidden: {
            type: Boolean,
            default: false,
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
                access_level: '',
                avatar: '',
                id: 0,
                isAdmin: false,
                name: '',
                total_posts: '0',
                xp_rank: 'Casual',
                progress_level: '1.0',
            }),
        },

        profileBaseRoute: {
            type: String,
            default: '/members/profile/',
        },

        updatePostBaseRoute: {
            type: String,
            default: '/post/update/',
        },
    },
    data() {
        return {
            editing: false,
            ytEmbedCount: 0,
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
      updatePostRoute() {
        return this.updatePostBaseRoute.replaceAll('#####', this.post.id);
      },

      openModalString() {
        return this.post.totalLikes > 0 ? 'likeUsersModal' : '';
      },
    },
    methods: {
        convertVideoLinksToEmbeds(postContent) {
          const vm = this;
          var temp = document.createElement('div');

          // set the content with the string
          temp.innerHTML = postContent;

          Array.from(temp.querySelectorAll('a')).slice(0, 5).forEach(function(ele) {
            var url = ele.getAttribute('href');

            // max of 5 embeds per post
            if (!url.includes('yout')) {
                return;
            }

            var ytId = vm.getYouTubeId(url);

            var youtubeIframeHtml = '<iframe width="720" ' +
                'height="480" src="https://www.youtube-nocookie.com/embed/' +
                 ytId + '" ' +
                'title="YouTube video player" frameborder="0" ' +
                'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                'allowfullscreen></iframe>';

            var iframeDiv = document.createElement('div');
            iframeDiv.classList.add('youtube-video-wrapper');

            iframeDiv.innerHTML = youtubeIframeHtml;
            ele.parentNode.insertBefore(iframeDiv, ele.nextSibling);
            ele.remove();

            console.log(vm.ytEmbedCount);
          });

          return temp.innerHTML;
        },

        getYouTubeId(url) {
            url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
        },

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
