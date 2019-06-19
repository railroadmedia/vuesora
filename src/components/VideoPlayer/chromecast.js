export default class ChromeCastPlugin {
    constructor(scope, receiver) {
        this.Scope = (scope) || 'tab_and_origin_scoped';
        this.Receiver = (receiver) || 'CC1AD845';
        this.Events = [];
        this.Available = false;
        this.Connected = false;
        this.Player = null;
        this.Controller = null;
        this.Session = null;
        this.Template = {
            content: null,
            poster: null,
            title: null,
            description: null,
            subtitles: [],
            time: 0,
            duration: 0,
            volume: 0.3,
            muted: false,
            paused: false,
            state: 'DISCONNECTED',
        };
        this.Media = this.Template;

        ChromeCastPlugin.loadChromeCastAPI().then((isAvailable) => {
            if (isAvailable) {
                this.Init();
            }
        });
    }

    // Define object methods
    on(event, callback) {
        this.Events[event] = callback;
    }

    cast(media, callback) {
        if (!media.content) {
            if (callback) {
                callback('No media content specified.');
            }
            return this.TriggerEvent('error', 'No media content specified.');
        }
        for (const key in media) {
            if (media.hasOwnProperty(key)) {
                this.Media[key] = media[key];
            }
        }
        cast.framework.CastContext.getInstance().requestSession().then(() => {
            if (callback) {
                callback(null);
            }
        }, (e) => {
            if (callback) {
                callback(e);
            }

            this.TriggerEvent('error', `ChromeCastPlugin.cast(): ${e}`);
        });
    }

    seek(time) {
        if (!this.Connected || !this.Player.canSeek) {
            return this.TriggerEvent('error', '.seek(): Not connected or can\'t seek');
        }
        this.Player.currentTime = time;
        this.Controller.seek();
    }

    volume(percentage) {
        if (!this.Connected || !this.Player.canControlVolume) {
            return this.TriggerEvent('error', '.volume(): Not connected or can\'t control volume');
        }
        this.Player.volumeLevel = percentage / 100;
        this.Controller.setVolumeLevel();
    }

    playOrPause() {
        if (!this.Connected || !this.Player.canPause) {
            return this.TriggerEvent('error', '.playOrPause(): Not connected or can\'t pause or play');
        }
        this.Controller.playOrPause();
    }

    muteOrUnmute() {
        if (!this.Connected || !this.Player.canControlVolume) {
            return this.TriggerEvent('error', '.muteOrUnmute(): Not connected or can\'t control volume');
        }
        this.Controller.muteOrUnmute();
    }

    changeSubtitle(index) {
        if (!this.Connected) {
            return this.TriggerEvent('error', '.changeSubtitle(): Not connected');
        }
        const activeTrackIds = index !== null ? [index] : [];

        const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(activeTrackIds);
        cast.framework.CastContext.getInstance().b.getSessionObj().media[0].editTracksInfo(tracksInfoRequest, null, null);
        for (let i = 0; i < this.Media.subtitles.length; i++) {
            this.Media.subtitles[i].active = false;

            if (index != null) {
                this.Media.subtitles[i].active = i === index;
            }
        }
    }

    disconnect() {
        cast.framework.CastContext.getInstance().endCurrentSession();
    }

    // Call event function
    TriggerEvent(event, args) {
        if (typeof this.Events[event] !== 'undefined') {
            if (typeof args !== 'undefined') {
                return this.Events[event](args);
            }
            this.Events[event]();
        }
    }

    // Initialize cast framework events
    Init() {
        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: this.Receiver,
            autoJoinPolicy: this.Scope,
        });
        this.Player = new cast.framework.RemotePlayer();
        this.Controller = new cast.framework.RemotePlayerController(this.Player);
        // Controller events
        this.Controller.addEventListener('isConnectedChanged', () => {
            this.IsConnectedChanged();
        });
        this.Controller.addEventListener('currentTimeChanged', () => {
            this.Media.time = this.Player.currentTime;
            this.TriggerEvent('time', {
                progress: this.Controller.getSeekPosition(this.Player.currentTime, this.Player.duration) || 0,
                time: this.Player.currentTime,
                duration: this.Controller.getFormattedTime(this.Player.duration),
            });
        });

        this.Controller.addEventListener('durationChanged', () => {
            this.Media.duration = this.Player.duration;
        });

        this.Controller.addEventListener('volumeLevelChanged', () => {
            this.Media.volume = (this.Player.volumeLevel * 100);
            this.TriggerEvent('volume', this.Media.volume);
        });

        this.Controller.addEventListener('isMutedChanged', () => {
            this.Media.muted = this.Player.isMuted;
            this.TriggerEvent('muteOrUnmute', this.Media.muted);
        });

        this.Controller.addEventListener('isPausedChanged', () => {
            this.Media.paused = this.Player.isPaused;
            this.TriggerEvent('playOrPause', this.Media.paused);
        });

        this.Controller.addEventListener('playerStateChanged', () => {
            if (this.Player.playerState !== 'IDLE') {
                this.Media.state = this.Player.playerState;
            } else {
                cast.framework.CastContext.getInstance().endCurrentSession();
                this.Controller.stop();
                this.Media = this.Template;
                this.Player.isMediaLoaded = false;
                this.Media.state = 'DISCONNECTED';
                this.TriggerEvent('disconnect');
            }
            this.TriggerEvent('state', this.Media.state);
        });

        this.Available = true;

        this.TriggerEvent('available');
    }

    IsConnectedChanged() {
        // Avoid bug in the cast framework not updating the Player object instantly
        setTimeout(() => {
            if (!this.Player.isConnected) {
                this.Connected = false;
                return;
            }
            this.Connected = true;
            this.TriggerEvent('connected');
            if (this.Player.isMediaLoaded && this.Player.playerState) {
                this.Media = {
                    content: this.Player.mediaInfo.contentId,
                    poster: this.Player.imageUrl || null,
                    title: this.Player.title || null,
                    description: this.Player.mediaInfo.metadata.subtitle || null,
                    subtitles: [],
                    time: this.Player.currentTime,
                    duration: this.Player.duration,
                    volume: this.Player.volumeLevel,
                    muted: this.Player.isMuted,
                    state: this.Player.playerState,
                };

                // Format loaded subtitles
                for (let i = 0; i < this.Player.mediaInfo.tracks.length; i++) {
                    if (this.Player.mediaInfo.tracks[i].type === 'TEXT') {
                        this.Media.subtitles.push({
                            active: false,
                            label: this.Player.mediaInfo.tracks[i].name,
                            srclang: this.Player.mediaInfo.tracks[i].language,
                            src: this.Player.mediaInfo.tracks[i].trackContentId,
                        });
                    }
                }

                // Update the active subtitle
                const activeTrackId = cast.framework.CastContext.getInstance().b.getSessionObj().media[0].activeTrackIds[0];
                if (activeTrackId && typeof this.Media.subtitles[activeTrackId] !== 'undefined') {
                    this.Media.subtitles[activeTrackId].active = true;
                }

                this.TriggerEvent('media', this.Media);
            } else {
                this.Session = cast.framework.CastContext.getInstance().getCurrentSession();
                if (this.Session && this.Media.content) {
                    const mediaInfo = new chrome.cast.media.MediaInfo(this.Media.content);
                    // mediaInfo.contentType = 'video/mp4' ??
                    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                    // The sexy subtitle support function <3
                    if (this.Media.subtitles.length > 0) {
                        mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
                        mediaInfo.textTrackStyle.fontFamily = 'Arial';
                        mediaInfo.textTrackStyle.foregroundColor = '#FFFFFF';
                        mediaInfo.textTrackStyle.backgroundColor = '#00000000';
                        mediaInfo.textTrackStyle.fontScale = '1.1';
                        mediaInfo.textTrackStyle.edgeColor = '#00000099';
                        mediaInfo.textTrackStyle.edgeType = chrome.cast.media.TextTrackEdgeType.DROP_SHADOW;
                        const tracks = [];
                        for (let i = 0; i < this.Media.subtitles.length; i++) {
                            const track = new chrome.cast.media.Track(i, chrome.cast.media.TrackType.TEXT);
                            track.trackContentId = this.Media.subtitles[i].src;
                            track.trackContentType = 'text/vtt';
                            track.subtype = chrome.cast.media.TextTrackType.CAPTIONS;
                            track.name = this.Media.subtitles[i].label;
                            track.language = this.Media.subtitles[i].srclang;
                            tracks.push(track);
                        }
                        mediaInfo.tracks = tracks;
                    }
                    if (this.Media.poster) {
                        mediaInfo.metadata.images = [{
                            url: this.Media.poster,
                        }];
                    }
                    if (this.Media.title) {
                        mediaInfo.metadata.title = this.Media.title;
                    }
                    if (this.Media.description) {
                        mediaInfo.metadata.subtitle = this.Media.description;
                    }
                    const request = new chrome.cast.media.LoadRequest(mediaInfo);
                    request.currentTime = this.Media.time;
                    request.autoplay = !this.Media.paused;
                    if (this.Media.subtitles.length > 0) {
                        for (let i = 0; i < this.Media.subtitles.length; i++) {
                            if (typeof this.Media.subtitles[i].active !== 'undefined' && this.Media.subtitles[i].active) {
                                request.activeTrackIds = [i];
                            }
                        }
                    }
                    this.Session.loadMedia(request).then(() => {
                        this.TriggerEvent('media', this.Media);
                    }, (e) => {
                        this.TriggerEvent('error', 'ChromeCastPlugin.cast():', e);
                    });
                }
            }
        }, 0);
    }

    static loadChromeCastAPI() {
        return new Promise((resolve) => {
            if (!document.getElementById('chromeCastAPI')) {
                const script = document.createElement('script');

                script.setAttribute('id', 'chromeCastAPI');
                script.setAttribute(
                    'src',
                    'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
                );

                document.body.appendChild(script);
            }

            window.__onGCastApiAvailable = (isAvailable) => {
                resolve(isAvailable);
            };
        });
    }
}
