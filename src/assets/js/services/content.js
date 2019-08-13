import axios from 'axios';
import ErrorHandler from './_error-handler';

let endpointPrefix;

if(typeof window != 'undefined'){
    endpointPrefix = window.ENDPOINT_PREFIX || '';
}

export default {

    /**
     * Get railcontent content by ID
     *
     * @returns {Promise} - resolved promise with the response object
     */
    getContentById(id) {
        return axios.get(`${endpointPrefix}/railcontent/content/${id}`)
            .then(response => response)
            .catch(ErrorHandler);
    },


    /**
     * Get railcontent content by an Array of IDs
     *
     * @returns {Promise} - resolved promise with the response object
     */
    getContentByIds(ids) {
        return axios.get(`${endpointPrefix}/railcontent/content/get-by-ids`, {
            params: {
                ids,
            },
        })
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Get an array of like users for a content id
     *
     * @returns {Promise} - resolved promise with the response object
     */
    getContentLikeUsers({ id, page = 1 }) {
        return axios.get(`${endpointPrefix}/railcontent/content-like/${id}`, {
            params: {
                page,
                limit: 10,
            },
        })
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Like content by ID
     *
     * @param {Boolean} is_liked
     * @param {String|Number} content_id
     * @param {String|Number} user_id
     * @returns {Promise} - resolved promise with the response object
     */
    likeContentById({ is_liked, content_id, user_id }) {
        return axios({
            url: `${endpointPrefix}/railcontent/content-like`,
            method: is_liked ? 'put' : 'delete',
            data: {
                content_id,
                user_id,
            },
        });
    },

    /**
     * Flag a piece of content as "complete"
     *
     * @param {String|Number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    markContentAsComplete(contentId) {
        return axios.put(`${endpointPrefix}/railcontent/complete`, {
            content_id: contentId,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Flag a piece of content as "started"
     *
     * @param {String|Number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    markContentAsStarted(contentId) {
        return axios.put(`${endpointPrefix}/railcontent/start`, {
            content_id: contentId,
        })
            .then(response => response.data)
            .catch((error) => {
                console.error(error);
            });
    },

    /**
     * Reset your progress for a piece of content
     *
     * @param {String|Number} contentId - the content ID
     * @returns {Promise} resolved promise with the response.data object
     */
    resetContentProgress(contentId) {
        return axios.put(`${endpointPrefix}/railcontent/reset`, {
            content_id: contentId,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Add or Remove content from your list
     *
     * @param content_id {String|Number}
     * @param is_added {boolean}
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    addOrRemoveContentFromList(content_id, is_added) {
        const delete_endpoint = `${endpointPrefix}/members-area/event-json-api/remove-from-primary-playlist-list`;
        const put_endpoint = `${endpointPrefix}/members-area/event-json-api/add-to-primary-playlist-list`;

        return axios.post(is_added ? delete_endpoint : put_endpoint, {
            content_id,
            type: is_added ? 'remove-from-list' : 'my-list-addition',
        })
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Mark a learning path as started (this changes the users current active learning path for
     * progress tracking)
     *
     * @param content_id {String|Number}
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    markLearningPathAsStarted(content_id) {
        return axios.post(`${endpointPrefix}/members/start-learning-path/${content_id}`)
            .then(response => response)
            .catch(ErrorHandler);
    },
};
