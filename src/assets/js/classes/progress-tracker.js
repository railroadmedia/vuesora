import axios from 'axios';

export default class ProgressTracker {
    constructor() {
        this.tickInterval = 0;
        this.secondsWatched = 0;

        this.endpointPrefix = window.ENDPOINT_PREFIX || '';
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
     * @param {string} sessionToken - used to validate the current user
     */
    send({
        endpoint = `${this.endpointPrefix}/railtracker/media-playback-session`,
        mediaId,
        mediaType,
        mediaCategory,
        watchPosition,
        totalDuration,
        sessionToken,
    }) {
        const data = new FormData();

        data.append('seconds_played', this.secondsWatched);
        data.append('media_id', mediaId);
        data.append('media_type', mediaType);
        data.append('media_category', mediaCategory);
        data.append('session_id', sessionToken);

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
     * @param {string} sessionToken - used to validate the current user
     * @returns {Promise}
     */
    sendAsync({
        endpoint = `${this.endpointPrefix}/railtracker/media-playback-session`,
        mediaId,
        mediaType,
        mediaCategory,
        watchPosition,
        totalDuration,
        sessionToken,
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
            session_id: sessionToken,
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
