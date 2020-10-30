<template>
    <div class="flex flex-column mb-2">
        <div class="flex flex-column">
            <div class="flex flex-row flex-wrap align-v-center nmh-1">
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <select
                            id="paymentMethodType"
                            v-model.lazy="$_paymentMethod"
                            class="order-form-input"
                        >
                            <option value="credit_card">
                                Credit Card
                            </option>
                            <option value="paypal">
                                PayPal
                            </option>
                        </select>

                        <label
                            for="paymentMethodType"
                            :class="brand"
                        >
                            Payment Method Type
                        </label>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 mb-2 overflow">
                    <div class="flex flex-row">
                        <div class="ph-1">
                            <i class="fab fa-cc-visa cc-icon"></i>
                        </div>

                        <div class="ph-1">
                            <i class="fab fa-cc-mastercard cc-icon"></i>
                        </div>

                        <div class="ph-1">
                            <i class="fab fa-cc-amex cc-icon"></i>
                        </div>

                        <div class="ph-1">
                            <i class="fab fa-cc-paypal cc-icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- v-show is used to keep the stripe elements iframes loaded but hidden, using v-if would require re-initialization -->
            <div
                v-show="$_paymentMethod === 'credit_card'"
                class="flex flex-row flex-wrap nmh-1"
            >
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <div
                            id="card-number"
                            class="stripe-element-container order-form-input"
                        >
                        </div>

                        <label
                            for="card-number"
                            :class="brand"
                        >
                            Card Number
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.cardNumber"
                                :key="'cardNumberError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6">
                    <div class="flex flex-row flex-wrap">
                        <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                            <div class="form-group">
                                <div
                                    id="card-expiry"
                                    class="stripe-element-container order-form-input"
                                >
                                </div>

                                <label
                                    for="card-number"
                                    :class="brand"
                                >
                                    Expiry (MM / YY)
                                </label>

                                <ul class="errors tiny">
                                    <li
                                        v-for="(error, i) in errors.cardExpiry"
                                        :key="'cardExpiryError' + i"
                                    >
                                        {{ error || null }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                            <div class="form-group">
                                <div
                                    id="card-cvc"
                                    class="stripe-element-container order-form-input"
                                >
                                </div>

                                <label
                                    for="card-number"
                                    :class="brand"
                                >
                                    CVC
                                </label>

                                <ul class="errors tiny">
                                    <li
                                        v-for="(error, i) in errors.cardCvc"
                                        :key="'cardCvcError' + i"
                                    >
                                        {{ error || null }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap nmh-1 mb-2">
                <div
                    class="flex flex-column xs-12 ph-1 mb-2"
                    :class="$_billingCountry === 'Canada' ? 'sm-6' : ''"
                >
                    <div class="form-group">
                        <select
                            id="billingCountry"
                            v-model.lazy="$_billingCountry"
                            :class="{ invalid: errors.billingCountry, 'has-input': $_billingCountry != null }"
                        >
                            <option
                                v-for="country in countries"
                                :key="country"
                                :value="country"
                            >
                                {{ country }}
                            </option>
                        </select>

                        <label
                            for="billingCountry"
                            :class="brand"
                        >
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.billingCountry"
                                :key="'billingCountryError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    v-if="$_billingCountry === 'Canada'"
                    class="flex flex-column xs-12 ph-1 sm-6"
                >
                    <div class="form-group">
                        <select
                            id="billingRegion"
                            v-model.lazy="$_billingRegion"
                            :disabled="$_billingCountry !== 'Canada'"
                            :class="{ invalid: errors.billingRegion, 'has-input': $_billingRegion != null }"
                        >
                            <option
                                v-for="province in provinces"
                                :key="province"
                                :value="toCapitalCase(province)"
                            >
                                {{ toCapitalCase(province) }}
                            </option>
                        </select>

                        <label
                            for="billingRegion"
                            :class="brand"
                        >
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.billingRegion"
                                :key="'billingRegionError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                v-if="$_paymentMethod === 'paypal'"
                class="flex flex-row pa-1"
            >
                <h3 class="tiny text-grey-3 font-italic">
                    * Submitting this form will redirect you to PayPal to complete your order.
                </h3>
            </div>

            <div
                v-if="!isOrder"
                class="flex flex-row mb-1"
            >
                <div class="flex flex-column ph-1">
                    <!--                    <div-->
                    <!--                        v-if="showCheckbox"-->
                    <!--                        class="flex flex-row form-group align-v-center mb-2"-->
                    <!--                    >-->
                    <!--                        <span class="toggle-input mr-1">-->
                    <!--                            <input-->
                    <!--                                id="subscriptionCheck"-->
                    <!--                                name="subscription-check"-->
                    <!--                                v-model="$_subscriptionCheck"-->
                    <!--                                type="checkbox"-->
                    <!--                            >-->

                    <!--                            <span class="toggle">-->
                    <!--                                <span class="handle"></span>-->
                    <!--                            </span>-->
                    <!--                        </span>-->

                    <!--                        <label-->
                    <!--                            for="subscriptionCheck"-->
                    <!--                               class="toggle-label capitalize"-->
                    <!--                        >-->
                    <!--                            Set as default payment method-->
                    <!--                        </label>-->
                    <!--                    </div>-->

                    <div
                        v-if="hasSubscription"
                        class="flex flex-row form-group align-v-center mb-2"
                    >
                        <span class="toggle-input mr-1">
                            <input
                                id="updateActiveSubscriptions"
                                v-model="paymentDetails.updateActiveSubscriptions"
                                name="update-active-subscriptions"
                                type="checkbox"
                            >
  
                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            for="updateActiveSubscriptions"
                            class="toggle-label font-bold"
                        >
                            Update my existing active subscriptions to use this payment method.
                        </label>
                    </div>

                    <div
                        v-if="hasSubscription && !isActive"
                        class="flex flex-row form-group align-v-center mb-2 pt-2"
                        style="border-top: 1px solid #ddd;"
                    >
                        <span class="toggle-input mr-1">
                            <input
                                id="renewDueSubscription"
                                v-model="paymentDetails.renewDueSubscription"
                                name="renew-due-subscription"
                                type="checkbox"
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            for="renewDueSubscription"
                            class="toggle-label font-bold"
                        >
                            Renew my subscription now.
                        </label>
                    </div>

                    <div
                        v-if="paymentDetails.renewDueSubscription && hasSubscription && !isActive"
                    >
                        <div
                            class="flex flex-row mb-2"
                        >
                            <div class="flex flex-column">
                                <p class="tiny font-italic text-grey-3">
                                    * Submitting this form will create a new default payment method for you.
                                    Your current subscription will be billed to this payment method when it's due.
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex flex-row flex-wrap"
                        >
                            <div class="flex flex-column xs-12 sm-12 ph-1 align-h-right mb-2">
                                <div
                                    v-if="totals.shipping"
                                    class="body font-bold"
                                >
                                    Shipping: ${{ totalShipping }}
                                </div>

                                <div class="body font-bold">
                                    Tax: ${{ totalTax }}
                                </div>

                                <div class="body font-bold">
                                    <span class="display">${{ totalDue }}</span> USD
                                </div>

                                <div class="body font-bold">
                                    Due Today
                                </div>
                            </div>
                        </div>
                    </div>
                  

                    <div class="flex flex-row flex-wrap align-h-right align-v-center">
                        <div class="flex flex-column xs-6 sm-4 pr-1">
                            <button
                                class="btn short close-modal"
                                @click="cancelForm"
                            >
                                <span class="flat text-grey-4">
                                    Cancel
                                </span>
                            </button>
                        </div>

                        <div class="flex flex-column xs-6 sm-4 pl-1">
                            <button
                                class="btn"
                                @click="submitForm"
                            >
                                <span
                                    class="text-white"
                                    :class="themeBgClass"
                                >
                                    Submit
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Utils from '@musora/helper-functions/modules/utils';
import Validation from './_validation';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'OrderFormPayment',
    mixins: [Validation, ThemeClasses],
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        paymentDetails: {
            type: Object,
            default: () => ({
                cardToken: null,
                methodType: 'credit_card',
                billingCountry: null,
                billingRegion: null,
            }),
        },

        billingAddress: {
            type: Object,
            default: () => null,
        },

        stripePublishableKey: {
            type: String,
        },

        totals: {
            type: Object,
        },

        discounts: {
            type: Array,
            default: () => [],
        },

        stripeToken: {
            type: Object,
        },

        countries: {
            type: Array,
            default: () => [],
        },

        provinces: {
            type: Array,
            default: () => [],
        },

        isOrder: {
            type: Boolean,
            default: () => true,
        },

        hasSubscription: {
            type: Boolean,
            default: () => true,
        },

        isActive: {
            type: Boolean,
            default: () => true,
        },
    },
    data() {
        return {
            stripe: null,
            cardNumberElement: null,
            cardExpiryElement: null,
            cardCvcElement: null,
            errors: {
                methodType: [],
                billingCountry: [],
                billingRegion: [],
                cardNumber: [],
                cardExpiry: [],
                cardCvc: [],
            },
            rules: {
                methodType: [
                    v => !!v || 'Payment Method Type is required',
                ],
                billingCountry: [
                    v => !!v || 'Country is required',
                ],
                billingRegion: [
                    v => !!v || 'State/Province is required',
                ],
            },
            subscriptionCheck: false,
        };
    },
    computed: {
        totalTax() {
            return Number(this.totals.tax || 0).toFixed(2);
        },

        totalDue() {
            return Number(this.totals.due || 0).toFixed(2);
        },

        totalShipping() {
            return Number(this.totals.shipping || 0).toFixed(2);
        },

        $_paymentMethod: {
            get() {
                return this.paymentDetails.methodType;
            },
            set(value) {
                this.validateInput('methodType', value);

                this.$emit('updatePaymentData', {
                    key: 'methodType',
                    value,
                });
            },
        },

        $_billingCountry: {
            get() {
                return this.paymentDetails.billingCountry;
            },
            set(value) {
                this.validateInput('billingCountry', value);

                this.$emit('updatePaymentData', {
                    key: 'billingCountry',
                    value,
                });
            },
        },

        $_billingRegion: {
            get() {
                return this.paymentDetails.billingRegion;
            },
            set(value) {
                this.validateInput('billingRegion', value);

                this.$emit('updatePaymentData', {
                    key: 'billingRegion',
                    value,
                });
            },
        },

        $_subscriptionCheck: {
            get() {
                return this.paymentDetails.subscriptionCheck || false;
            },
            set(value) {
                this.$emit('updatePaymentData', {
                    key: 'subscriptionCheck',
                    value,
                });
            },
        },

        showCheckbox() {
            return this.hasSubscription && !this.isActive;
        },
    },
    mounted() {
        this.initStripeElements();
    },
    methods: {
        toCapitalCase: string => Utils.toCapitalCase(string),

        submitForm() {
            this.$emit('formSubmit');
        },

        cancelForm() {
            this.initStripeElements();

            this.$emit('formCancel');

            setTimeout(() => {
                Object.keys(this.errors).forEach((error) => {
                    this.errors[error] = [];
                });

                this.$nextTick(() => this.$forceUpdate());
            }, 200);
        },

        initStripeElements() {
            this.stripe = Stripe(this.stripePublishableKey);

            const elements = this.stripe.elements();
            const style = {
                base: {
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 300,
                    fontVariant: 'normal',
                    color: '#333333',
                    '::placeholder': {
                        color: 'transparent',
                    },
                },
                invalid: {
                    color: '#F71B26',
                },
            };

            this.cardNumberElement = elements.create('cardNumber', { style });
            this.cardNumberElement.mount('#card-number');
            this.cardNumberElement.on('change', (payload) => {
                this.elementsChangeHandler(payload, 'cardNumber');
            });

            this.cardExpiryElement = elements.create('cardExpiry', { style });
            this.cardExpiryElement.mount('#card-expiry');
            this.cardExpiryElement.on('change', (payload) => {
                this.elementsChangeHandler(payload, 'cardExpiry');
            });

            this.cardCvcElement = elements.create('cardCvc', { style });
            this.cardCvcElement.mount('#card-cvc');
            this.cardCvcElement.on('change', (payload) => {
                this.elementsChangeHandler(payload, 'cardCvc');
            });
        },

        elementsChangeHandler(payload, controlName) {
            this.errors[controlName] = [];

            if (payload.error) {
                this.errors[controlName].push(payload.error.message);
            }
        },

        fetchStripeToken() {
            return this.stripe.createToken(this.cardNumberElement, {
                address_country: this.$_billingCountry,
            });
        },
    },
};
</script>
<style lang="scss">
    .cc-icon {
        font-size: 55px;
        line-height: 50px;
    }
</style>
