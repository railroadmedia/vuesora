/**
 * Toasts
 * Static methods for handling all success/error/dialog notifications.
 */

import Noty from 'noty';

export default {

    /**
     * Display a basic success message
     *
     * @param {string} text - the text to display in the success box
     * @returns {Object} - Noty object to render the notification
     */
    success(text){
        return new Noty({
            type: 'alert',
            theme: 'bootstrap-v4',
            id: 'musoraNoty',
            text: text,
            timeout: 5000,
            layout: 'topLeft',
        }).show();
    },

    /**
     * Display a notification
     *
     * @param {string} icon - the icon to use ('happy', 'doh', 'astonished', 'mad', 'sad', 'xp')
     * @param {string} title - the colored title to display
     * @param {string} message - the bolded black message
     * @param {string} themeColor - the vuesora theme color for the title
     * @param {number|boolean} timeout - duration in milliseconds before it disappears (false to remove)
     * @returns {Object} - Noty object to render the notification
     */
    push({
        icon,
        title,
        message,
        themeColor = 'drumeo',
        timeout = 5000
    }){
        return new Noty({
            type: 'alert',
            id: 'musoraNoty',
            text:
                '<div class="flex flex-column icon-column">' +
                '<div class="icon-wrap square ' + icon + '"></div>' +
                '</div>' +
                '<div class="flex flex-column ph-1">' +
                '<h6 class="tiny uppercase text-' + themeColor + '">' + title + '</h6>' +
                '<h5 class="body font-bold font-compressed">' + message + '</h5>' +
                '</div>' +
                '<div class="flex flex-column icon-column flex-center subheading">' +
                '<i class="fas fa-times"></i>' +
                '</div>',
            timeout: timeout,
            layout: 'topLeft',
        }).show();
    },

    /**
     * Display a basic error warning
     *
     * @param {string} text - the text to display in the warning box
     * @returns {Object} - Noty object to render the notification
     */
    errorWarning(text = 'We\'re sorry! An unexpected error occurred. Please refresh the page and try again.'){
        return new Noty({
            type: 'warning',
            theme: 'bootstrap-v4',
            text: text + '<br><br><span class="tiny font-italic">If the problem persists, please <a href="mailto:support@recordeo.com" target="_blank">contact support.</a></span>',
            timeout: 5000,
            layout: 'topLeft'
        }).show();
    },

    /**
     * Display a confirmation dialog
     *
     * @param {string} text - the text to display in the confirmation box
     * @param {object} submitButton - object with a text and callback property
     * @param {object} cancelButton - object with a text and callback property
     * @returns {Object} - Noty object to render the dialog
     */
    confirm({
        text,
        submitButton = {
            text: '<span class="bg-success text-white short">YES</span>',
            callback: null
        },
        cancelButton = {
            text: '<span class="bg-dark inverted text-grey-3 short">NO</span>',
            callback: null
        }
    }){
        const notification = new Noty({
            layout: 'center',
            modal: true,
            text: text,
            theme: 'bootstrap-v4',
            closeWith: [],
            buttons: [
                Noty.button(
                    submitButton.text, 'btn mr-1', () => {
                        if(submitButton.callback != null) {
                            submitButton.callback();
                        }

                        notification.close();
                    }
                ),
                Noty.button(
                    cancelButton.text, 'btn', () => {
                        if(cancelButton.callback != null){
                            cancelButton.callback();
                        }

                        notification.close();
                    }
                )
            ]
        }).show();

        return notification;
    }
}