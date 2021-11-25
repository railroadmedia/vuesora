<template>
    <div class="recommended-product-container">
        <div class="image-container">
            <a :href="this.item.sales_page_url"><img :src="item.thumbnail_url" class="item-thumbnail"></a>
        </div>
        <div class="recommended-product-title"><a :href="this.item.sales_page_url">{{ item.name }}</a></div>
        <div class="recommended-product-cta">
            <a :href="this.item.sales_page_url" @click.stop="cta($event)" :class="brand" class="csb-price">
                <div v-if="!item.cta" class="atc-label">
                    <span>Add To Cart</span>
<!--                    <product-price :item="item" :brand="brand"></product-price>-->
                </div>
                <div v-if="item.cta" class="cta-label">{{ item.cta }}</div>
            </a>
        </div>
    </div>
</template>

<script>
import ProductPrice from './_ProductPrice.vue';

export default {
    props: {
        item: Object,
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
    },
    components: {
        'product-price': ProductPrice,
    },
    computed: {
        $_ctaUrl: {
            get() {
                return this.item.add_directly_to_cart ?
                    '' : this.item.sales_page_url;
            },
        },
    },
    methods: {
        addToCart() {
            if (!this.loading) {
                this.$emit('addToCart', this.item);
            }
        },
        cta(event) {
            if (this.item.add_directly_to_cart) {
                if (event) {
                    event.preventDefault();
                }
                this.addToCart();
            }
        },
    },
}
</script>

<style lang="scss">
.recommended-product-container {
    height: 160px;
    width: 109px;
    border: 1px solid #CCD3D3;
    border-radius: 10px;
    ~ .recommended-product-container {
        margin-left: 10px;
    }
    .image-container a {
        height: 65px;
        margin-top: 7px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        text-decoration: none;
        img {
            object-fit: cover;
            object-position: center;
            max-height: 100%;
            width: auto;
            border-radius: 5px;
        }
    }
    .recommended-product-title {
        height: 45px;
        font-size: 10px;
        display: flex;
        align-items: center;
        text-align: center;
        padding: 0 10px;
        a {
            text-decoration: none;
            color: #0A0A0A;
        }
    }
    .recommended-product-cta {
        display: flex;
        flex-direction: row;
        justify-content: center;
        a {
            font-size: 10px;
            text-decoration: underline;
            color: #0b76db;
            .csb-product-price {
                text-decoration: underline;
            }
            .atc-label {
                min-height: 20px;
                display: flex;
                align-items: center;
                text-align: center;
            }
            .cta-label {
                padding: 0 15px;
                display: flex;
                align-items: center;
                text-align: center;
            }
        }
    }
}
</style>
