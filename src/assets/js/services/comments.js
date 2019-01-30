import axios from 'axios';
import Toasts from '../classes/toasts'
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default {

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