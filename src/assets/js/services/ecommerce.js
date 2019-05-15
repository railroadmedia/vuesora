import axios from 'axios';
import ErrorHandler from './_error-handler';

export default {

    /**
     * Request to check if new account email is exists
     *
     * @param {Object} email
     *
     * @returns {Promise}
     */
    checkEmail(email) {

        return axios.post('/order/check-email-exists', {
            email
        })
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Request to submit the order form data
     *
     * @param {Object} payload
     *
     * @returns {Promise}
     */
    submitOrder(payload) {
        return axios.put('/ecommerce/json/order-form/submit', payload)
                .then(response => response)
                .catch(ErrorHandler);
    },

    /**
     * Updates the cart item quantity
     *
     * @param {String} productSku
     * @param {Number} quantity
     *
     * @returns {Promise}
     */
    updateCartItemQuantity({
        productSku,
        quantity
    }) {
        return axios.patch(`/ecommerce/json/update-product-quantity/${ productSku }/${ quantity }`)
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Removes a cart item
     *
     * @param {String} productSku
     *
     * @returns {Promise}
     */
    removeCartItem({productSku}) {
        return axios.delete(`/ecommerce/json/remove-from-cart/${ productSku }`)
                .then(response => response)
                .catch(ErrorHandler);
    },

    /**
     * Updates the session addresses
     *
     * @param {String} billingEmail
     * @param {String} billingCountry
     * @param {String} billingState
     * @param {String} billingZip
     * @param {String} shippingFirstName
     * @param {String} shippingLastName
     * @param {String} shippingAddressLine1
     * @param {String} shippingAddressLine2
     * @param {String} shippingCity
     * @param {String} shippingState
     * @param {String} shippingCountry
     * @param {String} shippingZip
     *
     * @returns {Promise}
     */
    updateAddressesInSession({
        billingEmail,
        billingCountry,
        billingState,
        billingZip,
        shippingFirstName,
        shippingLastName,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingCity,
        shippingState,
        shippingCountry,
        shippingZip
    }) {

        return axios.put('/ecommerce/session/address', {
            'shipping-address-line-1': shippingAddressLine1,
            'shipping-address-line-2': shippingAddressLine2,
            'shipping-city': shippingCity,
            'shipping-country': shippingCountry,
            'shipping-first-name': shippingFirstName,
            'shipping-last-name': shippingLastName,
            'shipping-region': shippingState,
            'shipping-zip-or-postal-code': shippingZip,
            'billing-country': billingCountry,
            'billing-region': billingState,
            'billing-zip-or-postal-code': billingZip,
            'billing-email': billingEmail,
        })
        .then(response => response)
        .catch(ErrorHandler);
    },

    /**
     * Updates number of payments
     *
     * @param {String|Number} numberOfPayments
     * @returns {Promise}
     */
    updateNumberOfPayments(numberOfPayments) {
        return axios.put('/ecommerce/json/update-number-of-payments/' + numberOfPayments)
                .then(response => response)
                .catch(ErrorHandler);
    },
}
