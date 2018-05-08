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
            })
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
            })
    }
}