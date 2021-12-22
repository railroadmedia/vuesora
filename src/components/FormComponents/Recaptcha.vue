<template>
    <vue-recaptcha ref="recaptcha"
        @verify="onVerify" 
        :sitekey="siteKey"
    />
</template>
<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
    components: {
        VueRecaptcha
    },
    props: {
        siteKey: {
            type: String,
            required: true,
        }
    },
    methods: {
        onVerify: function (response) {
            if (response) {
                this.$emit('update:verified', response);
            }
        },
    },


}
</script>