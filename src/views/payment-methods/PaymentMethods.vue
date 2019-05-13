<template>
    <div class="flex flex-row">
        <h1 class="heading">Payment Methods</h1>
    </div>
</template>

<script>
    import ThemeClasses from "../../mixins/ThemeClasses";

    const defaultPaymentMethod = () => ({
        id: 0,
        attributes: {},
        relationships: {
            method: { data: {}},
            billingAddress: { data: {}},
            userPaymentMethod: { data: {}},
        }
    });

    export default {
        mixins: [ThemeClasses],
        name: 'payment-methods',
        props: {
            paymentMethods: {
                type: Array,
                default: () => []
            },


        },
        data(){
            return {
                editingPaymentMethod: defaultPaymentMethod(),
            }
        },

    }
</script>