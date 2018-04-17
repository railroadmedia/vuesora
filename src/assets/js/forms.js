// import validator from 'validator';

export default class Forms {
    constructor(form){
        this.formElement = form;

        Forms.removeInputEventListeners();

        Forms.addInputEventListeners();
    }

    static addInputEventListeners(){
        const inputs = document.querySelectorAll('input');
        const textareas = document.querySelectorAll('textarea');

        Array.from(inputs).forEach(input => {
            input.addEventListener('change', Forms.handleInputChange);
        });

        Array.from(textareas).forEach(input => {
            input.addEventListener('change', Forms.handleInputChange);
        });
    }

    static removeInputEventListeners(){
        const inputs = document.querySelectorAll('input');
        const textareas = document.querySelectorAll('textarea');

        Array.from(inputs).forEach(input => {
            input.removeEventListener('change', Forms.handleInputChange);
        });

        Array.from(textareas).forEach(input => {
            input.removeEventListener('change', Forms.handleInputChange);
        });
    }

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