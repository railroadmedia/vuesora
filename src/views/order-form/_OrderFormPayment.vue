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
                        v-model="paymentMethod">
                        <option value="cc">Credit Card</option>
                        <option value="pp">PayPal</option>
                    </select>
                </div>
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
            <!-- v-show is used to keep the stripe elements iframes loaded but hidden, using v-if would require re-initialization -->
            <div class="flex flex-row pv-1" v-show="paymentMethod == 'cc'">
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
                        v-model="controls.billingCountry"
                        v-on:blur="handleBlurControl('billingCountry')">

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
                        v-model="controls.billingState"
                        v-on:blur="handleBlurControl('billingState')">

                        <option disabled value="">State</option>
                        <option
                            v-for="state in states"
                            :key="state"
                            :value="state">{{ state }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.billingState }}</span>
                </div>
            </div>
            <div class="flex flex-row pa-1" v-if="paymentMethod == 'pp'">
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
                paymentMethod: 'cc'
            }
        },
        computed: {
            countries() {
                return Utils.countries();
            },
            states() {
                return Utils.provinces();
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
        methods: {
            handleBlurControl(controlName) {
                this.validateControl(controlName);
                this.saveBillingAddress();
            },
            saveBillingAddress() {
                // todo - if country is not 'Canada' should remove the billing state - to be confirmed
                this.$emit('saveAddress', this.controls);
            },
            validateControl(controlName) {

                let validation = this.validation[controlName] = (
                    this.rules.hasOwnProperty(controlName) &&
                    this.controls.hasOwnProperty(controlName) &&
                    (
                        this.controls[controlName] == null ||
                        !this.rules[controlName].pattern.test(this.controls[controlName])
                    )
                ) ? this.rules[controlName].message : '';

                return validation;
            },
            startValidation() {
                this.$emit('startValidation');
            },
            validateForm() {
                // todo - add validation logic
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
                this.cardNumberElement.on('change', this.elementsChangeHandler);

                this.cardExpiryElement = elementsFactory.create('cardExpiry', {style: style});
                this.cardExpiryElement.mount('#card-expiry');
                this.cardExpiryElement.on('change', this.elementsChangeHandler);

                this.cardCvcElement = elementsFactory.create('cardCvc', {style: style});
                this.cardCvcElement.mount('#card-cvc');
                this.cardCvcElement.on('change', this.elementsChangeHandler);

            },
            elementsChangeHandler(payload) {
                // todo - add validation logic
                console.log("stripe elements change handler payload: %s", JSON.stringify(payload));
            }
            // todo - add method to handle order form submission - stripe token fetch, then backend ajax request to place order
        },
        mounted() {
            this.stripe = Stripe(this.stripePublishableKey);
            this.initStripeElements();

            let keysMap = {
                'state': 'billingState',
                'country': 'billingCountry',
            };

            if (this.billingAddress) {

                for (let backendKey in keysMap) {

                    let controlKey = keysMap[backendKey];

                    this.controls[controlKey] = this.billingAddress.hasOwnProperty(backendKey) ?
                                                    this.billingAddress[backendKey] : '';
                }
            }
        }
    }
</script>
<style lang="scss">
    .cc-icon {
        font-size: 55px;
        line-height: 50px;
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
