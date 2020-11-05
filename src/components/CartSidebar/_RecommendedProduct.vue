<template>
    <div class="recommended-product-container">
        <div class="image-container">
            <img :src="item.thumbnail_url" class="item-thumbnail">
        </div>
        <div class="recommended-product-title">{{ item.name }}</div>
        <div class="recommended-product-atc">
            <a href="#" @click.stop.prevent="addToCart" :class="brand" class="csb-price">
                <span>Add To Cart:</span>
                <product-price :item="item" :brand="brand"></product-price>
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
    },
    components: {
        'product-price': ProductPrice,
    },
    methods: {
        addToCart() {
            this.$emit('addToCart', this.item);
        },
    },
}
</script>

<style lang="scss">
.recommended-product-container {
    height: 150px;
    width: 109px;
    border: 1px solid #CCD3D3;
    ~ .recommended-product-container {
        margin-left: 10px;
    }
    .image-container {
        height: 65px;
        margin-top: 7px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        img {
            object-fit: cover;
            object-position: center;
            max-height: 100%;
            width: auto;
        }
    }
    .recommended-product-title {
        height: 50px;
        font-size: 10px;
        display: flex;
        align-items: center;
        text-align: center;
        padding: 5px 15px 5px;
    }
    .recommended-product-atc {
        display: flex;
        flex-direction: row;
        justify-content: center;
        a {
            font-size: 10px;
            text-decoration: underline;
            .drumeo {
                color: #0b76db;
            }
            .pianote {
                color: #ff383f;
            }
            .csb-product-price {
                text-decoration: underline;
            }
        }
    }
}
</style>
