<template>
    <div class="flex flex-row pa-2 align-v-center">
        <div class="flex flex-column xs-12 sm-2 ph-2">
            <div class="square">
                <img :src="item.thumbnail_url"
                     class="rounded"
                     alt="product image">
            </div>
        </div>

        <div class="flex flex-column grow ph-2">
            <h3 class="subheading">{{ item.name }}</h3>
            <h4 class="body dense text-grey-4">{{ item.description }}</h4>

            <div class="flex flex-row align-h-left align-v-center pt-2">
                <div class="flex flex-column flex-auto">
                    <h4 class="body quantity-label dense font-bold">Quantity:</h4>
                </div>

                <div class="flex flex-column flex-auto quantity-column">
                    <input type="number"
                           v-model="$_itemQuantity"
                           min="1"
                           class="no-label text-center"
                           style="border:none;background:none;">
                </div>

                <div v-show="loading"
                     class="flex flex-column flex-auto body">
                    <i class="fas fa-spin fa-spinner"
                       :class="themeTextClass"></i>
                </div>
            </div>

            <div class="flex flex-row">
                <div class="flex flex-column flex-auto">
                    <a class="text-error tiny dense font-bold pointer uppercase"
                       title="Remove Item"
                       @click.stop.prevent="removeCartItem">
                        Remove
                    </a>
                </div>
            </div>
        </div>
        <div class="flex flex-column flex-auto ph-3 pt-1 text-right">
                <h3 v-if="isDiscounted"
                    class="body font-bold dense font-strike text-error">
                    ${{ item.price_before_discounts }}
                </h3>

                <h2 class="display dense">${{ item.price_after_discounts }}</h2>

                <h3 v-if="item.subscription_interval_type"
                    class="x-tiny text-grey-3">
                    per {{ item.subscription_interval_type }}
                </h3>
        </div>
    </div>
</template>
<script>
    import EcommerceService from '../../assets/js/services/ecommerce.js';
    import ThemeClasses from "../../mixins/ThemeClasses";
    import Toasts from '../../assets/js/classes/toasts';
    import CartEvents from './events';


    export default {
        mixins: [ThemeClasses, CartEvents],
        name: 'order-form-cart-item',
        props: {
            item: {
                type: Object,
            },
        },
        data() {
            return {
                loading: false,
                updateQuantityTimeout: null,
                itemQuantity: this.item.quantity,
            }
        },
        computed: {
            $_itemQuantity: {
                get() {
                    return this.itemQuantity;
                },
                set(val) {
                    // This timeout prevents multiple requests from being sent
                    clearTimeout(this.updateQuantityTimeout);

                    this.updateQuantityTimeout = setTimeout(() => {
                        this.updateCartItemQuantity(val);
                        this.itemQuantity = val;
                    }, 500);
                }
            },

            isDiscounted(){
                return this.item.price_after_discounts !== this.item.price_before_discounts;
            },
        },
        methods: {
            updateCartItemQuantity(quantity) {
                this.loading = true;

                EcommerceService.updateCartItemQuantity({
                    productSku: this.item.sku,
                    quantity: quantity
                })
                    .then(this.handleResponse);
            },

            removeCartItem() {
                this.loading = true;

                EcommerceService.removeCartItem({
                    productSku: this.item.sku
                })
                    .then(this.handleResponse);
            },

            handleResponse(response) {
                if(response){
                    Toasts.push({
                        icon: 'happy',
                        title: 'Success!',
                        themeColor: this.themeColor,
                        message: 'Your cart has been updated!'
                    });

                    this.emitUpdateCartItem(response.data);
                } else {
                    Toasts.push({
                        icon: 'disappointed',
                        title: 'Something went wrong!',
                        themeColor: this.themeColor,
                        message: 'Please contact support using the chat widget at the bottom of the page.'
                    });

                    this.itemQuantity = this.item.quantity;
                }

                this.loading = false;
            },
        },
        mounted() {
        }
    }
</script>

<style lang="scss">

    .quantity-column {
        flex:0 0 75px;
        max-width:75px;
    }
</style>
