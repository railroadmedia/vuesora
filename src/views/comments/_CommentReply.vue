<template>
    <div class="flex flex-row comment-post pl pv mv-1">
        <div class="flex flex-column avatar-column pr">
            <div v-if="hasPublicProfiles"
                 class="user-avatar smaller"
                 :class="[avatarClassObject, brand]">
                <a :href="profileRoute" target="_blank"
                   class="no-decoration">
                    <img :src="user['fields.profile_picture_image_url']" class="rounded">
                </a>
            </div>
            <img v-if="!hasPublicProfiles"
                 :src="user['fields.profile_picture_image_url']" class="rounded">

            <p v-if="userExpValue"
               class="x-tiny dense font-bold uppercase text-center mt-1">{{ userExpRank }}</p>
            <p v-if="userExpValue && this.user.access_level !== 'team'"
               class="x-tiny dense text-center font-compressed">{{ userExpValue }} XP</p>
        </div>
        <div class="flex flex-column grow">
            <div class="flex flex-row align-v-center mb-1 comment-meta">
                <div class="flex flex-column grow mr-1">
                    <h2 class="body font-bold">
                        <a v-if="hasPublicProfiles"
                           :href="profileRoute" target="_blank"
                           class="text-black no-decoration">
                            {{ user.display_name }}
                        </a>
                        <span v-else class="text-black no-decoration">
                            {{ user.display_name }}
                        </span>

                        <span class="x-tiny text-grey-3 font-bold font-italic uppercase ml-1">
                            {{ dateString }}
                        </span>
                    </h2>
                </div>

                <div class="flex flex-column align-h-right align-v-center flex-auto">
                    <div class="flex flex-row">
                        <span class="tiny no-decoration text-grey-3 pointer mr-1"
                              v-if="(isUsersPost || isCurrentUserAdmin)">
                            <i class="fas fa-trash"
                               @click="deleteComment"></i>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mb-1">
                <div class="flex flex-column post-body grow"
                     v-html="comment">
                    {{ comment }}
                </div>
            </div>


            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">

                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                           :class="replying ? 'text-' + themeColor : 'text-grey-3'"
                           @click="openReply"
                           dusk="reply-button">
                            <i class="fas fa-reply"></i>
                            <span class="hide-xs-only">
                                {{ replying ? 'Replying' : 'Reply' }}
                            </span>
                        </p>

                        <p v-if="!isUsersPost"
                           class="tiny mr-3 font-bold uppercase dense pointer reply-like nowrap noselect"
                           :class="isLiked ? 'text-' + themeColor : 'text-grey-3'"
                           @click="likeComment">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="hide-xs-only">
                                {{ isLiked ? 'Liked' : 'Like' }}
                            </span>
                        </p>

                        <span class="grow"></span>

                        <p class="x-tiny font-bold text-grey-3 uppercase nowrap pointer noselect"
                           :data-open-modal="openModalString"
                           @click="openLikes">
                            <i class="fas fa-thumbs-up text-white likes-icon"
                               :class="like_count > 0 ? ('bg-' + themeColor) : 'bg-grey-2'"></i> {{ like_count }}
                        </p>
                    </div>
                </div>
            </div>

            <transition name="slide-fade">
                <div class="flex flex-row comment-post mv-2" v-if="replying">
                    <div class="flex flex-column avatar-column pr hide-xs-only">
                        <img :src="currentUser.avatar" class="rounded">
                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row">
                            <text-editor toolbar="bold italic underline | bullist numlist | link"
                                         :height="150"
                                         ref="textEditor"
                                         v-model="replyInterface"></text-editor>
                        </div>
                        <div class="flex flex-row align-h-right mv-1">
                            <a class="btn flat text-black collapse-150 short mr-1"
                               @click="replying = false">
                                Cancel
                            </a>
                            <button class="btn collapse-150" :disabled="loading"
                                    @click="postReply"
                                    dusk="submit-reply">
                                <span class="text-white short"
                                      :class="'bg-' + themeColor">
                                    Reply
                                </span>
                            </button>
                        </div>

                        <div class="loading-reply flex-center" v-show="loading">
                            <i class="fas fa-spinner fa-spin" :class="'text-' + themeColor"></i>
                            <p class="x-tiny text-grey-3">loading...</p>
                        </div>
                    </div>
                </div>
            </transition>

        </div>
    </div>
</template>
<script>
    import Toasts from '../../assets/js/classes/toasts';
    import moment from 'moment';
    import xpMapper from '../../assets/js/classes/xp-mapper';
    import Utils from '../../assets/js/classes/utils';
    import TextEditor from '../../components/TextEditor.vue';
    import Toasts from '../../assets/js/classes/toasts';
    import Requests from '../../assets/js/classes/requests';

    export default {
        name: 'comment-reply',
        components: {
            'text-editor': TextEditor
        },
        props: {
            brand: {
                type: String,
                default: () => ''
            },
            themeColor: {
                type: String,
                default: () => 'recordeo'
            },
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        display_name: '',
                        id: 0,
                        isAdmin: false,
                        avatar: '',
                    }
                }
            },
            id: {
                type: Number,
                default: () => 0
            },
            parentId: {
                type: String|Number,
                default: () => null
            },
            profileBaseRoute: {
                type: String,
                default: '/laravel/public/members/profile/'
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
            is_liked: {
                type: Boolean,
                default: () => false
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
            },
            pinned: {
                type: Boolean,
                default: () => false
            },
            user_id: {
                type: Number,
                default: () => 0
            },
            user: {
                type: Object,
                default: () => {
                    return {
                        'fields.profile_picture_image_url': '',
                        id: 0,
                        display_name: '',
                        xp: 1234,
                        access_level: 'edge'
                    }
                }
            },
            hasPublicProfiles: {
                type: Boolean,
                default: () => true
            },
        },
        data(){
            return {
                isLiked: this.is_liked,
                reply: '',
                replying: false,
                loading: false
            }
        },
        computed: {
            avatarClassObject(){
                return {
                    'subscriber': ['edge', 'lifetime', 'team'].indexOf(this.user.access_level) !== -1,
                    'edge': this.user.access_level === 'edge',
                    'pack': this.user.access_level === 'pack',
                    'team': this.user.access_level === 'team',
                    'lifetime': this.user.access_level === 'lifetime'
                }
            },

            replyInterface: {
                get() {
                    return this.reply;
                },
                set(val) {
                    this.reply = val;
                }
            },

            userExpValue(){
                return Utils.parseXpValue(this.user.xp);
            },

            userExpRank (){
                if(this.user.access_level === 'team'){
                    return 'Drumeo Team';
                }

                return xpMapper.getNearestValue(this.user.xp);
            },

            profileRoute(){
                return this.profileBaseRoute + this.user_id
            },

            commentUrl(){
                return window.location + '?goToComment=' + this.id;
            },

            dateString(){
                return moment.utc(this.created_on).local().fromNow();
            },

            isUsersPost(){
                return String(this.currentUser.id) === String(this.user_id);
            },

            isCurrentUserAdmin(){
                return this.currentUser.isAdmin === true;
            },

            openModalString(){
                if(this.brand !== 'drumeo'){
                    return '';
                }

                return this.like_count > 0 ? 'likeUsersModal' : '';
            },
        },
        methods: {
            likeComment(){
                this.isLiked = !this.isLiked;

                this.$emit('likeReply', {
                    id: this.id,
                    isLiked: this.is_liked,
                    isPinned: this.pinned
                });
            },

            openLikes(){

                if(this.like_count > 0){
                    this.$emit('openLikes', {
                        id: this.id,
                        totalLikeUsers: this.like_count,
                        busToRoot: true
                    });
                }
            },

            openReply(){
                this.replying = !this.replying;
                this.$root.$emit('replyOpened', {
                    id: this.id
                });
            },

            postReply() {
                if (this.reply.currentValue) {
                    this.loading = true;

                    return Requests.postReply({
                        parent_id: this.parentId,
                        comment: this.reply.currentValue
                    })
                        .then(resolved => {
                            if (resolved) {

                                this.replyInterface = '';
                                this.replying = false;
                                this.$refs.textEditor.currentValue = '';
                                Toasts.success('Reply successfully posted!');

                                this.$emit('replyPosted', {
                                    data: resolved['results'] || resolved['data'][0]
                                });
                            }

                            this.loading = false;
                        });
                }
            },

            deleteComment(){
                const vm = this;

                Toasts.confirm({
                    title: 'Are you sure you want to delete this reply?',
                    submitButton: {
                        text: '<span class="bg-error text-white">Delete</span>',
                        callback: () => {
                            vm.$emit('deleteReply', {
                                id: vm.id
                            });
                        }
                    },
                    cancelButton: {
                        text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>'
                    }
                });
            },
        },
        mounted(){
            this.$root.$on('replyOpened', payload => {
                if(this.id !== payload.id){
                    this.replying = false;
                }
            })
        }
    }
</script>
<style>

</style>