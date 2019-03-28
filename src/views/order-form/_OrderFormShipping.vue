<template>
    <div class="flex flex-column mv-2">
        <div class="flex flex-row align-v-center pb-2">
            <div class="flex flex-grow flex-row align-v-center">
                <h3 class="heading color-blue">Shipping Information</h3>
            </div>
            <div class="flex flex-auto">
                <h4 class="body text-dark">All fields except 'Address - Line 2' are mandatory.</h4>
            </div>
        </div>
        <div class="flex flex-column bg-white shadow corners-5 pa-2">
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="first-name"
                        placeholder="First Name"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingFirstName }"
                        v-model="controls.shippingFirstName"
                        v-on:blur="handleBlurControl('shippingFirstName')">
                    <span class="validation tiny">{{ validation.shippingFirstName }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="last-name"
                        placeholder="Last Name"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingLastName }"
                        v-model="controls.shippingLastName"
                        v-on:blur="handleBlurControl('shippingLastName')">
                    <span class="validation tiny">{{ validation.shippingLastName }}</span>
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="address-line1"
                        placeholder="Address - Line 1"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingAddressLine1 }"
                        v-model="controls.shippingAddressLine1"
                        v-on:blur="handleBlurControl('shippingAddressLine1')">
                    <span class="validation tiny">{{ validation.shippingAddressLine1 }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="address-line2"
                        placeholder="Address - Line 2"
                        class="order-form-input"
                        v-model="controls.shippingAddressLine2"
                        v-on:blur="handleBlurControl('shippingAddressLine2')">
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingCity }"
                        v-model="controls.shippingCity"
                        v-on:blur="handleBlurControl('shippingCity')">
                    <span class="validation tiny">{{ validation.shippingCity }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingState }"
                        v-model="controls.shippingState"
                        v-on:blur="handleBlurControl('shippingState')">
                    <span class="validation tiny">{{ validation.shippingState }}</span>
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1 md-6 sm-12">
                    <select
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingCountry }"
                        v-model="controls.shippingCountry"
                        v-on:blur="handleBlurControl('shippingCountry')">

                        <option disabled value="">Country</option>
                        <option
                            v-for="(country, code) in countries"
                            :key="code"
                            :value="country">{{ country }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.shippingCountry }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip/Postal Code"
                        class="order-form-input"
                        v-bind:class="{ invalid: validation.shippingZip }"
                        v-model="controls.shippingZip"
                        v-on:blur="handleBlurControl('shippingZip')">
                    <span class="validation tiny">{{ validation.shippingZip }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'order-form-shipping',
        props: {
            shippingAddress: {
                type: Object,
                default: () => null
            },
            countries: {
                type: Object,
                default: () => {
                    return {}
                }
            },
        },
        data() {
            return {
                validation: {
                    shippingFirstName: '',
                    shippingLastName: '',
                    shippingAddressLine1: '',
                    shippingCity: '',
                    shippingState: '',
                    shippingCountry: '',
                    shippingZip: '',
                },
                controls: {
                    shippingFirstName: '',
                    shippingLastName: '',
                    shippingAddressLine1: '',
                    shippingAddressLine2: '',
                    shippingCity: '',
                    shippingState: '',
                    shippingCountry: '',
                    shippingZip: '',
                },
                rules: {
                    shippingFirstName: {
                        pattern: /([^\s])/,
                        message: 'Invalid First Name'
                    },
                    shippingLastName: {
                        pattern: /([^\s])/,
                        message: 'Invalid Last Name'
                    },
                    shippingAddressLine1: {
                        pattern: /([^\s])/,
                        message: 'Invalid Address'
                    },
                    shippingCity: {
                        pattern: /([^\s])/,
                        message: 'Invalid City'
                    },
                    shippingState: {
                        pattern: /([^\s])/,
                        message: 'Invalid State/Province'
                    },
                    shippingCountry: {
                        pattern: /([^\s])/,
                        message: 'Invalid Country'
                    },
                    shippingZip: {
                        pattern: /([^\s])/,
                        message: 'Invalid Zip/Postal code'
                    },
                }
            }
        },
        methods: {
            handleBlurControl(controlName) {
                this.validateControl(controlName);
                this.saveShippingAddress();
            },
            saveShippingAddress() {
                this.$root.$emit('saveAddress', this.controls);
            },
            validateControl(controlName) {

                return this.validation[controlName] = (
                    this.rules.hasOwnProperty(controlName) &&
                    this.controls.hasOwnProperty(controlName) &&
                    !this.rules[controlName].pattern.test(this.controls[controlName])
                ) ? this.rules[controlName].message : '';
            },
            validateForm() {

                let validationSuccessful = true;

                for (let controlName in this.rules) {
                    validationSuccessful = !this.validateControl(controlName) && validationSuccessful;
                }

                this.$root.$emit(
                    'registerSubformValidation',
                    {
                        form: 'shipping',
                        result: validationSuccessful
                    }
                );
            },
        },
        mounted() {

            let keysMap = {
                'zip_or_postal_code': 'shippingZip',
                'street_line_two': 'shippingAddressLine2',
                'street_line_one': 'shippingAddressLine1',
                'last_name': 'shippingLastName',
                'first_name': 'shippingFirstName',
                'state': 'shippingState',
                'country': 'shippingCountry',
                'city': 'shippingCity'
            };

            if (this.shippingAddress) {

                for (let backendKey in keysMap) {

                    let controlKey = keysMap[backendKey];

                    this.controls[controlKey] = this.shippingAddress.hasOwnProperty(backendKey) ?
                                                    this.shippingAddress[backendKey] : '';
                }
            }

            this.$root.$on('validateOrderForm', this.validateForm);
        }
    }
</script>
<style lang="scss">

</style>
