export default class ProgressTracker {
    constructor(){
        this.tickInterval = 0;
        this.secondsWatched = 0;
    }

    /**
     * Start the timer
     *
     */
    start(){
        this.tickInterval = this.progressInterval();
    }

    /**
     * Stop the timer
     *
     */
    stop(){
        clearInterval(this.tickInterval);
    }

    /**
     * Send a navigator beacon with a FormData object containing progress data
     *
     * @param {string} endpoint - the endpoint to send data to
     * @param {string|number} contentId - Content ID you wish to track progress for
     * @param {string|number} watchPosition - Current watch position of the media you are tracking progress
     * @param {string|number} totalDuration
     */
    send({
        endpoint = '/media-playback-tracking/media-playback-session',
        mediaId,
        watchPosition,
        totalDuration,
    }){
        const data = new FormData();

        data.append('seconds_played', this.secondsWatched);
        data.append('media_id', mediaId);

        if(watchPosition && totalDuration){
            data.append('current_second', watchPosition);
            data.append('media_length_seconds', totalDuration);
        }

        navigator.sendBeacon(endpoint, data);
    }

    /**
     * Interval that increments the secondsWatched property every second
     *
     */
    progressInterval(){
        return setInterval( () => {
            this.secondsWatched++;
        }, 1000);
    }
}