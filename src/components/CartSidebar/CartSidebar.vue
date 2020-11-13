<template>
    <div>
        <div id="cart-sidebar-overlay" @click.stop.prevent="closeCartSidebar" :class="{active: active}">
        </div>
        <section id="cart-sidebar" :class="{active: active}">
            <div class="top">
                <h5 class="">Your Cart</h5>
                <a
                    href="#"
                    class="close"
                    @click.stop.prevent="closeCartSidebar"
                ><i class="fal fa-times fa-2x"></i></a>
            </div>
            <div class="csb-guarantee">
                <i class="fas fa-check-circle" :class="brand"></i>
                <span>All of our drum lessons are backed by a 90-day guarantee.</span>
            </div>
            <div id="csb-products-container" v-show="cartItems">
                <div class="border-top"></div>
                <div class="csb-products-inner" ref="simplebar">
                    <div class="csb-products-wrapper">
                        <cart-item
                            v-for="item in cartItems"
                            v-if="cartItems"
                            :key="item.sku"
                            :item="item"
                            :loading="loading"
                            @removeCartItem="removeCartItem"
                            @updateCartItemQuantity="updateCartItemQuantity"
                        ></cart-item>
                    </div>
                </div>
                <div class="border-bottom"></div>
            </div>
            <div class="summary-container">
                <div class="summary-row">
                    <div class="summary">Subtotal</div>
                    <div class="due">
                        <span v-if="cartTotals">${{ parseTotal(cartTotals.due - cartTotals.tax + sumOfDiscounts() - cartTotals.shipping) }}</span>
                    </div>
                </div>
                <div class="summary-row">
                    <div class="summary">Shipping</div>
                    <div class="deferred">Calculated at checkout</div>
                </div>
                <div class="summary-row">
                    <div class="summary">Tax</div>
                    <div class="deferred">Calculated at checkout</div>
                </div>
            </div>
            <div class="checkout">
                <a href="/order" :class="brand"><i class="fas fa-lock"></i>checkout</a>
            </div>
            <div class="recommended-title">customers also liked</div>
            <div class="recommended-products" v-if="cartItems">
                <recommended-product
                    v-for="item in recommendedProducts"
                    :key="item.sku"
                    :item="item"
                    :brand="brand"
                    :loading="loading"
                    @addToCart="addRecommendedProductToCart"
                ></recommended-product>
            </div>
        </section>
    </div>
</template>

<script>
import CartItem from './_CartItem.vue';
import RecommendedProduct from './_RecommendedProduct.vue';
import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

import EcommerceService from '../../assets/js/services/ecommerce.js';

export default {
    components: {
        'cart-item': CartItem,
        'recommended-product': RecommendedProduct,
    },
    name: 'CartSidebar',
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        cartData: {
            item: String,
        },
    },
    data() {
        return {
            active: false,
            cartItems: null,
            cartTotals: null,
            recommendedProducts: null,
            discounts: [],
            simpleBar: null,
            loading: false,
        };
    },
    mounted() {
        let cartData = JSON.parse(this.cartData);

        this.updateCartData(cartData);

        this.$root.$on('openCartSidebar', this.openCartSidebar);

        this.simpleBar = new SimpleBar(this.$refs.simplebar, {autoHide: false});
        this.loading = false;

        this.attachAddToCartListeners();
    },
    methods: {
        openCartSidebar() {
            this.active = true;

            // todo - refactor when drumshop & product pages are created with vue, used for removing page scroll bar on mobiles
            document.body.classList.add('cart-sidebar-active');
        },

        closeCartSidebar() {
            this.active = false;

            // todo - refactor when drumshop & product pages are created with vue, used for adding back page scroll bar on mobiles
            document.body.classList.remove('cart-sidebar-active');
        },

        updateCartData(cartData) {
            this.cartItems = cartData.meta.cart.items.reverse();
            this.recommendedProducts = cartData.meta.cart.recommendedProducts;
            this.cartTotals = cartData.meta.cart.totals;
            this.discounts = cartData.meta.cart.discounts;

            setTimeout(() => {
                this.simpleBar.recalculate();
                this.simpleBar.getScrollElement().scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 10);
        },

        attachAddToCartListeners() {
            // todo - when drumshop page will be refactored with vue, remove/replace this logic

            let buttons = document.querySelectorAll('.vue-add-to-cart');

            if (buttons.length) {
                Array.from(buttons).forEach((element) => {

                    element.addEventListener('click', (event) => {

                        event.preventDefault();

                        let isValid = !this.loading && element.hasAttribute('data-product-json');

                        if (isValid && (element.classList.contains('selected-pack') || element.classList.contains('merch'))) {
                            isValid = element.classList.contains('active')
                        }
                        
                        if (isValid) {
                            event.stopPropagation();

                            element.classList.add('loading');

                            this.openCartSidebar();

                            let productsObject = JSON.parse(element.getAttribute('data-product-json'));
                            let promoCode = element.hasAttribute('data-promocode') ? element.getAttribute('data-promocode') : null;
                            let lockedCart = element.hasAttribute('data-locked-cart') ? element.getAttribute('data-locked-cart') : null;

                            this
                                .addToCart(productsObject, promoCode, lockedCart)
                                .then(() => {
                                    element.classList.remove('loading');
                                });
                        }
                    });
                });
            }
        },

        addToCart(products, promoCode, lockedCart) {
            if (!this.loading) {
                this.loading = true;

                let payload = {products: products};

                if (promoCode) {
                    payload['promo-code'] = promoCode;
                }

                if (lockedCart) {
                    payload['locked'] = lockedCart;
                }

                return EcommerceService
                    .addCartItems(payload)
                    .then(this.handleCartUpdate)
                    .catch(this.handleError);
            }
        },

        removeCartItem(cartItem) {
            if (!this.loading) {
                this.loading = true;

                EcommerceService
                    .removeCartItem({productSku: cartItem.sku})
                    .then(this.handleCartUpdate)
                    .catch(this.handleError);
            }
        },

        updateCartItemQuantity({cartItem, quantity}) {
            if (!this.loading) {
                this.loading = true;

                EcommerceService
                    .updateCartItemQuantity({productSku: cartItem.sku, quantity})
                    .then(this.handleCartUpdate)
                    .catch(this.handleError);
            }
        },

        handleCartUpdate(response) {
            this.updateCartData(response.data);
            this.$root.$emit('updateCartData', response.data);

            this.loading = false;

            if (!this.cartItems.length) {
                this.closeCartSidebar();
            } else if (!this.active) {
                this.openCartSidebar();
            }
        },

        addRecommendedProductToCart(cartItem) {
            let product = {};

            product[cartItem.sku] = cartItem.quantity;

            this.addToCart(product);
        },

        parseTotal(total) {
            return (total || 0).toFixed(2);
        },

        sumOfDiscounts() {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;

            if (this.discounts.length) {
                return this.discounts.reduce(reducer);
            }

            return 0;
        },

        handleError() {
            this.loading = false;
            this.$toasted.error(
                'Something went wrong! Please try again or contact support using the chat widget at the bottom of the page.',
                {
                    icon: 'fal fa-meh-rolling-eyes fa-3x toasted-icon',
                }
            );
        }
    },
}
</script>

<style lang="scss">
@import '../../assets/sass/partials/_variables.scss';

.toasted-container.custom-toast {
    z-index: 2147483010;
    &.top-left {
        left: 2%;
    }
    .toasted {
        max-width: 400px;
        .toasted-icon {
            margin-right: 20px;
        }
        .toasted-close-icon {
            color: #8B929A;
            font-size: 18px;
        }
    }
}
#cart-sidebar-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    visibility: hidden;
    z-index: -1;
    opacity: 0;
    -webkit-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    -moz-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    -o-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    &.active {
        z-index: 2147483005;
        opacity: 1;
        visibility: visible;
    }
}
#cart-sidebar {
    position: fixed;
    top: 0;
    right: -600px;
    z-index: 2147483006;
    opacity: 0;
    padding-left: 2px;
    -webkit-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    -moz-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    -o-transition: visibility 0.1s ease-in-out, opacity 0.1s ease-in-out;
    height:100vh;
    overflow: auto;
    padding: 20px 5px 20px 20px;
    display: flex;
    flex-direction: column;
    background: #FCFCFC;
    @include xSmallOnly {
        width: 95%;
    }
    &.active {
        opacity: 1;
        right: 0;
    }
    .top {
        padding: 10px 15px 10px 0;
        position: relative;
        .close {
            position: absolute;
            top: 0;
            right: 10px;
        }
        h5 {
            font-weight: 700;
            font-size: 30px;
            margin-bottom: 0;
        }
        a {
            color: #CCD3D3;
        }
    }
    .csb-guarantee {
        padding-bottom: 18px;
        padding-right: 14px;
        line-height: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        i {
            margin-right: 3px;
            &.drumeo {
                color: #0b76db;
            }
            &.pianote {
                color: #ff383f;
            }
        }
        span {
            padding-left: 3px;
            color: #8B929A;
            font-size: 12px;
        }
    }
    .summary-container {
        padding: 18px 15px 18px 0;
        .summary-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .summary {
                font-size: 14px;
            }
            .due {
                font-weight: 700;
                font-size: 14px;
            }
            .deferred {
                font-size: 14px;
                font-style: italic;
            }
        }
    }
    .checkout {
        margin-right: 15px;
        text-align: center;
        a {
            color: #FFF;
            padding: 12px;
            font: 700 17px "Roboto Condensed",sans-serif;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 50px;
            outline: none;
            text-align: center;
            user-select: none;
            transition: all .3s;
            box-shadow: 0 0 0 rgba(0,0,0,0.35);
            display: inline-block;
            width: 100%;
            &.drumeo {
                background: #0B76DB;
                &:hover {
                    background: #258FF4;
                }
            }
            &.pianote {
                background: #FF383F;
                &:hover {
                    background: #FF6B70;
                }
            }
            i {
                padding-right: 5px;
            }
        }
    }
    .recommended-title {
        padding-top: 15px;
        padding-right: 15px;
        text-transform: uppercase;
        font-size: 14px;
        color: #8B929A;
    }
    .recommended-products {
        display: flex;
        flex-direction: row;
        padding-top: 10px;
        padding-bottom: 20px;
    }
}
#csb-products-container {
    overflow: hidden;
    position: relative;
    min-height: 200px;

    .border-top {
        border-top: 1px solid #CCD3D3;
        margin-right: 15px;
    }

    .csb-products-inner {
        max-height: 100%;
        padding-right: 15px;

        .csb-products-wrapper {
            max-height: 100%;
        }
    }

    .border-bottom {
        border-bottom: 1px solid #CCD3D3;
        position: absolute;
        bottom: 0;
        right: 15px;
        left: 0;
    }
}
</style>
