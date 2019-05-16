<template>
    <div class="flex flex-column bg-white shadow corners-5 pv-2 mb-3">

        <order-form-cart-item
            v-for="item in cartItems"
            :themeColor="themeColor"
            :key="item.id"
            :item="item"
            @updateCartItem="emitUpdateCartItem"></order-form-cart-item>

        <h4 class="pa-3 text-center" v-show="cartItems.length == 0">Cart is empty</h4>
    </div>
</template>
<script>
    import OrderFormCartItem from './_OrderFormCartItem.vue';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import CartEvents from './_events';

    export default {
        mixins: [ThemeClasses, CartEvents],
        name: 'order-form-cart',
        components: {
            'order-form-cart-item': OrderFormCartItem,
        },
        props: {
            cartItems: {
                type: Array,
                default: () => []
            },
        },
        mounted() {
        }
    }
</script>
