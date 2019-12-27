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

        document.addEventListener('click', (event) => {
            const element = event.target;

            if (element.matches('.addToList')) {
                addToList(event);
            }

            if (element.matches('.completeButton')) {
                markAsComplete(event);
            }

            if (element.matches('.resetProgress')) {
                progressReset(event);
            }
        });

        window.recalculateProgress = function (complete, master = false, brand = 'drumeo') {
            const numberOfAssignments = document.querySelectorAll('.assignment-component').length;
            const progressContainer = document.querySelector('.trophy-progress-bar');

            if (progressContainer) {
                const completeButton = document.querySelector('.completeButton');
                const completeUnderlay = document.querySelector('.white-underlay');
                const progressBar = document.querySelector('.trophy-progress');
                const progressText = progressBar.querySelector('.progress-percent');
                const currentProgress = progressBar ? progressBar.dataset.currentProgress : 0;
                const progressDifference = 100 / (master ? 1 : numberOfAssignments);
                let newProgress = null;

                if (complete) {
                    newProgress = Math.ceil(Number(currentProgress) + Number(progressDifference));
                } else {
                    newProgress = Math.floor(Number(currentProgress) - Number(progressDifference));
                }

                if (newProgress < 0) {
                    newProgress = 0;
                } else if (newProgress > 100) {
                    newProgress = 100;
                }

                if (progressBar) {
                    progressBar.style.transform = `translateX(${newProgress - 100}%)`;
                    progressBar.dataset.currentProgress = String(newProgress);
                    progressText.innerHTML = `${newProgress}%`;

                    if (newProgress <= 50) {
                        progressText.classList.add('right');
                    } else {
                        progressText.classList.remove('right');
                    }
                }

                if (newProgress >= 100) {
                    progressContainer.classList.add('complete');
                    if (completeButton) {
                        completeButton.classList.add('is-complete');
                    }
                    if (completeUnderlay) {
                        completeUnderlay.classList.add('visible');
                    }

                    Utils.triggerEvent(window, 'lesson-complete', { complete: true });
                } else {
                    progressContainer.classList.remove('complete');
                    if (completeButton) {
                        completeButton.classList.remove('is-complete');
                    }
                    if (completeUnderlay) {
                        completeUnderlay.classList.remove('visible');
                    }

                    if (newProgress <= 0) {
                        Utils.triggerEvent(window, 'lesson-complete', { complete: false });
                    }
                }
            }
        };

        function progressReset(event) {
            const element = event.target;
            const contentType = Utils.toTitleCase(element.dataset.contentType || 'content');
            const { contentId } = element.dataset;
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
                                            window.recalculateProgress(false, true, brand);
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
            const { contentId } = element.dataset;
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
            const { contentId } = element.dataset;
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

                                window.recalculateProgress(!isRemoving, true, brand);

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

                    window.recalculateProgress(!isRemoving, true, brand);

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

        function setClickTimeout() {
            clickTimeout = true;
            setTimeout(() => {
                clickTimeout = false;
            }, 200);
        }
    });
}());
