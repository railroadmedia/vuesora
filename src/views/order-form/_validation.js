export default {
    data(){
        return {
            formValid: false,
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

            this.formValid = errors.length > 0;

            this.errors[controlName] = errors;
        },

        validateForm() {
            console.log(Object.keys(this.rules));

            Object.keys(this.rules).forEach(key => {
                const formKey = `$_${ key }`;

                this.validateInput(key, this[formKey]);
            });
        },
    },
}