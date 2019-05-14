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
                     :class="$_billingCountry === 'Canada' ? 'sm-6' : ''">
                    <div class="form-group">
                        <select id="billingCountry"
                                :class="{ invalid: validation.billingCountry, 'has-input': $_billingCountry != null }"
                                v-model.lazy="$_billingCountry">

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

                <div class="flex flex-column xs-12 ph-1 sm-6" v-if="$_billingCountry === 'Canada'">
                    <div class="form-group">
                        <select id="billingRegion"
                                :disabled="$_billingCountry !== 'Canada'"
                                :class="{ invalid: validation.billingRegion, 'has-input': $_billingRegion != null }"
                                v-model.lazy="$_billingRegion">

                            <option v-for="province in provinces"
                                    :key="province"
                                    :value="province">{{ province }}</option>
                        </select>

                        <label for="billingRegion" :class="brand">
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.billingRegion }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex flex-row pa-1"
                 v-if="$_paymentMethod === 'paypal'">
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

<!--                <div class="flex flex-column md-6 ph-1 align-h-right">-->
<!--                    <div v-if="discounts.length">-->
<!--                        <div class="body font-bold" v-for="item in discounts" :key="item.id">{{ item.name }}</div>-->
<!--                    </div>-->
<!--                    <div class="body font-bold" v-if="totals.shipping">Shipping: ${{ totals.shipping }}</div>-->
<!--                    <div class="body font-bold">Tax: ${{ totals.tax }}</div>-->
<!--                    <div class="body font-bold"><span class="display">${{ totals.due }}</span> USD</div>-->
<!--                    <div class="body font-bold">Due Today</div>-->
<!--                </div>-->
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

            discounts: {
                type: Array,
                default: () => []
            },
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
                    billingRegion: '',
                },
                controls: {
                    methodType: 'credit_card',
                    billingCountry: null,
                    billingRegion: null,
                },
                rules: {
                    billingCountry: {
                        pattern: /([^\s])/,
                        message: 'Invalid Country'
                    },
                    billingRegion: {
                        pattern: /([^\s])/,
                        message: 'Invalid Province'
                    },
                },
                selectedPaymentMethod: 'credit_card',
                backendKeysMap: {
                    'state': 'billingRegion',
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

            $_paymentMethod: {
                get() {
                    return this.paymentDetails.methodType;
                },
                set(value) {
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
                    this.$emit('updatePaymentData', {
                        key: 'billingRegion',
                        value: value,
                    });
                }
            },
        },
        methods: {
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
                this.stripe.createToken(this.cardNumberElement, {
                    address_country: this.$_billingCountry
                })
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
                };

                if (error.detail && error.detail.code && codes[error.detail.code]) {
                    this.validation[codes[error.detail.code].field] = codes[error.detail.code].message;
                } else if (error.detail && error.detail.message) {
                    this.validation.cardNumber = error.detail.message;
                }
            }
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
