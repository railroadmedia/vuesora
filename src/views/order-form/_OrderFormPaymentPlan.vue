<template>
    <div class="flex flex-column mv-2">
        <div class="flex flex-row align-v-center mb-2">
            <h3 class="heading color-blue">Payment Plan</h3>
        </div>
        <div class="flex flex-row flex-wrap bg-white shadow corners-5 pt-2 ph-2 align-v-center">
            <div class="flex flex-column ph-1 xs-12 sm-6 mb-2">
                <div class="form-group">
                    <select id="paymentPlans"
                            class="order-form-input"
                            v-model.lazy="$_numberOfPayments">

                        <option v-for="item in paymentPlanOptions"
                                :key="item.value"
                                :value="item.value">{{ item.label }}</option>
                    </select>

                    <label for="paymentPlans" :class="brand">
                        Payment Plan
                    </label>
                </div>

            </div>
            <div class="flex flex-column xs-12 sm-6 ph-1 mb-2">
                <h4 class="tiny text-grey-3">* Payment plans are billed monthly.</h4>
                <h4 class="tiny text-grey-3">* Shipping is charged on the first payment.</h4>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/ecommerce.js';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'order-form-payment-plan',
        props: {
            brand: {
                type: String,
            },

            numberOfPayments: {
                type: Number,
                default: 1
            },

            paymentPlanOptions: {
                type: Array,
                default: () => []
            },
        },
        computed: {
            $_numberOfPayments: {
                get() {
                    return this.numberOfPayments;
                },
                set(value) {
                    this.updateNumberOfPayments(value);
                }
            }
        },
        methods: {
            updateNumberOfPayments(value) {
                Api.updateNumberOfPayments(value)
                    .then(response => {
                        if (response) {
                            this.$emit('updateCartData', response.data);
                        }
                    })
            }
        },
    }
</script>
