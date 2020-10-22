<template>
    <section id="cart-sidebar" :class="{active: active}">
        <div class="inner-container">
            <div class="top clearfix">
                <h5 class="">Your cart</h5>
                <a
                    href="#"
                    class="float-right"
                    @click.stop.prevent="closeCartSidebar"
                ><i class="fal fa-times fa-3x"></i></a>
            </div>
            <div>
                <div><i class="fas fa-check-circle"></i><span>All of our drum lessons are backed by a 90-day guarantee.</span></div>
            </div>
            <div>products</div>
            <div>
                <div class="clearfix">
                    <div class="summary">subtotal</div>
                    <div class="float-right">$391</div><!-- todo: update -->
                </div>
                <div class="clearfix">
                    <div class="summary">shipping</div>
                    <div class="float-right">calculated at checkout</div>
                </div>
                <div class="clearfix">
                    <div class="summary">tax</div>
                    <div class="float-right">calculated at checkout</div>
                </div>
            </div>
            <div>
                <button>checkout</button>
            </div>
            <div>
                <div>customers also liked</div>
                <div>products</div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'CartSidebar',
    props: {
    },
    data() {
        return {
            active: false,
        };
    },
    mounted() {
        console.log('CartSidebar::mounted');

        const cartButtonElement = document.getElementById('nav-cart-button');

        cartButtonElement.addEventListener('click', this.openCartSidebar);

        cartButtonElement = null;
    },
    beforeDestroy() {
        const cartButtonElement = document.getElementById('nav-cart-button');

        cartButtonElement.removeEventListener('click', this.openCartSidebar);

        cartButtonElement = null;
    },
    methods: {
        openCartSidebar(event) {
            this.active = true;
            event.stopPropagation();
            event.preventDefault();
        },

        closeCartSidebar(event) {
            this.active = false;
            event.stopPropagation();
            event.preventDefault();
        },
    },
}
</script>

<style lang="scss">
#cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
}
</style>