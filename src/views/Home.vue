<template>
    <div class="container">
        <div class="video-container">
            <media-element
                    :sources="sources"
                    poster="https://i.vimeocdn.com/video/682408925_1280x720.jpg"
                    @play="handlePlayEvent"/>
        </div>

        <div class="flex flex-row flex-wrap">
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                1
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                2
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                3
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                4
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                5
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                6
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                7
            </div>
            <div class="flex flex-column xs-12 sm-6 md-4 lg-3 xl-2">
                8
            </div>
        </div>
    </div>
</template>

<script>
    import MediaElement from "@/components/MediaElement.vue";

    export default {
        name: "home",
        data() {
            return {
                sources: [
                    {
                        quality: "1080p",
                        file: "https://player.vimeo.com/external/255087433.hd.mp4?s=41e2cf6a03299ea200bfd7d8a7005b672055a137&profile_id=175"
                    },
                    {
                        quality: "720p",
                        file: "https://player.vimeo.com/external/255087433.hd.mp4?s=41e2cf6a03299ea200bfd7d8a7005b672055a137&profile_id=174"
                    },
                    {
                        quality: "540p",
                        file: "https://player.vimeo.com/external/255087433.sd.mp4?s=a0651e42d2e29f0499eea999ee773f05c2d4c437&profile_id=165"
                    }
                ]
            }
        },
        components: {
            "media-element": MediaElement
        },
        methods: {
            handlePlayEvent(e) {

            }
        }
    };
</script>

<style lang="scss">

    .video-container {
        width: 100%;
        max-width: 960px;
        margin: 0 auto;
    }
</style>
