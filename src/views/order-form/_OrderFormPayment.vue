<template>
    <div class="flex flex-column mv-2">
        <h3 class="heading color-blue">Payment Details</h3>
        <div class="flex flex-column bg-white shadow corners-5 mt-2 pa-3">
            <div class="flex md-6">
                <a
                    class="btn submit-order text-white"
                    v-on:click.stop.prevent="startValidation">Buy Now</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'order-form-payment',
        props: {
        },
        methods: {
            startValidation() {
                this.$root.$emit('startValidation');
            }
        }
    }
</script>
<style lang="scss">
    .submit-order {
        background-color: forestgreen;

        &:hover {
            background-color: limegreen;
        }
    }
</style>
