<template>
    <div class="flex flex-column mv-2">
        <div class="flex flex-row align-v-center pb-2">
            <h3 class="heading color-blue">Shipping Information</h3>
        </div>

        <div class="flex flex-column bg-white shadow corners-5 pt-2 ph-2">
            <div class="flex flex-row flex-wrap pv-1">
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingFirstName"
                               type="text"
                               name="first-name"
                               class="order-form-input"
                               :class="{ 'has-error': validation.shippingFirstName }"
                               v-model.lazy="firstName">

                        <label for="shippingFirstName" :class="brand">
                            First Name
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingFirstName }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingLastName"
                               type="text"
                               name="last-name"
                               class="order-form-input"
                               :class="{ 'has-error': validation.shippingLastName }"
                               v-model.lazy="lastName">

                        <label for="shippingLastName" :class="brand">
                            Last Name
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingLastName }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingAddressLine1"
                               type="text"
                               name="address-line1"
                               class="order-form-input"
                               :class="{ 'has-error': validation.shippingAddressLine1 }"
                               v-model.lazy="addressLine1">

                        <label for="shippingAddressLine1" :class="brand">
                            Address - Line 1
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingAddressLine1 }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingAddressLine2"
                            type="text"
                            name="address-line2"
                            class="order-form-input"
                            v-model.lazy="addressLine2">

                        <label for="shippingAddressLine2" :class="brand">
                            Address - Line 2
                        </label>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingCity"
                               type="text"
                               name="city"
                               class="order-form-input"
                               :class="{ 'has-error': validation.shippingCity }"
                               v-model.lazy="city">

                        <label for="shippingCity" :class="brand">
                            City
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingCity }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingState"
                               type="text"
                               name="state"
                               class="order-form-input"
                               :class="{ 'has-error': validation.shippingState }"
                               v-model.lazy="state">

                        <label for="shippingState" :class="brand">
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingState }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <select id="shippingCountry"
                                class="order-form-input"
                                :class="{ 'has-error': validation.shippingCountry }"
                                v-model.lazy="country">

                            <option v-for="country in countries"
                                    :key="country.code"
                                    :value="country.name">{{ country.name }}</option>
                        </select>

                        <label for="shippingCountry" :class="brand">
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingCountry }}</li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingZip"
                                type="text"
                                name="zip"
                                class="order-form-input"
                                :class="{ invalid: validation.shippingZip }"
                                v-model.lazy="zip">

                        <label for="shippingZip" :class="brand">
                            Zip/Postal Code
                        </label>

                        <ul class="errors tiny">
                            <li>{{ validation.shippingZip }}</li>
                        </ul>
                    </div>
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
            brand: {
                type: String,
            },
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
