import axios from 'axios';

export default class ProgressTracker {
    constructor() {
        this.tickInterval = 0;
        this.secondsWatched = 0;
    }

    /**
     * Start the timer
     *
     */
    start() {
        this.tickInterval = this.progressInterval();
    }

    /**
     * Stop the timer
     *
     */
    stop() {
        clearInterval(this.tickInterval);
    }

    /**
     * Send a navigator beacon with a FormData object containing progress data
     *
     * @param {string} endpoint - the endpoint to send data to
     * @param {string|number} mediaId - The Media ID you wish to track progress for
     * @param {string} mediaType - Type type of media (video/assignment)
     * @param {string} mediaCategory - (vimeo/youtube or soundslice)
     * @param {string|number} watchPosition - Current watch position of the media
     * @param {string|number} totalDuration
     */
    send({
        endpoint = '/railtracker/media-playback-session',
        mediaId,
        mediaType,
        mediaCategory,
        watchPosition,
        totalDuration,
    }) {
        const data = new FormData();

        data.append('seconds_played', this.secondsWatched);
        data.append('media_id', mediaId);
        data.append('media_type', mediaType);
        data.append('media_category', mediaCategory);

        if (watchPosition && totalDuration) {
            data.append('current_second', watchPosition);
            data.append('media_length_seconds', totalDuration);
        }

        navigator.sendBeacon(endpoint, data);
    }

    /**
     * Send an async tracking request on demand
     *
     * @param {string} endpoint - the endpoint to send data to
     * @param {string|number} mediaId - The Media ID you wish to track progress for
     * @param {string} mediaType - Type type of media (video/assignment)
     * @param {string} mediaCategory - (vimeo/youtube or soundslice)
     * @param {string|number} watchPosition - Current watch position of the media
     * @param {string|number} totalDuration
     * @returns {Promise}
     */
    sendAsync({
        endpoint = '/railtracker/media-playback-session',
        mediaId,
        mediaType,
        mediaCategory,
        watchPosition,
        totalDuration,
    }) {
        if (this.secondsWatched == null) {
            return new Promise.resolve(false);
        }

        return axios.post(endpoint, {
            seconds_played: this.secondsWatched,
            media_id: mediaId,
            media_type: mediaType,
            media_category: mediaCategory,
            current_second: watchPosition,
            media_length_seconds: totalDuration,
        })
            .then(response => response)
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * Interval that increments the secondsWatched property every second
     *
     */
    progressInterval() {
        // TODO: should probably use performance.now() to get millisecond precision

        return setInterval(() => {
            this.secondsWatched++;
        }, 1000);
    }
}
