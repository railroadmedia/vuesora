import axios from 'axios';
import ErrorHandler from './_error-handler';

let endpointPrefix;

if(typeof window != 'undefined'){
    endpointPrefix = window.ENDPOINT_PREFIX || '';
}

export default {
    /**
     * Send an Email
     *
     * @param {String} type - the type of email to send (action or alert)
     * @param {String} subject
     * @param {String} studentName
     * @param {String} studentEmail
     * @param {String} isMember
     * @param {String} supportOption
     * @param {String} message
     * @param {Array} attachments - array of files to display in the email
     * @param {Object} attachment - a file object of the uploaded file
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
        studentName,
        studentEmail,
        isMember,
        supportOption,
        message,
        attachment,
        callToAction,
        alert,
        brand,
        logo,
        recipient,
        endpoint,
    }) {

        const formData = new FormData();

        formData.append('type', type);
        formData.append('subject', subject);
        formData.append('studentName', studentName);
        formData.append('studentEmail', studentEmail);
        formData.append('isMember', isMember);
        formData.append('supportOption', supportOption);
        formData.append('message', message);
        formData.append('attachment', attachment);
        formData.append('callToAction', callToAction);
        formData.append('alert', alert);
        formData.append('brand', brand);
        formData.append('logo', logo);
        formData.append('recipient', recipient);

        return axios.post(endpointPrefix + endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'}
            }
        )
            .then(response => response.data)
            .catch(ErrorHandler);
    },
};
