import axios from 'axios';
import ErrorHandler from './error-handler';

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
                .catch(ErrorHandler.push);
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
                .catch(ErrorHandler.push);
    },
}
