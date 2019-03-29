import axios from 'axios';
import ErrorHandler from './_error-handler';

export default {

    /**
     * Updates the cart item quantity
     *
     * @param {number} productId
     * @param {number} quantity
     *
     * @returns {Promise}
     */
    updateCartItemQuantity({
        productId,
        quantity
    }) {
        return axios
                .put(
                    '/ecommerce/update-product-quantity/' + productId + '/' + quantity,
                    {}
                )
                .then(response => response.data)
                .catch(ErrorHandler);
    },

    /**
     * Removes a cart item
     *
     * @param {number} productId
     *
     * @returns {Promise}
     */
    removeCartItem({productId}) {
        return axios
                .put(
                    '/ecommerce/remove-from-cart/' + productId,
                    {}
                )
                .then(response => response.data)
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
    updateAddresses({
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

        return axios
                .put(
                    '/ecommerce/session/address',
                    {
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
                    }
                )
                .then(response => response.data)
                .catch(ErrorHandler);
    }
}
