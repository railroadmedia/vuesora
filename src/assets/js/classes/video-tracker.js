import axios from 'axios';
import * as QueryString from 'query-string';

const endpoint_prefix = process.env.ENDPOINT_PREFIX || '';

export default class VideoTracker {
    constructor({
        media_id,
        player_instance,
        media_type = 'video',
        media_category = 'vimeo',
        media_length_in_seconds = 0,
        current_second = 0,
        media_session_endpoint = '/media-playback-tracking/media-playback-session',
    }) {
        this.media_id = media_id;
        this.player_instance = player_instance;
        this.media_type = media_type;
        this.media_category = media_category;
        this.media_length_in_seconds = media_length_in_seconds;
        this.current_second = current_second;
        this.session_id = null;
        this.total_time_watched = 0;
        this.tracker_interval = null;
        this.media_session_endpoint = media_session_endpoint;
        this.current_tick = 1;
        this.url_params = QueryString.parse(window.location.search);
        this.currently_requesting = false;

        // Seek the player if the user has already watched the video
        if (this.current_second > 0 && this.url_params.time == null) {
            this.player_instance.mediaElement.setCurrentTime(
                this.current_second,
            );
            this.player_instance.mediaElement.load();
        }
    }

    /**
     * Create the session required to start tracking progress on videos
     *
     * @returns {Promise} - A resolved promise with the response object
     */
    createNewSession() {
        return axios.post(endpoint_prefix + this.media_session_endpoint, {
            media_id: this.media_id,
            media_length_seconds: this.media_length_in_seconds,
            media_type: this.media_type,
            media_category: this.media_category,
            current_second: this.current_second,
        })
            .then(response => response)
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * Handle the time update event and send the relevant requests
     */
    handlePlayEvent() {
        if (this.session_id == null) {
            // Initialize the session with the video tracker
            this.createNewSession()
                .then((response) => {
                    if (response) {
                        this.session_id = response.data.session_id;
                        this.handlePlayEvent();
                    }
                });
        }

        if (!this.player_instance.mediaElement.paused && this.session_id) {
            this.tracker_interval = setInterval(() => {
                const currentTime = this.player_instance.mediaElement.currentTime;

                this.total_time_watched += 1;
                this.current_tick = this.current_tick < 10 ? this.current_tick + 1 : 1;

                if (this.current_tick === 10) {
                    this.setLastWatchPosition(currentTime, this.total_time_watched)
                        .then(response => response);
                }
            }, 1000);
        } else {
            clearInterval(this.tracker_interval);
        }
    }

    /**
     * Save the current position and total time watched
     *
     * @returns {Promise} - A resolved promise with the response object
     */
    setLastWatchPosition(current_time, seconds_played) {
        if (this.session_id && !this.currently_requesting) {
            this.currently_requesting = true;

            return axios.post(`${endpoint_prefix + this.media_session_endpoint}/${this.session_id}`, {
                current_second: current_time,
                seconds_played,
            })
                .then((response) => {
                    this.currently_requesting = false;

                    return response;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
}
