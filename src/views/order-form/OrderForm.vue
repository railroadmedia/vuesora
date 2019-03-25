<template>
    <div class="flex flex-column">
        <h3 class="subheading text-center">Your Order is Protected by Our Extended 90-Day 100% Money Back
                Guarantee!</h3>
        <order-form-cart
            :cart-items="cartItems"></order-form-cart>
    </div>
</template>
<script>
    import ThemeClasses from '../../mixins/ThemeClasses';
    import OrderFormCart from './_OrderFormCart.vue'

    export default {
        mixins: [ThemeClasses],
        name: 'order-form',
        components: {
            'order-form-cart': OrderFormCart,
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
            }
        },
        mounted() {
        }
    }
</script>
