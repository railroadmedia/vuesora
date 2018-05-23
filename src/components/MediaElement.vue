<template>
    <div class="media-element" :id="brand + 'Theme'">
        <video :poster="poster"
               :id="elementId"
               class="mejs__player">

            <source v-for="(source, i) in sortedSourcesArray"
                    :key="i"
                    :src="source.file"
                    :data-quality="sourceQualityLabel(source.height)"
                    type="video/mp4">
        </video>
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
    import Utils from '../assets/js/classes/utils';

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
                ]
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
            }
        },
        computed: {
            sortedSourcesArray(){
                return this.sources.sort(
                    Utils.dynamicSort('-height')
                );
            },

            defaultQuality: {
                get(){
                    let defaultQuality = window.localStorage.getItem("defaultQuality");

                    // Pick a default quality based on the closest size to the client width
                    if(defaultQuality === undefined || defaultQuality === null){
                        let guessedQuality = this.sortedSourcesArray.filter(source =>
                            source.width <= window.innerWidth
                        )[0].height;

                        defaultQuality = this.sourceQualityLabel(guessedQuality);
                    }

                    return defaultQuality;
                },
                set(val){
                    window.localStorage.setItem("defaultQuality", val);
                }
            }
        },
        methods: {
            emitEvent(event){
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
            }
        },
        created(){
            this.$on('qualityChange', event => {
                console.log(event.target.value);
            })
        },
        mounted (){
            const vm = this;

            window.player = new MediaElementPlayer(vm.elementId, {
                defaultVideoWidth: 1280,
                defaultVideoHeight: 720,
                autosizeProgress: false,
                stretching: 'responsive',
                features: ['playpause', 'skipback', 'jumpforward', 'current', 'duration', 'progress', 'quality', 'speed', 'volume', 'fullscreen'],
                jumpForwardInterval: 10,
                skipBackInterval: 10,
                speeds: ['0.5', '0.75', '1.00', '1.25', '1.5'],
                timeAndDurationSeparator: ' / ',
                defaultQuality: vm.defaultQuality,
                qualityText: 'Video Quality',
                success: (mediaElement) => {
                    vm.mediaElement = mediaElement;
                    vm.addMediaElementEventListeners(vm.mediaElement);

                    // Below code helps to fix the bug where the speed and
                    // quality selectors remain visible and bug out after clicking
                    // Still a work in progress
                    let interactionInputs = document.querySelectorAll('.mejs__qualities-selector-input, .mejs__speed-selector-input');
                    for(let i=0; i<interactionInputs.length; i++){
                        interactionInputs[i].addEventListener('change', this.emitCustomEvent);
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

    #drumeoTheme {
        .mejs__time-current { background:$drumeoBlue; }
        .mejs__speed-selected, .mejs__qualities-selected { color:$drumeoBlue; }
    }
    #pianoteTheme {
        .mejs__time-current { background:$pianoteRed; }
        .mejs__speed-selected, .mejs__qualities-selected { color:$pianoteRed; }
    }
    #guitareoTheme {
        .mejs__time-current { background:$guitareoGreen; }
        .mejs__speed-selected, .mejs__qualities-selected { color:$guitareoGreen; }
    }
    #recordeoTheme {
        .mejs__time-current { background:$recordeoYellow; }
        .mejs__speed-selected, .mejs__qualities-selected { color:$recordeoYellow; }
    }

    .media-element {
        
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

        .mejs__volume-button {
            position:absolute;
            bottom:0;
            left:5em;
        }

        .mejs__time {
            position:absolute;
            bottom:0;
            left:8.5em;
        }

        .mejs__fullscreen-button {
            position:absolute;
            bottom:0;
            right:1em;
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
</style>
