/**
 * Toasts
 * Methods for handling all success/error/dialog notifications with nicely styled prompts and dialogs.
 */

import Noty from 'noty';

export default {

    /**
     * Display a notification
     *
     * @param {String} icon - the icon to use ('happy', 'doh', 'astonished', 'mad', 'sad', 'xp')
     * @param {String} title - the colored title to display
     * @param {String} message - the bolded black message
     * @param {String} themeColor - the vuesora theme color for the title
     * @param {Number|Boolean} timeout - duration in milliseconds before it disappears (false to remove)
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
            theme: 'musoraNoty',
            text:
                '<div class="flex flex-column icon-column face-icon">' +
                '<div class="icon-wrap square ' + icon + '"></div>' +
                '</div>' +
                '<div class="flex flex-column ph-1">' +
                '<h6 class="tiny uppercase font-bold text-' + themeColor + '">' + title + '</h6>' +
                '<h5 class="tiny font-compressed">' + message + '</h5>' +
                '</div>' +
                '<div class="flex flex-column icon-column flex-center subheading">' +
                '<i class="fas fa-times"></i>' +
                '</div>',
            timeout: timeout,
            layout: 'topLeft',
        }).show();
    },

    /**
     * Display a confirmation dialog
     *
     * @param {String} title - the text to display in the confirmation box
     * @param {String} subtitle - the smaller text to display below the title
     * @param {String} themeColor - the vuesora theme color for the title
     * @param {Object} submitButton - object with a text and callback property
     * @param {Object} cancelButton - object with a text and callback property
     * @returns {Object} - Noty object to render the dialog
     */
    confirm({
        title,
        subtitle = 'This cannot be undone',
        submitButton = {
            text: '<span class="bg-success text-white">YES</span>',
            callback: null
        },
        cancelButton = {
            text: '<span class="bg-dark inverted text-grey-3">NO</span>',
            callback: null
        }
    }){
        window.confirmationBox = new Noty({
            layout: 'center',
            modal: true,
            theme: 'musoraNoty dialog',
            text: '<span class="title text-center font-bold text-black">' +
                title +
                '</span>' +
                '<br>' +
                '<span class="tiny text-black uppercase">' +
                subtitle +
                '</span>',
            closeWith: [],
            buttons: [
                Noty.button(
                    submitButton.text, 'btn mr-1', () => {
                        if(submitButton.callback != null) {
                            submitButton.callback();
                        }

                        window.confirmationBox.close();
                    }
                ),
                Noty.button(
                    cancelButton.text, 'btn', () => {
                        if(cancelButton.callback != null){
                            cancelButton.callback();
                        }

                        window.confirmationBox.close();
                    }
                )
            ]
        }).show();

        // Instantiate a click handler to close the modal when the user clicks the overlay
        if(window.closeConfirmation == null){
            window.closeConfirmation = true;
            document.body.addEventListener('click', event => {
                if(event.target.classList.contains('noty_modal')){
                    window.confirmationBox.close();
                }
            });
        }

        return window.confirmationBox;
    },
}