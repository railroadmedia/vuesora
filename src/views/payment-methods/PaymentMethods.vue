<template>
    <div class="flex flex-column grow">
        <div class="flex flex-row mb-3 pt-3">
            <h4 class="subheading">Payment Methods</h4>
        </div>

        <ul class="body list-style-none mb-3">
            <li class="flex flex-row align-v-center">
                <div class="flex flex-column default-col text-center hide-xs-only">
                    <h6 class="tiny font-bold dense">Default</h6>
                </div>

                <div class="flex flex-column">
                    <h6 class="tiny font-bold dense">Info</h6>
                </div>

                <div class="flex flex-column expiry-col text-center">
                    <h6 class="tiny font-bold dense">Expires On</h6>
                </div>

                <div class="flex flex-column actions-col text-center">
                    <h6 class="tiny font-bold dense">Actions</h6>
                </div>
            </li>
            <li v-for="(paymentMethod, i) in paymentMethodsData.data"
                class="flex flex-row align-v-center">

                <div class="flex flex-column default-col text-center body hide-xs-only">
                    <i v-if="isPrimaryPaymentMethod(paymentMethod)"
                       class="fas fa-check"></i>
                </div>

                <div v-if="paymentMethod.attributes.method_type === 'credit_card'"
                     class="flex flex-column body">
                    {{ getRelatedAttributesByTypeAndId(
                        paymentMethod.relationships.method.data
                    ).attributes.company_name || 'N/A' }}
                    -
                    {{ getRelatedAttributesByTypeAndId(
                        paymentMethod.relationships.method.data
                    ).attributes.last_four_digits || 'N/A' }}
                </div>

                <div v-if="paymentMethod.attributes.method_type === 'paypal'"
                     class="flex flex-column body">
                    {{ getRelatedAttributesByTypeAndId(
                        paymentMethod.relationships.method.data
                    ).attributes.payment_gateway_name || 'N/A' }}
                </div>

                <div class="flex flex-column body expiry-col text-center">
                    {{ getExpirationDate(paymentMethod) }}
                </div>

                <div class="flex flex-column actions-col text-center">
                    <div class="flex flex-row">
                        <button class="btn short collapse-square"
                                title="Delete Payment Method">
                            <span class="text-error flat">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>

                        <button class="btn short collapse-square"
                                title="Set As Default"
                                :disabled="isPrimaryPaymentMethod(paymentMethod)">
                            <span class="text-success flat">
                                <i class="fas fa-check"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </li>
        </ul>

        <div class="flex flex-row flex-wrap align-v-center">
            <div class="flex flex-column xs-12 sm-4">
                <button class="btn">
                    <span class="text-white"
                          :class="themeBgClass">
                        <i class="fas fa-plus mr-1"></i> New Payment Method
                    </span>
                </button>
            </div>
        </div>

        <order-form-payment
                ref="paymentForm"
                :themeColor="themeColor"
                :brand="brand"
                :paymentDetails="editingPaymentMethod"
                :stripePublishableKey="stripePublishableKey"
                :totals="{}"
                :discounts="[]"
                :stripeToken="stripeToken"
                :countries="countries"
                :provinces="provinces"
                @updatePaymentData="updatePaymentData"
                @formSubmit="submitForm" />
    </div>
</template>

<script>
    import ThemeClasses from "../../mixins/ThemeClasses";
    import OrderFormPayment from '../../views/order-form/_OrderFormPayment';
    import { DateTime } from 'luxon';

    const defaultPaymentMethod = () => ({
        cardToken: null,
        methodType: 'credit_card',
        billingCountry: null,
        billingRegion: null,
    });

    export default {
        mixins: [ThemeClasses],
        name: 'payment-methods',
        components: {
            'order-form-payment': OrderFormPayment,
        },
        props: {
            paymentMethodsData: {
                type: Object,
                default: () => ({}),
            },

            brand: {
                type: String,
                default: () => 'pianote',
            },

            stripePublishableKey: {
                type: String,
            },

            countries: {
                type: Array,
                default: () => [],
            },

            provinces: {
                type: Array,
                default: () => [],
            },
        },
        data(){
            return {
                selectedPaymentMethod: this.paymentMethodsData.data[0].id || null,
                editingPaymentMethod: defaultPaymentMethod(),
                stripeToken: null,
            }
        },

        methods: {
            updatePaymentData({key, value}){
                this.$set(this.editingPaymentMethod, key, value);
            },

            submitForm(){

            },

            isPrimaryPaymentMethod(paymentMethod){
                return this.getRelatedAttributesByTypeAndId(
                    paymentMethod.relationships.userPaymentMethod.data
                ).attributes.is_primary;
            },

            getExpirationDate(paymentMethod){
                const date = this.getRelatedAttributesByTypeAndId(
                    paymentMethod.relationships.method.data
                ).attributes.expiration_date;

                if(date){
                    return DateTime.fromSQL(date).toFormat('MM/yy');
                }

                return 'N/A';
            },

            getRelatedAttributesByTypeAndId({ id, type }){
                const data = this.paymentMethodsData.included.find(data =>
                    data.id === id && data.type === type
                );

                return data || { id: 'N/A', attributes: {} };
            },
        }
    }
</script>

<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

    .radio-col {
        flex:0 0 30px;
        max-width:30px;
    }
    .default-col {
        flex:0 0 60px;
        max-width:60px;
    }
    .expiry-col {
        flex:0 0 120px;
        max-width:120px;
    }
    .actions-col {
        flex:0 0 70px;
        max-width:70px;
    }
</style>