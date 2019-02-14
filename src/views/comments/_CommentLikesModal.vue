<template>
    <div :id="customId || 'likeUsersModal'" class="modal small">
        <div id="likeUsersContainer" ref="likeUsersContainer" class="flex flex-column bg-white corners-3 shadow" style="max-height:500px;">
            <div v-if="loadingLikeUsers"
                 class="flex flex-column pa-3">
                <h1 class="heading text-center">
                    <i class="fas fa-spinner fa-spin"
                       :class="themeTextClass"></i>
                </h1>
            </div>
            <div v-else
                 class="flex flex-column">
                <h1 class="heading align-v-center pa-3">
                    <i class="fas fa-thumbs-up rounded text-white mr-1 big likes-icon"
                       :class="themeBgClass"></i>
                    {{ totalLikeUsers }} Like{{ totalLikeUsers == 1 ? '' : 's' }}
                </h1>

                <a v-for="user in likeUsers"
                   :key="user.id"
                   :href="baseProfileRoute + user.user_id"
                   class="flex flex-row comment-like-user bt-grey-1-1 no-decoration text-black ph-3 pv-1 align-v-center">
                    <div class="flex flex-row">
                        <div class="flex flex-column avatar-column">
                            <div class="user-avatar smaller"
                                 :class="getUserAvatarClassObject(user)">
                                <img class="rounded" :src="user.avatar_url">
                            </div>
                        </div>
                        <div class="flex flex-column pl-2 align-v-center text-truncate">
                            <p class="body font-bold text-truncate">
                                {{ user.display_name }}
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'comment-likes-modal',
        props: {
            brand: {
                type: String,
                default: () => 'drumeo'
            },
            customId: {
                type: String,
                default: () => null
            },
            likeUsers: {
                type: Array,
                default: () => []
            },
            totalLikeUsers: {
                default: () => 0
            },
            loadingLikeUsers: {
                type: Boolean,
                default: () => false
            },
            commentId: {
                default: () => 0
            },
            requestingLikeUsers: {
                type: Boolean,
                default: () => false
            },
        },
        computed: {
            baseProfileRoute(){
                if(this.brand === 'guitareo'){
                    return '/members/account/';
                }

                return '/laravel/public/members/profile/';
            }
        },
        methods: {
            getUserAvatarClassObject(user){
                return {
                    'subscriber': ['edge', 'lifetime', 'team'].indexOf(user.access_level) !== -1,
                    'edge': user.access_level === 'edge',
                    'pack': user.access_level === 'pack',
                    'team': user.access_level === 'team',
                    'lifetime': user.access_level === 'lifetime'
                }
            },
        },
        mounted(){
            const likeUsersContainer = this.$refs.likeUsersContainer;

            likeUsersContainer.addEventListener('scroll', event => {
                const containerHeight = event.target.clientHeight;
                const scrollPosition = event.target.scrollTop;
                const scrollHeight = event.target.scrollHeight;
                const isNearBottom = (containerHeight + scrollPosition) >= (scrollHeight - 25);

                if(this.totalLikeUsers > 10 && this.likeUsers.length < this.totalLikeUsers){
                    if(isNearBottom && !this.requestingLikeUsers){
                        this.$emit('loadMoreLikeUsers', {
                            id: this.commentId,
                            totalLikeUsers: this.totalLikeUsers,
                            load_more: true
                        });
                    }
                }
            })
        }
    }
</script>