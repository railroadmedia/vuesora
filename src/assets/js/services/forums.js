import axios from 'axios';
import ErrorHandler from './_error-handler';
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default {

    /**
     * Get the forum search results
     *
     * @param {String} term - the search terms
     * @param {String} type - the search type, 'posts' or 'threads' - default null
     * @param {Number} page - the results page - default 1
     * @param {Number} limit - the results page amount - 10
     * @param {String} sort - the column to sort - default 'score'
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
            .catch(ErrorHandler);
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
            .catch(ErrorHandler);
    },

    /**
     * Get the posts data for a specific forum thread
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    getForumThreadPosts() {
        return axios.get(endpoint_prefix + '/members/forums/post-json')
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    getForumPostById(id){
        return axios.get('/forums/post/show/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Report a forum post
     *
     * @param {String|Number} id - the post ID to report
     * @returns {Promise} resolved promise with the response.data object
     */
    reportForumPost(id) {
        return axios.put('/forums/post/report/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Like a forum thread
     *
     * @param {String|Number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    likeForumPost(id) {
        return axios.put(endpoint_prefix + '/forums/post/like/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Unlike a forum thread
     *
     * @param {String|Number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    unlikeForumPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/unlike/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Follow a forum thread
     *
     * @param {String|Number} id - thread id
     * @param {Boolean} isFollowed
     * @returns {Promise} resolved promise with the response.data object
     */
    followForumsThread(id, isFollowed = false) {
        const url = isFollowed ? '/forums/thread/unfollow/' : '/forums/thread/follow/';
        const method = isFollowed ? 'DELETE' : 'PUT';

        return axios({
            method: method,
            url: endpoint_prefix + url + id
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Pin a forum thread
     *
     * @param {String|Number} id - thread id
     * @param {Boolean} pinned
     * @returns {Promise} resolved promise with the response.data object
     */
    pinForumsThread(id, pinned) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            pinned: pinned
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Lock a forum thread
     *
     * @param {String|Number} id - thread id
     * @param {Boolean} locked
     * @returns {Promise} resolved promise with the response.data object
     */
    lockForumsThread(id, locked) {
        return axios.patch(endpoint_prefix + '/forums/thread/update/' + id, {
            locked: locked
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Delete a Forum thread
     *
     * @param {String|Number} id - thread id
     * @returns {Promise} resolved promise with the response object
     */
    deleteForumsPost(id) {
        return axios.delete(endpoint_prefix + '/forums/post/delete/' + id)
            .then(response => response)
            .catch(ErrorHandler);
    },
}