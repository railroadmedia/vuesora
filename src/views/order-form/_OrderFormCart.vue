<template>
    <div class="flex flex-column bg-white shadow corners-5 pv-2 mb-3">
        <order-form-cart-item
            v-for="item in cartItems"
            :key="item.sku"
            :theme-color="themeColor"
            :item="item"
            :is-cart-locked="isCartLocked"
            @updateCartItem="emitUpdateCartItem"
        ></order-form-cart-item>

        <order-form-cart-item
            v-for="item in bonuses"
            :key="item.sku"
            :theme-color="themeColor"
            :item="item"
            :is-cart-locked="isCartLocked"
            @updateCartItem="emitUpdateCartItem"
        ></order-form-cart-item>

        <h4
            v-show="cartItems.length == 0"
            class="pa-3 text-center"
        >
            Cart is empty
        </h4>
    </div>
</template>
<script>
import OrderFormCartItem from './_OrderFormCartItem.vue';
import ThemeClasses from '../../mixins/ThemeClasses';
import CartEvents from './_events';

export default {
    name: 'OrderFormCart',
    components: {
        'order-form-cart-item': OrderFormCartItem,
    },
    mixins: [ThemeClasses, CartEvents],
    props: {
        cartItems: {
            type: Array,
            default: () => [],
        },

        isCartLocked: {
            type: Boolean,
            default: () => false,
        },

        bonuses: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {
    },
};
</script>
