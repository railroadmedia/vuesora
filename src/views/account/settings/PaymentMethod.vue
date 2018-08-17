<template>
    <div id="{{ paymentMethod.id }}" class="flex flex-column xs-12 sm-12 md-6 cc-col ph-2 mb-3">
        <div class="credit-card-box corners-5" :class="type">
            <div class="card">
                <div class="flex flex-column pa-3">
                    <div class="flex flex-row text-white">
                        <div class="flex flex-column">
                            <h6 class="tiny uppercase font-bold">
                                {{ paymentMethod.type }}
                            </h6>
                        </div>

                        <div class="flex flex-column flex-auto">
                            <i class="fab cc-icon" :class="'fa-cc-' + type"></i>
                        </div>
                    </div>

                    <div class="flex flex-row text-white grow mb-1 align-center" v-if="paymentMethod.type != 'paypal'">
                        <div class="flex flex-column">
                            <h1 class="heading text-center">
                                &#8226;&#8226;&#8226;&#8226;
                                &#8226;&#8226;&#8226;&#8226;
                                &#8226;&#8226;&#8226;&#8226;
                                {{ paymentMethod.lastFourDigits }}
                            </h1>
                        </div>
                    </div>

                    <div class="flex flex-row text-white align-v-center" v-if="paymentMethod.type != 'paypal'">
                        <div class="flex flex-column">
                            <h6 class="tiny uppercase dense font-bold">
                                {{ paymentMethod.nameOnCard }}
                            </h6>
                        </div>

                        <div class="flex flex-column flex-auto">
                            <p class="tiny uppercase dense">
                                expires
                                <span class="title ml-1 dense">
                                    {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear.substr(-2) }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-row grow align-center text-white" v-if="paymentMethod.type == 'paypal'">
                        <h1 class="subheading dense grow text-center">
                            {{ paymentMethod.email }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-row mt-2">
            <div class="flex flex-column">
                <div class="flex flex-row text-field flex-auto mb-1">
                    <div class="flex flex-column key">
                        <p class="body font-bold">Country</p>
                    </div>
                    <div class="flex flex-column value grow">
                        <p class="body">{{ paymentMethod.country }}</p>
                    </div>
                </div>
                <div class="flex flex-row text-field flex-auto mb-1">
                    <div class="flex flex-column key">
                        <p class="body font-bold">Region</p>
                    </div>
                    <div class="flex flex-column value grow">
                        <p class="body">{{ paymentMethod.region }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-row">
            <div class="flex flex-column" :class="{'mr-1': showDelete}" v-if="paymentMethod.type != 'paypal'">
                <button class="btn edit-payment" v-on:click.stop.prevent="openModal">
                    <span class="bg-black inverted corners-3 short">
                        Edit
                    </span>
                </button>
            </div>
            <div class="flex flex-column" v-if="showDelete" :class="{'ml-1': paymentMethod.type != 'paypal'}">
                <button class="btn delete-payment" v-on:click.stop.prevent="showConfirmation">
                    <span class="bg-error inverted text-error corners-3 short">
                        Delete
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import Requests from '../../../assets/js/classes/requests';
    import Toasts from '../../../assets/js/classes/toasts';
    import Noty from 'noty';

    export default {
        name: 'payment-method',
        props: {
            paymentMethod: {
                type: Object,
                default: {
                    id: 0,
                    type: '',
                    lastFourDigits: '',
                    nameOnCard: '',
                    expiryMonth: '',
                    expiryYear: '',
                    country: '',
                    region: '',
                    email: ''
                }
            },
            showDelete: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            type() {
                return this.paymentMethod.type == 'american express' ?
                    'amex' : this.paymentMethod.type;
            }
        },
        methods: {
            openModal() {
                this.$emit('editMethod', this.paymentMethod);
            },
            showConfirmation() {
                const notification = new Noty({
                    layout: 'center',
                    modal: true,
                    text: 'Do you really want to delete this payment method? <br><br><span class="tiny text-dark font-italic">This cannot be undone.</span>',
                    theme: 'bootstrap-v4',
                    closeWith: [],
                    buttons: [
                        // Confirm Button
                        Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                            Requests
                                .deletePaymentMethod(this.paymentMethod.id)
                                .then(this.handleResponse);

                            notification.close();
                        }),
                        // Cancel Button
                        Noty.button('<span class="bg-dark inverted text-dark short">NO</span>', 'btn', () => {
                            notification.close();
                        })
                    ]
                }).show();
            },
            handleResponse(response) {
                if (response.status && response.status == 204) {

                    let mesage = 'Payment Method has been deleted.';
                    Toasts.success(mesage);

                    this.$emit('hideLoading', {});
                    this.$emit('refreshPaymentMethods', {});

                } else {
                    Toasts.errorWarning();
                }
            }
        }
    }
</script>
<style lang="scss">
</style>