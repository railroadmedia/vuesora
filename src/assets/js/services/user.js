import axios from 'axios';
import Toasts from '../classes/toasts'
const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default {
    /**
     * Set users default payment method
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    setDefaultPaymentMethod(paypalPaymentMethodId) {

        return axios.patch('/payment-method/set-default', {id: paypalPaymentMethodId})
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get current user payment methods
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaymentMethods() {

        return axios.get('/members/account/settings/payment-methods')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Get Paypal agreement url
     *
     * @returns {Promise} - resolved promise with the response.data object
     */
    getPaypalAgreementUrl() {

        return axios.get('/payment-method/paypal-url')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Update a credit card payment method
     *
     * @param {number} id - the id of payment method to delete
     * @param {object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    updatePaymentMethod(id, payload) {

        return axios.patch('/payment-method/' + id, payload)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Delete a payment method
     *
     * @param {number} id - the id of payment method to delete
     * @returns {Promise} - resolved promise with the response.data object
     */
    deletePaymentMethod(id) {

        return axios.delete('/payment-method/' + id)
            .then(response => response)
            .catch(this.handleError);
    },

    /**
     * Crates a new payment method
     *
     * @param {object} payload - the data object with the payment method details
     * @returns {Promise} - resolved promise with the response.data object
     */
    createPaymentMethod(payload) {

        return axios.put('/payment-method', payload)
            .then(response => response.data)
            .catch(error => {
                if (error.response && error.response.status == 422) {
                    return error.response.data;
                } else {
                    this.handleError(error);
                }
            });
    },

    /**
     * Upload a resource to S3 and get a CDN url back
     *
     * @param {string} endpoint - the url endpoint to send the request to
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
            .catch(this.handleError);
    },

    /**
     * Send an Email
     *
     * @param {string} message - the content of the text area element within the email form
     * @param {string} type - the type of email to send ['general', 'ask-question', 'support', 'suggest-learning-path']
     * @param {string} subject - the subject for the email
     * @param {string} recipient - who to send to (default set on backend)
     * @param {string} endpoint - the mail package endpoint to hit
     * @returns {Promise} resolved promise with the response.data object
     */
    sendEmail({message, type, subject, recipient, endpoint}) {
        return axios.post(endpoint_prefix + endpoint, {
            message: message,
            type: type,
            subject: subject,
            recipient: recipient
        })
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark a specific notification as read
     *
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-read/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark a specific notification as unread
     *
     * @param {number} id - notification id
     * @returns {Promise} resolved promise with the response.data object
     */
    markNotificationAsUnRead(id) {
        return axios.post(endpoint_prefix + '/members/notifications/mark-unread/' + id)
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Mark all of the current users notifications as read
     *
     * @returns {Promise} resolved promise with the response.data object
     */
    markAllNotificationsAsRead() {
        return axios.post(endpoint_prefix + '/members/notifications/mark-all-read')
            .then(response => response.data)
            .catch(this.handleError);
    },

    /**
     * Display an error message and console the error if any request fails
     *
     * @param {object} error - the error object returned by the request
     */
    handleError(error) {
        console.error(error);
        Toasts.push({
            icon: 'doh',
            title: 'This is Embarrassing! That didn\'t work',
            message: 'Refresh the page to try once more, if it happens again please let us know using the chat below.'
        });
    }
}
