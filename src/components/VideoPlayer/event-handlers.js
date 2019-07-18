export default {
    data() {
        return {
            eventHandlers: {
                canplaythrough: (event) => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$emit('canplaythrough', event);
                    }, 500);
                },

                loading: () => {
                    this.loading = true;
                },

                onstatechange: (event) => {
                    if (event.state === 'load') {
                        this.loading = false;
                    }
                },

                error: (event) => {
                    console.error(event);

                    if (event.severity === 2) {
                        this.playerError = true;
                        this.playerErrorCode = event.code;
                    }
                },

                buffering: (event) => {
                    this.loading = event.buffering;
                },
            },

            mediaElementEventHandlers: {
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

                    this.$emit('play', {
                        ...event,
                        contentId: this.contentId,
                    });
                },

                playing: (event) => {
                    this.isPlaying = true;
                    this.loading = false;

                    this.$emit('playing', event);
                },

                timeupdate: (event) => {
                    this.totalDuration = this.mediaElement.duration;
                    this.currentTime = this.mediaElement.currentTime;

                    this.$emit('timeupdate', event);
                },

                error: (event) => {
                    console.error(event);

                    console.log('this one?');
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
            },

            chromeCastEventHandlers: {
                time: (event) => {
                    this.currentTime = event.time || 0;

                    this.$emit('cc-time', event);
                },

                playOrPause: (event) => {
                    this.isPlaying = !event;

                    this.$emit('cc-playpause', event);
                },

                media: (event) => {
                    this.isPlaying = true;
                    this.isChromeCastConnected = true;

                    this.mediaElement.pause();

                    if (this.currentTime) {
                        this.seek(this.currentTime);
                    }

                    this.$emit('cc-media', event);
                },

                disconnect: (event) => {
                    this.isChromeCastConnected = false;
                    this.isPlaying = true;

                    if (this.currentTime) {
                        this.seek(this.currentTime);
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
                ArrowLeft: () => this.seek(this.currentTime - 10),
                ArrowRight: () => this.seek(this.currentTime + 10),
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
                KeyM: () => (this.currentVolume === 0
                    ? this.changeVolume({ volume: Number(window.localStorage.getItem('playerVolume') || 75) })
                    : this.changeVolume({ volume: 0 })),
                Minus: () => this.setRate({ rate: this.currentPlaybackRate - 0.25 }),
                Equal: () => this.setRate({ rate: this.currentPlaybackRate + 0.25 }),
            },
        };
    },
};
