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
        const icon = element.querySelector('.fas');

        // Create a confirmation dialogue using Noty
        Toasts.confirm({
            text: 'Do you really want to reset your progress? <br><br><span class="tiny text-grey-3 font-italic">This cannot be undone.</span>',
            submitButton: {
                text: '<span class="bg-success text-white short">YES</span>',
                callback: () => {
                    icon.classList.remove('fa-redo-alt', 'fa-flip-horizontal');
                    icon.classList.add('fa-spin', 'fa-spinner');

                    Requests.resetContentProgress(contentId)
                        .then(resolved => {
                            if(resolved){
                                Toasts.success('Progress has been reset.');

                                setTimeout(() => {
                                    location.reload();
                                }, 100);
                            }

                            icon.classList.remove('fa-spin', 'fa-spinner');
                            icon.classList.add('fa-redo-alt', 'fa-flip-horizontal');
                        });
                }
            },
            cancelButton: {
                text: '<span class="bg-dark inverted text-grey-3 short">NO</span>',
            }
        });
    }

    function addToList(event){
        const element = event.target;
        const contentId = element.dataset['contentId'];
        const is_added = element.classList.contains('added');

        Requests.addOrRemoveContentFromList(contentId, is_added)
            .then(response => {
                if(response){
                    if(is_added){
                        element.classList.add('add-request-complete');
                    }
                    else {
                        element.classList.add('remove-request-complete');
                    }
                }
            });

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

            Requests.resetContentProgress(contentId)
                .then(resolved => {
                    if(resolved){
                        element.classList.add('remove-request-complete');
                    }
                });
        }
        else {
            element.classList.add('is-complete');

            Requests.markContentAsComplete(contentId)
                .then(resolved => {
                    if(resolved){
                        element.classList.add('add-request-complete');
                    }
                });
        }

    }
})();