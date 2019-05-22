<template>
    <div class="flex flex-column order-form mv-2">
        <h3 class="subheading text-center mb-3">
            Your Order is Protected by Our Extended 90-Day 100% Money Back Guarantee!
        </h3>

        <order-form-cart
            :themeColor="themeColor"
            :cartItems="cartData.items"
            @updateCartItem="updateCart" />

        <order-form-account
            ref="accountForm"
            :themeColor="themeColor"
            :brand="brand"
            :currentUser="user"
            :accountDetails="accountStateFactory"
            :requiresAccountInfo="cartContainsSubscription"
            :loginUrl="loginUrl"
            :logoutUrl="logoutUrl"
            @updateAccountData="updateAccountData" />

        <div v-if="cartRequiresShippingAddress"
             class="flex flex-row mb-2">
            <h3 class="heading color-blue">Shipping Information</h3>
        </div>
        <order-form-shipping
            v-if="cartRequiresShippingAddress"
            ref="shippingForm"
            :brand="brand"
            :shippingData="shippingStateFactory"
            @updateShippingData="updateShippingData"
            :countries="countries"
            :provinces="provinces" />

        <div v-if="canAcceptPaymentPlans"
             class="flex flex-row mb-2">
            <h3 class="heading color-blue">Payment Plan</h3>
        </div>
        <order-form-payment-plan
            v-if="canAcceptPaymentPlans"
            :brand="brand"
            :number-of-payments="cartData.number_of_payments"
            :payment-plan-options="cartData.payment_plan_options"
            @updateCartData="updateCart"/>


        <div v-if="this.cartData.items.length"
             class="flex flex-row mb-2">
            <h3 class="heading">Payment Details</h3>
        </div>
        <order-form-payment
                v-if="this.cartData.items.length"
                ref="paymentForm"
                :themeColor="themeColor"
                :brand="brand"
                :paymentDetails="paymentStateFactory"
                :stripePublishableKey="stripePublishableKey"
                :totals="cartData.totals"
                :discounts="cartData.discounts"
                :stripeToken="stripeToken"
                @updatePaymentData="updatePaymentData"
                :countries="countries"
                :provinces="provinces"
                @formSubmit="submitForm" />

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

        <transition name="grow-fade">
            <div v-show="loading"
                 class="form-loading bg-white shadow corners-3 overflow pa-3 text-center"
                 @click.stop>
                <loading-animation :themeColor="themeColor" />

                <p class="body mt-3">Loading Please Wait...</p>

                <transition name="grow-fade">
                    <div v-show="formSuccess"
                         class="success-message flex flex-column flex-center bg-white pa-3">
                        <i class="fas fa-check-circle text-success"></i>

                        <h4 class="title mb-2">Success!</h4>
                        <p class="tiny text-grey-3">
                            Your order has been processed. Redirecting you to the member's area.
                        </p>
                    </div>
                </transition>
            </div>
        </transition>

        <div v-show="loading" class="loading-overlay"></div>
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
    import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

    export default {
        mixins: [ThemeClasses],
        name: 'order-form',
        components: {
            'order-form-account': OrderFormAccount,
            'order-form-cart': OrderFormCart,
            'order-form-shipping': OrderFormShipping,
            'order-form-payment': OrderFormPayment,
            'order-form-payment-plan': OrderFormPaymentPlan,
            'loading-animation': LoadingAnimation,
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

            stripePublishableKey: {
                type: String
            },

            brand: {
                type: String
            },

            countries: {
                type: Array,
                default: () => []
            },

            provinces: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                loading: false,
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
                submitTimeout: null,
                formSuccess: false,
            }
        },
        computed: {
            cartContainsSubscription(){
                return this.cartData.items.filter(item => !!item.subscription_interval_type).length > 0;
            },

            cartRequiresShippingAddress(){
                return this.cartData.items.filter(item => item.requires_shipping === true).length > 0;
            },

            cartRequiresAccountInfo(){
                return this.cartContainsSubscription && this.user == null;
            },

            canAcceptPaymentPlans(){
                return this.cartData.payment_plan_options.length && !this.cartContainsSubscription;
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
                clearTimeout(this.submitTimeout);

                // Wait a quarter of a second before submitting the form, just to prevent double
                // clicks etc from producing unintended interactions.
                this.submitTimeout = setTimeout(() => {
                    if(this.cartRequiresAccountInfo){
                        this.$refs.accountForm.validateForm();
                        if(!this.$refs.accountForm.formValid){
                            window.scrollTo({top: this.$refs.accountForm.$el.offsetTop, behavior: 'smooth'});
                            return;
                        }
                    }

                    if(this.cartRequiresShippingAddress){
                        this.$refs.shippingForm.validateForm();
                        if(!this.$refs.shippingForm.formValid){
                            window.scrollTo({top: this.$refs.shippingForm.$el.offsetTop, behavior: 'smooth'});
                            return;
                        }
                    }

                    this.loading = true;

                    if(this.paymentStateFactory.methodType === 'paypal'){
                        this.submitOrder();
                    } else {
                        this.$refs.paymentForm.fetchStripeToken()
                            .then(({token, error}) => {
                                if(error){
                                    this.loading = false;
                                    return;
                                }

                                this.stripeToken = token;

                                this.submitOrder();
                            });
                    }
                }, 250);
            },

            submitOrder() {
                const payload = this.createOrderPayload();

                EcommerceService.submitOrder(payload)
                    .then(this.orderHandler);
            },

            createOrderPayload() {
                let payload = {
                    gateway: this.brand,
                    payment_method_type: this.paymentStateFactory.methodType,
                    billing_country: this.paymentStateFactory.billingCountry,
                    billing_region: this.paymentStateFactory.billingRegion,
                };

                if(this.canAcceptPaymentPlans){
                    payload['payment_plan_number_of_payments'] = this.cartData.number_of_payments;
                }

                if (!this.user) {
                    // TODO: Fix this when Caleb implements a flag for has subscription
                    // if (this.cartContainsSubscription) {
                        payload['account_creation_email'] = this.accountStateFactory.accountEmail;
                        payload['account_creation_password'] = this.accountStateFactory.accountPassword;
                        payload['account_creation_password_confirmation'] = this.accountStateFactory.accountPasswordConfirm;
                    // } else {
                    //     payload['billing_email'] = this.accountStateFactory.billingEmail;
                    // }
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
                    payload['card_token'] = this.stripeToken.id;
                }

                return payload;
            },

            orderHandler(response){
                if(response){
                    if(this.paymentStateFactory.methodType === 'credit-card'){
                        this.formSuccess = true;
                    }

                    setTimeout(() => {
                        window.location.href = response.data.meta.redirect;
                    }, 500);
                } else {
                    this.formSuccess = false;

                    Toasts.push({
                        icon: 'sad',
                        themeColor: this.themeColor,
                        title: 'Oops! Something went wrong..',
                        message: 'Something happened on the server and your order has not been placed.' +
                            'If the issue persists, please contact support using the chat widget at' +
                            'the bottom of the page.',
                        timeout: 5000
                    });

                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                }
            },
        }
    }
</script>

<style lang="scss">
    .form-loading {
        position:fixed;
        top:50%;
        left:50%;
        z-index:200;
        transform:translate(-50%, -50%);
        width:250px;

        i {
            font-size:72px;
        }

        .success-message {
            position:absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
        }
    }
    .loading-overlay {
        content: '';
        position:fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        z-index:199;
        background:rgba(0,0,0,.4);
    }
</style>