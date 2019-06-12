export default {
    computed: {
        formValid(){
            const errorKeys = Object.keys(this.errors);
            let isValid = true;

            errorKeys.forEach(error => {
                if(this.errors[error].length){
                    isValid = false;
                }
            });

            return isValid;
        }
    },

    methods: {
        validateInput(controlName, value) {
            const errors = [];

            this.rules[controlName].forEach(rule => {
                if(rule(value) !== true){
                    errors.push(rule(value));
                }
            });

            this.errors[controlName] = errors;
        },

        validateForm() {
            Object.keys(this.rules).forEach(key => {
                const formKey = `$_${ key }`;

                this.validateInput(key, this[formKey]);
            });
        },
    },
}