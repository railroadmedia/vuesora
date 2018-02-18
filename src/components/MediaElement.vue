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
                features: ['playpause', 'skipback', 'jumpforward', 'current', 'progress', 'duration', 'quality', 'volume', 'fullscreen'],
                jumpForwardInterval: 10,
                skipBackInterval: 10,
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
        .mejs__time-buffering, .mejs__time-current, .mejs__time-hovered, .mejs__time-loaded {
            height:6px;
        }
        .mejs__time-handle, .mejs__time-handle-content {
            display:none;
        }
    }
</style>
