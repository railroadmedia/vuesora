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
}