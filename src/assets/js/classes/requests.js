/**
 * Requests
 * Methods for handling all async requests.
 */

import axios from 'axios';
import Toasts from './toasts'
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default {


    /**
     * Get railcontent content by ID
     *
     * @returns {Promise} - resolved promise with the response object
     */
    getContentById(id){
        return axios.get(endpoint_prefix + '/railcontent/content/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Get an array of like users for a content id
     *
     * @returns {Promise} - resolved promise with the response object
     */
    getContentLikeUsers({id, page = 1}){
        return axios.get(endpoint_prefix + '/railcontent/content-like/' + id, {
            params: {
                page: page,
                limit: 10
            }
        })
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Like content by ID
     *
     * @param {Boolean} is_liked
     * @param {String|Number} content_id
     * @param {String|Number} user_id
     * @returns {Promise} - resolved promise with the response object
     */
    likeContentById({is_liked, content_id, user_id}){
        return axios({
            url: endpoint_prefix + '/railcontent/content-like',
            method: is_liked ? 'put' : 'delete',
            data: {
                content_id: content_id,
                user_id: user_id
            }
        })
    },

    /**
     * Set users default payment method
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    setDefaultPaymentMethod(paypalPaymentMethodId) {

        return axios.patch('/payment-method/set-default', {id: paypalPaymentMethodId})
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get current user payment methods
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaymentMethods() {

        return axios.get('/members/account/settings/payment-methods')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get Paypal agreement url
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaypalAgreementUrl() {

        return axios.get('/payment-method/paypal-url')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Update a credit card payment method
     *
     * @param {number} id - the id of payment method to delete
     * @param {object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    updatePaymentMethod(id, payload) {

        return axios.patch('/payment-method/' + id, payload)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Delete a payment method
     *
     * @param {number} id - the id of payment method to delete
     * @returns {Promise} - resolved promise with the response.data object
     */
    deletePaymentMethod(id) {

        return axios.delete('/payment-method/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Crates a new payment method
     *
     * @param {object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    createPaymentMethod(payload) {

        return axios.put('/payment-method', payload)
            .then(response => response.data)
            .catch(error => {
                if (error.response && error.response.status == 422) {
                    return error.response.data;
                } else {
                    this.handleError(error);
                }
            });
    },

    /**
     * Get the forum search results
     *
     * @param {string} term - the search terms
     * @param {string} type - the search type, 'posts' or 'threads' - default null
     * @param {number} page - the results page - default 1
     * @param {number} limit - the results page amount - 10
     * @param {string} sort - the column to sort - default 'score'
     * @returns {Promise} - resolved promise with the response.data object
     */
    getForumSearchResults(term, type, page, limit, sort) {

        let params = {
            term: term,
            page: page || 1,
            limit: limit || 10,
            sort: sort || 'score'
        };

        if (type) {
            params.type = type;
        }

        return axios.get('/members/forums/search', {
                params: params
            })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get the data for a list of forum threads
     *
     * @static
     * @returns {Promise} - resolved promise with the response.data object
     */
    getForumThreads() {
        return axios.get(endpoint_prefix + '/members/forums/threads-json')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get the posts data for a specific forum thread
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    getForumThreadPosts() {
        return axios.get(endpoint_prefix + '/members/forums/post-json')
            .then(response => response.data)
            .catch(this.handleError);
    },


    /**
     * Upload a resource to S3 and get a CDN url back
     *
     * @param {string} endpoint - the url endpoint to send the request to
     * @param {Object} formData - the formData object to send with the request
     * @returns {Promise} resolved promise with the response.data object, containing the cdn url
     */
    remoteResourceUpload(endpoint, formData) {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                processData: false,
                contentType: false
            }
        };

        return axios.post(endpoint_prefix + endpoint, formData, config)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Flag a piece of content as "complete"
     *
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    markContentAsComplete(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/complete', {
            content_id: contentId
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Flag a piece of content as "started"
     *
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    markContentAsStarted(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/start', {
            content_id: contentId
        })
            .then(response => response.data)
            .catch(error => {
                console.error(error);
            });
    },

    /**
     * Reset your progress for a piece of content
     *
     * @param {number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    resetContentProgress(contentId) {
        return axios.put(endpoint_prefix + '/railcontent/reset', {
            content_id: contentId
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get a list of comments
     *
     * @param {object} params - the params object to filter comments
     * @returns {Promise} resolved promise with the response.data object, containing the comments array
     */
    getComments(params) {
        return axios.get(endpoint_prefix + '/railcontent/comment', {
            params: params
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get a comment by ID
     * WARNING: Doesn't actually work like you think, pulls the PAGE of the list where that
     * specific comment is, kinda dumb but ask the BE why - Curtis, Sept 2018
     *
     * @param {object} id - the comment id to get
     * @returns {Promise} resolved promise with the response.data object, containing the comments array
     */
    getCommentById(id) {
        return axios.get(endpoint_prefix + '/railcontent/comment/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Post a comment
     *
     * @param {object} data - the data object with the content_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit comment
     */
    postComment(data) {
        return axios.put(endpoint_prefix + '/railcontent/comment', data)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Post a reply
     *
     * @param {object} data - the data object with the parent_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit reply
     */
    postReply(data) {
        return axios.put(endpoint_prefix + '/railcontent/comment/reply', data)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Like a Comment or Reply
     *
     * @param {number} id - the comment ID to like
     * @returns {Promise} resolved promise with the response object
     */
    likeComment(id) {
        return axios.put(endpoint_prefix + '/railcontent/comment-like/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Un-Like a Comment or Reply
     *
     * @param {number} id - the comment ID to unlike
     * @returns {Promise} resolved promise with the response object
     */
    unlikeComment(id) {
        return axios.delete(endpoint_prefix + '/railcontent/comment-like/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Delete a Comment or Reply
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    deleteComment(id) {
        return axios.delete(endpoint_prefix + '/railcontent/comment/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Get a list of users that have liked a comment
     *
     * @param {number} id
     * @param {number} page
     * @param {number} limit
     * @returns {Promise} resolved promise with the response.data object
     */
    getCommentLikeUsers({id, page = 1, limit = 10}) {
        return axios.get(endpoint_prefix + '/railcontent/comment-likes/' + id, {
            params: {
                page: page,
                limit: limit
            }
        })
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Report a forum post
     *
     * @param {number} id - the post ID to report
     * @returns {Promise} resolved promise with the response.data object
     */
    reportForumPost(id) {
        return axios.put('/forums/post/report/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Like a forum thread
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    likeForumPost(id) {
        return axios.put(endpoint_prefix + '/forums/post/like/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Unlike a forum thread
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    unlikeForumPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/unlike/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Follow a forum thread
     *
     * @param {number} id - thread id
     * @returns {Promise} resolved promise with the response.data object
     */
    followForumsThread(id) {
        return axios.put(endpoint_prefix + '/forums/thread/follow/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Pin a forum thread
     *
     * @param {number} id - thread id
     * @param {boolean} pinned
     * @returns {Promise} resolved promise with the response.data object
     */
    pinForumsThread(id, pinned) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            pinned: pinned
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Lock a forum thread
     *
     * @param {number} id - thread id
     * @param {boolean} locked
     * @returns {Promise} resolved promise with the response.data object
     */
    lockForumsThread(id, locked) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            locked: locked
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Delete a Forum thread
     *
     * @param {number} id - thread id
     * @returns {Promise} resolved promise with the response object
     */
    deleteForumsPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/delete/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Send an Email
     *
     * @param {string} message - the content of the text area element within the email form
     * @param {string} type - the type of email to send ['general', 'ask-question', 'support', 'suggest-learning-path']
     * @param {string} subject - the subject for the email
     * @param {string} recipient - who to send to (default set on backend)
     * @param {string} endpoint - the mail package endpoint to hit
     * @returns {Promise} resolved promise with the response.data object
     */
    sendEmail({message, type, subject, recipient, endpoint}) {
        return axios.post(endpoint_prefix + endpoint, {
            message: message,
            type: type,
            subject: subject,
            recipient: recipient
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark a specific notification as read
     *
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-read/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark a specific notification as unread
     *
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsUnRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-unread/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark all of the current users notifications as read
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    markAllNotificationsAsRead() {
        return axios.post(endpoint_prefix + '/members/notifications/mark-all-read')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Add or Remove content from your list
     *
     * @param content_id {string}
     * @param is_added {boolean}
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    addOrRemoveContentFromList(content_id, is_added){
        const delete_endpoint = endpoint_prefix + '/members-area/event-json-api/remove-from-primary-playlist-list';
        const put_endpoint = endpoint_prefix + '/members-area/event-json-api/add-to-primary-playlist-list';

        return axios.post(is_added ? delete_endpoint : put_endpoint, {
            content_id: content_id,
            type: is_added ? 'remove-from-list' : 'my-list-addition'
        })
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Mark a learning path as started (this changes the users current active learning path for
     * progress tracking)
     *
     * @param content_id {string}
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    markLearningPathAsStarted(content_id){
        return axios.post(endpoint_prefix + '/members/start-learning-path/' + content_id)
            .then(response => response)
            .catch(this.handleError)
    },

    /**
     * Display an error message and console the error if any request fails
     *
     * @param {object} error - the error object returned by the request
     */
    handleError(error) {
        console.error(error);
        Toasts.push({
            icon: 'doh',
            title: 'This is Embarrassing! That didn\'t work',
            message: 'Refresh the page to try once more, if it happens again please let us know using the chat below.'
        });
    }
}