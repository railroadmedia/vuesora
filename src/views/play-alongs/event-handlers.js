export default {
    data() {
        return {
            eventHandlers: {
                timeupdate: () => {
                    this.currentTime = this.audioPlayer.currentTime;

                    if (this.loop) {
                        const startAnchor = (this.anchorOffsets.a / 100) * this.totalDuration;
                        const endAnchor = (this.anchorOffsets.b / 100) * this.totalDuration;

                        if (this.currentTime > endAnchor || this.currentTime < startAnchor) {
                            this.seek(startAnchor);
                        }
                    }

                    // If we haven't played the track yet add it to the playedContent list
                    if (!this.playedContent.find(content => content.id === this.activeItem.id)) {
                        this.playedContent.push({
                            id: this.activeItem.id,
                            page: this.page,
                        });
                    }

                    // If shuffle is active we prefetch the next page of content and save the current ID
                    // in case a user wants to navigate back
                    if (this.isShuffle && this.preFetchedContent === null && this.totalPages > 1) {
                        this.preFetchContent(this.getRandomPageNumber());
                    }
                },

                ended: () => {
                    this.playNextTrack();
                },

                durationchange: () => {
                    this.totalDuration = this.audioPlayer.duration;
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
                Minus: () => this.setRate(this.currentPlaybackRate - 0.25),
                Equal: () => this.setRate(this.currentPlaybackRate + 0.25),
            },
        };
    },
};
