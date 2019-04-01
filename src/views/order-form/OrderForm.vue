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
                    shipping: this.shippingAddress,
                    payment: this.billingAddress,
                },
                validationTrigger: false,
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
            }
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
                        // if the form is complete & valid, start payment routine
                        // this.$emit('makePayment', this.orderFormData);
                        console.log("should attempt payment");
                    }
                }
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