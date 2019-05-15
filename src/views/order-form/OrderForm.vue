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
            ref="accountForm"
            :themeColor="themeColor"
            :brand="brand"
            :currentUser="user"
            :accountDetails="accountStateFactory"
            :requiresAccountInfo="cartContainsSubscription"
            :loginUrl="loginUrl"
            :logoutUrl="logoutUrl"
            @updateAccountData="updateAccountData"></order-form-account>

        <order-form-shipping
            ref="shippingForm"
            :brand="brand"
            :shippingData="shippingStateFactory"
            @updateShippingData="updateShippingData"
            v-if="cartRequiresShippingAddress"></order-form-shipping>

        <order-form-payment-plan
            :number-of-payments="numberOfPayments"
            :payment-plan-options="paymentPlanOptions"
            v-if="paymentPlanOptions.length && !cartContainsSubscription"></order-form-payment-plan>

        <order-form-payment
            ref="paymentForm"
            :themeColor="themeColor"
            :brand="brand"
            :paymentDetails="paymentStateFactory"
            :stripePublishableKey="stripePublishableKey"
            :totals="cartData.totals"
            :discounts="cartData.discounts"
            :stripeToken="stripeToken"
            @updatePaymentData="updatePaymentData"
            @formSubmit="submitForm"></order-form-payment>

        <div class="flex flex-row flex-wrap pv-3 text-center features">
            <div class="flex flex-column xs-12 sm-4 display mb-2 ph-5">
                <i class="fa fa-phone text-grey-3 mb-2"></i>
                <p class="body font-bold">We're always here to help</p>
                <p class="body text-grey-4">
                    Call 1-800-439-8921 or email
                    <a :href="`mailto:support@${brand}.com`">support@{{ brand }}.com</a>
                </p>
            </div>
            <div class="flex flex-column xs-12 sm-4 display mb-2 ph-5">
                <i class="fa fa-lock text-grey-3 mb-2"></i>
                <p class="body font-bold">Your Information is Secure</p>
                <p class="body text-grey-4">This page is securely encrypted with world-class SSL protection.</p>
            </div>
            <div class="flex flex-column xs-12 sm-4 display mb-2 ph-5">
                <i class="fa fa-check-circle text-grey-3 mb-2"></i>
                <p class="body font-bold">100% Money Back Guarantee</p>
                <p class="body text-grey-4">Order risk-free with our 90-day, 100% money back guarantee.</p>
            </div>
        </div>
    </div>
</template>
<script>
    import EcommerceService from '../../assets/js/services/ecommerce.js';
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
                requiresAccount: false,
                numberOfPayments: 1,
                paymentPlanOptions: [],
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
                stripeToken: null,
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

                if(key === 'billingEmail'){
                    this.updateAddressesInSession();
                }
            },

            updateShippingData({key, value}) {
                this.$set(this.shippingStateFactory, key, value);
                this.updateAddressesInSession();
            },

            updatePaymentData({key, value}) {
                this.$set(this.paymentStateFactory, key, value);
                this.updateAddressesInSession();
            },
            
            updateAddressesInSession(){
                EcommerceService.updateAddressesInSession({
                    shippingAddressLine1: this.shippingStateFactory.street_line_one,
                    shippingAddressLine2: this.shippingStateFactory.street_line_two,
                    shippingCity: this.shippingStateFactory.city,
                    shippingCountry: this.shippingStateFactory.country,
                    shippingFirstName: this.shippingStateFactory.first_name,
                    shippingLastName: this.shippingStateFactory.last_name,
                    shippingState: this.shippingStateFactory.state,
                    shippingZip: this.shippingStateFactory.zip_or_postal_code,
                    billingCountry: this.paymentStateFactory.billingCountry,
                    billingState: this.paymentStateFactory.billingRegion,
                    billingEmail: this.accountStateFactory.billingEmail,
                })
                    .then(response => {
                        if(response){
                            this.updateCart(response.data);
                        }
                    })
            },

            submitForm(){
                this.$refs.accountForm.validateForm();
                if(!this.$refs.accountForm.formValid){
                    window.scrollTo({top: this.$refs.accountForm.$el.offsetTop, behavior: 'smooth'});
                    return;
                }

                if(this.cartRequiresShippingAddress){
                    this.$refs.shippingForm.validateForm();
                    if(!this.$refs.shippingForm.formValid){
                        window.scrollTo({top: this.$refs.shippingForm.$el.offsetTop, behavior: 'smooth'});
                        return;
                    }
                }

                this.$refs.paymentForm.fetchStripeToken()
                    .then(({token, error}) => {
                        if(error){
                            return;
                        }

                        this.stripeToken = token;

                        this.submitOrder();
                    });
            },

            submitOrder() {
                let payload = this.createOrderPayload();

                console.log(payload);

                // EcommerceService.submitOrder(payload)
                //     .then(this.orderSubmitedSuccessfully)
                //     .catch(this.handleOrderSubmitError);
            },

            createOrderPayload() {
                let payload = {
                    gateway: this.brand,
                    payment_method_type: this.paymentStateFactory.methodType,
                    billing_country: this.paymentStateFactory.billingCountry,
                    billing_region: this.paymentStateFactory.billingRegion,
                    payment_plan_number_of_payments: this.numberOfPayments,
                };

                if (!this.user) {
                    if (this.cartContainsSubscription) {
                        payload['account_creation_email'] = this.accountStateFactory.accountEmail;
                        payload['account_creation_password'] = this.accountStateFactory.accountPassword;
                        payload['account_creation_password_confirmation'] = this.accountStateFactory.accountPasswordConfirm;
                    } else {
                        payload['billing_email'] = this.accountStateFactory.billingEmail;
                    }
                }

                if (this.cartRequiresShippingAddress) {
                    payload['shipping_first_name'] = this.shippingStateFactory.first_name;
                    payload['shipping_last_name'] = this.shippingStateFactory.last_name;
                    payload['shipping_address_line_1'] = this.shippingStateFactory.street_line_one;
                    payload['shipping_address_line_2'] = this.shippingStateFactory.street_line_two;
                    payload['shipping_zip_or_postal_code'] = this.shippingStateFactory.zip_or_postal_code;
                    payload['shipping_city'] = this.shippingStateFactory.city;
                    payload['shipping_region'] = this.shippingStateFactory.state;
                    payload['shipping_country'] = this.shippingStateFactory.country;
                }

                if (this.paymentStateFactory.methodType === 'credit_card') {
                    payload['card_token'] = this.stripeToken;
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
        }
    }
</script>