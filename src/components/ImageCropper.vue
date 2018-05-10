<template>
    <div class="image-processor bg-white">
        <div v-show="!hasFileToCrop"
             class="image-uploader ba-light-1 corners-3 bg-white widescreen"
             ref="uploader">

            <div class="uploader-content">
                <p v-if="dropZoneError"
                   class="body mb-5 text-error">
                    {{ dropZoneError }}
                </p>

                <a class="choose btn bg-black text-black inverted collapse-250">
                    <i class="fas fa-upload mr-1"></i>
                    Choose a Photo
                </a>

                <a class="drop btn bg-black text-white collapse-250">
                    <i class="fas fa-upload mr-1"></i>
                    Drop to Upload
                </a>

                <p class="tiny font-italic text-dark mt-2">
                    Max file size: 5MB
                </p>
            </div>
        </div>

        <div v-show="hasFileToCrop"
             class="image-cropper bg-white">
            <div class="widescreen overflow">
                <canvas id="imgToCrop"
                        ref="cropper"></canvas>
            </div>

            <div class="cropper-controls pv-1 bg-dark flex flex-row align-center">
                <a class="btn bg-x-dark text-error short mh-1"
                   @click="resetCrop">
                    <i class="far fa-times"></i>
                </a>

                <div class="flex flex-column"></div>

                <a class="btn bg-x-dark text-white short mh-1"
                   @click="zoomOut">
                    <i class="far fa-search-minus"></i>
                </a>

                <a class="btn bg-x-dark text-white short mh-1"
                   @click="zoomIn">
                    <i class="far fa-search-plus"></i>
                </a>

                <a class="btn bg-x-dark text-white short mh-1"
                   @click="rotate">
                    <i class="fas fa-redo-alt"></i>
                </a>

                <div class="flex flex-column"></div>

                <a class="btn bg-x-dark text-success short mh-1"
                   @click="cropImage">
                    <i class="far fa-check"></i>
                </a>
            </div>

            <div class="image-preview bg-white"
                 v-show="croppedImage">
                <div class="widescreen bg-white">
                    <img :src="croppedImage" class="rounded shadow">
                </div>

                <div class="pa-1 flex flex-row bg-white">
                    <a class="btn text-black flat collapse-150 short mr-1"
                       @click="cancelCrop">
                        <i class="fas fa-chevron-left mr-1"></i> Back
                    </a>

                    <div class="flex flex-column"></div>

                    <a class="btn text-white collapse-150 short mr-1"
                       :class="'bg-' + brand"
                       @click="saveImage">
                        Save
                    </a>
                </div>
            </div>
        </div>

        <span class="dz-hidden-input"></span>
    </div>
</template>
<script>
    import Cropper from 'cropperjs';
    import Dropzone from 'dropzone';
    import axios from 'axios';
    import Toasts from '../assets/js/classes/toasts'

    export default {
        name: 'image-cropper',
        data(){
            return {
                fileToCrop: null,
                cropperInstance: null,
                dropZoneInstance: null,
                dropZoneError: null,
                croppedImage: null
            }
        },
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },

            uploadEndpoint: {
                type: String,
                default: () => ''
            },

            cropperConfig: {
                type: Object,
                default: () => {
                    return {
                        viewMode: 1,
                        aspectRatio: 1,
                        dragMode: 'move',
                        autoCrop: true
                    }
                }
            },

            dropzoneConfig: {
                type: Object,
                default: () => {
                    return {
                        url: ' ',
                        dictDefaultMessage: '<i class="fas fa-upload"></i> Choose a photo',
                        dictFileTooBig: 'Maximum file size exceeded.',
                        dictInvalidFileType: 'Invalid File Type.',
                        acceptedFiles: '.jpg,.jpeg,.png,.bmp',
                        maxFilesize: 5,
                        hiddenInputContainer: '.dz-hidden-input',
                        autoProcessQueue: false,
                    }
                }
            }
        },
        computed: {
            hasFileToCrop(){
                return this.fileToCrop !== null;
            }
        },
        watch: {
            fileToCrop(){
                this.cropperInstance.replace(this.fileToCrop);
            }
        },
        methods: {
            resetCrop(){
                this.fileToCrop = null;
                this.dropZoneInstance.removeAllFiles();
            },

            zoomIn(){
                this.cropperInstance.zoom(0.1);
            },

            zoomOut(){
                this.cropperInstance.zoom(-0.1);
            },

            rotate(){
                this.cropperInstance.rotate(90);
            },

            cancelCrop(){
                this.croppedImage = null;
            },

            cropImage(){
                const canvasOutput = this.cropperInstance.getCroppedCanvas({
                    width: 500,
                    height: 500,
                });
                this.croppedImage = canvasOutput.toDataURL();
            },

            saveImage(){
                axios.put(this.uploadEndpoint)
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.error(error);
                        Toasts.errorWarning();
                    })
            }
        },
        created(){
            Dropzone.autoDiscover = false;
        },
        mounted(){
            this.dropZoneInstance = new Dropzone(
                this.$refs.uploader,
                this.dropzoneConfig
            );

            this.dropZoneInstance.on('thumbnail', file => {
                // If the status errors we don't want to trigger the cropper
                if(file.status !== 'error'){
                    this.fileToCrop = file['dataURL'];
                    this.dropZoneError = null;
                }

                // If the Cropper Instance doesn't exist we need to initialize it.
                if(this.cropperInstance === null){
                    this.cropperInstance = new Cropper(
                        this.$refs.cropper,
                        this.cropperConfig
                    );
                }
            });

            this.dropZoneInstance.on('error', (file, errorMessage) => {
                this.dropZoneError = errorMessage;
            });
        },
        beforeDestroy(){

        }
    }
</script>
<style lang="scss">
    @import '~cropperjs/dist/cropper.min.css';
    @import '~dropzone/dist/min/dropzone.min.css';

    .image-processor {
        text-align:center;
    }
    .image-uploader {
        cursor:pointer;
        text-align:center;

        &.dz-drag-hover {
            .choose {
                display:none;
            }
            .drop {
                display:flex;
            }
        }

        .drop {
            display:none;
        }

        * {
            pointer-events:none;
        }

        .dz-preview {
            display:none;
        }

        a {
            margin:0 auto;
        }

        .uploader-content {
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%, -50%);
            width:100%;
        }
    }

    .image-cropper {
        position:relative;

        .cropper-controls {
            a {
                width:35px;
            }
        }

        .image-preview {
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;

            img {
                max-width:250px;
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%, -50%);
            }
        }
    }
</style>