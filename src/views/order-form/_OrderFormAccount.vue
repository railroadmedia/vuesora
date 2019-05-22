<template>
    <div class="flex flex-column mb-3">
        <div v-if="!isSignedIn">
<!--            <div v-if="!requiresAccountInfo">-->
<!--                <div class="flex flex-row align-v-center mb-2">-->
<!--                    <div class="flex flex-column">-->
<!--                        <h3 class="heading">Billing Email</h3>-->

<!--                        <span class="flex flex-auto">-->
<!--                            <a :href="loginUrl"-->
<!--                               class="body font-underline">-->
<!--                                Already have an account? Click here to login.-->
<!--                            </a>-->
<!--                        </span>-->
<!--                    </div>-->
<!--                </div>-->

<!--                <div class="flex flex-column bg-white shadow corners-5 pa-3">-->
<!--                    <div class="form-group">-->
<!--                        <input type="email"-->
<!--                               id="billingEmail"-->
<!--                               name="billing-email"-->
<!--                               class="order-form-input"-->
<!--                               :class="{ 'has-error': errors.billingEmail.length,-->
<!--                               'has-input': $_billingEmail != null }"-->
<!--                               v-model.lazy="$_billingEmail">-->

<!--                        <label for="billingEmail"-->
<!--                               :class="brand">-->
<!--                            Email Address-->
<!--                        </label>-->

<!--                        <ul class="errors tiny">-->
<!--                            <li v-for="(error, i) in errors.billingEmail"-->
<!--                                :key="'accountEmailError' + i">-->
<!--                                {{ error || null }}-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

            <div>
                <div class="flex flex-row align-v-center pb-2">
                    <div class="flex flex-column">
                        <h3 class="heading">Create Your Account</h3>

                        <span class="flex flex-auto">
                            <a :href="loginUrl"
                               class="body font-underline">
                                Already have an account? Click here to login.
                            </a>
                        </span>
                    </div>
                </div>
                <div class="flex flex-row bg-white flex-wrap shadow corners-5 pt-3 ph-2 mb-1">
                    <div class="flex flex-column xs-12 sm-4 ph-1 mb-3">
                        <div class="form-group">
                            <input type="email"
                                   id="newAccountEmail"
                                   name="account-creation-email"
                                   class="order-form-input"
                                   :class="{ 'has-error': errors.accountEmail.length,
                                   'has-input': $_accountEmail != null }"
                                   v-model.lazy="$_accountEmail">

                            <label for="newAccountEmail"
                                   :class="brand">
                                Email Address
                            </label>

                            <ul class="errors tiny">
                                <li v-for="(error, i) in errors.accountEmail"
                                    :key="'accountEmailError' + i">
                                    {{ error || null }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex flex-column xs-12 sm-4 ph-1 mb-3">
                        <div class="form-group">
                            <input type="password"
                                   id="newAccountPassword"
                                   name="account-creation-password"
                                   class="order-form-input"
                                   :class="{ 'has-error': errors.accountPassword.length,
                                    'has-input': $_accountPassword != null }"
                                   v-model="$_accountPassword">

                            <label for="newAccountPassword"
                                   :class="brand">
                                Password
                            </label>

                            <ul class="errors tiny">
                                <li v-for="(error, i) in errors.accountPassword"
                                    :key="'accountPasswordError' + i">
                                    {{ error || null }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex flex-column xs-12 sm-4 ph-1 mb-3">
                        <div class="form-group">
                            <input type="password"
                                   id="newAccountPasswordConfirm"
                                   class="order-form-input"
                                   :class="{ 'has-error': errors.accountPasswordConfirm.length,
                                   'has-input': $_accountPasswordConfirm != null }"
                                   v-model="$_accountPasswordConfirm">

                            <label for="newAccountPasswordConfirm"
                                   :class="brand">
                                Confirm Password
                            </label>

                            <ul class="errors tiny">
                                <li v-for="(error, i) in errors.accountPasswordConfirm"
                                    :key="'accountPasswordConfirmError' + i">
                                    {{ error || null }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

<!--                <a :href="loginUrl"-->
<!--                   title="Forgot your password"-->
<!--                   class="tiny color-blue font-underline text-grey-3">-->
<!--                    Forgot your password?-->
<!--                </a>-->
            </div>
        </div>

        <div v-if="isSignedIn">
            <div class="flex flex-row align-v-center pb-2">
                <div class="flex flex-column">
                    <h3 class="heading">Add To Existing Account</h3>

                    <span class="flex flex-auto">
                        <a :href="logoutUrl"
                           class="body font-underline">
                            Need to log in to a different account?
                        </a>
                    </span>
                </div>
            </div>

            <div class="flex flex-row bg-white shadow corners-5 pa-3">
                <div class="flex flex-column text-center">
                    <h4 class="body text-grey-3 mb-1">You are currently logged in as:</h4>

                    <h4 class="subheading mb-2">{{ currentUser.email }}</h4>

                    <h4 class="tiny text-grey-3 font-italic">
                        Your products will be added to the account you are currently logged in with.
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ThemeClasses from "../../mixins/ThemeClasses";
    import Validation from './_validation';

    export default {
        mixins: [Validation, ThemeClasses],
        name: 'order-form-account',
        props: {
            currentUser: {
                type: Object,
                default: () => null
            },

            brand: {
                type: String,
            },

            accountDetails: {
                type: Object,
                default: () => ({
                    billingEmail: null,
                    accountEmail: null,
                    accountPassword: null,
                    accountPasswordConfirm: null,
                })
            },

            requiresAccountInfo: {
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
                rules: {
                    billingEmail: [
                        v => !!v || 'Email is required.',
                        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Must be a valid email'
                    ],
                    accountEmail: [
                        v => !!v || 'Email is required.',
                        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Must be a valid email'
                    ],
                    accountPassword: [
                        v => !!v || 'Password is required.',
                        v => !!v && v.length >= 8 || 'Password must be 8 characters or more.',
                        v => v === this.$_accountPasswordConfirm || 'Passwords must match.'
                    ],
                    accountPasswordConfirm: [
                        v => !!v || 'Password is required.',
                        v => v === this.$_accountPassword || 'Passwords must match.'
                    ],
                },
                errors: {
                    billingEmail: [],
                    accountEmail: [],
                    accountPassword: [],
                    accountPasswordConfirm: [],
                },
            }
        },
        computed: {
            isSignedIn(){
                return this.currentUser != null;
            },

            $_billingEmail: {
                get() {
                    return this.accountDetails.billingEmail;
                },
                set(value) {
                    this.validateInput('billingEmail', value);

                    this.$emit('updateAccountData', {
                        key: 'billingEmail',
                        value: value
                    });
                }
            },

            $_accountEmail: {
                get() {
                    return this.accountDetails.accountEmail;
                },
                set(value) {
                    this.validateInput('accountEmail', value);

                    this.$emit('updateAccountData', {
                        key: 'accountEmail',
                        value: value
                    });
                }
            },

            $_accountPassword: {
                get() {
                    return this.accountDetails.accountPassword;
                },
                set(value) {
                    this.validateInput('accountPassword', value);
                    
                    this.$emit('updateAccountData', {
                        key: 'accountPassword',
                        value: value
                    });

                    // If the other password input has a value - validate it at the same time
                    if(this.$_accountPasswordConfirm != null){
                        this.validateInput('accountPasswordConfirm', this.$_accountPasswordConfirm);
                    }
                }
            },

            $_accountPasswordConfirm: {
                get() {
                    return this.accountDetails.accountPasswordConfirm;
                },
                set(value) {
                    this.validateInput('accountPasswordConfirm', value);

                    this.$emit('updateAccountData', {
                        key: 'accountPasswordConfirm',
                        value: value
                    });

                    // If the other password input has a value - validate it at the same time
                    if(this.$_accountPassword != null){
                        this.validateInput('accountPassword', this.$_accountPassword);
                    }
                }
            },
        }
    }
</script>
