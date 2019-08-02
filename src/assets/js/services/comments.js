import axios from 'axios';
import ErrorHandler from './_error-handler';

const endpointPrefix = window.ENDPOINT_PREFIX || '';

export default {

    /**
     * Get a list of comments
     *
     * @param {object} params - the params object to filter comments
     * @returns {Promise} resolved promise with the response.data object, containing the comments array
     */
    getComments(params) {
        return axios.get(`${endpointPrefix}/railcontent/comment`, {
            params,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
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
        return axios.get(`${endpointPrefix}/railcontent/comment/${id}`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Post a comment
     *
     * @param {object} data - the data object with the content_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit comment
     */
    postComment(data) {
        return axios.put(`${endpointPrefix}/railcontent/comment`, data)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Post a reply
     *
     * @param {object} data - the data object with the parent_id and comment properties
     * @returns {Promise} resolved promise with the response.data object, containing the submit reply
     */
    postReply(data) {
        return axios.put(`${endpointPrefix}/railcontent/comment/reply`, data)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Like a Comment or Reply
     *
     * @param {number} id - the comment ID to like
     * @returns {Promise} resolved promise with the response object
     */
    likeComment(id) {
        return axios.put(`${endpointPrefix}/railcontent/comment-like/${id}`)
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Un-Like a Comment or Reply
     *
     * @param {number} id - the comment ID to unlike
     * @returns {Promise} resolved promise with the response object
     */
    unlikeComment(id) {
        return axios.delete(`${endpointPrefix}/railcontent/comment-like/${id}`)
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Delete a Comment or Reply
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    deleteComment(id) {
        return axios.delete(`${endpointPrefix}/railcontent/comment/${id}`)
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Get a list of users that have liked a comment
     *
     * @param {number} id
     * @param {number} page
     * @param {number} limit
     * @returns {Promise} resolved promise with the response.data object
     */
    getCommentLikeUsers({ id, page = 1, limit = 10 }) {
        return axios.get(`${endpointPrefix}/railcontent/comment-likes/${id}`, {
            params: {
                page,
                limit,
            },
        })
            .then(response => response)
            .catch(ErrorHandler);
    },
};
