import Toasts from '../classes/toasts';
import ContentService from '../services/content';
import Utils from '../classes/utils';

export default (function () {
    document.addEventListener('DOMContentLoaded', () => {
        const markAsCompleteButtons = document.querySelectorAll('.completeButton');
        const addToListButtons = document.querySelectorAll('.addToList');
        const resetProgressButtons = document.querySelectorAll('.resetProgress');
        let clickTimeout = false;
        let isRequesting = false;

        window.addEventListener('vue-requesting-completion', (event) => {
            isRequesting = true;
        });

        window.addEventListener('vue-request-complete', (event) => {
            isRequesting = false;
        });

        if (markAsCompleteButtons.length) {
            Array.from(markAsCompleteButtons).forEach((button) => {
                button.addEventListener('click', markAsComplete);
            });
        }

        if (addToListButtons.length) {
            Array.from(addToListButtons).forEach((button) => {
                button.addEventListener('click', addToList);
            });
        }

        if (resetProgressButtons.length) {
            Array.from(resetProgressButtons).forEach((button) => {
                button.addEventListener('click', progressReset);
            });
        }

        function progressReset(event) {
            const element = event.target;
            const contentType = Utils.toTitleCase(element.dataset.contentType || 'content');
            const contentId = element.dataset.contentId;
            const brand = element.dataset.brand || 'drumeo';
            const icon = element.querySelector('.fas');

            if (!clickTimeout) {
                Toasts.confirm({
                    title: 'Hold your horses… This will reset all of your progress, are you sure about this?',
                    submitButton: {
                        text: `<span class="bg-${brand} text-white short">YES</span>`,
                        callback: () => {
                            icon.classList.remove('fa-redo-alt', 'fa-flip-horizontal');
                            icon.classList.add('fa-spin', 'fa-spinner');

                            ContentService.resetContentProgress(contentId)
                                .then((resolved) => {
                                    if (resolved) {
                                        Toasts.push({
                                            icon: 'happy',
                                            title: 'REMOVED!',
                                            themeColor: brand,
                                            message: 'Your progress has been reset.',
                                        });

                                        if (document.querySelector('.trophy-progress')) {
                                            document.querySelector('.trophy-progress').style.width = 0;
                                        }
                                        Array.from(resetProgressButtons).forEach((button) => {
                                            button.parentElement.classList.add('hide');
                                        });
                                    }

                                    icon.classList.remove('fa-spin', 'fa-spinner');
                                    icon.classList.add('fa-redo-alt', 'fa-flip-horizontal');

                                    window.location.reload();
                                });
                        },
                    },
                    cancelButton: {
                        text: '<span class="bg-grey-3 inverted text-grey-3 short">NO</span>',
                    },
                });
            }

            setClickTimeout();
        }

        function addToList(event) {
            const element = event.target;
            const contentId = element.dataset.contentId;
            const is_added = element.classList.contains('added');


            if (!clickTimeout) {
                ContentService.addOrRemoveContentFromList(contentId, is_added)
                    .then((response) => {
                        if (response) {
                            if (is_added) {
                                element.classList.add('add-request-complete');
                            } else {
                                element.classList.add('remove-request-complete');
                            }
                        }
                    });

                if (is_added) {
                    element.classList.remove('added', 'text-white');
                    element.classList.add('inverted');
                } else {
                    element.classList.add('added', 'text-white');
                    element.classList.remove('inverted');
                }
            }

            setClickTimeout();
        }

        function markAsComplete(event) {
            const element = event.target;
            const contentId = element.dataset.contentId;
            const isRemoving = element.classList.contains('is-complete');
            const brand = element.dataset.brand || 'drumeo';

            Utils.triggerEvent(window, 'requesting-completion');

            if (!clickTimeout && !isRequesting) {
                if (isRemoving) {
                    Toasts.confirm({
                        title: 'Hold your horses… This will reset all of your progress, are you sure about this?',
                        submitButton: {
                            text: `<span class="bg-${brand} text-white">Reset</span>`,
                            callback: () => {
                                element.classList.remove('is-complete');

                                handleCompleteEvent(isRemoving);

                                ContentService.resetContentProgress(contentId)
                                    .then((resolved) => {
                                        if (resolved) {
                                            Toasts.push({
                                                icon: 'happy',
                                                title: 'READY TO START AGAIN?',
                                                themeColor: brand,
                                                message: 'Your progress has been reset.',
                                            });

                                            element.classList.add('remove-request-complete');
                                        }

                                        isRequesting = false;
                                    });
                            },
                        },
                        cancelButton: {
                            text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                        },
                    });
                } else {
                    element.classList.add('is-complete');

                    handleCompleteEvent(isRemoving);

                    ContentService.markContentAsComplete(contentId)
                        .then((resolved) => {
                            if (resolved) {
                                element.classList.add('add-request-complete');
                            }

                            isRequesting = false;
                        });
                }
            }

            setClickTimeout();
        }

        window.recalculateProgress = function (complete) {
            const numberOfAssignments = document.querySelectorAll('.assignment-component').length;
            const progressContainer = document.querySelector('.trophy-progress-bar');

            if (progressContainer) {
                const completeButton = document.querySelector('.completeButton');
                const progressBar = document.querySelector('.trophy-progress');
                const currentProgress = progressBar ? progressBar.style.width.replace(/%/g, '') : 0;
                const progressDifference = 100 / numberOfAssignments;
                let newProgress = null;

                if (complete) {
                    newProgress = Math.ceil(Number(currentProgress) + Number(progressDifference));
                } else {
                    newProgress = Math.ceil(Number(currentProgress) - Number(progressDifference));
                }

                if (progressBar) {
                    progressBar.style.width = `${newProgress}%`;
                }

                if (newProgress >= 100) {
                    progressContainer.classList.add('complete');
                    completeButton.classList.add('is-complete');
                } else {
                    progressContainer.classList.remove('complete');
                    completeButton.classList.remove('is-complete');
                }
            }
        };

        function handleCompleteEvent(removing = false) {
            const progressContainer = document.querySelector('.trophy-progress-bar');
            const progressBar = document.querySelector('.trophy-progress');

            Utils.triggerEvent(window, 'lesson-complete', { complete: !removing });

            if (progressBar) {
                progressBar.style.width = removing ? '0%' : '100%';
            }

            if (progressContainer) {
                progressContainer.classList.toggle('complete');
            }
        }

        function setClickTimeout() {
            clickTimeout = true;
            setTimeout(() => {
                clickTimeout = false;
            }, 200);
        }
    });
}());
