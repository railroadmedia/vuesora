<template>
    <section>
        <!-- Test Data 
            <p class="tiny">Has Membership Sku: {{hasMembershipSku}} </p>
            <p class="tiny"> Has Lifetime Sku: {{ hasLifetimeMembershipSku }}</p>
            <p class="tiny">Has Interval Type: {{ cartContainsSubscription }}</p>
            <p class="tiny"> Has Interval Count: {{ containsSubscriptionIntervalCount }}</p>
            <p class="tiny">Has Digital Item: {{ containsDigitalItem }} </p> 
        -->

        <p class="tiny disclaimer mt-1 text-grey-3">

            <!-- If New Recurring Subscription -->
            <template v-if="isNewRecurringSub">
                <!-- <b>New Recurring Sub</b><br> -->
                By completing your order you agree to our <a href="/terms">Terms Of Service</a>, 
                <a href="/privacy">Privacy Statement</a>, and that {{ brand }} will automatically continue your 
                membership and charge the membership fee (currently ${{ subPrice }}) to your payment plan on 
                a {{ subInterval }} basis until you cancel. You can cancel your subscription at any time 
                by emailing support@{{ brand }}.com. You have a 90-day guarantee on your subscription, 
                but following that there are no refunds or credits for partial months. 
            </template>

            <!-- Else If Lifetime -->
            <template v-else-if="isNewLifeTimeSub">
                <!-- <b>New Lifetime Sub</b><br> -->
                By completing your order you agree to our <a href="/terms">Terms Of Service</a>, 
                <a href="/terms">Privacy Statement</a>, and that {{ brand }} will give you lifetime access to this 
                service, or in situations where the service agreement ends you will have the 
                option to download all available media including videos and sheet music. You 
                have a 90-day guarantee on your subscription, but following that there are no 
                refunds or credits for partial months.
            </template>

            <!-- Else If New Trial NOT Recurring -->
            <template v-else-if="isNewTrial">
                <!-- <b>New Trial</b><br> -->
                By completing your order you agree to our <a href="/terms">Terms Of Service</a> 
                and <a href="/terms">Privacy Statement</a>. As a trial user, you will have access for {{ trialDuration }} days. After 
                that, you will have the option to continue your membership at your own discretion 
                by choosing one of our membership service agreements.
            </template>    

            <!-- Else If Pack -->
            <template v-else-if="isPack">
                <!-- <b>Pack</b><br> -->
                By completing your order you agree to our <a href="/terms">Terms Of Service</a>, 
                <a href="/terms">Privacy Statement</a>, and that {{ brand }} will give you lifetime access to this 
                digital product(s), or in situations where the service is terminated you will 
                have the option to download all available media including videos and sheet music. 
                You have a 90-day guarantee on your purchase, but following that there are no 
                refunds or credits given.
            </template>    

            <!-- Else (leave empty) --> 
            <template v-else>
                <!-- <b>Blank</b><br> -->
            </template>   

        </p>
    </section>
</template>

<script>
export default {
    name: 'TOSMessage',

    data() {
        return {
            subPrice: '',
            subInterval: '',
            trialDuration: 'the specified number of',
        }
    },
    
    props: {
        brand: {
            type: String,
            default: () => '',
        },

        cartData: {
            type: Object,
            default: () => {},
        },

        allMembershipProductSkus: {
            type: Array,
            default: () => [],
        },

        membershipsNumberOfFreeDays: {
            type: Array,
            default: () => [],   
        },

        lifetimeMembershipProductSkus: {
            type: Array,
            default: () => [],
        },

        containsDigitalItem: {
            type: Boolean,
            default: () => false
        },

        containsSubscriptionIntervalCount: {
            type: Boolean,
            default: () => false
        },

        cartContainsSubscription: {
            type: Boolean,
            default: () => false
        }
    },

    computed: {

        //Cart has sku in the 'all membership product skus' array --> boolean
        hasMembershipSku() {
            return this.cartData.items.some(item => this.allMembershipProductSkus.includes(item.sku));
        },

        //Cart has sku in the 'all lifetime membership product skus' array --> boolean
        hasLifetimeMembershipSku() {
            return this.cartData.items.some(item => this.lifetimeMembershipProductSkus.includes(item.sku));
        },

        

        //is new recurring subscription --> boolean
        isNewRecurringSub() {
            return (this.hasMembershipSku && this.containsSubscriptionIntervalCount && this.cartContainsSubscription);
        },

        //is new lifetime subscription --> boolean
        isNewLifeTimeSub() {
            return (this.hasLifetimeMembershipSku && !this.containsSubscriptionIntervalCount && !this.cartContainsSubscription);
        },

        //is new trial membership --> boolean
        isNewTrial() {
            return ( this.hasMembershipSku && !this.containsSubscriptionIntervalCount && !this.cartContainsSubscription);
        },

        //is Pack --> boolean
        isPack() {
            return ( !this.hasMembershipSku && this.containsDigitalItem );
        }
    },

    beforeMount() {
        // Get Subscription Renewal Price
        if(this.hasMembershipSku) {
            this.cartData.items.forEach((item) => {
                this.allMembershipProductSkus.forEach((sku) => {
                    if( item.sku === sku && item.subscription_renewal_price !== null)  
                        this.subPrice = item.subscription_renewal_price.toString();
                })
            });
        }

        // Get Subscription Interval Type
        if(this.hasMembershipSku) {
            this.cartData.items.forEach((item) => {
                this.allMembershipProductSkus.forEach((sku) => {
                    if( item.sku === sku && item.subscription_interval_type !== null)  
                        this.subInterval = item.subscription_interval_type.toString() + 'ly';
                })
            });
        }

        //Get Trial Duration
        if(this.isNewTrial) {
            this.cartData.items.forEach((item) => {
                if( this.membershipsNumberOfFreeDays[item.sku] ) {
                    this.trialDuration = this.membershipsNumberOfFreeDays[item.sku].toString();
                }
            });
        }
    }
}
</script>