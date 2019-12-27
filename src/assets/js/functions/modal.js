import Utils from '../classes/utils';

export default (function () {
    document.addEventListener('DOMContentLoaded', () => {
        const topBar = document.getElementById('nav');
        const closeEvent = new CustomEvent('modalClose');

        document.body.addEventListener('click', (event) => {
            const buttonClicked = event.target;
            const modalId = buttonClicked.dataset.openModal;

            if (modalId != null) {
                openModal(modalId, buttonClicked);
            }

            if (buttonClicked.classList.contains('close-modal')) {
                closeModal();
            }
        });

        document.body.addEventListener('openModal', (event) => {
            openModal(event.detail.target);
        });

        function openModal(modalId, buttonClicked) {
            const openEvent = new CustomEvent('modalOpen', {
                detail: {
                    trigger: buttonClicked,
                },
            });
            const modalToOpen = document.getElementById(modalId);

            closeModal();

            event.stopPropagation();

            if (modalToOpen) {
                window.appendBackgroundOverlay();

                document.body.classList.add('no-scroll');
                document.documentElement.classList.add('no-scroll');
                modalToOpen.classList.add('displayed');
                setTimeout(() => {
                    modalToOpen.classList.add('active');
                }, 50);

                modalToOpen.dispatchEvent(openEvent);
            } else {
                console.error(`Modal Error - Could not find modal with the ID: "${modalId}"`);
            }
        }

        function closeModal() {
            const modalOverlay = document.getElementById('modalOverlay');
            const modalDialogs = document.querySelectorAll('.modal');

            // Remove the event listeners from the overlay and remove it from the DOM
            if (modalOverlay) {
                modalOverlay.removeEventListener('click', closeModal);
                document.body.removeChild(modalOverlay);
                document.body.classList.remove('no-scroll');
                document.documentElement.classList.remove('no-scroll');

                document.body.style.paddingRight = '0';
                topBar.style.paddingRight = '0';

                window.dispatchEvent(closeEvent);
            }

            // Remove the active class from all Modals (easier than finding the specific one open)
            Array.from(modalDialogs).forEach((dialog) => {
                dialog.classList.remove('active');
                dialog.classList.remove('displayed');
            });

            // window.modalSimpleBar = null;
        }

        window.closeAllModals = function () {
            closeModal();
        };

        window.appendBackgroundOverlay = function () {
            const modalOverlay = document.createElement('div');

            // Add ID to overlay
            modalOverlay.setAttribute('id', 'modalOverlay');

            // Append to the DOM
            document.body.appendChild(modalOverlay);

            // Add active class to fade in
            modalOverlay.classList.add('active');

            // Add an event listener
            modalOverlay.addEventListener('click', closeModal);

            // Add padding to the right of the page if there's a scrollbar
            const bodyHeight = document.body.clientHeight;
            const clientHeight = document.documentElement.clientHeight;

            if (bodyHeight > clientHeight) {
                document.body.style.paddingRight = `${Utils.getScrollBarWidth()}px`;
                topBar.style.paddingRight = `${Utils.getScrollBarWidth()}px`;
            }
        };
    });
}());
