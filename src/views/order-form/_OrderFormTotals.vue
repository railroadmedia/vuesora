<template>
    <div class="flex flex-row mb-2">
        <div class="flex flex-column corners-10 ba-black-1 pa-2">
            <div class="flex flex-row mb-1">
                <p class="flex flex-column body text-left">
                    Subtotal
                </p>
                <p
                   v-if="subTotalBeforeDiscounts !== subTotalAfterDiscounts"
                   class="flex flex-column body text-right"
                >
                    <span><s style="font-weight: normal; color: #666;">${{ parseTotal(subTotalBeforeDiscounts) }}</s><span class="font-bold">&nbsp;&nbsp; ${{ parseTotal(subTotalAfterDiscounts) }}</span></span>
                </p>
                <p
                   v-if="subTotalBeforeDiscounts === subTotalAfterDiscounts"
                   class="flex flex-column body text-right"
                >
                    ${{ parseTotal(subTotalAfterDiscounts) }}
                </p>
            </div>

            <div class="flex flex-row mb-1">
                <p class="flex flex-column body text-left">
                    Shipping
                </p>
                <p class="flex flex-column body text-right">
                    ${{ parseTotal(totals.shipping) }}
                </p>
            </div>

            <div
                v-if="sumOfDiscounts > 0"
                class="flex flex-row mb-1"
            >
                <p class="flex flex-column body text-left">
                    My Savings
                </p>
                <p class="flex flex-column body text-right text-error">
                    -${{ sumOfDiscounts.toFixed(2) }}
                </p>
            </div>

            <div class="flex flex-row mb-1">
                <p class="flex flex-column body text-left">
                    Tax
                </p>
                <p class="flex flex-column body text-right">
                    ${{ parseTotal(totals.tax) }}
                </p>
            </div>

            <div class="flex flex-row mb-1 bt-grey-1-1 pt-1">
                <p class="flex flex-column title font-bold text-left">
                    Total
                </p>
                <p class="flex flex-column title font-bold text-right">
                    USD ${{ parseTotal(totals.due) }}
                    <br>
                    <span class="x-tiny font-regular text-grey-3">
                        Due Today
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'OrderFormTotals',
    mixins: [ThemeClasses],
    props: {
        totals: {
            type: Object,
            default: () => ({
                subtotal: 0,
                due: 0,
                shipping: 0,
                tax: 0,
            }),
        },

        discounts: {
            type: Array,
            default: () => [],
        },

        cartData: {
            type: Object,
            default: () => {},
        },
    },

    computed: {

        sumOfDiscounts() {
            return this.subTotalBeforeDiscounts - this.subTotalAfterDiscounts;
        },

        subTotalBeforeDiscounts() {
            let subTotalBeforeDiscounts = 0;

            if (this.cartData.items) {
                this.cartData.items.forEach((item) => {
                    subTotalBeforeDiscounts += item.price_before_discounts;
                });
            }

            if (this.cartData.bonuses) {
                this.cartData.bonuses.forEach((item) => {
                    subTotalBeforeDiscounts += item.price_before_discounts;
                });
            }

            return subTotalBeforeDiscounts;
        },

        subTotalAfterDiscounts() {
            let subTotalAfterDiscounts = 0;

            if (this.cartData.items) {
                this.cartData.items.forEach((item) => {
                    subTotalAfterDiscounts += item.price_after_discounts;
                });
            }

            if (this.cartData.bonuses) {
                this.cartData.bonuses.forEach((item) => {
                    subTotalAfterDiscounts += item.price_after_discounts;
                });
            }

            return subTotalAfterDiscounts;
        },

        totalDue() {
            return this.totals.due.toFixed(2);
        },

        totalShipping() {
            return this.totals.shipping.toFixed(2);
        },

        totalTax() {
            return this.totals.tax.toFixed(2);
        },
    },

    methods: {
        parseTotal(total) {
            return (total || 0).toFixed(2);
        },
    },
};
</script>
