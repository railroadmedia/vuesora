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
                :requires-account-info="cartContainsDigitalItems"
                :login-url="loginUrl"
                :logout-url="logoutUrl"
                @updateAccountData="updateAccountData"
            />

            <!-- Shipping Section -->
            <section v-if="cartRequiresShippingAddress">
                <!-- Section Heading -->
                <div class="flex flex-row mb-1">
                    <h3 class="title uppercase font-bold">
                        Shipping Information
                    </h3>
                </div>
                <!-- Saved Address -->
                <template v-if="recentAddresses">
                    <div class="flex flex-row card-wrapper">
                        <div class="flex flex-column xs-12 sm-4 mb-1 bg-white shadow corners-5 pt-2 pb-2 ph-2">
                            <p class="font-bold tiny">
                                Recent Shipping Address
                            </p>
                            <p class="tiny">
                                <span>{{ recentAddresses.data[0].attributes.first_name }}</span>
                                <span>{{ recentAddresses.data[0].attributes.last_name }}</span>
                            </p>
                            <p class="tiny">{{ recentAddresses.data[0].attributes.street_line_1 }}</p>
                            <p class="tiny">{{ recentAddresses.data[0].attributes.street_line_2 }}</p>
                            <p class="tiny">{{ recentAddresses.data[0].attributes.city }}</p>
                            <p class="tiny">
                                <span>{{ recentAddresses.data[0].attributes.region }}, </span>
                                <span>{{ recentAddresses.data[0].attributes.zip }}</span>
                            </p>
                            <p class="tiny">{{ recentAddresses.data[0].attributes.country }}</p>
                            <div class="flex mt-2">
                                <a 
                                    href="/members/settings/payments" 
                                    title="Go to Payment Method Page" 
                                    class="btn bg-white outline outline-drumeo text-drumeo"
                                >
                                    Change Address
                                </a>
                            </div>
                            <div class="flex mt-1">
                                <button
                                    class="btn" 
                                    @click='newAddress = !newAddress' 
                                >
                                    <span class="text-white bg-drumeo"> Add New Address </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Shipping Component -->
                <template v-if="!recentAddresses || newAddress">
                    <order-form-shipping
                        ref="shippingForm"
                        :brand="brand"
                        :shipping-data="shippingStateFactory"
                        :countries="countries"
                        :banned-countries="bannedCountries"
                        :provinces="provinces"
                        @updateShippingData="updateShippingData"
                    />
                </template>
            </section>

            <!-- Plan Section -->
            <section v-if="canAcceptPaymentPlans">
                <!-- Section Heading -->
                <div class="flex flex-row mb-1">
                    <h3 class="title uppercase font-bold">
                        Payment Plan
                    </h3>
                </div>
                <!-- Plan Component -->
                <order-form-payment-plan
                    :brand="brand"
                    :number-of-payments="cartData.number_of_payments"
                    :payment-plan-options="cartData.payment_plan_options"
                    @updateCartData="updateCart"
                />
            </section>

            <!-- Payment Section -->
            <section v-if="cartData.items.length">
                <!-- Section Heading -->
                <div class="flex flex-row mb-1">
                    <h3 class="title uppercase font-bold">
                        Payment Details
                    </h3>
                </div>
                <template v-if="primaryPaymentMethod">        
                    <div class="flex flex-row">
                        <div class="flex flex-column xs-12 sm-4 mb-1 bg-white shadow corners-5 pt-2 pb-2 ph-2">
                            <p class="tiny font-bold">Default Payment Method</p>
                            <p class="tiny">Payment Type: {{ primaryPaymentMethod.relationships.method.data.type}} </p>
                            <p class="tiny">
                                Card: {{ getRelatedAttributesByTypeAndId( primaryPaymentMethod.relationships.method.data).attributes.company_name || 'N/A' }}</p>
                            <p class="tiny">Ending In: {{ getRelatedAttributesByTypeAndId(primaryPaymentMethod.relationships.method.data).attributes.last_four_digits || 'N/A' }}</p>
                            <p class="tiny">Expires On: {{ getExpirationDate( primaryPaymentMethod ) }}</p>
                            <div class="flex mt-2">
                                <a 
                                    href="/members/settings/payments" 
                                    title="Go to Payment Method Page" 
                                    class="btn bg-white outline text-drumeo outline-drumeo"
                                >
                                    Change Payment Method
                                </a>
                            </div>
                            <div class="flex mt-1">
                                <button
                                    class="btn" 
                                    @click='newPayment = !newPayment' 
                                >
                                    <span class="text-white bg-drumeo"> Add New Payment </span>
                                </button>
                            </div>
                        </div>
                    </div>     
                </template>
                <!-- Order Component -->
                <template v-if="!primaryPaymentMethod || newPayment">
                    <!-- Order Component -->
                    <order-form-payment
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
                </template>
            </section>
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
                By completing your order you agree to the <a href="/terms">terms of service</a>. All payments
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
import { DateTime } from 'luxon';
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

        recentAddresses: {
            type: Object,
            default: () => null,
        },

        paymentMethods: {
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

        bannedCountries: {
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
            newAddress: false,
            newPayment: false,
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
            primaryPaymentMethod: null,
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
            return this.cartData.items.filter(item => !!item.subscription_interval_type).length > 0;
        },

        cartContainsDigitalItems() {
            return this.cartData.items.filter(item => item.is_digital).length > 0;
        },

        cartRequiresShippingAddress() {
            return this.cartData.items.filter(item => item.requires_shipping === true).length > 0;
        },

        cartRequiresAccountInfo() {
            return this.cartContainsDigitalItems && this.user == null;
        },

        canAcceptPaymentPlans() {
            return this.cartData.payment_plan_options.length > 0 && !this.cartContainsSubscription;
        },
    },
    beforeMount() {
        // Get Primary Payment Method
        if (this.paymentMethods) {
            this.paymentMethods.data.forEach((method) => {
                if (this.isPrimaryPaymentMethod(method)) {
                    this.primaryPaymentMethod = method;
                }
            });
        }
    },
    methods: {
        isPrimaryPaymentMethod(paymentMethod) {
            return this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.userPaymentMethod.data,
            ).attributes.is_primary;
        },

        getExpirationDate(paymentMethod) {
            const date = this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.method.data,
            ).attributes.expiration_date;
            if (date) {
                return DateTime.fromSQL(date).toFormat('MM/yy');
            }
            return 'N/A';
        },
        
        getRelatedAttributesByTypeAndId({ id, type }) {
            const data = this.paymentMethods.included.find(data => data.id === id && data.type === type);
            return data || { id: 'N/A', attributes: {} };
        },

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
                    if (!this.recentAddresses) {
                        this.$refs.shippingForm.validateForm();
                        if (!this.$refs.shippingForm.formValid) {
                            window.scrollTo({ top: (this.$refs.shippingForm.$el.offsetTop - 100), behavior: 'smooth' });
                            return;
                        }
                    }
                }

                this.loading = true;

                if (this.primaryPaymentMethod || !this.newPayment) {
                    this.submitOrder();
                }
                if (!this.primaryPaymentMethod || this.newPayment) {
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
                billing_country: this.paymentStateFactory.billingCountry,
                billing_region: this.paymentStateFactory.billingRegion,
            };

            if (!this.primaryPaymentMethod || this.newPayment) {
                payload.payment_method_type = this.paymentStateFactory.methodType;
            }
            
            if (this.primaryPaymentMethod || !this.newPayment) {
                payload.payment_method_id = this.primaryPaymentMethod.id;
            }

            if (this.canAcceptPaymentPlans) {
                payload.payment_plan_number_of_payments = this.cartData.number_of_payments;
            }

            if (!this.user) {
                if (this.cartContainsDigitalItems) {
                    payload.account_creation_email = this.accountStateFactory.accountEmail;
                    payload.account_creation_password = this.accountStateFactory.accountPassword;
                    payload.account_creation_password_confirmation = this.accountStateFactory.accountPasswordConfirm;
                } else {
                    payload.billing_email = this.accountStateFactory.accountEmail;
                }
            }

            if (this.cartRequiresShippingAddress) {
                if (this.recentAddresses || !this.newAddress) {
                    payload.shipping_first_name = this.recentAddresses.data[0].attributes.first_name;
                    payload.shipping_last_name = this.recentAddresses.data[0].attributes.last_name;
                    payload.shipping_address_line_1 = this.recentAddresses.data[0].attributes.street_line_1;
                    payload.shipping_address_line_2 = this.recentAddresses.data[0].attributes.street_line_2;
                    payload.shipping_zip_or_postal_code = this.recentAddresses.data[0].attributes.zip;
                    payload.shipping_city = this.recentAddresses.data[0].attributes.city;
                    payload.shipping_region = this.recentAddresses.data[0].attributes.region;
                    payload.shipping_country = this.recentAddresses.data[0].attributes.country;
                } else {
                    payload.shipping_first_name = this.shippingStateFactory.first_name;
                    payload.shipping_last_name = this.shippingStateFactory.last_name;
                    payload.shipping_address_line_1 = this.shippingStateFactory.street_line_one;
                    payload.shipping_address_line_2 = this.shippingStateFactory.street_line_two;
                    payload.shipping_zip_or_postal_code = this.shippingStateFactory.zip_or_postal_code;
                    payload.shipping_city = this.shippingStateFactory.city;
                    payload.shipping_region = this.shippingStateFactory.state;
                    payload.shipping_country = this.shippingStateFactory.country;
                }        
            }

            if (this.paymentStateFactory.methodType === 'credit_card' && (!this.primaryPaymentMethod || this.newPayment)) {
                console.log(this.stripeToken);
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
    a.btn.outline-drumeo {
        border: 2px solid #0B76DB;
        box-shadow: none;
    }

    .flex-end {
        justify-content: flex-end;
    }

    .card-wrapper {
        flex-wrap: wrap;
        margin-right: -30px;
        margin-bottom: 30px;
    }

    .card {
        h5 {
            font-size: 14px;
        }
    }

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
