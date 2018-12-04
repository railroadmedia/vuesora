import Vue from 'vue';
import Requests from './requests';
import VideoTracker from './video-tracker';
import ContentCatalogue from '../../../views/catalogues/ContentCatalogue.vue';
import MediaPlayer from '../../../components/MediaElement.vue';
import Comments from '../../../views/comments/Comments.vue';
import ContentAssignment from '../../../components/ContentAssignment.vue';
import UserExpBar from '../../../components/UserExpBar.vue';
import EmailForm from '../../../components/EmailForm.vue';

/**
 * Renderers
 * Static methods to render all custom vue components
 */

export default {

    /**
     * ContentCatalogue.vue
     */
    catalogues(){
        const contentCatalogues = document.querySelectorAll('.contentCatalogue');

        if(contentCatalogues.length){
            Array.from(contentCatalogues).forEach(catalogue => {
                let data_keys = Object.keys(catalogue.dataset);
                let props = {};

                data_keys.forEach(key => {
                    if(catalogue.dataset[key] === 'true'){
                        props['$_' + key] = true;
                    }
                    else {
                        if(key === 'preLoadedContent' || key === 'filterableValues' || key === 'filterTabs'){
                            props['$_' + key] = JSON.parse(catalogue.dataset[key]);
                        }
                        else if(key === 'includedTypes' || key === 'statuses'){
                            props['$_' + key] = catalogue.dataset[key].split(',');
                        }
                        else {
                            props['$_' + key] = catalogue.dataset[key];
                        }
                    }
                });

                new Vue({
                    el: catalogue,
                    render: h => h(ContentCatalogue, {
                        props: props
                    })
                });
            });
        }
    },

    /**
     * MediaElement.vue
     */
    videoPlayer(){
        const videoPlayer = document.getElementById('videoPlayer');

        if(videoPlayer) {
            const videoPlayerPropKeys = Object.keys(videoPlayer.dataset);
            const progressState = videoPlayer.dataset['progressState'];
            const contentId = videoPlayer.dataset['contentId'];

            let videoPlayerPropsToPass = {};
            let videoTracker;
            let hasBeenPlayed = false;

            videoPlayerPropKeys.forEach(key => {
                if (videoPlayer.dataset[key] === 'true' || videoPlayer.dataset[key] === '1') {
                    videoPlayerPropsToPass[key] = true;
                } else {
                    if (key === 'chapters') {
                        if (videoPlayer.dataset[key]) {
                            let chapters = JSON.parse(videoPlayer.dataset[key]);

                            videoPlayerPropsToPass['chapters'] = chapters;
                            videoPlayerPropsToPass['timecodes'] = chapters ? chapters.map(
                                chapter => Number(chapter.chapter_timecode)
                            ) : [];
                        }
                    } else if (key === 'sources') {
                        videoPlayerPropsToPass[key] = JSON.parse(videoPlayer.dataset[key]);
                    } else {
                        videoPlayerPropsToPass[key] = videoPlayer.dataset[key];
                    }
                }
            });

            window.videoPlayerVueInstance = new Vue({
                el: videoPlayer,
                render: h => h(MediaPlayer, {
                    props: videoPlayerPropsToPass
                })
            });

            videoTracker = new VideoTracker({
                media_id: videoPlayer.dataset['videoId'],
                player_instance: videoPlayerVueInstance.$children[0],
                current_second: videoPlayer.dataset['currentSecond'],
                media_length_in_seconds: videoPlayer.dataset['videoLength']
            });

            window.videoPlayerVueInstance.$children[0].$on('playing', event => {

                if (!progressState && !hasBeenPlayed) {
                    Requests.markContentAsStarted(contentId)
                        .then(resolved => resolved);
                }

                videoTracker.handlePlayEvent();

                hasBeenPlayed = true;
            });

            window.videoPlayerVueInstance.$children[0].$on('pause', event => {
                videoTracker.handlePlayEvent();
            });
        }
    },

    /**
     * Comments.vue
     */
    comments(){
        const commentsSection = document.getElementById('commentsSection');

        if(commentsSection){
            const contentId = commentsSection.dataset['contentId'];
            const commentThemeColor = commentsSection.dataset['themeColor'];
            const currentUser = {
                id: commentsSection.dataset['userId'],
                display_name: commentsSection.dataset['userName'],
                isAdmin: commentsSection.dataset['isAdmin'] === '1',
                access_level: commentsSection.dataset['userAccessLevel'],
                avatar: commentsSection.dataset['userAvatar'],
                xp: commentsSection.dataset['userXp']
            };

            window.commentSectionVueInstance = new Vue({
                el: commentsSection,
                render: h => h(Comments, {
                    props: {
                        content_id: contentId,
                        currentUser: currentUser,
                        themeColor: commentThemeColor,
                        brand: 'drumeo'
                    }
                })
            });
        }
    },

    /**
     * ContentAssignment.vue
     */
    assignments(brand){
        const contentAssignments = document.querySelectorAll('.content-assignment');
        const assignmentVueComponents = [];

        for(let i = 0; i < contentAssignments.length; i++){
            const thisAssignment = contentAssignments[i];
            const thisAssignmentPropKeys = Object.keys(thisAssignment.dataset);

            let assignmentPropsToPass = {
                brand: brand,
                position: i
            };

            thisAssignmentPropKeys.forEach(key => {
                if(thisAssignment.dataset[key] === 'true' || thisAssignment.dataset[key] === '1'){
                    assignmentPropsToPass[key] = true;
                }
                else {
                    assignmentPropsToPass[key] = thisAssignment.dataset[key];
                }
            });

            assignmentVueComponents.push(
                new Vue({
                    el: contentAssignments[i],
                    render: h => h(ContentAssignment, {
                        props: assignmentPropsToPass
                    })
                })
            );

            assignmentVueComponents[i].$children[0].$on('assignmentComplete', event => {
                window.recalculateProgress(event.complete, assignmentVueComponents.length);
            })
        }
    },

    /**
     * UserExpBar.vue
     */
    userExpBar(){
        const userExpBar = document.getElementById('userExpBar');

        if(userExpBar){
            const userExpBarPropKeys = Object.keys(userExpBar.dataset);
            let userExpBarPropsToPass = {};

            userExpBarPropKeys.forEach(key => {
                if(userExpBar.dataset[key] === 'true' || userExpBar.dataset[key] === '1'){
                    userExpBarPropsToPass[key] = true;
                }
                else {
                    userExpBarPropsToPass[key] = userExpBar.dataset[key];
                }
            });

            new Vue({
                el: userExpBar,
                render: h => h(UserExpBar, {
                    props: userExpBarPropsToPass
                })
            })
        }
    },

    /**
     * EmailForm.vue
     */
    emailForm(){
        const emailForm = document.getElementById('emailForm');

        if(emailForm){
            const emailFormPropKeys = Object.keys(emailForm.dataset);
            let emailFormPropsToPass = {};

            emailFormPropKeys.forEach(key => {
                if(emailForm.dataset[key] === 'true' || emailForm.dataset[key] === '1'){
                    emailFormPropsToPass[key] = true;
                }
                else {
                    emailFormPropsToPass[key] = emailForm.dataset[key];
                }
            });

            new Vue({
                el: emailForm,
                render: h => h(EmailForm, {
                    props: emailFormPropsToPass
                })
            });
        }
    }
}