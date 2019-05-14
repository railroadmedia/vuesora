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
                               :class="{ 'has-error': errors.first_name.length,
                               'has-input': $_first_name != null }"
                               v-model.lazy="$_first_name">

                        <label for="shippingFirstName" :class="brand">
                            First Name
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.first_name"
                                :key="'firstNameError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingLastName"
                               type="text"
                               name="last-name"
                               class="order-form-input"
                               :class="{ 'has-error': errors.last_name.length,
                               'has-input': $_last_name != null }"
                               v-model.lazy="$_last_name">

                        <label for="shippingLastName" :class="brand">
                            Last Name
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.last_name"
                                :key="'lastNameError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingAddressLine1"
                               type="text"
                               name="address-line1"
                               class="order-form-input"
                               :class="{ 'has-error': errors.street_line_one.length,
                               'has-input': $_street_line_one != null }"
                               v-model.lazy="$_street_line_one">

                        <label for="shippingAddressLine1" :class="brand">
                            Address - Line 1
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.street_line_one"
                                :key="'streetLineOneError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingAddressLine2"
                            type="text"
                            name="address-line2"
                            class="order-form-input"
                            v-model.lazy="$_street_line_two">

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
                               :class="{ 'has-error': errors.city.length,
                               'has-input': $_city != null }"
                               v-model.lazy="$_city">

                        <label for="shippingCity" :class="brand">
                            City
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.city"
                                :key="'cityError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingState"
                               type="text"
                               name="state"
                               class="order-form-input"
                               :class="{ 'has-error': $_country === 'Canada' && errors.state.length,
                               'has-input': this.$_state != null }"
                               v-model.lazy="$_state">

                        <label for="shippingState" :class="brand">
                            State/Province
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.state"
                                :key="'stateError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <select id="shippingCountry"
                                class="order-form-input"
                                :class="{ 'has-error': errors.country.length,
                                'has-input': $_country != null }"
                                v-model.lazy="$_country">

                            <option v-for="country in countries"
                                    :key="country.code"
                                    :value="country.name">{{ country.name }}</option>
                        </select>

                        <label for="shippingCountry" :class="brand">
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.country"
                                :key="'countryError' + i">
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input id="shippingZip"
                                type="text"
                                name="zip"
                                class="order-form-input"
                                :class="{ 'has-error': errors.zip_or_postal_code.length,
                                'has-input': $_zip_or_postal_code != null }"
                                v-model.lazy="$_zip_or_postal_code">

                        <label for="shippingZip" :class="brand">
                            Zip/Postal Code
                        </label>

                        <ul class="errors tiny">
                            <li v-for="(error, i) in errors.zip_or_postal_code"
                                :key="'zipOrPostalCodeError' + i">
                                {{ error || null }}
                            </li>
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

            shippingData: {
                type: Object,
                default: () => ({
                    city: null,
                    country: null,
                    first_name: null,
                    last_name: null,
                    state: null,
                    street_line_one: null,
                    street_line_two: null,
                    zip_or_postal_code: null,

                })
            },
        },
        data() {
            return {
                rules: {
                    first_name: [
                        v => !!v || 'First Name is required'
                    ],
                    last_name: [
                        v => !!v || 'Last Name is required'
                    ],
                    street_line_one: [
                        v => !!v || 'Address is required'
                    ],
                    state: [
                        v => !!v || 'State/Province is required'
                    ],
                    city: [
                        v => !!v || 'City is required'
                    ],
                    country: [
                        v => !!v || 'Country is required'
                    ],
                    zip_or_postal_code: [
                        v => !!v || 'Zip or Postal Code is required'
                    ],
                },
                errors: {
                    first_name: [],
                    last_name: [],
                    street_line_one: [],
                    state: [],
                    city: [],
                    country: [],
                    zip_or_postal_code: [],
                },
            }
        },
        computed: {
            countries() {
                return Utils.countries();
            },

            states() {
                return Utils.provinces();
            },

            $_first_name: {
                get() {
                    return this.shippingData.first_name;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'first_name',
                        value: value,
                    });
                }
            },

            $_last_name: {
                get() {
                    return this.shippingData.last_name;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'last_name',
                        value: value,
                    });
                }
            },

            $_street_line_one: {
                get() {
                    return this.shippingData.street_line_one;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'street_line_one',
                        value: value,
                    });
                }
            },

            $_street_line_two: {
                get() {
                    return this.shippingData.street_line_two;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'street_line_two',
                        value: value,
                    });
                }
            },

            $_city: {
                get() {
                    return this.shippingData.city;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'city',
                        value: value,
                    });
                }
            },

            $_state: {
                get() {
                    return this.shippingData.state;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'state',
                        value: value,
                    });
                }
            },

            $_country: {
                get() {
                    return this.shippingData.country;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'country',
                        value: value,
                    });
                }
            },

            $_zip_or_postal_code: {
                get() {
                    return this.shippingData.zip_or_postal_code;
                },
                set(value) {
                    this.$emit('updateShippingData', {
                        key: 'zip_or_postal_code',
                        value: value,
                    });
                }
            },
        },
        methods: {
            validateControl(controlName) {
                const errors = [];

                this.rules[controlName].forEach(rule => {
                    if(rule(value) !== true){
                        errors.push(rule(value));
                    }
                });

                this.$set(this.errors, controlName, errors);
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
        },
    }
</script>
<style lang="scss">

</style>
