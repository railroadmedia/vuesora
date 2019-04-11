<template>
    <div class="flex flex-column order-form">
        <h3 class="subheading text-center">Your Order is Protected by Our Extended 90-Day 100% Money Back
                Guarantee!</h3>
        <order-form-cart
            :cart-items="items"></order-form-cart>
        <order-form-account
            :current-user="user"
            :requires-account="requiresAccount"
            :login-url="loginUrl"
            :logout-url="logoutUrl"
            :validation-trigger="validationTrigger"
            @saveAccountData="updateAccountData"
            @registerSubformValidation="registerSubformValidation"></order-form-account>

        <order-form-shipping
            :shipping-address="factoryState.shipping"
            :validation-trigger="validationTrigger"
            @saveShippingData="updateShippingData"
            @registerSubformValidation="registerSubformValidation"
            v-if="requiresShippingAddress"></order-form-shipping>

        <order-form-payment
            :billing-address="billingAddress"
            :stripe-publishable-key="stripePublishableKey"
            :validation-trigger="validationTrigger"
            :stripe-token-trigger="stripeTokenTrigger"
            @startValidation="startValidation"
            @savePaymentData="updatePaymentData"
            @registerSubformValidation="registerSubformValidation"></order-form-payment>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/order-form.js';
    import OrderFormAccount from './_OrderFormAccount.vue';
    import OrderFormCart from './_OrderFormCart.vue';
    import OrderFormPayment from './_OrderFormPayment.vue';
    import OrderFormShipping from './_OrderFormShipping.vue';
    import ThemeClasses from '../../mixins/ThemeClasses';
    import Toasts from '../../assets/js/classes/toasts';

    export default {
        mixins: [ThemeClasses],
        name: 'order-form',
        components: {
            'order-form-account': OrderFormAccount,
            'order-form-cart': OrderFormCart,
            'order-form-shipping': OrderFormShipping,
            'order-form-payment': OrderFormPayment,
        },
        data() {
            return {
                items: [],
                requiresAccount: false,
                requiresShippingAddress: false,
                validationForms: {
                    account: false,
                    shipping: false,
                    payment: false
                },
                factoryState: {
                    account: {},
                    shipping: this.shippingAddress || {},
                    payment: this.billingAddress || {},
                },
                validationTrigger: false,
                stripeTokenTrigger: false,
            }
        },
        props: {
            billingAddress: {
                type: Object,
                default: () => null
            },
            shippingAddress: {
                type: Object,
                default: () => null
            },
            cartItems: {
                type: Array,
                default: () => []
            },
            user: {
                type: Object,
                default: () => null
            },
            loginUrl: {
                type: String,
                default: '/login',
            },
            logoutUrl: {
                type: String,
                default: '/',
            },
            stripePublishableKey: {
                type: String
            },
            gateway: {
                type: String
            },
        },
        methods: {
            processCartItems(cartItems) {

                this.items = cartItems;
                this.requiresAccount = false;
                this.requiresShippingAddress = false;

                this.items.forEach(item => {
                    if (item.attributes.subscriptionIntervalType) {
                        this.requiresAccount = true;
                    }
                    if (item.attributes.requiresShippingAddress) {
                        this.requiresShippingAddress = true;
                    }
                });
            },
            updateAccountData({field, value}) {

                this.factoryState.account[field] = value;
            },
            updateShippingData({field, value}) {

                this.factoryState.shipping[field] = value;
            },
            updatePaymentData({field, value}) {

                this.factoryState.payment[field] = value;

                if (field == 'card-token') {
                    // stripe token fetch succeeded, submit credit card payment type order
                    this.submitOrder();
                }
            },
            startValidation() {

                this.validationForms = {
                    account: false,
                    payment: false,
                };

                if (this.requiresShippingAddress) {
                    this.validationForms.shipping = false;
                }

                this.validationTrigger = !this.validationTrigger;
            },
            registerSubformValidation({form, result}) {
                this.validationForms[form] = result;

                if (result) {
                    // if current result is successful, check the other results
                    let complete = true;

                    for (let key in this.validationForms) {
                        if (!this.validationForms[key]) {
                            complete = false;
                            break;
                        }
                    }

                    if (complete) {
                        // if subforms validation succeeded
                        if (this.factoryState.payment['payment_method_type'] == 'credit-card') {
                            // trigger stripe token fetch
                            this.stripeTokenTrigger = !this.stripeTokenTrigger;
                        } else {
                            // submit paypal payment type order
                            this.submitOrder();
                        }
                    }
                }
            },
            submitOrder() {
                let payload = this.createOrderPayload();
                console.log("OrderForm::submitOrder payload: %s", JSON.stringify(payload));

                Api
                    .submitOrder(payload)
                    .then((result) => {
                        console.log("OrderForm::submitOrder result: %s", JSON.stringify(result));
                    })
                    .catch((error) => {
                        console.log("OrderForm::submitOrder error: %s", JSON.stringify(error));
                    });
            },
            createOrderPayload() {

                let payload = {
                    'gateway': this.gateway,
                    'payment_method_type': this.factoryState.payment['payment_method_type'],
                    'billing-country': this.factoryState.payment.country,
                    'billing-region': this.factoryState.payment.state,
                    'billing-zip-or-postal-code': this.factoryState.payment['zip_or_postal_code'],
                };

                if (!this.user) {
                    if (this.requiresAccount) {
                        payload['account-creation-email'] = this.factoryState.account.accountEmail;
                        payload['account-creation-password'] = this.factoryState.account.accountPassword;
                    } else {
                        payload['billing-email'] = this.factoryState.account.billingEmail;
                    }
                }

                if (this.requiresShippingAddress) {
                    payload['shipping-first-name'] = this.factoryState.shipping['first_name'];
                    payload['shipping-last-name'] = this.factoryState.shipping['last_name'];
                    payload['shipping-address-line-1'] = this.factoryState.shipping['street_line_one'];
                    payload['shipping-address-line-2'] = this.factoryState.shipping['street_line_two'];
                    payload['shipping-zip-or-postal-code'] = this.factoryState.shipping['zip_or_postal_code'];
                    payload['shipping-city'] = this.factoryState.shipping['city'];
                    payload['shipping-region'] = this.factoryState.shipping['state'];
                    payload['shipping-country'] = this.factoryState.shipping['country'];
                }

                if (this.factoryState.payment['payment_method_type'] == 'credit-card') {
                    payload['card-token'] = this.factoryState.payment['card-token'];
                }

                return payload;
            }
        },
        mounted() {

            this.processCartItems(this.cartItems);

            this.$root.$on('updateCartData', (cartData) => {
                // triggered by cart items quantity update/removal
                this.processCartItems(cartData.data);

                if (cartData.meta && cartData.meta.notAvailableProducts) {
                    cartData.meta.notAvailableProducts.forEach(error => {
                        Toasts.push({
                            icon: 'astonished',
                            themeColor: this.themeColor,
                            title: 'Oups',
                            message: error,
                            timeout: 20000
                        });
                    })
                }

                // todo - PMP-339 - update shipping, tax, total and playment plans data
            });
        }
    }
</script>
<style lang="scss">
    .order-form {
        .order-form-input {

            + .validation {
                display: none;
            }

            &.invalid {
                border: 1px solid #f07575;
                background-color: #fff0f0;

                + .validation {
                    color: #F00;
                    display: inline-block;
                }
            }

            &:focus {
                border: 1px solid #8a8a8a;
                box-shadow: 0 0 5px #cacaca;
            }
        }
    }
</style>