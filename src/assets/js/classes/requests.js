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
            .catch(error => {
                console.error(error);

                Toasts.errorWarning();
            });
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
            .catch(error => {
                console.error(error);

                Toasts.errorWarning();
            });
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
            .catch(error => {
                console.error(error);

                Toasts.errorWarning();
            });
    }
}