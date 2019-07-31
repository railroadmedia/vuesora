export default {

    mapObject: {
        drumeo: {
            0: 'Casual',
            100: 'Enthusiast I',
            250: 'Enthusiast II',
            500: 'Pro I',
            1000: 'Pro II',
            2500: 'Pro III',
            10000: 'Master I',
            25000: 'Master II',
            100000: 'Master III',
            250000: 'Legend',
            500000: 'Legends: Starr',
            1000000: 'Legends: Erskine',
            1500000: 'Legends: Cobham',
            2000000: 'Legends: Garibaldi',
            2500000: 'Legends: Peart',
            3000000: 'Legends: Bonham',
            4000000: 'Legends: Colaiuta',
            5000000: 'Legends: Gadd',
            7500000: 'Legends: Porcaro',
            10000000: 'Legends: Rich',
        },
        pianote: {
            0: 'Casual',
            100: 'Enthusiast I',
            250: 'Enthusiast II',
            500: 'Pro I',
            1000: 'Pro II',
            2500: 'Pro III',
            10000: 'Master I',
            25000: 'Master II',
            100000: 'Master III',
            250000: 'Master IV',
            500000: 'Legend I',
            1000000: 'Legend II',
            1500000: 'Legend III',
            2000000: 'Legend IV',
            2500000: 'Legend V',
            3000000: 'Legend VI',
            4000000: 'Legend VII',
            5000000: 'Legend VIII',
            7500000: 'Legend IX',
            10000000: 'Legend X',
        },
    },

    /**
     * Get the first key that the value goes over
     *
     * @param {string} xp - the xp amount
     * @param {string} brand
     * @param {number} offset - how many indexes after the matched index to return
     * @returns {number|string} - the number for the specific key
     */
    getNearestKey(xp, brand = 'drumeo', offset = 0) {
        const mapKeys = Object.keys(this.mapObject[brand]);

        for (let i = 0; i < mapKeys.length; i++) {
            // Over 10 million or between any of the keys
            if (mapKeys[i] >= 10000000 || (Number(xp) >= Number(mapKeys[i]) && Number(xp) < Number(mapKeys[i + 1]))) {
                return mapKeys[i + offset];
            }
        }

        return 0;
    },

    /**
     * Use the getNearestKey method to get the value of the first key the xp goes over
     *
     * @param {string} xp - the xp amount
     * @param {string} brand
     * @param {number} offset - how many indexes after the matched index to return
     * @returns {string} - the value for the rank associated to that key/xp
     */
    getNearestValue(xp, brand = 'drumeo', offset = 0) {
        return (this.mapObject[brand][this.getNearestKey(xp, brand, offset)]);
    },
};
