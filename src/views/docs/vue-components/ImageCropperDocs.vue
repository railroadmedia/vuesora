<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">Image Cropper</h1>
        <p class="body font-light mb-3 text-center">A custom image cropper extending and combining the Cropperjs and Dropzone libraries.</p>

        <div class="video-container">
            <image-cropper></image-cropper>
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
                    <td class="pa-1 font-bold">brand</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">'recordeo'</td>
                    <td class="pa-1">The brand string, affects the color theme of the component</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">uploadEndpoint</td>
                    <td class="pa-1">Yes</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">''</td>
                    <td class="pa-1">The endpoint to upload the image to</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import VEmbed from 'vue-embed';
    import ImageCropper from "@/components/ImageCropper.vue";

    export default {
        name: "image-cropper-docs",
        props: {

        },
        data() {
            return {

            }
        },
        components: {
            "image-cropper": ImageCropper,
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
