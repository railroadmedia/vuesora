/**
 * Toasts
 * Static methods for handling all success/error/dialog notifications.
 */


import Noty from 'noty';

export default class Toasts {

    /**
     * Display a basic success message
     *
     * @static
     * @param {string} text - the text to display in the success box
     * @returns {Object} - Noty object to render the notification
     */
    static success(text){
        return new Noty({
            type: 'success',
            theme: 'bootstrap-v4',
            text: text,
            timeout: 5000,
            layout: 'topRight'
        }).show();
    }

    /**
     * Display a basic success message
     *
     * @static
     * @param {string} text - the text to display in the warning box
     * @returns {Object} - Noty object to render the notification
     */
    static errorWarning(text = 'We\'re sorry! An unexpected error occurred. Please refresh the page and try again.'){
        return new Noty({
            type: 'warning',
            theme: 'bootstrap-v4',
            text: text + '<br><br><span class="tiny font-italic">If the problem persists, please <a href="mailto:support@recordeo.com" target="_blank">contact support.</a></span>',
            timeout: 5000,
            layout: 'topRight'
        }).show();
    }
}