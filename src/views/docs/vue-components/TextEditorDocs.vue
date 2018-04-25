<template>
    <div class="container pt-3">
        <h1 class="heading text-center">Text Editor</h1>
        <p class="body font-light mb-3 text-center">A Custom WYSIWYG editor extending the TinyMCE library.</p>

        <text-editor></text-editor>
    </div>
</template>

<script>
    import VEmbed from 'vue-embed';
    import TextEditor from "@/components/TextEditor.vue";

    export default {
        name: "home",
        props: {

        },
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
            "text-editor": TextEditor,
            "v-embed": VEmbed
        }
    };
</script>

<style lang="scss">

    .video-container {
        width: 100%;
        margin: 0 auto;
    }
</style>
