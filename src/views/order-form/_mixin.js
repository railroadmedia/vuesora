export default {
    props: {
        validationTrigger: {
            type: Boolean,
            default: () => false
        },
    },
    watch: {
        validationTrigger: function() {
            if (typeof this.validateForm === 'function') {
                this.validateForm();
            } else {
                console.error(
                    "validateForm method is not defined in all components using ValidationTrigger _mixin"
                );
            }
        }
    }
}
