export default {
    /**
     * Hide the intercom widget.
     */
    hideWidget() {
        const elements = document.getElementsByClassName('intercom-launcher');

        if (elements[0]) {
            elements[0].style.display = 'none';
        }
    },

    /**
     * Show the intercom widget.
     */
    showWidget() {
        const elements = document.getElementsByClassName('intercom-launcher');

        if (elements[0]) {
            elements[0].style.display = 'block';
        }
    },
};
