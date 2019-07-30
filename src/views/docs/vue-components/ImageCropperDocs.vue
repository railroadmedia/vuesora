<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">
            Image Cropper
        </h1>
        <p class="body font-light mb-3 text-center">
            A custom image cropper extending and combining the Cropperjs and Dropzone libraries.
        </p>

        <div class="video-container">
            <image-cropper></image-cropper>
        </div>


        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">
                Props
            </h2>

            <table class="body">
                <thead class="bg-primary text-white">
                    <tr>
                        <td class="pa-1 corners-top-5">
                            Prop
                        </td>
                        <td class="pa-1 corners-top-5">
                            Required
                        </td>
                        <td class="pa-1 corners-top-5">
                            Type
                        </td>
                        <td class="pa-1 corners-top-5">
                            Default
                        </td>
                        <td class="pa-1 corners-top-5">
                            Description
                        </td>
                    </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        brand
                    </td>
                    <td class="pa-1">
                        No
                    </td>
                    <td class="pa-1">
                        String
                    </td>
                    <td class="pa-1">
                        'recordeo'
                    </td>
                    <td class="pa-1">
                        The brand string, affects the color theme of the component
                    </td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        uploadEndpoint
                    </td>
                    <td class="pa-1">
                        Yes
                    </td>
                    <td class="pa-1">
                        String
                    </td>
                    <td class="pa-1 font-italic">
                        null
                    </td>
                    <td class="pa-1">
                        The endpoint to upload the image to
                    </td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        saveEndpoint
                    </td>
                    <td class="pa-1">
                        Yes
                    </td>
                    <td class="pa-1">
                        String
                    </td>
                    <td class="pa-1 font-italic">
                        null
                    </td>
                    <td class="pa-1">
                        The endpoint used to save the image somewhere
                    </td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        userId
                    </td>
                    <td class="pa-1">
                        No
                    </td>
                    <td class="pa-1">
                        String|Number
                    </td>
                    <td class="pa-1 font-italic">
                        null
                    </td>
                    <td class="pa-1">
                        Only controls the server side file name
                    </td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        fieldKey
                    </td>
                    <td class="pa-1">
                        No
                    </td>
                    <td class="pa-1">
                        String
                    </td>
                    <td class="pa-1">
                        'profile_picture_image_url'
                    </td>
                    <td class="pa-1">
                        The db column name (key) to save the image as
                    </td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">
                Events
            </h2>

            <table class="body">
                <thead class="bg-primary text-white">
                    <tr>
                        <td class="pa-1 corners-top-5">
                            Event
                        </td>
                        <td class="pa-1 corners-top-5">
                            Description
                        </td>
                    </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">
                        imageSaved
                    </td>
                    <td class="pa-1">
                        Fired when the image is finished uploading to s3 and hits the saveEndpoint
                    </td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mb-4">
            <h2 class="subheading text-secondary mb">
                Usage
            </h2>

            <h4 class="title text-secondary">
                Raw JS/HTML
            </h4>
            <v-embed
                id="imageCropperJs"
                class="mb-3"
            >
                https://gist.github.com/CurtisConway/e7dadf6dee3ccc0a05548a6ecde1f61e.js
            </v-embed>
        </div>
    </div>
</template>

<script>
import VEmbed from 'vue-embed';
import ImageCropper from '@/components/ImageCropper.vue';

export default {
    name: 'ImageCropperDocs',
    components: {
        'image-cropper': ImageCropper,
        'v-embed': VEmbed,
    },
    props: {

    },
    data() {
        return {

        };
    },
};
</script>

<style lang="scss">

    .video-container {
        width: 100%;
        margin: 0 auto;
    }
</style>
