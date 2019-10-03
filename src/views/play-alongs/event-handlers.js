import Toasts from '../../assets/js/classes/toasts';

export default {
    data() {
        return {
            eventHandlers: {
                timeupdate: () => {
                    this.currentTime = this.audioPlayer.currentTime;

                    if (this.loop) {
                        const startAnchor = (this.anchorOffsets.a / 100) * this.totalDuration;
                        const endAnchor = (this.anchorOffsets.b / 100) * this.totalDuration;

                        if (this.currentTime > (endAnchor + 0.1) || this.currentTime < (startAnchor - 0.1)) {
                            this.seek(startAnchor);

                            this.$nextTick(() => {
                                this.audioPlayer.play();
                            });
                        }
                    }
                },

                error: (event) => {
                    if (event.target.error.code === 4) {
                        Toasts.push({
                            icon: 'doh',
                            title: 'TRACK MISSING',
                            themeColor: this.themeColor,
                            message: 'We\'re sorry, the track you tried to play couldn\'t be found.',
                            timeout: 10000,
                        });
                    }
                },

                ended: () => {
                    this.playNextTrack();
                },

                durationchange: () => {
                    this.totalDuration = this.audioPlayer.duration;
                },

                pause: (event) => {
                    this.$emit('pause', {
                        ...event,
                    });
                },

                play: (event) => {
                    this.$emit('play', {
                        ...event,
                    });
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
                ArrowUp: () => this.changeVolume((this.currentVolume * 100) + 5),
                ArrowDown: () => this.changeVolume((this.currentVolume * 100) - 5),
                KeyM: () => (
                    this.currentVolume === 0
                        ? this.changeVolume(Number(window.localStorage.getItem('playAlongsVolume') || 75))
                        : this.changeVolume(0)
                ),
            },
        };
    },
};
