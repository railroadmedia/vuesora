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
     * @returns {Promise} resolved promise with the response.data object
     */
    static getForumThreads(){
        return axios.get('/members/forum/threads-json')
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.error(error);

                Toasts.errorWarning('We\'re sorry! An unexpected error occurred. Please refresh the page and try again.');
            })
    }
}