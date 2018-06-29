/**
 * Utils
 * Static utility/helper methods
 */

export default {

    /**
     * Sort an array of objects based on a specific property
     *
     * @param {string} property - the property to sort the array of objects by, prepending with a '-' will reverse the sort order
     * @returns {Object} - The new sorted object
     */
    dynamicSort(property) {
        let sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            let result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
        };
    },

    /**
     * Clever way to check if the current device supports the orientation property,
     * which is only mobile devices (added in extra check for IEMobile because, well, it's IE)
     *
     * @returns {Boolean} - The new sorted object
     */
    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
}