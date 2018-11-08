/**
 * Utils
 * Static utility/helper methods
 */

export default {


    /**
     * Loop through every post in a content response and flatten each one
     *
     * @param {array} content_posts - the results array returned from the endpoint
     * @returns {array} - The new array of flattened objects
     */
    flattenContent(content_posts){
        let flattened_posts = [];

        content_posts.forEach(post => {
            this.flattenContentObjectFields(post, flattened_posts);
        });

        return flattened_posts;
    },

    /**
     * Flatten a content object
     *
     * @param {object} post - the results array returned from the endpoint
     * @param flattened - the flattened copy of the object to map the fields to
     * @returns {array} - The new array of flattened objects
     */
    flattenContentObjectFields(post, flattened){
        let this_post = post;

        post['fields'].forEach(field => {
            this.createOrPushArray(field.key, field.value, this_post);
        });

        post['data'].forEach(data => {
            this.createOrPushArray(data.key, data.value, this_post);
        });

        flattened.push(this_post);
    },

    /**
     * If a value already exists when flattening an object, we need to turn it into an array
     * Will also utilize recursing to continue flattening nested objects
     *
     * @param key - the key of the field or data you wish to collapse
     * @param value - the value that gets appended to the target
     * @param target - the target key you wish to create a value at or push to
     */
    createOrPushArray(key, value, target){
        let this_value = value;

        // If the value is an object that means we are looking at linked content as a field,
        // So we need to keep running this method to flatten that object aswell
        if(typeof value === 'object' && value !== null){
            value['fields'].forEach(field => {
                this.createOrPushArray(field.key, field.value, this_value);
            });

            value['data'].forEach(data => {
                this.createOrPushArray(data.key, data.value, this_value);
            });
        }

        // If the target key doesn't exist then we just append the value,
        // Otherwise we need to create an array and push new items into it
        if(target[key] == null){
            target[key] = this_value;
        }
        else {
            // If the target is already an array then we need to combine the arrays,
            // Otherwise we create an array and merge the two values
            if(Array.isArray(target[key])){
                target[key] = [
                    ...target[key],
                    this_value
                ]
            }
            else {
                target[key] = [
                    target[key],
                    this_value
                ]
            }
        }
    },


    /**
     * Flatten the filters returned from railcontent
     *
     * @param {object} filter_options - the filter_options object returned by railcontent
     * @returns {Object} - The new flattened object
     */
    flattenFilters(filter_options){
        let keys = Object.keys(filter_options);
        let filter_map = {
            artist: [],
            bpm: [],
            difficulty: [],
            instructor: [],
            style: [],
            topic: []
        };

        keys.forEach(key => {

            // Instructors need to have the name as the label but their id as the value,
            // So it makes sense to map every array as a key/value pair
            if(key === 'instructor'){
                let instructor_array = this.flattenContent(filter_options[key]);

                instructor_array.forEach(filter => {

                    filter_map[key].push({
                        key: filter['name'],
                        value: filter['id']
                    });
                })
            }
            else {
                for(let i = 0; i < filter_options[key].length; i++){
                    // Some of the legacy data can give us duplicate keys,
                    // Since we can't avoid this we gotta check whether or not
                    // We've added the key already
                    let map_exists = filter_map[key] != null;
                    let value_exists;
                    if(map_exists){
                        value_exists = filter_map[key].filter(map =>
                            map.value === filter_options[key][i]
                        ).length > 0;

                        if(!value_exists){
                            filter_map[key].push({
                                key: filter_options[key][i],
                                value: filter_options[key][i]
                            });
                        }
                    }
                }
            }
        });

        return filter_map;
    },

    /**
     * Take a string and capitalize the first letter of every word
     *
     * @param {string} phrase
     * @returns {String} - The new capitalized string
     */
    toTitleCase(phrase){
        return phrase
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

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
    },

    /**
     * Parse xp values as abbreviations rather than their total amount
     *
     * @returns {String} - the parsed value
     */
    parseXpValue(xp){
        if(xp >= 100000 && xp < 1000000){
            return Math.round(xp / 1000) + 'K';
        }
        else if(xp >= 1000000){
            return Math.round(xp / 1000000).toFixed(1) + 'M';
        }

        return xp;
    },

    /**
     * Format a number with commas separating the thousands.
     *
     * @returns {string} - A numeric string with commas
     */
    formatNumbersWithCommas(value){
        return Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}