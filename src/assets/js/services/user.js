import axios from 'axios';
import ErrorHandler from './_error-handler';
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default {
    /**
     * Set a specific users details
     *
     * @param {Number|String} id
     * @param {Object} attributes
     * @returns {Promise} - resolved promise with the response object
     */
    setUserAttributes(id, attributes = {}) {

        return axios.patch('/usora/json-api/user/update/' + id, {
            data: {
                attributes: attributes
            }
        })
            .then(response => response)
            .catch(ErrorHandler.push);
    },

    /**
     * Set users default payment method
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    setDefaultPaymentMethod(paypalPaymentMethodId) {

        return axios.patch('/payment-method/set-default', {id: paypalPaymentMethodId})
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Get current user payment methods
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaymentMethods() {

        return axios.get('/members/account/settings/payment-methods')
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Get Paypal agreement url
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaypalAgreementUrl() {

        return axios.get('/payment-method/paypal-url')
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Update a credit card payment method
     *
     * @param {String|Number} id - the id of payment method to delete
     * @param {Object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    updatePaymentMethod(id, payload) {

        return axios.patch('/payment-method/' + id, payload)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Delete a payment method
     *
     * @param {String|Number} id - the id of payment method to delete
     * @returns {Promise} - resolved promise with the response.data object
     */
    deletePaymentMethod(id) {

        return axios.delete('/payment-method/' + id)
            .then(response => response)
            .catch(ErrorHandler);
    },

    /**
     * Crates a new payment method
     *
     * @param {Object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    createPaymentMethod(payload) {

        return axios.put('/payment-method', payload)
            .then(response => response.data)
            .catch(error => {
                if (error.response && error.response.status == 422) {
                    return error.response.data;
                } else {
                    ErrorHandler(error);
                }
            });
    },

    /**
     * Upload a resource to S3 and get a CDN url back
     *
     * @param {String} endpoint - the url endpoint to send the request to
     * @param {Object} formData - the formData object to send with the request
     * @returns {Promise} resolved promise with the response.data object, containing the cdn url
     */
    remoteResourceUpload(endpoint, formData) {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                processData: false,
                contentType: false
            }
        };

        return axios.post(endpoint_prefix + endpoint, formData, config)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Send an Email
     *
     * @param {String} type - the type of email to send (action or alert)
     * @param {String} subject
     * @param {Array} lines - array of lines to display in the email, new index = new line break
     * @param {Object} callToAction - CTA with 2 keys, text and url
     * @param {String} alert
     * @param {String} brand
     * @param {String} logo
     * @param {String} view - The laravel dot notated blade template to use
     * @param {String} recipient
     * @param {String} endpoint
     * @returns {Promise} resolved promise with the response.data object
     */
    sendEmail({
        type,
        subject,
        lines,
        callToAction,
        alert,
        brand,
        logo,
        recipient,
        endpoint
    }) {
        return axios.post(endpoint_prefix + endpoint, {
            type: type,
            subject: subject,
            lines: lines,
            callToAction: callToAction,
            alert: alert,
            brand: brand,
            logo: logo,
            recipient: recipient,
        })
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Mark a specific notification as read
     *
     * @param {Number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-read/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Mark a specific notification as unread
     *
     * @param {Number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsUnRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-unread/' + id)
            .then(response => response.data)
            .catch(ErrorHandler);
    },

    /**
     * Mark all of the current users notifications as read
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    markAllNotificationsAsRead() {
        return axios.post(endpoint_prefix + '/members/notifications/mark-all-read')
            .then(response => response.data)
            .catch(ErrorHandler);
    }
}
