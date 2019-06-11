export default {
    data(){
        return {
            videoJsEventHandlers: {
                'canplaythrough': event => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$emit('canplaythrough', event);
                    }, 500);
                },

                'loadeddata': event => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$emit('loadeddata', event);
                    }, 500);
                },

                'durationchange': event => {
                    this.totalDuration = this.videojsInstance.duration();

                    this.$emit('durationchange', event);
                },

                'waiting': event => {
                    this.loading = true;
                    this.isPlaying = false;

                    this.$emit('waiting', event);
                },

                'pause': event => {
                    this.isPlaying = false;

                    this.$emit('pause', event);
                },

                'play': event => {
                    this.isPlaying = true;
                    this.loading = false;

                    this.$emit('playing', event);
                },

                'playing': event => {
                    this.isPlaying = true;
                    this.loading = false;

                    this.$emit('playing', event);
                },

                'timeupdate': event => {
                    this.totalDuration = this.videojsInstance.duration();
                    this.currentTime = this.videojsInstance.currentTime();

                    this.isPlaying = true;

                    this.$emit('timeupdate', event);
                },

                'error': event => {
                    console.log(event);
                },

                'useractive': () => {
                    this.userActive = true;
                },

                'userinactive': () => {
                    this.userActive = false;
                    this.closeDrawers();
                },
            },

            chromeCastEventHandlers: {
                'time': event => {
                    this.currentTime = event.time || 0;

                    this.$emit('cc-time', event);
                },

                'playOrPause': event => {
                    this.isPlaying = !event;

                    this.$emit('cc-playpause', event);
                },

                'media': event => {
                    this.isPlaying = true;
                    this.isChromeCastConnected = true;

                    this.videojsInstance.pause();
                    if(this.videojsInstance.isFullscreen()){
                        this.videojsInstance.exitFullscreen();
                        this.videojsInstance.isFullscreen(false);
                    }

                    const currentCaptions = this.captions.filter(caption => caption.language === this.currentCaptions);
                    if(currentCaptions.length){
                        this.enableCaptions(currentCaptions[0]);
                    }

                    if(this.currentTime){
                        this.seek(this.currentTime);
                    }

                    this.$emit('cc-media', event);
                },

                'disconnect': event => {
                    this.isChromeCastConnected = false;
                    this.isPlaying = true;

                    if(this.currentTime){
                        this.seek(this.currentTime);
                    }

                    this.$emit('cc-disconnect', event);
                },

                'state': event => {
                    if(event === 'IDLE'){
                        this.chromeCast.disconnect();
                    }

                    this.$emit('cc-state', event);
                }
            },

            keyboardEventHandlers: {
                "Space": () => this.playPause(),
                "ArrowLeft": () => this.seek(this.currentTime - 10),
                "ArrowRight": () => this.seek(this.currentTime + 10),
                "Digit1": () => this.seek(this.totalDuration * .10),
                "Digit2": () => this.seek(this.totalDuration * .20),
                "Digit3": () => this.seek(this.totalDuration * .30),
                "Digit4": () => this.seek(this.totalDuration * .40),
                "Digit5": () => this.seek(this.totalDuration * .50),
                "Digit6": () => this.seek(this.totalDuration * .60),
                "Digit7": () => this.seek(this.totalDuration * .70),
                "Digit8": () => this.seek(this.totalDuration * .80),
                "Digit9": () => this.seek(this.totalDuration * .90),
                "Digit0": () => this.seek(0),
                "Home": () => this.seek(0),
                "End": () => this.seek(this.totalDuration),
                "KeyF": () => this.fullscreen(),
                "Escape": () => this.videojsInstance.isFullscreen ? this.fullscreen() : () => {},
                "ArrowUp": () => this.changeVolume({volume: (this.currentVolume * 100) + 5}),
                "ArrowDown": () => this.changeVolume({volume: (this.currentVolume * 100) - 5}),
                "KeyM": () => this.currentVolume === 0 ?
                    this.changeVolume({volume: Number(window.localStorage.getItem('playerVolume') || 75)}) :
                    this.changeVolume({volume: 0}),
                "Minus": () => this.setRate({rate: this.currentPlaybackRate - 0.25}),
                "Equal": () => this.setRate({rate: this.currentPlaybackRate + 0.25}),
            }
        }
    }
}