import axios from 'axios';
import ErrorHandler from './_error-handler';

let endpointPrefix;

if(typeof window != 'undefined'){
    endpointPrefix = window.ENDPOINT_PREFIX || '';
}

export default {

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
        const params = {
            term,
            page: page || 1,
            limit: limit || 10,
            sort: sort || 'score',
        };
        let endpoint;

        if ( window.location.origin === "https://dev.drumeo.com" ) {
            endpoint = "/laravel/public/members/forums/search";
        } else {
            endpoint = '/members/forums/search';
        }

        if (type) {
            params.type = type;
        }

        return axios.get(endpoint, {
            params,
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
        return axios.get(`${endpointPrefix}/members/forums/threads-json`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Get the posts data for a specific forum thread
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    getForumThreadPosts() {
        return axios.get(`${endpointPrefix}/members/forums/post-json`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    getForumPostById(id) {
        return axios.get(`/forums/post/show/${id}`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Report a forum post
     *
     * @param {number} id - the post ID to report
     * @returns {Promise} resolved promise with the response.data object
     */
    reportForumPost(id) {
        return axios.put(`${endpointPrefix}/forums/post/report/${id}`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Like a forum thread
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    likeForumPost(id) {
        return axios.put(`${endpointPrefix}/forums/post/like/${id}`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Unlike a forum thread
     *
     * @param {number} id - the comment ID to delete
     * @returns {Promise} resolved promise with the response.data object
     */
    unlikeForumPost(id) {
        return axios.delete(`${endpointPrefix}/forums/post/unlike/${id}`)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Follow a forum thread
     *
     * @param {number} id - thread id
     * @param {boolean} isFollowed
     * @returns {Promise} resolved promise with the response.data object
     */
    followForumsThread(id, isFollowed = false) {
        const url = isFollowed ? '/forums/thread/unfollow/' : '/forums/thread/follow/';
        const method = isFollowed ? 'DELETE' : 'PUT';

        return axios({
            method,
            url: endpointPrefix + url + id,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Pin a forum thread
     *
     * @param {number} id - thread id
     * @param {boolean} pinned
     * @returns {Promise} resolved promise with the response.data object
     */
    pinForumsThread(id, pinned) {
        return axios.patch(`${endpointPrefix}/forums/thread/update/${id}`, {
            pinned,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Lock a forum thread
     *
     * @param {number} id - thread id
     * @param {boolean} locked
     * @returns {Promise} resolved promise with the response.data object
     */
    lockForumsThread(id, locked) {
        return axios.patch(`${endpointPrefix}/forums/thread/update/${id}`, {
            locked,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Delete a Forum thread
     *
     * @param {number} id - thread id
     * @returns {Promise} resolved promise with the response object
     */
    deleteForumsPost(id) {
        return axios.delete(`${endpointPrefix}/forums/post/delete/${id}`)
            .then(response => response)
            .catch(ErrorHandler);
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
            message: 'Refresh the page to try once more, if it happens again please let us know using the chat below.',
        });
    },
};
