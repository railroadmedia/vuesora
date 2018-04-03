<template>
    <div class="container">
        <h1>Media Element</h1>

        <div class="video-container">
            <media-element
                    :sources="sources"
                    poster="https://i.vimeocdn.com/video/682408925_1280x720.jpg"
                    @play="handlePlayEvent"/>
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
        /*max-width: 960px;*/
        margin: 0 auto;
    }
</style>
