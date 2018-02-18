<template>
    <div class="media-element">
        <video :poster="poster"
               :id="playerId"
               class="mejs__player">
            
            <source v-for="(source, i) in sources"
                    :key="i"
                    :src="source.file"
                    :data-quality="source.quality"
                    type="video/mp4">
        </video>
    </div>
</template>

<script>
    import 'mediaelement/full';
    import 'mediaelement/build/mediaelementplayer.min.css';
    import 'mediaelement-plugins/src/quality/quality';
    import 'mediaelement-plugins/src/quality/quality.css';
    import 'mediaelement-plugins/src/speed/speed';
    import 'mediaelement-plugins/src/speed/speed.css';
    import 'mediaelement-plugins/src/jump-forward/jump-forward';
    import 'mediaelement-plugins/src/jump-forward/jump-forward.css';
    import 'mediaelement-plugins/src/skip-back/skip-back';
    import 'mediaelement-plugins/src/skip-back/skip-back.css';

    export default {
        name: "media-element",
        data () {
            return {

            };
        },
        props: {
            playerId: {
                type: String,
                default () {
                    return 'mediaElementPlayer';
                }
            },
            sources: Array,
            poster: String
        },
        methods: {
            addMediaElementEventListeners(mediaElement){
                const vm = this;

                let events = [
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
                ];

                events.forEach((event) => {

                    mediaElement.addEventListener(event, (payload) => {
                        vm.$emit(event, payload);
                    });
                });
            }
        },
        mounted (){
            const vm = this;

            let player = new MediaElementPlayer(vm.playerId, {
                defaultVideoWidth: 1280,
                defaultVideoHeight: 720,
                autosizeProgress: false,
                stretching: 'responsive',
                features: ['playpause', 'skipback', 'jumpforward', 'current', 'duration', 'progress', 'quality', 'speed', 'volume', 'fullscreen'],
                jumpForwardInterval: 10,
                skipBackInterval: 10,
                speeds: ['0.5', '0.75', '1.00', '1.25', '1.5'],
                timeAndDurationSeparator: ' / ',
                qualityText: 'Video Quality',
                success: (mediaElement) => {
                    vm.addMediaElementEventListeners(mediaElement);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    };
</script>

<style lang="scss">

    .media-element {
        .mejs__time-rail {
            position:absolute;
            bottom:2em;
            left:0;
            right:0;
            width:100%;
            box-sizing:border-box;
            padding:1em 1em 0;
            margin:0;

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
