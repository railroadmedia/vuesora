<template>
    <div class="flex flex-column mv-2">
        <div class="flex flex-row align-v-center pb-2">
            <div class="flex flex-grow flex-row align-v-center">
                <h3 class="heading color-blue">Payment Plan</h3>
            </div>
            <div class="flex flex-auto">
                <h4 class="body text-dark">All fields are mandatory.</h4>
            </div>
        </div>
        <div class="flex flex-row bg-white shadow corners-5 pa-3">
            <div class="flex flex-row pv-1">
                <div class="flex flex-column ph-1 md-6 sm-12">
                    <select
                        class="order-form-input no-label"
                        v-model.lazy="$_numberOfPayaments">

                        <option
                            v-for="item in paymentPlanOptions"
                            :key="item.value"
                            :value="item.value">{{ item.label }}</option>
                    </select>
                </div>
                <div class="flex flex-column ph-1">
                    <div class="flex flex-column">
                    <h4 class="body text-dark">* Payment plans are billed monthly.</h4>
                    <h4 class="body text-dark">* Shipping is charged on the first payment.</h4>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Api from '../../assets/js/services/order-form.js';

    export default {
        data() {
            return {
                selectedNumberOfPayaments: 1,
            }
        },
        computed: {
            $_numberOfPayaments: {
                get() {
                    return this.selectedNumberOfPayaments;
                },
                set(value) {
                    this.selectedNumberOfPayaments = value;
                    this.updateNumberOfPayments(value);
                }
            }
        },
        props: {
            numberOfPayments: {
                type: Number,
                default: 1
            },
            paymentPlanOptions: {
                type: Array,
                default: () => []
            },
        },
        watch: {
            numberOfPayments: function(value) {
                this.selectedNumberOfPayaments = value;
            }
        },
        methods: {
            updateNumberOfPayments(value) {
                Api
                    .updateNumberOfPayments(value)
                    .then(response => {
                        if (response.meta && response.meta.cart) {
                            this.$emit(
                                'updateCartData',
                                response.meta.cart
                            );
                        }
                    })
            }
        },
        mounted() {
            this.selectedNumberOfPayaments = this.numberOfPayments || 1;
        }
    }
</script>
