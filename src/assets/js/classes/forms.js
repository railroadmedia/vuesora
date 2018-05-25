/**
 * Forms
 * Custom event listeners and validation for different form inputs
 */

// import validator from 'validator';
import flatpickr from "flatpickr";

export default class Forms {
    constructor(form){
        this.formElement = form;

        Forms.removeInputEventListeners();

        Forms.addInputEventListeners();
    }

    /**
     * Add event listeners to all inputs to affect the label on change
     *
     * @static
     */
    static addInputEventListeners(){
        const inputs = document.querySelectorAll('input, textarea, select');

        Array.from(inputs).forEach(input => {
            input.addEventListener('change', Forms.handleInputChange);

            // Add the has-input class if the input came pre filled out
            if(input.value){
                input.classList.add('has-input');
            }
        });
    }

    /**
     * Remove all input event listeners if needed
     *
     * @static
     */
    static removeInputEventListeners(){
        const inputs = document.querySelectorAll('input, textarea, select');

        Array.from(inputs).forEach(input => {
            input.removeEventListener('change', Forms.handleInputChange);
        });
    }

    /**
     * Add a class to inputs on change to affect the label
     *
     * @static
     */
    static handleInputChange(event){
        const element = event.target;

        if(element.value.length){
            element.classList.add('has-input');
        }
        else {
            element.classList.remove('has-input');
        }
    }

    /**
     * Mount the flatpickr component onto any input with the .flatpickr class
     *
     * @static
     */
    static initializeFlatpickrInputs(){
        const flatpickrInputs = document.querySelectorAll('.flatpickr');

        Array.from(flatpickrInputs).forEach(input => {
            // Check for the class .enable-time to enable the time input
            let enableTime = input.classList.contains('enable-time');
            let dateFormat = "Y-m-d";
            let altFormat = "F j, Y";

            // If the time input is enabled the formats need to change
            if(enableTime){
                dateFormat = "Y-m-d H:i:s";
                altFormat = "F j, Y \\a\\t h:i"
            }

            flatpickr(input, {
                enableTime: enableTime,
                altInput: true,
                altFormat: altFormat,
                dateFormat: dateFormat,
            });
        });
    }

    static checkErrorsInModalForms(){
        const erroredInputs = document.querySelectorAll('input.has-error');

        if(erroredInputs.length > 0){
            let parentModal = erroredInputs[0].parentElement;

            while(parentModal != null && !parentModal.classList.contains('modal')){
                parentModal = parentModal.parentElement;
            }

            if(parentModal){
                parentModal.classList.add('active');
                window.appendBackgroundOverlay();
            }
        }
    }
}