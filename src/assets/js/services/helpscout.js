export default {
    /**
     * Hide the intercom widget.
     */
    hideWidget() {
        const element = document.getElementById('beacon-container');

        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * Show the intercom widget.
     */
    showWidget() {
        const element = document.getElementById('beacon-container');

        if (element) {
            element.style.display = 'block';
        }
    },
};
