import axios from 'axios';
import ErrorHandler from './_error-handler';

export default {

    /**
     * Request to check if new account email is exists
     *
     * @param {object} email
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
     * @param {object} payload
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
     * @param {string} productSku
     * @param {number} quantity
     *
     * @returns {Promise}
     */
    updateCartItemQuantity({
        productSku,
        quantity
    }) {
        return axios
                .patch(`/ecommerce/json/update-product-quantity/${ productSku }/${ quantity }`)
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
     * @param {string} billingEmail
     * @param {string} billingCountry
     * @param {string} billingState
     * @param {string} billingZip
     * @param {string} shippingFirstName
     * @param {string} shippingLastName
     * @param {string} shippingAddressLine1
     * @param {string} shippingAddressLine2
     * @param {string} shippingCity
     * @param {string} shippingState
     * @param {string} shippingCountry
     * @param {string} shippingZip
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
     * @param int numberOfPayments
     *
     * @returns {Promise}
     */
    updateNumberOfPayments(numberOfPayments) {
        return axios
                .put(
                    '/ecommerce/json/update-number-of-payments/' + numberOfPayments,
                    {}
                )
                .then(response => response.data)
                .catch(ErrorHandler);
    },
}
