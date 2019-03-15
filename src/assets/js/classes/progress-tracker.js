export default class ProgressTracker {
    constructor(){
        this.tickInterval = 0;
        this.secondsWatched = 0;
    }

    startTimer(){
        this.tickInterval = this.progressInterval();
    }

    stopTimer(){
        clearInterval(this.tickInterval);
    }

    progressInterval(){
        return setInterval( () => {
            this.secondsWatched++;
        }, 1000);
    }

    sendProgress(endpoint, currentWatchPosition = 0){
        const data = new FormData();

        data.append('seconds_watched', this.secondsWatched);

        if(currentWatchPosition){
            data.append('watch_position', currentWatchPosition);
        }

        navigator.sendBeacon(endpoint, data);
    }
}