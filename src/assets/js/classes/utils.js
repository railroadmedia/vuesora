/**
 * Utils
 * Static utility/helper methods
 */

export default {

    /**
     * Trigger an event on a specific DOM element
     *
     * @param el - The element to dispatch the event on
     * @param eventType - The name of the event
     * @param detail - Optional paylod to pass with the event
     * @returns {Event} - the a custom event with the name specified at invocation
     */
    triggerEvent: (el, eventType, detail) => el.dispatchEvent(new CustomEvent(eventType, { detail })),

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
            topic: [],
            key: [],
            key_pitch_type: []
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
     * Pull all of the top level content types, does not include child types
     *
     * @returns {array}
     */
    topLevelContentTypes(){
        return [
            {
                type: 'course',
                label: 'Course',
                icon: 'icon-courses',
                brands: ['drumeo', 'guitareo', 'pianote', 'recordeo'],
            },
            {
                type: 'song',
                label: 'Song',
                icon: 'icon-songs',
                brands: ['drumeo', 'guitareo', 'pianote', 'recordeo'],
            },
            {
                type: 'play-along',
                label: 'Play-Along',
                icon: 'icon-play-alongs',
                brands: ['drumeo', 'guitareo', 'pianote'],
            },
            {
                type: 'student-focus',
                label: 'Student Focus',
                icon: 'icon-student-focus',
                brands: ['drumeo'],
            },
            {
                type: 'recording',
                label: 'Recording',
                icon: 'icon-library',
                brands: ['drumeo', 'guitareo', 'pianote', 'recordeo'],
            },
            {
                type: 'learning-path',
                label: 'Learning Path',
                icon: 'icon-learning-paths',
                brands: ['drumeo', 'guitareo', 'pianote', 'recordeo'],
            },
            {
                type: 'pack',
                label: 'Pack',
                icon: 'icon-packs',
                brands: ['drumeo'],
            },
            {
                type: 'semester-pack',
                label: 'Semester Pack',
                icon: 'icon-packs',
                brands: ['drumeo', 'guitareo'],
            },
            {
                type: 'rudiment',
                label: 'Rudiment',
                icon: 'icon-drums',
                brands: ['drumeo'],
            },
            {
                type: 'chord-and-scale',
                label: 'Chords & Scales',
                icon: 'icon-chord-and-scale',
                brands: ['guitareo', 'pianote'],
            },
            {
                type: 'question-and-answer',
                label: 'Q & A',
                icon: 'icon-student-focus',
                brands: ['recordeo'],
            },
            {
                type: 'student-review',
                label: 'Student Review',
                icon: 'icon-student-focus',
                brands: ['recordeo'],
            },
            {
                type: 'gear-guides',
                label: 'Gear Guides',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'challenges',
                label: 'Challenges',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'boot-camps',
                label: 'Boot Camps',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'quick-tips',
                label: 'Quick Tips',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'podcasts',
                label: 'Podcasts',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'on-the-road',
                label: 'On the Road',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'behind-the-scenes',
                label: 'Behind the Scenes',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'study-the-greats',
                label: 'Study the Greats',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'live',
                label: 'Live',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'solos',
                label: 'Solos',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'performances',
                label: 'Performances',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'exploring-beats',
                label: 'Exploring Beats',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'sonor-drums',
                label: 'Sonor Drums',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'paiste-cymbals',
                label: 'Paiste Cymbals',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'rhythms-from-another-planet',
                label: 'Rhythms from Another Planet',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: '25-days-of-christmas',
                label: '25 Days of Christmas',
                icon: 'icon-shows',
                brands: ['drumeo'],
            },
            {
                type: 'assignment',
                label: 'Assignment',
                icon: 'icon-metronome',
                brands: ['drumeo', 'pianote', 'guitareo'],
            },
            {
                type: 'instructor',
                label: 'Instructor',
                icon: 'wc',
                brands: ['drumeo', 'pianote', 'guitareo', 'recordeo'],
            },
        ]
    },

    getParentContentType(childType) {
        return {
            'course-part': 'course',
            'song-part': 'song',
            'play-along-part': 'play-along',
            'pack-bundle': 'pack',
            'pack-bundle-lesson': 'pack-bundle',
            'semester-pack-lesson': 'semester-pack'
        }[childType];
    },

    /**
     * Pull all of the top level content types, does not include child types
     *
     * @param {string} brand
     * @returns {array}
     */
    getBrandSpecificTopLevelContentTypes(brand){
        return this.topLevelContentTypes().filter(type =>
            type.type !== 'assignment' && type.brands.indexOf(brand) !== -1
        );
    },

    /**
     * Get the icon for a specific content type
     *
     * @param {string} type
     * @returns {string} - the icon class name
     */
    getContentTypeIcon(type){
        type = type
            .replace(/-part/g, '') // Remove the -part
            .replace(/-bundle/g, '') // Remove the -bundle
            .replace(/-lesson/g, '');  // Remove -lesson
        const contentType = this.topLevelContentTypes().filter(content =>
            content.type === type
        )[0];

        return contentType ? contentType.icon : undefined;
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
    },

    /**
     * Get the current width of the scrollbar on the page
     *
     * @returns {String|Number}
     */
    getScrollBarWidth(){
        if (typeof document === 'undefined') {
            return 0
        }

        const body = document.body;
        const box = document.createElement('div');

        let boxStyle = box.style;
        let width;

        boxStyle.position = 'absolute';
        boxStyle.top = boxStyle.left = '-9999px';
        boxStyle.width = boxStyle.height = '100px';
        boxStyle.overflow = 'scroll';

        body.appendChild(box);

        width = box.offsetWidth - box.clientWidth;

        body.removeChild(box);

        return width;
    }
}