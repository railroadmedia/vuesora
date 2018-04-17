<template>
    <div class="toast shadow corners-3 pa">
            <p class="heading text-center">
                <i class="fas fa-check text-success" v-if="success"></i>
                <i class="fas fa-exclamation-triangle text-warning" v-else></i>
            </p>
            <p class="body text-white mb" v-if="success">
                {{ successMessage }}
            </p>
            <p class="body text-light mb" v-else>
                {{ errorMessage }}
            </p>
            <p class="tiny text-light mb" v-if="!success">
                If the problem persists, please <a href="mailto:support@recordeo.com" target="_blank">contact support.</a>
            </p>
            <p class="body text-right font-bold">
                <a  @click.stop="closeNotification" :class="brandTextClass">Close</a>
            </p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'toast-notification',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            active: {
                type: Boolean,
                default: () => false
            },
            success: {
                type: Boolean,
                default: () => true
            },
            successMessage: {
                type: String,
                default: () => 'Your request was successfully sent, thank you for your input'
            },
            errorMessage: {
                type: String,
                default: () => 'We\'re sorry, an unexpected error occured, please refresh the page and try again'
            }
        },
        computed: {
            brandTextClass (){
                return 'text-' + this.brand;
            }
        },
        methods: {
            closeNotification (){
                this.$parent.notify = false;
            }
        }
    }
</script>