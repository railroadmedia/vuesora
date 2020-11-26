<template>
    <section v-if="shippingAddresses.data.length > 0">
        <div class="flex flex-row flex-wrap nmh-1">
            <!-- Create New Default -->
            <div class="flex flex-col sm-6 xs-12">
                <label
                    class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer border-gray"
                    :class="{ 'card-selected': newAddress }"
                >
                    <div class="flex flex-column xs-1 align-center align-v-center">
                        <input  
                            id="address-0"
                            type="radio"
                            name="shippingAddressOption"
                            :checked="newAddress"
                            @change.stop="emitNewAddress()"
                        >
                    </div>
                    <div class="flex flex-column xs-11 align-left align-v-center text-left">
                        <p class="tiny">
                            <span class="font-bold">
                                Create a new shipping address.
                            </span>
                        </p>
                    </div>
                </label>
            </div>

            <!-- Use An Existing -->
            <div
                v-for="(thisShippingAddress, index) in shippingAddresses.data"
                :key="index"
                class="flex flex-col sm-6 xs-12"
            >
                <label
                    class="flex mb-1 mh-1 pb-1 pt-1 corners-10 cursor-pointer border-gray"
                    :class="{ 'card-selected': isSelectedAddress(thisShippingAddress)}"
                    :for="`address-${index + 1}`"
                >
                    <div class="flex flex-column xs-1 align-center align-v-center">
                        <input
                            :id="`address-${index + 1}`"
                            type="radio"
                            name="shippingAddressOption"
                            :value="shippingAddress.id"
                            :checked="isSelectedAddress(thisShippingAddress)"
                            @change.stop="emitSelectAddress(thisShippingAddress)"
                        >
                    </div>

                    <div class="flex flex-column xs-7 align-left text-left pr-1 border-gray-right">
                        <p class="tiny">
                            <span class="font-bold">
                                {{ thisShippingAddress.attributes.first_name }}
                                {{ thisShippingAddress.attributes.last_name }}
                            </span>
                        </p>
                        <p class="tiny">
                            {{ thisShippingAddress.attributes.street_line_1 }}<span
                                v-if="thisShippingAddress.attributes.street_line_2.length > 0"
                            >, {{ thisShippingAddress.attributes.street_line_2 }}
                            </span>
                        </p>
                        <p class="tiny">
                            {{ thisShippingAddress.attributes.zip.toUpperCase() }}
                        </p>
                    </div>

                    <div
                        class="flex flex-column xs-4 align-left text-left pl-2"
                    >
                        <p class="tiny">
                            <span class="font-bold">
                                {{ thisShippingAddress.attributes.city }}
                            </span>
                        </p>
                        <p class="tiny">
                            {{ thisShippingAddress.attributes.region }}
                        </p>
                        <p class="tiny">
                            {{ thisShippingAddress.attributes.country }}
                        </p>
                    </div>
                </label>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'ShippingAddressCards',
    
    props: {
        shippingAddresses: {
            type: Object,
            default: () => null,
        },
        newAddress: {
            type: Boolean,
            default: false,
        },
        selectedAddress: {
            type: Object,
            default: () => null,
        },
        shippingAddress: {
            type: Object,
            default: () => null,
        },
    },

    beforeMount() {
        // Get Last Address
        if (this.shippingAddresses) {
            const firstAddress = this.shippingAddresses.data[0];

            // check if last address was stored
            if (localStorage.getItem('lastAddressId') !== null) {
                if (localStorage.getItem('lastAddressId') === 'new') {
                    this.emitNewAddress();
                    return true;
                }

                this.shippingAddresses.data.some((address) => { 
                    if (address.id === localStorage.getItem('lastAddressId')) {
                        this.updateSelectedAddress(address);
                        return true;
                    }
                });
            } else {
                this.updateSelectedAddress(firstAddress);
            }
        }
    },

    methods: {
        updateSelectedAddress(address) {
            this.$emit('selectedAddressUpdated', address);
        },

        emitNewAddress() {
            this.$emit('newAddressEvent');
        },

        emitSelectAddress(address) {
            this.$emit('selectAddressEvent', address);
        },

        isSelectedAddress(address) {
            if (!this.newAddress) {
                if (this.selectedAddress === address) {
                    return true;
                }
            }
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
    .border-gray-right {
        border-right: 1px solid #ddd;
    }
</style>
