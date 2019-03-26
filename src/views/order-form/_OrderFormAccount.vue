<template>
    <div class="flex flex-column mv-2">
        <div v-if="state == 'billing'">
            <div class="flex flex-row align-v-center pb-2">
                <h3 class="heading color-blue">Billing Email</h3>
                <a class="body color-blue font-underline pl-3" v-on:click.stop.prevent="showLoginForm">Have an account?</a>
            </div>
            <div class="flex flex-column bg-white shadow corners-5 pa-3">
                <h4 class="body">Email input</h4>
            </div>
        </div>

        <div v-if="state == 'login'">
            <div class="flex flex-row align-h-left align-v-center pb-2">
                <div class="flex-auto">
                    <h3 class="heading color-blue">Log In To Your Account</h3>
                </div>
                <div class="flex flex-grow">
                    <a class="body color-blue font-underline pl-3" v-on:click.stop.prevent="showBillingEmailForm">Checkout as guest</a>
                </div>
                <div class="flex-auto">
                    <h4 class="body text-dark">All fields are mandatory.</h4>
                </div>
            </div>
            <div class="flex flex-column bg-white shadow corners-5 pa-3">
                <h4 class="body">Login form</h4>
                <h4 class="body">Login error message & forgot password link</h4>
            </div>
        </div>

        <div v-if="state == 'account'">
            <div class="flex flex-row align-v-center pb-2">
                <div class="flex flex-grow">
                    <h3 class="heading color-blue">Add To Existing Account</h3>
                </div>
                <div class="flex-auto">
                    <a class="body color-blue font-underline" v-on:click.stop.prevent="logout">Need to log in to a different account?</a>
                </div>
            </div>
            <div class="flex flex-row bg-white shadow corners-5 pa-3">
                <div class="flex flex-column">
                    <h4 class="body text-dark">You are logged in as:</h4>
                    <h4 class="subheading">{{ currentUser.email }}</h4>
                </div>
                <div class="flex flex-column md-5 sm-12">
                    <h4 class="body text-dark">Your products will be added to the account you are currently logged in with. </h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'order-form-account',
        props: {
            currentUser: {
                type: Object,
                default: () => null
            },
        },
        data() {
            return {
                state: 'billing', // states: billing, login, account
            }
        },
        methods: {
            showBillingEmailForm() {
                this.state = 'billing';
            },
            logout() {
                // todo - add logout AJAX request
                this.state = 'login';
            },
            showLoginForm() {
                this.state = 'login';
            },
            showAccountDetails() {
                this.state = 'account';
            },
        },
        mounted() {
            this.state = (this.currentUser == null) ? 'billing' : 'account';
        }
    }
</script>
<style lang="scss">
    .color-blue {
        color: dodgerblue;
    }

</style>
