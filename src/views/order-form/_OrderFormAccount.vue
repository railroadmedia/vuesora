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
                        v-model.lazy="billingEmail">
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
                            v-model.lazy="accountEmail">
                        <span class="validation tiny">{{ validation.accountEmail }}</span>
                        <a class="tiny color-blue font-underline" :href="loginUrl" v-if="emailExists">Forgot your password?</a>
                    </div>
                    <div class="flex flex-column ph-1">
                        <input
                            type="password"
                            name="account-creation-password"
                            placeholder="Password"
                            class="order-form-input no-label"
                            v-bind:class="{ invalid: validation.accountPassword }"
                            v-model.lazy="accountPassword">
                        <span class="validation tiny">{{ validation.accountPassword }}</span>
                    </div>
                    <div class="flex flex-column ph-1">
                        <input
                            type="password"
                            placeholder="Password Confirm"
                            class="order-form-input no-label"
                            v-bind:class="{ invalid: validation.accountPasswordConfirmation }"
                            v-model.lazy="accountPasswordConfirmation">
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
    import Api from '../../assets/js/services/order-form.js';
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
                },
                emailExists: false
            }
        },
        computed: {
            billingEmail: {
                get() {
                    return this.controls.billingEmail;
                },
                set(value) {
                    this.controls.billingEmail = value;
                    this.validateControl('billingEmail');
                    this.$emit(
                        'saveAccountData',
                        {
                            field: 'billingEmail',
                            value: this.controls.billingEmail
                        }
                    );
                }
            },
            accountEmail: {
                get() {
                    return this.controls.accountEmail;
                },
                set(value) {
                    this.emailExists = false;
                    this.controls.accountEmail = value;
                    this.validateControl('accountEmail');
                    this.$emit(
                        'saveAccountData',
                        {
                            field: 'accountEmail',
                            value: this.controls.accountEmail
                        }
                    );
                    this.checkEmailExists(value);
                }
            },
            accountPassword: {
                get() {
                    return this.controls.accountPassword;
                },
                set(value) {
                    this.controls.accountPassword = value;
                    this.validateControl('accountPassword');

                    if (this.controls.accountPasswordConfirmation !== '') {
                        this.validatePasswordConfirmation();
                    }

                    this.$emit(
                        'saveAccountData',
                        {
                            field: 'accountPassword',
                            value: this.controls.accountPassword
                        }
                    );
                }
            },
            accountPasswordConfirmation: {
                get() {
                    return this.controls.accountPasswordConfirmation;
                },
                set(value) {
                    this.controls.accountPasswordConfirmation = value;
                    this.validatePasswordConfirmation();
                    this.$emit(
                        'saveAccountData',
                        {
                            field: 'accountPasswordConfirmation',
                            value: this.controls.accountPasswordConfirmation
                        }
                    );
                }
            },
            createLabel() {
                return this.requiresAccount ? 'Create a new account' : 'Checkout as guest';
            }
        },
        watch: {
            currentUser: function(value) {
                this.state = (value == null) ? 'billing' : 'account';
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
                return this.validation.accountPasswordConfirmation = (
                            !this.controls.accountPasswordConfirmation ||
                            (this.controls.accountPassword &&
                            this.controls.accountPassword != this.controls.accountPasswordConfirmation)
                        ) ?
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

                    if (this.requiresAccount) {
                        validationSuccessful = !this.validatePasswordConfirmation() && validationSuccessful;
                    }
                }

                this.$emit(
                    'registerSubformValidation',
                    {
                        form: 'account',
                        result: validationSuccessful
                    }
                );
            },
            checkEmailExists(email) {
                Api
                    .checkEmail(email)
                    .then(response => {
                        if (!response.unique) {
                            this.validation.accountEmail = 'An account already exists with this email';
                            this.emailExists = true;
                        }
                    })
            }
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
