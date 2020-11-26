<template>
    <div class="flex flex-column mb-1">
        <div class="flex flex-column bg-white pt-2">
            <div class="flex flex-row flex-wrap pv-1 nmh-1">
                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingFirstName"
                            v-model.lazy="$_first_name"
                            type="text"
                            name="first-name"
                            autocomplete="shipping given-name"
                            class="order-form-input"
                            :class="{ 'has-error': errors.first_name.length,
                                      'has-input': $_first_name != null }"
                        >

                        <label
                            for="shippingFirstName"
                            :class="brand"
                        >
                            First Name
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.first_name"
                                :key="'firstNameError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingLastName"
                            v-model.lazy="$_last_name"
                            type="text"
                            name="last-name"
                            autocomplete="shipping family-name"
                            class="order-form-input"
                            :class="{ 'has-error': errors.last_name.length,
                                      'has-input': $_last_name != null }"
                        >

                        <label
                            for="shippingLastName"
                            :class="brand"
                        >
                            Last Name
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.last_name"
                                :key="'lastNameError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingAddressLine1"
                            v-model.lazy="$_street_line_one"
                            type="text"
                            name="address-line1"
                            autocomplete="shipping address-line1"
                            class="order-form-input"
                            :class="{ 'has-error': errors.street_line_one.length,
                                      'has-input': $_street_line_one != null }"
                        >

                        <label
                            for="shippingAddressLine1"
                            :class="brand"
                        >
                            Address - Line 1
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.street_line_one"
                                :key="'streetLineOneError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingAddressLine2"
                            v-model.lazy="$_street_line_two"
                            type="text"
                            name="address-line2"
                            autocomplete="shipping address-line2"
                            class="order-form-input"
                            :class="{ 'has-error': errors.street_line_two.length,
                                      'has-input': $_street_line_two != null }"
                        >

                        <label
                            for="shippingAddressLine2"
                            :class="brand"
                        >
                            Address - Line 2
                        </label>
                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.street_line_two"
                                :key="'streetLineTwoError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>

                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <select
                            id="shippingCountry"
                            v-model.lazy="$_country"
                            autocomplete="shipping country"
                            class="order-form-input"
                            :class="{ 'has-error': errors.country.length,
                                      'has-input': $_country != null }"
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
                            for="shippingCountry"
                            :class="brand"
                        >
                            Country
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.country"
                                :key="'countryError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    v-if="$_country === 'Canada'"
                    class="flex flex-column xs-12 sm-6 ph-1 mb-2"
                >
                    <div class="form-group">
                        <select
                            id="shippingState"
                            v-model.lazy="$_state"
                            autocomplete="shipping address-level1"
                            class="order-form-input"
                            :class="{ 'has-error': errors.state.length,
                                      'has-input': $_state != null }"
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
                            for="shippingState"
                            :class="brand"
                        >
                            Province
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.state"
                                :key="'stateError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    v-if="$_country !== 'Canada'"
                    class="flex flex-column xs-12 sm-6 ph-1 mb-2"
                >
                    <div class="form-group">
                        <input
                            id="shippingStateText"
                            v-model.lazy="$_state"
                            type="text"
                            name="state"
                            autocomplete="shipping address-level1"
                            class="order-form-input"
                            :class="{ 'has-error': errors.state.length,
                                      'has-input': this.$_state != null }"
                        >

                        <label
                            for="shippingStateText"
                            :class="brand"
                        >
                            State/Region
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.state"
                                :key="'stateError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingCity"
                            v-model.lazy="$_city"
                            type="text"
                            name="city"
                            autocomplete="shipping address-level2"
                            class="order-form-input"
                            :class="{ 'has-error': errors.city.length,
                                      'has-input': $_city != null }"
                        >

                        <label
                            for="shippingCity"
                            :class="brand"
                        >
                            City
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.city"
                                :key="'cityError' + i"
                            >
                                {{ error || null }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                    <div class="form-group">
                        <input
                            id="shippingZip"
                            v-model.lazy="$_zip_or_postal_code"
                            type="text"
                            name="zip"
                            autocomplete="shipping postal-code"
                            class="order-form-input"
                            :class="{ 'has-error': errors.zip_or_postal_code.length,
                                      'has-input': $_zip_or_postal_code != null }"
                        >

                        <label
                            for="shippingZip"
                            :class="brand"
                        >
                            Zip/Postal Code
                        </label>

                        <ul class="errors tiny">
                            <li
                                v-for="(error, i) in errors.zip_or_postal_code"
                                :key="'zipOrPostalCodeError' + i"
                            >
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
import Utils from '@musora/helper-functions/modules/utils';
import Validation from './_validation';

export default {
    name: 'OrderFormShipping',
    mixins: [Validation],
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
            }),
        },

        countries: {
            type: Array,
            default: () => [],
        },

        provinces: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            rules: {
                first_name: [
                    v => !!v || 'First Name is required.',
                ],
                last_name: [
                    v => !!v || 'Last Name is required.',
                ],
                street_line_one: [
                    v => !!v || 'Address is required.',
                ],
                street_line_two: [
                ],
                state: [
                    v => !!v || 'State/Province is required.',
                ],
                city: [
                    v => !!v || 'City is required.',
                ],
                country: [
                    v => !!v || 'Country is required.',
                ],
                zip_or_postal_code: [
                    v => !!v || 'Zip or Postal Code is required.',
                ],
            },
            errors: {
                first_name: [],
                last_name: [],
                street_line_one: [],
                street_line_two: [],
                state: [],
                city: [],
                country: [],
                zip_or_postal_code: [],
            },
        };
    },
    computed: {

        $_first_name: {
            get() {
                return this.shippingData.first_name;
            },
            set(value) {
                this.validateInput('first_name', value);

                this.$emit('updateShippingData', {
                    key: 'first_name',
                    value,
                });
            },
        },

        $_last_name: {
            get() {
                return this.shippingData.last_name;
            },
            set(value) {
                this.validateInput('last_name', value);

                this.$emit('updateShippingData', {
                    key: 'last_name',
                    value,
                });
            },
        },

        $_street_line_one: {
            get() {
                return this.shippingData.street_line_one;
            },
            set(value) {
                this.validateInput('street_line_one', value);

                this.$emit('updateShippingData', {
                    key: 'street_line_one',
                    value,
                });
            },
        },

        $_street_line_two: {
            get() {
                return this.shippingData.street_line_two;
            },
            set(value) {
                this.validateInput('street_line_two', value);

                this.$emit('updateShippingData', {
                    key: 'street_line_two',
                    value,
                });
            },
        },

        $_city: {
            get() {
                return this.shippingData.city;
            },
            set(value) {
                this.validateInput('city', value);

                this.$emit('updateShippingData', {
                    key: 'city',
                    value,
                });
            },
        },

        $_state: {
            get() {
                return this.shippingData.region;
            },
            set(value) {
                this.validateInput('state', value);

                this.$emit('updateShippingData', {
                    key: 'region',
                    value,
                });
            },
        },

        $_country: {
            get() {
                return this.shippingData.country;
            },
            set(value) {
                this.validateInput('country', value);

                if ((this.shippingData.country === 'Canada' && value !== 'Canada') ||
                    (this.shippingData.country !== 'Canada' && value === 'Canada')) {
                    this.$_state = null;
                    this.errors.state = [];
                }

                this.$emit('updateShippingData', {
                    key: 'country',
                    value,
                });
            },
        },

        $_zip_or_postal_code: {
            get() {
                return this.shippingData.zip_or_postal_code;
            },
            set(value) {
                this.validateInput('zip_or_postal_code', value);

                this.$emit('updateShippingData', {
                    key: 'zip_or_postal_code',
                    value,
                });
            },
        },
    },
    methods: {
        toCapitalCase: string => Utils.toCapitalCase(string),
    },
};
</script>
<style lang="scss">

</style>
