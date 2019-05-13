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
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingFirstName }"
                        v-model.lazy="firstName">
                    <span class="validation tiny">{{ validation.shippingFirstName }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="last-name"
                        placeholder="Last Name"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingLastName }"
                        v-model.lazy="lastName">
                    <span class="validation tiny">{{ validation.shippingLastName }}</span>
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="address-line1"
                        placeholder="Address - Line 1"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingAddressLine1 }"
                        v-model.lazy="addressLine1">
                    <span class="validation tiny">{{ validation.shippingAddressLine1 }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="address-line2"
                        placeholder="Address - Line 2"
                        class="order-form-input no-label"
                        v-model.lazy="addressLine2">
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingCity }"
                        v-model.lazy="city">
                    <span class="validation tiny">{{ validation.shippingCity }}</span>
                </div>
                <div class="flex flex-column ph-1" v-if="country.toLowerCase() != 'canada'">
                    <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingState }"
                        v-model.lazy="state">
                    <span class="validation tiny">{{ validation.shippingState }}</span>
                </div>
                <div class="md-6 ph-1" v-if="country.toLowerCase() == 'canada'">
                    <select
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingState }"
                        v-model.lazy="state">

                        <option disabled value="">State/Province</option>
                        <option
                            v-for="state in states"
                            :key="state"
                            :value="state">{{ state }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.shippingState }}</span>
                </div>
            </div>
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1 md-6 sm-12">
                    <select
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingCountry }"
                        v-model.lazy="country">

                        <option disabled value="">Country</option>
                        <option
                            v-for="country in countries"
                            :key="country.code"
                            :value="country.name">{{ country.name }}</option>
                    </select>
                    <span class="validation tiny">{{ validation.shippingCountry }}</span>
                </div>
                <div class="flex flex-column ph-1">
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip/Postal Code"
                        class="order-form-input no-label"
                        v-bind:class="{ invalid: validation.shippingZip }"
                        v-model.lazy="zip">
                    <span class="validation tiny">{{ validation.shippingZip }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/ecommerce.js';
    import Utils from 'js-helper-functions/modules/utils';
    import ValidationTriggerMixin from './_mixin';

    export default {
        mixins: [ValidationTriggerMixin],
        name: 'order-form-shipping',
        props: {
            shippingAddress: {
                type: Object,
                default: () => null
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
                },
                controlsMap: {
                    shippingFirstName: 'first_name',
                    shippingLastName: 'last_name',
                    shippingAddressLine1: 'street_line_one',
                    shippingAddressLine2: 'street_line_two',
                    shippingCity: 'city',
                    shippingState: 'state',
                    shippingCountry: 'country',
                    shippingZip: 'zip_or_postal_code',
                },
                backendKeysMap: {
                    'first_name': 'shippingFirstName',
                    'last_name': 'shippingLastName',
                    'street_line_one': 'shippingAddressLine1',
                    'street_line_two': 'shippingAddressLine2',
                    'city': 'shippingCity',
                    'state': 'shippingState',
                    'country': 'shippingCountry',
                    'zip_or_postal_code': 'shippingZip',
                },
            }
        },
        computed: {
            firstName: {
                get() {
                    return this.controls.shippingFirstName;
                },
                set(value) {
                    if (this.controls.shippingFirstName != value) {
                        this.controls.shippingFirstName = value;
                        this.update('shippingFirstName');
                    }
                }
            },
            lastName: {
                get() {
                    return this.controls.shippingLastName;
                },
                set(value) {
                    if (this.controls.shippingLastName != value) {
                        this.controls.shippingLastName = value;
                        this.update('shippingLastName');
                    }
                }
            },
            addressLine1: {
                get() {
                    return this.controls.shippingAddressLine1;
                },
                set(value) {
                    if (this.controls.shippingAddressLine1 != value) {
                        this.controls.shippingAddressLine1 = value;
                        this.update('shippingAddressLine1');
                    }
                }
            },
            addressLine2: {
                get() {
                    return this.controls.shippingAddressLine2;
                },
                set(value) {
                    if (this.controls.shippingAddressLine2 != value) {
                        this.controls.shippingAddressLine2 = value;
                        this.update('shippingAddressLine2');
                    }
                }
            },
            city: {
                get() {
                    return this.controls.shippingCity;
                },
                set(value) {
                    if (this.controls.shippingCity != value) {
                        this.controls.shippingCity = value;
                        this.update('shippingCity');
                    }
                }
            },
            state: {
                get() {
                    return this.controls.shippingState;
                },
                set(value) {
                    if (this.controls.shippingState != value) {
                        this.controls.shippingState = value;
                        this.update('shippingState');
                    }
                }
            },
            country: {
                get() {
                    return this.controls.shippingCountry;
                },
                set(value) {
                    if (this.controls.shippingCountry != value) {
                        this.controls.shippingCountry = value;
                        this.update('shippingCountry');
                    }
                }
            },
            zip: {
                get() {
                    return this.controls.shippingZip;
                },
                set(value) {
                    if (this.controls.shippingZip != value) {
                        this.controls.shippingZip = value;
                        this.update('shippingZip');
                    }
                }
            },
            countries() {
                return Utils.countries();
            },
            states() {
                return Utils.provinces();
            },
        },
        watch: {
            shippingAddress: function() {
                this.processFactoryData();
            }
        },
        methods: {
            update(controlName) {

                this.$emit(
                    'saveShippingData',
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
            validateControl(controlName) {

                return this.validation[controlName] = (
                    this.rules.hasOwnProperty(controlName) &&
                    this.controls.hasOwnProperty(controlName) &&
                    (
                        this.controls[controlName] == null ||
                        !this.rules[controlName].pattern.test(this.controls[controlName])
                    )
                ) ? this.rules[controlName].message : '';
            },
            validateForm() {

                let validationSuccessful = true;

                for (let controlName in this.rules) {
                    validationSuccessful = !this.validateControl(controlName) && validationSuccessful;
                }

                this.$emit(
                    'registerSubformValidation',
                    {
                        form: 'shipping',
                        result: validationSuccessful
                    }
                );
            },
            processFactoryData() {
                if (this.shippingAddress) {

                    for (let backendKey in this.backendKeysMap) {

                        let controlKey = this.backendKeysMap[backendKey];

                        this.controls[controlKey] = this.shippingAddress.hasOwnProperty(backendKey) ?
                                                        this.shippingAddress[backendKey] : '';
                    }
                }
            }
        },
        mounted() {
            this.processFactoryData();
        }
    }
</script>
<style lang="scss">

</style>
