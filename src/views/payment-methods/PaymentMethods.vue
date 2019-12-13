<template>
    <div class="flex flex-column grow">
        <div class="flex flex-row mb-3 pt-3">
            <h4 class="subheading">
                Payment Methods
            </h4>
        </div>

        <ul class="body list-style-none mb-3">
            <li class="flex flex-row align-v-center">
                <div class="flex flex-column default-col text-center hide-xs-only">
                    <h6 class="tiny font-bold dense">
                        Default
                    </h6>
                </div>

                <div class="flex flex-column">
                    <h6 class="tiny font-bold dense">
                        Info
                    </h6>
                </div>

                <div class="flex flex-column expiry-col text-center">
                    <h6 class="tiny font-bold dense">
                        Expires On
                    </h6>
                </div>

                <div class="flex flex-column actions-col text-center">
                    <h6 class="tiny font-bold dense">
                        Actions
                    </h6>
                </div>
            </li>
            <li
                v-for="(paymentMethod, i) in paymentMethodsData.data"
                class="flex flex-row align-v-center"
            >
                <div class="flex flex-column default-col text-center body hide-xs-only">
                    <i
                        v-if="isPrimaryPaymentMethod(paymentMethod)"
                        class="fas fa-check"
                    ></i>
                </div>

                <div
                    v-if="paymentMethod.relationships.method.data.type === 'creditCard'"
                    class="flex flex-column body"
                >
                    {{ getRelatedAttributesByTypeAndId(
                        paymentMethod.relationships.method.data
                    ).attributes.company_name || 'N/A' }}
                    -
                    {{ getRelatedAttributesByTypeAndId(
                        paymentMethod.relationships.method.data
                    ).attributes.last_four_digits || 'N/A' }}
                </div>

                <div
                    v-if="paymentMethod.relationships.method.data.type === 'paypalBillingAgreement'"
                    class="flex flex-column body"
                >
                    PayPal
                </div>

                <div class="flex flex-column body expiry-col text-center">
                    {{ getExpirationDate(paymentMethod) }}
                </div>

                <div class="flex flex-column actions-col text-center">
                    <div class="flex flex-row">
                        <button
                            class="btn short collapse-square"
                            title="Delete Payment Method"
                            :disabled="isPrimaryPaymentMethod(paymentMethod)"
                            @click="deletePaymentMethod(paymentMethod.id)"
                        >
                            <span class="text-error flat">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>

                        <button
                            class="btn short collapse-square"
                            title="Set As Default"
                            :disabled="isPrimaryPaymentMethod(paymentMethod)"
                            @click="markPaymentMethodAsDefault(paymentMethod.id)"
                        >
                            <span class="text-success flat">
                                <i class="fas fa-check"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </li>
        </ul>

        <div class="flex flex-row flex-wrap align-v-center">
            <div class="flex flex-column xs-12 sm-4">
                <button
                    class="btn"
                    data-open-modal="paymentMethodModal"
                    title="Add New Payment Method"
                >
                    <span
                        class="text-white"
                        :class="themeBgClass"
                    >
                        <i class="fas fa-plus mr-1"></i> New Payment Method
                    </span>
                </button>
            </div>
        </div>

        <div
            id="paymentMethodModal"
            class="modal"
        >
            <order-form-payment
                ref="paymentForm"
                :theme-color="themeColor"
                :brand="brand"
                :payment-details="editingPaymentMethod"
                :stripe-publishable-key="stripePublishableKey"
                :totals="totals"
                :discounts="[]"
                :stripe-token="stripeToken"
                :countries="countries"
                :provinces="provinces"
                :is-order="false"
                :is-active="isActive"
                :has-subscription="hasSubscription"
                @updatePaymentData="updatePaymentData"
                @formSubmit="submitForm"
                @formCancel="cancelForm"
            />
        </div>

        <transition name="grow-fade">
            <div
                v-show="loading"
                class="form-loading bg-white shadow corners-3 overflow pa-3 text-center"
                @click.stop
            >
                <div class="square">
                    <loading-animation :theme-color="themeColor" />
                </div>

                <p class="body mt-3">
                    Loading Please Wait...
                </p>

                <transition name="grow-fade">
                    <div
                        v-show="formSuccess"
                        class="success-message flex flex-column flex-center bg-white pa-3"
                    >
                        <i class="fas fa-check-circle text-success"></i>

                        <h4 class="title mb-2">
                            Success!
                        </h4>
                        <p class="tiny text-grey-3">
                            Your payment method has been successfully changed!
                        </p>
                    </div>
                </transition>
            </div>
        </transition>

        <div
            v-show="loading"
            class="loading-overlay"
        ></div>
    </div>
</template>

<script>
import { DateTime } from 'luxon';
import ThemeClasses from '../../mixins/ThemeClasses';
import OrderFormPayment from '../../views/order-form/_OrderFormPayment';
import Toasts from '../../assets/js/classes/toasts';
import EcommerceService from '../../assets/js/services/ecommerce';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

export default {
    name: 'PaymentMethods',
    components: {
        'order-form-payment': OrderFormPayment,
        'loading-animation': LoadingAnimation,
    },
    mixins: [ThemeClasses],
    props: {
        paymentMethods: {
            type: Object,
            default: () => ({}),
        },

        brand: {
            type: String,
            default: () => 'pianote',
        },

        stripePublishableKey: {
            type: String,
        },

        countries: {
            type: Array,
            default: () => [],
        },

        provinces: {
            type: Array,
            default: () => [],
        },

        userId: {
            type: [String, Number],
        },

        hasSubscription: {
            type: Boolean,
            default: () => true,
        },

        isActive: {
            type: Boolean,
            default: () => true,
        },

        cart: {
            type: Object,
            default: () => ({
                totals: {
                    due: 0,
                    tax: 0,
                },
            }),
        },
    },
    data() {
        return {
            loading: false,
            formSuccess: false,
            paymentMethodsData: this.paymentMethods,
            editingPaymentMethod: this.defaultPaymentMethod(),
            totals: this.cart.totals,
            stripeToken: null,
        };
    },

    methods: {
        defaultPaymentMethod() {
            return {
                cardToken: null,
                methodType: 'credit_card',
                billingCountry: this.cart.billing_address ? this.cart.billing_address.country : null,
                billingRegion: this.cart.billing_address ? this.cart.billing_address.state : null,
            };
        },

        updatePaymentData({ key, value }) {
            this.$set(this.editingPaymentMethod, key, value);

            if (key === 'billingCountry' || key === 'billingRegion') {
                EcommerceService.updateAddressesInSession({
                    billingCountry: this.editingPaymentMethod.billingCountry,
                    billingState: this.editingPaymentMethod.billingRegion,
                })
                    .then((response) => {
                        if (response) {
                            this.totals = response.data.meta.cart.totals;
                        }
                    });
            }
        },

        submitForm() {
            this.loading = true;

            if (this.editingPaymentMethod.methodType === 'paypal') {
                this.updatePaymentMethod();
            } else {
                this.$refs.paymentForm.fetchStripeToken()
                    .then(({ token, error }) => {
                        if (error) {
                            return;
                        }

                        this.stripeToken = token;
                        this.updatePaymentMethod();
                    });
            }
        },

        updatePaymentMethod() {
            EcommerceService.updatePaymentMethod({
                card_token: this.editingPaymentMethod.methodType === 'credit_card' ? this.stripeToken.id : null,
                gateway: this.brand,
                method_type: this.editingPaymentMethod.methodType,
                billing_country: this.editingPaymentMethod.billingCountry,
                billing_region: this.editingPaymentMethod.billingRegion,
            })
                .then((response) => {
                    if (response) {
                        if (response.data.redirect) {
                            window.location.href = response.data.redirect;
                        } else {
                            this.formSuccess = true;
                            this.getPaymentMethods();

                            setTimeout(() => {
                                this.cancelForm();
                            }, 1000);
                        }
                    } else {
                        this.formSuccess = false;

                        Toasts.push({
                            icon: 'sad',
                            title: 'Oops, something went wrong!',
                            themeColor: this.themeColor,
                            message: 'Payment method has not been created!',
                        });
                    }

                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                });
        },

        cancelForm() {
            window.closeAllModals();
            this.editingPaymentMethod = this.defaultPaymentMethod();
        },

        isPrimaryPaymentMethod(paymentMethod) {
            return this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.userPaymentMethod.data,
            ).attributes.is_primary;
        },

        getExpirationDate(paymentMethod) {
            const date = this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.method.data,
            ).attributes.expiration_date;

            if (date) {
                return DateTime.fromSQL(date).toFormat('MM/yy');
            }

            return 'N/A';
        },

        getRelatedAttributesByTypeAndId({ id, type }) {
            const data = this.paymentMethodsData.included.find(data => data.id === id && data.type === type);

            return data || { id: 'N/A', attributes: {} };
        },

        getPaymentMethods() {
            EcommerceService.getPaymentMethods(this.userId)
                .then((response) => {
                    if (response) {
                        this.paymentMethodsData = response.data;
                    }
                });
        },

        deletePaymentMethod(id) {
            Toasts.confirm({
                title: 'Are you sure you want to delete this payment method?',
                submitButton: {
                    text: '<span class="bg-error text-white">Delete</span>',
                    callback: () => {
                        EcommerceService.deletePaymentMethod(id)
                            .then((response) => {
                                this.handleResponse(response, 'deleted');

                                if (response) {
                                    EcommerceService.getPaymentMethods(this.userId)
                                        .then((response) => {
                                            if (response) {
                                                this.paymentMethodsData = response.data;
                                            }
                                        });
                                }
                            });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        markPaymentMethodAsDefault(id) {
            Toasts.confirm({
                title: 'Set this payment method as your default?',
                subtitle: 'Your current subscriptions and payment plans will be charged to this payment method.',
                submitButton: {
                    text: '<span class="bg-success text-white">Confirm</span>',
                    callback: () => {
                        EcommerceService.setPaymentMethodAsDefault(id)
                            .then((response) => {
                                this.handleResponse(response, 'set as default');

                                if (response) {
                                    EcommerceService.getPaymentMethods(this.userId)
                                        .then((response) => {
                                            if (response) {
                                                this.paymentMethodsData = response.data;
                                            }
                                        });
                                }
                            });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>',
                },
            });
        },

        handleResponse(response, action) {
            if (response) {
                Toasts.push({
                    icon: 'happy',
                    title: 'Success!',
                    themeColor: this.themeColor,
                    message: `Payment method has been ${action}!`,
                });
            } else {
                Toasts.push({
                    icon: 'sad',
                    title: 'Oops, something went wrong!',
                    themeColor: this.themeColor,
                    message: `An error happened on the server. Payment method has not been ${action}!`,
                });
            }
        },
    },
};
</script>

<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

    .form-loading {
        position:fixed;
        top:50%;
        left:50%;
        z-index:200;
        transform:translate(-50%, -50%);
        width:250px;

        i {
            font-size:72px;
        }

        .success-message {
            position:absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
        }
    }
    .loading-overlay {
        content: '';
        position:fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        z-index:199;
        background:rgba(0,0,0,.4);
    }

    .radio-col {
        flex:0 0 30px;
        max-width:30px;
    }
    .default-col {
        flex:0 0 60px;
        max-width:60px;
    }
    .expiry-col {
        flex:0 0 120px;
        max-width:120px;
    }
    .actions-col {
        flex:0 0 70px;
        max-width:70px;
    }
</style>
