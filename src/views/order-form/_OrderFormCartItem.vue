<template>
    <div
        class="flex flex-row pa-2 align-v-top">
        <div class="flex md-2 ph-2">
            <img v-bind:src="item.attributes.options.thumbnail_url" class="rounded" alt="product image">
        </div>
        <div class="flex flex-column grow ph-2">
            <div class="flex">
                <h3 class="subheading">{{ item.attributes.name }}</h3>
            </div>
            <div class="flex">
                <h4 class="subtitle">{{ item.attributes.description }}</h4>
            </div>
            <div class="flex flex-row align-h-left pt-2">
                <div class="flex">
                    <h4 class="body">Quantity</h4>
                </div>
                <div class="flex quantity-input ph-1">
                    <input
                        type="text"
                        v-model="quantity">
                </div>
                <!-- todo: remove css input rules, then padding left class -->
                <div class="flex grow pl-3">
                    <a class="body">X</a>
                </div>
            </div>
        </div>
        <div class="flex flex-column flex-auto ph-3 pt-1 align-h-right">
            <div class="flex" v-if="initial(item)">
                <h3 class="title text-dark font-strike">${{ initial(item) }}</h3>
            </div>
            <div class="flex">
                <!-- todo: check prices when adding multiple items -->
                <h3 class="heading">${{ item.attributes.totalPrice }}</h3>
            </div>
            <div class="flex" v-if="item.attributes.subscriptionIntervalType">
                <h3 class="tiny">per {{ item.attributes.subscriptionIntervalType }}</h3>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'order-form-cart-item',
        props: {
            item: {
                type: Object,
                default: () => {
                    attributes: {
                        name: '';
                        description: '';
                        quantity: '';
                        totalPrice: '';
                        subscriptionIntervalType: '';
                        options: {
                            thumbnail_url: null;
                        };
                    }
                }
            },
        },
        computed: {
            quantity: {
                get() {
                    return this.item.attributes.quantity;
                },
                set(val) {
                    // make API call to update quantity
                    // parent OrderForm should be aware of request result
                    // in case it needs to detach current element, when quantity is set to 0 - remove
                }
            }
        },
        methods: {
            initial(item) {
                // todo - check logic with discounted product to show original price
                return item.attributes.discounted ? item.attributes.price : false;
            },
        },
        mounted() {
            console.log('item: %s', JSON.stringify(this.item));
            console.log('quantity: %s', JSON.stringify(this.quantity));
        }
    }
</script>
<style lang="scss">
    .quantity-input {
        max-width: 20px;
        max-height: 20px;
    }
</style>