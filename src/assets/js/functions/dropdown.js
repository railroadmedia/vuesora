export default (function () {
    document.addEventListener('DOMContentLoaded', () => {
        const dropdownActivators = document.querySelectorAll('.is-dropdown');

        if (dropdownActivators.length) {
            Array.from(dropdownActivators).forEach((element) => {
                element.addEventListener('click', triggerDropdown);

                // Dont Allow events on child elements (ie. the dropdown content) to propagate
                Array.from(element.children).forEach((childElement) => {
                    childElement.addEventListener('click', (event) => {
                        event.stopPropagation();
                    });
                });
            });

            document.addEventListener('click', closeAllDropdowns);
        }

        function triggerDropdown(event) {
            const element = event.target;

            event.stopPropagation();

            element.classList.toggle('inverted');
            element.classList.toggle('active');
        }

        function closeAllDropdowns() {
            Array.from(dropdownActivators).forEach((element) => {
                element.classList.replace('active', 'inverted');
            });
        }
    });
}());
