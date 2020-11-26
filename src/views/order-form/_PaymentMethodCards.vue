<template>
    <section v-if="paymentMethods.data.length > 0">
        <div class="flex flex-row flex-wrap nmh-1">
            <!-- Create New Default -->
            <div class="flex flex-col sm-6 xs-12">
                <label
                    class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer border-gray"
                    :class="{ 'card-selected': newPayment }"
                >
                    <div class="flex flex-column xs-1 align-center align-v-center">
                        <input 
                            id="paymentMethod-0"
                            type="radio" 
                            name="paymentMethods"
                            :checked="newPayment"
                            @change.stop="emitNewPayment()"
                        >
                    </div>
                    <div class="flex flex-column xs-11 align-left align-v-center text-left">
                        <p class="tiny">
                            <span class="font-bold">
                                Create a new payment method.
                            </span>
                        </p>
                    </div>
                </label>
            </div>

            <!-- Use An Existing -->
            <div
                v-for="(paymentMethod, index) in paymentMethods.data"
                :key="index"
                class="flex flex-col sm-6 xs-12"
            >
                <label
                    class="flex mb-1 mh-1 corners-10 cursor-pointer border-gray"
                    :class="{ 'card-selected': isSelectedPayment(paymentMethod)}"
                    :for="`paymentMethod-${index + 1}`"
                >
                    <div class="flex flex-column xs-1 align-center align-v-center">
                        <input 
                            :id="`paymentMethod-${index + 1}`"
                            type="radio" 
                            name="paymentMethods"
                            :checked="isSelectedPayment(paymentMethod)"
                            @change.stop="emitSelectPayment(paymentMethod)"
                        >
                    </div>

                    <div class="pr-2">   
                        <svg-icon 
                            :icon-name="getPaymentMethodIcon(paymentMethod)"
                            width="78px"
                        />
                    </div>

                    <div
                        v-if="paymentMethod.relationships.method.data.type === 'creditCard'"
                        class="flex flex-column xs-8 align-v-center"
                    >
                        <p class="tiny">
                            <span class="font-bold">
                                {{ getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.company_name || 'N/A' }}
                                {{ getPaymentMethodType(paymentMethod) }}
                            </span>
                        </p>
                        <p class="tiny">
                            Last Four: <span class="font-bold">{{
                                getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.last_four_digits || 'N/A'
                            }}</span>
                        </p>
                        <p class="tiny">
                            Expires: <span class="font-bold">{{ getExpirationDate(paymentMethod) }}</span>
                        </p>
                    </div>

                    <div
                        v-if="paymentMethod.relationships.method.data.type === 'paypalBillingAgreement'"
                        class="flex flex-column xs-8 align-v-center"
                    >
                        <p class="tiny">
                            <span class="font-bold">{{ getPaymentMethodType(paymentMethod) }}</span>
                        </p>

                        <p class="tiny">
                            Billing Agreement ID: <span class="font-bold">{{
                                getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data).attributes.external_id || 'N/A'
                            }}</span>
                        </p>
                    </div>
                </label>
            </div>
        </div>
    </section>
</template>
<script>
import { DateTime } from 'luxon';
import SVGIcon from '../../components/SVGIcon/_SVGIcon.vue';

export default {
    name: 'PaymentMethodCards',

    components: {
        'svg-icon': SVGIcon,
    },

    props: {
        paymentMethods: {
            type: Object,
            default: () => null,
        },
        newPayment: {
            type: Boolean,
            default: false,
        },
        selectedPaymentMethod: {
            type: Object,
            default: () => null,
        },
    },

    beforeMount() {
        // Get Primary Payment Method
        if (this.paymentMethods) {
            const firstPayment = this.paymentMethods.data[0];

            if (localStorage.getItem('lastPaymentMethodId') !== null) {
                if (localStorage.getItem('lastPaymentMethodId') === 'new') {
                    this.emitNewPayment();
                    return true;
                }

                this.paymentMethods.data.some((method) => {
                    if (method.id === localStorage.getItem('lastPaymentMethodId')) {
                        this.updateSelectedPaymentMethod(method);
                        return true;
                    }
                });
            } else {
                this.paymentMethods.data.some((method) => {
                    if (this.isPrimaryPaymentMethod(method)) {
                        this.updateSelectedPaymentMethod(method);
                        return true;
                    }
                });
                if (!this.isPrimaryPaymentMethod(this.selectedPaymentMethod)) {
                    this.updateSelectedPaymentMethod(firstPayment);
                }
            }
        }
    },

    methods: {
        updateSelectedPaymentMethod(method) {
            this.$emit('selectedPaymentUpdated', method);
        },

        emitNewPayment() {
            this.$emit('newPaymentEvent');
        },

        emitSelectPayment(payment) {
            this.$emit('selectPaymentEvent', payment);
        },

        isPrimaryPaymentMethod(paymentMethod) {
            if (paymentMethod) {
                return this.getRelatedAttributesByTypeAndId(
                    paymentMethod.relationships.userPaymentMethod.data,
                ).attributes.is_primary;
            }
            return false;
        },

        isSelectedPayment(paymentMethod) {
            if (!this.newPayment && this.selectedPaymentMethod) {
                if (this.selectedPaymentMethod.id === paymentMethod.id) {
                    return true;
                }
            }
            return false;
        },

        getExpirationDate(paymentMethod) {
            const date = this.getRelatedAttributesByTypeAndId(
                paymentMethod.relationships.method.data,
            ).attributes.expiration_date;
            if (date) {
                return DateTime.fromSQL(date).toFormat('MM/yy');
            }
            return 'N/A';
        },

        getPaymentMethodType(paymentMethod) {
            let type;
            if (paymentMethod.relationships.method.data.type === 'creditCard') {
                type = 'Credit Card';
            } else if (paymentMethod.relationships.method.data.type === 'paypalBillingAgreement') {
                type = 'PayPal Account';
            } else {
                type = 'N/A';
            }
            return type;
        },

        getPaymentMethodIcon(paymentMethod) {
            const method = this.getRelatedAttributesByTypeAndId(paymentMethod.relationships.method.data);

            if (paymentMethod.relationships.method.data.type === 'creditCard') {
                switch (method.attributes.company_name.toLowerCase()) {
                case 'visa':
                    return 'visa';
                case 'mastercard':
                    return 'mastercard';
                case 'discover':
                    return 'discover';
                case 'american express':
                    return 'american-express';
                default:
                    return '';
                }
            } else if (paymentMethod.relationships.method.data.type === 'paypalBillingAgreement') {
                return 'paypal';
            }

            return '';
        },

        getRelatedAttributesByTypeAndId({ id, type }) {
            const data = this.paymentMethods.included.find(data => data.id === id && data.type === type);
            return data || { id: 'N/A', attributes: {} };
        },
    },
};
</script>
<style lang="scss"> 
    .card-selected {
        background-color: #efefef;
        box-shadow: 2px 5px 10px rgba(100,100,100,.5);
        transition: .25s linear all;
    }
    .border-gray {
       border: 1px solid #ddd;
    }
</style>
