<template>
    <div class="flex flex-column mb-3">
        <div v-if="!isSignedIn">

            <div v-if="!requiresAccountInfo">
                <div class="flex flex-row align-v-center mb-2">
                    <div class="flex flex-column">
                        <h3 class="heading">Billing Email</h3>

                        <span class="flex flex-auto">
                            <a :href="loginUrl"
                               class="body font-underline">
                                Already have an account? Click here to login.
                            </a>
                        </span>
                    </div>
                </div>

                <div class="flex flex-column bg-white shadow corners-5 pa-3">
                    <div class="form-group">
                        <input type="email"
                               id="billingEmail"
                               name="billing-email"
                               class="order-form-input"
                               :class="{ 'has-error': errors.accountEmail.length,
                               'has-input': $_accountEmail != null }"
                               v-model.lazy="$_accountEmail">

                        <label for="billingEmail"
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
            </div>

            <div v-if="requiresAccountInfo">
                <div class="flex flex-row align-v-center pb-2">
                    <div class="flex flex-column">
                        <h3 class="title uppercase font-bold">
                            Create Your Account
                        </h3>

                        <p class="body">
                            Already have a Musora Account?
                            <span class="capitalize">
                                ({{ brand }}, {{ ['drumeo', 'guitareo', 'pianote']
                                    .filter(item => item !== brand)
                                    .join(', ') }})
                            </span>
                            <a
                                :href="loginUrl"
                                class="font-underline"
                            >
                                Click here to login.
                            </a>
                        </p>
                    </div>
                </div>
                <div class="flex flex-row flex-wrap nmh-1 mb-1">
                    <div class="flex flex-column xs-12 ph-1 mb-1">
                        <div class="form-group">
                            <input
                                id="newAccountEmail"
                                v-model.lazy="$_accountEmail"
                                type="email"
                                name="account-creation-email"
                                class="order-form-input"
                                :class="{ 'has-error': errors.accountEmail.length,
                                          'has-input': $_accountEmail != null }"
                            >

                            <label
                                for="newAccountEmail"
                                :class="brand"
                            >
                                Email Address
                            </label>

                            <ul class="errors tiny">
                                <li
                                    v-for="(error, i) in errors.accountEmail"
                                    :key="'accountEmailError' + i"
                                >
                                    {{ error || null }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex flex-column xs-12 ph-1 mb-1">
                        <div class="form-group">
                            <input
                                id="newAccountPassword"
                                v-model="$_accountPassword"
                                type="password"
                                name="account-creation-password"
                                class="order-form-input"
                                :class="{ 'has-error': errors.accountPassword.length,
                                          'has-input': $_accountPassword != null }"
                            >
                            <label
                                for="newAccountPassword"
                                :class="brand"
                            >
                                Password
                            </label>
                            <ul class="errors tiny">
                                <li
                                    v-for="(error, i) in errors.accountPassword"
                                    :key="'accountPasswordError' + i"
                                >
                                    {{ error || null }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isSignedIn">
            <div class="flex flex-row align-v-center mb-1">
                <div class="flex flex-column">
                    <h3 class="title uppercase font-bold">
                        Add To Existing Account
                    </h3>

                    <span class="flex flex-auto">
                        <a
                            :href="logoutUrl"
                            class="body font-underline"
                        >
                            Need to log in to a different account?
                        </a>
                    </span>
                </div>
            </div>

            <div class="flex flex-row pa-3">
                <div class="flex flex-column text-center">
                    <h4 class="body text-grey-3 mb-1">
                        You are currently logged in as:
                    </h4>

                    <h4 class="subheading mb-2">
                        {{ currentUser.email }}
                    </h4>

                    <h4 class="tiny text-grey-3 font-italic">
                        Your products will be added to the account you are currently logged in with.
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ThemeClasses from '../../mixins/ThemeClasses';
import Validation from './_validation';

export default {
    name: 'OrderFormAccount',
    mixins: [Validation, ThemeClasses],
    props: {
        currentUser: {
            type: Object,
            default: () => null,
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
            }),
        },

        requiresAccountInfo: {
            type: Boolean,
            default: () => false,
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
                accountEmail: [
                    v => !!v || 'Email is required.',
                    v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Must be a valid email',
                ],
                accountPassword: [
                    v => !!v || 'Password is required.',
                    v => !!v && v.length >= 8 || 'Password must be 8 characters or more.',
                ],
            },
            errors: {
                accountEmail: [],
                accountPassword: [],
            },
        };
    },
    computed: {
        isSignedIn() {
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
                    value,
                });
            },
        },

        $_accountEmail: {
            get() {
                return this.accountDetails.accountEmail;
            },
            set(value) {
                this.validateInput('accountEmail', value);

                this.$emit('updateAccountData', {
                    key: 'accountEmail',
                    value,
                });
            },
        },

        $_accountPassword: {
            get() {
                return this.accountDetails.accountPassword;
            },
            set(value) {
                this.validateInput('accountPassword', value);
                    
                this.$emit('updateAccountData', {
                    key: 'accountPassword',
                    value,
                });
            },
        },
    },
};
</script>
