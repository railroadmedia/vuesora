<template>
    <div class="cart-item-container">
        <div class="image-container">
            <img :src="item.thumbnail" class="item-thumbnail">
            <div class="item-logo" v-if="item.logo">
                <img :src="item.logo">
            </div>
        </div>
        <div class="details">
            <div class="title">{{ item.title }}</div>
            <div class="price">${{ item.price }}</div>
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
