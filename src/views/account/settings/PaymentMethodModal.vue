<template>
    <div>
        <div
            id="paymentModalNew"
            class="modal"
            :class="{ 'active': modalOpened }">
            <div class="flex flex-column bg-white corners-3 shadow">
                <div class="flex flex-row pa-3 align-v-center">
                    <div class="flex flex-column">
                        <h2 class="subheading">{{ subheading }}</h2>
                    </div>
                    <div class="flex flex-column">
                        <div
                            class="flex flex-row flex-auto align-h-right"
                            style="font-size:32px;">
                            <i class="fab fa-cc-visa ml-1"></i>
                            <i class="fab fa-cc-mastercard ml-1"></i>
                            <i class="fab fa-cc-amex ml-1"></i>
                            <i class="fab fa-cc-paypal ml-1"></i>
                        </div>
                    </div>
                </div>

                <span class="close-modal close-button">
                    <i
                        class="fas fa-times"
                        v-on:click.stop.prevent="closeModal">
                    </i>
                </span>

                <div class="type-fields">
                    <div class="flex flex-row ph-3">
                        <div class="flex flex-column mb-1">
                            <div class="form-group">
                                <select id="methodType"
                                        name="method_type"
                                        :class="{'has-error': methodType.hasError, 'has-input': methodType.value}"
                                        v-model="methodType.value">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in methodType.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="methodType" :class="brand">
                                    Payment Method Type
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="credit-card-fields" v-if="isCreditCardMethod">
                    <div class="flex flex-row ph-3">
                        <div class="flex flex-column mb-1">
                            <div class="form-group">
                                <input id="ccNumber"
                                       name="cc_number"
                                       v-model="ccNumber.value"
                                       type="text"
                                       :class="{ 'has-error': ccNumber.hasError, 'has-input': ccNumber.value }"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="ccNumber":class="brand">
                                    Credit Card Number
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row ph-3 inline-inputs">
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="expiryMonth"
                                        name="expiry_month"
                                        :class="{ 'has-error': expiryMonth.hasError, 'has-input': expiryMonth.value }"
                                        v-model="expiryMonth.value">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in expiryMonth.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="expiryMonth" :class="brand">
                                    Expiry Month
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="expiryYear"
                                        name="expiry_year"
                                        :class="{ 'has-error': expiryYear.hasError, 'has-input': expiryYear.value }"
                                        v-model="expiryYear.value">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in expiryYear.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="expiryYear" :class="brand">
                                    Expiry Year
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-column smaller">
                            <div class="form-group">
                                <input id="cvvNumber"
                                       name="cvv"
                                       v-model="cvvNumber.value"
                                       type="text"
                                       :class="{ 'has-error': cvvNumber.hasError, 'has-input': cvvNumber.value }"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="cvvNumber":class="brand">
                                    CVC/CVV
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row ph-3 mt-1 inline-inputs">
                        <div class="flex flex-column">
                            <div class="form-group">
                                <input id="nameOnCard"
                                       name="name"
                                       v-model="nameOnCard.value"
                                       type="text"
                                       :class="{ 'has-error': cvvNumber.hasError, 'has-input': nameOnCard.value }"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="nameOnCard":class="brand">
                                    Name On Card
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="cardCountry"
                                        name="country"
                                        :class="{ 'has-error': cardCountry.hasError, 'has-input': cardCountry.value }"
                                        v-model="cardCountry.value">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in cardCountry.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="cardCountry" :class="brand">
                                    Country
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-column" v-if="showRegion">
                            <div class="form-group">
                                <select id="cardRegion"
                                        name="region"
                                        :class="{ 'has-error': cardRegion.hasError, 'has-input': cardRegion.value }"
                                        v-model="cardRegion.value">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in cardRegion.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="cardRegion" :class="brand">
                                    Province
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="paypal-fields" v-if="isPaypalMethod">
                    <div class="flex flex-row ph-3">
                        <div class="flex flex-column mb-1">
                            <p class="tiny text-dark font-italic">
                                Click the Save button to be redirected to PayPal for authentication.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row ph-3 mt-2 mb-3">
                    <button class="btn collapse-150 mr-1"
                            v-on:click.stop.prevent="saveMethod">
                        <span class="bg-recordeo text-white corners-3 short">
                            Save
                        </span>
                    </button>

                    <a
                        class="btn collapse-150 close-modal corners-3 flat text-black flat short"
                        v-on:click.stop.prevent="closeModal">
                        Cancel
                    </a>
                </div>
            </div>
        </div>
        <div
            id="modalOverlay"
            :class="{ 'active': modalOpened }"
            v-on:click.stop.prevent="closeModal">
        </div>
    </div>
</template>
<script>
    export default {
        name: 'payment-method-modal',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            modalOpened: {
                type: Boolean,
                default: false
            },
            stripePublishableKey: {
                type: String,
                default: ''
            }
        },
        mounted() {
            // when opened as edit payment map prop payment method data to data() props
        },
        data() {
            return {
                methodType: {
                    options: ['Visa', 'Mastercard', 'Amex', 'Paypal'],
                    value: null,
                    hasError: false
                },
                ccNumber: {
                    value: null,
                    hasError: false
                },
                expiryMonth: {
                    options: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                    value: null,
                    hasError: false
                },
                expiryYear: {
                    options: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
                    value: null,
                    hasError: false
                },
                cvvNumber: {
                    value: null,
                    hasError: false
                },
                nameOnCard: {
                    value: null,
                    hasError: false
                },
                cardCountry: {
                    options: ['Canada', 'United States'],
                    value: null,
                    hasError: false
                },
                cardRegion: {
                    options: ['BC', 'AB', 'SK', 'MN', 'ON', 'QC', 'NB', 'NL', 'NS', 'PE', 'YT', 'NT', 'NU'],
                    value: null,
                    hasError: false
                }
            }
        },
        computed: {
            subheading() {
                // edit payment method to be added
                return 'Add New Payment Method';
            },
            isCreditCardMethod() {
                return this.methodType.value && this.methodType.value.toLowerCase() != 'paypal';
            },
            isPaypalMethod() {
                return this.methodType.value && this.methodType.value.toLowerCase() == 'paypal';
            },
            showRegion() {
                return this.cardCountry.value && this.cardCountry.value.toLowerCase() == 'canada';
            }
        },
        methods: {
            getStripeTokenPayload() {
                return {
                    number: this.ccNumber.value,
                    cvc: this.cvvNumber.value,
                    exp_month: this.expiryMonth.value,
                    exp_year: this.expiryYear.value
                };
            },
            saveMethod() {
                this.$emit('showLoading', {});
                if (this.isCreditCardMethod) {
                    Stripe.setPublishableKey(this.stripePublishableKey);

                    let tokenObject = this.getStripeTokenPayload();
                    
                    Stripe.card.createToken(tokenObject, this.handleStripeResponse);
                } // else handle paypal
            },
            handleStripeResponse(status, response) {
                if (response.error) {
                    // var errorContainers = document.getElementsByClassName('orderFormErrors');

                    // Array.prototype.forEach.call(errorContainers, function (element) {
                    //     element.innerHTML = response.error.message;
                    // });
                } else {
                    let token = response.id;
                    console.log("token: %s", JSON.stringify(token));
                }
                this.$emit('hideLoading', {});
            },
            closeModal() {
                this.modalOpened = false;
                this.$emit('closeModal', {});
            }
        }
    }
</script>
<style lang="scss">
</style>
