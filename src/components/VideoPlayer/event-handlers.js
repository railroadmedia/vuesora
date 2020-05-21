import UserService from '../../assets/js/services/user';

export default {
    data() {
        return {
            eventHandlers: {

                loading: () => {
                    this.loading = true;
                },

                onstatechange: (event) => {
                    if (event.state === 'load') {
                        this.loading = false;
                    }

                    if (event.state === 'src-equals') {
                        this.$nextTick(() => {
                            this.mediaElement.load();
                        });
                    }
                },

                error: (error) => {
                    if (error.severity === 2) {
                        if (error.code === 1001 && !this.hasRetriedSource) {
                            this.retryVimeoUrl(error);
                        } else {
                            this.playerError = true;
                            this.playerErrorCode = error.code;
                        }
                    }
                },

                buffering: (event) => {
                    this.loading = event.buffering;
                },
            },

            mediaElementEventHandlers: {
                canplaythrough: (event) => {
                    this.totalDuration = this.mediaElement.duration;
                    this.currentTime = this.mediaElement.currentTime;

                    setTimeout(() => {
                        this.loading = false;
                        this.$emit('canplaythrough', event);
                    }, 500);
                },

                loadedmetadata: (event) => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$emit('loadedmetadata', event);
                    }, 500);
                },

                durationchange: (event) => {
                    this.totalDuration = this.mediaElement.duration;

                    this.$emit('durationchange', event);
                },

                waiting: (event) => {
                    this.isPlaying = false;
                    this.loading = true;

                    this.$emit('waiting', event);
                },

                pause: (event) => {
                    this.isPlaying = false;
                    this.loading = false;

                    this.$emit('pause', {
                        ...event,
                        contentId: this.contentId,
                    });
                },

                play: (event) => {
                    this.isPlaying = true;
                    this.loading = false;
                    this.hasBeenPlayed = true;

                    this.$emit('play', {
                        ...event,
                        contentId: this.contentId,
                        progressState: this.progressState,
                    });
                },

                playing: (event) => {
                    setTimeout(() => {
                        this.isPlaying = true;
                        this.loading = false;
                    }, 100);

                    this.$emit('playing', event);
                },

                timeupdate: (event) => {
                    this.totalDuration = this.mediaElement.duration;
                    this.currentTime = this.mediaElement.currentTime;

                    this.$emit('timeupdate', event);
                },

                useractive: () => {
                    setTimeout(() => {
                        this.userActive = true;
                    }, 200);
                },

                userinactive: () => {
                    this.userActive = false;
                    this.closeDrawers();
                },

                ratechange: () => {
                    if (this.mediaElement.playbackRate !== 0) {
                        this.currentPlaybackRate = this.mediaElement.playbackRate;
                    }
                },

                seeking: () => {
                    this.loading = true;
                },

                seeked: () => {
                    this.loading = false;

                    if (this.hasBeenPlayed && !this.isChromeCastConnected) {
                        this.mediaElement.play();
                    }
                },

                enterpictureinpicture: () => {
                    this.isExperimentalPictureInPictureEnabled = true;
                },

                leavepictureinpicture: () => {
                    this.isExperimentalPictureInPictureEnabled = false;
                },

                ended: () => {
                    this.isPipEnabled = false;
                },
            },

            chromeCastEventHandlers: {
                time: (event) => {
                    if (this.chromeCast.Connected) {
                        this.currentTime = event.time || 0;
                    }

                    this.$emit('cc-time', event);
                },

                playOrPause: (event) => {
                    this.isPlaying = !event;

                    this.$emit('cc-playpause', event);
                },

                media: (event) => {
                    this.isPlaying = true;
                    this.isChromeCastConnected = true;

                    if (this.currentTime) {
                        this.seek(this.currentTime);
                    }

                    this.mediaElement.pause();
                    this.mediaElement.volume = 0;

                    this.$emit('cc-media', event);
                },

                disconnect: (event) => {
                    this.isChromeCastConnected = false;
                    this.isPlaying = true;
                    this.mediaElement.volume = this.currentVolume;

                    if (this.currentTime) {
                        this.seek(this.currentTime);
                        this.mediaElement.play();
                    }

                    this.$emit('cc-disconnect', event);
                },

                state: (event) => {
                    if (event === 'IDLE') {
                        this.chromeCast.disconnect();
                    }

                    this.$emit('cc-state', event);
                },
            },

            keyboardEventHandlers: {
                Space: () => this.playPause(),
                ArrowLeft: () => this.seek(this.currentTime - 5),
                ArrowRight: () => this.seek(this.currentTime + 5),
                Digit1: () => this.seek(this.totalDuration * 0.10),
                Digit2: () => this.seek(this.totalDuration * 0.20),
                Digit3: () => this.seek(this.totalDuration * 0.30),
                Digit4: () => this.seek(this.totalDuration * 0.40),
                Digit5: () => this.seek(this.totalDuration * 0.50),
                Digit6: () => this.seek(this.totalDuration * 0.60),
                Digit7: () => this.seek(this.totalDuration * 0.70),
                Digit8: () => this.seek(this.totalDuration * 0.80),
                Digit9: () => this.seek(this.totalDuration * 0.90),
                Digit0: () => this.seek(0),
                Home: () => this.seek(0),
                End: () => this.seek(this.totalDuration),
                KeyF: () => this.fullscreen(),
                Escape: () => (this.videojsInstance.isFullscreen ? this.fullscreen() : () => {}),
                ArrowUp: () => this.changeVolume({ volume: (this.currentVolume * 100) + 5 }),
                ArrowDown: () => this.changeVolume({ volume: (this.currentVolume * 100) - 5 }),
                KeyM: () => {
                    if (window.localStorage.getItem('isMuted') === null) {
                        window.localStorage.setItem('isMuted', true);
                        this.changeVolume({ volume: 0 }, false);
                    } else {
                        window.localStorage.removeItem('isMuted');
                        this.changeVolume({ volume: Number(window.localStorage.getItem('playerVolume') || 75) });
                    }
                },
                Minus: () => this.setRate({ rate: this.currentPlaybackRate - 0.25 }),
                Equal: () => this.setRate({ rate: this.currentPlaybackRate + 0.25 }),
            },
        };
    },
};
