<template>
    <div>
        <div @click="openClose">
            <slot name="activator"></slot>
        </div>

        <div class="modal" :class="{'active': active === true}">
            <div class="flex flex-column bg-white shadow">
                <h1 class="heading">This is a Modal</h1>
            </div>
        </div>
        <!--<div class="modal-overlay"-->
             <!--:class="{'active': active === true}"-->
             <!--@click="openClose"></div>-->
    </div>
</template>
<script>
    export default {
        mixins: [],
        name: 'va-modal',
        data(){
            return {
                active: false
            }
        },
        methods: {
            openClose(){
                this.active = !this.active;
                this.$nextTick(() => {
                    this.$forceUpdate();
                });

                this.$emit('change', {
                    active: this.active
                })
            }
        }
    }
</script>