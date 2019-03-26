<template>
    <div class="flex flex-column">
        <h3 class="subheading text-center">Your Order is Protected by Our Extended 90-Day 100% Money Back
                Guarantee!</h3>
        <order-form-cart
            :cart-items="items"></order-form-cart>
        <order-form-account
            :current-user="user"></order-form-account>
    </div>
</template>
<script>
    import OrderFormAccount from './_OrderFormAccount.vue';
    import OrderFormCart from './_OrderFormCart.vue';
    import ThemeClasses from '../../mixins/ThemeClasses';
    import Toasts from '../../assets/js/classes/toasts';

    export default {
        mixins: [ThemeClasses],
        name: 'order-form',
        components: {
            'order-form-account': OrderFormAccount,
            'order-form-cart': OrderFormCart,
        },
        data() {
            return {
                items: [],
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
            requiresShippingAddress: {
                type: Boolean,
                default: () => false
            },
            user: {
                type: Object,
                default: () => null
            }
        },
        mounted() {

            this.items = this.cartItems;

            this.$root.$on('updateCartData', (cartData) => {

                this.items = cartData.data;

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
        }
    }
</script>
