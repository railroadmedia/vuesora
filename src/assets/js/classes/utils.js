/**
 * Utils
 * Static utility/helper methods
 */

export default class Utils {

    /**
     * Sort an array of objects based on a specific property
     *
     * @static
     * @param {string} property - the property to sort the array of objects by, prepending with a '-' will reverse the sort order
     * @returns {Object} - The new sorted object
     */
    static dynamicSort(property) {
        let sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            let result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
        };
    }
}