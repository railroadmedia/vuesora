<template>
    <div class="flex flex-column mv-2">
        <div v-if="state == 'billing'">
            <div v-if="!requiresAccount">
                <div class="flex flex-row align-v-center pb-2">
                    <h3 class="heading color-blue">Billing Email</h3>
                    <a class="body color-blue font-underline pl-3" v-on:click.stop.prevent="login">Already have an account? Click here to login.</a>
                </div>
                <div class="flex flex-column bg-white shadow corners-5 pa-3">
                    <input
                        type="email"
                        name="billing-email"
                        placeholder="Email Address"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.billingEmail }"
                        v-model="controls.billingEmail"
                        v-on:blur="validateControl('billingEmail')">
                        <!-- todo - add event trigger to save billing address on blur -->
                    <span class="validation tiny">{{ validation.billingEmail }}</span>
                </div>
            </div>
            <div v-if="requiresAccount">
                <div class="flex flex-row align-v-center pb-2">
                    <div class="flex flex-grow flex-row align-v-center">
                        <h3 class="heading color-blue">Create Your Account</h3>
                        <a class="body color-blue font-underline pl-3" v-on:click.stop.prevent="login">Already have an account? Click here to login.</a>
                    </div>
                    <div class="flex flex-auto">
                        <h4 class="body text-dark">All fields are mandatory.</h4>
                    </div>
                </div>
                <div class="flex flex-row bg-white shadow corners-5 pv-3 ph-2">
                    <div class="flex flex-column ph-1">
                        <input
                            type="email"
                            name="account-creation-email"
                            placeholder="Email Address"
                            class="order-form-input no-label"
                            v-bind:class="{ invalid: validation.accountEmail }"
                            v-model="controls.accountEmail"
                            v-on:blur="validateControl('accountEmail')">
                        <span class="validation tiny">{{ validation.accountEmail }}</span>
                    </div>
                    <div class="flex flex-column ph-1">
                        <input
                            type="password"
                            name="account-creation-password"
                            placeholder="Password"
                            class="order-form-input no-label"
                            v-bind:class="{ invalid: validation.accountPassword }"
                            v-model="controls.accountPassword"
                            v-on:blur="validateControl('accountPassword') || validatePasswordConfirmation()">
                        <span class="validation tiny">{{ validation.accountPassword }}</span>
                    </div>
                    <div class="flex flex-column ph-1">
                        <input
                            type="password"
                            placeholder="Password Confirm"
                            class="order-form-input no-label"
                            v-bind:class="{ invalid: validation.accountPasswordConfirmation }"
                            v-model="controls.accountPasswordConfirmation"
                            v-on:blur="validatePasswordConfirmation()">
                        <span class="validation tiny">{{ validation.accountPasswordConfirmation }}</span>
                    </div>
                </div>
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
    import ValidationTriggerMixin from './_mixin';

    export default {
        mixins: [ValidationTriggerMixin],
        name: 'order-form-account',
        props: {
            currentUser: {
                type: Object,
                default: () => null
            },
            requiresAccount: {
                type: Boolean,
                default: () => false
            },
            loginUrl: {
                type: String,
                default: '/login',
            },
            logoutUrl: {
                type: String,
                default: '/',
            },
        },
        data() {
            return {
                state: 'billing', // states: billing, account
                validation: {
                    billingEmail: '',
                    accountEmail: '',
                    accountPassword: '',
                    accountPasswordConfirmation: '',
                },
                controls: {
                    billingEmail: '',
                    accountEmail: '',
                    accountPassword: '',
                    accountPasswordConfirmation: '',
                },
                rules: {
                    billingEmail: {
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Invalid billing email address'
                    },
                    accountEmail: {
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Invalid email address'
                    },
                    accountPassword: {
                        pattern: /([^\s])/,
                        message: 'Invalid password'
                    }
                }
            }
        },
        computed: {
            createLabel() {
                return this.requiresAccount ? 'Create a new account' : 'Checkout as guest';
            }
        },
        methods: {
            validateControl(controlName) {

                return this.validation[controlName] = (
                    this.rules.hasOwnProperty(controlName) &&
                    this.controls.hasOwnProperty(controlName) &&
                    (
                        this.controls[controlName] == null ||
                        !this.rules[controlName].pattern.test(this.controls[controlName])
                    )
                ) ? this.rules[controlName].message : '';
            },
            validatePasswordConfirmation() {

                return this.validation.accountPasswordConfirmation = this.controls.accountPassword &&
                        this.controls.accountPassword != this.controls.accountPasswordConfirmation ?
                            'Invalid password confirmation' : '';
            },
            showBillingEmailForm() {
                this.state = 'billing';
            },
            login() {
                // todo - test SSO
                window.location.assign(this.loginUrl);
            },
            logout() {
                window.location.assign(this.logoutUrl);
            },
            validateForm() {

                let validationSuccessful = true;

                if (!this.currentUser) {
                    // if user logged in, no form controls to validate

                    let controls = this.requiresAccount ?
                        ['accountEmail', 'accountPassword'] : ['billingEmail'];

                    controls.forEach((control) => {
                        validationSuccessful = !this.validateControl(control) && validationSuccessful;
                    });

                    validationSuccessful = validationSuccessful && !this.validatePasswordConfirmation();
                }

                this.$emit(
                    'registerSubformValidation',
                    {
                        form: 'account',
                        result: validationSuccessful
                    }
                );
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
