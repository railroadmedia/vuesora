import axios from 'axios';
import Noty from 'noty';
import Toasts from '../classes/toasts';
import Requests from '../classes/requests';

export default (function () {
    const markAsCompleteButtons = document.querySelectorAll('.completeButton');
    const addToListButtons = document.querySelectorAll('.addToList');
    const resetProgressButtons = document.querySelectorAll('.resetProgress');

    if(markAsCompleteButtons.length){
        Array.from(markAsCompleteButtons).forEach(button => {
            button.addEventListener('click', markAsComplete);
        });
    }

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

    function resetProgress(event){
        const element = event.target;
        const contentId = element.dataset['contentId'];

        // Create a confirmation dialogue using Noty
        const notification = new Noty({
            layout: 'center',
            modal: true,
            text: 'Do you really want to reset your progress? <br><br><span class="tiny text-grey-3 font-italic">This cannot be undone.</span>',
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

                                setTimeout(() => {
                                    location.reload();
                                }, 100);
                            }
                        })
                }),
                // Cancel Button
                Noty.button('<span class="bg-dark inverted text-grey-3 short">NO</span>', 'btn', () => {
                    notification.close();
                })
            ]
        }).show();
    }

    function addToList(event){
        const element = event.target;
        const contentId = element.dataset['contentId'];
        const is_added = element.classList.contains('added');

        Requests.addOrRemoveContentFromList(contentId, is_added)
            .then(response => response);

        if(is_added){
            element.classList.remove('added', 'text-white');
            element.classList.add('inverted');
        }
        else {
            element.classList.add('added', 'text-white');
            element.classList.remove('inverted');
        }
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
})();