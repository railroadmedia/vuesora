import axios from 'axios';
import Noty from 'noty';
import Toasts from '../classes/toasts';
import Requests from '../classes/requests';

export default (function () {
    const addToListButtons = document.querySelectorAll('.addToList');
    const removeFromListButtons = document.querySelectorAll('.removeFromList');
    const markAsCompleteButtons = document.querySelectorAll('.completeButton');
    const resetProgressButtons = document.querySelectorAll('.resetProgress');

    if(addToListButtons.length){
        Array.from(addToListButtons).forEach(button => {
            button.addEventListener('click', addToList);
        });
    }

    if(markAsCompleteButtons.length){
        Array.from(markAsCompleteButtons).forEach(button => {
            button.addEventListener('click', markAsComplete);
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
        const element = event.target;
        const contentId = element.dataset['contentId'];

        // Create a confirmation dialogue using Noty
        const notification = new Noty({
            layout: 'center',
            modal: true,
            text: 'Do you really want to reset your progress? <br><br><span class="tiny text-dark font-italic">This cannot be undone.</span>',
            theme: 'bootstrap-v4',
            closeWith: [],
            buttons: [
                // Confirm Button
                Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                    notification.close();

                    Requests.resetContentProgress(contentId)
                        .then(resolved => {
                            if(resolved){
                                Toasts.success('Progress has been reset.');
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

    function markAsComplete(event){
        const element = event.target;
        const contentId = element.dataset['contentId'];

        if(element.classList.contains('is-complete')){
            element.classList.remove('is-complete');

            Requests.markContentAsStarted(contentId)
                .then(resolved => {

                });
        }
        else {
            element.classList.add('is-complete');

            Requests.markContentAsComplete(contentId)
                .then(resolved => {

                });
        }

    }

    function getEventInfo(event){
        let element = event.target,
            contentId = element.dataset['contentId'];

        return {
            contentId: contentId,
            endpoint: '/railcontent/reset'
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
            console.error(error);

            Toasts.errorWarning();
        })
    }
})();