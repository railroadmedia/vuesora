<template>
    <div class="flex flex-row ph-2 pt-2 align-v-center flex-wrap-xs-only">
        <div class="flex flex-column cart-thumbnail align-center mb-2">
            <div
                class="thumbnail rounded bg-center"
                :style="`background-image:url(${item.thumbnail_url});`"
            ></div>
        </div>
        <div class="flex flex-column mb-2">
            <div class="flex flex-row flex-wrap">
                <div class="flex flex-column xs-12 sm-8 ph-2">
                    <h3 class="subheading">
                        {{ item.name }}
                    </h3>
                    <h4 class="body text-grey-4 mb-2">
                        {{ item.description }}
                    </h4>

                    <div
                        v-if="item.requires_shipping && !isCartLocked"
                        class="flex flex-row align-h-left align-v-center"
                    >
                        <div class="flex flex-column flex-auto">
                            <h4 class="body quantity-label dense font-bold">
                                Quantity:
                            </h4>
                        </div>

                        <div class="flex flex-column flex-auto quantity-column">
                            <input
                                v-model="$_itemQuantity"
                                type="number"
                                min="1"
                                max="99"
                                class="no-label text-center"
                                style="border:none;background:none;"
                            >
                        </div>

                        <div
                            v-show="loading"
                            class="flex flex-column flex-auto body"
                        >
                            <i
                                class="fas fa-spin fa-spinner"
                                :class="themeTextClass"
                            ></i>
                        </div>
                    </div>

                    <div
                        v-if="!isCartLocked"
                        class="flex flex-row"
                    >
                        <div class="flex flex-column flex-auto">
                            <a
                                class="text-error tiny dense font-bold pointer uppercase"
                                title="Remove Item"
                                @click.stop.prevent="removeCartItem"
                            >
                                Remove
                            </a>
                        </div>
                    </div>
                </div>
                <div class="flex flex-column xs-12 sm-4 ph-3 pt-1 text-right align-v-top">
                    <h3
                        v-if="isDiscounted"
                        class="body font-bold dense font-strike text-error"
                    >
                        ${{ item.price_before_discounts }}
                    </h3>

                    <h2 class="display dense">
                        ${{ totalPriceAfterDiscounts }}
                    </h2>

                    <h3
                        v-if="item.subscription_interval_type"
                        class="x-tiny text-grey-3"
                    >
                        per {{ item.subscription_interval_type }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import EcommerceService from '../../assets/js/services/ecommerce.js';
import ThemeClasses from '../../mixins/ThemeClasses';
import Toasts from '../../assets/js/classes/toasts';
import CartEvents from './_events';


export default {
    name: 'OrderFormCartItem',
    mixins: [ThemeClasses, CartEvents],
    props: {
        item: {
            type: Object,
        },

        isCartLocked: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            loading: false,
            updateQuantityTimeout: null,
            itemQuantity: this.item.quantity,
        };
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
            },
        },

        totalPriceAfterDiscounts() {
            return Number(this.item.price_after_discounts).toFixed(2);
        },

        isDiscounted() {
            return this.item.price_after_discounts !== this.item.price_before_discounts;
        },
    },
    mounted() {
    },
    methods: {
        updateCartItemQuantity(quantity) {
            this.loading = true;

            EcommerceService.updateCartItemQuantity({
                productSku: this.item.sku,
                quantity,
            })
                .then(this.handleResponse);
        },

        removeCartItem() {
            this.loading = true;

            EcommerceService.removeCartItem({
                productSku: this.item.sku,
            })
                .then(this.handleResponse);
        },

        handleResponse(response) {
            if (response) {
                this.emitUpdateCartItem(response.data);
            } else {
                Toasts.push({
                    icon: 'disappointed',
                    title: 'Something went wrong!',
                    themeColor: this.themeColor,
                    message: 'Please contact support using the chat widget at the bottom of the page.',
                });

                this.itemQuantity = this.item.quantity;
            }

            this.loading = false;
        },
    },
};
</script>

<style lang="scss">
    @import '../../assets/sass/partials/variables';

    .cart-thumbnail {
        flex:0 0 100%;
        max-width:100%;

        @include small {
            flex:0 0 200px;
            max-width:200px;
        }

        .thumbnail {
            height:180px;
            width:180px;
        }
    }
    .quantity-column {
        flex:0 0 75px;
        max-width:75px;
    }
</style>
