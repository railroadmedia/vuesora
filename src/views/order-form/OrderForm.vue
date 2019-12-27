<template>
    <div class="flex flex-row flex-wrap align-v-top nmh-1">
        <div class="flex flex-column order-form xs-12 md-9 ph-1">
            <order-form-cart
                :theme-color="themeColor"
                :cart-items="cartData.items"
                :bonuses="bonuses"
                :is-cart-locked="cartData.locked"
                @updateCartItem="updateCart"
            />

            <order-form-account
                ref="accountForm"
                :theme-color="themeColor"
                :brand="brand"
                :current-user="user"
                :account-details="accountStateFactory"
                :requires-account-info="cartContainsSubscription"
                :login-url="loginUrl"
                :logout-url="logoutUrl"
                @updateAccountData="updateAccountData"
            />

            <div
                v-if="cartRequiresShippingAddress"
                class="flex flex-row mb-1"
            >
                <h3 class="title uppercase">
                    Shipping Information
                </h3>
            </div>
            <order-form-shipping
                v-if="cartRequiresShippingAddress"
                ref="shippingForm"
                :brand="brand"
                :shipping-data="shippingStateFactory"
                :countries="countries"
                :provinces="provinces"
                @updateShippingData="updateShippingData"
            />

            <div
                v-if="canAcceptPaymentPlans"
                class="flex flex-row mb-1"
            >
                <h3 class="title uppercase">
                    Payment Plan
                </h3>
            </div>

            <order-form-payment-plan
                v-if="canAcceptPaymentPlans"
                :brand="brand"
                :number-of-payments="cartData.number_of_payments"
                :payment-plan-options="cartData.payment_plan_options"
                @updateCartData="updateCart"
            />
            <div
                v-if="cartData.items.length"
                class="flex flex-row mb-1"
            >
                <h3 class="title uppercase">
                    Payment Details
                </h3>
            </div>
            <order-form-payment
                v-if="cartData.items.length"
                ref="paymentForm"
                :theme-color="themeColor"
                :brand="brand"
                :payment-details="paymentStateFactory"
                :stripe-publishable-key="stripePublishableKey"
                :totals="cartData.totals"
                :discounts="cartData.discounts"
                :stripe-token="stripeToken"
                :countries="countries"
                :provinces="provinces"
                @updatePaymentData="updatePaymentData"
            />
        </div>

        <div class="flex flex-column xs-12 md-3 ph-1 totals-col">
            <order-form-totals
                :totals="cartData.totals"
                :discounts="cartData.discounts"
            />

            <button
                class="btn"
                @click.stop="submitForm"
            >
                <span
                    class="text-white"
                    :class="themeBgClass"
                >
                    Place Order
                </span>
            </button>

            <p class="tiny disclaimer mt-1 text-grey-3">
                By completing your order you agree to the terms of service. All payments
                in US dollars. You can cancel your subscription at any time by emailing
                <a :href="`mailto:support@${brand}.com`">support@{{ brand }}.com</a>.
            </p>
        </div>


        <transition name="grow-fade">
            <div
                v-show="loading"
                class="form-loading bg-white shadow corners-3 overflow pa-3 text-center"
                @click.stop
            >
                <div class="square">
                    <loading-animation :theme-color="themeColor" />
                </div>

                <p class="body mt-3">
                    Loading Please Wait...
                </p>

                <transition name="grow-fade">
                    <div
                        v-show="formSuccess"
                        class="success-message flex flex-column flex-center bg-white pa-3"
                    >
                        <i class="fas fa-check-circle text-success"></i>

                        <h4 class="title mb-2">
                            Success!
                        </h4>
                        <p class="tiny text-grey-3">
                            Your order has been processed. Redirecting you now...
                        </p>
                    </div>
                </transition>
            </div>
        </transition>
        <div
            v-show="loading"
            class="loading-overlay"
        ></div>
    </div>
</template>
<script>
import axios from 'axios';
import EcommerceService from '../../assets/js/services/ecommerce';
import OrderFormAccount from './_OrderFormAccount.vue';
import OrderFormCart from './_OrderFormCart.vue';
import OrderFormPayment from './_OrderFormPayment.vue';
import OrderFormPaymentPlan from './_OrderFormPaymentPlan.vue';
import OrderFormShipping from './_OrderFormShipping.vue';
import OrderFormTotals from './_OrderFormTotals.vue';
import ThemeClasses from '../../mixins/ThemeClasses';
import Toasts from '../../assets/js/classes/toasts';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.vue';

export default {
    name: 'OrderForm',
    components: {
        'order-form-account': OrderFormAccount,
        'order-form-cart': OrderFormCart,
        'order-form-shipping': OrderFormShipping,
        'order-form-payment': OrderFormPayment,
        'order-form-payment-plan': OrderFormPaymentPlan,
        'loading-animation': LoadingAnimation,
        'order-form-totals': OrderFormTotals,
    },
    mixins: [ThemeClasses],
    props: {
        billingAddress: {
            type: Object,
            default: () => null,
        },

        shippingAddress: {
            type: Object,
            default: () => null,
        },

        cart: {
            type: Object,
            default: () => ({}),
        },

        user: {
            type: Object,
            default: () => null,
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
            type: String,
            default: () => '',
        },

        brand: {
            type: String,
            default: () => 'pianote',
        },

        countries: {
            type: Array,
            default: () => [],
        },

        provinces: {
            type: Array,
            default: () => [],
        },

        bonuses: {
            type: Array,
            default: () => [],
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
            updateTimeout: null,
        };
    },
    computed: {
        cartContainsSubscription() {
            return this.cartData.items.filter(item => !!item.is_digital).length > 0;
        },

        cartRequiresShippingAddress() {
            return this.cartData.items.filter(item => item.requires_shipping === true).length > 0;
        },

        cartRequiresAccountInfo() {
            return this.cartContainsSubscription && this.user == null;
        },

        canAcceptPaymentPlans() {
            return this.cartData.payment_plan_options.length > 0 && !this.cartContainsSubscription;
        },
    },
    methods: {
        updateCart(payload) {
            this.cartData = payload.meta.cart;
        },

        updateAccountData({ key, value }) {
            this.$set(this.accountStateFactory, key, value);

            if (key === 'billingEmail') {
                this.updateAddressesInSession();
            }
        },

        updateShippingData({ key, value }) {
            this.$set(this.shippingStateFactory, key, value);

            this.updateAddressesInSession();
        },

        updatePaymentData({ key, value }) {
            this.$set(this.paymentStateFactory, key, value);

            this.updateAddressesInSession();
        },
            
        updateAddressesInSession() {
            clearTimeout(this.updateTimeout);

            this.updateTimeout = setTimeout(() => {
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
                    .then((response) => {
                        if (response) {
                            this.updateCart(response.data);
                        }
                    });
            }, 200);
        },

        submitForm() {
            clearTimeout(this.submitTimeout);

            // Wait a quarter of a second before submitting the form, just to prevent double
            // clicks etc from producing unintended interactions.
            this.submitTimeout = setTimeout(() => {
                if (this.cartRequiresAccountInfo) {
                    this.$refs.accountForm.validateForm();
                    if (!this.$refs.accountForm.formValid) {
                        window.scrollTo({ top: (this.$refs.accountForm.$el.offsetTop - 100), behavior: 'smooth' });
                        return;
                    }
                }

                if (this.cartRequiresShippingAddress) {
                    this.$refs.shippingForm.validateForm();
                    if (!this.$refs.shippingForm.formValid) {
                        window.scrollTo({ top: (this.$refs.shippingForm.$el.offsetTop - 100), behavior: 'smooth' });
                        return;
                    }
                }

                this.loading = true;

                if (this.paymentStateFactory.methodType === 'paypal') {
                    this.submitOrder();
                } else {
                    this.$refs.paymentForm.fetchStripeToken()
                        .then(({ token, error }) => {
                            if (error) {
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

            axios.put('/ecommerce/json/order-form/submit', payload)
                .then(this.orderSuccess)
                .catch(this.orderFailure);
        },

        createOrderPayload() {
            const payload = {
                gateway: this.brand,
                payment_method_type: this.paymentStateFactory.methodType,
                billing_country: this.paymentStateFactory.billingCountry,
                billing_region: this.paymentStateFactory.billingRegion,
            };

            if (this.canAcceptPaymentPlans) {
                payload.payment_plan_number_of_payments = this.cartData.number_of_payments;
            }

            if (!this.user) {
                if (this.cartContainsSubscription) {
                    payload.account_creation_email = this.accountStateFactory.accountEmail;
                    payload.account_creation_password = this.accountStateFactory.accountPassword;
                    payload.account_creation_password_confirmation = this.accountStateFactory.accountPasswordConfirm;
                } else {
                    payload.billing_email = this.accountStateFactory.accountEmail;
                }
            }

            if (this.cartRequiresShippingAddress) {
                payload.shipping_first_name = this.shippingStateFactory.first_name;
                payload.shipping_last_name = this.shippingStateFactory.last_name;
                payload.shipping_address_line_1 = this.shippingStateFactory.street_line_one;
                payload.shipping_address_line_2 = this.shippingStateFactory.street_line_two;
                payload.shipping_zip_or_postal_code = this.shippingStateFactory.zip_or_postal_code;
                payload.shipping_city = this.shippingStateFactory.city;
                payload.shipping_region = this.shippingStateFactory.state;
                payload.shipping_country = this.shippingStateFactory.country;
            }

            if (this.paymentStateFactory.methodType === 'credit_card') {
                payload.card_token = this.stripeToken.id;
            }

            return payload;
        },

        orderSuccess(response) {
            if (this.paymentStateFactory.methodType === 'credit_card') {
                this.formSuccess = true;
            }

            setTimeout(() => {
                window.location.href = response.data.meta.redirect;
            }, 500);
        },

        orderFailure({ response }) {
            this.formSuccess = false;

            let title = 'Oops, something went wrong';
            let message = 'An error happened on the server, please contact support using the '
                    + 'chat widget at the bottom of your screen';

            if (response.data.errors) {
                title = response.data.errors[0].title;
                message = response.data.errors[0].detail;
            }

            Toasts.push({
                icon: 'sad',
                themeColor: this.themeColor,
                title,
                message,
                timeout: 7500,
            });

            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
    },
};
</script>

<style lang="scss">
@import '../../assets/sass/partials/variables';

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
    .totals-col {
        position:sticky;
        top:90px;
    }
</style>
