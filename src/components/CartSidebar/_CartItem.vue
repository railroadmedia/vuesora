<template>
    <div class="cart-item-container">
        <div class="image-container">
            <img :src="item.thumbnail_url" class="item-thumbnail">
            <div class="item-logo" v-if="item.logo">
                <img :src="item.logo">
            </div>
        </div>
        <div class="csb-details">
            <div class="csb-title">{{ item.name }}</div>
            <div class="middle-container">
                <div class="csb-quantity" v-if="!item.is_digital && item.quantity">
                    <div class="csb-quantity-label">Qty:</div>
                    <div class="csb-quantity-control">
                        <div class="csb-quantity-dec"><i class="fal fa-minus"></i></div>
                        <div class="csb-quantity-input"><input type="text" v-model="item.quantity"></div>
                        <div class="csb-quantity-inc"><i class="fal fa-plus"></i></div>
                    </div>
                </div>
                <div class="csb-size" v-if="item.size">Size: {{ item.size }}</div>
                <div class="csb-price">${{ item.price_after_discounts }}</div>
            </div>
            <div class="item-remove"><a href="#">Remove</a></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
    },
}
</script>

<style lang="scss">
.cart-item-container {
    display: flex;
    flex-direction: row;
    font-size: 13px;
    padding-top: 10px;
    padding-bottom: 10px;
    ~ .cart-item-container {
        border-top: 1px solid #CCD3D3;
    }
    .csb-details {
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .csb-title {
            font-weight: 700;
        }
        .item-remove a {
            color: #8B929A;
            text-decoration: underline;
        }
        .middle-container {
            display: flex;
            flex-direction: row;
            .csb-quantity {
                display: flex;
                flex-direction: row;
                padding-right: 15px;
                .csb-quantity-control {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    padding-left: 5px;
                    .csb-quantity-dec {
                        width: 20px;
                        height: 20px;
                        color: #8B929A;
                        border-radius: 3px 0 0 3px;
                        border: 1px solid #CCD3D3;
                        border-right: none;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                    .csb-quantity-inc {
                        width: 20px;
                        height: 20px;
                        color: #8B929A;
                        border-radius: 0 3px 3px 0;
                        border: 1px solid #CCD3D3;
                        border-left: none;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                    .csb-quantity-input {
                        width: 20px;
                        height: 20px;
                        border: 1px solid #CCD3D3;
                        input {
                            max-width: 100%;
                            max-height: 100%;
                            font-size: 13px;
                            padding: 0;
                            border: none;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                        }
                    }
                }
            }
            .csb-size {
                padding-right: 15px;
            }
        }
    }
    .image-container {
        position: relative;
        width: 80px;
        height: 80px;
        .item-thumbnail {
            object-fit: cover;
            object-position: center;
            border-radius: 5px;
            max-width: 100%;
            height: auto;
        }
        .item-logo {
            position: absolute;
            bottom: 10px;
            padding-left: 5px;
            padding-right: 5px;
            img {
                max-width: 100%;
                height: auto;
            }
        }
    }
}
</style>