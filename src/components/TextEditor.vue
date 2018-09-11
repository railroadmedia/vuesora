<template>
    <div class="flex flex-column">
        <input type="hidden" :name="fieldKey" v-model="contentInterface">

        <tinymce-editor api-key="g84168rl7b45du7fji2nive374o541mhtmzogyolgqng97xc"
                        :init="initObject"
                        v-model="contentInterface"
                        @input="handleInput"></tinymce-editor>
    </div>
</template>
<script>
    import Editor from '@tinymce/tinymce-vue';

    export default {
        name: 'text-editor',
        props: {
            height: {
                type: Number,
                default: () => 300
            },
            toolbar: {
                type: String,
                default: () => 'bold italic underline | bullist numlist | link image media'
            },
            imageUploadEndpoint: {
                type: String,
                default: () => null
            },
            initialValue: {
                type: String,
                default: () => null
            },
            fieldKey: {
                type: String,
                default: () => 'content'
            }
        },
        data() {
            return {
                currentValue: this.initialValue
            }
        },
        model: {
            prop: 'contentInterface',
            event: 'input'
        },
        computed: {
            contentInterface: {
                get(){
                    return this.currentValue;
                },
                set(val){
                    this.currentValue = val;
                }
            },

            initObject() {
                return {
                    content_id: '#textEditor',
                    height: this.height,
                    autoresize_min_height: this.height,
                    toolbar: this.toolbar,
                    plugins: 'lists link image media autolink autoresize imagetools paste',
                    branding: false,
                    elementpath: false,
                    statusbar: false,
                    menubar: false,
                    resize: false,
                    image_description: false,
                    image_dimensions: false,
                    file_picker_types: 'image',
                    default_link_target: '_blank',
                    target_list: false,
                    link_assume_external_targets: true,
                    link_title: false,
                    media_poster: false,
                    media_dimensions: false,
                    media_alt_source: false,
                    paste_as_text: true,
                    images_upload_url: this.imageUploadEndpoint,
                    content_style: "body { font-family: 'Open Sans', sans-serif; font-size:16px; font-weight:400; } p { margin:0; } blockquote { border:1px solid #d1d1d1; margin:0 0 0 1em; padding:1em; border-radius:5px; } .quote-heading { background:#e3e8e9; padding:8px 15px; margin:-1em -1em 0 -1em; } .quote-heading strong { font-size:13px; } .quote-heading em { font-size:10px; font-style:italic;text-transform:uppercase;color:#a8a8a8; } span.post-id { display:none; }",
                    setup: (editor) => {
                        editor.on('input', () => {
                            editor.save();
                        })
                    }
                }
            }
        },
        methods: {

            handleInput(){
                this.$emit('input', {
                    currentValue: this.currentValue
                })
            },
        },
        components: {
            'tinymce-editor': Editor
        },
        mounted(){

        }
    }
</script>
<style>

</style>