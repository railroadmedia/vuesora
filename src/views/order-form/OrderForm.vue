<template>
    <div class="flex flex-column order-form pv-2">
        <h3 class="subheading text-center pv-1">
            Your Order is Protected by Our Extended 90-Day 100% Money Back Guarantee!
        </h3>

        <order-form-cart
            :themeColor="themeColor"
            :cartItems="cartData.items"
            @updateCartItem="updateCart"></order-form-cart>

        <order-form-account
            :themeColor="themeColor"
            :brand="brand"
            :currentUser="user"
            :accountDetails="accountStateFactory"
            :requiresAccountInfo="cartContainsSubscription"
            :loginUrl="loginUrl"
            :logoutUrl="logoutUrl"
            @updateAccountData="updateAccountData"
            @registerSubformValidation="registerSubformValidation"></order-form-account>

        <order-form-shipping
            :brand="brand"
            :shippingData="shippingStateFactory"
            :shipping-address="shippingStateFactory"
            :validation-trigger="validationTrigger"
            @updateShippingData="updateShippingData"
            @registerSubformValidation="registerSubformValidation"
            v-if="!cartRequiresShippingAddress"></order-form-shipping>

<!--        <order-form-payment-plan-->
<!--            :number-of-payments="numberOfPayments"-->
<!--            :payment-plan-options="paymentPlanOptions"-->
<!--            v-if="paymentPlanOptions.length && !cartContainsSubscription"></order-form-payment-plan>-->

        <order-form-payment
            :themeColor="themeColor"
            :brand="brand"
            :paymentDetails="paymentStateFactory"
            :stripe-publishable-key="stripePublishableKey"
            :discounts="discountsData"
            @updatePaymentData="updatePaymentData"></order-form-payment>

<!--        <div class="flex flex-row pv-3 text-center features">-->
<!--            <div class="md-4 ph-5">-->
<!--                <i class="fa fa-phone"></i>-->
<!--                <p class="body font-bold">We're always here to help</p>-->
<!--                <p class="body">1-800-439-8921 or email support@pianote.com</p>-->
<!--            </div>-->
<!--            <div class="md-4 ph-5">-->
<!--                <i class="fa fa-lock"></i>-->
<!--                <p class="body font-bold">Your Information is Secure</p>-->
<!--                <p class="body">This page is securely encrypted with world-class SSL protection.</p>-->
<!--            </div>-->
<!--            <div class="md-4 ph-5">-->
<!--                <i class="fa fa-certificate">-->
<!--                    <i class="fa fa-check"></i>-->
<!--                </i>-->
<!--                <p class="body font-bold">100% Money Back Guarantee</p>-->
<!--                <p class="body">Order risk-free with our 90-day, 100% money back guarantee.</p>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>
<script>
    import Api from '../../assets/js/services/ecommerce.js';
    import OrderFormAccount from './_OrderFormAccount.vue';
    import OrderFormCart from './_OrderFormCart.vue';
    import OrderFormPayment from './_OrderFormPayment.vue';
    import OrderFormPaymentPlan from './_OrderFormPaymentPlan.vue';
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
            'order-form-payment-plan': OrderFormPaymentPlan,
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

            cart: {
                type: Object,
                default: () => ({})
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

            successRedirectUrl: {
                type: String,
                default: '/members',
            },

            stripePublishableKey: {
                type: String
            },

            brand: {
                type: String
            },
        },
        data() {
            return {
                cartData: this.cart,
                discountsData: [],
                requiresAccount: false,
                requiresShippingAddress: false,
                validationForms: {
                    account: false,
                    shipping: false,
                    payment: false
                },
                accountStateFactory: {
                    billingEmail: null,
                    accountEmail: null,
                    accountPassword: null,
                    accountPasswordConfirm: null,
                },
                shippingStateFactory: this.shippingAddress,
                paymentStateFactory: {
                    cardToken: null,
                    methodType: 'credit_card',
                    billingCountry: this.billingAddress.country,
                    billingRegion: this.billingAddress.state,
                },
                validationTrigger: false,
                stripeTokenTrigger: false,
                backendPaymentError: null,
                totalsData: {
                    shipping: null,
                    tax: 0,
                    due: 0
                },
                numberOfPayments: 1,
                paymentPlanOptions: [],
            }
        },
        computed: {
            cartContainsSubscription(){
                return this.cartData.items.filter(item => !!item.subscription_interval_type).length > 0;
            },

            cartRequiresShippingAddress(){
                return this.cartData.items.filter(item => item.requires_shipping === true).length > 0;
            },

            canUsePaymentPlan(){
                return this.cartData.items.filter(item => !!item.subscription_interval_count).length > 0;
            },
        },
        methods: {
            updateCart(payload){
                this.cartData = payload.meta.cart;
            },

            updateAccountData({key, value}) {
                this.$set(this.accountStateFactory, key, value);
            },

            updateShippingData({key, value}) {
                this.$set(this.shippingStateFactory, key, value);
            },

            updatePaymentData({key, value}) {
                this.$set(this.paymentStateFactory, key, value);
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
                        if (this.paymentStateFactory['payment_method_type'] == 'credit_card') {
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

                this.backendPaymentError = null;

                let payload = this.createOrderPayload();

                Api
                    .submitOrder(payload)
                    .then(this.orderSubmitedSuccessfully)
                    .catch(this.handleOrderSubmitError);
            },
            createOrderPayload() {

                let payload = {
                    'gateway': this.brand,
                    'payment_method_type': this.paymentStateFactory['payment_method_type'],
                    'billing_country': this.paymentStateFactory.country,
                    'billing_region': this.paymentStateFactory.state,
                    'payment_plan_number_of_payments': this.numberOfPayments,
                };

                if (!this.user) {
                    if (this.requiresAccount) {
                        payload['account_creation_email'] = this.accountStateFactory.accountEmail;
                        payload['account_creation_password'] = this.accountStateFactory.accountPassword;
                        payload['account_creation_password_confirmation'] = this.accountStateFactory.accountPasswordConfirmation;
                    } else {
                        payload['billing_email'] = this.accountStateFactory.billingEmail;
                    }
                }

                if (this.requiresShippingAddress) {
                    payload['shipping_first_name'] = this.shippingStateFactory['first_name'];
                    payload['shipping_last_name'] = this.shippingStateFactory['last_name'];
                    payload['shipping_address_line_1'] = this.shippingStateFactory['street_line_one'];
                    payload['shipping_address_line_2'] = this.shippingStateFactory['street_line_two'];
                    payload['shipping_zip_or_postal_code'] = this.shippingStateFactory['zip_or_postal_code'];
                    payload['shipping_city'] = this.shippingStateFactory['city'];
                    payload['shipping_region'] = this.shippingStateFactory['state'];
                    payload['shipping_country'] = this.shippingStateFactory['country'];
                }

                if (this.paymentStateFactory['payment_method_type'] == 'credit_card') {
                    payload['card_token'] = this.paymentStateFactory['card-token'];
                }

                return payload;
            },
            orderSubmitedSuccessfully(response) {

                if (response.data == null && response.meta && response.meta.redirect) {
                    window.location.href = response.meta.redirect;
                } else {
                    Toasts.push({
                        icon: 'happy',
                        themeColor: this.themeColor,
                        title: 'Success',
                        message: 'Your order was successfully placed',
                        timeout: 20000
                    });

                    setTimeout(() => {
                        window.location.href = this.successRedirectUrl;
                    }, 5000);
                }
            },
            handleOrderSubmitError(response) {
                console.log("OrderForm::handleOrderSubmitError response: %s", JSON.stringify(response));

                Toasts.push({
                    icon: 'sad',
                    themeColor: this.themeColor,
                    title: 'Error',
                    message: 'An error occured while processing the order details',
                    timeout: 10000
                });

                if (
                    response.errors &&
                    response.errors.detail &&
                    response.errors.detail.type &&
                    response.errors.detail.type == 'card_error'
                ) {
                    this.backendPaymentError = response.errors;
                }

                if (response.meta && response.meta.user) {
                    this.user = response.meta.user;
                }
            }
        },
        mounted() {

            // this.processCart(this.cart);

            // this.$root.$on('updateCartData', (response) => {
            //     // triggered by cart items quantity update/removal
            //     this.processCart(response.meta.cart);
            // });

            this.shippingStateFactory = this.shippingAddress;
        }
    }
</script>