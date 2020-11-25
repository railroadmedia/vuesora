<template>
    <a
        href="/order"
        class="join outline-button cart-button"
        @click.stop.prevent="handleClick"
    >
        <i class="fas fa-cart-plus"></i>
        <span class="cart-number" v-if="cartItems && cartItems.length">{{ cartItems.length }}</span>
    </a>
</template>

<script>
export default {
    name: 'NavCartButton',
    props: {
        cartData: {
            item: String,
        },
    },
    data() {
        return {
            cartItems: null,
        }
    },
    mounted() {
        let cartData = JSON.parse(this.cartData);

        this.updateCartData(cartData);

        this.$root.$on('updateCartData', this.updateCartData);
    },
    methods: {
        updateCartData(cartData) {
            this.cartItems = cartData.meta.cart.items;
        },
        handleClick() {
            this.$root.$emit('openCartSidebar', {});
        },
    },
}
</script>