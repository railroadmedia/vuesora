<template>
    <div id="cart-sidebar-overlay" @click.stop.prevent="closeCartSidebar" :class="{active: active}">
        <section id="cart-sidebar">
            <div class="inner-container">
                <div class="top flex-item">
                    <h5 class="">Your cart</h5>
                    <a
                        href="#"
                        class="close"
                        @click.stop.prevent="closeCartSidebar"
                    ><i class="fal fa-times fa-2x"></i></a>
                </div>
                <div class="guarantee flex-item">
                    <i class="fas fa-check-circle" :class="brand"></i>
                    <span>All of our drum lessons are backed by a 90-day guarantee.</span>
                </div>
                <div id="csb-products-container">
                    <div class="border-top"></div>
                    <div class="csb-products-inner" data-simplebar data-simplebar-auto-hide="false">
                        <simplebar>
                            <cart-item
                                v-for="item in products"
                                :key="item.id"
                                :item="item"
                            ></cart-item>
                        </simplebar>
                    </div>
                    <div class="border-bottom"></div>
                </div>
                <div class="summary-container flex-item">
                    <div class="clearfix">
                        <div class="summary">Subtotal</div>
                        <div class="float-right due">$391</div><!-- todo: update -->
                    </div>
                    <div class="clearfix">
                        <div class="summary">Shipping</div>
                        <div class="float-right deferred">Calculated at checkout</div>
                    </div>
                    <div class="clearfix">
                        <div class="summary">Tax</div>
                        <div class="float-right deferred">Calculated at checkout</div>
                    </div>
                </div>
                <div class="checkout flex-item">
                    <a href="#" :class="brand"><i class="fas fa-lock"></i>checkout</a>
                </div>
                <div class="recommended-title flex-item">customers also liked</div>
                <div class="flex-item">products</div>
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
    },
    data() {
        return {
            active: false,
            products: [
                {
                    id: 1,
                    title: 'Rock Drumming Masterclass',
                    price: 197,
                    isDigital: true,
                    thumbnail: 'https://d1923uyy6spedc.cloudfront.net/rdm-card-comp.jpg',
                    logo: 'https://dpwjbsxqtam5n.cloudfront.net/rock-drumming-masterclass/logo-white.png',
                },
                {
                    id: 2,
                    title: 'Drum Technique Made Easy',
                    price: 197,
                    isDigital: true,
                    thumbnail: 'https://dz5i3s4prcfun.cloudfront.net/drum-technique-made-easy/dtme-pack-card-thumb-w-o-logo.png',
                    logo: 'https://dpwjbsxqtam5n.cloudfront.net/drum-technique-made-easy/logo-white.png',
                },
                {
                    id: 3,
                    title: 'Successful Drumming',
                    price: 197,
                    isDigital: true,
                    thumbnail: 'https://dpwjbsxqtam5n.cloudfront.net/drum-shop/card-thumbs/successful-drumming.jpg',
                    logo: 'https://dpwjbsxqtam5n.cloudfront.net/drum-shop/card-thumbs/successful-drumming.png',
                },
                {
                    id: 4,
                    title: 'Drumeo Gab T-Shirt',
                    price: 19,
                    isDigital: false,
                    quantity: 1,
                    size: 'L',
                    thumbnail: 'https://dpwjbsxqtam5n.cloudfront.net/drum-shop/card-thumbs/drumeo-gab-shirt.jpg',
                },
                {
                    id: 5,
                    title: "The Drummer's Toolbox",
                    price: 197,
                    isDigital: true,
                    thumbnail: 'https://dpwjbsxqtam5n.cloudfront.net/books/drummers-toolbox/sales/cart-image.png',
                },
            ],
        };
    },
    mounted() {
        let cartButtonElement = document.getElementById('nav-cart-button');

        if (cartButtonElement) {
            cartButtonElement.addEventListener('click', this.openCartSidebar);
            cartButtonElement = null;
        }

    },
    beforeDestroy() {
        let cartButtonElement = document.getElementById('nav-cart-button');

        if (cartButtonElement) {
            cartButtonElement.removeEventListener('click', this.openCartSidebar);
            cartButtonElement = null;
        }
    },
    methods: {
        openCartSidebar(event) {
            this.active = true;
            event.stopPropagation();
            event.preventDefault();
        },

        closeCartSidebar(event) {
            this.active = false;
            event.stopPropagation();
            event.preventDefault();
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
        #cart-sidebar {
            z-index: 150;
            opacity: 1;
        }
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
    .guarantee {
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
    }
    .summary {
        font-size: 14px;
        display: inline-block;
    }
    .due {
        font-weight: 700;
        font-size: 14px;
    }
    .deferred {
        font-size: 14px;
        font-style: italic;
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
}
#csb-products-container {
}
</style>
