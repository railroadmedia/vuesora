export default class ChromeCastPlugin {
    constructor(){
        this.chromeCast = null;
        this.castSession = null;
        this.mediaInfo = null;
        this.remotePlayer = null;
        this.remotePlayerController = null;

        this.init().then(() => {
            console.log(this.chromeCast);
            console.log(this.castSession);
        });
    };

    async init(){
        const apiAvailable = await ChromeCastPlugin.loadChromeCastAPI();

        if(apiAvailable){
            await this.initializeCastApi(cast);
            await this.getCastSession();
        }
    }

    async initializeCastApi(cast){
        this.chromeCast = cast;

        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });
    }

    async getCastSession(){
        this.castSession = this.chromeCast.framework.CastContext.getInstance().getCurrentSession();
    }

    async loadMedia(currentSource, contentType){
        this.mediaInfo = new chrome.cast.media.MediaInfo(currentSource, contentType);
        const request = new chrome.cast.media.LoadRequest(this.mediaInfo);

        return await this.castSession.loadMedia(request);
    }

    loadRemotePlayer(){
        this.remotePlayer = new cast.framework.RemotePlayer();
        this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);

        this.remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, () => {
                if (!this.remotePlayer.isConnected) {
                    this.endSession();
                }
            });
    }

    endSession(){
        this.castSession.endSession(true);
    }

    static loadChromeCastAPI(){

        return new Promise(resolve => {
            if(!document.getElementById('chromeCastAPI')){
                const script = document.createElement('script');

                script.setAttribute('id', 'chromeCastAPI');
                script.setAttribute(
                    'src',
                    'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
                );

                document.body.appendChild(script);
            }

            window['__onGCastApiAvailable'] = (isAvailable) => {
                resolve(isAvailable);
            };
        });
    }
}