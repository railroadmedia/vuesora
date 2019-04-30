export default {
    data(){
        return {
            videoJsEventHandlers: {
                'canplaythrough': event => {
                    this.$emit('canplaythrough');

                    setTimeout(() => {
                        this.loading = false;
                        this.emit('canplaythrough', event);
                    }, 500);
                },

                'loadeddata': event => {
                    if (this.hlsInstance) {
                        this.setQuality({index: this.getDefaultPlaybackQualityIndex()});
                    }

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

                    this.$emit('waiting', event);
                },

                'paused': event => {
                    this.isPlaying = false;

                    this.$emit('paused', event);
                },

                'playing': event => {
                    this.isPlaying = true;
                    this.loading = false;

                    this.$emit('playing', event);
                },

                'timeupdate': event => {
                    this.totalDuration = this.videojsInstance.duration();
                    this.currentTime = this.videojsInstance.currentTime();

                    this.emit('timeupdate', event);
                },

                'userinactive': this.closeDrawers
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
        }
    }
}