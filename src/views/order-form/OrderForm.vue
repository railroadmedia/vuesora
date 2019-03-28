<template>
    <div class="flex flex-column order-form">
        <h3 class="subheading text-center">Your Order is Protected by Our Extended 90-Day 100% Money Back
                Guarantee!</h3>
        <order-form-cart
            :cart-items="items"></order-form-cart>
        <order-form-account
            :current-user="user"
            :requires-account="requiresAccount"
            :login-url="loginUrl"
            :logout-url="logoutUrl"
            :billing-address="billingAddress"></order-form-account>

        <order-form-shipping
            :shipping-address="shippingAddress"
            :countries="countries"></order-form-shipping>

        <order-form-payment></order-form-payment>
    </div>
</template>
<script>
    import Api from './api.js';
    import OrderFormAccount from './_OrderFormAccount.vue';
    import OrderFormCart from './_OrderFormCart.vue';
    import OrderFormPayment from './_OrderFormPayment.vue';
    import OrderFormShipping from './_OrderFormShipping.vue';
    import ThemeClasses from '../../mixins/ThemeClasses';
    import Toasts from '../../assets/js/classes/toasts';

    export default {
        mixins: [ThemeClasses],
        name: 'order-form',
        components: {
            'order-form-account': OrderFormAccount,
            'order-form-cart': OrderFormCart,
            'order-form-shipping': OrderFormShipping,
            'order-form-payment': OrderFormPayment,
        },
        data() {
            return {
                items: [],
                requiresAccount: false,
                requiresShippingAddress: false,
                validationForms: {
                    account: false,
                    shipping: false,
                    payment: false
                },
                addresses: {
                },
                addressesPersisted: null,
                updateAddressesTimeout: null,
            }
        },
        props: {
            billingAddress: {
                type: Object,
                default: () => null
            },
            shippingAddress: {
                type: Object,
                default: () => null
            },
            cartItems: {
                type: Array,
                default: () => []
            },
            user: {
                type: Object,
                default: () => null
            },
            loginUrl: {
                type: String,
                default: '/login',
            },
            logoutUrl: {
                type: String,
                default: '/',
            },
            countries: {
                type: Object,
                default: () => {
                    return {}
                }
            },
        },
        methods: {
            processCartItems(cartItems) {

                this.items = cartItems;
                this.requiresAccount = false;
                this.requiresShippingAddress = false;

                this.items.forEach(item => {
                    if (item.attributes.subscriptionIntervalType) {
                        this.requiresAccount = true;
                    }
                    if (item.attributes.requiresShippingAddress) {
                        this.requiresShippingAddress = true;
                    }
                });
            },
            shouldSaveAddresses() {
                if (!this.addressesPersisted) {
                    return true;
                }

                let hasDifferences = false;

                for (let key in this.addresses) {
                    if (
                        !this.addressesPersisted.hasOwnProperty(key) ||
                        this.addressesPersisted[key] != this.addresses[key]
                    ) {
                        hasDifferences = true;
                    }
                }

                return hasDifferences;
            },
            updateAddress(addressObject) {

                this.addresses = {...this.addresses, ...addressObject};

                if (this.shouldSaveAddresses()) {

                    clearTimeout(this.updateAddressesTimeout);

                    this.updateAddressesTimeout = setTimeout(() => {
                        Api
                            .updateAddresses(this.addresses)
                            .then((response) => {
                                this.addressesPersisted = {...this.addresses};
                            });
                    }, 750);
                }
            },

        },
        mounted() {

            this.processCartItems(this.cartItems);

            this.$root.$on('updateCartData', (cartData) => {
                // triggered by cart items quantity update/removal
                this.processCartItems(cartData.data);

                if (cartData.meta && cartData.meta.notAvailableProducts) {
                    cartData.meta.notAvailableProducts.forEach(error => {
                        Toasts.push({
                            icon: 'astonished',
                            themeColor: this.themeColor,
                            title: 'Oups',
                            message: error,
                            timeout: 20000
                        });
                    })
                }

                // todo - PMP-339 - update shipping, tax, total and playment plans data
            });

            this.$root.$on('startValidation', () => {
                // triggered by pressing submit order button

                this.validationForms = {
                    account: false,
                    shipping: false
                };

                this.$root.$emit('validateOrderForm');
            });

            this.$root.$on('registerSubformValidation', ({form, result}) => {
                // triggered by child components
                this.validationForms[form] = result;

                if (result) {
                    // if current result is successful, check the other results
                    let complete = true;

                    for (let key in this.validationForms) {
                        if (!this.validationForms[key]) {
                            complete = false;
                            break;
                        }
                    }

                    if (complete) {
                        // if the form is complete & valid, start payment routine
                        // this.$root.$emit('makePayment', this.orderFormData);
                        console.log("should attempt payment");
                    }
                }
            });

            this.$root.$on('saveAddress', this.updateAddress);
        }
    }
</script>
<style lang="scss">
    .order-form {
        .order-form-input {
            padding-top: 0;

            + .validation {
                display: none;
            }

            &.invalid {
                border: 1px solid #f07575;
                background-color: #fff0f0;

                + .validation {
                    color: #F00;
                    display: inline-block;
                }
            }

            &:focus {
                border: 1px solid #8a8a8a;
                box-shadow: 0 0 5px #cacaca;
            }
        }
    }
</style>