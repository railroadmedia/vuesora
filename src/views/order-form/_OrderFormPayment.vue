<template>
    <div class="flex flex-column mv-2">
        <div class="flex flex-row">
            <h3 class="heading">Payment Details</h3>
        </div>

        <div class="flex flex-column bg-white shadow corners-5 mt-2 pv-3 ph-2">
            <div class="flex flex-row flex-wrap align-v-center">
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <select id="paymentMethodType"
                                class="order-form-input"
                                v-model.lazy="$_paymentMethod">
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                        </select>

                        <label for="paymentMethodType" :class="brand">
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
            <div v-show="$_paymentMethod === 'credit_card'"
                 class="flex flex-row flex-wrap">
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <div id="card-number"
                             class="stripe-element-container order-form-input">
                        </div>

                        <label for="card-number" :class="brand">
                            Card Number
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.cardNumber"
                                :key="'cardNumberError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6">
                    <div class="flex flex-row flex-wrap">
                        <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                            <div class="form-group">
                                <div id="card-expiry"
                                     class="stripe-element-container order-form-input">
                                </div>

                                <label for="card-number" :class="brand">
                                    Expiry (MM / YY)
                                </label>

                                <ul class="errors tiny">
                                    <li v-for="(error, i) in errors.cardExpiry"
                                        :key="'cardExpiryError' + i">
                                        {{ error || null }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                            <div class="form-group">
                                <div id="card-cvc"
                                     class="stripe-element-container order-form-input">
                                </div>

                                <label for="card-number" :class="brand">
                                    CVC
                                </label>

                                <ul class="errors tiny">
                                    <li v-for="(error, i) in errors.cardCvc"
                                        :key="'cardCvcError' + i">
                                        {{ error || null }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap mb-2">
                <div class="flex flex-column xs-12 ph-1 mb-2"
                     :class="$_billingCountry === 'Canada' ? 'sm-6' : ''">
                    <div class="form-group">
                        <select id="billingCountry"
                                :class="{ invalid: errors.billingCountry, 'has-input': $_billingCountry != null }"
                                v-model.lazy="$_billingCountry">

                            <option v-for="country in countries"
                                    :key="country.code"
                                    :value="country.name">{{ country.name }}</option>
                        </select>

                        <label for="billingCountry" :class="brand">
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.billingCountry"
                                :key="'billingCountryError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 ph-1 sm-6" v-if="$_billingCountry === 'Canada'">
                    <div class="form-group">
                        <select id="billingRegion"
                                :disabled="$_billingCountry !== 'Canada'"
                                :class="{ invalid: errors.billingRegion, 'has-input': $_billingRegion != null }"
                                v-model.lazy="$_billingRegion">

                            <option v-for="province in provinces"
                                    :key="province"
                                    :value="province">{{ province }}</option>
                        </select>

                        <label for="billingRegion" :class="brand">
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.billingRegion"
                                :key="'billingRegionError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex flex-row pa-1"
                 v-if="$_paymentMethod === 'paypal'">
                <h3 class="title">Hitting submit will redirect you to PayPal to complete your order.</h3>
            </div>

            <div class="flex flex-row reverse flex-wrap">
                <div class="flex flex-column xs-12 sm-6 ph-1 align-h-right mb-2">
                    <div v-if="discounts.length">
                        <div class="body font-bold" v-for="item in discounts" :key="item.id">{{ item.name }}</div>
                    </div>
                    <div class="body font-bold" v-if="totals.shipping">Shipping: ${{ totalShipping }}</div>
                    <div class="body font-bold">Tax: ${{ totalTax }}</div>
                    <div class="body font-bold"><span class="display">${{ totalDue }}</span> USD</div>
                    <div class="body font-bold">Due Today</div>
                </div>

                <div class="flex flex-column xs-12 sm-6 align-v-bottom ph-1 mb-2">
                    <button class="btn"
                            @click.stop.prevent="submitForm">
                        <span class="text-white bg-success" :class="themeBgClass">
                            Buy Now
                        </span>
                    </button>
                </div>
            </div>

            <div class="flex flex-row pv-1">
                <div class="flex flex-column md-6 ph-1">
                    <h5 class="tiny disclaimer">By completing your renewal you agree to the Pianote Terms
                                Of Service. All payments in US dollars. You
                                can cancel your subscription at any time by emailing support@pianote.com.</h5>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Utils from 'js-helper-functions/modules/utils';
    import Validation from './_validation';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [Validation, ThemeClasses],
        name: 'order-form-payment',
        props: {
            brand: {
                type: String,
            },

            paymentDetails: {
                type: Object,
                default: () => ({
                    cardToken: null,
                    methodType: 'credit_card',
                    billingCountry: null,
                    billingRegion: null,
                })
            },

            billingAddress: {
                type: Object,
                default: () => null
            },

            stripePublishableKey: {
                type: String
            },

            totals: {
                type: Object
            },

            discounts: {
                type: Array,
                default: () => []
            },

            stripeToken: {
                type: Object
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
                    cardCvc: []
                },
                rules: {
                    methodType: [
                        v => !!v || 'Payment Method Type is required'
                    ],
                    billingCountry: [
                        v => !!v || 'Country is required'
                    ],
                    billingRegion: [
                        v => !!v || 'State/Province is required'
                    ],
                },
            }
        },
        computed: {
            countries() {
                return Utils.countries();
            },

            provinces() {
                return Utils.provinces();
            },

            totalTax(){
                return Number(this.totals.tax).toFixed(2);
            },

            totalDue(){
                return Number(this.totals.due).toFixed(2);
            },

            totalShipping(){
                return Number(this.totals.shipping).toFixed(2);
            },

            $_paymentMethod: {
                get() {
                    return this.paymentDetails.methodType;
                },
                set(value) {
                    this.validateInput('methodType', value);

                    this.$emit('updatePaymentData', {
                        key: 'methodType',
                        value: value,
                    });
                }
            },

            $_billingCountry: {
                get() {
                    return this.paymentDetails.billingCountry;
                },
                set(value) {
                    this.validateInput('billingCountry', value);

                    this.$emit('updatePaymentData', {
                        key: 'billingCountry',
                        value: value,
                    });
                }
            },

            $_billingRegion: {
                get() {
                    return this.paymentDetails.billingRegion;
                },
                set(value) {
                    this.validateInput('billingRegion', value);

                    this.$emit('updatePaymentData', {
                        key: 'billingRegion',
                        value: value,
                    });
                }
            },
        },
        methods: {
            submitForm() {
                this.$emit('formSubmit');
            },

            initStripeElements() {
                this.stripe = Stripe(this.stripePublishableKey);

                const elements = this.stripe.elements();
                const style = {
                    base: {
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 300,
                        fontVariant: 'normal',
                        color: '#333333',
                        '::placeholder': {
                            color: 'transparent'
                        }
                    },
                    invalid: {
                        color: '#F71B26',
                    }
                };

                this.cardNumberElement = elements.create('cardNumber', {style});
                this.cardNumberElement.mount('#card-number');
                this.cardNumberElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardNumber');
                });

                this.cardExpiryElement = elements.create('cardExpiry', {style});
                this.cardExpiryElement.mount('#card-expiry');
                this.cardExpiryElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardExpiry');
                });

                this.cardCvcElement = elements.create('cardCvc', {style});
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
                    address_country: this.$_billingCountry
                });
            },
        },
        mounted() {
            this.initStripeElements();
        }
    }
</script>
<style lang="scss">
    .cc-icon {
        font-size: 55px;
        line-height: 50px;
    }
</style>
