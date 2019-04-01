<template>
    <div class="flex flex-column mv-2">
        <div class="flex pb-2">
            <h3 class="heading color-blue">Payment Details</h3>
        </div>
        <div class="flex flex-column bg-white shadow corners-5 mt-2 pa-2">
            <div class="flex flex-row align-v-center pv-1">
                <div class="flex md-6 ph-1">
                    <select
                        class="order-form-input no-label"
                        v-model.lazy="paymentMethod">
                        <option value="credit-card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                <div class="flex flex-row">
                    <div class="ph-1">
                        <i
                            class="fab fa-cc-visa cc-icon"
                            v-bind:class="{ selected: selectedPaymentMethodIcon == 'visa' }"
                            v-on:click.stop.prevent="selectPaymentMethodIcon('visa')"></i>
                    </div>
                    <div class="ph-1">
                        <i
                            class="fab fa-cc-mastercard cc-icon"
                            v-bind:class="{ selected: selectedPaymentMethodIcon == 'mastercard' }"
                            v-on:click.stop.prevent="selectPaymentMethodIcon('mastercard')"></i>
                    </div>
                    <div class="ph-1">
                        <i
                            class="fab fa-cc-amex cc-icon"
                            v-bind:class="{ selected: selectedPaymentMethodIcon == 'amex' }"
                            v-on:click.stop.prevent="selectPaymentMethodIcon('amex')"></i>
                    </div>
                    <div class="ph-1">
                        <i
                            class="fab fa-cc-paypal cc-icon"
                            v-bind:class="{ selected: selectedPaymentMethodIcon == 'paypal' }"
                            v-on:click.stop.prevent="selectPaymentMethodIcon('paypal')"></i>
                    </div>
                </div>
            </div>
            <!-- v-show is used to keep the stripe elements iframes loaded but hidden, using v-if would require re-initialization -->
            <div class="flex flex-row pv-1" v-show="paymentMethod == 'credit-card'">
                <div class="md-6 ph-1">
                    <div
                        class="stripe-element-container order-form-input no-label"
                        v-bind:class="{ invalid: validation.cardNumber }"
                        id="card-number">
                    </div>
                    <span class="validation tiny">{{ validation.cardNumber }}</span>
                </div>
                <div class="md-3 ph-1">
                    <div
                        class="stripe-element-container order-form-input"
                        v-bind:class="{ invalid: validation.cardExpiry }"
                        id="card-expiry">
                    </div>
                    <span class="validation tiny">{{ validation.cardExpiry }}</span>
                </div>
                <div class="md-3 ph-1">
                    <div
                        class="stripe-element-container order-form-input"
                        v-bind:class="{ invalid: validation.cardCvc }"
                        id="card-cvc">
                    </div>
                    <span class="validation tiny">{{ validation.cardCvc }}</span>
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="md-6 ph-1">
                    <select
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.billingCountry }"
                        v-model.lazy="billingCountry">

                        <option disabled value="">Country</option>
                        <option
                            v-for="country in countries"
                            :key="country.code"
                            :value="country.name">{{ country.name }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.billingCountry }}</span>
                </div>
                <div class="md-6 ph-1" v-if="controls.billingCountry.toLowerCase() == 'canada'">
                    <select
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.billingState }"
                        v-model.lazy="billingState">

                        <option disabled value="">State</option>
                        <option
                            v-for="state in states"
                            :key="state"
                            :value="state">{{ state }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.billingState }}</span>
                </div>
            </div>
            <div class="flex flex-row pa-1" v-if="paymentMethod == 'paypal'">
                <h3 class="title">Hitting submit will redirect you to PayPal to complete your order.</h3>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex md-6 ph-1">
                    <a
                        class="btn submit-order text-white"
                        v-on:click.stop.prevent="startValidation">Buy Now</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/order-form.js';
    import Utils from 'js-helper-functions/modules/utils';
    import ValidationTriggerMixin from './_mixin';

    export default {
        mixins: [ValidationTriggerMixin],
        name: 'order-form-payment',
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
                    billingState: '',
                },
                stripeErrorMap: {
                    'incomplete_number': 'Your card number is incomplete.',
                    'incomplete_expiry': 'Expiration date is incomplete.',
                    'incomplete_cvc': 'CVC is incomplete.',
                },
                stripeInvalidMessages: {
                    cardNumber: 'Your card number is invalid.',
                    cardExpiry: 'Expiration date is invalid.',
                    cardCvc: 'CVC is invalid.',
                },
                stripeElementsCompleteness: {
                    cardNumber: false,
                    cardExpiry: false,
                    cardCvc: false,
                },
                controls: {
                    billingCountry: '',
                    billingState: '',
                },
                rules: {
                    billingCountry: {
                        pattern: /([^\s])/,
                        message: 'Invalid Country'
                    },
                    billingState: {
                        pattern: /([^\s])/,
                        message: 'Invalid State'
                    },
                },
                selectedPaymentMethod: 'credit-card',
                selectedPaymentMethodIcon: '',
                controlsMap: {
                    billingState: 'state',
                    billingCountry: 'country',
                },
                backendKeysMap: {
                    state: 'billingState',
                    country: 'billingCountry',
                },
                updateAddressesTimeout: null,
            }
        },
        computed: {
            countries() {
                return Utils.countries();
            },
            states() {
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

                    if (value == 'paypal') {
                        this.selectedPaymentMethodIcon = 'paypal';
                    } else {
                        this.selectedPaymentMethodIcon = '';
                    }
                }
            },
            billingCountry: {
                get() {
                    return this.controls.billingCountry;
                },
                set(value) {
                    if (this.controls.billingCountry != value) {
                        this.controls.billingCountry = value;
                        this.update('billingCountry');
                    }
                }
            },
            billingState: {
                get() {
                    return this.controls.billingState;
                },
                set(value) {
                    if (this.controls.billingState != value) {
                        this.controls.billingState = value;
                        this.update('billingState');
                    }
                }
            },
        },
        props: {
            billingAddress: {
                type: Object,
                default: () => null
            },
            stripePublishableKey: {
                type: String
            },
        },
        watch: {
            billingAddress: function() {
                this.processFactoryData();
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

                clearTimeout(this.updateAddressesTimeout);

                this.updateAddressesTimeout = setTimeout(() => {
                    // todo - if country is not 'Canada' should remove the billing state - to be confirmed
                    Api.updateAddresses(this.controls);
                }, 750);
            },
            selectPaymentMethodIcon(name) {
                this.selectedPaymentMethodIcon = name;
                this.selectedPaymentMethod = (name == 'paypal') ? 'paypal' : 'credit-card';
                this.$emit(
                    'savePaymentData',
                    {
                        field: 'payment_method_type',
                        value: this.selectedPaymentMethod
                    }
                );
            },
            validateControl(controlName) {

                if (
                    this.selectedPaymentMethod == 'credit-card' &&
                    this.stripeElementsCompleteness.hasOwnProperty(controlName) &&
                    !this.stripeElementsCompleteness[controlName]
                ) {
                    // stripe element failed validation
                    let elementIsValid = this.stripeElementsCompleteness[controlName];

                    this.validation[controlName] = this.stripeInvalidMessages[controlName];

                } else if (
                    this.rules.hasOwnProperty(controlName) &&
                    this.controls.hasOwnProperty(controlName) &&
                    (
                        this.controls[controlName] == null ||
                        !this.rules[controlName].pattern.test(this.controls[controlName])
                    )
                ) {
                    // normal form element failed validation
                    this.validation[controlName] = this.rules[controlName].message;

                } else {
                    // validation passed
                    this.validation[controlName] = '';
                }

                return this.validation[controlName];
            },
            startValidation() {
                this.$emit('startValidation');
            },
            validateForm() {
                // todo - add validation logic
                console.log("start form validation");

                let validationSuccessful = true;

                for (let controlName in this.validation) {

                    validationSuccessful = !this.validateControl(controlName) && validationSuccessful;
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

                let elementsFactory = this.stripe.elements();

                let style = {
                    base: {
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 300,
                        fontVariant: 'normal',
                        color: '#333333',
                        lineHeight: '1.5em',
                    },
                };

                this.cardNumberElement = elementsFactory.create('cardNumber', {style: style});
                this.cardNumberElement.mount('#card-number');
                this.cardNumberElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardNumber');
                });

                this.cardExpiryElement = elementsFactory.create('cardExpiry', {style: style});
                this.cardExpiryElement.mount('#card-expiry');
                this.cardExpiryElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardExpiry');
                });

                this.cardCvcElement = elementsFactory.create('cardCvc', {style: style});
                this.cardCvcElement.mount('#card-cvc');
                this.cardCvcElement.on('change', (payload) => {
                    this.elementsChangeHandler(payload, 'cardCvc');
                });

            },
            elementsChangeHandler(payload, controlName) {

                this.stripeElementsCompleteness[controlName] = payload.complete;

                if (payload.error) {
                    this.validation[controlName] = this.stripeErrorMap.hasOwnProperty(payload.error.code) ?
                                this.stripeErrorMap[payload.error.code] : payload.error.message;
                } else if (payload.complete) {
                    this.validation[controlName] = '';
                }
            },
            processFactoryData() {
                if (this.billingAddress) {

                    for (let backendKey in this.backendKeysMap) {

                        let controlKey = this.backendKeysMap[backendKey];

                        this.controls[controlKey] = this.billingAddress.hasOwnProperty(backendKey) ?
                                                        this.billingAddress[backendKey] : '';
                    }
                }
            },
            // todo - add method to handle order form submission - stripe token fetch, then backend ajax request to place order
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

        &.fa-cc-visa.selected,
        &.fa-cc-amex.selected,
        &.fa-cc-paypal.selected {
            color: #0a87c1;
        }

        &.fa-cc-mastercard.selected {
            color: #ed1c2d;
        }
    }
    .stripe-element-container {
        height: 50px;
        border-radius: 5px;
        border: 1px solid #d1d1d1;
        width: 100%;
        display: block;
    }
    .submit-order {
        background-color: forestgreen;

        &:hover {
            background-color: limegreen;
        }
    }
</style>
