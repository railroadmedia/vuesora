<template>
    <div class="flex flex-row flex-wrap ph-2">

        <payment-method
            v-for="activeMethod in activeMethods"
            :key="'activeMethod' + activeMethod.id"
            :paymentMethod="activeMethod"
            :showDelete="showDelete"
            @editMethod="setEditMethod"></payment-method>

        <div class="flex flex-column xs-12 sm-12 md-6 cc-col ph-2 mb-3">
            <div class="credit-card-box">
                <div class="card flex-center ba-dark-2 dashed corners-5 pointer"
                    data-open-modal="paymentModalNew" v-on:click.stop.prevent="openModal">
                    <h3 class="title text-dark uppercase dense">
                        <i class="fas fa-plus mr-1"></i>
                        Add Payment Method
                    </h3>
                </div>
            </div>
            <payment-method-modal
                :brand="brand"
                :stripePublishableKey="stripePublishableKey"
                :modalOpened="modalOpened"
                :currentUser="currentUser"
                :editMethod="editMethod"
                @showLoading="showLoading"
                @hideLoading="hideLoading"
                @closeModal="closeModal">
            </payment-method-modal>
            <loading-dialog :show="loading"></loading-dialog>
        </div>
    </div>
</template>
<script>
    import PaymentMethod from './PaymentMethod.vue';
    import PaymentMethodModal from './PaymentMethodModal.vue';
    import LoadingDialog from '../../../components/LoadingDialog.vue';

    export default {
        name: 'payments',
        components: {
            'payment-method': PaymentMethod,
            'payment-method-modal': PaymentMethodModal,
            'loading-dialog': LoadingDialog
        },
        props: {
            brand: {
                type: String,
                default: 'recordeo'
            },
            stripePublishableKey: {
                type: String,
                default: ''
            },
            currentUser: {
                type: Object,
                default: () => {
                    return {
                        id: 0,
                        email: ''
                    }
                }
            },
            activeMethods: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                modalOpened: false,
                loading: false,
                editMethod: undefined
            }
        },
        computed: {
            showDelete() {
                return this.activeMethods.length > 0;
            }
        },
        methods: {
            openModal() {
                this.modalOpened = true;
            },
            closeModal() {
                this.modalOpened = false;
                this.editMethod = undefined;
            },
            showLoading() {
                this.loading = true;
            },
            hideLoading() {
                this.loading = false;
            },
            setEditMethod(eventData) {

                this.editMethod = eventData;
                this.openModal();
            }
        }
    }
</script>
<style lang="scss">
</style>
