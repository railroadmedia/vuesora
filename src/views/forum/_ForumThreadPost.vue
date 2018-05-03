<template>
    <div class="flex flex-row pa bb-light-1">
        <div class="flex flex-column pa avatar-column hide-xs-only">
            <div class="square">
                <img class="rounded" :src="authorAvatar">
            </div>
        </div>
        <div class="flex flex-column pa">
            <div class="flex flex-row align-v-center mb-1">
                <div class="flex flex-column">
                    <h2 class="title">{{ authorUsername }}</h2>
                </div>

                <div class="flex flex-column align-h-right">
                    <div class="flex flex-row">
                        <p class="x-tiny text-dark font-bold font-italic uppercase mr-2">
                            {{ createdOn }}
                        </p>
                        <p class="x-tiny text-dark font-bold font-italic uppercase">
                            #{{ postNumber }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-row body mv-2">
                <div v-if="!editing" class="flex flex-column post-body" v-html="postBody">
                    {{ postBody }}
                </div>

                <div v-if="editing" class="flex flex-column mb-1">
                    <text-editor :initialValue="postBody"></text-editor>

                    <div class="flex flex-row align-h-right mt-2">
                        <a class="btn bg-black text-black no-decoration flat collapse-150 no-border mr-1"
                           @click="editing = false">
                            Cancel
                        </a>

                        <button class="btn collapse-250" type="submit">
                            <span class="bg-recordeo text-white corners-3">
                                Save Post
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center">
                        <p class="tiny text-dark mr-3 font-bold uppercase dense pointer reply-like noselect"
                           @click="replyToPost">
                            <i class="fas fa-reply"></i> Reply
                        </p>

                        <p class="tiny mr-3 font-bold uppercase dense pointer reply-like noselect"
                           :class="isLiked ? 'text-recordeo' : 'text-dark'"
                           @click="likePost">
                            <i class="fas fa-thumbs-up"></i>
                            {{ isLiked ? 'Liked' : 'Like' }}
                        </p>

                        <p class="x-tiny text-dark uppercase font-italic"
                           v-html="userLikeString">
                            {{ userLikeString }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-column mb-1">
                    <div class="flex flex-row align-v-center align-h-right">
                        <p class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="reportPost">
                            Report
                        </p>

                        <p v-if="isAdmin" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="hidePost">
                            Hide
                        </p>

                        <p v-if="isAdmin" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="deletePost">
                            Delete
                        </p>

                        <p v-if="isAdmin" class="x-tiny text-light ml-3 font-bold font-italic uppercase dense pointer"
                           @click="editing = !editing">
                            Edit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TextEditor from '../../components/TextEditor.vue';
    import BrandClasses from '../../mixins/BrandClasses.js'

    export default {
        mixins: [BrandClasses],
        name: 'forum-thread-post',
        components: {
            "text-editor": TextEditor
        },
        props: {
            authorAvatar: {
                type: String,
                default: () => ''
            },
            authorUsername: {
                type: String,
                default: () => ''
            },
            createdOn: {
                type: String,
                default: () => ''
            },
            id: {
                type: Number,
                default: () => 0
            },
            isLiked: {
                type: Boolean,
                default: () => false
            },
            postBody: {
                type: String,
                default: () => ''
            },
            totalLikes: {
                type: Number,
                default: () => 0
            },
            userLikes: {
                type: Array,
                default: () => ''
            },
            index: {
                type: Number,
                default: () => 0
            },
            currentPage: {
                type: Number,
                default: () => 1
            },
            isAdmin: {
                type: Boolean,
                default: () => false
            }
        },
        data(){
            return {
                editing: false
            }
        },
        computed: {
            userLikeString(){
                let userLikes = this.userLikes.join(', ');
                let additionalUserLikes = ' like this';

                if(this.totalLikes > 3){
                    additionalUserLikes = ' & ' + String(this.totalLikes - 3) + ' others like this';
                }

                if(this.isLiked){
                    userLikes =  'You, ' + this.userLikes[0] + ', ' + this.userLikes[1];
                }

                return '<span class="font-bold">' + userLikes + '</span>' + additionalUserLikes;
            },

            postNumber(){
                return ((this.currentPage - 1) * 10) + (this.index + 1)
            }
        },
        methods: {
            replyToPost(){
                this.$emit('replyToPost', {
                    id: this.id,
                    userName: this.authorUsername,
                    createdOn: this.createdOn,
                    postBody: this.postBody
                })
            },

            likePost(){
                this.$emit('likePost', {
                    id: this.id,
                    isLiked: this.isLiked
                })
            },

            reportPost(){
                this.$emit('reportPost', {
                    id: this.id
                })
            },

            hidePost(){
                this.$emit('hidePost', {
                    id: this.id
                })
            },

            deletePost(){
                this.$emit('deletePost', {
                    id: this.id
                })
            },

            editPost(){
                this.$emit('editPost', {
                    id: this.id
                })
            }
        }
    }
</script>
<style>

</style>