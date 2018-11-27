<template>
    <div class="flex flex-row pv-2">
        <div class="flex flex-column align-h-left text-grey-3 hover-text-white flex-auto pr-2 pointer noselect"
             data-open-modal="shareVideoModal">
            <p class="body font-bold uppercase">
                <i class="fas fa-share mr-1"></i>
                Share
            </p>
        </div>

        <div class="flex flex-column grow"></div>

        <div class="flex flex-column align-h-right flex-auto ph-2 pointer noselect">
            <p class="body text-grey-3 text-right font-bold uppercase hover-text-white"
               :class="lessonIsLiked ? 'text-white' : 'text-grey-3'"
               @click="likeLesson">
                <i class="fa-thumbs-up mr-1"
                   :class="lessonIsLiked ? 'fas' : 'fal'"></i>
                {{ lessonIsLiked ? 'Liked' : 'Like' }}
            </p>
        </div>

        <div class="flex flex-column align-h-right flex-auto pl-2 pointer noselect">
            <div class="flex flex-row body font-bold text-grey-3 hover-text-white align-v-center"
                 data-open-modal="lessonLikeUsers"
                 @click="addLikeUsersToModal">
                <i class="fas fa-thumbs-up mr-1 likes-icon text-white"
                   :class="'bg-' + themeColor"></i> {{ lessonLikeCount }}
            </div>
        </div>

        <div id="shareVideoModal" class="modal">
            <div class="flex flex-column bg-white corners-3 shadow pa-3">
                <h1 class="heading mb-2">Share Video Link</h1>


                <div class="form-group mb-2">
                    <input id="shareableUrlInput"
                           class="no-label" type="text"
                           :value="shareUrl">

                    <button id="copyUrlButton" class="btn"
                            @click="copyTimecodeToClipboard">
                        <span class="text-white bg-grey-3">
                            Copy
                        </span>
                    </button>
                </div>
                
                <div class="form-group mb-2">
                    <div class="flex flex-row form-group align-v-center">
                        <span class="toggle-input mr-1">
                            <input id="includeTimecode"
                                   v-model="useTimecode"
                                   type="checkbox">

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label for="includeTimecode" class="toggle-label pointer dense uppercase font-bold tiny">
                            Include the current time
                        </label>
                    </div>
                </div>

                <p class="tiny font-italic text-grey-3">
                    This link is only accessible by Drumeo Members.
                </p>
            </div>
        </div>

        <likes-modal customId="lessonLikeUsers"
                     :themeColor="themeColor"
                     :commentId="0"
                     :likeUsers="likeUsers"
                     :totalLikeUsers="lessonLikeCount"
                     :loadingLikeUsers="loadingLikeUsers"
                     :requestingLikeUsers="requestingLikeUsers"
                     @loadMoreLikeUsers="addLikeUsersToModal"></likes-modal>
    </div>
</template>
<script>
    import Toasts from '../assets/js/classes/toasts';
    import LikesModal from '../views/comments/_CommentLikesModal';
    import Requests from '../assets/js/classes/requests';
    import axios from 'axios';

    export default {
        name: 'video-social-buttons',
        components: {
            'likes-modal': LikesModal
        },
        props: {
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            isLiked: {
                type: Boolean,
                default: () => false
            },
            likeCount: {
                type: Number|String,
                default: () => 0
            },
            currentTimeInSeconds: {
                type: Number,
                default: () => 0
            },
            contentId: {
                type: Number|String,
                default: () => null
            },
            userId: {
                type: String|Number,
                default: () => null
            }
        },
        data() {
            return {
                useTimecode: false,
                lessonIsLiked: this.isLiked,
                lessonLikeCount: this.likeCount,
                likeUsers: [],
                likeUsersPage: 0,
                totalLikeUsers: this.likeCount || 0,
                loadingLikeUsers: false,
                requestingLikeUsers: false,
            }
        },
        computed: {
            shareUrl(){
                if(this.useTimecode){
                    return location.protocol + '//' + location.host + location.pathname + '?time=' + Math.floor(this.currentTimeInSeconds);
                }

                return location.protocol + '//' + location.host + location.pathname;
            },
        },
        methods: {

            likeLesson(){
                this.lessonIsLiked = !this.lessonIsLiked;
                const method = this.lessonIsLiked ? 'put' : 'delete';

                if(this.lessonIsLiked){
                    this.lessonLikeCount++;
                }
                else {
                    this.lessonLikeCount--;
                }

                Requests.likeContentById({
                    is_liked: this.lessonIsLiked,
                    content_id: this.contentId,
                    user_id: this.userId,
                })
                    .then(response => response);
            },

            addLikeUsersToModal(payload){
                if(!payload.load_more){
                    this.loadingLikeUsers = true;
                    this.likeUsersPage = 0;
                }

                this.requestingLikeUsers = true;
                this.likeUsersPage += 1;

                Requests.getContentLikeUsers({
                    id: this.contentId,
                    page: this.likeUsersPage
                })
                    .then(response => {
                        if(response){
                            this.requestingLikeUsers = false;
                            this.loadingLikeUsers = false;

                            if(payload.load_more){
                                this.likeUsers = [
                                    ...this.likeUsers,
                                    ...response.data.data
                                ];
                            }
                            else {
                                this.likeUsers = response.data.data;
                            }
                        }
                    });
            },

            copyTimecodeToClipboard(){
                const timecode = document.getElementById('shareableUrlInput');

                timecode.select();
                document.execCommand('copy');
                timecode.blur();

                Toasts.push({
                    icon: 'happy',
                    title: 'SHARE THE LOVE!',
                    message: 'This URL has been copied, and is ready to share!'
                });
            },
        }
    }
</script>
<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    #copyUrlButton {
        position:absolute;
        right:0;
        top:0;
        height:100%;
        width:75px;

        span {
            border-radius:0 3px 3px 0;
        }
    }
</style>