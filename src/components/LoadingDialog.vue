<template>
    <div id="loadingDialog" :class="{ 'hide': !show }">
        <div class="dialog-container flex flex-column pa-3 align-center bg-white corners-3 shadow">
            <i class="fas fa-spinner fa-spin text-recordeo"></i>

            <h2 class="tiny font-italic text-recordeo">Please Wait</h2>
            <h2 class="title text-black">Processing Your Request</h2>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'loading-dialog',
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                inputs: []
            }
        },
        methods: {
            tearUp() {
                Array.from(this.inputs).forEach(input => {
                    input.classList.add('disabled-button');
                });
            },
            tearDown() {
                Array.from(this.inputs).forEach(input => {
                    input.classList.remove('disabled-button');
                });
            }
        },
        mounted() {
            this.inputs = document.querySelectorAll('button');

            if (this.show) {
                this.tearUp();
            }
        },
        destroyed() {
            this.tearDown();
            this.inputs = [];
        },
        watch: {
            show: function(newVal, oldVal) {
                if (newVal) {
                    this.tearUp();
                } else {
                    this.tearDown();
                }
            }
        }
    }
</script
<style>
    #loadingDialog {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 102;
    }

    #loadingDialog .dialog-container {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 320px;
        max-width: 95%;
        transform: translate(-50%, -50%);
        z-index: 103;
    }

    #loadingDialog i {
        font-size: 72px;
    }
</style>
