import axios from 'axios';
import Noty from 'noty';
import Toasts from '../classes/toasts';

require('es6-promise').polyfill();

export default (function () {
    const addToListButtons = document.querySelectorAll('.addToList');
    const removeFromListButtons = document.querySelectorAll('.removeFromList');
    const resetProgressButtons = document.querySelectorAll('.resetProgress');

    if(addToListButtons.length){
        Array.from(addToListButtons).forEach(button => {
            button.addEventListener('click', addToList);
        });
    }

    if(resetProgressButtons.length){
        Array.from(resetProgressButtons).forEach(button => {
            button.addEventListener('click', resetProgress);
        });
    }

    function addToList(event){
        let eventInfo = getEventInfo(event);
    }

    function resetProgress(event){
        let eventInfo = getEventInfo(event);

        // Create a confirmation dialogue using Noty
        const notification = new Noty({
            layout: 'center',
            modal: true,
            text: 'Do you really want to reset your progress? <br><br><span class="tiny font-bold font-italic">This cannot be undone.</span>',
            theme: 'bootstrap-v4',
            closeWith: [],
            buttons: [
                // Confirm Button
                Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                    sendRequest(eventInfo.endpoint, 'DELETE', { contentId: eventInfo.contentId })
                        .then(resolved => {
                            notification.close();

                            if(resolved){
                                Toasts.success('Success! Your Progress has been reset.');
                            }
                        })
                }),
                // Cancel Button
                Noty.button('<span class="bg-dark inverted text-dark short">NO</span>', 'btn', () => {
                    notification.close();
                })
            ]
        }).show();
    }

    function getEventInfo(event){
        let element = event.target,
            contentId = element.dataset['content-id'];

        return {
            contentId: contentId,
            endpoint: '/event-endpoint'
        }
    }

    function sendRequest(endpoint, method, data = {}){
        return axios({
            method: method,
            url: endpoint,
            data: data
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            Toasts.errorWarning('We\'re sorry! An unexpected error occurred. Please refresh the page and try again.');

            console.error(error);
        })
    }
})();