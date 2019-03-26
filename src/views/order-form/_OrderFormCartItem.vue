<template>
    <div
        class="flex flex-row pa-2 align-v-top">
        <div class="flex md-2 ph-2">
            <img v-bind:src="item.attributes.options.thumbnail_url" class="rounded" alt="product image">
        </div>
        <div class="flex flex-column grow ph-2">
            <div class="flex">
                <h3 class="subheading">{{ item.attributes.name }}</h3>
            </div>
            <div class="flex">
                <h4 class="subtitle">{{ item.attributes.description }}</h4>
            </div>
            <div class="flex flex-row align-h-left align-v-center pt-2">
                <div class="flex">
                    <h4 class="body quantity-label">Quantity</h4>
                </div>
                <div class="flex quantity-wrapper ph-1">
                    <input
                        type="text"
                        v-model="quantity"
                        class="quantity-input text-center">
                </div>
                <div class="flex grow pl-2">
                    <a
                        class="body quantity-remove font-bold"
                        v-on:click.stop.prevent="removeCartItem">X</a>
                </div>
            </div>
        </div>
        <div class="flex flex-column flex-auto ph-3 pt-1 align-h-right">
            <div class="flex" v-if="initialPrice()">
                <h3 class="title text-dark font-strike">${{ initialPrice() }}</h3>
            </div>
            <div class="flex">
                <h3 class="heading">${{ totalPrice() }}</h3>
            </div>
            <div class="flex" v-if="item.attributes.subscriptionIntervalType">
                <h3 class="tiny">per {{ item.attributes.subscriptionIntervalType }}</h3>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from './api.js';

    export default {
        name: 'order-form-cart-item',
        props: {
            item: {
                type: Object,
                default: () => {
                    attributes: {
                        name: '';
                        description: '';
                        quantity: '';
                        totalPrice: '';
                        subscriptionIntervalType: '';
                        options: {
                            thumbnail_url: null;
                        };
                    }
                }
            },
        },
        data() {
            return {
                updateQuantity: '',
                updateQuantityTimeout: null,
            }
        },
        computed: {
            quantity: {
                get() {
                    return this.item.attributes.quantity;
                },
                set(val) {

                    this.updateQuantity = val;

                    if (val) {

                        clearTimeout(this.updateQuantityTimeout);

                        this.updateQuantityTimeout = setTimeout(this.updateCartItemQuantity, 750);
                    }
                }
            }
        },
        methods: {
            initialPrice() {
                return this.item.attributes.discountedPrice ?
                    this.item.attributes.totalPrice : false;
            },
            totalPrice() {
                return this.item.attributes.discountedPrice ?
                    this.item.attributes.discountedPrice : this.item.attributes.totalPrice;
            },
            updateCartItemQuantity() {
                Api
                    .updateCartItemQuantity({
                        productId: this.item.attributes.options['product-id'],
                        quantity: this.updateQuantity
                    })
                    .then(this.handleResponse);
            },
            removeCartItem() {
                Api
                    .removeCartItem({
                        productId: this.item.attributes.options['product-id']
                    })
                    .then(this.handleResponse);
            },
            handleResponse(response) {
                // parent order form component handles the UI updates
                // with all data from the response - cart items, taxes, shipping, total, etc
                this.$root.$emit('updateCartData', response);
            },
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    .quantity-label {
        color: dodgerblue;
    }
    .quantity-wrapper {
        max-width: 35px;
        max-height: 30px;

        .quantity-input {
            padding: 0;
            width: 35px;
            height: 30px;
        }
    }
    .quantity-remove {
        color: red;
    }
</style>
