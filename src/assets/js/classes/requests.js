/**
 * Requests
 * Static methods for handling all async requests.
 */

import axios from 'axios';
import Toasts from './toasts'
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default class Requests {

    /**
     * Get the data for a list of forum threads
     *
     * @static
     * @returns {Promise} - resolved promise with the response.data object
     */
    static getForumThreads() {
        return axios.get(endpoint_prefix + '/members/forums/threads-json')
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
    static getForumThreadPosts() {
        return axios.get(endpoint_prefix + '/members/forums/post-json')
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
    static remoteResourceUpload(endpoint, formData) {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                processData: false,
                contentType: false
            }
        };

        return axios.post(endpoint_prefix + endpoint, formData, config)
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
    static markContentAsComplete(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/complete', {
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
    static markContentAsStarted(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/start', {
            content_id: contentId
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            });
    }

    /**
     * Reset your progress for a piece of content
     *
     * @static
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    static resetContentProgress(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/reset', {
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
    static getComments(params) {
        return axios.get(endpoint_prefix + '/railcontent/comment', {
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
    static postComment(data) {
        return axios.put(endpoint_prefix + '/railcontent/comment', data)
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
    static postReply(data) {
        return axios.put(endpoint_prefix + '/railcontent/comment/reply', data)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Like a Comment or Reply
     *
     * @static
     * @param {number} id - the comment ID to like
     * @returns {Promise} resolved promise with the response object
     */
    static likeComment(id) {
        return axios.put(endpoint_prefix + '/railcontent/comment-like/' + id)
            .then(response => {
                return response
            })
            .catch(Requests.handleError);
    }

    /**
     * Un-Like a Comment or Reply
     *
     * @static
     * @param {number} id - the comment ID to unlike
     * @returns {Promise} resolved promise with the response object
     */
    static unlikeComment(id) {
        return axios.delete(endpoint_prefix + '/railcontent/comment-like/' + id)
            .then(response => {
                return response
            })
            .catch(Requests.handleError);
    }

    /**
     * Delete a Comment or Reply
     *
     * @static
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static deleteComment(id) {
        return axios.delete(endpoint_prefix + '/railcontent/comment/' + id)
            .then(response => {
                return response
            })
            .catch(Requests.handleError);
    }

    /**
     * Like a forum thread
     *
     * @static
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static likeForumPost(id) {
        return axios.put(endpoint_prefix + '/forums/post/like/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Unlike a forum thread
     *
     * @static
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    static unlikeForumPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/unlike/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * @static
     * @param {number} id - thread id
     * @returns {Promise} resolved promise with the response.data object
     */
    static followForumsThread(id) {
        return axios.put(endpoint_prefix + '/forums/thread/follow/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * @static
     * @param {number} id - thread id
     * @param {boolean} pinned
     * @returns {Promise} resolved promise with the response.data object
     */
    static pinForumsThread(id, pinned) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            pinned: pinned
        })
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * @static
     * @param {number} id - thread id
     * @param {boolean} locked
     * @returns {Promise} resolved promise with the response.data object
     */
    static lockForumsThread(id, locked) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            locked: locked
        })
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * @static
     * @param {number} id - thread id
     * @returns {Promise} resolved promise with the response object
     */
    static deleteForumsPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/delete/' + id)
            .then(response => {
                return response
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
    static sendEmail(message, type, subject) {
        return axios.post(endpoint_prefix + '/members/mail', {
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
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    static markNotificationAsRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-read/' + id)
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Mark a specific notification as unread
     *
     * @static
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    static markNotificationAsUnRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-unread/' + id)
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
    static markAllNotificationsAsRead() {
        return axios.post(endpoint_prefix + '/members/notifications/mark-all-read')
            .then(response => {
                return response.data
            })
            .catch(Requests.handleError);
    }

    /**
     * Add or Remove content from your list
     *
     * @param content_id {string}
     * @param is_added {boolean}
     *
     * @static
     * @returns {Promise} resolved promise with the response.data object
     */
    static addOrRemoveContentFromList(content_id, is_added){
        const delete_endpoint = endpoint_prefix + '/members-area/event-json-api/remove-from-primary-playlist-list';
        const put_endpoint = endpoint_prefix + '/members-area/event-json-api/add-to-primary-playlist-list';

        return axios.post(is_added ? delete_endpoint : put_endpoint, {
            content_id: content_id,
            type: is_added ? 'remove-from-list' : 'my-list-addition'
        })
            .then(response => response)
            .catch(Requests.handleError);
    }

    /**
     * Mark a learning path as started (this changes the users current active learning path for
     * progress tracking)
     *
     * @param content_id {string}
     *
     * @static
     * @returns {Promise} resolved promise with the response.data object
     */
    static markLearningPathAsStarted(content_id){
        return axios.post(endpoint_prefix + '/members/start-learning-path/' + content_id)
            .then(response => response)
            .catch(Requests.handleError)
    }

    /**
     * Display an error message and console the error if any request fails
     *
     * @static
     * @param {object} error - the error object returned by the request
     */
    static handleError(error) {
        console.error(error);
        Toasts.errorWarning();
    }
}