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
                                v-model.lazy="paymentMethod">
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                        </select>

                        <label for="paymentMethodType" :class="brand">
                            Payment Method Type
                        </label>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 mb-2">
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
            <div v-show="paymentMethod === 'credit_card'"
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
                            <li>{{ validation.cardNumber }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 mb-2">
                    <div class="flex flex-row">
                        <div class="flex flex-column ph-1">
                            <div class="form-group">
                                <div id="card-expiry"
                                     class="stripe-element-container order-form-input">
                                </div>

                                <label for="card-number" :class="brand">
                                    Expiry (MM / YY)
                                </label>

                                <ul class="errors tiny">
                                    <li>{{ validation.cardExpiry }}</li>
                                </ul>
                            </div>
                        </div>

                        <div class="flex flex-column ph-1">
                            <div class="form-group">
                                <div id="card-cvc"
                                     class="stripe-element-container order-form-input">
                                </div>

                                <label for="card-number" :class="brand">
                                    CVC
                                </label>

                                <ul class="errors tiny">
                                    <li>{{ validation.cardCvc }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap mb-2">
                <div class="flex flex-column xs-12 ph-1 mb-2"
                     :class="billingCountry === 'Canada' ? 'sm-6' : ''">
                    <div class="form-group">
                        <select id="billingCountry"
                                :class="{ invalid: validation.billingCountry, 'has-input': billingCountry != null }"
                                v-model.lazy="billingCountry">

                            <option
                                    v-for="country in countries"
                                    :key="country.code"
                                    :value="country.name">{{ country.name }}</option>
                        </select>

                        <label for="billingCountry" :class="brand">
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.billingCountry }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 ph-1 sm-6" v-if="billingCountry === 'Canada'">
                    <div class="form-group">
                        <select id="billingProvince"
                                :disabled="billingCountry !== 'Canada'"
                                :class="{ invalid: validation.billingProvince, 'has-input': billingProvince != null }"
                                v-model.lazy="billingProvince">

                            <option v-for="province in provinces"
                                    :key="province"
                                    :value="province">{{ province }}</option>
                        </select>

                        <label for="billingProvince" :class="brand">
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.billingProvince }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex flex-row pa-1"
                 v-if="paymentMethod === 'paypal'">
                <h3 class="title">Hitting submit will redirect you to PayPal to complete your order.</h3>
            </div>

            <div class="flex flex-row pv-1">
                <div class="flex flex-column align-v-bottom md-6 ph-1">
                    <button class="btn mb-1"
                            @click.stop.prevent="startValidation">
                        <span class="text-white bg-success" :class="themeBgClass">
                            Buy Now
                        </span>
                    </button>
                </div>

                <div class="flex flex-column md-6 ph-1 align-h-right">
                    <div v-if="discounts.length">
                        <div class="body font-bold" v-for="item in discounts" :key="item.id">{{ item.name }}</div>
                    </div>
                    <div class="body font-bold" v-if="totals.shipping">Shipping: ${{ totals.shipping }}</div>
                    <div class="body font-bold">Tax: ${{ totals.tax }}</div>
                    <div class="body font-bold"><span class="display">${{ totals.due }}</span> USD</div>
                    <div class="body font-bold">Due Today</div>
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
    import Api from '../../assets/js/services/ecommerce.js';
    import Utils from 'js-helper-functions/modules/utils';
    import ValidationTriggerMixin from './_mixin';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ValidationTriggerMixin, ThemeClasses],
        name: 'order-form-payment',
        props: {
            brand: {
                type: String,
            },
            billingAddress: {
                type: Object,
                default: () => null
            },
            stripePublishableKey: {
                type: String
            },
            stripeTokenTrigger: {
                type: Boolean,
                default: () => false
            },
            backendPaymentError: {
                type: Object,
                default: () => null
            },
            discounts: {
                type: Array,
                default: () => []
            },
            totals: {
                type: Object,
                default: () => {
                    return {
                        shipping: null,
                        tax: 0,
                        due: 0,
                    }
                }
            }
        },
        data() {
            return {
                stripe: null,
                cardNumberElement: null,
                cardExpiryElement: null,
                cardCvcElement: null,
                validation: {
                    cardNumber: '',
                    cardExpiry: '',
                    cardCvc: '',
                    billingCountry: '',
                    billingProvince: '',
                },
                controls: {
                    billingCountry: null,
                    billingProvince: null,
                },
                rules: {
                    billingCountry: {
                        pattern: /([^\s])/,
                        message: 'Invalid Country'
                    },
                    billingProvince: {
                        pattern: /([^\s])/,
                        message: 'Invalid Province'
                    },
                },
                selectedPaymentMethod: 'credit_card',
                controlsMap: {
                    billingProvince: 'state',
                    billingCountry: 'country',
                },
                backendKeysMap: {
                    'state': 'billingProvince',
                    'country': 'billingCountry',
                },
                updateAddressesTimeout: null,
                stripeToken: '',
            }
        },
        computed: {
            countries() {
                return Utils.countries();
            },
            provinces() {
                return Utils.provinces();
            },
            paymentMethod: {
                get() {
                    return this.selectedPaymentMethod;
                },
                set(value) {
                    this.selectedPaymentMethod = value;

                    this.$emit(
                        'savePaymentData',
                        {
                            field: 'payment_method_type',
                            value: this.selectedPaymentMethod
                        }
                    );
                }
            },
            billingCountry: {
                get() {
                    return this.controls.billingCountry;
                },
                set(value) {
                    this.$set(this.controls, 'billingCountry', value);

                    this.update('billingCountry');
                }
            },
            billingProvince: {
                get() {
                    return this.controls.billingProvince;
                },
                set(value) {
                    this.$set(this.controls, 'billingProvince', value);

                    this.update('billingProvince');
                }
            },
        },
        watch: {
            billingAddress: function() {
                this.processFactoryData();
            },
            stripeTokenTrigger: function() {
                this.fetchStripeToken();
            },
            backendPaymentError: function(value) {
                if (value) {
                    this.processBackendPaymentError(value);
                }
            }
        },
        methods: {
            update(controlName) {

                this.$emit(
                    'savePaymentData',
                    {
                        field: this.controlsMap[controlName],
                        value: this.controls[controlName]
                    }
                );

                Api.updateAddresses(this.controls)
                    .then(response => {
                        if (response.meta && response.meta.cart) {
                            this.$emit(
                                'updateCartData',
                                response.meta.cart
                            );
                        }
                    });
            },

            startValidation() {
                this.$emit('startValidation');
            },

            validateForm() {

                let validationSuccessful = true;

                for (let controlName in this.validation) {

                    // validationSuccessful = !this.validateControl(controlName) && validationSuccessful;
                }

                this.$emit(
                    'registerSubformValidation',
                    {
                        form: 'payment',
                        result: validationSuccessful
                    }
                );
            },

            initStripeElements() {
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

                this.cardNumberElement = elements.create('cardNumber', {style: style});
                this.cardNumberElement.mount('#card-number');
                this.cardNumberElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardNumber');
                });

                this.cardExpiryElement = elements.create('cardExpiry', {style: style});
                this.cardExpiryElement.mount('#card-expiry');
                this.cardExpiryElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardExpiry');
                });

                this.cardCvcElement = elements.create('cardCvc', {style: style});
                this.cardCvcElement.mount('#card-cvc');
                this.cardCvcElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardCvc');
                });

            },

            elementsChangeHandler(payload, controlName) {
                if (payload.error) {
                    this.validation[controlName] =  payload.error.message;
                } else if (payload.complete) {
                    this.validation[controlName] = '';
                }
            },

            fetchStripeToken() {
                this.stripe
                    .createToken(
                        this.cardNumberElement,
                        {'address_country': this.controls.billingCountry}
                    )
                    .then((result) => {
                        this.stripeToken = result.token.id;

                        this.$emit(
                            'savePaymentData',
                            {
                                field: 'card-token',
                                value: this.stripeToken
                            }
                        );
                    })
                    .catch((error) => {
                        // could not reach this block with current stripe test credit cards that generate errors

                        console.log("stripe token fetch error: %s", JSON.stringify(error));

                        this.validation.cardNumber = 'Unexpected processing error, please retry';
                    });
            },

            processFactoryData() {
                if (this.billingAddress) {

                    for (let backendKey in this.backendKeysMap) {

                        let controlKey = this.backendKeysMap[backendKey];

                        this.controls[controlKey] = this.billingAddress.hasOwnProperty(backendKey) ?
                                                        this.billingAddress[backendKey] : '';

                        if (this.controls[controlKey]) {
                            this.$emit(
                                'savePaymentData',
                                {
                                    field: this.controlsMap[controlKey],
                                    value: this.controls[controlKey]
                                }
                            );
                        }
                    }
                }
            },

            processBackendPaymentError(error) {
                let codes = {
                    'card_declined': {
                        field: 'cardNumber',
                        message: 'Your card was declined by our payment processor',
                    },
                    'incorrect_cvc': {
                        field: 'cardCvc',
                        message: 'Incorect CVC/CVV',
                    },
                    'expired_card': {
                        field: 'cardExpiry',
                        message: 'Your card has expired'
                    }
                }

                if (error.detail && error.detail.code && codes[error.detail.code]) {
                    this.validation[codes[error.detail.code].field] = codes[error.detail.code].message;
                } else if (error.detail && error.detail.message) {
                    this.validation.cardNumber = error.detail.message;
                }
            }
        },
        mounted() {
            this.stripe = Stripe(this.stripePublishableKey);

            this.initStripeElements();

            this.processFactoryData();

            this.$emit(
                'savePaymentData',
                {
                    field: 'payment_method_type',
                    value: this.selectedPaymentMethod
                }
            );
        }
    }
</script>
<style lang="scss">
    .cc-icon {
        font-size: 55px;
        line-height: 50px;
    }
</style>
