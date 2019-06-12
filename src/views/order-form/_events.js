export default {
    methods: {
        emitUpdateCartItem(payload){
            this.$emit('updateCartItem', payload);
        },

    }
}