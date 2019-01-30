<template>
    <div class="flex flex-row flex-wrap ph-2">

        <payment-method
            v-for="method in paymentMethods"
            :key="'activeMethod' + method.id"
            :paymentMethod="method"
            :showDelete="showDelete"
            @editMethod="setEditMethod"
            @showLoading="showLoading"
            @hideLoading="hideLoading"
            @refreshPaymentMethods="refreshPaymentMethods"></payment-method>

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
                :countries="countries"
                @showLoading="showLoading"
                @hideLoading="hideLoading"
                @closeModal="closeModal"
                @refreshPaymentMethods="refreshPaymentMethods">
            </payment-method-modal>
            <loading-dialog :show="loading"></loading-dialog>
        </div>
    </div>
</template>
<script>
    import UserService from '../../../assets/js/services/user';
    import PaymentMethod from './PaymentMethod.vue';
    import PaymentMethodModal from './PaymentMethodModal.vue';
    import LoadingDialog from '../../../components/LoadingDialog.vue';
    import Toasts from '../../../assets/js/classes/toasts';
    import Noty from 'noty';

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
            },
            countries: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            success: {
                type: String,
                default: ''
            },
            paypalPaymentMethod: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                modalOpened: false,
                loading: false,
                editMethod: undefined,
                paymentMethods: undefined
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
            },
            refreshPaymentMethods() {

                UserService
                    .getPaymentMethods()
                    .then((response) => {
                        if (response && response.paymentMethods) {
                            this.paymentMethods = response.paymentMethods;
                        }
                    });
            },
            setDefaultPaymentMethod(paypalPaymentMethodId) {
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Would you like to set the newly added paypal payment method as default payment method?',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        // Confirm Button
                        Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                            UserService
                                .setDefaultPaymentMethod(paypalPaymentMethodId)
                                .then(this.refreshPaymentMethods);

                            notification.close();
                        }),
                        // Cancel Button
                        Noty.button('<span class="bg-dark inverted text-dark short">NO</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            }
        },
        mounted() {
            this.paymentMethods = this.activeMethods;
            this.success && Toasts.success(this.success);
            this.paypalPaymentMethod > 0 &&
                this.setDefaultPaymentMethod(this.paypalPaymentMethod);
        }
    }
</script>
<style lang="scss">
</style>
