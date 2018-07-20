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
                                        :class="{'has-error': validating && formFields.methodType.hasError, 'has-input': methodType}"
                                        v-model="methodType">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in formFields.methodType.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="methodType" :class="brand">
                                    Payment Method Type
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.methodType.hasError">
                                    <li
                                        v-for="error in formFields.methodType.errors">
                                        {{ error }}
                                    </li>
                                </ul>
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
                                       v-model="ccNumber"
                                       type="text"
                                       :class="{ 'has-error': validating && formFields.ccNumber.hasError, 'has-input': ccNumber }"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="ccNumber":class="brand">
                                    Credit Card Number
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.ccNumber.hasError">
                                    <li
                                        v-for="error in formFields.ccNumber.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row ph-3 inline-inputs">
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="expiryMonth"
                                        name="expiry_month"
                                        :class="{ 'has-error': validating && formFields.expiryMonth.hasError, 'has-input': expiryMonth }"
                                        v-model="expiryMonth">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in formFields.expiryMonth.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="expiryMonth" :class="brand">
                                    Expiry Month
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.expiryMonth.hasError">
                                    <li
                                        v-for="error in formFields.expiryMonth.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="expiryYear"
                                        name="expiry_year"
                                        :class="{ 'has-error': validating && formFields.expiryYear.hasError, 'has-input': expiryYear }"
                                        v-model="expiryYear">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in formFields.expiryYear.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="expiryYear" :class="brand">
                                    Expiry Year
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.expiryYear.hasError">
                                    <li
                                        v-for="error in formFields.expiryYear.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-column smaller">
                            <div class="form-group">
                                <input id="cvvNumber"
                                       name="cvv"
                                       v-model="cvvNumber"
                                       type="text"
                                       :class="{'has-error': validating && formFields.cvvNumber.hasError, 'has-input': cvvNumber }"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="cvvNumber":class="brand">
                                    CVC/CVV
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.cvvNumber.hasError">
                                    <li
                                        v-for="error in formFields.cvvNumber.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row ph-3 mt-1 inline-inputs">
                        <div class="flex flex-column">
                            <div class="form-group">
                                <input id="nameOnCard"
                                       name="name"
                                       v-model="nameOnCard"
                                       type="text"
                                       :class="{'has-error': validating && formFields.nameOnCard.hasError, 'has-input': nameOnCard}"
                                       autocomplete="off"
                                       spellcheck="false">
                                <label for="nameOnCard":class="brand">
                                    Name On Card
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.nameOnCard.hasError">
                                    <li
                                        v-for="error in formFields.nameOnCard.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-column">
                            <div class="form-group">
                                <select id="cardCountry"
                                        name="country"
                                        :class="{ 'has-error': validating && formFields.cardCountry.hasError, 'has-input': cardCountry }"
                                        v-model="cardCountry">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in formFields.cardCountry.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="cardCountry" :class="brand">
                                    Country
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.cardCountry.hasError">
                                    <li
                                        v-for="error in formFields.cardCountry.errors">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-column" v-if="showRegion">
                            <div class="form-group">
                                <select id="cardRegion"
                                        name="region"
                                        :class="{ 'has-error': validating && formFields.cardRegion.hasError, 'has-input': cardRegion }"
                                        v-model="cardRegion">
                                    <option value="" style="display:none;">
                                    </option>
                                    <option
                                        v-for="option in formFields.cardRegion.options"
                                        v-bind:value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <label for="cardRegion" :class="brand">
                                    Province
                                </label>
                                <ul
                                    class="errors mt-1 tiny"
                                    v-if="validating && formFields.cardRegion.hasError">
                                    <li
                                        v-for="error in formFields.cardRegion.errors">
                                        {{ error }}
                                    </li>
                                </ul>
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
    import Requests from '../../../assets/js/classes/requests';
    import Toasts from '../../../assets/js/classes/toasts';

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
            },
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        id: 0,
                        email: ''
                    }
                }
            }
        },
        mounted() {
            // when opened as edit payment map prop payment method data to data() props
            for (var prop in this.formFields) {
                // initial empty fields are invalid
                this.formFields[prop].hasError = true;
                this.formFields[prop].errors = [this.errors[prop]];
            }

            this.formFields.cardRegion.hasError = false;
            this.formFields.cardRegion.errors = [];
        },
        data() {
            return {
                errors: {
                    methodType: 'A method type must be selected',
                    ccNumber: 'Card number must be filled with all 16 digits',
                    expiryMonth: 'The expiration month must be selected',
                    expiryYear: 'The expiration year must be selected',
                    cvvNumber: 'CVV number must be filled',
                    nameOnCard: 'Name On Card must be filled',
                    cardCountry: 'The card country must be selected',
                    cardRegion: 'The card region must be selected'
                },
                formFields: {
                    methodType: {
                        options: ['Visa', 'Mastercard', 'Amex', 'Paypal'],
                        hasError: false,
                        errors: []
                    },
                    ccNumber: {
                        hasError: false,
                        errors: []
                    },
                    expiryMonth: {
                        options: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                        hasError: false,
                        errors: []
                    },
                    expiryYear: {
                        options: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
                        hasError: false,
                        errors: []
                    },
                    cvvNumber: {
                        hasError: false,
                        errors: []
                    },
                    nameOnCard: {
                        hasError: false,
                        errors: []
                    },
                    cardCountry: {
                        options: ['Canada', 'United States'],
                        hasError: false,
                        errors: []
                    },
                    cardRegion: {
                        options: ['BC', 'AB', 'SK', 'MN', 'ON', 'QC', 'NB', 'NL', 'NS', 'PE', 'YT', 'NT', 'NU'],
                        hasError: false,
                        errors: []
                    }
                },
                methodType: '',
                ccNumber: '',
                expiryMonth: '',
                expiryYear: '',
                cvvNumber: '',
                nameOnCard: '',
                cardCountry: '',
                cardRegion: '',
                validating: false,
                validForm: false,
                stripeErrorsMap: {
                    "invalid_expiry_year": {
                        field: "expiryYear"
                    },
                    "invalid_expiry_month": {
                        field: "expiryMonth"
                    },
                    "incorrect_number": {
                        field: "ccNumber"
                    },
                    "invalid_number": {
                        field: "ccNumber"
                    },
                    "incorrect_cvc": {
                        field: "cvvNumber"
                    },
                    "expired_card": {
                        field: "ccNumber"
                    },
                    "card_declined": {
                        field: "ccNumber",
                        message: "Your card is declined by our payment processor. Please use an other card."
                    }
                }
            }
        },
        computed: {
            subheading() {
                // edit payment method to be added
                return 'Add New Payment Method';
            },
            isCreditCardMethod() {
                return this.methodType && this.methodType.toLowerCase() != 'paypal';
            },
            isPaypalMethod() {
                return this.methodType && this.methodType.toLowerCase() == 'paypal';
            },
            showRegion() {
                return this.cardCountry && this.cardCountry.toLowerCase() == 'canada';
            },
            successMessage() {
                // edit payment method to be added
                return 'The new payment method was successfully created';
            }
        },
        methods: {
            getStripeTokenPayload() {

                let payload = {
                    number: this.ccNumber,
                    cvc: this.cvvNumber,
                    exp_month: this.expiryMonth,
                    exp_year: this.expiryYear,
                    name: this.nameOnCard,
                    address_country: this.cardCountry
                };

                if (this.cardCountry.toLowerCase() == 'canada') {
                    payload.address_state = this.cardRegion;
                }

                return payload;
            },
            getNewCardPaymentMethodPayload(token) {
                return {
                    method_type: 'credit-card',
                    card_token: token,
                    gateway: 'recordeo',
                    user_id: this.currentUser.id,
                    user_email: this.currentUser.email
                };
            },
            saveMethod() {

                this.validating = true;

                if (this.validForm) {

                    this.$emit('showLoading', {});

                    if (this.isCreditCardMethod) {

                        Stripe.setPublishableKey(this.stripePublishableKey);

                        let tokenObject = this.getStripeTokenPayload();

                        Stripe.card.createToken(tokenObject, this.handleStripeResponse);

                    } else {

                        Requests
                            .getPaypalAgreementUrl()
                            .then((response) => {
                                if (response.url) {

                                    window.location.href = response.url;

                                } else {
                                    this.validForm = false;
                                    this.showGenericError();
                                }
                            });
                    }
                }
            },
            handleStripeResponse(status, response) {

                this.$emit('hideLoading', {});

                if (response.error) {

                    this.handleStripeError(response.error);

                } else {

                    let payload = this.getNewCardPaymentMethodPayload(response.id);

                    this.createPaymentMethod(payload);
                }
            },
            handleStripeError(error) {

                if (error && error.code && this.stripeErrorsMap[error.code]) {

                    let fieldName = this.stripeErrorsMap[error.code].field;
                    let errorMessage = this.stripeErrorsMap[error.code].message || error.message;

                    this.formFields[fieldName].hasError = true;
                    this.formFields[fieldName].errors = [errorMessage];

                } else {
                    this.showGenericError();
                }
                this.validForm = false;
            },
            showGenericError() {
                let message = "An error has been reported by our payment processor, please try again. " +
                        '<br><br><span class="tiny font-italic">If the problem persists, please ' +
                        '<a href="mailto:support@recordeo.com" target="_blank">contact support.</a></span>';

                Toasts.errorWarning(message);
            },
            createPaymentMethod(payload) {

                this.$emit('showLoading', {});

                Requests
                    .createPaymentMethod(payload)
                    .then(this.handleCreatePaymentMethodResponse);
            },
            handleCreatePaymentMethodResponse(response) {

                this.$emit('hideLoading', {});

                if (
                    !response ||
                    (!response.data &&
                        (!response.meta ||
                            !response.meta.errors))) {

                    // if no data key in response
                    // or no meta.errors key path
                    // the request should have been handled in Request as error
                    // this would be the 2nd, always executed, .then
                    // https://github.com/axios/axios#example
                    return;
                }

                if (response.meta && response.meta.errors) {
                    if (response.meta.errors.detail &&
                        response.meta.errors.detail.code) {
                        // backend stripe exception
                        this.handleStripeError(response.meta.errors.detail);
                    } else {
                        // other type of error
                        let message = "[PaymentMethodModal Component]::handleCreatePaymentMethodResponse " +
                                    "backend reported exception: \n" + JSON.stringify(response);
                        console.log(message);
                        this.showGenericError();
                    }
                } else if (response.data) {

                    Toasts.success(this.successMessage);
                    this.closeModal();

                    setTimeout(() => {
                        window.location.reload(true);
                    }, 5000);
                }
            },
            closeModal() {
                this.modalOpened = false;
                this.$emit('closeModal', {});
            },
            validateForm() {
                this.validForm = true;

                for(var field in this.formFields) {
                    if (this.formFields[field].hasError) {
                        this.validForm = false;
                        break;
                    }
                }

                return this.validForm;
            },
            validateCardRegion() {

                if (this.cardCountry.toLowerCase() == 'canada' && !this.cardRegion) {

                    this.formFields.cardRegion.hasError = true;
                    this.formFields.cardRegion.errors = [this.errors.cardRegion];
                    this.validForm = false;

                } else {

                    let hadError = this.formFields.cardRegion.hasError;

                    this.formFields.cardRegion.hasError = false;
                    this.formFields.cardRegion.errors = [];

                    if (hadError) {
                        this.validateForm();
                    }
                }
            },
            validateField(fieldName, fieldValueValidationCallback) {

                let field = this[fieldName];

                if (
                    field &&
                    (!fieldValueValidationCallback ||
                        fieldValueValidationCallback(field)
                )) {

                    let hadError = this.formFields[fieldName].hasError;

                    this.formFields[fieldName].hasError = false;
                    this.formFields[fieldName].errors = [];

                    if (hadError) {
                        this.validateForm();
                    }

                } else {

                    this.formFields[fieldName].hasError = true;
                    this.formFields[fieldName].errors = [this.errors[fieldName]];
                    this.validForm = false;
                }
            },
            validateMethodType() {

                if (this.methodType) {

                    let hadError = this.formFields.cardRegion.hasError;

                    this.formFields.methodType.hasError = false;
                    this.formFields.methodType.errors = [];

                    if (this.methodType.toLowerCase() == 'paypal') {
                        this.validForm = true;
                    } else if (hadError) {
                        this.validateForm();
                    }

                } else {

                    this.formFields.methodType.hasError = true;
                    this.formFields.methodType.errors = [this.errors.methodType];
                    this.validForm = false;
                }
            }
        },
        watch: {
            methodType: function () {
                this.validateMethodType();
            },
            ccNumber: function () {
                this.validateField('ccNumber', value => value.length == 15 || value.length == 16);
            },
            expiryMonth: function () {
                this.validateField('expiryMonth');
            },
            expiryYear: function () {
                this.validateField('expiryYear');
            },
            cvvNumber: function () {
                this.validateField('cvvNumber', value => value.length == 3 || value.length == 4);
            },
            nameOnCard: function () {
                this.validateField('nameOnCard', value => value.length > 3);
            },
            cardCountry: function () {
                this.validateField('cardCountry');
                this.validateCardRegion();
            },
            cardRegion: function () {
                this.validateCardRegion();
            }
        }
    }
</script>
<style lang="scss">
</style>
