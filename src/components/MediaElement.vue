<template>
    <div class="media-element" :id="themeColor + 'Theme'">
        <video v-if="sortedSourcesArray.length"
               :poster="poster"
               :id="elementId"
               data-cast-title="Recordeo Lesson"
               data-cast-description="This is a recordeo lesson"
               class="mejs__player" playsinline>

            <source v-for="(source, i) in sortedSourcesArray"
                    :key="i"
                    :src="source.file"
                    :data-quality="sourceQualityLabel(source.height)"
                    type="video/mp4">
        </video>

        <div v-else class="flex flex-row pv-5">
            <div class="flex flex-column align-center text-center">
                <h1 class="title text-white">
                    We're sorry, there was an issue finding this video.
                </h1>
                <h3 class="title text-white mb-2">
                    Please refresh the page to try again.
                </h3>
                <h6 class="tiny text-white">

                </h6>
                <h6 class="tiny text-white">
                    If the problem persists please contact support, either by clicking the chat widget
                    on the bottom of your screen, or by emailing
                    <a href="mailto:support@drumeo.com">support@drumeo.com</a>.
                </h6>
            </div>
        </div>

        <input id="currentTimeInSeconds" type="text" v-model="urlWithTimecode">
    </div>
</template>

<script>
    import 'mediaelement';
    import 'mediaelement/build/mediaelementplayer.min.css';
    import 'mediaelement-plugins/src/quality/quality';
    import 'mediaelement-plugins/src/quality/quality.css';
    import 'mediaelement-plugins/src/speed/speed';
    import 'mediaelement-plugins/src/speed/speed.css';
    import 'mediaelement-plugins/src/jump-forward/jump-forward';
    import 'mediaelement-plugins/src/jump-forward/jump-forward.css';
    import 'mediaelement-plugins/src/skip-back/skip-back';
    import 'mediaelement-plugins/src/skip-back/skip-back.css';
    import 'mediaelement-plugins/src/chromecast/chromecast';
    import 'mediaelement-plugins/src/chromecast/chromecast.css';
    import 'mediaelement-plugins/src/airplay/airplay';
    import 'mediaelement-plugins/src/airplay/airplay.css';
    import Utils from '../assets/js/classes/utils';
    import * as QueryString from 'query-string';
    import Toasts from '../assets/js/classes/toasts';

    export default {
        name: "media-element",
        data () {
            return {
                mediaElement: Object,
                player: Object,
                events: [
                    'loadedmetadata',
                    'progress',
                    'timeupdate',
                    'seeking',
                    'seeked',
                    'canplay',
                    'play',
                    'playing',
                    'pause',
                    'ended',
                    'volumechange',
                    'captionschange'
                ],
                contextMenu: false,
                currentTimeInSeconds: 0
            };
        },
        props: {
            elementId: {
                type: String,
                default: () => 'mediaElementPlayer'
            },
            sources: {
                type: Array,
                default: () => []
            },
            poster: {
                type: String,
                default: () => ''
            },
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            checkForTimecode: {
                type: Boolean,
                default: () =>  false
            }
        },
        computed: {
            sortedSourcesArray(){
                if(this.sources.length){

                    return this.sources.sort(
                        Utils.dynamicSort('-height')
                    );
                }

                return [];
            },

            urlWithTimecode(){
                return location.protocol + '//' + location.host + location.pathname + '?time=' + this.currentTimeInSeconds;
            },

            defaultQuality: {
                get(){
                    let defaultQuality = window.localStorage.getItem("defaultQuality");
                    let guessedQuality = this.sortedSourcesArray.filter(source =>
                        source.width <= window.innerWidth
                    );

                    // Pick a default quality based on the closest size to the client width
                    if((defaultQuality === undefined || defaultQuality === null)
                        && (this.sortedSourcesArray.length > 0)){

                        if(guessedQuality.length){
                            // If we have some guessed qualities take the first one
                            defaultQuality = this.sourceQualityLabel(
                                guessedQuality[0].height
                            );
                        }
                        else {
                            // Otherwise take the last item in the qualities array (the smallest quality)
                            defaultQuality = this.sourceQualityLabel(
                                this.sortedSourcesArray[this.sortedSourcesArray.length - 1].height
                            );
                        }
                    }
                    else {
                        let thisHeight = Number(defaultQuality.replace('p', ''));
                        let defaultExists = this.sortedSourcesArray.filter(source =>
                            source.height === thisHeight
                        ).length > 0;

                        if(!defaultExists){
                            if(guessedQuality.length){
                                // If we have some guessed qualities take the first one
                                defaultQuality = this.sourceQualityLabel(
                                    guessedQuality[0].height
                                );
                            }
                            else {
                                // Otherwise take the last item in the qualities array (the smallest quality)
                                defaultQuality = this.sourceQualityLabel(
                                    this.sortedSourcesArray[this.sortedSourcesArray.length - 1].height
                                );
                            }
                        }
                    }

                    return defaultQuality;
                },
                set(val){
                    window.localStorage.setItem("defaultQuality", val);
                }
            }
        },
        methods: {
            playVideo(){
                this.mediaElement.play();
            },

            pauseVideo(){
                this.mediaElement.pause();
            },

            emitEvent(event){
                if(event.type === 'timeupdate'){
                    this.currentTimeInSeconds = this.mediaElement.getCurrentTime();
                }

                this.$emit(event.type, event);
            },

            emitCustomEvent(event){
                const isQuality = Array.from(event.target.classList).indexOf('mejs__qualities-selector-input') !== -1;

                if(isQuality){
                    this.$emit('qualityChange', event);

                    this.defaultQuality = event.target.value;
                }

                event.target.blur();
            },

            addMediaElementEventListeners(mediaElement){
                const vm = this;

                vm.events.forEach((event) => {
                    mediaElement.addEventListener(event, vm.emitEvent);
                });
            },

            removeMediaElementEventListeners(mediaElement){
                const vm = this;

                vm.events.forEach((event) => {
                    mediaElement.removeEventListener(event, vm.emitEvent);
                });
            },

            sourceQualityLabel(height){
                if(height >= 2160){
                    return '4k'
                }

                return String(height) + 'p';
            },

            copyTimecodeToClipboard(){
                const timecode = document.getElementById('currentTimeInSeconds');

                timecode.select();
                document.execCommand('copy');
                timecode.blur();
                Toasts.success('Video url copied at current time!')
            }
        },
        created(){

        },
        mounted (){
            const vm = this;
            const urlParams = QueryString.parse(window.location.search);

            window.player = new MediaElementPlayer(vm.elementId, {
                defaultVideoWidth: 1280,
                defaultVideoHeight: 720,
                autosizeProgress: false,
                startVolume: 0.5,
                stretching: 'responsive',
                features: ['playpause', 'skipback', 'jumpforward', 'current', 'duration', 'progress', 'quality', 'speed', 'volume', 'chromecast', 'airplay', 'fullscreen'],
                jumpForwardInterval: 10,
                skipBackInterval: 10,
                speeds: ['0.5', '0.75', '1.00', '1.25', '1.5'],
                timeAndDurationSeparator: ' / ',
                defaultQuality: vm.defaultQuality,
                qualityText: 'Video Quality',
                success: (mediaElement, node, player) => {
                    vm.mediaElement = mediaElement;
                    vm.addMediaElementEventListeners(vm.mediaElement);

                    // Below code helps to fix the bug where the speed and
                    // quality selectors remain visible and bug out after clicking
                    // Still a work in progress
                    let interactionInputs = document.querySelectorAll('.mejs__qualities-selector-input, .mejs__speed-selector-input');
                    for(let i=0; i<interactionInputs.length; i++){
                        interactionInputs[i].addEventListener('change', this.emitCustomEvent);
                    }

                    player.container.addEventListener('touchstart', function () {
                        player.showControls();

                        if (!player.paused) {
                            player.startControlsTimer(player.options.controlsTimeoutMouseLeave);
                        }
                    });

                    if(this.checkForTimecode){

                        if(urlParams['time'] != null){
                            player.setCurrentTime(urlParams['time']);
                            player.load();
                        }
                    }

                    // Copy the current timecode if the user hits ctrl + shift + alt + c;
                    let keyMap = {};
                    onkeydown = onkeyup = function(e){
                        e = e || event;
                        keyMap[e.keyCode] = e.type === 'keydown';

                        if(keyMap[17] && keyMap[16] && keyMap[18] && keyMap[67]){
                            vm.copyTimecodeToClipboard();
                        }
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });
        },
        beforeDestroy () {
            const vm = this;

            vm.removeMediaElementEventListeners(vm.mediaElement);
            window.player.remove();
        }
    };
</script>

<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    @each $key, $value in $brand_colors {
        ##{$key}Theme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
    }
    @each $key, $value in $content_colors {
        ##{$key}Theme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
        ##{$key}sTheme {
            .mejs__time-current { background:$value; }
            .mejs__speed-selected, .mejs__qualities-selected { color:$value; }
        }
    }

    .media-element {

        .mejs__controls {
            height:96px;
        }

        .mejs__time-rail {
            position:absolute;
            bottom:4em;
            left:0;
            right:0;
            width:100%;
            box-sizing:border-box;
            padding:1em 1em 0;
            margin:0;
            height:16px;

            .mejs__time-total {
                width:calc(100% - 2em);
                height:6px;
                margin-top:0;
            }

            .mejs__time-current {
                background:#0b76db;
            }

            .mejs__time-buffering, .mejs__time-current, .mejs__time-hovered, .mejs__time-loaded {
                height:6px;
            }

            .mejs__time-handle, .mejs__time-handle-content {
                display:none;
            }
        }

        .mejs__skip-back-button {
            position:absolute;
            bottom:5em;
            left:1em;
        }

        .mejs__jump-forward-button {
            position:absolute;
            bottom:5em;
            right:1em;
        }

        .mejs__playpause-button {
            position:absolute;
            bottom:0;
            left:1em;
        }

        .mejs__time {
            position:absolute;
            bottom:0;
            left:5em;
        }

        .mejs__fullscreen-button {
            position:absolute;
            bottom:0;
            right:1em;
        }

        .mejs__volume-button {
            position:absolute;
            bottom:0;
            left:14.5em;
        }

        .mejs__chromecast-button,
        .mejs__airplay-button {
            position:absolute;
            bottom:0;
            right:14em;
        }

        .mejs__speed-button {
            position:absolute;
            bottom:0;
            right:5.5em;

            button {
                font-weight:700;
                font-family:'Open Sans', sans-serif;
            }

            .mejs__speed-selector {
                height:125px;

                .mejs__speed-selector-list-item {
                    margin:0;
                    padding:3px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4) !important;
                    }
                }
                .mejs__speed-selector-label {
                    font-weight:700;
                    font-family:'Open Sans', sans-serif;
                    margin-left:5px;

                    &.mejs__speed-selected {
                        color:#0b76db;
                    }
                }
            }
        }

        .mejs__qualities-button {
            position:absolute;
            bottom:0;
            right:10em;

            button {
                font-weight:700;
                font-family:'Open Sans', sans-serif;
            }

            .mejs__qualities-selector {

                .mejs__qualities-selector-list-item {
                    margin:0;
                    padding:3px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4) !important;
                    }
                }
                .mejs__qualities-selector-label {
                    font-weight:700;
                    font-family:'Open Sans', sans-serif;
                    margin-left:5px;

                    &.mejs__qualities-selected {
                        color:#0b76db;
                    }
                }
            }
        }
    }

    #currentTimeInSeconds {
        opacity:0;
        position:absolute;
        top:-9999px;
        left:-9999px;
    }
</style>
