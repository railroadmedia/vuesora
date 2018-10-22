export default {
    /**
     * Map an exp amount to a predetermined rank
     *
     * @returns {string} - The rank associated to the xp amount
     */
    map(xp){
        const xpMap = {
            0: 'Casual',
            250: 'Enthusiast I',
            1000: 'Enthusiast II',
            2500: 'Pro I',
            5000: 'Pro II',
            10000: 'Pro III',
            20000: 'Master I',
            50000: 'Master II',
            100000: 'Master III',
            250000: 'Drumeo Legend',
            500000: 'Legends: Star',
            1000000: 'Legends: Erskine',
            1500000: 'Legends: Cobham',
            2000000: 'Legends: Garibaldi',
            2500000: 'Legends: Peart',
            3000000: 'Legends: Bonham',
            4000000: 'Legends: Colaiuta',
            5000000: 'Legends: Gadd',
            7500000: 'Legends: Porcaro',
            10000000: 'Legends: Rich'
        };
        const mapKeys = Object.keys(xpMap);

        for(let i = 0; i < mapKeys.length; i++){

            // Over 10 million or between any of the keys
            if(mapKeys[i] >= 10000000 || (Number(xp) >= Number(mapKeys[i]) && Number(xp) < Number(mapKeys[i + 1]))){
                return xpMap[mapKeys[i]];
            }
        }

        return '';
    }
}