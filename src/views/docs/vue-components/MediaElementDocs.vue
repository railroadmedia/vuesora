<template>
    <div class="container pt-3">
        <h1 class="heading text-center">Media Element</h1>
        <p class="body font-light mb-3 text-center">A Custom Video Player extending the MediaElement.js library.</p>

        <div class="video-container">
            <media-element
                    :sources="sources"
                    poster="https://dmmior4id2ysr.cloudfront.net/assets/docs/poster.jpg"/>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">Props</h2>

            <table class="body">
                <thead class="bg-primary text-white">
                <tr>
                    <td class="pa-1 corners-top-5">Prop</td>
                    <td class="pa-1 corners-top-5">Required</td>
                    <td class="pa-1 corners-top-5">Type</td>
                    <td class="pa-1 corners-top-5">Default</td>
                    <td class="pa-1 corners-top-5">Description</td>
                </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">elementId</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">'mediaElementPlayer'</td>
                    <td class="pa-1">The ID of the HTML5 video element</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">sources</td>
                    <td class="pa-1">Yes</td>
                    <td class="pa-1">Array</td>
                    <td class="pa-1">[ ]</td>
                    <td class="pa-1">An array of sources with 3 properties, <span class="keyword">file</span>, <span class="keyword">height</span>, and <span class="keyword">width</span>. (The default object of sources pulled from Vimeo)</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">poster</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">' '</td>
                    <td class="pa-1">The poster image to be displayed before the video begins playback.</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">brand</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">'recordeo'</td>
                    <td class="pa-1">The brand string, affects the color theme of the player</td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">Events</h2>

            <table class="body">
                <thead class="bg-primary text-white">
                <tr>
                    <td class="pa-1 corners-top-5">Event</td>
                    <td class="pa-1 corners-top-5">Description</td>
                </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">loadedmetadata</td>
                    <td class="pa-1">Fired when all video meta data is loaded</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">progress</td>
                    <td class="pa-1">Fired whenever the players state is 'playing' and the time is updated</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">timeupdate</td>
                    <td class="pa-1">Fired for any update to the current time</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">seeking</td>
                    <td class="pa-1">Fired when the user begins seeking and video starts buffering at the new time</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">seeked</td>
                    <td class="pa-1">Fired when the user seeks to a spot in the video and the video finishes buffering at the new time</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">canplay</td>
                    <td class="pa-1">Fired when the video has finished buffering enough to allow for smooth playback</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">play</td>
                    <td class="pa-1">Fired whenever the playback starts for any reason</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">playing</td>
                    <td class="pa-1">Fired incrementally while playback is playing</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">pause</td>
                    <td class="pa-1">Fired whenever the playback stops for any reason</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">ended</td>
                    <td class="pa-1">Fired on the last frame of playback</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">volumechange</td>
                    <td class="pa-1">Fired whenever a change is made to the player volume</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">captionschange</td>
                    <td class="pa-1">Fired whenever the closed captions change</td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mb-4">
            <h2 class="subheading text-secondary mb">Usage</h2>

            <h4 class="title text-secondary">Vue</h4>
            <v-embed id="MediaElementVue" class="mb-3">
                https://gist.github.com/CurtisConway/c0dbf0938799ecd9ef7c4379484f6a68
            </v-embed>

            <h4 class="title text-secondary">Raw JS/HTML</h4>
            <v-embed id="MediaElementJS">
                https://gist.github.com/CurtisConway/990746659e273860808d078202e7b0d3
            </v-embed>
        </div>
    </div>
</template>

<script>
    import VEmbed from 'vue-embed';
    import MediaElement from "@/components/MediaElement.vue";

    export default {
        name: "home",
        props: {

        },
        data() {
            return {
                sources: [
                    {
                        file: "https://dmmior4id2ysr.cloudfront.net/assets/docs/Splash_Short_Version_4K.mp4",
                        height: 2160,
                        width: 3840
                    },
                    {
                        file: "https://dmmior4id2ysr.cloudfront.net/assets/docs/Splash_Short_Version_1080.mp4",
                        height: 1080,
                        width: 1920
                    },
                    {
                        file: "https://dmmior4id2ysr.cloudfront.net/assets/docs/Splash_Short_Version_720.mp4",
                        height: 720,
                        width: 1280
                    },
                    {
                        file: "https://dmmior4id2ysr.cloudfront.net/assets/docs/Splash_Short_Version_540.mp4",
                        height: 540,
                        width: 960
                    }
                ]
            }
        },
        components: {
            "media-element": MediaElement,
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
