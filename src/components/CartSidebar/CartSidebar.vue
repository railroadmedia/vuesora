<template>
    <div>
        <div id="cart-sidebar-overlay" @click.stop.prevent="closeCartSidebar" :class="{active: active}">
        </div>
        <section id="cart-sidebar" :class="{active: active}">
            <div class="inner-container">
                <div class="top">
                    <h5 class="">Your cart</h5>
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
                <div id="csb-products-container" v-if="cartItems">
                    <div class="border-top"></div>
                    <div class="csb-products-inner" data-simplebar data-simplebar-auto-hide="false">
                        <simplebar>
                            <cart-item
                                v-for="item in cartItems"
                                :key="item.sku"
                                :item="item"
                            ></cart-item>
                        </simplebar>
                    </div>
                    <div class="border-bottom"></div>
                </div>
                <div class="summary-container">
                    <div class="summary-row">
                        <div class="summary">Subtotal</div>
                        <div class="due"><span v-if="cartTotals">${{ cartTotals.due }}</span></div>
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
                <div class="recommended-products">products</div>
            </div>
        </section>
    </div>
</template>

<script>
import CartItem from './_CartItem.vue';
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';

export default {
    components: {
        'cart-item': CartItem,
        simplebar
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
        };
    },
    mounted() {
        let cartData = JSON.parse(this.cartData);

        this.updateCartData(cartData);

        this.$root.$on('openCartSidebar', this.openCartSidebar);

        this.attachAddToCartListeners();
    },
    beforeDestroy() {
    },
    methods: {
        openCartSidebar() {
            this.active = true;
        },

        closeCartSidebar() {
            this.active = false;
        },

        updateCartData(cartData) {
            this.cartItems = cartData.meta.cart.items;
            this.cartTotals = cartData.meta.cart.totals;
        },

        attachAddToCartListeners() {
            let buttons = document.querySelectorAll('.vue-add-to-cart');

            if (buttons.length) {
                Array.from(buttons).forEach((element) => {
                    let sku = element.getAttribute('data-sku');

                    if (!sku) {
                        console.error('Vue CartSidebar found vue-add-to-cart class on an element without data-sku attribute set, element: %s', element);
                    } else {
                        element.addEventListener('click', (event) => {
                            this.addToCart(sku);
                            event.preventDefault();
                            event.stopPropagation();
                        });
                    }
                });
            }
        },

        detachAddToCartListeners() {
        },

        addToCart(sku) {
            console.log("CartSidebar::addToCart sku: %s", sku);
            // todo add request to backend to add product to cart
        },
    },
}
</script>

<style lang="scss">
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
    -webkit-transition: visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
    -moz-transition: visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
    -o-transition: visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
    &.active {
        z-index: 140;
        opacity: 1;
        visibility: visible;
    }
}
#cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: -1;
    opacity: 0;
    background: #FFF;
    padding-left: 2px;
    right: 0;
    -webkit-transition: visibility 0.3s ease-in-out, opacity 0.5s ease-in-out;
    -moz-transition: visibility 0.3s ease-in-out, opacity 0.5s ease-in-out;
    -o-transition: visibility 0.3s ease-in-out, opacity 0.5s ease-in-out;
    &.active {
        z-index: 150;
        opacity: 1;
    }
    .inner-container {
        border-left: 1px solid #CCD3D3;
        height:100vh;
        padding: 20px 5px 20px 20px;
        display: flex;
        flex-direction: column;
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
        i.drumeo {
            color: #0b76db;
        }
        i.pianote {
            color: #ff383f;
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
            border-radius: 50px;
            outline: none;
            text-align: center;
            user-select: none;
            transition: all .3s;
            box-shadow: 0 0 0 rgba(0,0,0,0.35);
            display: inline-block;
            width: 100%;
            &.drumeo {
                background: #0b76db;
                &:hover {
                    background: #258ff4;
                }
            }
            &.pianote {
                background: #ff383f;
                &:hover {
                    background: #ff6b70;
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
        height: 250px;
    }
}
#csb-products-container {
    overflow: hidden;
    position: relative;

    .border-top {
        border-top: 1px solid #CCD3D3;
        margin-right: 15px;
    }

    .csb-products-inner {
        max-height: 100%;
        padding-right: 15px;
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
