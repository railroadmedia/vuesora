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
            <section 
                v-if="cartRequiresShippingAddress"
                class="mb-2"
            >
                <!-- Section Heading -->
                <div class="flex flex-row mb-1">
                    <h3 class="title uppercase font-bold">
                        Shipping Information
                    </h3>
                </div>

                <!-- Select a payment method -->
                <template v-if="shippingAddresses.data.length > 0">
                    <div class="flex flex-row flex-wrap">
                        <!-- Create New Default -->
                        <div class="flex flex-col sm-6 xs-12">
                            <label
                                class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer"
                                :class="{ selected: newAddress }"
                                style="border: 1px solid #ddd;"
                            >
                                <div class="flex flex-column xs-1 align-center align-v-center">
                                    <input  
                                        id="address-0"
                                        type="radio"
                                        name="shippingAddressOption"
                                        :checked="newAddress"
                                        @change.stop="newAddress=true; selectedAddress=null"
                                    >
                                </div>
                                <div class="flex flex-column xs-11 align-left align-v-center text-left">
                                    <p class="tiny">
                                        <span class="font-bold">
                                            Create a new shipping address.
                                        </span>
                                    </p>
                                </div>
                            </label>
                        </div>

                        <!-- Use An Existing -->
                        <div
                            v-for="(thisShippingAddress, index) in shippingAddresses.data"
                            :key="index"
                            class="flex flex-col sm-6 xs-12"
                        >
                            <label
                                class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer"
                                :class="{selected: isSelectedAddress(thisShippingAddress)}"
                                :for="`address-${index + 1}`"
                                style="border: 1px solid #ddd;"
                            >
                                <div class="flex flex-column xs-1 align-center align-v-center">
                                    <input
                                        :id="`address-${index + 1}`"
                                        type="radio"
                                        name="shippingAddressOption"
                                        :value="shippingAddress.id"
                                        :checked="isSelectedAddress(thisShippingAddress)"
                                        @change.stop="newAddress=false; selectAddress(thisShippingAddress)"
                                    >
                                </div>

                                <div
                                    class="flex flex-column xs-7 mr-2 align-left text-left"
                                    style="border-right: 1px solid #ddd;"
                                >
                                    <p class="tiny">
                                        <span class="font-bold">
                                            {{ thisShippingAddress.attributes.first_name }}
                                            {{ thisShippingAddress.attributes.last_name }}
                                        </span>
                                    </p>
                                    <p class="tiny">
                                        {{ thisShippingAddress.attributes.street_line_1 }}<span
                                            v-if="thisShippingAddress.attributes.street_line_2.length > 0"
                                        >, {{ thisShippingAddress.attributes.street_line_2 }}
                                        </span>
                                    </p>
                                    <p class="tiny">
                                        {{ thisShippingAddress.attributes.zip.toUpperCase() }}
                                    </p>
                                </div>

                                <div
                                    class="flex flex-column xs-4 align-left text-left"
                                >
                                    <p class="tiny">
                                        <span class="font-bold">
                                            {{ thisShippingAddress.attributes.city }}
                                        </span>
                                    </p>
                                    <p class="tiny">
                                        {{ thisShippingAddress.attributes.region }}
                                    </p>
                                    <p class="tiny">
                                        {{ thisShippingAddress.attributes.country }}
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </template>

                <!-- Shipping Component -->
                <template v-if="newAddress">
                    <p
                        v-if="shippingAddresses.data.length > 0"
                        class="body font-bold uppercase pt-2"
                    >
                        create a new shipping address
                    </p>

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
                <div
                    class="flex flex-row mb-1 pt-2"
                    style="border-top: 1px solid #ddd;"
                >
                    <h3 class="title uppercase font-bold">
                        Payment Plan
                    </h3>
                </div>
                <!-- Plan Component -->
                <order-form-payment-plan
                    ref="paymentForm"
                    :brand="brand"
                    :number-of-payments="cartData.number_of_payments"
                    :payment-plan-options="cartData.payment_plan_options"
                    @updateCartData="updateCart"
                />
            </section>

            <!-- Payment Section -->
            <section 
                v-if="cartData.items.length"
                class="mb-3"
            >
                <!-- Section Heading -->
                <div
                    class="flex flex-row mb-1 pt-2"
                    style="border-top: 1px solid #ddd;"
                >
                    <h3 class="title uppercase font-bold">
                        Payment Details
                    </h3>
                </div>

                <!-- Select a payment method -->
                <template v-if="paymentMethods.data.length > 0">
                    <div class="flex flex-row flex-wrap">
                        <!-- Create New Default -->
                        <div class="flex flex-col sm-6 xs-12">
                            <label
                                class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer"
                                :class="{ selected: newPayment }"
                                style="border: 1px solid #ddd;"
                            >
                                <div class="flex flex-column xs-1 align-center align-v-center">
                                    <input 
                                        id="paymentMethod-0"
                                        type="radio" 
                                        name="paymentMethods"
                                        :checked="newPayment"
                                        @change.stop="newPayment=true; selectedPaymentMethod=null;"
                                    >
                                </div>
                                <div class="flex flex-column xs-11 align-left align-v-center text-left">
                                    <p class="tiny">
                                        <span class="font-bold">
                                            Create a new payment method.
                                        </span>
                                    </p>
                                </div>
                            </label>
                        </div>

                        <!-- Use An Existing -->
                        <div
                            v-for="(paymentMethod, index) in paymentMethods.data"
                            :key="index"
                            class="flex flex-col sm-6 xs-12"
                        >
                            <label
                                class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer"
                                :class="{selected: isSelectedPayment(paymentMethod)}"
                                style="border: 1px solid #ddd;"
                                :for="`paymentMethod-${index + 1}`"
                            >
                                <div class="flex flex-column xs-1 align-center align-v-center">
                                    <input 
                                        :id="`paymentMethod-${index + 1}`"
                                        type="radio" 
                                        name="paymentMethods"
                                        :checked="isSelectedPayment(paymentMethod)"
                                        @change.stop="newPayment=false; selectPayment(paymentMethod)"
                                    >
                                </div>

                                <div class="flex flex-column xs-2 align-center text-center">
                                    <p class="mr-2">
                                        <i :class="['fab', getPaymentMethodIcon(paymentMethod), 'cc-icon']"></i>
                                    </p>
                                </div>

                                <div
                                    v-if="paymentMethod.relationships.method.data.type === 'creditCard'"
                                    class="flex flex-column xs-9 align-v-center"
                                >
                                    <p class="tiny">
                                        <span class="font-bold">
                                            {{ getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.company_name || 'N/A' }}
                                            {{ getPaymentMethodType(paymentMethod) }}
                                        </span>
                                    </p>
                                    <p class="tiny">
                                        Last Four: <span class="font-bold">{{
                                            getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.last_four_digits || 'N/A'
                                        }}</span>
                                    </p>
                                    <p class="tiny">
                                        Expires: <span class="font-bold">{{ getExpirationDate(paymentMethod) }}</span>
                                    </p>
                                </div>

                                <div
                                    v-if="paymentMethod.relationships.method.data.type === 'paypalBillingAgreement'"
                                    class="flex flex-column xs-9 align-v-center"
                                >
                                    <p class="tiny">
                                        <span class="font-bold">{{ getPaymentMethodType(paymentMethod) }}</span>
                                    </p>

                                    <p class="tiny">
                                        Billing Agreement ID: <span class="font-bold">{{
                                            getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.external_id || 'N/A'
                                        }}</span>
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </template>

                <!-- Order Component -->
                <template v-if="newPayment">
                    <p
                        v-if="paymentMethods.data.length > 0"
                        class="body font-bold uppercase mb-2 pt-3"
                    >
                        create a new payment method
                    </p>

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
                        :is-order="true"
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

        shippingAddresses: {
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
            selectedPaymentMethod: null,
            selectedAddress: null,
            loading: false,
            cartData: this.cart,
            requiresAccount: false,
            numberOfPayments: 1,
            paymentPlanOptions: [],
            accountStateFactory: {
                billingEmail: null,
                accountEmail: null,
                accountPassword: null,
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
            const firstPayment = this.paymentMethods.data[0];
            this.paymentMethods.data.some((method) => {
                if (this.isPrimaryPaymentMethod(method)) {
                    this.selectedPaymentMethod = method;
                    return true;
                } 
            });
            if (!this.isPrimaryPaymentMethod(this.selectedPaymentMethod)) {
                this.selectedPaymentMethod = firstPayment;
            }
        }

        // Get Last Address
        if (this.shippingAddresses) {
            const firstAddress = this.shippingAddresses.data[0];
            // check if last address was stored
            if (localStorage.getItem('lastAddress') !== null) {
                this.shippingAddresses.data.some((address) => { 
                    if (address.id === localStorage.getItem('lastAddressId')) {
                        this.selectedAddress = address;
                        return true;
                    }
                });
            } else {
                this.selectedAddress = firstAddress;
            }
        }
    },

    methods: {
        isPrimaryPaymentMethod(paymentMethod) {
            return this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.userPaymentMethod.data,
            ).attributes.is_primary;
        },

        selectAddress(address) {
            this.selectedAddress = address;
        },

        isSelectedAddress(address) {
            if (!this.newAddress) {
                if (this.selectedAddress === address) {
                    return true;
                }
            }
        },

        selectPayment(paymentMethod) {
            this.selectedPaymentMethod = paymentMethod;
        },

        isSelectedPayment(paymentMethod) {
            if (!this.newPayment && this.selectedPaymentMethod) {
                if (this.selectedPaymentMethod.id === paymentMethod.id) {
                    return true;
                }
            }

            return false;
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

        getPaymentMethodType(paymentMethod) {
            if (paymentMethod.relationships.method.data.type === 'creditCard') {
                return 'Credit Card';
            } else if (paymentMethod.relationships.method.data.type === 'paypalBillingAgreement') {
                return 'PayPal Account';
            }

            return 'N/A';
        },

        getPaymentMethodIcon(paymentMethod) {
            const method = this.getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data);

            if (paymentMethod.relationships.method.data.type === 'creditCard') {
                switch (method.attributes.company_name.toLowerCase()) {
                    case 'visa':
                        return 'fa-cc-visa';
                    case 'mastercard':
                        return 'fa-cc-mastercard';
                    case 'discover':
                        return 'fa-cc-discover';
                    case 'american express':
                        return 'fa-cc-amex';
                    default:
                        return '';
                }
            } else if (paymentMethod.relationships.method.data.type === 'paypalBillingAgreement') {
                return 'fa-cc-paypal';
            }

            return '';
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
                    if (!this.shippingAddresses || this.newAddress) {
                        this.$refs.shippingForm.validateForm();
                        if (!this.$refs.shippingForm.formValid) {
                            window.scrollTo({ top: (this.$refs.shippingForm.$el.offsetTop - 100), behavior: 'smooth' });
                            return;
                        }
                    }
                }

                this.loading = true;

                if (this.selectedPaymentMethod || !this.newPayment) {
                    this.submitOrder();
                }
                if (!this.selectedPaymentMethod || this.newPayment) {
                    if (this.paymentStateFactory.methodType === 'paypal') {
                        this.submitOrder();
                    } else {
                        this.$refs.paymentForm.fetchStripeToken()
                            .then(({ token, error }) => {
                                if (error) {
                                    this.loading = false;
                                    window.scrollTo({ top: (this.$refs.paymentForm.$el.offsetTop - 100), behavior: 'smooth' });
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

            if (!this.selectedPaymentMethod || this.newPayment) {
                payload.payment_method_type = this.paymentStateFactory.methodType;
            }
            
            if (this.selectedPaymentMethod || !this.newPayment) {
                payload.payment_method_id = this.selectedPaymentMethod.id;
            }

            if (this.canAcceptPaymentPlans) {
                payload.payment_plan_number_of_payments = this.cartData.number_of_payments;
            }

            if (!this.user) {
                if (this.cartContainsDigitalItems) {
                    payload.account_creation_email = this.accountStateFactory.accountEmail;
                    payload.account_creation_password = this.accountStateFactory.accountPassword;
                } else {
                    payload.billing_email = this.accountStateFactory.accountEmail;
                }
            }

            if (this.cartRequiresShippingAddress) {
                if (!this.newAddress) {
                    payload.shipping_first_name = this.selectedAddress.attributes.first_name;
                    payload.shipping_last_name = this.selectedAddress.attributes.last_name;
                    payload.shipping_address_line_1 = this.selectedAddress.attributes.street_line_1;
                    payload.shipping_address_line_2 = this.selectedAddress.attributes.street_line_2;
                    payload.shipping_zip_or_postal_code = this.selectedAddress.attributes.zip;
                    payload.shipping_city = this.selectedAddress.attributes.city;
                    payload.shipping_region = this.selectedAddress.attributes.region;
                    payload.shipping_country = this.selectedAddress.attributes.country;
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

            if (this.paymentStateFactory.methodType === 'credit_card' && (!this.selectedPaymentMethod || this.newPayment)) {
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

            if (this.selectedAddress) {
                localStorage.setItem('lastAddressId', this.selectedAddress.id);
            }
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
    .selected {
        background-color: #efefef;
        box-shadow: 2px 5px 10px rgba(100,100,100,.5);
        transition: .25s linear all;
    }

    .cursor-pointer { cursor: pointer; }

    a.btn.outline-drumeo {
        border: 2px solid #0B76DB;
        box-shadow: none;
    }

    .flex-end { justify-content: flex-end; }

    .card-wrapper {
        flex-wrap: wrap;
        margin-right: -30px;
        margin-bottom: 30px;
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
