import Utils from '../classes/utils';
import Simplebar from 'simplebar';

export default (function(){
    const modalTriggers = document.querySelectorAll('[data-open-modal]');
    const closeButtons = document.querySelectorAll('.close-modal');
    const topBar = document.getElementById('nav');
    const closeEvent = new CustomEvent('modalClose');

    // Add event listeners to every trigger button
    // Array.from(modalTriggers).forEach(trigger => {
    //     trigger.addEventListener('click', openModal);
    // });

    // Add Event Listeners to every close button
    // Array.from(closeButtons).forEach(button => {
    //     button.addEventListener('click', closeModal);
    // });

    document.body.addEventListener('click', event => {

        if(event.target.dataset['openModal'] != null){
            openModal(event);
        }

        if(event.target.classList.contains('close-modal')){
            closeModal();
        }
    });

    function openModal(event){
        const buttonClicked = event.target;
        const modalId = buttonClicked.dataset['openModal'];
        const modalToOpen = document.getElementById(modalId);

        closeModal();

        event.stopPropagation();

        if(modalToOpen){
            const modalInsideContainer = modalToOpen.children[0];
            window.appendBackgroundOverlay();

            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
            modalToOpen.classList.add('active');

            window.modalSimpleBar = new Simplebar(modalInsideContainer);
        }
        else {
            console.error('Modal Error - Could not find modal with the ID: "' + modalId +  '"');
        }
    }

    function closeModal(){
        const modalOverlay = document.getElementById('modalOverlay');
        const modalDialogs = document.querySelectorAll('.modal');

        // Remove the event listeners from the overlay and remove it from the DOM
        if(modalOverlay){
            modalOverlay.removeEventListener('click', closeModal);
            document.body.removeChild(modalOverlay);
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');

            document.body.style.paddingRight = '0';
            topBar.style.paddingRight = '0';

            window.dispatchEvent(closeEvent);
        }

        // Remove the active class from all Modals (easier than finding the specific one open)
        Array.from(modalDialogs).forEach(dialog => {
            dialog.classList.remove('active');
        });

        window.modalSimpleBar = null;
    }

    window.closeAllModals = function(){
        closeModal();
    };

    window.appendBackgroundOverlay = function(){
        const modalOverlay = document.createElement('div');

        // Add ID to overlay
        modalOverlay.setAttribute('id', 'modalOverlay');

        // Append to the DOM
        document.body.appendChild(modalOverlay);

        // Add active class to fade in
        modalOverlay.classList.add('active');

        // Add an event listener
        modalOverlay.addEventListener('click', closeModal);

        document.body.style.paddingRight = Utils.getScrollBarWidth() + 'px';
        topBar.style.paddingRight = Utils.getScrollBarWidth() + 'px';
    }
})();