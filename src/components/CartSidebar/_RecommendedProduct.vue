<template>
    <div class="recommended-product-container">
        <div class="image-container">
            <img :src="item.thumbnail_url" class="item-thumbnail">
        </div>
        <div class="recommended-product-title">{{ item.name }}</div>
        <div class="recommended-product-atc">
            <a href="#" @click.stop.prevent="addToCart" :class="brand">Add To Cart: ${{ item.price_after_discounts }}</a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
        brand: {
            type: String,
            default: () => 'drumeo',
        },
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {
        addToCart() {
        },
    },
}
</script>

<style lang="scss">
.recommended-product-container {
    width: 109px;
    height: 130px;
    border: 1px solid #CCD3D3;
    ~ .recommended-product-container {
        margin-left: 10px;
    }
    .image-container {
        height: 65px;
        padding: 5px 0;
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
        font-size: 10px;
        display: flex;
        text-align: center;
        padding: 0 15px 5px;
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
        }
    }
}
</style>
