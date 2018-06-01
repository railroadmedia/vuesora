/**
 * Requests
 * Static methods for handling all async requests.
 */

import axios from 'axios';
import Toasts from './toasts'

export default class Requests {

    /**
     * Get the data for a list of forum threads
     *
     * @static
     * @returns {Promise} - resolved promise with the response.data object
     */
    static getForumThreads(){
        return axios.get('/members/forums/threads-json')
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Get the posts data for a specific forum thread
     *
     * @static
     * @returns {Promise} resolved promise with the response.data object
     */
    static getForumThreadPosts(){
        return axios.get('/members/forums/post-json')
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }


    /**
     * Upload a resource to S3 and get a CDN url back
     *
     * @static
     * @param {string} endpoint - the url endpoint to send the request to
     * @param {Object} formData - the formData object to send with the request
     * @returns {Promise} resolved promise with the response.data object, containing the cdn url
     */
    static remoteResourceUpload(endpoint, formData){
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                processData: false,
                contentType: false
            }
        };

        return axios.post(endpoint, formData, config)
            .then(response => {
                return response.data;
            })
            .catch(Requests.handleError);
    }

    /**
     * Flag a piece of content as "complete"
     *
     * @static
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    static markContentAsComplete(contentId){
        return axios.put('/railcontent/complete', {
            content_id: contentId
        })
            .then(response => {
                return response.data;
            })
            .catch(Requests.handleError);
    }

    /**
     * Flag a piece of content as "started"
     *
     * @static
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    static markContentAsStarted(contentId){
        return axios.put('/railcontent/start', {
            content_id: contentId
        })
            .then(response => {
                return response.data;
            })
            .catch(Requests.handleError);
    }

    /**
     * Reset your progress for a piece of content
     *
     * @static
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    static resetContentProgress(contentId){
        return axios.put('/railcontent/reset', {
            content_id: contentId
        })
            .then(response => {
                return response.data;
            })
            .catch(Requests.handleError);
    }

    /**
     * Get a list of comments
     *
     * @static
     * @param {object} params - the params object to filter comments
     * @returns {Promise} resolved promise with the response.data object, containing the comments array
     */
    static getComments(params){
        return axios.get('/railcontent/comment', {
            params: params
        })
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Post a comment
     *
     * @static
     * @param {object} data - the data object with the content_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit comment
     */
    static postComment(data){
        return axios.put('/railcontent/comment', data)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Post a reply
     *
     * @static
     * @param {object} data - the data object with the parent_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit reply
     */
    static postReply(data){
        return axios.put('/railcontent/comment/reply', data)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Delete a Comment or Reply
     *
     * @static
     * @param {object} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static deleteComment(id){
        return axios.delete('/railcontent/comment/' + id)
            .then(response => {
                return response
            })
            .catch(Requests.handleError);
    }

    /**
     * Like a forum thread
     *
     * @static
     * @param {object} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static likeForumPost(id){
        return axios.put('/forums/post/like/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Unlike a forum thread
     *
     * @static
     * @param {object} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static unlikeForumPost(id){
        return axios.delete('/forums/post/unlike/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Unlike a forum thread
     *
     * @static
     * @param {string} message - the content of the text area element within the email form
     * @param {string} type - the type of email to send ['general', 'ask-question', 'support', 'suggest-learning-path']
     * @param {string} subject - the subject for the email
     * @returns {Promise} resolved promise with the response.data object
     */
    static sendEmail(message, type, subject){
        return axios.post('/members/mail', {
            message: message,
            type: type,
            subject: subject
        })
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Mark a specific notification as read
     *
     * @static
     * @returns {Promise} resolved promise with the response.data object
     */
    static markNotificationAsRead(id){
        return axios.post('/notifications/read/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Mark all of the current users notifications as read
     *
     * @static
     * @returns {Promise} resolved promise with the response.data object
     */
    static markAllNotificationsAsRead(){
        return axios.post('/notifications/read/all')
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Display an error message and console the error if any request fails
     *
     * @static
     * @param {object} error - the error object returned by the request
     */
    static handleError(error){
        console.error(error);
        Toasts.errorWarning();
    }
}