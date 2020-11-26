<template>
    <div class="csb-product-price">
        <span class="csb-original-price" v-if="$_originalPrice">${{ parsePrice($_originalPrice) }}</span>
        <span>${{ parsePrice(item.price_after_discounts) }}</span>
        <span v-if="$_isFree">-</span>
        <span class="csb-free-bonus" :class="brand" v-if="$_isFree">FREE</span>
        <span v-if="$_recurringPeriod">/ {{ $_recurringPeriod }}</span>
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
    computed: {
        $_originalPrice: {
            get() {
                return this.item.price_before_discounts != this.item.price_after_discounts ?
                    this.item.price_before_discounts : null;
            },
        },
        $_isFree: {
            get() {
                return (
                    this.item.price_before_discounts != this.item.price_after_discounts
                    && this.item.price_after_discounts == 0
                );
            },
        },
        $_recurringPeriod: {
            get() {
                return this.item.subscription_interval_type ?
                    this.recurringPeriod() : null;
            },
        },
    },
    methods: {
        recurringPeriod() {
            let periods = {month: 'mo', year: 'yr'};
            let productInterval = periods[this.item.subscription_interval_type];
            let productIntervalCount = this.item.subscription_interval_count && this.item.subscription_interval_count != 1 ?
                this.item.subscription_interval_count.toString() : '';

            return productIntervalCount + productInterval;
        },

        parsePrice(price) {
            return (price || 0).toFixed(2);
        },
    }
};
</script>

<style lang="scss">
.csb-product-price {
    display: inline-block;
    .csb-original-price {
        text-decoration: line-through;
    }
    .csb-free-bonus {
        &.drumeo {
            color: #0b76db;
        }
        &.pianote {
            color: #ff383f;
        }
    }
}
</style>