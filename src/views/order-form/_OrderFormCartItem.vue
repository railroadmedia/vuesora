<template>
    <div class="flex flex-row pa-2 align-v-top">
        <div class="flex md-2 ph-2 thumbnail-container">
            <img v-bind:src="item.thumbnail_url" class="rounded" alt="product image">
        </div>
        <div class="flex flex-column grow ph-2">
            <div class="flex">
                <h3 class="subheading">{{ item.name }}</h3>
            </div>
            <div class="flex">
                <h4 class="subtitle">{{ item.description }}</h4>
            </div>
            <div class="flex flex-row align-h-left align-v-center pt-2">
                <div class="flex">
                    <h4 class="body quantity-label">Quantity</h4>
                </div>
                <div class="flex quantity-wrapper ph-1">
                    <div
                        class="mr-2"
                        v-if="item.subscription_interval_type == null">
                        <input
                            type="text"
                            v-model="quantity"
                            class="quantity-input text-center">
                    </div>
                    <span
                        class="body"
                        v-if="item.subscription_interval_type != null">{{ item.quantity }}</span>
                </div>
                <div class="flex grow">
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
            <div class="flex" v-if="item.subscription_interval_type">
                <h3 class="tiny">per {{ item.subscription_interval_type }}</h3>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/order-form.js';

    export default {
        name: 'order-form-cart-item',
        props: {
            item: {
                type: Object,
                default: () => {
                    sku: '';
                    name: '';
                    description: '';
                    quantity: '';
                    stock: '';
                    subscription_interval_type: null;
                    subscription_interval_count: null;
                    price_before_discounts: 0;
                    price_after_discounts: 0;
                    requires_shipping: false;
                    thumbnail_url: null;
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
                    return this.item.quantity;
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
                return this.item.price_after_discounts != this.item.price_before_discounts ?
                    this.item.price_before_discounts : false;
            },
            totalPrice() {
                return this.item.price_after_discounts;
            },
            updateCartItemQuantity() {
                Api
                    .updateCartItemQuantity({
                        productSku: this.item.sku,
                        quantity: this.updateQuantity
                    })
                    .then(this.handleResponse);
            },
            removeCartItem() {
                Api
                    .removeCartItem({
                        productSku: this.item.sku
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
        max-width: 55px;
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
    .thumbnail-container img {
        align-self: center;
    }
</style>
