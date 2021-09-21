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
                    {{ taxLabel }}
                </p>
            </div>

            <div class="flex flex-row mb-1" v-if="totals.shipping_taxes > 0 && cartData.number_of_payments > 1">
                <p class="flex flex-column body text-left">
                    Shipping Tax
                </p>
                <p class="flex flex-column body text-right">
                    {{ totals.shipping_taxes }}
                </p>
            </div>

            <div class="flex flex-row mb-1" v-if="financeLabel">
                <p class="flex flex-column body text-left">
                    Finance Charges
                </p>
                <p class="flex flex-column body text-right">
                    {{ financeLabel }}
                </p>
            </div>

            <div class="flex flex-row mb-1" v-if="totals.order_total">
                <p class="flex flex-column body text-left">
                    Total
                </p>
                <p class="flex flex-column body text-right">
                    USD ${{ totals.order_total }}
                </p>
            </div>

            <div class="flex flex-row mb-1 bt-grey-1-1 pt-1">
                <p class="flex flex-column title font-bold text-left">
                    Due Today
                </p>
                <p class="flex flex-column title font-bold text-right">
                    USD ${{ parseTotal(totals.due) }}
                    <template v-if="totals.shipping > 0">
                        <br>
                        <span class="x-tiny font-regular text-grey-3">
                            Shipping included
                        </span>
                    </template>
                </p>
            </div>

            <template v-if="totals.monthly_payments && totals.monthly_payments.length">
                <div
                    class="flex flex-row mb-1"
                    v-for="(monthlyPayment, i) in totals.monthly_payments"
                    :class="{'bt-grey-1-1 pt-1': i === 0}"
                >
                    <p class="flex flex-column body text-left">
                        {{ monthlyPayment.month }}
                    </p>
                    <p class="flex flex-column body text-right">
                        USD ${{ parseTotal(monthlyPayment.payment) }}
                    </p>
                </div>
            </template>
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

        taxLabel() {
            let label;

            if (this.totals.tax_per_payment && this.cartData.number_of_payments > 1) {
                label = `${this.cartData.number_of_payments} x $${this.parseTotal(this.totals.tax_per_payment)}`;
            } else {
                label = `$${this.parseTotal(this.totals.tax)}`;
            }

            return label;
        },

        financeLabel() {
            let label;

            if (this.totals.financing_cost_per_payment && this.cartData.number_of_payments > 1) {
                label = `${this.cartData.number_of_payments} x $${this.parseTotal(this.totals.financing_cost_per_payment)}`;
            }

            return label;
        },
    },

    methods: {
        parseTotal(total) {
            return (total || 0).toFixed(2);
        },
    },
};
</script>
